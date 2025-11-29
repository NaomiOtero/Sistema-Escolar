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

  constructor(
    private http: HttpClient,
    private ValidatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  //Esquema base del formulario de evento
  public esquemaEvento() {
    return {
      'name_event': '',
      'tipo_evento': '',
      'fecha': '',
      'hora_inicio': '',
      'hora_final': '',
      'lugar': '',
      'objetivo_json': [],
      'programa_educativo': '',
      'responsable_evento': '',
      'descripcion': '',
      'Asistentes': ''
    };
  }

  //Validación de los campos del formulario
  public validarEvento(data: any, editar: boolean) {
    console.log('Validando evento...', data);
    let error: any = {};

    // Validar campos obligatorios
    if (!this.ValidatorService.required(data['name_event'])) {
      error['name_event'] = this.errorService.required;
    }

    if (!this.ValidatorService.required(data['tipo_evento'])) {
      error['tipo_evento'] = this.errorService.required;
    }

    if (!this.ValidatorService.required(data['fecha'])) {
      error['fecha'] = this.errorService.required;
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

    if(!this.ValidatorService.required(data["objetivo_json"])){
      error["objetivo_json"] = "Debes seleccionar objetivos para poder registrar el evento";
    }

    if (!this.ValidatorService.required(data['programa_educativo'])) {
      error['programa_educativo'] = this.errorService.required;
    }

    if (!this.ValidatorService.required(data['responsable_evento'])) {
      error['responsable_evento'] = this.errorService.required;
    }

    if (!this.ValidatorService.required(data['descripcion'])) {
      error['descripcion'] = this.errorService.required;
    }
    if (!this.ValidatorService.required(data['Asistentes'])) {
      error['Asistentes'] = this.errorService.required;
    }

    return error;
  }


  //peticiones HTTP
  public registrarEvento(data: any): Observable<any> {
    // Verificamos si existe el token de sesión
        const token = this.facadeService.getSessionToken();
        let headers: HttpHeaders;
        if (token) {
          headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        } else {
          headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        }
        return this.http.post<any>(`${environment.url_api}/eventos/`,data, { headers });
      }
    //Servicio para obtener la lista de maestros
  public obtenerListaEventos(): Observable<any>{
    // Verificamos si existe el token de sesión
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/lista-eventos/`, { headers });
  }

  public actualizarEvento(data: any): Observable<any>{
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");

    }
    return this.http.put<any>(`${environment.url_api}/eventos/?id`, data, { headers });
  }

  // Petición para obtener un maestro por su ID
  public obtenerEventoPorID(idEvento : number): Observable<any>{
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.get<any>(`${environment.url_api}/eventos/?id=${idEvento}`, { headers });
  }

   //Eliminar maestro
  //Servicio para eliminar un maestro
  public eliminarEvento(idEvento: number): Observable<any>{
    // Verificamos si existe el token de sesión
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.delete<any>(`${environment.url_api}/eventos/?id=${idEvento}`, { headers });
  }


}
