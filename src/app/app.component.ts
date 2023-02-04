import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TermsOfServiceDialogComponent } from './terms-of-service-dialog/terms-of-service-dialog.component';
import { WeatherService } from './weather.service';
import { TrainService } from './train.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  weather!: any;
  constructor(
    public weatherService: WeatherService,
    private dialog: MatDialog,
    public trainService: TrainService
  ) {}

  async ngOnInit() {
    this.weather = await this.weatherService.getWeather();

    // 利用規約に同意していなければダイアログ表示
    if (!window.localStorage.getItem('isAgreed')) {
      this.openTermsOfServiceDialog();
    }
  }

  /**
   * 利用規約ダイアログの表示
   */
  async openTermsOfServiceDialog() {
    let dialogRef = this.dialog.open(TermsOfServiceDialogComponent, {
      disableClose: true,
    });
    await dialogRef.afterClosed().toPromise();
    window.localStorage.setItem('isAgreed', 'true');
  }
}
