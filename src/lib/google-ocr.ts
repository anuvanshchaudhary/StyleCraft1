import spread from 'google-gax'; // Used internally by @google-cloud/vision
import vision from '@google-cloud/vision';

// function to initialize the vision client
const getClient = () => {
    // Check for environment variable strings (Vercel/Production)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        try {
            const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
            return new vision.ImageAnnotatorClient({ credentials });
        } catch (error) {
            console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON", error);
        }
    }

    // Fallback to local file (Development) if GOOGLE_APPLICATION_CREDENTIALS is set,
    // or allow the default auto-discovery.
    return new vision.ImageAnnotatorClient();
};

const client = getClient();

export async function extractTextFromImage(base64Image: string): Promise<string> {
    try {
        // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const [result] = await client.textDetection(buffer);
        const detections = result.textAnnotations;

        if (!detections || detections.length === 0) {
            return "";
        }

        // The first annotation is the full text
        return detections[0].description || "";
    } catch (error) {
        console.error("Google Vision API Error:", error);
        throw new Error("Failed to process image with Vision API.");
    }
}
