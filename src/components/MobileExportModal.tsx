import React from 'react';
import { X, Smartphone, Apple, Play, CheckCircle2, Layers, Cpu, Zap } from 'lucide-react';

interface MobileExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileExportModal: React.FC<MobileExportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl white-card text-slate-800 p-6 sm:p-8 border border-emerald-100 overflow-y-auto max-h-[90vh] bg-white">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl green-button text-white shadow-md">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Convert TSX Code to iOS & Android App
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Yes! Your TSX React web prototype can easily run as a native mobile app.
            </p>
          </div>
        </div>

        {/* 3 Mobile Conversion Pathways */}
        <div className="space-y-4 my-6">
          
          {/* Method 1: Automated GitHub Actions (No Computer Required) */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full green-pill text-xs font-black">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                100% Cloud Automated (No Computer Required!)
              </span>
              <div className="flex items-center gap-2 text-slate-400">
                <Apple className="w-4 h-4 text-slate-600" />
                <Play className="w-4 h-4 text-slate-600" />
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Automated GitHub Actions `.github/workflows/build-mobile.yml`
            </h3>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              We added all Capacitor packages (`@capacitor/core`, `@capacitor/android`), `capacitor.config.json`, and an automated GitHub workflow directly into this codebase. You don't need a laptop or computer!
            </p>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-emerald-800 font-mono text-[11px] space-y-1.5">
              <p className="text-slate-900 font-bold">How to download your .APK file from your phone:</p>
              <p className="text-slate-600">1. Open your GitHub repository on your phone browser</p>
              <p className="text-slate-600">2. Tap the <span className="text-slate-900 font-bold">Actions</span> tab at the top</p>
              <p className="text-slate-600">3. Tap <span className="text-slate-900 font-bold">Build Mobile Apps (Capacitor)</span> &gt; <span className="text-slate-900 font-bold">Run workflow</span></p>
              <p className="text-slate-600">4. When completed (~2 mins), scroll down to <span className="text-emerald-700 font-bold">Artifacts</span> and tap <span className="text-emerald-700 font-bold">QuickBite-Android-APK</span> to download!</p>
            </div>
          </div>

          {/* Method 2: React Native */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                <Cpu className="w-3 h-3 text-emerald-600" />
                Option 2: React Native / Expo (100% Native Components)
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Port TSX logic to Expo / React Native
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Share all TypeScript types (`types.ts`), state management, business logic, and API calls. Replace HTML `&lt;div&gt;` with React Native `&lt;View&gt;` and `&lt;Text&gt;`.
            </p>
          </div>

          {/* Method 3: Progressive Web App */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200 text-[11px] font-bold">
                <Layers className="w-3 h-3 text-teal-600" />
                Option 3: PWA (Install directly from browser)
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Progressive Web App (PWA)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Users can tap "Add to Home Screen" on iPhone or Android to install this app immediately without App Store review.
            </p>
          </div>

        </div>

        {/* Modal Action CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ready for App Store &amp; Google Play export</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl green-button text-xs font-bold cursor-pointer shadow-md"
          >
            Got it, Back to App
          </button>
        </div>

      </div>
    </div>
  );
};


