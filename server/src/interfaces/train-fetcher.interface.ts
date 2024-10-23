import { NamedTrain } from 'common/interfaces/namedtrain.interface';
import { Station } from 'common/interfaces/station.interface';
import { TrainStatus } from 'common/interfaces/train-status.interface';
import { Type } from 'common/interfaces/type.interface';

export interface TrainFetcher {
  getTrains(lineName: string): Promise<TrainStatus[]>;
  getStations(lineName: string): Promise<Station[]>;
  getTypes(lineName: string): Promise<Type[]>;
  getNamedTrains(lineName: string): Promise<NamedTrain[]>;
}
