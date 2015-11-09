import { find } from '../lib';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

const expect = chai.expect;

const multipleMatchStr =
`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
  </head>
  <body>
    <div class="my-one">My class div</div>
    <div>Another div</div>
    <span class="my-two">My class span</span>
  </body>
</html>`;

describe('string-search', function () {
  it('should reject promise if called without arguments', function () {
    return expect(find()).to.be.eventually.rejected;
  });

  it('should reject promise if called with illegal string to be searched argument', function () {
    return expect(find(undefined, 'one')).to.be.eventually.rejected;
  });

  it('should return match even if the target string does not contain newline', function () {
    const result = find('A single liner string', 'li');
    return expect(result).to.eventually.have.length(1);
  });

  it('should return zero length array if no match found', function () {
    const result = find('A single liner string', 'qu');
    return expect(result).to.eventually.have.length(0);
  });

  it('should return multiple matches if found', function () {
    const result = find(multipleMatchStr, 'class="my-');
    return expect(result).to.eventually.have.length(2);
  });

  it('should return understand the usual escape characters', function () {
    const result = find(multipleMatchStr, '\/span');
    return expect(result).to.eventually.have.length(1);
    return expect(result).to.eventually.deep.equal({ line: 10, text: '    <span class="my-two">My class span</span>', term: '/span' });
  });
});
