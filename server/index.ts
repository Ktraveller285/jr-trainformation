import * as path from 'path';
import { AddressInfo } from 'net';

// .envファイルを読み込む（データベースの接続情報等が記載されている）
import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/.env` });

// サーバを初期化
import * as express from 'express';
const app = express();
app.use(express.json());

// データベース接続を初期化
import { AppDataSource } from './src/database';

// Angularアプリケーションを静的ファイルとしてServe
app.use(express.static(path.join(__dirname, '../dist/jr-trainformation/')));

// ルートを定義
import trainRouter from './src/routes/train';
app.use('/api/train/', trainRouter);

import noticeRouter from './src/routes/notice';
import { Cron } from './cron';
app.use('/api/notice/', noticeRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/jr-trainformation/index.html'));
});

// 非同期処理を実行
(async () => {
  // データベースの接続完了まで待機
  await AppDataSource.initialize();

  // サーバを開始
  const server = app.listen(process.env['PORT'] || 8080, () => {
    const address = server.address() as AddressInfo;
    const host = address.address;
    const port = address.port;
    console.log('server listening on port %s:%s', host, port);
  });
})();

var node_cron = require('node-cron');

node_cron.schedule('* */10 * * *', () => {
  //console.log('running a task every 10 minutes');
  (async () => {
    await Cron.execute();
  })();
});
