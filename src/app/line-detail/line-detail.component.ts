import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-line-detail',
  templateUrl: './line-detail.component.html',
  styleUrls: ['./line-detail.component.scss'],
})
export class LineDetailComponent implements OnInit {
  trains!: any[];

  constructor(public activatedRoute: ActivatedRoute) {}
  lineName!: string | null;
  async ngOnInit() {
    this.lineName = this.activatedRoute.snapshot.paramMap.get('lineName');
    const response = await fetch('/assets/hokurikubiwako.json');

    const object = await response.json();
    this.trains = object.trains;
  }
}
