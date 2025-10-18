import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { MaestrosService } from 'src/app/services/maestros.service';

@Component({
  selector: 'app-registro-maestros',
  templateUrl: './registro-maestros.component.html',
  styleUrls: ['./registro-maestros.component.scss']
})
export class RegistroMaestrosComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: any = {};

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public maestro:any = {};
  public errors:any = {};
  public editar:boolean = false;
  public token: string = "";
  public idUser: Number = 0;

  //Para el select
  public areas: any[] = [
    {value: '1', viewValue: 'Desarrollo Web'},
    {value: '2', viewValue: 'Programación'},
    {value: '3', viewValue: 'Bases de datos'},
    {value: '4', viewValue: 'Redes'},
    {value: '5', viewValue: 'Matemáticas'},
  ];

  public materias:any[] = [
    {value: '1', nombre: 'Aplicaciones Web'},
    {value: '2', nombre: 'Programación 1'},
    {value: '3', nombre: 'Bases de datos'},
    {value: '4', nombre: 'Tecnologías Web'},
    {value: '5', nombre: 'Minería de datos'},
    {value: '6', nombre: 'Desarrollo móvil'},
    {value: '7', nombre: 'Estructuras de datos'},
    {value: '8', nombre: 'Administración de redes'},
    {value: '9', nombre: 'Ingeniería de Software'},
    {value: '10', nombre: 'Administración de S.O.'},
  ];
  constructor(
    private router: Router,
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private maestrosService: MaestrosService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.maestro = this.maestrosService.esquemaMaestro();
    // Rol del usuario
    this.maestro.rol = this.rol;

    console.log("Datos maestro: ", this.maestro);
  }

  public regresar(){
    this.location.back();
  }

public registrar() {
  this.errors = this.maestrosService.validarMaestro(this.maestro, false);

  if (Object.keys(this.errors).length === 0) {
    this.maestrosService.registrarMaestro(this.maestro).subscribe({
      next: (res) => {
        console.log("Maestro  registrado:", res);
        // Redirigir o mostrar mensaje
      },
      error: (err) => {
        console.error("Error al registrar:", err);
        alert("Error al registrar maestro");
      }
    });
  } else {
    console.log("Errores en el formulario:", this.errors);
  }
}


  public actualizar(){

  }

    soloAlfanumerico(event: KeyboardEvent) {
  const pattern = /^[a-zA-Z0-9]$/; // Solo letras y números
  const inputChar = event.key;

  if (!pattern.test(inputChar) && event.key !== 'Backspace' && event.key !== 'Tab') {
    event.preventDefault();
  }
}

  //Funciones para password
  showPassword()
  {
    if(this.inputType_1 == 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar()
  {
    if(this.inputType_2 == 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  //Función para detectar el cambio de fecha
  public changeFecha(event :any){
    console.log(event);
    console.log(event.value.toISOString());

    this.maestro.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.maestro.fecha_nacimiento);
  }

  // Funciones para los checkbox
  public checkboxChange(event:any){
    console.log("Evento: ", event);
    if(event.checked){
      this.maestro.materias_json.push(event.source.value)
    }else{
      console.log(event.source.value);
      this.maestro.materias_json.forEach((materia, i) => {
        if(materia == event.source.value){
          this.maestro.materias_json.splice(i,1)
        }
      });
    }
    console.log("Array materias: ", this.maestro);
  }

  public validarEstructuraRFC(event: KeyboardEvent) {
  const inputChar = event.key.toUpperCase();
  const currentValue = (this.maestro.rfc || "").toUpperCase();
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

  public revisarSeleccion(nombre: string){
    if(this.maestro.materias_json){
      var busqueda = this.maestro.materias_json.find((element)=>element==nombre);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }
    // Se mantiene la función original soloLetras por si la usas en otros campos.
  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) && // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32 // Espacio
    ) {
      event.preventDefault();
    }
  }

}
