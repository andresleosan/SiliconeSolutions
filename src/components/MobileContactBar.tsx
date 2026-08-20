import { MessageCircle, Phone } from "lucide-react";

type MobileContactBarProps = {
  whatsappHref: string;
  phoneHref: string;
};

export function MobileContactBar({
  whatsappHref,
  phoneHref,
}: MobileContactBarProps) {
  return (
    <nav className="mobile-contact-bar" aria-label="Quick contact actions">
      <a className="mobile-contact-bar__action" href={whatsappHref}>
        <MessageCircle aria-hidden="true" size={18} strokeWidth={2.25} />
        <span>WhatsApp</span>
      </a>
      <a className="mobile-contact-bar__action mobile-contact-bar__action--primary" href={phoneHref}>
        <Phone aria-hidden="true" size={18} strokeWidth={2.25} />
        <span>Call Now</span>
      </a>
    </nav>
  );
}
