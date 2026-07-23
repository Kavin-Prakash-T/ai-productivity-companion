import HabitForm from "@/components/habits/HabitForm";

export default async function EditHabitPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <HabitForm id={id} />;
}
