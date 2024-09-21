import axios from 'axios';

// Base URL for mock data
const MOCK_BASE_URL = '/mock';

// Fetch users
export const fetchUsers = async () => {
  const response = await axios.get(`${MOCK_BASE_URL}/users.json`);
  return response.data;
};

// Fetch VMs
export const fetchVMs = async () => {
  const response = await axios.get(`${MOCK_BASE_URL}/vms.json`);
  return response.data;
};

// Fetch billing info
export const fetchBillingInfo = async () => {
  const response = await axios.get(`${MOCK_BASE_URL}/billing.json`);
  return response.data;
};

// Fetch backups
export const fetchBackups = async () => {
  const response = await axios.get(`${MOCK_BASE_URL}/backup.json`);
  return response.data;
};
