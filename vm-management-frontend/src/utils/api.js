import axios from 'axios';

// Set up Axios default settings
axios.defaults.baseURL = 'http://localhost:8000/api'; // Change as needed
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

export default axios;
