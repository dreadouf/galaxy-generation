import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { createBackground, createCentralLight, createCircularMask, createGalaxyLayer } from '../utils/layers';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

  constructor() {}

  ngAfterViewInit() {
    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0, 0, 0, 255)';
    ctx.fillRect(0, 0 , canvas.width, canvas.height);


    const galaxyBackground = createBackground(canvas.width, canvas.height, 24211113441, 58, 44, 79);
    // const galaxyLayerRed = createGalaxyLayer(canvas.width, canvas.height, 7000331, 47, 83, 131);
    const galaxyLayerRed = createGalaxyLayer(canvas.width, canvas.height, 7000331, 58, 44, 79);
    // const galaxyLayerBlue = createGalaxyLayer(canvas.width, canvas.height, 1330007, 47, 83, 131);
    const galaxyLayerBlue = createGalaxyLayer(canvas.width, canvas.height, 1330007, 58, 44, 79);
    const galaxyLayerWhite = createGalaxyLayer(canvas.width, canvas.height, 234655462, 0, 0, 0);
    const circularMask = createCircularMask(canvas.width, canvas.height);

    ctx.globalAlpha = 1;
    // ctx.drawImage(galaxyLayerWhite, 0 , 0);
    // ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(galaxyLayerBlue, 0 , 0);
    // ctx.globalCompositeOperation = 'lighter';
    // ctx.drawImage(galaxyLayerRed, 0, 0);

    // ctx.globalAlpha = 0.8;
    // ctx.globalCompositeOperation = 'lighten';
    // ctx.globalCompositeOperation = 'destination-in';
    // ctx.drawImage(circularMask, 0, 0);

    // ctx.globalCompositeOperation = 'lighter';
    // ctx.globalAlpha = 1;
    // let centralLight = createCentralLight(canvas.width, canvas.height, 651268582, 118, 104, 139);
    // ctx.drawImage(centralLight, 0, 0);
    // centralLight = createCentralLight(canvas.width, canvas.height, 23498917983, 205, 255, 255);
    // ctx.drawImage(centralLight, 0, 0);
    // centralLight = createCentralLight(canvas.width, canvas.height, 2349823489, 205, 255, 255);
    // ctx.drawImage(centralLight, 0, 0);

    ctx.globalCompositeOperation = 'destination-over';
    // ctx.save();
    // for(let i = 0; i < 10; i++) {
    //   ctx.fillStyle = '#FFFFFFA0';
    //   ctx.fillRect(i * (canvas.width / 10), 0, 1, canvas.height)
    //   ctx.fillRect(0, i * (canvas.height /10), canvas.width, 1)
    // }
    // ctx.restore();
    ctx.drawImage(galaxyBackground, 0, 0);

    const realCanvas = this.canvas.nativeElement;
    realCanvas.width = canvas.width;
    realCanvas.height = canvas.height;
    const realCtx = realCanvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const circularMaskData = circularMask.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    for(let x = 0; x < canvas.width; x += 10) {
      for(let y = 0; y < canvas.height; y += 10) {
        let idx = ((x + 5) + (y + 5) * canvas.width) * 4;
        let red = 58;
        let green = 44;
        let blue = 79;
        let alpha = (data[idx] / red) * (circularMaskData[idx + 3] / 255);
        alpha = (alpha < 0.1) ? 0 : (alpha < 0.4) ? 0.5 : 1;
        realCtx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        realCtx.fillRect(x, y, 10, 10);
      }
    }

  }
}
