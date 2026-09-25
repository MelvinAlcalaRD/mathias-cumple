import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { EVENT_DETAILS } from '../data/initialData.ts';
import { RSVPResponse } from '../types.ts';
import { playCelebrationSound, playPopSound, playBeeBuzzSound } from '../utils/audio.ts';
import { downloadICS, openGoogleCalendar } from '../utils/calendar.ts';

interface InvitationCardProps {
  onRSVPSubmit: (rsvp: Omit<RSVPResponse, 'id' | 'createdAt'>) => Promise<boolean> | void;
  onNavigateToLocation: () => void;
  existingRSVP?: RSVPResponse;
  webhookUrl?: string;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  onRSVPSubmit,
  onNavigateToLocation,
  existingRSVP,
  webhookUrl
}) => {
  // Form State
  const [guestName, setGuestName] = useState(existingRSVP?.guestName || '');
  const [status, setStatus] = useState<'confirmed' | 'declined'>(existingRSVP?.status || 'confirmed');
  const [guestCount, setGuestCount] = useState(existingRSVP?.guestCount || 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(!!existingRSVP);
  const [submittedData, setSubmittedData] = useState<RSVPResponse | null>(existingRSVP || null);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const [isBeeBuzzing, setIsBeeBuzzing] = useState(false);

  // Countdown timer logic
  const [countdown, setCountdown] = useState({
    days: 18,
    hours: 3,
    minutes: 28,
    seconds: 28,
    isExpired: false
  });

  useEffect(() => {
    // Target deadline: 12 de Octubre 2026 at 23:59:59 hs
    let targetDate = new Date(2026, 9, 12, 23, 59, 59);
    if (targetDate.getTime() <= Date.now()) {
      targetDate = new Date(Date.now() + 18 * 24 * 60 * 60 * 1000);
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds, isExpired: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleBeeClick = () => {
    playBeeBuzzSound();
    setIsBeeBuzzing(true);
    setTimeout(() => setIsBeeBuzzing(false), 800);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSubmitting(true);
    playPopSound();

    // Simulate saving
    await new Promise((res) => setTimeout(res, 600));

    const finalGuestCount = status === 'confirmed' ? guestCount : 0;
    const newRSVP: RSVPResponse = {
      id: 'rsvp-' + Date.now(),
      guestName: guestName.trim(),
      status,
      guestCount: finalGuestCount,
      notes: '',
      createdAt: new Date().toISOString()
    };

    await onRSVPSubmit({
      guestName: guestName.trim(),
      status,
      guestCount: finalGuestCount,
      notes: ''
    });

    setSubmittedData(newRSVP);
    setIsSubmitting(false);
    setIsSubmitted(true);

    if (status === 'confirmed') {
      playCelebrationSound();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#630ed4', '#fdc425', '#ffdf9a', '#7c3aed', '#10b981']
        });
      } catch (err) {
        // confetti fallback
      }
    }
  };

  const handleResetForm = () => {
    playPopSound();
    setIsSubmitted(false);
  };

  return (
    <section className="relative w-full py-8 md:py-14 px-4 md:px-8 flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient glowing honey & lilac halos */}
      <div className="absolute -top-12 -left-16 w-80 h-80 rounded-full bg-[#ffdf9a]/50 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-[#eaddff]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full bg-[#ffe083]/30 blur-2xl pointer-events-none" />

      <div className="relative w-full max-w-lg mx-auto">
        {/* Central Floating Invitation Card */}
        <div className="bg-white rounded-3xl shadow-[0_12px_36px_-6px_rgba(99,14,212,0.12),0_4px_16px_rgba(0,0,0,0.04)] p-5 sm:p-8 relative overflow-hidden border border-[#eceef0] transition-all duration-300">
          
          {/* Decorative honeycomb polygon accents */}
          <div className="absolute top-0 right-0 w-36 h-36 opacity-15 pointer-events-none flex items-start justify-end p-2">
            <svg className="text-[#fdc425]" fill="currentColor" height="110" viewBox="0 0 100 100" width="110">
              <polygon points="50,5 90,25 90,70 50,90 10,70 10,25" />
              <polygon opacity="0.6" points="25,50 45,60 45,82 25,92 5,82 5,60" />
              <polygon opacity="0.4" points="75,50 95,60 95,82 75,92 55,82 55,60" />
            </svg>
          </div>

          {/* Floating playful badge row */}
          <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#fdc425] text-[#6d5200] rounded-full font-bold text-[12px] shadow-xs animate-bounce">
              <span className="material-symbols-outlined text-[15px] fill-icon">cake</span>
              ¡Celebremos Juntos!
            </span>
            <span className="inline-flex items-center gap-1 text-[#735c00] font-bold text-[12px] bg-[#ffe083]/30 px-2.5 py-0.8 rounded-full">
              <span className="material-symbols-outlined text-[16px] text-[#eec200]">wb_sunny</span>
              1er Añito Mágico
            </span>
          </div>

          {/* Hero Abejita Header Block */}
          <div className="flex flex-col items-center text-center mb-6 relative z-10">
            <div className="relative mb-2">
              <button
                type="button"
                onClick={handleBeeClick}
                title="¡Haz clic en la abejita!"
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#ffdf9a] flex items-center justify-center p-1.5 shadow-md shadow-[#ffdf9a]/60 ring-4 ring-white cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
                  isBeeBuzzing ? 'animate-buzz' : 'hover:rotate-6'
                }`}
              >
                <img
                  alt="Abejita Chiquitita de Plin Plin"
                  className="w-full h-full object-cover rounded-full pointer-events-none"
                  src={EVENT_DETAILS.abejitaImageUrl}
                />
              </button>
              <div className="absolute -bottom-1 -right-1 bg-[#630ed4] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md animate-pulse">
                <span className="material-symbols-outlined text-[18px]">celebration</span>
              </div>
            </div>

            <h1 className="text-[32px] sm:text-[40px] font-extrabold text-[#630ed4] tracking-tight leading-tight mb-1">
              ¡Estás Invitado!
            </h1>

            <div className="inline-block bg-[#2d3133] text-[#fdc425] px-4 py-1 rounded-full font-bold text-[16px] sm:text-[18px] shadow-sm mb-2">
              {EVENT_DETAILS.milestone}
            </div>

            <p className="text-[14px] text-[#4a4455] max-w-xs leading-relaxed">
              Acompáñanos a cantar, reír y zumbar de felicidad junto a la tierna Abejita Chiquitita y Plin Plin.
            </p>
          </div>

          {/* Event Key Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
            {/* Fecha */}
            <div className="bg-[#f2f4f6] p-3 rounded-2xl flex sm:flex-col items-center sm:text-center gap-3 sm:gap-1.5 hover:bg-[#eceef0] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#ffdf9a] flex items-center justify-center text-[#251a00] shrink-0">
                <span className="material-symbols-outlined text-[20px] fill-icon">calendar_month</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#4a4455] uppercase tracking-wider">Fecha</p>
                <p className="text-[14px] font-bold text-[#191c1e]">{EVENT_DETAILS.dateFormatted}</p>
              </div>
            </div>

            {/* Horario */}
            <div className="bg-[#f2f4f6] p-3 rounded-2xl flex sm:flex-col items-center sm:text-center gap-3 sm:gap-1.5 hover:bg-[#eceef0] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#eaddff] flex items-center justify-center text-[#25005a] shrink-0">
                <span className="material-symbols-outlined text-[20px] fill-icon">schedule</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#4a4455] uppercase tracking-wider">Horario</p>
                <p className="text-[14px] font-bold text-[#191c1e]">{EVENT_DETAILS.timeFormatted}</p>
              </div>
            </div>

            {/* Lugar */}
            <div
              onClick={onNavigateToLocation}
              role="button"
              tabIndex={0}
              title="Ver ubicación del salón"
              className="bg-[#f2f4f6] p-3 rounded-2xl flex sm:flex-col items-center sm:text-center gap-3 sm:gap-1.5 hover:bg-[#e6e8ea] transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#ffe083] flex items-center justify-center text-[#231b00] shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px] fill-icon">location_on</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#4a4455] uppercase tracking-wider flex items-center justify-center gap-0.5">
                  <span>Lugar</span>
                  <span className="material-symbols-outlined text-[13px] text-[#630ed4]">open_in_new</span>
                </p>
                <p className="text-[14px] font-bold text-[#191c1e] group-hover:text-[#630ed4] transition-colors">
                  {EVENT_DETAILS.venueName}
                </p>
              </div>
            </div>
          </div>

          {/* Urgent RSVP Warning Honey Box */}
          <div className="bg-[#ffdf9a]/50 text-[#251a00] border border-[#f7be1d]/40 rounded-2xl p-4 mb-6 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fdc425] text-[#6d5200] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <span className="material-symbols-outlined text-[18px]">alarm</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-extrabold text-[#785a00]">
                    ⚠️ Confirmación Obligatoria
                  </span>
                </div>
                <p className="text-[12px] text-[#4a4455] mt-1 leading-snug">
                  El límite para confirmar tu asistencia es el <strong>{EVENT_DETAILS.deadlineDateText}</strong>. Llegada la fecha, los cupos del panal se cerrarán automáticamente.
                </p>

                {/* Real-time Countdown Tiles */}
                <div className="mt-3 pt-1 flex items-center justify-center gap-2 text-center">
                  <div className="bg-white px-2.5 py-1.5 rounded-xl shadow-xs min-w-[52px] border border-[#eceef0]">
                    <span className="text-[18px] font-extrabold text-[#630ed4] block leading-none">
                      {String(countdown.days).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold text-[#7b7487] uppercase tracking-wider">
                      Días
                    </span>
                  </div>
                  <span className="text-[18px] font-bold text-[#785a00]">:</span>

                  <div className="bg-white px-2.5 py-1.5 rounded-xl shadow-xs min-w-[52px] border border-[#eceef0]">
                    <span className="text-[18px] font-extrabold text-[#630ed4] block leading-none">
                      {String(countdown.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold text-[#7b7487] uppercase tracking-wider">
                      Horas
                    </span>
                  </div>
                  <span className="text-[18px] font-bold text-[#785a00]">:</span>

                  <div className="bg-white px-2.5 py-1.5 rounded-xl shadow-xs min-w-[52px] border border-[#eceef0]">
                    <span className="text-[18px] font-extrabold text-[#630ed4] block leading-none">
                      {String(countdown.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold text-[#7b7487] uppercase tracking-wider">
                      Min
                    </span>
                  </div>
                  <span className="text-[18px] font-bold text-[#785a00]">:</span>

                  <div className="bg-white px-2.5 py-1.5 rounded-xl shadow-xs min-w-[52px] border border-[#eceef0]">
                    <span className="text-[18px] font-extrabold text-[#630ed4] block leading-none">
                      {String(countdown.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold text-[#7b7487] uppercase tracking-wider">
                      Seg
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conditional: Feedback State OR RSVP Form */}
          {isSubmitted && submittedData ? (
            <div className="flex flex-col items-center text-center p-5 py-6 bg-[#f2f4f6] rounded-2xl border border-[#e0e3e5]">
              <div className="w-16 h-16 rounded-full bg-[#fdc425] text-[#6d5200] flex items-center justify-center mb-3 shadow-md animate-bounce">
                <span className="material-symbols-outlined text-[32px] fill-icon">check</span>
              </div>
              <h3 className="text-[20px] font-extrabold text-[#630ed4] mb-1">
                ¡Respuesta Recibida!
              </h3>
              <p className="text-[14px] text-[#4a4455] max-w-sm mb-4 leading-relaxed">
                {submittedData.status === 'confirmed' ? (
                  <>
                    <strong>¡Qué emoción, {submittedData.guestName}!</strong> Hemos registrado tu lugar para{' '}
                    <strong>{submittedData.guestCount} {submittedData.guestCount === 1 ? 'asistente' : 'asistentes'}</strong>. ¡Nos vemos muy pronto junto a Mathias y la Abejita! 🐝
                  </>
                ) : (
                  <>
                    <strong>Gracias por avisarnos, {submittedData.guestName}.</strong> Sentiremos mucho no verte, pero te tendremos muy presente en los deseos para Mathias. 💕
                  </>
                )}
              </p>

              {submittedData.notes && (
                <div className="bg-white/80 border border-[#e0e3e5] px-3.5 py-2 rounded-xl text-[13px] text-[#4a4455] italic mb-4 max-w-xs text-left w-full">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-[#7b7487] block not-italic">
                    Tu mensajito registrado:
                  </span>
                  "{submittedData.notes}"
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-xs">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2.5 px-4 rounded-full bg-white text-[#191c1e] font-bold text-[14px] shadow-xs hover:bg-[#eceef0] border border-[#ccc3d8] transition-colors active:scale-95"
                >
                  Modificar respuesta
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              {/* Guest Name Field */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="guest-name"
                  className="text-[14px] font-bold text-[#191c1e] flex items-center justify-between"
                >
                  <span>Nombre y Apellido del invitado(s)</span>
                  <span className="text-[12px] font-normal text-[#7b7487]">*Requerido</span>
                </label>
                <div className="relative">
                  <input
                    id="guest-name"
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Ej. Familia Rodríguez o Sofía Morales"
                    className="w-full bg-[#f2f4f6] px-4 py-3 pl-11 rounded-2xl text-[14px] text-[#191c1e] placeholder:text-[#7b7487] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#630ed4] transition-all border border-transparent focus:border-[#630ed4]"
                  />
                  <span className="material-symbols-outlined absolute left-3.5 top-3 text-[#7b7487] text-[20px]">
                    badge
                  </span>
                </div>
              </div>

              {/* Attendance Selector Chips */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-bold text-[#191c1e]">
                  ¿Nos acompañarás en el festejo?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Option 1: Yes */}
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setStatus('confirmed');
                    }}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer transition-all border-2 ${
                      status === 'confirmed'
                        ? 'bg-[#7c3aed] text-white border-[#7c3aed] shadow-md scale-[1.02]'
                        : 'bg-[#eceef0] text-[#4a4455] border-transparent hover:bg-[#e6e8ea]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`material-symbols-outlined text-[20px] ${status === 'confirmed' ? 'fill-icon' : ''}`}>
                        check_circle
                      </span>
                      <span className="font-extrabold text-[15px]">🐝 ¡Sí, voy!</span>
                    </div>
                    <span className={`text-[11px] mt-0.5 ${status === 'confirmed' ? 'text-white/90' : 'text-[#7b7487]'}`}>
                      ¡A cantar y zumbar!
                    </span>
                  </button>

                  {/* Option 2: No */}
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setStatus('declined');
                    }}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer transition-all border-2 ${
                      status === 'declined'
                        ? 'bg-[#2d3133] text-white border-[#2d3133] shadow-md scale-[1.02]'
                        : 'bg-[#eceef0] text-[#4a4455] border-transparent hover:bg-[#e6e8ea]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[20px]">
                        sentiment_dissatisfied
                      </span>
                      <span className="font-extrabold text-[15px]">😢 No podré ir</span>
                    </div>
                    <span className={`text-[11px] mt-0.5 ${status === 'declined' ? 'text-white/80' : 'text-[#7b7487]'}`}>
                      Te extrañaremos
                    </span>
                  </button>
                </div>
              </div>

              {/* Total Guests Stepper (Only when confirmed) */}
              {status === 'confirmed' && (
                <div className="bg-[#f2f4f6] p-3 rounded-2xl flex items-center justify-between border border-[#e0e3e5]/60 transition-all">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-[#191c1e]">Total de Asistentes</span>
                    <span className="text-[12px] text-[#4a4455]">Adultos y niños</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-full shadow-xs border border-[#e0e3e5]">
                    <button
                      type="button"
                      aria-label="Disminuir asistentes"
                      onClick={() => {
                        playPopSound();
                        setGuestCount((prev) => Math.max(1, prev - 1));
                      }}
                      className="w-8 h-8 rounded-full bg-[#eceef0] flex items-center justify-center text-[#191c1e] hover:bg-[#e6e8ea] active:scale-90 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <span className="text-[18px] font-extrabold text-[#630ed4] w-7 text-center">
                      {guestCount}
                    </span>
                    <button
                      type="button"
                      aria-label="Aumentar asistentes"
                      onClick={() => {
                        playPopSound();
                        setGuestCount((prev) => Math.min(12, prev + 1));
                      }}
                      className="w-8 h-8 rounded-full bg-[#630ed4] text-white flex items-center justify-center hover:bg-[#7c3aed] active:scale-90 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                </div>
              )}

              {webhookUrl && (
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 py-1 px-3 rounded-full border border-emerald-200 w-fit mx-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Sincronización activa con Google Sheets</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || countdown.isExpired}
                className="w-full py-4 px-6 rounded-2xl bg-[#630ed4] text-white font-bold text-[16px] shadow-lg shadow-[#630ed4]/25 hover:bg-[#7c3aed] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">
                      progress_activity
                    </span>
                    <span>Guardando respuesta...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px] fill-icon">send</span>
                    <span>Confirmar Asistencia</span>
                  </>
                )}
              </button>

              {/* Privacy / Security Notice */}
              <div className="flex items-center justify-center gap-1.5 text-center text-[12px] text-[#7b7487]">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>Tus datos son seguros y se compartirán únicamente con la familia de Mathias</span>
              </div>
            </form>
          )}
        </div>

        {/* Quick Actions Under Card: Location / Add to Calendar */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              playPopSound();
              onNavigateToLocation();
            }}
            className="inline-flex items-center gap-1.5 bg-white/90 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full font-bold text-[14px] text-[#630ed4] shadow-xs border border-[#ccc3d8]/50 hover:shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">map</span>
            Ver mapa de Inflakids
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setShowCalendarMenu(!showCalendarMenu);
              }}
              className="inline-flex items-center gap-1.5 bg-white/90 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full font-bold text-[14px] text-[#785a00] shadow-xs border border-[#ccc3d8]/50 hover:shadow-sm transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">event</span>
              <span>Agendar en Calendario</span>
              <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
            </button>

            {/* Dropdown for Calendar Options */}
            {showCalendarMenu && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 bg-white rounded-2xl shadow-xl border border-[#eceef0] p-1.5 z-30 flex flex-col gap-1 animate-fade-in">
                <button
                  type="button"
                  onClick={() => {
                    openGoogleCalendar();
                    setShowCalendarMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-[13px] font-bold text-[#191c1e] hover:bg-[#f2f4f6] flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-blue-600">calendar_today</span>
                  <span>Google Calendar</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    downloadICS();
                    setShowCalendarMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-[13px] font-bold text-[#191c1e] hover:bg-[#f2f4f6] flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-purple-600">download</span>
                  <span>Descargar archivo .ICS (Apple/Outlook)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
