"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question:
        "What are the basic requirements to become a San Francisco Deputy Sheriff?",
      answer:
        "To become a San Francisco Deputy Sheriff, you must be at least 21 years old, have a high school diploma or GED, be a U.S. citizen or permanent resident who has applied for citizenship, have a valid driver's license, and have no felony convictions. You must also pass a background check, medical examination, psychological evaluation, and physical abilities test.",
    },
    {
      question:
        "What is the starting salary for a San Francisco Deputy Sheriff?",
      answer:
        "The starting salary range for a San Francisco Deputy Sheriff is $118,768 to $184,362 (with incentives), depending on experience and qualifications. This is complemented by excellent benefits including healthcare, retirement plans, and various allowances.",
    },
    {
      question: "How long is the training academy?",
      answer:
        "The San Francisco Sheriff's Department Academy is approximately 23 weeks long. During this time, recruits receive comprehensive training in law enforcement techniques, legal procedures, defensive tactics, firearms, emergency response, and more.",
    },
    {
      question: "Can I apply if I have a criminal record?",
      answer:
        "It depends on the nature of the offense. Felony convictions generally disqualify candidates. Misdemeanors are evaluated on a case-by-case basis, considering factors such as the nature of the offense, how long ago it occurred, and evidence of rehabilitation. A thorough background check is conducted for all applicants.",
    },
    {
      question: "What career advancement opportunities are available?",
      answer:
        "The San Francisco Sheriff's Department offers numerous advancement opportunities. Deputies can promote to Senior Deputy, Sergeant, Lieutenant, Captain, and beyond. There are also specialized units such as K-9, Emergency Response Team, Hostage Negotiation Team, and various administrative and investigative positions.",
    },
    {
      question: "Do you offer any benefits for veterans?",
      answer:
        "Yes, we value the experience and training that veterans bring to our department. Veterans may receive hiring preference points, and those with GI Bill benefits can use them during the academy training. We also have support programs specifically for veterans transitioning to law enforcement careers.",
    },
    {
      question: "Is there a residency requirement for deputies?",
      answer:
        "While deputies are not required to live within San Francisco city limits, there are benefits to living locally, including housing assistance programs. Deputies should consider reasonable commute times as emergency call-backs may occur, and you need to be able to respond within a reasonable timeframe.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-8 sm:py-12 md:py-20 bg-card text-card-foreground">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-card-foreground text-center sm:text-left">
            Frequently Asked Questions
          </h2>
          <div className="text-center sm:text-left mb-8 sm:mb-12">
            <p className="text-sm sm:text-base text-card-foreground/80 max-w-3xl mx-auto">
              Find answers to common questions about becoming a San Francisco
              Deputy Sheriff.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-border">
            {faqs.map((faq, index) => (
              <div key={index} className="py-4 sm:py-5">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex justify-between items-center w-full text-left focus:outline-none group"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-base sm:text-lg font-medium text-primary pr-4 group-hover:text-primary/80 transition-colors">
                    {faq.question}
                  </h3>
                  <span className="ml-4 flex-shrink-0 transition-transform duration-200">
                    {openIndex === index ? (
                      <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    ) : (
                      <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    )}
                  </span>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`mt-2 transition-all duration-300 overflow-hidden ${openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-sm sm:text-base text-card-foreground/80 pr-8">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
