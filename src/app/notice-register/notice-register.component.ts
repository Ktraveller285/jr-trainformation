import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import * as e from 'express';
import { NoticeService } from '../notice.service';
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
    public activatedRoute: ActivatedRoute, // URL情報を得られる君
    public noticeService: NoticeService, // 通知を登録したりする君
    public snackbar: MatSnackBar
  ) {}

  async register(
    line: string,
    trainNumber: string,
    noticeDate: string,
    cancelDecisionTime: string = '',
    noticeEmail: string
  ) {
    if (line === '' || noticeEmail === '') {
      this.snackbar.open(`エラー: 未入力の項目があります`, undefined, {
        duration: 2000,
      });
      return;
    }

    // 通知を登録
    try {
      await this.noticeService.register(
        line,
        trainNumber,
        noticeDate,
        cancelDecisionTime,
        noticeEmail
      );
    } catch (e: any) {
      // メッセージ表示
      this.snackbar.open(
        `エラー: 登録できませんでした→ ${e.toString()}`,
        undefined,
        {
          duration: 5000,
        }
      );
      return;
    }

    // メッセージ表示
    this.snackbar.open('登録できました！', undefined, {
      duration: 1000,
    });
  }

  ngOnInit(): void {
    this.lineName = this.activatedRoute.snapshot.queryParamMap.get('line');
  }
}
