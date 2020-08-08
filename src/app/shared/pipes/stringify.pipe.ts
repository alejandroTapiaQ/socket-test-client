import { Pipe, PipeTransform } from '@angular/core';

/**
 * Convert json object to string
 *
 * @export
 * @class StringifyPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'stringify'
})
export class StringifyPipe implements PipeTransform {

  /**
   * Transform function
   *
   * @template T
   * @param {T} value value to parse
   * @returns {string}
   * @memberof StringifyPipe
   */
  transform<T>(value: T): string {
    let parsedValue = '';
    try {
      parsedValue = JSON.stringify(value);
      return parsedValue;
    } catch (e) {
      parsedValue = `${value}`;
      return parsedValue;
    }
  }
}
