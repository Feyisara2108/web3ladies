/**
 * Current Venture Builder cohort — edit these to update the landing page.
 * Times are WAT (UTC+1).
 */
export const COHORT = {
  name: "Cohort 1",
  startMonth: "January 2027",
  registrationCloses: "2026-12-18T23:59:00+01:00",
  schedule: {
    days: "Tuesdays & Fridays",
    time: "5:00 – 7:00 PM WAT",
    platform: "Google Meet",
    weeks: 8,
  },
  dates: {
    registrationCloses: "Dec 18, 2026",
    onboarding: "Jan 4, 2027",
    classesStart: "Jan 5, 2027",
    demoDay: "Mar 5, 2027",
  },
  /**
   * Seat options. Paste each option's payment link (Paystack, Flutterwave, …)
   * into `paymentUrl` once payments are set up; until then applicants are told
   * the payment link will be emailed to them.
   */
  pricing: [
    {
      id: "early-bird",
      name: "Early Bird",
      price: "$349",
      note: "Limited-time offer",
      featured: true,
      paymentUrl: null as string | null,
    },
    {
      id: "standard",
      name: "Standard",
      price: "$549",
      note: "Full program price",
      featured: false,
      paymentUrl: null as string | null,
    },
  ],
};

export type CohortPlan = (typeof COHORT.pricing)[number];
