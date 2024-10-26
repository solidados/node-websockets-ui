export interface Player {
  id: string;
  name: string;
  password: string;
  wins: number;
}

export interface RegistrationRequest {
  type: 'reg';
  data: string;
  id: number;
}

export interface RegistrationData {
  name: string;
  password: string;
}

export interface RegistrationResponse {
  type: 'reg';
  data: string;
  id: number;
}
