import express from "express";
import { create, getAll, getOne, remove, update } from "../controllers/product";
import checkPermission from "../middleware/checkPermission";

const router = express.Router();

router.get("/products", getAll);
router.post("/products", checkPermission, create);
router.put("/products/:id", checkPermission, update);
router.delete("/products/:id", checkPermission, remove);
router.get("/products/:id", getOne);

export default router;
