import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./shared/layout/layout.component";
import {AuthForwardGuard} from "./core/auth/auth-forward.guard";

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      {
        path: '',
        loadChildren: () => import('./views/main/main.module').then(m => m.MainModule)
      },
      {
        path: '',
        loadChildren: () => import('./views/user/user.module').then(m => m.UserModule),
        canActivate: [AuthForwardGuard]
      },
      {
        path: '',
        loadChildren: () => import('./views/articles/articles.module').then(m => m.ArticlesModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
