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
  const [loading, setLoading] = useState(true);

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

    // Fetch analysis from backend API
    const fetchAnalysis = async () => {
      try {
        const response = await axios.get("http://localhost:8080/analysis/latest", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAnalysis(response.data || {
          atsScore: 0,
          strengths: [],
          weaknesses: [],
          missingSkills: [],
          recommendations: []
        });
      } catch (error) {
        console.error("Failed to fetch analysis", error);
        setAnalysis({
          atsScore: 0,
          strengths: [],
          weaknesses: [],
          missingSkills: [],
          recommendations: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
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
      navigate("/resume-analysis");
    } catch (error) {
      console.error(error);
      alert("Upload Failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : "U";
  };

  // Safe data extraction
  const atsScore = analysis?.atsScore || 0;
  const strengths = analysis?.strengths || [];
  const weaknesses = analysis?.weaknesses || [];
  const missingSkills = analysis?.missingSkills || [];
  const recommendationsCount = analysis?.recommendations?.length || 0;
  const missingSkillsCount = missingSkills.length;

  // Derived calculations
  const skillMatch = Math.max(0, Math.min(100, 100 - (missingSkillsCount * 5)));
  const interviewReadiness = Math.max(0, atsScore - (weaknesses.length * 3));

  // ATS Status Logic
  let atsInsight = "Needs Improvement";
  let atsColor = "text-red-600";
  let atsBg = "bg-red-50";
  let atsBar = "bg-red-500";
  
  if (atsScore >= 75) {
    atsInsight = "Strong Resume";
    atsColor = "text-emerald-600";
    atsBg = "bg-emerald-50";
    atsBar = "bg-emerald-500";
  } else if (atsScore >= 50) {
    atsInsight = "Average Resume";
    atsColor = "text-amber-600";
    atsBg = "bg-amber-50";
    atsBar = "bg-amber-500";
  }

  // Interview Readiness Logic
  let readinessLabel = "Beginner";
  if (interviewReadiness >= 75) readinessLabel = "Ready for Interviews";
  else if (interviewReadiness >= 50) readinessLabel = "Intermediate";

  // Career Status Logic
  let careerStatus = "Beginner";
  let careerBadge = "bg-red-100 text-red-700";
  if (atsScore >= 75) {
    careerStatus = "Job Ready";
    careerBadge = "bg-emerald-100 text-emerald-700";
  } else if (atsScore >= 50) {
    careerStatus = "Developing";
    careerBadge = "bg-amber-100 text-amber-700";
  }

  const recentActivities = [
    "Resume Uploaded",
    `ATS Score Generated (${atsScore}%)`,
    `${missingSkillsCount} Missing Skills Identified`,
    `${recommendationsCount} Recommendations Generated`,
    "Analysis Updated"
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm text-center flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Loading Dashboard...</h2>
          <p className="text-slate-500 font-medium">Fetching your AI career insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-3xl p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-4 backdrop-blur-sm">
            WELCOME BACK 
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[144px]">
          <div className="flex items-start justify-between mb-2">
            <div className="text-slate-500 text-sm font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
              ATS Score
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${atsBg} ${atsColor}`}>{atsInsight}</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-800">{atsScore}%</div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className={`${atsBar} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${atsScore}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[144px]">
          <div className="flex items-start justify-between mb-2">
            <div className="text-slate-500 text-sm font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></div>
              Skill Match
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-800">{skillMatch}%</div>
            <p className="text-xs text-slate-400 mt-1 truncate">Based on required industry skills</p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${skillMatch}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[144px]">
          <div className="flex items-start justify-between mb-2">
            <div className="text-slate-500 text-sm font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
              Interview Ready
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-purple-50 text-purple-700 uppercase tracking-wide truncate max-w-[80px]">{readinessLabel}</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-800">{interviewReadiness}%</div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${interviewReadiness}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[144px]">
          <div className="text-slate-500 text-sm font-semibold flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
            Missing Skills
          </div>
          <div className="text-4xl font-extrabold text-red-600">{missingSkillsCount}</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[144px]">
          <div className="text-slate-500 text-sm font-semibold flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
            Career Status
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-800 mb-2 truncate">{careerStatus}</div>
            <span className={`text-xs font-bold px-3 py-1 rounded-lg ${careerBadge}`}>
              Level: {careerStatus}
            </span>
          </div>
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
              <div className={`px-4 py-2 rounded-xl font-bold border ${atsBg} ${atsColor} border-current border-opacity-20`}>
                ATS: {atsScore}%
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Top Strengths
                </h3>
                <ul className="space-y-2 text-sm text-emerald-700">
                  {strengths.length > 0 ? (
                    strengths.slice(0, 2).map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-0.5">•</span> <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="italic text-emerald-600/70">
                      {atsScore > 0 ? "No strengths detected." : "Upload a resume to generate analysis."}
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
                  {weaknesses.length > 0 ? (
                    weaknesses.slice(0, 2).map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-0.5">•</span> <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="italic text-red-600/70">
                      {atsScore > 0 ? "No weaknesses detected." : "Upload a resume to generate analysis."}
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
              <h2 className="text-lg font-bold text-slate-800 mb-3">Career Roadmap Preview</h2>
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs text-slate-400 font-bold mb-1">CURRENT ATS</p>
                  <p className="font-semibold text-slate-700 text-sm">{atsScore}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold mb-1">TARGET ATS</p>
                  <p className="font-semibold text-indigo-600 text-sm">85%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold mb-1">SKILLS TO IMPROVE</p>
                  <p className="font-semibold text-slate-700 text-sm">{missingSkillsCount}</p>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3">
  <div
    className="bg-indigo-600 h-2 rounded-full"
    style={{
      width: `${Math.min(100, (atsScore / 85) * 100)}%`
    }}
  />
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
            <h2 className="text-lg font-bold text-slate-800">{user.name || "User Profile"}</h2>
            <p className="text-sm font-medium text-slate-500 mb-4">Current ATS Score: <span className="font-bold text-indigo-600">{atsScore}%</span></p>
            
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
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-sm border border-slate-800">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/30">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white">AI Interview Coach</h2>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold px-2 py-1 rounded-lg">
                Readiness: {interviewReadiness}%
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-4">Practice tailored questions based on your skill gaps.</p>
            
            <div className="mb-6">
              <p className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wide">Top Focus Areas:</p>
              {missingSkills.length > 0 ? (
                <ul className="space-y-2">
                  {missingSkills.slice(0, 3).map((skill, index) => (
                    <li key={index} className="bg-slate-800/50 p-2.5 rounded-lg text-sm border border-slate-700/50 text-slate-300 flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="bg-slate-800/50 p-3 rounded-xl text-sm border border-slate-700/50 text-slate-400 italic text-center">
                  No skill gaps detected. You're ready!
                </div>
              )}
            </div>

            <Link to="/interview-prep" className="block text-center w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
              Open Interview Prep
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
            </div>
            <div className="relative pl-4 space-y-6 border-l-2 border-slate-100 ml-2">
              {recentActivities.map((activity, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white shadow-sm ring-2 ring-indigo-50"></div>
                  <p className="text-sm font-medium text-slate-700">{activity}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}