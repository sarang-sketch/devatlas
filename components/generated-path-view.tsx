"use client";

/**
 * DevAtlas GeneratedPathView — comprehensive learning plan display.
 *
 * After the user selects a career path, time commitment, and experience level,
 * this component renders a full structured learning plan including:
 *
 * - Summary header with estimated timeline
 * - Week-by-week milestone cards with:
 *   - Skills to learn
 *   - Languages/technologies
 *   - Free resources with links
 *   - YouTube video tutorials
 *   - Recommended free tools
 * - Recommended projects
 * - Deployment resources
 * - Free courses & certificates section
 */

import { useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Code2,
  ExternalLink as ExternalLinkIcon,
  GraduationCap,
  Layers,
  Rocket,
  Timer,
  Trophy,
  Wrench,
  PlayCircle,
  Award,
  Target,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import { ExternalLink } from "@/components/external-link";
import { NODE_WORKFLOWS } from "@/lib/data/node-workflows";
import { NODE_VIDEOS, type VideoResource } from "@/lib/data/node-videos";
import type { GeneratedPath, Milestone } from "@/lib/domain/types";

// ---------------------------------------------------------------------------
// Free courses & certificates database
// ---------------------------------------------------------------------------

interface FreeCourse {
  name: string;
  provider: string;
  url: string;
  certificate: boolean;
  description: string;
}

/** Maps career path IDs to relevant free courses/certificates */
const FREE_COURSES: Record<string, FreeCourse[]> = {
  frontend: [
    { name: "Responsive Web Design", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", certificate: true, description: "HTML, CSS, Flexbox, Grid — earn a free certificate" },
    { name: "JavaScript Algorithms and Data Structures", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/", certificate: true, description: "Master JavaScript fundamentals with certification" },
    { name: "Front-End Development Libraries", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/front-end-development-libraries/", certificate: true, description: "React, Redux, jQuery, Bootstrap, Sass" },
    { name: "Meta Front-End Developer", provider: "Coursera (audit free)", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer", certificate: false, description: "React, HTML/CSS, JavaScript by Meta" },
    { name: "CS50's Web Programming", provider: "Harvard/edX", url: "https://cs50.harvard.edu/web/", certificate: false, description: "Full web dev with Python, JavaScript, SQL" },
  ],
  backend: [
    { name: "Back End Development and APIs", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/", certificate: true, description: "Node.js, Express, MongoDB, APIs" },
    { name: "Relational Database", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/relational-database/", certificate: true, description: "PostgreSQL, Bash, Git — hands-on in terminal" },
    { name: "Meta Back-End Developer", provider: "Coursera (audit free)", url: "https://www.coursera.org/professional-certificates/meta-back-end-developer", certificate: false, description: "APIs, Django, MySQL by Meta" },
    { name: "Node.js Application Development", provider: "OpenJS Foundation", url: "https://training.linuxfoundation.org/training/nodejs-application-development-lfw211/", certificate: true, description: "Official Node.js certification prep" },
  ],
  fullstack: [
    { name: "Full Stack Open", provider: "University of Helsinki", url: "https://fullstackopen.com/en/", certificate: true, description: "React, Node, MongoDB, GraphQL, TypeScript — free university course" },
    { name: "The Odin Project", provider: "The Odin Project", url: "https://www.theodinproject.com/", certificate: false, description: "Complete full-stack curriculum with projects" },
    { name: "CS50's Web Programming", provider: "Harvard/edX", url: "https://cs50.harvard.edu/web/", certificate: false, description: "Python, JavaScript, SQL, Django, React" },
    { name: "IBM Full Stack Software Developer", provider: "Coursera (audit free)", url: "https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer", certificate: false, description: "Cloud-native full stack development" },
  ],
  mobile: [
    { name: "Meta React Native Specialization", provider: "Coursera (audit free)", url: "https://www.coursera.org/specializations/meta-react-native", certificate: false, description: "Build mobile apps with React Native" },
    { name: "CS193p - Developing Apps for iOS", provider: "Stanford", url: "https://cs193p.sites.stanford.edu/", certificate: false, description: "Free Stanford course on SwiftUI" },
    { name: "Android Basics with Compose", provider: "Google", url: "https://developer.android.com/courses/android-basics-compose/course", certificate: true, description: "Official Android development course" },
  ],
  "ai-engineer": [
    { name: "AI for Everyone", provider: "Coursera/DeepLearning.AI", url: "https://www.coursera.org/learn/ai-for-everyone", certificate: false, description: "Non-technical AI literacy by Andrew Ng" },
    { name: "ChatGPT Prompt Engineering", provider: "DeepLearning.AI", url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", certificate: true, description: "Free short course on prompt engineering" },
    { name: "LangChain for LLM Application Development", provider: "DeepLearning.AI", url: "https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/", certificate: true, description: "Build LLM apps with LangChain" },
    { name: "Machine Learning Specialization", provider: "Coursera/Stanford", url: "https://www.coursera.org/specializations/machine-learning-introduction", certificate: false, description: "Andrew Ng's legendary ML course" },
    { name: "Generative AI with LLMs", provider: "Coursera/AWS", url: "https://www.coursera.org/learn/generative-ai-with-llms", certificate: false, description: "LLM training, fine-tuning, deployment" },
  ],
  "ml-engineer": [
    { name: "Machine Learning Specialization", provider: "Coursera/Stanford", url: "https://www.coursera.org/specializations/machine-learning-introduction", certificate: false, description: "Supervised, unsupervised, recommenders" },
    { name: "Deep Learning Specialization", provider: "Coursera/DeepLearning.AI", url: "https://www.coursera.org/specializations/deep-learning", certificate: false, description: "Neural networks, CNNs, RNNs, transformers" },
    { name: "Machine Learning with Python", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/machine-learning-with-python/", certificate: true, description: "TensorFlow, NLP, neural networks" },
    { name: "MLOps Specialization", provider: "Coursera/DeepLearning.AI", url: "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops", certificate: false, description: "Production ML systems" },
  ],
  "data-scientist": [
    { name: "Data Analysis with Python", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/data-analysis-with-python/", certificate: true, description: "NumPy, Pandas, Matplotlib, Seaborn" },
    { name: "Data Visualization", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/data-visualization/", certificate: true, description: "D3.js charts and data storytelling" },
    { name: "Google Data Analytics", provider: "Coursera/Google", url: "https://www.coursera.org/professional-certificates/google-data-analytics", certificate: false, description: "SQL, R, Tableau, spreadsheets" },
    { name: "IBM Data Science Professional", provider: "Coursera/IBM", url: "https://www.coursera.org/professional-certificates/ibm-data-science", certificate: false, description: "Python, SQL, ML, data viz" },
    { name: "Statistics with Python", provider: "Coursera/Michigan", url: "https://www.coursera.org/specializations/statistics-with-python", certificate: false, description: "Statistical inference and modeling" },
  ],
  devops: [
    { name: "DevOps Prerequisites Course", provider: "KodeKloud (free)", url: "https://kodekloud.com/courses/devops-pre-requisite-course/", certificate: true, description: "Linux, networking, applications basics" },
    { name: "Introduction to Kubernetes", provider: "Linux Foundation/edX", url: "https://www.edx.org/learn/kubernetes/the-linux-foundation-introduction-to-kubernetes", certificate: false, description: "Official Kubernetes intro" },
    { name: "GitHub Actions", provider: "GitHub Learning Lab", url: "https://skills.github.com/", certificate: true, description: "CI/CD with GitHub Actions" },
    { name: "Docker Essentials", provider: "Cognitive Class (IBM)", url: "https://cognitiveclass.ai/courses/docker-essentials", certificate: true, description: "Containers, images, networking" },
  ],
  cloud: [
    { name: "AWS Cloud Practitioner Essentials", provider: "AWS Skill Builder", url: "https://skillbuilder.aws/", certificate: false, description: "Foundation AWS cloud knowledge" },
    { name: "Google Cloud Fundamentals", provider: "Coursera/Google", url: "https://www.coursera.org/learn/gcp-fundamentals", certificate: false, description: "GCP core services and infrastructure" },
    { name: "Azure Fundamentals (AZ-900)", provider: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/", certificate: true, description: "Free learning path + paid exam" },
    { name: "Introduction to Cloud Computing", provider: "Coursera/IBM", url: "https://www.coursera.org/learn/introduction-to-cloud", certificate: false, description: "Cloud models, deployment, security" },
  ],
  cybersecurity: [
    { name: "Google Cybersecurity Certificate", provider: "Coursera/Google", url: "https://www.coursera.org/professional-certificates/google-cybersecurity", certificate: false, description: "Linux, Python, SIEM, IDS" },
    { name: "Introduction to Cybersecurity", provider: "Cisco Networking Academy", url: "https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity", certificate: true, description: "Free Cisco certification" },
    { name: "Ethical Hacking Essentials", provider: "EC-Council (CodeRed)", url: "https://codered.eccouncil.org/course/ethical-hacking-essentials", certificate: true, description: "Penetration testing fundamentals" },
    { name: "TryHackMe Pre-Security", provider: "TryHackMe", url: "https://tryhackme.com/paths", certificate: false, description: "Hands-on cybersecurity labs" },
  ],
  "game-dev": [
    { name: "Unity Essentials Pathway", provider: "Unity Learn", url: "https://learn.unity.com/pathway/unity-essentials", certificate: true, description: "Official Unity certification path" },
    { name: "CS50's Introduction to Game Development", provider: "Harvard/edX", url: "https://cs50.harvard.edu/games/", certificate: false, description: "Pong, Flappy Bird, Mario, Zelda clones" },
    { name: "Godot GDScript Fundamentals", provider: "GDQuest", url: "https://www.gdquest.com/", certificate: false, description: "Open-source game engine tutorials" },
  ],
  blockchain: [
    { name: "Blockchain Specialization", provider: "Coursera/Buffalo", url: "https://www.coursera.org/specializations/blockchain", certificate: false, description: "Smart contracts, DApps, platforms" },
    { name: "Solidity, Blockchain, and Smart Contract", provider: "freeCodeCamp", url: "https://www.youtube.com/watch?v=gyMwXuJrbJQ", certificate: false, description: "32-hour full course by Patrick Collins" },
    { name: "CryptoZombies", provider: "CryptoZombies", url: "https://cryptozombies.io/", certificate: false, description: "Interactive Solidity tutorial (free)" },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function estimateWeeks(milestoneCount: number, hoursPerWeek: number): number {
  // ~8 hours per milestone on average; adjust by time commitment
  const totalHours = milestoneCount * 8;
  return Math.max(1, Math.ceil(totalHours / Math.max(1, hoursPerWeek)));
}

function groupMilestonesIntoWeeks(
  milestones: Milestone[],
  hoursPerWeek: number,
): Milestone[][] {
  // Distribute milestones across weeks based on hours available
  const milestonesPerWeek = Math.max(1, Math.floor(hoursPerWeek / 8));
  const weeks: Milestone[][] = [];
  for (let i = 0; i < milestones.length; i += milestonesPerWeek) {
    weeks.push(milestones.slice(i, i + milestonesPerWeek));
  }
  return weeks;
}

// ---------------------------------------------------------------------------
// Props & Component
// ---------------------------------------------------------------------------

export interface GeneratedPathViewProps {
  path: GeneratedPath;
  hoursPerWeek?: number;
}

export function GeneratedPathView({
  path,
  hoursPerWeek = 10,
}: GeneratedPathViewProps) {
  const weeks = useMemo(
    () => groupMilestonesIntoWeeks(path.milestones, hoursPerWeek),
    [path.milestones, hoursPerWeek],
  );
  const totalWeeks = estimateWeeks(path.milestones.length, hoursPerWeek);
  const courses = FREE_COURSES[path.goal] ?? [];

  return (
    <div className="flex flex-col gap-8" data-testid="generated-path-view">
      {/* ================================================================== */}
      {/* Summary Header */}
      {/* ================================================================== */}
      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/10 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Target className="size-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">
              Your Personalized Learning Plan
            </h2>
            <p className="text-sm text-muted-foreground">
              {path.milestones.length} milestones · ~{totalWeeks} weeks at{" "}
              {hoursPerWeek}hrs/week
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col items-center rounded-lg bg-card border border-border px-4 py-2">
              <Timer className="size-4 text-primary mb-1" />
              <span className="text-lg font-bold text-foreground">{totalWeeks}</span>
              <span className="text-[10px] text-muted-foreground">Weeks</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-card border border-border px-4 py-2">
              <Layers className="size-4 text-primary mb-1" />
              <span className="text-lg font-bold text-foreground">
                {path.milestones.length}
              </span>
              <span className="text-[10px] text-muted-foreground">Skills</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-card border border-border px-4 py-2">
              <Wrench className="size-4 text-primary mb-1" />
              <span className="text-lg font-bold text-foreground">
                {path.tools.length}
              </span>
              <span className="text-[10px] text-muted-foreground">Tools</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Week-by-Week Plan */}
      {/* ================================================================== */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="size-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">
            Week-by-Week Learning Plan
          </h2>
        </div>

        <div className="space-y-4">
          {weeks.map((weekMilestones, weekIndex) => (
            <WeekCard
              key={weekIndex}
              weekNumber={weekIndex + 1}
              milestones={weekMilestones}
            />
          ))}
        </div>
      </section>

      {/* ================================================================== */}
      {/* Free Courses & Certificates */}
      {/* ================================================================== */}
      {courses.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Free Courses & Certificates
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {courses.map((course) => (
              <a
                key={course.url}
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    {course.certificate ? (
                      <Award className="size-4 text-primary" />
                    ) : (
                      <BookOpen className="size-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {course.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {course.provider}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {course.description}
                    </p>
                    {course.certificate && (
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-600">
                        <Award className="size-3" />
                        Free Certificate
                      </span>
                    )}
                  </div>
                  <ExternalLinkIcon className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* Recommended Projects */}
      {/* ================================================================== */}
      {path.projects.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Recommended Projects
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {path.projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {project.name}
                  </span>
                  <span className="block text-[10px] text-muted-foreground">
                    {project.skillLevel}
                  </span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* Recommended Tools */}
      {/* ================================================================== */}
      {path.tools.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Recommended Free Tools
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {path.tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent">
                  <Wrench className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {tool.name}
                  </span>
                  <span className="block text-[10px] text-muted-foreground">
                    {tool.category} · Free tier
                  </span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* Deployment Resources */}
      {/* ================================================================== */}
      {path.deployment.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Deployment & Launch Resources
            </h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {path.deployment.map((resource) => (
              <ExternalLink
                key={resource.id}
                href={resource.url}
                className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-sm text-foreground hover:border-primary/40 hover:shadow-md transition-all"
              >
                <ExternalLinkIcon className="size-3.5 text-primary shrink-0" />
                <span className="truncate">{resource.name}</span>
              </ExternalLink>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* Completion Badge */}
      {/* ================================================================== */}
      <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
        <Trophy className="size-10 mx-auto text-primary mb-2" />
        <h3 className="text-lg font-bold text-foreground">
          🎉 You&apos;ll Be Job-Ready!
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Complete this plan in ~{totalWeeks} weeks and you&apos;ll have the
          skills, projects, and portfolio to land your first role.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WeekCard — renders one week of milestones with resources & videos
// ---------------------------------------------------------------------------

function WeekCard({
  weekNumber,
  milestones,
}: {
  weekNumber: number;
  milestones: Milestone[];
}) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Week header */}
      <div className="flex items-center gap-3 bg-accent/30 px-4 py-2.5 border-b border-border">
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
          {weekNumber}
        </span>
        <h3 className="text-sm font-semibold text-foreground">
          Week {weekNumber}
        </h3>
        <span className="text-xs text-muted-foreground ml-auto">
          {milestones.length} topic{milestones.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Milestones */}
      <div className="divide-y divide-border">
        {milestones.map((milestone) => (
          <MilestoneRow key={milestone.nodeId} milestone={milestone} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MilestoneRow — renders a single milestone with its workflows, videos, resources
// ---------------------------------------------------------------------------

function MilestoneRow({ milestone }: { milestone: Milestone }) {
  const workflows = NODE_WORKFLOWS[milestone.nodeId] ?? [];
  const videos = NODE_VIDEOS[milestone.nodeId] ?? [];
  const resources = milestone as unknown as {
    nodeId: string;
    title: string;
    skillLevel: string;
  };

  return (
    <div className="p-4 space-y-3">
      {/* Title & level */}
      <div className="flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded bg-primary/10">
          <Code2 className="size-3.5 text-primary" />
        </div>
        <h4 className="text-sm font-semibold text-foreground flex-1">
          {resources.title}
        </h4>
        <span
          className={[
            "rounded-full px-2 py-0.5 text-[10px] font-medium",
            resources.skillLevel === "Beginner"
              ? "bg-green-500/10 text-green-600"
              : resources.skillLevel === "Intermediate"
              ? "bg-blue-500/10 text-blue-600"
              : resources.skillLevel === "Advanced"
              ? "bg-orange-500/10 text-orange-600"
              : "bg-purple-500/10 text-purple-600",
          ].join(" ")}
        >
          {resources.skillLevel}
        </span>
      </div>

      {/* Sub-skills from workflow */}
      {workflows.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {workflows.map((step) => (
            <span
              key={step.id}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              <ChevronRight className="size-2.5" />
              {step.label}
            </span>
          ))}
        </div>
      )}

      {/* YouTube Videos */}
      {videos.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <PlayCircle className="size-3" />
            Video Tutorials
          </p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {videos.slice(0, 4).map((video: VideoResource) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded bg-muted/50 px-2.5 py-1.5 text-xs hover:bg-accent transition-colors group"
              >
                <PlayCircle className="size-3.5 text-red-500 shrink-0" />
                <span className="flex-1 truncate text-foreground group-hover:text-primary transition-colors">
                  {video.title}
                </span>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {video.duration}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
