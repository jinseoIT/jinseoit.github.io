import type { PostData } from "../../types";
import {
  UI_CONSTANTS,
  CSS_CLASSES,
  DEFAULT_TAG,
  URL_PATTERNS,
  EVENT_TYPES,
} from "../../constants";
import { handlePopState, handleTagClick } from "./handlers.ts";

// 상태 관리
let currentVisibleCount = UI_CONSTANTS.POSTS_PER_LOAD;
let filteredPosts: PostData[] = [];
let isInitialized = false;
let isLoading = false;
let scrollTimeout: number | null = null;

// 태그별 스크롤 상태 관리
const tagScrollStates = new Map<string, number>();
let currentTag = DEFAULT_TAG;

// 이미지 로딩 설정 (중복 호출 방지)
let isSettingUpImages = false;

// 전역 이미지 로딩 상태 관리
if (!window.imageLoadStates) {
  window.imageLoadStates = new Map();
}

export function setupImageLoading() {
  if (isSettingUpImages) {
    return;
  }

  isSettingUpImages = true;

  const images = document.querySelectorAll(
    CSS_CLASSES.POST_ITEM + " img",
  ) as NodeListOf<HTMLImageElement>;

  images.forEach((img, index) => {
    const skeleton = img.previousElementSibling as HTMLElement;
    const imageUrl = img.src;

    // 이미 캐시된 상태가 있으면 즉시 적용 (깜빡임 방지)
    if (window.imageLoadStates.has(imageUrl)) {
      const isLoaded = window.imageLoadStates.get(imageUrl);
      if (isLoaded) {
        img.classList.add(CSS_CLASSES.LOADED);
        img.style.opacity = "1"; // 즉시 표시
        if (skeleton) {
          skeleton.style.display = "none";
        }
      } else {
        img.style.display = "none";
        if (skeleton) {
          skeleton.style.setProperty("display", "block", "important");
          skeleton.style.setProperty("visibility", "visible", "important");
          skeleton.style.background =
            "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)";
        }
      }
      return; // 이미 처리된 이미지는 더 이상 처리하지 않음
    }

    // 이미 로딩이 완료된 이미지인지 확인 (브라우저 캐시)
    if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
      img.classList.add(CSS_CLASSES.LOADED);
      img.style.opacity = "1"; // 즉시 표시
      window.imageLoadStates.set(imageUrl, true);
      if (skeleton) {
        skeleton.style.display = "none";
      }
      return;
    }

    // 이미 로딩이 실패한 이미지인지 확인
    if (img.complete && img.naturalWidth === 0) {
      window.imageLoadStates.set(imageUrl, false);
      img.style.display = "none";
      if (skeleton) {
        skeleton.style.setProperty("display", "block", "important");
        skeleton.style.setProperty("visibility", "visible", "important");
        skeleton.style.background =
          "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)";
      }
      return;
    }

    // 이미지 로드 완료 시
    img.addEventListener(
      EVENT_TYPES.LOAD,
      function () {
        this.classList.add(CSS_CLASSES.LOADED);
        this.style.opacity = "1"; // 즉시 표시
        window.imageLoadStates.set(imageUrl, true);
        if (skeleton) {
          skeleton.style.display = "none";
        }
      },
      { once: true },
    );

    // 이미지 로드 실패 시
    img.addEventListener(
      EVENT_TYPES.ERROR,
      function () {
        window.imageLoadStates.set(imageUrl, false);
        this.style.display = "none";
        if (skeleton) {
          skeleton.style.display = "block";
          skeleton.style.background =
            "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)";
        }
      },
      { once: true },
    );
  });

  // 플래그 리셋
  isSettingUpImages = false;
}

// Intersection Observer 설정
let observer: IntersectionObserver | null = null;

export function setupIntersectionObserver() {
  const intersectionObserver = document.querySelector(
    CSS_CLASSES.INTERSECTION_OBSERVER,
  ) as HTMLElement | null;

  if (!intersectionObserver) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoading) {
          loadMorePosts();
        }
      });
    },
    {
      rootMargin: UI_CONSTANTS.INTERSECTION_ROOT_MARGIN,
      threshold: UI_CONSTANTS.INTERSECTION_THRESHOLD,
    },
  );

  observer.observe(intersectionObserver);
}

// 포스트 표시 최적화 (변경된 부분만 업데이트)
export function displayPosts() {
  const postsToShow = filteredPosts.slice(0, currentVisibleCount);
  const currentVisible = new Set(postsToShow.map((p) => p.element));

  // 숨겨야 할 포스트만 숨기기
  const posts = Array.from(
    document.querySelector(CSS_CLASSES.POST_LIST)?.children || [],
  ) as HTMLElement[];
  posts.forEach((post) => {
    if (!currentVisible.has(post)) {
      post.classList.add(CSS_CLASSES.HIDDEN);
    }
  });

  // 보여야 할 포스트만 보이기
  postsToShow.forEach((postData) => {
    if (postData.element) {
      postData.element.classList.remove(CSS_CLASSES.HIDDEN);
    }
  });

  // 로딩 인디케이터 상태 업데이트
  const loadingIndicator = document.querySelector(
    CSS_CLASSES.LOADING_INDICATOR,
  ) as HTMLElement | null;

  if (loadingIndicator) {
    const shouldShow = currentVisibleCount < filteredPosts.length;
    if (shouldShow && loadingIndicator.classList.contains(CSS_CLASSES.HIDDEN)) {
      loadingIndicator.classList.remove(CSS_CLASSES.HIDDEN);
    } else if (
      !shouldShow &&
      !loadingIndicator.classList.contains(CSS_CLASSES.HIDDEN)
    ) {
      loadingIndicator.classList.add(CSS_CLASSES.HIDDEN);
    }
  }

  // 새로 표시된 포스트의 이미지 상태 확인 (성능 최적화)
  if (postsToShow.length > 0) {
    requestIdleCallback(() => {
      setupImageLoading();
    });
  }
}

// 더 많은 포스트 로드
export function loadMorePosts() {
  if (isLoading || currentVisibleCount >= filteredPosts.length) return;

  isLoading = true;

  // requestAnimationFrame을 사용하여 브라우저 최적화 활용
  requestAnimationFrame(() => {
    currentVisibleCount = Math.min(
      currentVisibleCount + UI_CONSTANTS.POSTS_PER_LOAD,
      filteredPosts.length,
    );

    // 현재 태그의 스크롤 상태 저장
    tagScrollStates.set(currentTag, currentVisibleCount);

    displayPosts();

    // 로딩 완료 후 약간의 지연을 두어 부드러운 경험 제공
    setTimeout(() => {
      isLoading = false;
    }, UI_CONSTANTS.IMAGE_LOAD_DELAY);
  });
}

// 필터링 최적화 (캐싱 활용)
const filterCache = new Map<string, PostData[]>();

export function filterPosts(selectedTag: string, updateHistory = true) {
  // 이전 태그의 스크롤 상태 저장
  if (currentTag !== selectedTag) {
    tagScrollStates.set(currentTag, currentVisibleCount);
  }

  // 새 태그로 변경
  currentTag = selectedTag;

  // 포스트 데이터 구조화 (DOM에서 직접 태그 정보 읽기)
  const postList = document.querySelector(CSS_CLASSES.POST_LIST);
  const posts = Array.from(postList?.children || []) as HTMLElement[];

  // 캐시된 결과가 있으면 사용
  if (filterCache.has(selectedTag)) {
    filteredPosts = filterCache.get(selectedTag)!;
  } else {
    // 포스트와 태그 정보 매핑 (한 번만 실행)
    const postsData = posts.map((post) => {
      const tagsString = post.getAttribute("data-tags") || "";
      const tags = tagsString
        ? tagsString.split(",").filter((tag) => tag.trim())
        : [];
      return { element: post, tags };
    });

    // 새로운 필터링 결과 계산 및 캐시
    if (selectedTag === DEFAULT_TAG) {
      filteredPosts = postsData;
    } else {
      filteredPosts = postsData.filter((postData) =>
        postData.tags.some(
          (tag) => tag.toLowerCase() === selectedTag.toLowerCase(),
        ),
      );
    }
    filterCache.set(selectedTag, filteredPosts);
  }

  // 이전 스크롤 상태 복원 (없으면 기본값)
  const savedScrollState = tagScrollStates.get(selectedTag);
  currentVisibleCount = savedScrollState || UI_CONSTANTS.POSTS_PER_LOAD;

  // DOM 업데이트
  displayPosts();

  // 태그 버튼 상태 업데이트 (변경된 것만)
  const tagButtons = document.querySelectorAll(
    CSS_CLASSES.TAG_BTN,
  ) as NodeListOf<HTMLButtonElement>;

  tagButtons.forEach((btn) => {
    const isActive = btn.dataset.tag === selectedTag;
    if (isActive && !btn.classList.contains(CSS_CLASSES.ACTIVE)) {
      btn.classList.add(CSS_CLASSES.ACTIVE);
    } else if (!isActive && btn.classList.contains(CSS_CLASSES.ACTIVE)) {
      btn.classList.remove(CSS_CLASSES.ACTIVE);
    }
  });

  // 히스토리 업데이트 (초기화 시에는 하지 않음)
  if (updateHistory && isInitialized) {
    const url =
      selectedTag === DEFAULT_TAG
        ? URL_PATTERNS.HOME
        : `${URL_PATTERNS.TAGS_PREFIX}${selectedTag}`;
    window.history.pushState({ tag: selectedTag }, "", url);
  }
}

// 초기 태그 버튼 상태 설정
export function setupInitialTagButtons(initialTag?: string) {
  const tagButtons = document.querySelectorAll(
    CSS_CLASSES.TAG_BTN,
  ) as NodeListOf<HTMLButtonElement>;

  tagButtons.forEach((btn) => {
    const btnTag = btn.dataset.tag;
    const isActive = btnTag === (initialTag || DEFAULT_TAG);

    if (isActive) {
      btn.classList.add(CSS_CLASSES.ACTIVE);
    } else {
      btn.classList.remove(CSS_CLASSES.ACTIVE);
    }
  });
}

// 초기화 함수
export function initializeState(initialTag?: string) {
  const currentPath = window.location.pathname;

  if (initialTag) {
    currentTag = initialTag;
    filterPosts(initialTag, false);
  } else if (currentPath.startsWith(URL_PATTERNS.TAGS_PREFIX)) {
    const tagName = currentPath.split(URL_PATTERNS.TAGS_PREFIX)[1];
    currentTag = tagName;
    filterPosts(tagName, false);
  } else {
    currentTag = DEFAULT_TAG;

    // DOM에서 직접 포스트 데이터 구성
    const postList = document.querySelector(CSS_CLASSES.POST_LIST);
    const posts = Array.from(postList?.children || []) as HTMLElement[];
    const postsData = posts.map((post) => {
      const tagsString = post.getAttribute("data-tags") || "";
      const tags = tagsString
        ? tagsString.split(",").filter((tag) => tag.trim())
        : [];
      return { element: post, tags };
    });
    filteredPosts = postsData;

    // 초기 태그의 스크롤 상태 설정
    const savedScrollState = tagScrollStates.get(DEFAULT_TAG);
    currentVisibleCount = savedScrollState || UI_CONSTANTS.POSTS_PER_LOAD;
    displayPosts();
  }

  // 초기 태그 버튼 상태 설정 (초기화 후 실행)
  setTimeout(() => {
    setupInitialTagButtons(initialTag);
  }, 0);

  isInitialized = true;
}

// 이벤트 리스너 등록 (최적화된 방식)
export function setupEventListeners() {
  document.addEventListener(EVENT_TYPES.CLICK, handleTagClick);
  window.addEventListener(EVENT_TYPES.POPSTATE, handlePopState);
}

// 메모리 정리 (페이지 언로드 시)
export function cleanup() {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  if (observer) {
    observer.disconnect();
  }
}
