import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'circle',
    pathMatch: 'full'
  },
  {
    path: 'pixel',
    loadChildren: () => import('./pixel/pixel.module').then( m => m.PixelPageModule)
  },
  {
    path: 'circle',
    loadChildren: () => import('./circle/circle.module').then( m => m.CirclePageModule)
  },
  {
    path: 'cloud',
    loadChildren: () => import('./cloud/cloud.module').then( m => m.CloudPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
