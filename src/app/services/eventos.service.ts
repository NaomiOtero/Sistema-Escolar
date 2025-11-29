import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  //definición de httpOptions
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private httpClient: HttpClient,
    private ValidatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  //Esquema base del formulario de evento
  public esquemaEvento() {
    return {
      'rol': '',
      'titulo': '',
      'descripcion': '',
      'date_initial': '',
      'hora_inicio': '',
      'hora_final': '',
      'lugar': '',
      'publico_objetivo': '',
      'programa_educativo': '',
      'responsable_evento': ''
    };
  }

  //Validación de los campos del formulario
  public validarEvento(data: any, editar: boolean) {
    console.log('Validando evento...', data);
    let error: any = {};

    // Validar campos obligatorios
    if (!this.ValidatorService.required(data['titulo'])) {
      error['titulo'] = this.errorService.required;
    }

    if (!this.ValidatorService.required(data['descripcion'])) {
      error['descripcion'] = this.errorService.required;
    }

    if (!this.ValidatorService.required(data['date_initial'])) {
      error['date_initial'] = this.errorService.required;
    }

    if (!this.ValidatorService.required(data['hora_inicio'])) {
      error['hora_inicio'] = this.errorService.required;
    }

    if (!this.ValidatorService.required(data['hora_final'])) {
      error['hora_final'] = this.errorService.required;
    }

    if (!this.ValidatorService.required(data['lugar'])) {
      error['lugar'] = this.errorService.required;
    }

    if (!this.ValidatorService.required(data['publico_objetivo'])) {
      error['publico_objetivo'] = this.errorService.required;
    }

    if (!this.ValidatorService.required(data['programa_educativo'])) {
      error['programa_educativo'] = this.errorService.required;
    }

    if (!this.ValidatorService.required(data['responsable_evento'])) {
      error['responsable_evento'] = this.errorService.required;
    }

    return error;
  }

  public registrarEvento(data: any): Observable<any> {
    // Verificamos si existe el token de sesión
        const token = this.facadeService.getSessionToken();
        let headers: HttpHeaders;
        if (token) {
          headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        } else {
          headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        }
        return this.httpClient.post<any>(`${environment.url_api}/eventos/`,data, { headers });
      }
}
