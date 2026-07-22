import EditTaskForm from "@/components/tasks/EditTaskForm";

export default async function EditTaskPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <EditTaskForm id={id} />;
}