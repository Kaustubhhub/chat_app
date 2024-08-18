import { Request, Response } from "express";
import { prisma } from "../db";


export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params
        const senderId = req.user.id
        console.log('message', message);
        console.log('receiverId', receiverId);
        console.log('senderId>>', senderId);
        let conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [receiverId, senderId]
                }
            }
        })

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId, receiverId]
                    }
                }
            })
        }

        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id
            }
        })

        if (newMessage) {
            conversation = await prisma.conversation.update({
                where: {
                    id: conversation.id,
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id,
                        },
                    },
                },
            });
        }

        res.status(201).json(newMessage)

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ error: "Internal server Error." })
    }
}

export const getMessages = async (req: Request, res: Response) => {
    try {
        console.log('Am i here' );
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;
        console.log('senderId .....', senderId);
        const conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, userToChatId]
                }
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        })
        if (!conversation) {
            return res.status(200).json([]);
        }

        return res.status(200).json(conversation.messages);
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ error: "Internal server Error." })
    }
}

export const getUsersForSideBar = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        console.log('getUsersForSideBar', getUsersForSideBar);
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: userId
                },
            },
            select: {
                profilePic: true,
                id: true,
                fullname: true,
            }
        })
        console.log('users', users);
        res.status(200).json(users);
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ error: "Internal server Error." })
    }
}