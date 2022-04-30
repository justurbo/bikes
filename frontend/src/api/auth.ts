import axios from 'axios';
import env from 'utils/env';

interface LoginResponse {
  accessToken: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const fetchLogin = (loginRequest: LoginRequest) => {
  return axios
    .post<LoginResponse>(`${env.API_URL}/auth/login`, loginRequest)
    .then((data) => data.data);
};

export const fetchRegister = async (registerRequest: RegisterRequest) => {
  return axios
    .post(`${env.API_URL}/auth/register`, registerRequest)
    .then((data) => data.data);
};

export const getAuthorizedAxios = () => {
  return axios.create({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
};
