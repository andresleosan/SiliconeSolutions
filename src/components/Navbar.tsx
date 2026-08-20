import { ArrowUpRight } from "lucide-react";

import { LogoMark } from "./LogoMark";

type NavbarProps = {
  whatsappHref: string;
};

const navigationItems = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Our Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export function Navbar({ whatsappHref }: NavbarProps) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="site-header__brand" href="#top" aria-label="Silicone Solutions home">
          <LogoMark />
        </a>

        <span className="nav-signature" aria-hidden="true">
          <span className="nav-signature__bead" />
        </span>

        <nav className="site-nav" aria-label="Primary navigation">
          <ul className="site-nav__list">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a className="site-nav__link" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="button button--orange site-header__quote" href={whatsappHref}>
          <span>Get a Free Quote</span>
          <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.25} />
        </a>
      </div>
    </header>
  );
}
