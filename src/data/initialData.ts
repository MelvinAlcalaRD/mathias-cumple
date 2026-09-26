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

export const INITIAL_RSVPS: RSVPResponse[] = [];

export const INITIAL_WISHES: WishMessage[] = [];

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
