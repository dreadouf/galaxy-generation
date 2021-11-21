import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SimpleNoise } from '../utils/simple-noise';
import { clamp } from '../utils/utils';


@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.page.html',
  styleUrls: ['./cloud.page.scss'],
})
export class CloudPage implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const canvas = this.canvas.nativeElement;
    canvas.width = 1400;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < 200; i++) {
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;
      let r = Math.random() * 1.1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fill();
    }
    const noise = new SimpleNoise(1, canvas.width, canvas.height);
    // ctx.globalCompositeOperation = 'luminosity';
    const brush = this.createBrush(0, 60, 255, 0.24, 300, 30);
    let max = 8;
    for(let i = 0; i < max; i++) {
      let theta = Math.PI * 2 / max;
      theta = theta * i;
      let cos = Math.cos(theta);
      let sin = Math.sin(theta);
      let r = 200;
      let x = r * cos + canvas.width / 2 - r;
      let y = r * sin + canvas.height / 2 - r;
      ctx.drawImage(brush, x, y);

    }

    max = 16;
    for(let i = 0; i < max; i++) {
      let theta = Math.PI * 2 / max;
      theta = theta * i;
      let cos = Math.cos(theta);
      let sin = Math.sin(theta);
      let r = 370;
      let x = r * cos + canvas.width / 2 - 200;
      let y = r * sin + canvas.height / 2 - 200;
      ctx.drawImage(brush, x, y);

    }
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const noiseCanvas = noise.toCanvas();
    ctx.globalCompositeOperation = 'color-dodge';
    ctx.drawImage(noiseCanvas, 0, 0);
    
    // for(let x = 0; x < canvas.width; x++) {
    //   for(let y = 0; y < canvas.height; y++) {
    //     const idx = (x + y * canvas.width) * 4;
    //     data[idx+3] = clamp(Math.round(data[idx + 3] * (1 - noise.getNoise(x,y))), 0, 255);
    //   }
    // }

    // ctx.putImageData(imgData, 0, 0);
  }

  createBrush(red: number, green: number, blue: number, alpha: number = 1, size: number = 400, fether = 20): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = `rgb(${red}, ${green}, ${blue}, ${alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'destination-in';
    ctx.filter = `blur(${fether}px)`;
    let x = Math.round(size / 2);
    ctx.beginPath();
    ctx.arc(x, x, x - Math.round(fether * 2), 0, 2 * Math.PI);
    ctx.fill();
    return canvas;

    // const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // const data = imgData.data;

    // for(let x = 0; x < canvas.width; x++) {
    //   for(let y = 0; y < canvas.height; y++) {
    //     const idx = (x + y * canvas.width) * 4;
    //     let xc = (x - canvas.width / 2) / (canvas.width);
    //     let yc = y - canvas.height / 2;
    //     let dist2 = xc * xc + yc * yc;
    //     let alpha = 
    //     data[idx+3] = alpha
    //   }
    // }
    
    return canvas;
  }
}
