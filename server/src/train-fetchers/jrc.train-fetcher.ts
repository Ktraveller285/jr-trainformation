import { TrainStatus } from 'common/interfaces/train-status.interface';
import { Station } from 'common/interfaces/station.interface';
import { TrainFetcher } from '../interfaces/train-fetcher.interface';

/**
 * JR東海の情報を取得するためのクラス
 */
export class JrcTrainFetcher implements TrainFetcher {
  async getTrains(lineName: string): Promise<TrainStatus[]> {
    // 在線状況を取得
    const response = await fetch(
      `https://traininfo.jr-central.co.jp/zairaisen/data/hp_zaisenichijoho_${lineName}_ja.json`,
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
      `https://traininfo.jr-central.co.jp/zairaisen/data/hp_eki_master_ja.json`,
    );
    let parsedJson = await response.json();

    // 当該路線の駅のみに絞り込み
    parsedJson.lst = parsedJson.lst.filter((station: JrcOriginalStation) => {
      if (station.ryokakuSenkuCd === lineName) {
        return true;
      }
      return false;
    });

    // 駅リストをパースして独自フォーマットに変換
    const stations = this.parseStations(parsedJson);

    // 駅リストを返す
    return stations;
  }

  parseTrainStatuses(parsedJson: any) {
    const results: TrainStatus[] = [];

    for (const srcTrain of parsedJson.lst as JrcOriginalTrainStatus[]) {
      // 列車の種別と色を決定
      let trainDisplayType: string = srcTrain.resshaShubetsuMei;
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
        trainNo: srcTrain.resshaBng,
        // 表示上の種別
        trainDisplayType: trainDisplayType,
        // 愛称
        trainNickname: srcTrain.aishoMei ?? undefined,
        // 色
        trainColorCode: trainColorCode,
        // 行先
        trainDest: srcTrain.yukisaki,
        // 経由
        trainVia: undefined,
        // 両数
        trainCars: undefined,
        // 走行位置
        trainPos: srcTrain.ryokakuEkiCd,
        // 上下
        trainDirectionUp: srcTrain.jogeKbn == 1,
        // 遅れ時分
        trainDelayMinutes: srcTrain.chienJifun,
        // 備考
        trainNotices: [],
      };
      results.push(train);
    }

    return results;
  }

  parseStations(parsedJson: any): Station[] {
    const stations: Station[] = [];

    for (const srcStation of parsedJson.lst as JrcOriginalStation[]) {
      const station: Station = {
        // 駅名
        name: srcStation.ekiMei,
        // 番号
        code: srcStation.ryokakuEkiCd,
      };

      stations.push(station);
    }

    return stations;
  }
}

/**
 * JR東海の在線状況フォーマット
 */
interface JrcOriginalTrainStatus {
  // 列車番号 (例: "5032M")
  resshaBng: string;
  // 種別 (例: ？？？)
  resshaShubetsuId: string;
  // 表示上の種別 (例: "寝台特急")
  resshaShubetsuMei: string;
  // アイコン (例: "0")
  iconKbn: string;
  // 愛称 (例: "サンライズ瀬戸・出雲")
  aishoMei: string | null;
  // 行先 (例: "東京")
  yukisaki: string;
  // 遅延時分 (例: 60)
  chienJifun: number;
  chienJifunFuka: string;
  // 上下 (例: 1 = 上り, 2 = 下り)
  jogeKbn: number;
  // ？？？
  ekiEkikanKbn: number;
  // 列車位置 (例: "110")
  ryokakuEkiCd: string;
}

/**
 * JR東海の駅情報フォーマット
 */
interface JrcOriginalStation {
  // 駅番号
  ryokakuEkiCd: string;
  // 路線ID
  ryokakuSenkuCd: string;
  ryokakuSenkuKbn: string;
  // 路線名
  ryokakuSenkuMei: string;
  // ？？？
  ryokakuSenkuHyojiJun: string;
  kudariJun: string;
  // 駅名
  ekiMei: string;
  // 駅名よみがな
  ekiMeiYomigana: string;
  ekiMeiRomaji: string;
  ekiMeiRomajiKensakuyo: string;
  // ？？？
  ekiMeiKaigyoIchi: string;
  // 緯度経度
  ido: string;
  keido: string;
  // 時刻表ページのURL
  jikokuhyoUrl: string;
  // 接続路線
  hpyoTasenkuList?: {
    ryokakuSenkuCd: string;
    ryokakuSenkuUrl: string;
    tokaidoShinkansenUrlKoshikihpMuke: string;
    tokaidoShinkansenUrlShanaiMuke: string;
    tashaSenkuUrl: string;
    ryokakuSetsuzokusakiSenkuMei: string;
    ryokakuSetsuzokusakiSenkuKaishiShuryoEki: string;
    ryokakuSetsuzokusakiSenkuKbn: string;
    norikaeSenkuLogoKbn: string;
    norikaeSenkuLogoGazo: string;
  };
  // ？？？
  kyokaiEkiShuchakuEkiKbn?: string;
  kyokaiEkiShuchakuJogeKbn?: string;
  tashaAreaMei?: string;
  // 駅番号
  ekiNumberSujibu?: string;
  // ？？？
  sokoRyokakuSenkuCd?: string;
}
