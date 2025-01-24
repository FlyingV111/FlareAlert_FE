import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {LoginComponent} from './pages/auth/login/login.component';
import {authGuard} from './guards/authGuard/auth.guard';
import {secureInnerPageGuard} from './guards/secureInnerPage/secure-inner-page.guard';
import {ConnectionsComponent} from './pages/connections/connections.component';
import {TemplateEditorContainerComponent} from './pages/template-editor/template-editor-container.component';
import {TemplateOverviewComponent} from './pages/template-overview/template-overview.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    pathMatch: 'full',
    canActivate: [authGuard]
  },
  {
    path: 'connections',
    component: ConnectionsComponent,
    pathMatch: 'full',
    canActivate: [authGuard]
  },
  {
    path: 'templates',
    children: [
      {
        path: '',
        component: TemplateOverviewComponent,
        canActivate: [authGuard]
      },
      {
        path: 'editor',
        component: TemplateEditorContainerComponent,
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [secureInnerPageGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: '**',
    redirectTo: 'login'
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
