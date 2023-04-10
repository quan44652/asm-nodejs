import express from "express";
import { signin, signup, users, remove, authorize } from "../controllers/auth";
import checkPermission from "../middleware/checkPermission";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/users", users);
router.delete("/users/:id", checkPermission, remove);
router.patch("/users/:id", checkPermission, authorize);

export default router;
