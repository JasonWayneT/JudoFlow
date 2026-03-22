import * as FileSystem from 'expo-file-system';

// If no key is provided, the mock will just return dummy text
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

export const transcriptionService = {
    async transcribeAudio(uri: string): Promise<string> {
        if (!OPENAI_API_KEY) {
            console.warn("No OpenAI API Key found. Using mock transcription.");
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            return "I practiced Uchi-mata today and noticed I was leaning too far forward on my entry. My focus for next class is squaring up my hips. The randori was tough, I'd say an 8 out of 10 effort.";
        }

        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) {
                throw new Error('Audio file does not exist');
            }

            // Prepare form data
            const formData = new FormData();
            formData.append('file', {
                uri,
                name: 'recording.m4a',
                type: 'audio/m4a',
            } as any);
            formData.append('model', 'whisper-1');
            formData.append('language', 'en'); // User is speaking English mostly

            // Inject judo terms to improve first-pass accuracy
            const prompt = "Judoka reflecting on a session. Techniques might include Seoi-nage, Uchi-mata, O-soto-gari, Tai-otoshi, Tomoe-nage, Randori, Uchi-komi. Mentions the Golden Three: learned, mistake, next focus, and RPE.";
            formData.append('prompt', prompt);

            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            return data.text;

        } catch (err) {
            console.error('Transcription failed:', err);
            throw err;
        }
    }
};
