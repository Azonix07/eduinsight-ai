import Link from "next/link";

const FOOTER_LINKS = {
  Product: [
    { label: "Capabilities", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "AI evaluation", href: "#" },
    { label: "Analytics", href: "#" },
    { label: "Reports", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API reference", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Case studies", href: "#" },
    { label: "Help center", href: "#" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Partners", href: "#" },
  ],
  Legal: [
    { label: "Privacy policy", href: "#" },
    { label: "Terms of service", href: "#" },
    { label: "GDPR", href: "#" },
    { label: "FERPA", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-16 md:grid-cols-6 sm:py-20">
          <div className="col-span-2">
            <Link href="/" className="font-display text-3xl font-semibold tracking-tight text-foreground">
              EduInsight<span className="text-brand">.</span>
            </Link>
            <p className="mt-5 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              AI-read answer sheets, honest grading, and performance insight —
              for every classroom that reads closely.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="eyebrow mb-5 text-muted-foreground/70">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="link-underline text-sm text-foreground/75 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-border py-7 sm:flex-row sm:items-center">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
            © {new Date().getFullYear()} EduInsight AI — All rights reserved
          </p>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground/70">
            Set in Fraunces & Inter · Printed on warm paper
          </p>
        </div>
      </div>
    </footer>
  );
}
