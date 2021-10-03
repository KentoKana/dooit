import { Injectable } from "@nestjs/common";
import * as firebase from "firebase/app"
import { getAuth } from "firebase/auth";

@Injectable()
export class Firebase {
    constructor() {
    }
    readonly app: firebase.FirebaseApp = firebase.initializeApp({
        apiKey: process.env.FIREBASE_KEY,
        authDomain: process.env.FIREBASE_DOMAIN_KEY,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    });
    readonly auth = getAuth(this.app)
}