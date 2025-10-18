import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AdministradoresService {

  // Definición de httpOptions
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) {}

  // Esquema base del formulario de administrador
  public esquemaAdmin() {
    return {
      'rol': '',
      'clave_admin': '',
      'first_name': '',
      'last_name': '',
      'email': '',
      'password': '',
      'confirmar_password': '',
      'telefono': '',
      'rfc': '',
      'edad': '',
      'ocupacion': ''
    };
  }

  //Validación de los campos del formulario
  public validarAdmin(data: any, editar: boolean) {
    console.log('Validando admin...', data);
    let error: any = {};

    // Validar campos obligatorios
    if (!this.validatorService.required(data['clave_admin'])) {
      error['clave_admin'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['first_name'])) {
      error['first_name'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['last_name'])) {
      error['last_name'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['email'])) {
      error['email'] = this.errorService.required;
    } else if (!this.validatorService.max(data['email'], 40)) {
      error['email'] = this.errorService.max(40);
    } else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    // Validar contraseñas solo si NO estamos editando
    if (!editar) {
      if (!this.validatorService.required(data['password'])) {
        error['password'] = this.errorService.required;
      }

      if (!this.validatorService.required(data['confirmar_password'])) {
        error['confirmar_password'] = this.errorService.required;
      }
    }

    // Validar RFC
    if (!this.validatorService.required(data['rfc'])) {
      error['rfc'] = this.errorService.required;
    } else if (!this.validatorService.min(data['rfc'], 12)) {
      error['rfc'] = this.errorService.min(12);
      alert('La longitud del RFC es menor, deben ser 12 caracteres.');
    } else if (!this.validatorService.max(data['rfc'], 13)) {
      error['rfc'] = this.errorService.max(13);
      alert('La longitud del RFC es mayor, deben ser 13 caracteres.');
    }

    // Validar edad
    if (!this.validatorService.required(data['edad'])) {
      error['edad'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data['edad'])) {
      alert('El formato de la edad debe ser solo números.');
    } else if (data['edad'] < 18) {
      error['edad'] = 'La edad debe ser mayor o igual a 18.';
    }

    // Validar teléfono
    if (!this.validatorService.required(data['telefono'])) {
      error['telefono'] = this.errorService.required;
    }

    // Validar ocupación
    if (!this.validatorService.required(data['ocupacion'])) {
      error['ocupacion'] = this.errorService.required;
    }

    // Devolver errores
    return error;
  }

  //Método para enviar los datos al backend (crear administrador)s
public registrarAdministrador(data: any) {
  console.log("URL de registro:", `${this.facadeService.apiUrl}/admin/`);
  console.log("Datos enviados:", data);
  return this.http.post(`${this.facadeService.apiUrl}/admin/`, data, this.httpOptions);
}


}
