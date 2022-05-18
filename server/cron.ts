import fetch from 'node-fetch';
import { createTransport } from 'nodemailer';
// .envファイルを読み込む（データベースの接続情報等が記載されている）
import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/.env` });

// データベース接続を初期化
import { AppDataSource, NoticeRepository } from './src/database';
import { Notice } from './src/entities/notice.entity';

class Cron {
  static async execute() {
    // データベースの接続完了まで待機
    await AppDataSource.initialize();
    // メールを送信するためのインスタンスを初期化
    let mailTransporter = await Cron.getMailTransporter();

    // 今日の日付を取得
    let today = new Date();
    let todayString = `${today.getFullYear()}/${
      today.getMonth() + 1
    }/${today.getDate()}`;

    // 今日の日付の通知登録を取得
    let notices = await NoticeRepository.find({
      where: {
        noticeDate: todayString,
        notified: false,
      },
    });

    // 通知登録配列を反復
    for (let notice of notices) {
      // 当該通知登録の路線の在線情報を取得
      let trains = await Cron.getTrains(notice.lineName);
      // 当該通知登録の列車番号を検索
      let targetTrain = undefined;
      for (let train of trains) {
        if (train.no == notice.trainNumber) {
          targetTrain = train;
        }
      }

      // 設定された運休判断時刻の取得
      let cancelDecisionDate = notice.cancelDecisionTime
        ? new Date(todayString + ' ' + notice.cancelDecisionTime)
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
      } else if (targetTrain && targetTrain.delayMinutes >= 1) {
        // また列車番号が見つかり、規定以上の遅延になっていたら遅延とする
        isDeley = true;
      }

      // 運休 or 遅延ならばメールを送信し、通知済みフラグをtrueにする
      if (isSuspended || isDeley) {
        await this.sendNoticeEmail(notice, isSuspended, isDeley, targetTrain);
      }
    }
  }

  /**
   * メールの送信
   * @param notice 通知の登録状況
   * @param isSuspended 列車が運休になっているかのフラグ
   * @param isDeley 列車が遅延しているかのフラグ
   * @param train 取得した列車情報
   */
  static async sendNoticeEmail(
    notice: Notice,
    isSuspended: boolean,
    isDeley: boolean,
    train?: Train
  ) {
    let sendResult;
    let mailTransporter = Cron.getMailTransporter();

    // メールの送信日時の取得
    let sentDate = new Date();
    if (Intl.DateTimeFormat().resolvedOptions().timeZone != 'Asia/Tokyo') {
      sentDate.setTime(sentDate.getTime() - 1000 * 60 * 60 * 9);
    }
    let sentDateString = `${sentDate.getFullYear()}/${
      sentDate.getMonth() + 1
    }/${sentDate.getDate()} ${new String(sentDate.getHours()).padStart(
      2,
      '0'
    )}:${new String(sentDate.getMinutes()).padStart(2, '0')}`;

    // 送信するメールの定義
    let detailText = '';
    if (train) {
      detailText = `種別:${train.displayType}
列車名:${train.nickname}
行先:${train.dest}
遅れ:${train.delayMinutes}分`;
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

https://jr-trainformation.herokuapp.com/ にて状況をご確認ください。
ご利用ありがとうございます。`,
    };

    // メールの送信処理
    try {
      sendResult = await mailTransporter.sendMail(mail);
      console.log(`メールを送信しました ${notice.noticeEmail}`, notice);
    } catch (e: any) {
      console.error('メールが送信できませんでした', e);
      return;
    }
    if (sendResult?.rejected && sendResult.rejected.length >= 1) {
      console.error('メールが拒否されました', sendResult?.rejected);
    }

    // 送信済みとしてマークする
    notice.notified = true;
    await notice.save();
  }

  /**
   * メール送信に必要な列車情報の取得
   * @param lineName 路線名
   * @returns 列車情報の配列
   */
  static async getTrains(lineName: string): Promise<any[]> {
    const response = await fetch(
      `https://www.train-guide.westjr.co.jp/api/v3/${lineName}.json`
    );
    const object = await response.json();
    return object.trains;
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
