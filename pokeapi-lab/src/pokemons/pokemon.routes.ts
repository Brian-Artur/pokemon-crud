import { Router } from "express";
import { PokemonController } from "./pokemon.controller";



export function pokemonRoutes(controller: PokemonController): Router {
  const router = Router();

  router.get("/", controller.getAll);
  router.get("/:id", controller.getById);
  router.post("/", controller.create);
  router.delete("/:id", controller.remove);

  return router;
}