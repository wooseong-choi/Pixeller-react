// api/login.jsx
import axiosInstance from './axios';

export const login = async (user) => {
  try {
    const response = await axiosInstance.post('/user/login', { user });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// export const create = async (user) => {
//   return await axios.post("/user/create", { user });
// };

