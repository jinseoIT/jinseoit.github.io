---
title: Canvas 적용하며 알아보기
description: Canvas를 설정하고 적용하며 알아가보자
author: "jinseoit"
image: "https://i.namu.wiki/i/DYRmm5oZ1n9UjS933J9oewBwNfnJYhXzHXp-82cj4CtZS48tx3dH3L9_sZ4-ntSydX_ZA6e4RHjphejMzQa5FCYO0cL6MCbjtXuy6znyfdE9oo0gnTC2zaukIJm9wKabBwBzLaQ9deHM3ntf2ttGmg.svg"
published: 2026-02-21
tags: [canvas]
draft: true
---

# HTML5 Canvas 알아보기

> Canvas는 단순한 도형 그리기부터 데이터 시각화, 게임 개발까지 폭넓게 활용되는 웹 그래픽 도구다. 이 글에서는 핵심 개념부터 실무에서 자주 마주치는 고급 테크닉까지 알아본다.

---

## 1. 기초 설정

### HTML 구조

```html
<canvas id="myCanvas" width="800" height="600"></canvas>
```

### JavaScript 초기화

```javascript
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// 고해상도 디스플레이 대응
const dpr = window.devicePixelRatio || 1;

canvas.width = 800 * dpr;
canvas.height = 600 * dpr;
canvas.style.width = "800px";
canvas.style.height = "600px";

ctx.scale(dpr, dpr);
```

> **💡 실무 팁** `devicePixelRatio`를 반드시 고려해서 설정하자. Retina 디스플레이에서 텍스트와 선이 흐릿하게 보이는 문제를 방지할 수 있다.

---

## 2. 기본 도형과 경로

Canvas에서 도형을 그리는 방식은 DOM과 근본적으로 다르다. Canvas는 **경로(path)** 라는 개념을 중심으로 동작한다. 경로란 "아직 화면에 그려지지 않은 좌표들의 집합"이다. `beginPath()`로 새 경로를 열고, `moveTo()` / `lineTo()` / `arc()` 등으로 점을 이어나간 뒤, 마지막에 `stroke()`나 `fill()`을 호출해야 비로소 화면에 나타난다.

`beginPath()`를 빠뜨리면 이전 경로가 그대로 남아있어, 의도치 않은 선이 함께 그려지는 버그가 발생한다. 새 도형을 그릴 때는 항상 `beginPath()`로 시작하자.

### 직선과 경로

```javascript
// 기본 선 그리기
ctx.beginPath(); // 새 경로 시작 — 이전 경로를 초기화한다
ctx.moveTo(50, 50); // 펜을 들어 (50, 50)으로 이동 (선을 긋지 않음)
ctx.lineTo(200, 100); // (200, 100)까지 선을 추가
ctx.stroke(); // 경로를 실제로 화면에 그린다

// 닫힌 경로 (삼각형)
ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(150, 50);
ctx.lineTo(200, 100);
ctx.closePath(); // 마지막 점에서 시작점으로 자동으로 선을 닫는다
ctx.fill(); // 경로 내부를 채운다
```

### 원과 곡선

`arc(x, y, radius, startAngle, endAngle)` 메서드는 중심점과 반지름으로 원호를 그린다. 각도는 **라디안** 단위를 사용한다. 완전한 원은 `0`에서 `2 * Math.PI`(약 6.28)까지다.

베지어 곡선은 제어점(control point)을 이용해 부드러운 곡선을 만든다. `bezierCurveTo`는 제어점 2개를 쓰는 3차 베지어 곡선으로, UI에서 부드러운 선을 그릴 때 자주 쓰인다.

```javascript
// 원 그리기
ctx.beginPath();
ctx.arc(150, 150, 50, 0, 2 * Math.PI); // (150, 150) 중심, 반지름 50, 완전한 원
ctx.fill();

// 3차 베지어 곡선
// bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY)
ctx.beginPath();
ctx.moveTo(200, 200); // 시작점
ctx.bezierCurveTo(250, 150, 300, 250, 350, 200); // 제어점1, 제어점2, 끝점
ctx.stroke();
```

---

## 3. 스타일링과 색상

### 기본 스타일 속성

```javascript
// 선 스타일
ctx.strokeStyle = "#ff6b6b";
ctx.lineWidth = 3;
ctx.lineCap = "round"; // 선 끝 모양: "butt" | "round" | "square"
ctx.lineJoin = "round"; // 꺾임 모양: "miter" | "round" | "bevel"

// 채우기 스타일
ctx.fillStyle = "#4ecdc4";

// 선형 그라디언트
const gradient = ctx.createLinearGradient(0, 0, 200, 0);
gradient.addColorStop(0, "#ff6b6b");
gradient.addColorStop(1, "#4ecdc4");
ctx.fillStyle = gradient;
```

### 그림자 효과

```javascript
ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
ctx.shadowBlur = 10;
ctx.shadowOffsetX = 5;
ctx.shadowOffsetY = 5;
```

---

## 4. 텍스트 렌더링

```javascript
// 폰트 설정
ctx.font = "24px Arial, sans-serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

// 텍스트 그리기
ctx.fillText("Hello Canvas", 400, 300);
ctx.strokeText("Outlined Text", 400, 350);

// 텍스트 너비 측정
const metrics = ctx.measureText("Hello Canvas");
console.log("텍스트 너비:", metrics.width);
```

---

## 5. 변형 (Transformation)

변형은 좌표계 자체를 이동하거나 회전시키는 개념이다. 예를 들어 `translate(100, 100)`을 호출하면, 이후에 그리는 모든 도형의 원점이 `(100, 100)`으로 옮겨진다. 도형의 좌표를 일일이 계산하는 대신 좌표계를 움직이는 방식이라서, 복잡한 위치 계산 없이 도형을 배치할 수 있다.

이 변형은 **누적**된다는 점이 중요하다. `translate(100, 100)`을 두 번 호출하면 원점이 `(200, 200)`이 된다. 이 때문에 변형을 쓸 때는 반드시 `save()` / `restore()`로 상태를 관리해야 한다.

### save() / restore() 동작 원리

Canvas 내부에는 상태를 저장하는 **스택**이 있다. `save()`를 호출하면 현재의 변형, 스타일, 클리핑 영역 등 모든 상태가 스택에 push된다. `restore()`를 호출하면 스택에서 pop해 이전 상태로 돌아간다. 여러 번 중첩해서 쓸 수 있으므로, 복잡한 드로잉 로직에서 각 단계의 상태를 독립적으로 유지할 수 있다.

### 기본 변형

```javascript
ctx.save(); // 현재 상태(변형, 스타일 등)를 스택에 push

ctx.translate(100, 100); // 원점을 (100, 100)으로 이동
ctx.rotate(Math.PI / 4); // 현재 원점을 기준으로 45도 회전
ctx.scale(1.5, 1.5); // 현재 원점을 기준으로 1.5배 확대

// 이 사각형은 (100, 100)으로 이동 후 45도 회전된 상태로 그려진다
ctx.fillRect(0, 0, 100, 100);

ctx.restore(); // 스택에서 pop — save() 이전 상태로 완전히 복원
// 이 이후의 드로잉에는 위의 변형이 전혀 영향을 주지 않는다
```

### 매트릭스 변형

`transform()`은 위의 이동/회전/크기 조절을 하나의 행렬로 한꺼번에 표현한다. 2D 변형은 3×3 행렬로 나타낼 수 있으며, `transform(a, b, c, d, e, f)`의 6개 인수가 그 행렬의 값에 해당한다.

```
[a  c  e]
[b  d  f]
[0  0  1]
```

```javascript
// transform(a, b, c, d, e, f)
// a: 수평 크기(scaleX)   b: 수직 기울이기(skewY)
// c: 수평 기울이기(skewX) d: 수직 크기(scaleY)
// e: 수평 이동(translateX) f: 수직 이동(translateY)

// 아래는 수평/수직 방향으로 0.2씩 기울이는 예시 (scale은 1 유지)
ctx.transform(1, 0.2, 0.2, 1, 0, 0);
```

> **⚠️ 주의** `save()` / `restore()`를 쌍으로 쓰지 않으면 변형 상태가 누적되어 예상치 못한 버그가 생긴다. 변형이 필요한 블록은 항상 이 패턴으로 감싸자.

---

## 6. 이미지 처리

### 이미지 로딩과 그리기

```javascript
const img = new Image();
img.onload = function () {
  ctx.drawImage(img, 0, 0); // 기본 그리기
  ctx.drawImage(img, 0, 0, 200, 150); // 크기 조절

  // 스프라이트 — 소스(sx, sy, sw, sh) → 대상(dx, dy, dw, dh)
  ctx.drawImage(img, 50, 50, 100, 100, 300, 300, 150, 150);
};
img.src = "image.jpg";
```

### 픽셀 조작

Canvas는 픽셀 단위로 이미지 데이터를 직접 읽고 쓸 수 있다. `getImageData()`는 지정한 영역의 픽셀 정보를 `Uint8ClampedArray` 형태로 반환한다. 이 배열은 픽셀마다 `[R, G, B, A]` 4개의 값(각 0~255)이 순서대로 나열되어 있다. 즉, 100×100 크기의 영역이라면 `100 * 100 * 4 = 40,000`개의 값이 담긴다.

값을 수정한 뒤에는 `putImageData()`로 반드시 다시 캔버스에 써줘야 반영된다.

```javascript
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data;
// data 구조: [R0, G0, B0, A0, R1, G1, B1, A1, ...]
// 각 픽셀은 4개 인덱스를 차지하므로 i += 4 씩 순회한다

// 흑백 필터: 각 픽셀의 RGB를 평균값으로 교체
for (let i = 0; i < data.length; i += 4) {
  const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
  data[i] = avg; // R
  data[i + 1] = avg; // G
  data[i + 2] = avg; // B
  // data[i + 3] — Alpha는 그대로 유지
}

ctx.putImageData(imageData, 0, 0); // 변경된 픽셀 데이터를 캔버스에 반영
```

---

## 7. 애니메이션 구현

Canvas 애니메이션의 핵심은 `requestAnimationFrame(rAF)`이다. `setInterval`과 달리 rAF는 브라우저의 **렌더링 타이밍에 맞춰** 콜백을 호출한다. 보통 1초에 60번(60fps), 고주사율 디스플레이에서는 최대 144번까지 호출된다. 탭이 비활성화되면 자동으로 멈춰서 불필요한 CPU 낭비가 없다는 것도 장점이다.

rAF 콜백에는 `DOMHighResTimeStamp` 타입의 `currentTime`이 인수로 전달된다. 이 값을 이용해 **직전 프레임과의 경과 시간(`deltaTime`)** 을 계산하면, 프레임 속도가 달라져도 애니메이션 속도가 일정하게 유지된다. 속도를 `px/frame`이 아니라 `px/ms`로 정의하는 것이 핵심이다.

### requestAnimationFrame 기반 루프

```javascript
class CanvasAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.isRunning = false;
    this.lastTime = 0;
    this.objects = [];
  }

  start() {
    this.isRunning = true;
    requestAnimationFrame(this.animate.bind(this));
  }

  stop() {
    this.isRunning = false;
  }

  animate(currentTime = 0) {
    if (!this.isRunning) return;

    // 직전 프레임 이후 경과 시간 (ms 단위)
    // 60fps 환경에서는 약 16.67ms, 30fps에서는 약 33ms
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // 매 프레임 전체를 지우고 다시 그린다 — Canvas의 핵심 패턴
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.objects.forEach((obj) => {
      obj.update(deltaTime); // 위치/상태를 deltaTime 기반으로 갱신
      obj.draw(this.ctx); // 갱신된 상태로 그리기
    });

    // 다음 프레임을 예약 — 이 구조가 무한 루프를 만든다
    requestAnimationFrame(this.animate.bind(this));
  }
}
```

### 볼 바운스 예시

`deltaTime`을 활용하면 60fps 환경과 30fps 환경에서 공이 같은 속도로 움직인다. `vx`, `vy`의 단위를 `px/ms`로 정의하고 매 프레임 `deltaTime`을 곱해 이동 거리를 계산하는 것이 포인트다.

```javascript
class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    // 속도 단위: px/ms — deltaTime과 곱해 실제 이동 거리를 계산
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.gravity = 0.0003; // 매 ms마다 vy에 더해지는 중력 가속도
    this.friction = 0.995; // 벽에 튕길 때 속도를 줄이는 계수
  }

  update(canvas, deltaTime) {
    this.vy += this.gravity * deltaTime; // 중력 적용
    this.x += this.vx * deltaTime; // deltaTime 기반 이동
    this.y += this.vy * deltaTime;

    // 벽 충돌 처리: 경계를 벗어나면 속도 반전 + 마찰 적용
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.vx *= -this.friction;
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.vy *= -this.friction;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
```

---

## 8. 이벤트 처리

### 마우스 상호작용

Canvas는 DOM 요소이므로 일반적인 이벤트 리스너를 그대로 붙일 수 있다. 다만 **캔버스 내부의 좌표계는 뷰포트 좌표와 다르다**는 점에 주의해야 한다. `event.clientX/Y`는 뷰포트 기준 좌표이므로, `getBoundingClientRect()`로 구한 캔버스의 위치를 빼줘야 캔버스 내부의 정확한 좌표를 얻을 수 있다.

```javascript
class CanvasInteraction {
  constructor(canvas) {
    this.canvas = canvas;
    this.rect = canvas.getBoundingClientRect();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("click", this.handleClick.bind(this));
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  getMousePos(event) {
    // clientX/Y는 뷰포트 기준이므로 캔버스의 위치를 빼서 내부 좌표로 변환
    return {
      x: event.clientX - this.rect.left,
      y: event.clientY - this.rect.top,
    };
  }

  handleMouseMove(event) {
    const pos = this.getMousePos(event);
    // pos.x, pos.y를 이용해 호버 감지, 드로잉 등을 처리
  }

  handleClick(event) {
    const pos = this.getMousePos(event);
    // 클릭된 좌표에 어떤 객체가 있는지 판단하는 hit-test 로직 등을 작성
  }
}
```

> **💡 참고** 창 크기가 바뀌면 `getBoundingClientRect()`의 반환값도 달라진다. `resize` 이벤트에서 `this.rect`를 갱신하는 처리를 추가하자.

---

## 9. 성능 최적화

### Dirty Rectangle 기법

변경된 영역만 식별해 해당 영역만 다시 그린다. 전체 `clearRect`를 피할 수 있어 객체가 많을수록 효과적이다.

```javascript
class OptimizedCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.dirtyRects = [];
  }

  addDirtyRect(x, y, width, height) {
    this.dirtyRects.push({ x, y, width, height });
  }

  render() {
    this.dirtyRects.forEach((rect) => {
      this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
      this.renderRegion(rect); // 해당 영역 객체만 다시 그리기
    });
    this.dirtyRects = [];
  }
}
```

### Offscreen Canvas 활용

복잡한 도형을 오프스크린에 미리 렌더링하고 필요할 때 메인 캔버스에 복사(blit)한다.

```javascript
const offscreen = document.createElement("canvas");
const offCtx = offscreen.getContext("2d");

// 오프스크린에 복잡한 그래픽 미리 렌더링
// ...

// 메인 캔버스에 한 번에 복사
ctx.drawImage(offscreen, 0, 0);
```

### 이벤트 리스너 메모리 관리

```javascript
class CanvasApp {
  constructor() {
    this.boundHandlers = {
      resize: this.handleResize.bind(this),
      mouseMove: this.handleMouseMove.bind(this),
    };
  }

  init() {
    window.addEventListener("resize", this.boundHandlers.resize);
    this.canvas.addEventListener("mousemove", this.boundHandlers.mouseMove);
  }

  destroy() {
    window.removeEventListener("resize", this.boundHandlers.resize);
    this.canvas.removeEventListener("mousemove", this.boundHandlers.mouseMove);
  }
}
```

> **💡 실무 팁** 컴포넌트가 언마운트될 때 `destroy()`를 반드시 호출하자. 이벤트 리스너가 누적되면 메모리 누수와 예측 불가한 동작으로 이어진다.

---

## 10. 실무 예제: 간단한 차트

```javascript
class SimpleChart {
  constructor(canvas, data) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.data = data;
    this.padding = 50;
  }

  render() {
    this.drawAxes();
    this.drawData();
    this.drawLabels();
  }

  drawAxes() {
    const { width, height } = this.canvas;
    this.ctx.beginPath();
    this.ctx.moveTo(this.padding, this.padding);
    this.ctx.lineTo(this.padding, height - this.padding);
    this.ctx.lineTo(width - this.padding, height - this.padding);
    this.ctx.stroke();
  }

  drawData() {
    const maxValue = Math.max(...this.data.map((d) => d.value));
    const chartWidth = this.canvas.width - 2 * this.padding;
    const chartHeight = this.canvas.height - 2 * this.padding;

    this.ctx.fillStyle = "#4ecdc4";

    this.data.forEach((item, index) => {
      const barWidth = (chartWidth / this.data.length) * 0.8;
      const barHeight = (item.value / maxValue) * chartHeight;
      const x =
        this.padding + index * (chartWidth / this.data.length) + barWidth * 0.1;
      const y = this.canvas.height - this.padding - barHeight;

      this.ctx.fillRect(x, y, barWidth, barHeight);
    });
  }

  drawLabels() {
    this.ctx.fillStyle = "#333";
    this.ctx.font = "12px Arial";
    this.ctx.textAlign = "center";

    this.data.forEach((item, index) => {
      const x =
        this.padding +
        ((index + 0.5) * (this.canvas.width - 2 * this.padding)) /
          this.data.length;
      const y = this.canvas.height - this.padding + 20;
      this.ctx.fillText(item.label, x, y);
    });
  }
}

// 사용 예시
const chartData = [
  { label: "Jan", value: 65 },
  { label: "Feb", value: 78 },
  { label: "Mar", value: 92 },
  { label: "Apr", value: 84 },
];

const chart = new SimpleChart(canvas, chartData);
chart.render();
```

---

## 마치며

Canvas는 웹 개발에서 강력한 그래픽 도구다. 여기서 다룬 기초 개념들을 바탕으로 데이터 시각화, 게임, 인터랙티브 아트 등 다양한 프로젝트에 활용할 수 있다.

### 추가 학습 방향

- **WebGL** — 3D 그래픽과 GPU 기반 고성능 렌더링
- **OffscreenCanvas** — Web Worker에서의 Canvas 활용으로 메인 스레드 해방
- **Canvas 라이브러리** — Fabric.js, Konva.js, Paper.js 등 프로덕션 검증 도구

복잡한 애니메이션이나 대량의 데이터를 다룰 때는 최적화 기법을 처음부터 설계에 반영하는 것이 핵심이다. 성능과 사용자 경험은 마지막에 붙이는 것이 아니라, 아키텍처 단계에서 결정된다.
