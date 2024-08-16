import jwt, { decode, JwtPayload } from 'jsonwebtoken'
import { Response, Request, NextFunction } from 'express'
import { prisma } from '../db';

interface DecodedToken extends JwtPayload {
    userId: string;
}

declare global {
    namespace Express {
        export interface Request {
            user: {
                id: string,

            }
        }
    }
}

const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "Unauthorised - no token provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken

        if (!decoded) {
            return res.status(401).json({ error: "Invalid token" });
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, username: true, fullname: true, profilePic: true } })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user

        next()

    } catch (error) {
        console.log('error', error);
    }
}

export default protectRoute