import { Router } from 'express';
import { JrwTrainFetcher } from '../train-fetchers/jrw.train-fetcher';
import { JrcTrainFetcher } from '../train-fetchers/jrc.train-fetcher';
import { JrhTrainFetcher } from '../train-fetchers/jrh.train-fetcher';

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
    case 'jrHokkaido': {
      const fetcher = new JrhTrainFetcher();
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
  switch (req.params.companyName) {
    case 'jrWest': {
      const fetcher = new JrwTrainFetcher();
      const stations = await fetcher.getStations(req.params.lineName);
      res.json(stations);
      break;
    }
    case 'jrCentral': {
      const fetcher = new JrcTrainFetcher();
      const stations = await fetcher.getStations(req.params.lineName);
      res.json(stations);
      break;
    }
    case 'jrHokkaido': {
      const fetcher = new JrhTrainFetcher();
      const stations = await fetcher.getStations(req.params.lineName);
      res.json(stations);
      break;
    }
    default: {
      res.status(404).send('エラー: companyName が不正です');
    }
  }
});

/**
 * GET /api/train/:companyName/types/:lineName
 * 種別を取得するAPI
 */
trainRouter.get('/:companyName/types/:lineName', async (req, res) => {
  switch (req.params.companyName) {
    case 'jrWest': {
      break;
    }
    case 'jrCentral': {
      break;
    }
    case 'jrHokkaido': {
      const fetcher = new JrhTrainFetcher();
      const types = await fetcher.getTypes(req.params.lineName);
      res.json(types);
      break;
    }
    default: {
      res.status(404).send('エラー: companyName が不正です');
    }
  }
});

export default trainRouter;
