import { Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-info-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss'
})
export class InfoDialogComponent {

}
