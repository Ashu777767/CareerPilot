import { useState, useEffect } from "react";

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

export default function CareerRoadmap() {
  const [selectedRole, setSelectedRole] = useState("Full Stack Developer");
  
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
  const completionPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">AI Career Roadmap</h1>
        <p className="text-slate-500 mt-1">Your personalized path to bridge skill gaps and land your target role.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
          <label htmlFor="role-select" className="block text-sm font-bold text-slate-500 mb-2">
            Select Target Career Path
          </label>
          <select
            id="role-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
          >
            {Object.keys(roadmaps).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Completed Steps</p>
            <p className="text-lg font-extrabold text-slate-800">
              {completedSteps} of {totalSteps}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-500 mb-1">Completion Percentage</p>
            <p className="text-2xl font-extrabold text-indigo-600">{completionPercent}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-sm font-bold text-slate-400 mb-1">Current Stage</p>
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
          <p className="text-sm font-bold text-slate-400 mb-1">Target Role</p>
          <h2 className="text-xl font-extrabold text-indigo-600">{selectedRole}</h2>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Learning Timeline</h3>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          
          {currentRoadmap.map((milestone, index) => {
            const isCompleted = !!currentRoleProgress[index];
            
            return (
              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10 transition-colors ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                
                <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-slate-50 p-6 rounded-2xl border shadow-sm transition-all ${isCompleted ? 'border-emerald-200 opacity-75' : 'border-slate-100 hover:border-indigo-200 hover:shadow-md'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 shadow-sm">
                        {milestone.month}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                        {isCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => toggleMilestone(index)}
                      className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                      aria-label={`Mark ${milestone.title} as completed`}
                    />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">{milestone.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{milestone.description}</p>
                </div>
                
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}