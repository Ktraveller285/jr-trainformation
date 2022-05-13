const fetch = require("node-fetch");

exports.getAreas = async (req, res) => {
  try {
    const response = await fetch(
      `https://www.train-guide.westjr.co.jp/api/v3/${req.params.lineName}_st.json`
    );
    const object = await response.json();
    res.send(object);
  } catch (e) {
    res.sendStatus(400);
  }
};
