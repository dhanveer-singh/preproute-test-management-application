import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/Button';
import FRONTEND_ROUTES from '@/constants/frontendRoutes';
import { DIFFICULTY_OPTIONS, TEST_TYPE_OPTIONS } from '@/constants/test';
import { MOCK_SUBJECTS, MOCK_SUB_TOPICS, MOCK_TOPICS } from '@/mockData/testData';
import { testFormSchema, type TestFormData, type TestFormInput } from '@/schemas/test.schema';

import type { Subject, Topic, SubTopic } from '@/types/test';
import Breadcrumb from '@/components/Breadcrumb';

function TestFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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

  const selectedSubject = watch('subject');
  const selectedTopics = watch('topics');
  const selectedSubTopics = watch('subTopics');

  const [topicMenuOpen, setTopicMenuOpen] = useState(false);
  const [subTopicMenuOpen, setSubTopicMenuOpen] = useState(false);

  const availableTopics = useMemo(
    () => MOCK_TOPICS.filter((topic) => topic.subject_id === selectedSubject),
    [selectedSubject],
  );

  const availableSubTopics = useMemo(
    () => MOCK_SUB_TOPICS.filter((subTopic) => selectedTopics.includes(subTopic.topic_id)),
    [selectedTopics],
  );

  const selectedTopicLabels = useMemo(
    () =>
      availableTopics
        .filter((topic) => selectedTopics.includes(topic.id))
        .map((topic) => topic.name),
    [availableTopics, selectedTopics],
  );

  const selectedSubTopicLabels = useMemo(
    () =>
      availableSubTopics
        .filter((subTopic) => selectedSubTopics.includes(subTopic.id))
        .map((subTopic) => subTopic.name),
    [availableSubTopics, selectedSubTopics],
  );

  const handleSubjectChange = (subjectId: string) => {
    setValue('subject', subjectId, {
      shouldValidate: true,
    });

    setValue('topics', [], {
      shouldValidate: true,
    });

    setValue('subTopics', [], {
      shouldValidate: true,
    });

    setTopicMenuOpen(false);
    setSubTopicMenuOpen(false);
  };

  const toggleTopic = (topicId: string) => {
    const updatedTopics = selectedTopics.includes(topicId)
      ? selectedTopics.filter((id) => id !== topicId)
      : [...selectedTopics, topicId];

    setValue('topics', updatedTopics, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const validSubTopicIds = MOCK_SUB_TOPICS.filter((subTopic) =>
      updatedTopics.includes(subTopic.topic_id),
    ).map((subTopic) => subTopic.id);

    setValue(
      'subTopics',
      selectedSubTopics.filter((id) => validSubTopicIds.includes(id)),
      {
        shouldDirty: true,
      },
    );
  };

  const toggleSubTopic = (subTopicId: string) => {
    const updatedSubTopics = selectedSubTopics.includes(subTopicId)
      ? selectedSubTopics.filter((id) => id !== subTopicId)
      : [...selectedSubTopics, subTopicId];

    setValue('subTopics', updatedSubTopics, {
      shouldDirty: true,
    });
  };

  const handleFormSubmit = (data: TestFormData) => {
    /*
     * UI ONLY
     *
     * API integration will be added later.
     *
     * Create:
     * POST /tests
     *
     * Edit:
     * PUT /tests/:id
     */

    console.log('Test form data:', data);

    const testId = id ?? 'mock-test-id';

    navigate(FRONTEND_ROUTES.TESTS.QUESTIONS(testId));
  };

  const handleSaveAsDraft = () => {
    /*
     * UI ONLY
     *
     * Later this will call:
     *
     * POST /tests
     *
     * with status: "draft"
     */

    console.log('Save as draft');
  };

  const handleCancel = () => {
    navigate(FRONTEND_ROUTES.DASHBOARD);
  };

  return (
    <main className="min-h-full min-w-0 bg-[#F8FAFD] px-4 py-5 sm:px-6 sm:py-7">
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

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="overflow-hidden rounded-xl border border-[#E4E7EC] bg-white"
      >
        {/* =====================================================
            TEST TYPE
        ====================================================== */}

        <div className="border-b border-[#E4E7EC] px-4 py-4 sm:px-6 sm:py-5">
          <p className="mb-3 text-[13px] font-medium text-[#344054]">Test Type</p>

          <div className="flex flex-wrap gap-2">
            {TEST_TYPE_OPTIONS.map((testType) => {
              const selected = watch('type') === testType.value;

              return (
                <button
                  key={testType.value}
                  type="button"
                  onClick={() =>
                    setValue('type', testType.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className={`cursor-pointer rounded-lg px-4 py-2.5 text-[13px] font-medium transition ${
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

        {/* =====================================================
            FORM CONTENT
        ====================================================== */}

        <div className="space-y-8 p-4 sm:p-6">
          {/* ===================================================
              TEST DETAILS
          ==================================================== */}

          <section>
            <div className="mb-4">
              <h2 className="text-[15px] font-semibold text-[#344054]">Test Details</h2>

              <p className="mt-1 text-[12px] text-[#98A2B3]">
                Configure the basic information for this test.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Test Name */}

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
                  {...register('name')}
                  className={`h-11 w-full rounded-lg border bg-white px-4 text-[14px] text-[#344054] outline-none placeholder:text-[#98A2B3] focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF] ${
                    errors.name ? 'border-[#F04438]' : 'border-[#D0D5DD]'
                  }`}
                />

                {errors.name && (
                  <p className="mt-1 text-[12px] text-[#F04438]">{errors.name.message}</p>
                )}
              </div>

              {/* Subject */}

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
                    className={`h-11 w-full cursor-pointer appearance-none rounded-lg border bg-white px-4 pr-10 text-[14px] text-[#344054] outline-none focus:border-[#7594FF] focus:ring-1 focus:ring-[#7594FF] ${
                      errors.subject ? 'border-[#F04438]' : 'border-[#D0D5DD]'
                    }`}
                  >
                    <option value="">Select Subject</option>

                    {MOCK_SUBJECTS.map((subject) => (
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
              </div>

              {/* Topics */}

              <MultiSelectField
                label="Topics"
                required
                placeholder="Select Topics"
                disabled={!selectedSubject}
                isOpen={topicMenuOpen}
                selectedLabels={selectedTopicLabels}
                hasError={Boolean(errors.topics)}
                onToggle={() => setTopicMenuOpen((previous) => !previous)}
                options={availableTopics.map((topic) => ({
                  value: topic.id,
                  label: topic.name,
                }))}
                selectedValues={selectedTopics}
                onSelect={toggleTopic}
              />

              {errors.topics && (
                <p className="-mt-3 text-[12px] text-[#F04438] md:col-start-1">
                  {errors.topics.message}
                </p>
              )}

              {/* Sub Topics */}

              <MultiSelectField
                label="Sub-topics"
                placeholder="Select Sub-topics"
                disabled={!selectedTopics.length}
                isOpen={subTopicMenuOpen}
                selectedLabels={selectedSubTopicLabels}
                onToggle={() => setSubTopicMenuOpen((previous) => !previous)}
                options={availableSubTopics.map((subTopic) => ({
                  value: subTopic.id,
                  label: subTopic.name,
                }))}
                selectedValues={selectedSubTopics}
                onSelect={toggleSubTopic}
              />

              {/* Difficulty */}

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

          {/* ===================================================
              MARKING SCHEME
          ==================================================== */}

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

          {/* ===================================================
              TEST CONFIGURATION
          ==================================================== */}

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
            onClick={handleCancel}
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border border-[#D0D5DD] bg-white px-6 text-[14px] font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveAsDraft}
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border border-[#D0D5DD] bg-white px-6 text-[14px] font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
          >
            Save as Draft
          </button>

          <Button type="submit" className="!h-11 !w-auto !px-7">
            {isEditMode ? 'Save Changes' : 'Next: Add Questions'}
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

  options: {
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
   MULTI SELECT
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
