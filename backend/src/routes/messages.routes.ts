import { Router } from "express";

const router = Router();

router.get('/conversations', (req, res) => {
    res.json({
        data: "conversations"
    })
})

export default router