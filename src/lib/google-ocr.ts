import spread from 'google-gax'; // Used internally by @google-cloud/vision
import vision from '@google-cloud/vision';

// Initialize the client.
// Relies on GOOGLE_APPLICATION_CREDENTIALS environment variable or default credentials.
const client = new vision.ImageAnnotatorClient();

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
