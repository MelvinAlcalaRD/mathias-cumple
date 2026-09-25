import { RSVPResponse, WishMessage } from '../types.ts';

export const EVENT_DETAILS = {
  celebrant: 'Mathias',
  milestone: 'El 1er Añito de Mathias',
  theme: 'Abejita Chiquitita • Plin Plin',
  dateFormatted: 'Sáb, 17 Oct 2026',
  timeFormatted: '4:30 PM',
  venueName: 'Inflakids Parque Inflable',
  fullAddress: 'C. Dr. Teofilo Hernandez 18, La Romana 22000',
  googleMapsUrl: 'https://www.google.com/maps/dir/Inflakids+Parque+Inflable,+C.+Dr.+Teofilo+Hernandez+18,+La+Romana+22000/Inflakids+Parque+Inflable,+C.+Dr.+Teofilo+Hernandez+18,+La+Romana+22000/@18.4494822,-69.2996732,12z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x8eaf55e63a1bbecd:0x3a8f84762098addd!2m2!1d-68.9673391!2d18.419932!1m5!1m1!1s0x8eaf55e63a1bbecd:0x3a8f84762098addd!2m2!1d-68.9673391!2d18.419932?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D',
  wazeUrl: 'https://ul.waze.com/ul?from=place.ChIJzb4bOuZVr44R3a2YIHaEjzo&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location',
  deadlineDateText: '12 de Octubre a las 23:59 hs',
  abejitaImageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1UqexqYBtWLkUkd9xn4GYcQhCCxQjBUmf2f1dGdC7zLZoTeiZEw79QIQuF-I3p1SYyLuJzJvMDUoLSLJuWnUR8Yc_2l3lvOxBK_6wU6027INxeFoZaoEGdxnEeub2OLc62vUJkvDBg_KVSczPqN9AQaQ_i1wlQJsyvl0WbA6QXd13aIenXA27h9kl4HtyvhUfX_LUYaDZk6cG4ME96vGSQO1OonlPnh2HjNTNkrVSg20aLXM2aarV-LIg',
  contactPhone: '+54 9 11 4567-8910'
};

export const INITIAL_RSVPS: RSVPResponse[] = [
  {
    id: 'rsvp-1',
    guestName: 'Familia Morales González',
    status: 'confirmed',
    guestCount: 3,
    notes: '¡Qué hermosa invitación! Sin alergias alimentarias. ¡Llegaremos puntuales!',
    createdAt: '2024-10-02T14:30:00Z',
    isFamilyGuest: true
  },
  {
    id: 'rsvp-2',
    guestName: 'Tíos Carlos y Lucía',
    status: 'confirmed',
    guestCount: 2,
    notes: 'Menú sin TACC para Lucía por favor. ¡Estamos muy emocionados por ver al pequeño zumbar!',
    createdAt: '2024-10-03T10:15:00Z',
    isFamilyGuest: true
  },
  {
    id: 'rsvp-3',
    guestName: 'Mariana Benítez y Lucas',
    status: 'confirmed',
    guestCount: 2,
    notes: '¡Allí estaremos para celebrar con Mathias!',
    createdAt: '2024-10-04T18:40:00Z',
    isFamilyGuest: false
  },
  {
    id: 'rsvp-4',
    guestName: 'Sebastián Herrera',
    status: 'declined',
    guestCount: 0,
    notes: 'Lamentablemente estoy de viaje de trabajo ese fin de semana. ¡Les mando un abrazo enorme y muchos besos a Mathias!',
    createdAt: '2024-10-05T09:20:00Z',
    isFamilyGuest: false
  }
];

export const INITIAL_WISHES: WishMessage[] = [
  {
    id: 'wish-1',
    author: 'Abuelos Nélida y Roberto',
    relation: 'Abuelos de Mathias',
    message: '¡Feliz primer añito a la luz de nuestras vidas! Que la dulzura de la miel siempre acompañe tu sonrisita.',
    date: 'Hace 2 días',
    sticker: 'honey',
    likes: 12
  },
  {
    id: 'wish-2',
    author: 'Madrina Valentina',
    relation: 'Madrina',
    message: '¡A cantar y zumbar con Plin Plin y la Abejita! Te amo con todo mi corazón, Mathias chiquitito.',
    date: 'Hace 3 días',
    sticker: 'bee',
    likes: 9
  },
  {
    id: 'wish-3',
    author: 'Familia Morales',
    relation: 'Primos',
    message: '¡Los primos estamos listos con nuestras alas de abejita para bailar y jugar en el pelotero!',
    date: 'Ayer',
    sticker: 'cake',
    likes: 7
  }
];

export const TIMELINE_SCHEDULE = [
  {
    time: '4:30 PM',
    title: 'Bienvenida al Panal Dulce',
    description: 'Recepción de invitados, entrega de vinchas temáticas y mesa dulce de bienvenida.',
    icon: 'door_front'
  },
  {
    time: '5:15 PM',
    title: 'Show Musical Abejita & Plin Plin',
    description: 'Canciones en vivo, burbujas mágicas, coreografías y juegos con animadores infantiles.',
    icon: 'music_note'
  },
  {
    time: '6:00 PM',
    title: 'Merienda de los Zumbadores',
    description: 'Snacks saludables, jugos frutales, opciones aptas celíacos y delicias para grandes y chicos.',
    icon: 'restaurant'
  },
  {
    time: '6:45 PM',
    title: 'La Gran Piñata Mágica y Fotos',
    description: 'Momento para romper la piñata con sorpresas y sacarse fotos en el rincón escenográfico.',
    icon: 'celebration'
  },
  {
    time: '7:30 PM',
    title: '¡Que los cumplas feliz!',
    description: 'Soplamos la primera velita de Mathias junto a la torta temática y todos los seres queridos.',
    icon: 'cake'
  },
  {
    time: '8:15 PM',
    title: 'Souvenirs y Despedida',
    description: 'Entrega de las bolsitas de golosinas artesanales y recuerdos del 1er añito.',
    icon: 'redeem'
  }
];
