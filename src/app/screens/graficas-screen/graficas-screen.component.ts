import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { EventosService } from 'src/app/services/eventos.service';
import { AdministradoresService } from 'src/app/services/administradores.service';


@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit {

  public total_user: any = {};
  public total_eventos: any = {};

  lineChartData = {
    labels: ["Estudiantes", "Profesores", "Público General"],
    datasets: [
      {
        data:[0, 0, 0],
        label: 'Eventos Académicos',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB',
        ]
      }
    ]
  };

  lineChartOption = { responsive:false };
  lineChartPlugins = [ DatalabelsPlugin ];

  barChartData = {
    labels: ["Estudiantes", "Profesores", "Público General"],
    datasets: [
      {
        data:[0, 0, 0],
        label: 'Eventos Académicos',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB',
          '#FB82F5',
          '#2AD84A'
        ]
      }
    ]
  };

  barChartOption = { responsive:false };
  barChartPlugins = [ DatalabelsPlugin ];

  pieChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[0, 0, 0],
        backgroundColor: [
          '#FCFF44',
          '#F1C8F2',
          '#31E731'
        ]
      }
    ]
  };

  pieChartOption = { responsive:false };
  pieChartPlugins = [ DatalabelsPlugin ];

  doughnutChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[0, 0, 0],
        backgroundColor: ['#F88406','#FCFF44','#31E7E7']
      }
    ]
  };

  doughnutChartOption = { responsive:false };
  doughnutChartPlugins = [ DatalabelsPlugin ];


  constructor(
    private administradoresServices: AdministradoresService,
    private eventosService: EventosService) {}

  ngOnInit(): void {
    this.obtenerTotalUsers();
    this.obtenerTotalEventos();
  }

public obtenerTotalEventos() {
  this.eventosService.getTotalEventos().subscribe(
    (response: any) => {
      this.total_eventos = response;
      console.log("Eventos:", this.total_eventos);

      // Actualizar Line Chart
      this.lineChartData = {
        ...this.lineChartData, // copiar configuraciones existentes
        datasets: [
          {
            ...this.lineChartData.datasets[0],
            data: [
              response.estudiantes,
              response.profesores,
              response.publico
            ]
          }
        ]
      };

      // Actualizar Bar Chart
      this.barChartData = {
        ...this.barChartData,
        datasets: [
          {
            ...this.barChartData.datasets[0],
            data: [
              response.estudiantes,
              response.profesores,
              response.publico
            ]
          }
        ]
      };

    },
    error => console.log("Error al obtener eventos", error)
  );
}

 public obtenerTotalUsers() {
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response: any) => {

        this.total_user = response;
        console.log("Total usuarios: ", this.total_user);
        this.pieChartData.datasets[0].data = [
          response.admins,
          response.maestros,
          response.alumnos
        ];

        this.doughnutChartData.datasets[0].data = [
          response.admins,
          response.maestros,
          response.alumnos
        ];
      },
      error => {
        console.log("Error al obtener total de usuarios ", error);
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }

}
