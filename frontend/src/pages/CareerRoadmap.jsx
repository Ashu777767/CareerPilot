import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const roadmaps = {
  "Full Stack Developer": [
    { month: "Month 1", title: "HTML, CSS, JavaScript", description: "Master semantic HTML, responsive CSS, and modern ES6+ JavaScript concepts.", status: "active" },
    { month: "Month 2", title: "React Fundamentals", description: "Learn components, state, props, hooks, and routing using React.", status: "upcoming" },
    { month: "Month 3", title: "REST APIs & Node/Spring", description: "Build scalable RESTful services and understand server-side routing.", status: "upcoming" },
    { month: "Month 4", title: "MySQL & Databases", description: "Design relational schemas, write complex queries, and manage database performance.", status: "upcoming" },
    { month: "Month 5", title: "Docker & Deployment", description: "Containerize applications and deploy them to cloud platforms.", status: "upcoming" },
    { month: "Month 6", title: "Full Stack Project", description: "Build and launch a complete end-to-end web application with authentication.", status: "upcoming" }
  ],
  "Frontend Developer": [
    { month: "Month 1", title: "HTML + CSS", description: "Deep dive into web accessibility, Flexbox, Grid, and responsive design.", status: "active" },
    { month: "Month 2", title: "JavaScript", description: "Understand the DOM, async programming, closures, and modern web APIs.", status: "upcoming" },
    { month: "Month 3", title: "React", description: "Build interactive UIs, handle component lifecycles, and use React Hooks.", status: "upcoming" },
    { month: "Month 4", title: "State Management", description: "Implement Redux, Context API, or Zustand for managing complex application state.", status: "upcoming" },
    { month: "Month 5", title: "Next.js", description: "Learn server-side rendering, static site generation, and SEO optimization.", status: "upcoming" },
    { month: "Month 6", title: "Portfolio Projects", description: "Create a stunning personal portfolio with optimized performance and animations.", status: "upcoming" }
  ],
  "Backend Developer": [
    { month: "Month 1", title: "Java Fundamentals", description: "Learn core syntax, data types, control structures, and object-oriented principles.", status: "active" },
    { month: "Month 2", title: "Spring Boot", description: "Set up enterprise projects, understand dependency injection, and configure beans.", status: "upcoming" },
    { month: "Month 3", title: "REST APIs", description: "Build robust endpoints, handle validation, and document APIs with Swagger/OpenAPI.", status: "upcoming" },
    { month: "Month 4", title: "MySQL", description: "Master SQL, indexing, transactions, and integrate using Hibernate/JPA.", status: "upcoming" },
    { month: "Month 5", title: "Docker", description: "Containerize your backend services for consistent cross-environment execution.", status: "upcoming" },
    { month: "Month 6", title: "Deployment", description: "Set up CI/CD pipelines and deploy to AWS, Azure, or Heroku.", status: "upcoming" }
  ],
  "Java Developer": [
    { month: "Month 1", title: "Java Core", description: "Master the basics, memory management, and fundamental language constructs.", status: "active" },
    { month: "Month 2", title: "OOP + Collections", description: "Implement design patterns, inheritance, and utilize the Java Collections Framework.", status: "upcoming" },
    { month: "Month 3", title: "Multithreading", description: "Understand concurrency, thread pools, synchronization, and the Executor framework.", status: "upcoming" },
    { month: "Month 4", title: "Spring Boot", description: "Develop rapid, production-ready enterprise applications using Spring Boot.", status: "upcoming" },
    { month: "Month 5", title: "Microservices", description: "Break down monoliths into decoupled, independently deployable services.", status: "upcoming" },
    { month: "Month 6", title: "Enterprise Project", description: "Develop a scalable, high-performance distributed Java application.", status: "upcoming" }
  ],
  "Spring Boot Developer": [
    { month: "Month 1", title: "Java Fundamentals", description: "Refresh your core Java knowledge with a focus on modern features.", status: "active" },
    { month: "Month 2", title: "Spring Core", description: "Understand the IoC container, bean scopes, and AOP.", status: "upcoming" },
    { month: "Month 3", title: "Spring Boot", description: "Build auto-configured applications with Spring Boot starters and Actuator.", status: "upcoming" },
    { month: "Month 4", title: "Security + JWT", description: "Secure your applications using Spring Security, OAuth2, and JWT tokens.", status: "upcoming" },
    { month: "Month 5", title: "Microservices", description: "Implement Service Discovery, API Gateways, and circuit breakers.", status: "upcoming" },
    { month: "Month 6", title: "Cloud Deployment", description: "Deploy your Spring applications using AWS ECS, Kubernetes, or Spring Cloud.", status: "upcoming" }
  ],
  "Software Engineer": [
    { month: "Month 1", title: "Programming Fundamentals", description: "Master problem-solving techniques, clean code, and basic language syntax.", status: "active" },
    { month: "Month 2", title: "Data Structures", description: "Implement Arrays, Linked Lists, Trees, Graphs, and Hash Tables.", status: "upcoming" },
    { month: "Month 3", title: "Algorithms", description: "Learn sorting, searching, dynamic programming, and complexity analysis.", status: "upcoming" },
    { month: "Month 4", title: "System Design Basics", description: "Understand load balancing, caching, databases, and architectural trade-offs.", status: "upcoming" },
    { month: "Month 5", title: "Backend Development", description: "Build APIs, connect to databases, and handle business logic.", status: "upcoming" },
    { month: "Month 6", title: "Large Scale Project", description: "Architect and build a system designed to handle high user traffic.", status: "upcoming" }
  ],
  "Data Analyst": [
    { month: "Month 1", title: "Excel", description: "Master advanced formulas, pivot tables, macros, and data cleaning techniques.", status: "active" },
    { month: "Month 2", title: "SQL", description: "Write complex queries, joins, window functions, and subqueries.", status: "upcoming" },
    { month: "Month 3", title: "Python", description: "Learn Pandas, NumPy, and automate data extraction and processing.", status: "upcoming" },
    { month: "Month 4", title: "Data Visualization", description: "Create compelling charts and graphs using Matplotlib and Seaborn.", status: "upcoming" },
    { month: "Month 5", title: "Power BI", description: "Build interactive business dashboards and connect to live data sources.", status: "upcoming" },
    { month: "Month 6", title: "Analytics Project", description: "Deliver a comprehensive business insight report from raw data to dashboard.", status: "upcoming" }
  ],
  "Data Scientist": [
    { month: "Month 1", title: "Python", description: "Master Python programming for data manipulation and scientific computing.", status: "active" },
    { month: "Month 2", title: "Statistics", description: "Understand probability, hypothesis testing, distributions, and A/B testing.", status: "upcoming" },
    { month: "Month 3", title: "Data Analysis", description: "Perform Exploratory Data Analysis (EDA) using Pandas and visualize trends.", status: "upcoming" },
    { month: "Month 4", title: "Machine Learning", description: "Implement regression, classification, clustering, and ensemble methods using Scikit-Learn.", status: "upcoming" },
    { month: "Month 5", title: "Deep Learning", description: "Build neural networks using TensorFlow or PyTorch for complex data patterns.", status: "upcoming" },
    { month: "Month 6", title: "End-to-End Data Science Project", description: "Train, tune, and deploy a predictive model via a web API.", status: "upcoming" }
  ],
  "Machine Learning Engineer": [
    { month: "Month 1", title: "Python", description: "Master advanced Python, OOP, and software engineering best practices.", status: "active" },
    { month: "Month 2", title: "Data Processing", description: "Build robust data pipelines, feature engineering, and handle massive datasets.", status: "upcoming" },
    { month: "Month 3", title: "Machine Learning", description: "Train robust ML models, handle bias/variance, and perform cross-validation.", status: "upcoming" },
    { month: "Month 4", title: "Deep Learning", description: "Develop CNNs for vision tasks or RNNs/Transformers for NLP using PyTorch.", status: "upcoming" },
    { month: "Month 5", title: "Model Deployment", description: "Serve models using FastAPI, Docker, and ONNX for low-latency inference.", status: "upcoming" },
    { month: "Month 6", title: "Production ML Project", description: "Set up MLOps pipelines including model monitoring and automated retraining.", status: "upcoming" }
  ],
  "DevOps Engineer": [
    { month: "Month 1", title: "Linux", description: "Master the command line, bash scripting, file permissions, and process management.", status: "active" },
    { month: "Month 2", title: "Git & GitHub", description: "Manage source code, branch strategies, resolving conflicts, and GitHub Actions.", status: "upcoming" },
    { month: "Month 3", title: "Docker", description: "Create multi-stage builds, manage Docker Compose, and optimize image sizes.", status: "upcoming" },
    { month: "Month 4", title: "CI/CD", description: "Build automated testing and deployment pipelines using Jenkins or GitLab CI.", status: "upcoming" },
    { month: "Month 5", title: "Kubernetes", description: "Orchestrate containers, manage pods, services, and deployments at scale.", status: "upcoming" },
    { month: "Month 6", title: "Cloud Deployment", description: "Implement Infrastructure as Code (IaC) using Terraform on AWS or Azure.", status: "upcoming" }
  ],
  "Cloud Engineer": [
    { month: "Month 1", title: "Cloud Fundamentals", description: "Understand IaaS, PaaS, SaaS, virtualization, and core cloud concepts.", status: "active" },
    { month: "Month 2", title: "AWS Core Services", description: "Master EC2, S3, IAM, and VPC configurations.", status: "upcoming" },
    { month: "Month 3", title: "Networking", description: "Design secure networks, subnets, routing tables, and load balancers.", status: "upcoming" },
    { month: "Month 4", title: "Storage & Databases", description: "Implement scalable storage solutions and manage RDS or DynamoDB.", status: "upcoming" },
    { month: "Month 5", title: "Security", description: "Apply cloud security posture management, encryption, and compliance checks.", status: "upcoming" },
    { month: "Month 6", title: "Cloud Architecture Project", description: "Design and deploy a highly available, fault-tolerant cloud architecture.", status: "upcoming" }
  ],
  "Cyber Security Analyst": [
    { month: "Month 1", title: "Networking Basics", description: "Understand the OSI model, TCP/IP, firewalls, and network traffic analysis.", status: "active" },
    { month: "Month 2", title: "Linux", description: "Master Linux administration, logging, and security configurations.", status: "upcoming" },
    { month: "Month 3", title: "Security Fundamentals", description: "Learn about malware, cryptography, IAM, and the CIA triad.", status: "upcoming" },
    { month: "Month 4", title: "Ethical Hacking", description: "Perform reconnaissance, scanning, and vulnerability assessments.", status: "upcoming" },
    { month: "Month 5", title: "Penetration Testing", description: "Exploit vulnerabilities securely using Metasploit and Burp Suite.", status: "upcoming" },
    { month: "Month 6", title: "Security Audit Project", description: "Conduct a full security audit, write a report, and recommend remediations.", status: "upcoming" }
  ]
};

const roleCertifications = {
  "Full Stack Developer": ["AWS Certified Developer", "Meta Front-End Professional", "IBM Full Stack Developer"],
  "Frontend Developer": ["Meta Front-End Developer", "Google UX Design", "W3C Frontend Certification"],
  "Backend Developer": ["AWS Certified Developer", "Oracle Java Professional", "MongoDB Developer"],
  "Java Developer": ["Oracle Certified Associate Java", "Oracle Certified Professional Java", "Spring Professional"],
  "Spring Boot Developer": ["Spring Professional Certification", "AWS Certified Developer", "Docker Certified Associate"],
  "Software Engineer": ["AWS Certified Solutions Architect", "Google Cloud Associate", "Microsoft Certified: Azure Developer"],
  "Data Analyst": ["Google Data Analytics", "IBM Data Analyst", "Microsoft Power BI Data Analyst"],
  "Data Scientist": ["IBM Data Science", "Google Data Machine Learning", "AWS Certified Machine Learning"],
  "Machine Learning Engineer": ["AWS Certified Machine Learning", "Google Cloud Professional ML", "DeepLearning.AI TensorFlow"],
  "DevOps Engineer": ["Docker Certified Associate", "Kubernetes CKA", "AWS Certified DevOps Engineer"],
  "Cloud Engineer": ["AWS Cloud Practitioner", "AWS Solutions Architect", "Google Cloud Associate"],
  "Cyber Security Analyst": ["CompTIA Security+", "Certified Ethical Hacker (CEH)", "CISSP"]
};

const getResourceForMilestone = (title) => {
  const t = title.toLowerCase();
  if (t.includes("react")) return { doc: "https://react.dev", project: "Build a Portfolio Website" };
  if (t.includes("spring")) return { doc: "https://spring.io/projects/spring-boot", project: "Build JWT Auth API" };
  if (t.includes("docker") || t.includes("deployment")) return { doc: "https://docs.docker.com", project: "Containerize CareerPilot" };
  if (t.includes("java") && !t.includes("javascript")) return { doc: "https://dev.java/learn/", project: "Build a Library Management System" };
  if (t.includes("python")) return { doc: "https://docs.python.org/3/", project: "Build a Web Scraper" };
  if (t.includes("html") || t.includes("css")) return { doc: "https://developer.mozilla.org/en-US/docs/Web/HTML", project: "Build a Responsive Landing Page" };
  if (t.includes("sql") || t.includes("mysql") || t.includes("database")) return { doc: "https://dev.mysql.com/doc/", project: "Design an E-commerce Schema" };
  if (t.includes("javascript") || t.includes("programming fundamentals")) return { doc: "https://javascript.info/", project: "Build a Task Tracker API" };
  if (t.includes("linux")) return { doc: "https://linuxjourney.com/", project: "Automate Backups with Bash" };
  if (t.includes("cloud") || t.includes("aws")) return { doc: "https://aws.amazon.com/getting-started/", project: "Deploy a Static Website on S3" };
  return { doc: "https://developer.mozilla.org/en-US/", project: "Build a Full-Stack CRUD Application" };
};

export default function CareerRoadmap() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("Full Stack Developer");
  
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [roleProgress, setRoleProgress] = useState(() => {
    try {
      const saved = localStorage.getItem("roadmapProgress");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Failed to parse roadmap progress from localStorage");
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("roadmapProgress", JSON.stringify(roleProgress));
  }, [roleProgress]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const response = await axios.get("http://localhost:8080/analysis/latest", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data) {
          setAnalysis({
            atsScore: response.data.atsScore || 0,
            missingSkills: response.data.missingSkills || [],
            strengths: response.data.strengths || [],
            weaknesses: response.data.weaknesses || [],
            recommendations: response.data.recommendations || []
          });
        }
      } catch (error) {
        console.error("Failed to fetch analysis", error);
        setAnalysis(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  const toggleMilestone = (index) => {
    setRoleProgress((prev) => {
      const currentRoleData = prev[selectedRole] || {};
      return {
        ...prev,
        [selectedRole]: {
          ...currentRoleData,
          [index]: !currentRoleData[index]
        }
      };
    });
  };

  const currentRoadmap = roadmaps[selectedRole];
  const currentRoleProgress = roleProgress[selectedRole] || {};
  
  const totalSteps = currentRoadmap.length;
  const completedSteps = Object.values(currentRoleProgress).filter(Boolean).length;
  const remainingSteps = totalSteps - completedSteps;
  const completionPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  
  const hasAnalysisData = analysis !== null;
  const atsScore = analysis?.atsScore || 0;
  const missingSkills = analysis?.missingSkills || [];
  const strengths = analysis?.strengths || [];
  const weaknesses = analysis?.weaknesses || [];
  const recommendations = analysis?.recommendations || [];
  const strengthsCount = strengths.length;
  const weaknessesCount = weaknesses.length;

  const nextIncompleteIndex = currentRoadmap.findIndex((_, index) => !currentRoleProgress[index]);
  const weeklyGoal = nextIncompleteIndex !== -1 ? currentRoadmap[nextIncompleteIndex] : null;

  // Real data-driven Action Plan
  const actionPlan = recommendations.length > 0 
    ? recommendations 
    : ["Focus on completing your roadmap milestones.", "Build projects to strengthen your practical experience."];

  if (loading) {
    return <div className="max-w-5xl mx-auto py-12 text-center text-slate-500 font-medium">Loading Roadmap...</div>;
  }

  if (!hasAnalysisData) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">AI Career Roadmap</h1>
          <p className="text-slate-500 mt-2 font-medium">Your personalized path to bridge skill gaps and land your target role.</p>
        </div>
        
        <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm text-center flex flex-col items-center max-w-2xl mx-auto mt-12">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-3">No Resume Analysis Available</h2>
          <p className="text-slate-500 mb-8 text-center max-w-md">Please upload and analyze your resume from the Dashboard to unlock personalized career recommendations, timelines, and insights.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            Go To Dashboard
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">AI Career Roadmap</h1>
        <p className="text-slate-500 mt-2 font-medium">Your personalized path to bridge skill gaps and land your target role.</p>
      </div>

      {/* TOP CONTROLS & ROADMAP STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center hover:shadow-md transition-all h-full">
            <label htmlFor="role-select" className="block text-sm font-bold text-slate-500 mb-3">
              Select Target Career Path
            </label>
            <select
              id="role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
            >
              {Object.keys(roadmaps).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-center hover:shadow-md transition-all">
            <p className="text-xs font-bold text-slate-400 mb-1">Completed / Total</p>
            <p className="text-xl font-extrabold text-slate-800">{completedSteps} / {totalSteps}</p>
            <p className="text-xs text-indigo-500 font-semibold mt-1">{completionPercent}% Finished</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-center hover:shadow-md transition-all">
            <p className="text-xs font-bold text-slate-400 mb-1">Est. Months Left</p>
            <p className="text-xl font-extrabold text-slate-800">{remainingSteps} Months</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">{remainingSteps} steps remaining</p>
          </div>
        </div>
      </div>

      {/* CAREER READINESS INSIGHTS (REAL METRICS ONLY)
      <div className="mb-8">
        <h2 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          Career Readiness Insights
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ATS Score</p>
            <p className="text-2xl font-extrabold text-indigo-600">{atsScore}%</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Strengths</p>
            <p className="text-2xl font-extrabold text-emerald-600">{strengthsCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Weaknesses</p>
            <p className="text-2xl font-extrabold text-red-600">{weaknessesCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Missing Skills</p>
            <p className="text-2xl font-extrabold text-slate-800">{missingSkills.length}</p>
          </div>
        </div>
      </div> */}

     

      {/* AI CAREER COACH (ACTION PLAN) */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-8 hover:shadow-md transition-shadow">
        <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          AI Career Coach
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:h-0.5 before:bg-slate-100 hidden lg:grid">
          {actionPlan.map((rec, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center shadow-md mb-4 ring-4 ring-white">
                {idx + 1}
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full h-full shadow-sm hover:border-indigo-200 transition-colors">
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Step {idx + 1}</p>
                <p className="text-sm text-slate-700 font-semibold">{rec}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-4 lg:hidden">
          {actionPlan.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center shrink-0 shadow-sm">
                {idx + 1}
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Step {idx + 1}</p>
                <p className="text-sm text-slate-700 font-semibold">{rec}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WEEKLY GOAL & RECOMMENDED CERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        <div className="lg:col-span-2 bg-indigo-50 rounded-3xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <svg className="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          </div>
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">This Week's Goal</h3>
          </div>
          {weeklyGoal ? (
            <div className="relative z-10">
              <h4 className="text-xl font-extrabold text-indigo-900 mb-3">{weeklyGoal.title}</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-indigo-800 font-medium">
                  <span className="text-indigo-400 mt-0.5">•</span> Read official documentation for {weeklyGoal.title}
                </li>
                <li className="flex items-start gap-2 text-sm text-indigo-800 font-medium">
                  <span className="text-indigo-400 mt-0.5">•</span> Watch a beginner tutorial to grasp core concepts
                </li>
                <li className="flex items-start gap-2 text-sm text-indigo-800 font-medium">
                  <span className="text-indigo-400 mt-0.5">•</span> Build a small practice project applying the skills
                </li>
              </ul>
            </div>
          ) : (
            <div className="relative z-10 py-4 text-center">
              <p className="text-indigo-800 font-bold">Congratulations! 🎉</p>
              <p className="text-indigo-600 text-sm mt-1">You have completed all milestones for this role.</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col hover:border-slate-200 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-amber-100 text-amber-600 p-1.5 rounded-lg shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recommended Certs</h3>
          </div>
          <ul className="space-y-3 flex-1">
            {roleCertifications[selectedRole]?.map((cert, idx) => (
              <li key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition-colors cursor-default">
                <svg className="w-4 h-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {cert}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* LEARNING TIMELINE */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        
        {/* Timeline Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 mb-8 border-b border-slate-100">
          <div className="text-center md:text-left">
            <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Current Stage</p>
            <h2 className="text-xl font-extrabold text-slate-800">Junior Developer</h2>
          </div>
          
          <div className="flex-1 flex items-center justify-center hidden md:flex">
            <div className="w-full h-1 bg-slate-100 relative">
              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-indigo-50 border-2 border-indigo-200 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Target Role</p>
            <h2 className="text-xl font-extrabold text-indigo-600">{selectedRole}</h2>
          </div>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          
          {currentRoadmap.map((milestone, index) => {
            const isCompleted = !!currentRoleProgress[index];
            const resource = getResourceForMilestone(milestone.title);
            
            const isMissingSkill = missingSkills.some(skill => 
              milestone.title.toLowerCase().includes(skill.toLowerCase())
            );
            
            return (
              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10 transition-colors ${
                  isCompleted ? 'bg-emerald-100 text-emerald-600' : 
                  isMissingSkill ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isMissingSkill ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  ) : (
                    index + 1
                  )}
                </div>
                
                <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-slate-50 p-6 rounded-2xl border shadow-sm transition-all ${
                  isCompleted ? 'border-emerald-200 opacity-80' : 
                  isMissingSkill ? 'border-red-300 ring-2 ring-red-50 bg-white hover:shadow-md' : 'border-slate-100 hover:border-indigo-200 hover:shadow-md'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 shadow-sm">
                        {milestone.month}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        isCompleted ? 'bg-emerald-100 text-emerald-700' : 
                        isMissingSkill ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isCompleted ? 'Completed' : isMissingSkill ? 'Priority' : 'Pending'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => toggleMilestone(index)}
                      className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600 transition-transform hover:scale-110"
                      aria-label={`Mark ${milestone.title} as completed`}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-slate-800">{milestone.title}</h4>
                  </div>
                  
                  {isMissingSkill && !isCompleted && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 mb-3 rounded-lg bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold uppercase tracking-wider">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
                      Missing Skill Detected
                    </div>
                  )}
                  
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{milestone.description}</p>
                  
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Learning Resources</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a 
                        href={resource.doc} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-indigo-600 transition-colors shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        Official Docs
                      </a>
                      <div className="flex-1 flex flex-col justify-center gap-1 text-xs font-bold px-3 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg">
                        <span className="text-[10px] text-indigo-400 uppercase">Practice Project</span>
                        <span className="truncate" title={resource.project}>{resource.project}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}