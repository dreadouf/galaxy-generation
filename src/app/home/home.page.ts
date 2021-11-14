import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Noise } from '../utils/noise';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

  constructor() {}

  ngAfterViewInit() {
    const canvas = this.canvas.nativeElement;
    canvas.width = 1400;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const imgData = ctx.getImageData(0,0, canvas.width, canvas.height);
    const data = imgData.data;
    const noise = new Noise(Math.floor((Math.random() * 10000)), canvas.width, canvas.height);

    noise.twist(1.5);

    for(let x = 0; x < canvas.width; x++) {
      for(let y = 0; y < canvas.height; y++) {
        let idx = (x + y * canvas.width) * 4;
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = noise.getNoise(x , y);
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }
}
