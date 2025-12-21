---
title: 스크롤 이벤트 하나가 앱을 크래시시킨 이유 - 부동소수점 이야기
description: React Native ScrollView에서 부동소수점 비교를 제대로 처리하지 않아 CPU가 과열되고 앱이 크래시된 경험을 통해, 부동소수점이 무엇이고 어떻게 대처해야 하는지 알아봅니다.
author: "jinseoit"
image: "/images/float.webp"
published: 2025-12-21
tags: [ReactNative, CS]
draft: true
---

## 스크롤 하나가 앱을 죽였다

React Native로 앱을 개발하면서, ScrollView의 특정 지점(예: 페이지의 30% 지점)에 도달하면 애니메이션을 실행하는 기능을 구현했었습니다. 코드는 대략 이런 형태였죠.

```javascript
<ScrollView
  onScroll={(event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollPercent =
      (contentOffset.y / (contentSize.height - layoutMeasurement.height)) * 100;

    if (scrollPercent === 30) {
      // 🔥 문제의 시작
      triggerAnimation();
    }
  }}
  scrollEventThrottle={16}
>
  {/* 컨텐츠 */}
</ScrollView>
```

로컬에서는 잘 동작하는 것처럼 보였지만, 프로덕션에 배포하고 나니 특정 사용자들의 기기(특히 안드로이드)에서 CPU 사용률이 급격히 치솟고 앱이 크래시되는 문제가 발생했습니다.

문제는 **부동소수점 비교**에 있었습니다. `scrollPercent`가 정확히 `30`이 되는 경우는 거의 없었고, `29.999999999` 또는 `30.000000001` 같은 값이 되었기 때문에 조건문이 절대 `true`가 되지 않았습니다. 그런데 더 큰 문제는 이 체크가 스크롤 이벤트마다 계속 실행되면서 CPU를 잡아먹었다는 것입니다.

이 경험을 통해 부동소수점이 얼마나 위험할 수 있는지 깨달았고, 그 원리와 대처 방법을 정리해보려 합니다.

## 부동소수점, 대체 뭐길래?

먼저 콘솔에서 간단한 덧셈을 해보셨나요?

```javascript
0.1 + 0.2;
// 0.30000000000000004

1.1 + 0.2;
// 1.3000000000000003
```

"자바스크립트가 덧셈도 못 해?"가 아닙니다. 컴퓨터가 실수를 저장하는 방식인 **부동소수점(Floating Point)** 자체가 대부분의 소수를 정확히 담을 수 없기 때문입니다.

자바스크립트의 모든 숫자는 IEEE 754 배정밀도(64-bit) 부동소수점 형식으로 저장되며, 이로 인해 이런 현상이 발생합니다.

## 왜 이런 일이 발생하는가?

### 1. 문제의 뿌리: 10진수를 2진수로 변환하면 무한소수가 된다

우리가 쓰는 `0.1`(10진수)은 컴퓨터 내부에서 2진수로 저장됩니다. 여기서 핵심은:

- 10진수에서 `1/3 = 0.3333…` (무한소수) 인 것처럼
- 2진수에서 `1/10 = 0.0001100110011…` (무한 반복) 이 됩니다.

즉, `0.1`은 2진수로 **딱 떨어지지 않는** 숫자입니다. 그래서 컴퓨터는 어쩔 수 없이 "어딘가에서 반올림/절삭"해 저장합니다.

앞서 본 스크롤 퍼센트 계산도 마찬가지입니다. `(contentOffset.y / (contentSize.height - layoutMeasurement.height)) * 100`의 결과는 정확히 `30`이 아니라 `29.999999...` 또는 `30.000000...` 같은 근사값이 됩니다.

### 2. IEEE 754: 자바스크립트가 숫자를 저장하는 방식

자바스크립트 Number는 64비트로 아래 3가지를 저장합니다:

- **부호(Sign)**: 1비트
- **지수(Exponent)**: 11비트
- **가수/유효숫자(Significand/Mantissa)**: 52비트 (실제 정밀도는 숨은 비트 포함 53비트)

이 구조는 "2진 과학적 표기법" 같은 형태로 숫자를 표현합니다.

```
(-1)^sign × (1.xxx…(가수)) × 2^(지수-bias)
```

**중요한 사실**: 표현 범위는 넓지만, 정밀도는 53비트로 제한됩니다. 그래서 `0.1` 같은 수는 binary64에서도 정확히 표현할 수 없습니다.

### 3. 저장부터 이미 근사값이다

`0.1`을 2진수로 바꾸면 무한 반복되므로, 64비트 안에 우겨 넣기 위해 근사값으로 저장됩니다.

- `0.1`은 내부적으로 "0.1에 가장 가까운 이진 부동소수점 값"
- `0.2`도 마찬가지
- 둘을 더한 결과가 정확히 `0.3`이 아니라 `0.30000000000000004` 같은 값이 됨

이는 "자바스크립트가 이상해서"가 아니라, **IEEE 754를 쓰는 대부분의 언어**(Python, Java, C++ 등)에서 동일하게 발생하는 현상입니다.

## 실제로 얼마나 위험한가? - 사례들

부동소수점 오차는 "UI에서 소수점이 이상하게 보이는" 정도로 끝나지 않습니다. 실제 시스템 장애와 심각한 사고로 이어질 수 있습니다.

### 1. ScrollView 이벤트 CPU 과열 (앞서 본 케이스)

도입부에서 본 스크롤 이벤트 문제를 더 자세히 살펴보겠습니다.

```javascript
// ❌ 잘못된 코드
<ScrollView
  onScroll={(event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollPercent =
      (contentOffset.y / (contentSize.height - layoutMeasurement.height)) * 100;

    if (scrollPercent === 30) {
      // 절대 true가 되지 않음
      triggerAnimation();
    }
  }}
  scrollEventThrottle={16}
>
  {/* 컨텐츠 */}
</ScrollView>
```

**무엇이 문제였나?**

- `scrollPercent`는 `29.999999...` 또는 `30.000000001` 같은 값
- 정확히 `30`이 되는 경우가 거의 없음
- 조건문이 계속 실행되지만 애니메이션은 절대 트리거되지 않음
- `scrollEventThrottle={16}`으로 초당 약 60회 이벤트가 발생하므로 CPU 부하가 누적
- 특히 안드로이드 저사양 기기에서 심각한 성능 저하 발생

**어떻게 해결했나?**

```javascript
// ✅ 올바른 코드
const [hasTriggered, setHasTriggered] = useState(false);

<ScrollView
  onScroll={(event) => {
    if (hasTriggered) return; // 이미 실행됐으면 skip

    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollPercent =
      (contentOffset.y / (contentSize.height - layoutMeasurement.height)) * 100;

    if (Math.abs(scrollPercent - 30) < 0.5) {
      // 허용 오차 사용
      triggerAnimation();
      setHasTriggered(true);
    }
  }}
  scrollEventThrottle={16}
>
  {/* 컨텐츠 */}
</ScrollView>;
```

핵심은 `===` 대신 **허용 오차를 가진 범위 비교**(`Math.abs(scrollPercent - 30) < 0.5`)를 사용하고, 한 번 실행되면 다시 체크하지 않도록 state 플래그를 두는 것입니다.

### 2. 패트리어트 미사일 사고(1991)

부동소수점 오차가 인명 피해로 이어진 실제 사례입니다.

걸프전 당시(1991년 2월 25일) 사우디아라비아 다란(Dhahran)에서 운용되던 **패트리어트(Patriot) 방공 시스템**이 스커드(Scud) 미사일 요격에 실패했고, 미군 병영이 피격되어 **미군 28명이 사망**했습니다.

GAO(미국 회계감사원) 보고서는 이 실패에 소프트웨어의 정밀도/시간 계산 문제가 관련됐다고 설명합니다.

특히 보고서의 Appendix II에는 "연속 가동 시간이 길어질수록 시간 계산 오차가 커진다"는 수치가 나옵니다:

- **1시간 후 시간 오차**: 약 0.0034초
- **100시간 연속 가동 시 시간 오차**: 약 0.3433초

해당 배터리는 사건 당시 **100시간 넘게 연속 운용** 중이었고, 그로 인해 레이더의 탐지 범위(range gate) 계산이 틀어져 "잘못된 위치"를 보게 됐습니다. 0.3초면 스커드 미사일이 약 500m 이동하는 거리이며, 이는 요격 실패로 이어졌습니다.

[자세한 내용 출처](https://contents.premium.naver.com/sghahn/knowledge/contents/241002200508925wf)

## 그래서 어떻게 대처할 것인가?

부동소수점 문제는 피할 수 없습니다. 하지만 **올바른 방법**으로 다루면 문제를 예방할 수 있습니다.

### 1. 부동소수점 비교는 `===` 대신 허용 오차(epsilon) 사용

앞서 본 스크롤 이벤트 사례처럼, 부동소수점 값을 직접 비교하면 안 됩니다.

```javascript
// ❌ 잘못된 방법
if (value === 0.3) { ... }

// ✅ 올바른 방법
function nearlyEqual(a, b, epsilon = 0.0001) {
  return Math.abs(a - b) < epsilon;
}

if (nearlyEqual(value, 0.3)) { ... }
```

JavaScript의 `Number.EPSILON`을 사용할 수도 있지만, 실무에서는 상황에 맞는 적절한 epsilon 값을 설정하는 게 좋습니다.

```javascript
nearlyEqual(0.1 + 0.2, 0.3, Number.EPSILON); // true
```

### 2. 금융/정산: 부동소수점 대신 정수(최소 단위)로 저장

예: 달러를 센트로(×100), 원은 원 단위 그대로

```javascript
// 5.10달러를 510센트로 저장
const dollars = "5.10"; // 사용자 입력은 문자열로 받는 게 안전
const cents = toCents(dollars); // 510
```

**중요 포인트**: `Math.round(amount * 100)`도 `amount`가 이미 부동소수점이면 흔들릴 수 있어요. 그래서 금융/정산 입력은 문자열 → 정수 변환을 권장합니다.

```javascript
function toCents(str) {
  // "5", "5.1", "5.10" 같은 입력을 안전하게 처리(단순 예시)
  const m = str.match(/^(\d+)(?:\.(\d{1,2}))?$/);
  if (!m) throw new Error("Invalid money format");
  const whole = BigInt(m[1]);
  const frac = BigInt((m[2] ?? "0").padEnd(2, "0"));
  return whole * 100n + frac;
}
```

정수로 저장하면

- 합산/차감/비교가 정확해지고
- DB/정산/회계에서 문제가 줄어듭니다.

### 3. 정확한 소수 연산이 필요하면 Decimal 라이브러리 사용

언어별로 10진 기반 정확한 산술을 제공하는 라이브러리가 있습니다

- **Java**: `BigDecimal`
- **Python**: `Decimal`
- **JavaScript**: `decimal.js`, `big.js`, `bignumber.js`

```javascript
import Decimal from "decimal.js";

const result = new Decimal(0.1).plus(0.2);
console.log(result.toString()); // "0.3"
```

부동소수점 대신 10진 기반으로 연산하므로 정확합니다. 다만 성능은 느리므로, 필요한 곳에만 사용하세요.

### 4. `toFixed()`는 "표시용"이지 "계산용"이 아니다

`toFixed(2)`는 보기 좋게 반올림해 문자열로 만들 뿐, 내부 저장 문제가 사라지진 않습니다.

```javascript
const value = 0.1 + 0.2;
console.log(value.toFixed(2)); // "0.30" (문자열)
console.log(value === 0.3); // false (여전히)
```

즉, **UI 출력 포맷팅에만 사용**하고, 정산/누적/비교는 위의 정수/Decimal 전략을 쓰는 게 안전합니다.

## 정리

1. **부동소수점은 근사값이다**
   - 10진수 소수를 2진수로 변환하면 대부분 무한소수가 됨
   - 64비트 안에 저장하려면 반올림/절삭이 불가피

2. **직접 비교(`===`)는 위험하다**
   - 스크롤 퍼센트, 애니메이션 진행률, 타이머 등에서 문제 발생
   - 허용 오차(epsilon) 기반 비교 사용

3. **상황에 맞는 전략 선택**
   - **금융/정산**: 정수(최소 단위)로 저장
   - **정확한 소수 계산**: Decimal 라이브러리
   - **일반 비교**: epsilon 기반 비교
   - **UI 표시**: `toFixed()` 사용

부동소수점은 컴퓨터 과학의 근본적인 제약이지만, **올바르게 다루면** 충분히 안전하게 사용할 수 있습니다.
