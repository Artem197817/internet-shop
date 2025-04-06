import {Component, Input, OnInit} from '@angular/core';
import {CategoryWithTypes} from '../../../types/category.types';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveParam} from '../../../types/activeParam.types';
import {FormsModule} from '@angular/forms';
import { ActiveParamsUtils } from '../../utils/active-params.util';

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


    this.activeParams = ActiveParamsUtils.processParams(params);
    if(this.type){

      if(this.type === 'height'){
        this.open = !!(this.activeParams.heightFrom || this.activeParams.heightTo)
        this.from = this.activeParams.heightFrom? +this.activeParams.heightFrom: null;
        this.to = this.activeParams.heightTo? +this.activeParams.heightTo: null;
      } else    if(this.type === 'diameter'){
        this.from = this.activeParams.diameterFrom? +this.activeParams.diameterFrom: null;
        this.to = this.activeParams.diameterTo? +this.activeParams.diameterTo: null;
        this.open = !!(this.activeParams.diameterFrom || this.activeParams.diameterTo)
    }
  } else {
    if(params['types']){
      this.activeParams.types = Array.isArray(params['types'])? params['types']:[params['types']];
    }

    if(this.cwt && this.cwt.types && this.cwt.types.length > 0
      && this.cwt.types.some(type => this.activeParams.types.find(item => type.url === item))){

      this.open = true;
    }
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
     // this.activeParams.types.push(url);
      this.activeParams.types = [...this.activeParams.types, url]
    }
  }else if(checked){
      this.activeParams.types = [url];

  }
  this.activeParams.page = 1;
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
    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }

  }


}
