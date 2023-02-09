import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListadoPeliculasComponent } from './components/listado-peliculas/listado-peliculas.component';

const routes: Routes = [
  { path: '',  component: HomeComponent},
  { path: 'listado-peliculas/:texto',  component: ListadoPeliculasComponent},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
