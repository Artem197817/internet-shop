import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'count-selector',
  imports: [
    FormsModule
  ],
  standalone: true,
  templateUrl: './count-selector.component.html',
  styleUrl: './count-selector.component.scss'
})
export class CountSelectorComponent {

  @Output() onCountChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() count: number = 1;

  decreaseCount() {
    if (this.count > 1) {
      this.count--;
      this.countChange();
    }
  }

  increaseCount() {

    this.count++;
    this.countChange();
  }

  countChange() {
    this.onCountChange.emit(this.count)
  }
}
