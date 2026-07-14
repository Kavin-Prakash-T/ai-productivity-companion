import {
    applicationDefault,
    cert,
    getApps,
    initializeApp,
} from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

function getFirebaseAdminApp() {
    const existingApp = getApps()[0];

    if (existingApp) {
        return existingApp;
    }

    const projectId =
        process.env.FIREBASE_ADMIN_PROJECT_ID;

    const clientEmail =
        process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

    const privateKey =
        process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
            /\\n/g,
            "\n"
        );

    if (projectId && clientEmail && privateKey) {
        return initializeApp({
            credential: cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
    }

    return initializeApp({
        credential: applicationDefault(),
    });
}

const firebaseAdminApp = getFirebaseAdminApp();

export const firebaseMessaging =
    getMessaging(firebaseAdminApp);