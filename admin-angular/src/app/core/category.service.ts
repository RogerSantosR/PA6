import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from './models';

export type CategoryPayload = { name: string; description?: string };

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly api = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  list(): Observable<Category[]> {
    return this.http.get<Category[]>(this.api);
  }

  create(payload: CategoryPayload): Observable<Category> {
    return this.http.post<Category>(this.api, payload);
  }

  update(id: string, payload: CategoryPayload): Observable<Category> {
    return this.http.put<Category>(`${this.api}/${id}`, payload);
  }

  remove(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}
