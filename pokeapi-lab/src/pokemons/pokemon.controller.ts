import { Request, Response, NextFunction } from "express";
import { PokemonRepository } from "./pokemon.repository";
import { pokemonSchema } from "./pokemon.schema";



export class PokemonController {
  constructor(private readonly repo: PokemonRepository) {}
    
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lista = await this.repo.getAll();
      res.json(lista);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const pokemon = await this.repo.getById(id);
      
      if(!pokemon){
        res.status(404).json({ error: "Pokémon no encontrado" });
        return;
      }
      res.json(pokemon);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    const result = pokemonSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.issues });
      return; 
    }
    try {
      await this.repo.create(result.data);
      res.status(201).json(result.data);
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const eliminado = await this.repo.remove(id);
      if (!eliminado) {
        res.status(404).json({ error: "Pokémon no encontrado" });
        return; 
      }
        res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}