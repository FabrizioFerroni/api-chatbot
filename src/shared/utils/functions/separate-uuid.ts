export function separateUUIDUser(user_id: string): string {
  const userSeparateId: string[] = user_id.split('-');
  const lastSegment: string = userSeparateId[4];
  const lastFourChars: string = lastSegment.slice(-4);
  return `user_${lastFourChars}`;
}

export function separateUUIDTicket(
  nameFolder: string,
  ticket_id: string,
): string {
  const ticketSeparateId: string[] = ticket_id.split('-');
  const lastSegment: string = ticketSeparateId[4];
  const lastFourChars: string = lastSegment.slice(-4);
  return `${nameFolder}_${lastFourChars}`;
}
