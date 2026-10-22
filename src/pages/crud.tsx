
import { useState, useEffect } from 'react';
import scss from '../styles/landingPage.module.scss';

type Student = {
  id: string;
  name: string;
  course: string;
};

type Activity = {
  id: string;
  studentId: string;
  action: 'Added' | 'Updated' | 'Deleted';
  previousName: string;
  previousCourse: string;
  newName: string;
  newCourse: string;
  date: string;
};

export default function Crud() {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [editId, setEditId] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setStudents(JSON.parse(localStorage.getItem('students') || '[]'));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('students', JSON.stringify(students));
    }
  }, [students, loaded]);

  function logActivity(activity: Omit<Activity, 'id' | 'date'>) {
    const activities = JSON.parse(
      localStorage.getItem('activities') || '[]'
    );

    activities.unshift({
      ...activity,
      id: Date.now().toString() + Math.random(),
      date: new Date().toISOString(),
    });

    localStorage.setItem('activities', JSON.stringify(activities));
  }

  function saveRecord(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newName = name.trim();
    const newCourse = course.trim();

    if (!newName || !newCourse) return;

    if (editId) {
      const oldStudent = students.find((s) => s.id === editId);
      if (!oldStudent) return;

      setStudents(students.map((s) =>
        s.id === editId
          ? { ...s, name: newName, course: newCourse }
          : s
      ));

      logActivity({
        studentId: editId,
        action: 'Updated',
        previousName: oldStudent.name,
        previousCourse: oldStudent.course,
        newName,
        newCourse,
      });
    } else {
      const highestId = students.reduce((max, s) => {
        const number = Number(s.id.replace('STU-', '')) || 0;
        return Math.max(max, number);
      }, 0);

      const id = `STU-${String(highestId + 1).padStart(3, '0')}`;

      setStudents([...students, { id, name: newName, course: newCourse }]);

      logActivity({
        studentId: id,
        action: 'Added',
        previousName: '-',
        previousCourse: '-',
        newName,
        newCourse,
      });
    }

    setName('');
    setCourse('');
    setEditId('');
  }

  function editRecord(student: Student) {
    setName(student.name);
    setCourse(student.course);
    setEditId(student.id);
  }

  function deleteRecord(student: Student) {
    if (!window.confirm(`Delete ${student.name}?`)) return;

    logActivity({
      studentId: student.id,
      action: 'Deleted',
      previousName: student.name,
      previousCourse: student.course,
      newName: '-',
      newCourse: '-',
    });

    setStudents(students.filter((s) => s.id !== student.id));

    if (editId === student.id) {
      setName('');
      setCourse('');
      setEditId('');
    }
  }

  return (
    <div className={scss.appWrapper}>
      <header className={scss.navbar}>
        <h2>Student Management</h2>
        <a href="/addrecord">View Activity Log</a>
      </header>

      <main className={scss.main}>
        <section className={scss.about}>
          <h2>{editId ? 'Edit Student' : 'Add Student'}</h2>

          <form onSubmit={saveRecord} className={scss.recordForm}>
            <input
              placeholder="Student Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              placeholder="Course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />

            <button type="submit" disabled={!loaded}>
              {editId ? 'Update Record' : 'Add Record'}
            </button>

            {editId && (
              <button
                type="button"
                onClick={() => {
                  setName('');
                  setCourse('');
                  setEditId('');
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        <section className={scss.skills}>
          <h2>Current Students</h2>

          <div className={scss.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.course}</td>
                    <td>
                      <button onClick={() => editRecord(student)}>
                        Edit
                      </button>
                      <button
                        className={scss.deleteButton}
                        onClick={() => deleteRecord(student)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {loaded && students.length === 0 && (
                  <tr>
                    <td colSpan={4} className={scss.emptyMessage}>
                      No student records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
