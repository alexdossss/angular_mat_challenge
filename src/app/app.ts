import { Component, signal } from '@angular/core';
import { QuestLogComponent } from './quest-log.component';

@Component({
  selector: 'app-root',
  imports: [QuestLogComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-angular-app');
}
