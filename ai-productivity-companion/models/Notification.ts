import mongoose, {
    Model,
    Schema,
    Types,
} from "mongoose";

export type NotificationType =
    | "task-reminder"
    | "calendar-reminder"
    | "habit-reminder"
    | "goal-update"
    | "ai-recommendation"
    | "system";

export interface INotification {
    user: Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    relatedTask?: Types.ObjectId;
    relatedGoal?: Types.ObjectId;
    relatedHabit?: Types.ObjectId;
    relatedCalendarEvent?: Types.ObjectId;
    actionUrl?: string;
    isRead: boolean;
    pushSent: boolean;
    pushSentAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const notificationSchema =
    new Schema<INotification>(
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
                index: true,
            },

            type: {
                type: String,
                enum: [
                    "task-reminder",
                    "calendar-reminder",
                    "habit-reminder",
                    "goal-update",
                    "ai-recommendation",
                    "system",
                ],
                required: true,
            },

            title: {
                type: String,
                required: true,
                trim: true,
                maxlength: 150,
            },

            message: {
                type: String,
                required: true,
                trim: true,
                maxlength: 500,
            },

            relatedTask: {
                type: Schema.Types.ObjectId,
                ref: "Task",
            },

            relatedGoal: {
                type: Schema.Types.ObjectId,
                ref: "Goal",
            },

            relatedHabit: {
                type: Schema.Types.ObjectId,
                ref: "Habit",
            },

            relatedCalendarEvent: {
                type: Schema.Types.ObjectId,
                ref: "CalendarEvent",
            },

            actionUrl: {
                type: String,
            },

            isRead: {
                type: Boolean,
                default: false,
            },

            pushSent: {
                type: Boolean,
                default: false,
            },

            pushSentAt: {
                type: Date,
            },
        },
        {
            timestamps: true,
        }
    );

notificationSchema.index({
    user: 1,
    createdAt: -1,
});

notificationSchema.index({
    user: 1,
    isRead: 1,
});

const Notification: Model<INotification> =
    mongoose.models.Notification ||
    mongoose.model<INotification>(
        "Notification",
        notificationSchema
    );

export default Notification;