import React from 'react';
import { downloadTimetablePDF, formatTime } from '../utils/timetable';

const TimetableGrid = ({ timetable, showDownload = true }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleDownload = async () => {
    try {
      await downloadTimetablePDF(
        'timetable-grid',
        `${timetable.branch.name}_Semester${timetable.semester}_Timetable.pdf`
      );
    } catch (error) {
      alert('Error downloading timetable. Please try again.');
    }
  };

  const getPeriodData = (day, period) => {
    const daySchedule = timetable.schedule.find(s => s.day === day);
    if (!daySchedule) return null;
    
    return daySchedule.periods.find(p => p.period === period);
  };

  const renderCell = (day, period) => {
    const periodData = getPeriodData(day, period);
    
    if (!periodData) {
      return (
        <div className="timetable-cell">
          <div>Free Period</div>
        </div>
      );
    }

    if (periodData.isBreak) {
      return (
        <div className="timetable-cell break-cell">
          <div>{periodData.breakType}</div>
          <div className="teacher-name">
            {formatTime(periodData.startTime)} - {formatTime(periodData.endTime)}
          </div>
        </div>
      );
    }

    if (periodData.subject && periodData.teacher) {
      return (
        <div className="timetable-cell subject-cell">
          <div>{periodData.subject.name}</div>
          <div className="teacher-name">{periodData.teacher.name}</div>
          <div className="classroom">{periodData.classroom}</div>
        </div>
      );
    }

    return (
      <div className="timetable-cell">
        <div>Free Period</div>
        <div className="teacher-name">
          {formatTime(periodData.startTime)} - {formatTime(periodData.endTime)}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>{timetable.branch.name} - Semester {timetable.semester}</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>
            Generated on: {new Date(timetable.createdAt).toLocaleDateString()}
          </p>
        </div>
        {showDownload && (
          <button onClick={handleDownload} className="btn btn-success">
            📥 Download Timetable
          </button>
        )}
      </div>

      <div id="timetable-grid" className="timetable-grid">
        {/* Header Row */}
        <div className="timetable-cell timetable-header">Time</div>
        {days.map(day => (
          <div key={day} className="timetable-cell timetable-header">
            {day}
          </div>
        ))}

        {/* Period Rows */}
        {periods.map(period => (
          <React.Fragment key={period}>
            <div className="timetable-cell timetable-time">
              <div>Period {period}</div>
              <div style={{ fontSize: '11px', marginTop: '2px' }}>
                {period === 1 && '9:00-10:00'}
                {period === 2 && '10:00-11:00'}
                {period === 3 && '11:15-12:15'}
                {period === 4 && '12:15-1:15'}
                {period === 5 && '2:15-3:15'}
                {period === 6 && '3:15-4:15'}
                {period === 7 && '4:30-5:30'}
                {period === 8 && '5:30-6:30'}
              </div>
            </div>
            {days.map(day => (
              <React.Fragment key={`${day}-${period}`}>
                {renderCell(day, period)}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TimetableGrid;
