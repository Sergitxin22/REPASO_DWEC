## ANGULAR APP
1. [Extensiones recomendadas](#extensiones-recomendadas)
1. [Creación del proyecto](#creación-del-proyecto)
2. [Configuración del proyecto](#configuración-del-proyecto)
3. [Creación del modelo](#creación-del-modelo)
4. [Creación del DTO](#creación-del-dto)
5. [Creación del DAO](#creación-del-dao)
6. [Creación del servicio](#creación-del-servicio)
7. [Creación del controlador](#creación-del-controlador)
8. [Añadir RestTemplate al MsTareasApplication](#añadir-resttemplate-al-mstareasapplication)
9. [Probar la API](#probar-la-api)
10. [Posibles errores](#posibles-errores)
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
5. Una vez termine de descargar las dependencias tendremos el proyecto creado: [Imagen](/microservicios/images/crear-repositorios.PNG)
### Configuración del proyecto
***
Una vez creado el proyecto vamos a configurar el fichero application.properties ( en src → main → resources) para asignar un nombre a la aplicación, el puerto de escucha y los parámetros de la configuración de SQL Server y del servidor de recursos:

```
spring.application.name=servicio-tareas
server.port=9005
spring.datasource.url=jdbc:sqlserver://localhost:2000;databaseName=pubs;TrustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=tiger
spring.datasource.driverClassName=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.jpa.show-sql=true
spring.jpa.hibernate.dialect=org.hibernate.dialect.SQLServerDialect
spring.jpa.hibernate.ddl-auto=update
```
### Creación del modelo
***
Creamos el modelo Tarea.class en el paquete org.zabalburu.tareas.modelo
```
package org.zabalburu.tareas.modelo;

import java.sql.Date;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "tareas")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Tarea {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Integer id;
	
	@Column(name = "idusuario")
	private Integer idUsuario;
	
	private String titulo;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date fecha;
	
	private String descripcion;	
	private Boolean realizada;
}
```
### Creación del DTO
***
Para incluir la paginación, creamos el DTO TareaDTO.class en el paquete org.zabalburu.tareas.dto
```
package org.zabalburu.tareas.dto;

import java.util.List;

import org.zabalburu.tareas.modelo.Tarea;

import lombok.Data;

@Data
public class TareaDTO {
	private Integer pagina;
	private Integer totalPaginas;
	private Integer tareasPorPagina;
	private List<Tarea> tareas;
}
```
### Creación del DAO
***
Para incluir la paginación, creamos la interfaz TareasRepository.java en el paquete org.zabalburu.tareas.dao\
Este DAO debe implementar la interfaz JpaRepository\
[Imagen](/microservicios/images/crear-repositorios.PNG)
```
package org.zabalburu.tareas.dao;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zabalburu.tareas.modelo.Tarea;

public interface TareasRepository extends JpaRepository<Tarea, Integer> {
	Page<Tarea> findByIdUsuarioOrderByFechaDesc(Pageable pg, Integer idUsuario);

	@Query("Select t From Tarea t where t.idUsuario=:idusuario and not t.realizada Order By t.fecha desc")
	Page<Tarea> getTareasPendientes(Pageable pg, @Param(value = "idusuario") Integer idUsuario);
	
	Optional<Tarea> findByIdUsuarioAndId(Integer idUsuario, Integer idTarea);
}
```
### Creación del servicio
***
Ahora creamos la clase TareasService en el paquete org.zabalburu.tareas.service y le ponemos el decorador @Service, también inyectamos el dao con el decorador @Autowired
```
package org.zabalburu.tareas.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.zabalburu.tareas.dao.TareasRepository;
import org.zabalburu.tareas.dto.TareaDTO;
import org.zabalburu.tareas.modelo.Tarea;

@Service
public class TareasService {
	@Autowired
	private TareasRepository dao;
	
	@Autowired
	private RestTemplate template;
	
	private boolean existeUsuario(Integer idUsuario) {
		try {
			template.getForObject("http://localhost:8005/usuarios/{id}", Object.class, idUsuario);
			return true;
		} catch (HttpClientErrorException.NotFound ex) {
			return false;
		}
	}
	
	public TareaDTO getTareas(Integer pagina, Integer idUsuario) {
		if (existeUsuario(idUsuario)) {
			Pageable pg = PageRequest.of(pagina-1, 3);
			Page<Tarea> page = dao.findByIdUsuarioOrderByFechaDesc(pg, idUsuario);
			TareaDTO dto = new TareaDTO();
			dto.setPagina(pagina);
			dto.setTareas(page.getContent());
			dto.setTareasPorPagina(3);
			dto.setTotalPaginas(page.getTotalPages());
			return dto;
		} else {
			return null;
		}
	}
	
	public TareaDTO getTareasPendientes(Integer pagina, Integer idUsuario) {
		if (existeUsuario(idUsuario)) {
			Pageable pg = PageRequest.of(pagina-1, 3);
			Page<Tarea> page = dao.getTareasPendientes(pg, idUsuario);
			TareaDTO dto = new TareaDTO();
			dto.setPagina(pagina);
			dto.setTareas(page.getContent());
			dto.setTareasPorPagina(3);
			dto.setTotalPaginas(page.getTotalPages());
			return dto;
		} else {
			return null;
		}
	}
	
	public Tarea nuevaTarea(Tarea t) {
		if (existeUsuario(t.getIdUsuario())) {
			return dao.save(t);
		} else {
			return null;
		}
	}
	
	public Tarea getTarea(Integer idUsuario, Integer idTarea) {
		Tarea t = null;
		if (existeUsuario(idUsuario)) {
			t = dao.findByIdUsuarioAndId(idUsuario, idTarea).orElse(null);
		}
		return t;
	}
	
	public void eliminarTarea(Integer idUsuario, Integer idTarea) {
		try {
			dao.delete(getTarea(idUsuario, idTarea));
		} catch (Exception ex) {}
	}
}
```
### Creación del controlador
***
Ahora creamos la clase TareasController en el paquete org.zabalburu.tareas.controller y le ponemos el decorador @RestController, también inyectamos el servicio con el decorador @Autowired
```
package org.zabalburu.tareas.controller;

import java.net.URI;
import java.net.URISyntaxException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.zabalburu.tareas.dto.TareaDTO;
import org.zabalburu.tareas.modelo.Tarea;
import org.zabalburu.tareas.service.TareasService;

@RestController
@RequestMapping("/tareas")
public class TareasController {
	@Autowired
	private TareasService servicio;
	
	@GetMapping("/{idUsuario}")
	public ResponseEntity<TareaDTO> getUsuarios(@RequestParam(defaultValue = "1") Integer pagina,
			@PathVariable Integer idUsuario){
		TareaDTO dto = servicio.getTareas(pagina, idUsuario);
		if (dto == null) {
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.ok(dto);
		}
	}
	
	@GetMapping("/pendientes/{idUsuario}")
	public ResponseEntity<TareaDTO> getTareasPendientes(@RequestParam(defaultValue = "1") Integer pagina,
			@PathVariable Integer idUsuario){
		TareaDTO dto = servicio.getTareasPendientes(pagina, idUsuario);
		if (dto == null) {
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.ok(dto);
		}
	}
	
	@PostMapping("/{idUsuario}")
	public ResponseEntity<Tarea> nuevaTarea(@PathVariable Integer idUsuario, @RequestBody Tarea t) throws URISyntaxException{
		t.setIdUsuario(idUsuario);
		t = servicio.nuevaTarea(t);
		if (t == null) {
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.created(new URI("http://localhost:9005/tareas/"+idUsuario+"/" +t.getId()))
					.body(t);
		}
	}
	
	@GetMapping("/{idUsuario}/{idTarea}")
	public ResponseEntity<Tarea> getUsuario(@PathVariable Integer idUsuario, @PathVariable Integer idTarea){
		Tarea t = servicio.getTarea(idUsuario,idTarea);
		if (t == null) {
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.ok(t);
		}
	}
	
	@DeleteMapping("/{idUsuario}/{idTarea}")
	public ResponseEntity<?> eliminarTarea(@PathVariable Integer idUsuario, @PathVariable Integer idTarea){
		servicio.eliminarTarea(idUsuario,idTarea);
		return ResponseEntity.ok().build();
	}	
}
```
### Añadir RestTemplate al MsTareasApplication
***
Hay que añadir el been del RestTemplate al MsTareasApplication
```
package org.zabalburu.tareas;

import javax.sql.DataSource;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class MsTareasApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsTareasApplication.class, args);
	}
	
	@Bean
	public RestTemplate gettemplate() {
		return new RestTemplate();
	}
}
```
### Probar la API
***
Ahora podemos probar la API en el puerto que hemos configurado en el archivo application.properties, en este caso el 9005.
Podemos probar los siguientes endpoints:
* GET [http://localhost:9005/tareas/{idUsuario}](http://localhost:9005/tareas/1) → Esto devuelve todas las tareas del usuarioId que le pasamos
* GET [http://localhost:9005/tareas/pendientes/{idUsuario}](http://localhost:9005/tareas/pendientes/1) → Esto devuelve todas las tareas pendientes del usuarioId que le pasamos
* POST [http://localhost:9005/tareas/{idUsuario}](http://localhost:9005/tareas/1) → Esto añade la tarea al usuario indicado
* GET [http://localhost:9005/tareas/{idUsuario}/{idTarea}](http://localhost:9005/tareas/1/1) → Esto devuelve la tarea del usuario y tarea indicados
* DELETE [http://localhost:9005/tareas/{idUsuario}/{idTarea}](http://localhost:9005/tareas/1/1) → Esto elimina la tarea del usuario y tarea indicados 
### Posibles errores
***
Un posible error es que no te haga caso al puerto configurado, yo lo he soluciionado dándole a project → clean y añadiendo lo siguiente al MsTareasApplication:
```
package org.zabalburu.tareas;

import javax.sql.DataSource;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class MsTareasApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsTareasApplication.class, args);
	}
	
	@Bean
	public DataSource dataSource() {
	    DriverManagerDataSource dataSource = new DriverManagerDataSource();
	
	    dataSource.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
	
	    dataSource.setUsername("sa");
	
	    dataSource.setPassword("tiger");
	
	    dataSource.setUrl( "jdbc:sqlserver://localhost:2000;databaseName=Northwind;TrustServerCertificate=True;");
	
	    return dataSource;
	
	 }
	
	@Bean
	public RestTemplate gettemplate() {
		return new RestTemplate();
	}
}
```
Y luego borrándolo.
