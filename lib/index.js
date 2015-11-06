/**
 * string-search
 * https://github.com/ospatil/string-search
 *
 * Copyright (c) 2015 Omkar Patil
 * Licensed under the MIT license.
 */
import { Promise } from 'bluebird';

export function find(...args) {
  if (args.length !== 2) {
    throw new TypeError('You must provide all arguments');
  }
  const [targetStr, patternStr] = args;
  const results = [];
  const pattern = new RegExp(patternStr, 'gi');

  return new Promise((resolve) => {
    targetStr.split('\n').forEach((value, index) => {
      if (value.match(pattern)) {
        results.push({line: index + 1, text: value});
      }
    });
    resolve(results);
  });
}
