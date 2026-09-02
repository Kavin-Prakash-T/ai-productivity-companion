export function parseAiJson<T>(content: string | null): T {
    if (!content) {
        throw new Error("AI returned an empty response");
    }

    // Strip thinking blocks <think>...</think> if present
    let cleaned = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    // Strip markdown code fences
    cleaned = cleaned
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "")
        .trim();

    try {
        return JSON.parse(cleaned) as T;
    } catch {
        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");
        const firstBracket = cleaned.indexOf("[");
        const lastBracket = cleaned.lastIndexOf("]");

        let start = -1;
        let end = -1;

        if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
            start = firstBrace;
            end = lastBrace;
        } else if (firstBracket !== -1) {
            start = firstBracket;
            end = lastBracket;
        }

        if (start !== -1 && end !== -1 && end > start) {
            const jsonSub = cleaned.substring(start, end + 1);
            return JSON.parse(jsonSub) as T;
        }

        throw new Error(`Failed to parse AI JSON response`);
    }
}