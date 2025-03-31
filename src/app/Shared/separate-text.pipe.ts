import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'separateText'
})
export class SeparateTextPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    const words = value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return words.join(' ');
  }

}
