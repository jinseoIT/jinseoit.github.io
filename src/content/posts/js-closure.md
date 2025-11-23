---
title: Javascript의 클로저(Closure)
description: Javascript의 클로저(Closure)
author: "jinseoit"
image: "https://velog.velcdn.com/images/radin/post/e9d63480-6bf8-4799-875e-e2bfdb09d172/image.png"
published: 2023-08-27
tags: [JavaScript]
---

## 들어가기

> 클로저는 자바스크립트에서만 사용하는 개념이 아닌 여러 `함수형 프로그래밍 언어`에서 등장하는 보편적인 특성입니다.
> 클로저의 이해를 돕기 위해 [실행컨텍스트](https://jinseoit.github.io/execution-context)에 대한 글을 먼저 참고하는 것을 추천합니다.

## 🐬 1. 클로저 정의

### 🦭 MDN 및 도서들에 따른 클로저 정의

> 1. 클로저는 함수와 그 함수가 선언된 렉시컬 환경과의 조합이다 - MDN

> 2. 외부 함수보다 중첩 함수가 더 오래 유지되는 경우 중첩 함수는 이미 생명 주기가 종료된 외부함수의 변수를 참조할 수 있다 이러한 `중첩 함수`를 클로저라고 부른다. - 자바스크립트 Deep Dive

> 3. 클로저란 어떤 함수에서 선언한 변수를 참조하는 내부 함수를 외부로 전달할 경우, 함수의 실행 컨텍스트가 종료된 후에도 해당 변수가 사라지지 않는 `현상`이다. - 코어 자바스크립트

> 4. 클로저는 함수가 속한 렉시컬 스코프를 기억하여 함수가 렉시컬 스코프 밖에서 실행될 때에도 이 스코프에 접근할 수 있게 하는 `기능`을 뜻한다. - You don't know JS (타입과 문법 스코프와 클로저)

즉, 클로저란 외부 함수에서 선언한 변수를 참조하는 내부 함수를 외부로 전달할 경우, 함수의 실행 컨텍스트가 종료된 후에도 해당 변수가 사라지지 않는 `현상`이다.(함수는 이 현상을 나타나기 위한 조건이다 흔히 클로저 함수다 라고 많이 사용한다.)

```javascript
function outerFunc() {
  const x = 10;
  function innerFunc() {
    console.log(x); // 10
  }
  innerFunc();
}
outerFunc(); //outerFunc 는 x에 접근할 수 있다.
```

## 2. 🐬 클로저 원리를 알아보자

자바스크립트 엔진은 함수를 어디에 정의했는지에 따른 상위 스코프를 결정하는 `렉시컬 스코프(정적 스코프)`를 따른다.
함수객체는 내부 슬롯으로`[[Environment]]`를 가지는데 해당 슬롯은 함수 정의가 평가되어 함수 객체를 생성할때 자신이 정의된 환경인 즉, `상위 스코프의 참조`를 저장한다.

아래 코드를 보며 클로저 현상의 순서를 확인해보자.

```javascript
const x = 1;
function outer() {
  const x = 10;
  const inner = function () {
    console.log(x);
  };
  return inner;
}
const innerFunc = outer();
innerFunc(); // 10
```

1️⃣ outer함수를 호출하면 outer 함수객체 내부 슬롯 [[Environment]]의 상위 스코프(Global) 참조가 outer함수 실행컨텍스트의 외부 렉시컬 환경 참조에 할당된다.
2️⃣ inner함수를 호출하면 inner 함수객체 내부 슬롯 [[Environment]]의 상위 스코프(outer) 참조가 inner함수 실행컨텍스트의 외부 렉시컬 환경 참조에 할당된다.
3️⃣ outer함수 실행컨텍스트는 inner함수를 반환하고 콜 스택에서 pop된다.
4️⃣ innerFunc식별자는 inner함수를 참조하고 있으며 inner함수는 외부 렉시컬 환경 참조로 `outer 렉시컬 환경을 참조`하고 있다.
5️⃣ ouetr함수 실행컨텍스트는 콜 스택에서 제거 되었지만 outer 함수의 렉시컬 환경은 inner함수의 외부참조를 받고 있기 때문에 완전히 사라지지 않았다.
6️⃣ outer 환경레코드의 식별자 x가 10으로 출력된다
![](https://velog.velcdn.com/images/radin/post/23b20893-5e56-40ec-9b0c-feec87941d3e/image.png)

> 정리하면 실행컨텍스트가 콜 스택에서 제거가 되어도 외부에서 참조를 받고 있다면 LexicalEnviroment는 사라지지 않아 외부에서 참조가 가능해진다. GC(GarbageCollection)동작이 어떤 값을 참조하는 변수가 있다면(참조 카운터가 0이상) 메모리상 수거하지 않기 때문이다.
> 💡 스펙상으로는 LexicalEnvironment 전부를 GC하지 않도록 되어있으나 2019년 기준으로 크롬이나 Node.js 등에서 사용중인 V8엔진의 경우 내부 함수에서 실제로 사용하는 변수만 남겨두고 GC하도록 최적화 되어있다.

## 3. 🐬 클로저의 활용

### 🦭 3-1 정보의 은닉화

클로저를 활용하여 외부에서는 값을 변경할 수 없게 은닉화 할수 있다.

```javascript
function makeCounter() {
  let count = 0; // 은닉화
  return function () {
    return count++;
  };
}

let counter = makeCounter();

console.log(counter()); // 0
console.log(counter()); // 1
console.log(counter()); // 2
```

count 값을 외부에서 값을 내리거나 갑자기 0으로 수정할 수 없다 counter 함수만을 통해 무조건 1씩 증가 시킬수 있다.

> 현재는 class에 추가된 private(#)로 은닉화하는 방식을 더 선호한다.

### 🦭 3-2 debounce와 throttle

연속적인 이벤트를 관리할때 자주 사용하는 debounce와 throttle도 클로저로 구현할 수 있다.

```javascript
const debounce = (callback, delay) => {
  let timerId;
  // debounce 함수는 timerId를 기억하는 클로저를 반환한다.
  return (...args) => {
    // delay가 경과하기 이전에 이벤트가 발생하면 이전 타이머를 취소하고 새로운 타이머를 재설정
    // delay보다 짧은 간격으로 이벤트가 발생하면 callback은 호출되지 않는다.
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(callback, delay, ...args);
  };
};

const throttle = (callback, delay) => {
  let timerId;
  // throttle 함수는 timerId를 기억하는 클로저를 반환한다
  return (...args) => {
    // delay가 경과하기 이전에 이벤트가 발생하면 아무것도 하지 않다가
    // delay가 경과했을때 이벤트 발생시 새로운 타이머를 재설정 => dleay간격으로 callback이 호출된다.
    if (timerId) return;
    timerId = setTimeout(() => {
      callback(...args);
      timerId = null;
    }, delay);
  };
};
```

### 🦭 3-3 리액트의 hooks

리액트의 함수형 컴포넌트는 클래스형 컴포넌트와는 다르게, 렌더가 필요할 때마다 함수를 다시 호출한다. props를 인자로 받아서 jsx문법에 맞는 리액트 컴포넌트를 리턴 하는 것이 함수형 컴포넌트의 개념이기 때문에 `렌더링 = 함수호출` 이라고 말할 수 있다.
함수가 다시 호출되었을 때 이전의 상태를 기억하고 있어야 하며 이부분을 ReactHooks는 클로저를 통해 해결한다.
아래 ReactHooks중 useState로 확인해보자.

```javascript
const [state, setState] = useState(initialValue);
```

useState의 내부적인 코드를 비슷하게 만들어 보면 아래와 같다.

```javascript
let _value;
function useState(initialValue) {
  if (_value === undefined) {
    _value = initialValue;
  }
  const setState = (newValue) => {
    _value = newValue;
  };
  return [_value, setState];
}
```

- 최초 렌더링시(함수호출)시 외부 value의 값은 undefined이기 때문에 intiValue(초기화)값이 전역 변수 \_value에 할당된다.
- 리렌더링시 useState 함수가 재호출 하여도 \_value의 값이 있기 때문에 initialValue의 값이 할당되지 않고 전역변수 \_value의 값이 구조분해 할당으로 return 된다.(이전 값과 동일하다)
- useState()함수가 어디에서 실행되었든 클로저를 통해 \_value값에 접근할 수 있다.

> React hook에서 useState를 통해 상태를 접근하고 유지하기 위해 useState바깥쪽에 state를 저장한다. 각 state들은 선언된 컴포넌트를 유일하게 구별하는 `키`로 접근할 수 있으며 배열 형식으로 저장된다.
> useState안에서 선언된 상태들은 이 배열에 `순서대로 저장된다.`
> 💡주의할점은 배열에 순서대로 저장되기 때문에 조건문이나 반복문에 hooks를 사용하면 안되는 [hooks규칙](https://ko.legacy.reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level)이 있다.

## 4. 클로저의 성능

클로저는 당연하게도 계속 참조를 하고 있는 상태 이기 때문에 메모리상 GC대상이 되지 않는다 이부분을 의도적으로 설계하지 않은 상태라면 메모리 누수로 이어질수도 있다.(C++에서 동적할당으로 객체를 생성한 후 delete를 사용하지 않은 상태와 같다) 이 부분을 방지하기 위해 사용이 끝난 경우 참조를 끊어주는 방법으로 GC대상에 포함 시킬 수 있다.

```javascript
function makeCounter() {
  let count = 0; // 은닉화
  return function () {
    return count++;
  };
}

let counter = makeCounter();
counter = null; // GC 대상으로
```

## 마무리

클로저는 함수형 프로그래밍 및 함수형 컴포넌트를 많이 사용하는 React를 다룬다면 숙지하고 있어야 하는 개념이다. 정리를 하고 보니 라이브러리에서 사용했던 기능들 중에 클로저 현상이 있었다는 부분을 알고 모르고 사용한 부분에 대해 반성하는 계기가 되었다. 리액트를 딥다이브할때 hooks들과 함께 좀더 자세히 포스팅해볼 예정이다.

참고도서
[모던 자바스크립트 Deep Dive](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=251552545&start=slayer)
[코어 자바스크립트](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=206513031)
[You Don’t Know JS 타입과 문법, 스코프와 클로저](https://www.yes24.com/Product/Goods/43219481)

참고글
[자바스크립트의 스코프와 클로저](https://meetup.nhncloud.com/posts/86)
[클로저와 useState Hooks](https://yeoulcoding.tistory.com/149#recentEntries)
[React 톺아보기 - 03. Hooks_1](https://goidle.github.io/react/in-depth-react-hooks_1/)
