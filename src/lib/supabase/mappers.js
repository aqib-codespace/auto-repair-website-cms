/**
 * Supabase/Postgres columns are snake_case; every public component in this
 * app expects camelCase props (and nested `image: { src, alt }` objects, so
 * a component never has to know whether an image came from a column pair or
 * from JSON). These mappers keep that translation in one place.
 *
 * The admin panel deliberately works on raw rows instead — its forms are
 * generated from the column-level field registry in src/lib/admin/*, so it
 * has no need for the camelCase view.
 */

export function mapAdmin(row) {
  return {
    id: row.id,
    // null means a cross-site operator account rather than one shop's owner.
    siteId: row.site_id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
    failedLoginAttempts: row.failed_login_attempts,
    lockedUntil: row.locked_until,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  };
}

export function mapService(row) {
  return {
    id: row.id,
    icon: row.icon,
    title: row.title,
    description: row.description,
    sortOrder: row.sort_order,
  };
}

export function mapTestimonial(row) {
  return {
    id: row.id,
    quote: row.quote,
    name: row.name,
    vehicle: row.vehicle,
    rating: row.rating,
    featured: row.featured,
    image: { src: row.image_url, alt: row.image_alt },
    sortOrder: row.sort_order,
  };
}

export function mapFaq(row) {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    sortOrder: row.sort_order,
  };
}

export function mapGalleryItem(row) {
  return {
    id: row.id,
    image: { src: row.image_url, alt: row.image_alt },
    caption: row.caption,
    sortOrder: row.sort_order,
  };
}

export function mapSiteSettings(row) {
  return {
    siteId: row.site_id,
    company: row.company,
    tagline: row.tagline,
    logoUrl: row.logo_url,
    phone: row.phone,
    email: row.email,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2,
    mapEmbedUrl: row.map_embed_url,
    scheduleUrl: row.schedule_url,
    brandColor: row.brand_color,
    accentColor: row.accent_color,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    siteUrl: row.site_url,
    socialLinks: row.social_links ?? [],
    financingEnabled: row.financing_enabled,
    /**
     * Which design renders this site — see src/lib/templates/registry.js.
     *
     * Stored in `extras` rather than its own column because the ids are only
     * meaningful to this codebase's registry: "momentum" means nothing to the
     * other sites sharing this table, so a shared column would need a default
     * that is wrong for most rows. `extras` is the platform's existing home for
     * exactly this kind of per-site field, and it means adding a template — or a
     * whole new site with its own templates — needs no migration.
     */
    template: row.extras?.template,
    updatedAt: row.updated_at,
  };
}

export function mapMedia(row) {
  return {
    id: row.id,
    filename: row.filename,
    url: row.url,
    altText: row.alt_text,
    width: row.width,
    height: row.height,
    sizeBytes: row.size_bytes,
    uploadedAt: row.uploaded_at,
  };
}

export function mapLead(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    vehicleMake: row.vehicle_make,
    vehicleModel: row.vehicle_model,
    serviceNeeded: row.service_needed,
    preferredDate: row.preferred_date,
    comments: row.comments,
    status: row.status,
    createdAt: row.created_at,
  };
}
