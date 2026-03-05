import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

export interface CurrentWeather {
  city:        string;
  country:     string;
  temperature: number;
  feelsLike:   number;
  tempMin:     number;
  tempMax:     number;
  humidity:    number;
  pressure:    number;
  windSpeed:   number;
  windDeg:     number;
  visibility:  number;
  condition:   string;
  description: string;
  icon:        string;
  sunrise:     number;
  sunset:      number;
  timezone:    number;
  coords:      { lat: number; lon: number };
}

export interface ForecastDay {
  date:        string;
  tempMin:     number;
  tempMax:     number;
  temperature: number;
  humidity:    number;
  condition:   string;
  description: string;
  icon:        string;
  windSpeed:   number;
}

export interface ForecastResponse {
  city:     string;
  country:  string;
  forecast: ForecastDay[];
}

export interface CityResult {
  name:    string;
  country: string;
  state:   string | null;
  lat:     number;
  lon:     number;
  label:   string;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private apiUrl = `${environment.apiUrl}/weather`;

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<CurrentWeather> {
    const params = new HttpParams().set('city', city);
    return this.http.get<CurrentWeather>(`${this.apiUrl}/current`, { params });
  }

  getCurrentWeatherByCoords(lat: number, lon: number): Observable<CurrentWeather> {
    const params = new HttpParams().set('lat', lat.toString()).set('lon', lon.toString());
    return this.http.get<CurrentWeather>(`${this.apiUrl}/current`, { params });
  }

  getForecast(city: string): Observable<ForecastResponse> {
    const params = new HttpParams().set('city', city);
    return this.http.get<ForecastResponse>(`${this.apiUrl}/forecast`, { params });
  }

  getForecastByCoords(lat: number, lon: number): Observable<ForecastResponse> {
    const params = new HttpParams().set('lat', lat.toString()).set('lon', lon.toString());
    return this.http.get<ForecastResponse>(`${this.apiUrl}/forecast`, { params });
  }

  searchCities(q: string): Observable<CityResult[]> {
    const params = new HttpParams().set('q', q);
    return this.http.get<CityResult[]>(`${this.apiUrl}/search`, { params });
  }
}