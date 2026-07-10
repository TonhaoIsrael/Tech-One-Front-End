import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppUser, CreateUserRequest, UpdateUserRequest, Role } from './models';

const API = 'https://tech-on-api.onrender.com/api';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${API}/usuarios`);
  }

  buscar(id: number): Observable<AppUser> {
    return this.http.get<AppUser>(`${API}/usuarios/${id}`);
  }

  criar(body: CreateUserRequest): Observable<AppUser> {
    return this.http.post<AppUser>(`${API}/usuarios`, body);
  }

  atualizar(id: number, body: UpdateUserRequest): Observable<AppUser> {
    return this.http.put<AppUser>(`${API}/usuarios/${id}`, body);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/usuarios/${id}`);
  }

  listarRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${API}/roles`);
  }
}
