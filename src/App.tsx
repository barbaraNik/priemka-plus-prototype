import { useState } from 'react';
import type { Claim, DocType, Source } from '@/types';
import { SEED_CLAIMS } from '@/data/seedClaims';
import { getPacketProgress, todayIso } from '@/lib/checklist';
import AppSidebar from '@/components/AppSidebar';
import ClaimList from '@/components/ClaimList';
import ClaimDetails from '@/components/ClaimDetails';

function App() {
  const [claims, setClaims] = useState<Claim[]>(SEED_CLAIMS);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);

  const selectedClaim = claims.find((claim) => claim.number === selectedNumber) ?? null;

  const updateClaim = (number: string, update: (claim: Claim) => Claim) => {
    setClaims((prev) => prev.map((claim) => (claim.number === number ? update(claim) : claim)));
  };

  const renderContent = () => {
    if (!selectedClaim) {
      return <ClaimList claims={claims} onOpen={setSelectedNumber} />;
    }

    const number = selectedClaim.number;

    const handleUpload = (docType: DocType, file: File) => {
      const fileUrl = URL.createObjectURL(file);
      updateClaim(number, (claim) => ({
        ...claim,
        documents: claim.documents.map((doc) =>
          doc.type === docType ? { ...doc, status: 'present', fileName: file.name, fileUrl } : doc,
        ),
      }));
    };

    const handleRequest = (docType: DocType | null, target: Source) => {
      const requestedAt = todayIso();
      updateClaim(number, (claim) => {
        if (docType === null) {
          return { ...claim, compensationRequest: { from: target, requestedAt } };
        }
        return {
          ...claim,
          documents: claim.documents.map((doc) =>
            doc.type === docType ? { ...doc, status: 'requested', requestedFrom: target, requestedAt } : doc,
          ),
        };
      });
    };

    const handleCompensationChange = (text: string) => {
      updateClaim(number, (claim) => ({ ...claim, compensation: text }));
    };

    const handleMarkReady = () => {
      updateClaim(number, (claim) =>
        getPacketProgress(claim).canMarkReady ? { ...claim, readyAt: todayIso() } : claim,
      );
    };

    return (
      <ClaimDetails
        claim={selectedClaim}
        onBack={() => setSelectedNumber(null)}
        onUpload={handleUpload}
        onRequest={handleRequest}
        onCompensationChange={handleCompensationChange}
        onMarkReady={handleMarkReady}
      />
    );
  };

  return (
    <div className="min-h-screen text-slate-900 md:pl-64">
      <AppSidebar />
      <main className="min-h-screen">{renderContent()}</main>
    </div>
  );
}

export default App;
