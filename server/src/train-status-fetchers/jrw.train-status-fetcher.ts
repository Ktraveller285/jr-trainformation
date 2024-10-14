import { TrainStatus } from "../interfaces/train-status.interface";

interface JrwOriginalTrainStatus {
    // 列車番号 (例: "5032M")
    no: string;
    // 列車位置 (例: "0387_0388")
    pos: string;
    // 上下 (例: 0 = 上り)
    direction: number;
    // 愛称 (例: "サンライズ瀬戸・出雲")
    nickname: string[] | null;
    // 種別 (例: "10")
    type?: string;
    // 表示上の種別 (例: "寝台特急")
    displayType: string;
    // 行先 (例: "東京")
    dest: string | { text: string; code: string; line: string };
    // 遅延時分 (例: 60)
    delayMinutes: number;
    // 備考
    notice?: any;
    // 途中駅から種別が変わる場合，Aシート連結の新快速の場合 (例: "西明石－高槻間快速")
    typeChange?: string;
    // 列車の両数 (例: 14)
    numberOfCars?: number;
};

export class JrwTrainStatusFetcher {

  parse(parsedJson: any) {

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

      const train: TrainStatus =  {
        trainNo: srcTrain.no,
        trainDelayMinutes: srcTrain.delayMinutes,
        trainDest: trainDestText,
        trainDirectionUp: trainDirection,
        trainDisplayType: srcTrain.displayType,
      };
      results.push(train);

    }

    return results;
  }

}
