export interface User {
  id: string;
  username?: string;
  mobileNumber?: string;
  lastLogin?: string;
  isAdmin: boolean;
}

export interface LoginCredentials {
  identifier: string; // username or mobile number
  pin: string;
}

export interface RegisterCredentials {
  username?: string;
  mobileNumber?: string;
  pin: string;
}