export interface Notice {
  id?: number;

  noticeEmail: string;

  lineName: string;

  trainNumber: string;

  noticeDate: string;

  cancelDecisionTime: string;

  notified: boolean;

  ipAddress: string;
}
