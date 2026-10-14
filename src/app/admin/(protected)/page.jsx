import Link from "next/link";
import {
  Inbox,
  Wrench,
  Quote,
  Images,
  ArrowRight,
  LayoutTemplate,
  SquarePen,
  CalendarClock,
} from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import Panel from "@/components/admin/ui/Panel";
import Badge from "@/components/admin/ui/Badge";
import Button from "@/components/admin/ui/Button";
import EmptyState from "@/components/admin/ui/EmptyState";
import { requireAdmin } from "@/lib/auth/dal";
import { getDashboardStats, getLeads, getRecentActivity } from "@/db/queries/admin";
import { LEAD_STATUSES } from "@/config/site";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

const TILES = [
  {
    key: "newLeads",
    label: "New requests",
    href: "/admin/leads?status=new",
    icon: Inbox,
    highlight: true,
  },
  { key: "services", label: "Services", href: "/admin/collections/services", icon: Wrench },
  { key: "reviews", label: "Reviews", href: "/admin/collections/testimonials", icon: Quote },
  { key: "photos", label: "Gallery photos", href: "/admin/collections/gallery", icon: Images },
];

const QUICK_LINKS = [
  { href: "/admin/content/hero", label: "Edit the hero", icon: LayoutTemplate },
  { href: "/admin/collections/services", label: "Add a service", icon: Wrench },
  { href: "/admin/collections/testimonials", label: "Add a review", icon: Quote },
  { href: "/admin/settings", label: "Brand & contact details", icon: SquarePen },
];

function statusTone(status) {
  return LEAD_STATUSES.find((entry) => entry.value === status)?.tone ?? "gray";
}

function statusLabel(status) {
  return LEAD_STATUSES.find((entry) => entry.value === status)?.label ?? status;
}

export default async function AdminDashboardPage() {
  const [admin, stats, leads, activity] = await Promise.all([
    requireAdmin(),
    getDashboardStats(),
    getLeads(),
    getRecentActivity(6),
  ]);

  const recentLeads = leads.slice(0, 6);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${admin.name.split(" ")[0]}`}
        description="Everything on the public website is editable from here. Start with appointment requests, then work down the sidebar."
        actions={
          <Button href="/admin/leads" variant="secondary">
            <Inbox className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Open inbox
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          const value = stats[tile.key] ?? 0;

          return (
            <Link
              key={tile.key}
              href={tile.href}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span
                  className={
                    tile.highlight && value > 0
                      ? "flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent-dark"
                      : "flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light text-brand"
                  }
                >
                  <Icon className="h-4.5 w-4.5" strokeWidth={2} aria-hidden="true" />
                </span>
                <ArrowRight
                  className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
              <p className="mt-0.5 text-[0.8rem] text-slate-500">{tile.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title="Latest appointment requests"
          description={`${stats.totalLeads} total · ${stats.newLeads} awaiting a reply`}
          actions={
            <Button href="/admin/leads" variant="ghost" size="sm">
              View all
            </Button>
          }
          padded={false}
        >
          {recentLeads.length === 0 ? (
            <EmptyState
              className="m-5"
              icon={Inbox}
              title="No requests yet"
              description="Submissions from the website's booking form will appear here the moment they arrive."
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <li key={lead.id}>
                  <Link
                    href={`/admin/leads#lead-${lead.id}`}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 truncate text-[0.85rem] font-semibold text-slate-900">
                        {lead.name}
                        <Badge tone={statusTone(lead.status)}>{statusLabel(lead.status)}</Badge>
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {lead.serviceNeeded} · {lead.vehicleMake} {lead.vehicleModel}
                      </p>
                    </div>
                    <span className="hidden shrink-0 text-xs text-slate-400 sm:block">
                      {formatDateTime(lead.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Quick actions" padded={false}>
            <ul className="divide-y divide-slate-100">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-3 px-5 py-3 text-[0.85rem] text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Icon
                        className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-brand"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel title="Recent changes" padded={false}>
            {activity.length === 0 ? (
              <p className="px-5 py-6 text-xs text-slate-400">
                Edits you make will be logged here.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {activity.map((entry) => (
                  <li key={entry.id} className="px-5 py-3">
                    <p className="text-[0.82rem] text-slate-700">{entry.summary}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[0.7rem] text-slate-400">
                      <CalendarClock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                      {formatDateTime(entry.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
