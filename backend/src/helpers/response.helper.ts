import { Request, Response } from "express";

export const successResponse = (res: Response, message: string, data: object = {}) => {
  res.status(200).json({ message, ...data });
};

export const errorResponse = (req: Request, res: Response, err: any, status = 400) => {
  const errorMsg = err?.message ? req.t(`errors.${err.message}`) : req.t("errors.internal");
  res.status(status).json({ error: errorMsg });
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: Function) =>
  Promise.resolve(fn(req, res, next)).catch((err) => errorResponse(req, res, err));
