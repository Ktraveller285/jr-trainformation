import { Component, OnInit } from '@angular/core';
import { TrainService } from '../train.service';

@Component({
  selector: 'app-line-select',
  templateUrl: './line-select.component.html',
  styleUrls: ['./line-select.component.scss'],
})
export class LineSelectComponent implements OnInit {
  constructor(public trainService: TrainService) {}
  ngOnInit(): void {}
}
