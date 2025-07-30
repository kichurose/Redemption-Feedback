export class FeedbackData {
  name: string;
  rating: number; // Integer from 1 to 5
  feedback: string;
  email: string;

  constructor(
    name: string = '',
    rating: number = 0,
    feedback: string = '',
    email: string = ''
  ) {
    this.name = name;
    this.rating = rating;
    this.feedback = feedback;
    this.email = email;
  }

  // Validation method
  isValid(): boolean {
    return (
      this.name.trim().length > 0 &&
      this.email.trim().length > 0 &&
      this.rating >= 1 && this.rating <= 5 &&
      this.feedback.trim().length > 0
    );
  }

  // Convert to JSON format for API
  toJSON(): any {
    return {
      name: this.name,
      rating: this.rating,
      feedback: this.feedback,
      email: this.email
    };
  }
}
