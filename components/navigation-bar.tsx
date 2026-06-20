"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchControl } from "@/components/search-control";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Roadmaps", href: "/roadmaps" },
  { label: "Free Tools", href: "/tools" },
  { label: "Learning Paths", href: "/learning-paths" },
  { label: "Companies", href: "/companies" },
  { label: "Certificates", href: "/certificates" },
  { label: "Projects", href: "/projects" },
  { label: "Resources", href: "/resources" },
  { label: "Compare Tools", href: "/compare" },
  { label: "About", href: "/about" },
] as const;

export function NavigationBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
            <Map className="size-4" />
          </span>
          <span>DevAtlas</span>
        </Link>

        {/* Desktop navigation links */}
        <ul className="hidden xl:flex xl:items-center xl:gap-0.5">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                  isActive(link.href)
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: search + theme toggle + mobile menu trigger */}
        <div className="flex items-center gap-2">
          {/* Global search control (Req 2.3, 2.5) */}
          <SearchControl />

          <ThemeToggle />

          {/* Mobile / tablet menu trigger - visible below xl */}
          <div className="xl:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open navigation menu"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>

              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="border-b px-4 py-3">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-1 p-4">
                  {NAV_LINKS.map((link) => (
                    <SheetClose key={link.href} render={<span />}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                          isActive(link.href)
                            ? "text-primary font-semibold bg-primary/5"
                            : "text-muted-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
