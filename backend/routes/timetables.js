const express = require('express');
const Timetable = require('../models/Timetable');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const Branch = require('../models/Branch');
const auth = require('../middleware/auth');

const router = express.Router();

// Time slots configuration
const timeSlots = [
  { period: 1, startTime: '9:00', endTime: '10:00' },
  { period: 2, startTime: '10:00', endTime: '11:00' },
  { period: 3, startTime: '11:15', endTime: '12:15' },
  { period: 4, startTime: '12:15', endTime: '1:15' },
  { period: 5, startTime: '2:15', endTime: '3:15', isBreak: true, breakType: 'Lunch' },
  { period: 6, startTime: '3:15', endTime: '4:15' },
  { period: 7, startTime: '4:30', endTime: '5:30' },
  { period: 8, startTime: '5:30', endTime: '6:30' }
];

// @route   POST api/timetables/generate
// @desc    Generate automatic timetable
// @access  Private
router.post('/generate', auth, async (req, res) => {
  try {
    const { branchId, semester, subjects: selectedSubjects } = req.body;

    // Get branch details
    const branch = await Branch.findOne({
      _id: branchId,
      college: req.college.id
    });

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Get subjects for the semester
    const subjects = await Subject.find({
      _id: { $in: selectedSubjects },
      college: req.college.id,
      branch: branchId,
      semester
    });

    // Get teachers for the branch
    const teachers = await Teacher.find({
      college: req.college.id,
      branch: branchId,
      subjects: { $in: selectedSubjects }
    }).populate('subjects');

    // Generate timetable
    const schedule = generateTimetableSchedule(subjects, teachers, branch);

    // Delete existing timetable if any
    await Timetable.findOneAndDelete({
      college: req.college.id,
      branch: branchId,
      semester
    });

    // Create new timetable
    const timetable = new Timetable({
      college: req.college.id,
      branch: branchId,
      semester,
      schedule,
      createdBy: req.college.collegeId
    });

    await timetable.save();

    const populatedTimetable = await Timetable.findById(timetable._id)
      .populate('branch')
      .populate({
        path: 'schedule.periods.subject',
        model: 'Subject'
      })
      .populate({
        path: 'schedule.periods.teacher',
        model: 'Teacher'
      });

    res.json(populatedTimetable);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/timetables/:branchId/:semester
// @desc    Get timetable by branch and semester
// @access  Private
router.get('/:branchId/:semester', auth, async (req, res) => {
  try {
    const { branchId, semester } = req.params;

    const timetable = await Timetable.findOne({
      college: req.college.id,
      branch: branchId,
      semester
    })
      .populate('branch')
      .populate({
        path: 'schedule.periods.subject',
        model: 'Subject'
      })
      .populate({
        path: 'schedule.periods.teacher',
        model: 'Teacher'
      });

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.json(timetable);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/timetables/:id
// @desc    Update timetable manually
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { schedule } = req.body;

    const timetable = await Timetable.findOneAndUpdate(
      { _id: req.params.id, college: req.college.id },
      { schedule, updatedAt: Date.now() },
      { new: true }
    )
      .populate('branch')
      .populate({
        path: 'schedule.periods.subject',
        model: 'Subject'
      })
      .populate({
        path: 'schedule.periods.teacher',
        model: 'Teacher'
      });

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.json(timetable);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/timetables/:id
// @desc    Delete timetable
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const timetable = await Timetable.findOneAndDelete({
      _id: req.params.id,
      college: req.college.id
    });

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Helper function to generate timetable schedule
function generateTimetableSchedule(subjects, teachers, branch) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const schedule = [];

  // Teacher availability tracker
  const teacherSchedule = {};
  teachers.forEach(teacher => {
    teacherSchedule[teacher._id] = {};
    days.forEach(day => {
      teacherSchedule[teacher._id][day] = new Set();
    });
  });

  // Subject frequency tracker
  const subjectFrequency = {};
  subjects.forEach(subject => {
    subjectFrequency[subject._id] = subject.credits * 2; // Each credit = 2 periods per week
  });

  for (const day of days) {
    const daySchedule = {
      day,
      periods: []
    };

    for (let period = 1; period <= 8; period++) {
      const timeSlot = timeSlots.find(slot => slot.period === period);
      
      // Check if it's lunch break
      if (period >= branch.lunchBreak.startPeriod && period <= branch.lunchBreak.endPeriod) {
        daySchedule.periods.push({
          period,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          isBreak: true,
          breakType: 'Lunch'
        });
        continue;
      }

      // Find available subject and teacher
      let assignedSubject = null;
      let assignedTeacher = null;
      let assignedClassroom = null;

      for (const subject of subjects) {
        if (subjectFrequency[subject._id] > 0) {
          // Find available teacher for this subject
          const availableTeachers = teachers.filter(teacher => 
            teacher.subjects.some(ts => ts._id.toString() === subject._id.toString()) &&
            !teacherSchedule[teacher._id][day].has(period) &&
            teacher.availableSlots.some(slot => 
              slot.day === day && slot.periods.includes(period)
            )
          );

          if (availableTeachers.length > 0) {
            assignedSubject = subject;
            assignedTeacher = availableTeachers[0];
            assignedClassroom = getAvailableClassroom(branch.classrooms, subject.type);
            
            // Update trackers
            subjectFrequency[subject._id]--;
            teacherSchedule[assignedTeacher._id][day].add(period);
            break;
          }
        }
      }

      daySchedule.periods.push({
        period,
        subject: assignedSubject ? assignedSubject._id : null,
        teacher: assignedTeacher ? assignedTeacher._id : null,
        classroom: assignedClassroom,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        isBreak: assignedSubject ? false : true,
        ...(assignedSubject ? {} : { breakType: 'Free Period' })  // Only add breakType if it's a break
      });
    }

    schedule.push(daySchedule);
  }

  return schedule;
}

function getAvailableClassroom(classrooms, subjectType) {
  const preferredType = subjectType === 'Lab' ? 'Lab' : 'Classroom';
  const availableClassroom = classrooms.find(room => room.type === preferredType);
  return availableClassroom ? availableClassroom.name : classrooms[0]?.name || 'Room 101';
}

module.exports = router;
