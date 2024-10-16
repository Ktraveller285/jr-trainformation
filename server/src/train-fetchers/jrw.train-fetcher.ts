import { TrainStatus } from 'common/interfaces/train-status.interface';
import { TrainFetcher } from '../interfaces/train-fetcher.interface';
import { Station } from '../interfaces/station.interface';

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
          const currentStationA = stations.find((station: any) => {
            return station.info.code == currentStationCodeA;
          });
          const currentStationB = stations.find((station: any) => {
            return station.info.code == currentStationCodeB;
          });

          // 列車の位置へ駅名を代入
          if (!currentStationA && train.trainDirectionUp == true) {
            positionText = `${currentStationB!.info.name} → 他路線`;
          } else if (!currentStationA && train.trainDirectionUp == false) {
            positionText = `他路線 → ${currentStationB!.info.name}`;
          } else if (!currentStationB && train.trainDirectionUp == true) {
            positionText = `他路線 → ${currentStationA!.info.name}`;
          } else if (!currentStationB && train.trainDirectionUp == false) {
            positionText = `${currentStationA!.info.name} → 他路線`;
          } else if (
            currentStationA &&
            currentStationB &&
            train.trainDirectionUp == false
          ) {
            positionText = `${currentStationA.info.name} → ${currentStationB.info.name}`;
          } else if (
            currentStationA &&
            currentStationB &&
            train.trainDirectionUp == true
          ) {
            positionText = `${currentStationB.info.name} → ${currentStationA.info.name}`;
          }
        } else if (train.trainPos.match(/(\d+)_.*/)) {
          // '2510_####' のような文字列から 2510 (駅番号？) を取り出す
          const currentStationCode = RegExp.$1;

          // 当該の駅を駅リストから検索
          const currentStation = stations.find((station: any) => {
            return station.info.code == currentStationCode;
          });

          // 列車の位置へ駅名を代入
          if (!currentStation) {
            positionText = `-`;
          } else {
            positionText = `${currentStation.info.name}`;
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
    const response = await fetch(
      `https://www.train-guide.westjr.co.jp/api/v3/${lineName}_st.json`,
    );
    const object = await response.json();
    return object.stations;
  }

  parseTrainStatuses(parsedJson: any) {
    const results: TrainStatus[] = [];

    for (const srcTrain of parsedJson.trains as JrwOriginalTrainStatus[]) {
      // JR西オリジナルデータの行先情報を変換する
      let trainDestText: string;
      if (typeof srcTrain.dest === 'string') {
        trainDestText = srcTrain.dest;
      } else {
        trainDestText = srcTrain.dest.text;
      }

      // JR西オリジナルデータの上下方向情報を変換する
      let trainDirection: boolean;
      if (srcTrain.direction === 0) {
        trainDirection = false;
      } else {
        trainDirection = true;
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
        trainDirectionUp: trainDirection,
        // 遅れ時分
        trainDelayMinutes: srcTrain.delayMinutes,
        // 備考
        trainNotices: trainNotices,
      };
      results.push(train);
    }

    return results;
  }
}
