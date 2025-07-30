import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatbotComponent],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  @Output() feedbackSubmitted = new EventEmitter<void>();
  @Output() skipFeedback = new EventEmitter<void>();

  rating: number = 0;
  feedback: string = '';
  isSubmitting: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' | '' = '';
  showChatbot: boolean = false;

  stars: number[] = [1, 2, 3, 4, 5];

  setRating(rating: number) {
    this.rating = rating;
  }

  onSubmitFeedback() {
    if (this.rating === 0) {
      this.showMessage('Please provide a rating before submitting.', 'error');
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    // Simulate API call
    setTimeout(() => {
      this.showMessage('Thank you for your feedback!', 'success');
      this.isSubmitting = false;
      
      // Emit feedback submitted event after 2 seconds
      setTimeout(() => {
        this.feedbackSubmitted.emit();
      }, 2000);
    }, 1500);
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
    
    // Clear message after 3 seconds
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 3000);
  }
}
