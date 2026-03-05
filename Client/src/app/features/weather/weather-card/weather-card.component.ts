import { Component, Input } from '@angular/core';
import { CurrentWeather } from '../../../core/services/weather.service';

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.css']
})
export class WeatherCardComponent {
  @Input() current!:        CurrentWeather;
  @Input() formatTime!:     (unix: number, tz: number) => string;
  @Input() iconUrl!:        (icon: string) => string;
  @Input() windDirection!:  (deg: number) => string;
}