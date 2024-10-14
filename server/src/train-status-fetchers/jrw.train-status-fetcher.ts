import { TrainStatus } from "../interfaces/train-status.interface";

export class JrwTrainStatusFetcher {

  parse(parsedJson: any) {

    const results: TrainStatus[] = [];

    for (const srcTrain of parsedJson.trains) {
      const train: TrainStatus =  {
        trainNo: srcTrain.no,
        trainDelayMinutes: 0,
        trainDest: '',
        trainDirection: false,
        trainDisplayType: '',
      };
      results.push(train);

    }

    return results;
  }

}
