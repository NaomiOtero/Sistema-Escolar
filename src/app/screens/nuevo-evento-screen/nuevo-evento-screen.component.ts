import { Component, Injectable, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService } from 'src/app/services/eventos.service';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { MatDialog } from '@angular/material/dialog';

const hhttpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-nuevo-evento-screen',
  templateUrl: './nuevo-evento-screen.component.html',
  styleUrls: ['./nuevo-evento-screen.component.scss']
})
export class NuevoEventoScreenComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_evento: any = {};

  public evento:any = {}
  public errors:any = {};
  public editar:boolean = false;
  public token: string = "";
  public idEvento: Number = 0;


  //Para el select
  public tipos: any[] = [
    {value: '1', viewValue: 'Conferencia'},
    {value: '2', viewValue: 'Taller'},
    {value: '3', viewValue: 'Seminario'},
    {value: '4', viewValue: 'Concurso'},
  ];

    //Para el select
  public carreras: any[] = [
    {value: '1', viewValue: 'Ingeniera en Ciencias de la Computación'},
    {value: '2', viewValue: 'Licenciatura en Ciencias de la Computación'},
    {value: '3', viewValue: 'Ingeniería en Tecnologías de la Información '},
  ];

   public objetivos:any[] = [
    {value: '1', nombre: 'Estudiantes'},
    {value: '2', nombre: 'Profesores'},
    {value: '3', nombre: 'Publico General'},
  ];

    listaAdmins: any[] = [];
    listaMaestros: any[] = [];
    listaResponsables: any[] = [];

  constructor(
    private location: Location,
    public route: ActivatedRoute,
    private eventosService: EventosService,
    private facadeService: FacadeService,
    private router: Router,
    private adminService: AdministradoresService,
    private maestrosService: MaestrosService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.cargarResponsables();
          //El primer if valida si existe un parámetro en la URL
      const id =this.route.snapshot.params['id'];
      if(id){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idEvento = this.route.snapshot.params['id'];
      console.log("ID Evento: ", this.idEvento);
      //Al iniciar la vista asignamos los datos del evento
      this.cargarEvento(id);
    }else{
      // Va a registrar un nuevo evento
      this.evento = this.eventosService.esquemaEvento();
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("Evento: ", this.evento);
}
// no se aceptan fechas pasadas
public hoy: Date = new Date();


public regresar(){
    this.location.back();
  }

  cargarEvento(id: number) {
    this.eventosService.obtenerEventoPorID(id).subscribe(
      (evento) => {
        this.evento = evento;
      },
      (error) => {
        console.error("Error al cargar evento: ", error);
      }
    );
  }

  public actualizar(){

     // Validación de los datos
    this.errors = {};
    this.errors = this.eventosService.validarEvento(this.evento, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }
    // Ejecutar el servicio de actualización
    this.eventosService.actualizarEvento(this.evento).subscribe(
      (response) => {
        // Redirigir o mostrar mensaje de éxito
        alert("Evento actualizado exitosamente");
        console.log("Evento actualizado: ", response);
        this.router.navigate(["/eventos-academicos"]);
      },
      (error) => {
        // Manejar errores de la API
        alert("Error al actualizar evento");
        console.error("Error al actualizar evento: ", error);
      }
    );
  }

    public registrar(){
    this.errors = {};
    this.errors = this.eventosService.validarEvento(this.evento, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }
    //Validar la contraseña
    if(this.evento.password == this.evento.confirmar_password){
      // Ejecutamos el servicio de registro
      this.eventosService.registrarEvento(this.evento).subscribe(
        (response) => {
          // Redirigir o mostrar mensaje de éxito
          alert("Evento registrado exitosamente");
          console.log("Evento registrado: ", response);
          if(this.token && this.token !== ""){
            this.router.navigate(["/eventos-academicos"]);
          }else{
            this.router.navigate(["/"]);
          }
        },
        (error) => {
          // Manejar errores de la API
          alert("Error al registrar Evento");
          console.error("Error al registrar Evento: ", error);
        }
      );
    }
  }

cargarResponsables() {
  this.adminService.obtenerListaAdmins().subscribe((admins) => {
    this.listaAdmins = admins;

    this.maestrosService.obtenerListaMaestros().subscribe((maestros) => {
      this.listaMaestros = maestros;
      this.listaResponsables = [
        ...this.listaAdmins.map(a => ({
          id: a.id,
          nombre: `${a.user.first_name} ${a.user.last_name}`,
          rol: "Administrador"
        })),
        ...this.listaMaestros.map(m => ({
          id: m.id,
          nombre: `${m.user.first_name} ${m.user.last_name}`,
          rol: "Maestro"
        }))
      ];
    });
  });
}

    // Función para los campos solo de datos alfabeticos
  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

  soloAlfanumerico(event: KeyboardEvent) {
  const pattern = /^[a-zA-Z0-9 ]$/; // Solo letras y números
  const inputChar = event.key;

  if (!pattern.test(inputChar) && event.key !== 'Backspace' && event.key !== 'Tab') {
    event.preventDefault();
  }
}
 //Función para detectar el cambio de fecha
  public changeFecha(event :any){
    console.log(event);
    console.log(event.value.toISOString());

    this.evento.fecha = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.evento.fecha);
  }


formatearHora(campo: 'hora_inicio' | 'hora_final') {
  let time = this.evento[campo];
  if (!time) return;

  // Caso 1: Viene como HTML string tipo "4:00 AM"
  if (typeof time === 'string' && time.toUpperCase().includes('AM') || time.toUpperCase().includes('PM')) {
    this.evento[campo] = this.convertirAMPMa24(time);
    return;
  }

  // Caso 2: Viene como Date desde el timepicker
  if (time instanceof Date) {
    const hh = time.getHours().toString().padStart(2, '0');
    const mm = time.getMinutes().toString().padStart(2, '0');
    this.evento[campo] = `${hh}:${mm}`;
    return;
  }

  // Caso 3: Viene como { hour, minute }
  if (typeof time === 'object' && 'hour' in time) {
    const hh = time.hour.toString().padStart(2, '0');
    const mm = time.minute.toString().padStart(2, '0');
    this.evento[campo] = `${hh}:${mm}`;
  }
}

convertirAMPMa24(time: string): string {
  let [hora, minutoAMPM] = time.split(':');
  let minuto = minutoAMPM.substring(0, 2);
  let ampm = minutoAMPM.substring(3).trim().toUpperCase();

  let h = parseInt(hora, 10);

  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;

  const hh = h.toString().padStart(2, '0');
  return `${hh}:${minuto}`;
}
  errorHora: string = "";
  validarHoras() {
    const inicio = this.evento.hora_inicio;
    const final = this.evento.hora_final;

    if (!inicio || !final){
      this.errorHora = "";
      return;
    }
    //conertir a minutos para comparar
    const horaInicio = new Date(`200-01-01T${ inicio}:00`);
    const horaFinal = new Date(`200-01-01T${ final}:00`);

    if (horaFinal <= horaInicio) {
      this.errorHora = "La hora final debe ser mayor que la hora de inicio.";
    } else {
      this.errorHora = "";
    }
  }

  //Función para manejar el cambio en los checkboxes
    // Funciones para los checkbox
  public checkboxChange(event:any){
    console.log("Evento: ", event);
    if(event.checked){
      this.evento.objetivo_json.push(event.source.value)
    }else{
      console.log(event.source.value);
      this.evento.objetivo_json
      .forEach((evento, i) => {
        if(evento == event.source.value){
          this.evento.objetivo_json.splice(i,1)
        }
      });
    }
    console.log("Array evento: ", this.evento.objetivo_json);
  }

// Función para revisar si un objetivo ya está seleccionado
    public revisarSeleccion(nombre: string){
    if(this.evento.objetivo_json){
      var busqueda = this.evento.objetivo_json.find((element)=>element==nombre);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  soloNumeros(event: any) {
  event.target.value = event.target.value.replace(/[^0-9]/g, '');
  if (event.target.value.length > 3) {
  }
}
  //caracteres permitidos
  validarDescripcion(event: any) {
  const valor = event.target.value;

  const patron = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:¡!¿?\-()'" ]*$/;

  if (!patron.test(valor)) {
    // Eliminar caracteres inválidos
    event.target.value = valor.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:¡!¿?\-()'" ]/g, '');
    this.evento.descripcion = event.target.value;
  }
}
}

