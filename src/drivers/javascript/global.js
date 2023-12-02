global.int = (s) => parseInt(s, 10);
global.float = (s) => parseFloat(s, 10);
global.log = console.log.bind(console);
global.isArray = arr => Array.isArray(arr);
global.isNumber = n => typeof n === 'number';
global.min = Math.min;
global.max = Math.max;
global.abs = Math.abs;
Array.prototype.sum = function() {
  return this.reduce((acc, v) => (acc += v), 0);
};
Array.prototype.mul = function() {
  return this.reduce((acc, v) => (acc *= v), 1);
};
Array.prototype.last = function() {
  return this[this.length - 1];
};
Set.prototype.addArr = function(array) {
  return this.add(array+'');
};
Set.prototype.hasArr = function(array) {
  return this.has(array+'');
};
Set.prototype.deleteArr = function(array) {
  return this.delete(array+'');
};
String.prototype.replaceAt = function(index, replacement) {
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
};