import React from 'react';
import { X, Flame, ShieldCheck, Database, Layers, CheckCircle } from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

interface FirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseModal: React.FC<FirebaseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl dark-card p-6 sm:p-8 border border-slate-800 shadow-2xl overflow-y-auto max-h-[90vh] text-slate-100">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-3.5 rounded-2xl bg-orange-500/20 text-orange-500 border border-orange-500/30">
            <Flame className="w-7 h-7 fill-orange-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Firebase Firestore Active
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Real-time Google Firebase database storing orders, Google Maps food spots, and favorites.
            </p>
          </div>
        </div>

        {/* Status Info Grid */}
        <div className="space-y-4 my-6">
          
          {/* Active Config Card */}
          <div className="p-4 rounded-2xl bg-[#18202e] border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-orange-500" />
                Firestore Database Instance
              </span>
              <span className="text-[11px] font-bold text-slate-400 font-mono">
                {firebaseConfig.projectId}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0b0f17] text-xs font-mono text-slate-300 space-y-1.5">
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-500">Database ID:</span>
                <span className="text-orange-300 font-bold">{firebaseConfig.firestoreDatabaseId || '(default)'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-500">Auth Domain:</span>
                <span className="text-slate-300">{firebaseConfig.authDomain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Region:</span>
                <span className="text-emerald-400 font-bold">europe-west2</span>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="p-4 rounded-2xl bg-[#18202e] border border-slate-800/80">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-orange-500" />
              Synced Collections
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0b0f17]/60 border border-slate-800/40 text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong className="text-orange-400">/restaurants</strong> - Google Maps Data</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0b0f17]/60 border border-slate-800/40 text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong className="text-orange-400">/orders</strong> - Live Order Updates</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0b0f17]/60 border border-slate-800/40 text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong className="text-orange-400">/user_favorites</strong> - User Wishlists</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0b0f17]/60 border border-slate-800/40 text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong className="text-orange-400">/addresses</strong> - Saved Locations</span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <p className="text-xs font-medium text-slate-400">
            🔥 Fully connected to Google Cloud Firebase
          </p>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl orange-button text-xs font-black cursor-pointer"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
