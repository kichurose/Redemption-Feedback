import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ChatbotComponent } from './chatbot.component';

describe('ChatbotComponent', () => {
  let component: ChatbotComponent;
  let fixture: ComponentFixture<ChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotComponent, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with welcome message', () => {
    expect(component.messages.length).toBe(1);
    expect(component.messages[0].isUser).toBe(false);
    expect(component.messages[0].text).toContain('help you');
  });

  it('should add user message when sending', () => {
    component.currentMessage = 'Hello';
    component.sendMessage();
    expect(component.messages[1].text).toBe('Hello');
    expect(component.messages[1].isUser).toBe(true);
  });

  it('should generate appropriate responses', () => {
    const response = component['generateResponse']('hello');
    expect(response).toContain('Hello');
  });
});
