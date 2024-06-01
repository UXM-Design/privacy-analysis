import axios from "axios";
import cheerio from "cheerio";

interface AnalysisCriteria {
  validUrl: boolean;
  includesEntityName: boolean;
  labeledPrivacyPolicy: boolean;
  includesContact: boolean;
  readable: boolean;
  nonEditable: boolean;
  dataCollectionDisclosure: boolean;
  dataSecurity: boolean;
  dataRetentionDeletion: boolean;
}

interface AnalysisResult {
  success: boolean;
  criteria?: AnalysisCriteria;
  suggestions?: string[];
  error?: string;
  score?: number;
}

export const analyzePrivacyPolicy = async (
  url: string
): Promise<AnalysisResult> => {
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // You may need to add more configurations if your request requires it
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const criteria: AnalysisCriteria = {
      validUrl: true,
      includesEntityName: /developer|company|entity/i.test(html),
      labeledPrivacyPolicy: /privacy\s+policy/i.test(html),
      includesContact: /contact/i.test(html),
      readable: true,
      nonEditable: true,
      dataCollectionDisclosure: /data\s+collection|data\s+sharing/i.test(html),
      dataSecurity: /data\s+security|secure\s+handling/i.test(html),
      dataRetentionDeletion: /data\s+retention|data\s+deletion/i.test(html),
    };

    const suggestions: string[] = [];
    let score = 0;
    for (const [key, value] of Object.entries(criteria)) {
      if (!value) {
        suggestions.push(
          `Missing or inadequate: ${key
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()}`
        );
      } else {
        score += 10; // Assign 10 points for each compliant criterion
      }
    }

    return {
      success: true,
      criteria,
      suggestions,
      score,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};
