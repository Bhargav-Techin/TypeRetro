import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GeminiModelService } from './services/gemini-model.service';
import { TypingTestComponent } from './typing-test/typing-test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TypingTestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  constructor( private geminiModelService : GeminiModelService){}
  ngOnInit() {
  }

  async getGenerateText() {
   const genText = await this.geminiModelService.generateText("hello");
   console.log(genText);  
  }
  
  
}
