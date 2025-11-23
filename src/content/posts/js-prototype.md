---
title: JavaScript - 프로토타입(Prototype)
description: JavaScript - 프로토타입(Prototype)
author: "jinseoit"
image: "https://velog.velcdn.com/images/radin/post/2d2194b0-f842-4131-8fdc-f61a2083a64f/image.png"
published: 2023-09-17
tags: [JavaScript]
---

## 들어가기

> JavaScript는 흔히 프로토타입 기반 언어(prototype-based language)라 불립니다. (프로토타입 기반 객체지향 언어 라고도 말할 수 있습니다.)
> 자바스크립트는 객체지향 프로그래밍을 프로토타입으로 어떻게 접목 시켰는지 이해해야 자바스크립트 동작 원리를 보다 정확히 이해하였다고 말할 수 있습니다.

## 🐬 0 . 객체와 객체지향 프로그래밍

먼저 프로토타입을 알아보기 전 `객체`가 무엇인지 그리고 `객체지향 프로그래밍`의 정의가 무엇이지 알아보자.

> **객체** 란 `상태`를 나타내는 `property`와 `동작`을 나타내는 `method` 를 하나의 논리적인 단위로 구성한 `복합적인 자료구조`이다.
> **객체지향 프로그래밍** 이란 독립적인 `객체의 집합`으로 프로그램을 표현하려는 프로그래밍 패러다임이다.

## 🐬 1. 프로토타입 정의

프로토타입의 정의는 많은 이들에게 혼란을 준다. MDN 혹은 각 책마다의 정의가 비슷하면서도 애매하게 살짝 달랐다. 그 이유는 용어가 이중적으로 사용되고 있기 때문이다.

> 1. 프로토타입은 개발 사이클의 **초기 단계에서 제품** 혹은 **어플리케이션의 외형이나 동작을 보여줄 수 있는 모델**을 의미합니다. - MDN

> 2. 자바스크립트는 프로토타입 기반 언어이다. 클래스 기반 언어에서는 '상속'을 사용하지만 프로토타입 기반 언어에서는 **어떤 객체를 원형**으로 삼고 이를 복제(참조)함으로써 상속과 비슷한 효과를 얻는다. - 코어 자바스크립트

> 3. **프로토타입 객체**(또는 줄여서 프로토타입)란 객체지향 프로그래밍의 근간을 이루는 객체 간 상속을 구현하기 위해 사용된다.

즉, 자바스크립트에서 프로토타입의 개념은 `프로토타입 객체`(Prototype Object), `프로토타입 링크`(Prototype Link) 두 가지 개념을 가르킨다.

1. Prototype Object - 객체의 원형(부모)
2. Prototype Link - 객체와의 참조를 이어주는 링크(연결)

## 🐬 2. 프로토타입 객체(Prototype Object) & 프로토타입 링크( Prototype Link)

### 🦭 2-1 프로토타입 객체(Prototype Object)

프로토타입 객체(줄여서 프로토타입)은 어떤 객체의 **`상위(부모) 객체`**의 역할을 하는 객체로서 다른 객체에 공유 프로퍼티(메서드 포함)를 제공한다. 프로토타입을 상속받은 하위(자식) 객체는 **상위 객체의 프로퍼티를 `자신의 프로퍼티처럼` 사용할 수 있다.**

### 🦭 2-2 내부슬롯 [[Prototype]]

모든 객체는 [[Prototype]] 이라는 내부 슬롯을 가지며, 이 **내부 슬롯의 값**은 `상위(부모) 객체` 다. 즉, 객체는 내부슬롯 [[Prototype]]으로 부모 객체를 참조하고 있다고 말할 수 있다.
![](https://velog.velcdn.com/images/radin/post/64517b83-ab3a-402d-a66a-83f8af7233f1/image.png)
[[Prototype]]에 저장되는 프로토타입은 `객체 생성 방식에 의해 결정`된다.

- 객체 리터럴에 의해 생성된 객체 프로토타입 : Object.prototype
- 생성자 함수에 의해 생성된 객체의 프로토타입 : 생성자 함수의 prototype 프로퍼티에 바인딩되어 있는 객체

### 🦭 2-3 프로토타입 링크(Prototype Link)

`__proto__`속성은 **프로토타입 링크**라고 불리며 모든 객체에 존재하는 레퍼런스 속성이자 `객체의 원형을 참조`한다. 객체가 생성될 때 프로토타입이 결정되며 사용자가 임의로 변경할 수 있으며, **사용자가 임의로 변경**하는 특징을 사용해 `상속`을 구현할 수 있다.

[[Prototype]]내부 슬롯에는 직접 접근할 수 없기 때문에 `__proto__`접근자 프로퍼티를 통해 자신의 프로토타입, 즉 자신의 [[Prototype]] 내부 슬롯이 가리키는 프로토타입에 `__proto__`를 통해 간접적으로 접근할 수 있다.

```javascript
const student = {
  name: "Lee",
  score: 90,
};
// student에는 hasOwnProeprty 메서드가 없지만 아래 구문은 동작한다.
console.log(student.hasOwnProperty("name")); // true
console.dir(student);
```

![](https://velog.velcdn.com/images/radin/post/89cecc0a-535d-4329-a693-065f760dff96/image.png)

### 🦭 2-4 [[Prototype]] vs prototype 프로퍼티

함수도 객체이므로 [[Prototype]] 내부 슬롯을 갖는다. 그런데 `함수 객체`는 **일반 객체**와 달리 `prototype 프로퍼티`도 소유하게 된다.

> prototype 프로퍼티와 [[Prototype]]은 모두 `프로토타입 객체`를 가리키지만 `관점의 차이`가 있다.

```javascript
function Person(name) {
  this.name = name;
}

const foo = new Person("Lee");

console.dir(Person); // prototype 프로퍼티가 있다.
console.dir(foo); // prototype 프로퍼티가 없다.
```

- [[Prototype]]
  - 함수를 포함한 `모든 객체`가 가지고 있는 내부 슬롯이다.
  - `객체`의 입장에서 `자신의 부모` 역할을 하는 프로토타입 객체를 가리키며 `함수 객체`의 경우 `Function.prototype`를 가리킨다.

```javascript
console.log(Person.__proto__ === Function.prototype);
```

- prototype 프로퍼티
  - `함수 객체만` 가지고 있는 프로퍼티이다.
  - 함수 객체가 `생성자`로 사용될 때 이 함수를 통해 생성될 객체의 `부모 역할을 하는 객체`(프로토타입 객체)를 가리킨다.

```javascript
console.log(Person.prototype === foo.__proto__);
```

> 💡 함수 객체만이 소유하는 prototype 프로퍼티는 non-constructor인 `화살표 함수`와 `메서드`는 prototype 프로퍼티를 소유하지 않으며 프로토타입도 생성하지 않는다.

- constructor: 함수 선언문, 함수표현식, 클래스
- non-constructor: 화살표 함수, 메서드

### 🦭 2-5 프로토타입 삼각편대

프로토타입을 삼각편대로 표현한다면 `instance`, `constructor`, `prototype`으로 표현할 수 있다.

```javascript
function Person(name) {
  this.name = name;
}

const radin = new Person("radin");
console.log(Person.prototype == radin.__proto__);
```

![](https://velog.velcdn.com/images/radin/post/3a0dbf32-2488-4747-b6f3-8bff268020aa/image.png)

> 객체의 `__proto__` 접근자 프로퍼티와 함수 객체의 prototype 프로퍼티는 결국 동일한 프로토타입을 가리킨다.

## 🐬 3. constructor 프로퍼티

프로토타입 객체는 `constructor 프로퍼티`를 갖는다. 이 constructor 프로퍼티는 객체의 입장에서 `자신을 생성한 객체`를 가리킨다.

```javascript
function Person(name) {
  this.name = name;
}

const foo = new Person("Lee");

// Person() 생성자 함수에 의해 생성된 객체를 생성한 객체는 Person() 생성자 함수이다.
console.log(Person.prototype.constructor === Person);

// foo 객체를 생성한 객체는 Person() 생성자 함수이다.
console.log(foo.constructor === Person);

// Person() 생성자 함수를 생성한 객체는 Function() 생성자 함수이다.
console.log(Person.constructor === Function);
```

1️⃣ Person() 생성자 함수에 의해 객체 foo가 생성
2️⃣ foo 객체를 생성한 객체는 Person() 생성자 함수이다.
3️⃣ foo 객체 입장에서 자신을 생성한 객체는 Person() 생성자 함수이며, foo 객체의 프로토타입 객체는 `Person.prototype`이다.
즉, 프로토타입 객체 `Person.prototype`의 `constructor 프로퍼티`는 **Person() 생성자 함수**를 가리킨다.

## 🐬 4. 프로토타입 체인

프로토타입 체인은 `__proto__`링크를 따라 `단방향`으로 부모 역할을 하는 프로토타입 객체의 **프로퍼티**나 **메소드**를 차례대로 검색하는 것을 말한다.

```javascript
const array = [];
array.hasOwnProperty("hasOwnProperty"); // false
array.hasOwnProperty("length"); // true
```

array이의 프로퍼티에는 `hasOwnProperty 메서드가 없지만` 정상적으로 동작하는 이유도 프로토타입 체인을 통해 상위 프로토타입객체의 프로퍼티나 메서드를 검색하였기 때문에 가능하였다 이 검색해 나가는 과정을 `프로토타입 체이닝`이라고 한다.

![](https://velog.velcdn.com/images/radin/post/2e30e2ec-63fc-4959-9bec-a693f0078e42/image.png)

> 💡프로토타입 체인 최상단 종점은 `Object.prototype`이다.

## 🐬 5. 오버라이딩과 프로퍼티 섀도잉

> 💡오버라이딩 개념은 자바스크립트 뿐만 아닌 `객체 지향형 프로그래밍` 언어에 모두 사용되고 있는 공통 용어이다.

- 오버라이딩 - 상위 클래스가 가지고 있는 메서드를 `하위 클래스가 재정의`하여 사용하는 방식
- 오버로딩 - 함수의 이름은 동일하지만 매개변수의 타입 또는 개수가 다른 메서드를 구현하고 매개변수에 의해 메서드를 구별하여 호출하는 방식이다. 자바스크립트는 오버로딩을 지원하지 않지만 arguemnts객체를 사용하여 구현할 수 있다.

```javascript
const Person = (function () {
  // 생성자 함수
  function Person(name) {
    this.name = name;
  }
  // 프로토타입 메서드
  Person.prototype.sayHello = function () {
    console.log(`Hi! My name is ${this.name}`);
  };
  // 생성자 함수 반환
  return Person;
})();

const me = new Person("Lee");
// 인스턴스 메서드
me.sayHello = function () {
  console.log(`Hey! My name is ${this.name}`);
};
// 인스턴스 메서드가 호출된다. 프로토타입 메서드는 인스턴스 메서드에 의해 가려진다.
me.sayHello(); // Hey! My name is Lee
```

생성자 함수로 객체(인스턴스)를 생성한 다음, 인스턴스 메서드를 추가하였다. 그림으로 나타내면 아래와 같다.
![](https://velog.velcdn.com/images/radin/post/00acf029-80c5-4a20-b4e8-23eda0ef012b/image.png)
프로토타입 프로퍼티와 같은 이름의 `프로퍼티를 인스턴스`에 추가하면 프로토타입 체인을 따라 프로토타입 프로퍼티를 검색하여 프로토타입 프로퍼티를 덮는 것이 아닌 `인스턴스 프로퍼티`로 추가한다.
인스턴스 메서드 sayHello는 프로토타입 메서드 sayHello `오버라이딩` 했고, 프로토타입 메서드 sayHello는 가려진다. 이처럼 상속 관계에 의해 프로퍼티가 가려지는 현상을 `프로퍼티 섀도잉`(property shadowing)이라 한다.

## 🐬 6. 프로토타입 상속에 대한 오해

> 프로토타입에서 자주 거론되는 `상속`은 클래스 기반 객체지향 언어에서 말하는 상속과 다르다.

🙎‍♂️ 자바스크립트에서 ES6에 추가된 class는 생성자 함수와 동일하게 동작한다.
=> 프로토타입기반으로 동일하게 동작한다.

```javascript
class Person {
  constructor(name, age) {
    ((this.name = name), (this.age = age));
  }
}
function Person2(name, age) {
  this.name = name;
  this.age = age;
}
// class로 생성
const person = new Person("minsu", 20);
// 생성자 함수로 생성
const person2 = new Person2("minsu", 20);
```

다른 **클래스 기반 객체지향 언어의 class**와 **자바스크립트 class**는 다르게 동작한다. 이부분때문에 `상속`에 대하여 오해하는 부분이 있다. 자바스크립트에서 `복사` 를 통한 상속은 없다. 만들어진 인스턴스 내에 데이터가 새로 복사한게 아닌 원형(부모)객체를 `참조`함으로서 **상속처럼 구현**을 한 것이다. 즉, 상속 보다는 부모로 부터 `위임(참조)`한다고 말할 수 있다.

## 마무리

처음 프로토타입에 대해 공부할때 자바의 객체지향 시점으로 이해할려고 해서 상당히 헷갈렸던 기억이 난다. 그 후에도 용어부터 제대로 정리하지 않고 책과 참고 아티클들을 봤더니 혼란이 더욱 가중 되었다. 새로운 정보를 학습할때 용어에 대한 개념을 확실히 알고 단계별로 나아가야 이해의 흐름을 이어나갈 수 있는 것 같다.

## Reference

> 참고 도서
> [모던 자바스크립트 Deep Dive](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=251552545&start=slayer)
> [코어 자바스크립트](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=206513031)
> 참고 영상
> [10분 테크톡 - 크리스의 Prototype](https://www.youtube.com/watch?v=RYxgNZW3wl0)
> [10분 테크톡 - 아놀드의 프로토타입 뽀개기](https://www.youtube.com/watch?v=TqFwNFTa3c4)
> 참고 자료
> [Object prototypes - mdn](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Objects/Object_prototypes)
> [자바스크립트는 왜 프로토타입을 선택했을까 - 임성묵](https://medium.com/@limsungmook/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%8A%94-%EC%99%9C-%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85%EC%9D%84-%EC%84%A0%ED%83%9D%ED%96%88%EC%9D%84%EA%B9%8C-997f985adb42)
> [JavaScript : 프로토타입(prototype) 이해 - 넥스트리소프트](https://www.nextree.co.kr/p7323/)
