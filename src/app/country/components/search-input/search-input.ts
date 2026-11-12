import { ChangeDetectionStrategy, Component, effect, input, linkedSignal, output, signal } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.html',
})
export class SearchInput {
  placeholder = input('Buscar');
  searchValue = input('');
  value = output<string>();
  debounceTime = input(1000);
  inputValue = linkedSignal(() => this.searchValue());
  private lastEmittedValue = this.inputValue();

  debounceEffect = effect(onCleanup => {
    const value = this.inputValue();

    const timeout = setTimeout(() => {
      if (value !== this.lastEmittedValue) {
        this.lastEmittedValue = value;
        this.value.emit(value);
      }
    }, this.debounceTime());

    onCleanup(() => {
      clearTimeout(timeout);
    });
  });

  submit(): void {
    const value = this.inputValue().trim();
    if (value === this.lastEmittedValue) return;

    this.lastEmittedValue = value;
    this.value.emit(value);
  }
}
