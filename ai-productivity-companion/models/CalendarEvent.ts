import mongoose, { Model, Schema, Types } from "mongoose";

export type CalendarEventType =
    | "meeting"
    | "interview"
    | "class"
    | "appointment"
    | "personal"
    | "other";

export interface ICalendarEvent {
    user: Types.ObjectId;
    title: string;
    description?: string;
    type: CalendarEventType;
    startTime: Date;
    endTime: Date;
    location?: string;
    allDay: boolean;
    reminderEnabled: boolean;
    reminderMinutesBefore?: number;
    reminderSent: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const calendarEventSchema = new Schema<ICalendarEvent>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: [true, "Event title is required"],
            trim: true,
            maxlength: 150,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000,
        },

        type: {
            type: String,
            enum: [
                "meeting",
                "interview",
                "class",
                "appointment",
                "personal",
                "other",
            ],
            default: "other",
        },

        startTime: {
            type: Date,
            required: true,
        },

        endTime: {
            type: Date,
            required: true,
        },

        location: {
            type: String,
            trim: true,
        },

        allDay: {
            type: Boolean,
            default: false,
        },

        reminderEnabled: {
            type: Boolean,
            default: false,
        },

        reminderMinutesBefore: {
            type: Number,
            min: 0,
            max: 10080,
        },

        reminderSent: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

calendarEventSchema.index({
    user: 1,
    startTime: 1,
    endTime: 1,
});

const CalendarEvent: Model<ICalendarEvent> =
    mongoose.models.CalendarEvent ||
    mongoose.model<ICalendarEvent>(
        "CalendarEvent",
        calendarEventSchema
    );

export default CalendarEvent;