import React from 'react';

export const CalendarScreen: React.FC = () => {
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  
  const scheduleEvents = [
    { day: 12, title: 'Annual Leave - Sarah Chen', color: 'bg-[#8083ff]/20 text-[#c0c1ff] border-[#8083ff]/40' },
    { day: 18, title: 'Dental Leave - Alex Rivers', color: 'bg-[#a078ff]/20 text-[#d0bcff] border-[#a078ff]/40' },
    { day: 22, title: 'Sprint Launch Freeze', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
    { day: 28, title: 'Holiday Leave - Elena Lopez', color: 'bg-[#8083ff]/20 text-[#c0c1ff] border-[#8083ff]/40' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8">
      <div className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Workforce Attendance Calendar</h2>
        <p className="text-sm text-[#908fa0]">Roster cycles, automated holiday schedules, and scheduled employee leave blocks.</p>
      </div>

      <div className="rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#464554]/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8083ff]">calendar_today</span>
            <span className="text-sm font-bold text-white uppercase tracking-wider">October 2023</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#908fa0]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8083ff]"></span>Leave</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span>Milestone</span>
          </div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-[#908fa0] mb-2 uppercase tracking-widest">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Pad first week if needed, let's assume Oct 1st is Sun for mock */}
          {calendarDays.map((day) => {
            const dayEvents = scheduleEvents.filter((e) => e.day === day);
            return (
              <div
                key={day}
                className="min-h-[85px] p-2 bg-[#111319]/70 border border-[#464554]/25 rounded-xl flex flex-col justify-between hover:border-[#8083ff]/30 transition-colors"
              >
                <span className="text-xs font-bold text-white">{day}</span>
                <div className="space-y-1">
                  {dayEvents.map((evt, idx) => (
                    <div
                      key={idx}
                      className={`text-[8px] px-1 py-0.5 rounded border leading-tight truncate ${evt.color}`}
                    >
                      {evt.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
