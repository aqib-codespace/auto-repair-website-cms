import { toParagraphs } from "@/lib/utils";

/**
 * Renders a legal content block. The body is stored as one text field and
 * split on blank lines, so an admin edits it like a document instead of
 * managing a list of paragraph rows.
 */
export default function LegalDocument({ block }) {
  if (!block) return null;

  return (
    <>
      <h1 className="text-3xl font-bold text-ink sm:text-4xl">{block.heading}</h1>
      {block.updatedAt && (
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          Last updated {block.updatedAt}
        </p>
      )}
      <div className="mt-8 space-y-5">
        {toParagraphs(block.body).map((paragraph) => (
          <p key={paragraph} className="text-pretty leading-relaxed text-slate-600">
            {paragraph}
          </p>
        ))}
      </div>
    </>
  );
}
