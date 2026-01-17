---
title: JavaScript 프로토타입 완벽 이해하기
description: 자바스크립트 프로토타입의 동작 원리와 실무에서 알아야 할 핵심 개념
author: "jinseoit"
image: "https://images.velog.io/post-images/adam2/12a5e250-fd90-11e9-959f-1f9679bea880/1nDBFaMpflmSsIKfMLxWIvQ.jpeg"
published: 2026-01-17
tags: [JavaScript]
draft: true
---

## 들어가며

자바스크립트를 다루다 보면 프로토타입이라는 개념을 피할 수 없다. 클래스 문법이 도입된 ES6 이후에도 내부적으로는 여전히 프로토타입 기반으로 동작하기 때문에, 이 개념을 제대로 이해하지 못하면 예상치 못한 버그를 만나거나 라이브러리 코드를 읽을 때 막히게 된다.

이 글에서는 프로토타입의 핵심 개념을 정리하고, 실무에서 자주 마주치는 상황들을 함께 살펴본다.

## 객체와 객체지향 프로그래밍

프로토타입을 이해하려면 먼저 자바스크립트에서 말하는 객체가 무엇인지 명확히 해야 한다.

**객체**는 상태(property)와 동작(method)을 하나의 단위로 묶은 자료구조다. **객체지향 프로그래밍**은 이런 객체들의 협력으로 프로그램을 구성하는 패러다임이다.

## 프로토타입이란?

프로토타입 개념이 혼란스러운 이유는 하나의 용어가 여러 맥락에서 사용되기 때문이다. 자바스크립트에서 프로토타입은 크게 두 가지를 의미한다.

1. **프로토타입 객체(Prototype Object)** - 다른 객체의 원형이 되는 객체
2. **프로토타입 링크(Prototype Link)** - 객체 간의 참조를 연결하는 내부 메커니즘

클래스 기반 언어(Java, C++ 등)에서는 클래스를 정의하고 인스턴스를 생성하는 방식으로 상속을 구현한다. 반면 자바스크립트는 **객체가 다른 객체를 직접 참조**하는 방식으로 상속과 유사한 효과를 낸다. 이것이 프로토타입 기반 언어의 핵심이다.

## 프로토타입 객체와 프로토타입 링크

### 프로토타입 객체(Prototype Object)

프로토타입 객체는 다른 객체의 **부모 역할**을 하는 객체다. 자식 객체는 프로토타입 객체의 프로퍼티와 메서드를 자신의 것처럼 사용할 수 있다. 이것이 자바스크립트에서 코드 재사용을 가능하게 하는 핵심 메커니즘이다.

### 내부 슬롯 [[Prototype]]

모든 객체는 `[[Prototype]]`이라는 내부 슬롯을 가진다. 이 슬롯에는 해당 객체의 프로토타입(부모 객체)에 대한 참조가 저장된다.

![](https://velog.velcdn.com/images/radin/post/64517b83-ab3a-402d-a66a-83f8af7233f1/image.png)

`[[Prototype]]`에 어떤 객체가 저장되는지는 **객체 생성 방식**에 따라 결정된다.

| 생성 방식               | [[Prototype]] 값      |
| ----------------------- | --------------------- |
| 객체 리터럴 `{}`        | `Object.prototype`    |
| 생성자 함수 `new Foo()` | `Foo.prototype`       |
| `Object.create(proto)`  | 인자로 전달한 `proto` |

### 프로토타입 링크(**proto**)

`[[Prototype]]` 내부 슬롯에는 직접 접근할 수 없다. 대신 `__proto__` 접근자 프로퍼티를 통해 간접적으로 접근한다.

```javascript
const student = {
  name: "Lee",
  score: 90,
};

// student 객체에는 hasOwnProperty 메서드가 없다.
// 하지만 프로토타입 체인을 통해 Object.prototype의 메서드를 사용할 수 있다.
console.log(student.hasOwnProperty("name")); // true
```

![](https://velog.velcdn.com/images/radin/post/89cecc0a-535d-4329-a693-065f760dff96/image.png)

> **실무 팁**: `__proto__`는 레거시 기능이다. 코드에서 프로토타입을 조작해야 한다면 `Object.getPrototypeOf()`와 `Object.setPrototypeOf()`를 사용하자.

### [[Prototype]] vs prototype 프로퍼티

이 부분이 가장 혼란스러운 지점이다. 둘 다 "프로토타입"이라는 단어를 쓰지만 역할이 다르다.

```javascript
function Person(name) {
  this.name = name;
}

const foo = new Person("Lee");

console.dir(Person); // prototype 프로퍼티가 있다
console.dir(foo); // prototype 프로퍼티가 없다
```

**[[Prototype]] (내부 슬롯)**

- **모든 객체**가 가지고 있다
- 해당 객체의 **부모**를 가리킨다
- 함수 객체의 경우 `Function.prototype`을 가리킨다

```javascript
console.log(Person.__proto__ === Function.prototype); // true
```

**prototype 프로퍼티**

- **함수 객체만** 가지고 있다
- 이 함수로 생성될 **인스턴스의 부모**가 될 객체를 가리킨다

```javascript
console.log(Person.prototype === foo.__proto__); // true
```

한 문장으로 정리하면: `[[Prototype]]`은 "내 부모는 누구인가"이고, `prototype` 프로퍼티는 "내가 만들 자식의 부모는 누구인가"다.

**주의할 점**: 화살표 함수와 ES6 메서드 축약 표현은 `prototype` 프로퍼티를 가지지 않는다. 따라서 생성자로 사용할 수 없다.

```javascript
const ArrowFunc = () => {};
console.log(ArrowFunc.prototype); // undefined
new ArrowFunc(); // TypeError: ArrowFunc is not a constructor
```

### 프로토타입 관계도

생성자 함수, 프로토타입 객체, 인스턴스 세 가지의 관계를 그림으로 표현하면 다음과 같다.

```javascript
function Person(name) {
  this.name = name;
}

const radin = new Person("radin");

// 이 세 가지 관계를 이해하면 프로토타입의 90%는 이해한 것이다
console.log(Person.prototype === radin.__proto__); // true
console.log(Person.prototype.constructor === Person); // true
console.log(radin.constructor === Person); // true (프로토타입 체인)
```

![](https://velog.velcdn.com/images/radin/post/3a0dbf32-2488-4747-b6f3-8bff268020aa/image.png)

핵심은 인스턴스의 `__proto__`와 생성자 함수의 `prototype`이 **같은 객체를 가리킨다**는 점이다.

## constructor 프로퍼티

프로토타입 객체는 `constructor` 프로퍼티를 가진다. 이 프로퍼티는 해당 프로토타입과 연결된 생성자 함수를 가리킨다.

```javascript
function Person(name) {
  this.name = name;
}

const foo = new Person("Lee");

// 프로토타입의 constructor는 생성자 함수를 가리킨다
console.log(Person.prototype.constructor === Person); // true

// 인스턴스도 프로토타입 체인을 통해 constructor에 접근할 수 있다
console.log(foo.constructor === Person); // true

// 함수 자체의 constructor는 Function을 가리킨다
console.log(Person.constructor === Function); // true
```

`constructor` 프로퍼티는 실무에서 인스턴스의 생성자를 확인하거나, 동일한 생성자로 새 인스턴스를 만들 때 유용하다.

```javascript
// 인스턴스로부터 같은 타입의 새 객체 생성
const bar = new foo.constructor("Kim");
console.log(bar instanceof Person); // true
```

## 프로토타입 체인

프로토타입 체인은 자바스크립트의 프로퍼티/메서드 검색 메커니즘이다. 객체에서 프로퍼티를 찾을 때, 해당 객체에 없으면 `[[Prototype]]` 링크를 따라 상위 객체에서 찾고, 없으면 또 상위로... 이 과정을 반복한다.

```javascript
const array = [];

// array 자체에는 hasOwnProperty가 없다
array.hasOwnProperty("hasOwnProperty"); // false

// 하지만 프로토타입 체인을 통해 Object.prototype의 메서드를 사용할 수 있다
array.hasOwnProperty("length"); // true
```

검색 순서를 따라가보면:

1. `array` 객체에서 `hasOwnProperty` 검색 → 없음
2. `array.__proto__` (= `Array.prototype`)에서 검색 → 없음
3. `Array.prototype.__proto__` (= `Object.prototype`)에서 검색 → **있음!**

![](https://velog.velcdn.com/images/radin/post/2e30e2ec-63fc-4959-9bec-a693f0078e42/image.png)

프로토타입 체인의 종점은 항상 `Object.prototype`이고, 그 위는 `null`이다. 체인 끝까지 찾지 못하면 `undefined`를 반환한다.

```javascript
console.log(Object.prototype.__proto__); // null
console.log(array.nonExistentMethod); // undefined
```

## 오버라이딩과 프로퍼티 섀도잉

프로토타입 체인에서 같은 이름의 프로퍼티가 여러 단계에 존재하면 어떻게 될까?

```javascript
function Person(name) {
  this.name = name;
}

// 프로토타입에 메서드 정의
Person.prototype.sayHello = function () {
  console.log(`Hi! My name is ${this.name}`);
};

const me = new Person("Lee");

// 인스턴스에 같은 이름의 메서드 추가
me.sayHello = function () {
  console.log(`Hey! My name is ${this.name}`);
};

me.sayHello(); // "Hey! My name is Lee"
```

인스턴스에 같은 이름의 프로퍼티를 추가하면, 프로토타입의 프로퍼티를 **덮어쓰는 게 아니라** 인스턴스에 새로운 프로퍼티가 생성된다. 프로토타입 체인은 **가장 먼저 찾은 프로퍼티를 사용**하므로 프로토타입의 메서드는 가려진다.

![](https://velog.velcdn.com/images/radin/post/00acf029-80c5-4a20-b4e8-23eda0ef012b/image.png)

이 현상을 **프로퍼티 섀도잉(Property Shadowing)**이라 한다. 상위 프로퍼티가 하위 프로퍼티에 의해 가려지는 것이다.

프로토타입의 원본 메서드에 접근하려면 명시적으로 호출해야 한다.

```javascript
// 인스턴스 메서드가 아닌 프로토타입 메서드 직접 호출
Person.prototype.sayHello.call(me); // "Hi! My name is Lee"
```

## 상속이 아닌 위임(Delegation)

자바스크립트의 프로토타입을 "상속"이라고 표현하지만, 엄밀히 말하면 클래스 기반 언어의 상속과는 다르다.

```javascript
// ES6 class와 생성자 함수는 내부적으로 동일하게 동작한다
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

function Person2(name, age) {
  this.name = name;
  this.age = age;
}

const person = new Person("minsu", 20);
const person2 = new Person2("minsu", 20);
```

Java나 C++에서 상속은 부모 클래스의 프로퍼티와 메서드를 자식 클래스로 **복사**하는 것이다. 하지만 자바스크립트에서는 복사가 일어나지 않는다. 인스턴스는 프로토타입 객체를 **참조**할 뿐이다.

따라서 "상속"보다 "위임(Delegation)"이 더 정확한 표현이다. 인스턴스가 특정 메서드를 호출하면, 해당 인스턴스에 없을 경우 프로토타입에게 처리를 위임하는 것이다.

```javascript
// 프로토타입을 수정하면 이미 생성된 인스턴스에도 영향을 준다
// 복사였다면 이런 일이 일어나지 않는다
Person.prototype.greet = function () {
  console.log(`Hello, I'm ${this.name}`);
};

person.greet(); // "Hello, I'm minsu" - 이미 생성된 인스턴스에서도 사용 가능
```

이 점을 이해하면 프로토타입 체인의 동적인 특성과 메모리 효율성을 이해할 수 있다.

## 실무에서 프로토타입

마지막으로 실무에서 프로토타입을 다룰 때 알아두면 좋은 점들을 정리한다.

**내장 객체의 프로토타입 수정은 피하자**

```javascript
// 안티패턴: 내장 객체 프로토타입 확장
Array.prototype.last = function () {
  return this[this.length - 1];
};
```

내장 객체의 프로토타입을 수정하면 다른 라이브러리와 충돌할 수 있고, 코드 예측이 어려워진다. 유틸리티 함수를 별도로 만들어 사용하자.

**성능 고려사항**

프로토타입 체인이 깊으면 프로퍼티 검색에 시간이 더 걸린다. 자주 접근하는 프로퍼티는 인스턴스에 직접 저장하는 것이 유리할 수 있다.

**instanceof의 동작 원리**

`instanceof`는 프로토타입 체인을 검사한다. 이 점을 알면 디버깅에 도움이 된다.

```javascript
console.log([] instanceof Array); // true
console.log([] instanceof Object); // true (체인에 Object.prototype이 있음)
```

## 마치며

프로토타입은 자바스크립트의 객체 시스템을 이해하는 열쇠다. ES6 클래스 문법이 널리 사용되면서 프로토타입을 직접 다룰 일은 줄었지만, 클래스도 결국 프로토타입 위에서 동작한다. 라이브러리 코드를 읽거나, 상속 관련 버그를 디버깅하거나, 기술 인터뷰를 준비할 때 이 개념은 반드시 필요하다.

핵심만 기억하자:

- 모든 객체는 `[[Prototype]]`으로 다른 객체를 참조한다
- 프로퍼티 검색은 프로토타입 체인을 따라 올라간다
- 자바스크립트의 "상속"은 복사가 아닌 참조(위임)다

## Reference

**도서**

- [모던 자바스크립트 Deep Dive](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=251552545&start=slayer)
- [코어 자바스크립트](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=206513031)

**영상**

- [10분 테크톡 - 크리스의 Prototype](https://www.youtube.com/watch?v=RYxgNZW3wl0)
- [10분 테크톡 - 아놀드의 프로토타입 뽀개기](https://www.youtube.com/watch?v=TqFwNFTa3c4)

> 참고 자료
> [Object prototypes - mdn](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Objects/Object_prototypes)

> [자바스크립트는 왜 프로토타입을 선택했을까 - 임성묵](https://medium.com/@limsungmook/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%8A%94-%EC%99%9C-%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85%EC%9D%84-%EC%84%A0%ED%83%9D%ED%96%88%EC%9D%84%EA%B9%8C-997f985adb42)
