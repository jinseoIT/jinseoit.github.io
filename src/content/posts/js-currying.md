---
title: Currying in JavaScript
description: 부분함수과 커링을 살펴보고 실제 코드에 어떻게 적용되는지 알아보자
author: "jinseoit"
image: "/images/currying.webp"
published: 2026-01-30
tags: [JavaScript]
draft: true
---

## 들어가며

함수형 프로그래밍을 공부하다 보면 커링(Currying)과 부분적용(Partial Application)이라는 용어를 마주치게 된다. 처음에는 비슷해 보이는 두 개념이 혼란스럽지만, 제대로 이해하면 코드 재사용성과 합성 가능성을 크게 높일 수 있다.

이 글에서는 두 개념의 정의와 차이점을 정리하고, 실무에서 어떻게 활용되는지 살펴본다.

## 1. 부분적용 함수란?

부분적용(Partial Application)은 **여러 개의 인자를 받는 함수에서 일부 인자를 미리 고정**하여 새로운 함수를 만드는 기법이다.

```javascript
// 일반 함수
function greet(greeting, name) {
  return `${greeting}, ${name}!`;
}

// 부분적용 함수 구현
function partial(fn, ...presetArgs) {
  return function (...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

// 'Hello'를 미리 고정
const sayHello = partial(greet, "Hello");
sayHello("철수"); // "Hello, 철수!"
sayHello("영희"); // "Hello, 영희!"
```

핵심은 **일부 인자를 먼저 넣어두고, 나머지는 나중에**다.

### 1-1. 실무에서의 부분적용

실무에서 부분적용은 생각보다 자주 마주친다.

**API 요청 함수**

```javascript
// 기본 API 호출 함수
async function apiRequest(baseUrl, endpoint, options) {
  return fetch(`${baseUrl}${endpoint}`, options);
}

// 부분적용으로 baseUrl 고정
const api = partial(apiRequest, "https://api.ourservice.com");

// 사용
api("/users", { method: "GET" });
api("/orders", { method: "POST", body: JSON.stringify(data) });
```

**로깅 함수**

```javascript
function log(level, timestamp, message) {
  console.log(`[${level}] ${timestamp}: ${message}`);
}

const errorLog = partial(log, "ERROR");
const infoLog = partial(log, "INFO");

// 사용할 때마다 레벨 지정 불필요
errorLog(Date.now(), "결제 실패");
infoLog(Date.now(), "사용자 로그인");
```

**React 이벤트 핸들러**

```jsx
// 부분적용 없이 - 매번 화살표 함수 생성
{
  items.map((item) => (
    <Button onClick={() => handleClick(item.id)}>클릭</Button>
  ));
}

// 부분적용 활용
const handleItemClick = partial(handleClick);
{
  items.map((item) => <Button onClick={handleItemClick(item.id)}>클릭</Button>);
}
```

### 1-2. 라이브러리 함수 시그니처 대응

외부 라이브러리의 함수 시그니처가 고정되어 있어서, 중간 인자를 고정해야 하는 경우가 있다.

```javascript
// parseInt는 (string, radix) 시그니처를 가진다
// map의 콜백은 (value, index, array)를 받는다
["1", "2", "3"].map(parseInt);
// 예상: [1, 2, 3]
// 실제: [1, NaN, NaN]
// 왜? parseInt("2", 1), parseInt("3", 2)가 호출됨

// 해결: radix를 10으로 고정한 함수 생성
const parseDecimal = (str) => parseInt(str, 10);
["1", "2", "3"].map(parseDecimal); // [1, 2, 3]
```

lodash의 `_.get`처럼 여러 인자를 받는 유틸리티도 마찬가지다.

```javascript
import _ from "lodash";

// _.get(object, path, defaultValue) 시그니처
const users = [
  { name: "Kim", address: { city: "Seoul" } },
  { name: "Lee", address: null },
];

// path와 defaultValue를 고정하고 object만 받는 함수
const getCity = (obj) => _.get(obj, "address.city", "Unknown");

users.map(getCity); // ['Seoul', 'Unknown']
```

이처럼 라이브러리 함수의 시그니처를 그대로 사용하기 어려울 때, 부분적용으로 원하는 형태의 함수를 만들 수 있다.

## 2. 커링이란?

커링(Currying)은 **여러 인자를 받는 함수를 인자 하나씩 받는 함수들의 체인으로 변환**하는 기법이다.

```javascript
// 일반 함수
function add(a, b, c) {
  return a + b + c;
}
add(1, 2, 3); // 6

// 커링된 함수
function curriedAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}
curriedAdd(1)(2)(3); // 6

// 화살표 함수로 간결하게
const curriedAdd = (a) => (b) => (c) => a + b + c;
```

### 2-1. 부분적용 vs 커링

두 개념이 비슷해 보이지만 명확한 차이가 있다.

- **부분적용**: 인자 여러 개를 한 번에 고정 가능
- **커링**: 인자를 하나씩만 받음 (더 엄격한 형태)

커링은 부분적용의 특수한 형태라고 볼 수 있다. 커링된 함수는 항상 하나의 인자만 받고 새로운 함수를 반환한다.

### 2-2. 실무에서의 커링

**유효성 검사 함수**

```javascript
// 커링된 유효성 검사기
const validate = (rule) => (errorMsg) => (value) => {
  return rule(value) ? null : errorMsg;
};

// 재사용 가능한 검사 함수 생성
const isRequired = validate((v) => v !== "");
const isEmail = validate((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));

// 에러 메시지까지 설정
const requiredName = isRequired("이름을 입력해주세요");
const requiredEmail = isEmail("올바른 이메일 형식이 아닙니다");

// 사용
requiredName(""); // '이름을 입력해주세요'
requiredName("김철수"); // null
requiredEmail("abc"); // '올바른 이메일 형식이 아닙니다'
```

**스타일 유틸리티**

```javascript
// 커링된 CSS 유틸리티
const spacing = (property) => (size) => `${property}: ${size * 4}px`;

const margin = spacing("margin");
const padding = spacing("padding");

margin(2); // "margin: 8px"
margin(4); // "margin: 16px"
padding(3); // "padding: 12px"

// 더 세분화
const marginTop = (size) => `margin-top: ${size * 4}px`;
```

**함수 합성 (Compose)**

커링은 함수 합성과 잘 어울린다. 인자가 하나씩 전달되므로 파이프라인 구성이 자연스럽다.

```javascript
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

const trim = (str) => str.trim();
const toLowerCase = (str) => str.toLowerCase();
const split = (separator) => (str) => str.split(separator); // 커링!

// 파이프라인 구성
const processInput = pipe(trim, toLowerCase, split(" "));

processInput("  Hello World  "); // ['hello', 'world']
```

**React Higher-Order Component**

HOC 패턴에서도 커링이 자주 사용된다.

```javascript
const withLogger = (componentName) => (WrappedComponent) => {
  return function LoggerComponent(props) {
    useEffect(() => {
      console.log(`${componentName} mounted`);
    }, []);

    return <WrappedComponent {...props} />;
  };
};

// 사용
const UserListWithLogger = withLogger("UserList")(UserList);
const OrderTableWithLogger = withLogger("OrderTable")(OrderTable);
```

## 마치며

**부분적용**은 인자를 여러 개 한 번에 고정할 수 있어 유연성이 높다. 주로 API 기본 URL이나 로그 레벨처럼 특정 설정값을 고정할 때 유용하다.

**커링**은 인자를 반드시 하나씩만 받는 엄격한 형태다. 이 덕분에 함수 합성이나 파이프라인 구성에서 빛을 발한다.

핵심 세줄요약

- 부분적용은 일부 인자를 미리 고정하여 새로운 함수를 만든다
- 커링은 다중 인자 함수를 단일 인자 함수의 체인으로 변환한다
- 두 기법 모두 함수 재사용성을 높이고 선언적인 코드 작성에 도움이 된다

## Reference

**도서**

- [함수형 자바스크립트](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=131767959)

**문서**

- [Currying - javascript.info](https://javascript.info/currying-partials)
