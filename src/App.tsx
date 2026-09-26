import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { InvitationCard } from './components/InvitationCard.tsx';
import { VIPInvitationCard } from './components/VIPInvitationCard.tsx';
import { LocationView } from './components/LocationView.tsx';
import { WishesWall } from './components/WishesWall.tsx';
import { OrganizerModal } from './components/OrganizerModal.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { Footer } from './components/Footer.tsx';
import { ActiveTab, RSVPResponse, WishMessage } from './types.ts';
import { INITIAL_RSVPS, INITIAL_WISHES } from './data/initialData.ts';
import { playPopSound } from './utils/audio.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('invitacion');
  const [isOrganizerOpen, setIsOrganizerOpen] = useState(false);

  // Google Apps Script Webhook URL persisted
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('mathias_google_apps_script_url') || '';
    } catch {
      return '';
    }
  });

  const handleSaveWebhookUrl = (url: string) => {
    setWebhookUrl(url);
    try {
      localStorage.setItem('mathias_google_apps_script_url', url);
    } catch {
      // ignore
    }
  };

  // Local storage backed state
  const [rsvps, setRsvps] = useState<RSVPResponse[]>(() => {
    try {
      const stored = localStorage.getItem('mathias_cumple_rsvps');
      return stored ? JSON.parse(stored) : INITIAL_RSVPS;
    } catch {
      return INITIAL_RSVPS;
    }
  });

  const [wishes, setWishes] = useState<WishMessage[]>(() => {
    try {
      const stored = localStorage.getItem('mathias_cumple_wishes');
      return stored ? JSON.parse(stored) : INITIAL_WISHES;
    } catch {
      return INITIAL_WISHES;
    }
  });

  const [currentUserRSVP, setCurrentUserRSVP] = useState<RSVPResponse | undefined>(() => {
    try {
      const stored = localStorage.getItem('mathias_user_rsvp');
      return stored ? JSON.parse(stored) : undefined;
    } catch {
      return undefined;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mathias_cumple_rsvps', JSON.stringify(rsvps));
    } catch (e) {
      console.error(e);
    }
  }, [rsvps]);

  useEffect(() => {
    try {
      localStorage.setItem('mathias_cumple_wishes', JSON.stringify(wishes));
    } catch (e) {
      console.error(e);
    }
  }, [wishes]);

  // Enlace oculto independiente para abrir el Panel de Administración / Familia
  // Funciona con ?admin, ?panel, #admin, o #panel
  useEffect(() => {
    const checkHiddenAdminTrigger = () => {
      const search = window.location.search;
      const hash = window.location.hash;
      if (
        search.includes('admin') ||
        search.includes('panel') ||
        hash === '#admin' ||
        hash === '#panel'
      ) {
        setIsOrganizerOpen(true);
      }
    };
    checkHiddenAdminTrigger();
    window.addEventListener('popstate', checkHiddenAdminTrigger);
    window.addEventListener('hashchange', checkHiddenAdminTrigger);
    return () => {
      window.removeEventListener('popstate', checkHiddenAdminTrigger);
      window.removeEventListener('hashchange', checkHiddenAdminTrigger);
    };
  }, []);

  const handleRSVPSubmit = async (newRSVPData: Omit<RSVPResponse, 'id' | 'createdAt'>): Promise<boolean> => {
    const created: RSVPResponse = {
      ...newRSVPData,
      id: 'rsvp-' + Date.now(),
      createdAt: new Date().toISOString()
    };

    // Sincronización automática con Supabase
    try {
      await fetch('https://mfduvhniesverncvtudh.supabase.co/rest/v1/invitados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'sb_publishable_dVtRIkbVoyS2LhB2LUMuMQ_QgSDNhAP',
          'Authorization': 'Bearer sb_publishable_dVtRIkbVoyS2LhB2LUMuMQ_QgSDNhAP',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          nombre: newRSVPData.guestName,
          estado: newRSVPData.status === 'confirmed' ? 'Sí, allí estaré' : 'No puedo ir',
          guestCount: newRSVPData.status === 'confirmed' ? newRSVPData.guestCount : 0
        })
      });
    } catch (err) {
      console.warn('Supabase auto-sync notice:', err);
    }

    // If Google Apps Script webhook is configured, post to it
    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          body: JSON.stringify({
            nombre: newRSVPData.guestName,
            asistencia: newRSVPData.status === 'confirmed' ? 'Sí, allí estaré' : 'No puedo ir',
            cantidad: newRSVPData.guestCount,
            notas: newRSVPData.notes || '',
            fecha: new Date().toLocaleString()
          }),
          headers: { 'Content-Type': 'text/plain;charset=utf-8' }
        });
      } catch (err) {
        console.warn('Webhook post notice:', err);
      }
    }

    setRsvps((prev) => {
      const existingIdx = prev.findIndex(
        (r) => r.guestName.toLowerCase() === newRSVPData.guestName.toLowerCase()
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = created;
        return copy;
      }
      return [created, ...prev];
    });

    setCurrentUserRSVP(created);
    try {
      localStorage.setItem('mathias_user_rsvp', JSON.stringify(created));
    } catch {
      // Ignore
    }

    // Seed into wishes wall if notes are provided
    if (newRSVPData.notes && newRSVPData.notes.trim().length > 0) {
      const autoWish: WishMessage = {
        id: 'wish-auto-' + Date.now(),
        author: newRSVPData.guestName,
        relation: newRSVPData.status === 'confirmed' ? 'Confirmado 🎉' : 'Saludos con amor 💕',
        message: newRSVPData.notes.trim(),
        date: 'Recién',
        sticker: newRSVPData.status === 'confirmed' ? 'bee' : 'heart',
        likes: 1
      };
      setWishes((w) => [autoWish, ...w]);
    }

    return true;
  };

  const handleAddManualRSVP = (newRSVPData: Omit<RSVPResponse, 'id' | 'createdAt'>) => {
    const created: RSVPResponse = {
      ...newRSVPData,
      id: 'rsvp-manual-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setRsvps((prev) => [created, ...prev]);
  };

  const handleDeleteRSVP = (id: string) => {
    setRsvps((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddWish = (wishData: Omit<WishMessage, 'id' | 'date' | 'likes'>) => {
    const newWish: WishMessage = {
      ...wishData,
      id: 'wish-' + Date.now(),
      date: 'Recién',
      likes: 1
    };
    setWishes((prev) => [newWish, ...prev]);
  };

  return (
    <div className="bg-[#f7f9fb] min-h-screen flex flex-col antialiased text-[#191c1e] relative selection:bg-[#ffdf9a] selection:text-[#6d5200]">
      {/* Sticky App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenOrganizer={() => setIsOrganizerOpen(true)}
        rsvpCount={rsvps.filter((r) => r.status === 'confirmed').length}
      />

      {/* Main Content Sections */}
      <main className="w-full pt-16 flex-1 flex flex-col">
        {activeTab === 'invitacion' && (
          <InvitationCard
            onRSVPSubmit={handleRSVPSubmit}
            onNavigateToLocation={() => {
              playPopSound();
              setActiveTab('ubicacion');
            }}
            existingRSVP={currentUserRSVP}
            webhookUrl={webhookUrl}
          />
        )}

        {activeTab === 'vip' && (
          <VIPInvitationCard
            onRSVPSubmit={handleRSVPSubmit}
            existingRSVP={currentUserRSVP}
            webhookUrl={webhookUrl}
            onOpenSettings={() => setIsOrganizerOpen(true)}
            rsvps={rsvps}
          />
        )}

        {activeTab === 'asistencia' && (
          <WishesWall
            wishes={wishes}
            onAddWish={handleAddWish}
            rsvps={rsvps}
            onGoToInvitation={() => {
              playPopSound();
              setActiveTab('invitacion');
            }}
          />
        )}

        {activeTab === 'ubicacion' && <LocationView />}
      </main>

      {/* Offline Status Bar */}
      <OfflineIndicator />

      {/* App Footer con acceso oculto */}
      <Footer onOpenOrganizer={() => setIsOrganizerOpen(true)} />

      {/* Organizer / Family Admin Modal */}
      <OrganizerModal
        isOpen={isOrganizerOpen}
        onClose={() => setIsOrganizerOpen(false)}
        rsvps={rsvps}
        onAddRSVP={handleAddManualRSVP}
        onDeleteRSVP={handleDeleteRSVP}
        webhookUrl={webhookUrl}
        onSaveWebhookUrl={handleSaveWebhookUrl}
      />
    </div>
  );
}
