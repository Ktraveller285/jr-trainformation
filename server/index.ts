import * as path from 'path';
import { AddressInfo } from 'net';
import admin from 'firebase-admin';
var node_cron = require('node-cron');

// .envファイルを読み込む（データベースの接続情報等が記載されている）
import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/.env` });

// サーバを初期化
import express from 'express';
const app = express();
app.use(express.json());

// Angularアプリケーションを静的ファイルとしてServe
app.use(
  express.static(path.join(__dirname, '../dist/jr-trainformation/browser/')),
);

// ルートを定義
import trainRouter from './src/routes/train';
app.use('/api/train/', trainRouter);

import noticeRouter from './src/routes/notice';
app.use('/api/notice/', noticeRouter);

app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../dist/jr-trainformation/browser/index.html'),
  );
});

// Firebase Admin SDK を初期化
admin.initializeApp({
  projectId: process.env['GOOGLE_PROJECT_ID'],
  credential: admin.credential.cert({
    projectId: process.env['GOOGLE_PROJECT_ID'],
    clientEmail: process.env['GOOGLE_CLIENT_EMAIL'],
    privateKey: process.env['GOOGLE_PRIVATE_KEY']!.replace(/\\n/g, '\n'),
  }),
});

// Cron 処理を定義したファイルをインポート
import { Cron } from './cron';

// 非同期処理を実行
(async () => {
  // サーバを開始
  const server = app.listen(process.env['PORT'] || 8080, () => {
    const address = server.address() as AddressInfo;
    const host = address.address;
    const port = address.port;
    console.log('server listening on port %s:%s', host, port);

    // 定期処理を設定 (10分ごと)
    node_cron.schedule('* * */10 * * *', () => {
      //console.log('running a task every 10 minutes');
      (async () => {
        await Cron.execute();
      })();
    });
  });
})();
