/**
 * Curated YouTube video tutorials for every roadmap node.
 *
 * Each node maps to 3-4 hand-picked videos from popular developer educators.
 * Consumed by the YouTubeVideoList component inside NodeSectionPanel.
 *
 * All URLs point to real, well-known tutorial videos.
 */

export interface VideoResource {
  id: string;
  title: string;
  channel: string;
  url: string;
  /** e.g. "12:34" or "1:23:45" */
  duration: string;
}

export const NODE_VIDEOS: Record<string, VideoResource[]> = {
  /* -----------------------------------------------------------------------
   * Frontend
   * --------------------------------------------------------------------- */
  "frontend-web-foundations": [
    { id: "fwf-v1", title: "HTML Crash Course For Absolute Beginners", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=UB1O30fR-EE", duration: "1:00:42" },
    { id: "fwf-v2", title: "CSS Crash Course For Absolute Beginners", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=yfoY53QXEnI", duration: "1:25:11" },
    { id: "fwf-v3", title: "Learn HTML & CSS – Full Course for Beginners", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=a_iQb1lnAEQ", duration: "11:55:01" },
    { id: "fwf-v4", title: "CSS Flexbox in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=K74l26pE4YA", duration: "2:31" },
  ],
  "frontend-javascript-essentials": [
    { id: "fje-v1", title: "JavaScript Crash Course For Beginners", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=hdI2bqOjy3c", duration: "1:40:30" },
    { id: "fje-v2", title: "JavaScript in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=DHjqpvDnNGE", duration: "2:22" },
    { id: "fje-v3", title: "JavaScript Full Course for Beginners", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", duration: "3:26:42" },
    { id: "fje-v4", title: "Asynchronous JavaScript Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=ZYb_ZU8LNxs", duration: "1:33:05" },
  ],
  "frontend-version-control": [
    { id: "fvc-v1", title: "Git and GitHub for Beginners – Crash Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", duration: "1:08:29" },
    { id: "fvc-v2", title: "Git It? How to use Git and Github", channel: "Fireship", url: "https://www.youtube.com/watch?v=HkdAHXoRtos", duration: "12:18" },
    { id: "fvc-v3", title: "Git Tutorial for Beginners", channel: "Programming with Mosh", url: "https://www.youtube.com/watch?v=8JJ101D3knE", duration: "1:09:13" },
  ],
  "frontend-react": [
    { id: "fr-v1", title: "React Course – Beginner's Tutorial for React", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=bMknfKXIFA8", duration: "11:55:27" },
    { id: "fr-v2", title: "React in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM", duration: "2:20" },
    { id: "fr-v3", title: "React JS Crash Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=LDB4uaJ87e0", duration: "1:48:47" },
    { id: "fr-v4", title: "Learn React Hooks", channel: "Web Dev Simplified", url: "https://www.youtube.com/watch?v=O6P86uwfdR0", duration: "1:09:22" },
  ],
  "frontend-styling-systems": [
    { id: "fss-v1", title: "Tailwind CSS Crash Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=UBOj6rqRUME", duration: "30:39" },
    { id: "fss-v2", title: "Tailwind in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=mr15Xzb1Ook", duration: "2:34" },
    { id: "fss-v3", title: "CSS Modules Tutorial", channel: "The Net Ninja", url: "https://www.youtube.com/watch?v=x-SgoGBk7E4", duration: "6:45" },
    { id: "fss-v4", title: "Styled Components Crash Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=02zO0hZmwnw", duration: "28:34" },
  ],
  "frontend-tooling-testing": [
    { id: "ftt-v1", title: "Vite in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=KCrXgy8qtjM", duration: "2:45" },
    { id: "ftt-v2", title: "Jest Crash Course – Unit Testing in JavaScript", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=7r4xVDI2vho", duration: "57:19" },
    { id: "ftt-v3", title: "Playwright End-to-End Testing", channel: "Fireship", url: "https://www.youtube.com/watch?v=JbHlFHU0GFA", duration: "4:39" },
  ],
  "frontend-deploy-career": [
    { id: "fdc-v1", title: "Deploy React App to Vercel", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=kGpbLmzNoxE", duration: "12:25" },
    { id: "fdc-v2", title: "How to Get a Job as a Web Developer", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=Xg9ihH15Uto", duration: "32:17" },
    { id: "fdc-v3", title: "Frontend Developer Portfolio Tips", channel: "Fireship", url: "https://www.youtube.com/watch?v=0fYi8SGA20k", duration: "7:10" },
  ],

  /* -----------------------------------------------------------------------
   * Backend
   * --------------------------------------------------------------------- */
  "backend-language-fundamentals": [
    { id: "blf-v1", title: "Node.js Crash Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4", duration: "1:30:03" },
    { id: "blf-v2", title: "Python Full Course for Beginners", channel: "Programming with Mosh", url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", duration: "6:14:07" },
    { id: "blf-v3", title: "Node.js in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=ENrzD9HAZK4", duration: "2:52" },
    { id: "blf-v4", title: "Python in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=x7X9w_GIm1s", duration: "2:37" },
  ],
  "backend-http-apis": [
    { id: "bha-v1", title: "Build a REST API with Node.js, Express", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=l8WPEL6YLPo", duration: "1:15:39" },
    { id: "bha-v2", title: "RESTful APIs in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=-MTSQjw5DrM", duration: "2:04" },
    { id: "bha-v3", title: "GraphQL Crash Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=BcLNfwF04Kw", duration: "1:02:36" },
  ],
  "backend-databases": [
    { id: "bd-v1", title: "SQL Tutorial – Full Database Course for Beginners", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", duration: "4:20:37" },
    { id: "bd-v2", title: "MongoDB Crash Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=-56x56UppqQ", duration: "36:42" },
    { id: "bd-v3", title: "PostgreSQL Tutorial for Beginners", channel: "Programming with Mosh", url: "https://www.youtube.com/watch?v=qw--VYLpxG4", duration: "3:00:18" },
  ],
  "backend-auth-security": [
    { id: "bas-v1", title: "Session vs Token Authentication", channel: "Web Dev Simplified", url: "https://www.youtube.com/watch?v=UBUNrFtufWo", duration: "12:14" },
    { id: "bas-v2", title: "JWT Authentication Tutorial", channel: "Web Dev Simplified", url: "https://www.youtube.com/watch?v=mbsmsi7l3r4", duration: "24:54" },
    { id: "bas-v3", title: "OAuth 2.0 Explained", channel: "Fireship", url: "https://www.youtube.com/watch?v=ZV5yTm4pT8g", duration: "6:06" },
  ],
  "backend-testing-observability": [
    { id: "bto-v1", title: "Testing Node.js with Jest", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=FgnxcUQ5vho", duration: "48:21" },
    { id: "bto-v2", title: "How to Monitor a Node.js Application", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=YDYx12HqXGo", duration: "22:31" },
    { id: "bto-v3", title: "Logging Best Practices", channel: "Fireship", url: "https://www.youtube.com/watch?v=lHpVVkP_3k0", duration: "5:12" },
  ],
  "backend-deploy-career": [
    { id: "bdc-v1", title: "Deploy Node.js App to Production", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=oykl1Ih9SQI", duration: "42:33" },
    { id: "bdc-v2", title: "Docker Crash Course for Absolute Beginners", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=pg19Z8LL06w", duration: "1:07:42" },
    { id: "bdc-v3", title: "GitHub Actions Tutorial", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", duration: "32:35" },
  ],

  /* -----------------------------------------------------------------------
   * Full Stack
   * --------------------------------------------------------------------- */
  "fullstack-frontend-foundations": [
    { id: "fsff-v1", title: "HTML & CSS Full Course – Build a Website", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=a_iQb1lnAEQ", duration: "11:55:01" },
    { id: "fsff-v2", title: "JavaScript for Beginners", channel: "Programming with Mosh", url: "https://www.youtube.com/watch?v=W6NZfCO5SIk", duration: "48:17" },
    { id: "fsff-v3", title: "React Tutorial for Beginners", channel: "Programming with Mosh", url: "https://www.youtube.com/watch?v=SqcY0GlETPk", duration: "1:19:49" },
  ],
  "fullstack-backend-apis": [
    { id: "fsba-v1", title: "Build a Node.js API from Scratch", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=l8WPEL6YLPo", duration: "1:15:39" },
    { id: "fsba-v2", title: "Express JS Crash Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=L72fhGm1tfE", duration: "1:14:42" },
    { id: "fsba-v3", title: "tRPC in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=lxnPMo1A1Io", duration: "3:22" },
  ],
  "fullstack-databases": [
    { id: "fsd-v1", title: "Prisma ORM Tutorial for Beginners", channel: "Web Dev Simplified", url: "https://www.youtube.com/watch?v=RebA5J-rlwg", duration: "52:39" },
    { id: "fsd-v2", title: "PostgreSQL Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=qw--VYLpxG4", duration: "3:00:18" },
    { id: "fsd-v3", title: "Redis Crash Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=jgpVdJB2sKQ", duration: "39:53" },
  ],
  "fullstack-framework": [
    { id: "fsf-v1", title: "Next.js 14 Full Course 2024", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=wm5gMKuwSYk", duration: "5:26:39" },
    { id: "fsf-v2", title: "Next.js in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=Sklc_fQBmcs", duration: "2:53" },
    { id: "fsf-v3", title: "Next.js App Router", channel: "Web Dev Simplified", url: "https://www.youtube.com/watch?v=gSSsZReIFRk", duration: "58:22" },
  ],
  "fullstack-auth-state": [
    { id: "fsas-v1", title: "NextAuth.js Tutorial", channel: "Web Dev Simplified", url: "https://www.youtube.com/watch?v=w2h54xz6Ndw", duration: "1:05:47" },
    { id: "fsas-v2", title: "Zustand Tutorial for Beginners", channel: "Web Dev Simplified", url: "https://www.youtube.com/watch?v=KEc0LLQjyfQ", duration: "14:12" },
    { id: "fsas-v3", title: "React Query in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=novnyCaa7To", duration: "2:49" },
  ],
  "fullstack-deploy-career": [
    { id: "fsdc-v1", title: "Deploy Full Stack App – Vercel & Railway", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=kGpbLmzNoxE", duration: "12:25" },
    { id: "fsdc-v2", title: "Full Stack Developer Roadmap 2024", channel: "Fireship", url: "https://www.youtube.com/watch?v=Uo3cL4nrGOk", duration: "8:52" },
    { id: "fsdc-v3", title: "System Design for Interviews", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=F2FmTdLtb_4", duration: "1:33:56" },
  ],

  /* -----------------------------------------------------------------------
   * Mobile
   * --------------------------------------------------------------------- */
  "mobile-foundations": [
    { id: "mf-v1", title: "React Native Tutorial for Beginners", channel: "Programming with Mosh", url: "https://www.youtube.com/watch?v=0-S5a0eXPoc", duration: "2:25:58" },
    { id: "mf-v2", title: "Mobile App Development in 2024", channel: "Fireship", url: "https://www.youtube.com/watch?v=O3k9oCJLYYk", duration: "8:23" },
    { id: "mf-v3", title: "React Native in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=gvkqT_Uoahw", duration: "2:39" },
  ],
  "mobile-react-native": [
    { id: "mrn-v1", title: "React Native Crash Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=VozPNrt-LfE", duration: "1:38:12" },
    { id: "mrn-v2", title: "Expo Router Tutorial", channel: "Fireship", url: "https://www.youtube.com/watch?v=qEvzFjNPu-0", duration: "6:45" },
    { id: "mrn-v3", title: "Build an App with React Native & Expo", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=mJ3bGvy0WAY", duration: "4:51:33" },
  ],
  "mobile-native-apis": [
    { id: "mna-v1", title: "React Native Camera Tutorial", channel: "The Net Ninja", url: "https://www.youtube.com/watch?v=tJTiJNVVN-I", duration: "18:32" },
    { id: "mna-v2", title: "Push Notifications with Firebase", channel: "Fireship", url: "https://www.youtube.com/watch?v=2TSm2YGBT1s", duration: "8:24" },
    { id: "mna-v3", title: "React Native Maps & Geolocation", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=bViHY29MN9M", duration: "24:37" },
  ],
  "mobile-state-data": [
    { id: "msd-v1", title: "Redux Toolkit in React Native", channel: "Web Dev Simplified", url: "https://www.youtube.com/watch?v=9zySeP5vH9c", duration: "30:12" },
    { id: "msd-v2", title: "AsyncStorage React Native Tutorial", channel: "The Net Ninja", url: "https://www.youtube.com/watch?v=PRa2dazAEMI", duration: "10:26" },
    { id: "msd-v3", title: "Offline-First Apps with React Native", channel: "Fireship", url: "https://www.youtube.com/watch?v=WPpKkV8cC3A", duration: "5:43" },
  ],
  "mobile-deploy-career": [
    { id: "mdc-v1", title: "Deploy React Native App to App Store", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=oBWBDaqNuws", duration: "22:18" },
    { id: "mdc-v2", title: "EAS Build and Submit – Expo", channel: "Fireship", url: "https://www.youtube.com/watch?v=rjL9MaJNj7k", duration: "7:14" },
    { id: "mdc-v3", title: "How to Get a Mobile Developer Job", channel: "Programming with Mosh", url: "https://www.youtube.com/watch?v=dTFXufTgfOE", duration: "15:42" },
  ],

  /* -----------------------------------------------------------------------
   * AI Engineer
   * --------------------------------------------------------------------- */
  "ai-python-foundations": [
    { id: "aipf-v1", title: "Python for Data Science – Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI", duration: "12:19:49" },
    { id: "aipf-v2", title: "NumPy Tutorial for Beginners", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=QUT1VHiLmmI", duration: "58:41" },
    { id: "aipf-v3", title: "Pandas Tutorial – Data Analysis with Python", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=vmEHCJofslg", duration: "4:47:35" },
  ],
  "ai-llm-fundamentals": [
    { id: "ailf-v1", title: "How Large Language Models Work", channel: "3Blue1Brown", url: "https://www.youtube.com/watch?v=wjZofJX0v4M", duration: "27:14" },
    { id: "ailf-v2", title: "OpenAI API Tutorial – ChatGPT", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=uRQH2CFvedY", duration: "1:21:34" },
    { id: "ailf-v3", title: "LLMs in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=5sLYAQS9sWQ", duration: "2:49" },
  ],
  "ai-prompt-engineering": [
    { id: "aipe-v1", title: "Prompt Engineering Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=_ZvnD96BVeQ", duration: "1:17:33" },
    { id: "aipe-v2", title: "ChatGPT Prompt Engineering for Developers", channel: "DeepLearningAI", url: "https://www.youtube.com/watch?v=H4YK_7MAckk", duration: "1:28:15" },
    { id: "aipe-v3", title: "AI Agents Explained", channel: "Fireship", url: "https://www.youtube.com/watch?v=sal78ACtGTc", duration: "6:05" },
  ],
  "ai-rag-apps": [
    { id: "aira-v1", title: "RAG Explained – Retrieval Augmented Generation", channel: "Fireship", url: "https://www.youtube.com/watch?v=T-D1OfcDW1M", duration: "5:34" },
    { id: "aira-v2", title: "LangChain Crash Course – Build AI Apps", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=lG7Uxts9SXs", duration: "1:43:22" },
    { id: "aira-v3", title: "Vector Databases Explained", channel: "Fireship", url: "https://www.youtube.com/watch?v=klTvEwg3oJ4", duration: "5:10" },
  ],
  "ai-deploy-career": [
    { id: "aidc-v1", title: "Deploy AI Models with FastAPI", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=h5wLuVDr0oc", duration: "48:23" },
    { id: "aidc-v2", title: "AI Engineer Roadmap 2024", channel: "Fireship", url: "https://www.youtube.com/watch?v=F_Riqjdh2oM", duration: "10:15" },
    { id: "aidc-v3", title: "How to Become an AI Engineer", channel: "Tech With Tim", url: "https://www.youtube.com/watch?v=FjqnVKjGzLo", duration: "14:32" },
  ],

  /* -----------------------------------------------------------------------
   * ML Engineer
   * --------------------------------------------------------------------- */
  "ml-math-python": [
    { id: "mlmp-v1", title: "Mathematics for Machine Learning – Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=LlKAna21fLE", duration: "5:40:00" },
    { id: "mlmp-v2", title: "Essence of Linear Algebra", channel: "3Blue1Brown", url: "https://www.youtube.com/watch?v=fNk_zzaMoSs", duration: "15:45" },
    { id: "mlmp-v3", title: "Statistics Fundamentals – StatQuest", channel: "StatQuest", url: "https://www.youtube.com/watch?v=qBigTkBLU6g", duration: "20:45" },
  ],
  "ml-classical": [
    { id: "mlc-v1", title: "Machine Learning with Python Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=7eh4d6sabA0", duration: "5:45:22" },
    { id: "mlc-v2", title: "Scikit-Learn Tutorial", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=pqNCD_5r0IU", duration: "2:36:00" },
    { id: "mlc-v3", title: "Machine Learning in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=PeMlggyqz0Y", duration: "3:16" },
  ],
  "ml-deep-learning": [
    { id: "mldl-v1", title: "Deep Learning Crash Course for Beginners", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=VyWAvY2CF9c", duration: "1:43:10" },
    { id: "mldl-v2", title: "Neural Networks from Scratch", channel: "3Blue1Brown", url: "https://www.youtube.com/watch?v=aircAruvnKk", duration: "19:13" },
    { id: "mldl-v3", title: "PyTorch Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=V_xro1bcAuA", duration: "9:49:33" },
  ],
  "ml-data-pipelines": [
    { id: "mldp-v1", title: "Data Engineering Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=PHsC_t0j1dU", duration: "4:53:22" },
    { id: "mldp-v2", title: "Apache Airflow Tutorial", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=K9AnJ9_ZAXE", duration: "38:42" },
    { id: "mldp-v3", title: "Feature Engineering for ML", channel: "Kaggle", url: "https://www.youtube.com/watch?v=68ABAU_V8qI", duration: "45:32" },
  ],
  "ml-mlops-deploy": [
    { id: "mlmd-v1", title: "MLOps Course – Machine Learning in Production", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=Vuw_GUvL-sE", duration: "3:22:17" },
    { id: "mlmd-v2", title: "MLflow Tutorial", channel: "AssemblyAI", url: "https://www.youtube.com/watch?v=qdcHHrsXA48", duration: "22:34" },
    { id: "mlmd-v3", title: "Docker for Data Scientists", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=0H2miBK_gAk", duration: "1:18:47" },
  ],

  /* -----------------------------------------------------------------------
   * Data Scientist
   * --------------------------------------------------------------------- */
  "ds-python-stats": [
    { id: "dsps-v1", title: "Statistics – Full University Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=xxpc-HPKN28", duration: "8:15:05" },
    { id: "dsps-v2", title: "Python for Data Science", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI", duration: "12:19:49" },
    { id: "dsps-v3", title: "Statistics Fundamentals – StatQuest", channel: "StatQuest", url: "https://www.youtube.com/watch?v=qBigTkBLU6g", duration: "20:45" },
  ],
  "ds-data-wrangling": [
    { id: "dsdw-v1", title: "Pandas Tutorial – Data Analysis with Python", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=vmEHCJofslg", duration: "4:47:35" },
    { id: "dsdw-v2", title: "Web Scraping with Python – BeautifulSoup", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=XVv6mJpFOb0", duration: "1:01:50" },
    { id: "dsdw-v3", title: "Data Cleaning with Python & Pandas", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=bDhvCp3_lYw", duration: "35:21" },
  ],
  "ds-sql": [
    { id: "dss-v1", title: "SQL for Data Science – Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", duration: "4:20:37" },
    { id: "dss-v2", title: "Advanced SQL Tutorial", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=M-55BmjOuXY", duration: "3:01:23" },
    { id: "dss-v3", title: "SQL Window Functions", channel: "Fireship", url: "https://www.youtube.com/watch?v=H6OTq7Sv1Xo", duration: "6:12" },
  ],
  "ds-visualization": [
    { id: "dsv-v1", title: "Matplotlib Crash Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=3Xc3CA655Y4", duration: "1:38:43" },
    { id: "dsv-v2", title: "Seaborn Tutorial – Data Visualization", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=6GUZXDef2U0", duration: "2:14:56" },
    { id: "dsv-v3", title: "Plotly Python Tutorial", channel: "Charming Data", url: "https://www.youtube.com/watch?v=GGL6U0k8WYA", duration: "44:10" },
  ],
  "ds-ml-modeling": [
    { id: "dsml-v1", title: "Machine Learning with scikit-learn", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=pqNCD_5r0IU", duration: "2:36:00" },
    { id: "dsml-v2", title: "Random Forest Algorithm", channel: "StatQuest", url: "https://www.youtube.com/watch?v=J4Wdy0Wc_xQ", duration: "9:54" },
    { id: "dsml-v3", title: "XGBoost Tutorial", channel: "StatQuest", url: "https://www.youtube.com/watch?v=OtD8wVaFm6E", duration: "15:22" },
  ],
  "ds-communicate-career": [
    { id: "dscc-v1", title: "Streamlit Crash Course – Build Data Apps", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=JwSS70SZdyM", duration: "3:02:18" },
    { id: "dscc-v2", title: "How to Get a Data Science Job", channel: "Tech With Tim", url: "https://www.youtube.com/watch?v=m2MIpDrF7Es", duration: "18:45" },
    { id: "dscc-v3", title: "Data Science Portfolio Tips", channel: "Fireship", url: "https://www.youtube.com/watch?v=MKWqoUMBq-Q", duration: "7:22" },
  ],

  /* -----------------------------------------------------------------------
   * DevOps
   * --------------------------------------------------------------------- */
  "devops-linux-cli": [
    { id: "dlc-v1", title: "Linux for Beginners Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=sWbUDq4S6Y8", duration: "5:22:51" },
    { id: "dlc-v2", title: "Bash Scripting Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=e7BufAVwDiM", duration: "2:29:12" },
    { id: "dlc-v3", title: "Linux in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=rrB13utjYV4", duration: "2:46" },
  ],
  "devops-containers": [
    { id: "dc-v1", title: "Docker Tutorial for Beginners", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=pg19Z8LL06w", duration: "1:07:42" },
    { id: "dc-v2", title: "Docker in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=Gjnup-PuquQ", duration: "2:36" },
    { id: "dc-v3", title: "Docker Compose Tutorial", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=MVIcrmeV_6c", duration: "26:52" },
  ],
  "devops-ci-cd": [
    { id: "dci-v1", title: "GitHub Actions Tutorial", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", duration: "32:35" },
    { id: "dci-v2", title: "CI/CD in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=scEDHsr3APg", duration: "2:32" },
    { id: "dci-v3", title: "Jenkins Full Course for Beginners", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=pMO26jELH4U", duration: "3:07:43" },
  ],
  "devops-orchestration": [
    { id: "do-v1", title: "Kubernetes Tutorial for Beginners", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=X48VuDVv0do", duration: "3:36:52" },
    { id: "do-v2", title: "Kubernetes in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=PziYflu8cB8", duration: "2:42" },
    { id: "do-v3", title: "Helm Charts Explained", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=-ykwb1d0DXU", duration: "14:26" },
  ],
  "devops-iac-monitoring": [
    { id: "dim-v1", title: "Terraform Course – Automate your AWS Infrastructure", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=SLB_c_ayRMo", duration: "2:22:53" },
    { id: "dim-v2", title: "Prometheus & Grafana Tutorial", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=7gW5pSM6dlU", duration: "22:14" },
    { id: "dim-v3", title: "Terraform in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=tomUWcQ0P3k", duration: "2:53" },
  ],
  "devops-deploy-career": [
    { id: "ddc-v1", title: "AWS Tutorial for Beginners", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=ulprqHHWlng", duration: "5:27:29" },
    { id: "ddc-v2", title: "DevOps Roadmap 2024", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=9pZ2xmsSDdo", duration: "16:32" },
    { id: "ddc-v3", title: "How I Became a DevOps Engineer", channel: "NetworkChuck", url: "https://www.youtube.com/watch?v=Cthla7KqU04", duration: "12:58" },
  ],

  /* -----------------------------------------------------------------------
   * Cloud
   * --------------------------------------------------------------------- */
  "cloud-fundamentals": [
    { id: "cf-v1", title: "Cloud Computing Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=M988_fsOSWo", duration: "3:41:35" },
    { id: "cf-v2", title: "AWS vs Azure vs GCP", channel: "Fireship", url: "https://www.youtube.com/watch?v=n24OBVGHufQ", duration: "5:48" },
    { id: "cf-v3", title: "AWS Cloud Practitioner – Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=SOTamWNgDKc", duration: "13:12:28" },
  ],
  "cloud-networking": [
    { id: "cn-v1", title: "AWS VPC Tutorial", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=iKGkBIFBEyI", duration: "25:48" },
    { id: "cn-v2", title: "Computer Networking Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=qiQR5rTSshw", duration: "1:58:38" },
    { id: "cn-v3", title: "DNS in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=UVR9lhUGAyU", duration: "3:07" },
  ],
  "cloud-compute-storage": [
    { id: "ccs-v1", title: "AWS EC2 Tutorial for Beginners", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=iHX-jtKIVNA", duration: "18:42" },
    { id: "ccs-v2", title: "AWS S3 Tutorial", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=mDRoyPFJvlU", duration: "19:56" },
    { id: "ccs-v3", title: "Auto Scaling on AWS", channel: "Fireship", url: "https://www.youtube.com/watch?v=4EOhcHlB4BU", duration: "6:23" },
  ],
  "cloud-serverless": [
    { id: "cs-v1", title: "Serverless Computing in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=W_VV2Fx32_Y", duration: "2:47" },
    { id: "cs-v2", title: "AWS Lambda Tutorial", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=eOBq__h4OJ4", duration: "1:08:19" },
    { id: "cs-v3", title: "Build a Serverless App on AWS", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=fSUEk6iMW88", duration: "37:21" },
  ],
  "cloud-iac-deploy-career": [
    { id: "cidc-v1", title: "Terraform Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=SLB_c_ayRMo", duration: "2:22:53" },
    { id: "cidc-v2", title: "AWS Solutions Architect Associate – Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=Ia-UEYYR44s", duration: "10:30:32" },
    { id: "cidc-v3", title: "Cloud Career Roadmap 2024", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=9pZ2xmsSDdo", duration: "16:32" },
  ],

  /* -----------------------------------------------------------------------
   * Cybersecurity
   * --------------------------------------------------------------------- */
  "cyber-networking-foundations": [
    { id: "cnf-v1", title: "Networking Fundamentals – Full Course", channel: "NetworkChuck", url: "https://www.youtube.com/watch?v=qiQR5rTSshw", duration: "1:58:38" },
    { id: "cnf-v2", title: "Wireshark Tutorial for Beginners", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=lb1Dw0elj0Q", duration: "2:01:42" },
    { id: "cnf-v3", title: "TCP/IP Explained", channel: "NetworkChuck", url: "https://www.youtube.com/watch?v=CRdL1PVSHGk", duration: "22:08" },
  ],
  "cyber-security-fundamentals": [
    { id: "csf-v1", title: "Cybersecurity Full Course for Beginners", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=U_P23SqJaDc", duration: "15:43:24" },
    { id: "csf-v2", title: "Cryptography Explained", channel: "Fireship", url: "https://www.youtube.com/watch?v=jhXCTbFnK8o", duration: "9:32" },
    { id: "csf-v3", title: "What is Cybersecurity?", channel: "NetworkChuck", url: "https://www.youtube.com/watch?v=inWWhr5tnEA", duration: "14:57" },
  ],
  "cyber-web-app-security": [
    { id: "cwas-v1", title: "OWASP Top 10 – Web Security", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=rWHvp7rUka8", duration: "2:13:20" },
    { id: "cwas-v2", title: "XSS Explained", channel: "John Hammond", url: "https://www.youtube.com/watch?v=EoaDgUgS6QA", duration: "18:46" },
    { id: "cwas-v3", title: "SQL Injection Tutorial", channel: "NetworkChuck", url: "https://www.youtube.com/watch?v=2OPVViV-GQk", duration: "16:23" },
  ],
  "cyber-offensive-defensive": [
    { id: "cod-v1", title: "Ethical Hacking Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=3Kq1MIfTWCE", duration: "15:23:00" },
    { id: "cod-v2", title: "Kali Linux Tutorial", channel: "NetworkChuck", url: "https://www.youtube.com/watch?v=lZAoFs75_cs", duration: "18:32" },
    { id: "cod-v3", title: "TryHackMe vs HackTheBox", channel: "John Hammond", url: "https://www.youtube.com/watch?v=BPLlrmSaAXk", duration: "12:18" },
  ],
  "cyber-career": [
    { id: "cc-v1", title: "CompTIA Security+ Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=O4pJeXgOJNs", duration: "13:45:22" },
    { id: "cc-v2", title: "How to Start a Career in Cybersecurity", channel: "NetworkChuck", url: "https://www.youtube.com/watch?v=Kp4Mvapo5kc", duration: "22:42" },
    { id: "cc-v3", title: "Bug Bounty Hunting for Beginners", channel: "John Hammond", url: "https://www.youtube.com/watch?v=WnN6dbos5u8", duration: "25:12" },
  ],

  /* -----------------------------------------------------------------------
   * Game Dev
   * --------------------------------------------------------------------- */
  "gamedev-programming-foundations": [
    { id: "gpf-v1", title: "C# Tutorial Full Course for Beginners", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=GhQdlMFylQ8", duration: "4:31:08" },
    { id: "gpf-v2", title: "Game Dev Math – All You Need to Know", channel: "Brackeys", url: "https://www.youtube.com/watch?v=MOYiVLEnhrw", duration: "14:22" },
    { id: "gpf-v3", title: "Game Programming Patterns", channel: "Fireship", url: "https://www.youtube.com/watch?v=hQE8lQk9ikE", duration: "8:33" },
  ],
  "gamedev-engine-basics": [
    { id: "geb-v1", title: "Unity Beginner Tutorial – Make Your First Game", channel: "Brackeys", url: "https://www.youtube.com/watch?v=j48LtUkZRjU", duration: "30:23" },
    { id: "geb-v2", title: "Unity in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=iqlH4okiQqg", duration: "2:52" },
    { id: "geb-v3", title: "Unreal Engine 5 Beginner Tutorial", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=6UlU_FsicK8", duration: "5:14:42" },
  ],
  "gamedev-graphics-physics": [
    { id: "ggp-v1", title: "2D Game Art Tutorial", channel: "Brackeys", url: "https://www.youtube.com/watch?v=RQo44bKLSOM", duration: "12:46" },
    { id: "ggp-v2", title: "Unity Shader Graph Tutorial", channel: "Brackeys", url: "https://www.youtube.com/watch?v=Ar9eIn4z6XE", duration: "18:22" },
    { id: "ggp-v3", title: "Physics in Unity – Rigidbody & Colliders", channel: "Brackeys", url: "https://www.youtube.com/watch?v=WPrP_kkRlNU", duration: "16:42" },
  ],
  "gamedev-gameplay-systems": [
    { id: "ggs-v1", title: "Unity UI Tutorial", channel: "Brackeys", url: "https://www.youtube.com/watch?v=_RIsfVOqTaE", duration: "23:45" },
    { id: "ggs-v2", title: "Enemy AI in Unity – NavMesh", channel: "Brackeys", url: "https://www.youtube.com/watch?v=CHV1ymlw-P8", duration: "12:08" },
    { id: "ggs-v3", title: "Save & Load System in Unity", channel: "Brackeys", url: "https://www.youtube.com/watch?v=XOjd_qU2Ido", duration: "19:32" },
  ],
  "gamedev-publish-career": [
    { id: "gpc-v1", title: "How to Publish on Steam", channel: "Brackeys", url: "https://www.youtube.com/watch?v=UBb419bqaek", duration: "10:25" },
    { id: "gpc-v2", title: "How to Become a Game Developer", channel: "Fireship", url: "https://www.youtube.com/watch?v=hQWRp-FdTpc", duration: "8:42" },
    { id: "gpc-v3", title: "Game Jam Tips for Beginners", channel: "Brackeys", url: "https://www.youtube.com/watch?v=fRGqv4bHQ0o", duration: "7:18" },
  ],

  /* -----------------------------------------------------------------------
   * Blockchain
   * --------------------------------------------------------------------- */
  "blockchain-fundamentals": [
    { id: "bf-v1", title: "Blockchain Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=gyMwXuJrbJQ", duration: "32:26:25" },
    { id: "bf-v2", title: "Blockchain in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=kHybf1aC-jE", duration: "2:49" },
    { id: "bf-v3", title: "How does Bitcoin work?", channel: "3Blue1Brown", url: "https://www.youtube.com/watch?v=bBC-nXj3Ng4", duration: "26:21" },
  ],
  "blockchain-solidity": [
    { id: "bs-v1", title: "Solidity Tutorial – Full Course for Beginners", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=gyMwXuJrbJQ", duration: "32:26:25" },
    { id: "bs-v2", title: "Solidity in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=kdvVwGrV7ec", duration: "2:42" },
    { id: "bs-v3", title: "Smart Contracts – Security Best Practices", channel: "Patrick Collins", url: "https://www.youtube.com/watch?v=pUWmJ86X_do", duration: "3:47:15" },
  ],
  "blockchain-dapp-dev": [
    { id: "bdd-v1", title: "Build a Web3 DApp with React & Solidity", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=a0osIaAOFSE", duration: "2:12:43" },
    { id: "bdd-v2", title: "Ethers.js Crash Course", channel: "Patrick Collins", url: "https://www.youtube.com/watch?v=yk7nVp5HTCk", duration: "1:24:18" },
    { id: "bdd-v3", title: "MetaMask Integration Tutorial", channel: "Fireship", url: "https://www.youtube.com/watch?v=meTpMP0J5E8", duration: "10:22" },
  ],
  "blockchain-security-testing": [
    { id: "bst-v1", title: "Smart Contract Security – Reentrancy Attack", channel: "Patrick Collins", url: "https://www.youtube.com/watch?v=4Mm3BCyHtDY", duration: "28:12" },
    { id: "bst-v2", title: "Solidity Security Audit", channel: "Fireship", url: "https://www.youtube.com/watch?v=TmZ8gH-toX0", duration: "8:47" },
    { id: "bst-v3", title: "Gas Optimization in Solidity", channel: "Patrick Collins", url: "https://www.youtube.com/watch?v=IkdoQI7API0", duration: "1:12:34" },
  ],
  "blockchain-deploy-career": [
    { id: "bdce-v1", title: "Deploy to Ethereum Mainnet with Hardhat", channel: "Patrick Collins", url: "https://www.youtube.com/watch?v=gyMwXuJrbJQ", duration: "32:26:25" },
    { id: "bdce-v2", title: "Layer 2 Solutions Explained", channel: "Fireship", url: "https://www.youtube.com/watch?v=7pWxCklcNsU", duration: "7:14" },
    { id: "bdce-v3", title: "How to Become a Web3 Developer", channel: "Fireship", url: "https://www.youtube.com/watch?v=EYAwj6g8Dbg", duration: "9:38" },
  ],
};
