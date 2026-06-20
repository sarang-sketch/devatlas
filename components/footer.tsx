import Link from "next/link";

/**
 * Beautiful Footer component for DevAtlas (design "Footer", Req 13.6 compatible).
 * Offers navigation links, logo/branding, and subtle social references.
 */
export function Footer() {
  return (
    <footer className="border-t bg-muted/20 text-muted-foreground text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="text-lg font-bold text-foreground tracking-tight">
              DevAtlas
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Your complete map to becoming a developer. Learn, build, launch, and grow.
            </p>
          </div>

          {/* Navigation - Column 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Roadmaps
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/roadmaps/frontend" className="hover:text-foreground transition-colors">
                  Frontend Developer
                </Link>
              </li>
              <li>
                <Link href="/roadmaps/backend" className="hover:text-foreground transition-colors">
                  Backend Developer
                </Link>
              </li>
              <li>
                <Link href="/roadmaps/fullstack" className="hover:text-foreground transition-colors">
                  Full Stack Developer
                </Link>
              </li>
              <li>
                <Link href="/roadmaps" className="hover:text-foreground transition-colors">
                  All Roadmaps →
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation - Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Free Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tools" className="hover:text-foreground transition-colors">
                  Free Hosting
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-foreground transition-colors">
                  Free Databases
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-foreground transition-colors">
                  Free AI APIs
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-foreground transition-colors">
                  All Free Tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation - Column 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/learning-paths" className="hover:text-foreground transition-colors">
                  Path Generator
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-foreground transition-colors">
                  Practice Projects
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-foreground transition-colors">
                  Compare Tools
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-foreground transition-colors">
                  Learning Resources
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  My Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} DevAtlas. Dedicated to developers learning & building.</p>
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
