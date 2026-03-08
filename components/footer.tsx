"use client"

import Link from "next/link"
import { FadeIn } from "@/components/ui/animated"
import { Github, Twitter, ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <FadeIn className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 bg-primary rotate-45 group-hover:rotate-[405deg] transition-transform duration-700" />
              <span className="font-[var(--font-display)] text-xl font-bold tracking-wider text-foreground">
                VALO<span className="text-primary">BASE</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              Your ultimate Valorant database. Explore agents, weapons, maps, and everything 
              you need to dominate in the game. Built for the community, by the community.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://github.com/thpunisher"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </FadeIn>

          {/* Quick Links */}
          <FadeIn delay={100}>
            <h3 className="font-[var(--font-display)] font-semibold text-foreground mb-4 tracking-wider">
              EXPLORE
            </h3>
            <ul className="space-y-3">
              {["Agents", "Weapons", "Maps", "Arsenal"].map((item, i) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* Resources */}
          <FadeIn delay={200}>
            <h3 className="font-[var(--font-display)] font-semibold text-foreground mb-4 tracking-wider">
              RESOURCES
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://valorant-api.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Valorant API
                </a>
              </li>
              <li>
                <a
                  href="https://playvalorant.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Official Valorant
                </a>
              </li>
              <li>
                <a
                  href="https://support-valorant.riotgames.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Riot Support
                </a>
              </li>
            </ul>
          </FadeIn>
        </div>

        <FadeIn delay={300}>
          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              VALOBASE is not affiliated with or endorsed by Riot Games.
            </p>
            <p className="text-xs text-muted-foreground">
              Data provided by{" "}
              <a 
                href="https://valorant-api.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline"
              >
                Valorant-API
              </a>
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  )
}
