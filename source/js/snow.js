class SnowFall {
    constructor({maxFlake = 200, flakeSize = 10, fallSpeed = 1} = {}) {
        this.maxFlake = maxFlake;
        this.flakeSize = flakeSize;
        this.fallSpeed = fallSpeed;
    }

    start() {
        this.createCanvas();
        this.createFlakes();
        this.drawSnow();
    }

    createCanvas() {
        const snowcanvas = document.createElement("canvas");
        snowcanvas.id = "snowfall";
        snowcanvas.width = document.body.clientWidth;
        snowcanvas.height = document.body.clientHeight;
        snowcanvas.setAttribute("style", "position:absolute; top: 0; left: 0; z-index: 1; pointer-events: none;");
        document.body.appendChild(snowcanvas);
        this.canvas = snowcanvas;
        this.ctx = snowcanvas.getContext("2d");
        window.onresize = () => {
            snowcanvas.width = document.body.clientWidth;
            snowcanvas.height = document.body.clientHeight;
        }
    }

    createFlakes() {
        this.flakes = Array.from({length: this.maxFlake}, () => new FlakeMove(this.canvas.width, this.canvas.height, this.flakeSize, this.fallSpeed));
    }

    drawSnow() {
        requestAnimationFrame(() => this.drawSnow());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let flake of this.flakes) {
            flake.update();
            flake.render(this.ctx);
        }
    }
}

class FlakeMove {
    constructor(canvasWidth, canvasHeight, flakeSize, fallSpeed) {
        this.x = Math.floor(Math.random() * canvasWidth);
        this.y = Math.floor(Math.random() * canvasHeight);
        this.size = Math.random() * flakeSize + 2;
        this.maxSize = flakeSize;
        this.speed = Math.random() + fallSpeed;
        this.fallSpeed = fallSpeed;
        this.velY = this.speed;
        this.velX = 0;
        this.stepSize = Math.random() / 30;
        this.step = 0;
    }

    update() {
        this.velX *= 0.98;
        if (this.velY <= this.speed) {
            this.velY = this.speed;
        }
        this.velX += Math.cos(this.step += .05) * this.stepSize;
        this.y += this.velY;
        this.x += this.velX;
        if (this.x >= this.canvas.width || this.x <= 0 || this.y >= this.canvas.height || this.y <= 0) {
            this.reset(this.canvas.width);
        }
    }

    reset(width) {
        this.x = Math.floor(Math.random() * width);
        this.y = 0;
        this.size = Math.random() * this.maxSize + 2;
        this.speed = Math.random() + this.fallSpeed;
        this.velY = this.speed;
        this.velX = 0;
    }

    render(ctx) {
        const snowFlake = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        snowFlake.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        snowFlake.addColorStop(.5, "rgba(255, 255, 255, 0.5)");
        snowFlake.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = snowFlake;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const snow = new SnowFall({maxFlake: 200, flakeSize: 10, fallSpeed: 1});
snow.start();