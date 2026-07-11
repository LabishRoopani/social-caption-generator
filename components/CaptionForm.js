"use client";

import { useState } from 'react';

const TONES = ['Funny', 'Professional', 'Luxury'];

export default function CaptionForm({ onGenerate, isLoading }) {
  const [description, setDescription] = useState('');
  const [selectedTone, setSelectedTone] = useState(TONES[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    onGenerate(description, selectedTone);
  };

  return (
    <form className="caption-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="description">Product / Service Description</label>
        <textarea
          id="description"
          placeholder="e.g., Premium handmade leather wallet..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          disabled={isLoading}
          required
        />
      </div>

      <div className="form-group">
        <label>Select Tone</label>
        <div className="tone-selector">
          {TONES.map((tone) => (
            <button
              type="button"
              key={tone}
              className={`tone-button ${selectedTone === tone ? 'active' : ''}`}
              onClick={() => setSelectedTone(tone)}
              disabled={isLoading}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      <button 
        type="submit" 
        className="generate-button"
        disabled={isLoading || !description.trim()}
      >
        {isLoading ? (
          <span className="loader">Generating...</span>
        ) : (
          'Generate Captions'
        )}
      </button>
    </form>
  );
}
