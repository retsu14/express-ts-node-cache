import { Router } from "express";
import { register } from "../handler/auth-handler";
const router = Router();

router.post("/register", register);

module.exports = router;
