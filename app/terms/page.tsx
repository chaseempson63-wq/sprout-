import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "../_components/LegalPage";

const CONTACT = "chaseempson63@gmail.com";

export const metadata: Metadata = {
  title: "Terms of Service · Sprout",
  description:
    "The terms that cover your use of the Sprout website, the waitlist, and the partner program.",
};

const SECTIONS: LegalSection[] = [
  {
    h: "1. About these terms",
    p: [
      `These terms cover your use of the Sprout website at hisprout.app ("Sprout," "we," "us"). By using the site, joining the waitlist, or applying to the partner program, you agree to these terms. If you do not agree, please do not use the site.`,
    ],
  },
  {
    h: "2. What Sprout is right now",
    p: [
      "Sprout is a homeschool documentation product currently in pre-launch. This site lets you join a waitlist and learn about our partner program. Features, pricing, and timing described here may change before launch.",
    ],
  },
  {
    h: "3. The waitlist",
    p: [
      "Joining the waitlist means we may email you updates about Sprout. It does not guarantee access, a particular price, or a launch date. You can unsubscribe at any time.",
    ],
  },
  {
    h: "4. The partner program",
    p: [
      "If you join our partner program, you can earn a commission of 20% of the subscription revenue from each customer you refer, for up to 12 months from the date that customer subscribes, while both Sprout and the program are active. Your followers receive 20% off for their first 12 months.",
      "There is no commitment and no required posting. Commission you have already earned on customers you referred will be paid out for the rest of their 12-month term even if you stop promoting. We pay earned commission on a regular schedule.",
      "We may update the program terms for future referrals, but we will not reduce commission you have already earned. We may remove anyone who breaks these terms, spams, or misrepresents Sprout.",
    ],
  },
  {
    h: "5. Acceptable use",
    p: [
      "Use the site lawfully. Do not try to break, scrape, overload, or misuse it, and do not promote Sprout in misleading or spammy ways.",
    ],
  },
  {
    h: "6. Our brand and content",
    p: [
      "The Sprout name, logo, content, and design are ours. Do not copy or reuse them without permission, beyond normal sharing of our public posts and the partner materials we provide you.",
    ],
  },
  {
    h: "7. No guarantees",
    p: [
      "The site and any pre-launch information are provided as is, without warranties of any kind. We do not guarantee the site will be error-free or always available. Any earnings figures in the partner program are examples to show how the math works, not a promise of what you will earn. What you actually earn depends on how many customers you refer and how long they stay.",
    ],
  },
  {
    h: "8. Limitation of liability",
    p: [
      "To the fullest extent allowed by law, Sprout is not liable for any indirect, incidental, or consequential damages arising from your use of the site. Our total liability for any claim is limited to the greater of the amount you have paid us, if any, or USD 100. Nothing in these terms limits rights you have under consumer laws that cannot be waived.",
    ],
  },
  {
    h: "9. Changes",
    p: [
      "We may update these terms as Sprout grows. If you keep using the site after a change, that means you accept the updated terms.",
    ],
  },
  {
    h: "10. Governing law",
    p: [
      "These terms are governed by the laws of New Zealand, where Sprout is operated, without affecting any mandatory consumer protections that apply where you live.",
    ],
  },
  {
    h: "11. Contact",
    p: [`Questions about these terms, email us at ${CONTACT}.`],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="May 29, 2026"
      intro="Plain and short. These terms cover the Sprout website, the waitlist, and the partner program while we are in pre-launch."
      sections={SECTIONS}
    />
  );
}
