import { User } from "src/entity/User";
import {sign, verify} from 'jsonwebtoken'
import { MiddlewareFn } from "type-graphql";
import { Context } from "../interfaces";
import { Response } from "express";

export const generateToken = (user: any) => {
    return sign({userId: user.userId}, process.env.ACCESS_TOKEN!, {
        expiresIn: "15m"
    })
};


export const verifyToken = (token: string) => {
    return verify(token,process.env.REFRESH_TOKEN! )
}

export const refreshToken = (user: User) => {
    return sign({userId: user.userId, tokenVersion: user.tokenVersion}, process.env.REFRESH_TOKEN!, {expiresIn: "7d"}), {
        httpOnly: true
    }
}

export const sendRefreshToken = (res: Response, token: string | object) => {
    res.cookie("dolwhId", token, {
        httpOnly: true
    })
}


export const queryAuthorization: MiddlewareFn<Context> = ({context}, next) => {
    const authorization = context.req.headers['authorization']

    if (!authorization){
        throw new Error('Not Authenticated')
    }

    try {
        const token = authorization.split(' ')[1]
        const payload = verify(token, authorization)
        context.payload = payload as any
    } catch (error) {
    throw new Error(error.message)
    }
    return next()
}