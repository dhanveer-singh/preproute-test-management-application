import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import Breadcrumb from '@/components/Breadcrumb';
import Button from '@/components/Button';

import FRONTEND_ROUTES from '@/constants/frontendRoutes';
import { DIFFICULTY_OPTIONS, TEST_TYPE_OPTIONS } from '@/constants/test';

import { getSubjects } from '@/services/subjectApi';

import { getSubTopicsByTopics, getTopicsBySubject } from '@/services/topicApi';

import { createTest, getTestById, updateTest } from '@/services/testApi';

import { showError, showSuccess } from '@/utils/toast';

import { testFormSchema, type TestFormData, type TestFormInput } from '@/schemas/test.schema';

import type { CreateTestPayload, Subject, SubTopic, Topic } from '@/types/test';
import { getErrorMessage } from '@/utils/error';
import BrandLoader from '@/components/BrandLoader';

/* =========================================================
   PAGE
========================================================= */

function TestFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  /* =========================================================
     FORM
  ========================================================= */

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TestFormInput, unknown, TestFormData>({
    resolver: zodResolver(testFormSchema),

    defaultValues: {
      name: '',
      subject: '',
      type: 'chapterwise',

      topics: [],
      subTopics: [],

      difficulty: 'medium',

      correctMarks: 4,
      wrongMarks: -1,
      unattemptMarks: 0,

      totalTime: 60,
      totalMarks: 250,
      totalQuestions: 50,
    },
  });

  /* =========================================================
     WATCH VALUES
  ========================================================= */

  const selectedSubject = watch('subject');
  const selectedTopics = watch('topics');
  const selectedSubTopics = watch('subTopics');

  /* =========================================================
     SUBJECT STATE
  ========================================================= */

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [isSubjectsLoading, setIsSubjectsLoading] = useState(false);

  const [subjectsError, setSubjectsError] = useState<string | null>(null);

  /* =========================================================
     TOPIC STATE
  ========================================================= */

  const [topics, setTopics] = useState<Topic[]>([]);

  const [isTopicsLoading, setIsTopicsLoading] = useState(false);

  const [topicsError, setTopicsError] = useState<string | null>(null);

  /* =========================================================
     SUB-TOPIC STATE
  ========================================================= */

  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);

  const [isSubTopicsLoading, setIsSubTopicsLoading] = useState(false);

  const [subTopicsError, setSubTopicsError] = useState<string | null>(null);

  /* =========================================================
     DROPDOWN STATE
  ========================================================= */

  const [topicMenuOpen, setTopicMenuOpen] = useState(false);

  const [subTopicMenuOpen, setSubTopicMenuOpen] = useState(false);

  /* =========================================================
     SUBMIT STATE
  ========================================================= */

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  /* =========================================================
     FETCH SUBJECTS
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchSubjects = async () => {
      try {
        setIsSubjectsLoading(true);
        setSubjectsError(null);

        const data = await getSubjects();

        if (mounted) {
          setSubjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch subjects:', error);

        if (mounted) {
          setSubjects([]);
          setSubjectsError('Unable to load subjects. Please try again.');
        }
      } finally {
        if (mounted) {
          setIsSubjectsLoading(false);
        }
      }
    };

    fetchSubjects();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     FETCH EXISTING TEST FOR EDIT MODE
  ========================================================= */

  useEffect(() => {
    if (!isEditMode || !id) {
      return;
    }

    let mounted = true;

    const loadExistingTest = async () => {
      try {
        setIsEditLoading(true);

        const response = await getTestById(id);

        if (!mounted) {
          return;
        }

        /*
         * Keep the API response locally. Some APIs return topic/subject
         * values as IDs while others return names. We resolve both below.
         */
        const test = response as unknown as Record<string, unknown>;

        const toStringValue = (value: unknown): string =>
          value === null || value === undefined ? '' : String(value).trim();

        const toStringArray = (value: unknown): string[] => {
          if (!Array.isArray(value)) {
            return [];
          }

          return value
            .map((item) => {
              if (item && typeof item === 'object') {
                const record = item as Record<string, unknown>;
                return toStringValue(record.id ?? record.name ?? record.value);
              }

              return toStringValue(item);
            })
            .filter(Boolean);
        };

        const findIdByValue = (
          value: unknown,
          items: Array<{ id: string; name: string }>,
        ): string => {
          const normalized = toStringValue(value);

          if (!normalized) {
            return '';
          }

          const directMatch = items.find((item) => item.id === normalized);

          if (directMatch) {
            return directMatch.id;
          }

          const nameMatch = items.find(
            (item) => item.name.trim().toLowerCase() === normalized.toLowerCase(),
          );

          return nameMatch?.id ?? '';
        };

        /* ---------------------------------------------------------
           Resolve subject
        --------------------------------------------------------- */
        const rawSubject = test.subject ?? test.subject_id ?? '';
        const subjectId = findIdByValue(rawSubject, subjects);

        /* ---------------------------------------------------------
           Resolve topics
        --------------------------------------------------------- */
        let resolvedTopicIds: string[] = [];
        let resolvedSubTopicIds: string[] = [];
        let resolvedTopics: Topic[] = [];
        let resolvedSubTopics: SubTopic[] = [];

        if (subjectId) {
          const topicData = await getTopicsBySubject(subjectId);

          if (!mounted) {
            return;
          }

          resolvedTopics = topicData;

          const rawTopics = toStringArray(test.topics ?? test.topic_ids);

          resolvedTopicIds = rawTopics
            .map((value) => findIdByValue(value, topicData))
            .filter(Boolean);

          /* -------------------------------------------------------
             Resolve sub-topics
          ------------------------------------------------------- */
          if (resolvedTopicIds.length > 0) {
            const subTopicData = await getSubTopicsByTopics(resolvedTopicIds);

            if (!mounted) {
              return;
            }

            resolvedSubTopics = subTopicData;

            const rawSubTopics = toStringArray(
              test.sub_topics ?? test.subTopics ?? test.sub_topic_ids,
            );

            resolvedSubTopicIds = rawSubTopics
              .map((value) => findIdByValue(value, subTopicData))
              .filter(Boolean);
          }
        }

        setTopics(resolvedTopics);
        setSubTopics(resolvedSubTopics);

        /* ---------------------------------------------------------
           Populate the form after all dependent IDs are resolved.
           React Hook Form defaultValues only run on first render,
           therefore reset() is required for edit mode.
        --------------------------------------------------------- */
        reset({
          name: toStringValue(test.name ?? test.title),
          subject: subjectId,
          type: toStringValue(test.type) || 'chapterwise',
          topics: resolvedTopicIds,
          subTopics: resolvedSubTopicIds,
          difficulty: toStringValue(test.difficulty) || 'medium',
          correctMarks: Number(test.correct_marks ?? test.correctMarks ?? 4),
          wrongMarks: Number(test.wrong_marks ?? test.wrongMarks ?? -1),
          unattemptMarks: Number(test.unattempt_marks ?? test.unattemptMarks ?? 0),
          totalTime: Number(test.total_time ?? test.totalTime ?? 60),
          totalMarks: Number(test.total_marks ?? test.totalMarks ?? 250),
          totalQuestions: Number(test.total_questions ?? test.totalQuestions ?? 50),
        });
      } catch (error) {
        console.error('Failed to load existing test:', error);

        if (mounted) {
          showError(getErrorMessage(error, 'Unable to load test details. Please try again.'));
        }
      } finally {
        if (mounted) {
          setIsEditLoading(false);
        }
      }
    };

    /* Subjects are required to convert a subject name into its ID. */
    if (subjects.length > 0) {
      loadExistingTest();
    }

    return () => {
      mounted = false;
    };
  }, [isEditMode, id, subjects, reset]);

  /* =========================================================
     FETCH TOPICS BY SUBJECT
  ========================================================= */

  useEffect(() => {
    // No subject selected
    if (!selectedSubject) {
      setTopics([]);
      setSubTopics([]);

      setTopicsError(null);
      setSubTopicsError(null);

      setIsTopicsLoading(false);
      setIsSubTopicsLoading(false);

      return;
    }

    let mounted = true;

    const fetchTopics = async () => {
      try {
        setIsTopicsLoading(true);
        setTopicsError(null);

        console.log('Fetching topics for subject:', selectedSubject);

        const data = await getTopicsBySubject(selectedSubject);

        console.log('Topics API response:', data);

        if (!mounted) {
          return;
        }

        setTopics(data);

        // Remove topics that don't belong
        // to the newly selected subject.
        const availableTopicIds = new Set(data.map((topic) => topic.id));

        const validSelectedTopics = selectedTopics.filter((topicId) =>
          availableTopicIds.has(topicId),
        );

        if (validSelectedTopics.length !== selectedTopics.length) {
          setValue('topics', validSelectedTopics, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch topics:', error);

        if (!mounted) {
          return;
        }

        setTopics([]);

        setTopicsError('Unable to load topics. Please try again.');

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
  }, [selectedSubject, setValue]);

  /* =========================================================
     FETCH SUB-TOPICS
  ========================================================= */

  useEffect(() => {
    if (!selectedTopics.length) {
      setSubTopics([]);
      setSubTopicsError(null);
      setIsSubTopicsLoading(false);

      return;
    }

    let mounted = true;

    const fetchSubTopics = async () => {
      try {
        setIsSubTopicsLoading(true);
        setSubTopicsError(null);

        console.log('Fetching sub-topics for topics:', selectedTopics);

        const data = await getSubTopicsByTopics(selectedTopics);

        console.log('Sub-topics API response:', data);

        if (!mounted) {
          return;
        }

        setSubTopics(data);

        // Remove previously selected sub-topics
        // which are no longer available.
        const availableSubTopicIds = new Set(data.map((subTopic) => subTopic.id));

        const validSelectedSubTopics = selectedSubTopics.filter((subTopicId) =>
          availableSubTopicIds.has(subTopicId),
        );

        if (validSelectedSubTopics.length !== selectedSubTopics.length) {
          setValue('subTopics', validSelectedSubTopics, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch sub-topics:', error);

        if (!mounted) {
          return;
        }

        setSubTopics([]);

        setSubTopicsError('Unable to load sub-topics. Please try again.');

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
  }, [selectedTopics, selectedSubTopics, setValue]);

  /* =========================================================
     SELECTED TOPIC LABELS
  ========================================================= */

  const selectedTopicLabels = topics
    .filter((topic) => selectedTopics.includes(topic.id))
    .map((topic) => topic.name);

  /* =========================================================
     SELECTED SUB-TOPIC LABELS
  ========================================================= */

  const selectedSubTopicLabels = subTopics
    .filter((subTopic) => selectedSubTopics.includes(subTopic.id))
    .map((subTopic) => subTopic.name);

  /* =========================================================
     SUBJECT CHANGE
  ========================================================= */

  const handleSubjectChange = (subjectId: string) => {
    setValue('subject', subjectId, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Clear dependent fields
    setValue('topics', [], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue('subTopics', [], {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Clear dependent API data
    setTopics([]);
    setSubTopics([]);

    setTopicsError(null);
    setSubTopicsError(null);

    // Close menus
    setTopicMenuOpen(false);
    setSubTopicMenuOpen(false);
  };

  /* =========================================================
     TOGGLE TOPIC
  ========================================================= */

  const toggleTopic = (topicId: string) => {
    const updatedTopics = selectedTopics.includes(topicId)
      ? selectedTopics.filter((value) => value !== topicId)
      : [...selectedTopics, topicId];

    setValue('topics', updatedTopics, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue('subTopics', [], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setSubTopics([]);
  };
  /* =========================================================
     TOGGLE SUB-TOPIC
  ========================================================= */

  const toggleSubTopic = (subTopicId: string) => {
    const updatedSubTopics = selectedSubTopics.includes(subTopicId)
      ? selectedSubTopics.filter((value) => value !== subTopicId)
      : [...selectedSubTopics, subTopicId];

    setValue('subTopics', updatedSubTopics, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  /* =========================================================
     BUILD CREATE PAYLOAD
  ========================================================= */

  const buildCreatePayload = (
    data: TestFormData,
    status: 'live' | 'unpublished' | 'scheduled' | 'expired' | 'draft',
  ): CreateTestPayload => {
    return {
      name: data.name,

      type: data.type,

      subject: data.subject,

      topics: data.topics,

      sub_topics: data.subTopics,

      correct_marks: Number(data.correctMarks),

      wrong_marks: Number(data.wrongMarks),

      unattempt_marks: Number(data.unattemptMarks),

      difficulty: data.difficulty,

      total_time: Number(data.totalTime),

      total_marks: Number(data.totalMarks),

      total_questions: Number(data.totalQuestions),

      status,
    };
  };

  /* =========================================================
     CREATE / UPDATE TEST
  ========================================================= */

  const handleFormSubmit = async (data: TestFormData) => {
    try {
      setIsSubmitting(true);

      /* =====================================================
         EDIT TEST
      ====================================================== */

      if (isEditMode && id) {
        await updateTest(id, {
          name: data.name,

          total_questions: Number(data.totalQuestions),

          total_marks: Number(data.totalMarks),
        });

        navigate(FRONTEND_ROUTES.TESTS.QUESTIONS(id));

        return;
      }

      /* =====================================================
         CREATE TEST
      ====================================================== */

      const payload = buildCreatePayload(data, 'draft');

      const createdTest = await createTest(payload);

      showSuccess('Test created successfully.');

      navigate(FRONTEND_ROUTES.TESTS.QUESTIONS(createdTest.id));
    } catch (error) {
      console.error('Failed to save test:', error);
      showError('Unable to save the test. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     SAVE AS DRAFT
  ========================================================= */

  const handleSaveAsDraft = async () => {
    const values = getValues();

    try {
      setIsSubmitting(true);

      /* =====================================================
         UPDATE EXISTING TEST
      ====================================================== */

      if (isEditMode && id) {
        await updateTest(id, {
          name: values.name,
          total_questions: Number(values.totalQuestions),
          total_marks: Number(values.totalMarks),
          status: 'draft',
        });

        showSuccess('Test saved as draft.');

        navigate(FRONTEND_ROUTES.DASHBOARD);

        return;
      }

      /* =====================================================
         CREATE NEW DRAFT
      ====================================================== */

      const payload: CreateTestPayload = {
        name: values.name,

        type: values.type,

        subject: values.subject,

        topics: values.topics,

        sub_topics: values.subTopics,

        correct_marks: Number(values.correctMarks),

        wrong_marks: Number(values.wrongMarks),

        unattempt_marks: Number(values.unattemptMarks),

        difficulty: values.difficulty,

        total_time: Number(values.totalTime),

        total_marks: Number(values.totalMarks),

        total_questions: Number(values.totalQuestions),

        status: 'draft',
      };

      await createTest(payload);
      showSuccess('Test saved as draft.');
      navigate(FRONTEND_ROUTES.DASHBOARD);
    } catch (error) {
      console.error('Failed to save draft:', error);
      showError(getErrorMessage(error, 'Unable to save the draft. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     CANCEL
  ========================================================= */

  const handleCancel = () => {
    navigate(FRONTEND_ROUTES.DASHBOARD);
  };

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
            label: isEditMode ? 'Edit Test' : 'Create Test',
          },
          {
            label: 'Chapter Wise',
            active: true,
          },
        ]}
      />

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[22px] font-semibold text-[#101828] sm:text-[24px]">
            {isEditMode ? 'Edit Test' : 'Create New Test'}
          </h1>

          <p className="mt-1 text-[13px] text-[#667085] sm:text-[14px]">
            {isEditMode
              ? 'Update the test details and configuration.'
              : 'Create and configure your assessment test.'}
          </p>
        </div>
      </div>

      {/* =====================================================
          FORM
      ====================================================== */}

      {isEditMode && isEditLoading && (
        <div
          className="
        absolute
        inset-0
        z-30
        flex
        items-center
        justify-center
        rounded-xl
        bg-black/25
        backdrop-blur-[2px]
      "
        >
          <BrandLoader size={58} />
        </div>
      )}

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="overflow-hidden rounded-xl border border-[#E4E7EC] bg-white"
      >
        {/* ===================================================
            TEST TYPE
        ==================================================== */}

        <div className="border-b border-[#E4E7EC] px-4 py-4 sm:px-6 sm:py-5">
          <p className="mb-3 text-[13px] font-medium text-[#344054]">Test Type</p>

          <div className="flex flex-wrap gap-2">
            {TEST_TYPE_OPTIONS.map((testType) => {
              const selected = watch('type') === testType.value;

              return (
                <button
                  key={testType.value}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() =>
                    setValue('type', testType.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className={`cursor-pointer rounded-lg px-4 py-2.5 text-[13px] font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    selected
                      ? 'bg-[#5B8DEF] text-white shadow-sm'
                      : 'border border-[#D0D5DD] bg-white text-[#475467] hover:bg-[#F9FAFB]'
                  }`}
                >
                  {testType.label}
                </button>
              );
            })}
          </div>

          {errors.type && <p className="mt-2 text-[12px] text-[#F04438]">{errors.type.message}</p>}
        </div>

        {/* ===================================================
            FORM CONTENT
        ==================================================== */}

        <div className="space-y-8 p-4 sm:p-6">
          {/* =================================================
              TEST DETAILS
          ================================================== */}

          <section>
            <div className="mb-4">
              <h2 className="text-[15px] font-semibold text-[#344054]">Test Details</h2>

              <p className="mt-1 text-[12px] text-[#98A2B3]">
                Configure the basic information for this test.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* =============================================
                  TEST NAME
              ============================================== */}

              <div>
                <label
                  htmlFor="test-name"
                  className="mb-2 block text-[13px] font-medium text-[#344054]"
                >
                  Test Name
                  <span className="ml-1 text-[#F04438]">*</span>
                </label>

                <input
                  id="test-name"
                  type="text"
                  placeholder="Enter test name"
                  disabled={isSubmitting}
                  {...register('name')}
                  className={`h-11 w-full rounded-lg border bg-white px-4 text-[14px] text-[#344054] outline-none placeholder:text-[#98A2B3] focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF] disabled:cursor-not-allowed disabled:bg-[#F9FAFB] ${
                    errors.name ? 'border-[#F04438]' : 'border-[#D0D5DD]'
                  }`}
                />

                {errors.name && (
                  <p className="mt-1 text-[12px] text-[#F04438]">{errors.name.message}</p>
                )}
              </div>

              {/* =============================================
                  SUBJECT
              ============================================== */}

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-[13px] font-medium text-[#344054]"
                >
                  Subject
                  <span className="ml-1 text-[#F04438]">*</span>
                </label>

                <div className="relative">
                  <select
                    id="subject"
                    value={selectedSubject}
                    onChange={(event) => handleSubjectChange(event.target.value)}
                    disabled={isSubjectsLoading || isSubmitting || isEditLoading}
                    className={`h-11 w-full cursor-pointer appearance-none rounded-lg border bg-white px-4 pr-10 text-[14px] text-[#344054] outline-none focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF] disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#98A2B3] ${
                      errors.subject ? 'border-[#F04438]' : 'border-[#D0D5DD]'
                    }`}
                  >
                    <option value="">
                      {isSubjectsLoading ? 'Loading subjects...' : 'Select Subject'}
                    </option>

                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
                  />
                </div>

                {errors.subject && (
                  <p className="mt-1 text-[12px] text-[#F04438]">{errors.subject.message}</p>
                )}

                {subjectsError && (
                  <p className="mt-1 text-[12px] text-[#F04438]">{subjectsError}</p>
                )}
              </div>

              {/* =============================================
                  TOPICS
              ============================================== */}

              <div>
                <MultiSelectField
                  label="Topics"
                  required
                  placeholder={isTopicsLoading ? 'Loading Topics...' : 'Select Topics'}
                  disabled={!selectedSubject || isTopicsLoading || isSubmitting || isEditLoading}
                  isOpen={topicMenuOpen}
                  selectedLabels={selectedTopicLabels}
                  selectedValues={selectedTopics}
                  hasError={Boolean(errors.topics)}
                  onToggle={() => setTopicMenuOpen((previous) => !previous)}
                  options={topics.map((topic) => ({
                    value: topic.id,
                    label: topic.name,
                  }))}
                  onSelect={toggleTopic}
                />

                {errors.topics && (
                  <p className="mt-1 text-[12px] text-[#F04438]">{errors.topics.message}</p>
                )}

                {topicsError && <p className="mt-1 text-[12px] text-[#F04438]">{topicsError}</p>}
              </div>

              {/* =============================================
                  SUB-TOPICS
              ============================================== */}

              <div>
                <MultiSelectField
                  label="Sub-topics"
                  placeholder={isSubTopicsLoading ? 'Loading Sub-topics...' : 'Select Sub-topics'}
                  disabled={
                    !selectedTopics.length || isSubTopicsLoading || isSubmitting || isEditLoading
                  }
                  isOpen={subTopicMenuOpen}
                  selectedLabels={selectedSubTopicLabels}
                  selectedValues={selectedSubTopics}
                  onToggle={() => setSubTopicMenuOpen((previous) => !previous)}
                  options={subTopics.map((subTopic) => ({
                    value: subTopic.id,
                    label: subTopic.name,
                  }))}
                  onSelect={toggleSubTopic}
                />

                {subTopicsError && (
                  <p className="mt-1 text-[12px] text-[#F04438]">{subTopicsError}</p>
                )}
              </div>

              {/* =============================================
                  DIFFICULTY
              ============================================== */}

              <SelectField
                id="difficulty"
                label="Difficulty"
                required
                register={register('difficulty')}
                error={errors.difficulty?.message}
                options={DIFFICULTY_OPTIONS}
              />
            </div>
          </section>

          {/* =================================================
              MARKING SCHEME
          ================================================== */}

          <section className="border-t border-[#E4E7EC] pt-7">
            <div className="mb-4">
              <h2 className="text-[15px] font-semibold text-[#344054]">Marking Scheme</h2>

              <p className="mt-1 text-[12px] text-[#98A2B3]">
                Define how marks are awarded for each response.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <NumberField
                id="correctMarks"
                label="Correct Answer"
                register={register('correctMarks')}
                error={errors.correctMarks?.message}
              />

              <NumberField
                id="wrongMarks"
                label="Wrong Answer"
                register={register('wrongMarks')}
                error={errors.wrongMarks?.message}
              />

              <NumberField
                id="unattemptMarks"
                label="Unattempted"
                register={register('unattemptMarks')}
                error={errors.unattemptMarks?.message}
              />
            </div>
          </section>

          {/* =================================================
              TEST CONFIGURATION
          ================================================== */}

          <section className="border-t border-[#E4E7EC] pt-7">
            <div className="mb-4">
              <h2 className="text-[15px] font-semibold text-[#344054]">Test Configuration</h2>

              <p className="mt-1 text-[12px] text-[#98A2B3]">
                Set the duration, number of questions and marks.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <NumberField
                id="totalTime"
                label="Duration (Minutes)"
                register={register('totalTime')}
                error={errors.totalTime?.message}
              />

              <NumberField
                id="totalQuestions"
                label="No. of Questions"
                register={register('totalQuestions')}
                error={errors.totalQuestions?.message}
              />

              <NumberField
                id="totalMarks"
                label="Total Marks"
                register={register('totalMarks')}
                error={errors.totalMarks?.message}
              />
            </div>
          </section>
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-[#E4E7EC] bg-[#FCFCFD] px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            disabled={isSubmitting || isEditLoading}
            onClick={handleCancel}
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border border-[#D0D5DD] bg-white px-6 text-[14px] font-medium text-[#344054] transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting || isEditLoading}
            onClick={handleSaveAsDraft}
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border border-[#D0D5DD] bg-white px-6 text-[14px] font-medium text-[#344054] transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </button>

          <Button
            type="submit"
            disabled={isSubmitting || isEditLoading}
            className="!h-11 !w-auto !px-7"
          >
            {isEditLoading
              ? 'Loading...'
              : isSubmitting
                ? 'Saving...'
                : isEditMode
                  ? 'Save Changes'
                  : 'Next: Add Questions'}
          </Button>
        </div>
      </form>
    </main>
  );
}

/* =========================================================
   SELECT FIELD
========================================================= */

interface SelectFieldProps {
  id: string;
  label: string;
  required?: boolean;
  register: UseFormRegisterReturn;
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
   NUMBER FIELD
========================================================= */

interface NumberFieldProps {
  id:
    | 'correctMarks'
    | 'wrongMarks'
    | 'unattemptMarks'
    | 'totalTime'
    | 'totalMarks'
    | 'totalQuestions';

  label: string;

  register: UseFormRegisterReturn;

  error?: string;
}

function NumberField({ id, label, register, error }: NumberFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-[#344054]">
        {label}
      </label>

      <input
        id={id}
        type="number"
        step="0.5"
        {...register}
        className={`h-11 w-full rounded-lg border bg-white px-4 text-[14px] text-[#344054] outline-none focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF] ${
          error ? 'border-[#F04438]' : 'border-[#D0D5DD]'
        }`}
      />

      {error && <p className="mt-1 text-[12px] text-[#F04438]">{error}</p>}
    </div>
  );
}

/* =========================================================
   MULTI SELECT FIELD
========================================================= */

interface MultiSelectFieldProps {
  label: string;
  required?: boolean;
  placeholder: string;
  disabled?: boolean;
  isOpen: boolean;
  selectedLabels: string[];
  selectedValues: string[];
  hasError?: boolean;

  options: {
    value: string;
    label: string;
  }[];

  onToggle: () => void;

  onSelect: (value: string) => void;
}

function MultiSelectField({
  label,
  required = false,
  placeholder,
  disabled = false,
  isOpen,
  selectedLabels,
  selectedValues,
  hasError = false,
  options,
  onToggle,
  onSelect,
}: MultiSelectFieldProps) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-[13px] font-medium text-[#344054]">
        {label}

        {required && <span className="ml-1 text-[#F04438]">*</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={onToggle}
          className={`flex h-11 w-full cursor-pointer items-center justify-between rounded-lg border bg-white px-4 text-left text-[14px] disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#98A2B3] ${
            hasError ? 'border-[#F04438]' : 'border-[#D0D5DD]'
          }`}
        >
          <span
            className="min-w-0 truncate"
            title={selectedLabels.length ? selectedLabels.join(', ') : placeholder}
          >
            {selectedLabels.length ? selectedLabels.join(', ') : placeholder}
          </span>

          <ChevronDown size={17} className="ml-2 shrink-0 text-[#667085]" />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-[#D0D5DD] bg-white p-2 shadow-lg">
            {options.length > 0 ? (
              options.map((option) => {
                const selected = selectedValues.includes(option.value);

                return (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-[13px] text-[#344054] hover:bg-[#F9FAFB]"
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onSelect(option.value)}
                      className="h-4 w-4 cursor-pointer accent-[#5B8DEF]"
                    />

                    <span className="min-w-0 truncate" title={option.label}>
                      {option.label}
                    </span>
                  </label>
                );
              })
            ) : (
              <p className="px-3 py-2 text-[13px] text-[#98A2B3]">No options available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TestFormPage;
