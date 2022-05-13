import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LineDetailComponent } from './line-detail/line-detail.component';
import { LineSelectComponent } from './line-select/line-select.component';
import { NoticeRegisterComponent } from './notice-register/notice-register.component';

const routes: Routes = [
  {
    path: '',
    component: LineSelectComponent,
  },
  {
    path: 'lines/:lineName',
    component: LineDetailComponent,
  },
  {
    path: 'notice',
    component: NoticeRegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
