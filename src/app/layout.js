import { Sora, Inter, Oswald } from "next/font/google";
import { getSiteSettings } from "@/db/queries/content";
import { templateBodyClass } from "@/lib/templates/resolve";
import { safeCssColor } from "@/lib/utils";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Torque's display face — a condensed grotesque. Loaded here rather than inside
 * the template because
 * next/font must be initialised at module scope — it cannot be called
 * conditionally. The cost is one extra font file for visitors on the Momentum
 * template; the benefit is that switching template needs no build step and no
 * layout shift, which is the right trade for a switch an admin can flip at will.
 */
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export async function generateMetadata() {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(settings.siteUrl),
    title: {
      default: settings.metaTitle,
      template: `%s · ${settings.company}`,
    },
    description: settings.metaDescription,
    applicationName: settings.company,
    openGraph: {
      title: settings.metaTitle,
      description: settings.metaDescription,
      siteName: settings.company,
      type: "website",
      url: settings.siteUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.metaTitle,
      description: settings.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

/** Browser chrome (Android tab bar, iOS status bar) picks up the brand colour too. */
export async function generateViewport() {
  const settings = await getSiteSettings();
  return { themeColor: safeCssColor(settings.brandColor, "#1a4fd1") };
}

/**
 * Document shell only — fonts, brand tokens, and metadata.
 *
 * The marketing header/footer live inside each template (src/templates/*) rather
 * than here, because navigation and footer are exactly where two designs most
 * need to differ. /admin therefore renders as its own application, with no site
 * chrome at all.
 *
 * The <body> class comes from the active template so it can set its own
 * typographic defaults and page colour — this is how Torque gets a black page
 * and serif headings without Momentum's tokens leaking into it.
 */
export default async function RootLayout({ children }) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${oswald.variable}`}
      /*
       * The two brand tokens are set here, at request time, from Settings.
       * Everything else in globals.css derives from them via color-mix(), so
       * this is the entire "rebrand the template" surface area.
       */
      style={{
        "--brand": safeCssColor(settings.brandColor, "#1a4fd1"),
        "--accent": safeCssColor(settings.accentColor, "#f59e0b"),
      }}
    >
      <body className={`${templateBodyClass(settings.template)} antialiased`}>
        <noscript>
          {/* Scroll-reveal needs JS; show everything when it's unavailable. */}
          <style>{`.reveal { opacity: 1; transform: none; }`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
