import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface AIResponse {
  message: string;
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatbotService {
  // n8n Chatbot API Configuration
  private readonly CHATBOT_API_URL = '/api/chatbot';

  // System prompt for the AI chatbot
  private readonly SYSTEM_PROMPT = `You are Hawky, a friendly customer support assistant for Blackhawk Network's redemption and feedback system. 
  Your role is to assist users with:
  - Redemption code questions (codes should be 5 letters)
  - Feedback and rating process
  - General troubleshooting
  - Navigation help
  - Submit feedback process: The feedback process is simple and valuable! After successful redemption: 1. You'll see a feedback form 2. Rate your experience from 1-5 stars using our emoji system 3. Optionally add comments about your experience
  
  Always introduce yourself as Hawky when greeting users. Keep responses concise, helpful, and friendly. 
  If you cannot help with something, suggest contacting support.
  Do not provide information outside of redemption and feedback topics.
  Do not ask for users redemption codes or personal information.`;

  constructor(private http: HttpClient) {}

  async getAIResponse(userMessage: string, conversationHistory: any[] = []): Promise<AIResponse> {
    try {
      // Try n8n chatbot API first
      return await this.getChatbotAPIResponse(userMessage, conversationHistory);
    } catch (error) {
      console.error('Chatbot API Error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private async getChatbotAPIResponse(userMessage: string, conversationHistory: any[]): Promise<AIResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Create combined message with system prompt and user message
    const combinedMessage = `${this.SYSTEM_PROMPT}\n\nUser: ${userMessage}`;

    const body = {
      name: "Chris",
      email: "",
      message: combinedMessage,
      sessionId: "user-124"
    };

    console.log('Sending request to n8n chatbot API:', body);

    try {
      const response = await this.http.post(this.CHATBOT_API_URL, body, { 
        headers,
        responseType: 'text' // Accept text response instead of JSON
      }).toPromise();
      
      console.log('n8n Chatbot API response:', response);
      console.log('Response type:', typeof response);
      
      // Since we're expecting text (HTML), handle it directly
      if (response && typeof response === 'string') {
        console.log('Processing text response:', response);
        
        // Check if it's an HTML iframe response
        if (response.includes('<iframe') && response.includes('srcdoc=')) {
          const srcdocMatch = response.match(/srcdoc="([^"]+)"/);
          if (srcdocMatch && srcdocMatch[1]) {
            const extractedMessage = srcdocMatch[1];
            console.log('Extracted message from srcdoc:', extractedMessage);
            return {
              message: extractedMessage,
              success: true
            };
          }
        }
        
        // If no iframe found, return the response as is
        return {
          message: response,
          success: true
        };
      }
      
      // Handle other response types
      let parsedResponse;
      try {
        parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
      } catch (e) {
        // If JSON parsing fails, treat as plain text
        return {
          message: response?.toString() || 'Empty response',
          success: true
        };
      }
      
      // Handle different response formats from n8n
      if (parsedResponse && parsedResponse.message) {
        console.log('Using parsedResponse.message:', parsedResponse.message);
        return {
          message: parsedResponse.message,
          success: true
        };
      } else if (parsedResponse && parsedResponse.reply) {
        console.log('Using parsedResponse.reply:', parsedResponse.reply);
        return {
          message: parsedResponse.reply,
          success: true
        };
      } else if (parsedResponse && parsedResponse.text) {
        console.log('Using parsedResponse.text:', parsedResponse.text);
        return {
          message: parsedResponse.text,
          success: true
        };
      } else if (parsedResponse && parsedResponse.response) {
        console.log('Using parsedResponse.response:', parsedResponse.response);
        return {
          message: parsedResponse.response,
          success: true
        };
      } else {
        console.log('Using entire response as message:', parsedResponse);
        return {
          message: JSON.stringify(parsedResponse),
          success: true
        };
      }
    } catch (error: any) {
      console.error('n8n Chatbot API Error:', error);
      
      // Handle HTTP error responses that might contain the actual response data
      if (error.status === 200 && error.error) {
        console.log('Handling HTTP 200 error with response data:', error.error);
        
        // Check if error.error contains the iframe response
        if (typeof error.error === 'string' && error.error.includes('<iframe') && error.error.includes('srcdoc=')) {
          const srcdocMatch = error.error.match(/srcdoc="([^"]+)"/);
          if (srcdocMatch && srcdocMatch[1]) {
            const extractedMessage = srcdocMatch[1];
            console.log('Extracted message from error response srcdoc:', extractedMessage);
            return {
              message: extractedMessage,
              success: true
            };
          }
        }
        
        // Return the error response as the message
        return {
          message: typeof error.error === 'string' ? error.error : JSON.stringify(error.error),
          success: true
        };
      }
      
      // Handle specific error types
      if (error.status === 429) {
        console.warn('Chatbot API rate limit - falling back to smart responses');
        return {
          message: "Hi! I'm Hawky, your support assistant. I'm currently experiencing high demand, but I'm still here to help with our smart assistance system! What can I help you with regarding redemption codes or feedback?",
          success: true
        };
      }
      
      if (error.status === 500 || error.status === 503) {
        console.warn('Chatbot API server error - falling back to smart responses');
        return {
          message: "Hi! I'm Hawky! Our AI system is temporarily unavailable, but I'm still here to help with our enhanced smart responses. What can I assist you with today?",
          success: true
        };
      }
      
      return this.getFallbackResponse(userMessage);
    }
  }

  private getFallbackResponse(userMessage: string): AIResponse {
    // Enhanced fallback responses - more conversational and context-aware
    const message = userMessage.toLowerCase();
    
    const responses: { [key: string]: string } = {
      'hello': "Hello! 👋 I'm Hawky, your support assistant here to help you with redemption codes and feedback. What can I assist you with today?",
      'hi': "Hi there! 😊 I'm Hawky! What can I help you with regarding your redemption or feedback experience?",
      'hey': "Hey! 🙋‍♂️ I'm Hawky, your friendly support assistant! How can I help you with redemption codes or feedback today?",
      'help': "I'm Hawky, and I'd be happy to help! 💪 I can assist you with:\n\n• 🎫 Redemption code questions\n• ⭐ Feedback and rating process\n• 🔧 Troubleshooting issues\n• 📱 Navigation help\n\nWhat specific area would you like help with?",
      'code': "Great question about redemption codes! 🎫\n\nRedemption codes should be exactly 5 letters. Here are some valid test codes you can try:\n• HAPPY\n• LUCKY\n• PRIZE\n• BONUS\n• PEACE\n\nJust enter one of these codes along with your email to test the system!",
      'feedback': "The feedback process is simple and valuable! ⭐\n\nAfter successful redemption:\n1. You'll see a feedback form\n2. Rate your experience from 1-5 stars using our emoji system\n3. Optionally add comments about your experience\n4. Submit to help us improve!\n\nYour feedback really makes a difference! 🙌",
      'problem': "I'm sorry you're experiencing issues! 😔 Let me help you troubleshoot:\n\n🔍 Common solutions:\n• Ensure your code is exactly 5 letters\n• Check your email format is valid\n• Try refreshing the page\n• Clear your browser cache\n\nCould you tell me more about what specific problem you're encountering?",
      'thanks': "You're very welcome! 😊 I'm Hawky, and I'm glad I could help. Is there anything else about redemption codes or feedback that I can assist you with?",
      'bye': "Goodbye! 👋 Thanks for using our Blackhawk Network redemption system. I'm Hawky, and I'm always here to help! Feel free to reach out anytime if you need assistance with redemption or feedback. Have a great day! 🌟",
      'rating': "Our rating system is user-friendly! ⭐\n\nYou can rate from 1-5 stars using our emoji system:\n• 😢 = 1 star (very poor)\n• 😕 = 2 stars (poor)\n• 😐 = 3 stars (okay)\n• 😊 = 4 stars (good)\n• 🤩 = 5 stars (excellent)\n\nYour honest rating helps us improve our service! 💫",
      'error': "Let's get this sorted out! 🔧\n\nIf you're seeing an error, please try:\n1. ✅ Check your internet connection\n2. 📝 Verify your code is exactly 5 letters\n3. 🔄 Refresh the page and try again\n4. 🧹 Clear your browser cache\n\nIf the problem persists, our support team is here to help! What specific error are you seeing?",
      'email': "For email-related questions! 📧\n\nMake sure your email:\n• Is in the correct format (user@domain.com)\n• Doesn't have extra spaces\n• Uses a valid domain\n\nThe same email from redemption will be pre-filled in the feedback form to save you time! ✨",
      'skip': "You can skip feedback if you prefer! 🦘\n\nOn the feedback screen, you'll see a 'Skip' button. However, we really value your input as it helps us improve the experience for everyone! Even a quick star rating is super helpful! ⭐"
    };

    // Find matching response
    for (const keyword in responses) {
      if (message.includes(keyword)) {
        return {
          message: responses[keyword],
          success: true
        };
      }
    }

    // Context-aware responses with more personality
    if (message.includes('how') && (message.includes('work') || message.includes('use'))) {
      return {
        message: "The redemption process is super simple! 🎯\n\nHere's how it works:\n1. 📧 Enter your email address\n2. 🎫 Enter a valid 5-letter code (try HAPPY, LUCKY, PRIZE, BONUS, or PEACE)\n3. 🚀 Click 'Redeem'\n4. ⭐ Provide feedback when prompted\n\nThe whole process takes less than a minute! Is there a specific step you'd like me to explain in more detail?",
        success: true
      };
    }

    if (message.includes('not working') || message.includes('broken') || message.includes('issue')) {
      return {
        message: "Oh no! Let's fix this together! 🛠️\n\nPlease try these steps:\n• 🔄 Refresh the page\n• 📝 Double-check your code format (5 letters only)\n• 🌐 Ensure you have a stable internet connection\n• 🧹 Clear browser cache if needed\n\nIf you're still having trouble, could you describe exactly what's happening? I'm here to help! 💪",
        success: true
      };
    }

    if (message.includes('what') && (message.includes('code') || message.includes('valid'))) {
      return {
        message: "Here are the valid test codes you can use! 🎫✨\n\n• HAPPY - For a joyful redemption\n• LUCKY - Feeling fortunate?\n• PRIZE - Everyone loves prizes!\n• BONUS - Extra special!\n• PEACE - For a zen experience\n\nEach code is exactly 5 letters. Just pick one and give it a try! 🚀",
        success: true
      };
    }

    if (message.includes('?')) {
      return {
        message: "That's a great question! 🤔💭\n\nI'm Hawky, and I'm here to help with redemption codes and feedback for Blackhawk Network. For more complex technical issues, our support team has additional resources available.\n\nCould you tell me a bit more about what you're trying to do? I'd love to point you in the right direction! 🎯",
        success: true
      };
    }

    // Default intelligent response with more warmth
    return {
      message: "Hi! I'm Hawky, your support assistant! 😊\n\nI understand you need some assistance. I'm here to help with:\n• 🎫 Redemption codes and processes\n• ⭐ Feedback and rating questions\n• 🔧 General troubleshooting\n• 📱 Navigation help\n\nWhat would you like to know more about? Feel free to ask me anything related to redemption or feedback! 💬",
      success: true
    };
  }
}
