import { Router } from "express";
import * as SessionController from "../controllers/SessionController";
import * as UserController from "../controllers/UserController";
import CheckSettingsHelper from "../helpers/CheckSettings";
import isAuth from "../middleware/isAuth";

const authRoutes = Router();

authRoutes.get("/signup/status", async (req, res) => {
  try {
    const userCreationStatus = await CheckSettingsHelper("userCreation");
    return res.json({ enabled: userCreationStatus === "enabled" });
  } catch (err) {
    return res.json({ enabled: false });
  }
});

authRoutes.post("/signup", UserController.store);

authRoutes.post("/login", SessionController.store);

authRoutes.post("/refresh_token", SessionController.update);

authRoutes.delete("/logout", isAuth, SessionController.remove);

export default authRoutes;
