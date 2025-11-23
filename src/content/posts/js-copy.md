---
title: Javascript의 데이터와 깊은복사 얕은복사
description: Javascript의 데이터와 깊은복사 얕은복사
author: "jinseoit"
image: "https://velog.velcdn.com/images/radin/post/374e397b-f9a2-4d04-a996-e41a1c9c99c7/image.png"
published: 2023-07-25
tags: [JavaScript]
---

## 들어가기

> 💡 Javascript의 데이터를 알아보기 전 질문 ⏰

1. Javascript의 데이터 타입은 어떤 것들이 있을까요?
2. Javascript의 데이터들은 어떻게 저장이 될까요?
3. 기본형 데이터와 참조형 데이터 이 둘은 **불변값** 일까요 **가변값** 일까요?
4. 깊은복사와 얕은복사에 대해 설명해주세요.

## 개요

> 본 글은 Javascript의 탄탄한 기본기를 다지기위해 🥸근본인 데이터 타입 및 저장 방식 등 을 정리한 글입니다.
> 참고 도서는 **코어 자바스크립트** 입니다.

## 🐬 1. Javascript의 데이터 타입

Javasciprt의 데이터 타입은 크게 두가지로 **기본형(primitive)**, **참조형(refrence)** 이 있다. 이둘은 어떤 기준으로 구분이 되는걸까?

> 기본형 - Number, String, Boolean, null, undefined, Symbol
> 참조형 - Array, Function, Date, RegExp, Map, WeakMap, Set, WeakSet

기본형과 참조형을 구분하는 기준은 기본형은 값이 담긴 주솟값을 바로 복제하는 반면 참조형은 값이 담긴 주솟값들로 이루어진 묶음을 가리키는 주솟값을 복제한다. 아래에서 계속 다뤄보자

### 📚1-1 변수와 식별자

> 💡변수(variable)는 변할수 있는 무언가로 `데이터` 를 말한다.
> 식별자(identifier)는 데이터를 식별하는 `변수명`이다.

```javascript
var a;
```

위 코드를 해석한다면 `변할 수 있는 데이터를 만든다` 이 데이터의 `식별자는 a`다. 로 해석할 수 있다.
(실제 개발할때 변수 또는 식별자 둘다 문맥상 유추가 가능하여 혼용해서 사용하지만 둘은 확실히 다른 개념임을 기억하자.)

## 🐬 2. 변수 선언과 데이터 할당

```javascript
var a; // 변수 a 선언
a = "abc"; // 변수 a에 데이터 할당
var a = "abc"; // 변수 선언과 할당을 한 문장으로 표현
```

위 코드가 메모리에 어떻게 저장되는지 그림으로 살펴보자

![](https://velog.velcdn.com/images/radin/post/374e397b-f9a2-4d04-a996-e41a1c9c99c7/image.png)

1️⃣ 변수 영역에서 빈 공간 @1003을 확보한다.
2️⃣ 확보한 공간의 식별자를 a로 지정한다.
3️⃣ 데이터 영역의 빈 공간 @5004에 문자열 'abc'를 저장한다.
4️⃣ 변수 영역에서 a라는 식별자를 검색한다(@1003)
5️⃣ 앞서 저장한 문자열의 주소 @5004를 @1003의 공간에 대입한다.

> 정리하자면 변수가 선언되면 **변수 영역**에서 `빈공간` 확보한다. 변수에게 데이터를 할당 할때 **데이터 영역**에 해당 값이 있는지 찾고 있다면 해당 주소값을 `변수 영역 데이터`에 저장, 없다면 새로운 데이터 영역에 데이터를 저장한 후 주소값을 `변수 영역 데이터` 값에 저장한다.

Q 왜 변수 영역과 데이터 영역이 따로 있나요?
A 데이터 영역을 따로 관리하지 않는다면 매번 변수 선언 할때마다 동일 값이라도 새로 데이터를 넣어줘야하는 불필요한 `데이터 낭비`가 발생한다.

## 🐬 3. 기본형 데이터(불변값) 참조형 데이터(가변값) 왜?

### 📚3-1 기본형 데이터의 불변값

```javascript
var a = "abc";
a = a + "def";
var b = 5;
var c = 5;
b = 7;
```

위 코드를 예로 기본형 데이터가 왜 불변성을 띄는지 알아보자
![](https://velog.velcdn.com/images/radin/post/e80b87c9-ebb1-417a-89bd-91f0dd031244/image.png)

1️⃣ 변수 a 메모리 공간 값에 'abc'주소를 저장 (먼저 데이터 영역에'abc'를 찾아 없다면 데이터 영역에 새로 저장)
2️⃣ 데이터 'abcdef'가 데이터 영역에 있는지 확인, 없다면 새로운 데이터 영역에 'abcdef'를 저장후 해당 주소값를 a 변수값에 재저장
3️⃣ 변수 b 메모리 공간 값에 5의 주소값를 저장(먼저 데이터 영역에 5를 찾아 없다면 데이터 영역에 새로 저장)
4️⃣ 변수 c 메모리 공간 값에 5의 주소값를 저장(데이터 영역에 기존 5가있어 해당 주소를 저장)
5️⃣ 변수 b 메모리 공간 값에 기존 5의 주소값을 7의 주소값으로 변경( 데이터 영역에 7이 없어서 먼저 7을 저장 후 해당 데이터 주소를 변수 b의 값 저장)

> 즉, 기본형 타입은 `불병성`이다 라는 말은 데이터 영역에 값들은 변하지 않고, 없다면 새로운 데이터를 만들기 때문이다.
> 한 번 만들어진 값은 가비지 컬렉팅을 당하지 않는 한 영원히 변하지 않는다.

### 📚3-2 참조형의 가변값

```javascript
var obj1 = {
  a: 1,
  b: 'bbb,
}
obj1.a = 2;
```

위 코드를 예로 참조형 데이터가 왜 불변성을 띄는지 알아보자
![](https://velog.velcdn.com/images/radin/post/d3171002-472b-4c95-a196-4ad689139757/image.png)

1️⃣ 변수영역 빈공간(@1002) 확보 그 주소의 이름을 obj1로 지정
2️⃣ 데이터 영역에 (@5001) 객체 프로퍼티들을 저장하기 위한 별도의 변수 영역을 만들고(객체 @5001의 변수 영역) 그 영역의 데이터 주소들을(@7103 ~ ?) @5001 데이터에 저장한다.
3️⃣ 객체 변수 영역(프로퍼티 영역) 의 데이터 값을 데이터 영역의 해당 데이터 주소로 저장한다.
4️⃣ obj 객체 안 a의 값을 2로 변경 하였기에 객체 변수 영역 에 저장되었떤 a의 값을 @5003에서 @5005로 변경한다.

> 객체가 별도로 할애한 영역은 `변수 영역`일뿐 `데이터 영역`은 기존의 `메모리 공간`을 그대로 활용한다.
> 참조형 데이터는 객체의 변수 영역이 별도로 존재한다 이 변수 영역에 다른 값을 대입 할 수 있다.
> 즉, 참조형 데이터가 가변값이라는 것은, `객체 내부의 프로퍼티를 변경할 수 있기 때문이다`

## 🐬 4 객체의 얕은 복사와 깊은 복사

> 만약 객체 obj을 obj2라는 새로운 변수에 할당을 한다면 어떻게 될까? 데이터영역의 주소값이 같기 때문에 내부 프로퍼티가 가지는 주소값도 같을 것이다.
> obj1의 a 프로퍼티를 2로 변경한다면 obj2의 a의 값도 2로 변경되는 불상사가 일어난다. 이런 부분을 해결하기위해 `얕은 복사` 및 `깊은 복사`를 해야 한다.

### 📚4-1 얕은 복사

> 얕은 복사(shallow copy)는 바로 아래 단계의 값만 복사하는 방법이다.

```javascript
var copyObject = function (target) {
  var result = {};
  for (var prop in target) {
    result[prop] = target[prop];
  }
  return result;
};
var user = {
  name: "ladin",
  age: 3,
};
var user2 = copyObject(user);
user2.name = "horang";
user.name == user2.name; // false
```

새로 만든 객체 result에 target 객체의 프로퍼티들을 복사하여 user2의 name을 변경하여도 user의 name은 그대로 유지된다.

하지만 객체안의 객체안의 객체안의..... 이런식으로 객체안의 프로퍼티가 또 객체인 경우는 어떻게 될까?

```javascript
var copyObject = function (target) {
  var result = {};
  for (var prop in target) {
    result[prop] = target[prop];
  }
  return result;
};
var user = {
  name: "ladin",
  age: 3,
  father: {
    name: "naruto",
    age: 18,
  },
};
var user2 = copyObject(user);
user2.name = "horang";
user2.father.name = "sasuke";

user.name == user2.name; // false
user.father.name == user2.father.name; // true 'sasuke'
```

이런 user와 user2의 아버지가 모두 'sasuke'로 바뀌었다..😥
객체 영역의 데이터가 또 객체를 프로퍼티로 가지고 있다면 새로운 객체를 만들어도 결국 내부 객체 프로퍼티는 같은 객체 변수 영역 을 가르킬 것이다.

### 📚4-2 깊은 복사

> 깊은 복사(deep copy)는 객체를 복사 할때 원본 객체는 변하지 않아야 하는 경우 필요한 방법이다. (객체 안의 객체 , 객체안의 배열 등)

```javascript
var copyObjectDeep = function (target) {
  var result = {};
  if (typeof target === "object" && target !== null) {
    for (var prop in target) {
      result[prop] = copyObjectDeep(target[prop]);
    }
  } else {
    result = target;
  }
  return result;
};
```

프로퍼티가 Object인경우 프로퍼티를 복사를 재귀적으로 진행한다(객체안의 객체안의 객체.... ) target !== null을 넣은 이유는 typeof null을 하면 'object'로 나타나는 자바스크립트의 고질병😥 때문이다. 그외 객체가 아닌 경우 target을 그대로 지정한다.

```javascript
var obj = {
  name: "ladin",
  father: { name: "naruto" },
};
var obj2 = copyObjectDeep(obj);
obj2.father.name = "sasuke";
obj.father.name == obj2.father.name; // false
```

드디어 각자의 아버지가 다르게 되었다.😃

실무적으로는 이렇게 코드로 만들어서 사용해도 되지만 라이브러리를 활용하는 방법도 있다. `lodash 의 cloneDeep`이 있고 `fast-copy`라는 라이브러리도 있다. 상황에 맞게 사용 하도록 하자.

## 마무리

> 요즘 자바스크립트에 대하여 다시 깊게 공부하는 중이다. 안다고 생각했지만 다른 동료 개발자가 질문을 하였을때 어버버 하는 내 모습에 반성 하는 마음으로 처음 공부할때 놓친 점들을 딥다이브하면서 숙지해 나갈 예정이다.
> 오늘도 이 기술이 왜 사용되는지 왜 이렇게 만들어 졌는지 질문을 해가며 마무리 해본다.
