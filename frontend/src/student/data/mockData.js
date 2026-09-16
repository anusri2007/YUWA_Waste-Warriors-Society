export const initialStudent = {
  id: "stu-8842",
  name: "Supriya Sharma",
  email: "supriya.sharma@yuwa.in",
  phone: "+91 98765 43210",
  college: "National Institute of Environmental Studies",
  course: "B.Tech Environmental Engineering",
  year: "3rd Year (Batch 2026)",
  team: "Green Warriors",
  teamId: "GW-2026",
  points: 1240,
  weeklyPoints: 380,
  competitionPoints: 860,
  rank: 12,
  previousRank: 16,
  tasksCompleted: 18,
  totalTasks: 25,
  teamProgress: 76,
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  bio: "Passionate environmentalist dedicated to decentralized waste segregation, community clean-up initiatives, and smart circular recycling."
};

export const initialCompetition = {
  id: "comp-2026",
  title: "YUWA Ecolympics 2026",
  subtitle: "National Youth Climate Action & Waste Management Championship",
  status: "ACTIVE",
  daysRemaining: 14,
  startDate: "2026-08-01",
  endDate: "2026-09-30",
  currentPoints: 1240,
  currentRank: 12,
  teamName: "Green Warriors",
  progressPercentage: 76,
  totalTeams: 48,
  totalParticipants: 380,
  wasteDivertedTotalKg: 1420.5,
  prizes: [
    { rank: "1st Place", reward: "₹1,00,000 + National Green Trophy + Eco-Tech Incubation" },
    { rank: "2nd Place", reward: "₹50,000 + Silver Medal & Internship at Central Pollution Board" },
    { rank: "3rd Place", reward: "₹25,000 + Bronze Medal & Sustainability Fellowship" }
  ]
};

export const initialTeam = {
  name: "Green Warriors",
  code: "TEAM-GW04",
  college: "National Institute of Environmental Studies",
  points: 3840,
  rank: 8,
  progress: 76,
  completedTasks: 34,
  pendingTasks: 8,
  leader: "Aarav Mehta",
  members: [
    {
      id: "mem-1",
      name: "Aarav Mehta",
      role: "Team Leader",
      points: 1420,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
      tasksDone: 19
    },
    {
      id: "mem-2",
      name: "Supriya Sharma",
      role: "Field Coordinator (You)",
      points: 1240,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      tasksDone: 18,
      isCurrentUser: true
    },
    {
      id: "mem-3",
      name: "Rhea Sengupta",
      role: "Research & Documentation",
      points: 620,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
      tasksDone: 11
    },
    {
      id: "mem-4",
      name: "Karan Malhotra",
      role: "Outreach & Community",
      points: 560,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      tasksDone: 9
    }
  ]
};

export const initialPointsActivities = [
  {
    id: "pa-1",
    activity: "Task Completed: Campus Solid Waste Audit",
    date: "Today, 11:30 AM",
    points: 150,
    type: "task"
  },
  {
    id: "pa-2",
    activity: "Photo Submitted: High-Resolution Waste Segregation Proof",
    date: "Yesterday, 04:15 PM",
    points: 50,
    type: "photo"
  },
  {
    id: "pa-3",
    activity: "Video Submitted: Street Play Nukkad Natak Performance Clip",
    date: "14 Sept 2026",
    points: 100,
    type: "video"
  },
  {
    id: "pa-4",
    activity: "Reflection Submitted: Community Composting Impact Log",
    date: "12 Sept 2026",
    points: 75,
    type: "reflection"
  },
  {
    id: "pa-5",
    activity: "Bonus Points: Early Submission & Geotag Verification",
    date: "10 Sept 2026",
    points: 30,
    type: "bonus"
  }
];

export const pointsHistoryChartData = [
  { day: "Day 1", points: 180, cumulative: 180 },
  { day: "Day 3", points: 260, cumulative: 440 },
  { day: "Day 5", points: 210, cumulative: 650 },
  { day: "Day 7", points: 190, cumulative: 840 },
  { day: "Day 9", points: 180, cumulative: 1020 },
  { day: "Day 11", points: 120, cumulative: 1140 },
  { day: "Day 14 (Today)", points: 100, cumulative: 1240 }
];

export const progressMetrics = {
  tasks: 72,
  activities: 85,
  teamContribution: 64,
  competition: 76
};

export const initialTasks = [
  {
    id: "task-1",
    title: "Campus Clean-Up Drive",
    category: "Community",
    difficulty: "Medium",
    description: "Mobilize student volunteers to eliminate litter, polybags, and discarded packaging from campus grounds and surrounding sidewalks.",
    instructions: "1. Equip volunteers with protective gloves.\n2. Divide the perimeter into designated cleanup quadrants.\n3. Segregate collected waste into dry recyclables vs non-recyclables.\n4. Take clear before and after photographs.",
    requirements: [
      "Minimum 4 volunteers involved",
      "Before & after cleanup comparison photos",
      "Weigh scale record of total plastic collected",
      "Signed attendance sheet"
    ],
    points: 100,
    deadline: "20 Sept 2026",
    status: "Available",
    submissionRequirements: "At least 3 photos, hours spent, and waste weight in kg."
  },
  {
    id: "task-2",
    title: "Hostel Food Waste Audit & Compost Setup",
    category: "Environment",
    difficulty: "Hard",
    description: "Track post-consumer mess tray scraps for 5 consecutive days and establish a twin-barrel aerated compost pile for organic peelings.",
    instructions: "1. Install marked buckets for food scraps.\n2. Weigh bins daily after lunch and dinner.\n3. Mix with dry sawdust/leaves at 2:1 carbon-to-nitrogen ratio.\n4. Photograph temperature and moisture status.",
    requirements: [
      "5-day daily weight log table",
      "Photographs of composting barrel construction",
      "Written endorsement from mess warden"
    ],
    points: 180,
    deadline: "23 Sept 2026",
    status: "Available",
    submissionRequirements: "Photo collage, audit spreadsheet, and written reflection."
  },
  {
    id: "task-3",
    title: "Single-Use Plastic Ban Street Play (Nukkad Natak)",
    category: "Awareness",
    difficulty: "Medium",
    description: "Perform an energetic street play in the campus open-air courtyard highlighting marine plastic pollution and microplastic hazards.",
    instructions: "1. Script an engaging 8-10 minute satire.\n2. Involve at least 5 actors with handmade eco-friendly props.\n3. Conclude with a public anti-plastic pledge.",
    requirements: [
      "Video clip of the performance (MP4/MOV)",
      "Wide-angle audience gathering photo",
      "Cloth bag distribution photo"
    ],
    points: 150,
    deadline: "24 Sept 2026",
    status: "Available",
    submissionRequirements: "Video clip (under 50MB), audience count, and performance script."
  },
  {
    id: "task-4",
    title: "E-Waste Collection Marathon",
    category: "Innovation",
    difficulty: "Hard",
    description: "Collect obsolete electronics, phone chargers, damaged cables, and dead batteries to prevent toxic heavy metal leaching.",
    instructions: "1. Set up a secure collection box in the university foyer.\n2. Inventory items by category.\n3. Hand over safely to an authorized state e-waste recycler.",
    requirements: [
      "Itemized collection sheet",
      "Handover voucher signed by certified recycler",
      "Photographs of collection counter"
    ],
    points: 200,
    deadline: "27 Sept 2026",
    status: "Available",
    submissionRequirements: "Weigh-in receipt, collection photos, and vendor certificate."
  },
  {
    id: "task-5",
    title: "Zero-Waste Campus Awareness Posters",
    category: "Awareness",
    difficulty: "Easy",
    description: "Design and install informational posters using 100% recycled paper or scrap cardboard on cafeteria noticeboards.",
    instructions: "1. Create informative visual diagrams on proper bin segregation.\n2. Display at high-traffic student hubs.\n3. Collect peer signatures.",
    requirements: [
      "High-res photos of finished posters",
      "Photos of posters installed on noticeboards"
    ],
    points: 80,
    deadline: "18 Sept 2026",
    status: "Completed",
    completedDate: "14 Sept 2026",
    submissionRequirements: "2 photos of mounted posters and brief rationale."
  },
  {
    id: "task-6",
    title: "Upcycling Scrap Materials Workshop",
    category: "Innovation",
    difficulty: "Medium",
    description: "Convert wooden fruit crates and discarded glass bottles into self-watering planters for the campus herb garden.",
    instructions: "1. Collect scrap wooden crates and jars from local vendors.\n2. Build wick-watering planters.\n3. Plant herbs in the campus nursery.",
    requirements: [
      "Step-by-step progress photos",
      "Final display photo in botany nursery"
    ],
    points: 120,
    deadline: "12 Sept 2026",
    status: "Completed",
    completedDate: "10 Sept 2026",
    submissionRequirements: "Photos of crafted items and materials list."
  },
  {
    id: "task-7",
    title: "Residential Community Segregation Seminar",
    category: "Community",
    difficulty: "Medium",
    description: "Conduct an interactive awareness seminar for 20+ families in neighboring residential societies on segregating hazardous dry waste.",
    instructions: "1. Partner with Resident Welfare Association.\n2. Present waste diversion benefits and color-coded bins.\n3. Distribute segregation guidelines.",
    requirements: [
      "Seminar attendance sheet",
      "Photographs of the presentation and attendees"
    ],
    points: 140,
    deadline: "08 Sept 2026",
    status: "Completed",
    completedDate: "06 Sept 2026",
    submissionRequirements: "Seminar photos and attendee count."
  }
];

export const initialSubmissions = [
  {
    id: "SUB-101",
    activityName: "Zero-Waste Campus Awareness Posters",
    taskId: "task-5",
    submissionDate: "2026-09-14",
    status: "Approved",
    points: 80,
    hasPhoto: true,
    hasVideo: false,
    photos: ["https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600"],
    videos: [],
    hoursSpent: 3.5,
    peopleInvolved: 6,
    wasteCollectedKg: 4.2,
    distanceCoveredKm: 1.5,
    reflection: "We used 100% post-consumer discarded shipping boxes from the electronics department. Students in the cafeteria actively stopped to read the plastic breakdown timelines.",
    evaluatorFeedback: "Superb execution! Using cardboard packing instead of fresh chart paper earned extra creativity points. Display locations are ideal."
  },
  {
    id: "SUB-102",
    activityName: "Upcycling Scrap Materials Workshop",
    taskId: "task-6",
    submissionDate: "2026-09-10",
    status: "Approved",
    points: 120,
    hasPhoto: true,
    hasVideo: false,
    photos: ["https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600"],
    videos: [],
    hoursSpent: 5.0,
    peopleInvolved: 8,
    wasteCollectedKg: 32.0,
    distanceCoveredKm: 2.0,
    reflection: "Transformed discarded fruit crates and jars into durable self-watering planters. Placed them along the botany lab walkway.",
    evaluatorFeedback: "Brilliant practical utility! The capillary wick system is well-engineered and promotes campus biodiversity."
  },
  {
    id: "SUB-103",
    activityName: "Single-Use Plastic Ban Street Play Clip",
    taskId: "task-3",
    submissionDate: "2026-09-16",
    status: "Pending",
    points: 150,
    hasPhoto: true,
    hasVideo: true,
    photos: ["https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600"],
    videos: ["street_play_nukkad_natak.mp4"],
    hoursSpent: 8.0,
    peopleInvolved: 14,
    wasteCollectedKg: 10.5,
    distanceCoveredKm: 0.5,
    reflection: "Performed in front of 250+ students. Everyone pledged to refuse disposable straws and carry cloth bags.",
    evaluatorFeedback: "Awaiting final review from Regional Jury."
  },
  {
    id: "SUB-104",
    activityName: "Cafeteria Polybag Audit Log Sheet",
    taskId: "task-1",
    submissionDate: "2026-09-12",
    status: "Rejected",
    points: 0,
    hasPhoto: true,
    hasVideo: false,
    photos: ["https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=600"],
    videos: [],
    hoursSpent: 2.0,
    peopleInvolved: 3,
    wasteCollectedKg: 2.5,
    distanceCoveredKm: 1.0,
    reflection: "Initial audit of plastic wrappers discarded near cafeteria dustbins.",
    evaluatorFeedback: "Photographs did not show clear weight measurements on the digital scale, and the audit period was only 1 hour. Please resubmit with a comprehensive 4-hour log."
  }
];

export const initialLeaderboards = {
  myRank: [
    { rank: 10, name: "Arjun Verma", college: "St. Xavier's College", team: "Eco Titans", points: 1320, badge: "Master Recycler" },
    { rank: 11, name: "Pooja Hegde", college: "Delhi Tech University", points: 1280, team: "Bio Warriors", badge: "Zero Waste Hero" },
    { rank: 12, name: "Supriya Sharma (You)", college: "National Institute of Env Studies", team: "Green Warriors", points: 1240, badge: "Green Champion", isCurrentUser: true },
    { rank: 13, name: "Devansh Nair", college: "BITS Pilani", team: "Solaris Earth", points: 1190, badge: "Eco Warrior" },
    { rank: 14, name: "Tanya Sen", college: "Loyola College", team: "Recycle Rebels", points: 1140, badge: "Climate Advocate" }
  ],
  myTeam: [
    { rank: 1, team: "Verdant Vanguard", college: "National Green Institute of Tech", points: 4890, badge: "Gold League" },
    { rank: 2, team: "Eco Titans", college: "St. Xavier's College", points: 4450, badge: "Silver League" },
    { rank: 3, team: "Bio Warriors", college: "Delhi Tech University", points: 4180, badge: "Bronze League" },
    { rank: 4, team: "Solaris Earth", college: "BITS Pilani", points: 3950, badge: "Elite" },
    { rank: 5, team: "Recycle Rebels", college: "Loyola College", points: 3890, badge: "Elite" },
    { rank: 6, team: "Zero Trace", college: "IIT Madras Green Hub", points: 3860, badge: "Challenger" },
    { rank: 7, team: "Prakriti Force", college: "Presidency University", points: 3850, badge: "Challenger" },
    { rank: 8, team: "Green Warriors (Your Team)", college: "National Institute of Env Studies", points: 3840, badge: "Challenger", isCurrentTeam: true },
    { rank: 9, team: "Green Phoenix", college: "Symbiosis Institute", points: 3680, badge: "Contender" },
    { rank: 10, team: "Climate Crusaders", college: "Christ University", points: 3520, badge: "Contender" }
  ],
  college: [
    { rank: 1, college: "National Green Institute of Tech", state: "Delhi NCR", points: 12450, teamsCount: 3, badge: "Eco Champion College" },
    { rank: 2, college: "St. Xavier's College", state: "Mumbai", points: 11200, teamsCount: 3, badge: "Top Performer" },
    { rank: 3, college: "National Institute of Env Studies (Your College)", state: "Bangalore", points: 9840, teamsCount: 2, badge: "Star College", isCurrentCollege: true },
    { rank: 4, college: "Delhi Tech University", state: "Delhi", points: 9400, teamsCount: 2, badge: "Green Campus" },
    { rank: 5, college: "BITS Pilani", state: "Rajasthan", points: 8950, teamsCount: 2, badge: "Green Campus" }
  ]
};

export const initialAchievements = [
  {
    id: "ach-1",
    title: "Eco Warrior",
    description: "Successfully diverted 50+ kg of plastic from city landfills",
    icon: "Shield",
    earnedDate: "12 Sept 2026",
    level: "Gold",
    color: "#10b981"
  },
  {
    id: "ach-2",
    title: "Task Master",
    description: "Completed 15 environmental tasks ahead of assigned deadline",
    icon: "Award",
    earnedDate: "08 Sept 2026",
    level: "Silver",
    color: "#06b6d4"
  },
  {
    id: "ach-3",
    title: "Team Player",
    description: "Collaborated with team members on 4 community cleanups",
    icon: "Users",
    earnedDate: "01 Sept 2026",
    level: "Platinum",
    color: "#8b5cf6"
  },
  {
    id: "ach-4",
    title: "Green Champion",
    description: "Organized a campus-wide waste segregation awareness drive",
    icon: "Trophy",
    earnedDate: "28 Aug 2026",
    level: "Diamond",
    color: "#f59e0b"
  }
];

export const initialNotifications = [
  {
    id: "notif-1",
    title: "YUWA Ecolympics Sprint 3 Live!",
    message: "Sprint 3 scoring window is now open. Submit your weekend cleanup and composting logs before Sept 20.",
    date: "10 mins ago",
    read: false,
    type: "event"
  },
  {
    id: "notif-2",
    title: "Submission Approved: Campus Solid Waste Audit",
    message: "Regional evaluation jury has verified your submission (SUB-101) and awarded +80 Championship Points!",
    date: "2 hours ago",
    read: false,
    type: "assignment"
  },
  {
    id: "notif-3",
    title: "Upcoming Deadline: Street Play Performance",
    message: "Challenge 'Single-Use Plastic Ban Street Play' is due in 3 days. Coordinate with team Green Warriors.",
    date: "Yesterday",
    read: false,
    type: "reminder"
  },
  {
    id: "notif-4",
    title: "Team Rank Promoted: Green Warriors is now #8",
    message: "Your team has advanced 2 ranks following the hostel composting audit submission. Keep it up!",
    date: "2 days ago",
    read: true,
    type: "system"
  },
  {
    id: "notif-5",
    title: "Regional Waste Diverted Benchmark Reached",
    message: "YUWA society students have collectively diverted 1.4+ tonnes of waste this month across all colleges.",
    date: "3 days ago",
    read: true,
    type: "exam"
  }
];

export const initialCourses = [
  {
    id: "env204",
    name: "Solid Waste Segregation & Circular Economy",
    code: "ENV204",
    faculty: "Prof. Ananya Roy",
    facultyEmail: "a.roy@yuwa.edu",
    progress: 85,
    credits: 4,
    category: "Core",
    totalLectures: 36,
    attendedLectures: 31,
    schedule: "Tue, Thu 02:00 PM - 03:30 PM",
    room: "Green Eco Lab 2",
    description: "Solid waste segregation protocols, life-cycle impact assessment, bio-composting systems, and circular resource economy."
  },
  {
    id: "env301",
    name: "Decentralized Community Composting",
    code: "ENV301",
    faculty: "Dr. Rajesh Verma",
    facultyEmail: "r.verma@yuwa.edu",
    progress: 75,
    credits: 3,
    category: "Core",
    totalLectures: 28,
    attendedLectures: 22,
    schedule: "Mon, Wed 10:00 AM - 11:30 AM",
    room: "Botany Nursery & Eco Shed",
    description: "Microbial decomposition, aerobic vs anaerobic digestion, and scalable neighborhood bio-waste processing."
  },
  {
    id: "env305",
    name: "Plastic Stream Recycling & Polymer Analytics",
    code: "ENV305",
    faculty: "Dr. Sunita Patil",
    facultyEmail: "s.patil@yuwa.edu",
    progress: 60,
    credits: 3,
    category: "Elective",
    totalLectures: 30,
    attendedLectures: 20,
    schedule: "Wed, Fri 09:00 AM - 10:30 AM",
    room: "Materials Chemistry Lab",
    description: "Identification of resin codes 1-7, mechanical and chemical extrusion processes, and microplastic prevention."
  },
  {
    id: "env309l",
    name: "Smart IoT Environmental Monitoring Lab",
    code: "ENV309L",
    faculty: "Er. Meenakshi Joshi",
    facultyEmail: "m.joshi@yuwa.edu",
    progress: 90,
    credits: 2,
    category: "Labs",
    totalLectures: 14,
    attendedLectures: 13,
    schedule: "Thursday 03:30 PM - 05:30 PM",
    room: "Smart Systems & Sensor Lab",
    description: "Telemetry sensor nodes, fill-level ultrasonic ultrasonic bin monitors, and real-time dashboard data pipelines."
  }
];

export const upcomingEvents = [
  {
    id: "ev-1",
    title: "National Green Innovation Pitch Day",
    date: "Oct 12, 2026",
    time: "10:00 AM - 01:00 PM",
    venue: "Main Auditorium & Online Stream",
    category: "Championship"
  },
  {
    id: "ev-2",
    title: "City Riverfront Plastic Cleanup Blitz",
    date: "Sept 27, 2026",
    time: "07:00 AM - 11:00 AM",
    venue: "East Ghat Promenade Sector 4",
    category: "Community"
  },
  {
    id: "ev-3",
    title: "Jury Evaluation: Ecolympics Sprint 3 Submissions",
    date: "Sept 22, 2026",
    time: "02:00 PM - 05:00 PM",
    venue: "Virtual Jury Panel",
    category: "Evaluation"
  },
  {
    id: "ev-4",
    title: "Masterclass: AI-Powered Waste Sorting Robotics",
    date: "Sept 24, 2026",
    time: "11:00 AM - 12:30 PM",
    venue: "Seminar Hall 2",
    category: "Seminar"
  }
];

