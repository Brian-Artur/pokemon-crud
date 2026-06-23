import { NextFunction, Request, Response } from "express";

export function validateId(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json(
      { error: "El id debe seer un número entero positivo" }
    );
    return;
  }
  next();
}