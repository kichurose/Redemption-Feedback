import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackComponent } from '../feedback/feedback.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-redemption-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, FeedbackComponent, ChatbotComponent],
  templateUrl: './redemption-portal.component.html',
  styleUrl: './redemption-portal.component.scss'
})
export class RedemptionPortalComponent {
  email: string = '';
  claimCode: string = '';
  isSubmitting: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' | '' = '';
  showFeedback: boolean = false;
  redemptionComplete: boolean = false;
  showChatbot: boolean = false;
  userEmailForFeedback: string = '';

  onRedeem() {
    // Validate inputs
    if (!this.email || !this.claimCode) {
      this.showMessage('Please fill in both email and claim code.', 'error');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showMessage('Please enter a valid email address.', 'error');
      return;
    }

    // Validate claim code format (5 letters only)
    const claimCodeRegex = /^[a-zA-Z]{5}$/;
    if (!claimCodeRegex.test(this.claimCode)) {
      this.showMessage('Claim code must be exactly 5 letters only.', 'error');
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    // Simulate API call
    setTimeout(() => {
      // Mock redemption logic - replace with actual API call
      // Valid 5-letter claim codes for testing
      const validCodes = ['HAPPY', 'LUCKY', 'PRIZE', 'BONUS', 'PEACE'];
      if (validCodes.includes(this.claimCode.toUpperCase())) {
        this.showMessage('Redemption successful! Your reward has been processed.', 'success');
        this.redemptionComplete = true;
        
        // Store email for feedback form before resetting
        this.userEmailForFeedback = this.email;
        this.resetForm();
        
        // Show feedback form after a short delay
        setTimeout(() => {
          this.showFeedback = true;
        }, 2000);
      } else {
        this.showMessage('Invalid claim code. Please check and try again.', 'error');
      }
      this.isSubmitting = false;
    }, 2000);
  }

  private showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    
    // Clear message after 5 seconds
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 5000);
  }

  private resetForm() {
    this.email = '';
    this.claimCode = '';
  }

  onFeedbackSubmitted() {
    this.showFeedback = false;
    this.showMessage('Thank you for your feedback! You can now make another redemption.', 'success');
    this.redemptionComplete = false;
  }

  onSkipFeedback() {
    this.showFeedback = false;
    this.showMessage('Redemption completed successfully! You can now make another redemption.', 'success');
    this.redemptionComplete = false;
  }

  openChatbot() {
    this.showChatbot = true;
  }

  closeChatbot() {
    this.showChatbot = false;
  }
}
