/**
 * Company demand data — MNC + Indian companies with roles and requirements.
 *
 * Each company has:
 * - Basic info (name, logo emoji, careers URL, tags)
 * - Roles they commonly hire for
 * - Each role maps to a learning roadmap with phases, skills, videos, and resources
 */

export interface RoadmapPhase {
  title: string;
  skills: string[];
  resources: { name: string; url: string }[];
  videos: { title: string; channel: string; url: string; duration: string }[];
}

export interface CompanyRole {
  id: string;
  title: string;
  description: string;
  salary: string;
  requirements: string[];
  roadmap: RoadmapPhase[];
}

export interface Company {
  id: string;
  name: string;
  emoji: string;
  description: string;
  careersUrl: string;
  tags: string[];
  roles: CompanyRole[];
}

// ---------------------------------------------------------------------------
// Shared roadmap phases (reused across companies for similar roles)
// ---------------------------------------------------------------------------

const SWE_ROADMAP: RoadmapPhase[] = [
  {
    title: "Phase 1: Programming Foundations",
    skills: ["Python or Java or C++", "Data Structures", "Algorithms", "Big-O Analysis", "OOP Concepts"],
    resources: [
      { name: "LeetCode", url: "https://leetcode.com" },
      { name: "NeetCode 150", url: "https://neetcode.io/practice" },
      { name: "CS50 (Harvard)", url: "https://cs50.harvard.edu" },
    ],
    videos: [
      { title: "Data Structures Easy to Advanced", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=RBSGKlAvoiM", duration: "8:03:24" },
      { title: "Algorithms and Data Structures Tutorial", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=8hly31xKli0", duration: "5:22:09" },
      { title: "Python Full Course", channel: "Programming with Mosh", url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", duration: "6:14:07" },
    ],
  },
  {
    title: "Phase 2: System Design & Architecture",
    skills: ["System Design Basics", "Scalability", "Load Balancing", "Caching", "Database Design", "Microservices"],
    resources: [
      { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
      { name: "Grokking System Design", url: "https://www.designgurus.io/course/grokking-the-system-design-interview" },
    ],
    videos: [
      { title: "System Design for Beginners", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=F2FmTdLtb_4", duration: "1:33:56" },
      { title: "System Design Interview – Step By Step", channel: "Gaurav Sen", url: "https://www.youtube.com/watch?v=bUHFg8CZFws", duration: "26:41" },
    ],
  },
  {
    title: "Phase 3: Web Development",
    skills: ["HTML/CSS/JavaScript", "React or Angular", "Node.js or Spring Boot", "REST APIs", "Git & GitHub"],
    resources: [
      { name: "MDN Web Docs", url: "https://developer.mozilla.org" },
      { name: "freeCodeCamp", url: "https://www.freecodecamp.org" },
      { name: "The Odin Project", url: "https://www.theodinproject.com" },
    ],
    videos: [
      { title: "React Full Course 2024", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=bMknfKXIFA8", duration: "11:55:27" },
      { title: "Node.js Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", duration: "8:16:48" },
    ],
  },
  {
    title: "Phase 4: Interview Prep & Career",
    skills: ["Behavioral Interviews", "Coding Interviews", "Resume Building", "Portfolio Projects", "Open Source Contributions"],
    resources: [
      { name: "InterviewBit", url: "https://www.interviewbit.com" },
      { name: "Pramp (Free Mock Interviews)", url: "https://www.pramp.com" },
      { name: "Glassdoor Company Reviews", url: "https://www.glassdoor.com" },
    ],
    videos: [
      { title: "How to Get a Software Engineering Job", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=Xg9ihH15Uto", duration: "32:17" },
      { title: "Google Coding Interview Tips", channel: "Clément Mihailescu", url: "https://www.youtube.com/watch?v=rw4s4M3hFfs", duration: "15:42" },
    ],
  },
];

const DATA_ENGINEER_ROADMAP: RoadmapPhase[] = [
  {
    title: "Phase 1: Python & SQL Mastery",
    skills: ["Python", "SQL (Advanced)", "PostgreSQL/MySQL", "Data Modeling", "ETL Concepts"],
    resources: [
      { name: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/" },
      { name: "SQLBolt", url: "https://sqlbolt.com" },
    ],
    videos: [
      { title: "SQL Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", duration: "4:20:37" },
      { title: "Python for Data Engineering", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=PHsC_t0j1dU", duration: "4:53:22" },
    ],
  },
  {
    title: "Phase 2: Big Data & Cloud",
    skills: ["Apache Spark", "Hadoop", "Kafka", "AWS/GCP/Azure", "Data Warehousing", "Snowflake/BigQuery"],
    resources: [
      { name: "Databricks Free Training", url: "https://www.databricks.com/learn" },
      { name: "Google Cloud Free Tier", url: "https://cloud.google.com/free" },
    ],
    videos: [
      { title: "Apache Spark Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=_C8kWso4ne4", duration: "4:12:33" },
      { title: "Kafka Tutorial", channel: "Confluent", url: "https://www.youtube.com/watch?v=B5j3uNBH8X4", duration: "1:38:42" },
    ],
  },
  {
    title: "Phase 3: Data Pipelines & Orchestration",
    skills: ["Apache Airflow", "dbt", "CI/CD for Data", "Docker", "Data Quality Testing"],
    resources: [
      { name: "Airflow Documentation", url: "https://airflow.apache.org/docs/" },
      { name: "dbt Learn", url: "https://courses.getdbt.com/" },
    ],
    videos: [
      { title: "Data Engineering Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=PHsC_t0j1dU", duration: "4:53:22" },
      { title: "Apache Airflow Tutorial", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=K9AnJ9_ZAXE", duration: "38:42" },
    ],
  },
  {
    title: "Phase 4: Interview & Portfolio",
    skills: ["Data Pipeline Projects", "Real-time Streaming Projects", "System Design for Data", "Resume with Data Projects"],
    resources: [
      { name: "DataEngineer.io", url: "https://dataengineer.io" },
      { name: "Seattle Data Guy (YouTube)", url: "https://www.youtube.com/@SeattleDataGuy" },
    ],
    videos: [
      { title: "Data Engineering Interview Questions", channel: "Darshil Parmar", url: "https://www.youtube.com/watch?v=w8tiMIwHuOE", duration: "32:18" },
    ],
  },
];

const AI_ML_ROADMAP: RoadmapPhase[] = [
  {
    title: "Phase 1: Math & Python",
    skills: ["Linear Algebra", "Statistics & Probability", "Calculus", "NumPy & Pandas", "Python"],
    resources: [
      { name: "3Blue1Brown (Linear Algebra)", url: "https://www.3blue1brown.com/topics/linear-algebra" },
      { name: "Khan Academy Statistics", url: "https://www.khanacademy.org/math/statistics-probability" },
    ],
    videos: [
      { title: "Mathematics for Machine Learning", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=LlKAna21fLE", duration: "5:40:00" },
      { title: "Essence of Linear Algebra", channel: "3Blue1Brown", url: "https://www.youtube.com/watch?v=fNk_zzaMoSs", duration: "15:45" },
    ],
  },
  {
    title: "Phase 2: Machine Learning",
    skills: ["Supervised Learning", "Unsupervised Learning", "Scikit-Learn", "Feature Engineering", "Model Evaluation"],
    resources: [
      { name: "Andrew Ng ML Course", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
      { name: "Kaggle Learn", url: "https://www.kaggle.com/learn" },
    ],
    videos: [
      { title: "Machine Learning Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=7eh4d6sabA0", duration: "5:45:22" },
      { title: "ML in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=PeMlggyqz0Y", duration: "3:16" },
    ],
  },
  {
    title: "Phase 3: Deep Learning & LLMs",
    skills: ["Neural Networks", "PyTorch/TensorFlow", "CNNs & RNNs", "Transformers", "LLM Fine-tuning", "Prompt Engineering"],
    resources: [
      { name: "Fast.ai (Free Course)", url: "https://www.fast.ai" },
      { name: "Hugging Face Course", url: "https://huggingface.co/course" },
      { name: "DeepLearning.AI Short Courses", url: "https://www.deeplearning.ai/short-courses/" },
    ],
    videos: [
      { title: "Neural Networks from Scratch", channel: "3Blue1Brown", url: "https://www.youtube.com/watch?v=aircAruvnKk", duration: "19:13" },
      { title: "PyTorch Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=V_xro1bcAuA", duration: "9:49:33" },
      { title: "How LLMs Work", channel: "3Blue1Brown", url: "https://www.youtube.com/watch?v=wjZofJX0v4M", duration: "27:14" },
    ],
  },
  {
    title: "Phase 4: Deploy & Interview",
    skills: ["MLOps", "Model Deployment", "FastAPI", "Docker", "ML System Design", "Research Papers"],
    resources: [
      { name: "Made With ML", url: "https://madewithml.com" },
      { name: "Papers With Code", url: "https://paperswithcode.com" },
    ],
    videos: [
      { title: "MLOps Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=Vuw_GUvL-sE", duration: "3:22:17" },
      { title: "Deploy ML Models with FastAPI", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=h5wLuVDr0oc", duration: "48:23" },
    ],
  },
];

const FRONTEND_ROADMAP: RoadmapPhase[] = [
  {
    title: "Phase 1: Web Fundamentals",
    skills: ["HTML5", "CSS3", "JavaScript (ES6+)", "Responsive Design", "Git"],
    resources: [
      { name: "MDN Web Docs", url: "https://developer.mozilla.org" },
      { name: "freeCodeCamp", url: "https://www.freecodecamp.org" },
    ],
    videos: [
      { title: "HTML & CSS Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=a_iQb1lnAEQ", duration: "11:55:01" },
      { title: "JavaScript Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", duration: "3:26:42" },
    ],
  },
  {
    title: "Phase 2: React & Modern Frameworks",
    skills: ["React", "TypeScript", "Next.js", "State Management", "Tailwind CSS"],
    resources: [
      { name: "React Docs", url: "https://react.dev" },
      { name: "Next.js Learn", url: "https://nextjs.org/learn" },
    ],
    videos: [
      { title: "React Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=bMknfKXIFA8", duration: "11:55:27" },
      { title: "TypeScript Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=30LWjhZzg50", duration: "1:34:08" },
    ],
  },
  {
    title: "Phase 3: Testing & Performance",
    skills: ["Jest/Vitest", "React Testing Library", "Playwright", "Web Vitals", "Accessibility (a11y)"],
    resources: [
      { name: "Testing Library Docs", url: "https://testing-library.com" },
      { name: "web.dev Performance", url: "https://web.dev/performance/" },
    ],
    videos: [
      { title: "React Testing Tutorial", channel: "Codevolution", url: "https://www.youtube.com/watch?v=T2sv8jXoP4s", duration: "2:44:27" },
      { title: "Web Performance", channel: "Google Chrome Developers", url: "https://www.youtube.com/watch?v=AQqFZ5t8uNc", duration: "14:32" },
    ],
  },
  {
    title: "Phase 4: Portfolio & Interview",
    skills: ["Portfolio Website", "Open Source PRs", "UI/UX Principles", "Frontend System Design"],
    resources: [
      { name: "Frontend Masters (free workshops)", url: "https://frontendmasters.com/courses/" },
      { name: "GreatFrontEnd", url: "https://www.greatfrontend.com" },
    ],
    videos: [
      { title: "Frontend Developer Portfolio Tips", channel: "Fireship", url: "https://www.youtube.com/watch?v=0fYi8SGA20k", duration: "7:10" },
    ],
  },
];

const DEVOPS_ROADMAP: RoadmapPhase[] = [
  {
    title: "Phase 1: Linux & Networking",
    skills: ["Linux Administration", "Bash Scripting", "Networking (TCP/IP, DNS)", "SSH & Security Basics"],
    resources: [
      { name: "Linux Journey", url: "https://linuxjourney.com" },
      { name: "OverTheWire Wargames", url: "https://overthewire.org/wargames/" },
    ],
    videos: [
      { title: "Linux Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=sWbUDq4S6Y8", duration: "5:22:51" },
      { title: "Bash Scripting Tutorial", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=e7BufAVwDiM", duration: "2:29:12" },
    ],
  },
  {
    title: "Phase 2: Containers & CI/CD",
    skills: ["Docker", "Docker Compose", "GitHub Actions", "Jenkins", "GitLab CI"],
    resources: [
      { name: "Docker Docs", url: "https://docs.docker.com" },
      { name: "GitHub Skills", url: "https://skills.github.com" },
    ],
    videos: [
      { title: "Docker Tutorial", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=pg19Z8LL06w", duration: "1:07:42" },
      { title: "GitHub Actions Tutorial", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", duration: "32:35" },
    ],
  },
  {
    title: "Phase 3: Orchestration & Cloud",
    skills: ["Kubernetes", "Helm", "Terraform", "AWS/GCP/Azure", "Monitoring (Prometheus, Grafana)"],
    resources: [
      { name: "Kubernetes Docs", url: "https://kubernetes.io/docs/" },
      { name: "Terraform Learn", url: "https://developer.hashicorp.com/terraform/tutorials" },
    ],
    videos: [
      { title: "Kubernetes Tutorial", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=X48VuDVv0do", duration: "3:36:52" },
      { title: "Terraform Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=SLB_c_ayRMo", duration: "2:22:53" },
    ],
  },
  {
    title: "Phase 4: SRE & Interview",
    skills: ["SRE Principles", "Incident Management", "SLA/SLO/SLI", "Chaos Engineering", "DevOps Culture"],
    resources: [
      { name: "Google SRE Book (Free)", url: "https://sre.google/sre-book/table-of-contents/" },
      { name: "DevOps Roadmap", url: "https://roadmap.sh/devops" },
    ],
    videos: [
      { title: "DevOps Roadmap 2024", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=9pZ2xmsSDdo", duration: "16:32" },
    ],
  },
];

const CLOUD_ROADMAP: RoadmapPhase[] = [
  {
    title: "Phase 1: Cloud Fundamentals",
    skills: ["Cloud Concepts", "AWS/GCP/Azure Basics", "Networking", "IAM & Security", "Compute & Storage"],
    resources: [
      { name: "AWS Skill Builder", url: "https://skillbuilder.aws" },
      { name: "Google Cloud Skills Boost", url: "https://www.cloudskillsboost.google" },
    ],
    videos: [
      { title: "AWS Cloud Practitioner", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=SOTamWNgDKc", duration: "13:12:28" },
      { title: "Cloud Computing Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=M988_fsOSWo", duration: "3:41:35" },
    ],
  },
  {
    title: "Phase 2: Cloud Architecture",
    skills: ["Serverless", "Containers on Cloud", "CDN & Load Balancing", "Database Services", "Cost Optimization"],
    resources: [
      { name: "AWS Architecture Center", url: "https://aws.amazon.com/architecture/" },
      { name: "GCP Architecture", url: "https://cloud.google.com/architecture" },
    ],
    videos: [
      { title: "AWS Solutions Architect", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=Ia-UEYYR44s", duration: "10:30:32" },
    ],
  },
  {
    title: "Phase 3: IaC & Automation",
    skills: ["Terraform", "CloudFormation", "Ansible", "CI/CD Pipelines", "Monitoring & Logging"],
    resources: [
      { name: "Terraform Tutorials", url: "https://developer.hashicorp.com/terraform/tutorials" },
    ],
    videos: [
      { title: "Terraform Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=SLB_c_ayRMo", duration: "2:22:53" },
    ],
  },
  {
    title: "Phase 4: Certifications & Career",
    skills: ["AWS SAA / GCP ACE / Azure AZ-104", "Cloud Security", "Multi-Cloud Strategy", "FinOps"],
    resources: [
      { name: "Cloud Resume Challenge", url: "https://cloudresumechallenge.dev" },
      { name: "A Cloud Guru (free tier)", url: "https://acloudguru.com" },
    ],
    videos: [
      { title: "Cloud Career Roadmap", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=9pZ2xmsSDdo", duration: "16:32" },
    ],
  },
];

const CYBER_ROADMAP: RoadmapPhase[] = [
  {
    title: "Phase 1: Networking & OS Fundamentals",
    skills: ["TCP/IP, DNS, HTTP", "Linux Administration", "Windows Security", "Wireshark", "Scripting (Python/Bash)"],
    resources: [
      { name: "TryHackMe Pre-Security", url: "https://tryhackme.com/paths" },
      { name: "Cisco Networking Academy", url: "https://www.netacad.com" },
    ],
    videos: [
      { title: "Networking Fundamentals", channel: "NetworkChuck", url: "https://www.youtube.com/watch?v=qiQR5rTSshw", duration: "1:58:38" },
      { title: "Cybersecurity Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=U_P23SqJaDc", duration: "15:43:24" },
    ],
  },
  {
    title: "Phase 2: Security Concepts",
    skills: ["OWASP Top 10", "Cryptography", "Authentication", "Firewalls & IDS", "SIEM Tools"],
    resources: [
      { name: "OWASP", url: "https://owasp.org" },
      { name: "HackTheBox Academy", url: "https://academy.hackthebox.com" },
    ],
    videos: [
      { title: "OWASP Top 10", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=rWHvp7rUka8", duration: "2:13:20" },
      { title: "Ethical Hacking Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=3Kq1MIfTWCE", duration: "15:23:00" },
    ],
  },
  {
    title: "Phase 3: Offensive & Defensive Security",
    skills: ["Penetration Testing", "Bug Bounty", "Incident Response", "Digital Forensics", "Kali Linux"],
    resources: [
      { name: "TryHackMe", url: "https://tryhackme.com" },
      { name: "PortSwigger Web Academy", url: "https://portswigger.net/web-security" },
    ],
    videos: [
      { title: "Kali Linux Tutorial", channel: "NetworkChuck", url: "https://www.youtube.com/watch?v=lZAoFs75_cs", duration: "18:32" },
    ],
  },
  {
    title: "Phase 4: Certifications & Career",
    skills: ["CompTIA Security+", "CEH", "OSCP", "SOC Analyst Skills", "Cloud Security"],
    resources: [
      { name: "CompTIA Security+ Prep", url: "https://www.comptia.org/certifications/security" },
    ],
    videos: [
      { title: "CompTIA Security+ Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=O4pJeXgOJNs", duration: "13:45:22" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Company Data
// ---------------------------------------------------------------------------

export const COMPANIES: Company[] = [
  // ======================== GLOBAL MNCs ========================
  {
    id: "google",
    name: "Google",
    emoji: "🔍",
    description: "World's leading search and cloud technology company. Known for challenging interviews and innovative products.",
    careersUrl: "https://careers.google.com",
    tags: ["global", "faang", "tech"],
    roles: [
      { id: "google-swe", title: "Software Engineer", description: "Build large-scale distributed systems powering Google Search, YouTube, Cloud, and Android.", salary: "$150K-$350K (US) / ₹25-80 LPA (India)", requirements: ["DSA proficiency", "System Design", "1+ programming language (Python/Java/C++/Go)", "CS fundamentals", "Problem solving"], roadmap: SWE_ROADMAP },
      { id: "google-fe", title: "Frontend Engineer", description: "Build world-class web UIs for Google products using Angular, TypeScript, and internal frameworks.", salary: "$140K-$320K (US) / ₹22-70 LPA (India)", requirements: ["JavaScript/TypeScript", "Angular or React", "HTML/CSS", "Web Performance", "A11y"], roadmap: FRONTEND_ROADMAP },
      { id: "google-ml", title: "ML Engineer", description: "Build and deploy machine learning models for Search, Ads, YouTube recommendations, and Google AI.", salary: "$160K-$400K (US) / ₹30-90 LPA (India)", requirements: ["ML/DL frameworks", "Math (Linear Algebra, Stats)", "Python", "TensorFlow/JAX", "Research papers"], roadmap: AI_ML_ROADMAP },
      { id: "google-sre", title: "Site Reliability Engineer", description: "Keep Google's infrastructure running at planet scale. The birthplace of SRE.", salary: "$150K-$350K (US) / ₹25-75 LPA (India)", requirements: ["Linux", "Distributed Systems", "Monitoring", "Python/Go", "Networking"], roadmap: DEVOPS_ROADMAP },
      { id: "google-de", title: "Data Engineer", description: "Build data pipelines powering analytics and ML across Google products using BigQuery, Dataflow.", salary: "$140K-$330K (US) / ₹22-65 LPA (India)", requirements: ["SQL", "Python", "BigQuery/Spark", "Data Modeling", "ETL/ELT"], roadmap: DATA_ENGINEER_ROADMAP },
    ],
  },
  {
    id: "microsoft",
    name: "Microsoft",
    emoji: "🪟",
    description: "Global leader in cloud (Azure), productivity (Office 365), gaming (Xbox), and AI (Copilot, OpenAI).",
    careersUrl: "https://careers.microsoft.com",
    tags: ["global", "faang", "tech", "cloud"],
    roles: [
      { id: "ms-swe", title: "Software Engineer", description: "Build products across Azure, Windows, Office 365, Teams, and GitHub.", salary: "$140K-$320K (US) / ₹20-70 LPA (India)", requirements: ["C#/.NET or Java or Python", "DSA", "System Design", "Cloud Basics", "OOP"], roadmap: SWE_ROADMAP },
      { id: "ms-cloud", title: "Cloud Solutions Architect", description: "Design and implement Azure-based solutions for enterprise customers.", salary: "$150K-$300K (US) / ₹25-60 LPA (India)", requirements: ["Azure Services", "Networking", "IaC", "Security", "Architecture Patterns"], roadmap: CLOUD_ROADMAP },
      { id: "ms-ai", title: "AI/ML Engineer", description: "Build AI features for Copilot, Bing, and Azure AI services.", salary: "$160K-$380K (US) / ₹30-85 LPA (India)", requirements: ["Python", "PyTorch/TensorFlow", "NLP/LLMs", "Azure ML", "Math"], roadmap: AI_ML_ROADMAP },
      { id: "ms-de", title: "Data Engineer", description: "Build data infrastructure on Azure using Synapse, Data Factory, and Databricks.", salary: "$130K-$280K (US) / ₹18-55 LPA (India)", requirements: ["SQL", "Python", "Azure Data Services", "Spark", "Data Modeling"], roadmap: DATA_ENGINEER_ROADMAP },
    ],
  },
  {
    id: "amazon",
    name: "Amazon",
    emoji: "📦",
    description: "E-commerce giant and AWS cloud leader. Leadership Principles drive the hiring culture.",
    careersUrl: "https://www.amazon.jobs",
    tags: ["global", "faang", "tech", "ecommerce"],
    roles: [
      { id: "amz-sde", title: "SDE (Software Dev Engineer)", description: "Build scalable systems for Amazon retail, AWS, Alexa, Prime Video, and logistics.", salary: "$140K-$350K (US) / ₹20-75 LPA (India)", requirements: ["DSA", "System Design", "Java or Python", "Leadership Principles", "OOP"], roadmap: SWE_ROADMAP },
      { id: "amz-de", title: "Data Engineer", description: "Build data pipelines for Amazon's massive retail and AWS data ecosystem.", salary: "$130K-$300K (US) / ₹18-60 LPA (India)", requirements: ["SQL", "Python/Scala", "Spark/EMR", "Redshift", "Data Modeling"], roadmap: DATA_ENGINEER_ROADMAP },
      { id: "amz-devops", title: "DevOps Engineer", description: "Manage CI/CD, infrastructure, and deployment for AWS services at scale.", salary: "$140K-$300K (US) / ₹20-55 LPA (India)", requirements: ["AWS", "Docker/K8s", "CI/CD", "Terraform", "Linux"], roadmap: DEVOPS_ROADMAP },
      { id: "amz-ml", title: "Applied Scientist", description: "Apply ML to Amazon products — recommendations, Alexa NLU, fraud detection.", salary: "$170K-$400K (US) / ₹35-90 LPA (India)", requirements: ["PhD/MS preferred", "ML/DL", "Python", "Research", "Math"], roadmap: AI_ML_ROADMAP },
    ],
  },
  {
    id: "meta",
    name: "Meta",
    emoji: "Ⓜ️",
    description: "Social media leader (Facebook, Instagram, WhatsApp) and metaverse/VR pioneer.",
    careersUrl: "https://www.metacareers.com",
    tags: ["global", "faang", "tech", "social"],
    roles: [
      { id: "meta-swe", title: "Software Engineer", description: "Build features for billions of users across Facebook, Instagram, and WhatsApp.", salary: "$150K-$400K (US) / ₹28-85 LPA (India)", requirements: ["DSA", "System Design", "Python/C++/Java", "Scalability", "Product Sense"], roadmap: SWE_ROADMAP },
      { id: "meta-fe", title: "Frontend Engineer", description: "Build React-based UIs for Facebook, Instagram. Meta created React!", salary: "$140K-$370K (US) / ₹25-75 LPA (India)", requirements: ["React (advanced)", "JavaScript/TypeScript", "GraphQL", "Performance", "Testing"], roadmap: FRONTEND_ROADMAP },
      { id: "meta-ml", title: "ML Engineer", description: "Build ML for content ranking, ads, integrity, and AR/VR at Meta.", salary: "$160K-$420K (US) / ₹30-90 LPA (India)", requirements: ["PyTorch", "Python", "ML/DL", "Distributed Training", "Math"], roadmap: AI_ML_ROADMAP },
    ],
  },
  {
    id: "apple",
    name: "Apple",
    emoji: "🍎",
    description: "World's most valuable company. Known for hardware-software integration and premium user experience.",
    careersUrl: "https://www.apple.com/careers/",
    tags: ["global", "faang", "tech", "hardware"],
    roles: [
      { id: "apple-swe", title: "Software Engineer", description: "Build iOS, macOS, and backend systems powering Apple services.", salary: "$150K-$350K (US) / ₹25-70 LPA (India)", requirements: ["Swift/Objective-C or C++", "DSA", "System Design", "iOS/macOS", "Concurrency"], roadmap: SWE_ROADMAP },
      { id: "apple-ml", title: "ML/AI Engineer", description: "Build on-device ML for Siri, Photos, and Apple Intelligence.", salary: "$160K-$400K (US) / ₹30-80 LPA (India)", requirements: ["ML/DL", "On-device ML", "Core ML", "Python", "Math"], roadmap: AI_ML_ROADMAP },
    ],
  },
  {
    id: "netflix",
    name: "Netflix",
    emoji: "🎬",
    description: "Streaming giant known for top-of-market pay and freedom & responsibility culture.",
    careersUrl: "https://jobs.netflix.com",
    tags: ["global", "faang", "tech", "media"],
    roles: [
      { id: "nf-swe", title: "Senior Software Engineer", description: "Build streaming platform, content delivery, and personalization systems.", salary: "$200K-$500K (US)", requirements: ["Java/Python", "Microservices", "System Design", "Distributed Systems", "5+ years experience"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    emoji: "🟢",
    description: "GPU and AI computing leader. Powers the AI revolution with CUDA, Tensor Cores, and DGX.",
    careersUrl: "https://www.nvidia.com/en-us/about-nvidia/careers/",
    tags: ["global", "tech", "ai", "hardware"],
    roles: [
      { id: "nv-swe", title: "Software Engineer", description: "Build GPU drivers, CUDA toolkit, and deep learning frameworks.", salary: "$150K-$380K (US) / ₹25-80 LPA (India)", requirements: ["C/C++", "CUDA", "GPU Architecture", "Linux", "Performance Optimization"], roadmap: SWE_ROADMAP },
      { id: "nv-ml", title: "Deep Learning Engineer", description: "Research and deploy cutting-edge AI models for autonomous vehicles, robotics, and NLP.", salary: "$170K-$420K (US) / ₹35-95 LPA (India)", requirements: ["PyTorch/TensorFlow", "CUDA", "Deep Learning", "Python/C++", "Research"], roadmap: AI_ML_ROADMAP },
    ],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    emoji: "☁️",
    description: "World's #1 CRM platform. Pioneered cloud SaaS and known for great work culture.",
    careersUrl: "https://www.salesforce.com/company/careers/",
    tags: ["global", "tech", "saas", "cloud"],
    roles: [
      { id: "sf-swe", title: "Software Engineer", description: "Build enterprise cloud products on Salesforce Platform, Slack, and Tableau.", salary: "$130K-$280K (US) / ₹18-50 LPA (India)", requirements: ["Java/Apex", "JavaScript/LWC", "REST APIs", "Salesforce Platform", "SQL"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "uber",
    name: "Uber",
    emoji: "🚗",
    description: "Ride-hailing and delivery platform operating globally. Engineering-driven culture.",
    careersUrl: "https://www.uber.com/us/en/careers/",
    tags: ["global", "tech", "mobility"],
    roles: [
      { id: "uber-swe", title: "Software Engineer", description: "Build real-time systems for ride matching, pricing, mapping, and payments.", salary: "$140K-$340K (US) / ₹22-65 LPA (India)", requirements: ["Go/Java/Python", "Microservices", "System Design", "DSA", "Real-time Systems"], roadmap: SWE_ROADMAP },
      { id: "uber-de", title: "Data Engineer", description: "Build massive data infrastructure powering Uber's analytics and ML.", salary: "$130K-$300K (US) / ₹20-55 LPA (India)", requirements: ["Spark", "Kafka", "SQL", "Python", "Data Warehousing"], roadmap: DATA_ENGINEER_ROADMAP },
    ],
  },

  // ======================== INDIAN COMPANIES ========================
  {
    id: "tcs",
    name: "TCS (Tata Consultancy Services)",
    emoji: "🏢",
    description: "India's largest IT services company. Part of Tata Group. Massive hiring for freshers.",
    careersUrl: "https://www.tcs.com/careers",
    tags: ["india", "it-services", "fresher-friendly"],
    roles: [
      { id: "tcs-swe", title: "Systems Engineer", description: "Work on enterprise projects across domains — banking, retail, telecom, healthcare.", salary: "₹3.5-7 LPA (fresher) / ₹8-25 LPA (experienced)", requirements: ["Java/Python/C", "Basic DSA", "SQL", "DBMS", "OS Concepts", "Aptitude"], roadmap: SWE_ROADMAP },
      { id: "tcs-de", title: "Data Engineer", description: "Build ETL pipelines and data solutions for TCS enterprise clients.", salary: "₹5-15 LPA", requirements: ["SQL", "Python", "ETL Tools", "Cloud Basics", "Data Warehousing"], roadmap: DATA_ENGINEER_ROADMAP },
      { id: "tcs-devops", title: "DevOps Engineer", description: "Manage CI/CD and infrastructure for client projects.", salary: "₹5-18 LPA", requirements: ["Linux", "Docker", "Jenkins", "AWS/Azure", "Scripting"], roadmap: DEVOPS_ROADMAP },
    ],
  },
  {
    id: "infosys",
    name: "Infosys",
    emoji: "🏛️",
    description: "Global IT services leader founded by Narayana Murthy. Strong training programs for freshers.",
    careersUrl: "https://www.infosys.com/careers/",
    tags: ["india", "it-services", "fresher-friendly"],
    roles: [
      { id: "infy-se", title: "Systems Engineer", description: "Enterprise software development and maintenance across global clients.", salary: "₹3.6-6.5 LPA (fresher) / ₹8-22 LPA (experienced)", requirements: ["Java/Python", "Basic DSA", "SQL", "Web Basics", "Aptitude"], roadmap: SWE_ROADMAP },
      { id: "infy-pp", title: "Power Programmer", description: "Elite role for strong coders. Product engineering and R&D projects.", salary: "₹6.5-9.5 LPA (fresher) / ₹15-35 LPA (experienced)", requirements: ["Strong DSA", "Competitive Programming", "System Design", "Full Stack", "Problem Solving"], roadmap: SWE_ROADMAP },
      { id: "infy-de", title: "Data Engineer", description: "Build data pipelines for Infosys analytics and client data platforms.", salary: "₹5-18 LPA", requirements: ["SQL", "Python", "Spark", "Cloud (AWS/Azure)", "ETL"], roadmap: DATA_ENGINEER_ROADMAP },
    ],
  },
  {
    id: "wipro",
    name: "Wipro",
    emoji: "🌻",
    description: "Major Indian IT services company. Known for digital transformation and consulting.",
    careersUrl: "https://careers.wipro.com",
    tags: ["india", "it-services", "fresher-friendly"],
    roles: [
      { id: "wipro-se", title: "Project Engineer", description: "Software development and maintenance for enterprise clients.", salary: "₹3.5-6 LPA (fresher) / ₹7-20 LPA (experienced)", requirements: ["Java/Python", "SQL", "Basic DSA", "Web Development", "Communication"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "flipkart",
    name: "Flipkart",
    emoji: "🛒",
    description: "India's largest e-commerce company (Walmart-owned). Challenging engineering problems at scale.",
    careersUrl: "https://www.flipkartcareers.com",
    tags: ["india", "ecommerce", "startup"],
    roles: [
      { id: "fk-sde", title: "SDE (Software Dev Engineer)", description: "Build India's largest e-commerce platform — search, catalog, payments, logistics.", salary: "₹18-50 LPA", requirements: ["Java", "DSA (strong)", "System Design", "Microservices", "Databases"], roadmap: SWE_ROADMAP },
      { id: "fk-de", title: "Data Engineer", description: "Build data pipelines for one of India's largest data platforms.", salary: "₹16-40 LPA", requirements: ["Spark", "SQL", "Python/Scala", "Hadoop", "Data Modeling"], roadmap: DATA_ENGINEER_ROADMAP },
      { id: "fk-ml", title: "ML Engineer", description: "Build recommendation, search ranking, and pricing models.", salary: "₹20-55 LPA", requirements: ["ML/DL", "Python", "Spark", "NLP", "Math"], roadmap: AI_ML_ROADMAP },
    ],
  },
  {
    id: "zomato",
    name: "Zomato",
    emoji: "🍕",
    description: "India's leading food delivery and restaurant platform. Fast-paced startup culture.",
    careersUrl: "https://www.zomato.com/careers",
    tags: ["india", "foodtech", "startup"],
    roles: [
      { id: "zom-sde", title: "Software Engineer", description: "Build food ordering, delivery tracking, and restaurant management systems.", salary: "₹15-45 LPA", requirements: ["Go/Java/Python", "DSA", "System Design", "APIs", "Databases"], roadmap: SWE_ROADMAP },
      { id: "zom-fe", title: "Frontend Engineer", description: "Build Zomato's web and mobile interfaces used by millions daily.", salary: "₹14-40 LPA", requirements: ["React/React Native", "JavaScript/TypeScript", "CSS", "Performance", "Testing"], roadmap: FRONTEND_ROADMAP },
      { id: "zom-de", title: "Data Engineer", description: "Real-time data pipelines for delivery optimization and analytics.", salary: "₹15-38 LPA", requirements: ["Python", "SQL", "Kafka", "Spark", "Airflow"], roadmap: DATA_ENGINEER_ROADMAP },
    ],
  },
  {
    id: "swiggy",
    name: "Swiggy",
    emoji: "🧡",
    description: "India's leading on-demand delivery platform — food, groceries, and more.",
    careersUrl: "https://careers.swiggy.com",
    tags: ["india", "foodtech", "startup"],
    roles: [
      { id: "sw-sde", title: "SDE", description: "Build high-throughput systems for ordering, delivery, and logistics.", salary: "₹16-45 LPA", requirements: ["Java/Go", "DSA", "System Design", "Microservices", "Redis/Kafka"], roadmap: SWE_ROADMAP },
      { id: "sw-ml", title: "ML Engineer", description: "Build demand forecasting, route optimization, and personalization models.", salary: "₹18-50 LPA", requirements: ["ML/DL", "Python", "Feature Engineering", "Production ML", "Math"], roadmap: AI_ML_ROADMAP },
    ],
  },
  {
    id: "razorpay-company",
    name: "Razorpay",
    emoji: "💳",
    description: "India's leading fintech platform for payments, banking, and business solutions.",
    careersUrl: "https://razorpay.com/careers/",
    tags: ["india", "fintech", "startup"],
    roles: [
      { id: "rp-sde", title: "Software Engineer", description: "Build India's payment infrastructure handling billions in transactions.", salary: "₹18-50 LPA", requirements: ["Go/Java", "DSA", "System Design", "Payments Domain", "Security"], roadmap: SWE_ROADMAP },
      { id: "rp-fe", title: "Frontend Engineer", description: "Build checkout experiences, dashboards, and SDKs used by millions of merchants.", salary: "₹15-40 LPA", requirements: ["React", "TypeScript", "Web Security", "Performance", "SDK Development"], roadmap: FRONTEND_ROADMAP },
    ],
  },
  {
    id: "paytm-company",
    name: "Paytm",
    emoji: "💰",
    description: "India's digital payments pioneer. Wallet, UPI, lending, insurance, and e-commerce.",
    careersUrl: "https://paytm.com/careers",
    tags: ["india", "fintech", "payments"],
    roles: [
      { id: "ptm-sde", title: "Software Engineer", description: "Build payments, wallet, and financial services platforms.", salary: "₹12-35 LPA", requirements: ["Java/Python", "DSA", "System Design", "REST APIs", "Microservices"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "cred",
    name: "CRED",
    emoji: "💎",
    description: "Premium fintech platform for credit card management and rewards. Known for high pay.",
    careersUrl: "https://careers.cred.club",
    tags: ["india", "fintech", "startup"],
    roles: [
      { id: "cred-sde", title: "Software Engineer", description: "Build premium fintech products for India's creditworthy users.", salary: "₹22-60 LPA", requirements: ["Java/Kotlin", "DSA (strong)", "System Design", "Spring Boot", "Microservices"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "phonepe-company",
    name: "PhonePe",
    emoji: "📱",
    description: "India's #1 UPI payments app. Walmart-backed. Massive scale with 500M+ users.",
    careersUrl: "https://www.phonepe.com/careers/",
    tags: ["india", "fintech", "payments"],
    roles: [
      { id: "pp-sde", title: "Software Engineer", description: "Build India's most-used UPI payments platform at massive scale.", salary: "₹18-55 LPA", requirements: ["Java", "DSA", "System Design", "High Throughput Systems", "Databases"], roadmap: SWE_ROADMAP },
      { id: "pp-de", title: "Data Engineer", description: "Real-time data processing for fraud detection and analytics.", salary: "₹16-42 LPA", requirements: ["Spark", "Kafka", "SQL", "Python", "Real-time Processing"], roadmap: DATA_ENGINEER_ROADMAP },
    ],
  },
  {
    id: "meesho",
    name: "Meesho",
    emoji: "🛍️",
    description: "India's fastest-growing social commerce platform. Democratizing e-commerce.",
    careersUrl: "https://www.meesho.io/careers",
    tags: ["india", "ecommerce", "startup"],
    roles: [
      { id: "mee-sde", title: "SDE", description: "Build social commerce at scale — catalog, payments, logistics, seller tools.", salary: "₹16-50 LPA", requirements: ["Java/Go", "DSA", "System Design", "Distributed Systems", "SQL"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "dream11",
    name: "Dream11",
    emoji: "🏏",
    description: "India's biggest fantasy sports platform. Handles extreme traffic spikes during IPL.",
    careersUrl: "https://www.dreamsports.group/careers",
    tags: ["india", "sports-tech", "startup"],
    roles: [
      { id: "d11-sde", title: "Software Engineer", description: "Build high-concurrency systems handling millions of simultaneous users during live matches.", salary: "₹18-55 LPA", requirements: ["Go/Java", "System Design", "High Concurrency", "DSA", "Redis/Kafka"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "zerodha",
    name: "Zerodha",
    emoji: "📈",
    description: "India's largest stock broker. Bootstrap, profitable, engineering-first culture.",
    careersUrl: "https://zerodha.com/careers/",
    tags: ["india", "fintech", "trading"],
    roles: [
      { id: "zd-sde", title: "Software Engineer", description: "Build India's most popular trading platform (Kite). Low-latency, high-reliability.", salary: "₹15-45 LPA", requirements: ["Go/Python", "Low Latency Systems", "Linux", "Databases", "Financial Domain"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "ola",
    name: "Ola",
    emoji: "🛺",
    description: "India's ride-hailing platform and EV manufacturer (Ola Electric).",
    careersUrl: "https://www.olacabs.com/careers",
    tags: ["india", "mobility", "ev"],
    roles: [
      { id: "ola-sde", title: "Software Engineer", description: "Build ride-matching, pricing, and logistics systems for India's mobility platform.", salary: "₹14-40 LPA", requirements: ["Java/Go", "DSA", "System Design", "Microservices", "Maps/Geo"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "hcl",
    name: "HCL Technologies",
    emoji: "🔷",
    description: "Top 3 Indian IT services company. Strong in infrastructure and engineering services.",
    careersUrl: "https://www.hcltech.com/careers",
    tags: ["india", "it-services", "fresher-friendly"],
    roles: [
      { id: "hcl-se", title: "Software Engineer", description: "Enterprise application development and cloud migration for global clients.", salary: "₹3.5-7 LPA (fresher) / ₹8-22 LPA (experienced)", requirements: ["Java/Python", "SQL", "Basic DSA", "Cloud Basics", "Aptitude"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "tech-mahindra",
    name: "Tech Mahindra",
    emoji: "🔴",
    description: "Part of Mahindra Group. Specializes in telecom, digital transformation, and consulting.",
    careersUrl: "https://careers.techmahindra.com",
    tags: ["india", "it-services", "fresher-friendly"],
    roles: [
      { id: "tm-se", title: "Software Engineer", description: "Build telecom and enterprise solutions for global clients.", salary: "₹3.5-6 LPA (fresher) / ₹7-20 LPA (experienced)", requirements: ["Java/Python", "SQL", "Networking Basics", "Web Development", "Communication"], roadmap: SWE_ROADMAP },
    ],
  },

  // ======================== MORE GLOBAL MNCs (India Presence) ========================
  {
    id: "oracle",
    name: "Oracle",
    emoji: "🔶",
    description: "Enterprise software giant — databases, cloud (OCI), ERP, and Java. Major India R&D centers in Bangalore & Hyderabad.",
    careersUrl: "https://www.oracle.com/careers/",
    tags: ["global", "tech", "cloud", "enterprise"],
    roles: [
      { id: "ora-swe", title: "Software Engineer", description: "Build Oracle Cloud Infrastructure (OCI), database engine, and enterprise apps.", salary: "$130K-$280K (US) / ₹15-45 LPA (India)", requirements: ["Java", "DSA", "System Design", "SQL", "Cloud"], roadmap: SWE_ROADMAP },
      { id: "ora-cloud", title: "Cloud Engineer", description: "Build and maintain Oracle Cloud Infrastructure services.", salary: "$140K-$300K (US) / ₹18-50 LPA (India)", requirements: ["OCI/AWS", "Terraform", "Docker/K8s", "Linux", "Networking"], roadmap: CLOUD_ROADMAP },
      { id: "ora-de", title: "Data Engineer", description: "Build data pipelines and analytics infrastructure on Oracle's platform.", salary: "$125K-$260K (US) / ₹14-40 LPA (India)", requirements: ["SQL (Advanced)", "Python", "Oracle DB", "ETL", "Data Modeling"], roadmap: DATA_ENGINEER_ROADMAP },
    ],
  },
  {
    id: "adobe",
    name: "Adobe",
    emoji: "🎨",
    description: "Creative software leader — Photoshop, Premiere, Experience Cloud. Large India engineering hub in Noida & Bangalore.",
    careersUrl: "https://www.adobe.com/careers.html",
    tags: ["global", "tech", "creative"],
    roles: [
      { id: "adb-swe", title: "Software Engineer", description: "Build Creative Cloud, Document Cloud, and Experience Cloud products.", salary: "$140K-$320K (US) / ₹20-60 LPA (India)", requirements: ["C++/Java/JavaScript", "DSA", "System Design", "APIs", "OOP"], roadmap: SWE_ROADMAP },
      { id: "adb-fe", title: "Frontend Engineer", description: "Build world-class creative tool UIs and web experiences.", salary: "$135K-$300K (US) / ₹18-55 LPA (India)", requirements: ["React/Angular", "TypeScript", "CSS", "Web Components", "Performance"], roadmap: FRONTEND_ROADMAP },
      { id: "adb-ml", title: "ML Engineer", description: "Build AI features like Adobe Sensei for creative and marketing intelligence.", salary: "$155K-$370K (US) / ₹28-75 LPA (India)", requirements: ["Python", "PyTorch/TensorFlow", "Computer Vision", "NLP", "Math"], roadmap: AI_ML_ROADMAP },
    ],
  },
  {
    id: "ibm",
    name: "IBM",
    emoji: "🔵",
    description: "Technology and consulting pioneer. Major India labs in Bangalore. Known for Watson AI, Red Hat, and hybrid cloud.",
    careersUrl: "https://www.ibm.com/careers/",
    tags: ["global", "tech", "cloud", "enterprise"],
    roles: [
      { id: "ibm-swe", title: "Software Engineer", description: "Build hybrid cloud, Red Hat, Watson AI, and enterprise solutions.", salary: "$120K-$260K (US) / ₹8-35 LPA (India)", requirements: ["Java/Python", "Cloud (IBM/AWS)", "Docker/K8s", "REST APIs", "Linux"], roadmap: SWE_ROADMAP },
      { id: "ibm-de", title: "Data Engineer", description: "Build data platforms using IBM Cloud Pak, Db2, and open-source tools.", salary: "$115K-$240K (US) / ₹8-30 LPA (India)", requirements: ["SQL", "Python", "Spark", "IBM Cloud", "ETL"], roadmap: DATA_ENGINEER_ROADMAP },
      { id: "ibm-ml", title: "AI Engineer", description: "Build and deploy Watson AI, NLP, and generative AI solutions.", salary: "$130K-$300K (US) / ₹12-45 LPA (India)", requirements: ["Python", "ML/DL", "NLP", "Watson", "Math"], roadmap: AI_ML_ROADMAP },
    ],
  },
  {
    id: "intel",
    name: "Intel",
    emoji: "💻",
    description: "Semiconductor giant. Major R&D center in Bangalore (India's 2nd largest outside US). Chips, AI, autonomous driving.",
    careersUrl: "https://www.intel.com/content/www/us/en/jobs/jobs-at-intel.html",
    tags: ["global", "tech", "hardware", "ai"],
    roles: [
      { id: "intl-swe", title: "Software Engineer", description: "Build firmware, drivers, compilers, and AI frameworks for Intel hardware.", salary: "$130K-$300K (US) / ₹15-50 LPA (India)", requirements: ["C/C++", "Python", "Linux", "Computer Architecture", "DSA"], roadmap: SWE_ROADMAP },
      { id: "intl-ml", title: "AI/ML Engineer", description: "Build AI acceleration software using Intel oneAPI, OpenVINO, and Habana Gaudi.", salary: "$145K-$350K (US) / ₹20-60 LPA (India)", requirements: ["Python", "PyTorch/TensorFlow", "Model Optimization", "C++", "Math"], roadmap: AI_ML_ROADMAP },
    ],
  },
  {
    id: "qualcomm",
    name: "Qualcomm",
    emoji: "📡",
    description: "Mobile chipset leader (Snapdragon). Major India R&D centers in Hyderabad, Bangalore, and Chennai.",
    careersUrl: "https://www.qualcomm.com/company/careers",
    tags: ["global", "tech", "hardware", "mobile"],
    roles: [
      { id: "qc-swe", title: "Software Engineer", description: "Build mobile platform software, modem firmware, and camera software.", salary: "$130K-$300K (US) / ₹12-45 LPA (India)", requirements: ["C/C++", "Embedded Systems", "Linux", "DSA", "RTOS"], roadmap: SWE_ROADMAP },
      { id: "qc-ml", title: "ML Engineer", description: "Build on-device AI for Snapdragon — camera, NLP, generative AI.", salary: "$140K-$330K (US) / ₹18-55 LPA (India)", requirements: ["Python", "ML/DL", "Model Compression", "C++", "On-device AI"], roadmap: AI_ML_ROADMAP },
    ],
  },
  {
    id: "cisco",
    name: "Cisco",
    emoji: "🌐",
    description: "Networking and cybersecurity leader. India is Cisco's 2nd largest site globally (Bangalore).",
    careersUrl: "https://www.cisco.com/c/en/us/about/careers.html",
    tags: ["global", "tech", "networking", "security"],
    roles: [
      { id: "cis-swe", title: "Software Engineer", description: "Build networking, collaboration (Webex), and security platforms.", salary: "$130K-$280K (US) / ₹12-40 LPA (India)", requirements: ["Python/Go/C++", "Networking", "REST APIs", "Linux", "DSA"], roadmap: SWE_ROADMAP },
      { id: "cis-devops", title: "DevOps/SRE Engineer", description: "Build CI/CD pipelines and infrastructure for Cisco's cloud services.", salary: "$130K-$270K (US) / ₹12-35 LPA (India)", requirements: ["Docker/K8s", "Terraform", "CI/CD", "Monitoring", "Linux"], roadmap: DEVOPS_ROADMAP },
      { id: "cis-sec", title: "Security Engineer", description: "Build cybersecurity products — firewalls, threat intelligence, and zero trust.", salary: "$135K-$290K (US) / ₹14-42 LPA (India)", requirements: ["Network Security", "Python", "SIEM", "Threat Analysis", "Cryptography"], roadmap: CYBER_ROADMAP },
    ],
  },
  {
    id: "goldman-sachs",
    name: "Goldman Sachs",
    emoji: "🏦",
    description: "Top investment bank. One of the largest tech employers in Bangalore. Engineering-driven culture.",
    careersUrl: "https://www.goldmansachs.com/careers/",
    tags: ["global", "finance", "banking"],
    roles: [
      { id: "gs-swe", title: "Software Engineer", description: "Build trading platforms, risk systems, and Marcus (digital banking).", salary: "$140K-$350K (US) / ₹18-55 LPA (India)", requirements: ["Java", "DSA (strong)", "System Design", "Distributed Systems", "SQL"], roadmap: SWE_ROADMAP },
      { id: "gs-de", title: "Data Engineer", description: "Build data infrastructure for trading analytics and risk management.", salary: "$135K-$300K (US) / ₹16-48 LPA (India)", requirements: ["Python", "SQL", "Spark", "Data Modeling", "Cloud"], roadmap: DATA_ENGINEER_ROADMAP },
    ],
  },
  {
    id: "jp-morgan",
    name: "JP Morgan Chase",
    emoji: "🏛️",
    description: "World's largest bank by assets. Massive tech hub in India (Hyderabad, Mumbai, Bangalore). 50,000+ technologists.",
    careersUrl: "https://careers.jpmorgan.com",
    tags: ["global", "finance", "banking"],
    roles: [
      { id: "jpm-swe", title: "Software Engineer", description: "Build trading, payments, and consumer banking platforms.", salary: "$130K-$320K (US) / ₹12-45 LPA (India)", requirements: ["Java/Python", "DSA", "System Design", "Spring Boot", "SQL"], roadmap: SWE_ROADMAP },
      { id: "jpm-de", title: "Data Engineer", description: "Build big data platforms for risk analytics and regulatory compliance.", salary: "$125K-$280K (US) / ₹12-38 LPA (India)", requirements: ["Python", "SQL", "Spark", "Kafka", "Data Warehousing"], roadmap: DATA_ENGINEER_ROADMAP },
      { id: "jpm-cloud", title: "Cloud Engineer", description: "Build and migrate banking infrastructure to cloud (AWS/Azure/GCP).", salary: "$135K-$300K (US) / ₹15-42 LPA (India)", requirements: ["AWS/Azure", "Terraform", "Docker/K8s", "Security", "Networking"], roadmap: CLOUD_ROADMAP },
    ],
  },
  {
    id: "morgan-stanley",
    name: "Morgan Stanley",
    emoji: "💹",
    description: "Leading investment bank and wealth management firm. Major tech hub in Mumbai and Bangalore.",
    careersUrl: "https://www.morganstanley.com/careers",
    tags: ["global", "finance", "banking"],
    roles: [
      { id: "ms2-swe", title: "Software Engineer", description: "Build trading systems, wealth management platforms, and risk analytics.", salary: "$130K-$310K (US) / ₹14-45 LPA (India)", requirements: ["Java/C++", "DSA", "System Design", "Low Latency", "SQL"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "paypal",
    name: "PayPal",
    emoji: "💳",
    description: "Global digital payments leader. Major engineering hub in Chennai and Bangalore (India).",
    careersUrl: "https://careers.pypl.com",
    tags: ["global", "fintech", "payments"],
    roles: [
      { id: "pp2-swe", title: "Software Engineer", description: "Build global payment systems, fraud detection, and checkout experiences.", salary: "$130K-$300K (US) / ₹18-50 LPA (India)", requirements: ["Java/Node.js", "DSA", "System Design", "Payments Domain", "Security"], roadmap: SWE_ROADMAP },
      { id: "pp2-fe", title: "Frontend Engineer", description: "Build checkout UIs and merchant dashboards used globally.", salary: "$125K-$280K (US) / ₹15-42 LPA (India)", requirements: ["React", "TypeScript", "Web Security", "Performance", "A11y"], roadmap: FRONTEND_ROADMAP },
      { id: "pp2-ml", title: "ML Engineer", description: "Build fraud detection, risk scoring, and recommendation models.", salary: "$145K-$340K (US) / ₹22-55 LPA (India)", requirements: ["Python", "ML/DL", "Feature Engineering", "Real-time ML", "Math"], roadmap: AI_ML_ROADMAP },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    emoji: "🔗",
    description: "World's largest professional network (Microsoft subsidiary). Major India office in Bangalore.",
    careersUrl: "https://careers.linkedin.com",
    tags: ["global", "tech", "social"],
    roles: [
      { id: "li-swe", title: "Software Engineer", description: "Build feed, messaging, jobs, and recruiter tools for 1B+ members.", salary: "$140K-$350K (US) / ₹22-65 LPA (India)", requirements: ["Java", "DSA", "System Design", "Microservices", "Databases"], roadmap: SWE_ROADMAP },
      { id: "li-ml", title: "ML Engineer", description: "Build recommendation, search ranking, and people-you-may-know models.", salary: "$155K-$380K (US) / ₹28-70 LPA (India)", requirements: ["Python/Scala", "ML/DL", "Spark", "Feature Engineering", "Math"], roadmap: AI_ML_ROADMAP },
    ],
  },
  {
    id: "atlassian",
    name: "Atlassian",
    emoji: "🔧",
    description: "Makers of Jira, Confluence, Bitbucket, and Trello. Distributed-first culture. Bangalore office.",
    careersUrl: "https://www.atlassian.com/company/careers",
    tags: ["global", "tech", "saas"],
    roles: [
      { id: "atl-swe", title: "Software Engineer", description: "Build collaboration tools used by 300K+ organizations worldwide.", salary: "$140K-$320K (US) / ₹22-55 LPA (India)", requirements: ["Java/TypeScript", "DSA", "System Design", "Microservices", "Cloud"], roadmap: SWE_ROADMAP },
      { id: "atl-fe", title: "Frontend Engineer", description: "Build rich UIs for Jira, Confluence, and the Atlassian Design System.", salary: "$135K-$300K (US) / ₹20-50 LPA (India)", requirements: ["React", "TypeScript", "Design Systems", "Performance", "Testing"], roadmap: FRONTEND_ROADMAP },
    ],
  },
  {
    id: "spotify",
    name: "Spotify",
    emoji: "🎵",
    description: "World's largest music streaming platform. Engineering-first culture with squad model.",
    careersUrl: "https://www.lifeatspotify.com",
    tags: ["global", "tech", "media"],
    roles: [
      { id: "sp-swe", title: "Backend Engineer", description: "Build streaming infrastructure, playlist personalization, and audio features.", salary: "$140K-$330K (US)", requirements: ["Java/Python/Go", "System Design", "Microservices", "GCP", "DSA"], roadmap: SWE_ROADMAP },
      { id: "sp-ml", title: "ML Engineer", description: "Build music recommendation, Discover Weekly, and podcast personalization.", salary: "$155K-$370K (US)", requirements: ["Python", "ML/DL", "NLP", "Recommendation Systems", "Math"], roadmap: AI_ML_ROADMAP },
    ],
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    emoji: "𝕏",
    description: "Global social media and real-time information platform. Engineering excellence in distributed systems.",
    careersUrl: "https://twitter.com/careers",
    tags: ["global", "tech", "social"],
    roles: [
      { id: "tw-swe", title: "Software Engineer", description: "Build timeline, search, ads, and real-time distributed systems at massive scale.", salary: "$140K-$350K (US)", requirements: ["Scala/Java/Python", "DSA", "Distributed Systems", "System Design", "Real-time"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "shopify",
    name: "Shopify",
    emoji: "🛍️",
    description: "E-commerce platform powering millions of stores globally. Remote-first culture.",
    careersUrl: "https://www.shopify.com/careers",
    tags: ["global", "tech", "ecommerce"],
    roles: [
      { id: "shp-swe", title: "Software Engineer", description: "Build commerce platform, checkout, and merchant tools.", salary: "$130K-$300K (US/CAD)", requirements: ["Ruby/Go/TypeScript", "DSA", "System Design", "GraphQL", "React"], roadmap: SWE_ROADMAP },
      { id: "shp-fe", title: "Frontend Engineer", description: "Build Shopify storefront, admin, and Polaris design system.", salary: "$125K-$280K (US/CAD)", requirements: ["React", "TypeScript", "Performance", "Design Systems", "A11y"], roadmap: FRONTEND_ROADMAP },
    ],
  },
  {
    id: "stripe-company",
    name: "Stripe",
    emoji: "💜",
    description: "Global payments infrastructure for the internet. Developer-first API design. Bangalore office.",
    careersUrl: "https://stripe.com/jobs",
    tags: ["global", "fintech", "payments"],
    roles: [
      { id: "str-swe", title: "Software Engineer", description: "Build payments infrastructure processing billions of dollars for millions of businesses.", salary: "$150K-$380K (US) / ₹28-70 LPA (India)", requirements: ["Ruby/Java/Go", "DSA", "System Design", "Distributed Systems", "API Design"], roadmap: SWE_ROADMAP },
      { id: "str-fe", title: "Frontend Engineer", description: "Build Stripe Dashboard, Checkout, and developer documentation.", salary: "$145K-$350K (US) / ₹25-60 LPA (India)", requirements: ["React", "TypeScript", "Performance", "Design Systems", "Web Security"], roadmap: FRONTEND_ROADMAP },
    ],
  },
  {
    id: "databricks",
    name: "Databricks",
    emoji: "🧱",
    description: "Data and AI company. Created Apache Spark. Lakehouse platform for data engineering and ML.",
    careersUrl: "https://www.databricks.com/company/careers",
    tags: ["global", "tech", "ai", "data"],
    roles: [
      { id: "db-swe", title: "Software Engineer", description: "Build the Databricks Lakehouse platform, SQL analytics, and MLflow.", salary: "$160K-$400K (US) / ₹30-80 LPA (India)", requirements: ["Scala/Java/Python", "Distributed Systems", "Apache Spark", "System Design", "DSA"], roadmap: SWE_ROADMAP },
      { id: "db-de", title: "Data Engineer", description: "Build data processing and query engine for the Lakehouse.", salary: "$150K-$370K (US) / ₹25-65 LPA (India)", requirements: ["Spark", "SQL", "Python/Scala", "Delta Lake", "Data Modeling"], roadmap: DATA_ENGINEER_ROADMAP },
    ],
  },
  {
    id: "snowflake",
    name: "Snowflake",
    emoji: "❄️",
    description: "Cloud data platform for analytics, data engineering, and data sharing. Fastest-growing SaaS.",
    careersUrl: "https://careers.snowflake.com",
    tags: ["global", "tech", "data", "cloud"],
    roles: [
      { id: "sf2-swe", title: "Software Engineer", description: "Build Snowflake's cloud-native data warehouse and query engine.", salary: "$155K-$380K (US)", requirements: ["C++/Java/Python", "Distributed Systems", "Databases", "System Design", "DSA"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "sap",
    name: "SAP",
    emoji: "🟦",
    description: "World's largest enterprise software company. Major India labs in Bangalore. ERP, HANA, and cloud.",
    careersUrl: "https://www.sap.com/about/careers.html",
    tags: ["global", "tech", "enterprise"],
    roles: [
      { id: "sap-swe", title: "Software Engineer", description: "Build SAP HANA, S/4HANA, Business Technology Platform, and cloud solutions.", salary: "$120K-$260K (US) / ₹10-35 LPA (India)", requirements: ["Java/ABAP/JavaScript", "SQL", "Cloud", "REST APIs", "OOP"], roadmap: SWE_ROADMAP },
      { id: "sap-de", title: "Data Engineer", description: "Build data platforms on SAP BTP, HANA, and analytics cloud.", salary: "$115K-$250K (US) / ₹10-30 LPA (India)", requirements: ["SQL", "Python", "SAP HANA", "ETL", "Data Modeling"], roadmap: DATA_ENGINEER_ROADMAP },
    ],
  },
  {
    id: "accenture",
    name: "Accenture",
    emoji: "🟣",
    description: "Global consulting and technology services giant. India is their largest delivery center (300K+ employees).",
    careersUrl: "https://www.accenture.com/us-en/careers",
    tags: ["global", "consulting", "it-services", "fresher-friendly"],
    roles: [
      { id: "acc-ase", title: "Associate Software Engineer", description: "Work on enterprise projects across industries — cloud migration, app development, DevOps.", salary: "₹4.5-7 LPA (fresher) / ₹10-30 LPA (experienced)", requirements: ["Java/Python", "SQL", "Cloud Basics", "Agile", "Communication"], roadmap: SWE_ROADMAP },
      { id: "acc-de", title: "Data Engineer", description: "Build enterprise data platforms for Fortune 500 clients.", salary: "₹6-20 LPA", requirements: ["SQL", "Python", "AWS/Azure", "Spark", "ETL"], roadmap: DATA_ENGINEER_ROADMAP },
      { id: "acc-cloud", title: "Cloud Engineer", description: "Design and migrate enterprise workloads to AWS, Azure, and GCP.", salary: "₹6-22 LPA", requirements: ["AWS/Azure/GCP", "Terraform", "Docker/K8s", "Linux", "Networking"], roadmap: CLOUD_ROADMAP },
    ],
  },
  {
    id: "deloitte",
    name: "Deloitte",
    emoji: "🟢",
    description: "Big Four consulting firm with massive tech practice. India offices in multiple cities.",
    careersUrl: "https://www.deloitte.com/global/en/careers.html",
    tags: ["global", "consulting", "fresher-friendly"],
    roles: [
      { id: "del-swe", title: "Software Engineer", description: "Build enterprise solutions and digital transformation projects.", salary: "₹5-8 LPA (fresher) / ₹12-35 LPA (experienced)", requirements: ["Java/Python", "SQL", "Cloud", "Agile", "Problem Solving"], roadmap: SWE_ROADMAP },
      { id: "del-cyber", title: "Cybersecurity Analyst", description: "Provide security consulting, risk assessment, and incident response.", salary: "₹6-25 LPA", requirements: ["Network Security", "SIEM", "Risk Assessment", "Python", "Compliance"], roadmap: CYBER_ROADMAP },
    ],
  },
  {
    id: "vmware",
    name: "VMware (Broadcom)",
    emoji: "☁️",
    description: "Virtualization and cloud infrastructure pioneer. Major Bangalore R&D center. Now part of Broadcom.",
    careersUrl: "https://www.broadcom.com/company/careers",
    tags: ["global", "tech", "cloud"],
    roles: [
      { id: "vm-swe", title: "Software Engineer", description: "Build virtualization, cloud management, and container platforms.", salary: "$130K-$290K (US) / ₹15-45 LPA (India)", requirements: ["C++/Go/Java", "Linux", "Distributed Systems", "Virtualization", "DSA"], roadmap: SWE_ROADMAP },
      { id: "vm-devops", title: "DevOps Engineer", description: "Build CI/CD and infrastructure automation for VMware products.", salary: "$125K-$270K (US) / ₹12-38 LPA (India)", requirements: ["Docker/K8s", "Terraform", "CI/CD", "Linux", "Scripting"], roadmap: DEVOPS_ROADMAP },
    ],
  },

  // ======================== MORE INDIAN COMPANIES ========================
  {
    id: "freshworks",
    name: "Freshworks",
    emoji: "🌊",
    description: "India's SaaS success story (NASDAQ listed). CRM, ITSM, and customer engagement. HQ in Chennai.",
    careersUrl: "https://www.freshworks.com/company/careers/",
    tags: ["india", "saas", "startup"],
    roles: [
      { id: "fw-sde", title: "Software Engineer", description: "Build SaaS products — Freshdesk, Freshservice, Freshsales at global scale.", salary: "₹15-45 LPA", requirements: ["Ruby/Java/Go", "DSA", "System Design", "Microservices", "SQL"], roadmap: SWE_ROADMAP },
      { id: "fw-fe", title: "Frontend Engineer", description: "Build beautiful, responsive UIs for Freshworks' suite of products.", salary: "₹14-40 LPA", requirements: ["React/Ember", "JavaScript/TypeScript", "CSS", "Performance", "Testing"], roadmap: FRONTEND_ROADMAP },
    ],
  },
  {
    id: "zoho-company",
    name: "Zoho",
    emoji: "🟡",
    description: "India's bootstrapped SaaS giant. 55+ products, 100M+ users. Chennai HQ. Famous for not raising VC funding.",
    careersUrl: "https://www.zoho.com/careers.html",
    tags: ["india", "saas", "enterprise"],
    roles: [
      { id: "zo-swe", title: "Member Technical Staff", description: "Build Zoho's 55+ products from CRM to analytics to mail.", salary: "₹6-25 LPA", requirements: ["Java/C++", "DSA", "OOP", "DBMS", "Problem Solving"], roadmap: SWE_ROADMAP },
      { id: "zo-fe", title: "Frontend Developer", description: "Build Zoho's web applications and design system.", salary: "₹5-22 LPA", requirements: ["JavaScript", "HTML/CSS", "React/Vue", "Performance", "UI/UX Sense"], roadmap: FRONTEND_ROADMAP },
    ],
  },
  {
    id: "postman",
    name: "Postman",
    emoji: "🚀",
    description: "API development platform used by 30M+ developers. Founded in Bangalore. API-first company.",
    careersUrl: "https://www.postman.com/company/careers/",
    tags: ["india", "devtools", "startup"],
    roles: [
      { id: "pm-sde", title: "Software Engineer", description: "Build API development, testing, and collaboration tools.", salary: "₹20-55 LPA", requirements: ["JavaScript/Go", "DSA", "System Design", "API Design", "Electron"], roadmap: SWE_ROADMAP },
      { id: "pm-fe", title: "Frontend Engineer", description: "Build Postman's desktop app and web interface used by millions.", salary: "₹18-48 LPA", requirements: ["React", "TypeScript", "Electron", "Performance", "Testing"], roadmap: FRONTEND_ROADMAP },
    ],
  },
  {
    id: "browserstack",
    name: "BrowserStack",
    emoji: "🧪",
    description: "Testing platform used by 50K+ companies. Founded in Mumbai. Cross-browser and mobile testing.",
    careersUrl: "https://www.browserstack.com/careers",
    tags: ["india", "devtools", "startup"],
    roles: [
      { id: "bs-sde", title: "Software Engineer", description: "Build cloud testing infrastructure serving millions of test sessions.", salary: "₹18-50 LPA", requirements: ["Java/Python/Ruby", "DSA", "System Design", "Cloud", "Selenium"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "myntra",
    name: "Myntra",
    emoji: "👗",
    description: "India's leading fashion e-commerce platform (Flipkart/Walmart group).",
    careersUrl: "https://www.myntra.com/careers",
    tags: ["india", "ecommerce", "fashion"],
    roles: [
      { id: "myn-sde", title: "Software Engineer", description: "Build fashion e-commerce platform — search, catalog, recommendation, logistics.", salary: "₹16-45 LPA", requirements: ["Java", "DSA", "System Design", "Microservices", "Databases"], roadmap: SWE_ROADMAP },
      { id: "myn-ml", title: "ML Engineer", description: "Build fashion recommendation, visual search, and personalization.", salary: "₹18-50 LPA", requirements: ["Python", "ML/DL", "Computer Vision", "NLP", "Feature Engineering"], roadmap: AI_ML_ROADMAP },
    ],
  },
  {
    id: "groww",
    name: "Groww",
    emoji: "📊",
    description: "India's fastest-growing investment platform — stocks, mutual funds, and digital gold.",
    careersUrl: "https://groww.in/careers",
    tags: ["india", "fintech", "trading"],
    roles: [
      { id: "gr-sde", title: "Software Engineer", description: "Build trading, portfolio management, and payments systems.", salary: "₹18-55 LPA", requirements: ["Java/Go", "DSA", "System Design", "Financial Domain", "High Concurrency"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "lenskart",
    name: "Lenskart",
    emoji: "👓",
    description: "India's largest eyewear company. Tech-driven omnichannel retail. AI-powered virtual try-on.",
    careersUrl: "https://www.lenskart.com/careers",
    tags: ["india", "ecommerce", "startup"],
    roles: [
      { id: "lk-sde", title: "Software Engineer", description: "Build e-commerce platform, virtual try-on, and supply chain systems.", salary: "₹14-40 LPA", requirements: ["Java/Python", "DSA", "System Design", "REST APIs", "Databases"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "policybazaar",
    name: "PolicyBazaar",
    emoji: "🛡️",
    description: "India's largest insurance aggregator. Listed on NSE/BSE. InsurTech pioneer.",
    careersUrl: "https://careers.policybazaar.com",
    tags: ["india", "fintech", "insurance"],
    roles: [
      { id: "pb-sde", title: "Software Engineer", description: "Build insurance comparison, policy management, and claims systems.", salary: "₹12-35 LPA", requirements: ["Java/Python", "DSA", "System Design", "REST APIs", "SQL"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "shareChat",
    name: "ShareChat / Moj",
    emoji: "💬",
    description: "India's largest social media and short video platform in regional languages.",
    careersUrl: "https://sharechat.com/careers",
    tags: ["india", "social", "startup"],
    roles: [
      { id: "sc-sde", title: "Software Engineer", description: "Build social feed, content delivery, and short video platform.", salary: "₹16-50 LPA", requirements: ["Go/Java", "DSA", "System Design", "Distributed Systems", "Video"], roadmap: SWE_ROADMAP },
      { id: "sc-ml", title: "ML Engineer", description: "Build content recommendation, moderation, and NLP for Indian languages.", salary: "₹18-55 LPA", requirements: ["Python", "ML/DL", "NLP", "Recommendation Systems", "Math"], roadmap: AI_ML_ROADMAP },
    ],
  },
  {
    id: "inmobi",
    name: "InMobi",
    emoji: "📱",
    description: "India's global ad-tech unicorn. Mobile advertising and marketing cloud. Bangalore HQ.",
    careersUrl: "https://www.inmobi.com/company/careers",
    tags: ["india", "adtech", "startup"],
    roles: [
      { id: "im-sde", title: "Software Engineer", description: "Build real-time ad serving, bidding, and analytics at massive scale.", salary: "₹18-50 LPA", requirements: ["Java/Scala", "DSA", "System Design", "Low Latency", "Distributed Systems"], roadmap: SWE_ROADMAP },
      { id: "im-de", title: "Data Engineer", description: "Build data pipelines processing billions of ad events daily.", salary: "₹16-42 LPA", requirements: ["Spark", "Kafka", "SQL", "Python", "Data Warehousing"], roadmap: DATA_ENGINEER_ROADMAP },
    ],
  },
  {
    id: "nykaa",
    name: "Nykaa",
    emoji: "💄",
    description: "India's largest beauty and fashion e-commerce platform. Listed on NSE/BSE.",
    careersUrl: "https://www.nykaa.com/careers",
    tags: ["india", "ecommerce", "beauty"],
    roles: [
      { id: "nyk-sde", title: "Software Engineer", description: "Build beauty e-commerce platform, recommendation engine, and logistics.", salary: "₹12-35 LPA", requirements: ["Java/Python", "DSA", "REST APIs", "SQL", "System Design"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "cars24",
    name: "CARS24",
    emoji: "🚙",
    description: "India's leading used car e-commerce platform. AI-powered pricing and inspection.",
    careersUrl: "https://www.cars24.com/careers/",
    tags: ["india", "ecommerce", "automotive"],
    roles: [
      { id: "c24-sde", title: "Software Engineer", description: "Build car pricing, inspection, and trading platforms.", salary: "₹14-40 LPA", requirements: ["Java/Python", "DSA", "System Design", "ML Basics", "APIs"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "upgrad",
    name: "upGrad",
    emoji: "🎓",
    description: "India's leading online higher education platform. MBA, data science, and tech courses.",
    careersUrl: "https://www.upgrad.com/careers/",
    tags: ["india", "edtech", "startup"],
    roles: [
      { id: "ug-sde", title: "Software Engineer", description: "Build learning platform, video streaming, and assessment systems.", salary: "₹12-35 LPA", requirements: ["Java/Python", "DSA", "React", "REST APIs", "SQL"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "chargebee",
    name: "Chargebee",
    emoji: "💳",
    description: "India-origin subscription billing platform (NASDAQ listed). Used by 25K+ businesses globally.",
    careersUrl: "https://www.chargebee.com/company/careers/",
    tags: ["india", "saas", "fintech"],
    roles: [
      { id: "cb-sde", title: "Software Engineer", description: "Build subscription management, billing, and revenue recognition systems.", salary: "₹16-45 LPA", requirements: ["Ruby/Java", "DSA", "System Design", "APIs", "Payments Domain"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "delhivery-company",
    name: "Delhivery",
    emoji: "📦",
    description: "India's largest independent logistics company. AI-driven supply chain and delivery.",
    careersUrl: "https://www.delhivery.com/careers/",
    tags: ["india", "logistics", "startup"],
    roles: [
      { id: "dlv-sde", title: "Software Engineer", description: "Build logistics platform — route optimization, tracking, and warehouse management.", salary: "₹14-40 LPA", requirements: ["Java/Python", "DSA", "System Design", "Maps/Geo", "SQL"], roadmap: SWE_ROADMAP },
      { id: "dlv-de", title: "Data Engineer", description: "Build data pipelines for logistics analytics and route optimization.", salary: "₹14-35 LPA", requirements: ["Python", "SQL", "Spark", "Airflow", "Data Modeling"], roadmap: DATA_ENGINEER_ROADMAP },
    ],
  },
  {
    id: "hasura",
    name: "Hasura",
    emoji: "⚡",
    description: "India-origin open-source GraphQL engine. Auto-generates APIs from databases. Bangalore HQ.",
    careersUrl: "https://hasura.io/careers/",
    tags: ["india", "devtools", "open-source"],
    roles: [
      { id: "has-swe", title: "Software Engineer", description: "Build Hasura's open-source GraphQL engine and cloud platform.", salary: "₹20-55 LPA", requirements: ["Haskell/Go/TypeScript", "DSA", "GraphQL", "Databases", "Distributed Systems"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "mindtree-ltimindtree",
    name: "LTIMindtree",
    emoji: "🌳",
    description: "Major Indian IT services company (L&T Group). Digital transformation, cloud, and analytics.",
    careersUrl: "https://www.ltimindtree.com/careers/",
    tags: ["india", "it-services", "fresher-friendly"],
    roles: [
      { id: "ltm-se", title: "Software Engineer", description: "Enterprise application development, cloud migration, and digital solutions.", salary: "₹4-7 LPA (fresher) / ₹8-25 LPA (experienced)", requirements: ["Java/Python", "SQL", "Cloud Basics", "Web Development", "Aptitude"], roadmap: SWE_ROADMAP },
    ],
  },
  {
    id: "cognizant",
    name: "Cognizant",
    emoji: "🔷",
    description: "US-headquartered IT services giant with massive India workforce (200K+ in India). NASDAQ listed.",
    careersUrl: "https://careers.cognizant.com",
    tags: ["global", "it-services", "fresher-friendly"],
    roles: [
      { id: "cog-se", title: "Programmer Analyst", description: "Build and maintain enterprise applications for Fortune 500 clients.", salary: "₹4-7 LPA (fresher) / ₹8-25 LPA (experienced)", requirements: ["Java/Python/.NET", "SQL", "Web Development", "Cloud Basics", "Communication"], roadmap: SWE_ROADMAP },
      { id: "cog-de", title: "Data Engineer", description: "Build data solutions using cloud platforms for enterprise clients.", salary: "₹5-18 LPA", requirements: ["SQL", "Python", "ETL", "AWS/Azure", "Spark"], roadmap: DATA_ENGINEER_ROADMAP },
    ],
  },
  {
    id: "capgemini",
    name: "Capgemini",
    emoji: "🔹",
    description: "Global consulting and technology services. One of India's largest IT employers.",
    careersUrl: "https://www.capgemini.com/careers/",
    tags: ["global", "consulting", "it-services", "fresher-friendly"],
    roles: [
      { id: "cap-se", title: "Software Engineer", description: "Build enterprise solutions across industries for global clients.", salary: "₹3.8-7 LPA (fresher) / ₹8-22 LPA (experienced)", requirements: ["Java/Python", "SQL", "Web Development", "Agile", "Communication"], roadmap: SWE_ROADMAP },
    ],
  },
];

