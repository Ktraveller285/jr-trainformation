import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-line-select',
  templateUrl: './line-select.component.html',
  styleUrls: ['./line-select.component.scss'],
})
export class LineSelectComponent implements OnInit {
  areas = [
    {
      areaname: 'hokuriku',
      label: '北陸エリア',
      lines: [
        {
          linename: 'hokuriku',
          label: '北陸',
          section: '金沢-近江塩津',
        },
      ],
    },
    {
      areaname: 'kinki',
      label: '近畿エリア',
      lines: [
        {
          linename: 'biwako',
          label: '琵琶湖（）',
          section: '近江塩津-米原-京都',
        },
        {
          linename: 'kyoto',
          label: 'JR京都',
          section: '京都-大阪',
        },
        {
          linename: 'kobe',
          label: 'JR神戸',
          section: '大阪-姫路-上郡',
        },
        {
          linename: 'ako',
          label: '赤穂',
          section: '相生-播州赤穂',
        },
        {
          linename: 'kosei',
          label: '湖西',
          section: '近江塩津-京都',
        },
        {
          linename: 'kusatsu',
          label: '草津',
          section: '草津-柘植',
        },
        {
          linename: 'nara',
          label: 'JR奈良',
          section: '京都-木津',
        },
        {
          linename: 'sagano',
          label: '嵯峨野',
          section: '京都-園部',
        },
        {
          linename: 'sanin1',
          label: '山陰',
          section: '園部-福知山',
        },
        {
          linename: 'sanin2',
          label: '山陰',
          section: '福知山-居組',
        },
        {
          linename: 'osakahigashi',
          label: 'おおさか東',
          section: '新大阪-久宝寺',
        },
        {
          linename: 'takarazuka',
          label: 'JR宝塚',
          section: '大阪-新三田',
        },
        {
          linename: 'fukuchiyama',
          label: '福知山',
          section: '新三田-福知山',
        },
        {
          linename: 'tozai',
          label: 'JR東西',
          section: '京橋-尼崎',
        },
        {
          linename: 'gakkentoshi',
          label: '学研都市',
          section: '木津-京橋',
        },
        {
          linename: 'bantan',
          label: '播但',
          section: '姫路-和田山',
        },
        {
          linename: 'maizuru',
          label: '舞鶴',
          section: '綾部-東舞鶴',
        },
        {
          linename: 'osakaloop',
          label: '大阪環状',
          section: '大阪-天王寺-大阪',
        },
        {
          linename: 'yumesaki',
          label: 'JRゆめ咲',
          section: '西九条-桜島',
        },
        {
          linename: 'yamatoji',
          label: '大和路',
          section: 'JR難波-加茂',
        },
        {
          linename: 'hanwahagoromo',
          label: '阪和線・羽衣',
          section: '天王寺-和歌山, 鳳-東羽衣',
        },
        {
          linename: 'kansaiairport',
          label: '関西空港',
          section: '日根野-関西空港',
        },
        {
          linename: 'wakayama2',
          label: '和歌山',
          section: '王寺～五条',
        },
        {
          linename: 'wakayama1',
          label: '和歌山',
          section: '五条～和歌山',
        },
        {
          linename: 'manyomahoroba',
          label: '万葉まほろば',
          section: '奈良-高田',
        },
        {
          linename: 'kansai',
          label: '関西',
          section: '加茂～亀山',
        },
        {
          linename: 'kinokuni',
          label: 'きのくに',
          section: '和歌山-新宮',
        },
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
