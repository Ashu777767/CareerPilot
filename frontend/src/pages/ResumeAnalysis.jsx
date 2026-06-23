import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ResumeAnalysis() {
  const [analysis, setAnalysis] = useState({
    atsScore: 0,
    strengths: [],
    weaknesses: [],
    missingSkills: [],
    recommendations: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/analysis/latest", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Update state with backend data
        setAnalysis(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching analysis:", err);
        setError("Failed to load resume analysis. Please ensure you are logged in and try again.");
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-10 text-center">
        <p className="text-slate-500 font-medium animate-pulse">Loading AI Resume Analysis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto mt-10 text-center">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl border border-red-100 inline-block font-medium">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">AI Resume Analysis</h1>
          <p className="text-slate-500 mt-1">Detailed breakdown of your resume against industry standards.</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold border border-indigo-100">
          ATS Score: {analysis?.atsScore || 0}%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-lg font-bold text-emerald-800">Strengths</h2>
          </div>
          <ul className="space-y-3 text-sm text-emerald-700">
           {
  analysis.strengths?.map((item, index) => (
    <li key={index} className="flex items-start gap-2">
      <span className="mt-1">•</span>
      {item}
    </li>
  ))
}
          </ul>
        </div>

        <div className="bg-red-50 rounded-3xl p-6 border border-red-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h2 className="text-lg font-bold text-red-800">Weaknesses</h2>
          </div>
          <ul className="space-y-3 text-sm text-red-700">
            {
  analysis.weaknesses?.map((item, index) => (
    <li key={index} className="flex items-start gap-2">
      <span className="mt-1">•</span>
      {item}
    </li>
  ))
}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Skill Gap Analysis</h2>
        <p className="text-sm font-semibold text-slate-600 mb-3">Missing Skills Detected:</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {analysis.missingSkills?.map((skill, index) => (
  <span
    key={index}
    className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium"
  >
    {skill}
  </span>
))}
        </div>

        <p className="text-sm font-semibold text-slate-600 mb-3">Recommended Learning Order:</p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold">1. Docker</span>
          <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold">2. AWS</span>
          <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold">3. Microservices</span>
          <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold">4. Kubernetes</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Improvement Suggestions</h2>
        <div className="space-y-4">
        {analysis.recommendations?.map((item, index) => (
    <div
      key={index}
      className="p-4 bg-slate-50 rounded-2xl border border-slate-100"
    >
      <p className="text-sm text-slate-600">{item}</p>
    </div>
  ))}
        </div>
      </div>
    </div>
  );
}