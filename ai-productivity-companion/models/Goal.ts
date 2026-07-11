import mongoose, { Model, Schema, Types } from "mongoose";

export type GoalStatus =
    | "not-started"
    | "in-progress"
    | "completed"
    | "cancelled";

export interface IGoal {
    user: Types.ObjectId;
    title: string;
    description?: string;
    category?: string;
    targetDate?: Date;
    progress: number;
    status: GoalStatus;
    completedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const goalSchema = new Schema<IGoal>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: [true, "Goal title is required"],
            trim: true,
            maxlength: 150,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000,
        },

        category: {
            type: String,
            trim: true,
            default: "Personal",
        },

        targetDate: {
            type: Date,
        },

        progress: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },

        status: {
            type: String,
            enum: [
                "not-started",
                "in-progress",
                "completed",
                "cancelled",
            ],
            default: "not-started",
        },

        completedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

goalSchema.index({ user: 1, status: 1 });
goalSchema.index({ user: 1, targetDate: 1 });

const Goal: Model<IGoal> =
    mongoose.models.Goal ||
    mongoose.model<IGoal>("Goal", goalSchema);

export default Goal;