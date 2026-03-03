import { notFound } from 'next/navigation';
import { getAdminClient } from '@/lib/db';
import { BrandingProvider } from '@/components/portal/BrandingProvider';
import PortalHeader from '@/components/portal/PortalHeader';
import PortalFooter from '@/components/portal/PortalFooter';
import type { GovernmentPortal } from '@/types';

async function getPortal(slug: string): Promise<GovernmentPortal | null> {
  const client = await getAdminClient();
  try {
    const { rows } = await client.query(
      `SELECT p.*, e.name as entity_name, e.entity_type, e.province, e.country
       FROM government_portals p
       JOIN government_entities e ON e.id = p.entity_id
       WHERE p.slug = $1 AND p.published = true`,
      [slug]
    );
    return rows.length > 0 ? rows[0] as GovernmentPortal : null;
  } finally {
    client.release();
  }
}

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ portalSlug: string }>;
}) {
  const { portalSlug } = await params;
  const portal = await getPortal(portalSlug);

  if (!portal) {
    notFound();
  }

  return (
    <BrandingProvider portal={portal}>
      <div className="min-h-screen flex flex-col bg-white">
        <PortalHeader />
        <main className="flex-1">
          {children}
        </main>
        <PortalFooter />
      </div>
    </BrandingProvider>
  );
}
