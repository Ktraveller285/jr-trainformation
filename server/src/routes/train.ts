import { Router } from 'express';
import fetch from 'node-fetch';

const trainRouter = Router();

/**
 * GET /api/train/lines/:lineName
 * 路線を取得するAPI
 */
trainRouter.get('/lines/:lineName', async (req, res) => {
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

/**
 * GET /api/train/stations/:lineName
 * 駅を取得するAPI
 */
trainRouter.get('/stations/:lineName', async (req, res) => {
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

export default trainRouter;
