export function parseAiJson<T>(content: string | null): T {
    if (!content) {
        throw new Error("AI returned an empty response");
    }

    try {
        return JSON.parse(content) as T;
    } catch {
        const cleanedContent = content
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleanedContent) as T;
    }
}