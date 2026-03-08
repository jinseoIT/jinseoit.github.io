---
title: Canvas를 활용한 캔들차트 그려보기
description: Canvas를 활용하여 캔들 차트를 그려보았습니다.
author: "jinseoit"
image: "https://i.namu.wiki/i/l5SGJv609-9plix8Sm9hu9DUUUqQWDc6oZy968qAxyiwT_bFOaCj2g0QZEc_Oykmfxxaibhi7vN4dpBFHpErb6wG0uASKzqcV4dxhX7W8xbXWXXGFyCmd8M2AqGyOmFEfOSjEKmuxTfqNyl9eWNpXg.svg"
published: 2026-03-08
tags: [canvas]
draft: true
---

# Canvas로 캔들차트 그려보기

> 차트 라이브러리를 사용하면 쉽게 캔들 차트를 만들 수 있습니다.
> 하지만 직접 구현해 보는 편이 Canvas 렌더링 방식이나 데이터 좌표와 화면 좌표 변환, 차트의 기본 구조를 깊게 이해할 수 있을 것 같아 구현해 보았습니다.

---

## 1. Canvas 기본 세팅

먼저 Canvas를 준비합니다.

```html
<canvas id="chart" width="600" height="400"></canvas>
```

JavaScript에서 Canvas Context를 가져옵니다.

```javascript
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
```

Canvas는 기본적으로 픽셀 기반 렌더링 API입니다.

간단히 사각형을 하나 그려보겠습니다.

```javascript
ctx.fillStyle = "black";
ctx.fillRect(50, 50, 100, 100);
```

이 단계의 목적은 Canvas 렌더링 환경을 준비하는 것입니다.

## 2. 캔들 하나 그리기

캔들 차트는 OHLC 데이터로 구성됩니다.

```Text
O → Open (시가)
H → High (고가)
L → Low (저가)
C → Close (종가)
```

예시 데이터

```javascript
const candle = {
  open: 100,
  close: 120,
  high: 130,
  low: 90,
};
```

캔들은 두 부분으로 구성됩니다.

```Text
wick  → 고가 / 저가 선
body  → 시가 / 종가 박스
```

Canvas로 그려보면

```javascript
function drawCandle(ctx, x, candle) {
  const width = 20;

  const { open, close, high, low } = candle;

  ctx.strokeStyle = "green";
  ctx.fillStyle = "green";

  // wick
  ctx.beginPath();
  ctx.moveTo(x + width / 2, high);
  ctx.lineTo(x + width / 2, low);
  ctx.stroke();

  // body
  const bodyTop = Math.min(open, close);
  const bodyHeight = Math.abs(close - open);

  ctx.fillRect(x, bodyTop, width, bodyHeight);
}
```

여기서는 단순히 가격을 Canvas 좌표로 그대로 사용하고 있습니다.

## 3. 양봉 / 음봉 구분

캔들 차트에서는 다음 기준으로 색상이 달라집니다.

```Text
close > open  → 양봉
close < open  → 음봉
```

양봉/음봉 반영을 위해 drawCandel을 수정한다면

```javascript
function drawCandle(ctx, x, candle) {
  const width = 20;

  const { open, close, high, low } = candle;

  const isBull = close > open;

  ctx.strokeStyle = isBull ? "red" : "blue";
  ctx.fillStyle = isBull ? "red" : "blue";

  const bodyTop = Math.min(open, close);
  const bodyHeight = Math.abs(close - open);

  ctx.beginPath();
  ctx.moveTo(x + width / 2, high);
  ctx.lineTo(x + width / 2, low);
  ctx.stroke();

  ctx.fillRect(x, bodyTop, width, bodyHeight);
}
```

이제 가격 상승은 빨간색, 가격 하락은 파랑색으로 표시됩니다.

## 4. Price → Pixel 변환

여기서 차트 구현의 핵심 개념이 등장합니다.

가격을 그대로 Canvas 좌표로 사용할 수 없습니다.

예를 들어 가격 데이터가 다음과 같다고 가정해보겠습니다.

```Text
가격 범위
9000 ~ 10000
```

Canvas 높이

```Text
0 ~ 400px
```

따라서 **가격 → 픽셀 변환(scale)**이 필요합니다.

공식은 다음과 같습니다.

```Text
y = height - ((price - minPrice) / range) * height
```

코드로 구현해본다면

```javascript
function createPriceScale(minPrice, maxPrice, height) {
  const range = maxPrice - minPrice;

  return function (price) {
    return height - ((price - minPrice) / range) * height;
  };
}
```

```javascript
const priceToY = createPriceScale(80, 140, canvas.height);
```

캔들 그릴때 가격 변환

```javascript
const yOpen = priceToY(open);
const yClose = priceToY(close);
const yHigh = priceToY(high);
const yLow = priceToY(low);
```

이 과정을 통해 데이터 좌표 → 화면 좌표 변환이 이루어집니다.

## 5. 여러 캔들 렌더링

이제 배열로 된 데이터를 캔들에 반영을 해봅니다.

```javascript
const candles = [
  { open: 100, close: 110, high: 115, low: 95 },
  { open: 110, close: 105, high: 120, low: 100 },
  { open: 105, close: 130, high: 140, low: 100 },
  { open: 130, close: 120, high: 135, low: 115 },
];
```

렌더링 함수를 작성

```javascript
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const candleWidth = 20;
  const gap = 10;

  candles.forEach((candle, index) => {
    const x = index * (candleWidth + gap) + 50;

    drawCandle(ctx, x, candle, priceToY);
  });
}
```

이제 Canvas에는 여러 개의 캔들이 나란히 그려집니다.
