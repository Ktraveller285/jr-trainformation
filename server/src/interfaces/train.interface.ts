interface Train {
  no: string;
  pos: string;
  direction: number;
  nickname: string[] | null;
  type: string;
  displayType: string;
  dest: string | { text: string; code: string; line: string };
  delayMinutes: number;
  notice: any;
}
