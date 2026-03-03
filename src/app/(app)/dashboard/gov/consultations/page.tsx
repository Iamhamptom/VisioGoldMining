'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { MessageSquare, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ConsultationRequest } from '@/types';

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock size={14} className="text-yellow-400" />,
  acknowledged: <AlertCircle size={14} className="text-blue-400" />,
  scheduled: <Clock size={14} className="text-purple-400" />,
  completed: <CheckCircle2 size={14} className="text-green-400" />,
  declined: <AlertCircle size={14} className="text-red-400" />,
  cancelled: <AlertCircle size={14} className="text-gray-400" />,
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'text-red-400',
  high: 'text-orange-400',
  normal: 'text-gray-400',
  low: 'text-gray-600',
};

export default function ConsultationsPage() {
  const { token } = useAuth();
  const [consultations, setConsultations] = useState<(ConsultationRequest & { portal_title?: string; listing_title?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard/gov/consultations', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setConsultations(data.consultations || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-gray-500">Loading consultations...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Consultation Requests</h2>
        <span className="text-sm text-gray-500">
          {consultations.filter(c => c.status === 'pending').length} pending
        </span>
      </div>

      {consultations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
          <p>No consultation requests yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {consultations.map(c => (
            <div key={c.id} className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-white font-medium flex items-center gap-2">
                    {STATUS_ICONS[c.status]}
                    {c.subject}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {c.contact_name} ({c.contact_email})
                    {c.listing_title && <> &middot; Re: {c.listing_title}</>}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${PRIORITY_COLORS[c.priority] || ''}`}>
                    {c.priority}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-400">{c.request_type}</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2">{c.message}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                <span>{new Date(c.created_at).toLocaleDateString()}</span>
                <span>{c.portal_title}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
