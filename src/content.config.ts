import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { categorias } from "./config";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    cover: z.string(),
    coverAlt: z.string().optional(),
    category: z.enum(categorias),
    tags: z.array(z.string()).default([]),
    author: z.enum(["fernanda", "jimena", "ambas"]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
