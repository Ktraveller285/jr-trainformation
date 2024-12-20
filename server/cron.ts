import fetch from 'node-fetch';
import { createTransport } from 'nodemailer';
const { getFirestore } = require('firebase-admin/firestore');

// .envファイルを読み込む（メールの設定情報等が記載されている）
//
import * as dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/.env` });

import { Notice } from './src/interfaces/notice.interface';
import { TrainStatus } from 'common/interfaces/train-status.interface';
import { JrcTrainFetcher } from './src/train-fetchers/jrc.train-fetcher';
import { JrwTrainFetcher } from './src/train-fetchers/jrw.train-fetcher';
import { JrhTrainFetcher } from './src/train-fetchers/jrh.train-fetcher';

export class Cron {
  static async execute() {
    // データベースと接続
    const db = getFirestore();

    // メールを送信するためのインスタンスを初期化
    let mailTransporter = await Cron.getMailTransporter();

    // 検索する日付を取得
    let findDate = new Date();
    if (0 <= findDate.getHours() && findDate.getHours() <= 1) {
      // 深夜 00:00〜01:59ならば、前日扱いとする
      findDate.setDate(findDate.getDate() - 1);
    }
    let findDateString = Cron.getDateString(findDate);

    // 今日の日付の通知登録を取得
    /*let notices = await NoticeRepository.find({
      where: {
        noticeDate: findDateString,
        notified: false,
      },
    });*/

    // 条件に一致する通知を検索
    const collectionRef = db.collection('notifydata');
    const docSnapshots = await collectionRef
      .where('noticeDate', '==', findDateString)
      .where('notified', '==', false)
      .get();

    // 検索結果を反復して配列に入れていく
    let notices: Notice[] = [];
    docSnapshots.forEach((doc: any) => {
      const id = doc.id;
      const data = doc.data();
      notices.push({
        id: id,
        ...data,
      });
    });

    console.log(
      `[Cron] ${findDateString} の通知 (${notices.length}件) を処理...`,
    );

    // 通知登録配列を反復
    for (let notice of notices) {
      // 当該通知登録の路線の在線情報を取得
      let trains: TrainStatus[] | undefined;
      switch (notice.companyName) {
        case 'jrWest': {
          const fetcher = new JrwTrainFetcher();
          trains = await fetcher.getTrains(notice.lineName);
          break;
        }
        case 'jrCentral': {
          const fetcher = new JrcTrainFetcher();
          trains = await fetcher.getTrains(notice.lineName);
          break;
        }
        case 'jrHokkaido': {
          const fetcher = new JrhTrainFetcher();
          trains = await fetcher.getTrains(notice.lineName);
          break;
        }
        default: {
          console.warn(
            `エラー: companyName が不正です... ${notice.companyName}`,
          );
          break;
        }
      }

      if (trains === undefined) {
        console.warn(`エラー: 在線状況を取得できませんでした`);
        continue;
      }

      // 当該通知登録の列車番号を検索
      let targetTrain = undefined;
      for (let train of trains) {
        if (train.trainNo == notice.trainNumber) {
          targetTrain = train;
        }
      }

      // 設定された運休判断時刻の取得
      let today = new Date();
      let cancelDecisionDate = notice.cancelDecisionTime
        ? new Date(
            `${Cron.getDateString(today)} ${notice.cancelDecisionTime}:00`,
          )
        : null;

      let isSuspended = false;
      let isDeley = false;

      if (
        targetTrain == undefined &&
        cancelDecisionDate &&
        cancelDecisionDate.getTime() < Date.now()
      ) {
        // 列車番号が見つからず、運休判断時刻が登録されており、運休判断時刻が過ぎていれば運休とする
        isSuspended = true;
      } else if (targetTrain && targetTrain.trainDelayMinutes >= 15) {
        // また列車番号が見つかり、15分以上の遅延になっていたら遅延とする
        isDeley = true;
      }

      // 運休 or 遅延ならばメールを送信し、通知済みフラグをtrueにする
      if (isSuspended || isDeley) {
        await this.sendNoticeEmail(
          db,
          notice,
          isSuspended,
          isDeley,
          targetTrain,
        );
      }
    }

    console.log(`[Cron] 完了`);

    // スリープ防止
    await fetch('https://jr-trainformation.onrender.com/');
  }

  /**
   * メールの送信
   * @param db データベース接続
   * @param notice 通知の登録状況
   * @param isSuspended 列車が運休になっているかのフラグ
   * @param isDeley 列車が遅延しているかのフラグ
   * @param train 取得した列車情報
   */
  static async sendNoticeEmail(
    db: any,
    notice: Notice,
    isSuspended: boolean,
    isDeley: boolean,
    train?: TrainStatus,
  ) {
    let sendResult;
    let mailTransporter = Cron.getMailTransporter();

    // メールの送信日時の取得
    const sentDateString = Cron.getDateTimeString(new Date());

    // 送信するメールの定義
    let detailText = '';
    if (train) {
      detailText = `種別:${train.trainDisplayType}
列車名:${train.trainNickname ?? '-'}
行先:${train.trainDest}
遅れ:${train.trainDelayMinutes}分`;
    }
    let mail = {
      from: process.env['EMAIL_FROM'],
      to: notice.noticeEmail,
      subject: `${notice.trainNumber} 運行情報`,
      text: `darinono.info 運行情報通知サービスです。
登録されている以下の列車が${isDeley ? '遅延' : '運休'}している可能性があります。

列車番号:${notice.trainNumber}
${detailText}

※${sentDateString}時点の情報です
※最新の情報は https://jr-trainformation.herokuapp.com/ にてご確認ください
※遅延証明書は https://delay.trafficinfo.westjr.co.jp/ からご利用ください

ご利用ありがとうございます。`,
    };

    // メールの送信処理
    try {
      sendResult = await mailTransporter.sendMail(mail);
      console.log(`[Cron] メールを送信しました ${notice.noticeEmail}`, notice);
    } catch (e: any) {
      console.error('[Cron] メールが送信できませんでした', e);
      return;
    }
    if (sendResult?.rejected && sendResult.rejected.length >= 1) {
      console.error('[Cron] メールが拒否されました', sendResult?.rejected);
      return;
    }

    // 送信済みとしてマークする
    const docRef = db.collection('notifydata').doc(notice.id);
    await docRef.update({
      notified: true,
    });
  }

  /**
   * 日時文字列の取得
   * @param date Date オブジェクト
   * @return 日時文字列 (例: '2022/01/01 00:00')
   */
  static getDateTimeString(date: Date) {
    const hourString = new String(date.getHours()).padStart(2, '0');
    const minuteString = new String(date.getMinutes()).padStart(2, '0');
    return `${Cron.getDateString(date)} ${hourString}:${minuteString}`;
  }

  /**
   * 日付文字列の取得
   * @param date Date オブジェクト
   * @return 日付文字列 (例: '2022/01/01')
   */
  static getDateString(date: Date) {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }

  /**
   * nodemailerのインスタンス生成
   * @returns メールを送信するためのインスタンス
   */
  static getMailTransporter() {
    return createTransport({
      host: process.env['EMAIL_SMTP_HOST'],
      port: parseInt(process.env['EMAIL_SMTP_PORT'] || '587', 10),
      auth: {
        user: process.env['EMAIL_SMTP_USERNAME'],
        pass: process.env['EMAIL_SMTP_PW'],
      },
    });
  }
}

(async () => {
  await Cron.execute();
})();
