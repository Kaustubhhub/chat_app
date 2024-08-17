import { Router } from "express";
import protectRoute from "../middleware/protectRoute";
import { sendMessage, getMessages, getUsersForSideBar } from "../controllers/message.controller";

const router = Router();

router.get('/conversations', protectRoute, getUsersForSideBar)
router.get('/:id', protectRoute, getMessages)
router.post('/send/:id', protectRoute, sendMessage)

export default router