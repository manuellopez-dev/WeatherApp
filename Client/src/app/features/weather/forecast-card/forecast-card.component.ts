import { Component, Input } from '@angular/core';
import { ForecastDay } from '../../../core/services/weather.service';

@Component({
  selector: 'app-forecast-card',
  templateUrl: './forecast-card.component.html',
  styleUrls: ['./forecast-card.component.css']
})
export class ForecastCardComponent {
  @Input() day!:       ForecastDay;
  @Input() formatDay!: (date: string) => string;
  @Input() iconUrl!:   (icon: string) => string;
}