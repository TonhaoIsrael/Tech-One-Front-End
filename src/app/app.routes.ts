import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/auth.guard';

import { LoginComponent }          from './features/auth/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password.component';
import { OrdersListComponent }     from './features/orders/orders-list.component';
import { OrderDetailComponent }    from './features/orders/order-detail.component';
import { OrderFormComponent }      from './features/orders/order-form.component';
import { ProfileComponent }        from './features/profile/profile.component';
import { UsersListComponent }      from './features/users/users-list.component';
import { UserFormComponent }       from './features/users/user-form.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // ── Públicas ──────────────────────────────────────────────────────────────
  { path: 'login',           component: LoginComponent },
  { path: 'recuperar-senha', component: ForgotPasswordComponent },

  // ── Autenticado (admin + técnico) ─────────────────────────────────────────
  { path: 'perfil',           component: ProfileComponent,    canActivate: [authGuard] },
  { path: 'ordens',           component: OrdersListComponent, canActivate: [authGuard] },

  // ── ROTAS ESTÁTICAS antes de :id (evita NaN) ──────────────────────────────
  { path: 'ordens/abertas',   component: OrdersListComponent, canActivate: [authGuard], data: { status: 'ABERTO' } },
  { path: 'ordens/historico', component: OrdersListComponent, canActivate: [authGuard], data: { status: 'CONCLUIDO' } },
  { path: 'ordens/nova',      component: OrderFormComponent,  canActivate: [authGuard, adminGuard] },

  // ── Rotas dinâmicas com :id ───────────────────────────────────────────────
  { path: 'ordens/:id',        component: OrderDetailComponent, canActivate: [authGuard] },
  { path: 'ordens/:id/editar', component: OrderFormComponent,   canActivate: [authGuard, adminGuard] },

  // ── Apenas ADMIN ──────────────────────────────────────────────────────────
  { path: 'usuarios',            component: UsersListComponent, canActivate: [authGuard, adminGuard] },
  { path: 'usuarios/novo',       component: UserFormComponent,  canActivate: [authGuard, adminGuard] },
  { path: 'usuarios/:id/editar', component: UserFormComponent,  canActivate: [authGuard, adminGuard] },

  { path: '**', redirectTo: 'login' },
];