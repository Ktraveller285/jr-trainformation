import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from 'src/material.module';
import { LineDetailComponent } from './line-detail/line-detail.component';
import { LineSelectComponent } from './line-select/line-select.component';
import { NoticeRegisterComponent } from './notice-register/notice-register.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { TermsOfServiceDialogComponent } from './terms-of-service-dialog/terms-of-service-dialog.component';
import { TrainService } from './train.service';
import trainRouter from 'server/src/routes/train';
import { StationListComponent } from './station-list/station-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LineDetailComponent,
    LineSelectComponent,
    NoticeRegisterComponent,
    TermsOfServiceDialogComponent,
    StationListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'ja-JP' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
