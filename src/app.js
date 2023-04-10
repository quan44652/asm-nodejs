import express from "express";
import mongoose from "mongoose";
import routerCategory from "./routers/category";
import routerProduct from "./routers/product";
import routerAuth from "./routers/auth";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/asm");

app.use("/api", routerProduct);
app.use("/api", routerCategory);
app.use("/api", routerAuth);

export const viteNodeApp = app;
