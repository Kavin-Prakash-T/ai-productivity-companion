import TaskDetails from "@/components/tasks/TaskDetails";

export default async function TaskDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <TaskDetails id={id} />;
}