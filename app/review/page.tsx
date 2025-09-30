import { redirect } from 'next/navigation';

export default function ReviewPage() {
  // Redirect old /review route to the consolidated profile page
  redirect('/profile');
}
