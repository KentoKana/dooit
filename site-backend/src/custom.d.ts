declare namespace Express {
    export interface User {
        user_id: string;
        email: string;
        iss: string,
        aud: string,
        auth_time: number,
        user_id: string,
        sub: string,
        iat: number,
        exp: number,
        email: string,
        email_verified: false,
        firebase: { identities: { email: [] }, sign_in_provider: string }
    }
}