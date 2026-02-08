export interface InteractionResult {
    hasInteraction: boolean;
    description: string;
    severity: 'high' | 'medium' | 'low' | 'none';
}

/**
 * Checks for interactions between two drugs using the OpenFDA API.
 * 
 * Strategy:
 * 1. Search for the FDA label of drug A.
 * 2. Check its 'drug_interactions' section for mention of drug B.
 * 3. Search for the FDA label of drug B.
 * 4. Check its 'drug_interactions' section for mention of drug A.
 * 
 * Note: This is a heuristic approach as OpenFDA doesn't have a direct "interaction checker" endpoint.
 */
export async function checkDrugInteractions(drugA: string, drugB: string): Promise<InteractionResult> {
    try {
        const cleanDrugA = drugA.trim();
        const cleanDrugB = drugB.trim();

        if (!cleanDrugA || !cleanDrugB) {
            return { hasInteraction: false, description: "Invalid drug names.", severity: 'none' };
        }

        // Check Drug A's label for Drug B
        const interactionA = await checkLabelForInteraction(cleanDrugA, cleanDrugB);
        if (interactionA.hasInteraction) return interactionA;

        // Check Drug B's label for Drug A (reverse check)
        const interactionB = await checkLabelForInteraction(cleanDrugB, cleanDrugA);
        if (interactionB.hasInteraction) return interactionB;

        return { hasInteraction: false, description: "No interactions found in FDA labels.", severity: 'none' };
    } catch (error) {
        console.error("OpenFDA API Error:", error);
        // Fail safe
        return { hasInteraction: false, description: "Error checking FDA database.", severity: 'none' };
    }
}

async function checkLabelForInteraction(primaryDrug: string, targetDrug: string): Promise<InteractionResult> {
    try {
        // Search for the drug label. We limit to 1 result.
        // Query syntax: search=openfda.brand_name:"DrugName"+OR+openfda.generic_name:"DrugName"
        const query = `openfda.brand_name:"${primaryDrug}"+OR+openfda.generic_name:"${primaryDrug}"`;
        const url = `https://api.fda.gov/drug/label.json?search=${query}&limit=1`;

        const response = await fetch(url);
        if (!response.ok) {
            // If 404, drug not found, so no interaction can be confirmed from this side.
            return { hasInteraction: false, description: "", severity: 'none' };
        }

        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const label = data.results[0];
            const interactions = label.drug_interactions ? label.drug_interactions[0] : "";
            const warnings = label.warnings ? label.warnings[0] : "";
            const boxedWarning = label.boxed_warning ? label.boxed_warning[0] : "";

            const combinedText = `${interactions} ${warnings} ${boxedWarning}`.toLowerCase();
            const targetLower = targetDrug.toLowerCase();

            if (combinedText.includes(targetLower)) {
                // Determine severity (heuristic)
                let severity: 'high' | 'medium' | 'low' = 'medium';
                if (boxedWarning.toLowerCase().includes(targetLower) || combinedText.includes('severe') || combinedText.includes('death')) {
                    severity = 'high';
                }

                // Extract a snippet implementation (simplified)
                const snippet = interactions.substring(0, 200) + "...";

                return {
                    hasInteraction: true,
                    description: `Interaction found in ${primaryDrug} label: ${snippet}`,
                    severity: severity
                };
            }
        }

        return { hasInteraction: false, description: "", severity: 'none' };

    } catch (e) {
        console.error(`Failed to fetch label for ${primaryDrug}`, e);
        return { hasInteraction: false, description: "", severity: 'none' };
    }
}
