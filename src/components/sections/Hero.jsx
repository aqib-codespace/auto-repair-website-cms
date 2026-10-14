import Image from "next/image";
import { Phone, ArrowRight, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import Rating from "@/components/ui/Rating";
import Counter from "@/components/ui/Counter";
import { telHref } from "@/lib/utils";

/**
 * Above-the-fold conversion unit: a full-bleed cinematic photograph with the
 * message centred over it.
 *
 * Legibility over photography is the whole engineering problem here, so the
 * scrim is built in four deliberate layers — a flat wash for baseline
 * contrast, a radial vignette that darkens the edges and lifts the centre, a
 * top gradient so the fixed header stays readable, and a bottom fade that
 * hands off to the next section. Type is sized in clamp() rather than
 * breakpoints so the headline scales smoothly from a 360px phone to an
 * ultrawide display instead of jumping between five fixed sizes.
 */
export default function Hero({ hero, settings, ratingLabel }) {
  // The closing word carries the brand gradient — one accent, never more.
  const words = String(hero.headline ?? "").trim().split(/\s+/);
  const lead = words.slice(0, -1).join(" ");
  const last = words.at(-1);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[calc(100svh-4.25rem)] flex-col justify-center overflow-hidden bg-ink pb-14 pt-16 text-white sm:pb-20 lg:min-h-[calc(100svh-7.1rem)]"
    >
      {/*
       * NOT `-z-10`. The section is a stacking context (`isolate`) with its own
       * `bg-ink`, and CSS paints a negative-z descendant *behind* its
       * stacking-context ancestor's background — which silently hid this
       * photograph completely. Plain `absolute inset-0` paints above the
       * section background, and the content below sits above this via `relative
       * z-10`, so `bg-ink` stays purely a fallback colour while the image loads.
       */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src={hero.image.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-[1.02] object-cover object-center"
        />
        {/*
         * Scrim budget. Overlay opacities COMPOUND — two layers at 0.70 and
         * 0.78 leave only 6% of the photograph visible, which is how an earlier
         * revision of this file erased the image entirely. So these numbers are
         * chosen to *multiply out* to the target, not applied independently.
         *
         * Target: ~78% darkening behind the headline, ~85% at the edges. The
         * default hero photograph has a mean brightness of ~101/255, with white
         * ceiling lights well above 200, and white text needs that much cover
         * to stay legible against the bright regions.
         *
         * 1 — baseline wash: 0.50
         */}
        <div className="absolute inset-0 bg-ink/50" />
        {/*
         * 2 — centre-weighted, because the photograph's brightest region (the
         * ceiling light bank) sits directly behind the headline. A conventional
         * edge-vignette would leave the type sitting on white light.
         * Compounded with layer 1: ~0.78 centre, ~0.85 edge.
         */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_50%_45%,rgb(11_18_32/0.56)_0%,rgb(11_18_32/0.48)_55%,rgb(11_18_32/0.70)_100%)]" />
        {/* 3 — header legibility (no body text sits this high) */}
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-ink/80 to-transparent" />
        {/* 4 — handoff to the next section, and cover for the metrics row */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-ink via-ink/70 to-transparent" />
        {/* A single restrained brand glow; anything stronger reads as a blob. */}
        <span className="orb left-[-12%] top-[-18%] h-[32rem] w-[32rem] bg-brand opacity-12" />
      </div>

      <Container size="default" className="relative z-10 text-center">
        {hero.eyebrow && (
          <p
            className="hero-rise glass mx-auto mb-8 inline-flex items-center gap-2.5 rounded-full py-2 pl-3 pr-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/85 sm:text-[0.72rem]"
            style={{ animationDelay: "0s" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="ping-soft absolute inset-0 rounded-full bg-green-400" />
              <span className="relative h-2 w-2 rounded-full bg-green-400" />
            </span>
            {hero.eyebrow}
          </p>
        )}

        <h1
          className="hero-rise mx-auto max-w-5xl text-balance font-display font-extrabold leading-[1.02] tracking-[-0.035em] text-[clamp(2.4rem,7.2vw,5.5rem)] [text-shadow:0_2px_30px_rgb(11_18_32/0.5)]"
          style={{ animationDelay: "0.1s" }}
        >
          {lead} <span className="text-gradient">{last}</span>
        </h1>

        <p
          className="hero-rise mx-auto mt-7 max-w-2xl text-pretty leading-relaxed text-white/75 text-[clamp(1rem,1.5vw,1.25rem)]"
          style={{ animationDelay: "0.2s" }}
        >
          {hero.subheadline}
        </p>

        <div
          className="hero-rise mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "0.3s" }}
        >
          <Button
            href={settings.scheduleUrl || "#contact"}
            size="xl"
            className="group w-full sm:w-auto"
          >
            {hero.primaryCtaLabel}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </Button>
          <Button
            href={telHref(settings.phone)}
            size="xl"
            variant="outline-light"
            className="w-full sm:w-auto"
          >
            <Phone className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            {hero.secondaryCtaLabel}
            <span className="font-normal text-white/60">{settings.phone}</span>
          </Button>
        </div>

        {ratingLabel && (
          <div
            className="hero-rise mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
            style={{ animationDelay: "0.38s" }}
          >
            <Rating value={5} size="sm" />
            <span className="text-xs font-medium text-white/60">{ratingLabel}</span>
          </div>
        )}

        {hero.trustIndicators?.length > 0 && (
          <ul
            className="hero-rise mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3"
            style={{ animationDelay: "0.45s" }}
          >
            {hero.trustIndicators.map((item) => (
              <li
                key={item.label}
                className="glass flex items-center justify-center gap-2.5 rounded-2xl px-3 py-3.5 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <Icon name={item.icon} className="h-4.5 w-4.5 shrink-0 text-accent" strokeWidth={2} />
                <span className="text-[0.78rem] font-semibold leading-snug text-white/90 sm:text-[0.82rem]">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        )}

        {hero.stats?.length > 0 && (
          <dl className="hero-rise mt-14 grid grid-cols-2 gap-y-8 border-t border-white/10 pt-10 sm:mt-16 lg:grid-cols-4 lg:gap-0" style={{ animationDelay: "0.55s" }}>
            {hero.stats.map((stat, index) => (
              <div
                key={stat.label}
                className={index > 0 ? "lg:border-l lg:border-white/10" : undefined}
              >
                <dd className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  <Counter value={stat.value} />
                </dd>
                <dt className="mt-2 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-white/45 sm:text-xs">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        )}
      </Container>

      <a
        href="#services"
        aria-label="Scroll to services"
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 text-white/35 transition-colors hover:text-white lg:block"
      >
        <ChevronDown className="scroll-hint h-6 w-6" strokeWidth={2} aria-hidden="true" />
      </a>
    </section>
  );
}
