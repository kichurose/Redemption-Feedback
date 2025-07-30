import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { FeedbackComponent } from './feedback.component';

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackComponent, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require rating before submitting', () => {
    component.rating = 0;
    component.onSubmitFeedback();
    expect(component.message).toContain('Please provide a rating');
    expect(component.messageType).toBe('error');
  });

  it('should set rating when star is clicked', () => {
    component.setRating(4);
    expect(component.rating).toBe(4);
  });

  it('should emit feedbackSubmitted event after successful submission', (done) => {
    component.rating = 5;
    component.feedbackSubmitted.subscribe(() => {
      done();
    });
    component.onSubmitFeedback();
  });
});
