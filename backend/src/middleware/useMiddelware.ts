import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

function validationMiddleware(type: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(type, req.body);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      const messages = errors
        .map(err => Object.values(err.constraints || {}))
        .flat();

      return res.status(400).json({ error: messages.join(", ") });
    } else {
      next();
    }
  };
}

export default validationMiddleware;
