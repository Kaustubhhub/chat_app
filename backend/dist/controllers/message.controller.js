"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersForSideBar = exports.getMessages = exports.sendMessage = void 0;
const db_1 = require("../db");
const socket_1 = require("../socket/socket");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        console.log('message', message);
        console.log('receiverId', receiverId);
        console.log('senderId>>', senderId);
        let conversation = yield db_1.prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [receiverId, senderId]
                }
            }
        });
        if (!conversation) {
            conversation = yield db_1.prisma.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId, receiverId]
                    }
                }
            });
        }
        const newMessage = yield db_1.prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id
            }
        });
        if (newMessage) {
            conversation = yield db_1.prisma.conversation.update({
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
        const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
        if (receiverSocketId) {
            socket_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ error: "Internal server Error." });
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Am i here');
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;
        console.log('senderId .....', senderId);
        const conversation = yield db_1.prisma.conversation.findFirst({
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
        });
        if (!conversation) {
            return res.status(200).json([]);
        }
        return res.status(200).json(conversation.messages);
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ error: "Internal server Error." });
    }
});
exports.getMessages = getMessages;
const getUsersForSideBar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        console.log('getUsersForSideBar', exports.getUsersForSideBar);
        const users = yield db_1.prisma.user.findMany({
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
        });
        console.log('users', users);
        res.status(200).json(users);
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ error: "Internal server Error." });
    }
});
exports.getUsersForSideBar = getUsersForSideBar;
