export const initialStudentData = {
  name: "Supriya Sharma",
  studentId: "STU-2024-8842",
  email: "supriya.sharma@yuwa.edu",
  phone: "+91 98765 43210",
  department: "Computer Science & Engineering",
  year: "3rd Year (Semester 6)",
  college: "YUWA Institute of Technology & Environmental Studies",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  cgpa: "8.74",
  creditsCompleted: 98,
  totalCredits: 130,
  attendancePercentage: 88.5,
  overallProgress: 76,
  status: "Active Student",
  rollNumber: "21CS084",
  academicYear: "2025 - 2026",
  advisor: "Dr. Rajesh Verma",
  bio: "Passionate CS undergraduate focusing on Sustainable Computing, Waste Reduction Analytics, and Cloud Systems."
};

export const initialCourses = [
  {
    id: "cs301",
    name: "Data Structures & Algorithms",
    code: "CS301",
    faculty: "Dr. Rajesh Verma",
    facultyEmail: "r.verma@yuwa.edu",
    progress: 82,
    credits: 4,
    category: "Core",
    totalLectures: 44,
    attendedLectures: 38,
    schedule: "Mon, Wed 10:00 AM - 11:30 AM",
    room: "Auditorium Hall B",
    description: "Advanced graph algorithms, dynamic programming, tree traversals, and amortized complexity analysis."
  },
  {
    id: "env204",
    name: "Environmental Engg & Waste Management",
    code: "ENV204",
    faculty: "Prof. Ananya Roy",
    facultyEmail: "a.roy@yuwa.edu",
    progress: 75,
    credits: 3,
    category: "Core",
    totalLectures: 36,
    attendedLectures: 30,
    schedule: "Tue, Thu 02:00 PM - 03:30 PM",
    room: "Green Eco Lab 2",
    description: "Solid waste segregation protocols, life-cycle impact assessment, bio-composting systems, and circular resource economy."
  },
  {
    id: "cs305",
    name: "Web Technologies & Cloud Systems",
    code: "CS305",
    faculty: "Prof. Vikram Seth",
    facultyEmail: "v.seth@yuwa.edu",
    progress: 90,
    credits: 4,
    category: "Core",
    totalLectures: 44,
    attendedLectures: 41,
    schedule: "Mon, Fri 01:30 PM - 03:00 PM",
    room: "Computer Lab 4",
    description: "Full-stack modern web architectures, REST APIs, Microservices, and cloud-native deployment patterns."
  },
  {
    id: "cs303",
    name: "Database Management Systems",
    code: "CS303",
    faculty: "Dr. Sunita Patil",
    facultyEmail: "s.patil@yuwa.edu",
    progress: 68,
    credits: 4,
    category: "Core",
    totalLectures: 38,
    attendedLectures: 32,
    schedule: "Wed, Fri 09:00 AM - 10:30 AM",
    room: "Seminar Hall 1",
    description: "Relational query optimization, B+ Trees indexing, ACID transactions, and NoSQL document stores."
  },
  {
    id: "cs307",
    name: "Machine Learning Fundamentals",
    code: "CS307",
    faculty: "Dr. Arunava Sen",
    facultyEmail: "a.sen@yuwa.edu",
    progress: 60,
    credits: 3,
    category: "Elective",
    totalLectures: 34,
    attendedLectures: 28,
    schedule: "Tue, Thu 11:30 AM - 01:00 PM",
    room: "AI Research Center",
    description: "Supervised and unsupervised learning, regression, classification trees, gradient descent, and neural models."
  },
  {
    id: "cs309l",
    name: "IoT & Smart Systems Lab",
    code: "CS309L",
    faculty: "Er. Meenakshi Joshi",
    facultyEmail: "m.joshi@yuwa.edu",
    progress: 85,
    credits: 2,
    category: "Labs",
    totalLectures: 14,
    attendedLectures: 13,
    schedule: "Thursday 03:30 PM - 05:30 PM",
    room: "Embedded IoT Lab 1",
    description: "Hands-on sensor telemetry with ESP32/Raspberry Pi for environmental tracking and real-time metric visualization."
  }
];

export const initialTasks = [
  {
    id: "task-1",
    title: "Implement Dijkstra's Shortest Path Algorithm",
    course: "Data Structures & Algorithms",
    courseCode: "CS301",
    dueDate: "2026-09-20",
    status: "Pending",
    priority: "High",
    estimatedTime: "3 hours",
    description: "Write C++/Python implementation using priority queues and submit benchmark results for 10,000 nodes."
  },
  {
    id: "task-2",
    title: "Campus Solid Waste Segregation Audit Report",
    course: "Environmental Engg & Waste Management",
    courseCode: "ENV204",
    dueDate: "2026-09-22",
    status: "Pending",
    priority: "High",
    estimatedTime: "4 hours",
    description: "Prepare field data analysis on campus organic vs dry recyclable waste streams and quantify diversion rates."
  },
  {
    id: "task-3",
    title: "React Router & Context Authentication Flow",
    course: "Web Technologies & Cloud Systems",
    courseCode: "CS305",
    dueDate: "2026-09-25",
    status: "Pending",
    priority: "Medium",
    estimatedTime: "2.5 hours",
    description: "Integrate protected route guards and session recovery tokens for client-side React SPA."
  },
  {
    id: "task-4",
    title: "SQL Index Tuning & B-Tree Query Optimization",
    course: "Database Management Systems",
    courseCode: "CS303",
    dueDate: "2026-09-28",
    status: "Pending",
    priority: "Medium",
    estimatedTime: "2 hours",
    description: "Evaluate query execution plans using EXPLAIN ANALYZE on a 500,000 record table dataset."
  },
  {
    id: "task-5",
    title: "Linear Regression Gradient Descent Model",
    course: "Machine Learning Fundamentals",
    courseCode: "CS307",
    dueDate: "2026-09-18",
    status: "Completed",
    priority: "High",
    estimatedTime: "3 hours",
    description: "Completed vectorized matrix implementation and plotted loss curves with learning rate tuning."
  },
  {
    id: "task-6",
    title: "ESP32 MQTT Sensor Telemetry Setup",
    course: "IoT & Smart Systems Lab",
    courseCode: "CS309L",
    dueDate: "2026-09-15",
    status: "Completed",
    priority: "Medium",
    estimatedTime: "2 hours",
    description: "Connected ultrasonic distance bin sensor to HiveMQ broker and validated real-time payload transmission."
  },
  {
    id: "task-7",
    title: "Dynamic Programming Knapsack Problem Writeup",
    course: "Data Structures & Algorithms",
    courseCode: "CS301",
    dueDate: "2026-09-12",
    status: "Completed",
    priority: "Low",
    estimatedTime: "1.5 hours",
    description: "Submitted memoization vs tabulation trade-off comparison paper."
  }
];

export const initialNotifications = [
  {
    id: "notif-1",
    title: "Mid-Term Examination Schedule Announced",
    message: "Semester 6 mid-term theory exams will commence from October 12, 2026. Review detailed timetable.",
    date: "10 mins ago",
    read: false,
    type: "exam"
  },
  {
    id: "notif-2",
    title: "Assignment Due Reminder: CS301 Dijkstra Algorithm",
    message: "Your submission for CS301 assignment is due in 3 days (Sept 20). Submit via the portal.",
    date: "2 hours ago",
    read: false,
    type: "assignment"
  },
  {
    id: "notif-3",
    title: "YUWA Annual Green Hackathon Registrations Open",
    message: "Build smart sustainability solutions for waste monitoring. Teams of 2-4 eligible. Register by Sept 25.",
    date: "Yesterday",
    read: false,
    type: "event"
  },
  {
    id: "notif-4",
    title: "Grade Published: CS305 Cloud Computing Quiz",
    message: "Your score for Quiz 2 has been released: 19/20 (Grade: A+). Check faculty feedback.",
    date: "2 days ago",
    read: true,
    type: "system"
  },
  {
    id: "notif-5",
    title: "Library Book Return Notice",
    message: "Clean Code: A Handbook of Agile Software Craftsmanship is due for renewal or return on Sept 24.",
    date: "3 days ago",
    read: true,
    type: "reminder"
  }
];

export const upcomingEvents = [
  {
    id: "ev-1",
    title: "Mid-Term Examinations",
    date: "Oct 12 - Oct 19, 2026",
    time: "10:00 AM - 01:00 PM",
    venue: "Examination Halls Block C",
    category: "Exam"
  },
  {
    id: "ev-2",
    title: "YUWA Eco-Tech Hackathon",
    date: "Oct 03 - Oct 04, 2026",
    time: "48-Hour Hackathon",
    venue: "Innovation Hub & Online",
    category: "Hackathon"
  },
  {
    id: "ev-3",
    title: "DBMS Lab Major Project Evaluation",
    date: "Sept 29, 2026",
    time: "02:00 PM - 05:00 PM",
    venue: "Lab Complex Room 302",
    category: "Viva / Lab"
  },
  {
    id: "ev-4",
    title: "Guest Lecture: AI for Circular Waste Ecosystems",
    date: "Sept 24, 2026",
    time: "11:00 AM - 12:30 PM",
    venue: "Auditorium Main Stage",
    category: "Seminar"
  }
];

export const attendanceBreakdown = {
  overallPercentage: 88.5,
  lectures: { attended: 169, total: 192, percentage: 88.0 },
  labs: { attended: 42, total: 46, percentage: 91.3 },
  tutorials: { attended: 26, total: 30, percentage: 86.7 },
  requiredMinimum: 75.0
};

export const semesterPerformance = [
  { semester: "Sem 1", gpa: 8.42 },
  { semester: "Sem 2", gpa: 8.58 },
  { semester: "Sem 3", gpa: 8.65 },
  { semester: "Sem 4", gpa: 8.80 },
  { semester: "Sem 5", gpa: 8.74 },
  { semester: "Sem 6 (Current)", gpa: 8.85 }
];
