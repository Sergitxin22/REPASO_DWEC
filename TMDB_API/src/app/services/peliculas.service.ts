import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { RespuestaPeliculasBusqueda } from '../models/get-peliculas-busqueda';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  constructor(private http: HttpClient) { }

  async getPeliculasBusqueda(texto: string): Promise<RespuestaPeliculasBusqueda> {
    const url: string = "https://api.themoviedb.org/3/search/movie"

    const httpOptions = {
      headers: { 
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2M2JhM2ZiZDNhZmJiNzkyMzZlYzJiZmFmMWNlOWY1ZiIsInN1YiI6IjYzZTUyYmY2NjU2ODZlMDA4MTZmZTQyMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NLd4XTcRLWk-gBik8B5c0cgf_TqY0hy8trMRmJu8m04"
      },
      params: {
        "query": texto
      },
    };

    return lastValueFrom(this.http.get<RespuestaPeliculasBusqueda>(url, httpOptions))
  }
}
