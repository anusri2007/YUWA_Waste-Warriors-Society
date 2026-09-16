import { createContext, useContext, useState, useEffect } from "react";

// ==============================================================================
// INITIAL MOCK DATA - YUWA Waste Warriors Society Evaluator Submissions
// (Structured to mirror the planned Backend REST API models & schemas)
// ==============================================================================
const INITIAL_SUBMISSIONS = [
  {
    id: 1,
    team: "Eco Warriors",
    college: "ABC College of Engineering",
    task: "Waste Segregation & Composting",
    category: "Waste Segregation",
    submitted: "2 hours ago",
    submittedAt: "2026-09-16 10:45 AM",
    members: 4,
    lead: "Aarav Sharma",
    teamMembers: [
      { name: "Aarav Sharma", role: "Team Lead", studentId: "CS2101" },
      { name: "Priya Patel", role: "Logistics Coordinator", studentId: "EC2105" },
      { name: "Rahul Deshmukh", role: "Data Collector", studentId: "ME2112" },
      { name: "Sneha Nair", role: "Documentation Specialist", studentId: "CS2130" },
    ],
    status: "pending",
    description:
      "Our team established a three-tier waste segregation system across 4 campus departments and the central food cafeteria. We placed color-coded bins (Wet Organic, Dry Recyclable, Hazardous) and conducted a daily weighing and composting audit over 7 days. Over 240 kg of organic waste was diverted directly to the college composting pits.",
    impactMetrics: {
      wasteDivertedKg: 240,
      compostCreatedKg: 65,
      participantsEngaged: 350,
      binsInstalled: 18,
    },
    evidence: [
      {
        id: "ev-1",
        title: "Campus Segregation Bins Installation",
        type: "image",
        url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
        caption: "Color-coded wet and dry waste segregation stations set up at Department 2.",
      },
      {
        id: "ev-2",
        title: "Composting Pit Measurement & Audit",
        type: "image",
        url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
        caption: "Measuring daily collected organic waste before turning in the compost pit.",
      },
      {
        id: "ev-3",
        title: "Waste Audit Log & Faculty Signoff",
        type: "document",
        fileName: "EcoWarriors_Waste_Audit_Signoff.pdf",
        fileSize: "2.4 MB",
        caption: "Verified audit sheet signed by campus environmental officer.",
      },
    ],
    score: null,
    evaluation: null,
    rejection: null,
  },
  {
    id: 2,
    team: "Green Champs",
    college: "XYZ Institute of Technology",
    task: "Single-Use Plastic Collection Drive",
    category: "Plastic Collection",
    submitted: "4 hours ago",
    submittedAt: "2026-09-16 08:30 AM",
    members: 5,
    lead: "Vikram Mehta",
    teamMembers: [
      { name: "Vikram Mehta", role: "Team Lead", studentId: "IT301" },
      { name: "Ananya Roy", role: "Outreach Lead", studentId: "IT304" },
      { name: "Karan Johal", role: "Collection Lead", studentId: "CE312" },
      { name: "Neha Sen", role: "Safety Officer", studentId: "EE320" },
      { name: "Aditya Verma", role: "Media & Photos", studentId: "CS318" },
    ],
    status: "pending",
    description:
      "Conducted a campus-wide drive to eliminate single-use plastic cups, water bottles, and polythene wrappers. Set up 3 exchange kiosks where students exchanged 10 discarded plastic items for cloth bags sponsored by the student union. All collected plastic was bundled and transferred to a certified local recycling facility.",
    impactMetrics: {
      plasticBottlesCollected: 1840,
      plasticWeightKg: 115,
      clothBagsDistributed: 150,
      studentPledges: 420,
    },
    evidence: [
      {
        id: "ev-4",
        title: "Plastic Exchange Booth in Operation",
        type: "image",
        url: "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&w=600&q=80",
        caption: "Students trading single-use plastic bottles for eco-friendly tote bags.",
      },
      {
        id: "ev-5",
        title: "Weighing & Handover to Recycler",
        type: "image",
        url: "https://images.unsplash.com/photo-1591193686104-fddba4d0e4d8?auto=format&fit=crop&w=600&q=80",
        caption: "Official handover receipt and truck loading at local authorized recycling partner.",
      },
      {
        id: "ev-6",
        title: "Recycling Facility Handover Receipt",
        type: "document",
        fileName: "GreenChamps_PlasticRecycling_Receipt.pdf",
        fileSize: "1.1 MB",
        caption: "Acknowledged receipt by GreenCircle Recyclers Ltd.",
      },
    ],
    score: null,
    evaluation: null,
    rejection: null,
  },
  {
    id: 3,
    team: "Earth Heroes",
    college: "DEF National University",
    task: "Campus Cleanliness & Tree Plantation",
    category: "Tree Plantation",
    submitted: "1 day ago",
    submittedAt: "2026-09-15 02:15 PM",
    members: 4,
    lead: "Rohan Kulkarni",
    teamMembers: [
      { name: "Rohan Kulkarni", role: "Team Lead", studentId: "EN401" },
      { name: "Divya Rao", role: "Saplings Coordinator", studentId: "BT408" },
      { name: "Farhan Ali", role: "Ground Team", studentId: "CV415" },
      { name: "Meera Joshi", role: "Soil Quality Auditor", studentId: "BT422" },
    ],
    status: "evaluated",
    score: "88/100",
    description:
      "Planted 60 native saplings (Neem, Peepal, Jamun) across barren patches on the eastern campus border. Prepared organic compost beds with student volunteers, installed drip irrigation pipes with reclaimed rainwater, and set up a student care roster for 6 months.",
    impactMetrics: {
      treesPlanted: 60,
      areaGreenCoverSqM: 850,
      volunteersMobilized: 85,
      waterSavedLitersDaily: 120,
    },
    evidence: [
      {
        id: "ev-7",
        title: "Plantation Drive Before & After",
        type: "image",
        url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
        caption: "Native saplings planted with tree guards and geotag markers.",
      },
      {
        id: "ev-8",
        title: "Rainwater Drip Irrigation Setup",
        type: "image",
        url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80",
        caption: "Drip lines connected to campus rainwater storage tank.",
      },
    ],
    evaluation: {
      totalScore: 88,
      evaluatedAt: "2026-09-15 05:40 PM",
      evaluatorName: "Evaluator (YUWA Society)",
      feedback:
        "Outstanding community mobilization and excellent choice of indigenous tree species. The drip irrigation setup ensures high seedling survival. Good documentation of the geotags.",
      criteriaScores: {
        impact: 28, // out of 30
        execution: 26, // out of 30
        authenticity: 18, // out of 20
        sustainability: 16, // out of 20
      },
    },
    rejection: null,
  },
  {
    id: 4,
    team: "Clean City Pioneers",
    college: "PQR College of Sciences",
    task: "Community E-Waste Disposal Drive",
    category: "E-Waste Drive",
    submitted: "2 days ago",
    submittedAt: "2026-09-14 11:20 AM",
    members: 3,
    lead: "Tanvi Gupta",
    teamMembers: [
      { name: "Tanvi Gupta", role: "Team Lead", studentId: "EC501" },
      { name: "Sameer Saxena", role: "Logistics", studentId: "CS510" },
      { name: "Kavita Rao", role: "Public Relations", studentId: "IT515" },
    ],
    status: "rejected",
    score: null,
    description:
      "Collected discarded electronic items such as broken cables, phone batteries, keyboards, and mice from neighborhood residences. The items were collected in cardboxes.",
    impactMetrics: {
      eWasteItemsCount: 42,
      weightCollectedKg: 28,
    },
    evidence: [
      {
        id: "ev-9",
        title: "Collected Items Photo",
        type: "image",
        url: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80",
        caption: "Photo of box containing computer cables and accessories.",
      },
    ],
    evaluation: null,
    rejection: {
      rejectedAt: "2026-09-14 04:30 PM",
      evaluatorName: "Evaluator (YUWA Society)",
      reason: "Incomplete Evidence & Lack of Authorized Recycler Handover",
      feedback:
        "Hazardous electronic items (especially lithium-ion batteries and printed circuit boards) require certified e-waste handler chain of custody documentation. No receipt from an authorized PCB recycler was provided. Please re-submit with authorized disposal documentation.",
    },
  },
  {
    id: 5,
    team: "Zero Waste Guild",
    college: "KLU Green Campus Initiative",
    task: "Cafeteria Food Waste Biogas Model",
    category: "Waste Segregation",
    submitted: "1 day ago",
    submittedAt: "2026-09-15 09:10 AM",
    members: 4,
    lead: "Karthik Reddy",
    teamMembers: [
      { name: "Karthik Reddy", role: "Team Lead", studentId: "240003001" },
      { name: "Bhavana Krishna", role: "Biochemical Analyst", studentId: "240003022" },
      { name: "Vamsi Teja", role: "Mechanical Design", studentId: "240003045" },
      { name: "Sanya Roy", role: "Reporting", studentId: "240003088" },
    ],
    status: "pending",
    description:
      "Designed and piloted a working 50L micro-anaerobic digester prototype processing food waste from the hostel mess. Produces methane gas used for tea stoves in the common area and liquid slurry nutrient-rich bio-fertilizer for campus gardens.",
    impactMetrics: {
      foodWasteDigestedDailyKg: 35,
      biogasGeneratedLiters: 140,
      slurryFertilizerOutputLiters: 45,
    },
    evidence: [
      {
        id: "ev-10",
        title: "Micro Anaerobic Digester Prototype",
        type: "image",
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
        caption: "Working digester connected to gas scrubber and pressure manometer.",
      },
      {
        id: "ev-11",
        title: "Test Burn & Gas Output Verification",
        type: "image",
        url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
        caption: "Blue flame demonstration verifying methane purity and flow rate.",
      },
    ],
    score: null,
    evaluation: null,
    rejection: null,
  },
  {
    id: 6,
    team: "Eco Vanguard",
    college: "SRM University",
    task: "Paper Recycling & Circular Notebooks",
    category: "Waste Segregation",
    submitted: "3 days ago",
    submittedAt: "2026-09-13 11:00 AM",
    members: 5,
    lead: "Pooja Sundaram",
    teamMembers: [
      { name: "Pooja Sundaram", role: "Team Lead", studentId: "SRM-091" },
      { name: "Akash Deep", role: "Production Lead", studentId: "SRM-094" },
      { name: "Harini M.", role: "Quality Assurance", studentId: "SRM-102" },
      { name: "Gaurav Sen", role: "Distribution Lead", studentId: "SRM-108" },
      { name: "Ritika Ray", role: "Finance & Logs", studentId: "SRM-115" },
    ],
    status: "evaluated",
    score: "92/100",
    description:
      "Collected 410 kg of one-side-printed examination paper and unassigned lab manuals. Established a student-run manual paper-binding unit and produced 620 high-quality recycled study notebooks distributed free to underprivileged municipal school students.",
    impactMetrics: {
      paperCollectedKg: 410,
      notebooksCreated: 620,
      studentsSupported: 310,
      treesEquivalentSaved: 7,
    },
    evidence: [
      {
        id: "ev-12",
        title: "Paper Sorting & Manual Binding Unit",
        type: "image",
        url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
        caption: "Binding unit converting exam sheets into wirebound exercise books.",
      },
      {
        id: "ev-13",
        title: "School Distribution Ceremony",
        type: "image",
        url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
        caption: "Distribution of notebooks with municipal school headmaster acknowledgment.",
      },
    ],
    evaluation: {
      totalScore: 92,
      evaluatedAt: "2026-09-14 02:00 PM",
      evaluatorName: "Evaluator (YUWA Society)",
      feedback:
        "Exemplary circular economy project! Excellent execution from paper salvage to bound books and socially impactful distribution. Well-verified photos and receipts.",
      criteriaScores: {
        impact: 29,
        execution: 28,
        authenticity: 19,
        sustainability: 16,
      },
    },
    rejection: null,
  },
];

const LOCAL_STORAGE_KEY = "yuwa_evaluator_submissions_v1";

const EvaluatorContext = createContext(null);

export function EvaluatorProvider({ children }) {
  const [submissions, setSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to read evaluator submissions from localStorage:", e);
    }
    return INITIAL_SUBMISSIONS;
  });

  // Save changes to localStorage for persistent demonstration
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(submissions));
    } catch (e) {
      console.warn("Failed to persist evaluator submissions to localStorage:", e);
    }
  }, [submissions]);

  // Retrieve a single submission by ID
  const getSubmissionById = (id) => {
    return submissions.find((item) => item.id === Number(id)) || null;
  };

  // Evaluate / Approve a submission
  // (Ready to be wired to: PUT /api/evaluator/submissions/:id/evaluate)
  const evaluateSubmission = (id, { totalScore, criteriaScores, feedback, evaluatorName = "Evaluator (YUWA Society)" }) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === Number(id)) {
          const scoreDisplay = `${totalScore}/100`;
          return {
            ...sub,
            status: "evaluated",
            score: scoreDisplay,
            evaluation: {
              totalScore,
              criteriaScores: criteriaScores || {
                impact: Math.round(totalScore * 0.3),
                execution: Math.round(totalScore * 0.3),
                authenticity: Math.round(totalScore * 0.2),
                sustainability: Math.round(totalScore * 0.2),
              },
              feedback: feedback || "Evaluated by YUWA reviewer.",
              evaluatorName,
              evaluatedAt: new Date().toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            },
            rejection: null,
          };
        }
        return sub;
      })
    );
  };

  // Reject a submission with reason & comments
  // (Ready to be wired to: PUT /api/evaluator/submissions/:id/reject)
  const rejectSubmission = (id, { reason, feedback, evaluatorName = "Evaluator (YUWA Society)" }) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === Number(id)) {
          return {
            ...sub,
            status: "rejected",
            score: null,
            evaluation: null,
            rejection: {
              reason: reason || "Submission does not meet task guidelines.",
              feedback: feedback || "Please review guidelines and provide complete evidence.",
              evaluatorName,
              rejectedAt: new Date().toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            },
          };
        }
        return sub;
      })
    );
  };

  // Re-open / reset a submission to pending (if evaluator wants to re-evaluate)
  const reopenSubmission = (id) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === Number(id)) {
          return {
            ...sub,
            status: "pending",
            score: null,
            evaluation: null,
            rejection: null,
          };
        }
        return sub;
      })
    );
  };

  // Reset all data back to original initial state
  const resetToInitialData = () => {
    setSubmissions(INITIAL_SUBMISSIONS);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to clear localStorage:", e);
    }
  };

  // Dynamic Statistics
  const totalAssigned = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const evaluatedCount = submissions.filter((s) => s.status === "evaluated").length;
  const rejectedCount = submissions.filter((s) => s.status === "rejected").length;

  // Average Score of Evaluated
  const evaluatedItems = submissions.filter((s) => s.status === "evaluated" && s.evaluation?.totalScore);
  const averageScore =
    evaluatedItems.length > 0
      ? Math.round(
          evaluatedItems.reduce((acc, curr) => acc + Number(curr.evaluation.totalScore), 0) /
            evaluatedItems.length
        )
      : evaluatedCount > 0 ? 90 : 0;

  const stats = {
    totalAssigned,
    pendingCount,
    evaluatedCount,
    rejectedCount,
    averageScore,
    completionRate: totalAssigned > 0 ? Math.round(((evaluatedCount + rejectedCount) / totalAssigned) * 100) : 0,
  };

  const value = {
    submissions,
    stats,
    getSubmissionById,
    evaluateSubmission,
    rejectSubmission,
    reopenSubmission,
    resetToInitialData,
  };

  return <EvaluatorContext.Provider value={value}>{children}</EvaluatorContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEvaluator() {
  const context = useContext(EvaluatorContext);
  if (!context) {
    throw new Error("useEvaluator must be used within an EvaluatorProvider");
  }
  return context;
}
