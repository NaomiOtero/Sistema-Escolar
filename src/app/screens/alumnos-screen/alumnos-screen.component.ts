import { Component, OnInit, ViewChild } from '@angular/core';
import { FacadeService } from '../../services/facade.service';
import { AlumnosService } from '../../services/alumnos.service';
import { Router } from '@angular/router';
import { DatosUsuario } from '../maestros-screen/maestros-screen.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss']
})
export class AlumnosScreenComponent implements OnInit {

  public name_user: string = "";
  public lista_alumnos: any[] = [];
  public rol: string = "";
  public dialog: MatDialog;

  //Para la tabla
  displayedColumns: string[] = ['matricula','nombre','email','rfc', 'ocupacion', 'editar', 'eliminar'];
  dataSource = new  MatTableDataSource<DatosUsuario>(this.lista_alumnos as DatosUsuario[]);

    @ViewChild(MatSort, { static: false }) sort!: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

      ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

  constructor(
    public FacadeService : FacadeService,
    private AlumnosService: AlumnosService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.name_user = this.FacadeService.getUserCompleteName();
    // Obtenemos los alumnos
    this.obtenerAlumnos();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
    const dataStr =
    `${data.matricula} ${data.user.first_name} ${data.user.last_name}`
      .toLowerCase();

    return dataStr.includes(filter);
};
  }

public obtenerAlumnos() {
    this.AlumnosService.obtenerListaAlumnos().subscribe(
      (response) => {
        this.lista_alumnos = response;
        console.log("Lista users: ", this.lista_alumnos);
        if (this.lista_alumnos.length > 0) {
          //Agregar datos del nombre e email
          this.lista_alumnos.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });
          console.log("Alumnos: ", this.lista_alumnos);

          this.dataSource = new MatTableDataSource<DatosUsuario>(this.lista_alumnos as DatosUsuario[]);

          // Reasignar el accessor al recrear dataSource
          this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
            if (sortHeaderId === 'nombre') {
              const fn = (data.first_name || '').toString().trim().toLowerCase();
              const ln = (data.last_name || '').toString().trim().toLowerCase();
              return `${fn} ${ln}`;
            }
            const value = (data as any)[sortHeaderId];
            return (typeof value === 'string') ? value.toLowerCase() : value;
          };
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        }
      }, (error) => {
        console.error("Error al obtener la lista de maestros: ", error);
        alert("No se pudo obtener la lista de maestros");
      }
    );
  }

applicarFiltro(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

  public goEditar(idUser: number){
    this.router.navigate(["registro-usuarios/alumno/"+idUser]);
}

public delete(idUser: number){
        // Administrador puede eliminar cualquier maestro
        // Maestro solo puede eliminar su propio registro
        const userId = Number(this.FacadeService.getUserId());
        console.log("Rol actual:", this.rol);
        console.log("ID del usuario loggeado:", userId);
        console.log("ID del alumno a eliminar:", idUser);

        if (this.rol === 'administrador' || (this.rol === 'maestro' && userId === idUser)) {
          //Si es administrador o es maestro, es decir, cumple la condición, se puede eliminar
          const dialogRef = this.dialog.open(EliminarUserModalComponent,{
            data: {id: idUser, rol: 'alumno'}, //Se pasan valores a través del componente
            height: '288px',
            width: '328px',
          });

        dialogRef.afterClosed().subscribe(result => {
          if(result.isDelete){
            console.log("Alumno eliminado");
            alert("Alumno eliminado correctamente.");
            //Recargar página
            window.location.reload();
          }else{
            alert("Alumno no se ha podido eliminar.");
            console.log("No se eliminó el alumno");
          }
        });
        }else{
          alert("No tienes permisos para eliminar este alumno.");
        }
      }

  }
