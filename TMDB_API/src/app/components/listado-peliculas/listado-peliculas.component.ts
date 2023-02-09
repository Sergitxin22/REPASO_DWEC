import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PeliculasService } from 'src/app/services/peliculas.service';

@Component({
  selector: 'app-listado-peliculas',
  templateUrl: './listado-peliculas.component.html',
  styleUrls: ['./listado-peliculas.component.css']
})
export class ListadoPeliculasComponent implements OnInit{

  texto!: string

  constructor(private ruta: ActivatedRoute, private servicio: PeliculasService) {}

  ngOnInit(): void {
    this.ruta.params.subscribe(parametros => this.texto = parametros['texto'])
    console.log(this.servicio.getPeliculasBusqueda(this.texto));    
  }

}
