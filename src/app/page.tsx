import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { RegisterForm } from "@/components/register-form";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        
        <section id="about" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">About HackXperience 2025</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg mb-6">
                  HackXperience is the premier hackathon event bringing together talented developers,
                  designers, and innovators from around the world.
                </p>
                <p className="text-lg mb-6">
                  Over the course of 48 hours, participants will collaborate in teams to build
                  groundbreaking projects that tackle real-world challenges.
                </p>
                <p className="text-lg mb-6">
                  Whether you're a seasoned developer or just starting your coding journey,
                  HackXperience welcomes all skill levels and backgrounds.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-lg border border-border/40">
                <h3 className="text-xl font-semibold mb-4">Event Highlights</h3>
                <ul className="space-y-3">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-primary">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        <section id="register" className="py-20 bg-secondary/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Register Now</h2>
            <RegisterForm />
          </div>
        </section>
        
        <section id="schedule" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Event Schedule</h2>
            
            <div className="max-w-3xl mx-auto">
              {schedule.map((day, i) => (
                <div key={i} className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    {day.date}
                  </h3>
                  <div className="border border-border/40 rounded-lg overflow-hidden">
                    {day.events.map((event, j) => (
                      <div 
                        key={j} 
                        className="p-4 flex flex-col sm:flex-row gap-4 sm:items-center border-b border-border/40 last:border-b-0"
                      >
                        <div className="w-24 flex-shrink-0 text-primary">{event.time}</div>
                        <div>
                          <h4 className="font-medium">{event.name}</h4>
                          <p className="text-muted-foreground text-sm">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
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
      </main>
      
      <Footer />
    </div>
  );
}

// Sample data
const highlights = [
  "$50,000 in prizes and scholarships",
  "Mentorship from industry experts",
  "Workshops and technical sessions",
  "Networking opportunities with top companies",
  "Free food and swag for all participants",
  "Post-event job and internship opportunities"
];

const schedule = [
  {
    date: "Day 1 - Friday, May 15, 2025",
    events: [
      { time: "9:00 AM", name: "Check-in & Registration", description: "Pick up your badge and welcome kit" },
      { time: "10:00 AM", name: "Opening Ceremony", description: "Welcome address and sponsor introductions" },
      { time: "11:30 AM", name: "Team Formation", description: "Find teammates and brainstorm ideas" },
      { time: "12:30 PM", name: "Lunch", description: "Networking lunch with sponsors" },
      { time: "2:00 PM", name: "Hacking Begins", description: "Start building your amazing projects" },
      { time: "7:00 PM", name: "Dinner", description: "Refuel for the night ahead" }
    ]
  },
  {
    date: "Day 2 - Saturday, May 16, 2025",
    events: [
      { time: "8:00 AM", name: "Breakfast", description: "Continental breakfast" },
      { time: "10:00 AM", name: "Workshops", description: "Technical workshops by industry experts" },
      { time: "12:30 PM", name: "Lunch", description: "Continue hacking through lunch" },
      { time: "3:00 PM", name: "Mentor Sessions", description: "Get feedback on your projects" },
      { time: "7:00 PM", name: "Dinner", description: "Special dinner event" }
    ]
  },
  {
    date: "Day 3 - Sunday, May 17, 2025",
    events: [
      { time: "8:00 AM", name: "Breakfast", description: "Last day breakfast" },
      { time: "11:00 AM", name: "Submission Deadline", description: "Final commit and project submission" },
      { time: "12:30 PM", name: "Lunch", description: "Pre-judging lunch" },
      { time: "2:00 PM", name: "Project Expo", description: "Showcase your projects to judges" },
      { time: "4:00 PM", name: "Closing Ceremony", description: "Awards and celebration" }
    ]
  }
];

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
