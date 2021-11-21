import { Noise } from './noise';
import { clamp } from './utils';

export const createCircularMask = (width: number, height: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            const idx = (x + y * width) * 4;
            const dx = x - width / 2;
            const dy = y - height / 2;
            const distFromCenter = 2 * Math.sqrt(dx * dx + dy * dy) / (height);
            // const maskFactor = 40 * Math.exp(-8 * distFromCenter) - 0.015;
            const maskFactor = 20 * Math.exp(-3 * distFromCenter - 2) - 0.15;
            data[idx + 3] = Math.floor(clamp(255 * maskFactor, 0, 255));
        }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
};

export const createGalaxyLayer = (width: number, height: number, seed: number, red: number, green: number, blue: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
    ctx.fillRect(0, 0, width, height);
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const noise = new Noise(seed, width, height);
    noise.twist(1.1);
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            const idx = (x + y * width) * 4;
            data[idx + 3] = noise.getNoise(x, y);
        }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
};

export const createLayer = (width: number, height: number, seed: number, red: number, green: number, blue: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
    ctx.fillRect(0, 0, width, height);
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const noise = new Noise(seed, width, height);
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            const idx = (x + y * width) * 4;
            data[idx + 3] = noise.getNoise(x, y);
        }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
};

export const createBackground = (width: number, height: number, seed: number, red: number, green: number, blue: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
    ctx.fillRect(0, 0, width, height);
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const noise = new Noise(seed, width, height, 0.003, 5, 0.6, 1.2);
    // noise.twist(1.1);
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            const idx = (x + y * width) * 4;
            data[idx + 3] = Math.floor(0.25 * noise.getNoise(x, y));
        }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
}

export const createCentralLight = (width: number, height: number, seed: number, red: number, green: number, blue: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const noise = new Noise(seed, width, height, 0.005, 5, 0.7, 0.3);
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            const idx = (x + y * width) * 4;
            const dx = x - width / 2;
            const dy = y - height / 2;
            const distFromCenter = 6.5 * Math.sqrt(dx * dx + dy * dy) / (height);
            const maskFactor = clamp(40 * Math.exp(-8 * distFromCenter) - 0.015, 0, 0.9);
            data[idx] = red;
            data[idx + 1] = green;
            data[idx + 2] = blue;
            data[idx + 3] = Math.floor(clamp(noise.getNoise(x, y) * maskFactor, 0, 200));
        }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
};

