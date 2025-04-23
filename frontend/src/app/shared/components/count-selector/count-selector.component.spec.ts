import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CountSelectorComponent } from "./count-selector.component"
import { FormsModule } from "@angular/forms";

describe('count selector component', () => {

    let countSelector: CountSelectorComponent;
    let fixture: ComponentFixture<CountSelectorComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [CountSelectorComponent]
        })
         fixture = TestBed.createComponent(CountSelectorComponent);
         countSelector = fixture.componentInstance;
    })

    it('should have count set ', () => {
        expect(countSelector.count).toBeDefined();

    })

    it('should emit false value ', () => {
        countSelector.count = 1;
        countSelector.increaseCount();
        expect(countSelector.count).toBe(2);

    })

    it('should emit false value ', () => {
        countSelector.count = 1;
        countSelector.decreaseCount();
        expect(countSelector.count).toBe(1);

    })

    it('should emit false value ', (done: DoneFn) => {
        countSelector.count = 1;
        countSelector.onCountChange.subscribe(newValue=>{
            expect(newValue).toBe(2);
            done();
        })
        countSelector.increaseCount();
      
    })
    it('should emit false value ', (done: DoneFn) => {
        countSelector.count = 5;
        countSelector.onCountChange.subscribe(newValue=>{
            expect(newValue).toBe(4);
            done();
        })
        countSelector.decreaseCount();
      
    })
    it('should emit false value ', (done: DoneFn) => {

        countSelector.count = 5;
        countSelector.decreaseCount();
        fixture.detectChanges();
        fixture.whenStable().then(()=>{
      
            const componentElement: HTMLElement = fixture.nativeElement;
            const input: HTMLInputElement = componentElement.querySelector('input') as HTMLInputElement;
            expect(input.value).toBe('4')
            done();
        })

    })

})