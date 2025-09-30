// Simple hash function for consistent projectId from email
export function hashEmail(email: string): string {
  // DJB2 hash
  let hash = 5381;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) + hash) + email.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'proj_' + Math.abs(hash).toString(36);
}
