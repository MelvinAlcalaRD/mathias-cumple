import React from 'react';
import { ActiveTab } from '../types.ts';
import { playPopSound } from '../utils/audio.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenOrganizer: () => void;
  rsvpCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenOrganizer,
  rsvpCount
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#f7f9fb]/90 backdrop-blur-xl border-b border-[#e0e3e5]/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => {
            playPopSound();
            setActiveTab('invitacion');
          }}
          className="flex items-center gap-2 text-left group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-[#fdc425] flex items-center justify-center text-[#6d5200] shadow-sm group-hover:rotate-12 transition-transform">
            <span className="material-symbols-outlined text-[22px]">celebration</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[17px] sm:text-[18px] text-[#630ed4] tracking-tight leading-tight">
              Mathias Cumple
            </span>
            <span className="font-bold text-[11px] text-[#785a00] -mt-0.5">
              Abejita Chiquitita • Plin Plin
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-[#e6e8ea]/60 rounded-full">
          <button
            onClick={() => {
              playPopSound();
              setActiveTab('invitacion');
            }}
            className={`px-3.5 py-1.5 rounded-full font-bold text-[13px] transition-all ${
              activeTab === 'invitacion'
                ? 'bg-[#7c3aed] text-white shadow-sm'
                : 'text-[#4a4455] hover:text-[#191c1e] hover:bg-white/40'
            }`}
          >
            Festiva
          </button>
          <button
            onClick={() => {
              playPopSound();
              setActiveTab('asistencia');
            }}
            className={`px-3.5 py-1.5 rounded-full font-bold text-[13px] transition-all flex items-center gap-1.5 ${
              activeTab === 'asistencia'
                ? 'bg-[#7c3aed] text-white shadow-sm'
                : 'text-[#4a4455] hover:text-[#191c1e] hover:bg-white/40'
            }`}
          >
            <span>Asistencia</span>
            {rsvpCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'asistencia' ? 'bg-white/25 text-white' : 'bg-[#eaddff] text-[#630ed4]'
              }`}>
                {rsvpCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              playPopSound();
              setActiveTab('ubicacion');
            }}
            className={`px-3.5 py-1.5 rounded-full font-bold text-[13px] transition-all ${
              activeTab === 'ubicacion'
                ? 'bg-[#7c3aed] text-white shadow-sm'
                : 'text-[#4a4455] hover:text-[#191c1e] hover:bg-white/40'
            }`}
          >
            Cómo Llegar
          </button>
        </nav>

        {/* Right Action Cluster: PWA Install + Badges */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton />

          <span className="hidden sm:inline-flex items-center gap-1 bg-[#ffdf9a] px-3 py-1 rounded-full text-[#251a00] font-bold text-[11px] shadow-xs">
            <span className="material-symbols-outlined text-[14px] text-[#ba1a1a]">favorite</span>
            ¡Te esperamos!
          </span>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around px-2 py-1.5 bg-[#f2f4f6] border-t border-[#e6e8ea] overflow-x-auto text-xs">
        <button
          onClick={() => {
            playPopSound();
            setActiveTab('invitacion');
          }}
          className={`px-4 py-1 text-center font-bold rounded-full transition-all whitespace-nowrap ${
            activeTab === 'invitacion'
              ? 'bg-[#7c3aed] text-white shadow-xs'
              : 'text-[#4a4455]'
          }`}
        >
          Festiva
        </button>
        <button
          onClick={() => {
            playPopSound();
            setActiveTab('asistencia');
          }}
          className={`px-4 py-1 text-center font-bold rounded-full transition-all whitespace-nowrap ${
            activeTab === 'asistencia'
              ? 'bg-[#7c3aed] text-white shadow-xs'
              : 'text-[#4a4455]'
          }`}
        >
          Asistencia {rsvpCount > 0 ? `(${rsvpCount})` : ''}
        </button>
        <button
          onClick={() => {
            playPopSound();
            setActiveTab('ubicacion');
          }}
          className={`px-4 py-1 text-center font-bold rounded-full transition-all whitespace-nowrap ${
            activeTab === 'ubicacion'
              ? 'bg-[#7c3aed] text-white shadow-xs'
              : 'text-[#4a4455]'
          }`}
        >
          Cómo Llegar
        </button>
      </div>
    </header>
  );
};

