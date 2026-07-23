import HabitDetails from "@/components/habits/HabitDetails";

export default async function HabitDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <HabitDetails id={id} />;
}
