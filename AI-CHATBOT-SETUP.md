# AI Chatbot Configuration Guide

## Setup Instructions

Your chatbot now uses OpenRouter - a better alternative to OpenAI with access to multiple AI models!

### OpenRouter Configuration (Recommended)
1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Get your API key from the dashboard
3. In `src/app/services/ai-chatbot.service.ts`, update:
   ```typescript
   private readonly OPENROUTER_API_KEY = 'your-openrouter-api-key-here';
   ```

## Why OpenRouter?
- ✅ **Better Pricing**: Often 50-90% cheaper than OpenAI
- ✅ **Multiple Models**: Access GPT-4, Claude, Llama, and more
- ✅ **Higher Limits**: More generous rate limits
- ✅ **Better Reliability**: Multiple providers for redundancy

## Available Models
You can change the model in the service:
```typescript
private readonly MODEL = 'openai/gpt-3.5-turbo'; // Default
// Or try:
// 'openai/gpt-4'                    // Most capable
// 'anthropic/claude-3-haiku'        // Fast and efficient
// 'meta-llama/llama-3-8b-instruct'  // Open source
// 'google/gemini-pro'               // Google's model
```

## Current Configuration
- **Provider**: OpenRouter
- **Default Model**: GPT-3.5-turbo
- **Status**: Ready to configure

## Features
- ✅ Real AI responses from multiple providers
- ✅ Context-aware conversations
- ✅ Conversation history tracking
- ✅ Intelligent fallback system
- ✅ Blackhawk Network branding
- ✅ Mobile responsive
- ✅ Bottom-right positioning

## Pricing Comparison
- **OpenAI Direct**: $0.002/1K tokens
- **OpenRouter**: $0.0005-0.002/1K tokens (often much cheaper)
- **Free Tier**: $1 free credits to start

## Security Note
For production, store API keys in environment variables:

```typescript
private readonly OPENROUTER_API_KEY = environment.openrouterApiKey;
```
