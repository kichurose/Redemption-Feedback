import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatbotService } from '../services/ai-chatbot.service';

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
      text: "Hi! I'm Hawky, your support assistant here to help you with any questions about the redemption process or feedback. How can I assist you?",
      isUser: false,
      timestamp: new Date()
    }
  ];

  currentMessage: string = '';
  isTyping: boolean = false;
  aiEnabled: boolean = false;

  constructor(private aiService: AiChatbotService) {
    // Keep aiEnabled as false to show "Smart Assistant" instead of "AI Powered"
    this.messages[0].text = "Hi! I'm Hawky, your support assistant here to help with redemption codes and feedback questions. I have enhanced responses and can assist you with everything you need! How can I help you today? 😊";
  }

  async sendMessage() {
    if (!this.currentMessage.trim()) return;

    // Add user message
    const userMessage = this.currentMessage;
    this.messages.push({
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    });

    this.currentMessage = '';

    // Show typing indicator
    this.isTyping = true;

    try {
      // Get AI response
      const aiResponse = await this.aiService.getAIResponse(userMessage, this.messages);
      
      // Simulate realistic typing delay
      const typingDelay = Math.min(aiResponse.message.length * 50, 3000); // Max 3 seconds
      
      setTimeout(() => {
        this.messages.push({
          text: aiResponse.message,
          isUser: false,
          timestamp: new Date()
        });
        this.isTyping = false;
        this.scrollToBottom();
      }, typingDelay);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Fallback to basic response
      setTimeout(() => {
        this.messages.push({
          text: "I'm sorry, I'm having trouble processing your request right now. Please try again or contact our support team for assistance.",
          isUser: false,
          timestamp: new Date()
        });
        this.isTyping = false;
        this.scrollToBottom();
      }, 1000);
    }
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

  getAIStatus(): string {
    return 'AI Provider: n8n-chatbot (Configured with Smart Fallbacks)';
  }
}
