import React, { useState } from "react";
import {
  BookOpen,
  User,
  Clock,
  MapPin,
  Mail,
  Award,
  CheckCircle,
  X,
  Search,
  BookMarked
} from "lucide-react";
import { useStudent } from "./StudentContext";
import "./Courses.css";

const Courses = ({ courses: propCourses }) => {
  const context = useStudent();
  const coursesList = propCourses || context.courses || [];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCourseModal, setActiveCourseModal] = useState(null);

  const categories = ["All", "Core", "Elective", "Labs"];

  const filteredCourses = coursesList.filter((course) => {
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.faculty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="courses-page-container">
      {/* Header & Filter Controls */}
      <section className="courses-top-bar">
        <div className="courses-header-text">
          <h2>Enrolled Courses ({coursesList.length})</h2>
          <p>Review course syllabus, faculty schedules, and your module completion</p>
        </div>

        <div className="courses-filter-controls">
          <div className="courses-search-box">
            <Search size={16} className="courses-search-icon" />
            <input
              type="text"
              placeholder="Search by name, code or faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="category-pill-group">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Cards Grid */}
      <section className="courses-grid">
        {filteredCourses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-card-top">
              <div className="course-badge-row">
                <span className="course-code-badge">{course.code}</span>
                <span className="course-cat-badge">{course.category}</span>
                <span className="course-credits-badge">{course.credits} Credits</span>
              </div>
              <h3 className="course-title">{course.name}</h3>
            </div>

            <div className="course-card-body">
              <div className="faculty-row">
                <div className="faculty-avatar-mini">
                  <User size={15} />
                </div>
                <div className="faculty-info-text">
                  <span className="faculty-label">Faculty Instructor</span>
                  <span className="faculty-name">{course.faculty}</span>
                </div>
              </div>

              <div className="course-meta-row">
                <span className="course-meta-item">
                  <Clock size={13} /> {course.attendedLectures}/{course.totalLectures} Classes
                </span>
                <span className="course-meta-item">
                  <MapPin size={13} /> {course.room}
                </span>
              </div>

              <div className="course-progress-section">
                <div className="progress-info-row">
                  <span className="progress-text-label">Course Progress</span>
                  <span className="progress-percentage-val">{course.progress}%</span>
                </div>
                <div className="course-progress-track">
                  <div
                    className="course-progress-bar"
                    style={{
                      width: `${course.progress}%`,
                      background:
                        course.progress >= 80
                          ? "linear-gradient(90deg, #10b981, #059669)"
                          : course.progress >= 70
                          ? "linear-gradient(90deg, #3b82f6, #2563eb)"
                          : "linear-gradient(90deg, #f59e0b, #d97706)"
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="course-card-footer">
              <button
                type="button"
                className="view-course-btn"
                onClick={() => setActiveCourseModal(course)}
              >
                <BookMarked size={16} />
                <span>View Course</span>
              </button>
            </div>
          </div>
        ))}

        {filteredCourses.length === 0 && (
          <div className="no-courses-placeholder">
            <BookOpen size={42} className="no-courses-icon" />
            <h4>No courses found</h4>
            <p>Try clearing your search query or switching the category filter.</p>
          </div>
        )}
      </section>

      {/* Course Detail Modal */}
      {activeCourseModal && (
        <div
          className="course-modal-backdrop"
          onClick={() => setActiveCourseModal(null)}
        >
          <div
            className="course-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="course-modal-header">
              <div className="modal-title-wrap">
                <div className="modal-code-pill">{activeCourseModal.code}</div>
                <h3>{activeCourseModal.name}</h3>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setActiveCourseModal(null)}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div className="course-modal-body">
              <p className="course-modal-desc">{activeCourseModal.description}</p>

              <div className="modal-info-tiles">
                <div className="modal-tile">
                  <span className="tile-label">Instructor</span>
                  <strong className="tile-value">{activeCourseModal.faculty}</strong>
                  <span className="tile-sub">{activeCourseModal.facultyEmail}</span>
                </div>

                <div className="modal-tile">
                  <span className="tile-label">Schedule & Room</span>
                  <strong className="tile-value">{activeCourseModal.schedule}</strong>
                  <span className="tile-sub">{activeCourseModal.room}</span>
                </div>

                <div className="modal-tile">
                  <span className="tile-label">Credits & Category</span>
                  <strong className="tile-value">
                    {activeCourseModal.credits} Credits
                  </strong>
                  <span className="tile-sub">{activeCourseModal.category} Course</span>
                </div>

                <div className="modal-tile">
                  <span className="tile-label">Attendance & Completion</span>
                  <strong className="tile-value text-emerald">
                    {activeCourseModal.progress}% Completed
                  </strong>
                  <span className="tile-sub">
                    {activeCourseModal.attendedLectures} / {activeCourseModal.totalLectures} sessions attended
                  </span>
                </div>
              </div>

              <div className="modal-syllabus-section">
                <h4>Core Syllabus Highlights</h4>
                <ul className="syllabus-list">
                  <li>
                    <CheckCircle size={15} className="text-emerald" />
                    <span>Unit 1: Foundations, Principles & Architecture</span>
                  </li>
                  <li>
                    <CheckCircle size={15} className="text-emerald" />
                    <span>Unit 2: Implementation & Practical Lab Protocols</span>
                  </li>
                  <li>
                    <CheckCircle size={15} className="text-emerald" />
                    <span>Unit 3: Real-World Case Studies & Performance Benchmarks</span>
                  </li>
                  <li>
                    <CheckCircle size={15} className="text-emerald" />
                    <span>Unit 4: Final Capstone Project & Viva Evaluation</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="course-modal-footer">
              <button
                className="modal-btn-close"
                onClick={() => setActiveCourseModal(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
