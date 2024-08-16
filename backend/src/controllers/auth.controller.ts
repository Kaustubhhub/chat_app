import { Response, Request } from "express";
import { prisma } from "../db";
import bcrypt from 'bcryptjs'

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullname, username, passoword, confirmPassword, gender } = req.body;
        if (!fullname || !username || !passoword || !confirmPassword || !gender) {
            return res.status(400).json({ error: "Please fill all the data." })
        }

        if (passoword !== confirmPassword) {
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
        console.log('salt', salt);

        // await prisma.user.create({
        //     data: {
        //         username: username,
        //         fullName: fullname,
        //         password: passoword
        //     }
        // })
    } catch (er) {
        console.log(er)
    }
}
export const login = async (req: Request, res: Response) => { }
export const logout = async (req: Request, res: Response) => { }