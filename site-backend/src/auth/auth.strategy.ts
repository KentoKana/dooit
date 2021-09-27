import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.FIREBASE_SECRET_CERT
        })
    }
    async validate(payload) {
        const user = {
            user_id: payload.user_id,
            email: payload.email
        }
        return user;
    }
}