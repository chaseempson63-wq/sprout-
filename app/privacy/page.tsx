import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "../_components/LegalPage";

const CONTACT = "chaseempson63@gmail.com";

export const metadata: Metadata = {
  title: "Privacy Policy · Sprout",
  description:
    "How Sprout collects, uses, and protects your information. We collect as little as possible, never sell your data, and never train AI on it.",
};

const SECTIONS: LegalSection[] = [
  {
    h: "1. Who we are",
    p: [
      `Sprout ("Sprout," "we," "us," "our") operates this website at hisprout.app. Sprout is a homeschool documentation product currently in pre-launch. Right now this site lets you join our waitlist and learn about our partner program.`,
      `If you have any questions about this policy or your data, email us at ${CONTACT}.`,
    ],
  },
  {
    h: "2. What we collect",
    p: ["We collect only what we need:"],
    bullets: [
      "Waitlist details: the email address, and any name, you give us when you join the waitlist.",
      "Partner applications: if you apply to our partner program, the information you choose to send us by email, such as your name, the platforms you post on, your audience size, and why you are interested.",
      "Usage and device data: standard information your browser sends when you visit, such as IP address, browser type, pages viewed, and the page that referred you. This helps keep the site working and lets us understand our traffic.",
      "Cookies and similar technologies: see the Cookies and analytics section below.",
    ],
    after: [
      "We do not ask for sensitive information, and we do not knowingly collect information from children through this site.",
    ],
  },
  {
    h: "3. How we use it",
    bullets: [
      "To add you to the waitlist and email you updates about Sprout. You can unsubscribe any time.",
      "To review and respond to partner applications.",
      "To operate, secure, and improve the site.",
      "To measure and improve the ads and posts that bring people to Sprout.",
      "To meet our legal obligations.",
    ],
  },
  {
    h: "4. Our privacy promise",
    p: [
      "This is the part that matters. We do not sell your personal information. We do not train AI on it. We are not building or selling a panel of homeschool data. The only reason we collect anything is to run the waitlist, answer partner applications, and keep the site working. If that ever changes, we will update this policy and tell you first.",
    ],
  },
  {
    h: "5. Cookies and analytics",
    p: [
      "We use a small number of cookies and similar tools to keep the site working and to understand how it is used. We may also use advertising and analytics tools, including the Meta (Facebook) Pixel and similar pixels, to measure and improve the ads that bring people to Sprout.",
      "These tools may set cookies and share limited data, such as your interactions with our site or our ads, with the relevant provider for those purposes. Using these tools to run and measure ads is not the same as selling your personal information, which we do not do. You can control cookies through your browser settings, and you can manage ad personalization in your Meta account and your device settings.",
    ],
  },
  {
    h: "6. Who we share it with",
    p: ["We share data only with the service providers that help us run Sprout, and only as needed:"],
    bullets: [
      "Hosting and infrastructure, such as Vercel, to serve the site.",
      "Database and storage, such as Supabase, to hold waitlist details.",
      "Email tools, to send you updates.",
      "Analytics and advertising providers, such as Meta, as described above.",
    ],
    after: [
      "We require these providers to protect your data and to use it only to provide their service to us. We may also disclose information if the law requires it, or to protect our rights or our users. We do not sell your personal information to anyone.",
    ],
  },
  {
    h: "7. How long we keep it",
    p: [
      "We keep waitlist and application data for as long as you are on the list or in the program, and for a reasonable period after, unless you ask us to delete it sooner. You can ask us to remove you at any time.",
    ],
  },
  {
    h: "8. Your rights",
    p: [
      "Depending on where you live, you have rights over your personal information, including the right to access it, correct it, delete it, object to or restrict certain uses, and opt out of marketing.",
      "If you are in the EU or UK, you have rights under the GDPR. If you are in California, you have rights under the CCPA and CPRA, including the right to know, delete, and opt out of the sale or sharing of personal information. Note that we do not sell it.",
      `To exercise any right, email us at ${CONTACT} and we will respond within the time the law allows.`,
    ],
  },
  {
    h: "9. Security",
    p: [
      "We use reasonable technical and organizational measures to protect your information. No method of transmission or storage is completely secure, but we work to keep your data safe and to limit who can access it.",
    ],
  },
  {
    h: "10. International data",
    p: [
      "Sprout is operated from New Zealand and serves people in the United States and elsewhere. Your information may be processed in countries other than your own. Where required, we rely on appropriate safeguards for those transfers.",
    ],
  },
  {
    h: "11. Children's privacy",
    p: [
      "This site is intended for adults, including parents and creators. We do not knowingly collect personal information from children through this site. The Sprout product is built so that a parent owns and controls any information about their own children, and we do not sell it or train AI on it.",
    ],
  },
  {
    h: "12. Changes to this policy",
    p: [
      "We may update this policy as Sprout grows. If we make a significant change, we will update the date at the top and, where appropriate, let you know. If you keep using the site after a change, that means you accept the updated policy.",
    ],
  },
  {
    h: "13. Contact",
    p: [`Questions, requests, or anything else, email us at ${CONTACT}.`],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="May 29, 2026"
      intro="Your privacy is the whole point of Sprout, so we keep this honest and plain. We collect as little as possible, we do not sell your information, and we do not train AI on it. Here is exactly what we do."
      sections={SECTIONS}
    />
  );
}
