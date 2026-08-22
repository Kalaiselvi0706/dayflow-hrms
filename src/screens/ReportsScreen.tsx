import React from 'react';
import { Button } from '../components/common/Button';

export const ReportsScreen: React.FC = () => {
  const reportsList = [
    {
      id: 'rep-1',
      title: 'Q3 Demographic Ratios & Attendance Waveform',
      date: 'Oct 15, 2023',
      size: '4.2 MB',
      type: 'Compliance PDF',
    },
    {
      id: 'rep-2',
      title: 'Annual Flight Risk & Burnout Statistical Report',
      date: 'Oct 01, 2023',
      size: '8.7 MB',
      type: 'Regression Sheet',
    },
    {
      id: 'rep-3',
      title: 'W2 Tax Document Batch (Engineering Department)',
      date: 'Sep 24, 2023',
      size: '1.2 MB',
      type: 'Tax CSV Ledger',
    },
    {
      id: 'rep-4',
      title: 'HR Diversity Statistics & Onboarding Sync Metrics',
      date: 'Aug 10, 2023',
      size: '5.1 MB',
      type: 'Audit PDF',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <div className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Executive Compliance & Reports</h2>
        <p className="text-sm text-[#908fa0]">Download regulatory compliance reports, shift waveform charts, and statistical regression sheets.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reportsList.map((rep) => (
          <div
            key={rep.id}
            className="p-5 rounded-2xl bg-[#1e1f26]/70 border border-[#464554]/30 flex items-center justify-between gap-4 hover:border-[#8083ff]/30 transition-all backdrop-blur-md"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#8083ff]/10 text-[#c0c1ff] border border-[#8083ff]/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">download_for_offline</span>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white leading-normal">{rep.title}</h4>
                <div className="flex items-center gap-3 text-[10px] text-[#908fa0] mt-1 font-mono">
                  <span>Type: {rep.type}</span>
                  <span>•</span>
                  <span>Released: {rep.date}</span>
                  <span>•</span>
                  <span>File size: {rep.size}</span>
                </div>
              </div>
            </div>

            <Button variant="secondary" icon="download" className="py-2 px-3 shrink-0">
              Download
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
