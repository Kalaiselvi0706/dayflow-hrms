import React from 'react';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/common/EmptyState';

export const TimelineScreen: React.FC = () => {
  const { currentEmployee } = useAuth();

  if (!currentEmployee) return null;

  const timeline = currentEmployee.careerTimeline || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <div className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Your Career Timeline</h2>
        <p className="text-sm text-[#908fa0]">Historical progression, key projects, and promotion tracks at Nexora HR.</p>
      </div>

      {!timeline.length ? (
        <EmptyState
          icon="timeline"
          title="No career timeline records"
          description="Your career node history is empty or awaiting initial verification."
        />
      ) : (
        <div className="relative border-l border-[#8083ff]/30 ml-4 pl-8 space-y-8 py-4">
          {timeline.map((event) => (
            <div key={event.id} className="relative group">
              {/* Connector Node */}
              <div className={`absolute -left-[41px] top-1.5 w-6 h-6 rounded-full border-2 border-[#111319] flex items-center justify-center timeline-node ${
                event.isPromotion
                  ? 'bg-gradient-to-r from-[#8083ff] to-[#a078ff]'
                  : 'bg-[#282a30]'
              }`}>
                <span className="material-symbols-outlined text-[10px] text-white">
                  {event.isPromotion ? 'upgrade' : 'adjust'}
                </span>
              </div>

              {/* Event Content */}
              <div className="p-5 rounded-2xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md space-y-2 hover:border-[#8083ff]/30 transition-all">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#8083ff]">{event.date}</span>
                  {event.tag && (
                    <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold uppercase">
                      {event.tag}
                    </span>
                  )}
                  {event.isPromotion && (
                    <span className="text-[9px] px-2 py-0.5 rounded bg-[#a078ff]/10 text-[#d0bcff] border border-[#a078ff]/30 font-semibold uppercase">
                      Promotion
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight">{event.title}</h4>
                <p className="text-xs text-[#908fa0] leading-relaxed">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
