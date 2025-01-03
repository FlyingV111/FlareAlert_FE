import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {LoginComponent} from './pages/auth/login/login.component';
import {authGuard} from './guards/authGuard/auth.guard';
import {secureInnerPageGuard} from './guards/secureInnerPage/secure-inner-page.guard';

export const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [authGuard]},
  {path: 'login', component: LoginComponent},
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: '**', redirectTo: 'login'},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
