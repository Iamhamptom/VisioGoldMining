'use client';

import React from 'react';
import { Settings, Palette, Mail, Globe } from 'lucide-react';

export default function GovSettingsPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-6">Portal Settings</h2>

      <div className="space-y-6">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-medium flex items-center gap-2 mb-4">
            <Palette size={16} className="text-purple-400" /> Branding
          </h3>
          <p className="text-sm text-gray-400">
            Customize your portal&apos;s colors, logo, and banner from the portal editor.
            Select a portal from the Portals tab to edit its branding.
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-medium flex items-center gap-2 mb-4">
            <Mail size={16} className="text-blue-400" /> Notifications
          </h3>
          <p className="text-sm text-gray-400">
            Configure email notifications for new consultation requests and investor registrations.
          </p>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-white/5" />
              Email on new consultation request
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-white/5" />
              Email on new investor registration
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-600 bg-white/5" />
              Weekly analytics summary
            </label>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-medium flex items-center gap-2 mb-4">
            <Globe size={16} className="text-green-400" /> Commission Rate
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Default platform commission rate. This can be overridden per revenue event.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              defaultValue="20"
              min="0"
              max="50"
              className="w-24 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-400/20"
            />
            <span className="text-sm text-gray-500">% platform fee (government receives the remainder)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
