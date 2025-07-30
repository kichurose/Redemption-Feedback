import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { FeedbackService } from '../services/feedback.service';
import { FeedbackData } from '../models/feedback-data.model';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatbotComponent],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent implements OnInit {
  @Input() userEmail: string = '';
  @Output() feedbackSubmitted = new EventEmitter<void>();
  @Output() skipFeedback = new EventEmitter<void>();

  name: string = '';
  email: string = '';
  rating: number = 0;
  feedback: string = '';
  isSubmitting: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' | '' = '';
  showChatbot: boolean = false;

  stars: number[] = [1, 2, 3, 4, 5];

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit() {
    this.email = this.userEmail;
  }

  setRating(rating: number) {
    this.rating = rating;
  }

  getEmojiForRating(star: number): string {
    if (star <= this.rating) {
      // Show filled emojis based on rating level
      switch (star) {
        case 1: return '😢'; // Very sad for 1 star
        case 2: return '😕'; // Sad for 2 stars
        case 3: return '😐'; // Neutral for 3 stars
        case 4: return '😊'; // Happy for 4 stars
        case 5: return '🤩'; // Extremely happy for 5 stars
        default: return '⭐';
      }
    } else {
      switch (star) {
        case 1: return '😢'; // Very sad for 1 star
        case 2: return '😕'; // Sad for 2 stars
        case 3: return '😐'; // Neutral for 3 stars
        case 4: return '😊'; // Happy for 4 stars
        case 5: return '🤩'; // Extremely happy for 5 stars
        default: return '⭐';
      }
    }
  }

  onSubmitFeedback() {
    // Validate required fields
    if (!this.name.trim()) {
      this.showMessage('Please enter your name.', 'error');
      return;
    }
    
    if (!this.email.trim()) {
      this.showMessage('Please enter your email.', 'error');
      return;
    }
    
    if (this.rating === 0) {
      this.showMessage('Please provide a rating before submitting.', 'error');
      return;
    }

    if (!this.feedback.trim()) {
      this.showMessage('Please enter your feedback.', 'error');
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    const feedbackData = new FeedbackData(
      this.name,
      this.rating,
      this.feedback,
      this.email
    );

    // Validate using the class method
    if (!feedbackData.isValid()) {
      this.showMessage('Please fill in all required fields correctly.', 'error');
      this.isSubmitting = false;
      return;
    }

    this.feedbackService.submitFeedback(feedbackData).subscribe({
      next: (response) => {
        console.log('Feedback response:', response);
        this.showMessage('Thank you for your feedback!', 'success');
        this.isSubmitting = false;
        
        // Emit feedback submitted event after 2 seconds
        setTimeout(() => {
          this.feedbackSubmitted.emit();
        }, 2000);
      },
      error: (error) => {
        console.error('Feedback submission error:', error);
        this.showMessage('Unable to submit feedback. Please try again later.', 'error');
        this.isSubmitting = false;
      }
    });
  }

  onSkip() {
    this.skipFeedback.emit();
  }

  openChatbot() {
    this.showChatbot = true;
  }

  closeChatbot() {
    this.showChatbot = false;
  }

  private showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 3000);
  }
}
