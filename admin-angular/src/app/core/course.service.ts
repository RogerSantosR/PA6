import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Course } from './models';

export type CoursePayload = Omit<Course, '_id' | 'createdAt' | 'category'> & { category: string };

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly api = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  list(search = ''): Observable<Course[]> {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.http.get<Course[]>(`${this.api}${q}`);
  }

  get(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.api}/${id}`);
  }

  create(payload: CoursePayload): Observable<Course> {
    return this.http.post<Course>(this.api, payload);
  }

  update(id: string, payload: CoursePayload): Observable<Course> {
    return this.http.put<Course>(`${this.api}/${id}`, payload);
  }

  remove(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}
