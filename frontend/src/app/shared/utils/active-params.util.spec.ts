import { ActiveParamsUtils } from "./active-params.util"

describe('active params util',()=>{

    it('should change type string to type Array ',()=>{

        const result = ActiveParamsUtils.processParams({
            types: 'sukkulenti'
        })

    expect(result.types).toBeInstanceOf(Array);  

    })
    
    it('should change page string to int ',()=>{
        const result = ActiveParamsUtils.processParams({
            page: '2'
        })
    expect(result.page).toBe(2);  

    })
        
    it('should change page string to int ',()=>{
        const result = ActiveParamsUtils.processParams({
            types: 'sukkulenti',
            heightFrom: '1',
            heightTo: '10',
            diameterFrom: '1',
            diameterTo: '10',
            sort: '2',
            page: '2',
        })
    expect(result).toEqual({
        types: ['sukkulenti'],
        heightFrom: '1',
        heightTo: '10',
        diameterFrom: '1',
        diameterTo: '10',
        sort: '2',
        page: 2, 
    });  

    })
    it('should change page string to int ',()=>{
        const result: any = ActiveParamsUtils.processParams({
            pages: '2'
        })
    expect(result.pages).toBeUndefined();  

    })
})
    