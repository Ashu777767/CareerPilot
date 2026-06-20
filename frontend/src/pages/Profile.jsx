import { useState, useEffect } from "react";

export default function Profile() {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    try {
      const storedAnalysis = localStorage.getItem("analysisResult");
      if (storedAnalysis) {
        setAnalysis(JSON.parse(storedAnalysis));
      }
    } catch (error) {
      console.error("Error parsing analysis result from localStorage:", error);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your career preferences and view progress.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto flex items-center justify-center text-indigo-600 text-3xl font-extrabold mb-4 shadow-sm">
              CU
            </div>
            <h2 className="text-xl font-bold text-slate-800">CareerPilot User</h2>
            <p className="text-sm text-slate-500 mb-6">Resume Analysis Account</p>
            <button className="w-full bg-slate-50 text-slate-700 py-2 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-100 transition-colors">
              Edit Profile
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
               <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               Career Preferences
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-slate-500 font-semibold mb-1">Target Role</p>
                <p className="font-bold text-slate-800">Full Stack Developer</p>
              </div>
              <div>
                <p className="text-slate-500 font-semibold mb-1">Experience Level</p>
                <p className="font-bold text-slate-800">Entry Level (0-2 years)</p>
              </div>
              <div>
                <p className="text-slate-500 font-semibold mb-1">Preferred Location</p>
                <p className="font-bold text-slate-800">Remote / Bangalore</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm text-center">
               <div className="text-3xl font-extrabold text-blue-600 mb-1">{analysis ? 1 : 0}</div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resumes Analyzed</p>
             </div>
             <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm text-center">
               <div className="text-3xl font-extrabold text-indigo-600 mb-1">{analysis ? 1 : 0}</div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mock Interviews</p>
             </div>
             <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm text-center">
               <div className="text-3xl font-extrabold text-emerald-600 mb-1">{analysis?.atsScore || 0}</div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latest ATS Score</p>
             </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4">Resume History</h3>
            <div className="space-y-4">
              {analysis ? (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-500">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Latest Resume Analysis</p>
                      <p className="text-xs text-slate-400">Generated using Gemini AI</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-indigo-600">ATS: {analysis.atsScore}%</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 py-2">No Resume Analysis Found</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4">Recent Interview Performance</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-bold text-slate-800">AI Interview Coach</p>
                   <p className="text-xs text-slate-500">Powered by Groq AI</p>
                 </div>
                 <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">Active</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}