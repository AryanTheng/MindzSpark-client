import React from 'react';

const MindzsparkStories = () => (
  <div className="min-h-[70vh] bg-gray-100 py-8 px-2 md:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900 flex items-center gap-2">
        <span role="img" aria-label="star">🌟</span> MindzSpark: Simplifying Careers
      </h1>
      <h2 className="text-xl font-semibold mb-4 text-blue-800">A 3-Pillar Model:</h2>
      {/* Pillar 1 */}
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
          <span role="img" aria-label="book">📘</span> 1. Stories from Notes (Motivation + Study Hacks)
        </h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-2">
          <li>Real student experiences (before & after CET).</li>
          <li>Handwritten study notes with story behind them.</li>
          <li>Study methods that worked.</li>
          <li>"One mistake I made" mini reels.</li>
          <li>"Notebook to Merit List" success stories.</li>
        </ul>
        <div className="italic text-gray-600 mb-2">Purpose: Build trust, emotional connect, and engagement.</div>
      </section>
      {/* Pillar 2 */}
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
          <span role="img" aria-label="target">🎯</span> 2. Counseling Now (Admission Guidance)
        </h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-2">
          <li>Personalized CAP Round preference lists.</li>
          <li>Category/branch-wise cutoff prediction.</li>
          <li>Google Form submissions → WhatsApp follow-up.</li>
          <li>MHT-CET, JEE, Polytechnic, Diploma counseling.</li>
          <li>Free vs Paid Plan comparison.</li>
        </ul>
        <div className="italic text-gray-600 mb-2">Purpose: Your main service — conversions happen here.</div>
      </section>
      {/* Pillar 3 */}
      <section>
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
          <span role="img" aria-label="shop">🛍️</span> 3. Shop (Digital + Physical Products)
        </h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-2">
          <li>Notes PDFs (Standard 11–12, MHT-CET toppers).</li>
          <li>CAP Round Tracker Excel Sheets.</li>
          <li>Personalized Printables (Timetables, Study Planners).</li>
          <li>MindzSpark Merch (T-shirts, Stickers, Tote Bags with exam memes).</li>
          <li>Mini eBooks like "50 CET Tips from Toppers".</li>
        </ul>
        <div className="italic text-gray-600 mb-2">Purpose: Digital & physical resources for students and aspirants.</div>
      </section>
    </div>
  </div>
);

export default MindzsparkStories; 