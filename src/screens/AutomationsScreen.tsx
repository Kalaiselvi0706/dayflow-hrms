import React, { useState, useEffect } from 'react';
import { AutomationWorkflow } from '../types';
import { automationService } from '../services/automationService';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { NotificationToast } from '../components/common/NotificationToast';

export const AutomationsScreen: React.FC = () => {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTrigger, setNewTrigger] = useState('New Hire Added');
  const [newCondition, setNewCondition] = useState('Department == Any');
  const [newAction, setNewAction] = useState('Send Welcome Slack & Provision Okta');
  const [toast, setToast] = useState<string | null>(null);

  const loadWorkflows = async () => {
    setLoading(true);
    try {
      const data = await automationService.getWorkflows();
      setWorkflows(data);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  const handleToggleWorkflow = async (id: string) => {
    try {
      const updated = await automationService.toggleWorkflow(id);
      if (updated) {
        setWorkflows((prev) => prev.map((w) => (w.id === id ? updated : w)));
        setToast(`Workflow "${updated.title}" is now ${updated.status}.`);
      }
    } catch (err) {}
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const added = await automationService.addWorkflow({
        title: newTitle,
        status: 'Active',
        triggerIcon: 'bolt',
        triggerTitle: newTrigger,
        conditionIcon: 'psychology',
        conditionTitle: newCondition,
        actionIcon: 'send',
        actionTitle: newAction,
      });

      setWorkflows((prev) => [added, ...prev]);
      setShowCreateModal(false);
      setNewTitle('');
      setToast(`Workflow "${added.title}" created and deployed live!`);
    } catch (err) {}
  };

  const handleDeployAISuggestion = async (title: string, trigger: string, condition: string, action: string) => {
    try {
      const added = await automationService.addWorkflow({
        title,
        status: 'Active',
        triggerIcon: 'auto_awesome',
        triggerTitle: trigger,
        conditionIcon: 'psychology',
        conditionTitle: condition,
        actionIcon: 'done_all',
        actionTitle: action,
      });
      setWorkflows((prev) => [added, ...prev]);
      setToast(`Deployed AI workflow: ${title}`);
    } catch (err) {}
  };


  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <SkeletonLoader variant="card" count={1} />
        <SkeletonLoader variant="table" count={2} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Toast */}
      <NotificationToast
        message={toast}
        onClose={() => setToast(null)}
      />

      {/* Top Banner */}
      <div className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Cognitive Rule Engine
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Automation Center
          </h2>
          <p className="text-sm text-[#908fa0] max-w-xl">
            Autonomous HR pipelines executing real-time onboarding, instant leave approvals, and anomaly resolution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#a078ff] text-white text-xs font-semibold shadow-lg shadow-[#8083ff]/30 hover:scale-105 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Create Custom Workflow
          </button>
        </div>
      </div>

      {/* Execution Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">account_tree</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{workflows.length} Active Workflows</div>
            <p className="text-xs text-[#908fa0]">0 Paused pipelines</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#8083ff]/20 text-[#c0c1ff] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">bolt</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">1,492 Executions</div>
            <p className="text-xs text-[#908fa0]">Triggered today</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">99.8% Success Rate</div>
            <p className="text-xs text-[#908fa0]">Zero fatal exceptions</p>
          </div>
        </div>
      </div>

      {/* Active Workflows Visual Flow Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Live Automated Pipelines</h3>

        <div className="space-y-4">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 backdrop-blur-xl space-y-4 hover:border-[#8083ff]/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#8083ff] text-xl">account_tree</span>
                  <h4 className="text-base font-bold text-white">{wf.title}</h4>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#908fa0]">{wf.runsCount} executions • Last {wf.lastTriggered}</span>
                  <button
                    onClick={() => handleToggleWorkflow(wf.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      wf.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-[#282a30] text-[#908fa0] border-[#464554]/40'
                    }`}
                  >
                    {wf.status}
                  </button>
                </div>
              </div>

              {/* Connected Visual Pipeline: Trigger -> Condition -> Action */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 items-center">
                {/* Node 1: Trigger */}
                <div className="p-3.5 rounded-2xl bg-[#111319]/80 border border-[#464554]/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-sm">{wf.triggerIcon}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-cyan-300 block">Trigger</span>
                    <span className="text-xs font-semibold text-white truncate block">{wf.triggerTitle}</span>
                  </div>
                </div>

                {/* Node 2: Condition */}
                <div className="p-3.5 rounded-2xl bg-[#111319]/80 border border-[#8083ff]/30 flex items-center gap-3 relative">
                  <div className="w-8 h-8 rounded-xl bg-[#8083ff]/20 text-[#c0c1ff] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-sm">{wf.conditionIcon}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#c0c1ff] block">AI Condition</span>
                    <span className="text-xs font-semibold text-white truncate block">{wf.conditionTitle}</span>
                  </div>
                </div>

                {/* Node 3: Action */}
                <div className="p-3.5 rounded-2xl bg-[#111319]/80 border border-emerald-500/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-sm">{wf.actionIcon}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">Action</span>
                    <span className="text-xs font-semibold text-white truncate block">{wf.actionTitle}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Suggested Automations */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1e1f26] via-[#282a30] to-[#1e1f26] border border-[#a078ff]/40 space-y-4 ai-glow">
        <div className="flex items-center gap-2 text-[#d0bcff]">
          <span className="material-symbols-outlined">auto_awesome</span>
          <h3 className="text-base font-bold text-white">Suggested Workflows from Nexora AI</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-[#111319]/70 border border-[#464554]/30 space-y-2 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-white">Weekly Timesheet Reminder for Contractors</h4>
              <p className="text-xs text-[#908fa0]">
                Triggers on Friday 4:00 PM. Sends Slack DM if hours &lt; 40.
              </p>
            </div>
            <button
              onClick={() =>
                handleDeployAISuggestion(
                  'Contractor Timesheet Reminder',
                  'Friday 4:00 PM',
                  'Type == Contractor && Hours < 40',
                  'Send Slack DM'
                )
              }
              className="mt-2 py-2 px-4 rounded-xl bg-[#8083ff]/20 hover:bg-[#8083ff]/30 text-[#c0c1ff] border border-[#8083ff]/40 text-xs font-semibold transition-all self-start"
            >
              + Deploy Workflow
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#111319]/70 border border-[#464554]/30 space-y-2 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-white">Work Anniversary Neural Celebration</h4>
              <p className="text-xs text-[#908fa0]">
                Triggers on hire anniversary. Creates company Kudos card and syncs recognition gift.
              </p>
            </div>
            <button
              onClick={() =>
                handleDeployAISuggestion(
                  'Anniversary Celebration',
                  'Join Date Anniversary',
                  'Active Employee == True',
                  'Post Slack Kudos & Gift Card'
                )
              }
              className="mt-2 py-2 px-4 rounded-xl bg-[#8083ff]/20 hover:bg-[#8083ff]/30 text-[#c0c1ff] border border-[#8083ff]/40 text-xs font-semibold transition-all self-start"
            >
              + Deploy Workflow
            </button>
          </div>
        </div>
      </div>

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
          <div className="relative w-full max-w-lg bg-[#1a1d26] border border-[#464554]/50 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#464554]/30">
              <h3 className="text-base font-bold text-white">Create Custom HR Workflow</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#908fa0] hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#c0c1ff] font-semibold mb-1">Workflow Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Remote Office Equipment Stipend"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#111319] border border-[#464554]/50 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#8083ff]"
                />
              </div>

              <div>
                <label className="block text-[#c0c1ff] font-semibold mb-1">Trigger Event</label>
                <select
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="w-full bg-[#111319] border border-[#464554]/50 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#8083ff]"
                >
                  <option value="New Hire Added">New Hire Added</option>
                  <option value="Leave Request Submitted">Leave Request Submitted</option>
                  <option value="Overtime Exceeds 5 Hours">Overtime Exceeds 5 Hours</option>
                  <option value="Performance Review Completed">Performance Review Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-[#c0c1ff] font-semibold mb-1">Cognitive Condition</label>
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="e.g. Location == Remote"
                  className="w-full bg-[#111319] border border-[#464554]/50 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#8083ff]"
                />
              </div>

              <div>
                <label className="block text-[#c0c1ff] font-semibold mb-1">Target Action</label>
                <input
                  type="text"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="e.g. Issue Brex Card & Order Laptop"
                  className="w-full bg-[#111319] border border-[#464554]/50 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#8083ff]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-[#908fa0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#a078ff] text-white font-semibold"
                >
                  Save & Deploy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
