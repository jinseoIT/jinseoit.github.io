// 전역 타입 선언
declare global {
  interface Window {
    imageLoadStates: Map<string, boolean>;
  }
}

// 포스트 데이터 타입
export interface PostData {
  element: HTMLElement;
  tags: string[];
}

// 필터 캐시 타입
export type FilterCache = Map<string, PostData[]>;

// 태그 스크롤 상태 타입
export type TagScrollStates = Map<string, number>;

// 태그 관련 타입
export interface TagInfo {
  name: string;
  count: number;
  isActive: boolean;
}

// 이미지 로딩 상태 타입
export interface ImageLoadState {
  url: string;
  isLoaded: boolean;
  timestamp: number;
}

// 스크롤 상태 타입
export interface ScrollState {
  tag: string;
  visibleCount: number;
  scrollPosition: number;
}
