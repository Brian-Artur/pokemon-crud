import { Request, Response } from "express";
import { PokemonRepository } from "./pokemon.repository";
import { pokemonSchema } from "./pokemon.schema";



export class PokemonController {
  constructor(private readonly repo: PokemonRepository) {}
    
  getAll = async (req: Request, res: Response) => {
    try {
      const lista = await this.repo.getAll();
      res.json(lista);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al cargar pokemons" }); 
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const pokemon = await this.repo.getById(id);
      
      if(!pokemon){
        res.status(404).json({ error: "Pokémon no encontrado" });
        return;
      }
      res.json(pokemon);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al cargar el pokémon" }); 
    }
  };

  create = async (req: Request, res: Response) => {
    const result = pokemonSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    try {
      await this.repo.create(result.data);
      res.status(201).json(result.data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "No se pudo crear el pokémon" });
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const eliminado = await this.repo.remove(id);
      if (!eliminado) return res.status(404).json({ error: "Pokémon no encontrado" });
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "No se pudo eliminar el pokémon" });
    }
  };
}