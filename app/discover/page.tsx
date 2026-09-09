import { DiscoveryFlow } from '@/components/discovery/DiscoveryFlow';

export const metadata = {
  title: 'Discover Urge',
  description:
    'Find out whether Urge is right for where you are.',
};

export default function DiscoverPage() {
  return (
    <main className="min-h-screen px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <DiscoveryFlow />
      </div>
    </main>
  );
}