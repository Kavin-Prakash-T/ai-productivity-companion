import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY || "";

const groq = new Groq({
    apiKey,
});

export const GROQ_MODEL = "llama-3.1-8b-instant";

export default groq;