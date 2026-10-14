import { Geist } from "next/font/google";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    template: "%s · Admin",
    default: "Admin",
  },
  robots: { index: false, follow: false },
};

/**
 * Shared wrapper for /admin/login and /admin/(protected)/*. The dashboard
 * intentionally uses Geist — a neutral UI typeface — rather than the marketing
 * site's display font, so the two never feel like the same surface.
 */
export default function AdminRootLayout({ children }) {
  return (
    <div className={`${geist.variable} font-admin antialiased`}>{children}</div>
  );
}
