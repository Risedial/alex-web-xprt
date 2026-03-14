import OneOffFixForm from '@/components/forms/OneOffFixForm';

export const metadata = {
  title: 'Tell Me What Needs Fixing | Alex Web Xprt',
  description: "Be as specific as you can — I'll send you a quote before any work starts.",
};

export default function OneOffFixPage() {
  return (
    <main>
      <OneOffFixForm />
    </main>
  );
}
