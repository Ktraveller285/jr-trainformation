import * as express from 'express';
import * as fetch from 'node-fetch';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { AddressInfo } from 'net';
dotenv.config({ path: `${__dirname}/.env` });
const app = express();

// データベース接続を初期化
import { AppDataSource } from './src/database';

app.use(express.static(path.join(__dirname, '../dist/jr-trainformation/')));

// ルートを定義
import trainRouter from './src/routes/train';
app.use('/api/train/', trainRouter);

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
