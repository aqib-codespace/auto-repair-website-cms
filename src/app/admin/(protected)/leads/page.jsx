import Link from "next/link";
import { Inbox, Phone, Mail, Car, CalendarDays, MessageSquare, Wrench } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import Badge from "@/components/admin/ui/Badge";
import EmptyState from "@/components/admin/ui/EmptyState";
import DeleteButton from "@/components/admin/DeleteButton";
import { getLeads } from "@/db/queries/admin";
import { LEAD_STATUSES } from "@/config/site";
import { formatDateTime, formatDate, telHref, cn } from "@/lib/utils";
import LeadStatusSelect from "./LeadStatusSelect";
import { deleteLead } from "./actions";

export const metadata = { title: "Appointment Requests" };

function Detail({ icon: Icon, label, children }) {
  if (!children) return null;

  return (
    <div className="flex min-w-0 gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-slate-400">
          {label}
        </p>
        <div className="mt-0.5 truncate text-[0.85rem] text-slate-800">{children}</div>
      </div>
    </div>
  );
}

export default async function LeadsPage({ searchParams }) {
  const { status } = await searchParams;
  const active = LEAD_STATUSES.some((entry) => entry.value === status) ? status : null;

  // Fetch all so the filter tabs can show live counts, then narrow in memory.
  const all = await getLeads();
  const leads = active ? all.filter((lead) => lead.status === active) : all;

  const counts = LEAD_STATUSES.reduce(
    (acc, entry) => ({
      ...acc,
      [entry.value]: all.filter((lead) => lead.status === entry.value).length,
    }),
    {},
  );

  const tabs = [
    { value: null, label: "All", count: all.length, href: "/admin/leads" },
    ...LEAD_STATUSES.map((entry) => ({
      value: entry.value,
      label: entry.label,
      count: counts[entry.value] ?? 0,
      href: `/admin/leads?status=${entry.value}`,
    })),
  ];

  return (
    <>
      <PageHeader
        title="Appointment Requests"
        description="Every submission from the website's booking form. Update the status as you work each one so nothing gets called twice."
      />

      <div className="mb-6 flex flex-wrap gap-1.5">
        {tabs.map((tab) => {
          const isActive = tab.value === active;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.8rem] font-semibold transition-colors",
                isActive
                  ? "bg-ink text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[0.68rem]",
                  isActive ? "bg-white/15" : "bg-slate-100 text-slate-500",
                )}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {leads.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={active ? `No ${active} requests` : "No requests yet"}
          description={
            active
              ? "Try a different filter to see the rest of the inbox."
              : "When a customer submits the booking form, the request will appear here straight away."
          }
        />
      ) : (
        <ul className="space-y-4">
          {leads.map((lead) => {
            const tone = LEAD_STATUSES.find((entry) => entry.value === lead.status)?.tone ?? "gray";

            return (
              <li
                key={lead.id}
                id={`lead-${lead.id}`}
                className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-[0.95rem] font-semibold text-slate-900">
                      {lead.name}
                      <Badge tone={tone}>
                        {LEAD_STATUSES.find((entry) => entry.value === lead.status)?.label ??
                          lead.status}
                      </Badge>
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Received {formatDateTime(lead.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <LeadStatusSelect id={lead.id} status={lead.status} />
                    <DeleteButton
                      action={deleteLead}
                      compact
                      hidden={{ id: lead.id }}
                      label="Delete request"
                      confirmMessage={`Delete ${lead.name}'s request? This cannot be undone.`}
                    />
                  </div>
                </div>

                <div className="grid gap-4 px-5 py-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Detail icon={Phone} label="Phone">
                    <a
                      href={telHref(lead.phone)}
                      className="font-semibold text-brand hover:underline"
                    >
                      {lead.phone}
                    </a>
                  </Detail>
                  <Detail icon={Mail} label="Email">
                    {lead.email ? (
                      <a href={`mailto:${lead.email}`} className="text-brand hover:underline">
                        {lead.email}
                      </a>
                    ) : null}
                  </Detail>
                  <Detail icon={Car} label="Vehicle">
                    {[lead.vehicleMake, lead.vehicleModel].filter(Boolean).join(" ")}
                  </Detail>
                  <Detail icon={Wrench} label="Service needed">
                    {lead.serviceNeeded}
                  </Detail>
                  <Detail icon={CalendarDays} label="Preferred date">
                    {lead.preferredDate ? formatDate(lead.preferredDate) : "No preference"}
                  </Detail>
                </div>

                {lead.comments && (
                  <div className="mx-5 mb-5 flex gap-2.5 rounded-xl bg-slate-50 px-4 py-3">
                    <MessageSquare
                      className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <p className="text-[0.85rem] leading-relaxed text-slate-700">{lead.comments}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
