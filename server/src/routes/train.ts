import { Router } from 'express';
import fetch from 'node-fetch';
import { Train } from '../interfaces/train.interface';

const trainRouter = Router();

/**
 * GET /api/train/:company/lines/:lineName
 * 路線を取得するAPI
 */
trainRouter.get('/:company/lines/:lineName', async (req, res) => {
  if (req.params.company === 'jrWest') {
    try {
      const response = await fetch(
        `https://www.train-guide.westjr.co.jp/api/v3/${req.params.lineName}.json`
      );
      const object = await response.json();
      res.send(object);
    } catch (e) {
      res.sendStatus(400);
    }
  } else if (req.params.company === 'jrCentral') {
    try {
      const response = await fetch(
        `https://traininfo.jr-central.co.jp/zairaisen/data/hp_zaisenichijoho_${req.params.lineName}_ja.json`
      );
      const object = await response.json();

      let trains: Train[] = [];
      for (let jrCentralTrain of object.lst) {
        let train: Train = {
          no: jrCentralTrain['resshaBng'],
          displayType: jrCentralTrain['resshaShubetsuMei'],
          nickname: jrCentralTrain['aishoMei'],
          dest: jrCentralTrain['yukisaki'],
          direction: jrCentralTrain['jogeKbn'] === 2 ? 1 : 0,
          pos: jrCentralTrain['ryokakuEkiCd'],
          delayMinutes: jrCentralTrain['chienJifun'],
        };
        trains.push(train);
      }

      res.send({
        trains: trains,
      });
    } catch (e) {
      res.sendStatus(400);
    }
  }
});

/**
 * GET /api/train/:company/stations/:lineName
 * 駅を取得するAPI
 */
trainRouter.get('/:company/stations/:lineName', async (req, res) => {
  if (req.params.company === 'jrWest') {
    try {
      const response = await fetch(
        `https://www.train-guide.westjr.co.jp/api/v3/${req.params.lineName}_st.json`
      );
      const object = await response.json();
      res.send(object);
    } catch (e) {
      res.sendStatus(400);
    }
  } else if (req.params.company === 'jrCentral') {
    res.send(400);
  }
});

export default trainRouter;
