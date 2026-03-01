'use client';

import { AuditLogViewer } from '@/components/audit-log-viewer';

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Audit Log</h2>
      <AuditLogViewer />
    </div>
  );
}
