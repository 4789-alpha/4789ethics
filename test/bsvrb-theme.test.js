const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require.resolve('../bsvrb-theme.js'), 'utf8');
function setup(saved, dark = false, blocked = false) {
  const dataset={}, system={matches:dark, addEventListener(name,fn){this.change=fn;}}, listeners={};
  const window={addEventListener(name,fn){listeners[name]=fn;}};
  vm.runInNewContext(source,{document:{documentElement:{dataset},dispatchEvent(){}},window,
    localStorage:{getItem(){if(blocked)throw Error();return saved;},setItem(key,value){if(blocked)throw Error();saved=value;}},
    matchMedia(){return system;},Event:class {}});
  return {dataset,system,window,listeners};
}
test('system is default and follows system changes',()=>{
  const {dataset,system}=setup(null,true);assert.equal(dataset.themePreference,'system');assert.equal(dataset.theme,'dark');
  system.matches=false;system.change();assert.equal(dataset.theme,'light');
});
test('manual choice persists independently of system, and can return to system',()=>{
  const {dataset,system,window}=setup('light',true);assert.equal(dataset.theme,'light');
  window.BsvrbTheme.set('dark');system.matches=false;system.change();assert.equal(dataset.theme,'dark');
  window.BsvrbTheme.set('system');assert.equal(dataset.theme,'light');
});
test('storage failures and invalid saved values fall back safely',()=>{
  assert.equal(setup('invalid',true).dataset.theme,'dark');
  const {dataset,window}=setup(null,true,true);window.BsvrbTheme.set('light');assert.equal(dataset.theme,'light');
});
