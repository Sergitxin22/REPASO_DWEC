import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public textoCorto: boolean = false;

  constructor( private router: Router) {}

  buscar(texto: string) {
    if(texto.length > 3) {
      this.textoCorto = false
      this.router.navigate(["/listado-peliculas/" + texto])
    } else {
      this.textoCorto = true
    }
  }
}
