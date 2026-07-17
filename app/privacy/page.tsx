import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "../_components/LegalPage";

const CONTACT = "hello@hisprout.app";

export const metadata: Metadata = {
  title: "Privacy Policy · Sprout",
  description:
    "How Sprout collects, uses, and protects your information. We collect as little as possible, never sell your data, and never train AI on it.",
};

const SECTIONS: LegalSection[] = [
  {
    h: "1. Who we are",
    p: [
      `Sprout ("Sprout," "we," "us," "our") runs this website at hisprout.app. We are a homeschool documentation product built by parents who were done handing their family's life to companies that sell it back to them. Right now the site lets you make and print worksheets in Sprout Resources, join a community of parents doing the same, sign up for the waitlist, and learn about our partner program. The full Sprout app is on the way.`,
      `If you have any questions about this policy or your data, email us at ${CONTACT} and a real person answers.`,
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
      "Sprout Resources is different on purpose. The worksheets you make and your kids' profiles are saved in your own browser, on your device, not on our servers. We never see them. What you type to build a worksheet is passed to our AI provider to build it and is not stored or trained on. See the Sprout Resources privacy page for exactly how that works.",
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
      "This is the part that matters, and we mean every word of it. We do not sell your personal information. We do not train AI on it. We are not quietly building a panel of homeschool data to auction off later. That is the line the tech giants crossed, and it is the exact line Sprout will not. The only reason we hold anything at all is to run the waitlist, answer partner notes, and keep the site working.",
      "Your family's life is yours. You are one of the parents choosing to grow the next generation on your own terms, out of reach of the algorithms and the data brokers, and we are building Sprout to keep it that way. If any of this ever changes, we update this page and tell you first, before it takes effect.",
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
      updated="July 1, 2026"
      intro="Sprout exists because your kid's week belongs to you. Not to a tech giant's training set, not to a data broker's spreadsheet, not to anyone but you. That is the whole point of this thing. So this page is honest and plain: we collect as little as we can, we never sell what we hold, and we never train AI on it. You are taking a small piece of ground back here. Here is exactly how we protect it."
      sections={SECTIONS}
    />
  );
}
