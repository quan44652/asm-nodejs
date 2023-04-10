import express from "express";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "../controllers/category";
import checkPermission from "../middleware/checkPermission";

const router = express.Router();

router.get("/categories", getAll);
router.post("/categories",checkPermission, create);
router.put("/categories/:id",checkPermission, update);
router.delete("/categories/:id",checkPermission, remove);
router.get("/categories/:id", getOne);

export default router;
