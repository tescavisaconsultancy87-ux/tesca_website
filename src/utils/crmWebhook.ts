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

export function forwardInquiryToCRM(locals: unknown, payload: CRMInquiryPayload): void {
  const crmUrl =
    getEnv('CRM_WEBHOOK_URL') ||
    import.meta.env.CRM_WEBHOOK_URL ||
    'https://tesca-workflow.vercel.app/api/inquiries/webhook';

  runInBackground(
    locals,
    async () => {
      try {
        const res = await fetch(crmUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: payload.fullName || 'Anonymous Website Visitor',
            email: payload.email || 'not_provided@website.com',
            phone: payload.phone || 'N/A',
            country_preference: payload.countryPreference || 'Canada',
            study_level: payload.studyLevel || "Bachelor's Degree",
            gpa_percentage: payload.gpaPercentage || '75%',
            ielts_score: payload.ieltsScore || 'Not Taken',
            budget: payload.budget || '$20,000 - $30,000 CAD',
            source: payload.source || 'TESCA Official Website',
            notes: payload.notes || 'Inquiry registered from website form.',
          }),
        });

        if (!res.ok) {
          console.warn(`[CRM Webhook] Webhook request to ${crmUrl} failed with status:`, res.status);
        } else {
          console.log(`[CRM Webhook] Inquiry successfully forwarded to CRM (${payload.fullName})`);
        }
      } catch (err) {
        console.error('[CRM Webhook] Failed to deliver inquiry webhook to CRM:', err);
      }
    },
    'crm-inquiry-webhook'
  );
}
