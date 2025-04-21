import { CountSelectorComponent } from "./count-selector.component"

describe('count selector component',()=>{

    let countSelector: CountSelectorComponent;
 
    beforeEach(()=>{
        countSelector = new CountSelectorComponent();
    })
 
     it('should have count set ',(done: DoneFn)=>{
        expect(countSelector.count).toBeDefined();
    
     })
     
     it('should emit false value ',(done: DoneFn)=>{
    
        })
    
 
     })