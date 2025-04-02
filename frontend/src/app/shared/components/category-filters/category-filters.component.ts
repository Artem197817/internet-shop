import {Component, Input, OnInit} from '@angular/core';
import {CategoryWithTypes} from '../../../types/category.types';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveParam} from '../../../types/activeParam.types';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'category-filters',
  standalone: true,
  templateUrl: './category-filters.component.html',
  imports: [
    NgForOf,
    NgIf,
    FormsModule
  ],
  styleUrl: './category-filters.component.scss'
})
export class CategoryFiltersComponent implements OnInit {

@Input() cwt: CategoryWithTypes | null = null;
@Input() type: string | null = null;
protected open = false;
activeParams:ActiveParam = {types: []}
  from: number|null = null;
  to: number|null = null;

get title(): string{
  if(this.cwt){
    return this.cwt.name;
  }else if(this.type){
    if(this.type === 'height'){
      return 'Высота';
    }else if(this.type === 'diameter'){
      return 'Диаметр';
    }
  }
  return '';
}
constructor(private  router: Router,
            private activatedRoute: ActivatedRoute,
            ) {
}

ngOnInit(): void {
  this.activatedRoute.queryParams.subscribe(params => {
    const activeParams: ActiveParam = {types: []};
    if(params.hasOwnProperty('types')){
      activeParams.types = Array.isArray(params['types'])? params['types']:[params['types']]
    }
    if(params.hasOwnProperty('heightFrom')){
      activeParams.types = params['heightFrom']
    }
    if(params.hasOwnProperty('heightTo')){
      activeParams.types = params['heightTo']
    }
    if(params.hasOwnProperty('diameterFrom')){
      activeParams.types = params['diameterFrom']
    }
    if(params.hasOwnProperty('diameterTo')){
      activeParams.types = params['diameterTo']
    }

  })
}
protected toggle(){
  this.open = !this.open;
}

updateFilterParam(url: string, checked: boolean){
  if(this.activeParams.types && this.activeParams.types.length > 0) {
    const existingTypeInParam = this.activeParams.types.find(item => item === url)
    if (existingTypeInParam && !checked) {
      this.activeParams.types = this.activeParams.types.filter(item => item !== url);
    } else if (!existingTypeInParam && checked) {
      this.activeParams.types.push(url);
    }
  }else if(checked){
      this.activeParams.types = [url];

  }
  console.log(this.activeParams);
  this.router.navigate(['/catalog'], {
    queryParams: this.activeParams
  });
}

  updateFilterParamFromTo(param: string, value: string){

  if(param === 'heightFrom' || param === 'heightTo'
    || param === 'diameterFrom' || param === 'diameterTo'){

    if(this.activeParams[param] && !value){
      delete this.activeParams[param];
    }else{
      this.activeParams[param] = value;
    }
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }

  }


}
