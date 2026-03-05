import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WeatherRoutingModule } from './weather-routing.module';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { WeatherHomeComponent } from './weather-home/weather-home.component';
import { WeatherCardComponent } from './weather-card/weather-card.component';
import { ForecastCardComponent } from './forecast-card/forecast-card.component';

@NgModule({
  declarations: [
    WeatherHomeComponent,
    WeatherCardComponent,
    ForecastCardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WeatherRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
  ]
})
export class WeatherModule { }