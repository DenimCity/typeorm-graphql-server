import { User } from "src/entity/User";
import {sign, verify} from 'jsonwebtoken'
import { MiddlewareFn } from "type-graphql";
import { Context } from "src/interfaces";

export const generateToken = (user: User) => {
    return sign({userId: user.userId}, process.env.ACCESS_SECRENT!, {
        expiresIn: "15m"
    })
};


export const refreshToken = (user: User) => {
    return sign({userId: user.userId}, process.env.REFRESH_SECRENT!, {expiresIn: "7d"}), {
        httpOnly: true
    }
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