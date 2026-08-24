import { zodResolver } from '@hookform/resolvers/zod';
import {
  BarChart3,
  BookCheck,
  ChevronDown,
  Clock,
  Edit2,
  FileQuestion,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import Breadcrumb from '@/components/Breadcrumb';
import Button from '@/components/Button';

import FRONTEND_ROUTES from '@/constants/frontendRoutes';
import { DIFFICULTY_OPTIONS } from '@/constants/test';

import { getSubTopicsByTopics, getTopicsBySubject } from '@/services/topicApi';

import { createQuestionsBulk } from '@/services/questionApi';

import { showError, showSuccess, showWarning } from '@/utils/toast';

import { getTestById } from '@/services/testApi';
import { getSubjects } from '@/services/subjectApi';

import { questionSchema, type QuestionFormData } from '@/schemas/question.schema';

import type { SubTopic, Test, Topic } from '@/types/test';

import type { Question } from '@/types/question';
import axios from 'axios';

/* =========================================================
   PAGE
========================================================= */

function QuestionsPage() {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  /* =========================================================
     FORM
  ========================================================= */

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),

    defaultValues: {
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctOption: 'option1',
      explanation: '',
      difficulty: 'easy',
      topic: '',
      subTopic: '',
      mediaUrl: '',
    },
  });

  /* =========================================================
     STATE
  ========================================================= */

  const [test, setTest] = useState<Test | null>(null);

  const [subjectId, setSubjectId] = useState<string>('');

  const [topics, setTopics] = useState<Topic[]>([]);

  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);

  const [questions, setQuestions] = useState<Question[]>([]);

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const [isTestLoading, setIsTestLoading] = useState(true);

  const [isTopicsLoading, setIsTopicsLoading] = useState(false);

  const [isSubTopicsLoading, setIsSubTopicsLoading] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [isContinueLoading, setIsContinueLoading] = useState(false);

  const [pageError, setPageError] = useState<string | null>(null);

  /* =========================================================
     WATCH
  ========================================================= */

  const selectedTopic = watch('topic');

  /* =========================================================
     FETCH TEST
  ========================================================= */
  useEffect(() => {
    if (!id) {
      setPageError('Test ID is missing.');
      setIsTestLoading(false);
      return;
    }

    let mounted = true;

    const fetchTest = async () => {
      try {
        setIsTestLoading(true);
        setPageError(null);

        const data = await getTestById(id);

        if (!mounted) {
          return;
        }

        setTest(data);
      } catch (error) {
        console.error('Failed to fetch test:', error);

        if (!mounted) {
          return;
        }

        setTest(null);
        setPageError('Unable to load test details.');

        showError('Unable to load test details.');
      } finally {
        if (mounted) {
          setIsTestLoading(false);
        }
      }
    };

    fetchTest();

    return () => {
      mounted = false;
    };
  }, [id]);

  /* =========================================================
   RESOLVE SUBJECT ID
========================================================= */

  useEffect(() => {
    if (!test?.subject) {
      setSubjectId('');
      return;
    }

    let mounted = true;

    const resolveSubjectId = async () => {
      try {
        const subjects = await getSubjects();

        if (!mounted) {
          return;
        }

        const testSubject = String(test.subject).trim().toLowerCase();

        const matchedSubject = subjects.find(
          (subject) =>
            subject.id === test.subject || subject.name.trim().toLowerCase() === testSubject,
        );

        if (!matchedSubject) {
          console.error('Subject not found:', test.subject);

          setSubjectId('');

          showError(`Subject "${test.subject}" could not be found.`);

          return;
        }

        console.log('Resolved subject:', matchedSubject);

        setSubjectId(matchedSubject.id);
      } catch (error) {
        console.error('Failed to resolve subject:', error);

        if (!mounted) {
          return;
        }

        setSubjectId('');

        showError('Unable to load subject information.');
      }
    };

    resolveSubjectId();

    return () => {
      mounted = false;
    };
  }, [test?.subject]);

  /* =========================================================
   FETCH TOPICS
========================================================= */

  useEffect(() => {
    if (!subjectId) {
      setTopics([]);
      setIsTopicsLoading(false);
      return;
    }

    let mounted = true;

    const fetchTopics = async () => {
      try {
        setIsTopicsLoading(true);

        console.log('Fetching topics for subject ID:', subjectId);

        const data = await getTopicsBySubject(subjectId);

        console.log('Topics fetched:', data);

        if (!mounted) {
          return;
        }

        setTopics(data);
      } catch (error) {
        console.error('Failed to fetch topics:', error);

        if (!mounted) {
          return;
        }

        setTopics([]);

        showError('Unable to load topics.');
      } finally {
        if (mounted) {
          setIsTopicsLoading(false);
        }
      }
    };

    fetchTopics();

    return () => {
      mounted = false;
    };
  }, [subjectId]);

  /* =========================================================
   FETCH SUB-TOPICS BY SELECTED TOPIC
========================================================= */
  useEffect(() => {
    if (!selectedTopic) {
      setSubTopics([]);
      setIsSubTopicsLoading(false);
      setValue('subTopic', '');
      return;
    }

    let mounted = true;

    const fetchSubTopics = async () => {
      try {
        setIsSubTopicsLoading(true);

        console.log('SUBTOPIC REQUEST:', selectedTopic);
        console.log('Sub-topic payload:', {
          topicIds: [selectedTopic],
        });

        const data = await getSubTopicsByTopics([selectedTopic]);

        console.log('SUBTOPIC RESPONSE:', data);

        if (!mounted) {
          return;
        }

        setSubTopics(data);
      } catch (error) {
        console.error('Failed to fetch sub-topics:', error);

        if (!mounted) {
          return;
        }

        setSubTopics([]);

        showError('Unable to load sub-topics.');
      } finally {
        if (mounted) {
          setIsSubTopicsLoading(false);
        }
      }
    };

    fetchSubTopics();

    return () => {
      mounted = false;
    };
  }, [selectedTopic, setValue]);

  /* =========================================================
     RESET QUESTION FORM
  ========================================================= */

  const resetQuestionForm = () => {
    reset({
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctOption: 'option1',
      explanation: '',
      difficulty: 'easy',
      topic: '',
      subTopic: '',
      mediaUrl: '',
    });

    setEditingQuestionId(null);

    setSubTopics([]);
  };

  /* =========================================================
     ADD / UPDATE QUESTION
  ========================================================= */

  const handleQuestionSubmit = async (data: QuestionFormData) => {
    if (!id) {
      return;
    }

    /*
     * Editing an already-added question
     * only changes the local list.
     *
     * All questions are submitted through
     * /questions/bulk.
     */

    if (editingQuestionId) {
      setQuestions((previous) =>
        previous.map((question) =>
          question.id === editingQuestionId
            ? {
                ...question,
                question: data.question,
                option1: data.option1,
                option2: data.option2,
                option3: data.option3,
                option4: data.option4,

                correct_option: data.correctOption as Question['correct_option'],

                explanation: data.explanation || null,

                difficulty: data.difficulty ? (data.difficulty as Question['difficulty']) : null,

                topic: data.topic || null,

                sub_topic: data.subTopic || null,

                media_url: data.mediaUrl || null,
              }
            : question,
        ),
      );

      resetQuestionForm();
      showSuccess('Question updated successfully.');
      return;
    }

    const newQuestion: Question = {
      id: crypto.randomUUID(),

      type: 'mcq',

      question: data.question,

      option1: data.option1,
      option2: data.option2,
      option3: data.option3,
      option4: data.option4,

      correct_option: data.correctOption,

      explanation: data.explanation || null,

      difficulty: data.difficulty || null,

      paragraph: null,

      media_url: data.mediaUrl || null,

      created_by: 0,
      created_at: '',
      updated_by: null,
      updated_at: null,

      test_id: id!,

      category: null,

      subject: test?.subject ?? '',

      topic: data.topic || null,

      sub_topic: data.subTopic || null,
    };
    setQuestions((previous) => [...previous, newQuestion]);

    resetQuestionForm();

    showSuccess('Question added successfully.');
  };

  /* =========================================================
     EDIT QUESTION
  ========================================================= */

  const handleEditQuestion = (question: Question) => {
    setEditingQuestionId(question.id);

    reset({
      question: question.question,

      option1: question.option1,

      option2: question.option2,

      option3: question.option3,

      option4: question.option4,

      correctOption: question.correct_option,

      explanation: question.explanation ?? '',

      difficulty: question.difficulty ?? 'easy',

      topic: question.topic ?? '',

      subTopic: question.sub_topic ?? '',

      mediaUrl: question.media_url ?? '',
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /* =========================================================
     DELETE QUESTION
  ========================================================= */

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions((previous) => previous.filter((question) => question.id !== questionId));

    if (editingQuestionId === questionId) {
      resetQuestionForm();
    }

    showSuccess('Question deleted successfully.');
  };

  /* =========================================================
      SAVE QUESTIONS
    ========================================================= */

  const handleSaveQuestions = async (): Promise<boolean> => {
    if (!id) {
      showError('Test ID is missing.');
      return false;
    }

    if (questions.length === 0) {
      showError('Please add at least one question before continuing.');

      return false;
    }

    try {
      setIsSaving(true);

      const payload = questions.map((question) => ({
        type: 'mcq' as const,

        question: question.question,

        option1: question.option1,
        option2: question.option2,
        option3: question.option3,
        option4: question.option4,

        correct_option: question.correct_option,

        explanation: question.explanation ?? undefined,

        difficulty: question.difficulty ?? undefined,

        subject: question.subject,

        topic: question.topic ?? undefined,

        sub_topic: question.sub_topic ?? undefined,

        media_url: question.media_url ?? undefined,

        test_id: id,
      }));

      await createQuestionsBulk(payload);

      showSuccess('Questions saved successfully.');

      return true;
    } catch (error) {
      console.error('Failed to save questions:', error);

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        showError(
          typeof message === 'string' ? message : 'Unable to save questions. Please try again.',
        );
      } else {
        showError('Unable to save questions. Please try again.');
      }

      return false;
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================================================
   SAVE & CONTINUE
========================================================= */

  const handleContinue = async () => {
    if (!id) {
      showError('Test ID is missing.');

      return;
    }

    if (questions.length === 0) {
      showWarning('Please add at least one question before continuing.');

      return;
    }

    try {
      setIsContinueLoading(true);

      const saved = await handleSaveQuestions();

      if (!saved) {
        return;
      }

      navigate(FRONTEND_ROUTES.TESTS.PREVIEW(id));
    } catch (error) {
      console.error('Failed to continue:', error);

      showError('Unable to continue. Please try again.');
    } finally {
      setIsContinueLoading(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (isTestLoading) {
    return (
      <main className="min-h-full bg-[#F8FAFD] px-4 py-6 sm:px-6">
        <div
          className="absolute
        inset-0
        z-30
        flex
        items-center
        justify-center
        rounded-xl
        bg-black/25
        backdrop-blur-[2px]"
        >
          <BrandLoader size={58} />
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (pageError || !test) {
    return (
      <main className="min-h-full bg-[#F8FAFD] px-4 py-6 sm:px-6">
        <div className="rounded-xl border border-[#FECACA] bg-white p-6">
          <p className="text-[14px] text-[#B42318]">{pageError ?? 'Test not found.'}</p>

          <button
            type="button"
            onClick={() => navigate(FRONTEND_ROUTES.DASHBOARD)}
            className="mt-4 text-[13px] font-medium text-[#315BEF]"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="min-h-full min-w-0 bg-[#F8FAFD] px-4 py-5 sm:px-6 sm:py-7">
      {/* =====================================================
          BREADCRUMB
      ====================================================== */}

      <Breadcrumb
        items={[
          {
            label: 'Test Creation',
          },
          {
            label: test.name,
          },
          {
            label: 'Add Questions',
            active: true,
          },
        ]}
      />

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-[#101828] sm:text-[24px]">Add Questions</h1>

        <p className="mt-1 text-[13px] text-[#667085] sm:text-[14px]">
          Add questions to your test before publishing it.
        </p>
      </div>

      {/* =====================================================
    TEST SUMMARY
====================================================== */}

      <section
        className="
    mb-6
    rounded-xl
    border
    border-[#E4E7EC]
    bg-white
    px-6
    py-5
    sm:px-7
    sm:py-6
  "
      >
        {/* =================================================
      TOP ROW — TYPE + EDIT
  ================================================== */}

        <div className="flex items-start justify-between">
          {/* Test Type */}

          <span
            className="
        inline-flex
        items-center
        rounded-full
        bg-[#0D0B4F]
        px-3
        py-1
        text-[13px]
        font-medium
        leading-5
        text-white
      "
          >
            {test.type === 'chapterwise' ? 'Chapter Wise' : test.type || 'Chapter Wise'}
          </span>

          {/* Edit */}

          <button
            type="button"
            onClick={() => navigate(`/tests/${test.id}/edit`)}
            className="
        mt-0.5
        flex
        h-8
        w-8
        cursor-pointer
        items-center
        justify-center
        rounded-md
        text-[#7594FF]
        transition
        hover:bg-[#F5F7FF]
        hover:text-[#315BEF]
        active:scale-95
      "
            aria-label="Edit test"
            title="Edit test"
          >
            <Pencil size={23} strokeWidth={2} />
          </button>
        </div>

        {/* =================================================
      CHAPTER / TEST NAME + DIFFICULTY
  ================================================== */}

        <div className="mt-5 flex items-center gap-3">
          {/* Chapter Icon */}

          <div className="flex h-7 w-7 shrink-0 items-center justify-center">
            <BookCheck />
          </div>

          {/* Test Name */}

          <h2 className="text-[20px] font-semibold leading-7 text-[#101828]">{test.name || '—'}</h2>

          {/* Difficulty */}

          {test.difficulty && (
            <span
              className="
          inline-flex
          h-8
          items-center
          rounded-lg
          bg-[#2CB9AD]
          px-5
          text-[14px]
          font-medium
          capitalize
          text-white
        "
            >
              {test.difficulty}
            </span>
          )}
        </div>

        {/* =================================================
      DETAILS
  ================================================== */}

        <div className="mt-6 space-y-5">
          {/* =================================================
        SUBJECT
    ================================================== */}

          <div className="flex items-center">
            <span
              className="
          w-[125px]
          shrink-0
          text-[14px]
          font-normal
          text-[#98A2B3]
        "
            >
              Subject
            </span>

            <span className="mr-2 text-[14px] text-[#98A2B3]">:</span>

            <span className="text-[16px] font-medium text-[#6B7280]">{test.subject || '—'}</span>
          </div>

          {/* =================================================
        TOPIC
    ================================================== */}

          <div className="flex items-start">
            <span
              className="
          w-[125px]
          shrink-0
          pt-1
          text-[14px]
          font-normal;
          text-[#98A2B3]
        "
            >
              Topic
            </span>

            <span className="mr-2 pt-1 text-[14px] text-[#98A2B3]">:</span>

            <div className="flex flex-wrap gap-2">
              {Array.isArray(test.topics) && test.topics.length > 0 ? (
                test.topics.map((topic) => (
                  <span
                    key={topic}
                    className="
                inline-flex
                items-center
                rounded-lg
                border
                border-[#F5C451]
                bg-white
                px-3
                py-1
                text-[14px]
                font-medium
                leading-5
                text-[#F2A900]
              "
                  >
                    {topic}
                  </span>
                ))
              ) : (
                <span className="pt-1 text-[14px] text-[#98A2B3]">—</span>
              )}
            </div>
          </div>

          {/* =================================================
        SUB TOPIC
    ================================================== */}

          <div className="flex items-start">
            <span
              className="
          w-[125px]
          shrink-0
          pt-1
          text-[14px]
          font-normal
          text-[#98A2B3]
        "
            >
              Sub Topic
            </span>

            <span className="mr-2 pt-1 text-[14px] text-[#98A2B3]">:</span>

            <div className="flex flex-wrap gap-2">
              {Array.isArray(test.sub_topics) && test.sub_topics.length > 0 ? (
                test.sub_topics.map((subTopic) => (
                  <span
                    key={subTopic}
                    className="
                inline-flex
                items-center
                rounded-lg
                border
                border-[#F5C451]
                bg-white
                px-3
                py-1
                text-[14px]
                font-medium
                leading-5
                text-[#F2A900]
              "
                  >
                    {subTopic}
                  </span>
                ))
              ) : (
                <span className="pt-1 text-[14px] text-[#98A2B3]">—</span>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
      STATS — BOTTOM RIGHT
  ================================================== */}

        <div className="mt-5 flex justify-end">
          <div
            className="
        flex
        items-center
        overflow-hidden
        rounded-xl
        border
        border-[#E4E7EC]
        bg-white
      "
          >
            {/* =================================================
          TIME
      ================================================== */}

            <div className="flex items-center gap-2 px-3 py-2">
              <Clock size={18} strokeWidth={1.7} className="text-[#98A2B3]" />

              <span className="whitespace-nowrap text-[14px] font-medium text-[#475467]">
                {test.total_time ?? 0} Min
              </span>
            </div>

            {/* Divider */}

            <div className="h-6 w-px bg-[#E4E7EC]" />

            {/* =================================================
          QUESTIONS
      ================================================== */}

            <div className="flex items-center gap-2 px-3 py-2">
              <FileQuestion size={18} strokeWidth={1.7} className="text-[#98A2B3]" />

              <span className="whitespace-nowrap text-[14px] font-medium text-[#475467]">
                {test.total_questions ?? questions.length} Q&apos;s
              </span>
            </div>

            {/* Divider */}

            <div className="h-6 w-px bg-[#E4E7EC]" />

            {/* =================================================
          MARKS
      ================================================== */}

            <div className="flex items-center gap-2 px-3 py-2">
              <BarChart3 size={18} strokeWidth={1.7} className="text-[#98A2B3]" />

              <span className="whitespace-nowrap text-[14px] font-medium text-[#475467]">
                {test.total_marks ?? 0} Marks
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* =====================================================
          QUESTION FORM
      ====================================================== */}

      <form
        onSubmit={handleSubmit(handleQuestionSubmit)}
        className="rounded-xl border border-[#E4E7EC] bg-white"
      >
        {/* ===================================================
            FORM HEADER
        ==================================================== */}

        <div className="flex items-center justify-between border-b border-[#E4E7EC] px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-[15px] font-semibold text-[#344054]">
              {editingQuestionId ? 'Edit Question' : 'Add Question'}
            </h2>

            <p className="mt-1 text-[12px] text-[#98A2B3]">Create a multiple-choice question.</p>
          </div>

          {editingQuestionId && (
            <button
              type="button"
              onClick={resetQuestionForm}
              className="text-[13px] font-medium text-[#667085] hover:text-[#344054]"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* ===================================================
            FORM BODY
        ==================================================== */}

        <div className="space-y-6 p-4 sm:p-6">
          {/* ================================================
              QUESTION
          ================================================= */}

          <div>
            <label htmlFor="question" className="mb-2 block text-[13px] font-medium text-[#344054]">
              Question
              <span className="ml-1 text-[#F04438]">*</span>
            </label>

            <textarea
              id="question"
              rows={4}
              placeholder="Enter question"
              {...register('question')}
              className={`w-full resize-none rounded-lg border bg-white px-4 py-3 text-[14px] text-[#344054] outline-none placeholder:text-[#98A2B3] focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF] ${
                errors.question ? 'border-[#F04438]' : 'border-[#D0D5DD]'
              }`}
            />

            {errors.question && (
              <p className="mt-1 text-[12px] text-[#F04438]">{errors.question.message}</p>
            )}
          </div>

          {/* ================================================
              OPTIONS
          ================================================= */}

          <div>
            <label className="mb-3 block text-[13px] font-medium text-[#344054]">
              Options
              <span className="ml-1 text-[#F04438]">*</span>
            </label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <OptionField
                id="option1"
                label="Option 1"
                register={register('option1')}
                error={errors.option1?.message}
              />

              <OptionField
                id="option2"
                label="Option 2"
                register={register('option2')}
                error={errors.option2?.message}
              />

              <OptionField
                id="option3"
                label="Option 3"
                register={register('option3')}
                error={errors.option3?.message}
              />

              <OptionField
                id="option4"
                label="Option 4"
                register={register('option4')}
                error={errors.option4?.message}
              />
            </div>
          </div>

          {/* ================================================
              CORRECT OPTION
          ================================================= */}

          <SelectField
            id="correctOption"
            label="Correct Option"
            required
            register={register('correctOption')}
            options={[
              {
                value: 'option1',
                label: 'Option 1',
              },
              {
                value: 'option2',
                label: 'Option 2',
              },
              {
                value: 'option3',
                label: 'Option 3',
              },
              {
                value: 'option4',
                label: 'Option 4',
              },
            ]}
            error={errors.correctOption?.message}
          />

          {/* ================================================
              EXPLANATION
          ================================================= */}

          <div>
            <label
              htmlFor="explanation"
              className="mb-2 block text-[13px] font-medium text-[#344054]"
            >
              Explanation
            </label>

            <textarea
              id="explanation"
              rows={3}
              placeholder="Enter explanation (optional)"
              {...register('explanation')}
              className="w-full resize-none rounded-lg border border-[#D0D5DD] bg-white px-4 py-3 text-[14px] text-[#344054] outline-none placeholder:text-[#98A2B3] focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF]"
            />
          </div>

          {/* ================================================
              DIFFICULTY / TOPIC / SUB TOPIC
          ================================================= */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Difficulty */}

            <SelectField
              id="difficulty"
              label="Difficulty"
              register={register('difficulty')}
              options={DIFFICULTY_OPTIONS}
              error={errors.difficulty?.message}
            />

            {/* Topic */}

            <div>
              <label htmlFor="topic" className="mb-2 block text-[13px] font-medium text-[#344054]">
                Topic
              </label>

              <div className="relative">
                <select
                  id="topic"
                  {...register('topic')}
                  disabled={isTopicsLoading || !subjectId}
                  className={`h-11 w-full cursor-pointer appearance-none rounded-lg border bg-white px-4 pr-10 text-[14px] text-[#344054] outline-none focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF] disabled:cursor-not-allowed disabled:bg-[#F9FAFB] ${
                    errors.topic ? 'border-[#F04438]' : 'border-[#D0D5DD]'
                  }`}
                >
                  <option value="">
                    {isTopicsLoading
                      ? 'Loading topics...'
                      : !subjectId
                        ? 'Loading subject...'
                        : topics.length === 0
                          ? 'No topics available'
                          : 'Select Topic'}
                  </option>

                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
                />
              </div>

              {errors.topic && (
                <p className="mt-1 text-[12px] text-[#F04438]">{errors.topic.message}</p>
              )}
            </div>
            {/* Sub Topic */}

            <div>
              <label
                htmlFor="subTopic"
                className="mb-2 block text-[13px] font-medium text-[#344054]"
              >
                Sub-topic
              </label>

              <div className="relative">
                <select
                  id="subTopic"
                  {...register('subTopic')}
                  disabled={!selectedTopic || isSubTopicsLoading}
                  className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-[#D0D5DD] bg-white px-4 pr-10 text-[14px] text-[#344054] outline-none focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF] disabled:cursor-not-allowed disabled:bg-[#F9FAFB]"
                >
                  <option value="">
                    {isSubTopicsLoading ? 'Loading sub-topics...' : 'Select Sub-topic'}
                  </option>

                  {subTopics.map((subTopic) => (
                    <option key={subTopic.id} value={subTopic.id}>
                      {subTopic.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
                />
              </div>
            </div>
          </div>

          {/* ================================================
              MEDIA URL
          ================================================= */}

          <div>
            <label htmlFor="mediaUrl" className="mb-2 block text-[13px] font-medium text-[#344054]">
              Media URL
            </label>

            <input
              id="mediaUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register('mediaUrl')}
              className={`h-11 w-full rounded-lg border bg-white px-4 text-[14px] text-[#344054] outline-none placeholder:text-[#98A2B3] focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF] ${
                errors.mediaUrl ? 'border-[#F04438]' : 'border-[#D0D5DD]'
              }`}
            />

            {errors.mediaUrl && (
              <p className="mt-1 text-[12px] text-[#F04438]">{errors.mediaUrl.message}</p>
            )}
          </div>
        </div>

        {/* ===================================================
            FORM FOOTER
        ==================================================== */}

        <div className="flex justify-end border-t border-[#E4E7EC] bg-[#FCFCFD] px-4 py-4 sm:px-6">
          <Button type="submit" disabled={isSaving} className="!h-10 !w-auto !px-5">
            <Plus size={16} className="mr-2" />

            {editingQuestionId ? 'Update Question' : 'Add Question'}
          </Button>
        </div>
      </form>

      {/* =====================================================
          QUESTIONS LIST
      ====================================================== */}

      <section className="mt-6 rounded-xl border border-[#E4E7EC] bg-white">
        <div className="border-b border-[#E4E7EC] px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-[#344054]">Added Questions</h2>

              <p className="mt-1 text-[12px] text-[#98A2B3]">
                {questions.length} question
                {questions.length !== 1 ? 's' : ''} added
              </p>
            </div>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-[14px] text-[#667085]">No questions added yet.</p>

            <p className="mt-1 text-[12px] text-[#98A2B3]">
              Add your first question using the form above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E4E7EC]">
            {questions.map((question, index) => (
              <div key={question.id} className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#344054]">Question {index + 1}</p>

                    <p className="mt-2 whitespace-pre-wrap text-[14px] leading-6 text-[#475467]">
                      {question.question}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      title="Edit question"
                      aria-label="Edit question"
                      onClick={() => handleEditQuestion(question)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#667085] transition hover:bg-[#F2F4F7] hover:text-[#344054]"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      type="button"
                      title="Delete question"
                      aria-label="Delete question"
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#667085] transition hover:bg-[#FEF3F2] hover:text-[#D92D20]"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Options */}

                <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
                  <QuestionOption
                    label="A"
                    value={question.option1}
                    isCorrect={question.correct_option === 'option1'}
                  />

                  <QuestionOption
                    label="B"
                    value={question.option2}
                    isCorrect={question.correct_option === 'option2'}
                  />

                  <QuestionOption
                    label="C"
                    value={question.option3}
                    isCorrect={question.correct_option === 'option3'}
                  />

                  <QuestionOption
                    label="D"
                    value={question.option4}
                    isCorrect={question.correct_option === 'option4'}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-[#E4E7EC] bg-[#FCFCFD] px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={() => navigate(FRONTEND_ROUTES.TESTS.EDIT(id!))}
            disabled={isContinueLoading}
            className="h-10 cursor-pointer rounded-lg border border-[#D0D5DD] bg-white px-5 text-[13px] font-medium text-[#344054] transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Back to Test
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={isContinueLoading || isSaving}
            className="h-10 cursor-pointer rounded-lg bg-[#315BEF] px-5 text-[13px] font-medium text-white transition hover:bg-[#264DD7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isContinueLoading ? 'Saving...' : 'Save & Continue'}
          </button>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   OPTION FIELD
========================================================= */

import type { UseFormRegisterReturn } from 'react-hook-form';
import BrandLoader from '@/components/BrandLoader';

interface OptionFieldProps {
  id: string;
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
}

const OptionField = ({ id, label, register, error }: OptionFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[12px] font-medium text-[#344054]">
        {label}
      </label>

      <input
        id={id}
        type="text"
        {...register}
        className={`h-11 w-full rounded-lg border px-3 text-[14px] outline-none ${
          error ? 'border-[#F04438]' : 'border-[#D0D5DD]'
        }`}
      />

      {error && <p className="mt-1 text-[12px] text-[#F04438]">{error}</p>}
    </div>
  );
};

/* =========================================================
   SELECT FIELD
========================================================= */

interface SelectFieldProps {
  id: string;
  label: string;
  required?: boolean;

  register: ReturnType<typeof useForm<QuestionFormData>>['register'] extends (
    ...args: never[]
  ) => infer R
    ? R
    : never;

  error?: string;

  options: readonly {
    value: string;
    label: string;
  }[];
}

function SelectField({ id, label, required = false, register, error, options }: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-[#344054]">
        {label}

        {required && <span className="ml-1 text-[#F04438]">*</span>}
      </label>

      <div className="relative">
        <select
          id={id}
          {...register}
          className={`h-11 w-full cursor-pointer appearance-none rounded-lg border bg-white px-4 pr-10 text-[14px] text-[#344054] outline-none focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF] ${
            error ? 'border-[#F04438]' : 'border-[#D0D5DD]'
          }`}
        >
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

      {error && <p className="mt-1 text-[12px] text-[#F04438]">{error}</p>}
    </div>
  );
}

/* =========================================================
   QUESTION OPTION
========================================================= */

interface QuestionOptionProps {
  label: string;
  value: string;
  isCorrect: boolean;
}

function QuestionOption({ label, value, isCorrect }: QuestionOptionProps) {
  return (
    <div
      className={`rounded-lg border px-3 py-3 ${
        isCorrect ? 'border-[#A6F4C5] bg-[#ECFDF3]' : 'border-[#E4E7EC] bg-[#FCFCFD]'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
            isCorrect ? 'bg-[#12B76A] text-white' : 'bg-[#F2F4F7] text-[#667085]'
          }`}
        >
          {label}
        </span>

        <span className="min-w-0 text-[13px] text-[#475467]">{value}</span>
      </div>
    </div>
  );
}

export default QuestionsPage;
