// =========================================
// LABORATORIO VIRTUAL - CULTIVO BATCH
// p5.js – SIMULADOR INTERACTIVO
// =========================================

// ---------- VARIABLES DEL PROCESO ----------
let X, S, P;
let muMax = 0.4;
let Ks = 0.5;
let Yxs = 0.5;
let Ypx = 0.2;

let X0 = 0.1;
let S0 = 20;

let dt = 0.03;
let running = false;
let angle = 0;
let t = 0;

// ---------- ESCALA ----------
let scaleFactor = 1;

// ---------- SLIDERS ----------
let sliderX0, sliderS0, sliderMu;

// ---------- BOTONES ----------
let btnStart, btnReset;

// ---------- DATOS ----------
let Xv = [];
let Sv = [];
let Pv = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  textFont("Arial");
  resetSimulation();

  sliderX0 = new Slider(60, 150, 220, 0.05, 1.0, X0, "Biomasa inicial (X₀)", "g/L");
  sliderS0 = new Slider(60, 230, 220, 5, 40, S0, "Sustrato inicial (S₀)", "g/L");
  sliderMu = new Slider(60, 310, 220, 0.1, 0.8, muMax, "μ máx", "h⁻¹");

  btnStart = new Button(60, 360, 100, 35, "START");
  btnReset = new Button(160, 360, 100, 35, "RESET");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ---------- LOOP PRINCIPAL ----------
function draw() {
  background(235);

  scaleFactor = min(width / 1100, height / 600);
  push();
  scale(scaleFactor);

  drawPanel();
  drawReactor();
  drawGraphs();

  sliderX0.display();
  sliderS0.display();
  sliderMu.display();

  btnStart.display();
  btnReset.display();

  pop();

  if (running) updateModel();
}

// ---------- MODELO BATCH ----------
function updateModel() {
  if (S <= 0) {
    S = 0;
    running = false;
    return;
  }

  let mu = muMax * S / (Ks + S);

  X += mu * X * dt;
  S -= (1 / Yxs) * mu * X * dt;
  P += Ypx * mu * X * dt;

  Xv.push(X);
  Sv.push(S);
  Pv.push(P);

  angle += 0.1;
  t += dt;
}

// ---------- REACTOR ----------
function drawReactor() {
  push();
  translate(650, 50);

  fill(160, 160, 160, 50);
  rect(8, 8, 260, 370, 45);

  stroke(60);
  strokeWeight(2);
  fill(210);
  rect(0, 0, 260, 370, 45);

  fill(180);
  rect(20, -25, 220, 35, 20);

  fill(70, 160, 220);
  rect(15, 120, 230, 240, 35);

  noStroke();
  fill(255, 255, 255, 60);
  rect(20, 20, 18, 330, 30);

  stroke(80);
  strokeWeight(4);
  line(130, 10, 130, 350);

  push();
  translate(130, 250);
  rotate(angle);
  stroke(40);
  strokeWeight(4);
  line(-55, 0, 55, 0);
  line(0, -45, 0, 45);
  pop();

  pop();

  fill(40);
  textAlign(CENTER);
  textSize(14);
  text("BIORREACTOR BATCH", 780, 47);
}

// ---------- PANEL ----------
function drawPanel() {
  fill(40);
  textAlign(LEFT);
  textSize(15);
  text("PANEL DE CONTROL", 40, 100);

  textSize(13);
  text("Valores actuales:", 40, 420);
  text("Biomasa (X):  " + nf(X, 1, 2) + " g/L", 40, 445);
  text("Sustrato (S): " + nf(S, 1, 2) + " g/L", 40, 470);
  text("Producto (P): " + nf(P, 1, 2) + " g/L", 40, 495);
  text("Tiempo: " + nf(t, 1, 1) + " h", 40, 520);

  textSize(11);
  fill(60);
  text("Indicaciones:", 360, 80);
  text("• Ajuste X₀, S₀ y μ antes de iniciar.", 360, 100);
  text("• El sistema es cerrado (batch).", 360, 120);
  text("• Observe el agotamiento del sustrato.", 360, 140);
}

// ---------- GRAFICAS ----------
function drawGraphs() {
  let gx = 310, gy = 430, gw = 740, gh = 150;

  fill(255);
  stroke(80);
  strokeWeight(2);
  rect(gx, gy, gw, gh);

  strokeWeight(1);
  line(gx, gy, gx, gy + gh);
  line(gx, gy + gh, gx + gw, gy + gh);

  fill(40);
  textAlign(CENTER);
  text("Tiempo (h)", gx + gw / 2, gy + gh + 15);

  push();
  translate(gx - 30, gy + gh / 2);
  rotate(-HALF_PI);
  text("Concentración (g/L)", 0, 0);
  pop();

  drawCurve(Xv, gx, gy, gh, color(0, 160, 0), 4);
  drawCurve(Sv, gx, gy, gh, color(200, 60, 60), 4);
  drawCurve(Pv, gx, gy, gh, color(60, 60, 200), 4);

  let lx = gx + 20;
  let ly = gy + 15;

  fill(0, 160, 0); rect(lx, ly, 14, 14);
  fill(40); text("Biomasa (X)", lx + 20, ly + 12);

  fill(200, 60, 60); rect(lx + 140, ly, 14, 14);
  fill(40); text("Sustrato (S)", lx + 160, ly + 12);

  fill(60, 60, 200); rect(lx + 280, ly, 14, 14);
  fill(40); text("Producto (P)", lx + 300, ly + 12);
}

function drawCurve(data, x, y, h, c, scale) {
  stroke(c);
  noFill();
  beginShape();
  for (let i = 0; i < data.length; i++) {
    vertex(x + i, y + h - data[i] * scale);
  }
  endShape();
}

// ---------- RESET ----------
function resetSimulation() {
  X = sliderX0 ? sliderX0.value : X0;
  S = sliderS0 ? sliderS0.value : S0;
  muMax = sliderMu ? sliderMu.value : muMax;
  P = 0;
  t = 0;

  Xv = [];
  Sv = [];
  Pv = [];

  running = false;
}

// ---------- MOUSE ----------
function mousePressed() {
  let mx = mouseX / scaleFactor;
  let my = mouseY / scaleFactor;

  sliderX0.check(mx, my);
  sliderS0.check(mx, my);
  sliderMu.check(mx, my);

  if (btnStart.over(mx, my)) {
    resetSimulation();
    running = true;
  }

  if (btnReset.over(mx, my)) resetSimulation();
}

function mouseDragged() {
  let mx = mouseX / scaleFactor;
  sliderX0.update(mx);
  sliderS0.update(mx);
  sliderMu.update(mx);
}

function mouseReleased() {
  sliderX0.release();
  sliderS0.release();
  sliderMu.release();
}

// ---------- CLASES ----------
class Slider {
  constructor(x, y, w, minV, maxV, v, label, unit) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.minV = minV;
    this.maxV = maxV;
    this.value = v;
    this.label = label;
    this.unit = unit;
    this.drag = false;
  }

  display() {
    fill(40);
    text(this.label, this.x, this.y - 15);

    stroke(80);
    line(this.x, this.y, this.x + this.w, this.y);

    let px = map(this.value, this.minV, this.maxV, this.x, this.x + this.w);
    fill(90);
    ellipse(px, this.y, 14, 14);

    fill(40);
    text(nf(this.value, 1, 2) + " " + this.unit, this.x + this.w + 15, this.y + 5);
  }

  check(mx, my) {
    let px = map(this.value, this.minV, this.maxV, this.x, this.x + this.w);
    if (dist(mx, my, px, this.y) < 10) this.drag = true;
  }

  update(mx) {
    if (this.drag) {
      let nx = constrain(mx, this.x, this.x + this.w);
      this.value = map(nx, this.x, this.x + this.w, this.minV, this.maxV);
    }
  }

  release() {
    this.drag = false;
  }
}

class Button {
  constructor(x, y, w, h, label) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
  }

  display() {
    fill(180);
    rect(this.x, this.y, this.w, this.h, 8);
    fill(40);
    textAlign(CENTER, CENTER);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }

  over(mx, my) {
    return mx > this.x && mx < this.x + this.w &&
           my > this.y && my < this.y + this.h;
  }
}
