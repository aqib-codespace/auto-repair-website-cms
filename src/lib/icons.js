import {
  Wrench,
  Droplets,
  Disc,
  Gauge,
  Cpu,
  Car,
  Cog,
  Snowflake,
  Zap,
  Truck,
  ShieldCheck,
  BadgeCheck,
  Users,
  ThumbsUp,
  Clock,
  CalendarCheck,
  ClipboardList,
  Search,
  KeyRound,
  HandCoins,
  Award,
  Hammer,
  BatteryCharging,
  Wind,
  Fuel,
  CircleDot,
  Sparkles,
  MapPin,
  PhoneCall,
  Star,
  Route,
  CircleCheck,
} from "lucide-react";

/**
 * Icons are stored in the database as stable slugs ("brake-disc"), never as
 * component names, so an admin's saved choice survives an icon-library
 * upgrade or rename. Unknown slugs fall back to a wrench rather than
 * crashing a public page.
 */
const ICONS = {
  wrench: { label: "Wrench", Component: Wrench },
  droplets: { label: "Oil / Fluids", Component: Droplets },
  disc: { label: "Brake Disc", Component: Disc },
  gauge: { label: "Gauge", Component: Gauge },
  cpu: { label: "Diagnostics Chip", Component: Cpu },
  car: { label: "Car", Component: Car },
  cog: { label: "Gear / Transmission", Component: Cog },
  snowflake: { label: "Air Conditioning", Component: Snowflake },
  zap: { label: "Electrical", Component: Zap },
  truck: { label: "Fleet / Truck", Component: Truck },
  "shield-check": { label: "Shield Check", Component: ShieldCheck },
  "badge-check": { label: "Certified Badge", Component: BadgeCheck },
  users: { label: "People", Component: Users },
  "thumbs-up": { label: "Thumbs Up", Component: ThumbsUp },
  clock: { label: "Clock", Component: Clock },
  "calendar-check": { label: "Calendar Check", Component: CalendarCheck },
  "clipboard-list": { label: "Estimate / Clipboard", Component: ClipboardList },
  search: { label: "Inspection / Search", Component: Search },
  key: { label: "Keys", Component: KeyRound },
  "hand-coins": { label: "Pricing / Coins", Component: HandCoins },
  award: { label: "Award", Component: Award },
  hammer: { label: "Hammer", Component: Hammer },
  battery: { label: "Battery", Component: BatteryCharging },
  wind: { label: "Airflow", Component: Wind },
  fuel: { label: "Fuel", Component: Fuel },
  tire: { label: "Tire", Component: CircleDot },
  sparkles: { label: "Detailing / Sparkles", Component: Sparkles },
  "map-pin": { label: "Location Pin", Component: MapPin },
  phone: { label: "Phone", Component: PhoneCall },
  star: { label: "Star", Component: Star },
  route: { label: "Road / Route", Component: Route },
  check: { label: "Check", Component: CircleCheck },
};

export function getIcon(name) {
  return ICONS[name]?.Component ?? Wrench;
}

/** [{ value, label }] for the admin icon picker, alphabetised by label. */
export const ICON_OPTIONS = Object.entries(ICONS)
  .map(([value, { label }]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label));
