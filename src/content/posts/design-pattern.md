---
title: 일상에서 알아보는 디자인 패턴
description: 일상 비유와 실제 코드로 배우는 주요 디자인 패턴 7가지
author: "jinseoit"
image: "/images/design-pattern.webp"
published: 2025-11-27
tags: [DesignPattern]
draft: false
---

## 들어가기

> 일상에서 알아보는 디자인 패턴

클래스 다이어그램부터 나오는 디자인 패턴 책을 펼치면,
“아 오늘은 그냥 CSS만 정리할까…” 같은 생각이 든다.

그래서 이번 글은 다르게 간다.

일상 비유로 개념 먼저 잡고

그다음에 **실제 코드(주로 TypeScript/JavaScript)**로 감각을 박아 넣는 방식

패턴은 사실 거창한 철학이 아니라,
"맨날 나오는 문제를 그나마 덜 욕먹는 방식으로 푸는 방법 모음집" 정도로 보면 편하다.

## 🐬 1. 싱글톤 패턴 — "리모컨은 하나면 충분하다"

집 TV 켤 때 리모컨 5개 두는 사람은 없다.
여러 개 있으면:

누구 리모컨이 진짜인지 헷갈리고

소스 충돌(부부 vs 아이)도 자주 난다.

싱글톤 패턴은 이런 문제를 코드에서 막기 위한 거다.

**정의**: 애플리케이션 전체에서 오직 하나의 인스턴스만 존재해야 하는 객체를 보장하는 패턴

**대표적인 예**:

- 설정(Config)
- Logger
- DB 연결 풀

### 🦭 예시 코드 (TypeScript)

```typescript
class Logger {
  private static instance: Logger | null = null;

  private constructor() {
    // private으로 막아서 new Logger() 금지
  }

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string) {
    console.log(`[LOG] ${message}`);
  }
}

// 사용
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();

console.log(logger1 === logger2); // true
logger1.log("싱글톤에서 찍는 로그");
```

"전역 변수 쓰지 말고, 관리되는 전역 객체를 하나 두자" 정도의 느낌으로 이해하면 편하다.

## 🐬 2. 전략 패턴 — "오늘 점심 알고리즘 바꾸기"

“점심 먹는다”는 **목표(문맥)**은 똑같은데,
기분이나 상황에 따라 **전략(메뉴)**만 바뀐다.

바쁠 때: 김밥 전략

든든하게: 국밥 전략

다이어트 중: 샐러드 전략

**정의**: 알고리즘(동작)을 인터페이스로 추상화하고, 런타임에 갈아끼울 수 있게 만드는 패턴

### 🦭 예시 코드 (결제 전략)

```typescript
interface PaymentStrategy {
  pay(amount: number): void;
}

class CardPayment implements PaymentStrategy {
  pay(amount: number) {
    console.log(`💳 카드로 ${amount}원 결제`);
  }
}

class BankTransfer implements PaymentStrategy {
  pay(amount: number) {
    console.log(`🏦 계좌이체로 ${amount}원 결제`);
  }
}

class PaymentContext {
  constructor(private strategy: PaymentStrategy) {}

  setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  checkout(amount: number) {
    this.strategy.pay(amount);
  }
}

// 사용
const payment = new PaymentContext(new CardPayment());
payment.checkout(10000); // 카드 결제

payment.setStrategy(new BankTransfer());
payment.checkout(20000); // 계좌이체 결제
```

if-else 지옥으로 `paymentType === 'card'` 이런 거 안 하고, 전략 객체를 갈아끼우는 것으로 분기를 처리하는게 핵심이다.

## 🐬 3. 옵저버 패턴 — "단톡방 알림 구조"

단톡방에 누가 한 마디만 해도,
관계없는 사람까지 알림이 다 튄다.

Subject: 채팅방

Observer: 방에 참여한 사람들

Notify: "새 메시지 왔어요" 브로드캐스트

**정의**: 한 객체의 상태 변화가 있을 때, 의존하는 여러 객체에게 자동으로 통보되는 패턴

### 🦭 예시 코드 (아주 간단한 EventEmitter)

```typescript
type Listener = (payload: unknown) => void;

class EventBus {
  private listeners = new Map<string, Set<Listener>>();

  on(event: string, listener: Listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  off(event: string, listener: Listener) {
    this.listeners.get(event)?.delete(listener);
  }

  emit(event: string, payload?: unknown) {
    this.listeners.get(event)?.forEach((listener) => listener(payload));
  }
}

// 사용
const bus = new EventBus();

bus.on("user:login", (user) => {
  console.log("유저 로그인 알림:", user);
});

bus.emit("user:login", { id: 1, name: "Jin" });
```

리액트 상태 관리, 프론트 이벤트 버스, 서버 이벤트 시스템 등
"어디선가 상태가 변하면, 여러 군데가 같이 알아야 하는" 상황에 딱 들어맞는다.

## 🐬 4. 데코레이터 패턴 — "커피에 토핑 얹기"

아메리카노에

우유 넣으면 라떼,

시럽 넣으면 바닐라 라떼,

샷 하나 더 추가하면 연속 커밋…

기본 커피(원본 객체)는 그대로 두고
위에 기능(토핑)을 덧붙이는 방식이 데코레이터 패턴이다.

**정의**: 기존 객체를 변경하지 않고, 런타임에 책임(기능)을 동적으로 추가하는 패턴

### 🦭 예시 코드 (fetch에 로깅 데코레이터)

```typescript
type HttpClient = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

const baseFetch: HttpClient = (input, init) => fetch(input, init);

function withLogging(client: HttpClient): HttpClient {
  return async (input, init) => {
    console.log("📡 Request:", input, init);
    const res = await client(input, init);
    console.log("📥 Response:", res.status);
    return res;
  };
}

const loggedFetch = withLogging(baseFetch);

// 사용
loggedFetch("/api/users");
```

원래 fetch를 수정하지 않고, 감싸서 기능을 추가하는 점이 중요하다.

## 🐬 5. 프록시 패턴 — "문 앞에서 택배 대신 받아주는 사람"

집에 있는데 잠깐 나가기 싫어서
“현관 비번 알려줄 테니, 대신 좀 받아줘” 하는 상황이 있다.

친구는:

택배를 대신 받고

문 열고 닫는 처리도 하고

필요하면 사진 찍어서 보내준다.

이게 바로 프록시다.

**정의**: 실제 객체(RealSubject)에 접근하기 전에, 중간에서 대신 요청을 받아 처리하는 대리 객체를 두는 패턴

### 🦭 예시 코드 (간단 캐시 프록시)

```typescript
type FetchUser = (id: number) => Promise<{ id: number; name: string }>;

function createUserFetcher(): FetchUser {
  return async (id) => {
    const res = await fetch(`/api/users/${id}`);
    return res.json();
  };
}

function withCache(fetchUser: FetchUser): FetchUser {
  const cache = new Map<number, { id: number; name: string }>();

  return async (id) => {
    if (cache.has(id)) {
      console.log("✅ 캐시에서 가져옴");
      return cache.get(id)!;
    }
    console.log("🌐 API 호출");
    const user = await fetchUser(id);
    cache.set(id, user);
    return user;
  };
}

const fetchUser = withCache(createUserFetcher());

// 사용
fetchUser(1); // API 호출
fetchUser(1); // 캐시 사용
```

접근 제어 / 캐싱 / 지연 로딩 등을 하고 싶을 때 프록시를 생각하면 꽤 많은 코드가 정리된다.

## 🐬 6. 파사드(Facade) 패턴 — "시동 버튼 하나로 끝내기"

자동차 시동은 실제로는 복잡하다.

연료 공급

점화

전기 시스템 초기화

각종 센서 체크 …

하지만 운전자는 그냥 버튼 하나만 누른다.

**정의**: 복잡한 서브 시스템들을 단순한 고수준 인터페이스로 감싸는 패턴

### 🦭 예시 코드 (UserService 파사드)

```typescript
class UserRepository {
  async fetchUser(id: number) {
    const res = await fetch(`/api/users/${id}`);
    return res.json();
  }
}

class OrderRepository {
  async fetchOrdersByUser(id: number) {
    const res = await fetch(`/api/users/${id}/orders`);
    return res.json();
  }
}

class UserServiceFacade {
  private userRepo = new UserRepository();
  private orderRepo = new OrderRepository();

  async getUserDashboardData(userId: number) {
    const [user, orders] = await Promise.all([
      this.userRepo.fetchUser(userId),
      this.orderRepo.fetchOrdersByUser(userId),
    ]);

    return {
      user,
      orderCount: orders.length,
      lastOrder: orders[0] ?? null,
    };
  }
}

// 사용
const service = new UserServiceFacade();
service.getUserDashboardData(1).then((data) => {
  console.log("대시보드용 데이터:", data);
});
```

호출하는 쪽은 "유저 대시보드 데이터 주세요" 정도만 알면 된다.
내부에서 API를 몇 번 호출하는지, 어떤 조합을 하는지는 몰라도 된다.

## 🐬 7. Boundary 패턴 — "창구 하나로 외부 세계와 연결하기"

이제 새로 추가한 Boundary 패턴.

은행을 생각해 보자.

손님은 창구 직원에게만 말한다.

창구 뒤에 어떤 시스템(계정 시스템, 대출 시스템, 리포트 시스템)이 있는지는 모른다.

창구에서 입력을 검증하고,
“이건 대출 창구로 가셔야 해요”라고 라우팅해 준다.

Boundary 패턴은 보통 DDD, Clean Architecture에서 많이 언급되는 개념으로,
**시스템 바깥(외부 세계: UI, 다른 서비스, 외부 API)**과
시스템 안(도메인 로직) 사이에 경계(Boundary)를 명시적으로 두는 설계다.

프론트엔드 관점에서 보면:

UI 컴포넌트는 UserBoundary 같은 걸 통해서만 API를 부른다.

fetch를 이 컴포넌트 저 컴포넌트에서 막 쓰지 않는다.

Boundary 레이어가

request/response를 검증하고

에러를 도메인 친화적인 형태로 바꿔 주고

로그, 추적, 리트라이 정책을 담당한다.

**정의**: 외부 세계와 도메인 사이에 명확한 경계 레이어를 두고, 그 레이어를 통해서만 상호작용하도록 강제하는 패턴

### 🦭 예시 코드 (프론트용 UserBoundary)

```typescript
// 도메인 모델
interface User {
  id: number;
  name: string;
  email: string;
}

// Boundary에서만 API 직통 호출
class UserBoundary {
  private baseUrl = "/api";

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...init,
    });

    if (!res.ok) {
      // 여기서 공통 에러 매핑/로깅
      const errorBody = await res.text();
      console.error("API Error:", res.status, errorBody);
      throw new Error(`UserBoundaryError: ${res.status}`);
    }

    return res.json() as Promise<T>;
  }

  // 외부에서 사용하는 메서드는 도메인 언어로 설계
  getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  createUser(payload: Pick<User, "name" | "email">): Promise<User> {
    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

// UI에서는 Boundary만 사용
const boundary = new UserBoundary();

async function onSubmit() {
  try {
    const user = await boundary.createUser({
      name: "Jin",
      email: "jin@example.com",
    });
    console.log("생성된 유저:", user);
  } catch (e) {
    console.log("유저 생성 실패, UI용 에러 처리");
  }
}
```

여기서 중요한 포인트:

UI는 더 이상 fetch('/api/users') 같은 문자열을 직접 모른다.
→ API 경로 변경 / 인증 정책 변경 시 Boundary만 수정하면 됨.

Boundary는

네트워크 에러

HTTP 상태 코드

API 스키마 변화
같은 “바깥 세계의 혼란”을 받아서
도메인/앱이 이해할 수 있는 형태로 정리해 준다.

나중에 백엔드가 REST → GraphQL로 바뀌거나,
외부 SaaS로 서비스가 바뀌더라도
Boundary 인터페이스를 유지하면 UI는 그대로 갈 수 있다.

일상 비유로 정리하면: "손님은 항상 창구 직원하고만 이야기하고, 창구 뒤에 뭐가 있든 신경 쓰지 않는다."

## 🐬 마무리 — 패턴은 '철학'보다 '패턴 인식'이다

여기까지 살펴본 패턴들:

- **싱글톤** — 전역적으로 하나만 있어야 할 때
- **전략** — 행동은 같고, 방식만 바꾸고 싶을 때
- **옵저버** — 변화가 여러 군데에 전파돼야 할 때
- **데코레이터** — 원본을 안 건드리고 기능을 덧입힐 때
- **프록시** — 대신 받아주고, 대신 처리해 줄 창구가 필요할 때
- **파사드** — 복잡한 걸 버튼 하나로 감추고 싶을 때
- **Boundary** — "우리 시스템의 경계선"을 명확히 그리고 싶을 때

실무에서 중요한 건 "지금 내가 겪는 이 문제가 어떤 패턴과 닮았는지 인식하는 감각"이다.
