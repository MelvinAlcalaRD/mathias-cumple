import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { playPopSound } from '../utils/audio.ts';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={() => {
          playPopSound();
          install();
        }}
        className="flex items-center gap-1.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] px-3.5 py-1 text-[12px] font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
        title="Instalar en tu celular o computadora"
      >
        <span className="material-symbols-outlined text-[16px]">install_mobile</span>
        <span>Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => {
            playPopSound();
            setShowIOSGuide(true);
          }}
          className="flex items-center gap-1.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] px-3.5 py-1 text-[12px] font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">ios_share</span>
          <span>Instalar en iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-[#eceef0]">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#eaddff] text-[#630ed4] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">phone_iphone</span>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="w-8 h-8 rounded-full bg-[#f2f4f6] text-[#7b7487] flex items-center justify-center hover:bg-[#e6e8ea]"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <h3 className="text-[17px] font-extrabold text-[#191c1e]">
                Instalar en tu iPhone o iPad
              </h3>
              <p className="mt-2 text-[13px] text-[#4a4455] leading-relaxed">
                1. Toca el botón <strong>Compartir</strong> (<span className="material-symbols-outlined text-[16px] align-middle text-blue-600">ios_share</span>) en la barra inferior de Safari.<br />
                2. Desliza hacia abajo y selecciona <strong>"Agregar a Inicio"</strong> (Add to Home Screen).<br />
                3. ¡Listo! Podrás abrir la invitación como una aplicación real en cualquier momento.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-2xl bg-[#4F46E5] py-2.5 text-[14px] font-bold text-white hover:bg-[#4338CA] transition shadow-md"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
