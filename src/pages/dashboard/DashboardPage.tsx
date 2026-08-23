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
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';

import FRONTEND_ROUTES from '@/constants/frontendRoutes';

import type { DashboardTest } from '@/types/dashboard';

import { DASHBOARD_TESTS } from '@/mockData/dashboardTests';

import { confirmDelete } from '@/utils/alert';
import { showSuccess } from '@/utils/toast';
import { DIFFICULTY_OPTIONS } from '@/constants/test';

function DashboardPage() {
  const navigate = useNavigate();

  /* =========================================================
     FILTER STATE
  ========================================================= */

  const [search, setSearch] = useState('');

  const [statusFilter, setStatusFilter] =
    useState('all');

  const [subjectFilter, setSubjectFilter] =
    useState('all');

  const [difficultyFilter, setDifficultyFilter] =
    useState('all');

  /* =========================================================
     PAGINATION STATE
  ========================================================= */

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(10);

  /* =========================================================
     SUBJECT OPTIONS
  ========================================================= */

  const subjects = useMemo(() => {
    return Array.from(
      new Set(
        DASHBOARD_TESTS.map(
          (test) => test.subject,
        ),
      ),
    ).sort();
  }, []);

  /* =========================================================
     FILTER TESTS
  ========================================================= */

  const filteredTests = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return DASHBOARD_TESTS.filter(
      (test) => {
        const matchesSearch =
          searchValue === '' ||
          test.name
            .toLowerCase()
            .includes(searchValue) ||
          test.subject
            .toLowerCase()
            .includes(searchValue) ||
          test.topic
            .toLowerCase()
            .includes(searchValue);

        const matchesStatus =
          statusFilter === 'all' ||
          test.status === statusFilter;

        const matchesSubject =
          subjectFilter === 'all' ||
          test.subject === subjectFilter;

        const matchesDifficulty =
          difficultyFilter === 'all' ||
          test.difficulty ===
            difficultyFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesSubject &&
          matchesDifficulty
        );
      },
    );
  }, [
    search,
    statusFilter,
    subjectFilter,
    difficultyFilter,
  ]);

  /* =========================================================
     PAGINATION DATA
  ========================================================= */

  const totalItems =
    filteredTests.length;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalItems / pageSize,
    ),
  );

  const paginatedTests =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) * pageSize;

      return filteredTests.slice(
        startIndex,
        startIndex + pageSize,
      );
    }, [
      filteredTests,
      currentPage,
      pageSize,
    ]);

  /* =========================================================
     DASHBOARD OVERVIEW
     
     These values currently represent the UI mock.
     They can be replaced with API-derived values later.
  ========================================================= */

  const overviewStats = [
    {
      title: 'Total Tests',
      value: '148',
      change: '+12%',
      changeText: 'vs last month',
      trend: 'up',
      icon: List,
      iconClass:
        'bg-[#F0FDF4] text-[#315BEF]',
    },

    {
      title: 'Published Tests',
      value: '94',
      change: '+8%',
      changeText: 'vs last month',
      trend: 'up',
      icon: Check,
      iconClass:
        'bg-[#ECFDF3] text-[#12B76A]',
    },

    {
      title: 'Scheduled Tests',
      value: '32',
      change: '+4%',
      changeText: 'vs last month',
      trend: 'up',
      icon: Timer,
      iconClass:
        'bg-[#FFFAEB] text-[#F5B800]',
    },

    {
      title: 'Draft Tests',
      value: '22',
      change: '-2%',
      changeText: 'vs last month',
      trend: 'down',
      icon: FilePlus2,
      iconClass:
        'bg-[#F8F9FC] text-[#667085]',
    },
  ] as const;

  /* =========================================================
     CREATE TEST
  ========================================================= */

  const handleCreateTest = () => {
    navigate(
      FRONTEND_ROUTES.TESTS.NEW,
    );
  };

  /* =========================================================
     VIEW TEST
  ========================================================= */

const handleView = (test: DashboardTest) => {
  navigate(
    FRONTEND_ROUTES.TESTS.PREVIEW(test.id),
  );
};

  /* =========================================================
     EDIT TEST
  ========================================================= */

const handleEdit = (test: DashboardTest) => {
  navigate(
    FRONTEND_ROUTES.TESTS.EDIT(test.id),
  );
};

  /* =========================================================
     DELETE TEST
  ========================================================= */

  const handleDelete = async (
    test: DashboardTest,
  ) => {
    const confirmed =
      await confirmDelete(
        test.name,
      );

    if (!confirmed) {
      return;
    }

    /*
     * DELETE API will be connected
     * during API integration.
     */

    showSuccess(
      'Test deleted successfully',
    );
  };

  /* =========================================================
     FILTER HANDLERS
  ========================================================= */

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (
    value: string,
  ) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSubjectChange = (
    value: string,
  ) => {
    setSubjectFilter(value);
    setCurrentPage(1);
  };

  const handleDifficultyChange = (
    value: string,
  ) => {
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

  const handlePageChange = (
    page: number,
  ) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (
    value: number,
  ) => {
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

      className:
        'min-w-[240px]',

      getTitle: (
        row: DashboardTest,
      ) => row.name,

      render: (
        row: DashboardTest,
      ) => (
        <span className="block max-w-[280px] truncate font-medium text-[#344054]">
          {row.name}
        </span>
      ),
    },

    {
      key: 'subject',

      header: 'Subject',

      className:
        'min-w-[140px]',

      getTitle: (
        row: DashboardTest,
      ) => row.subject,

      render: (
        row: DashboardTest,
      ) => (
        <span className="block max-w-[140px] truncate">
          {row.subject}
        </span>
      ),
    },

    {
      key: 'topic',

      header: 'Topic',

      className:
        'min-w-[180px]',

      getTitle: (
        row: DashboardTest,
      ) => row.topic,

      render: (
        row: DashboardTest,
      ) => (
        <span className="block max-w-[180px] truncate">
          {row.topic}
        </span>
      ),
    },

    {
      key: 'questions',

      header: "Q's",

      className:
        'w-[90px] whitespace-nowrap',

      getTitle: (
        row: DashboardTest,
      ) =>
        `${row.questions} questions`,
    },

    {
      key: 'marks',

      header: 'Marks',

      className:
        'w-[90px] whitespace-nowrap',

      getTitle: (
        row: DashboardTest,
      ) =>
        `${row.marks} marks`,
    },

    {
      key: 'duration',

      header: 'Duration',

      className:
        'w-[110px] whitespace-nowrap',

      getTitle: (
        row: DashboardTest,
      ) =>
        `${row.duration} minutes`,

      render: (
        row: DashboardTest,
      ) => (
        <span>
          {row.duration} mins
        </span>
      ),
    },

    {
      key: 'difficulty',

      header: 'Difficulty',

      className:
        'w-[130px]',

      getTitle: (
        row: DashboardTest,
      ) => row.difficulty,

      render: (
        row: DashboardTest,
      ) => (
        <DifficultyBadge
          difficulty={
            row.difficulty
          }
        />
      ),
    },

    {
      key: 'status',

      header: 'Status',

      className:
        'w-[130px]',

      getTitle: (
        row: DashboardTest,
      ) => row.status,

      render: (
        row: DashboardTest,
      ) => (
        <StatusBadge
          status={row.status}
        />
      ),
    },

    {
      key: 'actions',

      header: 'Actions',

      className:
        'w-[140px] text-center',

      render: (
        row: DashboardTest,
      ) => (
        <div className="flex items-center justify-center gap-1">
          {/* View */}

          <button
            type="button"
            title="View test"
            aria-label={`View ${row.name}`}
            onClick={() =>
              handleView(row)
            }
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
            "
          >
            <Eye
              size={17}
              strokeWidth={1.8}
            />
          </button>

          {/* Edit */}

          <button
            type="button"
            title="Edit test"
            aria-label={`Edit ${row.name}`}
            onClick={() =>
              handleEdit(row)
            }
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
            "
          >
            <Pencil
              size={17}
              strokeWidth={1.8}
            />
          </button>

          {/* Delete */}

          <button
            type="button"
            title="Delete test"
            aria-label={`Delete ${row.name}`}
            onClick={() =>
              handleDelete(row)
            }
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
            "
          >
            <Trash2
              size={17}
              strokeWidth={1.8}
            />
          </button>
        </div>
      ),
    },
  ];

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
            <Button
              type="button"
              onClick={
                handleCreateTest
              }
            >
              <Plus
                size={18}
                strokeWidth={2}
              />

              Create New Test
            </Button>
          }
        />

        {/* =================================================
            OVERVIEW CARDS
        ================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewStats.map(
            (stat) => {
              const Icon =
                stat.icon;

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
                    <p className="text-[14px] font-medium text-[#667085]">
                      {stat.title}
                    </p>

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
                      <Icon
                        size={18}
                        strokeWidth={
                          1.8
                        }
                      />
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
                        stat.trend ===
                        'up'
                          ? 'font-medium text-[#12B76A]'
                          : 'font-medium text-[#F04438]'
                      }
                    >
                      {stat.trend ===
                      'up'
                        ? '↑'
                        : '↓'}{' '}
                      {stat.change}
                    </span>

                    <span className="text-[#667085]">
                      {stat.changeText}
                    </span>
                  </div>
                </div>
              );
            },
          )}
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
              onChange={(event) =>
                handleSearchChange(
                  event.target.value,
                )
              }
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
              value={
                subjectFilter
              }
              onChange={(event) =>
                handleSubjectChange(
                  event.target
                    .value,
                )
              }
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
              <option value="all">
                Filter by Subject
              </option>

              {subjects.map(
                (subject) => (
                  <option
                    key={subject}
                    value={subject}
                  >
                    {subject}
                  </option>
                ),
              )}
            </select>

            {/* Difficulty */}

            <select
  value={difficultyFilter}
  onChange={(event) =>
    handleDifficultyChange(
      event.target.value,
    )
  }
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
  <option value="all">
    Difficulty Level
  </option>

  {DIFFICULTY_OPTIONS.map(
    (difficulty) => (
      <option
        key={difficulty.value}
        value={difficulty.value}
      >
        {difficulty.label}
      </option>
    ),
  )}
</select>

            {/* Reset */}

            <button
              type="button"
              disabled={
                !hasActiveFilters
              }
              onClick={
                handleClearFilters
              }
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
              <RotateCcw
                size={14}
                strokeWidth={1.8}
              />

              Reset Filters
            </button>
          </div>

          {/* Status row */}

          <div className="mt-2.5 md:w-[calc(50%-5px)] xl:w-[calc(25%-8px)]">
            <select
              value={
                statusFilter
              }
              onChange={(event) =>
                handleStatusChange(
                  event.target
                    .value,
                )
              }
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
              <option value="all">
                Status
              </option>

              <option value="Published">
                Published
              </option>

              <option value="Scheduled">
                Scheduled
              </option>

              <option value="Draft">
                Draft
              </option>
            </select>
          </div>
        </div>

        {/* =================================================
            TABLE + PAGINATION
        ================================================== */}

        <div className="min-w-0 overflow-hidden rounded-xl border border-[#E4E7EC] bg-white">
          <Table
            columns={columns}
            data={paginatedTests}
            getRowKey={(row) =>
              row.id
            }
            showSerialNumber
            startIndex={
              (currentPage - 1) *
              pageSize
            }
            emptyMessage="No tests found"
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={
              handlePageChange
            }
            onPageSizeChange={
              handlePageSizeChange
            }
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DIFFICULTY BADGE
========================================================= */

function DifficultyBadge({
  difficulty,
}: {
  difficulty: DashboardTest['difficulty'];
}) {
  const styles: Record<
    DashboardTest['difficulty'],
    string
  > = {
    Easy:
      'bg-[#ECFDF3] text-[#027A48]',

    Medium:
      'bg-[#FFFAEB] text-[#B54708]',

    Difficult:
      'bg-[#6941C6] text-white',
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
        ${styles[difficulty]}
      `}
    >
      {difficulty}
    </span>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status: DashboardTest['status'];
}) {
  const styles: Record<
    DashboardTest['status'],
    string
  > = {
    Published:
      'bg-[#ECFDF3] text-[#027A48]',

    Scheduled:
      'bg-[#FFFAEB] text-[#B54708]',

    Draft:
      'bg-[#EEF4FF] text-[#315BEF]',
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
        ${styles[status]}
      `}
    >
      {status}
    </span>
  );
}

export default DashboardPage;