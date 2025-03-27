export interface Event {
  time: string;
  name: string;
  type: string;
  description: string;
  venue: string;
}

export interface DaySchedule {
  date: string;
  events: Event[];
}

export const schedule: DaySchedule[] = [
  {
    date: "Day 1",
    events: [
      {
        time: "11:30",
        name: "venue-open.sh",
        type: "script",
        description: "Venue Open",
        venue: "LT B.2.17"
      },
      {
        time: "12:30",
        name: "introduction.md",
        type: "doc",
        description: "Introduction",
        venue: "LT B.2.17"
      },
      {
        time: "13:00",
        name: "hackathon-briefing.jsx",
        type: "component",
        description: "Hackathon Briefing & Workshop",
        venue: "LT B.2.17"
      },
      {
        time: "14:30",
        name: "team-formation.js",
        type: "script",
        description: "Team Formation",
        venue: "LT B.2.17"
      },
      {
        time: "15:00",
        name: "team-registration.sh",
        type: "script",
        description: "Team Registration",
        venue: "PAT Foyer"
      },
      {
        time: "15:30",
        name: "hacking-session-1.py",
        type: "script",
        description: "Hacking Time",
        venue: "PAT Foyer"
      },
      {
        time: "18:00",
        name: "dinner.yaml",
        type: "config",
        description: "Dinner Collection",
        venue: "PAT Foyer"
      },
      {
        time: "18:00",
        name: "hacking-session-2.py",
        type: "script",
        description: "Hacking Time",
        venue: "PAT Foyer"
      }
    ]
  },
  {
    date: "Day 2",
    events: [
      {
        time: "08:30",
        name: "venue-open-day2.sh",
        type: "script",
        description: "Venue Open",
        venue: "PAT Foyer"
      },
      {
        time: "08:30",
        name: "hacking-session-3.py",
        type: "script",
        description: "Hacking Time",
        venue: "PAT Foyer"
      },
      {
        time: "11:30",
        name: "lunch.yaml",
        type: "config",
        description: "Lunch Collection",
        venue: "PAT Foyer"
      },
      {
        time: "11:30",
        name: "hacking-session-4.py",
        type: "script",
        description: "Hacking Time",
        venue: "PAT Foyer"
      },
      {
        time: "15:00",
        name: "submission.md",
        type: "doc",
        description: "Submission",
        venue: "PAT Foyer"
      },
      {
        time: "15:10",
        name: "presentation.pptx",
        type: "doc",
        description: "Presentation + Judging",
        venue: "PAT Foyer"
      },
      {
        time: "17:00",
        name: "panel-talk.md",
        type: "doc",
        description: "Panel Talk",
        venue: "PAT Foyer"
      },
      {
        time: "17:30",
        name: "closing.ceremony",
        type: "component",
        description: "Awarding, Closing, Networking",
        venue: "PAT Foyer"
      }
    ]
  }
]; 