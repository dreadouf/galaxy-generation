import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PixelPage } from './pixel.page';

const routes: Routes = [
  {
    path: '',
    component: PixelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PixelPageRoutingModule {}
