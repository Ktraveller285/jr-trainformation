const express = require("express");
const app = express();
const fetch = require("node-fetch");
const path = require("path");

app.listen(8080, () => {
  console.log("Running at Port 8080...");
});

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
