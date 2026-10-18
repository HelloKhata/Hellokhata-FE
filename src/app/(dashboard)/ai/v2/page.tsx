import { V2InvoiceChat } from "../../../../components/ai/V2InvoiceChat";

export default function AiV2Page() {
  if (process.env.NEXT_PUBLIC_AI_V2_ENABLED !== "true")
    return (
      <main className="p-6">
        AI v2 preview is disabled. No AI request or transaction will be sent.
      </main>
    );
  return <V2InvoiceChat />;
}
