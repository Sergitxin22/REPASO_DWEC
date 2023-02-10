## ANGULAR APP
1. [Extensiones recomendadas](#extensiones-recomendadas)
1. [Creación del proyecto](#creación-del-proyecto)
2. [Configuración del proyecto](#configuración-del-proyecto)
3. [Ejecutar el proyecto](#ejecutar-el-proyecto)
4. [Funcionamiento de la API](#funcionamiento-de-la-api)
5. [Creación de la interfaz](#creación-de-la-interfaz)
6. [Creación del servicio](#creación-del-servicio)
6. [Creación del interceptor](#creación-del-interceptor)
8. [Ejemplo Componente ListadoPlaylist](#ejemplo-componente-listadoplaylist)
9. [Barra de búsqueda](#barra-de-búsqueda)
### Extensiones recomendadas
***
1. Material Icon Theme (Iconos bonitos) → https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme
2. Angular Language Service (Autocompletado de Angular) → https://marketplace.visualstudio.com/items?itemName=Angular.ng-template
3. Paste JSON as Code (Crear interfaces fácilmente) → https://marketplace.visualstudio.com/items?itemName=quicktype.quicktype
4. Error Lens (Ver errores en línea) → https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens
### Creación del proyecto
***
1. Abrimos la consola (a poder ser la que pone "Command Prompt") de VS Code en la carpeta en la que queremos crear la aplicación
2. Creamos el proyecto ejecutando el siguiente comando:
```
ng new nombreApp
```
3. En "Would you like to add Angular routing?" Ponemos "y" para que nos genere automáticamente el app-routing
4. En "Which stylesheet format would you like to use?" Presionamos la tecla enter para elegir la opción de css
5. Una vez termine de descargar las dependencias tendremos el proyecto creado: [Imagen](/images/crear-proyecto.PNG)
### Configuración del proyecto
***
1. Abrimos el archivo src => app → app.module.ts → e importamos el HttpClientModule de la librería '@angular/common/http':
```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
2. Creamos los componentes necesarios para nuestra aplicación (se suelen meter en la carpeta components):
```
ng g c components/nombreComponente --skip-tests
```
3. Abrimos el archivo src => app → app-routing.module.ts → e incluimos nuestros endpoints en la constante routes:
```
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetallePlaylistComponent } from './components/detalle-playlist/detalle-playlist.component';
import { HomeComponent } from './components/home/home.component';
import { ListadoPlaylistComponent } from './components/listado-playlist/listado-playlist.component';
import { PlaylistCategoriaComponent } from './components/playlist-categoria/playlist-categoria.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'categorias/:id/playlists', component: PlaylistCategoriaComponent},
  { path: 'playlists/:id', component: DetallePlaylistComponent},
  { path: 'listado-playlists/:texto', component: ListadoPlaylistComponent},
  { path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```
4. Ahora vamos a incluir Bootstrap a nuestra aplicación, para eso, hay que ir al archivo index.html y añadir el siguiente código en el head:
```
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
```
5. Borramos el contenido del archivo app.component.html y ponemos la etiqueta <router-outlet></router-outlet> para que nos muestre el componente de la ruta actual que hemos puesto en el app-routing.module.ts, además podemos poner todo lo que queramos que se visialize en toda la aplicación como el header o el footer:
```
<app-barra-navegacion></app-barra-navegacion>
<router-outlet></router-outlet>
```
### Ejecutar el proyecto
***
1. Para que se nos ejecute la aplicación ejecutamos el siguiente comando en una terminal:
```
ng serve -o
```
2. Abrimos otra terminal (sin cerrar la anterior) para crear todos los archivos necesarios sin parar nuestra aplicación
### Funcionamiento de la API
***
Una cosa de las más importantes para este ejercicio es entender bien como funciona la API, para eso, abrimos la documentación oficial: https://developer.spotify.com/console/ hemos abierto la parte "/console" porque nos va a ayudar mucho a la hora de crear las interfaces

1. Abrimos el endpoint que queramos: [Imagen](/images/api-1.PNG)
2. Pinchamos en GET TOKEN para que nos genere automáticamente un token
3. Pinchamos en FILL SAMPLE DATA y después es TRY IT para probar el endpoint: 
4. Una vez se haya ejecutado, copiamos el fragmento de código que empieza por curl -X "GET": [Imagen](/images/api-2.PNG)
5. Nos dirigimos al POSTMAN, pinchamos en Import Raw test y pegamos el código anterior: [Imagen](/images/postman-1.PNG)
6. Hacemos click en Continue → Import y automáticamente nos crea el endpoint con los parámetros y las cabeceras: [Imagen](/images/postman-2.PNG)
### Creación de la interfaz
***
1. Una vez tenemos la respuesta del endpoint en el postman, lo copiamos con el icono del portapapeles y nos volvemos a VS Code
2. Creamos una interfaz con el siguiente código:
```
ng g i models/getEndpoint
```
3. Una vez creada, la abrimos, borramos el contenido y al tener instalada la extensión "Paste JSON as Code", pulsamos Ctrl + Shift + V y se nos va a abrir una ventana en la que hay que poner el nombre que le queramos poner a la interfaz, en mi caso RespuestaGetEndpoint
4. Le damos al enter y nos creará todas las interfaces
### Creación del servicio
***
Lo siguiente que debemos crear es el servicio, que será el archivo que conectará nuestro front con el back a través de la API

1. Creamos el servicio con el siguiente comando:
```
ng g s services/nombre --skip-tests
```
2. En dicho servicio tenemos que crear el método getToken y los métodos que vayamos a utilizar\
Ejemplo de servicio:
```
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { RespuestaGetCategorias } from '../models/get-categorias';
import { RespuestaPlaylistTracks } from '../models/get-playlist-tracks';
import { RespuestaPlaylistsBusqueda } from '../models/get-playlists-busqueda';
import { RespuestaCategoriaPlaylists } from '../models/get-playlists-categoria';
import { RespuestaGetToken } from '../models/get-token';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  CLIENT_ID: string = "b98251cba6334fa997d100fd4688c28a"
  CLIENT_SECRET: string = "caac071994b94b57adf0ec573fb94d4e"

  constructor(private http: HttpClient) { }

  async getToken(): Promise<RespuestaGetToken> {
    let url = "https://accounts.spotify.com/api/token"

    let auth = btoa(this.CLIENT_ID + ":" + this.CLIENT_SECRET)
    let params : HttpParams = new HttpParams().set('grant_type', 'client_credentials')
    let headers = {
      'Authorization': 'Basic ' + auth, 
      'content-type' : 'application/x-www-form-urlencoded'
    }

    return lastValueFrom(this.http.post<RespuestaGetToken>(url, params, {headers: headers}))
  }

  async getCategorias(): Promise<RespuestaGetCategorias> {
    let url = "https://api.spotify.com/v1/browse/categories"
    
    return lastValueFrom(this.http.get<RespuestaGetCategorias>(url))
  }

  async getCategoriasBusqueda(texto: string): Promise<RespuestaPlaylistsBusqueda> {
    let url = "https://api.spotify.com/v1/search"

    
    return lastValueFrom(this.http.get<RespuestaPlaylistsBusqueda>(url,
     {
      params: {
        'q': texto,
        'type': 'playlist' 
      }
     }
    ))
  }

  async getPlaylistsCategoria(categoriaId: string): Promise<RespuestaCategoriaPlaylists> {
    let url = `https://api.spotify.com/v1/browse/categories/${categoriaId}/playlists`
    
    return lastValueFrom(this.http.get<RespuestaCategoriaPlaylists>(url))
  }

  async getPlaylistTracks(playlistId: string): Promise<RespuestaPlaylistTracks> {
    let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
    
    return lastValueFrom(this.http.get<RespuestaPlaylistTracks>(url))
  }
}
```
### Creación del interceptor
***
Para que se añada automáticamente el token en el header de todas las peticiones, tenemos que crear un interceptor:
1. Creamos el interceptor con el siguiente comando:
```
ng g s services/auth --skip-tests
```
2. En el interceptor ponemos el siguiente código:
```
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { from, lastValueFrom, Observable } from 'rxjs';
import { AlbumsService } from './albums.service';
import { RespuestaGetToken } from '../models/get-token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private servicio: AlbumsService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.tratarPeticion(request, next))
  }

  private async tratarPeticion(req: HttpRequest<any>, next: HttpHandler) : Promise<HttpEvent<any>> {
    let URL_OBTENER_TOKEN = "https://accounts.spotify.com/api/token";

    if (req.url != URL_OBTENER_TOKEN) {
      let tokenStringified = localStorage.getItem("token");
      let respuestaToken: RespuestaGetToken;
      let token: string;
      let ahora = new Date();

      if (tokenStringified) {
        let tokenObj = JSON.parse(tokenStringified);
        if (tokenObj && ahora < new Date(tokenObj.fecha)) {
          token = tokenObj.token;
        }
        else {
          respuestaToken = await this.servicio.getToken();
          localStorage.setItem("token", JSON.stringify({"token": respuestaToken.access_token,"fecha":(ahora.getTime() + respuestaToken.expires_in * 1000)}));
          token = respuestaToken.access_token;
        }
      }
      else {
        respuestaToken = await this.servicio.getToken();
        localStorage.setItem("token", JSON.stringify({"token": respuestaToken.access_token,"fecha":(ahora.getTime() + respuestaToken.expires_in * 1000)}));
        token = respuestaToken.access_token;
      }
      
      let request = req.clone({
        setHeaders: {
          authorization: `Bearer ${token}`
        }
      });
     
      return lastValueFrom(next.handle(request));
    }
  
    return lastValueFrom(next.handle(req));
  }
}
```
3. Ahora, para que angular use este interceptor en todas las peticiones hay que añadir lo siguiente en el app.module.ts:
```
providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    } 
  ],
```
### Ejemplo Componente ListadoPlaylist
***
Vamos a hacer un ejemplo con un componente en el cúal hay que recuperar un parámetro por la url
1. En el constructor inyectamos el servicio y el ActivatedRoute
2. En el ngOnInit recuperamos el valor del parámetro de la ruta con el siguiente código:
```
this.route.params.subscribe(params => {
        this.texto = params['texto']
      }
    )
```
3. Una vez tenemos dicho valor almacenado en una variable lo podemos hacer para hacer una petición a uno de nuestros endpoints:\
El código del ts de este componente quedaría así:
```
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RespuestaPlaylistsBusqueda } from 'src/app/models/get-playlists-busqueda';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-listado-playlist',
  templateUrl: './listado-playlist.component.html',
  styleUrls: ['./listado-playlist.component.css']
})
export class ListadoPlaylistComponent implements OnInit {
  texto!: string
  listaPlaylists!: RespuestaPlaylistsBusqueda

  constructor(private servicio: SpotifyService, private route: ActivatedRoute) {}

  async ngOnInit() {
    this.route.params.subscribe(params => {
        this.texto = params['texto']
      }
    )

    this.listaPlaylists = await this.servicio.getCategoriasBusqueda(this.texto)
  }    
}
```
El código del html de este componente quedaría así:
```
<h1 class="text-center my-5">Playlists para la búsqueda {{ texto }}</h1>

<div class="d-flex justify-content-around container flex-wrap text-center">
    <div class="card m-2 col-4 " style="width: 18rem;" *ngFor="let playlist of listaPlaylists?.playlists?.items">
        <img [src]="playlist.images | images" >
        <div class="card-body">
            <a [routerLink]="['/playlists', playlist.id]">
                <h5 class="card-title">{{ playlist.name }}</h5>
            </a>
        </div>
    </div>
</div>
```
### Barra de búsqueda
***
Para recuperar el valor de un input hay que usar el siguiente código:
```
<input #input type="search" name="" id="" (keydown.enter)="buscar(input.value)" placeholder="Buscar" />
<a (click)="buscar(input.value)" class="btn btn-success ms-2">Buscar</a>
```
En el #input se almacena el elemento input, por lo tanto, para pasar su valor al pulsar enter, tienes que pasar su valor, de ahí que ponga .value\
En el .ts, recuperamos el valor y redirigimos al usuario a otro componente con el valor que recuperamos del .html\
Código barraBusqueda.component.ts:
```
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor( private router: Router) {}

  buscar(texto: string) {
    this.router.navigate(["/listado-peliculas/" + texto])
  }
}
```
