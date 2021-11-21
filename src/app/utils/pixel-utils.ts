import FastNoise from 'fastnoise-lite';
import { clamp } from "./utils";

export class Noise {
    public width: number;
    public height: number;
    public noise: FastNoise;
    public data: Float32Array;


    constructor(seed: number, width: number, height: number, frequency: number = 0.007, octaves: number = 5, gain: number = 0.7, strength: number = 0.3) {
        this.width = width;
        this.height = height;
        this.data = new Float32Array(this.width * this.height);
        this.noise = new FastNoise(seed);
        this.noise.SetNoiseType(FastNoise.NoiseType.OpenSimplex2);
        this.noise.SetFrequency(frequency);

        this.noise.SetFractalType(FastNoise.FractalType.FBm);
        this.noise.SetFractalOctaves(octaves);
        this.noise.SetFractalLacunarity(2.0);
        this.noise.SetFractalGain(gain);
        this.noise.SetFractalWeightedStrength(strength);

        this.generate();
    }

    generate() {
        let minN: number = Number.MAX_VALUE;
        let maxN: number = Number.MIN_VALUE;
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                const index = x + y * this.width;
                const noise = this.noise.GetNoise(x, y);
                minN = Math.min(minN, noise);
                maxN = Math.max(maxN, noise);
                this.data[index] = noise;
            }
        }
        const scale = maxN - minN;
        // normalize
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                const index = x + y * this.width;
                this.data[index] = (this.data[index] - minN) / scale;
            }
        }
    }

    getNoise(x: number, y: number): number {
        const index = x + y * this.width;
        return this.data[index];
    }
}

const toGrid = (x) => {
    return Math.round(x / 10.0) * 10;
}

export const makeNoise = (seed: number, width, height) => {
    console.log(seed);
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    var imgData = ctx.getImageData(0, 0, width, height),
        data = imgData.data,
        pixels = data.length;

    // for(var i = 0; i < pixels; i+=4){
    //     data[i] = 255;
    //     data[i+1] = 255;
    //     data[i+2] = 255;
    //     data[i+3] = Math.random() * 255;
    // }
    // ctx.putImageData(imgData, 0, 0);

    const noise = new Noise(seed, width, height);

    const halfWidth = Math.floor(width / 2);
    const halfHeight = Math.floor(height / 2);
    const twistFactor = 5;
    const alphaStop = 1;
    let thickness = 500;
    let dx = (width - thickness) / 2;
    let dy = (height - thickness) / 2;

    for(let x = 0; x < thickness; x+=10) {
        for(let y = 0; y < height / 6; y+=10) {
            let z = (2 * x - thickness) / thickness;
            z = - z*z + 1;
            let alpha = noise.getNoise(x,y) * z;

            alpha = (alpha < 0.05) ?  0: (alpha < 0.3) ? 0.5 : 1;
            // alpha = (alpha < 0.1) ?  0: (alpha < alphaStop) ? 0.5 : 1;

            const newX = x + dx - halfWidth;
            const newY = y - halfHeight;

            const percent = ((halfWidth - Math.sqrt(newX * newX + newY * newY)) / halfWidth);
            const theta = percent * percent * twistFactor * Math.PI;
            const sin = Math.sin(theta);
            const cos = Math.cos(theta);
            let xp = newX * cos - newY * sin;
            let yp = newY * cos + newX * sin;

            xp = Math.floor(xp + halfWidth);
            yp = Math.floor(yp + halfHeight);

            alpha = 1;
            let red = 58 * alpha;
            let green = 44 * alpha;
            let blue = 79 * alpha;
            let a = 255;

            ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${a})`;
            ctx.fillRect(toGrid(xp), toGrid(yp),      10, 10);
            ctx.fillRect(toGrid(xp + 10), toGrid(yp), 10, 10);
            ctx.fillRect(toGrid(xp), toGrid(yp + 10), 10, 10);
            ctx.fillRect(toGrid(xp - 10), toGrid(yp), 10, 10);
            ctx.fillRect(toGrid(xp), toGrid(yp - 10), 10, 10);
        }
    }

    // for(let x = 0; x < width; x+=10) {
    //     for(let y = 0; y < thickness; y+=10) {
    //         let z = (2 * y - thickness) / thickness;
    //         z = - z*z + 1;
    //         let alpha = noise.getNoise(x,y) * z;

    //         alpha = (alpha < 0.1) ?  0: (alpha < alphaStop) ? 0.5 : 1;

    //         const newX = x - halfWidth;
    //         const newY = y + dy - halfHeight;

    //         const percent = ((halfWidth - Math.sqrt(newX * newX + newY * newY)) / halfWidth);
    //         const theta = percent * percent * twistFactor * Math.PI;
    //         const sin = Math.sin(theta);
    //         const cos = Math.cos(theta);
    //         let xp = newX * cos - newY * sin;
    //         let yp = newY * cos + newX * sin;

    //         xp = Math.floor(xp + halfWidth);
    //         yp = Math.floor(yp + halfHeight);

    //         let red = 58 * alpha;
    //         let green = 44 * alpha;
    //         let blue = 79 * alpha;
    //         let a = (alpha == 0) ? 0 : 255;

    //         ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${a})`;
    //         ctx.fillRect(toGrid(xp), toGrid(yp),      10, 10);
    //         ctx.fillRect(toGrid(xp + 10), toGrid(yp), 10, 10);
    //         ctx.fillRect(toGrid(xp), toGrid(yp + 10), 10, 10);
    //         ctx.fillRect(toGrid(xp - 10), toGrid(yp), 10, 10);
    //         ctx.fillRect(toGrid(xp), toGrid(yp - 10), 10, 10);
    //     }
    // }
    return canvas;
};