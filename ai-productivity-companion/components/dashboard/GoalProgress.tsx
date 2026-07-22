export default function GoalProgress() {
    return (
        <div className="rounded-2xl border bg-white p-6">

            <h2 className="text-xl font-semibold">
                Goal Progress
            </h2>

            <div className="mt-6">

                <div className="mb-2 flex justify-between">

                    <span>75%</span>

                    <span>3 / 4 Goals</span>

                </div>

                <div className="h-3 rounded-full bg-gray-200">

                    <div className="h-3 w-3/4 rounded-full bg-black"></div>

                </div>

            </div>

        </div>
    );
}