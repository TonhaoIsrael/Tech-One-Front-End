import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password.component';
import { OrdersListComponent } from './features/orders/orders-list.component';
import { OrderDetailComponent } from './features/orders/order-detail.component';
import { OrderFormComponent } from './features/orders/order-form.component';
import { ProfileComponent } from './features/profile/profile.component';
import { UsersListComponent } from './features/users/users-list.component';
import { UserFormComponent } from './features/users/user-form.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'recuperar-senha', component: ForgotPasswordComponent },
  { path: 'perfil', component: ProfileComponent },
  { path: 'ordens', component: OrdersListComponent },
  { path: 'ordens/abertas', component: OrdersListComponent, data: { status: 'PENDENTE' } },
  { path: 'ordens/historico', component: OrdersListComponent, data: { status: 'CONCLUIDA' } },
  { path: 'ordens/nova', component: OrderFormComponent },
  { path: 'ordens/:id', component: OrderDetailComponent },
  { path: 'ordens/:id/editar', component: OrderFormComponent },
  { path: 'usuarios', component: UsersListComponent },
  { path: 'usuarios/novo', component: UserFormComponent },
  { path: 'usuarios/:id/editar', component: UserFormComponent },
  { path: '**', redirectTo: 'login' }
];
