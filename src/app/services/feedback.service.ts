import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { FeedbackData } from '../models/feedback-data.model';

export interface FeedbackResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private readonly apiUrl = '/api/trigger-webhook';

  constructor(private http: HttpClient) {}

  submitFeedback(feedbackData: FeedbackData): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Use the class's toJSON method to get the correct format
    const payload = feedbackData.toJSON();

    return this.http.post<any>(this.apiUrl, payload, { headers })
      .pipe(
        catchError(error => {
          console.error('Feedback submission failed:', error);
          
          // Return a graceful fallback response
          return of({
            success: false,
            message: 'Unable to submit feedback at this time. Please try again later.',
            error: error.message
          });
        })
      );
  }
}
