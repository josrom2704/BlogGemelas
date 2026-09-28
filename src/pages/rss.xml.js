import rss from "@astrojs/rss";
import { getPublishedPosts } from "../lib/posts";
import { site } from "../config";

export async function GET(context) {
  const posts = await getPublishedPosts();

  return rss({
    title: site.nombre,
    description: site.descripcion,
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: [post.data.category],
    })),
    customData: `<language>${site.idioma}</language>`,
  });
}
