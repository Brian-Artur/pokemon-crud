import { z } from "zod";

export const pokemonSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  types: z.array(z.string()),
})

export const pokemosnListSchema = z.array(pokemonSchema);

export type Pokemon = z.infer<typeof pokemonSchema>;