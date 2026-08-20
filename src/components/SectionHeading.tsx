type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  as = "h2",
  id,
}: SectionHeadingProps) {
  const Heading = as;

  return (
    <div className={`section-heading section-heading--${align}`}>
      <p className="section-heading__eyebrow">{eyebrow}</p>
      <Heading className="section-heading__title" id={id}>
        {title}
      </Heading>
      {body ? <p className="section-heading__body">{body}</p> : null}
    </div>
  );
}
