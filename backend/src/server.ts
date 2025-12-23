import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import resetRoutes from "./routes/reset.routes";
import companyRoutes from "./routes/company.routes";
import serviceRoutes from "./routes/service.routes";
import companyService from "./routes/company-service.routes";
import jobRoutes from "./routes/job.routes";
import availableTime from "./routes/availableTime.routes";
import booking from "./routes/booking.routes";

import { handle } from "i18next-http-middleware";
import i18next from "./config/i18n";

import { connectDB } from "./config/db";

const app: Application = express();
// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(handle(i18next));

// MongoDB
connectDB();
// Routes
app.use("/auth", authRoutes);
app.use("/", profileRoutes);
app.use("/", resetRoutes);
app.use("/", companyRoutes);
app.use("/", jobRoutes);
app.use("/", serviceRoutes);
app.use("/", companyService);
app.use("/", availableTime);
app.use("/", booking);

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
