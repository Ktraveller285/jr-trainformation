import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainService } from '../train.service';

@Component({
  selector: 'app-line-detail',
  templateUrl: './line-detail.component.html',
  styleUrls: ['./line-detail.component.scss'],
})
export class LineDetailComponent implements OnInit {
  trains!: any[];
  lineName!: string | null;
  line!: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public trainService: TrainService
  ) {}

  async ngOnInit() {
    // URLの変更を監視する
    this.activatedRoute.paramMap.subscribe((params) => {
      this.lineName = params.get('lineName');

      if (!this.lineName) {
        return;
      }
      this.line = this.trainService.getLine(this.lineName);
      this.loadTrains();
    });
  }

  // リロードボタンのための実装
  async loadTrains() {
    // lineNameが空だったら何もしない
    if (!this.lineName) {
      return;
    }

    this.trains = await this.trainService.getTrains(this.lineName);
  }
}
