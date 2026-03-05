import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WeatherService, CurrentWeather, ForecastDay, CityResult } from '../../../core/services/weather.service';

@Component({
  selector: 'app-weather-home',
  templateUrl: './weather-home.component.html',
  styleUrls: ['./weather-home.component.css']
})
export class WeatherHomeComponent implements OnInit, OnDestroy {
  current:      CurrentWeather | null = null;
  forecast:     ForecastDay[]         = [];
  suggestions:  CityResult[]          = [];
  searchControl = new FormControl('');
  loading       = false;
  loadingGeo    = false;
  showSuggestions = false;
  private destroy$ = new Subject<void>();

  constructor(
    private weatherService: WeatherService,
    private snackBar:       MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(val => {
      if (val && val.trim().length >= 2) {
        this.searchCities(val.trim());
      } else {
        this.suggestions = [];
        this.showSuggestions = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Búsqueda ──────────────────────────────────────────────────────────────
  searchCities(q: string): void {
    this.weatherService.searchCities(q).subscribe({
      next: (cities) => {
        this.suggestions     = cities;
        this.showSuggestions = cities.length > 0;
      },
      error: () => {}
    });
  }

  selectCity(city: CityResult): void {
    this.searchControl.setValue(city.label, { emitEvent: false });
    this.suggestions     = [];
    this.showSuggestions = false;
    this.loadWeather(city.name);
  }

  onSearch(): void {
    const val = this.searchControl.value?.trim();
    if (!val) return;
    this.suggestions     = [];
    this.showSuggestions = false;
    this.loadWeather(val);
  }

  onEnter(): void { this.onSearch(); }

  hideSuggestions(): void {
    setTimeout(() => { this.showSuggestions = false; }, 200);
  }

  // ── Cargar clima ──────────────────────────────────────────────────────────
  loadWeather(city: string): void {
    this.loading = true;
    this.current = null;
    this.forecast = [];

    this.weatherService.getCurrentWeather(city).subscribe({
      next: (data) => {
        this.current = data;
        this.loadForecast(city);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Ciudad no encontrada';
        this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
      }
    });
  }

  loadForecast(city: string): void {
    this.weatherService.getForecast(city).subscribe({
      next: (data) => {
        this.forecast = data.forecast;
        this.loading  = false;
      },
      error: () => { this.loading = false; }
    });
  }

  // ── Geolocalización ───────────────────────────────────────────────────────
  useMyLocation(): void {
    if (!navigator.geolocation) {
      this.snackBar.open('Geolocalización no disponible', 'Cerrar', { duration: 3000 });
      return;
    }
    this.loadingGeo = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        this.loadingGeo = false;
        this.loading    = true;
        this.current    = null;
        this.forecast   = [];

        this.weatherService.getCurrentWeatherByCoords(lat, lon).subscribe({
          next: (data) => {
            this.current = data;
            this.searchControl.setValue(data.city, { emitEvent: false });
            this.weatherService.getForecastByCoords(lat, lon).subscribe({
              next: (f) => { this.forecast = f.forecast; this.loading = false; },
              error: ()  => { this.loading = false; }
            });
          },
          error: () => {
            this.loading    = false;
            this.loadingGeo = false;
            this.snackBar.open('Error al obtener el clima', 'Cerrar', { duration: 3000 });
          }
        });
      },
      () => {
        this.loadingGeo = false;
        this.snackBar.open('Permiso de ubicación denegado', 'Cerrar', { duration: 3000 });
      }
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  get backgroundClass(): string {
    if (!this.current) return 'bg-default';
    const condition = this.current.condition.toLowerCase();
    const icon      = this.current.icon;
    const isNight   = icon.includes('n');

    if (isNight)                        return 'bg-night';
    if (condition.includes('thunder'))  return 'bg-thunder';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'bg-rain';
    if (condition.includes('snow'))     return 'bg-snow';
    if (condition.includes('cloud'))    return 'bg-cloudy';
    if (condition.includes('mist') || condition.includes('fog'))     return 'bg-mist';
    return 'bg-sunny';
  }

  formatTime(unix: number, timezone: number): string {
    const date = new Date((unix + timezone) * 1000);
    const h    = date.getUTCHours().toString().padStart(2, '0');
    const m    = date.getUTCMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  formatDay(dateStr: string): string {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' });
  }

  iconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  windDirection(deg: number): string {
    const dirs = ['N','NE','E','SE','S','SO','O','NO'];
    return dirs[Math.round(deg / 45) % 8];
  }
}