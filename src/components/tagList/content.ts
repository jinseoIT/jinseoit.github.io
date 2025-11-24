import { getCollection } from "astro:content";

export interface Post {
  id: string;
  title: string;
  description?: string;
  published: Date;
  category?: string;
  tags?: string[];
  image?: string;
  draft: boolean;
}

export interface Tag {
  name: string;
  slug: string;
  posts: Post[];
}

/**
 * 태그 우선순위 배열 - 이 순서대로 먼저 배치됩니다
 */
const TAG_PRIORITY = ["JavaScript", "TypeScript", "React", "Next.js"];

// 우선순위 Map으로 변환 (O(1) 접근을 위해)
const PRIORITY_MAP = new Map(TAG_PRIORITY.map((tag, index) => [tag, index]));

export async function GetTags() {
  const allBlogPosts = await getCollection("posts", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  // 태그별 포스트 개수만 계산 (전체 포스트 정보는 불필요)
  const tagCounts = new Map<string, number>();

  allBlogPosts.forEach((post) => {
    post.data.tags?.forEach((tag: string) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  // 우선순위를 고려한 태그 정렬
  const sortedTags = Array.from(tagCounts.entries()).sort(([a], [b]) => {
    const aPriority = PRIORITY_MAP.get(a);
    const bPriority = PRIORITY_MAP.get(b);

    // 둘 다 우선순위에 있는 경우
    if (aPriority !== undefined && bPriority !== undefined) {
      return aPriority - bPriority;
    }

    // a만 우선순위에 있는 경우
    if (aPriority !== undefined && bPriority === undefined) {
      return -1;
    }

    // b만 우선순위에 있는 경우
    if (aPriority === undefined && bPriority !== undefined) {
      return 1;
    }

    // 둘 다 우선순위에 없는 경우 알파벳 순 정렬
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  // 필요한 정보만 반환
  return sortedTags.map(([name, count]) => ({
    name,
    count: { name, slug: `/tags/${name}`, posts: [] },
  }));
}

/**
 * Post published 우선순위 배열
 */
export async function GetSortedPosts() {
  const allBlogPosts = await getCollection("posts", ({ data }) => data.draft);
  const sorted = allBlogPosts.sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf(),
  );

  return sorted;
}
