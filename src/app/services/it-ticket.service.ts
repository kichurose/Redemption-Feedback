import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface ITTicketData {
  title: string;
  description: string;
  customer: string;
  priority?: string;
  category?: string;
}

export interface ITTicketResponse {
  success: boolean;
  message: string;
  ticketId?: string;
  data?: any;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ITTicketService {
  private readonly apiUrl = '/api/create-it-ticket';

  constructor(private http: HttpClient) {}

  createTicket(ticketData: ITTicketData): Observable<ITTicketResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ITTicketResponse>(this.apiUrl, ticketData, { headers })
      .pipe(
        catchError(error => {
          console.error('IT ticket creation failed:', error);
          
          // Return a graceful fallback response
          return of({
            success: false,
            message: 'Unable to create IT ticket at this time. Please try again later.',
            error: error.message
          });
        })
      );
  }

  // Validation method
  validateTicketData(ticketData: ITTicketData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!ticketData.title || ticketData.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!ticketData.description || ticketData.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!ticketData.customer || ticketData.customer.trim().length === 0) {
      errors.push('Customer information is required');
    }

    if (ticketData.title && ticketData.title.length > 100) {
      errors.push('Title must be 100 characters or less');
    }

    if (ticketData.description && ticketData.description.length > 1000) {
      errors.push('Description must be 1000 characters or less');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
