import { Component } from '@angular/core';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  isLoading = false;
  constructor(private loaderService:LoaderService) {}
  ngOnInit(): void {
    this.loaderService.isLoading.subscribe((value:any) => {
      this.isLoading = value;
    });
    console.log("isLoading");
    
  }
}

