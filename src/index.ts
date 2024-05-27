import express, { Express } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./handlers";
import { buildingRouter, locationRouter } from "./routers";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(morgan("tiny"));
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/buildings", buildingRouter);
app.use("/api/locations", locationRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
