import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NoticeService {
  constructor() {}

  async register(
    lineName: string,
    trainNumber: string,
    noticeDate: string,
    cancelDecisionTime: string = '',
    noticeEmail: string
  ) {
    let data = {
      lineName,
      trainNumber,
      noticeDate,
      cancelDecisionTime,
      noticeEmail,
    };
    let response = await fetch('/api/notice/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw await response.text();
    }
    return response.json();
  }
}
