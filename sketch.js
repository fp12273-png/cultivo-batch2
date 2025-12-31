// =========================================
// LABORATORIO VIRTUAL - CULTIVO BATCH
// SIMULADOR REALISTA E INTERACTIVO (p5.js)
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

// ---------- SLIDERS ----------
let sliderX0, sliderS0, sliderMu;

// ---------- BOTONES ----------
let btnStart, btnReset;

// ---------- DATOS PARA GRAFICAS ----------
let Xv = [];
let Sv = [];
let Pv = [];

function setup() {
  createCanvas(1100, 600);
  resetSimulation();

  sliderX0 = new Slider(40, 150, 220, 0.05, 1.0, X0, "Biomasa inicial (X₀)", "g/L");
  sliderS0 = new Slider(40, 230, 220, 5, 40, S0, "Sustrato inicial (S₀)", "g/L");
  sliderMu = new Slider(40, 310, 220, 0.1, 0.8, muMax, "μ máx", "h⁻¹");

  btnStart = new Button(40, 360, 100, 35, "START");
  btnReset = new Button(160, 360, 100, 35, "RESET");
}

function draw() {
  background(230);

  drawPanel();
  drawReactor();
  drawGraphs();

  sliderX0.display();
  sliderS0.display();
  sliderMu.display();

  btnStart.display();
  btnReset.display();

  if (running) updateModel();
}

// ---------- MODELO BATCH ----------
function updateModel() {

  // ⛔ Si el sustrato se acabó, detener TODO
  if (S <= 0) {
    S = 0;
    running = false;
    return; // ← ESTO es lo que faltaba
  }

  let mu = muMax * S / (Ks + S);

  X += mu * X * dt;
  S -= (1.0 / Yxs) * mu * X * dt;
  P += Ypx * mu * X * dt;

  Xv.push(X);
  Sv.push(S);
  Pv.push(P);

  angle += 0.1;
}


// ---------- REACTOR ----------
function drawReactor() {
  push();
  translate(650, 50);

  noStroke();
  fill(140, 140, 140, 60);
  rect(8, 8, 260, 370, 45);

  stroke(0);
  strokeWeight(2);
  fill(200);
  rect(0, 0, 260, 370, 45);

  fill(170);
  rect(20, -25, 220, 35, 20);

  fill(70, 160, 220);
  rect(15, 120, 230, 240, 35);

  noStroke();
  fill(255, 255, 255, 60);
  rect(20, 20, 18, 330, 30);

  stroke(70);
  strokeWeight(4);
  line(130, 10, 130, 350);

  push();
  translate(130, 250);
  rotate(angle);
  stroke(40);
  strokeWeight(4);
  line(-55, 0, 55, 0);
  line(0, -45, 0, 45);
  line(-40, -25, 40, 25);
  pop();

  pop();

  fill(0);
  textAlign(CENTER);
  textSize(14);
  text("BIORREACTOR BATCH", 780, 47);
}

// ---------- PANEL ----------
function drawPanel() {
  textAlign(LEFT);
  fill(40);
  textSize(15);
  text("PANEL DE CONTROL", 110, 100);

  fill(0);
  textSize(13);
  text("Valores actuales del proceso:", 40, 420);
  text("Biomasa (X):   " + nf(X, 1, 2) + " g/L", 40, 445);
  text("Sustrato (S):  " + nf(S, 1, 2) + " g/L", 40, 470);
  text("Producto (P):  " + nf(P, 1, 2) + " g/L", 40, 495);

  fill(90);
  text("Sistema batch – sin entradas ni salidas", 670, 550);

  fill(60);
  textSize(10);
  text("Indicaciones:", 360, 80);
  text("1. Ajuste X₀ y S₀ antes de iniciar la simulación.", 360, 100);
  text("2. μ máx controla la rapidez del crecimiento microbiano.", 360, 120);
  text("3. Observe las fases: latencia, exponencial y estacionaria.", 360, 140);
  text("4. Analice cómo el agotamiento del sustrato afecta la biomasa.", 360, 160);
}

// ---------- GRAFICAS ----------
function drawGraphs() {
  let gx = 310, gy = 430, gw = 740, gh = 150;

  fill(255);
  stroke(0);
  strokeWeight(2);
  rect(gx, gy, gw, gh);

  strokeWeight(1);
  line(gx, gy, gx, gy + gh);
  line(gx, gy + gh, gx + gw, gy + gh);

  fill(0);
  textAlign(CENTER);
  text("Tiempo (h)", gx + gw / 2, gy + gh + 15);

  push();
  translate(gx - 30, gy + gh / 2);
  rotate(-HALF_PI);
  text("Concentración (g/L)", 0, 0);
  pop();

  drawCurve(Xv, gx, gy, gh, color(0, 160, 0), 4);
  drawCurve(Sv, gx, gy, gh, color(200, 40, 40), 4);
  drawCurve(Pv, gx, gy, gh, color(40, 40, 200), 4);

  let lx = gx + 20;
  let ly = gy + 15;

  fill(0, 160, 0);
  rect(lx, ly, 14, 14);
  fill(0);
  textAlign(LEFT);
  text("Biomasa (X)", lx + 20, ly + 12);

  fill(200, 40, 40);
  rect(lx + 140, ly, 14, 14);
  fill(0);
  text("Sustrato (S)", lx + 160, ly + 12);

  fill(40, 40, 200);
  rect(lx + 280, ly, 14, 14);
  fill(0);
  text("Producto (P)", lx + 300, ly + 12);
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
  P = 0;

  muMax = sliderMu ? sliderMu.value : muMax;

  Xv = [];
  Sv = [];
  Pv = [];

  running = false;
}

// ---------- MOUSE ----------
function mousePressed() {
  sliderX0.check();
  sliderS0.check();
  sliderMu.check();

  if (btnStart.over()) {
    resetSimulation();
    running = true;
  }

  if (btnReset.over()) resetSimulation();
}

function mouseDragged() {
  sliderX0.update();
  sliderS0.update();
  sliderMu.update();
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
    fill(0);
    textAlign(LEFT);
    text(this.label, this.x, this.y - 15);

    stroke(0);
    line(this.x, this.y, this.x + this.w, this.y);

    let px = map(this.value, this.minV, this.maxV, this.x, this.x + this.w);
    fill(80);
    ellipse(px, this.y, 14, 14);

    fill(0);
    text(nf(this.value, 1, 2) + " " + this.unit, this.x + this.w + 15, this.y + 5);
  }

  check() {
    let px = map(this.value, this.minV, this.maxV, this.x, this.x + this.w);
    if (dist(mouseX, mouseY, px, this.y) < 10) this.drag = true;
  }

  update() {
    if (this.drag) {
      let nx = constrain(mouseX, this.x, this.x + this.w);
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
    fill(0);
    textAlign(CENTER, CENTER);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }

  over() {
    return mouseX > this.x && mouseX < this.x + this.w &&
           mouseY > this.y && mouseY < this.y + this.h;
  }
}
