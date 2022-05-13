const express = require("express");
const app = express();
const fetch = require("node-fetch");
const path = require("path");
require("dotenv").config({ path: `${__dirname}/.env` });

// データベース接続を初期化
const { sequelize } = require("./src/database");

app.use(express.static(path.join(__dirname, "../dist/jr-trainformation/")));

app.get("/api/lines/:lineName", async (req, res) => {
  try {
    const response = await fetch(
      `https://www.train-guide.westjr.co.jp/api/v3/${req.params.lineName}.json`
    );
    const object = await response.json();
    res.send(object);
  } catch (e) {
    res.sendStatus(400);
  }
});

app.get("/api/stations/:lineName", async (req, res) => {
  try {
    const response = await fetch(
      `https://www.train-guide.westjr.co.jp/api/v3/${req.params.lineName}_st.json`
    );
    const object = await response.json();
    res.send(object);
  } catch (e) {
    res.sendStatus(400);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/jr-trainformation/index.html"));
});

// 非同期処理を実行
(async () => {
  // データベースの接続完了まで待機
  await sequelize.authenticate();

  // テーブルを生成
  await sequelize.sync({
    alter: true,
  });

  // サーバを開始
  const server = app.listen(process.env.PORT || 8080, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log("server listening on port %s:%s", host, port);
  });
})();
