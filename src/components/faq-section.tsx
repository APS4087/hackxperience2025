import React from 'react';

const faqs = [
  {
    question: "Who can participate in HackXperience?",
    answer: "We welcome all tech enthusiasts students to participate, regardless of their educational background or programming experience."
  },

  {
    question: "Do I need to be good at coding to participate?",
    answer: "Hackathons are an opportunity to demonstrate creativity, problem-solving and critical thinking. We welcome tech-enthusiasts like you to participate!"
  },

  {
    question: "Can I register as an Individual?",
    answer: "Yes, we will be help you find a team during d-day"
  },
  {
    question: "Is there a registration fee?",
    answer: "We want to make this event open for hackathon-enthusiasts like you! Participation is completely FREE for all, thanks to our generous sponsors."
  },
  {
    question: "What should I bring to the hackathon?",
    answer: "Bring your laptop, charger, anything you want to work with, and your enthusiasm!"
  },
  {
    question: "Can I work on a pre-existing project before the hackathon?",
    answer: "Coding should start during the hackathon. You are required to setup a Github repository and share your Github collab to your facilitators for auditing purposes"
  },
  {
    question: "Is this a 24 hour hackathon? Do I need to stay overnight? ",
    answer: "The venue will be open on Day 1 until 9PM, and are allowed to continue working on their project overnight at home. Teams must stop working on Day 2 by 3PM. At least one team would be present instead"
  },
  
  {
    question: "What must I make? What is the problem statement and theme",
    answer: "Problem Statement will be revealed during the D-day! Stay tuned :) "
  }
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-background">
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