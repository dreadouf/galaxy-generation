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
    const noise = new Noise(13000037, canvas.width, canvas.height);

    noise.twist(1.5);
    noise.mask();

    for(let x = 0; x < canvas.width; x++) {
      for(let y = 0; y < canvas.height; y++) {
        let idx = (x + y * canvas.width) * 4;
        data[idx] = 35;
        data[idx + 1] = 75;
        data[idx + 2] = 102;
        data[idx + 3] = noise.getNoise(x , y);
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // const img2 = ctx.getImageData(0,0, canvas.width, canvas.height);
    // const data2 = img2.data;

    // const noise2 = new Noise(7331, canvas.width, canvas.height);
    // noise2.twist(1.5);
    // noise2.mask();

    // for(let x = 0; x < canvas.width; x++) {
    //   for(let y = 0; y < canvas.height; y++) {
    //     let idx = (x + y * canvas.width) * 4;
    //     data2[idx] = 100;
    //     data2[idx + 1] = 0;
    //     data2[idx + 2] = 0;
    //     data2[idx + 3] = noise2.getNoise(x , y);
    //   }
    // }

    // ctx.globalCompositeOperation = 'lighter';
    // ctx.putImageData(img2, 0, 0);

    
  }
}
