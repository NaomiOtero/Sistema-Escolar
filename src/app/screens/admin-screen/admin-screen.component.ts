import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { FacadeService } from 'src/app/services/facade.service';
import { DatosUsuario } from '../maestros-screen/maestros-screen.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent implements OnInit {
  // Variables y métodos del componente
  public name_user:string = "";
  public lista_admins:any[]= [];

  //Para la tabla
displayedColumns: string[] = [
  'clave_admin',
  'nombre',
  'email',
  'rfc',
  'ocupacion',
  'editar',
  'eliminar'
];

  dataSource = new  MatTableDataSource<DatosUsuario>(this.lista_admins as DatosUsuario[]);

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  rol: string;

    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    public facadeService: FacadeService,
    private administradoresService: AdministradoresService,
    private router: Router,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    // Lógica de inicialización aquí
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    // Obtenemos los administradores
    this.obtenerAdmins();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
    const dataStr =
    `${data.clave_admin} ${data.user.first_name} ${data.user.last_name}`
      .toLowerCase();

    return dataStr.includes(filter);
    };
  }

  //Obtener lista de usuarios
   public obtenerAdmins() {
    this.administradoresService.obtenerListaAdmins().subscribe(
      (response) => {
        this.lista_admins = response;
        console.log("Lista users: ", this.lista_admins);
        if (this.lista_admins.length > 0) {
          //Agregar datos del nombre e email
          this.lista_admins.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });
          console.log("Admins: ", this.lista_admins);

          this.dataSource = new MatTableDataSource<DatosUsuario>(this.lista_admins as DatosUsuario[]);

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
    this.router.navigate(["registro-usuarios/administrador/"+idUser]);
  }

public delete(idUser: number) {
    // Administrador puede eliminar cualquier maestro
    // Maestro solo puede eliminar su propio registro
    const userId = Number(this.facadeService.getUserId());
    if (this.rol === 'administrador' || (this.rol === 'maestro' && userId === idUser)) {
      //Si es administrador o es maestro, es decir, cumple la condición, se puede eliminar
      const dialogRef = this.dialog.open(EliminarUserModalComponent,{
        data: {id: idUser, rol: 'administrador'}, //Se pasan valores a través del componente
        height: '288px',
        width: '328px',
      });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Administrador eliminado");
        alert("Administrador eliminado correctamente.");
        //Recargar página
        window.location.reload();
      }else{
        alert("Administrador no se ha podido eliminar.");
        console.log("No se eliminó el administrador");
      }
    });
    }else{
      alert("No tienes permisos para eliminar este administrador.");
    }
  }

}
