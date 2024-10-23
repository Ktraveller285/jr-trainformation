import { Station } from 'common/interfaces/station.interface';
import { TrainStatus } from 'common/interfaces/train-status.interface';

export interface TrainFetcher {
  getTrains(lineName: string): Promise<TrainStatus[]>;
  getStations(lineName: string): Promise<Station[]>;
}
