"use client";
import { useState } from "react";
import { analyzePrivacyPolicy } from "@/utils/analyzePrivacyPolicy";

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

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzePrivacyPolicy(url);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy Analyzer</h1>
      <input
        type="text"
        className="border p-2 w-full mb-4"
        placeholder="Enter Privacy Policy URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        onClick={handleAnalyze}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      {analysis && (
        <div className="mt-4">
          {analysis.success ? (
            <>
              <h2 className="text-xl font-bold mb-2">Analysis Results</h2>
              <p className="text-lg font-semibold">
                Score: {analysis.score} / 90
              </p>
              <ul className="list-disc ml-5 mb-2">
                {analysis.criteria &&
                  Object.entries(analysis.criteria).map(([key, value]) => (
                    <li
                      key={key}
                      className={value ? "text-green-500" : "text-red-500"}
                    >
                      {key.replace(/([A-Z])/g, " $1").toLowerCase()}:{" "}
                      {value ? "Pass" : "Fail"}
                    </li>
                  ))}
              </ul>
              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold">Suggestions</h3>
                  <ul className="list-disc ml-5">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-yellow-500">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <p className="text-red-500">Error: {analysis.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
