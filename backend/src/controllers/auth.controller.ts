import { Response, Request } from "express";
import { prisma } from "../db";
import bcrypt from 'bcryptjs'
import generateToken from "../utils/generateToken";

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;
        console.log('req.body', req.body);
        if (!fullname || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "Please fill all the data." })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "password and confirm password must be same." })
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        if (existingUser) {
            return res.json({
                error: "email already exists"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = await prisma.user.create({
            data: {
                fullname,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
            }
        })

        if (newUser) {
            generateToken(newUser.id, res);

            res.status(201).json({
                id: newUser.id,
                fullname: newUser.fullname,
                username: newUser.fullname,
                profilePic: newUser.profilePic
            })
        } else {
            res.status(400).json({
                error: "invalid     user data"
            })
        }

    } catch (er) {
        console.log(er)
    }
}
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({ where: { username } })
        if (!user) {
            return res.status(400).json({ error: "incorrect credentials." });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "incorrect credentials." })
        }
        generateToken(user.id, res)
        res.json({
            id: user.id,
            fullname: user.fullname,
            username: user.fullname,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log(error)
    }
}
export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "logged out successfully." })
    } catch (error) {
        console.log('error', error);
        res.status(400).json({ error: "Internal server error." })
    }
}
export const getME = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } })
        if (!user) {
            return res.status(404).json({
                error: "user not found"
            })
        }
        res.json({
            id: user.id,
            fullname: user.fullname,
            username: user.fullname,
            profilePic: user.profilePic
        })
    } catch (error) {

    }
}