import { Logo } from "./logo"
import Link from "next/link"
import { Twitter, Github, MessageCircle } from "lucide-react"
import { PollenSymbol } from "@/components/pollen-symbol"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-5">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Turn every authentic conversation into instant, streamed value.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: MessageCircle, label: "Discord" },
                { icon: Github, label: "GitHub" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-lime hover:border-lime/50 hover:scale-110 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-5 flex items-center gap-2">
              Product
              <PollenSymbol size={16} className="opacity-40" animated={false} />
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                { href: "/campaigns", label: "Campaigns" },
                { href: "/leaderboard", label: "Leaderboard" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/projects", label: "For Projects" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-lime transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {["Documentation", "How It Works", "FAQ", "Support"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-lime transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-lime transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            © 2025 PollenFi
            <PollenSymbol size={16} className="opacity-30" animated={false} />
            All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-lime"></span>
            </span>
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  )
}
