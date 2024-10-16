import { TrainStatus } from 'common/interfaces/train-status.interface';
import { Station } from './station.interface';

export interface TrainFetcher {
  getTrains(lineName: string): Promise<TrainStatus[]>;
  getStations(lineName: string): Promise<Station[]>;
}
