import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function InterviewPrep() {
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [submittedAnswer, setSubmittedAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState(null);

  // New Interview Flow State
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions] = useState(5);
  const [interviewScores, setInterviewScores] = useState([]);
  const [allStrengths, setAllStrengths] = useState([]);
  const [allWeaknesses, setAllWeaknesses] = useState([]);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  
  // UI UX State
  const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(false);

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);

  const resourcesMap = {
    "Frontend Developer": [
      { title: "React Official Docs", link: "https://react.dev/learn" },
      { title: "Frontend Roadmap", link: "https://roadmap.sh/frontend" },
      { title: "React Interview Questions", link: "https://www.interviewbit.com/react-interview-questions/" }
    ],
    "Backend Developer": [
      { title: "Spring Boot Documentation", link: "https://spring.io/projects/spring-boot" },
      { title: "Backend Roadmap", link: "https://roadmap.sh/backend" },
      { title: "Java Interview Guide", link: "https://www.interviewbit.com/java-interview-questions/" }
    ],
    "Java Developer": [
      { title: "Oracle Java Docs", link: "https://docs.oracle.com/en/java/" },
      { title: "Spring Boot Roadmap", link: "https://roadmap.sh/spring-boot" },
      { title: "Java Advanced Concepts", link: "https://www.geeksforgeeks.org/java-interview-questions/" }
    ],
    "Full Stack Developer": [
      { title: "Full Stack Roadmap", link: "https://roadmap.sh/full-stack" },
      { title: "System Design Primer", link: "https://github.com/donnemartin/system-design-primer" },
      { title: "Spring Boot + React Guide", link: "https://spring.io/guides/tutorials/react-and-spring-data-rest/" }
    ]
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [question, submittedAnswer, isEvaluating, feedback, isInterviewComplete, isFeedbackExpanded]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const fetchQuestion = async () => {
    try {
      setQuestion("");
      setAnswer("");
      setSubmittedAnswer("");
      setFeedback(null);
      setError(null);
      setSpeechError("");
      setIsFeedbackExpanded(false);
      
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
      
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        "http://localhost:8080/api/interview/start",
        {
          role: targetRole,
          difficulty: difficulty
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setQuestion(response.data.question);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch the next question. Please try again.");
    }
  };

  const startNewSession = () => {
    setQuestionNumber(1);
    setInterviewScores([]);
    setAllStrengths([]);
    setAllWeaknesses([]);
    setIsInterviewComplete(false);
    fetchQuestion();
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !question) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsEvaluating(true);
    setSubmittedAnswer(answer);
    setError(null);
    setSpeechError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8080/api/interview/evaluate",
        {
          question: question,
          answer: answer,
          role: targetRole
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setFeedback(response.data);
      setInterviewScores(prev => [...prev, response.data.score || 0]);
      setIsFeedbackExpanded(false);
      
      if (response.data.strengths?.length > 0) {
        setAllStrengths(prev => [...prev, ...response.data.strengths]);
      }
      if (response.data.weaknesses?.length > 0) {
        setAllWeaknesses(prev => [...prev, ...response.data.weaknesses]);
      }

      setAnswer("");
    } catch (error) {
      console.log(error);
      setError("Failed to evaluate answer. Please check your connection.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextAction = () => {
    if (questionNumber < totalQuestions) {
      setQuestionNumber(prev => prev + 1);
      fetchQuestion();
    } else {
      setIsInterviewComplete(true);
      setQuestion("");
      setSubmittedAnswer("");
      setFeedback(null);
    }
  };

  const endInterview = () => {
    setQuestion("");
    setAnswer("");
    setSubmittedAnswer("");
    setFeedback(null);
    setError(null);
    setSpeechError("");
    setInterviewScores([]);
    setAllStrengths([]);
    setAllWeaknesses([]);
    setIsInterviewComplete(false);
    setQuestionNumber(1);
    setIsFeedbackExpanded(false);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleMicrophone = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSpeechError("Speech Recognition not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    setSpeechError("");
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let newTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          newTranscript += event.results[i][0].transcript;
        }
      }
      if (newTranscript) {
        setAnswer(prev => {
          const spacer = prev && !prev.endsWith(' ') ? ' ' : '';
          return prev + spacer + newTranscript.trim();
        });
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setSpeechError(`Microphone error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch (err) {
      setSpeechError("Failed to start microphone.");
      setIsListening(false);
    }
  };

  const getTopItem = (items) => {
    if (!items || items.length === 0) return "None identified";
    const counts = items.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  // Dynamic Readiness Calculation
  const avgScore = interviewScores.length > 0 
    ? +(interviewScores.reduce((a, b) => a + b, 0) / interviewScores.length).toFixed(1) 
    : 0;
  const highestScore = interviewScores.length > 0 ? Math.max(...interviewScores) : 0;
  const lowestScore = interviewScores.length > 0 ? Math.min(...interviewScores) : 0;
  
  const readinessPercent = Math.round(avgScore * 10);
  let readinessLabel = "Needs Practice";
  let readinessColor = "text-amber-500";
  let scoreBadgeColor = "bg-amber-50 text-amber-700 border-amber-200";

  if (interviewScores.length > 0) {
    if (avgScore >= 8) { 
      readinessLabel = "Interview Ready"; 
      readinessColor = "text-emerald-500"; 
      scoreBadgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (avgScore >= 6) { 
      readinessLabel = "Needs Practice"; 
      readinessColor = "text-amber-500"; 
      scoreBadgeColor = "bg-amber-50 text-amber-700 border-amber-200";
    } else { 
      readinessLabel = "Needs Improvement"; 
      readinessColor = "text-red-500"; 
      scoreBadgeColor = "bg-red-50 text-red-700 border-red-200";
    }
  }

  const progressPercentage = Math.round((questionNumber / totalQuestions) * 100);

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row h-[calc(100vh-4rem)] p-4 lg:p-6 gap-6 font-sans bg-slate-50/50">
      
      {/* Left Chat Window */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-white z-10 relative shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800 leading-tight">AI Interview Session</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wider">{targetRole}</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wider">{difficulty}</span>
              </div>
            </div>
          </div>

          {!isInterviewComplete && question && (
            <div className="flex items-center gap-6">
              <div className="hidden sm:block text-right">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Question {questionNumber} of {totalQuestions}</p>
                <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
              <button 
                onClick={endInterview}
                className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
              >
                End Session
              </button>
            </div>
          )}
        </div>

        {/* Chat Messages Area */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#F9FAFB] scroll-smooth">
          
          {!isInterviewComplete && !question && !isEvaluating && !error && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-fade-in">
              <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
                <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Ready to start?</h3>
              <p className="text-slate-500 text-sm max-w-sm">Configure your role and difficulty in the sidebar, then hit start to begin your AI-powered interview.</p>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100 shadow-sm max-w-md">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            </div>
          )}
          
          {speechError && (
            <div className="flex justify-center">
              <div className="bg-amber-50 text-amber-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 border border-amber-100 shadow-sm max-w-md">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {speechError}
              </div>
            </div>
          )}

          {isInterviewComplete ? (
            <div className="animate-fade-in flex flex-col items-center justify-center py-10">
              <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                    <span className="text-3xl">🎉</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-800">Interview Completed!</h2>
                  <p className="text-slate-500 mt-2 text-sm font-medium">Here is your overall performance summary.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Score</p>
                    <p className="text-2xl font-black text-indigo-600">{avgScore}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Highest</p>
                    <p className="text-2xl font-black text-emerald-600">{highestScore}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lowest</p>
                    <p className="text-2xl font-black text-amber-600">{lowestScore}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Attempted</p>
                    <p className="text-2xl font-black text-slate-700">{interviewScores.length}</p>
                  </div>
                </div>

                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 flex items-center justify-between mb-8">
                  <div>
                    <p className="text-[11px] font-black text-indigo-800 uppercase tracking-widest mb-1">Final Readiness</p>
                    <p className="text-sm font-bold text-indigo-600">{readinessLabel}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-4xl font-black ${readinessColor}`}>{readinessPercent}%</p>
                  </div>
                </div>

                <button 
                  onClick={startNewSession}
                  className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors shadow-md"
                >
                  Start Another Interview
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* AI Question Bubble */}
              {question && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white shadow-sm mt-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm text-slate-800 leading-relaxed font-medium">
                    {question}
                  </div>
                </div>
              )}

              {/* User Answer Bubble */}
              {submittedAnswer && (
                <div className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-white shadow-sm mt-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-md text-sm leading-relaxed font-medium">
                    {submittedAnswer}
                  </div>
                </div>
              )}

              {/* AI Loading Bubble */}
              {isEvaluating && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white shadow-sm mt-1">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-75"></span>
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-150"></span>
                    </span>
                    <span className="text-sm font-bold text-slate-500">Evaluating your answer...</span>
                  </div>
                </div>
              )}

              {/* AI Feedback Bubble */}
              {feedback && (
                <div className="flex gap-3 max-w-[95%] sm:max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white shadow-sm mt-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm w-full overflow-hidden">
                    <div className="p-4 flex items-center justify-between bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setIsFeedbackExpanded(!isFeedbackExpanded)}>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-md text-xs font-black border ${scoreBadgeColor}`}>
                          Score: {feedback.score}/10
                        </span>
                        <span className="text-sm font-bold text-slate-700">Feedback Ready</span>
                      </div>
                      <button className="text-indigo-600 font-bold text-xs flex items-center gap-1 hover:underline">
                        {isFeedbackExpanded ? "Hide Details" : "View Details"}
                        <svg className={`w-4 h-4 transform transition-transform ${isFeedbackExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                    </div>

                    {isFeedbackExpanded && (
                      <div className="p-5 border-t border-slate-100 space-y-5">
                        {feedback.strengths?.length > 0 && (
                          <div>
                            <p className="font-bold text-emerald-700 text-[11px] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              Strengths
                            </p>
                            <ul className="space-y-1.5">
                              {feedback.strengths.map((str, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                                  <span className="text-emerald-500 mt-0.5">•</span> {str}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {feedback.weaknesses?.length > 0 && (
                          <div>
                            <p className="font-bold text-red-600 text-[11px] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                              Weaknesses
                            </p>
                            <ul className="space-y-1.5">
                              {feedback.weaknesses.map((wk, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                                  <span className="text-red-500 mt-0.5">•</span> {wk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {feedback.improvement && (
                          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                            <p className="font-bold text-indigo-700 text-[11px] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                              How to Improve
                            </p>
                            <p className="text-slate-700 text-sm font-medium leading-relaxed">{feedback.improvement}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Fixed Input Area */}
        {!isInterviewComplete && (
          <div className="bg-white border-t border-slate-200 p-4 sm:p-5 z-20 shadow-[0_-4px_15px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col gap-3">
              <div className="relative">
                <textarea 
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={isEvaluating || !question || feedback !== null}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none disabled:opacity-60 disabled:cursor-not-allowed transition-all placeholder-slate-400 text-slate-800 pr-12"
                  rows="2"
                  placeholder={!question ? "Start a session to enable typing..." : feedback ? "Review feedback, then click Next Question." : "Type your answer here..."}
                ></textarea>
                
                {/* Microphone Button inside Textarea */}
                <button 
                  onClick={toggleMicrophone}
                  disabled={isEvaluating || !question || feedback !== null}
                  className={`absolute right-3 top-3 p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isListening 
                    ? "bg-red-100 text-red-600 animate-pulse" 
                    : "bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200"
                  }`}
                  title={isListening ? "Listening... Click to stop" : "Use Microphone"}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  {isListening && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
                  {isListening && <span className="text-red-500 flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Listening...</span>}
                  {!isListening && question && !feedback && "Enter to submit"}
                </div>
                
                {feedback ? (
                  <button 
                    onClick={handleNextAction}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors shadow-sm flex items-center gap-2"
                  >
                    {questionNumber < totalQuestions ? "Next Question" : "View Summary"}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                ) : (
                  <button 
                    onClick={submitAnswer}
                    disabled={isEvaluating || !answer.trim() || !question}
                    className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-sm"
                  >
                    Send Answer
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-[320px] xl:w-[360px] flex flex-col gap-6 overflow-y-auto">
        
        {/* Setup Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-extrabold text-slate-800 mb-4 text-base">Session Setup</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">Target Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700"
              >
                <option>Full Stack Developer</option>
                <option>Java Developer</option>
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">Difficulty</label>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
           <button
            onClick={startNewSession}
            disabled={isEvaluating}
            className="w-full bg-indigo-50 text-indigo-700 border border-indigo-100 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
           >
            Start Session
           </button>
          </div>
        </div>

        {/* Readiness Insights */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex-1">
          <h3 className="font-extrabold text-slate-800 mb-4 text-base">Analytics</h3>
          
          {interviewScores.length > 0 ? (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Readiness</p>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-black leading-none tracking-tight ${readinessColor}`}>{readinessPercent}%</span>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-md text-xs font-bold border ${scoreBadgeColor}`}>
                  {readinessLabel}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Questions</p>
                  <p className="text-xl font-black text-slate-700">{interviewScores.length}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Score</p>
                  <p className="text-xl font-black text-indigo-600">{avgScore}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strengths</p>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{Array.from(new Set(allStrengths)).length}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {allStrengths.length > 0 ? (
                      Array.from(new Set(allStrengths)).slice(0, 3).map((str, idx) => (
                        <span key={`str-${idx}`} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold border border-emerald-100 truncate max-w-full">
                          {str}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium italic">Pending evaluation...</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weaknesses</p>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{Array.from(new Set(allWeaknesses)).length}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {allWeaknesses.length > 0 ? (
                      Array.from(new Set(allWeaknesses)).slice(0, 3).map((wk, idx) => (
                        <span key={`wk-${idx}`} className="px-2 py-1 bg-red-50 text-red-700 rounded text-[10px] font-bold border border-red-100 truncate max-w-full">
                          {wk}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium italic">Pending evaluation...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <p className="text-xs text-slate-500 font-bold px-4">Insights will appear here after your first answer.</p>
            </div>
          )}
        </div>

        {/* Resources */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
           <h3 className="font-extrabold text-slate-800 mb-4 text-base">Resources</h3>
           <div className="space-y-3">
             {resourcesMap[targetRole]?.map((resource, idx) => (
               <a 
                 key={idx}
                 href={resource.link} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="group block p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-100 transition-all"
               >
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-indigo-100 flex-shrink-0">
                     <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                   </div>
                   <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">{resource.title}</span>
                 </div>
               </a>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}