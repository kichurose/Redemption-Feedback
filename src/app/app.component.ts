import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RedemptionPortalComponent } from './redemption-portal/redemption-portal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RedemptionPortalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Feedback-Chatbot';
}
