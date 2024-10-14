export interface TrainStatus {
// 列車番号 (例: "5032M")
trainNo: string;
// 種別 (例: "10")
trainType?: string;
// 表示上の種別 (例: "寝台特急")
trainDisplayType: string;
// 愛称 (例: "サンライズ瀬戸・出雲")
trainNickname?: string;
// 行先 (例: "東京")
trainDest: string;
// 両数 (例: 14)
trainCars?: number;
// 走行位置 (例: "0387_0388")
trainPos?: string;
// 上下 (例: false = 上り)
trainDirectionUp: boolean;
// 遅れ時分 (例: 60)
trainDelayMinutes: number;
// 備考
trainNotice?: any;
// 途中駅で種別が変わる場合，うれしートの連結情報 (例: "西明石－高槻間快速")
trainTypeChange?: string;
// Aシートの連結情報
trainAseatInfo?: string;
// 臨時列車かどうかのフラグ (例: 0 = 定期列車)
trainRinji?: number;
}
