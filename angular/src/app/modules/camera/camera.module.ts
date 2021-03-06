import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { CameraMainComponent } from './camera-main/camera-main.component';
import { CamraAreaComponent } from './camra-area/camra-area.component';
import { CommonModule } from '@angular/common';
import { HellofromkzComponent } from './hellofromkz/hellofromkz.component';

@NgModule({
  declarations: [CameraMainComponent, CamraAreaComponent, HellofromkzComponent],
  imports: [CommonModule, MatInputModule, FormsModule, ReactiveFormsModule],
  exports: [CameraMainComponent],
})
export class CameraModule {}
