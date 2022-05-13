import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainService } from '../train.service';

@Component({
  selector: 'app-notice-register',
  templateUrl: './notice-register.component.html',
  styleUrls: ['./notice-register.component.scss'],
})
export class NoticeRegisterComponent implements OnInit {
  public lineName!: string | null;

  constructor(
    public trainService: TrainService,
    public activatedRoute: ActivatedRoute // URL情報を得られる君
  ) {}

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
  }

  ngOnInit(): void {
    this.lineName = this.activatedRoute.snapshot.queryParamMap.get('line');
  }
}
