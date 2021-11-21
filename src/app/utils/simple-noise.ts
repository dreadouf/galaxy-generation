import FastNoise from 'fastnoise-lite';
import { clamp } from './utils';

export class SimpleNoise {
    public width: number;
    public height: number;
    public noise: FastNoise;
    public data: Float32Array;


    constructor(seed: number, width: number, height: number, custom: {noiseType?: string, frequency?: number, lacunarity?: number, octaves?: number, gain?: number, strength?: number} = {}) {
        this.width = width;
        this.height = height;
        this.data = new Float32Array(this.width * this.height);
        this.noise = new FastNoise(seed);
        const params = {
            noiseType: FastNoise.NoiseType.OpenSimplex2S,
            frequency: 0.007,
            octaves: 5,
            lacunarity: 2.0,
            gain: 0.6,
            strength: 0 
        };
        Object.assign(params, custom);
        this.noise.SetNoiseType(params.noiseType);
        this.noise.SetFrequency(params.frequency);

        this.noise.SetFractalType(FastNoise.FractalType.FBm);
        this.noise.SetFractalOctaves(params.octaves);
        this.noise.SetFractalLacunarity(params.lacunarity);
        this.noise.SetFractalGain(params.gain);
        this.noise.SetFractalWeightedStrength(params.strength);

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

    toCanvas(): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');
        // ctx.fillStyle = 'black';
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for(let x = 0; x < canvas.width; x++) {
            for(let y = 0; y < canvas.height; y++) {
                const idx = x + y * canvas.width;
                let tint = Math.round(255 * this.data[idx]);
                data[idx * 4] = tint;
                data[idx * 4 + 1] = tint;
                data[idx * 4 + 2] = tint;
                data[idx * 4 + 3] = 127;
            }
        }

        ctx.putImageData(imgData, 0, 0);
        return canvas;
    }
}
