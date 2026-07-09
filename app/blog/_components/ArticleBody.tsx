import Link from "next/link";
import type { ReactNode } from "react";

/* Tiny deterministic markdown renderer for the blog's markdown subset:
   ## headings, > blockquotes (with an optional trailing "— attribution" line),
   - bullets, **bold**, *italic*, [links](url), paragraphs. No dependency,
   no client JS. Anything the parser doesn't recognize renders as a plain
   paragraph, so a malformed line never breaks the page. */

type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "quote"; lines: string[]; cite?: string }
  | { type: "ul"; items: string[] };

function parseBlocks(md: string): Block[] {
  const lines = md.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      i += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2).trim());
        i += 1;
      }
      let cite: string | undefined;
      if (i < lines.length && lines[i].trim().startsWith("— ")) {
        cite = lines[i].trim().slice(2).trim();
        i += 1;
      }
      blocks.push({ type: "quote", lines: quoteLines, cite });
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2).trim());
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Paragraph: consume until a blank line or the start of another block.
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("## ") &&
      !lines[i].startsWith("> ") &&
      !lines[i].startsWith("- ")
    ) {
      para.push(lines[i].trim());
      i += 1;
    }
    blocks.push({ type: "p", text: para.join(" ") });
  }

  return blocks;
}

/* Inline pass: **bold**, *italic*, [text](href). */
const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(INLINE).map((part, idx) => {
    const key = `${keyPrefix}-${idx}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-bold text-[#1B3722]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      const external = href.startsWith("http");
      if (external) {
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#2A5132] underline decoration-[#94BC8E] decoration-2 underline-offset-4 hover:decoration-[#2A5132] transition-colors"
          >
            {label}
          </a>
        );
      }
      return (
        <Link
          key={key}
          href={href}
          className="font-semibold text-[#2A5132] underline decoration-[#94BC8E] decoration-2 underline-offset-4 hover:decoration-[#2A5132] transition-colors"
        >
          {label}
        </Link>
      );
    }
    return part;
  });
}

export function ArticleBody({ markdown }: { markdown: string }) {
  const blocks = parseBlocks(markdown);

  return (
    <div className="space-y-6">
      {blocks.map((block, bi) => {
        const key = `b-${bi}`;
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={key}
                className="font-bold tracking-tight text-[#1B3722] pt-6"
                style={{ fontSize: "clamp(22px, 2.6vw, 28px)", lineHeight: 1.25 }}
              >
                {renderInline(block.text, key)}
              </h2>
            );
          case "quote":
            return (
              <blockquote
                key={key}
                className="rounded-2xl bg-[#F4EDE0] border-l-4 border-[#76A77A] px-6 py-5 my-2"
              >
                {block.lines.map((l, li) => (
                  <p
                    key={`${key}-l-${li}`}
                    className="text-[#1B3722]/90 leading-relaxed italic"
                    style={{ fontSize: "17.5px" }}
                  >
                    {renderInline(l, `${key}-l-${li}`)}
                  </p>
                ))}
                {block.cite && (
                  <footer className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#1B3722]/55 not-italic">
                    {block.cite}
                  </footer>
                )}
              </blockquote>
            );
          case "ul":
            return (
              <ul key={key} className="space-y-3">
                {block.items.map((item, ii) => (
                  <li
                    key={`${key}-i-${ii}`}
                    className="relative pl-6 text-[#1B3722]/85 leading-relaxed"
                    style={{ fontSize: "17.5px" }}
                  >
                    <span className="absolute left-0 top-[11px] w-2 h-2 rounded-full bg-[#94BC8E]" />
                    {renderInline(item, `${key}-i-${ii}`)}
                  </li>
                ))}
              </ul>
            );
          default:
            return (
              <p
                key={key}
                className="text-[#1B3722]/85 leading-[1.75]"
                style={{ fontSize: "17.5px" }}
              >
                {renderInline(block.text, key)}
              </p>
            );
        }
      })}
    </div>
  );
}
