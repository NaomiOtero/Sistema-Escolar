import { Component, OnInit, ViewChild } from '@angular/core';
import { FacadeService } from 'src/app/services/facade.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EventosService } from 'src/app/services/eventos.service';
import { MatDialog } from '@angular/material/dialog';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { EditarEventoModalComponent } from 'src/app/modals/editar-evento-modal/editar-evento-modal.component';

@Component({
  selector: 'app-eventos-screen',
  templateUrl: './eventos-screen.component.html',
  styleUrls: ['./eventos-screen.component.scss']
})
export class EventosScreenComponent implements OnInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  lista_eventos: DatosEventos[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<DatosEventos>(this.lista_eventos as DatosEventos[]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    public facadeService: FacadeService,
    private eventosService: EventosService,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if (this.token == "") {
      this.router.navigate(["/"]);
    }

    this.rol = this.facadeService.getUserGroup();

          if (this.rol === 'administrador') {
            this.displayedColumns = [
              'name_event',
              'tipo_evento',
              'fecha',
              'hora_inicio',
              'hora_final',
              'lugar',
              'responsable_evento',
              'programa_educativo',
              'Asistentes',
              'objetivo_json',
              'descripcion',
              'editar',
              'eliminar'
            ];
      } else {
        this.displayedColumns = [
              'name_event',
              'tipo_evento',
              'fecha',
              'hora_inicio',
              'hora_final',
              'lugar',
              'responsable_evento',
              'programa_educativo',
              'Asistentes',
              'objetivo_json',
              'descripcion',
        ];

  }

    //Obtener eventos

    this.obtenerEventos();

    // Filtro de búsqueda
    this.dataSource.filterPredicate = (data, filter) => {
      const dataStr = `${data.name_event} ${data.tipo_evento} ${data.responsable_evento}`
        .toLowerCase();
      return dataStr.includes(filter);
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  obtenerEventos() {
    this.eventosService.obtenerListaEventos().subscribe(
      (response) => {
        this.lista_eventos = response.filter(e => this.puedeVerEvento(e));
        console.log("Eventos obtenidos:", this.lista_eventos);

        this.dataSource = new MatTableDataSource(this.lista_eventos);

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      },
      (error) => {
        console.error("Error al obtener eventos:", error);
        alert("No se pudo obtener la lista de eventos");
      }
    );
  }

   // Role helpers
  isAdmin(): boolean {
    return this.rol === 'administrador';
  }
  isTeacher(): boolean {
    return this.rol === 'maestro';
  }
  isStudent(): boolean {
    return this.rol === 'alumno';
  }

  puedeVerEvento(evento: any): boolean {

  if (this.isAdmin()) return true;

  if (this.isTeacher()) {
    return this.canSeeEventoTeacher(evento);
  }

  if (this.isStudent()) {
    return this.canSeeEventoStudent(evento);
  }

  return false;
}

  aplicarFiltro(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  nuevoEvento() {
    const userRol = this.rol?.toLowerCase();

  if (userRol !== 'administrador') {
    alert("No tienes permisos para editar eventos.");
    return;
  }
  this.router.navigate(['/nuevo-evento']);
}


public editarEvento(idEvento: number) {
  const userRol = this.rol?.toLowerCase();

  if (userRol !== 'administrador') {
    alert("No tienes permisos para editar eventos.");
    return;
  }

  // Abrir modal de advertencia
  const dialogRef = this.dialog.open(EditarEventoModalComponent, {
    data: { id: idEvento },
    width: '330px',
    height: '270px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result?.confirmar) {
      this.router.navigate(['/nuevo-evento', idEvento]);
    }
  });
}

  public eliminarEvento(id: number) {
    const userRol = this.rol?.toLowerCase();
    if(userRol !== 'administrador') {
      alert("No tienes permisos para eliminar eventos.");
      return;
    }

    // Abrir modal de confirmación
    const dialogRef = this.dialog.open(EliminarUserModalComponent, {
      data: { id: id, rol: 'evento' },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isDelete) {
        alert("Evento eliminado correctamente.");
        this.obtenerEventos();
      } else {
        alert("No se eliminó el evento.");
      }
    });
  }
  canSeeEventoTeacher(evento: any): boolean {
  return evento.objetivo_json.includes("Profesores") ||
         evento.objetivo_json.includes("Publico General");
}
  canSeeEventoStudent(evento: any): boolean {
  return evento.objetivo_json.includes("Estudiantes") ||
         evento.objetivo_json.includes("Publico General");
}

}

//esto vas fuera del componente
export interface DatosEventos {
  id: number;
  name_event: string;
  tipo_evento: string;
  fecha: string;
  hora_inicio: string;
  hora_final: string;
  lugar: string;
  responsable_evento: string;
  programa_educativo: string;
  Asistentes: string;
  objetivo_json: string;
  descripcion: string;
}
