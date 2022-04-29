const express = require("express");
const app = express();
const fetch = require("node-fetch");
const path = require("path");

app.listen(process.env.PORT || 8080, () => {
  console.log("Running Server...");
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
