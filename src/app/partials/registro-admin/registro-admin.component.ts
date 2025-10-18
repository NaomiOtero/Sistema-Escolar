import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { AdministradoresService } from 'src/app/services/administradores.service';

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.component.html',
  styleUrls: ['./registro-admin.component.scss']
})
export class RegistroAdminComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: any = {};

  public admin:any = {};
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
    private administradoresService: AdministradoresService,
    private facadeService: FacadeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.admin = this.administradoresService.esquemaAdmin();
    // Rol del usuario
    this.admin.rol = this.rol;

    console.log("Datos admin: ", this.admin);

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

  public registrar() {
  this.errors = this.administradoresService.validarAdmin(this.admin, false);

  if (Object.keys(this.errors).length === 0) {
    this.administradoresService.registrarAdministrador(this.admin).subscribe({
      next: (res) => {
        console.log("Administrador registrado:", res);
        // Redirigir o mostrar mensaje
      },
      error: (err) => {
        console.error("Error al registrar:", err);
        alert("Error al registrar administrador");
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

  public validarEstructuraRFC(event: KeyboardEvent) {
  const inputChar = event.key.toUpperCase();
  const currentValue = (this.admin.rfc || "").toUpperCase();
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
}
