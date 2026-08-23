import { ChevronDown, ChevronLeft, Edit3, Eye, Pencil, Send } from 'lucide-react';

import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import Breadcrumb from '@/components/Breadcrumb';
import Button from '@/components/Button';

import FRONTEND_ROUTES from '@/constants/frontendRoutes';

import { MOCK_PREVIEW_TEST } from '@/mockData/previewData';

import type { Question } from '@/types/question';

function PreviewPage() {
  const navigate = useNavigate();

  const { id: testId } = useParams();

  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  const test = MOCK_PREVIEW_TEST;

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((previous) =>
      previous.includes(questionId)
        ? previous.filter((id) => id !== questionId)
        : [...previous, questionId],
    );
  };

  const handleEditTest = () => {
    if (!testId) {
      return;
    }

    navigate(FRONTEND_ROUTES.TESTS.EDIT(testId));
  };

  const handleEditQuestions = () => {
    if (!testId) {
      return;
    }

    navigate(FRONTEND_ROUTES.TESTS.QUESTIONS(testId));
  };

  const handlePublish = () => {
    /*
     * API PLACEHOLDER
     *
     * PUT /tests/:id
     *
     * {
     *   status: "live"
     * }
     *
     * After successful API response:
     *
     * navigate(FRONTEND_ROUTES.DASHBOARD);
     */

    console.log('Publish test:', test.id);

    navigate(FRONTEND_ROUTES.DASHBOARD);
  };

  const handleBack = () => {
    if (!testId) {
      navigate(FRONTEND_ROUTES.DASHBOARD);
      return;
    }

    navigate(FRONTEND_ROUTES.TESTS.QUESTIONS(testId));
  };

  return (
    <main className="min-h-full min-w-0 bg-[#F8FAFD] px-4 py-5 sm:px-6 lg:px-8">
      {/* =====================================================
          BREADCRUMB
      ====================================================== */}

      <Breadcrumb
        items={[
          {
            label: 'Test Creation',
          },
          {
            label: 'Create Test',
          },
          {
            label: 'Chapter Wise',
          },
          {
            label: 'Questions',
          },
          {
            label: 'Preview',
            active: true,
          },
        ]}
      />

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-[#100C3D] px-3 py-1 text-[12px] font-medium text-white">
              Chapter Wise
            </span>

            <span className="rounded-full bg-[#D1FAE5] px-3 py-1 text-[12px] font-medium text-[#047857]">
              Easy
            </span>

            <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-[12px] font-medium text-[#B45309]">
              Draft
            </span>
          </div>

          <h1 className="text-[22px] font-semibold text-[#101828]">Preview & Publish</h1>

          <p className="mt-1 text-[13px] text-[#667085]">
            Review your test and questions before publishing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#D0D5DD] bg-white px-4 text-[13px] font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          <Button type="button" onClick={handlePublish} className="!h-10 !w-auto !px-5">
            <span className="inline-flex items-center gap-2">
              <Send size={15} />
              Publish Test
            </span>
          </Button>
        </div>
      </div>

      {/* =====================================================
          TEST OVERVIEW
      ====================================================== */}

      <section className="mb-6 rounded-xl border border-[#E4E7EC] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#E4E7EC] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="mb-1 text-[12px] font-medium text-[#667085]">Test Name</p>

            <h2 className="text-[20px] font-semibold text-[#101828]">{test.name}</h2>
          </div>

          <button
            type="button"
            onClick={handleEditTest}
            title="Edit test details"
            className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#D0D5DD] bg-white px-4 text-[13px] font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
          >
            <Pencil size={15} />
            Edit Test
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          <OverviewItem label="Subject" value={test.subject} />

          <OverviewItem label="Topics" value={test.topics.join(', ')} />

          <OverviewItem label="Sub Topics" value={test.sub_topics.join(', ')} />

          <OverviewItem label="Test Type" value={formatValue(test.type)} />

          <OverviewItem label="Difficulty" value={formatValue(test.difficulty)} />

          <OverviewItem label="Total Questions" value={String(test.total_questions)} />

          <OverviewItem label="Total Marks" value={String(test.total_marks)} />

          <OverviewItem label="Total Time" value={`${test.total_time} Minutes`} />
        </div>

        {/* MARKING SCHEME */}

        <div className="border-t border-[#E4E7EC] p-5 sm:p-6">
          <h3 className="mb-4 text-[14px] font-semibold text-[#344054]">Marking Scheme</h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MarkingItem label="Correct Answer" value={`+${test.correct_marks}`} />

            <MarkingItem label="Wrong Answer" value={String(test.wrong_marks)} />

            <MarkingItem label="Unattempted" value={String(test.unattempt_marks)} />
          </div>
        </div>
      </section>

      {/* =====================================================
          QUESTIONS HEADER
      ====================================================== */}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[17px] font-semibold text-[#101828]">Questions</h2>

          <p className="mt-1 text-[13px] text-[#667085]">
            {test.previewQuestions.length} questions added for preview.
          </p>
        </div>

        <button
          type="button"
          onClick={handleEditQuestions}
          className="inline-flex h-9 w-fit cursor-pointer items-center gap-2 rounded-lg border border-[#D0D5DD] bg-white px-4 text-[13px] font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
        >
          <Edit3 size={15} />
          Edit Questions
        </button>
      </div>

      {/* =====================================================
          QUESTIONS
      ====================================================== */}

      <section className="space-y-4">
        {test.previewQuestions.map((question, index) => {
          const isExpanded = expandedQuestions.includes(question.id);

          return (
            <QuestionPreviewCard
              key={question.id}
              question={question}
              index={index}
              expanded={isExpanded}
              onToggle={() => toggleQuestion(question.id)}
            />
          );
        })}
      </section>

      {/* =====================================================
          BOTTOM ACTIONS
      ====================================================== */}

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#E4E7EC] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#D0D5DD] bg-white px-5 text-[14px] font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
        >
          <ChevronLeft size={17} />
          Back to Questions
        </button>

        <Button type="button" onClick={handlePublish} className="!h-11 !w-auto !px-7">
          <span className="inline-flex items-center gap-2">
            <Eye size={17} />
            Publish Test
          </span>
        </Button>
      </div>
    </main>
  );
}

/* =========================================================
   QUESTION PREVIEW CARD
========================================================= */

interface QuestionPreviewCardProps {
  question: Question;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}

function QuestionPreviewCard({ question, index, expanded, onToggle }: QuestionPreviewCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-[#E4E7EC] bg-white">
      {/* QUESTION HEADER */}

      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-start gap-4 p-5 text-left transition hover:bg-[#FAFBFC] sm:p-6"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[12px] font-semibold text-[#5B8DEF]">
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-[#F2F4F7] px-2 py-1 text-[11px] font-medium text-[#475467]">
              MCQ
            </span>

            {question.difficulty && (
              <span className="rounded-md bg-[#ECFDF3] px-2 py-1 text-[11px] font-medium text-[#027A48]">
                {formatValue(question.difficulty)}
              </span>
            )}
          </div>

          <p
            title={question.question}
            className={`text-[14px] font-medium leading-6 text-[#344054] ${
              expanded ? '' : 'line-clamp-2'
            }`}
          >
            {question.question}
          </p>
        </div>

        <ChevronDown
          size={18}
          className={`mt-1 shrink-0 text-[#667085] transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* EXPANDED CONTENT */}

      {expanded && (
        <div className="border-t border-[#E4E7EC] p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <OptionPreview
              label="A"
              value={question.option1}
              correct={question.correct_option === 'option1'}
            />

            <OptionPreview
              label="B"
              value={question.option2}
              correct={question.correct_option === 'option2'}
            />

            <OptionPreview
              label="C"
              value={question.option3}
              correct={question.correct_option === 'option3'}
            />

            <OptionPreview
              label="D"
              value={question.option4}
              correct={question.correct_option === 'option4'}
            />
          </div>

          {question.explanation && (
            <div className="mt-5 rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] p-4">
              <p className="mb-1 text-[12px] font-semibold text-[#475467]">Explanation</p>

              <p className="text-[13px] leading-5 text-[#667085]">{question.explanation}</p>
            </div>
          )}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {question.subject && <MetaItem label="Subject" value={question.subject} />}

            {question.topic && <MetaItem label="Topic" value={question.topic} />}

            {question.sub_topic && <MetaItem label="Sub Topic" value={question.sub_topic} />}
          </div>
        </div>
      )}
    </article>
  );
}

/* =========================================================
   OPTION PREVIEW
========================================================= */

interface OptionPreviewProps {
  label: string;
  value: string;
  correct: boolean;
}

function OptionPreview({ label, value, correct }: OptionPreviewProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
        correct ? 'border-[#A7F3D0] bg-[#ECFDF3]' : 'border-[#EAECF0] bg-white'
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${
          correct ? 'bg-[#10B981] text-white' : 'bg-[#F2F4F7] text-[#667085]'
        }`}
      >
        {label}
      </span>

      <p title={value} className="min-w-0 flex-1 truncate text-[13px] text-[#344054]">
        {value}
      </p>

      {correct && <span className="shrink-0 text-[11px] font-medium text-[#047857]">Correct</span>}
    </div>
  );
}

/* =========================================================
   OVERVIEW ITEM
========================================================= */

function OverviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#EAECF0] px-4 py-3">
      <p className="mb-1 text-[11px] text-[#98A2B3]">{label}</p>

      <p title={value} className="truncate text-[14px] font-medium text-[#344054]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   MARKING ITEM
========================================================= */

function MarkingItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#EAECF0] bg-[#FAFBFC] px-4 py-3">
      <p className="mb-1 text-[11px] text-[#98A2B3]">{label}</p>

      <p className="text-[16px] font-semibold text-[#344054]">{value}</p>
    </div>
  );
}

/* =========================================================
   META ITEM
========================================================= */

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-[11px] text-[#98A2B3]">{label}</p>

      <p title={value} className="truncate text-[13px] font-medium text-[#475467]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   FORMAT VALUE
========================================================= */

function formatValue(value: string) {
  return value.replace(/[-_]/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

export default PreviewPage;
