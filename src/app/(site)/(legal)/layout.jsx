import Container from "@/components/ui/Container";

/**
 * Shared reading frame for the privacy and terms pages. Both headers occupy
 * layout space, so this needs no clearance padding of its own — just its own
 * breathing room. `legal-frame` is the hook Torque restyles this block with.
 */
export default function LegalLayout({ children }) {
  return (
    <div className="legal-frame border-b border-slate-200 bg-slate-50/60 py-16 sm:py-20">
      <Container size="narrow">
        <article className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-soft sm:p-12">
          {children}
        </article>
      </Container>
    </div>
  );
}
