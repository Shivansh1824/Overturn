import React from 'react';
import { FileSearch, Stethoscope, Scale, SendHorizontal, CheckCircle2 } from 'lucide-react';
import { DiagonalWatermark } from './DiagonalWatermark';

const WORKFLOW_STEPS = [
  {
    step: '01',
    badge: 'Intake & OCR',
    title: 'Deconstruct the Rejection',
    description:
      'Upload the rejection letter and hospital discharge summary. OverTurn isolates the exact repudiation code, policy clause, and internal insurer rationale.',
    detail: 'Isolates arbitrary denial codes and policy exclusions in seconds.',
    icon: FileSearch,
  },
  {
    step: '02',
    badge: 'Clinical Cross-Audit',
    title: 'Pinpoint Ignored Medical Proof',
    description:
      'Claims adjusters frequently issue generic denials without reviewing chart notes. OverTurn cross-audits records to locate the diagnostic scans and physician orders that contradict the rejection.',
    detail: 'Extracts lab metrics, MRI findings, and surgical necessity logs.',
    icon: Stethoscope,
  },
  {
    step: '03',
    badge: 'Legal Enforcement',
    title: 'Bind Statutory Regulators',
    description:
      'Insurers are legally constrained by insurance law. OverTurn embeds binding IRDAI Master Circular directives, Section 45 moratoriums, and landmark court precedents directly into the dispute.',
    detail: 'Enforces statutory compliance and penalties for bad-faith delays.',
    icon: Scale,
  },
  {
    step: '04',
    badge: 'Resolution',
    title: 'Dispatch the Appeal Dossier',
    description:
      'Generates a comprehensive, audit-ready appeal package indexed to clinical page numbers. Complete with a 15-day IRDAI statutory countdown ready for immediate escalation to the Insurance Ombudsman.',
    detail: 'Clinician-approved format with 1-click PDF export & filing.',
    icon: SendHorizontal,
  },
];

export const WorkflowSection: React.FC = () => {
  return (
    <div className="relative w-full h-full overflow-y-auto pt-28 pb-20 px-6 md:px-12 lg:px-16 text-slate-900 scrollbar-hide">
      {/* ── Diagonal OVERTURN repeated background watermark ── */}
      <DiagonalWatermark text="OVERTURN" opacity={0.02} rotation={-12} color="#0f172a" />

      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center">
        {/* Section Header with generous space */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-slate-200/60">
          <div>
            <div className="text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              Autonomous Appeal Workflow
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
              From Unfair Denial to Filed Appeal
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base max-w-md font-medium leading-relaxed">
            Our multi-step agent audits clinical records, isolates ignored diagnostic proof, and generates an audit-ready legal appeal dossier in minutes.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
          {WORKFLOW_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="group relative bg-white/60 backdrop-blur-md rounded-2xl p-7 border border-slate-200/60 hover:border-slate-300/80 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-300 group-hover:text-slate-900 transition-colors font-mono">
                      {step.step}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 group-hover:bg-slate-200 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-600 mb-2">
                    {step.badge}
                  </div>

                  <h3 className="text-lg font-bold mb-3 leading-snug group-hover:text-slate-700 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-start gap-2 text-xs text-slate-500 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{step.detail}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
