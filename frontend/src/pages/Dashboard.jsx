import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Helper function to decode JWT securely
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({ email: "", name: "" });
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = parseJwt(token);
    let userEmail = "unknown_user";
    let userName = "User";

    if (decoded) {
      userEmail = decoded.sub || decoded.email || "unknown_user";
      userName = decoded.name || userEmail.split('@')[0] || "User";
    }

    setUser({ email: userEmail, name: userName });

    // Load user-specific analysis
    const savedAnalysis = localStorage.getItem(`analysis_${userEmail}`);
    if (savedAnalysis) {
      setAnalysis(JSON.parse(savedAnalysis));
    } else {
      setAnalysis({
        atsScore: 0,
        strengths: [],
        weaknesses: [],
        missingSkills: [],
        recommendations: []
      });
    }
  }, [navigate]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAnalysis(response.data);

      // Save analysis specifically for this user
      if (user.email) {
        localStorage.setItem(
          `analysis_${user.email}`,
          JSON.stringify(response.data)
        );
      }

      navigate("/resume-analysis");
    } catch (error) {
      console.error(error);
      alert("Upload Failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Optionally clean up session storage if utilized
    navigate("/login");
  };

  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : "U";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-3xl p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-4 backdrop-blur-sm">
            WELCOME BACK 👋
          </span>
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Build Your Career With AI</h1>
          <p className="text-indigo-100 mb-6 font-medium">Upload your resume and get instant insights to land your dream job faster.</p>

          <div className="flex flex-wrap gap-6 text-sm font-medium">
            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full border-2 border-white/40 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div> ATS Analysis</div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full border-2 border-white/40 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div> Skill Gap Detection</div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full border-2 border-white/40 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div> AI Career Roadmap</div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full border-2 border-white/40 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div> Interview Preparation</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <div className="text-slate-500 text-sm font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
            ATS Score
          </div>
          <div className="text-3xl font-extrabold text-slate-800">{analysis?.atsScore || 0}%</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <div className="text-slate-500 text-sm font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></div>
            Skill Match
          </div>
          <div className="text-lg font-bold text-slate-400 italic">Coming Soon</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <div className="text-slate-500 text-sm font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
            Missing Skills
          </div>
          <div className="text-3xl font-extrabold text-slate-800">{analysis?.missingSkills?.length || 0}</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <div className="text-slate-500 text-sm font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
            Interview Readiness
          </div>
          <div className="text-lg font-bold text-slate-400 italic">Coming Soon</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Upload Resume */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-1">Upload Resume</h2>
            <p className="text-sm text-slate-500 mb-6">Upload your resume PDF and receive AI-powered analysis.</p>

            <label className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer mb-6 block">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 mx-auto">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </div>
              <p className="font-semibold text-slate-800 mb-1 text-center">
                {file ? file.name : "Click to browse or drag PDF here"}
              </p>
              <p className="text-xs text-slate-400 text-center">Max file size: 5MB</p>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>

            <button
              onClick={handleUpload}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors text-sm w-full md:w-auto"
            >
              Upload Resume
            </button>
          </div>

          {/* Resume Analysis Overview */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-1">Resume Analysis Summary</h2>
                <p className="text-sm text-slate-500">Quick breakdown of your current resume.</p>
              </div>
              <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold border border-indigo-100">
                ATS: {analysis?.atsScore || 0}%
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Top Strengths
                </h3>
                <ul className="space-y-2 text-sm text-emerald-700">
                  {analysis?.strengths && analysis.strengths.length > 0 ? (
                    analysis.strengths.slice(0, 2).map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-0.5">•</span> <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="italic text-emerald-600/70">
                      {analysis?.atsScore > 0 ? "No strengths detected." : "Upload a resume to generate analysis."}
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                <h3 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Top Weaknesses
                </h3>
                <ul className="space-y-2 text-sm text-red-700">
                  {analysis?.weaknesses && analysis.weaknesses.length > 0 ? (
                    analysis.weaknesses.slice(0, 2).map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-0.5">•</span> <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="italic text-red-600/70">
                      {analysis?.atsScore > 0 ? "No weaknesses detected." : "Upload a resume to generate analysis."}
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <Link to="/resume-analysis" className="block w-full text-center bg-indigo-50 text-indigo-700 py-3 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">
              View Full Analysis
            </Link>
          </div>

          {/* Career Roadmap Overview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-3">Career Roadmap</h2>
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs text-slate-400 font-bold mb-1">CURRENT STAGE</p>
                  <p className="font-semibold text-slate-500 text-sm italic">Coming Soon</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold mb-1">NEXT MILESTONE</p>
                  <p className="font-semibold text-slate-500 text-sm italic">Coming Soon</p>
                </div>
              </div>
            </div>
            <Link to="/career-roadmap" className="bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors shrink-0">
              View Full Roadmap
            </Link>
          </div>

        </div>

        <div className="space-y-6">

          {/* Profile Quick Summary */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto flex items-center justify-center text-indigo-600 text-xl font-extrabold mb-3 shadow-sm">
              {getInitials(user.name)}
            </div>
            <h2 className="text-lg font-bold text-slate-800">{user.name || "Profile Setup Coming Soon"}</h2>
            <p className="text-sm font-medium text-slate-500 mb-4">ATS Score: <span className="font-bold text-indigo-600">{analysis?.atsScore || 0}%</span></p>
            <p className="text-xs text-slate-400 mb-6 px-4">
              Update your profile to get personalized AI career recommendations.
            </p>
            <Link to="/profile" className="block w-full bg-slate-50 text-slate-700 py-2.5 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-100 transition-colors mb-2">
              View Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full bg-white text-red-600 py-2.5 rounded-xl font-bold text-sm border border-red-100 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* AI Interview Coach Quick Access */}
          <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-sm">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <h2 className="text-xl font-bold mb-2">AI Interview Coach</h2>
            <p className="text-indigo-200 text-sm mb-6">Practice tailored questions based on your skill gaps.</p>
            <div className="space-y-2 mb-6">
              <div className="bg-white/10 p-3 rounded-xl text-sm border border-white/5 text-indigo-100 italic text-center">
                Questions Coming Soon
              </div>
            </div>
            <Link to="/interview-prep" className="block text-center w-full bg-white text-indigo-900 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
              Open Interview Prep
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
            </div>
            <div className="relative pl-4 space-y-6 border-l-2 border-slate-100">
              <p className="text-sm italic text-slate-400 mb-2">No activity available yet.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}