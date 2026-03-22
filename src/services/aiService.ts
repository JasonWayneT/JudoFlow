import { GoogleGenerativeAI } from '@google/generative-ai';
import { SessionLog } from './storageService';
import judoGlossary from '../../judo_glossary.json';

// If no key is provided, the mock will return dummy data
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export interface NLPResponse {
    summary: string;
    techniquesPracticed: string[];
    goldenThree: {
        learned: string;
        mistake: string;
        nextFocus: string;
    };
    rpe: number;
}

export const aiService = {

    async parseTranscript(transcript: string): Promise<NLPResponse> {
        if (!GEMINI_API_KEY) {
            console.warn("No Gemini API Key found. Using mock NLP parser.");
            await new Promise(resolve => setTimeout(resolve, 1500));
            return {
                summary: "I practiced Uchi-mata today and noticed I was leaning too far forward on my entry. My focus for next class is squaring up my hips. The randori was tough, I'd say an 8 out of 10 effort.",
                techniquesPracticed: ["Uchi-mata"],
                goldenThree: {
                    learned: "Lapel grip control is vital.",
                    mistake: "Leaning too far forward on entry.",
                    nextFocus: "Squaring up hips."
                },
                rpe: 8
            };
        }

        try {
            const prompt = `
        You are an expert Judo coach and data extraction assistant. 
        Read the following transcript of a Judoka reflecting on their training session.
        
        Extract the following information into a strict JSON object:
        1. "summary": A clean, readable 1-2 sentence summary of the session.
        2. "techniquesPracticed": An array of standard Japanese Judo technique names mentioned. ALWAYS correct the spelling to standard Romaji (e.g., "say oh nage" -> "Seoi-nage", "oochie mata" -> "Uchi-mata").
        3. "goldenThree": An object containing exactly three string fields:
           - "learned": A brief note on what they learned or did well.
           - "mistake": A brief note on what they struggled with or did wrong.
           - "nextFocus": A brief, actionable goal for their next session.
        4. "rpe": A number from 1 to 10 estimating the Rating of Perceived Exertion (how hard the session was). If not mentioned, return 5.

        Glossary for correction reference:
        ${JSON.stringify(judoGlossary.map(g => ({ romaji: g.romaji, variants: g.variants })))}

        Transcript:
        "${transcript}"

        Return ONLY the raw JSON object. Do not wrap in markdown or backticks.
      `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            // Clean up potential markdown formatting from the response
            const cleanJsonStr = responseText.replace(/```json\n|\n```|```/g, '').trim();
            return JSON.parse(cleanJsonStr) as NLPResponse;

        } catch (error) {
            console.error("AI Parsing Error", error);
            throw new Error("Failed to parse transcript via Gemini.");
        }
    },

    async generateSafeSenseiPrompt(log: SessionLog): Promise<string> {
        if (!GEMINI_API_KEY) {
            return "Safe Sensei: Have you considered how your grip placement affects your entry angle on Uchi-mata?";
        }

        try {
            const prompt = `
        You are "Safe Sensei", an experienced, Socratic Judo instructor.
        Review the following training log from your student.
        Respond with ONE concise, thought-provoking question (max 20 words) that encourages them to reflect deeper on their 'mistake' or 'nextFocus'. 
        Do NOT give prescriptive advice. Only ask a Socratic question.

        Techniques: ${log.techniquesPracticed.join(', ')}
        Mistake: ${log.goldenThree.mistake}
        Focus for next time: ${log.goldenThree.nextFocus}
      `;

            const result = await model.generateContent(prompt);
            return result.response.text().trim();
        } catch (error) {
            console.error("Safe Sensei Error", error);
            return "Safe Sensei: How will you adjust your approach next time?";
        }
    }

};
