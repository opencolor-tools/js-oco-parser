// order:

// - node_modules/lex/lexer.js
// - oco-parser


// remove:
var requireStatements = /var (.*) = require\((.*)\)(.*);/
var exportStatements = /module\.exports = (.*);/
var strictStatements = /'use strict';/

// remove entry

var search = /lexer\.addRule\(\/(.*)\/\,/
//replace with: lexer.addRule(new RexExp('/$1/')),

// delete comment block in parser




var ocoParser = (function(){
var o = function(k,v,o,l){
  for(
      o=o||{}, l=k.length;
      l--;
      xk = k[l], // do not nest object, o[k[l]] will fail
      o[xk]=v
      );
    return o
  }
  ,$V0=[1,12],$V1=[1,8],$V2=[1,9],$V3=[1,13],$V4=[1,14],$V5=[1,20],$V6=[1,18],$V7=[5,16,18,19,29,31,32,34,37],$V8=[1,25],$V9=[1,24],$Va=[1,33],$Vb=[1,29],$Vc=[1,34],$Vd=[1,35],$Ve=[1,37],$Vf=[1,39],$Vg=[29,32,35],$Vh=[16,17],$Vi=[2,11],$Vj=[1,43],$Vk=[1,44],$Vl=[5,16,18,19,29,31,32,33,34,37],$Vm=[1,52],$Vn=[29,32],$Vo=[16,20,29,32,37],$Vp=[1,68],$Vq=[1,67],$Vr=[1,76],$Vs=[35,40],$Vt=[16,31,34];



// len = this.productions_[action[1]][1];
// replace with: var __OCO_SKETCK_k = action[1]; len = this.productions_[__OCO_SKETCK_k][1];


// stack.push(this.productions_[action[1]][0]);
// replace with: var __OCO_SKETCK_k = action[1]; stack.push(this.productions_[__OCO_SKETCK_k][0]);

// newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
// replace with: var __OCO_SKETCK_k1 = stack[stack.length - 2]; var __OCO_SKETCK_k2 = stack[stack.length - 2]; newState = table[__OCO_SKETCK_k1][__OCO_SKETCK_k2];

// search
if (segments[0] !== '') {
  groupCounts[segments[0]] = (groupCounts[segments[0]] || 0) + 1;
}
if (groupCounts[segments[0]] && groupCounts[segments[0]] > 1) {
  groups.push(segments[0]);
}

// replace
var __OCO_SKETCK_k = segments[0];
if (__OCO_SKETCK_k !== '') {
  groupCounts[__OCO_SKETCK_k] = (groupCounts[__OCO_SKETCK_k] || 0) + 1;
}
if (groupCounts[__OCO_SKETCK_k] && groupCounts[__OCO_SKETCK_k] > 1) {
  groups.push(__OCO_SKETCK_k);
}

// search
jisonparser.lexer = lexer;

// replace
jisonparser = ocoParser;
jisonparser.lexer = lexer;


// rewrite oco parser regexp addMetadata
// rewrite oco parser regexp
// var combinedKey = (prefix + key).replace(/\/\//g, '/'); // normalize keys