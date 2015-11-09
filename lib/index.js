/**
 * string-search
 * https://github.com/ospatil/string-search
 *
 * Copyright (c) 2015 Omkar Patil
 * Licensed under the MIT license.
 */
import { Promise } from 'bluebird';

export function find(...args) {
  return new Promise((resolve, reject) => {
    if (args.length !== 2) {
      reject('You must provide all arguments');
    }
    const [targetStr, patternStr] = args;
    const results = [];
    const pattern = new RegExp(patternStr, 'gi');

    targetStr.split('\n').forEach((value, index) => {
      if (value.match(pattern)) {
        results.push({line: index + 1, text: value, term: patternStr});
      }
    });
    resolve(results);
  });
}
