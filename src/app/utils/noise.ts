import FastNoise from 'fastnoise-lite';
import { clamp } from './utils';

export class Noise {
    public width: number;
    public height: number;
    public noise: FastNoise;
    public data: Float32Array;
    public scale: number;


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
        return Math.floor(clamp(255 * this.data[index], 0, 255));
    }

    getNoiseAlpha(x: number, y: number) : number {
        const index = x + y * this.width;
        return this.data[index];
    }


    public twist(twistFactor: number) {
        const twistedData = new Float32Array(this.width * this.height);
        const halfWidth = Math.floor(this.width / 2);
        const halfHeight = Math.floor(this.height / 2);
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                const newX = x - halfWidth;
                const newY = y - halfHeight;

                const percent = ((halfWidth - Math.sqrt(newX * newX + newY * newY)) / halfWidth);
                const theta = percent * percent * twistFactor * Math.PI;
                const sin = Math.sin(theta);
                const cos = Math.cos(theta);
                let xp = newX * cos - newY * sin;
                let yp = newY * cos + newX * sin;

                xp = Math.floor(xp + halfWidth);
                yp = Math.floor(yp + halfHeight);

                const idx = clamp(x + y * this.width, 0, this.data.length);
                const newIdx = clamp(xp + yp * this.width, 0, this.data.length);
                const newIdxLeft = clamp(newIdx + 1, 0, this.data.length);
                const newIdxRight = clamp(newIdx - 1, 0, this.data.length);
                const newIdxTop = clamp(newIdx - this.width, 0, this.data.length);
                const newIdxBottom = clamp(newIdx + this.width, 0, this.data.length);
                twistedData[newIdx] = this.data[idx];
                twistedData[newIdxLeft] = this.data[idx];
                twistedData[newIdxRight] = this.data[idx];
                twistedData[newIdxTop] = this.data[idx];
                twistedData[newIdxBottom] = this.data[idx];
            }
        }
        this.data = twistedData;
    }

    public circularify(twistFactor: number) {
        const twistedData = new Float32Array(this.width * this.height);
        const halfWidth = Math.floor(this.width / 2);
        const halfHeight = Math.floor(this.height / 2);
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                const newX = x - halfWidth;
                const newY = y - halfHeight;

                const percent = ((halfWidth - Math.sqrt(newX * newX + newY * newY)) / halfWidth);
                const theta = percent * percent * twistFactor * Math.PI;
                const sin = Math.sin(theta);
                const cos = Math.cos(theta);
                let xp = newX * cos - newY * sin;
                let yp = newY * cos + newX * sin;

                xp = Math.floor(xp + halfWidth);
                yp = Math.floor(yp + halfHeight);

                const idx = clamp(x + y * this.width, 0, this.data.length);
                const newIdx = clamp(xp + yp * this.width, 0, this.data.length);
                const newIdxLeft = clamp(newIdx + 1, 0, this.data.length);
                const newIdxRight = clamp(newIdx - 1, 0, this.data.length);
                const newIdxTop = clamp(newIdx - this.width, 0, this.data.length);
                const newIdxBottom = clamp(newIdx + this.width, 0, this.data.length);
                twistedData[newIdx] = this.data[idx];
                twistedData[newIdxLeft] = this.data[idx];
                twistedData[newIdxRight] = this.data[idx];
                twistedData[newIdxTop] = this.data[idx];
                twistedData[newIdxBottom] = this.data[idx];
            }
        }
        this.data = twistedData;
    }
}
