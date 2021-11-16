import FastNoise from "fastnoise-lite";

export class Noise {
    public width: number;
    public height: number;
    public noise: FastNoise;
    public data: Float32Array;
    public scale: number;


    constructor(seed: number, width: number, height: number) {
        this.width = width;
        this.height = height;
        this.data = new Float32Array(this.width * this.height);
        this.noise = new FastNoise(seed);
        this.noise.SetNoiseType(FastNoise.NoiseType.OpenSimplex2);
        this.noise.SetFrequency(0.007);

        this.noise.SetFractalType(FastNoise.FractalType.FBm);
        this.noise.SetFractalOctaves(5);
        this.noise.SetFractalLacunarity(2.0);
        this.noise.SetFractalGain(0.7);
        this.noise.SetFractalWeightedStrength(0.3);

        this.generate();
    }

    generate() {
        let minN: number = Number.MAX_VALUE;
        let maxN: number = Number.MIN_VALUE;
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                let index = x + y * this.width;
                let noise = this.noise.GetNoise(x, y);
                minN = Math.min(minN, noise);
                maxN = Math.max(maxN, noise);
                this.data[index] = noise;
            }
        }
        let scale = maxN - minN;
        // normalize
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                let index = x + y * this.width;
                this.data[index] = (this.data[index] - minN) / scale;
            }
        }
    }

    getNoise(x: number, y: number): number {
        let index = x + y * this.width;
        return Math.round(this.clamp(255 * this.data[index], 0, 255));
    }

    private clamp(num: number, min: number = 0, max: number = this.width * this.height) {
        return Math.min(Math.max(num, min), max);
    }

    public twist(twistFactor: number) {
        const twistedData = new Float32Array(this.width * this.height);
        const half_width = Math.floor(this.width / 2);
        const half_height = Math.floor(this.height / 2);
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++){ 

                let new_x = x - half_width;
                let new_y = y - half_height;

                let percent = ((half_width - Math.sqrt(new_x * new_x + new_y * new_y)) / half_width);
                let theta = percent * percent * twistFactor * Math.PI;
                let sin = Math.sin(theta);
                let cos = Math.cos(theta);
                let xp = new_x * cos - new_y * sin;
                let yp = new_y * cos + new_x * sin;

                xp = Math.floor(xp + half_width);
                yp = Math.floor(yp + half_height);

                let idx = this.clamp(x + y * this.width);
                let new_idx = this.clamp(xp + yp * this.width);
                let new_idx_left = this.clamp(new_idx + 1);
                let new_idx_right = this.clamp(new_idx - 1);
                let new_idx_top = this.clamp(new_idx - this.width);
                let new_idx_bottom = this.clamp(new_idx + this.width);
                twistedData[new_idx] = this.data[idx];
                twistedData[new_idx_left] = this.data[idx];
                twistedData[new_idx_right] = this.data[idx];
                twistedData[new_idx_top] = this.data[idx];
                twistedData[new_idx_bottom] = this.data[idx];
            }
        }
        this.data = twistedData;
    }

    public mask() {
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                let idx = x + y * this.width;
                let dx = x - this.width / 2;
                let dy = y - this.height / 2;
                // let distFromCenter = 2 * Math.sqrt(dx * dx + dy * dy) / (4 * this.height) + 0.25;
                // let maskFactor = this.clamp(1 * Math.sin(distFromCenter * 2 * Math.PI), 0, 1);
                let distFromCenter = 2 * Math.sqrt(dx * dx + dy * dy) / (this.height);
                // let maskFactor = this.clamp(Math.exp(-3 * distFromCenter) - 0.05, 0, 1);
                // let maskFactor = this.clamp(Math.exp(-2 * distFromCenter) - 0.14, 0, 1);
                // let maskFactor = this.clamp(Math.exp(-8 * distFromCenter) - 0.0004, 0, 1);
                let maskFactor = this.clamp(40 * Math.exp(-8 * distFromCenter) - 0.015, 0, 1);
                let value = (this.data[idx] * maskFactor);
                // value = (value < 0.001) ? 0 : this.clamp(value * 2, 0, 1);
                this.data[idx] = value;
            }
        }
    }
}