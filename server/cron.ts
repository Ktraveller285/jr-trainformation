// .envファイルを読み込む（データベースの接続情報等が記載されている）
import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/.env` });

// データベース接続を初期化
import { AppDataSource, NoticeRepository } from './src/database';

class Cron {
  static async execute() {
    // データベースの接続完了まで待機
    await AppDataSource.initialize();
    let today = new Date();

    // 今日の日付の通知登録を取得
    let notices = await NoticeRepository.find({
      where: {
        noticeDate: `${today.getFullYear()}/${
          today.getMonth() + 1
        }/${today.getDate()}`,
        notified: false,
      },
    });
    // 通知登録配列を反復
    for (let notice of notices) {
      // 当該通知登録の路線の在線情報を取得
      // 当該通知登録の列車番号を検索
      // 列車番号が見つからず、運休判断時刻が登録されており、運休判断時刻が過ぎていれば運休とする
      // また列車番号が見つかり、規定以上の遅延になっていたら遅延とする
      // 運休 or 遅延ならばメールを送信し、通知済みフラグをtrueにする
    }
    console.log(notices);
    //console.log('Connection succeed.');
  }
}

(async () => {
  await Cron.execute();
})();
