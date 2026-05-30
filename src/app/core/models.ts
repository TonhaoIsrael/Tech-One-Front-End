export type OrderStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
export type OrderType = 'INSTALAÇÃO' | 'MANUTENÇÃO';
export type UserType = 'Administrador' | 'Tecnico' | 'Usuario';

export interface Technician {
  id: number;
  name: string;
}

export interface ServiceOrder {
  id: number;
  client: string;
  type: OrderType;
  status: OrderStatus;
  address: string;
  plan: string;
  date: string;
  time: string;
  description: string;
  technicianId?: number;
  technicianNotes?: string;
}

export interface AppUser {
  id: number;
  name: string;
  type: UserType;
  email: string;
  login: string;
}
