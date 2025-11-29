import { Component, OnInit, ViewChild } from '@angular/core';
import { FacadeService } from 'src/app/services/facade.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EventosService } from 'src/app/services/eventos.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-eventos-screen',
  templateUrl: './eventos-screen.component.html',
  styleUrls: ['./eventos-screen.component.scss']
})

export class EventosScreenComponent implements OnInit {
 public name_user:string = "";
  lista_eventos: any[] = [];

  displayedColumns: string[] = [
    'nombre_evento',
    'fecha',
    'lugar',
    'responsable',
    'editar',
    'eliminar'
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  rol: string;

  ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  }

  constructor(
    public facadeService: FacadeService,
    private eventosService: EventosService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

  }

  aplicarFiltro(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  nuevoEvento() {
    // Lógica para agregar un nuevo evento
  this.router.navigate(['/administrador/nuevo-evento']);

  }

  editarEvento(id: number) {}

  eliminarEvento(id: number) {}
}
