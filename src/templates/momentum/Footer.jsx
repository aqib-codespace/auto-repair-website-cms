import Footer from "@/components/layout/Footer";
import MobileCallBar from "@/components/layout/MobileCallBar";

export default function MomentumFooter({ content }) {
  const { settings, blocks, collections } = content;

  return (
    <>
      <Footer
        settings={settings}
        footer={blocks.footer}
        services={collections.services}
        hours={blocks.contact?.hours ?? []}
      />

      {/* Bottom padding on mobile so the sticky call bar never covers content. */}
      <div className="h-[4.75rem] lg:hidden" aria-hidden="true" />
      <MobileCallBar settings={settings} />
    </>
  );
}
