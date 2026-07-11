
import mongoose, { Model, Schema, Types } from "mongoose";

export type HabitFrequency = "daily" | "weekly";

export interface IHabitLog {
    date: string;
    completedAt: Date;
}

export interface IHabit {
    user: Types.ObjectId;
    title: string;
    description?: string;
    category: string;
    frequency: HabitFrequency;
    targetDays: number[];
    reminderEnabled: boolean;
    reminderTime?: string;
    currentStreak: number;
    longestStreak: number;
    totalCompletions: number;
    completionLogs: IHabitLog[];
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const habitLogSchema = new Schema<IHabitLog>(
    {
        date: {
            type: String,
            required: true,
        },

        completedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: false,
    }
);

const habitSchema = new Schema<IHabit>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: [true, "Habit title is required"],
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

        frequency: {
            type: String,
            enum: ["daily", "weekly"],
            default: "daily",
        },

        targetDays: {
            type: [Number],
            default: [],
            validate: {
                validator(days: number[]) {
                    return days.every((day) => day >= 0 && day <= 6);
                },
                message: "Target days must be between 0 and 6",
            },
        },

        reminderEnabled: {
            type: Boolean,
            default: false,
        },

        reminderTime: {
            type: String,
        },

        currentStreak: {
            type: Number,
            default: 0,
            min: 0,
        },

        longestStreak: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalCompletions: {
            type: Number,
            default: 0,
            min: 0,
        },

        completionLogs: {
            type: [habitLogSchema],
            default: [],
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

habitSchema.index({ user: 1, isActive: 1 });
habitSchema.index({ user: 1, category: 1 });

const Habit: Model<IHabit> =
    mongoose.models.Habit ||
    mongoose.model<IHabit>("Habit", habitSchema);

export default Habit;