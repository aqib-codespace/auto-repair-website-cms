import { requireAdmin } from "@/lib/auth/dal";
import { requireSite } from "@/lib/site";
import { getSiteSettings } from "@/db/queries/content";
import { getNewLeadCount } from "@/db/queries/admin";
import { BLOCK_GROUPS } from "@/lib/admin/blocks";
import { COLLECTIONS } from "@/lib/admin/collections";
import { TEMPLATES, resolveTemplateId } from "@/lib/templates/registry";
import AdminSidebar from "./AdminSidebar";

/**
 * Every protected screen is per-request: it depends on the session cookie and
 * on live database rows (leads, counts, unsaved edits). Without this, a build
 * that runs before the environment is wired up can bake a redirect to the login
 * page into static HTML.
 */
export const dynamic = "force-dynamic";

/**
 * Builds the whole admin menu from the same registries that generate the
 * forms, so a new content block or collection appears in the sidebar the
 * moment it is registered — there is no navigation list to keep in sync.
 */
export default async function ProtectedAdminLayout({ children }) {
  const [admin, site, settings, newLeads] = await Promise.all([
    requireAdmin(),
    requireSite(),
    getSiteSettings(),
    getNewLeadCount(),
  ]);

  const activeTemplate = resolveTemplateId(settings.template);

  const sections = [
    {
      heading: "Overview",
      links: [
        { href: "/admin", label: "Dashboard", icon: "LayoutGrid", exact: true },
        { href: "/admin/leads", label: "Appointment Requests", icon: "Inbox", badge: newLeads },
        { href: "/admin/templates", label: "Templates", icon: "LayoutTemplate", exact: true },
        // Each template is listed under it, so the menu itself shows what the site
        // can look like and which design is currently live.
        ...TEMPLATES.map((template) => ({
          href: `/admin/templates#${template.id}`,
          label: template.name,
          icon: "Palette",
          nested: true,
          note: template.id === activeTemplate ? "Live" : undefined,
        })),
      ],
    },
    ...BLOCK_GROUPS.map((group) => ({
      heading: `${group.heading} content`,
      links: group.blocks.map((block) => ({
        href: `/admin/content/${block.key}`,
        label: block.label,
        icon: block.icon,
      })),
    })),
    {
      heading: "Lists",
      links: COLLECTIONS.map((collection) => ({
        href: `/admin/collections/${collection.slug}`,
        label: collection.label,
        icon: collection.icon,
      })),
    },
    {
      heading: "Site",
      links: [
        { href: "/admin/media", label: "Media Library", icon: "ImageIcon" },
        { href: "/admin/settings", label: "Settings", icon: "SettingsIcon" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <AdminSidebar sections={sections} admin={admin} company={settings.company} site={site} />
      <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-10 lg:py-9 xl:px-14">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
