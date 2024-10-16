import { JrwTrainFetcher } from './jrw.train-fetcher';

describe('JrwTrainFetcher', () => {
  test('在線状況のパース', () => {
    const json = `{"update":"2024-10-14T04:29:09.938Z","trains":[{"no":"775T","pos":"0400_0401","direction":1,"nickname":"","type":"10","displayType":"普通","dest":{"text":"加古川","code":"0447","line":"hokuriku"},"via":"","delayMinutes":0,"aSeatInfo":"","typeChange":"高槻－明石間快速","numberOfCars":8}]}`;
    const parsedJson = JSON.parse(json);

    const fetcher = new JrwTrainFetcher();
    const result = fetcher.parseTrainStatuses(parsedJson);

    expect(result).toEqual([
      {
        trainNo: '775T',
        trainDelayMinutes: 0,
        trainDest: '加古川',
        trainDirectionUp: true,
        trainDisplayType: '普通',
        trainNotices: [],
      },
    ]);
  });
});
