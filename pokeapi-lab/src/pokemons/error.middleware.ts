import { NextFunction, Request, Response } from "express";

// Es un middleware de errores porque tiene los 4 parámetros, pese a que no se 
// usen todos
export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err);
  res.status(500).json({error: "Error interno del servidor"});
}