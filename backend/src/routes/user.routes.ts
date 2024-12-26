//routes login,register and profile
import { Router } from "express";
import authenticateToken from "../middleware/auth";
import userController from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get("/profile", authenticateToken, userController.userProfile);
userRouter.post("/logout", authenticateToken, userController.logout);
// userRouter.get("/check-login", authenticateToken, userController.checkLogin);
userRouter.get("/check-login", userController.checkLogin);

export default userRouter;
