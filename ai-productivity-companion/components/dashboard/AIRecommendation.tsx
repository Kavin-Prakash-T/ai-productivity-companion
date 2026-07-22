import { Sparkles } from "lucide-react";

export default function AIRecommendation() {
    return (
        <div className="rounded-2xl border bg-white p-6">

            <div className="mb-4 flex items-center gap-2">

                <Sparkles size={22} />

                <h2 className="text-xl font-semibold">
                    AI Recommendation
                </h2>

            </div>

            <p className="text-gray-600 leading-7">

                Complete your highest priority task before
                2 PM to increase your productivity score.

            </p>

        </div>
    );
}