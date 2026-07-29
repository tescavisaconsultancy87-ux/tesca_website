import { getEnv } from './env';

export async function forwardInquiryToCRM(payload: Record<string, any>): Promise<void> {
  try {
    const crmUrl = getEnv('CRM_SUPABASE_URL') || import.meta.env.CRM_SUPABASE_URL;
    const crmAnonKey = getEnv('CRM_SUPABASE_ANON_KEY') || import.meta.env.CRM_SUPABASE_ANON_KEY;

    if (!crmUrl || !crmAnonKey) {
      console.warn('[CRM Direct Database Insert] CRM_SUPABASE_URL or CRM_SUPABASE_ANON_KEY environment variables not set.');
      return;
    }
    const timestamp = Date.now();
    const caseId = `c-${timestamp}`;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const caseNumber = `CAS-2026-${randomNum}`;

    const preferredCountries = Array.isArray(payload.preferred_countries) ? payload.preferred_countries : ['Canada'];
    const inquiryTypes = Array.isArray(payload.inquiry_types) ? payload.inquiry_types : ['Student Visa'];
    const targetCountry = preferredCountries[0] || payload.country_preference || 'Canada';

    const detailBullets = [
      preferredCountries.length > 0 ? `Preferred Countries: ${preferredCountries.join(', ')}` : '',
      inquiryTypes.length > 0 ? `Inquiry Types: ${inquiryTypes.join(', ')}` : '',
      `Marital Status: ${payload.marital_status || 'Single'} | Passport: ${payload.passport_available || 'No'}`,
      `Education: ${payload.highest_qualification || "Bachelor's"} (${payload.passing_year || 'N/A'}) - ${payload.college_university || 'N/A'} [${payload.college_course || 'N/A'}]`,
      payload.gpa_percentage ? `GPA / Marks: ${payload.gpa_percentage}` : '',
      `Language Test: ${payload.language_test_type || 'None'} ${payload.exam_score ? `(Score: ${payload.exam_score})` : ''}`,
      `Visa Refusal History: ${payload.visa_refusal || 'No'}${payload.visa_refusal === 'Yes' ? ` (${payload.refusal_country} - ${payload.refusal_reason})` : ''}`,
      payload.lead_source === 'Reference' ? `Reference: ${payload.reference_name} (${payload.reference_mobile})` : '',
      `Preferred Contact: ${payload.preferred_contact_method || 'WhatsApp'} (${payload.best_time_to_contact || 'Morning'})`,
      payload.notes ? `Message: ${payload.notes}` : '',
    ].filter(Boolean);

    const notesSummary = `🌐 Website 9-Step Inquiry Form:\n• ${detailBullets.join('\n• ')}`;

    const newCase = {
      id: caseId,
      case_number: caseNumber,
      full_name: payload.full_name || 'Anonymous Website Visitor',
      gender: 'Other',
      dob: payload.dob || '',
      mobile: payload.mobile || payload.phone || 'N/A',
      whatsapp: payload.mobile || payload.phone || 'N/A',
      email: payload.email || 'not_provided@website.com',
      city: payload.city || 'Online',
      target_country: String(targetCountry).includes('🇨🇦') || String(targetCountry).includes('🇬🇧') ? targetCountry : `${targetCountry} 🌐`,
      preferred_countries: preferredCountries,
      lead_source: payload.lead_source || 'Website /inquiry Form',
      reference_name: payload.reference_name || '',
      reference_mobile: payload.reference_mobile || '',
      visa_type: (inquiryTypes[0] || 'Student Visa'),
      inquiry_types: inquiryTypes,
      marital_status: (payload.marital_status || 'Single'),
      passport_available: (payload.passport_available || 'No'),
      ssc_completed: (payload.ssc_completed || 'Yes'),
      hsc_completed: (payload.hsc_completed || 'Yes'),
      study_level: payload.highest_qualification || "Bachelor's",
      highest_qualification: payload.highest_qualification || "Bachelor's",
      passing_year: payload.passing_year || '',
      gpa_percentage: payload.gpa_percentage || '',
      college_university: payload.college_university || '',
      college_course: payload.college_course || '',
      language_test_type: payload.language_test_type || 'None',
      ielts_score: payload.exam_score || '',
      exam_score: payload.exam_score || '',
      visa_refusal: payload.visa_refusal || 'No',
      refusal_country: payload.refusal_country || '',
      refusal_date: payload.refusal_date || '',
      refusal_reason: payload.refusal_reason || '',
      preferred_contact_method: (payload.preferred_contact_method || 'WhatsApp'),
      best_time_to_contact: (payload.best_time_to_contact || 'Morning'),
      workflowStage: 'inquiry',
      status: 'new_inquiry',
      priority: 'normal',
      created_at: new Date().toISOString(),
      notes_summary: notesSummary,
      tuition_paid: false,
      sop_ready: false,
      financial_docs: false,
      offer_letter: false,
    };

    // Direct REST write to CRM Supabase cases table
    const dbRes = await fetch(`${crmUrl}/rest/v1/cases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': crmAnonKey,
        'Authorization': `Bearer ${crmAnonKey}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        id: caseId,
        data: newCase,
        updated_at: new Date().toISOString()
      })
    });

    console.log(`[CRM Direct Database Insert] Status: ${dbRes.status} for ${newCase.full_name}`);
  } catch (err) {
    console.error('[CRM Direct Database Insert] Exception during direct CRM insert:', err);
  }
}
