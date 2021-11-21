import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { makeNoise } from '../utils/pixel-utils';

@Component({
  selector: 'app-pixel',
  templateUrl: './pixel.page.html',
  styleUrls: ['./pixel.page.scss'],
})
export class PixelPage implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const canvas = this.canvas.nativeElement;
    canvas.width = 1400;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    // const noiseCanvas = makeOctaveNoise(canvas.width, canvas.height, 5);
    const noiseCanvas = makeNoise(Math.random() * 1000000, canvas.width, canvas.height);

    ctx.drawImage(noiseCanvas, 0, 0);
  }

}
