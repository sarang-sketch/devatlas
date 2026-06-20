/**
 * Sub-skill workflow steps for every roadmap node.
 *
 * Each node maps to 4-6 ordered micro-milestones that visualise the
 * learning path within that topic.  Consumed by the WorkflowDiagram
 * component inside NodeSectionPanel.
 */

export interface WorkflowStep {
  id: string;
  label: string;
  description: string;
}

export const NODE_WORKFLOWS: Record<string, WorkflowStep[]> = {
  /* -----------------------------------------------------------------------
   * Frontend
   * --------------------------------------------------------------------- */
  "frontend-web-foundations": [
    { id: "fwf-1", label: "HTML Semantics", description: "Master semantic tags like header, nav, main, article, and section for accessible markup." },
    { id: "fwf-2", label: "Forms & Validation", description: "Build forms with input types, labels, fieldsets, and native validation attributes." },
    { id: "fwf-3", label: "CSS Box Model", description: "Understand margin, padding, border, and how box-sizing affects layout." },
    { id: "fwf-4", label: "Flexbox Layout", description: "Create one-dimensional layouts using flex containers, alignment, and wrapping." },
    { id: "fwf-5", label: "CSS Grid", description: "Design two-dimensional page layouts with grid templates, areas, and auto-placement." },
    { id: "fwf-6", label: "Responsive Design", description: "Use media queries, fluid typography, and container queries for mobile-first sites." },
  ],
  "frontend-javascript-essentials": [
    { id: "fje-1", label: "Variables & Types", description: "Learn let, const, primitive types, type coercion, and template literals." },
    { id: "fje-2", label: "Functions & Scope", description: "Understand declarations, arrow functions, closures, and lexical scope." },
    { id: "fje-3", label: "DOM Manipulation", description: "Select, create, and modify DOM elements; handle events and event delegation." },
    { id: "fje-4", label: "Async JavaScript", description: "Master callbacks, Promises, async/await, and the event loop." },
    { id: "fje-5", label: "ES6+ Features", description: "Use destructuring, spread/rest, modules, Map/Set, and optional chaining." },
  ],
  "frontend-version-control": [
    { id: "fvc-1", label: "Git Basics", description: "Install Git, init repos, stage changes, and commit with meaningful messages." },
    { id: "fvc-2", label: "Branching & Merging", description: "Create feature branches, merge strategies, and resolve merge conflicts." },
    { id: "fvc-3", label: "GitHub Workflow", description: "Fork repos, open pull requests, perform code reviews, and manage issues." },
    { id: "fvc-4", label: "Advanced Git", description: "Use rebase, cherry-pick, stash, and interactive rebase for clean history." },
  ],
  "frontend-react": [
    { id: "fr-1", label: "Components & JSX", description: "Create functional components, understand JSX syntax, and compose UIs." },
    { id: "fr-2", label: "Props & State", description: "Pass data via props, manage local state with useState, and lift state up." },
    { id: "fr-3", label: "Hooks Deep Dive", description: "Use useEffect, useRef, useMemo, useCallback, and custom hooks." },
    { id: "fr-4", label: "Routing", description: "Implement client-side routing with React Router or Next.js App Router." },
    { id: "fr-5", label: "State Management", description: "Manage global state with Context API, Zustand, or Redux Toolkit." },
  ],
  "frontend-styling-systems": [
    { id: "fss-1", label: "CSS Modules", description: "Scope styles per component using CSS Modules for collision-free class names." },
    { id: "fss-2", label: "Tailwind CSS", description: "Build UIs with utility-first classes, customise the config, and use plugins." },
    { id: "fss-3", label: "CSS-in-JS", description: "Use styled-components or Emotion for dynamic, theme-aware styling in JS." },
    { id: "fss-4", label: "Design Systems", description: "Create a reusable component library with tokens, variants, and documentation." },
  ],
  "frontend-tooling-testing": [
    { id: "ftt-1", label: "Package Managers", description: "Use npm, yarn, or pnpm to manage dependencies and lock files." },
    { id: "ftt-2", label: "Bundlers", description: "Configure Vite or Webpack for dev servers, HMR, and production builds." },
    { id: "ftt-3", label: "Linting & Formatting", description: "Set up ESLint and Prettier for consistent, error-free code." },
    { id: "ftt-4", label: "Unit Testing", description: "Write and run tests with Vitest or Jest and React Testing Library." },
    { id: "ftt-5", label: "E2E Testing", description: "Automate browser testing with Playwright or Cypress for full user flows." },
  ],
  "frontend-deploy-career": [
    { id: "fdc-1", label: "Build & Optimize", description: "Create production builds with code splitting, tree shaking, and lazy loading." },
    { id: "fdc-2", label: "Deploy to Vercel", description: "Connect a Git repo and deploy with automatic previews and custom domains." },
    { id: "fdc-3", label: "Portfolio Site", description: "Build a personal portfolio showcasing projects, blog posts, and contact info." },
    { id: "fdc-4", label: "Interview Prep", description: "Practice frontend interview patterns, system design, and coding challenges." },
  ],

  /* -----------------------------------------------------------------------
   * Backend
   * --------------------------------------------------------------------- */
  "backend-language-fundamentals": [
    { id: "blf-1", label: "Core Syntax", description: "Learn variables, control flow, functions, and error handling in your chosen language." },
    { id: "blf-2", label: "Data Structures", description: "Work with arrays, objects, maps, sets, and understand time complexity basics." },
    { id: "blf-3", label: "OOP Principles", description: "Understand classes, inheritance, encapsulation, polymorphism, and SOLID principles." },
    { id: "blf-4", label: "File I/O & Modules", description: "Read/write files, organise code into modules, and manage dependencies." },
    { id: "blf-5", label: "Concurrency", description: "Handle async operations, threads, or event loops depending on your runtime." },
  ],
  "backend-http-apis": [
    { id: "bha-1", label: "HTTP Fundamentals", description: "Understand request methods, status codes, headers, and the request-response cycle." },
    { id: "bha-2", label: "REST API Design", description: "Design RESTful endpoints with proper resource naming, versioning, and pagination." },
    { id: "bha-3", label: "Express / FastAPI", description: "Build a server with routing, middleware, request validation, and error handling." },
    { id: "bha-4", label: "GraphQL Basics", description: "Define schemas, resolvers, queries, and mutations for flexible data fetching." },
    { id: "bha-5", label: "API Documentation", description: "Generate OpenAPI/Swagger docs and write clear endpoint documentation." },
  ],
  "backend-databases": [
    { id: "bd-1", label: "SQL Fundamentals", description: "Write SELECT, INSERT, UPDATE, DELETE queries and understand relational schema design." },
    { id: "bd-2", label: "Joins & Indexing", description: "Use JOINs, subqueries, and create indexes for performant queries." },
    { id: "bd-3", label: "ORMs", description: "Use Prisma, Sequelize, or SQLAlchemy to interact with databases from application code." },
    { id: "bd-4", label: "NoSQL Databases", description: "Model data for MongoDB or Redis and understand when to choose NoSQL." },
    { id: "bd-5", label: "Migrations", description: "Version database schemas and run migrations safely in development and production." },
  ],
  "backend-auth-security": [
    { id: "bas-1", label: "Password Hashing", description: "Hash and salt passwords with bcrypt or Argon2; never store plaintext passwords." },
    { id: "bas-2", label: "JWT & Sessions", description: "Implement token-based auth with JWTs and understand session-based alternatives." },
    { id: "bas-3", label: "OAuth 2.0", description: "Integrate third-party login providers like Google, GitHub, and Discord." },
    { id: "bas-4", label: "RBAC & Permissions", description: "Implement role-based access control to protect routes and resources." },
    { id: "bas-5", label: "Security Best Practices", description: "Prevent OWASP Top 10 vulnerabilities: XSS, CSRF, SQL injection, and more." },
  ],
  "backend-testing-observability": [
    { id: "bto-1", label: "Unit Testing", description: "Write isolated tests for business logic using Jest, Pytest, or JUnit." },
    { id: "bto-2", label: "Integration Testing", description: "Test API endpoints with real database connections and HTTP assertions." },
    { id: "bto-3", label: "Logging", description: "Implement structured logging with Winston, Pino, or Python logging module." },
    { id: "bto-4", label: "Monitoring & Alerting", description: "Set up health checks, uptime monitoring, and error alerting with tools like Sentry." },
  ],
  "backend-deploy-career": [
    { id: "bdc-1", label: "Containerize", description: "Write a Dockerfile, build images, and run containers locally." },
    { id: "bdc-2", label: "Cloud Deployment", description: "Deploy to Railway, Render, or AWS with environment variables and secrets." },
    { id: "bdc-3", label: "CI/CD Pipeline", description: "Automate tests and deployments with GitHub Actions or GitLab CI." },
    { id: "bdc-4", label: "Backend Portfolio", description: "Showcase API projects, system design docs, and open-source contributions." },
  ],

  /* -----------------------------------------------------------------------
   * Full Stack
   * --------------------------------------------------------------------- */
  "fullstack-frontend-foundations": [
    { id: "fsff-1", label: "HTML & CSS", description: "Build semantic, responsive layouts using modern HTML5 and CSS3 techniques." },
    { id: "fsff-2", label: "JavaScript Essentials", description: "Master DOM manipulation, async patterns, and ES6+ features." },
    { id: "fsff-3", label: "React Fundamentals", description: "Create component-based UIs with hooks, props, and state management." },
    { id: "fsff-4", label: "UI Libraries", description: "Accelerate development with Shadcn/ui, Radix, or Material UI components." },
  ],
  "fullstack-backend-apis": [
    { id: "fsba-1", label: "Node.js Runtime", description: "Understand the event loop, modules, streams, and the Node ecosystem." },
    { id: "fsba-2", label: "REST API Server", description: "Build Express or Fastify APIs with validation, error handling, and middleware." },
    { id: "fsba-3", label: "API Security", description: "Implement CORS, rate limiting, helmet, and input sanitisation." },
    { id: "fsba-4", label: "File Uploads & Storage", description: "Handle multipart uploads and store files in S3 or Cloudflare R2." },
  ],
  "fullstack-databases": [
    { id: "fsd-1", label: "PostgreSQL Setup", description: "Install Postgres, create databases, and write efficient SQL queries." },
    { id: "fsd-2", label: "Prisma ORM", description: "Define schemas, run migrations, and use the Prisma Client for type-safe queries." },
    { id: "fsd-3", label: "Data Modeling", description: "Design normalized schemas with relations, constraints, and indexes." },
    { id: "fsd-4", label: "Caching with Redis", description: "Add Redis for session storage, rate limiting, and frequently accessed data." },
  ],
  "fullstack-framework": [
    { id: "fsf-1", label: "Next.js App Router", description: "Use file-based routing, layouts, loading states, and error boundaries." },
    { id: "fsf-2", label: "Server Components", description: "Render on the server for performance; understand client vs server boundaries." },
    { id: "fsf-3", label: "Data Fetching", description: "Use server actions, API routes, and React Query for seamless data flow." },
    { id: "fsf-4", label: "Full-Stack Patterns", description: "Implement tRPC or server actions for end-to-end type safety." },
  ],
  "fullstack-auth-state": [
    { id: "fsas-1", label: "Auth Setup", description: "Integrate NextAuth.js or Clerk for authentication with OAuth providers." },
    { id: "fsas-2", label: "Protected Routes", description: "Guard pages and API routes based on authentication and user roles." },
    { id: "fsas-3", label: "Global State", description: "Manage client state with Zustand or React Context for UI interactions." },
    { id: "fsas-4", label: "Server State", description: "Use React Query or SWR for cache-first data fetching with revalidation." },
  ],
  "fullstack-deploy-career": [
    { id: "fsdc-1", label: "Vercel Deploy", description: "Deploy Next.js apps with automatic previews, analytics, and edge functions." },
    { id: "fsdc-2", label: "Database Hosting", description: "Use Supabase, PlanetScale, or Neon for managed Postgres in the cloud." },
    { id: "fsdc-3", label: "Full-Stack Portfolio", description: "Ship 2-3 production apps and document architecture decisions in case studies." },
    { id: "fsdc-4", label: "System Design", description: "Practice designing scalable full-stack architectures for interviews." },
  ],

  /* -----------------------------------------------------------------------
   * Mobile
   * --------------------------------------------------------------------- */
  "mobile-foundations": [
    { id: "mf-1", label: "Mobile UX Principles", description: "Learn touch targets, navigation patterns, and responsive mobile layouts." },
    { id: "mf-2", label: "JavaScript/TypeScript", description: "Solidify JS/TS skills needed for cross-platform mobile development." },
    { id: "mf-3", label: "Dev Environment", description: "Set up Android Studio, Xcode, and configure emulators/simulators." },
    { id: "mf-4", label: "React Native CLI", description: "Create a new project, understand the metro bundler, and run on devices." },
  ],
  "mobile-react-native": [
    { id: "mrn-1", label: "Core Components", description: "Use View, Text, ScrollView, FlatList, and Image for native UI." },
    { id: "mrn-2", label: "Styling & Layout", description: "Style with StyleSheet, Flexbox, and platform-specific adaptations." },
    { id: "mrn-3", label: "Navigation", description: "Implement stack, tab, and drawer navigation with React Navigation." },
    { id: "mrn-4", label: "Expo Ecosystem", description: "Use Expo for quick prototyping, OTA updates, and built-in device APIs." },
  ],
  "mobile-native-apis": [
    { id: "mna-1", label: "Camera & Media", description: "Access the camera, photo library, and media playback APIs." },
    { id: "mna-2", label: "Geolocation", description: "Use location services for maps, geofencing, and location-based features." },
    { id: "mna-3", label: "Push Notifications", description: "Implement push notifications with Firebase Cloud Messaging or APNs." },
    { id: "mna-4", label: "Sensors & Permissions", description: "Access device sensors and handle runtime permission requests properly." },
  ],
  "mobile-state-data": [
    { id: "msd-1", label: "State Management", description: "Manage app state with Redux Toolkit, Zustand, or MobX in React Native." },
    { id: "msd-2", label: "REST & GraphQL", description: "Fetch data from APIs using Axios, fetch, or Apollo Client." },
    { id: "msd-3", label: "Local Storage", description: "Persist data with AsyncStorage, MMKV, or SQLite for offline support." },
    { id: "msd-4", label: "Offline-First", description: "Implement sync strategies and conflict resolution for offline-capable apps." },
  ],
  "mobile-deploy-career": [
    { id: "mdc-1", label: "App Store Build", description: "Generate signed builds for iOS (IPA) and Android (AAB) distribution." },
    { id: "mdc-2", label: "App Store Submission", description: "Prepare metadata, screenshots, and submit to Apple App Store and Google Play." },
    { id: "mdc-3", label: "OTA Updates", description: "Ship updates instantly with EAS Update or CodePush without store review." },
    { id: "mdc-4", label: "Mobile Portfolio", description: "Showcase published apps with download links, demo videos, and tech stack details." },
  ],

  /* -----------------------------------------------------------------------
   * AI Engineer
   * --------------------------------------------------------------------- */
  "ai-python-foundations": [
    { id: "aipf-1", label: "Python Essentials", description: "Master Python syntax, data structures, comprehensions, and virtual environments." },
    { id: "aipf-2", label: "NumPy & Pandas", description: "Process numerical arrays and tabular data for AI/ML preprocessing." },
    { id: "aipf-3", label: "Jupyter Notebooks", description: "Use notebooks for interactive exploration, visualization, and documentation." },
    { id: "aipf-4", label: "APIs & HTTP", description: "Make API calls with requests/httpx to interact with AI services." },
  ],
  "ai-llm-fundamentals": [
    { id: "ailf-1", label: "Transformer Architecture", description: "Understand attention mechanisms, tokenization, and how LLMs generate text." },
    { id: "ailf-2", label: "OpenAI API", description: "Use the Completions and Chat API for text generation, summarization, and Q&A." },
    { id: "ailf-3", label: "Open-Source Models", description: "Run Llama, Mistral, or Gemma locally using Ollama or Hugging Face." },
    { id: "ailf-4", label: "Fine-Tuning Basics", description: "Fine-tune models with LoRA/QLoRA for domain-specific tasks." },
  ],
  "ai-prompt-engineering": [
    { id: "aipe-1", label: "Prompt Patterns", description: "Learn zero-shot, few-shot, chain-of-thought, and system prompt design." },
    { id: "aipe-2", label: "Output Formatting", description: "Structure LLM outputs as JSON, markdown, or code with reliable parsing." },
    { id: "aipe-3", label: "Tool Use & Agents", description: "Enable LLMs to call functions, search the web, and execute code." },
    { id: "aipe-4", label: "Evaluation", description: "Measure prompt quality with automated benchmarks and human evaluation." },
  ],
  "ai-rag-apps": [
    { id: "aira-1", label: "Embeddings", description: "Convert text to vector embeddings using OpenAI, Cohere, or sentence-transformers." },
    { id: "aira-2", label: "Vector Databases", description: "Store and query embeddings with Pinecone, Weaviate, or ChromaDB." },
    { id: "aira-3", label: "RAG Pipeline", description: "Build retrieval-augmented generation systems that ground LLM answers in your data." },
    { id: "aira-4", label: "LangChain / LlamaIndex", description: "Orchestrate chains, agents, and retrieval pipelines with popular frameworks." },
  ],
  "ai-deploy-career": [
    { id: "aidc-1", label: "API Deployment", description: "Serve AI models as REST APIs with FastAPI, modal, or Replicate." },
    { id: "aidc-2", label: "Streaming Responses", description: "Implement server-sent events for real-time streaming LLM outputs." },
    { id: "aidc-3", label: "Cost Optimization", description: "Manage token usage, caching, and model selection for cost-effective AI apps." },
    { id: "aidc-4", label: "AI Portfolio", description: "Build and showcase chatbots, RAG apps, and AI-powered tools to employers." },
  ],

  /* -----------------------------------------------------------------------
   * ML Engineer
   * --------------------------------------------------------------------- */
  "ml-math-python": [
    { id: "mlmp-1", label: "Linear Algebra", description: "Understand vectors, matrices, eigenvalues, and transformations for ML." },
    { id: "mlmp-2", label: "Calculus & Optimization", description: "Learn gradients, chain rule, and gradient descent for training models." },
    { id: "mlmp-3", label: "Probability & Statistics", description: "Master distributions, Bayes theorem, hypothesis testing, and confidence intervals." },
    { id: "mlmp-4", label: "NumPy & SciPy", description: "Implement mathematical operations efficiently with scientific Python libraries." },
  ],
  "ml-classical": [
    { id: "mlc-1", label: "Supervised Learning", description: "Implement linear regression, logistic regression, and decision trees with scikit-learn." },
    { id: "mlc-2", label: "Ensemble Methods", description: "Use Random Forests, Gradient Boosting, and XGBoost for robust predictions." },
    { id: "mlc-3", label: "Unsupervised Learning", description: "Apply K-Means, DBSCAN, and PCA for clustering and dimensionality reduction." },
    { id: "mlc-4", label: "Model Evaluation", description: "Use cross-validation, precision/recall, ROC-AUC, and confusion matrices." },
  ],
  "ml-deep-learning": [
    { id: "mldl-1", label: "Neural Networks", description: "Build feedforward networks, understand backpropagation, and activation functions." },
    { id: "mldl-2", label: "PyTorch Basics", description: "Create tensors, define models with nn.Module, and train with optimizers." },
    { id: "mldl-3", label: "CNNs", description: "Build convolutional networks for image classification and object detection." },
    { id: "mldl-4", label: "Transformers", description: "Understand self-attention, positional encoding, and fine-tune pretrained models." },
    { id: "mldl-5", label: "Transfer Learning", description: "Leverage pretrained models from Hugging Face for downstream tasks." },
  ],
  "ml-data-pipelines": [
    { id: "mldp-1", label: "Data Collection", description: "Scrape, download, and ingest data from APIs, files, and databases." },
    { id: "mldp-2", label: "Feature Engineering", description: "Create, select, and transform features for improved model performance." },
    { id: "mldp-3", label: "Data Validation", description: "Use Great Expectations or Pandera to validate data quality in pipelines." },
    { id: "mldp-4", label: "Pipeline Orchestration", description: "Build reproducible ML pipelines with Airflow, Prefect, or Dagster." },
  ],
  "ml-mlops-deploy": [
    { id: "mlmd-1", label: "Experiment Tracking", description: "Log metrics, parameters, and artifacts with MLflow or Weights & Biases." },
    { id: "mlmd-2", label: "Model Registry", description: "Version, stage, and promote models through dev/staging/production." },
    { id: "mlmd-3", label: "Model Serving", description: "Deploy models with TorchServe, TensorFlow Serving, or BentoML." },
    { id: "mlmd-4", label: "Monitoring & Drift", description: "Detect data drift and model degradation in production with Evidently or Whylabs." },
  ],

  /* -----------------------------------------------------------------------
   * Data Scientist
   * --------------------------------------------------------------------- */
  "ds-python-stats": [
    { id: "dsps-1", label: "Python for Data", description: "Master Python syntax, Jupyter, and data-oriented libraries." },
    { id: "dsps-2", label: "Descriptive Statistics", description: "Calculate mean, median, variance, and understand distributions." },
    { id: "dsps-3", label: "Inferential Statistics", description: "Perform hypothesis tests, confidence intervals, and A/B test analysis." },
    { id: "dsps-4", label: "Probability Theory", description: "Understand conditional probability, Bayes theorem, and random variables." },
  ],
  "ds-data-wrangling": [
    { id: "dsdw-1", label: "Pandas Mastery", description: "Load, filter, group, pivot, and merge DataFrames fluently." },
    { id: "dsdw-2", label: "Data Cleaning", description: "Handle missing values, duplicates, outliers, and inconsistent formats." },
    { id: "dsdw-3", label: "Web Scraping", description: "Extract data from websites using BeautifulSoup, Scrapy, or Selenium." },
    { id: "dsdw-4", label: "APIs & JSON", description: "Fetch and parse data from REST APIs into analysis-ready DataFrames." },
  ],
  "ds-sql": [
    { id: "dss-1", label: "SQL Queries", description: "Write SELECT, WHERE, GROUP BY, HAVING, and ORDER BY queries." },
    { id: "dss-2", label: "Joins & Subqueries", description: "Combine tables with INNER, LEFT, and CROSS JOINs and nested queries." },
    { id: "dss-3", label: "Window Functions", description: "Use ROW_NUMBER, RANK, LAG, LEAD, and running aggregates." },
    { id: "dss-4", label: "Database Tools", description: "Connect to PostgreSQL, MySQL, or BigQuery from Python notebooks." },
  ],
  "ds-visualization": [
    { id: "dsv-1", label: "Matplotlib", description: "Create line, bar, scatter, and histogram plots with full customization." },
    { id: "dsv-2", label: "Seaborn", description: "Build statistical visualizations: heatmaps, pair plots, and violin plots." },
    { id: "dsv-3", label: "Plotly", description: "Create interactive charts and dashboards for data exploration." },
    { id: "dsv-4", label: "Storytelling with Data", description: "Design clear, narrative-driven visualizations for stakeholder presentations." },
  ],
  "ds-ml-modeling": [
    { id: "dsml-1", label: "Regression Models", description: "Build linear and polynomial regression models for prediction tasks." },
    { id: "dsml-2", label: "Classification", description: "Implement logistic regression, SVM, and tree-based classifiers." },
    { id: "dsml-3", label: "Model Selection", description: "Use cross-validation, grid search, and learning curves to pick the best model." },
    { id: "dsml-4", label: "Feature Importance", description: "Interpret models with SHAP values, feature importances, and partial dependence." },
  ],
  "ds-communicate-career": [
    { id: "dscc-1", label: "Jupyter Reports", description: "Create polished, narrative notebooks that tell a data story." },
    { id: "dscc-2", label: "Dashboard Building", description: "Build interactive dashboards with Streamlit or Tableau." },
    { id: "dscc-3", label: "Presentations", description: "Present findings to non-technical stakeholders with clear insights." },
    { id: "dscc-4", label: "Portfolio & Kaggle", description: "Publish projects on GitHub, compete on Kaggle, and build your DS brand." },
  ],

  /* -----------------------------------------------------------------------
   * DevOps
   * --------------------------------------------------------------------- */
  "devops-linux-cli": [
    { id: "dlc-1", label: "Shell Basics", description: "Navigate the filesystem, manage files, and use pipes and redirects." },
    { id: "dlc-2", label: "Bash Scripting", description: "Write automation scripts with variables, loops, conditionals, and functions." },
    { id: "dlc-3", label: "User & Permissions", description: "Manage users, groups, file permissions, and sudo access." },
    { id: "dlc-4", label: "Networking Tools", description: "Use ssh, curl, netstat, dig, and iptables for network management." },
    { id: "dlc-5", label: "Package Management", description: "Install, update, and manage packages with apt, yum, or brew." },
  ],
  "devops-containers": [
    { id: "dc-1", label: "Docker Basics", description: "Understand images, containers, volumes, and the Docker lifecycle." },
    { id: "dc-2", label: "Dockerfile Best Practices", description: "Write multi-stage, layer-optimised Dockerfiles for production." },
    { id: "dc-3", label: "Docker Compose", description: "Define multi-container applications with services, networks, and volumes." },
    { id: "dc-4", label: "Container Registries", description: "Push and pull images from Docker Hub, GHCR, or ECR." },
  ],
  "devops-ci-cd": [
    { id: "dci-1", label: "CI Fundamentals", description: "Understand continuous integration: automated builds, tests, and linting." },
    { id: "dci-2", label: "GitHub Actions", description: "Write workflows with jobs, steps, matrix builds, and caching." },
    { id: "dci-3", label: "CD Pipelines", description: "Automate deployments to staging and production with approval gates." },
    { id: "dci-4", label: "Artifacts & Releases", description: "Publish build artifacts, create releases, and manage changelogs." },
  ],
  "devops-orchestration": [
    { id: "do-1", label: "Kubernetes Concepts", description: "Understand pods, services, deployments, and the declarative model." },
    { id: "do-2", label: "kubectl & Manifests", description: "Deploy apps with YAML manifests and manage clusters with kubectl." },
    { id: "do-3", label: "Helm Charts", description: "Package, version, and deploy Kubernetes applications with Helm." },
    { id: "do-4", label: "Service Mesh", description: "Use Istio or Linkerd for traffic management, observability, and security." },
  ],
  "devops-iac-monitoring": [
    { id: "dim-1", label: "Terraform Basics", description: "Define infrastructure as code with providers, resources, and state management." },
    { id: "dim-2", label: "Ansible Automation", description: "Automate server configuration with playbooks, roles, and inventories." },
    { id: "dim-3", label: "Prometheus & Grafana", description: "Collect metrics and build dashboards for infrastructure monitoring." },
    { id: "dim-4", label: "Log Aggregation", description: "Centralise logs with ELK Stack or Loki for troubleshooting and analysis." },
  ],
  "devops-deploy-career": [
    { id: "ddc-1", label: "Cloud Platforms", description: "Deploy to AWS, GCP, or Azure using managed services and best practices." },
    { id: "ddc-2", label: "SRE Practices", description: "Implement SLOs, error budgets, incident response, and post-mortems." },
    { id: "ddc-3", label: "DevOps Culture", description: "Champion collaboration, automation, and continuous improvement." },
    { id: "ddc-4", label: "Certifications", description: "Pursue AWS SAA, CKA, or Terraform Associate certifications for career growth." },
  ],

  /* -----------------------------------------------------------------------
   * Cloud
   * --------------------------------------------------------------------- */
  "cloud-fundamentals": [
    { id: "cf-1", label: "Cloud Concepts", description: "Understand IaaS, PaaS, SaaS, regions, availability zones, and pricing models." },
    { id: "cf-2", label: "AWS / GCP / Azure", description: "Create accounts, navigate consoles, and understand service catalogs." },
    { id: "cf-3", label: "IAM & Security", description: "Manage users, roles, policies, and multi-factor authentication." },
    { id: "cf-4", label: "Billing & Cost Control", description: "Set budgets, alerts, and use cost explorers to manage cloud spend." },
  ],
  "cloud-networking": [
    { id: "cn-1", label: "VPCs & Subnets", description: "Design virtual private clouds with public/private subnets and route tables." },
    { id: "cn-2", label: "Load Balancers", description: "Distribute traffic with ALB, NLB, or Cloud Load Balancing." },
    { id: "cn-3", label: "DNS & CDN", description: "Configure Route 53 or Cloud DNS, and use CloudFront or Cloudflare CDN." },
    { id: "cn-4", label: "Security Groups", description: "Control inbound/outbound traffic with firewall rules and NACLs." },
  ],
  "cloud-compute-storage": [
    { id: "ccs-1", label: "Virtual Machines", description: "Launch and manage EC2, Compute Engine, or Azure VM instances." },
    { id: "ccs-2", label: "Object Storage", description: "Store files in S3, GCS, or Azure Blob with lifecycle policies." },
    { id: "ccs-3", label: "Block & File Storage", description: "Attach persistent disks and shared file systems to instances." },
    { id: "ccs-4", label: "Auto Scaling", description: "Configure auto-scaling groups to handle variable workloads efficiently." },
  ],
  "cloud-serverless": [
    { id: "cs-1", label: "Lambda / Cloud Functions", description: "Write and deploy serverless functions triggered by events." },
    { id: "cs-2", label: "API Gateway", description: "Create serverless REST/HTTP APIs with authentication and throttling." },
    { id: "cs-3", label: "Event-Driven Architecture", description: "Connect services with SQS, SNS, EventBridge, or Pub/Sub." },
    { id: "cs-4", label: "Serverless Databases", description: "Use DynamoDB, Firestore, or Aurora Serverless for auto-scaling data." },
  ],
  "cloud-iac-deploy-career": [
    { id: "cidc-1", label: "Terraform on Cloud", description: "Provision cloud resources with Terraform modules and remote state." },
    { id: "cidc-2", label: "CI/CD for Infra", description: "Automate infrastructure changes with GitOps and Terraform Cloud." },
    { id: "cidc-3", label: "Cloud Certifications", description: "Prepare for AWS SAA, GCP ACE, or Azure AZ-104 certification exams." },
    { id: "cidc-4", label: "Architecture Portfolio", description: "Document cloud architectures with diagrams and cost analysis case studies." },
  ],

  /* -----------------------------------------------------------------------
   * Cybersecurity
   * --------------------------------------------------------------------- */
  "cyber-networking-foundations": [
    { id: "cnf-1", label: "OSI & TCP/IP", description: "Understand network layers, protocols, and how data travels across networks." },
    { id: "cnf-2", label: "DNS & HTTP", description: "Learn domain resolution, HTTP methods, headers, and TLS/SSL." },
    { id: "cnf-3", label: "Wireshark", description: "Capture and analyse network packets to understand traffic patterns." },
    { id: "cnf-4", label: "Firewalls & VPNs", description: "Configure firewalls, understand VPN tunnels, and network segmentation." },
  ],
  "cyber-security-fundamentals": [
    { id: "csf-1", label: "CIA Triad", description: "Understand confidentiality, integrity, and availability as security principles." },
    { id: "csf-2", label: "Cryptography", description: "Learn symmetric/asymmetric encryption, hashing, and digital signatures." },
    { id: "csf-3", label: "Risk Assessment", description: "Identify threats, vulnerabilities, and calculate risk with frameworks." },
    { id: "csf-4", label: "Security Frameworks", description: "Study NIST, ISO 27001, and CIS benchmarks for compliance." },
  ],
  "cyber-web-app-security": [
    { id: "cwas-1", label: "OWASP Top 10", description: "Identify and mitigate the most critical web application security risks." },
    { id: "cwas-2", label: "XSS & CSRF", description: "Understand cross-site scripting and request forgery attack vectors." },
    { id: "cwas-3", label: "SQL Injection", description: "Detect and prevent SQL injection in applications and databases." },
    { id: "cwas-4", label: "Burp Suite", description: "Use Burp Suite for web application security testing and vulnerability scanning." },
  ],
  "cyber-offensive-defensive": [
    { id: "cod-1", label: "Penetration Testing", description: "Conduct authorised ethical hacking engagements with methodology." },
    { id: "cod-2", label: "Kali Linux Tools", description: "Use Nmap, Metasploit, and John the Ripper for security assessments." },
    { id: "cod-3", label: "Blue Team Ops", description: "Implement SIEM, intrusion detection, and incident response procedures." },
    { id: "cod-4", label: "CTF Competitions", description: "Sharpen skills through Capture the Flag challenges on HackTheBox and TryHackMe." },
  ],
  "cyber-career": [
    { id: "cc-1", label: "Security Certifications", description: "Pursue CompTIA Security+, CEH, or OSCP for career advancement." },
    { id: "cc-2", label: "Bug Bounty", description: "Find and report vulnerabilities on HackerOne or Bugcrowd for rewards." },
    { id: "cc-3", label: "SOC Analyst Path", description: "Learn log analysis, alert triage, and escalation in a Security Operations Center." },
    { id: "cc-4", label: "Security Portfolio", description: "Document penetration test reports, CTF writeups, and tool contributions." },
  ],

  /* -----------------------------------------------------------------------
   * Game Dev
   * --------------------------------------------------------------------- */
  "gamedev-programming-foundations": [
    { id: "gpf-1", label: "C# or C++ Basics", description: "Learn syntax, OOP, memory management, and game-relevant patterns." },
    { id: "gpf-2", label: "Math for Games", description: "Master vectors, matrices, trigonometry, and physics for game mechanics." },
    { id: "gpf-3", label: "Design Patterns", description: "Implement game loop, state machine, observer, and object pool patterns." },
    { id: "gpf-4", label: "Data Structures", description: "Use spatial data structures like quadtrees, grids, and graph algorithms." },
  ],
  "gamedev-engine-basics": [
    { id: "geb-1", label: "Unity Setup", description: "Install Unity Hub, create projects, and navigate the editor interface." },
    { id: "geb-2", label: "Scene & GameObjects", description: "Build scenes with GameObjects, components, transforms, and prefabs." },
    { id: "geb-3", label: "Scripting", description: "Write MonoBehaviour scripts for player input, movement, and interactions." },
    { id: "geb-4", label: "Unreal Alternative", description: "Explore Unreal Engine 5 with Blueprints and C++ for AAA-quality games." },
  ],
  "gamedev-graphics-physics": [
    { id: "ggp-1", label: "2D Graphics", description: "Create sprites, animations, tilemaps, and parallax scrolling effects." },
    { id: "ggp-2", label: "3D Rendering", description: "Work with meshes, materials, lighting, shadows, and shaders." },
    { id: "ggp-3", label: "Physics Engine", description: "Use Rigidbody, colliders, raycasts, and physics materials for realism." },
    { id: "ggp-4", label: "Particle Systems", description: "Create visual effects: explosions, fire, smoke, and magic spells." },
  ],
  "gamedev-gameplay-systems": [
    { id: "ggs-1", label: "UI Systems", description: "Build HUDs, menus, health bars, and inventory screens with UI toolkit." },
    { id: "ggs-2", label: "AI & Pathfinding", description: "Implement enemy AI with state machines, behaviour trees, and NavMesh." },
    { id: "ggs-3", label: "Audio", description: "Add sound effects, background music, and spatial audio for immersion." },
    { id: "ggs-4", label: "Save & Load", description: "Implement save game systems with serialisation and file persistence." },
    { id: "ggs-5", label: "Multiplayer Basics", description: "Add networking with Netcode, Photon, or Mirror for online play." },
  ],
  "gamedev-publish-career": [
    { id: "gpc-1", label: "Build & Optimize", description: "Profile performance, optimise frame rate, and reduce build size." },
    { id: "gpc-2", label: "Publishing", description: "Publish to Steam, itch.io, App Store, or Google Play with store pages." },
    { id: "gpc-3", label: "Game Design Docs", description: "Write GDDs for your portfolio showing concept, mechanics, and level design." },
    { id: "gpc-4", label: "Game Jams", description: "Participate in Ludum Dare or GMTK Game Jam to build rapid prototypes." },
  ],

  /* -----------------------------------------------------------------------
   * Blockchain
   * --------------------------------------------------------------------- */
  "blockchain-fundamentals": [
    { id: "bf-1", label: "Blockchain Concepts", description: "Understand decentralisation, consensus mechanisms, and cryptographic hashing." },
    { id: "bf-2", label: "Bitcoin & Ethereum", description: "Learn how Bitcoin and Ethereum networks operate and differ." },
    { id: "bf-3", label: "Wallets & Transactions", description: "Create wallets, send transactions, and understand gas fees." },
    { id: "bf-4", label: "DeFi & NFTs", description: "Explore decentralised finance protocols and non-fungible token standards." },
  ],
  "blockchain-solidity": [
    { id: "bs-1", label: "Solidity Basics", description: "Learn data types, functions, modifiers, and contract structure in Solidity." },
    { id: "bs-2", label: "Smart Contracts", description: "Write, compile, and deploy smart contracts to test networks." },
    { id: "bs-3", label: "ERC Standards", description: "Implement ERC-20 tokens and ERC-721 NFTs with OpenZeppelin." },
    { id: "bs-4", label: "Hardhat Development", description: "Set up Hardhat for testing, deployment, and contract verification." },
  ],
  "blockchain-dapp-dev": [
    { id: "bdd-1", label: "Web3.js / Ethers.js", description: "Connect frontend apps to Ethereum using Web3 JavaScript libraries." },
    { id: "bdd-2", label: "Wallet Integration", description: "Integrate MetaMask and WalletConnect for user authentication." },
    { id: "bdd-3", label: "Frontend DApp", description: "Build a React DApp that reads/writes blockchain state through contracts." },
    { id: "bdd-4", label: "IPFS & Storage", description: "Store decentralised data and NFT metadata on IPFS or Arweave." },
  ],
  "blockchain-security-testing": [
    { id: "bst-1", label: "Common Vulnerabilities", description: "Identify reentrancy, overflow, front-running, and access control issues." },
    { id: "bst-2", label: "Testing Contracts", description: "Write unit and integration tests for smart contracts with Hardhat/Foundry." },
    { id: "bst-3", label: "Audit Tools", description: "Use Slither, Mythril, and Echidna for automated security analysis." },
    { id: "bst-4", label: "Gas Optimization", description: "Reduce gas costs with storage packing, caching, and efficient patterns." },
  ],
  "blockchain-deploy-career": [
    { id: "bdce-1", label: "Mainnet Deploy", description: "Deploy verified contracts to Ethereum or Polygon mainnet via Hardhat." },
    { id: "bdce-2", label: "The Graph", description: "Index blockchain data with subgraphs for efficient querying." },
    { id: "bdce-3", label: "L2 & Scaling", description: "Deploy on Arbitrum, Optimism, or zkSync for lower gas costs." },
    { id: "bdce-4", label: "Web3 Portfolio", description: "Showcase deployed DApps, audit reports, and open-source contributions." },
  ],
};
