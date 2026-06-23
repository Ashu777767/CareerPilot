import { Link } from "react-router-dom";

export default function LandingPage() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    
      <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative z-0">
        
        {/* PREMIUM ANIMATED CSS GRID & GLOW BACKGROUND */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white overflow-hidden pointer-events-none">
          <style>
            {`
              @keyframes float-1 {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.08; }
                33% { transform: translate(3%, -5%) scale(1.05); opacity: 0.13; }
                66% { transform: translate(-3%, 4%) scale(0.95); opacity: 0.10; }
              }
              @keyframes float-2 {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.08; }
                33% { transform: translate(-4%, 5%) scale(0.95); opacity: 0.10; }
                66% { transform: translate(4%, -3%) scale(1.05); opacity: 0.13; }
              }
              @keyframes float-3 {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.08; }
                33% { transform: translate(4%, 3%) scale(1.05); opacity: 0.13; }
                66% { transform: translate(-3%, -4%) scale(0.95); opacity: 0.10; }
              }
              .animate-glow-1 { animation: float-1 18s ease-in-out infinite; }
              .animate-glow-2 { animation: float-2 20s ease-in-out infinite; }
              .animate-glow-3 { animation: float-3 15s ease-in-out infinite; }
            `}
          </style>

          {/* Base Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          
          {/* Animated Glow Circles */}
          <div className="absolute -left-[10%] top-[-10%] w-[800px] h-[800px] rounded-full bg-indigo-600 blur-[120px] mix-blend-multiply animate-glow-1"></div>
          <div className="absolute -right-[10%] top-[10%] w-[700px] h-[700px] rounded-full bg-purple-600 blur-[120px] mix-blend-multiply animate-glow-2"></div>
          <div className="absolute left-[20%] top-[20%] w-[900px] h-[900px] rounded-full bg-blue-500 blur-[120px] mix-blend-multiply animate-glow-3"></div>

          {/* Radial Gradient Overlay for smooth edge fading */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,transparent_40%,white_100%)]"></div>
        </div>

        {/* SECTION 1 — NAVBAR */}
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-slate-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-3 text-white">
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
    <svg
      className="w-6 h-6 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3L18.5 18L12 14.5L5.5 18L12 3Z" />
    </svg>
  </div>

  <span className="text-2xl font-bold tracking-tight text-violet-800">
  CareerPilot
</span>
</div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <button onClick={() => scrollToSection('features')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Features</button>
                <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">How It Works</button>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-4">
                <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* SECTION 2 — HERO SECTION */}
        <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Build Your Career <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                With AI
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Upload your resume, identify skill gaps, improve ATS score, and receive a personalized career roadmap.
            </p>
            
            <div className="flex justify-center mb-16">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl text-base font-bold shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 hover:bg-indigo-700 transition-all">
                Get Started
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Professional Preview Card */}
            <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-slate-200/50 border border-slate-200/60 flex flex-col md:flex-row gap-6 text-left transform transition-all hover:-translate-y-1">
              
              {/* ATS Score */}
              <div className="flex-1 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">ATS Score</span>
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-8 border-indigo-50">
                  <div className="absolute inset-0 rounded-full border-8 border-indigo-500 border-t-transparent -rotate-45"></div>
                  <div className="text-3xl font-extrabold text-indigo-600">72%</div>
                </div>
              </div>

              {/* Target Role & Missing Skills */}
              <div className="flex-[1.5] bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="mb-5 pb-5 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Target Role</span>
                  <span className="text-lg font-bold text-slate-800">Full Stack Developer</span>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Missing Skills</span>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm font-bold text-slate-700 gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    Docker
                  </li>
                  <li className="flex items-center text-sm font-bold text-slate-700 gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    AWS
                  </li>
                  <li className="flex items-center text-sm font-bold text-slate-700 gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    REST APIs
                  </li>
                </ul>
              </div>

              {/* Roadmap Progress */}
              <div className="flex-1 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Roadmap Progress</span>
                <div className="text-5xl font-extrabold text-slate-800 mb-2">4</div>
                <span className="text-sm font-semibold text-slate-500">Skills Remaining</span>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 3 — FEATURES */}
        <section id="features" className="py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Core Capabilities</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">An end-to-end career guidance tool.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Resume Analysis</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Score your resume against ATS standards and receive actionable formatting feedback.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Skill Gap Detection</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Identify missing skills required for your target role based on industry trends.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Career Roadmap</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Generate a structured learning path to acquire missing skills and reach your goals.</p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Interview Preparation</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Practice tailored interview questions and receive instant AI-driven feedback.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — HOW IT WORKS */}
        <section id="how-it-works" className="py-24 relative z-10 border-t border-slate-100/60 bg-white/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">How It Works</h2>
            </div>

            <div className="relative max-w-5xl mx-auto">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 z-0"></div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-white text-indigo-600 font-extrabold text-xl flex items-center justify-center border border-slate-200 shadow-sm mb-6 group-hover:-translate-y-1 transition-transform">1</div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Upload Resume</h3>
                  <p className="text-sm text-slate-500 font-medium">Upload your PDF resume.</p>
                </div>
                {/* Step 2 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-white text-indigo-600 font-extrabold text-xl flex items-center justify-center border border-slate-200 shadow-sm mb-6 group-hover:-translate-y-1 transition-transform">2</div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">AI Analysis</h3>
                  <p className="text-sm text-slate-500 font-medium">Gemini analyzes your profile.</p>
                </div>
                {/* Step 3 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-white text-indigo-600 font-extrabold text-xl flex items-center justify-center border border-slate-200 shadow-sm mb-6 group-hover:-translate-y-1 transition-transform">3</div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Personalized Roadmap</h3>
                  <p className="text-sm text-slate-500 font-medium">Receive a customized learning path.</p>
                </div>
                {/* Step 4 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-white text-indigo-600 font-extrabold text-xl flex items-center justify-center border border-slate-200 shadow-sm mb-6 group-hover:-translate-y-1 transition-transform">4</div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Interview Preparation</h3>
                  <p className="text-sm text-slate-500 font-medium">Practice role-specific interview questions.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — FINAL CTA */}
        <section className="py-24 relative z-10 border-t border-slate-100 bg-white text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Ready to Build Your Career With AI?</h2>
            <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto font-medium">
              Create your account and receive personalized career guidance powered by AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center bg-indigo-600 text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
                Get Started
              </Link>
              <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-slate-700 px-8 py-3.5 rounded-xl text-sm font-bold border border-slate-200 shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 transition-all">
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 6 — FOOTER */}
        <footer className="bg-white border-t border-slate-200 py-12 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            
            <div className="flex items-center gap-2">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg"> <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" > <path d="M12 3L18.5 18L12 14.5L5.5 18L12 3Z" /> </svg>
              </div>
              <span className="text-lg font-extrabold text-violet-800 tracking-tight">CareerPilot</span>
            </div>

            <div className="text-slate-500 font-medium text-sm text-center md:text-left">
              AI Career Navigator & Interview Coach
            </div>

          </div>

        </footer>

      </div>

  );
}