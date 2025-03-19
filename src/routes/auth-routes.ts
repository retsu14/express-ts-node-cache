import { Router } from "express";
import { login, logout, register } from "../handler/auth-handler";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
