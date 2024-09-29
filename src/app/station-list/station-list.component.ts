import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainService } from '../train.service';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss'],
})
export class StationListComponent implements OnInit {
  stations!: any[];
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

    this.stations = await this.trainService.getTrains(this.lineName);
  }
}
