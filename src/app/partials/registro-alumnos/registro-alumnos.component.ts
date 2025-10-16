import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { AlumnosService } from 'src/app/services/alumnos.service';

@Component({
  selector: 'app-registro-alumnos',
  templateUrl: './registro-alumnos.component.html',
  styleUrls: ['./registro-alumnos.component.scss']
})
export class RegistroAlumnosComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: any = {};

 public alumno:any = {};
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
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private alumnosService: AlumnosService,
    private facadeService: FacadeService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.alumno = this.alumnosService.esquemaAlumnos();
    this.alumno.rol = this.rol;

    console.log("Datos alumno: ", this.alumno);
  }

  public regresar(){
    this.location.back();
  }

  public registrar(){
    // Lógica para registrar un nuevo alumno
    this.errors = this.alumnosService.validarEstudiante(this.alumno, false);

    if (Object.keys(this.errors).length === 0) {
      this.alumnosService.registrarEstudiante(this.alumno).subscribe({
        next: (res) => {
          console.log("Estudiante registrado:", res);
          // Aquí puedes manejar la respuesta del servidor, como mostrar un mensaje de éxito o redirigir al usuario
        },
        error: (err) => {
          console.error("Error al registrar el estudiante:", err);
      alert("Error al registrar el estudiante. Por favor, intenta de nuevo.");
    }
  });
}else{
  console.log("Errores en el formulario:", this.errors);
}
}

  public actualizar(){
    // Lógica para actualizar los datos de un alumno existente
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

    this.alumno.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.alumno.fecha_nacimiento);
  }

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

}
