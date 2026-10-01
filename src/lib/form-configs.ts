// Form configs copied from the live site's `form_configs` table (2026-10-01).
// Used as the initial/fallback config; the database row overrides it when present.

export type FormFieldConfig = {
  name: string;
  type: "text" | "email" | "textarea" | "select" | string;
  label: string;
  order?: number;
  required?: boolean;
  placeholder?: string;
  options?: string[];
};

export type FormConfigData = {
  form_type: string;
  form_title: string | null;
  form_description: string | null;
  submit_label: string | null;
  fields: FormFieldConfig[];
};

export const DEFAULT_FORM_CONFIGS: Record<string, FormConfigData> = {
  "community": {
    "form_type": "community",
    "form_title": "Join Web3Ladies",
    "form_description": "",
    "submit_label": "Join the Community",
    "fields": [
      {
        "name": "name",
        "type": "text",
        "label": "Full name",
        "order": 0,
        "required": true,
        "placeholder": "Full name"
      },
      {
        "name": "email",
        "type": "email",
        "label": "Email",
        "order": 1,
        "required": true,
        "placeholder": "Email"
      },
      {
        "name": "country",
        "type": "textarea",
        "label": "Country of Residence",
        "order": 2,
        "required": true,
        "placeholder": "Country of Residence"
      },
      {
        "name": "role",
        "type": "text",
        "label": "Current role or area of interest",
        "order": 3,
        "required": true,
        "placeholder": "Current role or area of interest"
      },
      {
        "name": "why",
        "type": "textarea",
        "label": "Why do you want to join Web3Ladies?",
        "order": 4,
        "required": true,
        "placeholder": "Why would you like to join Web3ladies?"
      },
      {
        "name": "level_of_knowledge",
        "type": "select",
        "label": "What is your level of knowledge in Blockchain/AI?",
        "order": 5,
        "options": [
          "Beginner",
          "Intermediate",
          "Expert"
        ],
        "required": true,
        "placeholder": "What is your level of knowledge in Blockchain/AI?"
      },
      {
        "name": "how_did_you_hear",
        "type": "select",
        "label": "How did you hear about Web3ladies?",
        "order": 6,
        "options": [
          "Through a Friend ",
          "Word of Mouth ",
          "Twitter ",
          "LinkedIn ",
          "Instagram ",
          "Google Search ",
          "Web3ladies Website ",
          "Facebook ",
          "Other"
        ],
        "required": true,
        "placeholder": "How did you hear about Web3ladies?"
      },
      {
        "name": "acknowledgement",
        "type": "select",
        "label": "Acknowledgement",
        "order": 7,
        "options": [
          "Yes ",
          "No"
        ],
        "required": true,
        "placeholder": " You also acknowledge your willingness to be a member of our community and plan to adhere to laid down rules and code of conduct. "
      }
    ]
  },
  "event_host": {
    "form_type": "event_host",
    "form_title": "Submit a hosting request",
    "form_description": "Your knowledge has been waiting for a stage. This is it.\n\nThe Web3Ladies Host Platform is where emerging voices become recognized names.\n\nEvery month, one woman gets the floor—to teach a skill, host a conversation, or lead a session that moves this community forward.\n\nWe don't require a perfect CV or years of experience. We require intentionality, preparation, and a genuine desire to add value to this community. If that's you, we want to hear from you.\n\nFill in the form below. We review every application personally and we'll be in touch. 💜",
    "submit_label": "Submit Hosting Request",
    "fields": [
      {
        "name": "name",
        "type": "text",
        "label": "Your name",
        "order": 0,
        "required": true,
        "placeholder": "Your name"
      },
      {
        "name": "email",
        "type": "email",
        "label": "Email address",
        "order": 1,
        "required": true,
        "placeholder": "Email address"
      },
      {
        "name": "organization",
        "type": "text",
        "label": "LinkedIn Handle",
        "order": 2,
        "required": true,
        "placeholder": "LinkedIn Url"
      },
      {
        "name": "eventType",
        "type": "select",
        "label": "Event type",
        "order": 3,
        "options": [
          "Workshop",
          "Panel",
          "AMA",
          "Masterclass",
          "Meetup",
          "Demo Day",
          "Other"
        ],
        "required": true,
        "placeholder": "Event type"
      },
      {
        "name": "message",
        "type": "textarea",
        "label": "Describe your event idea",
        "order": 4,
        "required": true,
        "placeholder": "Describe your event idea"
      },
      {
        "name": "profession",
        "type": "text",
        "label": "In one sentence, what do you do or what are you building?",
        "order": 5,
        "required": true,
        "placeholder": "In one sentence, what do you do or what are you building?"
      },
      {
        "name": "topic",
        "type": "textarea",
        "label": "What topic would you like to speak or teach on?",
        "order": 6,
        "required": true,
        "placeholder": "In one sentence, what do you do or what are you building?"
      },
      {
        "name": "authority",
        "type": "textarea",
        "label": "What gives you the authority to speak on this topic? This can be lived experience, projects you've built.",
        "order": 7,
        "required": true,
        "placeholder": "What gives you the authority to speak on this topic? This can be lived experience, projects you've built."
      },
      {
        "name": "sessionoutline",
        "type": "textarea",
        "label": "Submit a short outline of your session. Include: the topic title, what you'll cover, and 3 key takeaways your audience will leave with.",
        "order": 8,
        "required": true,
        "placeholder": "Submit a short outline of your session. Include: the topic title, what you'll cover, and 3 key takeaways your audience will leave with."
      }
    ]
  },
  "membership": {
    "form_type": "membership",
    "form_title": "Apply for Founding Membership",
    "form_description": "Tell us about yourself and why you'd like to join the Circle.",
    "submit_label": "Submit Application",
    "fields": [
      {
        "name": "name",
        "type": "text",
        "label": "Full name",
        "order": 0,
        "required": true,
        "placeholder": "Full name"
      },
      {
        "name": "email",
        "type": "email",
        "label": "Email",
        "order": 1,
        "required": true,
        "placeholder": "Email"
      },
      {
        "name": "location",
        "type": "text",
        "label": "Country / City",
        "order": 2,
        "required": true,
        "placeholder": "Country / City"
      },
      {
        "name": "role",
        "type": "text",
        "label": "Current role or area of focus",
        "order": 3,
        "required": false,
        "placeholder": "Current role or area of focus"
      },
      {
        "name": "why",
        "type": "textarea",
        "label": "Why do you want to join the Web3Ladies Circle?",
        "order": 4,
        "required": true,
        "placeholder": "Why do you want to join the Web3Ladies Circle?"
      }
    ]
  },
  "partner": {
    "form_type": "partner",
    "form_title": "Partner with Web3Ladies",
    "form_description": "Tell us about your organization and how you'd like to support.",
    "submit_label": "Send Inquiry",
    "fields": [
      {
        "name": "name",
        "type": "text",
        "label": "Your name",
        "order": 0,
        "required": true,
        "placeholder": "Your name"
      },
      {
        "name": "company",
        "type": "text",
        "label": "Company / Organization",
        "order": 1,
        "required": true,
        "placeholder": "Company / Organization"
      },
      {
        "name": "email",
        "type": "email",
        "label": "Email",
        "order": 2,
        "required": true,
        "placeholder": "Email"
      },
      {
        "name": "website",
        "type": "text",
        "label": "Website",
        "order": 3,
        "required": false,
        "placeholder": "Website"
      },
      {
        "name": "type",
        "type": "select",
        "label": "Partnership type",
        "order": 4,
        "options": [
          "Scholarship Partner",
          "Work Tool Partner",
          "Event Series Sponsor",
          "Cohort / Track Sponsor",
          "Annual Ecosystem Partner",
          "Custom Partnership"
        ],
        "required": false,
        "placeholder": "Select partnership type"
      },
      {
        "name": "explore",
        "type": "textarea",
        "label": "What would you like to explore?",
        "order": 5,
        "required": true,
        "placeholder": "What would you like to explore?"
      }
    ]
  },
  "venture_builder": {
    "form_type": "venture_builder",
    "form_title": "Apply to the Web3 x AI Venture Builder",
    "form_description": "This program is for women ready to build with more clarity, confidence, and intention.",
    "submit_label": "I am Interested",
    "fields": [
      {
        "name": "name",
        "type": "text",
        "label": "Full name",
        "order": 0,
        "required": true,
        "placeholder": "Full name"
      },
      {
        "name": "email",
        "type": "email",
        "label": "Email",
        "order": 1,
        "required": true,
        "placeholder": "Email"
      },
      {
        "name": "linkedin",
        "type": "text",
        "label": "LinkedIn / Portfolio",
        "order": 2,
        "required": false,
        "placeholder": "LinkedIn / Portfolio"
      },
      {
        "name": "location",
        "type": "text",
        "label": "Country / City",
        "order": 3,
        "required": true,
        "placeholder": "Country / City"
      },
      {
        "name": "role",
        "type": "text",
        "label": "Current role",
        "order": 4,
        "required": false,
        "placeholder": "Current role"
      },
      {
        "name": "why",
        "type": "textarea",
        "label": "Why do you want to join this program?",
        "order": 5,
        "required": true,
        "placeholder": "Why do you want to join this program?"
      },
      {
        "name": "build",
        "type": "textarea",
        "label": "What do you want to build or explore?",
        "order": 6,
        "required": false,
        "placeholder": "What do you want to build or explore?"
      },
      {
        "name": "meaningful",
        "type": "textarea",
        "label": "What would make this experience meaningful for you?",
        "order": 7,
        "required": false,
        "placeholder": "What would make this experience meaningful for you?"
      }
    ]
  }
};
