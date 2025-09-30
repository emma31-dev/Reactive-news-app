import { redirect } from 'next/navigation';

export default function SentimentPage() {
  // Preserve old /sentiment route by redirecting to the new /chart page
  redirect('/chart');
}
