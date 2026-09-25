import React from 'react';

interface FooterProps {
  onOpenOrganizer?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOrganizer }) => {
  return (
    <footer className="w-full bg-[#f2f4f6] py-10 mt-auto border-t border-[#eceef0]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center justify-center text-center gap-4">
        {/* Bunny / Bee icon */}
        <div className="w-9 h-9 rounded-full bg-[#fdc425]/80 flex items-center justify-center text-[#785a00] shadow-xs">
          <span className="material-symbols-outlined text-[20px]">cruelty_free</span>
        </div>

        <p className="font-extrabold text-[18px] text-[#191c1e]">
          Celebración Especial de Mathias
        </p>

        <p className="text-[14px] text-[#4a4455] max-w-md leading-relaxed">
          Hecho con todo el amor de la familia para celebrar juntos con la magia de Abejita Chiquitita y Plin Plin. ¡Gracias por ser parte!
        </p>

        <div className="flex items-center gap-4 pt-1 text-[11px] font-bold text-[#4a4455]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#735c00]">location_on</span>
            Inflakids Parque Inflable
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ccc3d8]"></span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#630ed4]">cake</span>
            Fiesta Infantil
          </span>
        </div>

        <div className="flex items-center justify-center gap-1 text-[12px] text-[#7b7487] pt-1">
          <span>© 2025 Mathias Cumpleaños • Confirmación de Asistencia Digital</span>
          {/* Enlace oculto independiente a panel.html */}
          <a
            href="/panel.html"
            title="Panel de la Familia (Oculto)"
            className="opacity-15 hover:opacity-100 transition-opacity p-0.5 text-gray-400 focus:outline-none cursor-pointer"
            aria-label="Panel"
          >
            🔒
          </a>
        </div>
      </div>
    </footer>
  );
};
