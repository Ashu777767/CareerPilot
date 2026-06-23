import { useState, useEffect } from 'react';
import { Mail, Lock, CheckCircle2, XCircle, ArrowRight, Compass, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Validation State
  const [emailStatus, setEmailStatus] = useState('idle'); // 'idle' | 'valid' | 'invalid'

  // Submission States
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: '', subMessage?: '' }

  // Auto-hide error alert after 5 seconds
  useEffect(() => {
    if (alert && alert.type === 'error') {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Real-time Email Validation
  useEffect(() => {
    if (!email) {
      setEmailStatus('idle');
      return;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailStatus(regex.test(email) ? 'valid' : 'invalid');
  }, [email]);

  const isFormValid = emailStatus === 'valid' && password.trim().length > 0;

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setAlert(null);

    try {
      const response = await axios.post("http://localhost:8080/login", {
        email: email.trim(),
        password
      });

      // SECURITY FIX: Prevent storing error strings as JWT tokens
      const responseData = response.data;
      if (
        typeof responseData === 'string' && (
          responseData.includes("User not found") || 
          responseData.includes("Invalid Password") || 
          responseData.includes("Invalid Credentials")
        )
      ) {
        throw new Error(responseData);
      }

      // Valid login flow
      localStorage.setItem("token", responseData);

      setAlert({ 
        type: 'success', 
        message: 'Login Successful',
        subMessage: 'Redirecting to Dashboard...' 
      });

      // Delay navigation to show success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (error) {
      console.error(error);
      
      // Determine error message
      let errorMessage = 'Invalid Email or Password';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message && !error.message.includes("Network Error")) {
        errorMessage = error.message;
      } else if (error.message?.includes("Network Error")) {
        errorMessage = "Network Error. Please check your connection.";
      }

      setAlert({ 
        type: 'error', 
        message: errorMessage 
      });
      setIsLoading(false);
    }
  };

  const features = [
    "AI Resume Analyzer",
    "ATS Score Analysis",
    "Skill Gap Detection",
    "Mock Interview Preparation",
    "Personalized Career Roadmaps"
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* MAIN CARD CONTAINER */}
      <div className="w-full max-w-[1100px] lg:h-auto lg:min-h-[600px] lg:max-h-[85vh] bg-white rounded-2xl lg:rounded-3xl shadow-xl flex flex-col lg:flex-row overflow-hidden border border-slate-200">
        
        {/* LEFT SIDE - Hero & Branding */}
        <div className="hidden lg:flex lg:w-[50%] relative flex-col justify-center p-10 xl:p-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-800">
          
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400 opacity-20 blur-[100px] mix-blend-overlay"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-400 opacity-20 blur-[100px] mix-blend-overlay"></div>
          </div>

          <div className="relative z-10 flex flex-col gap-8 xl:gap-10">
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

  <span className="text-2xl font-bold tracking-tight">
    CareerPilot
  </span>
</div>

            <div className="space-y-4 max-w-lg">
              <span className="inline-block py-1.5 px-3 bg-white/10 border border-white/20 rounded-full text-blue-100 text-xs font-bold tracking-wider uppercase backdrop-blur-sm shadow-sm">
                Welcome Back
              </span>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Resume Your <br className="hidden xl:block" /> Career Journey
              </h1>
              <p className="text-base xl:text-lg text-blue-100/90 font-medium leading-relaxed">
                Log back in to access your personalized AI career roadmap, resume analytics, and upcoming mock interviews.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-3 mt-8">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white/95">
                <div className="bg-white/10 rounded-full p-1 border border-white/20 shadow-sm backdrop-blur-sm flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-blue-200" />
                </div>
                <span className="text-sm xl:text-base font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - Login Form */}
        <div className="w-full lg:w-[50%] h-full flex flex-col justify-center px-6 py-8 sm:px-10 lg:px-12 xl:px-16 bg-white overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            
            {/* Mobile-only Branding */}
            <div className="flex lg:hidden items-center gap-2.5 text-indigo-600 mb-8">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100">
                <Compass className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">CareerPilot</span>
            </div>

            {/* Form Header */}
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                Sign In
              </h2>
              <p className="text-slate-500 text-sm lg:text-base font-medium">
                Enter your details below to continue.
              </p>
            </div>

            {/* Alerts Container */}
            {alert && (
              <div 
                className={`mb-6 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 border transition-all duration-300 ${
                  alert.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
                role="alert"
                aria-live="assertive"
              >
                {alert.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{alert.message}</span>
                  {alert.subMessage && (
                    <span className="text-sm mt-1 font-medium opacity-90 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      {alert.subMessage}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleLogin} noValidate>
              
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 transition-colors duration-300 ${
                      emailStatus === 'valid' ? 'text-emerald-500' : 
                      emailStatus === 'invalid' ? 'text-red-500' : 
                      'text-slate-400 group-focus-within:text-indigo-600'
                    }`} />
                  </div>
                  <input 
                    id="email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={emailStatus === 'invalid'}
                    className={`block w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-900 text-sm lg:text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300 font-medium ${
                      emailStatus === 'valid' 
                        ? 'border-emerald-500 focus:ring-emerald-500/20 focus:border-emerald-500' 
                        : emailStatus === 'invalid'
                        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-slate-200 hover:border-slate-300 focus:ring-indigo-600/20 focus:border-indigo-600'
                    }`} 
                    placeholder="name@example.com" 
                    required
                  />
                </div>
                {emailStatus === 'valid' && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Valid Email
                  </p>
                )}
                {emailStatus === 'invalid' && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-500 animate-in fade-in">
                    <XCircle className="w-3.5 h-3.5" /> Invalid Email Format
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-300" />
                  </div>
                  <input 
                    id="password"
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 text-sm lg:text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all duration-300 font-medium" 
                    placeholder="••••••••" 
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={!isFormValid || isLoading || alert?.type === 'success'}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none text-white py-3.5 px-6 rounded-xl font-bold text-base transition-all duration-300 shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing In...
                  </>
                ) : alert?.type === 'success' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Success
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Text */}
            <p className="mt-8 text-center text-sm font-medium text-slate-500">
              Don't have an account?{' '}
              <Link 
                to="/"
                className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600/20 rounded"
              >
                Register
              </Link>
            </p>

          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Login;