import { Router } from "express";
import { PokemonController } from "./pokemon.controller";
import { validateId } from "./validateId.middleware";



export function pokemonRoutes(controller: PokemonController): Router {
  const router = Router();

  router.get("/", controller.getAll);
  router.get("/:id", validateId, controller.getById);
  router.post("/", controller.create);
  router.delete("/:id", validateId, controller.remove);

  return router;
}