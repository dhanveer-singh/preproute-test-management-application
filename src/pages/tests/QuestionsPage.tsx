import { zodResolver } from '@hookform/resolvers/zod';

import { ChevronDown, ChevronLeft, ChevronRight, Download, Plus, Trash2 } from 'lucide-react';

import { useMemo, useState } from 'react';

import type { UseFormRegisterReturn } from 'react-hook-form';

import { useForm } from 'react-hook-form';

import { useNavigate, useParams } from 'react-router-dom';

import Breadcrumb from '@/components/Breadcrumb';
import Button from '@/components/Button';

import FRONTEND_ROUTES from '@/constants/frontendRoutes';

import { QUESTION_DIFFICULTY_OPTIONS } from '@/constants/question';

import { MOCK_QUESTIONS } from '@/mockData/questionData';

import { MOCK_SUB_TOPICS, MOCK_TOPICS } from '@/mockData/testData';

import { questionSchema } from '@/schemas/question.schema';

import type { QuestionFormData, QuestionListItem } from '@/types/question';

function QuestionsPage() {
  const navigate = useNavigate();
  const { id: testId } = useParams();

  const [currentQuestion, setCurrentQuestion] = useState(1);

  const [savedQuestions, setSavedQuestions] = useState<QuestionListItem[]>(MOCK_QUESTIONS);

  const totalQuestions = 50;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),

    defaultValues: {
      question: '',

      option1: '',
      option2: '',
      option3: '',
      option4: '',

      correctOption: '',

      explanation: '',

      difficulty: 'easy',

      topic: '',
      subTopic: '',

      mediaUrl: '',
    },
  });

  const selectedTopic = watch('topic');

  const selectedSubject = 'c495e328-066c-4ae5-a959-4bb9f3e357d7';

  const topics = useMemo(
    () => MOCK_TOPICS.filter((topic) => topic.subject_id === selectedSubject),
    [],
  );

  const subTopics = useMemo(
    () => MOCK_SUB_TOPICS.filter((subTopic) => subTopic.topic_id === selectedTopic),
    [selectedTopic],
  );

  const handleSaveQuestion = (data: QuestionFormData) => {
    const newQuestion: QuestionListItem = {
      id: `question-${Date.now()}`,
      question: data.question,
      option1: data.option1,
      option2: data.option2,
      option3: data.option3,
      option4: data.option4,
      correctOption: data.correctOption as 'option1' | 'option2' | 'option3' | 'option4',
    };

    setSavedQuestions((previous) => [...previous, newQuestion]);

    /*
     * API PLACEHOLDER
     *
     * Later:
     *
     * POST /questions/bulk
     *
     * {
     *   questions: [...]
     * }
     */

    console.log('Question:', data);
  };

  const handleAddAnother = () => {
    setCurrentQuestion(Math.min(currentQuestion + 1, totalQuestions));
  };

  const handlePrevious = () => {
    setCurrentQuestion((previous) => Math.max(previous - 1, 1));
  };

  const handleNext = () => {
    setCurrentQuestion((previous) => Math.min(previous + 1, totalQuestions));
  };

  const handleDeleteQuestion = (questionId: string) => {
    setSavedQuestions((previous) => previous.filter((question) => question.id !== questionId));
  };

  const handleContinue = () => {
    /*
     * API PLACEHOLDER
     *
     * Questions will first be persisted using:
     *
     * POST /questions/bulk
     *
     * Then navigate to preview.
     */

    navigate(FRONTEND_ROUTES.TESTS.PREVIEW(testId ?? 'mock-test-id'));
  };

  const handleExit = () => {
    navigate(FRONTEND_ROUTES.DASHBOARD);
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
            active: true,
          },
        ]}
      />

      {/* =====================================================
          TEST SUMMARY
      ====================================================== */}

      <section className="mb-6 rounded-xl border border-[#E4E7EC] bg-white p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#100C3D] px-3 py-1 text-[12px] font-medium text-white">
                Chapter Wise
              </span>

              <span className="rounded-full bg-[#D1FAE5] px-3 py-1 text-[12px] font-medium text-[#047857]">
                Easy
              </span>
            </div>

            <h1 className="text-[20px] font-semibold text-[#101828]">Chapter 1</h1>
          </div>

          <button
            type="button"
            title="Edit test"
            className="cursor-pointer rounded-lg p-2 text-[#5B8DEF] transition hover:bg-[#F2F4FF]"
          >
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 text-[13px] sm:grid-cols-2 lg:grid-cols-4">
          <SummaryItem label="Subject" value="Maths" />

          <SummaryItem label="Topic" value="Geometry" />

          <SummaryItem label="Sub Topic" value="Circles" />

          <div className="flex items-center justify-start gap-4 rounded-lg border border-[#EAECF0] px-4 py-3 text-[#475467]">
            <span>
              <strong className="text-[#101828]">60</strong> Min
            </span>

            <span className="h-5 w-px bg-[#D0D5DD]" />

            <span>
              <strong className="text-[#101828]">50</strong> Q's
            </span>

            <span className="h-5 w-px bg-[#D0D5DD]" />

            <span>
              <strong className="text-[#101828]">250</strong> Marks
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUESTION HEADER
      ====================================================== */}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[16px] font-semibold text-[#101828]">
          Question <span className="text-[#5B8DEF]">{currentQuestion}</span>
          <span className="font-normal text-[#667085]">/{totalQuestions}</span>
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[#E4E7EC] bg-white px-3 text-[13px] font-medium text-[#475467] hover:bg-[#F9FAFB]"
          >
            <Plus size={15} />
            MCQ
          </button>

          <button
            type="button"
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[#E4E7EC] bg-white px-3 text-[13px] font-medium text-[#475467] hover:bg-[#F9FAFB]"
          >
            <Download size={15} />
            CSV
          </button>
        </div>
      </div>

      {/* =====================================================
          QUESTION FORM
      ====================================================== */}

      <form
        onSubmit={handleSubmit(handleSaveQuestion)}
        className="rounded-xl border border-[#E4E7EC] bg-white p-4 sm:p-6"
      >
        {/* Delete all edits */}

        <div className="mb-4">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#F04438] hover:text-[#D92D20]"
          >
            <Trash2 size={15} />
            Delete All Edits
          </button>
        </div>

        {/* Question */}

        <FormLabel label="Question" required />

        <textarea
          {...register('question')}
          placeholder="Type your question here"
          rows={5}
          className={`mb-6 w-full resize-y rounded-lg border bg-white px-4 py-3 text-[14px] text-[#344054] outline-none placeholder:text-[#98A2B3] focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF] ${
            errors.question ? 'border-[#F04438]' : 'border-[#D0D5DD]'
          }`}
        />

        {errors.question && <ErrorText>{errors.question.message}</ErrorText>}

        {/* ===================================================
            OPTIONS
        ==================================================== */}

        <div className="mb-7">
          <h3 className="mb-3 text-[14px] font-semibold text-[#101828]">Type the options below</h3>

          <div className="space-y-3">
            <OptionField
              option="option1"
              label="A"
              register={register('option1')}
              error={errors.option1?.message}
              correctOption={watch('correctOption')}
              onSelect={() =>
                setValue('correctOption', 'option1', {
                  shouldValidate: true,
                })
              }
            />

            <OptionField
              option="option2"
              label="B"
              register={register('option2')}
              error={errors.option2?.message}
              correctOption={watch('correctOption')}
              onSelect={() =>
                setValue('correctOption', 'option2', {
                  shouldValidate: true,
                })
              }
            />

            <OptionField
              option="option3"
              label="C"
              register={register('option3')}
              error={errors.option3?.message}
              correctOption={watch('correctOption')}
              onSelect={() =>
                setValue('correctOption', 'option3', {
                  shouldValidate: true,
                })
              }
            />

            <OptionField
              option="option4"
              label="D"
              register={register('option4')}
              error={errors.option4?.message}
              correctOption={watch('correctOption')}
              onSelect={() =>
                setValue('correctOption', 'option4', {
                  shouldValidate: true,
                })
              }
            />
          </div>
        </div>

        {/* ===================================================
            EXPLANATION
        ==================================================== */}

        <div className="mb-7">
          <FormLabel label="Add Solution" />

          <textarea
            {...register('explanation')}
            placeholder="Type explanation here"
            rows={5}
            className="w-full resize-y rounded-lg border border-[#D0D5DD] px-4 py-3 text-[14px] text-[#344054] outline-none placeholder:text-[#98A2B3] focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF]"
          />
        </div>

        {/* ===================================================
            QUESTION SETTINGS
        ==================================================== */}

        <section className="border-t border-[#E4E7EC] pt-6">
          <h3 className="mb-5 text-[15px] font-semibold text-[#344054]">Question Settings</h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <SelectField
              label="Level of Difficulty"
              register={register('difficulty')}
              options={QUESTION_DIFFICULTY_OPTIONS}
            />

            <SelectField
              label="Topic"
              register={register('topic')}
              options={topics.map((topic) => ({
                value: topic.id,
                label: topic.name,
              }))}
            />

            <SelectField
              label="Sub-topic"
              register={register('subTopic')}
              options={subTopics.map((subTopic) => ({
                value: subTopic.id,
                label: subTopic.name,
              }))}
            />

            <div>
              <FormLabel label="Media URL" />

              <input
                type="text"
                {...register('mediaUrl')}
                placeholder="Enter media URL"
                className="h-11 w-full rounded-lg border border-[#D0D5DD] px-4 text-[14px] text-[#344054] outline-none placeholder:text-[#98A2B3] focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF]"
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            QUESTION NAVIGATION
        ==================================================== */}

        <div className="mt-7 flex items-center justify-between border-t border-[#E4E7EC] pt-5">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentQuestion === 1}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#D0D5DD] bg-white px-4 text-[13px] font-medium text-[#475467] hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={17} />
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentQuestion === totalQuestions}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#D0D5DD] bg-white px-4 text-[13px] font-medium text-[#475467] hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight size={17} />
          </button>
        </div>

        {/* ===================================================
            BOTTOM ACTIONS
        ==================================================== */}

        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#E4E7EC] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg bg-[#FF6B6B] px-6 text-[14px] font-medium text-white transition hover:bg-[#F45B5B]"
          >
            Exit Test Creation
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAddAnother}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#D0D5DD] bg-white px-6 text-[14px] font-medium text-[#344054] hover:bg-[#F9FAFB]"
            >
              <Plus size={17} />
              Add Another Question
            </button>

            <Button type="submit" className="!h-11 !w-auto !px-7">
              Save Question
            </Button>

            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg bg-[#6F86F7] px-7 text-[14px] font-medium text-white transition hover:bg-[#5F77EA]"
            >
              Save & Continue
            </button>
          </div>
        </div>
      </form>

      {/* =====================================================
          SAVED QUESTIONS
      ====================================================== */}

      {savedQuestions.length > 0 && (
        <section className="mt-6 rounded-xl border border-[#E4E7EC] bg-white p-4 sm:p-6">
          <h3 className="mb-4 text-[15px] font-semibold text-[#344054]">Added Questions</h3>

          <div className="space-y-2">
            {savedQuestions.map((question, index) => (
              <div
                key={question.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-[#EAECF0] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-[#667085]">Question {index + 1}</p>

                  <p title={question.question} className="truncate text-[13px] text-[#344054]">
                    {question.question}
                  </p>
                </div>

                <button
                  type="button"
                  title="Delete question"
                  onClick={() => handleDeleteQuestion(question.id)}
                  className="shrink-0 cursor-pointer rounded-md p-2 text-[#F04438] hover:bg-[#FEF3F2]"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

/* =========================================================
   SUMMARY ITEM
========================================================= */

function SummaryItem({ label, value }: { label: string; value: string }) {
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
   FORM LABEL
========================================================= */

function FormLabel({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <label className="mb-2 block text-[13px] font-medium text-[#344054]">
      {label}

      {required && <span className="ml-1 text-[#F04438]">*</span>}
    </label>
  );
}

/* =========================================================
   ERROR
========================================================= */

function ErrorText({ children }: { children?: React.ReactNode }) {
  return <p className="mb-3 text-[12px] text-[#F04438]">{children}</p>;
}

/* =========================================================
   OPTION FIELD
========================================================= */

interface OptionFieldProps {
  option: 'option1' | 'option2' | 'option3' | 'option4';

  label: string;

  register: UseFormRegisterReturn;

  error?: string;

  correctOption: 'option1' | 'option2' | 'option3' | 'option4' | '';

  onSelect: () => void;
}

function OptionField({
  option,
  label,
  register,
  error,
  correctOption,
  onSelect,
}: OptionFieldProps) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name="correct-option"
          checked={correctOption === option}
          onChange={onSelect}
          className="h-4 w-4 cursor-pointer accent-[#5B8DEF]"
          title={`Mark option ${label} as correct`}
        />

        <span className="w-5 shrink-0 text-[13px] font-medium text-[#475467]">{label}</span>

        <input
          type="text"
          placeholder="Type option here"
          {...register}
          className={`h-11 min-w-0 flex-1 rounded-lg border px-4 text-[14px] text-[#344054] outline-none placeholder:text-[#98A2B3] focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF] ${
            error ? 'border-[#F04438]' : 'border-[#D0D5DD]'
          }`}
        />

        <button
          type="button"
          title={`Delete option ${label}`}
          className="cursor-pointer rounded-md p-2 text-[#98A2B3] hover:bg-[#F9FAFB] hover:text-[#F04438]"
        >
          <Trash2 size={17} />
        </button>
      </div>

      {error && <p className="ml-12 mt-1 text-[12px] text-[#F04438]">{error}</p>}
    </div>
  );
}

/* =========================================================
   SELECT FIELD
========================================================= */
interface SelectFieldProps {
  label: string;

  register: UseFormRegisterReturn;

  options: {
    value: string;
    label: string;
  }[];
}
function SelectField({ label, register, options }: SelectFieldProps) {
  return (
    <div>
      <FormLabel label={label} />

      <div className="relative">
        <select
          {...register}
          className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-[#D0D5DD] bg-white px-4 pr-10 text-[14px] text-[#344054] outline-none focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF]"
        >
          <option value="">Select from Drop-down</option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
        />
      </div>
    </div>
  );
}

export default QuestionsPage;
