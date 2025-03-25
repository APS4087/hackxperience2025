import React from 'react';

const schedule = [
  {
    date: "Day 1 - April 11",
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
    date: "Day 2 - April 12",
    events: [
      { time: "8:00 AM", name: "Breakfast", description: "Continental breakfast" },
      { time: "10:00 AM", name: "Workshops", description: "Technical workshops by industry experts" },
      { time: "12:30 PM", name: "Lunch", description: "Continue hacking through lunch" },
      { time: "3:00 PM", name: "Mentor Sessions", description: "Get feedback on your projects" },
      { time: "7:00 PM", name: "Dinner", description: "Special dinner event" }
    ]
  }
];

export function ScheduleSection() {
  return (
    <section id="schedule" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Event Schedule</h2>
        
        <div className="max-w-3xl mx-auto">
          {schedule.map((day, i) => (
            <div key={i} className="mb-10">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent">
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
  );
} 