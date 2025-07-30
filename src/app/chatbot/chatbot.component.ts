import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent {
  @Output() closeChatbot = new EventEmitter<void>();

  messages: ChatMessage[] = [
    {
      text: "Hi! I'm here to help you with any questions about the redemption process or feedback. How can I assist you?",
      isUser: false,
      timestamp: new Date()
    }
  ];

  currentMessage: string = '';
  isTyping: boolean = false;

  predefinedResponses: { [key: string]: string } = {
    'hello': "Hello! How can I help you today?",
    'hi': "Hi there! What can I do for you?",
    'help': "I can help you with questions about redemption codes, feedback, or any issues you're experiencing.",
    'code': "Redemption codes should be exactly 5 letters. Valid test codes include: HAPPY, LUCKY, PRIZE, BONUS, PEACE.",
    'feedback': "Your feedback helps us improve! You can rate your experience and leave comments about the redemption process.",
    'problem': "I'm sorry you're having issues. Can you tell me more about what specific problem you're encountering?",
    'thanks': "You're welcome! Is there anything else I can help you with?",
    'bye': "Goodbye! Feel free to reach out if you need any more assistance.",
    'rating': "You can rate your experience from 1 to 5 stars. Your rating helps us understand how well our service is performing.",
    'skip': "If you don't want to provide feedback right now, you can click the 'Skip' button to proceed.",
    'submit': "To submit your feedback, make sure to provide a rating (1-5 stars) and then click 'Submit Feedback'."
  };

  sendMessage() {
    if (!this.currentMessage.trim()) return;

    // Add user message
    this.messages.push({
      text: this.currentMessage,
      isUser: true,
      timestamp: new Date()
    });

    const userMessage = this.currentMessage.toLowerCase();
    this.currentMessage = '';

    // Show typing indicator
    this.isTyping = true;

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = this.generateResponse(userMessage);
      this.messages.push({
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      });
      this.isTyping = false;
      this.scrollToBottom();
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  }

  private generateResponse(message: string): string {
    // Check for keywords in the message
    for (const keyword in this.predefinedResponses) {
      if (message.includes(keyword)) {
        return this.predefinedResponses[keyword];
      }
    }

    // Default responses for common patterns
    if (message.includes('how') && message.includes('work')) {
      return "The redemption process is simple: enter your email and a valid 5-letter code, then click redeem. After successful redemption, you'll be asked to provide feedback.";
    }
    
    if (message.includes('error') || message.includes('not working')) {
      return "I'm sorry you're experiencing issues. Please make sure your claim code is exactly 5 letters and try again. If the problem persists, contact our support team.";
    }

    if (message.includes('?')) {
      return "That's a great question! For specific technical issues, you might want to contact our support team. Is there anything else about the redemption or feedback process I can help clarify?";
    }

    // Default response
    return "I understand. Is there anything specific about the redemption process or feedback that I can help you with?";
  }

  onClose() {
    this.closeChatbot.emit();
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }
}
