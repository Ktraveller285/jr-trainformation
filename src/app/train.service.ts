import { Injectable } from '@angular/core';
import { Line } from 'common/interfaces/line.interface';
import { Station } from 'common/interfaces/station.interface';
import { TrainStatus } from 'common/interfaces/train-status.interface';

@Injectable({
  providedIn: 'root',
})
export class TrainService {
  private areas = [
    {
      areaname: 'hokuriku',
      label: '北陸エリア',
      company: 'jrWest',
      lines: [
        {
          linename: 'hokuriku',
          label: '北陸',
          section: '敦賀-近江塩津',
        },
      ],
    },
    {
      areaname: 'kinki',
      label: '近畿エリア',
      company: 'jrWest',
      lines: [
        {
          linename: 'hokurikubiwako',
          label: '琵琶湖',
          section: '近江塩津-米原-京都',
          character: 'A',
        },
        {
          linename: 'kyoto',
          label: 'JR京都',
          section: '京都-大阪',
          character: 'A',
        },
        {
          linename: 'kobesanyo',
          label: 'JR神戸線・山陽',
          section: '大阪-姫路-上郡',
          character: 'A',
        },
        {
          linename: 'ako',
          label: '赤穂',
          section: '相生-播州赤穂',
          character: 'A',
        },
        {
          linename: 'kosei',
          label: '湖西',
          section: '近江塩津-京都',
          character: 'B',
        },
        {
          linename: 'kusatsu',
          label: '草津',
          section: '草津-柘植',
          character: 'C',
        },
        {
          linename: 'nara',
          label: '奈良',
          section: '京都-木津',
          character: 'D',
        },
        {
          linename: 'sagano',
          label: '嵯峨野',
          section: '京都-園部',
          character: 'E',
        },
        {
          linename: 'sanin1',
          label: '山陰',
          section: '園部-福知山',
          character: 'E',
        },
        {
          linename: 'sanin2',
          label: '山陰',
          section: '福知山-居組',
          character: 'A',
        },
        {
          linename: 'osakahigashi',
          label: 'おおさか東',
          section: '大阪-久宝寺',
          character: 'F',
        },
        {
          linename: 'takarazuka',
          label: 'JR宝塚',
          section: '大阪-新三田',
          character: 'G',
        },
        {
          linename: 'fukuchiyama',
          label: 'JR宝塚線・福知山',
          section: '新三田-福知山',
          character: 'G',
        },
        {
          linename: 'tozai',
          label: 'JR東西',
          section: '京橋-尼崎',
          character: 'H',
        },
        {
          linename: 'gakkentoshi',
          label: '学研都市',
          section: '木津-京橋',
          character: 'H',
        },
        {
          linename: 'bantan',
          label: '播但',
          section: '姫路-和田山',
          character: 'J',
        },
        {
          linename: 'maizuru',
          label: '舞鶴',
          section: '綾部-東舞鶴',
          character: 'L',
        },
        {
          linename: 'osakaloop',
          label: '大阪環状',
          section: '大阪-天王寺-大阪',
          character: 'O',
        },
        {
          linename: 'yumesaki',
          label: 'JRゆめ咲',
          section: '西九条-桜島',
          character: 'P',
        },
        {
          linename: 'yamatoji',
          label: '大和路',
          section: 'JR難波-加茂',
          character: 'Q',
        },
        {
          linename: 'hanwahagoromo',
          label: '阪和線・羽衣',
          section: '天王寺-和歌山, 鳳-東羽衣',
          character: 'R',
        },
        {
          linename: 'kansaiairport',
          label: '関西空港',
          section: '日根野-関西空港',
          character: 'S',
        },
        {
          linename: 'wakayama2',
          label: '和歌山',
          section: '王寺-五条',
          character: 'T',
        },
        {
          linename: 'wakayama1',
          label: '和歌山',
          section: '五条-和歌山',
          character: 'T',
        },
        {
          linename: 'manyomahoroba',
          label: '万葉まほろば',
          section: '奈良-高田',
          character: 'U',
        },
        {
          linename: 'kansai',
          label: '関西',
          section: '加茂-亀山',
          character: 'V',
        },
        {
          linename: 'kinokuni',
          label: 'きのくに',
          section: '和歌山-新宮',
          character: 'W',
        },
      ],
    },
    {
      areaname: 'okayama',
      label: '岡山・福山エリア',
      company: 'jrWest',
      lines: [
        {
          linename: 'unominato',
          label: '宇野みなと',
          section: '茶屋町-宇野',
          character: 'L',
        },
        {
          linename: 'setoohashi',
          label: '瀬戸大橋',
          section: '岡山-児島',
          character: 'M',
        },
        {
          linename: 'ako2',
          label: '赤穂',
          section: '播州赤穂-岡山',
          character: 'N',
        },
        {
          linename: 'sanyo1',
          label: '山陽',
          section: '上郡-三原',
        },
        {
          linename: 'hakubi1',
          label: '伯備',
          section: '倉敷-新郷',
          character: 'V',
        },
      ],
    },
    {
      areaname: 'hiroshima',
      label: '広島・山口エリア',
      company: 'jrWest',
      lines: [
        {
          linename: 'kabe',
          label: '可部',
          section: '広島-あき亀山',
          character: 'B',
        },
        {
          linename: 'sanyo2',
          label: '山陽',
          section: '糸崎-南岩国',
        },
        {
          linename: 'sanyo3',
          label: '山陽',
          section: '岩国-下関',
        },
        {
          linename: 'kure',
          label: '呉',
          section: '三原-呉-広島',
          character: 'Y',
        },
      ],
    },
    {
      areaname: 'sanin',
      label: '山陰エリア',
      company: 'jrWest',
      lines: [
        {
          linename: 'sanin3',
          label: '山陰',
          section: '諸寄-米子',
          character: 'A',
        },
        {
          linename: 'imbi1',
          label: '因美',
          section: '智頭-鳥取',
          character: 'B',
        },
        {
          linename: 'sanin4',
          label: '山陰',
          section: '米子-益田',
          character: 'D',
        },
        {
          linename: 'hakubi2',
          label: '伯備',
          section: '新郷-伯耆大山',
          character: 'V',
        },
      ],
    },
    {
      areaname: 'chukyo',
      label: '中京エリア',
      company: 'jrCentral',
      lines: [
        {
          linename: '10001',
          label: '東海道',
          section: '豊橋-米原',
          character: 'CA',
        },
        {
          linename: '10006',
          label: '関西',
          section: '名古屋-亀山',
          character: 'CJ',
        },
        {
          linename: '10007',
          label: '紀勢',
          section: '亀山-新宮',
        },
        {
          linename: '10002',
          label: '武豊',
          section: '大府-武豊',
          character: 'CE',
        },
        {
          linename: '10005',
          label: '太多',
          section: '多治見-美濃太田',
          character: 'CI',
        },
        {
          linename: '10008',
          label: '参宮',
          section: '多気-鳥羽',
        },
        {
          linename: '10009',
          label: '名松',
          section: '松阪-伊勢奥津',
        },
      ],
    },
    {
      areaname: 'shizuoka',
      label: '静岡エリア',
      company: 'jrCentral',
      lines: [
        {
          linename: '10011',
          label: '東海道',
          section: '熱海-豊橋',
          character: 'CA',
        },
        {
          linename: '10013',
          label: '御殿場',
          section: '国府津-沼津',
          character: 'CB',
        },
        {
          linename: '10012',
          label: '身延',
          section: '富士-甲府',
          character: 'CC',
        },
      ],
    },
    {
      areaname: 'kiso',
      label: '木曽エリア',
      company: 'jrCentral',
      lines: [
        {
          linename: '10003',
          label: '中央西',
          section: '名古屋-塩尻',
          character: 'CF',
        },
        {
          linename: '10004',
          label: '高山',
          section: '岐阜-猪谷',
          character: 'CG',
        },
        {
          linename: '10010',
          label: '飯田',
          section: '豊橋-辰野',
          character: 'CD',
        },
      ],
    },
    {
      areaname: 'sapporo',
      label: '札幌近郊',
      company: 'jrHokkaido',
      lines: [
        {
          linename: '01',
          label: '函館',
          section: '岩見沢-小樽',
        },
        {
          linename: '02',
          label: '千歳',
          section: '札幌-新千歳空港・苫小牧',
          character: 'H',
        },
        {
          linename: '03',
          label: '学園都市',
          section: '北海道医療大学-札幌',
          character: 'G',
        },
      ],
    },
    {
      areaname: 'douou',
      label: '道央エリア',
      company: 'jrHokkaido',
      lines: [
        {
          linename: '05',
          label: '函館',
          section: '旭川-岩見沢',
          character: 'A',
        },
        {
          linename: '04',
          label: '函館',
          section: '小樽-長万部',
          character: 'S',
        },
        {
          linename: '06',
          label: '室蘭',
          section: '岩見沢-苫小牧',
        },
        {
          linename: '07',
          label: '室蘭',
          section: '苫小牧-長万部',
          character: 'H',
        },
        {
          linename: '08',
          label: '室蘭',
          section: '東室蘭-室蘭',
        },
      ],
    },
    {
      areaname: 'dounan',
      label: '道南エリア',
      company: 'jrHokkaido',
      lines: [
        {
          linename: '09',
          label: '函館',
          section: '長万部-函館',
          character: 'H',
        },
        {
          linename: '10',
          label: '函館線砂原支',
          section: '森-渡島砂原-大沼',
          character: 'H',
        },
      ],
    },
    {
      areaname: 'douhoku',
      label: '道北エリア',
      company: 'jrHokkaido',
      lines: [
        {
          linename: '11',
          label: '宗谷',
          section: '名寄-旭川',
          character: 'W',
        },
        {
          linename: '12',
          label: '石北',
          section: '上川-旭川',
          character: 'A',
        },
      ],
    },
    {
      areaname: 'doutou',
      label: '道東エリア',
      company: 'jrHokkaido',
      lines: [
        {
          linename: '13',
          label: '石勝線・根室',
          section: '南千歳-釧路',
          character: 'K',
        },
        {
          linename: '14',
          label: '根室',
          section: '滝川-富良野',
          character: 'T',
        },
      ],
    },
  ];

  getAreas() {
    return this.areas;
  }

  getLine(lineName: string): Line | undefined {
    let selectedLine;
    for (let area of this.areas) {
      for (let line of area.lines) {
        if (line.linename == lineName) {
          selectedLine = line;
          break;
        }
      }
    }
    return selectedLine;
  }

  getCompanyName(lineName: string) {
    for (let area of this.areas) {
      for (let line of area.lines) {
        if (line.linename == lineName) {
          const companyName = area.company;
          return companyName;
        }
      }
    }
    return undefined;
  }

  async getTrains(lineName: string) {
    const companyName = this.getCompanyName(lineName);
    if (companyName === undefined) {
      throw lineName + ' の companyName を取得できません';
    }

    const response = await fetch(`/api/train/${companyName}/lines/${lineName}`);
    const object = await response.json();
    return object as TrainStatus[];
  }

  async getStations(lineName: string) {
    const companyName = this.getCompanyName(lineName);
    if (companyName === undefined) {
      throw lineName + ' の companyName を取得できません';
    }

    const response = await fetch(
      `/api/train/${companyName}/stations/${lineName}`,
    );
    const object = await response.json();
    return object as Station[];
  }

  constructor() {}
}
