import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RSVPResponse } from '../types.ts';
import { playCelebrationSound, playPopSound } from '../utils/audio.ts';

interface VIPInvitationCardProps {
  onRSVPSubmit: (rsvp: Omit<RSVPResponse, 'id' | 'createdAt'>) => Promise<boolean>;
  existingRSVP?: RSVPResponse;
  webhookUrl: string;
  onOpenSettings: () => void;
  rsvps?: RSVPResponse[];
}

export const VIPInvitationCard: React.FC<VIPInvitationCardProps> = ({
  onRSVPSubmit,
  existingRSVP,
  webhookUrl,
  onOpenSettings,
  rsvps = []
}) => {
  const [nombre, setNombre] = useState(existingRSVP?.guestName || '');
  const [asistencia, setAsistencia] = useState<'Sí, allí estaré' | 'No puedo ir'>(
    existingRSVP?.status === 'declined' ? 'No puedo ir' : 'Sí, allí estaré'
  );
  const [guestCount, setGuestCount] = useState(existingRSVP?.guestCount || 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!existingRSVP);
  const [showLiveList, setShowLiveList] = useState(false);
  const [showSupabaseConfig, setShowSupabaseConfig] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState('Calculando...');
  const [isExpired, setIsExpired] = useState(false);

  // Supabase credentials state con valores por defecto del proyecto
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('vip_supabase_url') || 'https://mfduvhniesverncvtudh.supabase.co/rest/v1/invitados');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(() => localStorage.getItem('vip_supabase_key') || 'sb_publishable_dVtRIkbVoyS2LhB2LUMuMQ_QgSDNhAP');
  const [savedDbNotice, setSavedDbNotice] = useState<string | null>(null);

  // Fecha límite exacta: Comienzo del Martes 13 de Octubre de 2026 (00:00:00)
  const fechaLimite = new Date('2026-10-13T00:00:00');

  useEffect(() => {
    function actualizarContador() {
      const ahora = new Date();
      const diferencia = fechaLimite.getTime() - ahora.getTime();

      if (diferencia <= 0) {
        setIsExpired(true);
        setTiempoRestante('0d 0h 0m');
        return;
      }

      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

      setTiempoRestante(`${dias}d ${horas}h ${minutos}m`);
    }

    actualizarContador();
    const interval = setInterval(actualizarContador, 1000);
    return () => clearInterval(interval);
  }, []);

  // Procesamos la lista de invitados de forma segura (sin innerHTML para evitar inyecciones XSS)
  let van = 0;
  let noVan = 0;
  const processedGuests = (rsvps || []).map((invitado) => {
    const estado = invitado.status === 'confirmed' ? 'Sí, allí estaré' : 'No puedo ir';
    if (estado === 'Sí, allí estaré') van++; else noVan++;
    const icono = estado === 'Sí, allí estaré' ? '✅' : '❌';
    return {
      id: invitado.id,
      nombre: invitado.guestName,
      estado,
      icono
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setIsSubmitting(true);
    playPopSound();

    const isConfirmed = asistencia === 'Sí, allí estaré';

    // Si hay credenciales de Supabase configuradas, enviamos directamente a la BD
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const resp = await fetch(supabaseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': 'Bearer ' + supabaseAnonKey,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ nombre: nombre.trim(), estado: asistencia })
        });
        if (!resp.ok) {
          console.warn('Supabase endpoint returned status:', resp.status);
        }
      } catch (err) {
        console.warn('Error al sincronizar con Supabase:', err);
      }
    }

    const success = await onRSVPSubmit({
      guestName: nombre.trim(),
      status: isConfirmed ? 'confirmed' : 'declined',
      guestCount: isConfirmed ? guestCount : 0,
      notes: isConfirmed ? 'Confirmado vía Invitación VIP' : 'No asiste vía Invitación VIP'
    });

    setIsSubmitting(false);
    if (success) {
      setSubmitted(true);
      if (isConfirmed) {
        playCelebrationSound();
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#4F46E5', '#6366F1', '#F59E0B', '#10B981']
          });
        } catch {
          // ignore
        }
      }
    } else {
      alert('Hubo un inconveniente al enviar los datos. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-8 px-4 flex flex-col justify-center animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center w-full relative">
        <div className="text-4xl mb-2">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">¡Estás Invitado!</h1>

        {/* Detalles del evento */}
        <p className="text-lg font-bold text-indigo-600 mb-1">
          Sábado 17 de Octubre • 4:30 PM
        </p>
        <p className="text-gray-500 mb-5 text-sm">
          Celebra con nosotros. Por favor confirma tu asistencia abajo.
        </p>

        {/* Sincronización Badge & Opciones */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {supabaseUrl && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Supabase Conectado</span>
              </div>
            )}
            {webhookUrl && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Google Sheets Conectado</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setShowSupabaseConfig(!showSupabaseConfig);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">database</span>
              <span>{supabaseUrl ? 'Configurar Supabase' : 'Conectar Supabase (Opcional)'}</span>
            </button>
          </div>

          {/* Configuración rápida Supabase */}
          {showSupabaseConfig && (
            <div className="mt-3 p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl text-left space-y-2.5 animate-fade-in text-xs">
              <div className="flex items-center justify-between font-bold text-indigo-900">
                <span>⚡ Conexión Directa a Supabase</span>
                <button
                  type="button"
                  onClick={() => setShowSupabaseConfig(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
              <p className="text-gray-600">
                Ingresa tu URL REST de Supabase (ej. <code>https://xyz.supabase.co/rest/v1/invitados</code>) y tu anon key:
              </p>
              <input
                type="url"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://TU_PROYECTO.supabase.co/rest/v1/invitados"
                className="w-full bg-white px-3 py-1.5 rounded-lg border border-indigo-200 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="TU_CLAVE_ANONIMA (anon key)"
                className="w-full bg-white px-3 py-1.5 rounded-lg border border-indigo-200 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    localStorage.setItem('vip_supabase_url', supabaseUrl.trim());
                    localStorage.setItem('vip_supabase_key', supabaseAnonKey.trim());
                    setSavedDbNotice('¡Credenciales guardadas con éxito!');
                    setTimeout(() => {
                      setSavedDbNotice(null);
                      setShowSupabaseConfig(false);
                    }, 1800);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 cursor-pointer"
                >
                  Guardar en navegador
                </button>
                {supabaseUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setSupabaseUrl('');
                      setSupabaseAnonKey('');
                      localStorage.removeItem('vip_supabase_url');
                      localStorage.removeItem('vip_supabase_key');
                    }}
                    className="px-3 py-1.5 bg-white text-red-600 border border-red-200 rounded-lg font-bold hover:bg-red-50 cursor-pointer"
                  >
                    Borrar
                  </button>
                )}
              </div>
              {savedDbNotice && (
                <div className="text-emerald-700 font-bold bg-emerald-50 p-1.5 rounded border border-emerald-200">
                  {savedDbNotice}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Caja del Contador */}
        {!isExpired && !submitted && (
          <div id="contadorContenedor" className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-xs text-yellow-800 font-medium mb-2">
              La confirmación finaliza el Lunes 12 de Octubre a las 12:00 AM (inicio del Martes 13).
            </p>
            <p className="text-sm font-bold text-yellow-700">
              ⏳ Tiempo restante: <span id="tiempoRestante" className="font-extrabold">{tiempoRestante}</span>
            </p>
          </div>
        )}

        {/* Mensaje si el plazo finalizó */}
        {isExpired && !submitted && (
          <div id="mensaje" className="mt-6 font-medium p-4 rounded-lg text-red-700 bg-red-50 block">
            El plazo para confirmar asistencia ha finalizado.
          </div>
        )}

        {/* Mensaje dinámico de éxito */}
        {submitted ? (
          <div id="mensaje" className="mt-6 font-medium p-4 rounded-lg text-green-700 bg-green-50 block space-y-2">
            <div className="text-lg font-bold">¡Gracias por confirmar! Tus datos fueron guardados.</div>
            <p className="text-xs text-green-800">
              Invitado: <strong>{nombre}</strong> ({asistencia === 'Sí, allí estaré' ? `Sí voy • ${guestCount} pers.` : 'No voy'})
            </p>
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setSubmitted(false);
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline mt-2 block mx-auto cursor-pointer"
            >
              Modificar confirmación
            </button>
          </div>
        ) : (
          !isExpired && (
            <form id="rsvpForm" onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <input
                  type="text"
                  id="nombre"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu Nombre Completo"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="asistencia"
                    value="Sí, allí estaré"
                    checked={asistencia === 'Sí, allí estaré'}
                    onChange={() => {
                      playPopSound();
                      setAsistencia('Sí, allí estaré');
                    }}
                    className="peer sr-only"
                    required
                  />
                  <div className="rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 transition font-medium text-center text-sm">
                    👍 Voy
                  </div>
                </label>

                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="asistencia"
                    value="No puedo ir"
                    checked={asistencia === 'No puedo ir'}
                    onChange={() => {
                      playPopSound();
                      setAsistencia('No puedo ir');
                    }}
                    className="peer sr-only"
                  />
                  <div className="rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:text-red-700 transition font-medium text-center text-sm">
                    👎 No voy
                  </div>
                </label>
              </div>

              {asistencia === 'Sí, allí estaré' && (
                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between border border-gray-200">
                  <span className="text-xs font-medium text-gray-600">Total de personas:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setGuestCount((c) => Math.max(1, c - 1));
                      }}
                      className="w-7 h-7 rounded-md bg-white border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-700 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="text-sm font-extrabold text-indigo-600 w-6 text-center">
                      {guestCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setGuestCount((c) => Math.min(10, c + 1));
                      }}
                      className="w-7 h-7 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-bold hover:bg-indigo-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                id="btnSubmit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg mt-6 hover:bg-indigo-700 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">
                      progress_activity
                    </span>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <span>Confirmar</span>
                )}
              </button>
            </form>
          )
        )}

        {/* Toggleable Safe Guest List Section */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              playPopSound();
              setShowLiveList(!showLiveList);
            }}
            className="w-full flex items-center justify-between text-xs font-bold text-gray-600 hover:text-indigo-600 transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>📋</span>
              <span>Lista de Respuestas ({processedGuests.length})</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-600 font-semibold">{van} van</span>
              <span className="text-gray-300">•</span>
              <span className="text-rose-500 font-semibold">{noVan} no van</span>
              <span className="material-symbols-outlined text-[16px]">
                {showLiveList ? 'expand_less' : 'expand_more'}
              </span>
            </span>
          </button>

          {showLiveList && (
            <div className="mt-3 text-left animate-fade-in">
              <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl text-[11px] font-semibold text-gray-500 mb-2 border border-gray-100">
                <span>🛡️ Renderizado seguro anti-inyecciones</span>
                <span>{van} confirmados</span>
              </div>
              <ul id="lista" className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
                {processedGuests.length === 0 ? (
                  <li className="py-3 text-center text-xs text-gray-400">
                    Aún no hay confirmaciones registradas.
                  </li>
                ) : (
                  processedGuests.map((invitado) => (
                    <li
                      key={invitado.id}
                      className="py-3 flex justify-between items-center"
                    >
                      <span className="font-medium text-gray-800 text-sm">
                        {invitado.nombre}
                      </span>
                      <span className="text-sm">{invitado.icono}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
