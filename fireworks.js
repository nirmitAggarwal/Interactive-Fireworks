let fireworks = [];
let gravity;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('fireworksCanvas');
    colorMode(HSB);
    gravity = createVector(0, 0.2);
    stroke(255);
    strokeWeight(4);
    background(0);
}

function draw() {
    colorMode(RGB);
    background(0, 0, 0, 25);
    if (random(1) < 0.03) {
        fireworks.push(new Firework());
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].show();
        if (fireworks[i].done()) {
            fireworks.splice(i, 1);
        }
    }
}

function mousePressed() {
    fireworks.push(new Firework(mouseX, mouseY));
}

class Firework {
    constructor(sx, sy) {
        this.hu = random(255);
        this.firework = new Particle(sx || random(width), sy || height, this.hu, true);
        this.exploded = false;
        this.particles = [];
    }

    done() {
        return this.exploded && this.particles.length === 0;
    }

    update() {
        if (!this.exploded) {
            this.firework.applyForce(gravity);
            this.firework.update();

            if (this.firework.vel.y >= 0) {
                this.exploded = true;
                this.explode();
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].applyForce(gravity);
            this.particles[i].update();
            if (this.particles[i].done()) {
                this.particles.splice(i, 1);
            }
        }
    }

    explode() {
        for (let i = 0; i < 100; i++) {
            let p = new Particle(this.firework.pos.x, this.firework.pos.y, this.hu, false);
            this.particles.push(p);
        }
    }

    show() {
        if (!this.exploded) {
            this.firework.show();
        }

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].show();
        }
    }
}

class Particle {
    constructor(x, y, hu, firework) {
        this.pos = createVector(x, y);
        this.firework = firework;
        this.lifespan = 255;
        this.hu = hu;

        if (this.firework) {
            this.vel = createVector(0, random(-12, -8));
        } else {
            this.vel = p5.Vector.random2D();
            this.vel.mult(random(2, 10));
        }
        this.acc = createVector(0, 0);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        if (!this.firework) {
            this.vel.mult(0.9);
            this.lifespan -= 4;
        }
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    done() {
        return this.lifespan < 0;
    }

    show() {
        colorMode(HSB);

        if (!this.firework) {
            strokeWeight(2);
            stroke(this.hu, 255, 255, this.lifespan);
        } else {
            strokeWeight(4);
            stroke(this.hu, 255, 255);
        }

        point(this.pos.x, this.pos.y);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
