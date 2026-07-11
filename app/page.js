"use client";

import { useState } from "react";
import CaptionForm from "../components/CaptionForm";
import CaptionResults from "../components/CaptionResults";

export default function Home() {
  const [captions, setCaptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (description, tone) => {
    setIsLoading(true);
    setError("");
    setCaptions([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, tone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate captions.");
      }

      setCaptions(data.captions);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Social Caption Generator</h1>
        <p>Generate engaging social media captions powered by AI.</p>
      </header>

      <main className="app-main">
        <section className="form-section glass-panel">
          <CaptionForm onGenerate={handleGenerate} isLoading={isLoading} />
        </section>

        <section className="results-section">
          {error && <div className="error-message">{error}</div>}
          <CaptionResults captions={captions} />
        </section>
      </main>

      <footer className="app-footer">
        <p>Qodex Software Internship Task</p>
      </footer>
    </div>
  );
}
