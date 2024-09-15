import { Router } from "express";
import userController from "../controllers/user.controller";

const router = Router();

router.post("/new", userController.createUser);

router.get("/", userController.getAllUsers);

router.delete("/:id", userController.deleteUser);

export default router;
