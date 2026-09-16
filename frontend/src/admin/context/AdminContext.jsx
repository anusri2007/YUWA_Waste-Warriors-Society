import { createContext, useContext, useState, useEffect } from "react";

// ==============================================================================
// INITIAL MOCK DATA - YUWA Waste Warriors Society Admin Data
// ==============================================================================

const INITIAL_COLLEGES = [
  {
    id: 1,
    name: "ABC College of Engineering",
    location: "Bengaluru, Karnataka",
    contactPerson: "Dr. Arvind Swaminathan",
    email: "arvind.s@abccollege.edu",
    phone: "+91 98450 12345",
    assignedCoordinator: "Prof. Rajesh Kannan",
    studentsCount: 320,
    teamsCount: 8,
    status: "Active",
  },
  {
    id: 2,
    name: "XYZ Institute of Technology",
    location: "Hyderabad, Telangana",
    contactPerson: "Prof. Sunita Deshmukh",
    email: "sunita.d@xyzinstitute.edu",
    phone: "+91 97120 54321",
    assignedCoordinator: "Dr. K. S. Murthy",
    studentsCount: 240,
    teamsCount: 6,
    status: "Active",
  },
  {
    id: 3,
    name: "DEF National University",
    location: "Pune, Maharashtra",
    contactPerson: "Dr. Madhavan Joshi",
    email: "m.joshi@defuniv.ac.in",
    phone: "+91 98901 67890",
    assignedCoordinator: "Ananya Roy",
    studentsCount: 190,
    teamsCount: 5,
    status: "Active",
  },
  {
    id: 4,
    name: "PQR College of Sciences",
    location: "Chennai, Tamil Nadu",
    contactPerson: "Dr. R. Ramanathan",
    email: "ramanathan@pqrsciences.edu",
    phone: "+91 94441 23456",
    assignedCoordinator: "Venkatesh Iyer",
    studentsCount: 150,
    teamsCount: 4,
    status: "Active",
  },
  {
    id: 5,
    name: "KLU Green Campus Initiative",
    location: "Vijayawada, Andhra Pradesh",
    contactPerson: "Dr. P. V. Ramana",
    email: "pvramana@kluniversity.in",
    phone: "+91 86620 98765",
    assignedCoordinator: "Suresh Babu",
    studentsCount: 280,
    teamsCount: 7,
    status: "Active",
  },
  {
    id: 6,
    name: "SRM University Environmental Cell",
    location: "Kattankulathur, Tamil Nadu",
    contactPerson: "Dr. Nalini Selvam",
    email: "nalini.s@srmuniv.ac.in",
    phone: "+91 98401 11223",
    assignedCoordinator: "Unassigned",
    studentsCount: 210,
    teamsCount: 5,
    status: "Inactive",
  },
];

const INITIAL_COORDINATORS = [
  {
    id: 1,
    name: "Prof. Rajesh Kannan",
    email: "rajesh.k@abccollege.edu",
    phone: "+91 98451 99887",
    college: "ABC College of Engineering",
    status: "Approved",
    requestDate: "2026-08-15",
  },
  {
    id: 2,
    name: "Dr. K. S. Murthy",
    email: "ksmurthy@xyzinstitute.edu",
    phone: "+91 97121 44332",
    college: "XYZ Institute of Technology",
    status: "Approved",
    requestDate: "2026-08-18",
  },
  {
    id: 3,
    name: "Ananya Roy",
    email: "ananya.roy@defuniv.ac.in",
    phone: "+91 98902 55443",
    college: "DEF National University",
    status: "Approved",
    requestDate: "2026-08-20",
  },
  {
    id: 4,
    name: "Venkatesh Iyer",
    email: "venkatesh.i@pqrsciences.edu",
    phone: "+91 94442 88776",
    college: "PQR College of Sciences",
    status: "Approved",
    requestDate: "2026-08-22",
  },
  {
    id: 5,
    name: "Suresh Babu",
    email: "sureshbabu@kluniversity.in",
    phone: "+91 86621 11224",
    college: "KLU Green Campus Initiative",
    status: "Approved",
    requestDate: "2026-08-25",
  },
  {
    id: 6,
    name: "Dr. Meenakshi Sundaram",
    email: "meenakshi.s@srmuniv.ac.in",
    phone: "+91 98402 33445",
    college: "SRM University Environmental Cell",
    status: "Pending",
    requestDate: "2026-09-14",
  },
  {
    id: 7,
    name: "Gaurav Malhotra",
    email: "g.malhotra@ditu.edu",
    phone: "+91 98110 55667",
    college: "DIT University Dehradun",
    status: "Pending",
    requestDate: "2026-09-15",
  },
  {
    id: 8,
    name: "Snehlata Patil",
    email: "spatil@unipune.ac.in",
    phone: "+91 98220 77889",
    college: "Savitribai Phule Pune University",
    status: "Rejected",
    requestDate: "2026-09-02",
  },
];

const INITIAL_STUDENTS = [
  { id: 1, name: "Aarav Sharma", college: "ABC College of Engineering", email: "aarav.s@abccollege.edu", phone: "+91 98123 45678", enrolledDate: "2026-08-28" },
  { id: 2, name: "Priya Patel", college: "ABC College of Engineering", email: "priya.p@abccollege.edu", phone: "+91 98234 56789", enrolledDate: "2026-08-28" },
  { id: 3, name: "Vikram Mehta", college: "XYZ Institute of Technology", email: "vikram.m@xyzinstitute.edu", phone: "+91 98345 67890", enrolledDate: "2026-08-29" },
  { id: 4, name: "Ananya Roy", college: "XYZ Institute of Technology", email: "ananya.r@xyzinstitute.edu", phone: "+91 98456 78901", enrolledDate: "2026-08-29" },
  { id: 5, name: "Rohan Kulkarni", college: "DEF National University", email: "rohan.k@defuniv.ac.in", phone: "+91 98567 89012", enrolledDate: "2026-08-30" },
  { id: 6, name: "Divya Rao", college: "DEF National University", email: "divya.r@defuniv.ac.in", phone: "+91 98678 90123", enrolledDate: "2026-08-30" },
  { id: 7, name: "Karthik Reddy", college: "KLU Green Campus Initiative", email: "karthik.r@kluniversity.in", phone: "+91 98789 01234", enrolledDate: "2026-09-01" },
  { id: 8, name: "Pooja Sundaram", college: "SRM University Environmental Cell", email: "pooja.s@srmuniv.ac.in", phone: "+91 98890 12345", enrolledDate: "2026-09-02" },
];

const INITIAL_TEAMS = [
  { id: 1, name: "Eco Warriors", college: "ABC College of Engineering", leader: "Aarav Sharma", membersCount: 4, taskCategory: "Waste Segregation" },
  { id: 2, name: "Green Champs", college: "XYZ Institute of Technology", leader: "Vikram Mehta", membersCount: 5, taskCategory: "Plastic Collection" },
  { id: 3, name: "Earth Heroes", college: "DEF National University", leader: "Rohan Kulkarni", membersCount: 4, taskCategory: "Tree Plantation" },
  { id: 4, name: "Clean City Pioneers", college: "PQR College of Sciences", leader: "Tanvi Gupta", membersCount: 3, taskCategory: "E-Waste Drive" },
  { id: 5, name: "Zero Waste Guild", college: "KLU Green Campus Initiative", leader: "Karthik Reddy", membersCount: 4, taskCategory: "Waste Segregation" },
  { id: 6, name: "Eco Vanguard", college: "SRM University Environmental Cell", leader: "Pooja Sundaram", membersCount: 5, taskCategory: "Waste Segregation" },
];

const INITIAL_SUBMISSIONS = [
  { id: 1, team: "Eco Warriors", college: "ABC College of Engineering", task: "Waste Segregation & Composting", status: "pending", submittedAt: "2026-09-16 10:45 AM" },
  { id: 2, team: "Green Champs", college: "XYZ Institute of Technology", task: "Single-Use Plastic Collection Drive", status: "pending", submittedAt: "2026-09-16 08:30 AM" },
  { id: 3, team: "Earth Heroes", college: "DEF National University", task: "Campus Cleanliness & Tree Plantation", status: "evaluated", submittedAt: "2026-09-15 02:15 PM" },
  { id: 4, team: "Clean City Pioneers", college: "PQR College of Sciences", task: "Community E-Waste Disposal Drive", status: "rejected", submittedAt: "2026-09-14 11:20 AM" },
  { id: 5, team: "Zero Waste Guild", college: "KLU Green Campus Initiative", task: "Cafeteria Food Waste Biogas Model", status: "pending", submittedAt: "2026-09-15 09:10 AM" },
  { id: 6, team: "Eco Vanguard", college: "SRM University Environmental Cell", task: "Paper Recycling & Circular Notebooks", status: "evaluated", submittedAt: "2026-09-13 11:00 AM" },
];

const INITIAL_COMPETITIONS = [
  {
    id: 1,
    title: "National Campus Waste Segregation Championship 2026",
    description: "Multi-campus environmental challenge promoting 100% source segregation, composting, and zero-landfill college practices.",
    category: "Waste Segregation",
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    rules: "Teams must establish three-tier waste segregation in at least 3 departments. Daily weighing and audit logs are mandatory with faculty coordinator sign-off.",
    maxTeamSize: 5,
    status: "Active",
  },
  {
    id: 2,
    title: "Single-Use Plastic Elimination Sprint",
    description: "Intensive 14-day student sprint to eliminate single-use plastics across college cafeterias, student hubs, and hostels.",
    category: "Plastic Collection",
    startDate: "2026-09-10",
    endDate: "2026-09-24",
    rules: "Collect and bundle discarded plastics, partner with authorized recyclers, and distribute alternative reusable solutions to student community.",
    maxTeamSize: 6,
    status: "Active",
  },
  {
    id: 3,
    title: "Green Canopy: Campus Tree Plantation Drive",
    description: "Planting native trees with drip-irrigation setups and a 6-month seedling survival maintenance pledge.",
    category: "Tree Plantation",
    startDate: "2026-08-15",
    endDate: "2026-09-15",
    rules: "Minimum 40 indigenous saplings per team. Geotagging and photo evidence before, during, and after planting required.",
    maxTeamSize: 5,
    status: "Completed",
  },
  {
    id: 4,
    title: "Urban Waterways & Community Cleanup Hackathon",
    description: "Community cleanup targeting neighborhood water bodies, parks, and roadside dumping hotspots around campuses.",
    category: "Community Cleanup",
    startDate: "2026-10-01",
    endDate: "2026-10-15",
    rules: "Teams must map coordinates of cleaned area and quantify volume of trash sorted into recyclable vs non-recyclable streams.",
    maxTeamSize: 6,
    status: "Upcoming",
  },
  {
    id: 5,
    title: "Inter-College E-Waste Safe Disposal Drive",
    description: "Collecting outdated electronics, batteries, and electronic scrap for certified zero-hazard recycling.",
    category: "E-Waste Drive",
    startDate: "2026-10-10",
    endDate: "2026-10-25",
    rules: "Strict safety protocols. Only certified recycler handover receipts will be scored. Battery insulation mandatory.",
    maxTeamSize: 4,
    status: "Draft",
  },
];

const LOCAL_STORAGE_KEY = "yuwa_admin_state_v1";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  // Load state from localStorage or initial mock data
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to read admin data from localStorage:", e);
    }
    return {
      colleges: INITIAL_COLLEGES,
      coordinators: INITIAL_COORDINATORS,
      students: INITIAL_STUDENTS,
      teams: INITIAL_TEAMS,
      submissions: INITIAL_SUBMISSIONS,
      competitions: INITIAL_COMPETITIONS,
    };
  });

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Failed to persist admin data to localStorage:", e);
    }
  }, [data]);

  // ============================================================================
  // COLLEGE MANAGEMENT FUNCTIONS
  // (Future API: POST /api/admin/colleges, PUT /api/admin/colleges/:id, etc.)
  // ============================================================================
  const addCollege = (newCollegeData) => {
    const id = Date.now();
    const newCollege = {
      id,
      name: newCollegeData.name.trim(),
      location: newCollegeData.location.trim(),
      contactPerson: newCollegeData.contactPerson.trim(),
      email: newCollegeData.email.trim(),
      phone: newCollegeData.phone.trim(),
      assignedCoordinator: newCollegeData.assignedCoordinator || "Unassigned",
      studentsCount: Number(newCollegeData.studentsCount) || 0,
      teamsCount: Number(newCollegeData.teamsCount) || 0,
      status: newCollegeData.status || "Active",
    };
    setData((prev) => ({
      ...prev,
      colleges: [newCollege, ...prev.colleges],
    }));
    return newCollege;
  };

  const updateCollege = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      colleges: prev.colleges.map((c) =>
        c.id === Number(id) ? { ...c, ...updatedFields } : c
      ),
    }));
  };

  const deleteCollege = (id) => {
    setData((prev) => ({
      ...prev,
      colleges: prev.colleges.filter((c) => c.id !== Number(id)),
    }));
  };

  const getCollegeById = (id) => {
    return data.colleges.find((c) => c.id === Number(id)) || null;
  };

  const assignCoordinator = (collegeId, coordinatorName) => {
    setData((prev) => ({
      ...prev,
      colleges: prev.colleges.map((c) =>
        c.id === Number(collegeId) ? { ...c, assignedCoordinator: coordinatorName } : c
      ),
    }));
  };

  // ============================================================================
  // COORDINATOR MANAGEMENT FUNCTIONS
  // (Future API: POST /api/admin/coordinators/:id/approve, etc.)
  // ============================================================================
  const approveCoordinator = (id) => {
    setData((prev) => {
      const updatedCoordinators = prev.coordinators.map((coord) =>
        coord.id === Number(id) ? { ...coord, status: "Approved" } : coord
      );
      // Auto-assign to college if college coordinator was Unassigned
      const targetCoord = prev.coordinators.find((c) => c.id === Number(id));
      let updatedColleges = prev.colleges;
      if (targetCoord && targetCoord.college) {
        updatedColleges = prev.colleges.map((coll) => {
          if (coll.name === targetCoord.college && coll.assignedCoordinator === "Unassigned") {
            return { ...coll, assignedCoordinator: targetCoord.name };
          }
          return coll;
        });
      }
      return {
        ...prev,
        coordinators: updatedCoordinators,
        colleges: updatedColleges,
      };
    });
  };

  const rejectCoordinator = (id, reason = "") => {
    setData((prev) => ({
      ...prev,
      coordinators: prev.coordinators.map((coord) =>
        coord.id === Number(id)
          ? { ...coord, status: "Rejected", rejectionReason: reason }
          : coord
      ),
    }));
  };

  const getCoordinatorById = (id) => {
    return data.coordinators.find((coord) => coord.id === Number(id)) || null;
  };

  // ============================================================================
  // COMPETITION MANAGEMENT FUNCTIONS
  // (Future API: POST /api/admin/competitions, PUT /api/admin/competitions/:id, etc.)
  // ============================================================================
  const addCompetition = (newCompData) => {
    const id = Date.now();
    const newComp = {
      id,
      title: newCompData.title.trim(),
      description: newCompData.description.trim(),
      category: newCompData.category || "Waste Segregation",
      startDate: newCompData.startDate,
      endDate: newCompData.endDate,
      rules: newCompData.rules || "Standard YUWA environmental guidelines apply.",
      maxTeamSize: Number(newCompData.maxTeamSize) || 4,
      status: newCompData.status || "Draft",
    };
    setData((prev) => ({
      ...prev,
      competitions: [newComp, ...prev.competitions],
    }));
    return newComp;
  };

  const updateCompetition = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      competitions: prev.competitions.map((comp) =>
        comp.id === Number(id) ? { ...comp, ...updatedFields } : comp
      ),
    }));
  };

  const deleteCompetition = (id) => {
    setData((prev) => ({
      ...prev,
      competitions: prev.competitions.filter((comp) => comp.id !== Number(id)),
    }));
  };

  const getCompetitionById = (id) => {
    return data.competitions.find((comp) => comp.id === Number(id)) || null;
  };

  // Reset to initial mock data
  const resetAdminData = () => {
    const initial = {
      colleges: INITIAL_COLLEGES,
      coordinators: INITIAL_COORDINATORS,
      students: INITIAL_STUDENTS,
      teams: INITIAL_TEAMS,
      submissions: INITIAL_SUBMISSIONS,
      competitions: INITIAL_COMPETITIONS,
    };
    setData(initial);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to reset admin localStorage:", e);
    }
  };

  // ============================================================================
  // DYNAMIC STATISTICS CALCULATION
  // ============================================================================
  const totalColleges = data.colleges.length;
  const totalCoordinators = data.coordinators.filter((c) => c.status === "Approved").length;
  const totalStudents = data.students.length + data.colleges.reduce((sum, c) => sum + (c.studentsCount || 0), 0);
  const totalTeams = data.teams.length;
  const totalSubmissions = data.submissions.length;
  const pendingRequests = data.coordinators.filter((c) => c.status === "Pending").length;

  const statistics = {
    totalColleges,
    totalCoordinators,
    totalStudents,
    totalTeams,
    totalSubmissions,
    pendingRequests,
  };

  const value = {
    colleges: data.colleges,
    coordinators: data.coordinators,
    students: data.students,
    teams: data.teams,
    submissions: data.submissions,
    competitions: data.competitions,
    statistics,
    // CRUD & operations
    addCollege,
    updateCollege,
    deleteCollege,
    getCollegeById,
    assignCoordinator,
    approveCoordinator,
    rejectCoordinator,
    getCoordinatorById,
    addCompetition,
    updateCompetition,
    deleteCompetition,
    getCompetitionById,
    resetAdminData,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
