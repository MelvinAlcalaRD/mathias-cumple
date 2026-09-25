import React, { useState } from 'react';
import { WishMessage, RSVPResponse } from '../types.ts';
import { playPopSound, playCelebrationSound } from '../utils/audio.ts';

interface WishesWallProps {
  wishes: WishMessage[];
  onAddWish: (wish: Omit<WishMessage, 'id' | 'date' | 'likes'>) => void;
  rsvps: RSVPResponse[];
  onGoToInvitation: () => void;
}

export const WishesWall: React.FC<WishesWallProps> = ({
  wishes,
  onAddWish,
  rsvps,
  onGoToInvitation
}) => {
  const [author, setAuthor] = useState('');
  const [relation, setRelation] = useState('');
  const [message, setMessage] = useState('');
  const [selectedSticker, setSelectedSticker] = useState<WishMessage['sticker']>('bee');
  const [wishesList, setWishesList] = useState<WishMessage[]>(wishes);

  const confirmedGuests = rsvps.filter((r) => r.status === 'confirmed');
  const totalSeats = confirmedGuests.reduce((acc, curr) => acc + curr.guestCount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    playCelebrationSound();
    const newWish: WishMessage = {
      id: 'wish-' + Date.now(),
      author: author.trim(),
      relation: relation.trim() || 'Amigo de la Familia',
      message: message.trim(),
      date: 'Recién',
      sticker: selectedSticker,
      likes: 1
    };

    onAddWish({
      author: author.trim(),
      relation: relation.trim() || 'Amigo de la Familia',
      message: message.trim(),
      sticker: selectedSticker
    });

    setWishesList([newWish, ...wishesList]);
    setAuthor('');
    setRelation('');
    setMessage('');
  };

  const handleLike = (id: string) => {
    playPopSound();
    setWishesList((prev) =>
      prev.map((w) => (w.id === id ? { ...w, likes: w.likes + 1 } : w))
    );
  };

  const stickerIcons: Record<WishMessage['sticker'], { icon: string; label: string; bg: string }> = {
    bee: { icon: '🐝', label: 'Abejita', bg: 'bg-[#ffdf9a]' },
    honey: { icon: '🍯', label: 'Miel', bg: 'bg-[#ffe083]' },
    star: { icon: '⭐', label: 'Estrellita', bg: 'bg-[#fdc425]' },
    cake: { icon: '🎂', label: 'Torta', bg: 'bg-[#eaddff]' },
    heart: { icon: '💖', label: 'Amor', bg: 'bg-[#ffd8e4]' }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6 flex flex-col gap-8">
      {/* Top Banner */}
      <div className="text-center max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffdf9a] text-[#251a00] rounded-full font-bold text-[12px] shadow-xs mb-2">
          <span className="material-symbols-outlined text-[16px] text-[#785a00] fill-icon">volunteer_activism</span>
          Muro de Amor y Confirmaciones
        </span>
        <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#630ed4] tracking-tight">
          ¡A cantar y celebrar con Mathias!
        </h2>
        <p className="text-[14px] text-[#4a4455] mt-1">
          Ya son <strong>{totalSeats} zumbadores confirmados</strong> para la gran fiesta. ¡Deja tu dedicatoria especial!
        </p>
      </div>

      {/* Quick Attendance CTA Box */}
      <div className="bg-gradient-to-r from-[#630ed4] to-[#7c3aed] text-white rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-[26px]">how_to_reg</span>
          </div>
          <div>
            <h3 className="text-[18px] font-extrabold">¿Aún no confirmaste tu lugar?</h3>
            <p className="text-[13px] text-white/90">
              Recuerda confirmar antes del 12 de Octubre para que la Abejita reserve tu sorpresita.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            playPopSound();
            onGoToInvitation();
          }}
          className="whitespace-nowrap px-5 py-2.5 rounded-full bg-[#fdc425] hover:bg-[#ffdf9a] text-[#251a00] font-extrabold text-[14px] shadow-md transition-all active:scale-95 cursor-pointer"
        >
          Completar Asistencia
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form to leave a message */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-[#eceef0] h-fit">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#630ed4] text-[22px]">edit_note</span>
            <h3 className="text-[18px] font-extrabold text-[#191c1e]">Dejar un Deseo</h3>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="text-[12px] font-bold text-[#4a4455] uppercase tracking-wider block mb-1">
                Tu Nombre
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ej. Tía Vale o Padrino Leo"
                className="w-full bg-[#f2f4f6] px-3.5 py-2 rounded-xl text-[14px] text-[#191c1e] border border-transparent focus:border-[#630ed4] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#4a4455] uppercase tracking-wider block mb-1">
                Parentesco o Vínculo (Opcional)
              </label>
              <input
                type="text"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="Ej. Tía, Primo, Amiga de mamá..."
                className="w-full bg-[#f2f4f6] px-3.5 py-2 rounded-xl text-[14px] text-[#191c1e] border border-transparent focus:border-[#630ed4] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#4a4455] uppercase tracking-wider block mb-1">
                Sticker Temático
              </label>
              <div className="flex items-center gap-2">
                {(Object.keys(stickerIcons) as WishMessage['sticker'][]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setSelectedSticker(key);
                    }}
                    className={`w-10 h-10 rounded-xl text-[20px] flex items-center justify-center transition-all ${
                      selectedSticker === key
                        ? 'ring-2 ring-[#630ed4] scale-110 shadow-sm bg-white'
                        : 'bg-[#f2f4f6] hover:bg-[#e6e8ea]'
                    }`}
                  >
                    {stickerIcons[key].icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#4a4455] uppercase tracking-wider block mb-1">
                Mensaje para Mathias
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe aquí tu saludo lleno de dulzura..."
                className="w-full bg-[#f2f4f6] px-3.5 py-2 rounded-xl text-[14px] text-[#191c1e] border border-transparent focus:border-[#630ed4] focus:bg-white focus:outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#630ed4] text-white font-bold text-[14px] hover:bg-[#7c3aed] active:scale-95 shadow-md shadow-[#630ed4]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
            >
              <span className="material-symbols-outlined text-[18px]">favorite</span>
              <span>Publicar en el Muro</span>
            </button>
          </form>
        </div>

        {/* Wishes List */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[16px] font-extrabold text-[#191c1e] flex items-center gap-1.5">
              <span>Mensajitos de la Familia y Amigos</span>
              <span className="text-[12px] bg-[#eaddff] text-[#630ed4] px-2 py-0.5 rounded-full font-bold">
                {wishesList.length}
              </span>
            </span>
          </div>

          <div className="space-y-3">
            {wishesList.map((w) => (
              <div
                key={w.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-[#eceef0] hover:border-[#ffdf9a] transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#f2f4f6] flex items-center justify-center text-[22px] shadow-xs">
                      {stickerIcons[w.sticker]?.icon || '🐝'}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-extrabold text-[#191c1e] leading-tight">
                        {w.author}
                      </h4>
                      <span className="text-[11px] font-bold text-[#785a00] bg-[#ffdf9a]/40 px-2 py-0.2 rounded-full">
                        {w.relation}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#7b7487]">{w.date}</span>
                </div>

                <p className="text-[13px] text-[#4a4455] leading-relaxed pl-12 pr-2">
                  "{w.message}"
                </p>

                <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-[#f2f4f6]">
                  <button
                    onClick={() => handleLike(w.id)}
                    className="inline-flex items-center gap-1 text-[12px] font-bold text-[#630ed4] hover:bg-[#eaddff]/40 px-2.5 py-1 rounded-full transition-colors active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[15px] text-red-500 fill-icon">
                      favorite
                    </span>
                    <span>{w.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
