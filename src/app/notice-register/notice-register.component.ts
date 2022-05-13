import { Component, OnInit } from '@angular/core';
import { TrainService } from '../train.service';

@Component({
  selector: 'app-notice-register',
  templateUrl: './notice-register.component.html',
  styleUrls: ['./notice-register.component.scss'],
})
export class NoticeRegisterComponent implements OnInit {
  constructor(public trainService: TrainService) {}

  register(
    line: string,
    trainNumber: string,
    noticeDate: string,
    cancelDecisionTime: string = '',
    noticeEmail: string
  ) {
    let registerData = {
      line,
      trainNumber,
      noticeDate,
      cancelDecisionTime,
      noticeEmail,
    };
    console.log(registerData);
  }

  ngOnInit(): void {}
}
