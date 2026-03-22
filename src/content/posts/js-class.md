---
title: Javascript의 class
description: 다른 언어와는 다른 JavaScript의 class
author: "jinseoit"
image: "/images/class.webp"
published: 2026-01-31
tags: [JavaScript]
draft: true
---

## 들어가며

Javascript는 `prototype`기반의 객체지향 프로그래밍 언어이다.
그렇다면 다른 언어와 같은 `class`가 왜 추가 된 것일까?
ES6에 추가된 class는 기존 생성자 함수와 어떤 차이가 있는지 또 내부적으로 어떤 기능들이 있고 어떻게 활용하면 되는지 알아보자.

## 1. 생성자 함수와 클래스 차이

1. `클래스`를 `new 연산자` 없이 호출하면 에러가 발생. `생성자 함수`는 `new 연산자` 없이 호출하면 `일반 함수`로 호출
2. 클래스는 상속을 지원 `extends`와 `super` 키워드를 제공
3. 클래스는 `호이스팅`이 발생하지 않는 것처럼 동작한다. 함수 선언문으로 정의된 생성자 함수는 함수 호이스팅이, 함수 표현식으로 정의한 생성자 함수는 변수 호이스팅이 발생한다.
4. 클래스 내의 모든 코드에는 암묵적으로 `strict mode`가 지정되어 실행되며 strict mode를 해제할 수 없다. 하지만 생성자 함수는 암묵적으로 strict mode가 지정되지 않는다.
5. 클래스의 `constructor`, `프로토타입 메서드`, `정적 메서드`는 모두 프로퍼티 어트리뷰트 [[Enumerable]]의 값이 false다. 다시 말해, 열거되지 않는다.

## 2. 클래스의 정의

클래스 class 키워드를 사용하여 정의한다

1. class 키워드를 사용하여 정의
2. `Pascal Case` 사용

```javascript
// 클래스 선언문
class Person {}
// 익명 클래스 표현식
const Person = class {};
// 기명 클래스 표현식
const Person = class MyClass {};
```

클래스를 표현식으로 정의할 수 있다는 것은 클래스가 `값`으로 사용할 수 있는 `일급 객체`라는 것을 의미한다.

> 일급객체의 특징 4가지

- 무명의 리터럴로 생성할 수 있다. 즉, 런타임에 생성이 가능하다.
- 변수나 자료구조(객체, 배열 등)에 저장할 수 있다.
- 함수의 매개변수에게 전달할 수 있다.
- 함수의 반환값으로 사용할 수 있다.

클래스는 `함수`다. 따라서 클래스는 `값`처럼 사용할 수 있는 `일급 객체`다.

### 2-1. 클래스의 내부 메서드

클래스 몸체에서 정의할 수 있는 메서드는 `constructor`(생성자), `프로토타입 메서드`, `정적 메서드` 세가지가 있다.

```javascript
// 클래스 선언문
class Person {
  // 생성자
  constructor(name) {
    // 인스턴스 생성 및 초기화
    this.name = name; // name 프로퍼티는 public하다.
  }
  // 프로토타입 메서드
  sayHi() {
    console.log(`Hi! My name is ${this.name}`);
  }
  // 정적 메서드
  static sayHello() {
    console.log("Hello!");
  }
}
// 인스턴스 생성
const me = new Person("Lee");
// 인스턴스의 프로퍼티 참조
conosle.log(me.name); // Lee
me.sayHi();
Person.sayHeelo(0);
```

### 2-2. 정적 메서드와 프로토타입 메서드의 차이

1. 정적 메서드와 프로토타입 메서드는 자신이 속해 있는 프토토타입 체인이 다르다.
2. 정적 메서드는 클래스로 호출하고 프로토타입 메서드는 인스턴스로 호출한다.
3. 정적 메서드는 인스턴스 프로퍼티를 참조할 수 없지만 프로토타입 메서드는 인스턴스 프로퍼티를 참조할 수 있다.

### 2-3. 클래스에서 정의한 메서드의 특징

1. function 키워드를 생략한 메서드 축약 표현을 사용한다.
2. 객체 리터럴과는 다르게 클래스에 메서드를 정의할 때는 콤마가 필요 없다.
3. 암묵적으로 strict mode로 실행된다.
4. for …in문이나 Object.keys 메서드 등으로 열거할 수 없다. 즉, 프로퍼티의 열거 가능 여부를 나타내며, 불리언 값을 갖는 프로퍼티 어트리뷰트 [[Enumerable]]의 값이 false다.
5. 내부 메서드 [[Construct]]를 갖지 않는 non-constructor다. 따라서 new 연산자와 함께 호출할 수 없다.

## 3. 클래스 호이스팅

클래스 선언문으로 정의한 `클래스`는 함수 선언문과 같이 소스코드 평과 과정, 즉 `런타임 이전`에 먼저 `평가`되어 함수 객체를 생성한다.

```javascript
// 클래스 선언문
class Person {}
console.log(typeof Person); // function
```

이때 클래스가 평가되어 생성된 함수 객체는 생성자 함수로서 호출할 수 있는 함수, 즉 `constructor`다.

클래스는 클래스 정의 이전에 참조할 수 없다.

```javascript
console.log(Person);
// ReferenceError: Cannot access 'Person' before initialization

// 클래스 선언문
class Person {}
```

클래스 선언문도 변수 선언, 함수 정의와 마찬가지로 `호이스팅이 발생`한다.

클래스는 let, const 키워드로 선언한 변수처럼 호이스팅된다. 클래스 선언문 이전에 `TDZ`에 빠지기 때문에 호이스팅이 발생하지 않는 것 처럼 동작한다.

## 4. 인스턴스 생성

클래스는 `생성자 함수`이며 `new 연산자`와 함께 호출되어 `인스턴스`를 생성한다.

```javascript
class Person {}
// 인스턴스 생성
const me = new Person();
console.log(me); // Person {}
```

클래스는 인스턴스를 생성하는 것이 유일한 존재 이유이므로 반드시 `new 연산자`와 함께 호출해야 한다.

```javascript
const Person = class MyClass {};
// 함수 표현식과 마찬가지로 클래스를 가리키는 식별자로 인스턴스를 생성해야 한다.
const me = new Person();
// 클래스 이름 MyClass는 함수와 동일하게 클래스 몸체 내부에서만 유요한 식별자다.
console.log(MyClass); // ReferenceError : MyClass is not defiend

const you = new MyClass(); // ReferenceError: MyClass is not defiend
```

기명 함수 표현식과 마찬가지로 클래스 표현식에서 사용한 클래스 이름은 외부 코드에서 접근이 불가능하다.

## 5. 메서드

클래스 몸체에 정의할 수 있는 메서드는 `constructor 생성자` `프로토타입 메서드`, `정적 메서드` 가 있다.

> ECMAScript(ES11/ECMAScript2020) - 인스턴스 프로퍼티는 반드시 constructor 내부에서 정의해야 한다.

### 5-1. constructor

constructor는 인스턴스를 생성하고 초기화하기 위한 특수 메서드다. constructor는 이름을 변경할 수 없다.

```javascript
class Person {
  // 생성자
  constructor(name) {
    // 인스턴스 생성 및 초기화
    this.name = name;
  }
}

// 클래스는 함수다
console.log(typeof Person); // fucntion
console.dir(Person);

// 생성자 함수
function Person(name) {
  // 인스턴스 생성 및 초기화
  this.name = name;
}
```

![](https://velog.velcdn.com/images/radin/post/bcd10b42-8bf5-412b-b8ea-95900f08e390/image.png)
클래스는 평가되어 함수 객체가 된다. 모든 함수 객체가 가지고 있는 prototype 프로퍼티가 가리키는 프로토타입 객체의 `constructor 프로퍼티`는 클래스 자신을 가리키고 있다.

클래스가 인스턴스를 생성하는 `생성자 함수`라는 것을 의미한다. 즉, new 연산자와 함께 클래스를 호출하면 클래스는 인스턴스를 생성한다.

constructor 내부의 `this`는 생성자 함수와 마찬가지로 클래스가 `생성한 인스턴스`를 가리킨다.
constructor는 메서드로 해석되는 것이 아닌 클래스가 평가되어 생성한 함수 객체 코드의 일부가 된다.

클래스 정의가 평가되면 constructor의 기술된 동작을 하는 함수 객체가 생성된다.

**중간정리**

1. 인스턴스를 `초기화` 할려면 `constructor`를 생략해서는 안된다.
2. `new 연산자`와 함께 클래스가 호출되면 생성자 함수와 동일하게 `암묵적`으로 `this`, 즉 `인스턴스를 반환`한다.
3. this가 아닌 다른 객체를 명시적으로 반환하면 this, 즉 인스턴스가 반환되지 못하고 return 문에서 명시한 `객체`가 반환된다.
4. 명시적으로 `원시값`을 반환하면 원시값 반환은 `무시`되고 `암묵적으로 this`가 반환된다.
5. constructor 내부에서 명시적으로 this가 아닌 다른 값을 반환하는 것은 클래스의 기본 동작을 훼손한다. 따라서 constructor 내부에서 **return 문을 반드시 생략**해야 한다.

### 5-2. 프로토타입 메서드

생성자 함수를 사용하여 인스턴스를 생성하는 경우 프로토타입 메서드 생성하기 위해 `명시적`으로 프로토타입 메서드를 `추가`해야 한다.

```javascript
// 생성자 함수
function Person(name) {
	this.name = name;
}
// 프로토타입 메서드
Person.prototype.sayHi = function () {
	console.log(`Hi! My name is ${this.name});
};

const me = new Person('Lee');
me.sayHi(); // Hi! My name is Lee
```

클래스 몸체에서 정의한 메서드는 생성자 함수에 의한 객체 생성 방식과 다르게 클래스의 prototype 프로퍼티에 메서드를 추가하지 않아도 기본적으로 프로토타입 메서드가 된다.

```javascript
class Person {
  // 생성자
  constructor(name) {
    // 인스턴스 생성 및 초기화
    this.name = name;
  }
  // 프로토타입 메서드
  sayHi() {
    console.log(`Hi! My name is ${this.name}`);
  }
}

const me = new Person("Lee");
me.sayHi(); // Hi! my name is Lee
```

생성자 함수와 마찬가지로 클래스로 생성한 인스턴스는 `프로토타입 체인의 일원`이 된다.

```javascript
// me 객체의 프로토타입은 Person.prototype이다.
Object.getPrototypeof(me) === Person.prototype; // true
me instanceof Person; // -> true

// Person.prototype의 프로토타입은 Object.prototype이다.
Object.getPrototypeOf(Person.prototype) === Object.prototype; // true
me instanceof Object; // -> true

// me 객체의 constructor는 Person 클래스다.
me.constructor === Person; // -> true
```

**중간정리**

1. 클래스 몸체에서 정의한 메서드는 인스턴스의 프로토타입에 존재하는 `프로토타입 메서드`가 된다.
2. 클래스는 생성자 함수와 마찬가지로 프로토타입 기반의 객체 생성 메커니즘이다.

### 5-3. 정적 메서드

정적 메서드는 **인스턴스를 생성하지 않아도** `호출`할 수 있는 메서드를 말한다.

생성자 함수의 경우 정적 메서드를 생성하기 위해서 명시적으로 메서드를 추가해야 한다.

```javascript
// 생성자 함수
function Person(name) {
  this.name = name;
}
// 정적 메서드
Person.sayHi = function () {
  console.log("Hi!");
};
// 정적 메서드 호출
Person.sayHi(); // Hi!
```

클래스에서는 메서드에 static 키워드를 붙이면 정적 메서드(클래스 메서드)가 된다.

```javascript
class Person {
  // 생성자
  constructor(name) {
    // 인스턴스 생성 및 초기화
    this.name = name;
  }

  // 정적 메서드
  static sayHi() {
    console.log("Hi!");
  }
}
```

정적 메서드는 클래스에 바인딩된 메서드가 된다. 클래스는 함수 객체로 평가되므로 자신의 프로퍼티/메서드를 보유할 수 있다.

`클래스 정의`가 평가되는 시점에 `함수 객체`가 되므로 인스턴스와 달리 별다른 생성 과정이 필요 없다. 정적 메서드는 클래스 정의 이후 인스턴스를 생성하지 않아도 호출할 수 있다.

```javascript
// 인스턴스 생성
const me = new Person("Lee");
me.sayHi(); // TypeError: me.sayHi is not a function
```

정적 메서드는 인스턴스로 호출할 수 없다. 정적 메서드가 바인딩된 클래스는 인스턴스의 프로토타입 체인상에 존재하지 않기 때문이다.

인스턴스의 프로토타입 체인 상에는 클래스가 존재하지 않기 때문에 인스턴스로 클래스의 메서드를 상속받을 수 없다.

### 5-4. 정적 메서드와 프로토타입 메서드의 차이

1. 정적 메서드와 프로토타입 메서드는 자신이 속해 있는 프로토타입 체인이 다르다.
2. `정적 메서드`는 `클래스`로 호출하고 `프로토타입 메서드`는 `인스턴스`로 호출한다.
3. 정적 메서드는 인스턴스 프로퍼티를 참조할 수 없지만 프로토타입 메서드는 인스턴스 프로퍼티를 참조할 수 있다.

```javascript
class Square {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  // 프로토타입 메서드
  area() {
    return this.width * this.height;
  }
  // 정적 메서드
  static AREA(width, height) {
    return width * height;
  }
}
const square = new Square(10, 10);
console.log(square.area()); // 100
console.log(Sqaure.AREA(20, 20)); // 400
```

정적 메서드 `AREA`는 **인스턴스 프로퍼티**를 참조하지 않는다.

## 6. 클래스의 인스턴스 생성 과정

`new` 연산자와 함께 `클래스를 호출`하면 생성자 함수와 마찬가지로 클래스의 내부 메서드 `[[Construct]]`가 호출된다. 클래스는 new 연산자 없이 호출할 수 없다.

1. 인스턴스 생성과 this 바인딩
   - new 연산자와 함께 클래스를 호출하면 constructor의 내부 코드가 실행되기에 앞서 암묵적으로 빈 객체(인스턴스)가 생성된다.
   - 클래스는 생성한 인스턴스의 프로토타입으로 클래스의 prototype 프로퍼티가 가리키는 객체가 설정된다.
   - 암묵적으로 생성된 빈 객체, 즉 인스턴스는 this에 바인딩된다. constructor 내부의 this는 클래스가 생성한 인스턴스를 가리킨다.
2. 인스턴스 초기화
   - constructor의 내부 코드가 실행되어 this에 바인딩되어 있는 인스턴스를 초기화한다. 즉, this에 바인딩되어 있는 인스턴스에 프로퍼티를 추가하고 constructor가 인수로 전달받은 초기값으로 인스턴스의 프로퍼티값을 초기화한다.
   - constructor가 생략되어있다면 위 과정도 생략된다.
3. 인스턴스 반환
   - 클래스의 모든 처리가 끝나면 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환된다.

## 7. 프로퍼티

### 7-1. 인스턴스 프로퍼티

인스턴스 프로퍼티는 constructor 내부에서 정의해야 한다.

```javascript
class Person {
  constructor(name) {
    // 인스턴스 프로퍼티
    this.name = name;
  }
}
const me = new Person("Lee");
console.log(me); // Person {name: 'Lee'}
```

1. constructor 내부 코드가 실행되기 이전에 constructor 내부의 this에는 이미 클래스가 암묵적으로 생성한 인스터스인 빈 객체가 바인딩 되어 있다.
2. constructor 내부에서 this에 인스턴스 프로퍼티를 추가한다. 클래스가 암묵적으로 생성한 빈 객체, 즉 인스턴스에 프로퍼티가 추가되어 인스턴스가 초기화된다.

### 7-2. 접근자 프로퍼티

접근자 프로퍼티(accessor property)는 자체적으로 값 [[Value]]을 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 사용하는 접근자 함수로 구성된 프로퍼티다.

```javascript
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  // fullName은 접근자 함수로 구성된 접근자 프로퍼티다.
  // getter 함수
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
  // setter 함수
  set fullName(name) {
    [this.firstName, this.lastName] = name.split(" ");
  }
}
const me = new Person("jinsung", "choi");
// 데이터 프로퍼티를 통한 프로퍼티 값의 참조
console.log(`${me.firstName} ${me.lastName}`); // jinsung choi

// 접근자 프로퍼티를 통한 프로퍼티 값의 저장
// 접근자 프로퍼티 fullName에 값을 저장하면 setter 함수가 호출된다.
me.fullName = "Heegun Lee";
console.log(me); // { fistName : "Heegun", lastName: "Lee"}

// 접근자 프로퍼티를 통한 프로퍼티 값의 참조
// 접근자 프로퍼티 fullName에 접근하면 getter 함수가 호출된다.
console.log(me.fullName); // Heegun Lee

// fullName은 접근자 프로퍼티다.
// 접근자 프로퍼티는 get, set, enumable, configurable 프로퍼티 어트리뷰트를 갖는다.
console.log(Object.getOwnPropertyDescriptor(Person.prototype, "fullName"));
// {get: f, set: f, enumerable: false, configurable : true}
```

접근자 프로퍼티는 자체적으로 값을 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 사용하는 `접근자 함수`, 즉 `getter` 함수와 `setter`함수로 구성되어 있다.

getter는 호출하는 것이 아니라 `프로퍼티처럼 참조`하는 형식으로 사용되며, 참조 시에 내부적으로 getter가 호출된다.

setter도 호출하는 것이 아닌 `프로퍼티처럼 값을 할당`하는 형식으로 사용하며, 할당 시에 내부적으로 setter가 호출

### 7-3. 클래스 필드 정의 제안

클래스 필드(`필드` 또는 `멤버`)는 인스턴스의 프로퍼티를 가리키는 용어다.

```javascript
class Person {
  // 클래스 필드 정의
  name = "Lee";
  constructor(age) {
    this.age = age;
  }
}

const me = new Person(20);
```

초기화해야 할 필요가 있다면 constructor에서 클래스 필드를 초기화 해야 한다.

```javascript
class Person {
  // 클래스 필드에 문자열을 할당
  name = "Lee";
  // 클래스 필드에 함수를 할당
  getName = function () {
    return this.name;
  };
  // 화살표 함수로 정의할 수도 있다.
  // getName = () => this.name;
}

const me = new Person();
console.log(me); // Person {name: 'Lee', getName: f}
console.log(me.getName()); // Lee
```

함수는 일급 객체 이므로 함수를 클래스 필드에 할당할 수 있다. 클래스 필드를 통해 메서드를 정의할 수 있다.

클래스 필드에 함수를 할당하는 경우, 해당 함수는 프로토타입 메서드가 아닌 `인스턴스 메서드`가 된다.

모든 클래스 필드는 인스턴스 프로퍼티가 되기 때문이다. 따라서 클래스 필드에 함수를 할당하는 것은 권장하지 않는다.

### 7-4. private 필드 정의 제안

자바스크립트는 캡슐화를 완전하게 지원하지 않는다. 따라서 인스턴스 프로퍼티는 인스턴스를 통해 클래스 외부에서 언제나 참조할 수 있다. 즉 , 언제나 `public`이다.

```javascript
class Person {
  constructor(name) {
    this.name = name; // 인스턴스 프로퍼티는 기본적으로 public하다.
  }
}

const me = new Person("Lee");
console.log(me.name); // Lee
```

TC39 프로세스 state3에는 private 필드를 정의할 수 있는 샐운 표준 사양이 제안 되어있다. Node.js(버전12이상)에 구현

```javascript
class Person {
  // private 필드 정의
  #name = "";
  constructor(name) {
    // private 필드 참조
    this.#name = name;
  }
}

const me = new Person("Lee");
// private 필드 #name은 클래스 외부에서 참조할 수 없다.
console.log(me.#name);
// SyntaxError: Private field '#name' must be declared in an enclosing class
```

클래스 외부에서 `private`필드에 직접 접근할 수 있는 방법은 없다. 다만 `접근자 프로퍼티`를 통해 간접적으로 접근하는 방법은 유효하다.

```javascript
class Person {
  // private 필드 정의
  #name = "";
  constructor(name) {
    this.#name = name;
  }
  // name은 접근자 프로퍼티다.
  get name() {
    // private 필드를 참조하여 trim한 다음 반환한다.
    return this.#name.trim();
  }
}

const me = new Person("Lee");
console.log(me.name); // Lee
```

private 필드는 반드시 `몸체`에 정의해야 한다. private필드를 직접 `constructor`에 정의하면 `에러`가 발생한다.

### 7-5. static 필드 제안

TC39 프로세스 state3에 Static class features가 제안되었다 이 제안 중에서 static public/private 필드는 2021년 1월 현재, 최신 브라우저와 최신 노드에 이미 구현되어 있다.

```javascript
class MyMath {
  // static public 필드 정의
  static PI = 22 / 7;
  // static private 필드 정의
  static #num = 10;
  // static 메서드
  static increment() {
    return ++MyMath.#num;
  }
}

console.log(MyMath.PI); // 3.142857142857143
console.log(MyMath.increment()); // 11
```

## 8. 상속에 의한 클래스 확장

### 8-1. 클래스 상속과 생성자 함수 상속

프로토타입 기반 상속은 `프로토타입 체인`을 통해 다른 객체의 자산을 `상속(위임)`받는 개념이지만, 상속에 의한 클래스 확장은 기존 클래스를 상속받아 새로운 클래스를 `확장하여 정의`하는 것이다.

### 8-2. extends 키워드

상속을 통해 클래스를 확장하려면 extends 키워드를 사용하여 상속받을 클래스를 정의한다.

```javascript
// 수퍼(베이스/부모) 클래스
class Base {}
// 서브(파생/자식)클래스
class Derived extends Base {}
```

상속을 통해 확장된 클래스를 서브클래스라 부르고, 서브클래스에게 상속된 클래스를 수퍼클래스라 부른다.

`extends`키워드의 역할은 수퍼클래스와 서브클래스 간의 상속관계를 설정하는 것이다. 클래스도 프로토타입을 통해 상속 관계를 구현한다.

수퍼 클래스와 서브클래스는 인스턴스의 `프로토타입 체인`뿐 아니라 `클래스 간의 프로토타입 체인`도 생성한다. 이를 통해 프로토타입 메서드, 정적 메서드 모두 상속이 가능하다.

### 8-3. 동적 상속

extends 키워드는 클래스뿐만 아니라 생성자 함수를 상속받아 클래스를 확장할 수 있다. 단, extends 키워드 앞에는 반드시 클래스가 와야한다.

```javascript
// 생성자 함수
function Base(a) {
  this.a = a;
}
// 생성자 함수를 상속받는 서브클래스
class Derived extends Base {}

const derived = new Derived(1);
console.log(derived); // Derived {a:1}
```

extends 키워드 다음에는 클래스뿐만 아니라 [[Construct]] 내부 메서드를 갖는 함수 객체로 평가될 수 있는 모든 표현식을 사용할 수 있다. 이를 통해 동적으로 상속받을 대상을 결정할 수 있다.

```javascript
function Base1() {}

class Base2 {}

let condition = true;
// 조건에 따라 동적으로 상속 대상을 결정하는 서브클래스
class Derived extends (condition ? Base1 : Base2) {}

const derived = new Derived();
console.log(derived); // Derived {}

console.log(derived instanceof Base1); // true
console.log(derived instanceof Base2); // false
```

### 8-4. 서브클래스 constructor

클래스에서 constructor를 생략하면 클래스에 다음과 같이 비어 있는 constructor가 `암묵적`으로 정의된다.

```javascript
constructor() {}
```

서브클래스에서 constructor를 생략하면 클래스에 같은 constructor가 암묵적으로 정의된다. args는 new 연산자와 함께 클래스를 호출할 때 전달한 인수 리스트다.

```javascript
constructor(...args) {super(...args);}
```

super()는 수퍼클래스의 consturctor(super-constructor)를 호출하여 인스턴스를 생성한다.

> Rest 파라미터: 매개변수에 …을 붙이면 Rest 파라미터가 된다. Rest 파라미터는 함수에 전달된 인수들의 목록을 배열로 전달받는다.

```javascript
// 수퍼 클래스
class Base {}
// 서브 클래스
class Derived extends Base {}

// 암묵적으로 constructor가 정의된다.
// 수퍼클래스
class Base {
	constructor()
}
// 서브클래스
class Derived extends Base {
	constructor(...args) {super(...args);}
}
const derived = new Derived();
console.log(derived); // Derived {}
```

### 8-5. super 키워드

super 키워드는 함수처럼 호출할 수도 있고 this와 같이 식별자처럼 참조할 수 있는 특수한 키워드다.

- super를 호출하면 수퍼클래스의 constructor(super-constructor)를 호출한다.
- super를 참조하면 수퍼클래스의 메서드를 호출할 수 있다.

```javascript
// 수퍼클래스
class Base {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
}
// 서브클래스
class Derived extends Base {
  // 암묵적으로 constructor가 정의
  // constructor(...args) { super(...args) }
}
const derived = new Derived(1, 2);
console.log(derived); // Derived {a: 1, b: 2}
```

**1) super 호출**

super를 호출하면 수퍼클래스의 constructor(super-constructor)를 호출한다.

수퍼 클래스에서 추가한 프로퍼티를 갖는 인스턴스를 생성한다면 서브클래스의 constructor를 생략할 수 없다.

1. 서브클래스에서 constructor를 생략하지 않은 경우 서브클래스의 `constructor`에서는 반드시 `super를 호출`해야 한다.
2. 서브클래스의 constructor에서 `super를 호출하기 전`에는 `this를 참조할 수 없다`.
3. `super`는 반드시 **서브클래스**의 `constructor에서만 호출`한다. 서브클래스가 아닌 클래스의 consturcotr나 함수에서 super를 호출하면 에러가 발생

**2) super 참조**

메서드 내에서 **super**를 참조하면 **수퍼클래스의 메서드**를 호출할 수 있다.

```javascript
// 수퍼 클래스
class Base {
  constructor(name) {
    this.name = name;
  }
  sayHi() {
    return `Hi! ${this.name}`;
  }
  static sayBye() {
    console.log("bye");
  }
}
// 서브 클래스
class Derived extends Base {
  sayHi() {
    // super.sayHi는 수퍼클래스의 프로토타입 메서드를 가르킨다.
    return `${super.sayHi()}. how are you doing`;
  }
  // super.sayBy는 수퍼클래스의 정적 메서드를 가리킨다.
  static sayBye() {
    return `${super.sayBye()}. bye bye`;
  }
}
const derived = new Derived("Lee");
console.log(derived.sayHi()); // Hi! Lee. how are you doing
```

### 8-6. 상속 클래스의 인스턴스 생성 과정

1. **서브클래스의 super 호출**
   new 연산자와 함께 호출되었을 때 암묵적으로 `빈 객체 인스턴스`를 생성하고 이를 `this에 바인딩`하지만 서브 클래스는 자신이 직접 인스턴스를 생성하지 않고 **수퍼클래스에게 인스턴스 생성**을 `위임`한다.

`super가 호출`되면 **수퍼클래스**의 `constructor(super-constructor)`가 호출된다. 수퍼클래스가 평가되어 생성된 함수 객체의 코드가 실행되기 시작한다.
만약 서브클래스 constructor 내부에 super 호출이 없으면 에러가 발생한다. 실제로 인스턴스를 생성하는 주체는 수퍼클래스이므로 수퍼클래스의 constructor를 호출하는 super가 호출되지 않으면 인스턴스를 생성할 수 없기 때문이다.

2. **수퍼클래스의 인스턴스 생성과 this 바인딩**
   수퍼클래스의 constructor내부 코드가 시행되기 이전에 암묵적으로빈 객체(인스턴스)를 생성한다.
   암묵적으로 생성된 빈객체(인스턴스)는 this에 바인딩된다.
   `new 연산자`와 함께 호출된 클래스가 서브클래스라는점이 중요하다. `new.target`은 서브클래스를 가리킨다. 인스턴스는 new.target이 가리키는 `서브클래스`가 생성한 것으로 처리한다.

3. **수퍼클래스의 인스턴스 초기화**
   수퍼 클래스의 `constructor가 실행`되어 this에 바인딩되어 있는 `인스턴스를 초기화`한다. 즉, ths에 바인딩 되어 있는 인스턴스에 프로퍼티를 추가하고 constructor가 인수로 전달받은 초기값으로 인스턴스의 프로퍼티로 초기화한다.

4. **서브클래스 constructor로의 복귀와 this 바인딩**
   super의 호출이 종료되어 제어 흐름이 `서브클래스 constructor`로 돌아온다. 이때 **super가 반환한 인스턴스**가 `this`에 바인딩된다.
   서브클래스는 별도의 인스턴스를 생성하지 않고 super가 반환한 인스턴스를 this에 바인딩하여 그대로 사용한다.

`super가 호출`되지 않으면 `인스턴스가 생성`되지 않으며, `this 바인딩`도 할 수 없다. 서브클래스의 constructor에서 super를 호출하기 전에는 `this를 참조할 수 없는 이유`가 바로 이때문이다.

5. **서브클래스의 인스턴스 초기화**
   `super 호출 이후`, 서브클래스의 constructor에 기술되어 있는 `인스턴스 초기화가 실행`된다. 즉, this에 바인딩되어 있는 인스턴스에 프로퍼티를 추가하고 constructor가 인수로 전달받은 초기값으로 인스턴스의 프로퍼티를 초기화 한다.

6. **인스턴스 반환**
   클래스의 모든 처리가 끝나면 완성된 인스턴스가 바인딩된 `this가 암묵적으로 반환`된다.

### 8-7. 표준 빌트인 생성자 함수 확장

> String, Number, Array같은 표준 빌트인 객체도 [[Construct]] 내부 메서드를 갖는 생성자 함수이므로 extends 키워드를 사용하여 확장 할 수 있다.

```javascript
// Array 생성자 함수를 상속받아 확장한 MyArray
class MyArray extends Array {
  // 중복된 배열 요소를 제거하고 반환한다: [1,1,2,3] => [1,2,3]
  uniq() {
    return this.filter((v, i, self) => self.indexOf(v) === i);
  }
  // 모든 배열 요소의 평균을 구한다: [1,2,3] => 2
  average() {
    return this.reduce((pre, cur) => pre + cur, 0) / this.length;
  }
}

const myArray = new MyArray(1, 1, 2, 3);
console.log(myArray); // MyArray(4) [1,1,2,3]
// MyArray.prototype.uniq 호출
console.log(myArray.uniq()); // myArray(3) [1,2,3]
// MyArray.prototype.average 호출
console.log(myArray.average()); // 1.75
```

Array 생성자 함수를 상속받아 화장한 MyArray 클래스가 생성한 인스턴스는 Array.prototype과 MyArray.prototype의 모든 메서드를 사용할 수 있다.

```javascript
myArray.filter((v) => v % 2) instanceof MyArray; // true
```

uniq메서드가 반환하는 인스턴스가 MyArray타입이라 uniq메서드가 반환하는 인스턴스로 average 메서드를 연이어 호출(메서드 체이닝) 할 수 있다.

```javascript
// 메서드 체이닝
console.log(
  myArray
    .filter((v) => v % 2)
    .uniq()
    .average(),
); // 2
```

> 빌트인 객체를 확장해서 사용하는 건 ECMAScript에서 권장을 하지않는다.

## 마치며

기존 생성자 함수로 프로토타입 기반의 인스턴를 생성하여 객체지향적으로 구현을 할 수 있었지만 좀더 명확히 표현(가독성)을 하기에는 부족한 부분이 있었다.

클래스를 사용함으로 좀 더 가독성 좋은 코드와 추가적인 기능들을 활용한다면 객체지향적인 프로그래밍을 더욱 견고하게 만들 수 있을 것이라 생각한다.

MDN에서 class를 `syntactical sugar`라는 표현을 하는데 이는 class는 객체를 만드는 `또 하나의 방법`이라는 의미의 표현이다.

## Reference

**도서**

- [모던 자바스크립트 Deep Dive](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=251552545&start=slayer)
- [코어 자바스크립트](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=206513031)

**영상**

- [10분 테크톡 - 도리의 Class](https://www.youtube.com/watch?v=HujbNZ9IWF8&t=79s)

**문서**

- [Classes - MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes)
