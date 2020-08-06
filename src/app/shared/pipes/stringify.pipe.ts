import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringify'
})
export class StringifyPipe implements PipeTransform {

  transform(value: any): string {
    try {
      const auxData = JSON.stringify(value);
      return auxData;
    } catch (e) {
      return value;
    }
  }

}
