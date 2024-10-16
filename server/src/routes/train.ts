import { Router } from 'express';
import { Station } from '../interfaces/station.interface';
import { JrwTrainFetcher } from '../train-fetchers/jrw.train-fetcher';
import { JrcTrainFetcher } from '../train-fetchers/jrc.train-fetcher';

const trainRouter = Router();

/**
 * GET /api/train/:companyName/lines/:lineName
 * 路線を取得するAPI
 */
trainRouter.get('/:companyName/lines/:lineName', async (req, res) => {
  switch (req.params.companyName) {
    case 'jrWest': {
      const fetcher = new JrwTrainFetcher();
      const trains = await fetcher.getTrains(req.params.lineName);
      res.json(trains);
      break;
    }
    case 'jrCentral': {
      const fetcher = new JrcTrainFetcher();
      const trains = await fetcher.getTrains(req.params.lineName);
      res.json(trains);
      break;
    }
    default: {
      res.status(404).send('エラー: companyName が不正です');
    }
  }
});

/**
 * GET /api/train/:companyName/stations/:lineName
 * 駅を取得するAPI
 */
trainRouter.get('/:companyName/stations/:lineName', async (req, res) => {
  if (req.params.companyName === 'jrWest') {
    try {
      const response = await fetch(
        `https://www.train-guide.westjr.co.jp/api/v3/${req.params.lineName}_st.json`,
      );
      const object = await response.json();
      res.send(object);
    } catch (e) {
      res.sendStatus(400);
    }
  } else if (req.params.companyName === 'jrCentral') {
    try {
      const response = await fetch(
        `https://traininfo.jr-central.co.jp/zairaisen/data/hp_eki_master_ja.json`,
      );
      const object = await response.json();

      let stations: Station[] = [];
      for (let jrCentralStation of object.lst) {
        let station: Station = {
          info: {
            name: jrCentralStation['ekiMei'],
            code: jrCentralStation['ryokakuEkiCd'],
            // 乗り換え情報は今後対応
            transfer: [],
            // 西日本のみなので空欄とする
            stopTrains: [],
          },
        };
        stations.push(station);
      }
      res.send({
        stations: stations,
      });
    } catch (e) {
      res.sendStatus(400);
    }
    // res.send(400);
  }
});

export default trainRouter;
