import GoalForm from "@/components/goals/GoalForm";

export default async function EditGoalPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <GoalForm id={id} />;
}
