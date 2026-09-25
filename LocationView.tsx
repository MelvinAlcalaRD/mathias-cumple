import React, { useState } from 'react';
import { EVENT_DETAILS, TIMELINE_SCHEDULE } from '../data/initialData.ts';
import { playPopSound } from '../utils/audio.ts';

export const LocationView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleCopyAddress = () => {
    playPopSound();
    navigator.clipboard?.writeText(EVENT_DETAILS.fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenMaps = () => {
    window.open(EVENT_DETAILS.googleMapsUrl, '_blank');
  };

  const handleOpenWaze = () => {
    window.open(EVENT_DETAILS.wazeUrl, '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6 flex flex-col gap-8">
      {/* Top Banner */}
      <div className="text-center max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffe083] text-[#231b00] rounded-full font-bold text-[12px] shadow-xs mb-2">
          <span className="material-symbols-outlined text-[16px] text-[#735c00]">explore</span>
          Ubicación y Guía del Festejo
        </span>
        <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#630ed4] tracking-tight">
          ¿Cómo llegar a Inflakids Parque Inflable?
        </h2>
        <p className="text-[14px] text-[#4a4455] mt-1">
          Queremos que tu llegada a La Romana sea súper sencilla y disfrutes cada minuto junto a Mathias.
        </p>
      </div>

      {/* Interactive Map Visual Box */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-[#eceef0] overflow-hidden flex flex-col gap-4">
        {/* Venue Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eceef0]">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ffdf9a] flex items-center justify-center text-[#785a00] shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[26px]">apartment</span>
            </div>
            <div>
              <h3 className="text-[18px] font-extrabold text-[#191c1e]">
                {EVENT_DETAILS.venueName}
              </h3>
              <p className="text-[13px] text-[#4a4455] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#630ed4]">pin_drop</span>
                {EVENT_DETAILS.fullAddress}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAddress}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#191c1e] text-[13px] font-bold transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Map Canvas Illustration / Mock */}
        <div className="relative w-full h-72 sm:h-84 rounded-2xl overflow-hidden bg-[#e8ede8] border border-[#d8dadc] shadow-inner flex items-center justify-center select-none">
          {/* Stylized road & park grid background */}
          <div
            className="absolute inset-0 transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* SVG Roads & Blocks */}
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="street-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
                  {/* Green park grass */}
                  <rect width="120" height="120" fill="#eaf4ea" />
                  <rect x="10" y="10" width="45" height="45" rx="6" fill="#ddeedd" />
                  <rect x="65" y="10" width="45" height="45" rx="6" fill="#ddeedd" />
                  <rect x="10" y="65" width="45" height="45" rx="6" fill="#ddeedd" />
                  <rect x="65" y="65" width="45" height="45" rx="6" fill="#ddeedd" />
                  {/* Road grid */}
                  <path d="M 0 60 L 120 60 M 60 0 L 60 120" stroke="#ffffff" strokeWidth="14" />
                  <path d="M 0 60 L 120 60 M 60 0 L 60 120" stroke="#f1c40f" strokeWidth="1.5" strokeDasharray="4 4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#street-pattern)" />

              {/* Highway avenue */}
              <line x1="0" y1="40" x2="800" y2="400" stroke="#ffffff" strokeWidth="26" />
              <line x1="0" y1="40" x2="800" y2="400" stroke="#d5dbdb" strokeWidth="22" />
              <line x1="0" y1="40" x2="800" y2="400" stroke="#f39c12" strokeWidth="2" strokeDasharray="6 6" />

              {/* Park pond */}
              <ellipse cx="680" cy="120" rx="90" ry="60" fill="#bfe3f7" opacity="0.8" />
            </svg>

            {/* Central Salon Pinpoint */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-auto">
              {/* Card Label */}
              <div className="bg-[#630ed4] text-white px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 border-2 border-white mb-1 animate-gentle-float">
                <span className="material-symbols-outlined text-[16px] text-[#fdc425] fill-icon">toys</span>
                <span className="text-[12px] font-extrabold whitespace-nowrap">¡Inflakids Parque Inflable!</span>
              </div>
              {/* Pin */}
              <div className="w-10 h-10 rounded-full bg-[#fdc425] border-3 border-white shadow-xl flex items-center justify-center text-[#251a00] ring-4 ring-[#fdc425]/40 animate-pulse">
                <span className="material-symbols-outlined text-[24px]">location_on</span>
              </div>
              <div className="w-2.5 h-2 bg-black/30 rounded-full blur-[1px] -mt-0.5"></div>
            </div>

            {/* Parking Badge */}
            <div className="absolute top-1/2 left-[58%] translate-y-3 bg-white/95 text-[#191c1e] px-2 py-0.5 rounded-lg shadow-sm border border-[#ccc3d8] flex items-center gap-1 text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px] text-blue-600">local_parking</span>
              Estacionamiento
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-1 bg-white rounded-xl shadow-md border border-[#eceef0] p-1 z-10">
            <button
              onClick={() => {
                playPopSound();
                setZoomLevel((z) => Math.min(1.6, z + 0.2));
              }}
              title="Acercar mapa"
              className="w-8 h-8 rounded-lg hover:bg-[#f2f4f6] flex items-center justify-center text-[#191c1e] font-bold"
            >
              +
            </button>
            <button
              onClick={() => {
                playPopSound();
                setZoomLevel((z) => Math.max(0.8, z - 0.2));
              }}
              title="Alejar mapa"
              className="w-8 h-8 rounded-lg hover:bg-[#f2f4f6] flex items-center justify-center text-[#191c1e] font-bold"
            >
              −
            </button>
          </div>

          {/* Hint Overlay */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#4a4455] shadow-xs flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#630ed4]">touch_app</span>
            Zona de fácil acceso y estacionamiento exclusivo
          </div>
        </div>

        {/* GPS Navigation External Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleOpenMaps}
            className="w-full py-3 px-4 rounded-2xl bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#191c1e] font-bold text-[14px] flex items-center justify-center gap-2 border border-[#ccc3d8] shadow-xs transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px] text-red-500 fill-icon">
              map
            </span>
            <span>Abrir con Google Maps</span>
          </button>

          <button
            onClick={handleOpenWaze}
            className="w-full py-3 px-4 rounded-2xl bg-[#630ed4] hover:bg-[#7c3aed] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px] text-[#fdc425]">
              navigation
            </span>
            <span>Navegar con Waze</span>
          </button>
        </div>
      </div>

      {/* Party Itinerary & Timeline */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-[#eceef0]">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#eaddff] text-[#630ed4] flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[22px] fill-icon">schedule</span>
          </div>
          <div>
            <h3 className="text-[20px] font-extrabold text-[#630ed4]">
              Cronograma de la Fiesta
            </h3>
            <p className="text-[13px] text-[#7b7487]">
              Cada momento está pensado para que los chicos y grandes zumben de alegría
            </p>
          </div>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#ffdf9a] space-y-6">
          {TIMELINE_SCHEDULE.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#fdc425] border-2 border-white shadow-sm flex items-center justify-center text-[#6d5200]">
                <span className="material-symbols-outlined text-[14px] sm:text-[16px]">
                  {item.icon}
                </span>
              </div>

              <div className="bg-[#f7f9fb] p-3.5 sm:p-4 rounded-2xl border border-[#eceef0] hover:border-[#ffdf9a] transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[15px] sm:text-[16px] font-extrabold text-[#191c1e]">
                    {item.title}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#eaddff] text-[#25005a] font-bold text-[12px]">
                    {item.time}
                  </span>
                </div>
                <p className="text-[13px] text-[#4a4455] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Venue Features / Tips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#f2f4f6] p-4 rounded-2xl border border-[#e0e3e5] flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#ffdf9a] text-[#785a00] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">local_parking</span>
          </div>
          <div>
            <h4 className="text-[14px] font-extrabold text-[#191c1e]">Estacionamiento</h4>
            <p className="text-[12px] text-[#4a4455] mt-0.5">
              Cochera privada y vigilada sin costo para todos los invitados.
            </p>
          </div>
        </div>

        <div className="bg-[#f2f4f6] p-4 rounded-2xl border border-[#e0e3e5] flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#eaddff] text-[#630ed4] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">ac_unit</span>
          </div>
          <div>
            <h4 className="text-[14px] font-extrabold text-[#191c1e]">Salón Climatizado</h4>
            <p className="text-[12px] text-[#4a4455] mt-0.5">
              Ambiente cómodo con aire acondicionado y purificadores de aire.
            </p>
          </div>
        </div>

        <div className="bg-[#f2f4f6] p-4 rounded-2xl border border-[#e0e3e5] flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#ffe083] text-[#735c00] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">child_friendly</span>
          </div>
          <div>
            <h4 className="text-[14px] font-extrabold text-[#191c1e]">Espacio para Bebés</h4>
            <p className="text-[12px] text-[#4a4455] mt-0.5">
              Cambiador higiénico, sillitas altas y sector blando para los más chiquitos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
