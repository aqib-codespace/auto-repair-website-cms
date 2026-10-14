import {
  LayoutTemplate,
  Wrench,
  ShieldCheck,
  Building2,
  Route,
  Star,
  Megaphone,
  Landmark,
  Images,
  CircleQuestionMark,
  CalendarCheck,
  PanelBottom,
  Lock,
  Scale,
  Car,
  Quote,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Inbox,
  LayoutGrid,
  Palette,
} from "lucide-react";

/**
 * Registry entries name their icon as a string so the registries stay plain,
 * serialisable data (they cross the server/client boundary as form field
 * descriptors). This module is the only place that turns those names back into
 * components, and it is imported exclusively by Server Components.
 */
const NAV_ICONS = {
  LayoutTemplate,
  Wrench,
  ShieldCheck,
  Building2,
  Route,
  Star,
  Megaphone,
  Landmark,
  Images,
  CircleQuestionMark,
  CalendarCheck,
  PanelBottom,
  Lock,
  Scale,
  Car,
  Quote,
  ImageIcon,
  SettingsIcon,
  Inbox,
  LayoutGrid,
  Palette,
};

export function getNavIcon(name) {
  return NAV_ICONS[name] ?? LayoutGrid;
}
