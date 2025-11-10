import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import {
  SITE_TITLE,
  SITE_DESCRIPTION,
  DEFAULT_AUTHOR,
} from "../constants/site";

export async function GET(context) {
  const posts = await getCollection("posts");
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      author: post.data.author,
      link: `/posts/${post.slug}/`,
      categories: post.data.tags || [],
    })),
    customData: `<language>ko</language>`,
  });
}
