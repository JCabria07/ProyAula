import { Component, OnInit } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';
import { CategoriasService } from 'src/app/services/categorias';

@Component({
  selector: 'app-donutschart',
  templateUrl: './donutschart.component.html',
  styleUrls: ['./donutschart.component.scss'],
  standalone: false
})
export class DonutschartComponent implements OnInit {
  // Inicializamos chartOptions con un objeto válido
  public chartOptions: AgChartOptions = {
    data: [],
    series: []
  };

  // Inyectamos el servicio de categorías
  constructor(private categoriasService: CategoriasService) {}

  ngOnInit(): void {
    // Nos suscribimos al observable que trae las categorías
    this.categoriasService.getCategorias().subscribe(data => {
      // Configuración del gráfico con los datos de la colección
      this.chartOptions = {
        background: {
          fill: '#dcdcdc'
        },
        data,
        title: {
          text: 'Categorías creadas',
          color: '#212529'
        },
        series: [
          {
            type: 'donut',
            calloutLabelKey: 'asset',
            angleKey: 'amount',
            fills: [
              '#74c0fc',
              '#ffd43b',
              '#69db7c',
              '#ff8787',
              '#b197fc'
            ],
            strokes: ['#dcdcdc']
          }
        ]
      };
    });
  }
}