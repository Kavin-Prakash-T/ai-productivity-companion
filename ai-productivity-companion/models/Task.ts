import mongoose, { Model, Schema, Types } from "mongoose";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "missed"
  | "cancelled";

export interface ISubtask {
  _id?: Types.ObjectId;
  title: string;
  completed: boolean;
  createdAt?: Date;
}

export interface ITask {
  user: Types.ObjectId;
  title: string;
  description?: string;
  category?: string;

  priority: TaskPriority;
  status: TaskStatus;

  dueDate?: Date;
  estimatedMinutes?: number;

  subtasks: ISubtask[];

  aiGenerated: boolean;
  priorityScore?: number;

  reminderEnabled: boolean;
  reminderTime?: Date;
  reminderSent: boolean;

  completedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

const subtaskSchema = new Schema<ISubtask>(
  {
    title: {
      type: String,
      required: [true, "Subtask title is required"],
      trim: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const taskSchema = new Schema<ITask>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Task title is required"],
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
      default: "General",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "in-progress",
        "completed",
        "missed",
        "cancelled",
      ],
      default: "pending",
    },

    dueDate: {
      type: Date,
    },

    estimatedMinutes: {
      type: Number,
      min: 1,
    },

    subtasks: {
      type: [subtaskSchema],
      default: [],
    },

    aiGenerated: {
      type: Boolean,
      default: false,
    },

    priorityScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    reminderEnabled: {
      type: Boolean,
      default: false,
    },

    reminderTime: {
      type: Date,
    },

    reminderSent: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, priority: 1 });

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);

export default Task;