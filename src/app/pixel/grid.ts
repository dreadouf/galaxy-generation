
const CELL_SIZE = 10;

export class Cell {
    public x: number = 0;
    public y: number = 0;
    public red: number = 0;
    public green: number = 0;
    public blue: number = 0;
    public alpha: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getColor(): string {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    }
}

export class Grid {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    public cells: Cell[][];

    constructor(width, height) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        this.cells = [];
        for(let i = 0; i < width / CELL_SIZE; i++) {
            if(!this.cells[i]) {
                this.cells[i] = []
            }
            for(let j = 0; j < height / CELL_SIZE; j ++) {
                this.cells[i].push(new Cell(i * CELL_SIZE, j * CELL_SIZE));
            }
        }
    }

    getCellOfPixel(x: number, y: number): Cell {
        const i = Math.floor(x / CELL_SIZE);
        const j = Math.floor(y / CELL_SIZE);
        return this.cells[i][j];
    }

    draw() {
        this.cells.forEach(cellRow => {
            cellRow.forEach(cell => {
                this.ctx.fillStyle = cell.getColor();
                this.ctx.fillRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);
            });
        })
    }
}