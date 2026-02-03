import api from "../api/axios";


export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "buyer" | "seller" | "";
}

// Define a common error response structure based on your backend
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export const signUpService = async (data: SignupFormData) => {
  const response = await api.post("/auth/signup", data);
  console.log({response});
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    return { success: true, data: response.data };
  } else {
    return false;
  }
};

export interface LoginCredentials {
  email: string;
  password: string;
}


export const loginService = async (credentials: LoginCredentials) => {
  const response = await api.post("/auth/login", credentials);
  // Success logic: save token, redirect user
  console.log("Success:", response.data);
  return {data: response.data}
};
