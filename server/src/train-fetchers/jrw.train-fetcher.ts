import { TrainStatus } from 'common/interfaces/train-status.interface';
import { Station } from 'common/interfaces/station.interface';
import { TrainFetcher } from '../interfaces/train-fetcher.interface';

/**
 * JR西の情報を取得するためのクラス
 */
export class JrwTrainFetcher implements TrainFetcher {
  /*
   * 在線状況の取得
   * @param lineName 路線名
   */
  async getTrains(lineName: string): Promise<TrainStatus[]> {
    // 在線状況を取得
    const lineRequest = await fetch(
      `https://www.train-guide.westjr.co.jp/api/v3/${lineName}.json`,
    );

    // 在線状況をパースして独自フォーマットに変換
    const trains = this.parseTrainStatuses(await lineRequest.json());

    // 各列車の駅情報を挿入
    const stations = await this.getStations(lineName);
    for (const train of trains) {
      // 列車の位置を取得
      let positionText = '';
      if (train.trainPos) {
        if (train.trainPos.match(/(\d+)_(\d+)/)) {
          // '2510_2511' のような文字列から 2510 (駅番号？)と2511 を取り出す
          const currentStationCodeA = RegExp.$1;
          const currentStationCodeB = RegExp.$2;

          // 当該の駅を駅リストから検索
          const currentStationA = stations.find((station) => {
            return station.code == currentStationCodeA;
          });
          const currentStationB = stations.find((station) => {
            return station.code == currentStationCodeB;
          });

          // 列車の位置へ駅名を代入
          if (!currentStationA && train.trainDirectionUp == true) {
            positionText = `${currentStationB!.name} → 他路線`;
          } else if (!currentStationA && train.trainDirectionUp == false) {
            positionText = `他路線 → ${currentStationB!.name}`;
          } else if (!currentStationB && train.trainDirectionUp == true) {
            positionText = `他路線 → ${currentStationA!.name}`;
          } else if (!currentStationB && train.trainDirectionUp == false) {
            positionText = `${currentStationA!.name} → 他路線`;
          } else if (
            currentStationA &&
            currentStationB &&
            train.trainDirectionUp == false
          ) {
            positionText = `${currentStationA.name} → ${currentStationB.name}`;
          } else if (
            currentStationA &&
            currentStationB &&
            train.trainDirectionUp == true
          ) {
            positionText = `${currentStationB.name} → ${currentStationA.name}`;
          }
        } else if (train.trainPos.match(/(\d+)_.*/)) {
          // '2510_####' のような文字列から 2510 (駅番号？) を取り出す
          const currentStationCode = RegExp.$1;

          // 当該の駅を駅リストから検索
          const currentStation = stations.find((station) => {
            return station.code == currentStationCode;
          });

          // 列車の位置へ駅名を代入
          if (!currentStation) {
            positionText = `-`;
          } else {
            positionText = `${currentStation.name}`;
          }
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
      `https://www.train-guide.westjr.co.jp/api/v3/${lineName}_st.json`,
    );

    // 駅リストをパースして独自フォーマットに変換
    const stations = this.parseStations(await response.json());

    // 駅リストを返す
    return stations;
  }

  parseTrainStatuses(parsedJson: any) {
    const trains: TrainStatus[] = [];

    for (const srcTrain of parsedJson.trains as JrwOriginalTrainStatus[]) {
      // JR西オリジナルデータの行先情報を変換する
      let trainDestText: string;
      if (typeof srcTrain.dest === 'string') {
        trainDestText = srcTrain.dest;
      } else {
        trainDestText = srcTrain.dest.text;
      }

      // JR西オリジナルデータのAシートやうれシートの情報を備考に入れる
      let trainNotices: string[] = [];

      if (srcTrain.aSeatInfo) {
        if (srcTrain.aSeatInfo == '「Ａシート」は9号車\n（有料座席）') {
          trainNotices.push(`9号車は指定席「Aシート」`);
        } else if (srcTrain.aSeatInfo != '「Ａシート」は9号車\n（有料座席）') {
          trainNotices.push(`${srcTrain.typeChange}`);
        }
      }

      if (srcTrain.typeChange) {
        if (srcTrain.typeChange.match('「うれしート」')) {
          trainNotices.push(`指定席「うれしート」連結列車`);
        } else if (
          srcTrain.typeChange != '「うれしート」は1号車\n（有料座席）'
        ) {
          trainNotices.push(`${srcTrain.typeChange}`);
        }
      }

      // 列車の種別と色を決定
      let trainDisplayType: string = srcTrain.displayType;
      let trainColorCode: string | undefined = undefined;
      if (srcTrain.displayType.match('特急')) {
        trainColorCode = 'red';
      } else if (srcTrain.displayType.match('寝台')) {
        trainColorCode = 'red';
        trainDisplayType = '寝台特急';
      } else if (srcTrain.displayType.match('新快')) {
        trainColorCode = 'blue';
        trainDisplayType = '新快速';
      } else if (
        srcTrain.displayType == '快速' ||
        srcTrain.displayType.match('う快速')
      ) {
        trainColorCode = '#f39c12';
        trainDisplayType = '快速';
      } else if (srcTrain.displayType == '区間快速') {
        trainColorCode = '#2ecc71';
      } else if (srcTrain.displayType == '大和路快') {
        trainColorCode = '#27ae60';
        trainDisplayType = '大和路快速';
      } else if (srcTrain.displayType == 'みやこ快') {
        trainColorCode = 'brown';
        trainDisplayType = 'みやこ路快速';
      } else if (srcTrain.displayType == '関空紀州') {
        trainColorCode = 'orange';
      } else if (srcTrain.displayType == '関空快速') {
        trainColorCode = '#3498db';
        trainDisplayType = '関空/紀州路快速';
      } else if (srcTrain.displayType == '紀州路快') {
        trainColorCode = 'orange';
      } else if (srcTrain.displayType == '丹波路快') {
        trainColorCode = '#f1c40f';
      } else if (
        srcTrain.displayType == '直通快速' ||
        srcTrain.displayType.match('う直快')
      ) {
        trainColorCode = '#f39c12';
        trainDisplayType = '直通快速';
      } else if (srcTrain.displayType == '特別快速') {
        trainColorCode = 'yellow';
      }

      // 独自フォーマットを生成
      const train: TrainStatus = {
        // 列車番号
        trainNo: srcTrain.no,
        // 表示上の種別
        trainDisplayType: trainDisplayType,
        // 愛称
        trainNickname: srcTrain.nickname ?? undefined,
        // 色
        trainColorCode: trainColorCode,
        // 行先
        trainDest: trainDestText,
        // 経由
        trainVia: srcTrain.via || undefined,
        // 両数
        trainCars: srcTrain.numberOfCars,
        // 走行位置
        trainPos: srcTrain.pos,
        // 上下
        trainDirectionUp: srcTrain.direction === 0,
        // 遅れ時分
        trainDelayMinutes: srcTrain.delayMinutes,
        // 備考
        trainNotices: trainNotices,
      };
      trains.push(train);
    }

    return trains;
  }

  parseStations(parsedJson: any) {
    const stations: Station[] = [];

    for (const srcStation of parsedJson.stations as JrwOriginalStation[]) {
      const srcStationInfo = srcStation.info;

      const station: Station = {
        // 駅名
        name: srcStationInfo.name,
        // 番号
        code: srcStationInfo.code,
      };

      stations.push(station);
    }

    return stations;
  }
}

/**
 * JR西の在線状況フォーマット
 */
interface JrwOriginalTrainStatus {
  // 列車番号 (例: "5032M")
  no: string;
  // 列車位置 (例: "0387_0388")
  pos: string;
  // 上下 (例: 0 = 上り)
  direction: number;
  // 愛称 (例: "サンライズ瀬戸・出雲")
  nickname: string | null;
  // 種別 (例: "10")
  type?: string;
  // 表示上の種別 (例: "寝台特急")
  displayType: string;
  // 行先 (例: "東京")
  dest: string | { text: string; code: string; line: string };
  // 経由
  via: string;
  // 遅延時分 (例: 60)
  delayMinutes: number;
  // 備考
  notice?: any;
  // 途中駅から種別が変わる場合，Aシート連結の新快速の場合 (例: "西明石－高槻間快速")
  typeChange?: string;
  // 列車の両数 (例: 14)
  numberOfCars?: number;
  // Aシート情報
  aSeatInfo?: string;
}

/**
 * JR西の駅フォーマット
 */
export interface JrwOriginalStation {
  // 駅情報
  info: {
    // 駅名
    name: string;
    // 駅番号 (例: "0390")
    code: string;
    // 停車列車
    stopTrains: [];
    // 乗換路線
    transfer?: {
      // 乗り換え先の路線
      name: string;
      // 不明
      type: number;
      // 路線コード
      code: string;
      // 不明
      link: string;
      linkCode: string;
    }[];
    // 備考
    typeNotice?: any;
    // 不明
    line?: any;
    lines?: any;
    pairDisplay?: any;
  };
  // 不明
  design?: any;
}
