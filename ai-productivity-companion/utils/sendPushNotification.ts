import { firebaseMessaging } from "@/lib/firebaseAdmin";

type PushNotificationParams = {
    tokens: string[];
    title: string;
    body: string;
    actionUrl?: string;
};

export type PushNotificationResult = {
    successCount: number;
    failureCount: number;
    invalidTokens: string[];
};

export async function sendPushNotification({
    tokens,
    title,
    body,
    actionUrl = "/dashboard",
}: PushNotificationParams): Promise<PushNotificationResult> {
    const uniqueTokens = [...new Set(tokens)].filter(
        Boolean
    );

    if (uniqueTokens.length === 0) {
        return {
            successCount: 0,
            failureCount: 0,
            invalidTokens: [],
        };
    }

    const response =
        await firebaseMessaging.sendEachForMulticast({
            tokens: uniqueTokens,

            notification: {
                title,
                body,
            },

            data: {
                actionUrl,
            },

            webpush: {
                fcmOptions: {
                    link: actionUrl,
                },

                notification: {
                    icon: "/icons/icon-192x192.png",
                    badge: "/icons/badge-72x72.png",
                },
            },
        });

    const invalidTokens: string[] = [];

    response.responses.forEach(
        (result, index) => {
            if (result.success) {
                return;
            }

            const errorCode = result.error?.code;

            if (
                errorCode ===
                "messaging/registration-token-not-registered" ||
                errorCode ===
                "messaging/invalid-registration-token"
            ) {
                invalidTokens.push(uniqueTokens[index]);
            }
        }
    );

    return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        invalidTokens,
    };
}