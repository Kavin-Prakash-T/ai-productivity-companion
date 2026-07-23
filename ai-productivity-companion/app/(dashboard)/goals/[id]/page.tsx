import GoalDetails from "@/components/goals/GoalDetails";

export default async function GoalDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <GoalDetails id={id} />;
}
