export function downloadICS() {
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cumpleanos Mathias//Abejita Chiquitita//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'SUMMARY:🐝 1er Añito de Mathias (Abejita Chiquitita y Plin Plin)',
    'DESCRIPTION:¡Acompáñanos a cantar, reír y zumbar de felicidad celebrando el 1er añito de Mathias! Temática: Abejita Chiquitita y Plin Plin.',
    'LOCATION:Inflakids Parque Inflable, C. Dr. Teofilo Hernandez 18, La Romana 22000',
    'DTSTART:20261017T163000',
    'DTEND:20261017T203000',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Cumpleanos_Mathias_1er_Anito.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function openGoogleCalendar() {
  const title = encodeURIComponent('🐝 1er Añito de Mathias (Abejita Chiquitita y Plin Plin)');
  const details = encodeURIComponent('¡Acompáñanos a cantar, reír y zumbar de felicidad celebrando el primer añito de Mathias en Inflakids Parque Inflable! Habrá show infantil, sorpresas y torta mágica.');
  const location = encodeURIComponent('Inflakids Parque Inflable, C. Dr. Teofilo Hernandez 18, La Romana 22000');
  // Date format YYYYMMDDTHHMMSS
  const dates = '20261017T163000/20261017T203000';
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  window.open(url, '_blank');
}
