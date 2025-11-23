---
title: 자바스크립트 실행컨텍스트(Execution Context)
description: 자바스크립트 실행컨텍스트(Execution Context)
author: "jinseoit"
image: https://velog.velcdn.com/images/radin/post/891d41d1-d887-4afe-960d-1a9b7e6230cc/image.png
published: 2023-08-08
tags: [JavaScript]
---

## 들어가기

> 실행컨텍스트는 자바스크립트에 대한 깊이 있는 이해도와 `스코프`, `호이스팅`, `클로저`, `this`, `let const var 차이` 등을 설명하기 위해서도 꼭 숙지하고 있어야 하는 개념이다.

## 🐬 1. 정의

Context는 사전적 의미로 (어떤 일의) 문맥, 맥락 , 전후 사정 이라는 뜻이다. 이름에서 정의가 유추되듯이 실행컨텍스트는 실행의 맥락 및 전후 사정을 관리한다. 식별자(변수, 함수 클래스 등)를 등록하고 관리하는 스코프와 코드 실행 순서 관리를 구현한 내부 매커니즘으로, 모든 코드는 실행 컨텍스트를 통해 실행되고 관리된다. 즉, `실행할 코드에 제공할 환경 정보들을 추상화하여 객체형태로 나타낸것이다.`

## 🐬 2. 실행 컨텍스트 종류

- `Global` Execution Context - 전역 코드 평가 단계에서 생성되며 최상위 스코프이다 **var키워드로선언된 전역변수**와 **함수 선언문으로 정의된 전역함수**를 전역 객체의 프로퍼티와 메서드에 바인딩한다.

- `Functional` Execution Context - 함수 호출시 생성되고 **매개변수**, **지역변수**, **arguments 객체**를 관리한다.
- `Eval` Function Execution Context - eval코드 평가시 생성된다. strict mode에서 자신만의 독자적인 스코프를 생성한다.

## 🐬 3. 콜스택으로 미리보는 실행컨텍스트

자바스크립트 엔진은 싱글스레드로 각각 하나의 `힙`과 `콜스택`을 가진다. 콜스택에서 실행 컨텍스트가 어떻게 쌓이는지 코드로 확인해보자.

```javascript
function foo() {
  bar();
}
function bar() {
  console.log("call bar");
}
foo();
```

![](https://velog.velcdn.com/images/radin/post/61096c13-31b0-4e9c-99bb-536d89aaef97/image.png)
1️⃣ 먼저 전역 실행 컨텍스트가 생성되고 전역 코드 평가를 시작한다.
2️⃣ 전역 코드 실행단계(런타임 시작)에서 foo()함수를 만나 코드의 제어권을 foo함수에 넘긴다 foo 함수 호출시 `foo함수 실행 컨텍스트`가 생성되며 함수평가단계가 시작된다.
3️⃣ foo `함수 실행단계`에서 bar()함수를 만나 코드의 제어권을 bar함수에 넘긴다 bar함수 호출시`bar 함수 실행 컨텍스트`가 생성되며 함수 평가 단계가 시작된다.
4️⃣ bar함수 실행 단계에서 console.log('call bar')가 출력되고 실행컨텍스트가 bar -> foo -> 전역 순으로 스택에서 pop된다.

> 💡자바스크립트 엔진은 `소스코드 평가`와 `소스코드 실행` 두가지 과정을 나누어 처리한다. 평가단계에서 식별자 및 스코프 정보가 실행 컨텍스에 등록한다.

## 🐬 4. 실행컨텍스트의 구성요소

먼저 실행 컨텍스트의 구성요소들을 그림으로 살펴보자

![](https://velog.velcdn.com/images/radin/post/fcf543e4-70c3-40d5-aa48-f082771521dc/image.png)

### 🦭 4-1 Execution Context

> 실행 컨텍스트는 `VariableEnvironment`, `LexicalEnvironmnet`, `thisBinding` 세가지로 구성하고 있다.

1. VariableEnvironment : 변수와 함수 선언을 저장하고, 식별자와 값을 매핑하는 데 사용된다. `선언 시점`의 LexicalEnvironment의 스냅샷을 유지하며 변경되지 않는다.
2. LexicalEnvironmnet : `초기 VariableEnvironment`와 같은 환경을 참조한다. 이후 함수 실행 도중에 스코프가 변경되거나 클로저와 같은 언어적 특성에 의해 스코프 체인이 변경되면, Variable environment와 Lexical environment는 서로 다른 내용을 가지게 된다.
3. thisBinding : this 키워드가 참조하는 값으로서, 호출 방식에 따라 동적으로 결정된다. default로 전역객체를 참조한다.

### 🦭 4-2 Lexical Environment

> 렉시컬 환경에는 `EnvironmentRecord` , `OuterLexicalEnvironmentReference` 두가지로 구성하고 있다.

1. EnvironmentRecord : 해당 스코프에 포함된 식별자를 등록하고 등록된 식별자에 바인딩된 값을 관리한다.
2. OuterLexicalEnvironmentReference: 상위 스코프를 가르키며, 상위 스코프란 외부 렉시컬 환경을 말한다. 외부 렉시컬 환경에 대한 참조를 통해 단방향 링크드 리스트로 동작하는 `스코프 체이닝` 매커니즘의 핵심 요소이다.

## 🐬 5. 호이스팅 그리고 var, let, const

> 호이스팅(Hoisting)은 자바스크립트의 특징 중 하나로, 코드 실행 전에 변수 선언과 함수 선언을 미리 처리하는 동작을 의미한다.

```javascript
console.log(x); // undefined
var x = 5;
console.log(x); // 5

foo(); // "Hello, World!"
function foo() {
  console.log("Hello, World!");
}
```

위 코드와 같이 변수 및 함수가 선언하기 전 오류없이 값이 출력되고있다. 이러한 결과가 가능한 이유는 `호이스팅`이 먼저 동작하고 `코드실행 단계`가 진행되었기 때문이다.

그렇다면 let이나 const로 선언하면 어떻게 될까?

```javascript
console.log(x); // Uncaught ReferenceError: x is not defined
let x = 5; // const로 선언하여도 같은 에러가 나타난다.
```

x를 찾을 수 없다는 에러가 나타낸다 let이나 const는 `호이스팅이 동작하지 않는걸까?` 결과론적으로는 `호이스팅은 동작한다` 호이스팅이 동작하지만 아직 값을 가지지 못한것이다 변수는 `선언`, `초기화`,`할당` 단계를 가지고 있다 `var는 선언과 초기화가 같이 진행되지만` `let과 const는 선언과 초기화 단계가 분리`가 되어있다.

코드와 실행컨텍스트 그림을 보며 좀더 자세히 살펴보자

```javascript
var x = 1;
const y = 2;

function foo(a) {
  return a * 2;
}

foo(5); // 10
```

![](https://velog.velcdn.com/images/radin/post/a14d8eb7-0ff2-46b2-8138-c1abecfe80f3/image.png)

1️⃣ 전역 실행컨텍스트가 생성되고 전역 코드 평가 과정에서 `var 키워드로 선언된 x`와 `함수 선언문으로 정의된 foo`는 전역 환경 레코드의 `객체 환경 레코드`에 연결된 `BindingObject`를 통해 전역 객체(window)의 프로퍼티와 메서드가 된다.
2️⃣ 전역 코드 평가 과정에서 `const로 선언된 y`는 전역 환경 레코드의 `선언적 환경 레코드`에 등록된다 하지만 선언과 초기화 단계가 분리되어 있어 값이 할당되지 않은 상태이다.

> let과 const는 var와 다르게 평가 과정에서 초기화가 일어나지 않는다. 따라서 선언은 되어있지만 런타임 실행 흐름이 변수 선언문에 도달하기 전까지 값을 알 수 없는 `일시적 사각지대(TDZ - Temporal Dead Zone)`에 빠지게 된다.

## 🐬 5. 스코프 체이닝

> 💡이전 `ES3`에서는 함수가 어디서 호출 되었는지를 기준으로 상위 스코프를 결정하는 `동적 스코프`였지만 코드의 예측 가능성과 유지보수성을 향상을 위해 `ES5`부터는 함수를 어디서 정의했는지에 따라 상위 스코프를 결정하는 `렉시컬 스코프(정적 스코프)`로 동작하고있다.

코드와 그림을 보며 스코프체이닝이 어떻게 일어나는지 확인해보자

```javascript
function floor1() {
  const coin = 10;

  function floor2() {
    const coin = 20;

    function floor3() {
      const coin = 30;
      console.log(coin); // 30
      console.log(doge); // Uncaught ReferenceError: doge is not defined
    }
    floor3();
  }
  floor2();
}
floor1();
```

![](https://velog.velcdn.com/images/radin/post/bdbc9284-96fc-468b-81d8-1cba6568e7b1/image.png)

1️⃣ 전역 실행 컨텍스트의 전역 렉시컬 환경은 최상위 렉시컬 환경 이기 때문에 OuterEVReference는 따로 참조하는 렉시컬 환경이 없다.

2️⃣ floor1의 상위 렉시컬 환경은 `전역 렉시컬 환경`이기에 OuterEVReference는 전역 렉시컬 환경을 참조한다.

3️⃣ floor2의 상위 렉시컬 환경은 `floor1 렉시컬 환경`이기에 OuterEVReference는 floor1 렉시컬 환경을 참조한다.

4️⃣ floor3의 상위 렉시컬 환경은 `floor2 렉시컬 환경`이기에 OuterEVReference는 floor2 렉시컬 환경을 참조한다.

5️⃣ console.log(coin)에서 coin 식별자를 해당 렉시컬 환경부터 상위 렉시컬 환경까지 계속 찾아나간다. floor3의 렉시컬 환경에 coin이 존재하기에 30을 출력한다.

6️⃣ 식별자 doge는 해당 렉시컬 환경 부터 최상단 렉시컬 환경인 전역 렉시컬 환경에도 존재하지 않아 ReferenceError가 나타난다.

### 🦭 정리

> - `식별자 결정 (Identifier Resolution)`은 코드에서 함수나 변수의 값을 결정하는 것으로 해당 렉시컬 환경부터 상위 렉시컬 환경까지 식별자를 찾는다.

- 식별자 결정을위해 상위 스코들을 차례대로 검색하는 매커니즘을 `스코프 체이닝`이라고 하며 스코프 체이닝시 활용하는 연결리스트를 `스코프 체인`이라고 한다.
- 해당 식별자를 찾았을때 상위 렉시컬 환경들에 동일한 식별자가 존재하지만 바인딩하지 않고 가려지는 현상을 `변수 섀도잉(Variable Shadowing)`이라고 한다.

## 마무리

> 실행 컨텍스트가 자바스크립트의 동작원리를 이해하기 위한 중요한 개념인 만큼 코드를 작성해가며 실행컨텍스트를 그려보는 연습을 많이 한 것 같다.
> `스코프`, `호이스팅`, `클로저`, `this`, `let const var`를 이해하기위해 꼭 필요한 개념이었고 용어들 이름이 비슷해 간장공장공장장 느낌이었지만 자주 그리다보니 많이 익숙해진 것 같다. 추후에는 클로저에 대해 딥다이브할 예정이다.

참고도서
[모던 자바스크립트 Deep Dive](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=251552545&start=slayer)
[코어 자바스크립트](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=206513031)

참고 영상
[우아한 테크 - 하루의 실행컨텍스트](https://www.youtube.com/watch?v=EWfujNzSUmw)
