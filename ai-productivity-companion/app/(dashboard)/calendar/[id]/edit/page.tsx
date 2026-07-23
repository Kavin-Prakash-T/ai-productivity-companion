import EventForm from "@/components/calendar/EventForm";

export default async function EditEventPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <EventForm id={id} />;
}
