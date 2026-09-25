export interface RSVPResponse {
  id: string;
  guestName: string;
  status: 'confirmed' | 'declined';
  guestCount: number;
  notes?: string;
  createdAt: string;
  isFamilyGuest?: boolean;
}

export interface WishMessage {
  id: string;
  author: string;
  relation: string;
  message: string;
  date: string;
  sticker: 'bee' | 'honey' | 'star' | 'cake' | 'heart';
  likes: number;
}

export type ActiveTab = 'invitacion' | 'vip' | 'asistencia' | 'ubicacion';
