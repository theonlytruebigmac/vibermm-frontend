import { PatchProvider } from '@/contexts/patch';

export default function PatchManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PatchProvider>
      <section className="flex flex-col flex-1 overflow-hidden">
        {children}
      </section>
    </PatchProvider>
  );
}
