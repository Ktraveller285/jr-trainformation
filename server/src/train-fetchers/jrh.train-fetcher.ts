import { TrainStatus } from 'common/interfaces/train-status.interface';
import { Station } from 'common/interfaces/station.interface';
import { TrainFetcher } from '../interfaces/train-fetcher.interface';

/**
 * JR北の情報を取得するためのクラス
 */
export class JrhTrainFetcher implements TrainFetcher {
  async getTrains(lineName: string): Promise<TrainStatus[]> {
    // 在線状況を取得
    const response = await fetch(
      `https://www3.jrhokkaido.co.jp/trainlocation/json/location/now/location_${lineName}_now.json`,
    );

    // 在線状況をパースして独自フォーマットに変換
    const trains = this.parseTrainStatuses(await response.json());

    // 走行位置の定義を取得
    const trainPositionMappings = await this.getTrainPositionMappings();

    // 各列車の走行位置を挿入
    for (const train of trains) {
      if (train.trainPos && trainPositionMappings[train.trainPos]) {
        train.trainPos = trainPositionMappings[train.trainPos];
      }
    }

    // 駅リストを取得
    const stations = await this.getStations(lineName);

    // 各列車の行先を挿入
    for (const train of trains) {
      if (!train.trainDest) {
        // 行先がない場合はスキップ
        continue;
      }

      const destStation = stations.find(
        (station) => station.code === train.trainDest,
      );
      if (destStation) {
        train.trainDest = destStation.name;
      }
    }

    // 優等列車の定義を取得
    const namedTrainMappings = await this.getNamedTrainMappings();
    const namedTrains: { [key: string]: string } = {};
    for (const expressObj of namedTrainMappings) {
      for (const expressTrainObj of expressObj.trains) {
        // 列車名を取得
        let expressName = expressTrainObj.name.ja;
        // "とかち10号　札幌行き" のような文字列から "札幌行き" を削除
        expressName = expressName.replace(/　.*行き$/, '');
        // 連想配列に列車番号と名前のセットを代入
        namedTrains[expressTrainObj.cbango] = expressName;
      }
    }

    // 優等列車の定義をマッピング
    for (const train of trains) {
      if (namedTrains[train.trainNo]) {
        train.trainNickname = namedTrains[train.trainNo];
      }
    }

    // 在線状況を返す
    return trains;
  }

  /*
   * 駅リストの取得
   * @param lineName 路線名
   */
  async getStations(lineName?: string): Promise<Station[]> {
    // 駅リストを取得
    const response = await fetch(
      `https://www3.jrhokkaido.co.jp/webunkou/json/master/eki_master.json`,
    );
    let parsedJson = await response.json();

    // 駅リストをパースして独自フォーマットに変換
    const stations = this.parseStations(parsedJson);

    // TODO: 駅リストを路線名でフィルタリング

    // 駅リストを返す
    return stations;
  }

  /*
   * 走行位置の定義の取得
   */
  async getTrainPositionMappings(): Promise<{ [key: string]: string }> {
    const response = await fetch(
      `https://www3.jrhokkaido.co.jp/webunkou/json/master/pos_name_master.json`,
    );
    return await response.json();
  }

  /**
   * 優等列車の取得
   */
  async getNamedTrainMappings(): Promise<JrhOriginalNamedTrains[]> {
    const response = await fetch(
      `https://www3.jrhokkaido.co.jp/trainlocation/json/express/core/express_core.json`,
    );
    return (await response.json()).expresses;
  }

  parseTrainStatuses(parsedJson: any) {
    const results: TrainStatus[] = [];

    for (const srcTrain of parsedJson.trains as JrhOriginalTrainStatus[]) {
      // 列車の種別と色を決定
      let trainType: number = +srcTrain.type;
      let trainColorCode: string | undefined = undefined;
      let trainDisplayType: string | undefined = undefined;
      let trainNotices: string[] = [];

      switch (trainType) {
        case 0:
          trainDisplayType = '特別快速';
          trainColorCode = 'red';
          trainNotices.push('札幌～手稲・小樽間普通');
          break;
        case 1:
          trainDisplayType = '特急';
          trainColorCode = 'red';
          break;
        case 2:
          trainDisplayType = '快速';
          trainColorCode = 'orange';
          break;
        case 3:
          trainDisplayType = '普通';
          break;
        case 4:
          trainDisplayType = '北海道新幹線';
          break;
        case 5:
          trainDisplayType = '特別快速';
          trainColorCode = 'red';
          break;
        case 6:
          trainDisplayType = '快速（ホームライナー）';
          trainColorCode = 'orange';
          break;
        case 7:
          trainDisplayType = '臨時';
          break;
        case 8:
          trainDisplayType = '快速';
          trainColorCode = 'orange';
          trainNotices.push('札幌～手稲・小樽間普通');
          break;
        case 9:
          trainDisplayType = '区間快速';
          trainColorCode = '#2ecc71';
          break;
      }

      // 独自フォーマットを生成
      const train: TrainStatus = {
        // 列車番号
        trainNo: srcTrain.cbango,
        // 表示上の種別
        trainDisplayType: trainDisplayType,
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
        trainNotices: trainNotices,
      };
      results.push(train);
    }

    return results;
  }

  parseStations(parsedJson: any): Station[] {
    const stations: Station[] = [];

    for (const srcStation of parsedJson as JrhOriginalStation[]) {
      const station: Station = {
        // 駅名
        name: srcStation.ja,
        // 番号
        code: srcStation.key,
      };

      stations.push(station);
    }

    return stations;
  }
}

/**
 * JR北の在線状況フォーマット
 * https://www3.jrhokkaido.co.jp/trainlocation/json/location/now/location_01_now.json
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
 * JR北の優等列車フォーマット
 * https://www3.jrhokkaido.co.jp/trainlocation/json/express/core/express_core.json
 */
interface JrhOriginalNamedTrains {
  key: number;
  trains: {
    cbango: string;
    type: string;
    name: {
      ja: string;
      en: string;
      tc: string;
      sc: string;
      kr: string;
    };
  }[];
}
