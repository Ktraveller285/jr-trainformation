import { TrainStatus } from 'common/interfaces/train-status.interface';

export interface TrainFetcher {
  getTrains(lineName: string): Promise<TrainStatus[]>;
}
