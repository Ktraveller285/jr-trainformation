/**
 * 駅の乗り換え路線
 */
export interface StationTransfer {
  // 乗り換え先の路線
  name: string;
  // 不明
  type: number;
  // 路線コード
  code: string;
  // 不明
  link: string;
  linkCode: string;
}

/**
 * 駅のデータ
 */
export interface StationInfo {
  // 駅名
  name: string;
  // 駅番号 (例: "0390")
  code: string;
  // 停車列車
  stopTrains: [];
  // 乗換路線
  transfer?: StationTransfer[];
  // 備考
  typeNotice?: any;
  // 不明
  line?: any;
  lines?: any;
  pairDisplay?: any;
}

/**
 * 駅
 */
export interface Station {
  // 駅情報
  info: StationInfo;
  // 不明
  design?: any;
}
