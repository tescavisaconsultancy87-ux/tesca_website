import { runInBackground } from './background';
import { getEnv } from './env';

export interface CRMInquiryPayload {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  countryPreference?: string;
  studyLevel?: string;
  gpaPercentage?: string;
  ieltsScore?: string;
  budget?: string;
  source?: string;
  notes?: string;
}

export function forwardInquiryToCRM(locals: unknown, payload: Record<string, any>): void {
  const crmUrl =
    getEnv('CRM_WEBHOOK_URL') ||
    import.meta.env.CRM_WEBHOOK_URL ||
    'https://portal.tescavisa.com/api/inquiries/webhook';

  runInBackground(
    locals,
    async () => {
      try {
        const res = await fetch(crmUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          console.warn(`[CRM Webhook] Webhook request to ${crmUrl} failed with status:`, res.status);
        } else {
          console.log(`[CRM Webhook] Inquiry successfully forwarded to CRM (${payload.fullName || payload.full_name})`);
        }
      } catch (err) {
        console.error('[CRM Webhook] Failed to deliver inquiry webhook to CRM:', err);
      }
    },
    'crm-inquiry-webhook'
  );
}
