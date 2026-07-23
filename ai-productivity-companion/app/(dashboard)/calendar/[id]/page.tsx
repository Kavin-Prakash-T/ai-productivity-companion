import EventDetails from "@/components/calendar/EventDetails";

export default async function EventDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <EventDetails id={id} />;
}
