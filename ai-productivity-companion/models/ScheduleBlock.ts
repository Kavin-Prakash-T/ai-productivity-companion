import mongoose, { Model, Schema, Types } from "mongoose";

export type ScheduleBlockStatus =
    | "scheduled"
    | "in-progress"
    | "completed"
    | "missed"
    | "cancelled";

export interface IScheduleBlock {
    user: Types.ObjectId;
    task: Types.ObjectId;
    title: string;
    startTime: Date;
    endTime: Date;
    durationMinutes: number;
    status: ScheduleBlockStatus;
    aiGenerated: boolean;
    notes?: string;
    completedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const scheduleBlockSchema = new Schema<IScheduleBlock>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        task: {
            type: Schema.Types.ObjectId,
            ref: "Task",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        startTime: {
            type: Date,
            required: true,
        },

        endTime: {
            type: Date,
            required: true,
        },

        durationMinutes: {
            type: Number,
            required: true,
            min: 1,
        },

        status: {
            type: String,
            enum: [
                "scheduled",
                "in-progress",
                "completed",
                "missed",
                "cancelled",
            ],
            default: "scheduled",
        },

        aiGenerated: {
            type: Boolean,
            default: false,
        },

        notes: {
            type: String,
            trim: true,
            maxlength: 500,
        },

        completedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

scheduleBlockSchema.index({
    user: 1,
    startTime: 1,
    endTime: 1,
});

const ScheduleBlock: Model<IScheduleBlock> =
    mongoose.models.ScheduleBlock ||
    mongoose.model<IScheduleBlock>(
        "ScheduleBlock",
        scheduleBlockSchema
    );

export default ScheduleBlock;