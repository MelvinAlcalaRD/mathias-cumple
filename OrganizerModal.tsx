import React, { useState } from 'react';
import { RSVPResponse } from '../types.ts';
import { playPopSound } from '../utils/audio.ts';

interface OrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  rsvps: RSVPResponse[];
  onAddRSVP: (rsvp: Omit<RSVPResponse, 'id' | 'createdAt'>) => void;
  onDeleteRSVP: (id: string) => void;
  webhookUrl: string;
  onSaveWebhookUrl: (url: string) => void;
}

export const OrganizerModal: React.FC<OrganizerModalProps> = ({
  isOpen,
  onClose,
  rsvps,
  onAddRSVP,
  onDeleteRSVP,
  webhookUrl,
  onSaveWebhookUrl
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'confirmed' | 'declined' | 'notes'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showWebhookConfig, setShowWebhookConfig] = useState(false);
  const [tempWebhookUrl, setTempWebhookUrl] = useState(webhookUrl);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedAntiXSS, setCopiedAntiXSS] = useState(false);
  const [testWebhookStatus, setTestWebhookStatus] = useState<string | null>(null);

  // New guest manual fields
  const [newGuestName, setNewGuestName] = useState('');
  const [newStatus, setNewStatus] = useState<'confirmed' | 'declined'>('confirmed');
  const [newCount, setNewCount] = useState(1);
  const [newNotes, setNewNotes] = useState('');

  if (!isOpen) return null;

  const confirmedList = rsvps.filter((r) => r.status === 'confirmed');
  const declinedList = rsvps.filter((r) => r.status === 'declined');
  const totalSeats = confirmedList.reduce((acc, curr) => acc + curr.guestCount, 0);
  const withNotes = rsvps.filter((r) => r.notes && r.notes.trim().length > 0);

  const filteredRSVPs = rsvps.filter((item) => {
    const matchesSearch = item.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterType === 'confirmed') return item.status === 'confirmed';
    if (filterType === 'declined') return item.status === 'declined';
    if (filterType === 'notes') return Boolean(item.notes && item.notes.trim().length > 0);
    return true;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    onAddRSVP({
      guestName: newGuestName.trim(),
      status: newStatus,
      guestCount: newStatus === 'confirmed' ? newCount : 0,
      notes: newNotes.trim(),
      isFamilyGuest: true
    });

    setNewGuestName('');
    setNewCount(1);
    setNewNotes('');
    setShowAddForm(false);
    playPopSound();
  };

  const handleCopyWhatsApp = () => {
    playPopSound();
    const confirmedLines = confirmedList
      .map((r, i) => `${i + 1}. *${r.guestName}* (${r.guestCount} p.) ${r.notes ? `\n   ↳ _${r.notes}_` : ''}`)
      .join('\n');

    const declinedLines = declinedList.length > 0
      ? `\n\n❌ *No asisten (${declinedList.length}):*\n` + declinedList.map(r => `• ${r.guestName}`).join('\n')
      : '';

    const summary = `🐝 *LISTA DE CONFIRMADOS - 1er Añito de Mathias* 🎉\n` +
      `📅 Fecha: Sábado 17 de Octubre 2026 4:30 PM\n` +
      `📍 Inflakids Parque Inflable\n` +
      `📌 Dirección: C. Dr. Teofilo Hernandez 18, La Romana\n\n` +
      `👥 *Total Asistentes:* ${totalSeats} personas\n` +
      `✅ *Familias Confirmadas:* ${confirmedList.length}\n\n` +
      `📝 *Detalle de Invitados:*\n${confirmedLines}${declinedLines}\n\n` +
      `_Actualizado desde la App Mathias Cumple_`;

    navigator.clipboard?.writeText(summary);
    setCopiedWhatsapp(true);
    setTimeout(() => setCopiedWhatsapp(false), 2500);
  };

  const handleExportCSV = () => {
    playPopSound();
    const headers = ['Nombre', 'Estado', 'Asistentes', 'Mensaje/Alergias', 'Fecha'];
    const rows = rsvps.map((r) => [
      `"${r.guestName.replace(/"/g, '""')}"`,
      r.status === 'confirmed' ? 'Confirmado' : 'No asistirá',
      r.guestCount,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      `"${r.createdAt}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Invitados_Cumple_Mathias_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-[#eceef0] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-[#f7f9fb] border-b border-[#eceef0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#630ed4] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
            </div>
            <div>
              <h2 className="text-[18px] font-extrabold text-[#191c1e] leading-tight">
                Panel de la Familia de Mathias
              </h2>
              <p className="text-[12px] text-[#7b7487]">
                Control en tiempo real de cupos y confirmaciones del panal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#e6e8ea] hover:bg-[#d8dadc] text-[#191c1e] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-[#eaddff]/40 p-3 rounded-2xl border border-[#ccc3d8]/40">
              <span className="text-[11px] font-bold text-[#630ed4] uppercase block">Total Personas</span>
              <span className="text-[26px] font-extrabold text-[#630ed4]">{totalSeats}</span>
              <span className="text-[11px] text-[#7b7487] block">Asistentes previstos</span>
            </div>

            <div className="bg-[#ffdf9a]/40 p-3 rounded-2xl border border-[#f7be1d]/40">
              <span className="text-[11px] font-bold text-[#785a00] uppercase block">Confirmados</span>
              <span className="text-[26px] font-extrabold text-[#785a00]">{confirmedList.length}</span>
              <span className="text-[11px] text-[#7b7487] block">Grupos / familias</span>
            </div>

            <div className="bg-[#f2f4f6] p-3 rounded-2xl border border-[#e0e3e5]">
              <span className="text-[11px] font-bold text-[#7b7487] uppercase block">No Asisten</span>
              <span className="text-[26px] font-extrabold text-[#191c1e]">{declinedList.length}</span>
              <span className="text-[11px] text-[#7b7487] block">Avisaron ausencia</span>
            </div>

            <div className="bg-[#ffe083]/30 p-3 rounded-2xl border border-[#eec200]/40">
              <span className="text-[11px] font-bold text-[#735c00] uppercase block">Notas / Dietas</span>
              <span className="text-[26px] font-extrabold text-[#735c00]">{withNotes.length}</span>
              <span className="text-[11px] text-[#7b7487] block">Con observaciones</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyWhatsApp}
                className="px-3.5 py-1.5 rounded-full bg-[#10b981] hover:bg-[#059669] text-white text-[13px] font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>{copiedWhatsapp ? '¡Copiado para WhatsApp!' : 'Copiar Resumen WhatsApp'}</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-1.5 rounded-full bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#191c1e] text-[13px] font-bold flex items-center gap-1.5 border border-[#ccc3d8] transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Exportar Excel / CSV</span>
              </button>

              <a
                href="/panel.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[13px] font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                <span>Abrir panel.html (Supabase)</span>
              </a>

              <button
                onClick={() => {
                  playPopSound();
                  setShowWebhookConfig(!showWebhookConfig);
                }}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                  webhookUrl
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">table_chart</span>
                <span>{webhookUrl ? 'Google Sheets (Activo)' : 'Conectar Google Sheets'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                playPopSound();
                setShowAddForm(!showAddForm);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#630ed4] text-white text-[13px] font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#7c3aed] transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">
                {showAddForm ? 'close' : 'person_add'}
              </span>
              <span>{showAddForm ? 'Cancelar' : 'Agregar Manual'}</span>
            </button>
          </div>

          {/* Google Sheets / Apps Script Webhook Configuration Panel */}
          {showWebhookConfig && (
            <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-3 animate-fade-in text-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600 text-[22px]">integration_instructions</span>
                  <h4 className="text-[14px] font-extrabold text-indigo-900">
                    Sincronización con Google Sheets (Google Apps Script)
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWebhookConfig(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Pega la URL de tu Web App de Google Apps Script. Cada vez que un invitado confirme o decline, se enviará automáticamente una fila a tu hoja de cálculo.
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={tempWebhookUrl}
                  onChange={(e) => setTempWebhookUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 bg-white px-3.5 py-2 rounded-xl border border-indigo-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    onSaveWebhookUrl(tempWebhookUrl.trim());
                    setTestWebhookStatus('¡URL guardada correctamente!');
                    setTimeout(() => setTestWebhookStatus(null), 3000);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
                >
                  Guardar URL
                </button>
                {tempWebhookUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setTempWebhookUrl('');
                      onSaveWebhookUrl('');
                    }}
                    className="px-3 py-2 bg-white text-red-600 rounded-xl text-xs font-bold border border-red-200 hover:bg-red-50"
                  >
                    Desconectar
                  </button>
                )}
              </div>

              {testWebhookStatus && (
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  {testWebhookStatus}
                </div>
              )}

              {/* Instructions & Ready Script Accordion */}
              <div className="bg-white p-3 rounded-xl border border-indigo-200/80 text-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between font-bold text-gray-700 gap-2">
                  <span>¿Cómo obtener la URL en 3 pasos?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound();
                        const scriptCode = `function doPost(e) {\n  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();\n  var data = JSON.parse(e.postData.contents);\n  sheet.appendRow([\n    new Date(),\n    data.nombre || '',\n    data.asistencia || '',\n    data.cantidad || 1,\n    data.notas || ''\n  ]);\n  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))\n    .setMimeType(ContentService.MimeType.JSON);\n}`;
                        navigator.clipboard?.writeText(scriptCode);
                        setCopiedScript(true);
                        setTimeout(() => setCopiedScript(false), 2500);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">content_copy</span>
                      <span>{copiedScript ? '¡Script Copiado!' : 'Copiar Script Google'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playPopSound();
                        const antiXssCode = `// Renderizado seguro en lugar de innerHTML directo (bloquea inyecciones XSS):\ndata.forEach(invitado => {\n    if (invitado.estado === 'Sí, allí estaré') van++; else noVan++;\n    \n    const icono = invitado.estado === 'Sí, allí estaré' ? '✅' : '❌';\n    \n    // Creamos el elemento de lista de manera segura\n    const li = document.createElement('li');\n    li.className = "py-3 flex justify-between items-center";\n    \n    const spanNombre = document.createElement('span');\n    spanNombre.className = "font-medium text-gray-800";\n    spanNombre.textContent = invitado.nombre; // <-- ESTO BLOQUEA CUALQUIER INYECCIÓN\n    \n    const spanIcono = document.createElement('span');\n    spanIcono.className = "text-sm";\n    spanIcono.textContent = icono;\n    \n    li.appendChild(spanNombre);\n    li.appendChild(spanIcono);\n    lista.appendChild(li);\n});`;
                        navigator.clipboard?.writeText(antiXssCode);
                        setCopiedAntiXSS(true);
                        setTimeout(() => setCopiedAntiXSS(false), 2500);
                      }}
                      className="text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md font-bold flex items-center gap-1 cursor-pointer border border-emerald-200"
                    >
                      <span className="material-symbols-outlined text-[14px]">security</span>
                      <span>{copiedAntiXSS ? '¡Anti-XSS Copiado!' : 'Copiar JS Seguro (Anti-XSS)'}</span>
                    </button>
                  </div>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-gray-600">
                  <li>En tu Google Sheet, ve a <strong>Extensiones &gt; Apps Script</strong>.</li>
                  <li>Pega el código copiado con el botón de arriba y presiona <strong>Guardar</strong>.</li>
                  <li>Haz clic en <strong>Implementar &gt; Nueva implementación &gt; Tipo: Aplicación web</strong>, selecciona <em>Acceso: Cualquier usuario (Anyone)</em> y copia la URL generada.</li>
                </ol>
              </div>
            </div>
          )}

          {/* Manual Add Form */}
          {showAddForm && (
            <form
              onSubmit={handleManualSubmit}
              className="p-4 bg-[#f7f9fb] rounded-2xl border border-[#e0e3e5] space-y-3 animate-fade-in"
            >
              <h4 className="text-[14px] font-extrabold text-[#191c1e]">
                Registrar Invitado Manualmente
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#7b7487] block mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    placeholder="Ej. Tío Roberto"
                    className="w-full bg-white px-3 py-1.5 rounded-xl border border-[#ccc3d8] text-[13px]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#7b7487] block mb-1">Respuesta</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as 'confirmed' | 'declined')}
                    className="w-full bg-white px-3 py-1.5 rounded-xl border border-[#ccc3d8] text-[13px]"
                  >
                    <option value="confirmed">Confirmado (Asiste)</option>
                    <option value="declined">No Asiste</option>
                  </select>
                </div>
              </div>

              {newStatus === 'confirmed' && (
                <div>
                  <label className="text-[11px] font-bold text-[#7b7487] block mb-1">Cantidad de Personas</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={newCount}
                    onChange={(e) => setNewCount(parseInt(e.target.value, 10) || 1)}
                    className="w-24 bg-white px-3 py-1.5 rounded-xl border border-[#ccc3d8] text-[13px]"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-[#7b7487] block mb-1">Nota o Alergia</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ej. Lleva regalo especial / Celíaco"
                  className="w-full bg-white px-3 py-1.5 rounded-xl border border-[#ccc3d8] text-[13px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#630ed4] text-white rounded-full text-[13px] font-bold hover:bg-[#7c3aed]"
                >
                  Guardar en la lista
                </button>
              </div>
            </form>
          )}

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o nota..."
                className="w-full bg-[#f2f4f6] pl-9 pr-4 py-2 rounded-xl text-[13px] border border-transparent focus:border-[#630ed4] focus:bg-white focus:outline-none"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#7b7487] text-[18px]">
                search
              </span>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                  filterType === 'all' ? 'bg-[#191c1e] text-white' : 'bg-[#f2f4f6] text-[#4a4455]'
                }`}
              >
                Todos ({rsvps.length})
              </button>
              <button
                onClick={() => setFilterType('confirmed')}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                  filterType === 'confirmed' ? 'bg-[#630ed4] text-white' : 'bg-[#f2f4f6] text-[#4a4455]'
                }`}
              >
                Confirmados ({confirmedList.length})
              </button>
              <button
                onClick={() => setFilterType('declined')}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                  filterType === 'declined' ? 'bg-[#ba1a1a] text-white' : 'bg-[#f2f4f6] text-[#4a4455]'
                }`}
              >
                No ({declinedList.length})
              </button>
              <button
                onClick={() => setFilterType('notes')}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                  filterType === 'notes' ? 'bg-[#785a00] text-white' : 'bg-[#f2f4f6] text-[#4a4455]'
                }`}
              >
                Notas ({withNotes.length})
              </button>
            </div>
          </div>

          {/* RSVPs Table / Cards */}
          <div className="space-y-2">
            {filteredRSVPs.length === 0 ? (
              <div className="p-8 text-center text-[#7b7487] bg-[#f7f9fb] rounded-2xl">
                No se encontraron respuestas con esos filtros.
              </div>
            ) : (
              filteredRSVPs.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#f7f9fb] hover:bg-[#eceef0] rounded-2xl border border-[#e0e3e5] flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-extrabold ${
                        item.status === 'confirmed' ? 'bg-[#10b981]' : 'bg-[#ba1a1a]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {item.status === 'confirmed' ? 'check' : 'close'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-[14px] font-extrabold text-[#191c1e]">
                          {item.guestName}
                        </h4>
                        {item.status === 'confirmed' && (
                          <span className="bg-[#eaddff] text-[#630ed4] px-2 py-0.2 rounded-full font-bold text-[11px]">
                            {item.guestCount} {item.guestCount === 1 ? 'persona' : 'personas'}
                          </span>
                        )}
                      </div>

                      {item.notes && (
                        <p className="text-[12px] text-[#785a00] bg-[#ffdf9a]/40 px-2 py-0.5 rounded-md mt-1 italic inline-block">
                          "{item.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        playPopSound();
                        onDeleteRSVP(item.id);
                      }}
                      title="Eliminar de la lista"
                      className="w-8 h-8 rounded-full hover:bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
