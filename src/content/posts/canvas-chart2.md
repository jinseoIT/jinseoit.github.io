---
title: Canvas로 차트 엔진 만들기
description: TradingView 같은 차트를 직접 만들어보고 싶었다.
author: "jinseoit"
image: "https://www.sdccd.edu/departments/educational-services/online/images/canvas_lms.png"
published: 2026-04-19
tags: [canvas]
draft: true
---

# Canvas로 차트 엔진 만들기 — @shauny/chart 제작기

TradingView 같은 차트를 직접 만들어보고 싶었다. 라이브러리를 가져다 쓰면 금방 끝나지만, Canvas 렌더링과 좌표 변환, 레이어 시스템을 직접 구현하면서 배우는 게 목적이었다. 결과물은 두 개의 npm 패키지로 배포했다.

- **`@shauny/chart`** — 프레임워크 무관 Canvas 차트 엔진 코어
- **`@shauny/chart-react`** — React 바인딩

---

## 1부: 코어 엔진 (`@shauny/chart`)

### 왜 Canvas인가

DOM 기반으로 캔들 수백 개를 그리면 레이아웃 계산과 리페인트가 병목이 된다. Canvas는 픽셀을 직접 제어하기 때문에 수천 개 캔들을 60fps로 렌더링할 수 있다.

### 프로젝트 구조

```
packages/core/src/
├── index.ts
├── types.ts
└── core/
    ├── Chart.ts          # 공개 API, 모든 서브시스템을 연결
    ├── Viewport.ts       # 가시 범위 및 좌표 변환
    ├── Renderer.ts       # Canvas 소유, RAF 루프
    ├── Scale.ts          # 눈금 생성 유틸리티
    ├── EventManager.ts   # DOM 이벤트 → 뷰포트 조작
    └── layers/
        ├── GridLayer.ts
        ├── CandleLayer.ts
        └── CrosshairLayer.ts
```

모노레포는 pnpm workspace + Turborepo로 구성했다. 빌드 캐시가 자동으로 적용되어 packages 간 의존성 순서도 알아서 처리된다.

---

### 데이터 모델

```ts
type Candle = {
  time: number; // Unix timestamp (ms)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};
```

단순한 구조이지만 `time`을 밀리초 단위 Unix 타임스탬프로 통일하는 것이 핵심이다. 이렇게 해야 날짜 계산 없이 순수한 수치 연산만으로 x 좌표를 결정할 수 있다.

---

### Viewport — 좌표 변환의 핵심

차트에서 가장 중요한 클래스다. "현재 화면에 어느 시간대, 어느 가격 범위가 보이는가"를 관리하며, 데이터 공간(시간/가격)과 픽셀 공간을 연결한다.

```ts
// 타임스탬프 → 화면 x픽셀
toPixelX(time: number, size: CanvasSize): number {
  return ((time - this._xMin) / this.xSpan) * size.width
}

// 가격 → 화면 y픽셀 (y축은 반전: 가격이 높을수록 y=0에 가까움)
toPixelY(price: number, size: CanvasSize): number {
  return ((this._yMax - price) / this.ySpan) * size.height
}
```

y축이 반전된다는 점이 함정이다. Canvas의 y=0은 화면 상단이고 가격은 높을수록 위에 있어야 하므로 `(yMax - price) / ySpan`으로 계산한다.

**줌 구현**

줌은 마우스 커서 위치를 기준으로 xMin/xMax를 재계산한다. 커서 아래의 데이터 포인트가 고정된 채로 범위가 좁아지거나 넓어지는 효과다.

```ts
zoom(factor: number, focalX: number, size: CanvasSize): void {
  const focalTime = this.toDataX(focalX, size)
  const newXSpan  = this.xSpan / factor
  const clampedXSpan = Math.max(minXSpan, Math.min(maxXSpan, newXSpan))
  const xRatio = focalX / size.width
  this._xMin = focalTime - xRatio * clampedXSpan
  this._xMax = focalTime + (1 - xRatio) * clampedXSpan
  this._clampX()
}
```

**Y축 자동 맞춤**

팬/줌할 때마다 보이는 캔들의 고가/저가에 Y축을 자동으로 맞춘다. 사용자가 좌우로 이동하면 가격 범위가 자연스럽게 따라온다.

```ts
autoFitY(): void {
  const { xMin, xMax } = this.viewport.range
  const range = this.candleLayer.getVisiblePriceRange(xMin, xMax)
  if (range) this.viewport.setYRange(range.yMin, range.yMax)
}
```

---

### Renderer — RAF 루프와 DPR 대응

Renderer는 Canvas를 소유하고 `requestAnimationFrame` 루프를 관리한다.

**Retina 대응**

`devicePixelRatio`를 한 번만 Canvas에 적용한다. 레이어들은 DPR을 신경 쓰지 않고 CSS 픽셀 단위로만 그린다.

```ts
resize(): void {
  const dpr  = window.devicePixelRatio || 1
  const cssW = rect.width
  const cssH = rect.height

  this.canvas.width  = cssW * dpr
  this.canvas.height = cssH * dpr

  // ctx.scale 누적을 막기 위해 setTransform 사용
  this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}
```

`ctx.scale(dpr, dpr)`을 쓰면 `resize()` 호출마다 누적되어 버그가 생긴다. `setTransform`으로 절대값을 설정하면 몇 번 호출해도 안전하다.

**markDirty 패턴**

같은 프레임 안에서 중복 RAF 예약을 방지한다. `_dirty` 플래그가 이미 세워져 있으면 추가 `requestAnimationFrame`을 예약하지 않는다. 마우스를 움직이는 동안에는 mousemove마다 `markDirty()`가 호출되어 계속 그리지만, 같은 프레임 내 중복 draw는 발생하지 않는다.

```ts
markDirty(): void {
  if (this._dirty) return   // 같은 프레임 내 중복 예약 방지
  this._dirty = true
  this._rafId = requestAnimationFrame(() => this._flush())
}
```

---

### Layer 시스템

모든 레이어는 단순한 인터페이스 하나를 구현한다.

```ts
interface Layer {
  draw(
    ctx: CanvasRenderingContext2D,
    viewport: ViewportRange,
    size: CanvasSize,
  ): void;
  onMouseMove?(x: number, y: number): void;
  onMouseLeave?(): void;
}
```

레이어는 아래에서 위 순서로 그려진다: `GridLayer → CandleLayer → CrosshairLayer`.

사용자는 `chart.addLayer(myLayer)`로 인디케이터, 볼륨 패널 같은 커스텀 레이어를 추가할 수 있다.

**Axis gutter 공유 상수**

`GridLayer`, `CandleLayer`, `CrosshairLayer` 모두 `axisWidth = 60px` (우측 가격 축), `axisHeight = 24px` (하단 시간 축)를 하드코딩으로 공유한다. 커스텀 레이어를 작성할 때 이 값을 지켜야 차트 영역 안에 올바르게 그려진다.

```ts
const chartW = size.width - 60; // 가격 축 제외
const chartH = size.height - 24; // 시간 축 제외
```

**CandleLayer — 이진 탐색으로 성능 최적화**

캔들이 수천 개여도 화면에 보이는 것만 그린다. 데이터가 시간순으로 정렬되어 있으므로 이진 탐색으로 startIdx/endIdx를 구하면 O(n) 전체 순회를 피할 수 있다.

```ts
draw(ctx, viewport, size): void {
  const startIdx = this.bisectLeft(viewport.xMin)
  const endIdx   = this.bisectRight(viewport.xMax)

  for (let i = startIdx; i < endIdx; i++) {
    // 이 범위 내 캔들만 그림
  }
}
```

이진 탐색에는 `±2` 버퍼를 추가한다. 뷰포트 경계에 걸쳐 있는 캔들이 잘리지 않도록 startIdx는 2칸 앞으로, endIdx는 2칸 뒤로 확장한다.

줌 레벨에 따라 캔들 너비도 동적으로 계산한다. 화면 너비를 보이는 캔들 수로 나누고 70%를 몸통 너비로 사용한다.

**GridLayer — Scale 유틸리티**

`Scale` 클래스는 Wilkinson "nice number" 알고리즘으로 눈금 간격을 계산한다. 줌 레벨에 상관없이 항상 사람이 읽기 좋은 숫자(1, 2, 5, 10…)가 나온다.

시간 축은 확대 수준에 따라 포맷을 바꾼다: 하루 미만이면 "HH:MM", 주 단위면 "Mon DD", 월 이상이면 "MMM YY".

**CrosshairLayer — 십자선과 축 라벨**

마우스 위치를 저장해뒀다가 매 프레임 `draw()`에서 대시 선과 가격/시간 pill 라벨을 그린다. 레이어가 상태를 최소한으로만 들고 있는 덕분에 다른 레이어와 완전히 독립적이다.

---

### EventManager

DOM 이벤트를 Viewport 조작으로 변환하는 역할만 한다.

- **wheel** — Ctrl + 세로 스크롤: 커서 위치 중심 줌 / 가로 스크롤: 팬
- **drag** — 마우스 좌클릭 드래그: 팬
- **touch** — 단일 터치: 팬 / 핀치: 줌

Ctrl 없는 세로 스크롤(트랙패드 수직 스크롤)은 의도적으로 무시한다. 차트를 포함한 페이지를 세로로 스크롤할 때 차트가 예기치 않게 줌되는 것을 방지하기 위한 결정이다.

이벤트 핸들러를 생성자에서 `bind()`해서 레퍼런스를 저장하고, `destroy()`에서 `removeEventListener`로 깨끗하게 정리한다.

---

### 실시간 업데이트와 preserveViewport

`Chart.setData()`는 두 번째 인자로 `preserveViewport` 플래그를 받는다.

```ts
chart.setData(updatedCandles, true); // X 범위(팬/줌 위치) 유지, Y만 재조정
chart.setData(updatedCandles); // 전체 fitToData 리셋
```

실시간 데이터 업데이트 시 `true`를 넘기면 사용자가 이동해둔 뷰포트 위치가 유지된다. 이 플래그는 코어 레벨의 기능이며, React 바인딩은 이를 활용하는 것뿐이다.

---

### 빌드 설정

Vite의 라이브러리 모드로 ES Module, CommonJS, UMD 세 포맷을 동시에 빌드한다. `vite-plugin-dts`가 타입 선언 파일을 자동으로 묶어준다.

Chart 생성 후 반드시 `chart.start()`를 호출해야 RAF 루프가 시작된다. 빠뜨리면 `setData`를 호출해도 아무것도 그려지지 않는다.

```ts
const chart = new Chart(canvas, { background: "#131722" });
chart.setData(candles);
chart.start(); // 이 호출이 없으면 렌더링 안 됨

// ResizeObserver는 내부에서 자동 등록되어 있어
// canvas CSS 크기가 바뀌면 알아서 재조정된다
// 별도 resize 이벤트 처리 불필요
```

**자동 리사이즈**

Chart 생성자가 `ResizeObserver`를 등록해 canvas의 CSS 크기 변화를 자동 감지한다. `window.resize` 이벤트를 별도로 구독하지 않아도 반응형 레이아웃에서 올바르게 동작한다.

```ts
this.resizeObserver = new ResizeObserver(() => this.renderer.resize());
this.resizeObserver.observe(canvas);
```

`chart.destroy()`를 호출하면 ResizeObserver도 함께 해제된다.

```ts
// vite.config.ts
build: {
  lib: {
    entry: 'src/index.ts',
    formats: ['es', 'cjs', 'umd'],
    fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`,
  },
}
```

---

## 2부: React 바인딩 (`@shauny/chart-react`)

코어가 완성되면 React 연결은 생각보다 단순하다. 핵심은 **Chart 인스턴스 생명주기를 React의 생명주기와 정확히 맞추는 것**이다.

### useChart 훅

Chart 생성/파괴를 담당하는 훅이다.

```ts
export function useChart(options?: ChartOptions): UseChartReturn {
  const ref = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const optionsRef = useRef(options); // 초기화 시 한 번만 사용

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const chart = new Chart(canvas, optionsRef.current);
    chart.start();
    chartRef.current = chart;

    return () => {
      chart.destroy();
      chartRef.current = null;
    };
  }, []); // 의존성 배열 비움 — 마운트/언마운트 시에만 실행

  return { ref, chartRef };
}
```

`options`를 `optionsRef`로 고정하는 이유: Chart는 초기 옵션으로 Canvas를 한 번 설정하고 이후 변경을 지원하지 않는다. `useEffect` 의존성에 `options`를 넣으면 렌더링마다 Chart가 재생성되어 버린다.

---

### CandleChart 컴포넌트

`forwardRef`로 명령형 API를 노출한다. `fitToData()`, `getChart()`를 ref로 제공해서 부모 컴포넌트가 필요할 때 직접 호출할 수 있게 한다.

```tsx
export const CandleChart = forwardRef<CandleChartHandle, CandleChartProps>(
  ({ data, options, style, className }, ref) => {
    const { ref: canvasRef, chartRef } = useChart(options);
    const lastChartRef = useRef<object | null>(null);

    useEffect(() => {
      const chart = chartRef.current;
      if (!chart || data.length === 0) return;

      // 같은 Chart 인스턴스면 뷰포트 유지 (팬/줌 위치 보존)
      // 새 인스턴스(첫 마운트)면 fitToData로 전체 표시
      const preserveViewport = chart === lastChartRef.current;
      lastChartRef.current = chart;
      chart.setData(data, preserveViewport);
    }, [data, chartRef]);

    useImperativeHandle(ref, () => ({
      fitToData: () => chartRef.current?.fitToData(),
      getChart: () => chartRef.current,
    }));

    return (
      <canvas
        ref={canvasRef}
        style={{ display: "block", ...style }}
        className={className}
      />
    );
  },
);
```

코어에서 설명한 `preserveViewport` 플래그를 React 바인딩에서는 이렇게 활용한다. 같은 Chart 인스턴스(`lastChartRef`로 추적)에 `setData`를 재호출하는 경우에만 `true`를 넘겨 뷰포트를 유지한다. 첫 마운트나 리마운트 시에는 `false`가 되어 전체 데이터가 화면에 맞춰진다.

---

### 빌드 설정 — external 처리

React와 `@shauny/chart`는 번들에 포함하지 않는다. 소비자 앱의 React와 중복으로 번들되면 훅 규칙 위반 오류가 발생한다.

```ts
rollupOptions: {
  external: ['react', 'react/jsx-runtime', '@shauny/chart'],
}
```

`package.json`의 `peerDependencies`에도 명시해서 npm이 소비자에게 경고를 표시하도록 한다.

---

### 사용 예시

```tsx
import { CandleChart } from '@shauny/chart-react'

// 기본 사용
<CandleChart
  data={candles}
  options={{ background: '#131722' }}
  style={{ width: '100%', height: 500 }}
/>

// 명령형 API
const chartRef = useRef<CandleChartHandle>(null)

<CandleChart ref={chartRef} data={candles} />

chartRef.current?.fitToData()
chartRef.current?.getChart()?.addLayer(myCustomLayer)
```

---

## 마치며

이 프로젝트를 통해 배운 것들:

1. **Y축 반전**은 처음에 헷갈리지만 `(yMax - price) / ySpan` 공식 하나로 통일하면 모든 레이어에서 일관성이 생긴다.
2. **markDirty 패턴**은 같은 프레임 내 중복 RAF 예약을 막는다. 마우스 이동 중에는 매 mousemove마다 draw가 발생하지만, 동일 프레임 안에서 두 번 그리는 일은 없다.
3. **이진 탐색**으로 보이는 캔들만 그리는 것이 수천 개 데이터셋에서 체감 성능을 크게 바꾼다. 경계 캔들이 잘리지 않도록 `±2` 버퍼를 더하는 작은 디테일도 중요하다.
4. **`preserveViewport` 플래그**는 코어 레벨 기능이다. 이것 없이는 실시간 업데이트 때마다 뷰포트가 초기화되어 사용자 경험이 망가진다.
5. **`chart.start()` 호출**을 빠뜨리는 실수를 가장 많이 한다. Canvas에 아무것도 그려지지 않을 때 가장 먼저 확인해야 할 것이다.

소스 코드는 npm에서 확인할 수 있다.

```bash
npm install @shauny/chart
npm install @shauny/chart-react
```
