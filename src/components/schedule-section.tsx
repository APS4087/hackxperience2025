import { schedule, Event, DaySchedule } from './schedule-data';
import React, { useState, memo } from 'react';
import { ChevronDown, Clock, Folder as FolderIcon, FileCode, FileCog, FileText, Terminal, MapPin, FileJson, Presentation } from 'lucide-react';

// Pre-compute file icons mapping outside component
const FILE_ICONS: Record<string, React.ReactElement> = {
  'sh': <Terminal className="h-4 w-4 sm:h-5 sm:w-5 text-green-500/70" />,
  'py': <FileCode className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500/70" />,
  'js': <FileJson className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500/70" />,
  'yaml': <FileCog className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500/70" />,
  'jsx': <FileCode className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500/70" />,
  'pptx': <Presentation className="h-4 w-4 sm:h-5 sm:w-5 text-red-500/70" />,
  'md': <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500/70" />,
  'default': <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500/70" />
};

const getFileIcon = (type: string, name: string): React.ReactElement => {
  const extension = name.split('.').pop() || '';
  return FILE_ICONS[extension] || FILE_ICONS.default;
};

const FileComponent = memo<Event>(({ name, time, description, type, venue }) => {
  // Move icon computation outside render
  const icon = getFileIcon(type, name);

  return (
    <div className="py-1 sm:py-1.5">
      <div className="flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2.5 hover:bg-[#37373d] rounded-sm cursor-pointer">
        <div className="flex-shrink-0 mt-1">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="font-mono truncate text-sm sm:text-base text-[#e3e3e3]">
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
          <p className="text-sm sm:text-base text-[#858585] truncate mt-0.5 sm:mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
});

FileComponent.displayName = 'FileComponent';

interface FolderProps {
  name: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FolderComponent = memo<FolderProps>(({ name, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="py-1 sm:py-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 sm:gap-3 w-full hover:bg-[#37373d] p-1.5 sm:p-2.5 rounded-sm cursor-pointer group"
      >
        <ChevronDown 
          className="h-4 w-4 sm:h-5 sm:w-5 text-[#858585]" 
          style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        />
        <FolderIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#e3e3e3]" />
        <span className="text-base sm:text-lg text-[#e3e3e3]">{name}</span>
      </button>
      <div 
        className="ml-4 sm:ml-6 border-l border-[#404040] pl-2 sm:pl-3"
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {children}
      </div>
    </div>
  );
});

FolderComponent.displayName = 'FolderComponent';

const ScheduleSectionComponent = () => {
  return (
    <section id="schedule" className="py-8 sm:py-16 bg-background">
      <div className="container mx-auto px-3 sm:px-6">
        <h2 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-12 text-center">Event Schedule</h2>
        
        <div className="max-w-4xl mx-auto bg-card border rounded-lg p-3 sm:p-6 shadow-sm">
          <div className="space-y-2 sm:space-y-4">
            {schedule.map((day: DaySchedule, i: number) => (
              <FolderComponent key={i} name={day.date} defaultOpen={i === 0}>
                {day.events.map((event: Event, j: number) => (
                  <FileComponent
                    key={j}
                    {...event}
                  />
                ))}
              </FolderComponent>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const ScheduleSection = memo(ScheduleSectionComponent);
ScheduleSection.displayName = 'ScheduleSection'; 