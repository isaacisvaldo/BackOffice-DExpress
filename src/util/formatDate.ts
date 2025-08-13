

export const formatDate = (dateString: string | number | Date): string => {
  if (!dateString) {
    return '';
  }
  
  const date = new Date(dateString);

const dateFormatter = new Intl.DateTimeFormat("pt-PT", {
  day: 'numeric',      // Ex: 13
  month: 'long',       // Ex: Agosto
  year: 'numeric',     // Ex: 2025
  hour: '2-digit',     // Ex: 13
  minute: '2-digit',   // Ex: 35
  timeZone: 'UTC'
});



  const formattedDate = dateFormatter.format(date).replace(',', ' às');
  return formattedDate;
};