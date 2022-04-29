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
    this.lineName = this.activatedRoute.snapshot.paramMap.get('lineName');
    if (!this.lineName) {
      return;
    }
    this.line = this.trainService.getLine(this.lineName);

    const response = await fetch(`/api/lines/${this.lineName}`);
    const object = await response.json();
    this.trains = object.trains;
  }
}
