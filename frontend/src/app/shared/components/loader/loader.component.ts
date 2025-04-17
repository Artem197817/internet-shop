import { Component, OnInit } from '@angular/core';
import { MatProgressSpinner} from '@angular/material/progress-spinner';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    MatProgressSpinner,
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent implements OnInit{

isShowed: boolean = false;

constructor(private loaderService: LoaderService){}

ngOnInit(): void {
  
  this.loaderService.isShowed$.subscribe((value: boolean )=> {
    this.isShowed = value;
  })
}

}
