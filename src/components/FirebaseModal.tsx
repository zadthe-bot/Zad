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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl white-card p-6 sm:p-8 border border-emerald-100 shadow-2xl overflow-y-auto max-h-[90vh] text-slate-800 bg-white">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Flame className="w-7 h-7 fill-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Firebase Firestore Active
              </h2>
              <span className="px-2.5 py-0.5 rounded-full green-pill text-xs font-black flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Real-time Google Firebase database storing orders, Google Maps food spots, and favorites.
            </p>
          </div>
        </div>

        {/* Status Info Grid */}
        <div className="space-y-4 my-6">
          
          {/* Active Config Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-emerald-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-600" />
                Firestore Database Instance
              </span>
              <span className="text-[11px] font-bold text-slate-600 font-mono">
                {firebaseConfig.projectId}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 space-y-1.5">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Database ID:</span>
                <span className="text-emerald-700 font-bold">{firebaseConfig.firestoreDatabaseId || '(default)'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Auth Domain:</span>
                <span className="text-slate-700">{firebaseConfig.authDomain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Region:</span>
                <span className="text-emerald-700 font-bold">europe-west2</span>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-emerald-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Synced Collections
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong className="text-emerald-700">/restaurants</strong> - Google Maps Data</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong className="text-emerald-700">/orders</strong> - Live Order Updates</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong className="text-emerald-700">/user_favorites</strong> - User Wishlists</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong className="text-emerald-700">/addresses</strong> - Saved Locations</span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-500">
            🔥 Fully connected to Google Cloud Firebase
          </p>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl green-button text-xs font-black cursor-pointer shadow-md"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};

