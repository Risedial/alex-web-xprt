import NewWebsiteForm from '@/components/forms/NewWebsiteForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Let's Build Your Website | Alex Web Xprt",
  description:
    "This takes about 10 minutes. Everything here helps me build the right site for your business — no back and forth needed.",
};

export default function NewWebsitePage() {
  return (
    <main>
      <NewWebsiteForm />
    </main>
  );
}
