import { DEFAULT_TAG, URL_PATTERNS } from "../../constants";
import { filterPosts } from "./tagListLogic";

// 브라우저 뒤로가기/앞으로가기 처리
export function handlePopState(event: PopStateEvent) {
  const currentPath = window.location.pathname;
  let tag = DEFAULT_TAG;

  if (currentPath.startsWith(URL_PATTERNS.TAGS_PREFIX)) {
    tag = currentPath.split(URL_PATTERNS.TAGS_PREFIX)[1];
  }

  const eventTag = (event.state as any)?.tag;
  if (eventTag) {
    tag = eventTag;
  }

  filterPosts(tag, false);
}

// 이벤트 리스너 최적화 (이벤트 위임 사용)
export function handleTagClick(e: Event) {
  const target = e.target as HTMLElement;

  // 태그 버튼 클릭인 경우에만 기본 동작 방지
  if (target.classList.contains("tag-btn")) {
    e.preventDefault();
    const selectedTag = target.dataset.tag || DEFAULT_TAG;
    filterPosts(selectedTag, true);
  }
  // a태그나 다른 요소는 기본 동작 허용
}
