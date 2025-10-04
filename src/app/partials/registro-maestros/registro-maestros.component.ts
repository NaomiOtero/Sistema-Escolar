import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registro-maestros',
  templateUrl: './registro-maestros.component.html',
  styleUrls: ['./registro-maestros.component.scss']
})
export class RegistroMaestrosComponent implements OnInit {
  @Input() rol: string = "";
  @Input() datos_user: any;

  public maestros:any = {};
  public errors:any = {};
  public editar:boolean = false;
  public token: string = "";
  public idUser: Number = 0;

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  constructor(
    private location: Location,
    public activatedRoute: ActivatedRoute,
    //private administradoresService: AdministradoresService,
    private facadeService: FacadeService,
    private router: Router
   ) { }

  ngOnInit(): void {
  }

//Funciones para password
  public showPassword()
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

  public showPwdConfirmar()
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

  public regresar(){
    this.location.back();
  }

  public registrar(){

    }

    public actualizar(){

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

    areasInvestigacion: string[] = [
    'Inteligencia Artificial',
    'Redes y Comunicaciones',
    'Sistemas Embebidos',
    'Seguridad Informática',
    'Bases de Datos'
  ];

  materias = [
    { nombre: 'Aplicaciones Web', seleccionada: false },
    { nombre: 'Programación 1', seleccionada: false },
    { nombre: 'Bases de datos', seleccionada: false },
    { nombre: 'Tecnologías Web', seleccionada: false },
    { nombre: 'Minería de datos', seleccionada: false },
    { nombre: 'Desarrollo móvil', seleccionada: false },
    { nombre: 'Estructuras de datos', seleccionada: false },
    { nombre: 'Administración de redes', seleccionada: false },
    { nombre: 'Ingeniería de Software', seleccionada: false },
    { nombre: 'Administración de S.O.', seleccionada: false }
  ];

   guardarMaterias() {
    const seleccionadas = this.materias
      .filter(m => m.seleccionada)
      .map(m => m.nombre);

    console.log('Materias seleccionadas:', seleccionadas);
  }
}
