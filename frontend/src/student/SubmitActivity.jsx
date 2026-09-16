import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Upload,
  Calendar,
  Clock,
  Users,
  Recycle,
  MapPin,
  Sparkles,
  Image,
  Video,
  FileText,
  CheckCircle2,
  AlertCircle,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import { useStudent } from "./StudentContext";
import FileUploader from "./components/FileUploader";
import "./SubmitActivity.css";

const SubmitActivity = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tasks, handleActivitySubmit } = useStudent();

  const preselectedTaskId = location.state?.taskId || tasks[0]?.id;

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      taskId: preselectedTaskId,
      customActivityName: "",
      activityDate: new Date().toISOString().split("T")[0],
      hoursSpent: "3.5",
      peopleInvolved: "6",
      wasteCollectedKg: "15.0",
      distanceCoveredKm: "2.0",
      description: "",
      reflection: ""
    }
  });

  const selectedTask = tasks.find((t) => t.id === watch("taskId"));

  const onSubmit = (data) => {
    // Validate that at least one file was uploaded
    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one photo or video as authentic field evidence.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const createdSub = handleActivitySubmit({
        ...data,
        files: uploadedFiles
      });

      setIsSubmitting(false);
      setSubmissionSuccess(createdSub);
    }, 800);
  };

  return (
    <div className="submit-activity-page">
      {/* Confirmation Card after Success */}
      {submissionSuccess && (
        <section className="submission-success-banner glass-card">
          <div className="success-icon-halo">
            <CheckCircle2 size={38} className="text-emerald-400" />
          </div>
          <div className="success-banner-body">
            <span className="success-badge">VERIFICATION RECEIVED</span>
            <h3>Evidence Submitted Successfully! 🌱</h3>
            <p>
              Your submission (ID: <strong>{submissionSuccess.id}</strong>) for{" "}
              <strong>"{submissionSuccess.activityName}"</strong> is now Under Review by our Regional Ecolympics Jury.
            </p>
            <div className="success-stats-pills">
              <span>{submissionSuccess.wasteCollectedKg} kg Waste Diverted</span>
              <span>{submissionSuccess.hoursSpent} Hours</span>
              <span>Pending +{submissionSuccess.points} Points</span>
            </div>
          </div>
          <div className="success-actions-col">
            <button
              type="button"
              className="eco-btn-primary"
              onClick={() => navigate("/student/submissions")}
            >
              View in My Submissions
            </button>
            <button
              type="button"
              className="eco-btn-secondary"
              onClick={() => {
                setSubmissionSuccess(null);
                setUploadedFiles([]);
              }}
            >
              Submit Another Activity
            </button>
          </div>
        </section>
      )}

      {/* Main Submission Form */}
      <div className="submit-form-card glass-card">
        <div className="submit-form-header">
          <div className="submit-leaf-halo">
            <Upload size={22} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="submit-page-title">Submit Climate Action Evidence</h1>
            <p className="submit-page-subtitle">
              Verify your environmental field initiatives with photos, metrics, and reflections to earn championship points.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="eco-submission-form">
          {/* Section 1: Task Selection & Date */}
          <div className="form-section-block">
            <h3 className="section-block-title">
              <Sparkles size={16} className="text-emerald-400" />
              1. Task Selection & Basic Info
            </h3>

            <div className="form-grid-two">
              <div className="form-field-group">
                <label className="field-label-txt">
                  Select Assigned Challenge *
                </label>
                <select
                  className={`glass-form-input ${errors.taskId ? "input-err" : ""}`}
                  {...register("taskId", { required: "Please select a task" })}
                >
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id} className="dark-option">
                      {t.title} (+{t.points} pts)
                    </option>
                  ))}
                  <option value="custom" className="dark-option">
                    Other / Community Special Initiative (+100 pts)
                  </option>
                </select>
                {selectedTask && (
                  <span className="field-helper-hint">
                    Category: <strong>{selectedTask.category}</strong> • Reward:{" "}
                    <strong>+{selectedTask.points} Points</strong>
                  </span>
                )}
              </div>

              <div className="form-field-group">
                <label className="field-label-txt">
                  Activity Execution Date *
                </label>
                <input
                  type="date"
                  className={`glass-form-input ${errors.activityDate ? "input-err" : ""}`}
                  {...register("activityDate", { required: "Date is required" })}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Quantitative Field Data */}
          <div className="form-section-block">
            <h3 className="section-block-title">
              <Recycle size={16} className="text-cyan-400" />
              2. Quantitative Impact Data
            </h3>

            <div className="form-grid-four">
              <div className="form-field-group">
                <label className="field-label-txt">
                  Waste Diverted (kg) *
                </label>
                <div className="input-with-icon">
                  <Recycle size={16} className="field-icon-left text-emerald-400" />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 15.5"
                    className={`glass-form-input with-pad ${errors.wasteCollectedKg ? "input-err" : ""}`}
                    {...register("wasteCollectedKg", {
                      required: "Please enter the amount of waste collected"
                    })}
                  />
                </div>
                {errors.wasteCollectedKg && (
                  <span className="error-msg-txt">{errors.wasteCollectedKg.message}</span>
                )}
              </div>

              <div className="form-field-group">
                <label className="field-label-txt">
                  Hours Spent *
                </label>
                <div className="input-with-icon">
                  <Clock size={16} className="field-icon-left text-amber-400" />
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 3.5"
                    className={`glass-form-input with-pad ${errors.hoursSpent ? "input-err" : ""}`}
                    {...register("hoursSpent", {
                      required: "Please enter time spent"
                    })}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label-txt">
                  People Involved *
                </label>
                <div className="input-with-icon">
                  <Users size={16} className="field-icon-left text-purple-400" />
                  <input
                    type="number"
                    placeholder="e.g. 8"
                    className={`glass-form-input with-pad ${errors.peopleInvolved ? "input-err" : ""}`}
                    {...register("peopleInvolved", {
                      required: "Number of participants is required"
                    })}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label-txt">
                  Distance / Area (km)
                </label>
                <div className="input-with-icon">
                  <MapPin size={16} className="field-icon-left text-blue-400" />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 2.0"
                    className="glass-form-input with-pad"
                    {...register("distanceCoveredKm")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Digital Evidence Upload */}
          <div className="form-section-block">
            <h3 className="section-block-title">
              <Image size={16} className="text-amber-400" />
              3. Upload Activity Photos & Videos *
            </h3>
            <p className="section-desc-txt">
              Upload clear field photographs, scale weigh-in receipts, and short video clips.
            </p>

            <FileUploader
              files={uploadedFiles}
              setFiles={setUploadedFiles}
              maxFiles={6}
            />
          </div>

          {/* Section 4: Description & Written Reflection */}
          <div className="form-section-block">
            <h3 className="section-block-title">
              <FileText size={16} className="text-emerald-400" />
              4. Description & Written Reflection *
            </h3>

            <div className="form-field-group">
              <label className="field-label-txt">
                Activity Summary / Description
              </label>
              <input
                type="text"
                placeholder="Brief summary of where and how the activity was conducted..."
                className="glass-form-input"
                {...register("description")}
              />
            </div>

            <div className="form-field-group">
              <label className="field-label-txt">
                Personal & Team Reflection *
              </label>
              <textarea
                rows="4"
                placeholder="Describe what you learned, challenges faced during segregation, and how your activity created a measurable community impact..."
                className={`glass-form-input glass-textarea ${errors.reflection ? "input-err" : ""}`}
                {...register("reflection", {
                  required: "Reflection is required for evaluation scoring"
                })}
              />
              {errors.reflection && (
                <span className="error-msg-txt">{errors.reflection.message}</span>
              )}
            </div>
          </div>

          {/* Submit Action Row */}
          <div className="form-bottom-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="eco-btn-primary submit-final-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner" />
                  <span>Submitting Evidence...</span>
                </>
              ) : (
                <>
                  <Upload size={18} />
                  <span>Submit Activity Evidence</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitActivity;
