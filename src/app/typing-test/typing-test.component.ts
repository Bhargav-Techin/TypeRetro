import { Component, ViewChild, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GeminiModelService } from '../services/gemini-model.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CountdownComponent, CountdownModule } from 'ngx-countdown';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog
} from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';


@Component({
  selector: 'app-typing-test',
  standalone: true,
  imports: [
    MatGridListModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule,
    CommonModule,
    MatProgressBarModule,
    CountdownModule,
    CountdownComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './typing-test.component.html',
  styleUrl: './typing-test.component.scss',
})
export class TypingTestComponent {
  static selectedButton: number = 20;
  isLoading: boolean = false;
  paragraph: string = 'Loading...';
  easySelected: boolean = true;
  mediumSelected: boolean = false;
  hardSelected: boolean = false;
  userInput: string = '';
  barValue: number = 0;
  firstInputStart: boolean = true;
  inputStart: boolean = false;
  inputDisable: boolean = false;
  progressBarInterval: any;
  recentInputedWord: string = '';
  correctCharType: number = 0;
  wrongCharType: number = 0;
  wpm: string = '';
  accuracy: string = '';
  viewScoreClicked: boolean = false;

  readonly dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(InfoDialogComponent);
  }



  @ViewChild('cd', { static: false }) private countdown !: CountdownComponent;



  constructor(private geminiModelService: GeminiModelService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.getGenerateText(`Write a paragraph of exact 20 words. Write only the paragaph body in one paragraph.`);
  }

  handleButtonClick(buttonNumber: number): void {
    if (buttonNumber !== TypingTestComponent.selectedButton) {
      console.log(`Button clicked: ${buttonNumber}`);
      switch (buttonNumber) {
        case 20:
          this.easySelected = true;
          this.mediumSelected = false;
          this.hardSelected = false;
          break;
        case 50:
          this.easySelected = false;
          this.mediumSelected = true;
          this.hardSelected = false;
          break;
        case 100:
          this.easySelected = false;
          this.mediumSelected = false;
          this.hardSelected = true;
          break;
        default:
          break;
      }
      TypingTestComponent.selectedButton = buttonNumber;
      this.paragraph = 'Loading...';
      this.isLoading = true;
      this.firstInputStart = true;
      this.inputDisable = false;
      clearInterval(this.progressBarInterval);
      this.barValue = 0;
      this.countdown.restart();
      const prompt = `Write a paragraph of exact ${buttonNumber} words. Write only the paragraph body in one paragraph.`;
      this.getGenerateText(prompt);
    }
  }

  async getGenerateText(prompt: string) {
    try{
    const genText = await this.geminiModelService.generateText(prompt);
    this.paragraph = genText;
    this.isLoading = false;
    }catch(error){
      console.log(error);
    }
  }
  startProgressBar(): void {
    const intervalMilliseconds = 100;
    const maxTimeInSeconds = 30;
    let count = 0;

    this.progressBarInterval = setInterval(() => {
      count += intervalMilliseconds / 1000;
      this.barValue = (count / maxTimeInSeconds) * 100;

      if (count >= maxTimeInSeconds) {
        clearInterval(this.progressBarInterval);
        this.firstInputStart = true;
        this.inputDisable = true;
        // console.log(this.paragraph);
        // console.log(this.userInput);
      }
    }, intervalMilliseconds);
  }

  handleinput(inputValue: any) {
    this.handleParagraphCheck(inputValue.data);

    if (this.firstInputStart) {
      console.log("hello")
      this.countdown.begin();
      this.startProgressBar()
      this.firstInputStart = false;
      this.inputStart = true;
    }
  }

  handleParagraphCheck(userletter: string | null) {
    const letter = this.paragraph.split('');
    const nthSpan = document.querySelectorAll('p span')[this.userInput.length - (userletter === null ? 0 : 1)];

    if (nthSpan) {
      const coloredSpan = document.createElement('span');
      if (userletter === null) {
        coloredSpan.style.color = 'black';
      } else if (letter[this.userInput.length - 1] === userletter) {
        coloredSpan.style.color = 'green';
        coloredSpan.style.fontWeight = '600';
        this.correctCharType++;
      } else if (nthSpan.innerHTML !== ' ') {
        coloredSpan.style.color = 'red';
        coloredSpan.style.fontWeight = '600';
        this.wrongCharType++;
      } else {
        coloredSpan.style.backgroundColor = 'red';
        this.wrongCharType++;
      }
      coloredSpan.textContent = letter[this.userInput.length - (userletter === null ? 0 : 1)];
      nthSpan.replaceWith(coloredSpan);
    }
  }
  typingTestResultHandler() {
    this.viewScoreClicked = true;
    this.wpm = ((this.correctCharType * 2) / 5).toFixed(1);
    this.accuracy = ((this.correctCharType / (this.correctCharType + this.wrongCharType)) * 100).toFixed(2);
  }
  newGame() {
    window.location.reload();
  }
}
