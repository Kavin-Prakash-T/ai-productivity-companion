import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY || "";

const groq = new Groq({
    apiKey,
});

export const GROQ_MODEL = "groq/compound";

export default groq;