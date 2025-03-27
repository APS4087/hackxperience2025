import React, { useState } from 'react';
import { ChevronDown, Clock, Folder as FolderIcon, FileCode, FileCog, FileText, Terminal, MapPin, FileJson, FileType, Presentation } from 'lucide-react';

// Convert events to file-like structure
const schedule = [
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
      },
    ]
  }
];

interface FileProps {
  name: string;
  time: string;
  description: string;
  type: string;
  venue: string;
}

const getFileIcon = (type: string, name: string) => {
  const fileExtension = type.toLowerCase();
  switch (fileExtension) {
    case 'script':
      if (name.endsWith('.sh')) {
        return <Terminal className="h-4 w-4 sm:h-5 sm:w-5 text-green-500/70" />;
      } else if (name.endsWith('.py')) {
        return <FileCode className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500/70" />;
      } else if (name.endsWith('.js')) {
        return <FileJson className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500/70" />;
      }
      return <Terminal className="h-4 w-4 sm:h-5 sm:w-5 text-green-500/70" />;
    case 'config':
      return <FileCog className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500/70" />;
    case 'component':
      return <FileCode className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500/70" />;
    case 'doc':
      if (name.endsWith('.pptx')) {
        return <Presentation className="h-4 w-4 sm:h-5 sm:w-5 text-red-500/70" />;
      } else if (name.endsWith('.md')) {
        return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500/70" />;
      }
      return <FileType className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500/70" />;
    default:
      return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500/70" />;
  }
};

const File: React.FC<FileProps> = ({ name, time, description, type, venue }) => {
  return (
    <div className="group/file py-1 sm:py-1.5">
      <div className="flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2.5 hover:bg-[#37373d] rounded-sm transition-all duration-200 ease-in-out cursor-pointer">
        <div className="flex-shrink-0 mt-1">
          {getFileIcon(type, name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="font-mono truncate text-sm sm:text-base text-[#e3e3e3] group-hover/file:text-[#ffffff] transition-colors duration-200">
              {name}
            </span>
            <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-[#858585]">
              <div className="flex items-center gap-1 sm:gap-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{venue}</span>
              </div>
            </div>
          </div>
          <p className="text-sm sm:text-base text-[#858585] truncate mt-0.5 sm:mt-1 group-hover/file:text-[#e3e3e3] transition-colors duration-200">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

interface FolderProps {
  name: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Folder: React.FC<FolderProps> = ({ name, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="py-1 sm:py-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 sm:gap-3 w-full hover:bg-[#37373d] p-1.5 sm:p-2.5 rounded-sm transition-all duration-200 ease-in-out group"
      >
        <div className="transition-transform duration-200 ease-in-out" style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-[#858585]" />
        </div>
        <FolderIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#e3e3e3] group-hover:text-[#ffffff] transition-colors duration-200" />
        <span className="text-base sm:text-lg text-[#e3e3e3] group-hover:text-[#ffffff] transition-colors duration-200">{name}</span>
      </button>
      <div 
        className={`ml-4 sm:ml-6 border-l border-[#404040] pl-2 sm:pl-3 mt-0.5 sm:mt-1 overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export function ScheduleSection() {
  return (
    <section id="schedule" className="py-8 sm:py-16 bg-background">
      <div className="container mx-auto px-3 sm:px-6">
        <h2 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-12 text-center">Event Schedule</h2>
        
        <div className="max-w-4xl mx-auto bg-card border rounded-lg p-3 sm:p-6 shadow-sm">
          <div className="space-y-2 sm:space-y-4">
            {schedule.map((day, i) => (
              <Folder key={i} name={day.date} defaultOpen={i === 0}>
                {day.events.map((event, j) => (
                  <File
                    key={j}
                    name={event.name}
                    time={event.time}
                    description={event.description}
                    type={event.type}
                    venue={event.venue}
                  />
                ))}
              </Folder>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 