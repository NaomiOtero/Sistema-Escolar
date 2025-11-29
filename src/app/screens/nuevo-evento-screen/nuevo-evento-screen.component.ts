import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService } from 'src/app/services/eventos.service';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';

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
  constructor(
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private eventosService: EventosService,
    private facadeService: FacadeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    //El primer if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idEvento = this.activatedRoute.snapshot.params['id'];
      console.log("ID Evento: ", this.idEvento);
      //Al iniciar la vista asignamos los datos del evento
      this.evento = this.datos_evento;
    }else{
      // Va a registrar un nuevo evento
      this.evento = this.eventosService.esquemaEvento();
      this.evento.rol = this.rol;
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

  public actualizar(){
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
            this.router.navigate(["eventos"]);
          }else{
            this.router.navigate(["/"]);
          }
        },
        (error) => {
          // Manejar errores de la API
          alert("Error al registrar administrador");
          console.error("Error al registrar administrador: ", error);
        }
      );
    }
  }

   public validarEstructuraRFC(event: KeyboardEvent) {
  const inputChar = event.key.toUpperCase();
  const currentValue = (this.evento.rfc || "").toUpperCase();
  const pos = currentValue.length;

  // Permitir teclas de control
  if (event.ctrlKey || event.altKey || event.metaKey || inputChar.length > 1) return;

  // Permitir borrar, tabular o moverse
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
  if (allowedKeys.includes(event.key)) return;

  let regex: RegExp | null = null;

  // RFC puede ser de 12 (persona moral) o 13 (física)
  // Validamos según la posición actual
  if (pos >= 0 && pos <= 2) regex = /^[A-Z]$/;            // Letras iniciales
  else if (pos === 3) regex = /^[A-Z0-9]$/;               // 4ta posición (puede ser letra o número)
  else if (pos >= 4 && pos <= 9) regex = /^[0-9]$/;       // Fecha AAMMDD
  else if (pos >= 10 && pos <= 12) regex = /^[A-Z0-9]$/;  // Homoclave (3 últimos)
  else event.preventDefault();                            // Evita más de 13 caracteres

  // Validar carácter ingresado
  if (regex && !regex.test(inputChar)) {
    event.preventDefault();
  }
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

    this.evento.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.evento.fecha_nacimiento);
  }

  //VALIDACION FECHA INICIAL NO MAYOR A FECHA FINAL
errorHora: string = '';
validarHoras() {
  const inicio = this.evento.hora_inicio;
  const final = this.evento.hora_final;

  if (!inicio || !final) {
    this.errorHora = '';
    return;
  }

  // Convertir a objetos Date para comparar
  const horaInicio = new Date(`2000-01-01T${inicio}:00`);
  const horaFinal = new Date(`2000-01-01T${final}:00`);

  if (horaFinal <= horaInicio) {
    this.errorHora = 'La hora final debe ser mayor que la hora de inicio.';
  } else {
    this.errorHora = '';
  }
}
  //Función para manejar el cambio en los checkboxes
    // Funciones para los checkbox
  public checkboxChange(event:any){
    console.log("Evento: ", event);
    if(event.checked){
      this.evento.eventos_json.push(event.source.value)
    }else{
      console.log(event.source.value);
      this.evento.eventos_json
      .forEach((evento, i) => {
        if(evento == event.source.value){
          this.evento.eventos_json.splice(i,1)
        }
      });
    }
    console.log("Array evento: ", this.evento.eventos_json);
  }

  // Función para revisar si un objetivo ya está seleccionado
    public revisarSeleccion(nombre: string){
    if(this.evento.eventos_json){
      var busqueda = this.evento.eventos_json.find((element)=>element==nombre);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }
}
