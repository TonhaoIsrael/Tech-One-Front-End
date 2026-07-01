export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  nome:  string;
  email: string;
  role:  'ADMIN' | 'TECNICO';
  token: string;
}
