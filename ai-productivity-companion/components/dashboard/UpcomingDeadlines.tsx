const deadlines = [
    "Project Submission",
    "Interview Preparation",
    "Assignment Review",
];

export default function UpcomingDeadlines() {
    return (
        <div className="rounded-2xl border bg-white p-6">

            <h2 className="mb-5 text-xl font-semibold">
                Upcoming Deadlines
            </h2>

            <div className="space-y-4">

                {deadlines.map((deadline) => (

                    <div
                        key={deadline}
                        className="rounded-xl border p-4"
                    >
                        {deadline}
                    </div>

                ))}

            </div>

        </div>
    );
}