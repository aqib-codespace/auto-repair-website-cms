import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Container size="narrow" className="py-24 text-center sm:py-32">
      <p className="font-display text-6xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-3xl font-bold text-ink">We couldn&apos;t find that page</h1>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-slate-600">
        The link may be out of date. Head back to the homepage, or call the shop and we&apos;ll
        point you in the right direction.
      </p>
      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href="/">Back to homepage</Button>
        <Button href="/#contact" variant="outline">
          Schedule service
        </Button>
      </div>
    </Container>
  );
}
