"use client";

import { useState } from 'react';

export default function CaptionResults({ captions }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!captions || captions.length === 0) {
    return null;
  }

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="caption-results">
      <h2>Generated Captions</h2>
      <div className="results-list">
        {captions.map((caption, index) => (
          <div key={index} className="caption-card">
            <p className="caption-text">{caption}</p>
            <button 
              className={`copy-button ${copiedIndex === index ? 'copied' : ''}`}
              onClick={() => handleCopy(caption, index)}
              title="Copy to clipboard"
            >
              {copiedIndex === index ? 'Copied!' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
