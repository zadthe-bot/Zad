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
          
          {/* Method 1: Capacitor (Easiest) */}
          <div className="p-5 rounded-2xl bg-[#f0f3f8] shadow-[6px_6px_14px_#d0d7e2,-6px_-6px_14px_#ffffff] border border-white/80">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                <Zap className="w-3 h-3 text-emerald-600" />
                Option 1: Capacitor (Recommended • 5 Mins)
              </span>
              <div className="flex items-center gap-2 text-slate-600">
                <Apple className="w-4 h-4" />
                <Play className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-sm font-bold text-black mb-1">
              Capacitor by Ionic (Wrap TSX directly into iOS/Android APK/IPA)
            </h3>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Capacitor wraps this exact Vite + React TypeScript project in a native mobile shell. You keep 100% of your TSX code, components, and Tailwind styles.
            </p>

            <div className="p-3 rounded-xl bg-slate-900 text-orange-400 font-mono text-[11px] space-y-1">
              <p className="text-slate-400"># 1. Install Capacitor in this project:</p>
              <p>npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios</p>
              <p className="text-slate-400 mt-2"># 2. Build Vite bundle & initialize native platforms:</p>
              <p>npx cap init QuickBite com.quickbite.app</p>
              <p>npm run build</p>
              <p>npx cap add android &amp;&amp; npx cap add ios</p>
              <p className="text-slate-400 mt-2"># 3. Open in Android Studio or Xcode to run on device:</p>
              <p>npx cap open android</p>
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
