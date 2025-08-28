const express = require('express');
const College = require('../models/College');
const Branch = require('../models/Branch');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Sample data generators
const generateBranches = () => [
  {
    name: 'Computer Science Engineering',
    code: 'CSE',
    totalSemesters: 8,
    periodsPerDay: 8,
    classrooms: [
      { name: 'CSE-101', capacity: 60, type: 'Classroom', location: 'Block A' },
      { name: 'CSE-102', capacity: 60, type: 'Classroom', location: 'Block A' },
      { name: 'CSE-Lab1', capacity: 30, type: 'Lab', location: 'Block A' },
      { name: 'CSE-Lab2', capacity: 30, type: 'Lab', location: 'Block A' }
    ],
    lunchBreak: { startPeriod: 5, endPeriod: 5 }
  },
  {
    name: 'Electronics and Communication Engineering',
    code: 'ECE',
    totalSemesters: 8,
    periodsPerDay: 8,
    classrooms: [
      { name: 'ECE-201', capacity: 55, type: 'Classroom', location: 'Block B' },
      { name: 'ECE-202', capacity: 55, type: 'Classroom', location: 'Block B' },
      { name: 'ECE-Lab1', capacity: 25, type: 'Lab', location: 'Block B' }
    ],
    lunchBreak: { startPeriod: 5, endPeriod: 5 }
  },
  {
    name: 'Mechanical Engineering',
    code: 'MECH',
    totalSemesters: 8,
    periodsPerDay: 8,
    classrooms: [
      { name: 'MECH-301', capacity: 65, type: 'Classroom', location: 'Block C' },
      { name: 'MECH-302', capacity: 65, type: 'Classroom', location: 'Block C' },
      { name: 'MECH-Workshop', capacity: 40, type: 'Lab', location: 'Workshop Area' }
    ],
    lunchBreak: { startPeriod: 5, endPeriod: 5 }
  },
  {
    name: 'Civil Engineering',
    code: 'CIVIL',
    totalSemesters: 8,
    periodsPerDay: 8,
    classrooms: [
      { name: 'CIVIL-401', capacity: 60, type: 'Classroom', location: 'Block D' },
      { name: 'CIVIL-402', capacity: 60, type: 'Classroom', location: 'Block D' },
      { name: 'CIVIL-Lab', capacity: 30, type: 'Lab', location: 'Block D' }
    ],
    lunchBreak: { startPeriod: 5, endPeriod: 5 }
  },
  {
    name: 'Electrical Engineering',
    code: 'EEE',
    totalSemesters: 8,
    periodsPerDay: 8,
    classrooms: [
      { name: 'EEE-501', capacity: 55, type: 'Classroom', location: 'Block E' },
      { name: 'EEE-502', capacity: 55, type: 'Classroom', location: 'Block E' },
      { name: 'EEE-Lab', capacity: 25, type: 'Lab', location: 'Block E' }
    ],
    lunchBreak: { startPeriod: 5, endPeriod: 5 }
  },
  {
    name: 'Information Technology',
    code: 'IT',
    totalSemesters: 8,
    periodsPerDay: 8,
    classrooms: [
      { name: 'IT-601', capacity: 50, type: 'Classroom', location: 'Block F' },
      { name: 'IT-602', capacity: 50, type: 'Classroom', location: 'Block F' },
      { name: 'IT-Lab', capacity: 30, type: 'Lab', location: 'Block F' }
    ],
    lunchBreak: { startPeriod: 5, endPeriod: 5 }
  },
  {
    name: 'Chemical Engineering',
    code: 'CHEM',
    totalSemesters: 8,
    periodsPerDay: 8,
    classrooms: [
      { name: 'CHEM-701', capacity: 45, type: 'Classroom', location: 'Block G' },
      { name: 'CHEM-Lab', capacity: 20, type: 'Lab', location: 'Block G' }
    ],
    lunchBreak: { startPeriod: 5, endPeriod: 5 }
  },
  {
    name: 'Biotechnology',
    code: 'BT',
    totalSemesters: 8,
    periodsPerDay: 8,
    classrooms: [
      { name: 'BT-801', capacity: 40, type: 'Classroom', location: 'Block H' },
      { name: 'BT-Lab', capacity: 20, type: 'Lab', location: 'Block H' }
    ],
    lunchBreak: { startPeriod: 5, endPeriod: 5 }
  },
  {
    name: 'Aerospace Engineering',
    code: 'AERO',
    totalSemesters: 8,
    periodsPerDay: 8,
    classrooms: [
      { name: 'AERO-901', capacity: 35, type: 'Classroom', location: 'Block I' },
      { name: 'AERO-Lab', capacity: 15, type: 'Lab', location: 'Block I' }
    ],
    lunchBreak: { startPeriod: 5, endPeriod: 5 }
  },
  {
    name: 'Automobile Engineering',
    code: 'AUTO',
    totalSemesters: 8,
    periodsPerDay: 8,
    classrooms: [
      { name: 'AUTO-1001', capacity: 45, type: 'Classroom', location: 'Block J' },
      { name: 'AUTO-Workshop', capacity: 25, type: 'Lab', location: 'Workshop Area' }
    ],
    lunchBreak: { startPeriod: 5, endPeriod: 5 }
  },
  {
    name: 'Instrumentation Engineering',
    code: 'ICE',
    totalSemesters: 8,
    periodsPerDay: 8,
    classrooms: [
      { name: 'ICE-1101', capacity: 40, type: 'Classroom', location: 'Block K' },
      { name: 'ICE-Lab', capacity: 20, type: 'Lab', location: 'Block K' }
    ],
    lunchBreak: { startPeriod: 5, endPeriod: 5 }
  },
  {
    name: 'Environmental Engineering',
    code: 'ENV',
    totalSemesters: 8,
    periodsPerDay: 8,
    classrooms: [
      { name: 'ENV-1201', capacity: 35, type: 'Classroom', location: 'Block L' },
      { name: 'ENV-Lab', capacity: 18, type: 'Lab', location: 'Block L' }
    ],
    lunchBreak: { startPeriod: 5, endPeriod: 5 }
  },
  {
    name: 'Food Technology',
    code: 'FT',
    totalSemesters: 8,
    periodsPerDay: 8,
    classrooms: [
      { name: 'FT-1301', capacity: 30, type: 'Classroom', location: 'Block M' },
      { name: 'FT-Lab', capacity: 15, type: 'Lab', location: 'Block M' }
    ],
    lunchBreak: { startPeriod: 5, endPeriod: 5 }
  },
  {
    name: 'Textile Engineering',
    code: 'TEXT',
    totalSemesters: 8,
    periodsPerDay: 8,
    classrooms: [
      { name: 'TEXT-1401', capacity: 35, type: 'Classroom', location: 'Block N' },
      { name: 'TEXT-Lab', capacity: 18, type: 'Lab', location: 'Block N' }
    ],
    lunchBreak: { startPeriod: 5, endPeriod: 5 }
  },
  {
    name: 'Marine Engineering',
    code: 'MARINE',
    totalSemesters: 8,
    periodsPerDay: 8,
    classrooms: [
      { name: 'MARINE-1501', capacity: 30, type: 'Classroom', location: 'Block O' },
      { name: 'MARINE-Lab', capacity: 15, type: 'Lab', location: 'Block O' }
    ],
    lunchBreak: { startPeriod: 5, endPeriod: 5 }
  }
];

const generateTeachers = () => [
  // Computer Science Teachers (8 teachers)
  { 
    name: 'Dr. Rajesh Kumar', 
    email: 'rajesh.kumar@college.edu', 
    phone: '+91-9876543210', 
    employeeId: 'CSE001',
    qualifications: ['Ph.D in Computer Science', 'M.Tech in AI'],
    experience: 15,
    specialization: 'Artificial Intelligence & Machine Learning',
    designation: 'Professor',
    researchAreas: ['Machine Learning', 'Deep Learning', 'Natural Language Processing'],
    publications: 25
  },
  { 
    name: 'Prof. Priya Sharma', 
    email: 'priya.sharma@college.edu', 
    phone: '+91-9876543211', 
    employeeId: 'CSE002',
    qualifications: ['Ph.D in Computer Science', 'M.Tech in Software Engineering'],
    experience: 12,
    specialization: 'Software Engineering & Database Systems',
    designation: 'Associate Professor',
    researchAreas: ['Software Architecture', 'Database Design', 'Web Technologies'],
    publications: 18
  },
  { 
    name: 'Dr. Amit Singh', 
    email: 'amit.singh@college.edu', 
    phone: '+91-9876543212', 
    employeeId: 'CSE003',
    qualifications: ['Ph.D in Computer Networks', 'M.Tech in CSE'],
    experience: 10,
    specialization: 'Computer Networks & Cybersecurity',
    designation: 'Associate Professor',
    researchAreas: ['Network Security', 'IoT', 'Blockchain'],
    publications: 15
  },
  { 
    name: 'Ms. Neha Gupta', 
    email: 'neha.gupta@college.edu', 
    phone: '+91-9876543213', 
    employeeId: 'CSE004',
    qualifications: ['M.Tech in Computer Science', 'B.Tech in CSE'],
    experience: 6,
    specialization: 'Data Structures & Algorithms',
    designation: 'Assistant Professor',
    researchAreas: ['Algorithms', 'Competitive Programming', 'Data Analytics'],
    publications: 8
  },
  { 
    name: 'Dr. Vikash Pandey', 
    email: 'vikash.pandey@college.edu', 
    phone: '+91-9876543214', 
    employeeId: 'CSE005',
    qualifications: ['Ph.D in Data Science', 'M.Tech in CSE'],
    experience: 8,
    specialization: 'Data Science & Analytics',
    designation: 'Assistant Professor',
    researchAreas: ['Big Data', 'Machine Learning', 'Statistical Analysis'],
    publications: 12
  },
  { 
    name: 'Prof. Sushma Reddy', 
    email: 'sushma.reddy@college.edu', 
    phone: '+91-9876543215', 
    employeeId: 'CSE006',
    qualifications: ['Ph.D in Computer Graphics', 'M.Tech in CSE'],
    experience: 14,
    specialization: 'Computer Graphics & Game Development',
    designation: 'Professor',
    researchAreas: ['Computer Vision', 'Graphics', 'Virtual Reality'],
    publications: 22
  },
  { 
    name: 'Dr. Rohit Agarwal', 
    email: 'rohit.agarwal@college.edu', 
    phone: '+91-9876543216', 
    employeeId: 'CSE007',
    qualifications: ['Ph.D in Mobile Computing', 'M.Tech in CSE'],
    experience: 9,
    specialization: 'Mobile Application Development',
    designation: 'Associate Professor',
    researchAreas: ['Mobile Computing', 'Android Development', 'Cross-platform Apps'],
    publications: 14
  },
  { 
    name: 'Ms. Kavita Joshi', 
    email: 'kavita.joshi@college.edu', 
    phone: '+91-9876543217', 
    employeeId: 'CSE008',
    qualifications: ['M.Tech in Information Security', 'B.Tech in CSE'],
    experience: 5,
    specialization: 'Information Security & Cryptography',
    designation: 'Assistant Professor',
    researchAreas: ['Cybersecurity', 'Cryptography', 'Network Security'],
    publications: 6
  },

  // Electronics & Communication Teachers (7 teachers)
  { 
    name: 'Dr. Suresh Reddy', 
    email: 'suresh.reddy@college.edu', 
    phone: '+91-9876543220', 
    employeeId: 'ECE001',
    qualifications: ['Ph.D in VLSI Design', 'M.Tech in ECE'],
    experience: 16,
    specialization: 'VLSI Design & Embedded Systems',
    designation: 'Professor',
    researchAreas: ['VLSI', 'Embedded Systems', 'Digital Design'],
    publications: 28
  },
  { 
    name: 'Prof. Kavya Nair', 
    email: 'kavya.nair@college.edu', 
    phone: '+91-9876543221', 
    employeeId: 'ECE002',
    qualifications: ['Ph.D in Signal Processing', 'M.Tech in ECE'],
    experience: 13,
    specialization: 'Digital Signal Processing',
    designation: 'Associate Professor',
    researchAreas: ['Signal Processing', 'Image Processing', 'Audio Processing'],
    publications: 20
  },
  { 
    name: 'Dr. Ravi Prasad', 
    email: 'ravi.prasad@college.edu', 
    phone: '+91-9876543222', 
    employeeId: 'ECE003',
    qualifications: ['Ph.D in Communication Systems', 'M.Tech in ECE'],
    experience: 11,
    specialization: 'Communication Systems & Networks',
    designation: 'Associate Professor',
    researchAreas: ['Wireless Communication', '5G Technology', 'Antenna Design'],
    publications: 17
  },
  { 
    name: 'Ms. Divya Patel', 
    email: 'divya.patel@college.edu', 
    phone: '+91-9876543223', 
    employeeId: 'ECE004',
    qualifications: ['M.Tech in Microelectronics', 'B.Tech in ECE'],
    experience: 7,
    specialization: 'Microelectronics & Circuit Design',
    designation: 'Assistant Professor',
    researchAreas: ['Analog Circuits', 'RF Design', 'Power Electronics'],
    publications: 10
  },
  { 
    name: 'Dr. Arun Kumar', 
    email: 'arun.kumar@college.edu', 
    phone: '+91-9876543224', 
    employeeId: 'ECE005',
    qualifications: ['Ph.D in Control Systems', 'M.Tech in ECE'],
    experience: 9,
    specialization: 'Control Systems & Automation',
    designation: 'Associate Professor',
    researchAreas: ['Control Theory', 'Robotics', 'Automation'],
    publications: 13
  },
  { 
    name: 'Prof. Meera Jain', 
    email: 'meera.jain@college.edu', 
    phone: '+91-9876543225', 
    employeeId: 'ECE006',
    qualifications: ['Ph.D in Optical Communication', 'M.Tech in ECE'],
    experience: 15,
    specialization: 'Optical Communication & Photonics',
    designation: 'Professor',
    researchAreas: ['Fiber Optics', 'Laser Technology', 'Optical Networks'],
    publications: 24
  },
  { 
    name: 'Ms. Shruti Mehta', 
    email: 'shruti.mehta@college.edu', 
    phone: '+91-9876543226', 
    employeeId: 'ECE007',
    qualifications: ['M.Tech in VLSI Design', 'B.Tech in ECE'],
    experience: 4,
    specialization: 'Digital Electronics & Microprocessors',
    designation: 'Assistant Professor',
    researchAreas: ['Digital Circuits', 'Microcontrollers', 'IoT Devices'],
    publications: 5
  },

  // Mechanical Engineering Teachers (7 teachers)
  { 
    name: 'Dr. Vikram Yadav', 
    email: 'vikram.yadav@college.edu', 
    phone: '+91-9876543230', 
    employeeId: 'MECH001',
    qualifications: ['Ph.D in Thermal Engineering', 'M.Tech in Mechanical'],
    experience: 18,
    specialization: 'Thermal Engineering & Heat Transfer',
    designation: 'Professor',
    researchAreas: ['Heat Transfer', 'Thermodynamics', 'Energy Systems'],
    publications: 30
  },
  { 
    name: 'Prof. Sunita Rao', 
    email: 'sunita.rao@college.edu', 
    phone: '+91-9876543231', 
    employeeId: 'MECH002',
    qualifications: ['Ph.D in Manufacturing Engineering', 'M.Tech in Production'],
    experience: 14,
    specialization: 'Manufacturing Technology & Automation',
    designation: 'Associate Professor',
    researchAreas: ['Manufacturing', 'CNC Machining', 'Industrial Automation'],
    publications: 21
  },
  { 
    name: 'Dr. Manoj Tiwari', 
    email: 'manoj.tiwari@college.edu', 
    phone: '+91-9876543232', 
    employeeId: 'MECH003',
    qualifications: ['Ph.D in Machine Design', 'M.Tech in Design'],
    experience: 12,
    specialization: 'Machine Design & CAD/CAM',
    designation: 'Associate Professor',
    researchAreas: ['Machine Design', 'Finite Element Analysis', 'Product Design'],
    publications: 19
  },
  { 
    name: 'Ms. Pooja Jain', 
    email: 'pooja.jain@college.edu', 
    phone: '+91-9876543233', 
    employeeId: 'MECH004',
    qualifications: ['M.Tech in Automotive Engineering', 'B.Tech in Mechanical'],
    experience: 6,
    specialization: 'Automotive Engineering & Vehicle Dynamics',
    designation: 'Assistant Professor',
    researchAreas: ['Automotive Systems', 'Vehicle Design', 'Electric Vehicles'],
    publications: 9
  },
  { 
    name: 'Dr. Rajesh Gupta', 
    email: 'rajesh.gupta@college.edu', 
    phone: '+91-9876543234', 
    employeeId: 'MECH005',
    qualifications: ['Ph.D in Fluid Mechanics', 'M.Tech in Mechanical'],
    experience: 10,
    specialization: 'Fluid Mechanics & Turbomachinery',
    designation: 'Associate Professor',
    researchAreas: ['Fluid Dynamics', 'Turbomachinery', 'Computational Fluid Dynamics'],
    publications: 16
  },
  { 
    name: 'Prof. Vandana Singh', 
    email: 'vandana.singh@college.edu', 
    phone: '+91-9876543235', 
    employeeId: 'MECH006',
    qualifications: ['Ph.D in Materials Science', 'M.Tech in Mechanical'],
    experience: 16,
    specialization: 'Materials Science & Engineering',
    designation: 'Professor',
    researchAreas: ['Materials Science', 'Metallurgy', 'Composite Materials'],
    publications: 26
  },
  { 
    name: 'Ms. Nisha Sharma', 
    email: 'nisha.sharma@college.edu', 
    phone: '+91-9876543236', 
    employeeId: 'MECH007',
    qualifications: ['M.Tech in Industrial Engineering', 'B.Tech in Mechanical'],
    experience: 5,
    specialization: 'Industrial Engineering & Operations Research',
    designation: 'Assistant Professor',
    researchAreas: ['Industrial Engineering', 'Quality Control', 'Operations Research'],
    publications: 7
  },

  // Civil Engineering Teachers (7 teachers)
  { 
    name: 'Dr. Ashok Verma', 
    email: 'ashok.verma@college.edu', 
    phone: '+91-9876543240', 
    employeeId: 'CIVIL001',
    qualifications: ['Ph.D in Structural Engineering', 'M.Tech in Structures'],
    experience: 20,
    specialization: 'Structural Engineering & Earthquake Engineering',
    designation: 'Professor',
    researchAreas: ['Structural Design', 'Earthquake Engineering', 'Concrete Technology'],
    publications: 35
  },
  { 
    name: 'Prof. Rekha Singh', 
    email: 'rekha.singh@college.edu', 
    phone: '+91-9876543241', 
    employeeId: 'CIVIL002',
    qualifications: ['Ph.D in Geotechnical Engineering', 'M.Tech in Geotechnical'],
    experience: 15,
    specialization: 'Geotechnical Engineering & Foundation Design',
    designation: 'Professor',
    researchAreas: ['Soil Mechanics', 'Foundation Engineering', 'Rock Mechanics'],
    publications: 23
  },
  { 
    name: 'Dr. Deepak Agarwal', 
    email: 'deepak.agarwal@college.edu', 
    phone: '+91-9876543242', 
    employeeId: 'CIVIL003',
    qualifications: ['Ph.D in Transportation Engineering', 'M.Tech in Transportation'],
    experience: 11,
    specialization: 'Transportation Engineering & Traffic Management',
    designation: 'Associate Professor',
    researchAreas: ['Highway Engineering', 'Traffic Engineering', 'Urban Planning'],
    publications: 18
  },
  { 
    name: 'Ms. Anita Kulkarni', 
    email: 'anita.kulkarni@college.edu', 
    phone: '+91-9876543243', 
    employeeId: 'CIVIL004',
    qualifications: ['M.Tech in Water Resources', 'B.Tech in Civil'],
    experience: 8,
    specialization: 'Water Resources Engineering & Hydrology',
    designation: 'Assistant Professor',
    researchAreas: ['Water Resources', 'Hydrology', 'Irrigation Engineering'],
    publications: 11
  },
  { 
    name: 'Dr. Sunil Kumar', 
    email: 'sunil.kumar@college.edu', 
    phone: '+91-9876543244', 
    employeeId: 'CIVIL005',
    qualifications: ['Ph.D in Environmental Engineering', 'M.Tech in Environmental'],
    experience: 9,
    specialization: 'Environmental Engineering & Waste Management',
    designation: 'Associate Professor',
    researchAreas: ['Environmental Engineering', 'Water Treatment', 'Waste Management'],
    publications: 14
  },
  { 
    name: 'Prof. Lakshmi Devi', 
    email: 'lakshmi.devi@college.edu', 
    phone: '+91-9876543245', 
    employeeId: 'CIVIL006',
    qualifications: ['Ph.D in Construction Management', 'M.Tech in Construction'],
    experience: 13,
    specialization: 'Construction Management & Project Planning',
    designation: 'Associate Professor',
    researchAreas: ['Construction Management', 'Project Planning', 'Building Technology'],
    publications: 20
  },
  { 
    name: 'Ms. Ritu Agarwal', 
    email: 'ritu.agarwal@college.edu', 
    phone: '+91-9876543246', 
    employeeId: 'CIVIL007',
    qualifications: ['M.Tech in Surveying', 'B.Tech in Civil'],
    experience: 4,
    specialization: 'Surveying & Remote Sensing',
    designation: 'Assistant Professor',
    researchAreas: ['Surveying', 'Remote Sensing', 'GIS Applications'],
    publications: 6
  },

  // Electrical Engineering Teachers (7 teachers)
  { 
    name: 'Dr. Sanjay Mishra', 
    email: 'sanjay.mishra@college.edu', 
    phone: '+91-9876543250', 
    employeeId: 'EEE001',
    qualifications: ['Ph.D in Power Systems', 'M.Tech in Power Systems'],
    experience: 17,
    specialization: 'Power Systems & Smart Grid Technology',
    designation: 'Professor',
    researchAreas: ['Power Systems', 'Smart Grid', 'Renewable Energy'],
    publications: 27
  },
  { 
    name: 'Prof. Geeta Sharma', 
    email: 'geeta.sharma@college.edu', 
    phone: '+91-9876543251', 
    employeeId: 'EEE002',
    qualifications: ['Ph.D in Power Electronics', 'M.Tech in Power Electronics'],
    experience: 14,
    specialization: 'Power Electronics & Electric Drives',
    designation: 'Associate Professor',
    researchAreas: ['Power Electronics', 'Motor Drives', 'Power Quality'],
    publications: 22
  },
  { 
    name: 'Dr. Ramesh Gupta', 
    email: 'ramesh.gupta@college.edu', 
    phone: '+91-9876543252', 
    employeeId: 'EEE003',
    qualifications: ['Ph.D in Electrical Machines', 'M.Tech in Electrical'],
    experience: 12,
    specialization: 'Electrical Machines & Control Systems',
    designation: 'Associate Professor',
    researchAreas: ['Electric Machines', 'Motor Control', 'Automation'],
    publications: 19
  },
  { 
    name: 'Ms. Swati Bansal', 
    email: 'swati.bansal@college.edu', 
    phone: '+91-9876543253', 
    employeeId: 'EEE004',
    qualifications: ['M.Tech in Instrumentation', 'B.Tech in Electrical'],
    experience: 6,
    specialization: 'Instrumentation & Control Systems',
    designation: 'Assistant Professor',
    researchAreas: ['Instrumentation', 'Process Control', 'Industrial Automation'],
    publications: 8
  },
  { 
    name: 'Dr. Vinod Saini', 
    email: 'vinod.saini@college.edu', 
    phone: '+91-9876543254', 
    employeeId: 'EEE005',
    qualifications: ['Ph.D in High Voltage Engineering', 'M.Tech in High Voltage'],
    experience: 10,
    specialization: 'High Voltage Engineering & Insulation Systems',
    designation: 'Associate Professor',
    researchAreas: ['High Voltage', 'Insulation Systems', 'Power Transmission'],
    publications: 15
  },
  { 
    name: 'Prof. Uma Shanker', 
    email: 'uma.shanker@college.edu', 
    phone: '+91-9876543255', 
    employeeId: 'EEE006',
    qualifications: ['Ph.D in Renewable Energy', 'M.Tech in Power Systems'],
    experience: 16,
    specialization: 'Renewable Energy Systems & Solar Technology',
    designation: 'Professor',
    researchAreas: ['Solar Energy', 'Wind Power', 'Energy Storage'],
    publications: 25
  },
  { 
    name: 'Ms. Priya Joshi', 
    email: 'priya.joshi@college.edu', 
    phone: '+91-9876543256', 
    employeeId: 'EEE007',
    qualifications: ['M.Tech in Electrical Engineering', 'B.Tech in Electrical'],
    experience: 5,
    specialization: 'Digital Electronics & Microprocessors',
    designation: 'Assistant Professor',
    researchAreas: ['Digital Systems', 'Embedded Systems', 'Microcontrollers'],
    publications: 7
  },

  // Information Technology Teachers (6 teachers)
  { 
    name: 'Dr. Kiran Kumar', 
    email: 'kiran.kumar@college.edu', 
    phone: '+91-9876543260', 
    employeeId: 'IT001',
    qualifications: ['Ph.D in Information Systems', 'M.Tech in IT'],
    experience: 13,
    specialization: 'Information Systems & Enterprise Architecture',
    designation: 'Associate Professor',
    researchAreas: ['Information Systems', 'Enterprise Architecture', 'IT Governance'],
    publications: 20
  },
  { 
    name: 'Prof. Meera Joshi', 
    email: 'meera.joshi@college.edu', 
    phone: '+91-9876543261', 
    employeeId: 'IT002',
    qualifications: ['Ph.D in Web Technologies', 'M.Tech in IT'],
    experience: 11,
    specialization: 'Web Development & Cloud Computing',
    designation: 'Associate Professor',
    researchAreas: ['Web Technologies', 'Cloud Computing', 'Distributed Systems'],
    publications: 17
  },
  { 
    name: 'Dr. Sunil Pandey', 
    email: 'sunil.pandey@college.edu', 
    phone: '+91-9876543262', 
    employeeId: 'IT003',
    qualifications: ['Ph.D in Network Security', 'M.Tech in IT'],
    experience: 9,
    specialization: 'Network Security & Ethical Hacking',
    designation: 'Associate Professor',
    researchAreas: ['Network Security', 'Ethical Hacking', 'Information Security'],
    publications: 14
  },
  { 
    name: 'Ms. Ritu Agarwal', 
    email: 'ritu.agarwal.it@college.edu', 
    phone: '+91-9876543263', 
    employeeId: 'IT004',
    qualifications: ['M.Tech in Software Engineering', 'B.Tech in IT'],
    experience: 7,
    specialization: 'Software Testing & Quality Assurance',
    designation: 'Assistant Professor',
    researchAreas: ['Software Testing', 'Quality Assurance', 'Agile Methodologies'],
    publications: 10
  },
  { 
    name: 'Dr. Naveen Sharma', 
    email: 'naveen.sharma@college.edu', 
    phone: '+91-9876543264', 
    employeeId: 'IT005',
    qualifications: ['Ph.D in Data Mining', 'M.Tech in IT'],
    experience: 8,
    specialization: 'Data Mining & Business Intelligence',
    designation: 'Assistant Professor',
    researchAreas: ['Data Mining', 'Business Intelligence', 'Analytics'],
    publications: 12
  },
  { 
    name: 'Ms. Shilpa Verma', 
    email: 'shilpa.verma@college.edu', 
    phone: '+91-9876543265', 
    employeeId: 'IT006',
    qualifications: ['M.Tech in Mobile Computing', 'B.Tech in IT'],
    experience: 4,
    specialization: 'Mobile Application Development & UI/UX Design',
    designation: 'Assistant Professor',
    researchAreas: ['Mobile Computing', 'User Experience', 'Interface Design'],
    publications: 5
  },

  // Additional Teachers for Other Branches (8 teachers)
  { 
    name: 'Dr. Prakash Sinha', 
    email: 'prakash.sinha@college.edu', 
    phone: '+91-9876543270', 
    employeeId: 'CHEM001',
    qualifications: ['Ph.D in Chemical Engineering', 'M.Tech in Chemical'],
    experience: 19,
    specialization: 'Process Engineering & Chemical Kinetics',
    designation: 'Professor',
    researchAreas: ['Chemical Processes', 'Reaction Engineering', 'Mass Transfer'],
    publications: 32
  },
  { 
    name: 'Prof. Nisha Tripathi', 
    email: 'nisha.tripathi@college.edu', 
    phone: '+91-9876543271', 
    employeeId: 'CHEM002',
    qualifications: ['Ph.D in Polymer Science', 'M.Tech in Chemical'],
    experience: 12,
    specialization: 'Polymer Engineering & Materials Science',
    designation: 'Associate Professor',
    researchAreas: ['Polymer Science', 'Materials Engineering', 'Nanotechnology'],
    publications: 18
  },
  { 
    name: 'Dr. Arjun Kapoor', 
    email: 'arjun.kapoor@college.edu', 
    phone: '+91-9876543272', 
    employeeId: 'BT001',
    qualifications: ['Ph.D in Biotechnology', 'M.Tech in Biotechnology'],
    experience: 10,
    specialization: 'Genetic Engineering & Molecular Biology',
    designation: 'Associate Professor',
    researchAreas: ['Genetic Engineering', 'Molecular Biology', 'Bioinformatics'],
    publications: 16
  },
  { 
    name: 'Prof. Kavita Desai', 
    email: 'kavita.desai@college.edu', 
    phone: '+91-9876543273', 
    employeeId: 'BT002',
    qualifications: ['Ph.D in Bioprocess Engineering', 'M.Tech in Biotechnology'],
    experience: 13,
    specialization: 'Bioprocess Engineering & Fermentation Technology',
    designation: 'Associate Professor',
    researchAreas: ['Bioprocessing', 'Fermentation', 'Bioreactor Design'],
    publications: 20
  },
  { 
    name: 'Dr. Anil Bhatt', 
    email: 'anil.bhatt@college.edu', 
    phone: '+91-9876543274', 
    employeeId: 'AERO001',
    qualifications: ['Ph.D in Aerospace Engineering', 'M.Tech in Aeronautics'],
    experience: 15,
    specialization: 'Aerodynamics & Flight Mechanics',
    designation: 'Professor',
    researchAreas: ['Aerodynamics', 'Aircraft Design', 'Computational Fluid Dynamics'],
    publications: 24
  },
  { 
    name: 'Prof. Seema Rani', 
    email: 'seema.rani@college.edu', 
    phone: '+91-9876543275', 
    employeeId: 'AERO002',
    qualifications: ['Ph.D in Propulsion Systems', 'M.Tech in Aerospace'],
    experience: 11,
    specialization: 'Propulsion Systems & Rocket Engineering',
    designation: 'Associate Professor',
    researchAreas: ['Propulsion', 'Rocket Technology', 'Space Systems'],
    publications: 17
  },
  { 
    name: 'Dr. Harish Choudhary', 
    email: 'harish.choudhary@college.edu', 
    phone: '+91-9876543276', 
    employeeId: 'AUTO001',
    qualifications: ['Ph.D in Automobile Engineering', 'M.Tech in Automotive'],
    experience: 14,
    specialization: 'Automotive Systems & Hybrid Vehicles',
    designation: 'Associate Professor',
    researchAreas: ['Automotive Engineering', 'Electric Vehicles', 'Engine Technology'],
    publications: 21
  },
  { 
    name: 'Prof. Lalita Singh', 
    email: 'lalita.singh@college.edu', 
    phone: '+91-9876543277', 
    employeeId: 'AUTO002',
    qualifications: ['Ph.D in Vehicle Dynamics', 'M.Tech in Automobile'],
    experience: 9,
    specialization: 'Vehicle Dynamics & Safety Systems',
    designation: 'Associate Professor',
    researchAreas: ['Vehicle Dynamics', 'Automotive Safety', 'Chassis Design'],
    publications: 13
  }
];

const generateSubjects = () => {
  const subjects = [];
  
  // CSE Subjects
  const cseSubjects = [
    { name: 'Programming in C', code: 'CSE101', credits: 3, type: 'Theory', semester: 1 },
    { name: 'Data Structures', code: 'CSE201', credits: 4, type: 'Theory', semester: 3 },
    { name: 'Database Management Systems', code: 'CSE301', credits: 3, type: 'Theory', semester: 5 },
    { name: 'Operating Systems', code: 'CSE302', credits: 3, type: 'Theory', semester: 5 },
    { name: 'Computer Networks', code: 'CSE401', credits: 3, type: 'Theory', semester: 7 },
    { name: 'Software Engineering', code: 'CSE402', credits: 3, type: 'Theory', semester: 7 },
    { name: 'C Programming Lab', code: 'CSE151', credits: 2, type: 'Lab', semester: 1 },
    { name: 'DBMS Lab', code: 'CSE351', credits: 2, type: 'Lab', semester: 5 }
  ];
  
  // ECE Subjects
  const eceSubjects = [
    { name: 'Electronic Devices', code: 'ECE101', credits: 3, type: 'Theory', semester: 1 },
    { name: 'Digital Electronics', code: 'ECE201', credits: 3, type: 'Theory', semester: 3 },
    { name: 'Analog Communications', code: 'ECE301', credits: 3, type: 'Theory', semester: 5 },
    { name: 'Microprocessors', code: 'ECE302', credits: 3, type: 'Theory', semester: 5 },
    { name: 'VLSI Design', code: 'ECE401', credits: 3, type: 'Theory', semester: 7 },
    { name: 'Electronics Lab', code: 'ECE151', credits: 2, type: 'Lab', semester: 1 },
    { name: 'Communications Lab', code: 'ECE351', credits: 2, type: 'Lab', semester: 5 }
  ];
  
  // Add branch-specific subjects
  subjects.push(...cseSubjects.map(s => ({ ...s, branchCode: 'CSE' })));
  subjects.push(...eceSubjects.map(s => ({ ...s, branchCode: 'ECE' })));
  
  // Add more subjects for other branches
  const commonSubjects = [
    { name: 'Engineering Mathematics I', code: 'MATH101', credits: 4, type: 'Theory', semester: 1 },
    { name: 'Engineering Physics', code: 'PHY101', credits: 3, type: 'Theory', semester: 1 },
    { name: 'Engineering Chemistry', code: 'CHEM101', credits: 3, type: 'Theory', semester: 1 },
    { name: 'Technical Communication', code: 'ENG101', credits: 2, type: 'Theory', semester: 1 },
    { name: 'Environmental Studies', code: 'EVS101', credits: 2, type: 'Theory', semester: 2 },
    { name: 'Engineering Mathematics II', code: 'MATH201', credits: 4, type: 'Theory', semester: 2 }
  ];
  
  // Add common subjects for all branches
  ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'CHEM', 'BT', 'AERO', 'AUTO', 'ICE', 'ENV', 'FT', 'TEXT', 'MARINE'].forEach(branchCode => {
    subjects.push(...commonSubjects.map(s => ({ ...s, branchCode })));
  });
  
  return subjects;
};

// @route   POST api/seed/all
// @desc    Seed all data (branches, teachers, subjects)
// @access  Public (for demo purposes)
router.post('/all', async (req, res) => {
  try {
    const { collegeId } = req.body;
    
    if (!collegeId) {
      return res.status(400).json({ message: 'College ID is required' });
    }
    
    // Find the college
    const college = await College.findOne({ collegeId });
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    
    // Clear existing data for this college
    await Promise.all([
      Branch.deleteMany({ college: college._id }),
      Teacher.deleteMany({ college: college._id }),
      Subject.deleteMany({ college: college._id })
    ]);
    
    // Generate and save branches
    const branchesData = generateBranches();
    const branches = [];
    
    for (const branchData of branchesData) {
      const branch = new Branch({
        ...branchData,
        college: college._id
      });
      await branch.save();
      branches.push(branch);
    }
    
    // Update college with branch references
    await College.findByIdAndUpdate(college._id, {
      branches: branches.map(b => b._id)
    });
    
    // Generate and save subjects
    const subjectsData = generateSubjects();
    const subjects = [];
    
    for (const subjectData of subjectsData) {
      const branch = branches.find(b => b.code === subjectData.branchCode);
      if (branch) {
        const subject = new Subject({
          name: subjectData.name,
          code: subjectData.code,
          credits: subjectData.credits,
          type: subjectData.type,
          duration: subjectData.type === 'Lab' ? 120 : 60,
          college: college._id,
          branch: branch._id,
          semester: subjectData.semester
        });
        await subject.save();
        subjects.push(subject);
      }
    }
    
    // Generate and save teachers
    const teachersData = generateTeachers();
    const teachers = [];
    
    for (const teacherData of teachersData) {
      // Determine branch based on employee ID prefix
      const branchCode = teacherData.employeeId.replace(/\d+$/, '');
      const branch = branches.find(b => b.code === branchCode);
      
      if (branch) {
        // Get subjects for this branch
        const branchSubjects = subjects.filter(s => 
          s.branch.toString() === branch._id.toString()
        );
        
        // Assign 2-4 subjects based on teacher's specialization
        const numSubjects = Math.floor(Math.random() * 3) + 2;
        const assignedSubjects = branchSubjects
          .sort(() => 0.5 - Math.random())
          .slice(0, numSubjects);
        
        // Generate realistic availability slots based on experience
        const generateAvailabilitySlots = () => {
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          return days.map(day => {
            // Senior faculty (Prof/Associate Prof) have slightly less availability
            const maxPeriods = teacherData.experience > 15 ? 5 : 6;
            const numPeriods = Math.floor(Math.random() * 2) + maxPeriods - 1; // 4-6 periods
            const allPeriods = [1, 2, 3, 4, 5, 6, 7, 8];
            const periods = [];
            
            for (let i = 0; i < numPeriods; i++) {
              let period;
              do {
                period = allPeriods[Math.floor(Math.random() * allPeriods.length)];
              } while (periods.includes(period));
              periods.push(period);
            }
            
            return { day, periods: periods.sort() };
          });
        };
        
        const teacher = new Teacher({
          name: teacherData.name,
          email: teacherData.email,
          phone: teacherData.phone,
          employeeId: teacherData.employeeId,
          college: college._id,
          branch: branch._id,
          subjects: assignedSubjects.map(s => s._id),
          qualifications: teacherData.qualifications || ['M.Tech', 'B.Tech'],
          experience: teacherData.experience || Math.floor(Math.random() * 15) + 2,
          specialization: teacherData.specialization || 'General Engineering',
          designation: teacherData.designation || (teacherData.experience > 15 ? 'Professor' : teacherData.experience > 10 ? 'Associate Professor' : teacherData.experience > 5 ? 'Assistant Professor' : 'Lecturer'),
          researchAreas: teacherData.researchAreas || ['Engineering', 'Technology'],
          publications: teacherData.publications || Math.floor(Math.random() * 10) + 1,
          availableSlots: generateAvailabilitySlots()
        });
        
        await teacher.save();
        teachers.push(teacher);
      }
    }
    
    res.json({
      message: 'Database seeded successfully!',
      data: {
        branches: branches.length,
        subjects: subjects.length,
        teachers: teachers.length,
        college: college.name
      }
    });
    
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ 
      message: 'Error seeding database', 
      error: error.message 
    });
  }
});

// @route   POST api/seed/branches
// @desc    Seed only branches
// @access  Public
router.post('/branches', async (req, res) => {
  try {
    const { collegeId } = req.body;
    
    const college = await College.findOne({ collegeId });
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    
    await Branch.deleteMany({ college: college._id });
    
    const branchesData = generateBranches();
    const branches = [];
    
    for (const branchData of branchesData) {
      const branch = new Branch({
        ...branchData,
        college: college._id
      });
      await branch.save();
      branches.push(branch);
    }
    
    await College.findByIdAndUpdate(college._id, {
      branches: branches.map(b => b._id)
    });
    
    res.json({
      message: 'Branches seeded successfully!',
      count: branches.length,
      branches: branches.map(b => ({ name: b.name, code: b.code }))
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Error seeding branches', error: error.message });
  }
});

// @route   GET api/seed/status
// @desc    Get seeding status
// @access  Public
router.get('/status/:collegeId', async (req, res) => {
  try {
    const { collegeId } = req.params;
    
    const college = await College.findOne({ collegeId });
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    
    const [branchCount, teacherCount, subjectCount] = await Promise.all([
      Branch.countDocuments({ college: college._id }),
      Teacher.countDocuments({ college: college._id }),
      Subject.countDocuments({ college: college._id })
    ]);
    
    res.json({
      college: college.name,
      data: {
        branches: branchCount,
        teachers: teacherCount,
        subjects: subjectCount,
        isSeeded: branchCount > 0 && teacherCount > 0 && subjectCount > 0
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Error getting status', error: error.message });
  }
});

module.exports = router;
