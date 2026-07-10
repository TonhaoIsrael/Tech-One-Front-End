// ─── Enums da API ─────────────────────────────────────────────────────────────
export type Prioridade = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
export type StatusOS   = 'ABERTO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
export type RoleNome   = 'ADMIN' | 'Tecnico' | 'TECNICO';

// ─── Ordens de Serviço — espelho exato do JSON da API ─────────────────────────
export interface ServiceOrder {
  id:           number;
  titulo:       string;
  descricao:    string;
  clienteId:    number;
  clienteNome:  string;
  clienteEndereco: string;
  tecnicoId:    number | null;
  tecnicoNome:  string | null;
  prioridade:   Prioridade;
  status:       StatusOS;
  criadoEm:     string;
  dataAgendada: string | null;
  agendada:     boolean;
}

export interface CreateOSRequest {
  titulo:        string;
  descricao:     string;
  clienteId:     number;
  tecnicoId?:    number;
  prioridade:    Prioridade;
  status:        StatusOS;
  dataAgendada?: string;
}

export interface UpdateOSRequest {
  titulo?:     string;
  descricao?:  string;
  prioridade?: Prioridade;
  status?:     StatusOS;
}

// ─── Usuários — role vem como string direta da API ────────────────────────────
export interface AppUser {
  id:    number;
  nome:  string;
  email: string;
  role:  string;   // ex: 'Tecnico', 'ADMIN'
  ativo: boolean;
}

export interface CreateUserRequest {
  nome:   string;
  email:  string;
  senha:  string;
  roleId: number;
}

export interface UpdateUserRequest {
  nome?:   string;
  email?:  string;
  senha?:  string;
  roleId?: number;
}

// ─── Clientes ─────────────────────────────────────────────────────────────────
export interface Cliente {
  id:       number;
  nome:     string;
  telefone: string;
  email:    string;
  endereco: string;
  ativo:    boolean;
}

// ─── Roles ────────────────────────────────────────────────────────────────────
export interface Role {
  id:   number;
  nome: string;
}
