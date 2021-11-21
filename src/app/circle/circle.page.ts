import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Grid } from '../pixel/grid';
import { Noise } from '../utils/noise';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.page.html',
  styleUrls: ['./circle.page.scss'],
})
export class CirclePage implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const canvas = this.canvas.nativeElement;
    canvas.width = 1400;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    const grid = new Grid(canvas.width, canvas.height);

    const noise = new Noise(1111, canvas.width, canvas.height);

    for( let a = 0; a < 2 * Math.PI; a += 0.1) {
      let r = noise.getNoise(1, 0) + 100;
      console.log(r);
      let x = r * Math.cos(a) + canvas.width / 2;
      let y = r * Math.sin(a) + canvas.height / 2;
      const cell = grid.getCellOfPixel(x, y);
      cell.red = 255;
      cell.alpha = 1;
    }

    grid.draw();
    ctx.drawImage(grid.canvas, 0, 0);
  }
}
