// URL 패턴
export const URL_PATTERNS = {
  TAGS_PREFIX: "/tags/",
  HOME: "/",
  POSTS: "/posts/",
  RSS: "/rss.xml",
} as const;

// 라우팅 관련 상수
export const ROUTE_CONSTANTS = {
  DEFAULT_PAGE: 1,
  POSTS_PER_PAGE: 10,
} as const;
