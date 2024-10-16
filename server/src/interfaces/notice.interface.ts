export interface Notice {
  id?: number;

  noticeEmail: string;

  companyName: string;

  lineName: string;

  trainNumber: string;

  noticeDate: string;

  cancelDecisionTime: string;

  notified: boolean;

  ipAddress: string;
}
