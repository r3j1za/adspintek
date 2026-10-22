
import { useEffect, useState } from 'react';
import Link from 'next/link';
import scss from '../styles/landingPage.module.scss';

type Activity = {
  id: string;
  studentId?: string;
  studentName: string;
  action: 'Added' | 'Updated' | 'Deleted';
  previousName: string;
  previousCourse: string;
  newName: string;
  newCourse: string;
  date: string;
};

type FilterType = 'All' | 'Added' | 'Updated' | 'Deleted';

export default function AddRecord() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');
  const [loaded, setLoaded] = useState(false);

  function loadActivities() {
    try {
      const savedActivities = localStorage.getItem('activities');

      setActivities(
        savedActivities ? JSON.parse(savedActivities) : []
      );
    } catch (error) {
      console.error('Error loading activity history:', error);
      setActivities([]);
    }

    setLoaded(true);
  }

  useEffect(() => {
    // Load saved history from localStorage after mount (not available during SSR).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadActivities();

    window.addEventListener('focus', loadActivities);
    window.addEventListener('pageshow', loadActivities);

    function handleStorage(event: StorageEvent) {
      if (event.key === 'activities') {
        try {
          setActivities(
            event.newValue ? JSON.parse(event.newValue) : []
          );
        } catch {
          setActivities([]);
        }
      }
    }

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('focus', loadActivities);
      window.removeEventListener('pageshow', loadActivities);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  function resetHistory() {
    if (activities.length === 0) return;

    const confirmed = window.confirm(
      'Are you sure you want to clear all activity history? This cannot be undone.'
    );

    if (!confirmed) return;

    localStorage.removeItem('activities');
    setActivities([]);
    setSearch('');
    setFilter('All');
  }

  function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date || 'N/A';
    }

    return parsedDate.toLocaleString();
  }

  // Filter by action and search text.
  const filteredActivities = activities.filter((activity) => {
    const matchesFilter =
      filter === 'All' || activity.action === filter;

    const searchText = search.trim().toLowerCase();

    const searchableValues = [
      activity.studentId,
      activity.studentName,
      activity.action,
      activity.previousName,
      activity.previousCourse,
      activity.newName,
      activity.newCourse,
      activity.date,
      formatDate(activity.date),
    ];

    const matchesSearch =
      !searchText ||
      searchableValues.some((value) =>
        String(value ?? '').toLowerCase().includes(searchText)
      );

    return matchesFilter && matchesSearch;
  });

  const filterOptions: FilterType[] = [
    'All',
    'Added',
    'Updated',
    'Deleted',
  ];

  return (
    <div className={scss.appWrapper}>
      <header className={scss.navbar}>
        <h2>Student Management</h2>

        <nav>
          <Link href="/crud">Student Records</Link>
        </nav>
      </header>

      <main className={scss.main}>
        <section>
          <div className={scss.recordHeader}>
            <div>
              <h1>Activity History</h1>
              <p>
                Track and filter student records that were added,
                updated, or deleted.
              </p>
            </div>

            <button
              type="button"
              className={scss.resetButton}
              onClick={resetHistory}
              disabled={!loaded || activities.length === 0}
            >
              Reset History
            </button>
          </div>

          {/* Search bar */}
          <div className={scss.searchContainer}>
            <input
              type="search"
              className={scss.searchInput}
              placeholder="Search ID, student name, course, or date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search activity history"
            />

            {search && (
              <button
                type="button"
                className={scss.clearSearchButton}
                onClick={() => setSearch('')}
              >
                Clear
              </button>
            )}
          </div>

          {/* Action filters without numbers */}
          <div
            className={scss.filterTabs}
            role="group"
            aria-label="Filter activity by action"
          >
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`${scss.filterTab} ${
                  filter === option ? scss.activeFilterTab : ''
                }`}
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
              >
                {option}
              </button>
            ))}
          </div>

          <p className={scss.searchResults}>
            Showing {filteredActivities.length} of {activities.length}{' '}
            activity record(s)
          </p>

          {/* Activity table */}
          <div className={scss.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>Date &amp; Time</th>
                  <th>Student ID</th>
                  <th>Action</th>
                  <th>Student Name</th>
                  <th>Previous Name</th>
                  <th>Previous Course</th>
                  <th>New Name</th>
                  <th>New Course</th>
                </tr>
              </thead>

              <tbody>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{formatDate(activity.date)}</td>
                      <td>{activity.studentId || '-'}</td>

                      <td>
                        <span
                          className={
                            activity.action === 'Added'
                              ? scss.added
                              : activity.action === 'Updated'
                              ? scss.updated
                              : scss.deleted
                          }
                        >
                          {activity.action}
                        </span>
                      </td>

                      <td>{activity.studentName || '-'}</td>
                      <td>{activity.previousName || '-'}</td>
                      <td>{activity.previousCourse || '-'}</td>
                      <td>{activity.newName || '-'}</td>
                      <td>{activity.newCourse || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className={scss.emptyMessage}>
                      {!loaded
                        ? 'Loading activity history...'
                        : search.trim() || filter !== 'All'
                        ? 'No activities match your search or filter.'
                        : 'No activity history found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={scss.backLink}>
            <Link href="/crud">
              ← Back to Student Records
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
