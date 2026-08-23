import {
  Check,
  Eye,
  FilePlus2,
  List,
  Pencil,
  Plus,
  RotateCcw,
  Timer,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';

import FRONTEND_ROUTES from '@/constants/frontendRoutes';

import { getTests, deleteTest, updateTest } from '@/services/testApi';

import type { Test } from '@/types/test';

import { confirmDelete } from '@/utils/alert';

import { showError, showSuccess } from '@/utils/toast';

import { DIFFICULTY_OPTIONS } from '@/constants/test';

/* =========================================================
   DASHBOARD TABLE TYPE

   API Test fields are mapped into the fields expected
   by the existing Dashboard table.
========================================================= */

interface DashboardTableTest {
  id: string;
  name: string;
  subject: string;
  topic: string;
  questions: number;
  marks: number;
  duration: number;
  difficulty: string;
  status: string;
}

/* =========================================================
   STATUS HELPERS
========================================================= */

const STATUS_LABELS: Record<string, string> = {
  live: 'Published',
  published: 'Published',
  scheduled: 'Scheduled',
  draft: 'Draft',
  unpublished: 'Unpublished',
  expired: 'Expired',
};

const getStatusLabel = (status: string): string => {
  return STATUS_LABELS[status.toLowerCase()] ?? status;
};

const getStatusValue = (status: string): string => {
  return status.toLowerCase();
};

/* =========================================================
   DASHBOARD PAGE
========================================================= */

function DashboardPage() {
  const navigate = useNavigate();

  /* =========================================================
     TEST API STATE
  ========================================================= */

  const [tests, setTests] = useState<Test[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  /* =========================================================
     FILTER STATE
  ========================================================= */

  const [search, setSearch] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');

  const [subjectFilter, setSubjectFilter] = useState('all');

  const [difficultyFilter, setDifficultyFilter] = useState('all');

  /* =========================================================
     PAGINATION STATE
  ========================================================= */

  const [currentPage, setCurrentPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  /* =========================================================
     FETCH TESTS
  ========================================================= */

  const fetchTests = async () => {
    try {
      setIsLoading(true);

      const response = await getTests();

      setTests(response);
    } catch (error) {
      console.error('Failed to fetch tests:', error);

      showError('Unable to load tests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  /* =========================================================
     MAP API TESTS FOR TABLE
  ========================================================= */

  const dashboardTests = useMemo<DashboardTableTest[]>(
    () =>
      tests.map((test) => ({
        id: test.id,

        name: test.name,

        subject: test.subject || '-',

        /*
         * Your Test type currently contains
         * topics as string[].
         *
         * If backend returns topic IDs,
         * those IDs will be displayed here.
         */
        topic: test.topics?.length ? test.topics.join(', ') : '-',

        questions: Number(test.total_questions) || 0,

        marks: Number(test.total_marks) || 0,

        duration: Number(test.total_time) || 0,

        difficulty: test.difficulty || '-',

        status: getStatusLabel(test.status || ''),
      })),
    [tests],
  );

  /* =========================================================
     SUBJECT OPTIONS
  ========================================================= */

  const subjects = useMemo(() => {
    return Array.from(new Set(dashboardTests.map((test) => test.subject).filter(Boolean))).sort();
  }, [dashboardTests]);

  /* =========================================================
     FILTER TESTS
  ========================================================= */

  const filteredTests = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return dashboardTests.filter((test) => {
      const matchesSearch =
        searchValue === '' ||
        test.name.toLowerCase().includes(searchValue) ||
        test.subject.toLowerCase().includes(searchValue) ||
        test.topic.toLowerCase().includes(searchValue);

      const matchesStatus = statusFilter === 'all' || getStatusValue(test.status) === statusFilter;

      const matchesSubject = subjectFilter === 'all' || test.subject === subjectFilter;

      const matchesDifficulty =
        difficultyFilter === 'all' ||
        getStatusValue(test.difficulty) === getStatusValue(difficultyFilter);

      return matchesSearch && matchesStatus && matchesSubject && matchesDifficulty;
    });
  }, [dashboardTests, search, statusFilter, subjectFilter, difficultyFilter]);

  /* =========================================================
     PAGINATION DATA
  ========================================================= */

  const totalItems = filteredTests.length;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  /*
   * Keep current page valid if
   * filtering reduces the number of pages.
   */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedTests = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return filteredTests.slice(startIndex, startIndex + pageSize);
  }, [filteredTests, currentPage, pageSize]);

  /* =========================================================
     DASHBOARD OVERVIEW
     
     Cards are intentionally left as existing mock UI.
     We are NOT connecting cards in this step.
  ========================================================= */

  const overviewStats = [
    {
      title: 'Total Tests',
      value: '148',
      change: '+12%',
      changeText: 'vs last month',
      trend: 'up',
      icon: List,
      iconClass: 'bg-[#F0FDF4] text-[#315BEF]',
    },

    {
      title: 'Published Tests',
      value: '94',
      change: '+8%',
      changeText: 'vs last month',
      trend: 'up',
      icon: Check,
      iconClass: 'bg-[#ECFDF3] text-[#12B76A]',
    },

    {
      title: 'Scheduled Tests',
      value: '32',
      change: '+4%',
      changeText: 'vs last month',
      trend: 'up',
      icon: Timer,
      iconClass: 'bg-[#FFFAEB] text-[#F5B800]',
    },

    {
      title: 'Draft Tests',
      value: '22',
      change: '-2%',
      changeText: 'vs last month',
      trend: 'down',
      icon: FilePlus2,
      iconClass: 'bg-[#F8F9FC] text-[#667085]',
    },
  ] as const;

  /* =========================================================
     CREATE TEST
  ========================================================= */

  const handleCreateTest = () => {
    navigate(FRONTEND_ROUTES.TESTS.NEW);
  };

  /* =========================================================
     VIEW TEST
  ========================================================= */

  const handleView = (test: DashboardTableTest) => {
    navigate(FRONTEND_ROUTES.TESTS.PREVIEW(test.id));
  };

  /* =========================================================
     EDIT TEST
  ========================================================= */

  const handleEdit = (test: DashboardTableTest) => {
    navigate(FRONTEND_ROUTES.TESTS.EDIT(test.id));
  };

  /* =========================================================
     DELETE TEST
  ========================================================= */

  const handleDelete = async (test: DashboardTableTest) => {
    const confirmed = await confirmDelete(test.name);

    if (!confirmed) {
      return;
    }

    try {
      setActionLoadingId(test.id);

      await deleteTest(test.id);

      setTests((previous) => previous.filter((item) => item.id !== test.id));

      showSuccess('Test deleted successfully.');
    } catch (error) {
      console.error('Failed to delete test:', error);

      showError('Unable to delete test. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  /* =========================================================
     PUBLISH / UNPUBLISH TEST
  ========================================================= */

  const handleTogglePublish = async (test: DashboardTableTest) => {
    const isPublished = getStatusValue(test.status) === 'published';

    const newStatus = isPublished ? 'unpublished' : 'live';

    try {
      setActionLoadingId(test.id);

      await updateTest(test.id, {
        status: newStatus,
      });

      /*
       * Update only the affected
       * row locally so the table
       * changes immediately.
       */
      setTests((previous) =>
        previous.map((item) =>
          item.id === test.id
            ? {
                ...item,
                status: newStatus,
              }
            : item,
        ),
      );

      showSuccess(isPublished ? 'Test unpublished successfully.' : 'Test published successfully.');
    } catch (error) {
      console.error('Failed to update test status:', error);

      showError(isPublished ? 'Unable to unpublish test.' : 'Unable to publish test.');
    } finally {
      setActionLoadingId(null);
    }
  };

  /* =========================================================
     FILTER HANDLERS
  ========================================================= */

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSubjectChange = (value: string) => {
    setSubjectFilter(value);
    setCurrentPage(1);
  };

  const handleDifficultyChange = (value: string) => {
    setDifficultyFilter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setSubjectFilter('all');
    setDifficultyFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search !== '' ||
    statusFilter !== 'all' ||
    subjectFilter !== 'all' ||
    difficultyFilter !== 'all';

  /* =========================================================
     PAGINATION HANDLERS
  ========================================================= */

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  /* =========================================================
     TABLE COLUMNS
  ========================================================= */

  const columns = [
    {
      key: 'name',

      header: 'Test Name',

      className: 'min-w-[240px]',

      getTitle: (row: DashboardTableTest) => row.name,

      render: (row: DashboardTableTest) => (
        <span className="block max-w-[280px] truncate font-medium text-[#344054]">{row.name}</span>
      ),
    },

    {
      key: 'subject',

      header: 'Subject',

      className: 'min-w-[140px]',

      getTitle: (row: DashboardTableTest) => row.subject,

      render: (row: DashboardTableTest) => (
        <span className="block max-w-[140px] truncate">{row.subject}</span>
      ),
    },

    {
      key: 'topic',

      header: 'Topic',

      className: 'min-w-[180px]',

      getTitle: (row: DashboardTableTest) => row.topic,

      render: (row: DashboardTableTest) => (
        <span className="block max-w-[180px] truncate">{row.topic}</span>
      ),
    },

    {
      key: 'questions',

      header: "Q's",

      className: 'w-[90px] whitespace-nowrap',

      getTitle: (row: DashboardTableTest) => `${row.questions} questions`,
    },

    {
      key: 'marks',

      header: 'Marks',

      className: 'w-[90px] whitespace-nowrap',

      getTitle: (row: DashboardTableTest) => `${row.marks} marks`,
    },

    {
      key: 'duration',

      header: 'Duration',

      className: 'w-[110px] whitespace-nowrap',

      getTitle: (row: DashboardTableTest) => `${row.duration} minutes`,

      render: (row: DashboardTableTest) => <span>{row.duration} mins</span>,
    },

    {
      key: 'difficulty',

      header: 'Difficulty',

      className: 'w-[130px]',

      getTitle: (row: DashboardTableTest) => row.difficulty,

      render: (row: DashboardTableTest) => <DifficultyBadge difficulty={row.difficulty} />,
    },

    {
      key: 'status',

      header: 'Status',

      className: 'w-[130px]',

      getTitle: (row: DashboardTableTest) => row.status,

      render: (row: DashboardTableTest) => <StatusBadge status={row.status} />,
    },

    {
      key: 'actions',

      header: 'Actions',

      className: 'w-[180px] text-center',

      render: (row: DashboardTableTest) => {
        const isPublished = getStatusValue(row.status) === 'published';

        const isActionLoading = actionLoadingId === row.id;

        return (
          <div className="flex items-center justify-center gap-1">
            {/* View */}

            <button
              type="button"
              title="View test"
              aria-label={`View ${row.name}`}
              onClick={() => handleView(row)}
              disabled={isActionLoading}
              className="
                flex
                h-8
                w-8
                cursor-pointer
                items-center
                justify-center
                rounded-md
                text-[#667085]
                transition
                hover:bg-[#EEF4FF]
                hover:text-[#315BEF]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Eye size={17} strokeWidth={1.8} />
            </button>

            {/* Edit */}

            <button
              type="button"
              title="Edit test"
              aria-label={`Edit ${row.name}`}
              onClick={() => handleEdit(row)}
              disabled={isActionLoading}
              className="
                flex
                h-8
                w-8
                cursor-pointer
                items-center
                justify-center
                rounded-md
                text-[#667085]
                transition
                hover:bg-[#F2F4F7]
                hover:text-[#344054]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Pencil size={17} strokeWidth={1.8} />
            </button>

            {/* Publish / Unpublish */}

            <button
              type="button"
              title={isPublished ? 'Unpublish test' : 'Publish test'}
              aria-label={isPublished ? `Unpublish ${row.name}` : `Publish ${row.name}`}
              onClick={() => handleTogglePublish(row)}
              disabled={isActionLoading}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#667085] transition hover:bg-[#ECFDF3] hover:text-[#12B76A] disabled:cursor-not-allowed disabled:opacity-40 "
            >
              {isPublished ? (
                <ToggleRight size={20} strokeWidth={1.8} className="text-[#12B76A]" />
              ) : (
                <ToggleLeft size={20} strokeWidth={1.8} className="text-[#98A2B3]" />
              )}
            </button>

            {/* Delete */}

            <button
              type="button"
              title="Delete test"
              aria-label={`Delete ${row.name}`}
              onClick={() => handleDelete(row)}
              disabled={isActionLoading}
              className="
                flex
                h-8
                w-8
                cursor-pointer
                items-center
                justify-center
                rounded-md
                text-[#667085]
                transition
                hover:bg-[#FEF3F2]
                hover:text-[#D92D20]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Trash2 size={17} strokeWidth={1.8} />
            </button>
          </div>
        );
      },
    },
  ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-w-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7 xl:px-8">
      <div className="mx-auto w-full max-w-[1600px] min-w-0">
        {/* =================================================
            PAGE HEADER
        ================================================== */}

        <PageHeader
          title="Test Management Dashboard"
          description="Monitor, create, and manage your student assessment benchmarks."
          breadcrumbs={[
            {
              label: 'Home',
              path: FRONTEND_ROUTES.DASHBOARD,
            },
            {
              label: 'Dashboard',
            },
          ]}
          actions={
            <Button type="button" onClick={handleCreateTest}>
              <Plus size={18} strokeWidth={2} />
              Create New Test
            </Button>
          }
        />

        {/* =================================================
            OVERVIEW CARDS

            LEFT AS MOCK DATA FOR NOW
        ================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="
                    rounded-xl
                    border
                    border-[#E4E7EC]
                    bg-white
                    px-5
                    py-5
                  "
              >
                {/* Card Header */}

                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-medium text-[#667085]">{stat.title}</p>

                  <div
                    className={`
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        ${stat.iconClass}
                      `}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                </div>

                {/* Number */}

                <p className="mt-4 text-[32px] font-semibold leading-9 tracking-[-0.02em] text-[#101828]">
                  {stat.value}
                </p>

                {/* Growth */}

                <div className="mt-2 flex items-center gap-1.5 text-[12px]">
                  <span
                    className={
                      stat.trend === 'up'
                        ? 'font-medium text-[#12B76A]'
                        : 'font-medium text-[#F04438]'
                    }
                  >
                    {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                  </span>

                  <span className="text-[#667085]">{stat.changeText}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* =================================================
            FILTERS
        ================================================== */}

        <div className="mb-6 rounded-xl border border-[#E4E7EC] bg-white p-4">
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-[1.25fr_1fr_1fr_auto]">
            {/* Search */}

            <input
              type="search"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search by test name..."
              className="
                h-10
                w-full
                rounded-lg
                border
                border-[#D0D5DD]
                bg-white
                px-3.5
                text-[14px]
                text-[#344054]
                outline-none
                placeholder:text-[#667085]
                focus:border-[#7594FF]
                focus:ring-1
                focus:ring-[#7594FF]
              "
            />

            {/* Subject */}

            <select
              value={subjectFilter}
              onChange={(event) => handleSubjectChange(event.target.value)}
              className="
                h-10
                w-full
                cursor-pointer
                rounded-lg
                border
                border-[#D0D5DD]
                bg-white
                px-3.5
                text-[14px]
                text-[#667085]
                outline-none
                focus:border-[#7594FF]
                focus:ring-1
                focus:ring-[#7594FF]
              "
            >
              <option value="all">Filter by Subject</option>

              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            {/* Difficulty */}

            <select
              value={difficultyFilter}
              onChange={(event) => handleDifficultyChange(event.target.value)}
              className="
                h-10
                w-full
                cursor-pointer
                rounded-lg
                border
                border-[#D0D5DD]
                bg-white
                px-3.5
                text-[14px]
                text-[#667085]
                outline-none
                focus:border-[#7594FF]
                focus:ring-1
                focus:ring-[#7594FF]
              "
            >
              <option value="all">Difficulty Level</option>

              {DIFFICULTY_OPTIONS.map((difficulty) => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>

            {/* Reset */}

            <button
              type="button"
              disabled={!hasActiveFilters}
              onClick={handleClearFilters}
              className="
                flex
                h-10
                cursor-pointer
                items-center
                justify-center
                gap-1.5
                whitespace-nowrap
                rounded-lg
                px-3
                text-[13px]
                font-medium
                text-[#667085]
                transition
                hover:bg-[#F2F4F7]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <RotateCcw size={14} strokeWidth={1.8} />
              Reset Filters
            </button>
          </div>

          {/* Status */}

          <div className="mt-2.5 md:w-[calc(50%-5px)] xl:w-[calc(25%-8px)]">
            <select
              value={statusFilter}
              onChange={(event) => handleStatusChange(event.target.value)}
              className="
                h-10
                w-full
                cursor-pointer
                rounded-lg
                border
                border-[#D0D5DD]
                bg-white
                px-3.5
                text-[14px]
                text-[#667085]
                outline-none
                focus:border-[#7594FF]
                focus:ring-1
                focus:ring-[#7594FF]
              "
            >
              <option value="all">Status</option>

              <option value="published">Published</option>

              <option value="scheduled">Scheduled</option>

              <option value="draft">Draft</option>

              <option value="unpublished">Unpublished</option>

              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* =================================================
            TABLE + PAGINATION
        ================================================== */}

        <div className="min-w-0 overflow-hidden rounded-xl border border-[#E4E7EC] bg-white">
          {/* Loading indicator */}

          {isLoading && (
            <div className="flex items-center justify-center gap-2 border-b border-[#E4E7EC] px-4 py-3 text-[13px] text-[#667085]">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#D0D5DD] border-t-[#315BEF]" />
              Loading tests...
            </div>
          )}

          <Table
            columns={columns}
            data={paginatedTests}
            getRowKey={(row) => row.id}
            showSerialNumber
            startIndex={(currentPage - 1) * pageSize}
            emptyMessage={isLoading ? 'Loading tests...' : 'No tests found'}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DIFFICULTY BADGE
========================================================= */

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const styles: Record<string, string> = {
    easy: 'bg-[#ECFDF3] text-[#027A48]',

    medium: 'bg-[#FFFAEB] text-[#B54708]',

    difficult: 'bg-[#6941C6] text-white',

    Easy: 'bg-[#ECFDF3] text-[#027A48]',

    Medium: 'bg-[#FFFAEB] text-[#B54708]',

    Difficult: 'bg-[#6941C6] text-white',
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-2.5
        py-1
        text-[11px]
        font-medium
        ${styles[difficulty] ?? 'bg-[#F2F4F7] text-[#475467]'}
      `}
    >
      {difficulty}
    </span>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Published: 'bg-[#ECFDF3] text-[#027A48]',

    Scheduled: 'bg-[#FFFAEB] text-[#B54708]',

    Draft: 'bg-[#EEF4FF] text-[#315BEF]',

    Unpublished: 'bg-[#F2F4F7] text-[#475467]',

    Expired: 'bg-[#FEF3F2] text-[#B42318]',
  };

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-2.5
        py-1
        text-[11px]
        font-medium
        ${styles[status] ?? 'bg-[#F2F4F7] text-[#475467]'}
      `}
    >
      {status}
    </span>
  );
}

export default DashboardPage;
