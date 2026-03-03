'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, TrendingUp, Clock, FileText, ArrowLeft } from 'lucide-react';
import type { OpportunityListing } from '@/types';
import { useBranding } from './BrandingProvider';
import OpportunityScoreRadar from './OpportunityScoreRadar';
import KeyFactsGrid from './KeyFactsGrid';
import ExplanationTooltip from './ExplanationTooltip';

function formatCurrency(amount: number | null): string {
  if (!amount) return '—';
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount.toFixed(0)}`;
}

interface Props {
  listing: OpportunityListing & { sector_name?: string; entity_name?: string; entity_province?: string };
  portalSlug: string;
}

export default function OpportunityDetail({ listing, portalSlug }: Props) {
  const { primaryColor } = useBranding();

  const hasScores = listing.score_geological != null || listing.score_infrastructure != null ||
    listing.score_legal != null || listing.score_environmental != null || listing.score_social != null;

  return (
    <div>
      <Link
        href={`/gov/${portalSlug}/opportunities`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft size={14} /> Back to opportunities
      </Link>

      {/* Hero */}
      <div className="mb-8">
        {listing.images?.[0]?.url && (
          <div className="h-64 rounded-xl overflow-hidden mb-6">
            <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 mb-2 inline-block">
              {listing.sector_name || listing.sector_id}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            {listing.entity_name && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin size={14} /> {listing.entity_name}{listing.entity_province ? `, ${listing.entity_province}` : ''}
              </p>
            )}
          </div>
          {listing.score_overall != null && listing.score_overall > 0 && (
            <div className="text-center px-4 py-2 rounded-xl" style={{ backgroundColor: `${primaryColor}10` }}>
              <div className="text-2xl font-bold" style={{ color: primaryColor }}>
                {listing.score_overall.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">Overall Score</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Summary */}
          {listing.summary && (
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">{listing.summary}</p>
            </div>
          )}

          {/* Description */}
          {listing.description && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <div className="prose prose-sm max-w-none text-gray-600">{listing.description}</div>
            </div>
          )}

          {/* Key Facts */}
          {listing.key_facts && listing.key_facts.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Key Facts
                <ExplanationTooltip text="Key metrics and data points about this opportunity, sourced from government records and field assessments." />
              </h2>
              <KeyFactsGrid facts={listing.key_facts} />
            </div>
          )}

          {/* Scores */}
          {hasScores && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Assessment Scores
                <ExplanationTooltip text="Each dimension is scored 0-10 based on field data, regulatory status, and expert assessment. The overall score is a weighted average." />
              </h2>
              <OpportunityScoreRadar listing={listing} />
            </div>
          )}

          {/* Documents */}
          {listing.documents && listing.documents.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Documents</h2>
              <div className="space-y-2">
                {listing.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <FileText size={16} className="text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                      <div className="text-xs text-gray-500">{doc.type}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Investment card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Investment Details</h3>
            <div className="space-y-3">
              {(listing.investment_min || listing.investment_max) && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1"><TrendingUp size={14} /> Range</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(listing.investment_min)} – {formatCurrency(listing.investment_max)}
                  </span>
                </div>
              )}
              {listing.expected_roi && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Expected ROI</span>
                  <span className="font-medium text-gray-900">{listing.expected_roi}</span>
                </div>
              )}
              {listing.timeline_months && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1"><Clock size={14} /> Timeline</span>
                  <span className="font-medium text-gray-900">{listing.timeline_months} months</span>
                </div>
              )}
              {listing.area_hectares && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Area</span>
                  <span className="font-medium text-gray-900">{listing.area_hectares.toLocaleString()} ha</span>
                </div>
              )}
              {listing.currency && listing.currency !== 'USD' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Currency</span>
                  <span className="font-medium text-gray-900">{listing.currency}</span>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-2">
              <Link
                href={`/gov/${portalSlug}/consult?listing=${listing.slug}`}
                className="block text-center text-sm font-medium px-4 py-2.5 rounded-lg text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                Request Consultation
              </Link>
              <Link
                href={`/gov/${portalSlug}/invest`}
                className="block text-center text-sm font-medium px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Register as Investor
              </Link>
            </div>
          </div>

          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
