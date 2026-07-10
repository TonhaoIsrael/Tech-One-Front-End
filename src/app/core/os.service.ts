import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceOrder, CreateOSRequest, UpdateOSRequest } from './models';

const API = 'https://tech-on-api.onrender.com/api';

@Injectable({ providedIn: 'root' })
export class OsService {

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<ServiceOrder[]> {
    return this.http.get<ServiceOrder[]>(`${API}/os`);
  }

  listarHoje(): Observable<ServiceOrder[]> {
    return this.http.get<ServiceOrder[]>(`${API}/os/hoje`);
  }

  buscar(id: number): Observable<ServiceOrder> {
    return this.http.get<ServiceOrder>(`${API}/os/${id}`);
  }

  criar(body: CreateOSRequest): Observable<ServiceOrder> {
    return this.http.post<ServiceOrder>(`${API}/os`, body);
  }

  atualizar(id: number, body: UpdateOSRequest): Observable<ServiceOrder> {
    return this.http.put<ServiceOrder>(`${API}/os/${id}`, body);
  }

  atribuirTecnico(osId: number, tecnicoId: number): Observable<ServiceOrder> {
    return this.http.put<ServiceOrder>(`${API}/os/${osId}/atribuir/${tecnicoId}`, {});
  }
}
