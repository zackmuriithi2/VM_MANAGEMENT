// Utility to get a value from localStorage
export const getFromLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  return value ? value : null; // Return the value if found, otherwise return null
};
