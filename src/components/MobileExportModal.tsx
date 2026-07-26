import React from 'react';
import { X, Smartphone, Apple, Play, Code, CheckCircle2, ArrowRight, Layers, Cpu, Zap } from 'lucide-react';

interface MobileExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileExportModal: React.FC<MobileExportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#f0f3f8] text-slate-900 rounded-3xl shadow-[12px_12px_28px_#c3cbda,-12px_-12px_28px_#ffffff] border border-white/80 p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#f0f3f8] shadow-[4px_4px_8px_#d0d7e2,-4px_-4px_8px_#ffffff] text-slate-700 hover:text-black cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-orange-500 text-white shadow-[4px_4px_10px_rgba(240,78,14,0.35)]">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-black">
              Convert TSX Code to iOS & Android App
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Yes! Your TSX React web prototype can easily run as a native mobile app.
            </p>
          </div>
        </div>

        {/* 3 Mobile Conversion Pathways */}
        <div className="space-y-4 my-6">
          
          {/* Method 1: Automated GitHub Actions (No Computer Required) */}
          <div className="p-5 rounded-2xl bg-[#f0f3f8] shadow-[6px_6px_14px_#d0d7e2,-6px_-6px_14px_#ffffff] border border-white/80">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                100% Cloud Automated (No Computer Required!)
              </span>
              <div className="flex items-center gap-2 text-slate-600">
                <Apple className="w-4 h-4" />
                <Play className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-sm font-bold text-black mb-1">
              Automated GitHub Actions `.github/workflows/build-mobile.yml`
            </h3>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              We added all Capacitor packages (`@capacitor/core`, `@capacitor/android`), `capacitor.config.json`, and an automated GitHub workflow directly into this codebase. You don't need a laptop or computer!
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 text-orange-400 font-mono text-[11px] space-y-1.5">
              <p className="text-slate-300 font-bold">How to download your .APK file from your phone:</p>
              <p className="text-slate-400">1. Open your GitHub repository on your phone browser</p>
              <p className="text-slate-400">2. Tap the <span className="text-white font-bold">Actions</span> tab at the top</p>
              <p className="text-slate-400">3. Tap <span className="text-white font-bold">Build Mobile Apps (Capacitor)</span> &gt; <span className="text-white font-bold">Run workflow</span></p>
              <p className="text-slate-400">4. When completed (~2 mins), scroll down to <span className="text-emerald-400 font-bold">Artifacts</span> and tap <span className="text-orange-300 font-bold">QuickBite-Android-APK</span> to download!</p>
            </div>
          </div>

          {/* Method 2: React Native */}
          <div className="p-5 rounded-2xl bg-[#f0f3f8] shadow-[6px_6px_14px_#d0d7e2,-6px_-6px_14px_#ffffff] border border-white/80">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold">
                <Cpu className="w-3 h-3 text-orange-600" />
                Option 2: React Native / Expo (100% Native Components)
              </span>
            </div>

            <h3 className="text-sm font-bold text-black mb-1">
              Port TSX logic to Expo / React Native
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Share all TypeScript types (`types.ts`), state management, business logic, and API calls. Replace HTML `&lt;div&gt;` with React Native `&lt;View&gt;` and `&lt;Text&gt;`.
            </p>
          </div>

          {/* Method 3: Progressive Web App */}
          <div className="p-5 rounded-2xl bg-[#f0f3f8] shadow-[6px_6px_14px_#d0d7e2,-6px_-6px_14px_#ffffff] border border-white/80">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                <Layers className="w-3 h-3 text-blue-600" />
                Option 3: PWA (Install directly from browser)
              </span>
            </div>

            <h3 className="text-sm font-bold text-black mb-1">
              Progressive Web App (PWA)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Users can tap "Add to Home Screen" on iPhone or Android to install this app immediately without App Store review.
            </p>
          </div>

        </div>

        {/* Modal Action CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Ready for App Store &amp; Google Play export</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl clay-button-black text-xs font-bold cursor-pointer"
          >
            Got it, Back to App
          </button>
        </div>

      </div>
    </div>
  );
};
