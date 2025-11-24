---
title: 브라우저 렌더링 과정
description: 브라우저 렌더링 과정
author: "jinseoit"
image: "https://velog.velcdn.com/images/radin/post/c7c2c66d-8d54-4aef-9471-8725813ca50c/image.png"
published: 2023-10-12
tags: [browser]
draft: true
---

## 들어가며

웹 개발자가 만든 어플리케이션은 브라우저에서 렌더링 과정을 거친 후 확인할 수 있다.
렌더링을 하는 프로세스 자체는 간단하지만, `잦은 렌더링은 성능 저하`를 일으킬 수 있다. 그렇기 때문에 웹 브라우저의 렌더링 과정을 잘 이해한다면, 렌더링에 필요한 리소스를 최적화 함으로써 성능향상을 기대할 수 있다.

## 🐬 1. 브라우저의 기능과 구조

### 🦭 1-1 브라우저 주요 기능

브라우저의 주요 기능은 사용자가 선택한 자원을 `서버`에 요청하고 `브라우저`에 표시하는 것이다. 자원은 보통 HTML 문서지만 PDF나 이미지 또는 다른 형태일 수 있다. 자원의 주소는 URI(Uniform Resource Identifier)에 의해 정해진다.

### 🦭 1-2 브라우저 기본 구조

브라우저의 기본 구조는 크게 7가지로 구성되어 있다.
![](https://d2.naver.com/content/images/2015/06/helloworld-59361-1.png)
1️⃣ 사용자 인터페이스 - 주소 표시줄, 이전/다음 버튼, 북마크 메뉴 등. 요청한 페이지를 보여주는 창을 제외한 나머지 모든 부분.
2️⃣ 브라우저 엔진 - 사용자 인터페이스와 렌더링 엔진 사이의 동작을 제어.
3️⃣ 렌더링 엔진 - 요청한 콘텐츠를 표시. 예를 들어 HTML을 요청하면 HTML과 CSS를 파싱하여 화면에 표시.
4️⃣ 통신(네트워크) - HTTP 요청과 같은 네트워크 호출에 사용됨. 플랫폼 독립적인 인터페이스이고 각 플랫폼 하부에서 실행됨.  
5️⃣ 자바스크립틍 엔진(해석기) - 자바스크립트 코드를 해석하고 실행.
6️⃣ UI 백엔드 - 콤보 박스와 창 같은 기본적인 장치를 그림. 플랫폼에서 명시하지 않은 일반적인 인터페이스로서, OS 사용자 인터페이스 체계를 사용.
7️⃣ 자료 저장소 - 로컬스토리지, 쿠키와 같이 보조 기억창치에 데이터를 저장하는 역할

## 🐬 2. 브라우저 렌더링

> 💡 파싱과 렌더링이란?

- 파싱 : 프로그래밍 언어의 문법에 맞게 작성된 텍스트 문서를 읽고 실행하기 위해 텍스트 문자의 문자열을 `분해`하고 `구조를 생성`하는 일련의 과정
- 렌더링 : HTML, CSS, JS로 작성된 문서를 파싱하여 브라우저에 `시각적으로 출력`

### 🦭 2-1 브라우저 렌더링 과정

브라우저 렌더링 과정은 크게 다섯단계로 구분된다.

![](https://velog.velcdn.com/images/radin/post/8125ded9-1397-45ab-bdd9-d4b3767f01c0/image.png)

1️⃣ 서버로부터 요청받은 HTML과 CSS를 파싱하여 `DOM`(Document Object Model), `CSSOM`(CSS Object Model) 생성
2️⃣ DOM트리와 CSSOM 트리를 기반으로 `Render Tree`를 생성 DOM Tree와 달리 Render Tree에는 `스타일 정보`가 설정 되어 있으며 `실제 화면에 표현되는 노드`들로만 구성 되어 있다. (display:none 이나 head 처럼 보이지 않는 요소는 포함되지 않는다)
3️⃣ Render Tree를 기반으로 HTML 요소의 `Layout`(위치, 크기)을 계산
4️⃣ Layout 계산이 완료되면 화면을 그릴 준비를 하며 레이어를 만드는 `Paint`단계 진행
5️⃣ 만든 레이어들을 `Composite(합성)`하여 화면에 출력

### 🦭 2-2 HTML 파싱 DOM 생성

HTML문서가 DOM 트리로 파싱되는 과정을 그림과 함께 자세히 살펴보자.

![](https://velog.velcdn.com/images/radin/post/0f5a2e9a-eeec-4295-b511-ff7097e725aa/image.png)

1️⃣ 서버로부터 HTML문서를 `바이트`(2진수)로 응답받는다.
2️⃣ 응답받은 바이트 형태의 HTML을 meta태그 charset 어트리뷰트에 의해 지정된 인코딩 방식(ex: UTF-8)을 기준으로 `문자열`로 변환된다.
3️⃣ 문자열로 변환된 HTML 문서를 문법적 의미를 갖는 `토큰`들로 분해한다.
4️⃣ 각 토큰들을 객체로 변환하여 `노드`들을 생성한다. 토큰 내용에 따라 문서 노드, 요소 노드, 어트리뷰트 노드, 텍스트 노드가 생성된다.
5️⃣ 노드들을 트리 자료구조로 구성한 `DOM`(Doucment Object Model)이 완성된다.

> 즉, DOM은 HTML 문서를 파싱한 결과물이다.

### 🦭 2-3 CSS 파싱 CSSOM 생성

렌더링 엔진은 HTML을 처음부터 한 줄씩 순차적으로 파싱하여 DOM을 생성해 나간다. DOM을 생성해 나가다가 `link` 태그나 `style` 태그를 만나면 DOM 생성을 일시 중단한다.

link 태그의 href 어트리뷰트에 지정된 CSS 파일을 서버에 요청하여 로드한 CSS 파일이나 style 태그 내의 CSS를 HTML과 동일한 파싱 과정(바이트 -> 문자 -> 토큰 -> 노드 -> CSSOM)을 거치며 해석하여 `CSSOM`(CSS Object Model)을 생성한다. CSS 파싱을 완료하면 HTML 파싱이 중단된 지점부터 다시 HTML을 파싱하기 시작하여 DOM 생성을 재개한다.

![](https://velog.velcdn.com/images/radin/post/8b82e899-5421-48b2-a7e4-d231212d4612/image.png)

### 🦭 2-4 Render Tree 생성

![](https://velog.velcdn.com/images/radin/post/7bc4e771-415a-4883-875b-dc590456837a/image.png)
DOM과 CSSOM이 생성되면 렌더링을 위해 `결합(attachment)`하여 렌더 트리(Render Tree)를 생성한다. 렌더 트리는 웹 페이지에 보이는 요소 정보만 포함. 즉, 렌더트리는 브라우저 화면에 `렌더링되는 노드`만으로 구성되어있다.

> - HTML meta 태그, CSS의 display: none 등은 렌더 트리에 포함되지 않는다.

- ::before , ::after 가상요소는 웹페이지에 보여져야 하기 때문에 DOM트리에는 포함되지 않지만 렌더트리에는 포함된다.

### 🦭 2-5 Layout(reflow)

렌더트리의 노드를 화면에 배치하는 과정을 레이아웃이라고 한다.
렌더트리 생성이 끝나면 웹페이지 화면 안에서 렌더트리에 있는 각 노드의 위치, 크기, 너비, 높이 등을 `계산`하고 `화면에 배치`하는 레이아웃 과정이 실행된다. 레이아웃이 다시 일어나는 것을 `reflow`라고 한다.

> 💡 리플로우 발생 시점

1. DOM 노드의 위치 변경 및 크기 변경 시
2. 노드 추가 및 삭제 시
3. 브라우저 리사이징 시(Viewport 변경)
4. 폰트 변경과 이미지 크기 변경

### 🦭 2-6 Paint(repaint)

레이아웃을 통해 요소들의 위치와 스타일 계산을 마쳤다면, 요소들을 `화면에 그릴 준비`를 한다. 이 과정을 `Paint`라고 한다. 페인트 과정동안 렌더 트리를 순회하며 `레이어(Layer)`를 만들고 레이어를 채우는 과정(배경, 텍스트, 순서 등)들을 기록한다.
레이어가 존재하는 이유는 요소를 `화면에 그리는 순서를 보장`하기 위함이다. 화면에 그릴 요소들에 z-index나 position 속성이 부여된 상태에서, 그리는 순서를 레이어를 통해 알 수 있다. 페인트가 다시 일어나는 것을 `repaint`라고 한다.

> 💡 리페인트 발생 시점

1. reflow 발생 후 화면에 반영되기 위해 repaint도 발생
2. visibility 변경, outline 변경, background 변경 등 레이아웃에 영향을 주지 않는 스타일 속성 적용시 repaint만 발생

### 🦭 2-7 Composite

`Composite(합성)` 단계는 여러 Layer로 나눠진 Raster 픽셀들을 우리가 실제로 보는 화면(한장의 비트맵)처럼 합성해주는 단계이다.(포토샵의 레이어 개념과 유사) composite는 메인 스레드와 별개로 `컴포지터 스레드` 에서 작동한다.

> 💡 Layout 과 Paint 둘 다 거치지 않는 속성
> `transform`, `opacitiy`, `cursor`, `orphans`, `perspective` 등이 해당

## 🐬 3.렌더링 최적화

> 렌더링을 최적화 하기 위해는 `리플로우(reflow)`와 `리페인트(repaint)`를 줄여야 한다.

### 1) composite > repaint > reflow 성능 고려

리렌더링 과정이 reflow -> repaint -> composite 순으로 진행이 된다.
레이아웃 크기나 위치에 영향이 가지 않는 `Paint Only(Repaint) 속성`을 사용하면 Layout을 건너뛰고 바로 Paint과정으로 넘어가게 되어 연산하는 양이 줄어들어 `렌더링 속도가 개선`된다. 같은 맥락으로 composite단계만 거치는 스타일 속성이라면 reflow 와 repaint과정을 생략할 수 있어 성능적으로 이점을 가질 수 있다.

> ✅ **Reflow가 일어나는 대표적인 속성**
> `position`, `width`, `height`, `left`, `top`, `text-align`, `right`, `bottom`, `margin`, `padding`, `border`, `vertical-align`, `border-width`, `clear` `display`, `float`, `font-family`, `white-space`,
> `font-size`, `font-weight`, `line-height`, `min-height`, `overflow`

> ✅ **Repait가 일어나는 대표적인 속성**
> `background`, `background-image`, `background-position`, `background-repeat`, `border-style`, `border-radius`, `box-shadow`, `text-decoration`
> `visibility` `color` `outline` `outline-color`
> `outline-width` `background-size` `line-style` `outline-style`

> ✅ **Composite가 일어나는 대표적인 속성**
> `transform`, `opacitiy`, `cursor`, `orphans`, `perspective`

CSS Animation이 렌더 스테이지에서 어떤 단계를 trigger 하는지 [CSS Triggers List ](https://csstriggers.com/)에서 확인 가능하다.

### 2) display: none 사용하기

- `display:none`이 적용된 요소는 렌더트리에서 제외된다.
- 스타일이 수정되어야 할때 먼저 `display:none`을 설정하고 스타일 변경 후 `display:block`으로 변경

```css
div.style.display = "none";  // 렌더트리에서 제외

// 스타일 수정

div.style.display = "block";  // 스타일 수정 후 렌더트리에 추가

```

이 방법으로 각각 리플로우, 리페인트가 1번씩 발생하여 스타일이 많이 변경되는 경우 비용을 절감 할 수 있다.

### 3) 애니메이션 요소의 위치를 absolute로 두기

- 애니메이션으로 요소의 위치를 변경할 때, 주변 요소(형제, 부모, 자식)의 위치도 변경되어 리플로우가 여러 번 발생한다.

- 리플로우가 여러 번 발생하지 않도록, 애니메이션이 적용된 요소의 `position`을 `absolute`로 설정하여, 주변 요소에 영향을 주지 않게 한다.

```css
.animation-target {
  position: absolute;
  animation: moveTo 2s;
}
```

### 4) DOM 속성 변경 코드 모으기

```javascript
// BAD
const el1 = document.querySelector(".target-first");
el1.style.width = "10px";

const el2 = document.querySelector(".target-second");
el2.style.width = "10px";

const el3 = document.querySelector(".target-third");
el3.style.width = "10px";
```

el1~ el3까지 10px로 변경하는 코드이다 `리플로우가 3번 발생`한다.

```javascript
// GOOD

const el1 = document.querySelector(".target-first");
const el2 = document.querySelector(".target-second");
const el3 = document.querySelector(".target-third");

// dom의 스타일 변경 코드를 한 곳으로 모아둠
el1.style.width = "10px";
el2.style.width = "10px";
el3.style.width = "10px";
```

`리플로우 횟수가 1번`으로 줄어 들었다.🤔

> 💡브라우저는 변경할 요소가 있을 때 즉시 처리하지 않고 `큐`에 저장한다.
> 일정 시간이 지나거나 큐에 변경 작업이 쌓였을 때 리플로우를 실행한다. 즉, `DOM의 수정을 모아두면` 이 수정 코드가 큐에 쌓여 한번에 처리되기 때문에 리플로우 횟수를 줄일 수 있다.

### 5) 리플로우 유발 함수의 호출을 제한

```javascript
// BAD
for (let i = 0; i < 10; i++) {
  el.style.width = target.offsetWidth + 10; // 반복문이 돌 때 매번 호출
}

// GOOD
const { offsetWidth } = target; // 한 번 호출해서 변수에 저장
for (let i = 0; i < 10; i++) {
  el.style.width = offsetWidth + 10;
}
```

리플로우를 발생시키는 함수나 속성을 매번 호출하지 않고 변수에 저장한다.

### 6) CSS로 스타일을 한 번에 변경하기

DOM의 여러 스타일을 변경해야 한다면, 스타일을 CSS클래스로 정의한 후 한번에 변경한다.

```css
// BAD
el.style.width = "10px";
el.style.height = "10px";
el.style.borderRadius = "5px";
el.style.backgroundColor = "red";
el.style.left = "20px";
```

```html
// GOOD
<body>
  <script>
    el.className = "small";
  </script>
</body>

<style>
  .small {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: red;
    left: 20px;
  }
</style>
```

### 7) CSS 하위 선택자 최소화

Render Tree는 DOM트리와 CSSOM트리가 결합되어 만들진다. CSS 하위 선택자가 많아 진다면 CSSOM 트리 깊이(Depth)가 깊어지게 되고 `렌더 트리를 만드는 시간이 더 오래 걸리`게 된다.

```html
<div class="reflow_box">
  <ul class="reflow_list">
    <li>
      <button type="button" class="btn">버튼</button>
    </li>

    <li></li>
    <li>
      <button type="button" class="btn">버튼</button>
    </li>

    <li></li>
  </ul>
</div>
```

```css
/* bad */
.reflow_box .reflow_list li .btn {
  display: block;
}
/* good */
.reflow_list .btn {
  display: block;
}
```

### 8) 가상 DOM 사용

- 가상 DOM을 생성하여 메모리에 저장한후 저장된 DOM과 현재 DOM을 비교하여 변경된 부분만 실제 DOM에 반영한다. 모든 DOM에 영향을 주지 않고 변경이 필요한 DOM만 바꿔주기에 불필요한 리렌더링을 막을 수 있다.
  (React, Vue는 내부적으로 가상돔과 비교하며 렌더링한다)

## 마무리

브라우저 렌더링은 웹 최적화를 위해서 어떻게 진행되는지 숙지하고 있어야 하는 개념이다. 더 나아가 React에서 사용하는(뿐만아닌) Virtual DOM(가상 DOM)에 대하여 더 깊게 이해하기 위한 선지식으로서 꼭 필요한 개념이다.

---

참고도서
[모던 자바스크립트 Deep Dive](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=251552545&start=slayer)

참고글
[브라우저는 어떻게 동작하는가? - Naver D2](https://d2.naver.com/helloworld/59361)
[Constructing the Object Model](https://web.dev/critical-rendering-path-constructing-the-object-model/?hl=ko)
[Render-tree Construction, Layout, and Paint](https://web.dev/critical-rendering-path-render-tree-construction/#tl;dr)

참고영상
[웹 브라우저가 하는일:렌더링6단계](https://youtu.be/hITJM_t1WWY)
[웹 브라우저의 동작 순서](https://youtu.be/FQHNg9gCWpg)
[Browser rendering optimization](https://www.youtube.com/watch?v=G4eQziVzCTE&t=143s)
[우테코 - 체프의 브라우저 렌더링](https://www.youtube.com/watch?v=sJ14cWjrNis&t=515s)
