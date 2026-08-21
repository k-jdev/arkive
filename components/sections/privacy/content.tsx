"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/animations";

type Section = {
  id: string;
  title: string;
  intro?: string;
  items: string[];
};

const SECTIONS: Section[] = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    intro: "We may collect:",
    items: [
      "Account information such as name and email address.",
      "Trading-related information you choose to upload or connect.",
      "Journal entries, notes, screenshots, and other content submitted to Arkive.",
      "Usage data that helps us improve the platform.",
    ],
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    items: [
      "Provide and improve Arkive's services.",
      "Generate insights and analytics based on your trading history.",
      "Personalize your experience.",
      "Maintain platform security and prevent abuse.",
      "Communicate important product updates.",
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    items: [
      "All data is encrypted in transit and at rest using industry-standard security practices. Access to user data is restricted to authorized systems and personnel.",
    ],
  },
  {
    id: "data-ownership",
    title: "Data Ownership",
    items: [
      "You retain ownership of all content and trading data uploaded to Arkive. We do not sell user data to third parties.",
    ],
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    items: [
      "Arkive may integrate with third-party AI providers and trading tools. Data shared with connected services is subject to their respective privacy policies.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    items: [
      'If you have questions regarding this Privacy Policy, please contact us at <a href="mailto:privacy@arkive.ai" class="text-[#3e63dd] hover:underline">privacy@arkive.ai</a>.',
    ],
  },
];

function SectionBlock({
  title,
  intro,
  items,
  index,
}: {
  title: string;
  intro?: string;
  items: string[];
  index: number;
}) {
  const isSingle = items.length === 1;
  const isHtml = items[0]?.includes("<a");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.08 }}
      className="flex flex-col gap-4"
    >
      <h2 className="text-[24px] leading-[30px] tracking-[-0.1px] font-medium text-[#141414]">
        {title}
      </h2>
      {intro && (
        <p className="text-sm leading-[20px] font-medium text-[#696e77]">
          {intro}
        </p>
      )}
      {isSingle && isHtml ? (
        <p
          className="text-sm leading-[20px] font-medium text-[#696e77]"
          dangerouslySetInnerHTML={{ __html: items[0] }}
        />
      ) : isSingle ? (
        <p className="text-sm leading-[20px] font-medium text-[#696e77]">
          {items[0]}
        </p>
      ) : intro ? (
        <ul className="flex flex-col">
          {items.map((item, i) => (
            <li
              key={i}
              className="text-sm leading-[20px] font-medium text-[#696e77] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#696e77]"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item, i) => {
            const isLastHtml = item.includes("<a");
            return isLastHtml ? (
              <p
                key={i}
                className="text-sm leading-[20px] font-medium text-[#696e77]"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            ) : (
              <p
                key={i}
                className="text-sm leading-[20px] font-medium text-[#696e77]"
              >
                {item}
              </p>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

export default function PrivacyContent() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-360 mx-auto px-[clamp(16px,4.17vw,80px)] pb-[clamp(48px,6vw,120px)] pt-[40px]">
        <div className="mx-auto max-w-140 flex flex-col gap-[40px]">
          {/* Intro */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="text-[24px] leading-[30px] tracking-[-0.1px] font-medium text-[#141414]"
          >
            At Arkive, we respect your privacy and are committed to protecting
            your personal information.
          </motion.p>

          {SECTIONS.map((section, i) => (
            <SectionBlock
              key={section.id}
              title={section.title}
              intro={section.intro}
              items={section.items}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
