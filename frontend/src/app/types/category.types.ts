export interface CategoryType  {
  id:string,
  name:string,
  url:string,
}
export interface Type {
  "id": string;
  "name": string;
  "url": string;

}

export interface TypesResponse {
  "id": string;
  "name": string;
  "category": CategoryType;
  "url": string;
}
export interface CategoryWithTypes {
  id:string;
  name:string;
  url:string;
  types: Type [];
}
