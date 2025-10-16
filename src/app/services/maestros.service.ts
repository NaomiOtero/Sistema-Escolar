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
export class MaestrosService{

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
  ) { }

  public esquemaMaestro(){
    return {
      'rol': '',
      'id_maestro': '',
      'first_name': '',
      'last_name': '',
      'email': '',
      'password': '',
      'fecha_nacimiento': '',
      'telefono': '',
      'rfc': '',
      'cubiculo': '',
      'area_investigacion': '',
      'materias_json': []
    };
  }

  public validarMaestro(data: any, editar: boolean){
    console.log('Validando maestro...', data);
    let error: any = {};

    if(!this.validatorService.required(data["id_maestro"])){
      error["id_maestro"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["first_name"])){
      error["first_name"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["last_name"])){
      error["last_name"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["email"])){
      error["email"] = this.errorService.required;
    }else if(!this.validatorService.email(data["email"])){
      error["email"] = this.errorService.email;
    }

    if(!editar){
      if(!this.validatorService.required(data["password"])){
        error["password"] = this.errorService.required;
      }

      if(!this.validatorService.required(data["confirmar_password"])){
        error["confirmar_password"] = this.errorService.required;
      }
    }

    if (!this.validatorService.required(data['rfc'])) {
      error['rfc'] = this.errorService.required;
    } else if (!this.validatorService.min(data['rfc'], 12)) {
      error['rfc'] = this.errorService.min(12);
      alert('La longitud del RFC es menor, deben ser 12 caracteres.');
    } else if (!this.validatorService.max(data['rfc'], 13)) {
      error['rfc'] = this.errorService.max(13);
      alert('La longitud del RFC es mayor, deben ser 13 caracteres.');
    }
    if(!this.validatorService.min(data["telefono"], 10)){
      error["telefono"] = this.errorService.min(10);
      alert("La longitud del teléfono es menor, deben ser 10 caracteres.");
    }else if(!this.validatorService.max(data["telefono"], 10)){
      error["telefono"] = this.errorService.max(10);
      alert("La longitud del teléfono es mayor, deben ser 10 caracteres.");
    }
    if(!this.validatorService.required(data["telefono"])){
      error["telefono"] = this.errorService.required;
    }


    if(!this.validatorService.required(data["cubiculo"])){
      error["cubiculo"] = this.errorService.required;
    }

    if (!data.area_investigacion || data.area_investigacion === '') {
      error.area_investigacion = "Debes seleccionar un área de investigación.";
    }

    if (!data.materias_json || data.materias_json.length === 0) {
      error.materias_json = "Debes seleccionar al menos una materia.";
    }

    return error;
  }
  //REGISTRAR MAESTRO
  public registrarMaestro(data: any) {
    console.log("URL de registro:", `${this.facadeService.apiUrl}/maestro/`);
    console.log("Datos enviados:", data);
    return this.http.post(`${this.facadeService.apiUrl}/maestro/`, data, this.httpOptions);
}
}
