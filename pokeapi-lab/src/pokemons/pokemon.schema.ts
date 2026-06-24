import { z } from "zod";

export const pokemonSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  types: z.array(z.string()).min(1),
})

export const pokemonSinIdSchema = pokemonSchema.omit({ id: true });

export type Pokemon = z.infer<typeof pokemonSchema>;
export type PokemonSinId = z.infer<typeof pokemonSinIdSchema>;