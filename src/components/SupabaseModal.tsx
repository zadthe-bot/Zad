import React, { useState } from 'react';
import { X, Database, Check, Copy, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured, SUPABASE_SCHEMA_SQL } from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl clay-card p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full clay-pill text-slate-700 hover:text-black cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="p-3.5 rounded-2xl bg-emerald-600 text-white shadow-[4px_4px_10px_rgba(16,185,129,0.35)]">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                Supabase Backend
              </h2>
              {isSupabaseConfigured ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Connected
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-black flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Demo Mode (Local State)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 font-bold mt-0.5">
              PostgreSQL database integration for orders and favorite restaurants.
            </p>
          </div>
        </div>

        {/* Connection Setup Guide */}
        <div className="space-y-4 my-6">
          
          {/* Step 1: Environment Variables */}
          <div className="p-5 rounded-2xl bg-[#f0f3f8] shadow-[6px_6px_14px_#d0d7e2,-6px_-6px_14px_#ffffff] border border-white/80">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
              <span>Step 1: Set Environment Variables</span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 hover:underline flex items-center gap-1 text-[11px] font-bold"
              >
                Go to Supabase <ExternalLink className="w-3 h-3" />
              </a>
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-3">
              Add your Supabase Project URL and Anon API key to your environment variables or <code className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[11px]">.env</code> file:
            </p>
            <div className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] space-y-1">
              <p><span className="text-slate-400">VITE_SUPABASE_URL=</span>https://your-project.supabase.co</p>
              <p><span className="text-slate-400">VITE_SUPABASE_ANON_KEY=</span>eyJhbGciOiJIUzI1NiIsInR5cCI6...</p>
            </div>
          </div>

          {/* Step 2: Database Table SQL Schema */}
          <div className="p-5 rounded-2xl bg-[#f0f3f8] shadow-[6px_6px_14px_#d0d7e2,-6px_-6px_14px_#ffffff] border border-white/80">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Step 2: Initialize Tables (SQL Schema)
              </h3>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl clay-button-orange text-[11px] font-black cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 font-medium mb-3">
              Copy and paste this SQL script directly into your Supabase <span className="font-bold">SQL Editor</span> tab to automatically generate the <code className="text-orange-600 font-bold">orders</code> and <code className="text-orange-600 font-bold">favorites</code> tables.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] max-h-48 overflow-y-auto whitespace-pre">
              {SUPABASE_SCHEMA_SQL}
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-300/60">
          <p className="text-xs font-bold text-slate-600">
            {isSupabaseConfigured
              ? '✨ Live database active. All orders and favorites will automatically persist to Supabase.'
              : '⚡ Currently operating with resilient local persistence until env keys are set.'}
          </p>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl clay-button-black text-xs font-extrabold cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
