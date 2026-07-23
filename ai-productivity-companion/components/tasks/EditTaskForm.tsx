"use client";

import TaskForm from "./TaskForm";

interface Props {
    id: string;
}

export default function EditTaskForm({ id }: Props) {
    return <TaskForm id={id} />;
}
