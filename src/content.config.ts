import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { categorias, idsAutores, type AutorId } from "./config";

const autorId = z.enum(idsAutores as [AutorId, ...AutorId[]]);

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
    // Una persona ("fernanda") o varias (["fernanda", "lourdes"]); siempre se lee como lista.
    author: z.union([autorId, z.array(autorId).min(1)]).transform((v) => (Array.isArray(v) ? v : [v])),
    draft: z.boolean().default(false),
    // Fotos que se muestran en un carrusel al final del post.
    galleryTitle: z.string().optional(),
    gallery: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
  }),
});

export const collections = { blog };
