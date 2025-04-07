import React from 'react';
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Who can participate in HackXperience?",
    answer: "We welcome all tech enthusiasts students to participate, regardless of their educational background or programming experience."
  },

  {
    question: "Do I need to be good at coding to participate?",
    answer: "Hackathons are your opportunity to demonstrate creativity, problem-solving and critical thinking. We welcome tech-enthusiasts like you to participate!"
  },

  {
    question: "Can I register as an Individual?",
    answer: "Yes, we will help you find a team during Team Formation session"
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
    answer: "Coding should start during the hackathon. During the hacking session, you are required to setup a Github repository and share your Github collab to your facilitators for auditing purposes"
  },
  {
    question: "Is this a 24 hour hackathon? Do I need to stay overnight? ",
    answer: (
      <>
        The venue will be open on Day 1 until 9PM, and are allowed to continue working on their project overnight at home. Teams must stop working on Day 2 by 3PM. <strong> At least ONE member must be present throughout the hacking sessions.</strong>
      </>
    )
  },
  
  {
    question: "What must I make? What is the problem statement and theme?",
    answer: "Problem Statement will be revealed during the D-day! Stay tuned :) "
  }
];

export function FAQSection() {
  return (
    <section id="faq" className="py-12 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center mb-8 sm:mb-12 px-4"
          style={{ 
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "300% 100%",
            backgroundImage: "linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 25%, #ef4444 50%, #e2e8f0 75%, #f1f5f9 100%)",
            filter: "drop-shadow(0 0 20px rgba(226,232,240,0.2))"
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          Frequently Asked Questions
        </motion.h2>
        
        <div className="max-w-3xl mx-auto grid gap-4 sm:gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card rounded-lg p-4 sm:p-6 shadow-sm border border-border/40">
              <h3 className="text-base sm:text-lg font-medium mb-2">{faq.question}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 