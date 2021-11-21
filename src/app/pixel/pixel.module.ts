import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PixelPageRoutingModule } from './pixel-routing.module';

import { PixelPage } from './pixel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PixelPageRoutingModule
  ],
  declarations: [PixelPage]
})
export class PixelPageModule {}
