import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const GROQ_MODEL = "groq/compound";

export default groq;