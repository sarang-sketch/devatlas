# Audit of Missing Content and Features (roadmap.sh & free-for-dev)

This document contains a comprehensive audit comparing **DevAtlas** to the reference websites and repositories:
*   [roadmap.sh](https://roadmap.sh) / [developer-roadmap](https://github.com/nilbuild/developer-roadmap)
*   [free-for-dev](https://free-for-dev.com) / [free-for-dev repository](https://github.com/ripienaar/free-for-dev)

---

## 1. Roadmap Catalog (Role-Based & Technology-Based Paths)

DevAtlas implements the **12 core career roadmaps** (Frontend, Backend, Full Stack, Mobile, AI Engineer, ML Engineer, Data Scientist, DevOps, Cloud, Cybersecurity, Game Dev, Blockchain). 

However, `roadmap.sh` contains a much larger and more granular catalog:

### Role-Based Roadmaps Not Present
*   **QA Engineer** (Quality Assurance)
*   **Software Architect**
*   **Product Manager**
*   **Engineering Manager**
*   **Technical Lead**
*   **Data Engineer**
*   **Data Analyst**
*   **BI Analyst**
*   **Technical Writer**
*   **System Administrator**
*   **UX/UI Designer**

### Technology & Language Roadmaps Not Present
*   **Languages:** JavaScript, TypeScript, Python, Java, Go, Rust, C++, PHP, Kotlin, Swift.
*   **Frameworks & Libraries:** React, Next.js, Vue, Angular, Node.js, Spring Boot, Django, Laravel, Flutter, ASP.NET Core.
*   **Databases:** SQL, PostgreSQL, MongoDB, Redis, Elasticsearch.
*   **Infrastructure Tools:** Docker, Kubernetes, Terraform, AWS, Cloudflare, Linux, Git/GitHub.
*   **Core Concepts:** System Design, Prompt Engineering, UX Design, Design Systems, API Design, GraphQL, Algorithms.

---

## 2. Roadmap Layouts & Diagrams

`roadmap.sh` provides highly interactive, custom visual layouts:

### Diagrams & Features Not Present
*   **Multi-Branching Graphs / Mindmaps:** Horizontal and branching visual trees showing alternative paths (e.g. learning Angular vs Vue vs React as parallel paths).
*   **Interactive SVG Map Canvas:** Zoomable, pan-able SVG layout mapping nodes across multiple dimensions.
*   **Strict vs. Flexible Prerequisites:** Visual styling (e.g. solid vs dotted lines) for strict dependencies.
*   **Alternative Paths:** Nodes specifically marked as "Alternative Options" or "Order of Importance" (e.g., "Recommended", "Alternative", "Learn if you want").
*   **Embedded Video Guides:** Directly embedded explanation videos on node nodes.

---

## 3. Free Tools Categories

DevAtlas simplifies the developer tool space into **14 high-level categories** (AI, Hosting, Databases, Analytics, Auth, Storage, Monitoring, CI/CD, APIs, Design, Productivity, Testing, Security, Open Source).

`free-for-dev` lists hundreds of services across **50+ highly specialized categories** which are not fully represented or distinct in DevAtlas:

### Specialized Categories Not Present
*   **CDN & DDoS Protection** (e.g. Fastly, BunnyCDN)
*   **Domain Registration & DNS** (e.g. DuckDNS, Freenom)
*   **Email Sending / Inbox Testing** (e.g. Mailgun, SendGrid, Mailtrap)
*   **Crash & Exception Handling** (e.g. Sentry, Rollbar)
*   **Log Management** (e.g. Loggly, Papertrail)
*   **BaaS (Backend-as-a-Service)** (DevAtlas integrates Supabase under Databases, but does not list BaaS separately)
*   **Status Page Generators** (e.g. UptimeRobot, Cachet)
*   **E-Commerce Platforms** (e.g. Snipcart, Ecwid)
*   **Forms & Survey Tools** (e.g. Formspree, Typeform)
*   **Fonts & Typography Resources** (e.g. Fontsource)
*   **Geocoding & Maps APIs** (e.g. Mapbox, OpenStreetMap)
*   **Markdown Editors & Writers** (e.g. StackEdit)
*   **Media Hosting & Processing** (e.g. Cloudinary, Imgur API)
*   **Payment Integration** (e.g. Stripe developer sandboxes)
*   **PDF/Document Generators**
*   **Translation & Localization** (e.g. Crowdin, Transifex)
*   **Vagrant & VM Management Tools**
*   **Feature Toggles & Flag Management** (e.g. LaunchDarkly developer tier)
*   **Low-Code & Visual Development Platforms**

---

## 4. Platform Features

The following community and platform features from `roadmap.sh` are not present in DevAtlas (which runs entirely client-side without a database backend for the MVP):

*   **Teams & Custom Team Roadmaps:** Allowing companies to create custom learning paths for their teams.
*   **User Profiles & Public Progress Sharing:** Ability to share your public roadmap completion profile (e.g. `roadmap.sh/user/john`).
*   **Verified Certifications / Badges:** Integrated quizzes or assessments that issue badges upon path completion.
*   **Community Forums / Comments per Node:** Threaded discussions directly on HTML, CSS, React, etc., nodes where learners can help each other.
*   **Custom Roadmap Builder:** Interactive drag-and-drop tool to let users build their own custom maps.
