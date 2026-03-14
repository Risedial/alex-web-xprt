import type { Metadata } from 'next';
import WebsiteRefreshForm from '@/components/forms/WebsiteRefreshForm';

export const metadata: Metadata = {
  title: "Let's Refresh Your Website | Alex Web Xprt",
  description: 'Takes about 10 minutes. The more detail you share, the faster I can get started.',
};

export default function WebsiteRefreshPage() {
  return (
    <main>
      <WebsiteRefreshForm />
    </main>
  );
}
