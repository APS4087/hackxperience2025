import React from 'react';

const faqs = [
  {
    question: "Who can participate in HackXperience?",
    answer: "HackXperience is open to all students, professionals, and tech enthusiasts. Whether you're a beginner or an experienced developer, everyone is welcome!"
  },
  {
    question: "Do I need to have a team before registering?",
    answer: "No, you can register individually and form a team during the event. We'll have team formation activities to help you find teammates."
  },
  {
    question: "Is there a registration fee?",
    answer: "No, HackXperience is completely free to attend. We'll provide food, drinks, and swag during the event."
  },
  {
    question: "What should I bring to the hackathon?",
    answer: "Bring your laptop, charger, any hardware you want to work with, and your enthusiasm! We'll provide the rest."
  },
  {
    question: "Will there be prizes?",
    answer: "Yes! We have over $50,000 in prizes across various categories, including Best Overall, Best UI/UX, Most Innovative, and more."
  },
  {
    question: "Can I work on a pre-existing project?",
    answer: "All projects must be started from scratch at the event. You can come with ideas, but the coding should begin at the hackathon."
  }
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        
        <div className="max-w-3xl mx-auto grid gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card rounded-lg p-6 shadow-sm border border-border/40">
              <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 