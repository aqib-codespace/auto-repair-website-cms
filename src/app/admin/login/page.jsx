import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BrandMark from "@/components/ui/BrandMark";
import { getSiteSettings } from "@/db/queries/content";
import { isCmsConfigured } from "@/lib/env";
import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  const settings = await getSiteSettings();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-5 py-12">
      {/* Same visual language as the site's dark sections, at low intensity. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="surface-grid absolute inset-0 opacity-[0.35]" />
        <span className="orb left-[-12%] top-[-22%] h-[26rem] w-[26rem] bg-brand opacity-6" />
        <span className="orb bottom-[-28%] right-[-12%] h-[22rem] w-[22rem] bg-accent opacity-6" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-[0_24px_60px_-24px_rgb(11_18_32/0.25)] sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <BrandMark className="h-10 w-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{settings.company}</p>
              <p className="text-xs text-slate-400">Content manager</p>
            </div>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Sign in</h1>
          <p className="mb-6 mt-1 text-sm text-slate-500">
            Manage the website&apos;s content, photos, and appointment requests.
          </p>

          {isCmsConfigured ? (
            <LoginForm />
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[0.82rem] leading-relaxed text-amber-900">
              <p className="font-semibold">Preview mode</p>
              <p className="mt-1.5">
                The site is running from its built-in demo content. To enable the admin panel,
                create a Supabase project, then set{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[0.75rem]">
                  NEXT_PUBLIC_SUPABASE_URL
                </code>
                ,{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[0.75rem]">
                  SUPABASE_SERVICE_ROLE_KEY
                </code>{" "}
                and{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[0.75rem]">
                  SESSION_SECRET
                </code>{" "}
                in <code className="font-mono text-[0.75rem]">.env.local</code>.
              </p>
              <p className="mt-2">
                Full steps are in <code className="font-mono text-[0.75rem]">README.md</code>.
              </p>
            </div>
          )}
        </div>

        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
          Back to the website
        </Link>
      </div>
    </div>
  );
}
