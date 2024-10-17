import { TrainStatus } from 'common/interfaces/train-status.interface';
import { Station } from 'common/interfaces/station.interface';
import { TrainFetcher } from '../interfaces/train-fetcher.interface';
import { Type } from 'common/interfaces/type.interface';

/**
 * JR北の情報を取得するためのクラス
 */
export class JrhTrainFetcher implements TrainFetcher {
  async getTrains(lineName: string): Promise<TrainStatus[]> {
    // 在線状況を取得
    const response = await fetch(
      `https://www3.jrhokkaido.co.jp/trainlocation/location.html#rosen=${lineName}`,
    );

    // 在線状況をパースして独自フォーマットに変換
    const trains = this.parseTrainStatuses(await response.json());

    // 各列車の駅情報を挿入
    const stations = await this.getStations(lineName);
    for (const train of trains) {
      // 列車の位置を取得
      let positionText = '';
      if (train.trainPos) {
        // 当該の駅を駅リストから検索
        const currentStation = stations.find((station) => {
          return station.code == train.trainPos;
        });

        // 列車の位置へ駅名を代入
        if (!currentStation) {
          positionText = `-`;
        } else {
          positionText = `${currentStation.name} 付近`;
        }
      }
      train.trainPos = positionText;
    }

    // 在線状況を返す
    return trains;
  }

  /*
   * 駅リストの取得
   * @param lineName 路線名
   */
  async getStations(lineName: string): Promise<Station[]> {
    // 駅リストを取得
    const response = await fetch(
      `https://www3.jrhokkaido.co.jp/webunkou/json/master/eki_master.json`,
    );
    let parsedJson = await response.json();

    // 駅リストをパースして独自フォーマットに変換
    const stations = this.parseStations(parsedJson);

    // 駅リストを返す
    return stations;
  }

  /*
   * 種別リストの取得
   * @param lineName 路線名
   */
  async getTypes(lineName: string): Promise<Type[]> {
    // 駅リストを取得
    const response = await fetch(
      `https://www3.jrhokkaido.co.jp/webunkou/json/master/ressha_type_master.json`,
    );
    let parsedJson = await response.json();

    // 駅リストをパースして独自フォーマットに変換
    const types = this.parseTypes(parsedJson);

    // 駅リストを返す
    return types;
  }

  parseTrainStatuses(parsedJson: any) {
    const results: TrainStatus[] = [];

    for (const srcTrain of parsedJson.lst as JrhOriginalTrainStatus[]) {
      // 列車の種別と色を決定
      let trainType: number = srcTrain.type;
      let trainColorCode: string | undefined = undefined;
      if (srcTrain.resshaShubetsuMei == '特急') {
        trainColorCode = 'red';
      } else if (
        srcTrain.resshaShubetsuMei == '新快速' ||
        srcTrain.resshaShubetsuMei == '特別快速'
      ) {
        trainColorCode = 'blue';
      } else if (
        srcTrain.resshaShubetsuMei == '快速' ||
        srcTrain.resshaShubetsuMei.match('ホームライナー')
      ) {
        trainColorCode = '#f39c12';
        trainDisplayType = '快速';
      } else if (srcTrain.resshaShubetsuMei == '区間快速') {
        trainColorCode = '#2ecc71';
      }

      // 独自フォーマットを生成
      const train: TrainStatus = {
        // 列車番号
        trainNo: srcTrain.cbango,
        // 表示上の種別
        trainDisplayType: undefined,
        // 愛称
        trainNickname: undefined,
        // 色
        trainColorCode: trainColorCode,
        // 行先
        trainDest: srcTrain.shuEkiKey,
        // 経由
        trainVia: undefined,
        // 両数
        trainCars: srcTrain.ryosu,
        // 走行位置
        trainPos: srcTrain.pos,
        // 上下
        trainDirectionUp: undefined,
        // 遅れ時分
        trainDelayMinutes: srcTrain.chien,
        // 備考
        trainNotices: [],
      };
      results.push(train);
    }

    return results;
  }

  parseStations(parsedJson: any): Station[] {
    const stations: Station[] = [];

    for (const srcStation of parsedJson.lst as JrhOriginalStation[]) {
      const station: Station = {
        // 駅名
        name: srcStation.ja,
        // 番号
        code: srcStation.no,
      };

      stations.push(station);
    }

    return stations;
  }

  parseTypes(parsedJson: any): Type[] {
    const types: Type[] = [];

    for (const srcType of parsedJson.types as JrhOriginalType[]) {
      const type: Type = {
        // 種別番号
        typeNo: srcType.type,
        // 種別テキスト
        typeText: srcType.labelText,
      };

      types.push(type);
    }

    return types;
  }
}

/**
 * JR北の在線状況フォーマット
 */
interface JrhOriginalTrainStatus {
  // 列車番号 (例: "5032M")
  cbango: string;
  // 種別 (例: 1)
  type: number;
  // 終着駅頭文字 (例: "小")
  shuEkiSimple: string;
  // 線区 (例: "06")
  senku: string;
  // 走行状況 (例: 1)
  runStatus: number;
  // ？？？
  yokuStatus: number;
  yokuDetail: {
    ja: string;
    en: string;
    tc: string;
    sc: string;
    ke: string;
  };
  status: number;
  statusDetail: string;
  statusDetailEn: string;
  statusDetailSc: string;
  statusDetailTc: string;
  statusDetailKr: string;
  // 遅延時分 (例: 60)
  chien: number;
  // 列車位置 (例: "R0P14D")
  pos: string;
  // 終着駅コード (例: "076")
  shuEkiKey: string;
  // 両数 (例: 6)
  ryosu: number;
  // 臨時列車フラグ (例: 0)
  rinji: number;
}

/**
 * JR北の駅情報フォーマット
 */
interface JrhOriginalStation {
  // 駅コード
  key: string;
  // 駅名
  ja: string;
  en: string;
  tc: string;
  sc: string;
  kr: string;
  // 駅名よみがな
  hira: string;
  kata: string;
  // 路線記号
  kigo: string;
  // 駅番号
  no: string;
  // 路線ID
  tid: number;
  srcF: number;
}

/**
 * JR北の種別フォーマット
 */
interface JrhOriginalType {
  type: number;
  typeText: {
    ja: string;
    en: string;
    tc: string;
    sc: string;
    kr: string;
  };
  typeSimple: {
    ja: string;
    en: string;
    tc: string;
    sc: string;
    kr: string;
  };
  labelText: {
    ja: string;
  };
  labelColor: number;
}
