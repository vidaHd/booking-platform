import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default";

export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
