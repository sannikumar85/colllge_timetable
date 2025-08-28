const TOKEN_KEY = 'timetable_token';
const COLLEGE_KEY = 'timetable_college';

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(COLLEGE_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const setCurrentCollege = (college) => {
  localStorage.setItem(COLLEGE_KEY, JSON.stringify(college));
};

export const getCurrentCollege = () => {
  const college = localStorage.getItem(COLLEGE_KEY);
  return college ? JSON.parse(college) : null;
};
