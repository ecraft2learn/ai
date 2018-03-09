(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.deeplearn = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.
var alea = require('./lib/alea');

// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.
var xor128 = require('./lib/xor128');

// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
var xorwow = require('./lib/xorwow');

// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.
var xorshift7 = require('./lib/xorshift7');

// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.
var xor4096 = require('./lib/xor4096');

// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.
var tychei = require('./lib/tychei');

// The original ARC4-based prng included in this library.
// Period: ~2^1600
var sr = require('./seedrandom');

sr.alea = alea;
sr.xor128 = xor128;
sr.xorwow = xorwow;
sr.xorshift7 = xorshift7;
sr.xor4096 = xor4096;
sr.tychei = tychei;

module.exports = sr;

},{"./lib/alea":3,"./lib/tychei":4,"./lib/xor128":5,"./lib/xor4096":6,"./lib/xorshift7":7,"./lib/xorwow":8,"./seedrandom":9}],3:[function(require,module,exports){
// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.alea = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],4:[function(require,module,exports){
// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
};

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.tychei = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],5:[function(require,module,exports){
// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor128 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],6:[function(require,module,exports){
// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
};

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor4096 = impl;
}

})(
  this,                                     // window object or global
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);

},{}],7:[function(require,module,exports){
// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v, w;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorshift7 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);


},{}],8:[function(require,module,exports){
// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorwow = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],9:[function(require,module,exports){
/*
Copyright 2014 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (pool, math) {
//
// The following constants are related to IEEE 754 limits.
//
var global = this,
    width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}
math['seed' + rngname] = seedrandom;

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if ((typeof module) == 'object' && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = require('crypto');
  } catch (ex) {}
} else if ((typeof define) == 'function' && define.amd) {
  define(function() { return seedrandom; });
}

// End anonymous scope, and pass initial values.
})(
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);

},{"crypto":1}],10:[function(require,module,exports){
(function (global){
/*! https://mths.be/utf8js v2.1.2 by @mathias */
;(function(root) {

	// Detect free variables `exports`
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	// Taken from https://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from https://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	function checkScalarValue(codePoint) {
		if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
			throw Error(
				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
				' is not a scalar value'
			);
		}
	}
	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			checkScalarValue(codePoint);
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function utf8encode(string) {
		var codePoints = ucs2decode(string);
		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol() {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				checkScalarValue(codePoint);
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString) {
		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol()) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	var utf8 = {
		'version': '2.1.2',
		'encode': utf8encode,
		'decode': utf8decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return utf8;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = utf8;
		} else { // in Narwhal or RingoJS v0.7.0-
			var object = {};
			var hasOwnProperty = object.hasOwnProperty;
			for (var key in utf8) {
				hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.utf8 = utf8;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("./doc");
var BrowserUtil = (function () {
    function BrowserUtil() {
    }
    BrowserUtil.nextFrame = function () {
        return new Promise(function (resolve) { return requestAnimationFrame(function () { return resolve(); }); });
    };
    __decorate([
        doc_1.doc({ heading: 'Performance', subheading: 'Timing' })
    ], BrowserUtil, "nextFrame", null);
    return BrowserUtil;
}());
exports.BrowserUtil = BrowserUtil;

},{"./doc":33}],12:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var tensor_1 = require("../../tensor");
var util = require("../../util");
var BatchDataset = (function () {
    function BatchDataset(base, batchSize, smallLastBatch) {
        if (smallLastBatch === void 0) { smallLastBatch = true; }
        this.base = base;
        this.batchSize = batchSize;
        this.smallLastBatch = smallLastBatch;
    }
    BatchDataset.prototype.getStream = function () {
        return __awaiter(this, void 0, void 0, function () {
            var batchesAsArrays;
            return __generator(this, function (_a) {
                batchesAsArrays = this.base.getStream().batch(this.batchSize, this.smallLastBatch);
                return [2, batchesAsArrays.map(makeDatasetBatch)];
            });
        });
    };
    return BatchDataset;
}());
exports.BatchDataset = BatchDataset;
function makeDatasetBatch(elements) {
    var rotated = {};
    var firstElement = elements[0];
    var keys = Object.keys(firstElement);
    keys.forEach(function (key) {
        rotated[key] = [];
    });
    var _loop_1 = function (e) {
        keys.forEach(function (key) {
            var value = e[key];
            rotated[key].push(value);
        });
    };
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var e = elements_1[_i];
        _loop_1(e);
    }
    var result = {};
    keys.forEach(function (key) {
        if (rotated[key].length !== elements.length) {
            throw new Error("Batching failed to get a '" + key + "' value for each element.");
        }
        if (typeof rotated[key][0] === 'string') {
            result[key] = rotated[key];
        }
        else {
            result[key] = batchConcat(rotated[key]);
        }
    });
    elements.forEach(globals_1.dispose);
    return result;
}
function batchConcat(arrays) {
    var elementShape = shapeAndValues(arrays[0])[0];
    var batchShape = [arrays.length].concat(elementShape);
    var resultVals = new Float32Array(batchShape.reduce(function (x, y) { return x * y; }));
    var offset = 0;
    for (var _i = 0, arrays_1 = arrays; _i < arrays_1.length; _i++) {
        var a = arrays_1[_i];
        var _a = shapeAndValues(a), aShape = _a[0], aVals = _a[1];
        if (!util.arraysEqual(aShape, elementShape)) {
            throw new Error('Elements must have the same shape to be batched');
        }
        resultVals.set(aVals, offset);
        offset += aVals.length;
    }
    var result = tensor_1.Tensor.make(batchShape, { values: resultVals });
    return result;
}
function shapeAndValues(array) {
    if (array instanceof tensor_1.Tensor) {
        return [array.shape, array.dataSync()];
    }
    else if (Array.isArray(array)) {
        return [[array.length], array];
    }
    else {
        return [[], [array]];
    }
}

},{"../../globals":36,"../../tensor":145,"../../util":151}],13:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var seedrandom = require("seedrandom");
var globals_1 = require("../../globals");
var batch_dataset_1 = require("./batch_dataset");
var statistics_1 = require("./statistics");
var data_stream_1 = require("./streams/data_stream");
var data_stream_2 = require("./streams/data_stream");
var data_stream_3 = require("./streams/data_stream");
var Dataset = (function () {
    function Dataset() {
    }
    Dataset.prototype.computeStatistics = function (sampleSize, shuffleWindowSize) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, statistics_1.computeDatasetStatistics(this, sampleSize, shuffleWindowSize)];
            });
        });
    };
    Dataset.prototype.filter = function (filterer) {
        var base = this;
        return datasetFromStreamFn(function () {
            return base.getStream().filter(function (x) { return globals_1.tidy(function () { return filterer(x); }); });
        });
    };
    Dataset.prototype.map = function (transform) {
        var base = this;
        return datasetFromStreamFn(function () {
            return base.getStream().map(function (x) { return globals_1.tidy(function () { return transform(x); }); });
        });
    };
    Dataset.prototype.batch = function (batchSize, smallLastBatch) {
        if (smallLastBatch === void 0) { smallLastBatch = true; }
        return new batch_dataset_1.BatchDataset(this, batchSize, smallLastBatch);
    };
    Dataset.prototype.concatenate = function (dataset) {
        var base = this;
        return datasetFromStreamFn(function () { return base.getStream().concatenate(dataset.getStream()); });
    };
    Dataset.prototype.repeat = function (count) {
        var base = this;
        return datasetFromStreamFn(function () {
            var streamStream = data_stream_1.streamFromFunction(function () { return ({ value: base.getStream(), done: false }); });
            return data_stream_2.streamFromConcatenated(streamStream.take(count));
        });
    };
    Dataset.prototype.take = function (count) {
        var base = this;
        return datasetFromStreamFn(function () { return base.getStream().take(count); });
    };
    Dataset.prototype.skip = function (count) {
        var base = this;
        return datasetFromStreamFn(function () { return base.getStream().skip(count); });
    };
    Dataset.prototype.shuffle = function (bufferSize, seed, reshuffleEachIteration) {
        if (reshuffleEachIteration === void 0) { reshuffleEachIteration = true; }
        var base = this;
        var random = seedrandom(seed);
        return datasetFromStreamFn(function () {
            var seed2 = random.int32();
            if (reshuffleEachIteration) {
                seed2 += random.int32();
            }
            return base.getStream().shuffle(bufferSize, seed2.toString());
        });
    };
    Dataset.prototype.prefetch = function (bufferSize) {
        var base = this;
        return datasetFromStreamFn(function () { return base.getStream().prefetch(bufferSize); });
    };
    Dataset.prototype.collectAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.getStream().collectRemaining()];
            });
        });
    };
    Dataset.prototype.forEach = function (f) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.getStream().forEach(f)];
            });
        });
    };
    return Dataset;
}());
exports.Dataset = Dataset;
function datasetFromStreamFn(getStreamFn) {
    return new (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.getStream = function () {
            return getStreamFn();
        };
        return class_1;
    }(Dataset))();
}
exports.datasetFromStreamFn = datasetFromStreamFn;
function datasetFromElements(items) {
    return datasetFromStreamFn(function () { return data_stream_3.streamFromItems(items); });
}
exports.datasetFromElements = datasetFromElements;

},{"../../globals":36,"./batch_dataset":12,"./statistics":19,"./streams/data_stream":21,"seedrandom":2}],14:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dataset_1 = require("../dataset");
var text_line_dataset_1 = require("./text_line_dataset");
var CsvHeaderConfig;
(function (CsvHeaderConfig) {
    CsvHeaderConfig[CsvHeaderConfig["READ_FIRST_LINE"] = 0] = "READ_FIRST_LINE";
    CsvHeaderConfig[CsvHeaderConfig["NUMBERED"] = 1] = "NUMBERED";
})(CsvHeaderConfig = exports.CsvHeaderConfig || (exports.CsvHeaderConfig = {}));
var CSVDataset = (function (_super) {
    __extends(CSVDataset, _super);
    function CSVDataset(input) {
        var _this = _super.call(this) || this;
        _this.input = input;
        _this.hasHeaderLine = false;
        _this.base = new text_line_dataset_1.TextLineDataset(input, CSVDataset.textColumnName);
        return _this;
    }
    Object.defineProperty(CSVDataset.prototype, "csvColumnNames", {
        get: function () {
            return this._csvColumnNames;
        },
        enumerable: true,
        configurable: true
    });
    CSVDataset.prototype.setCsvColumnNames = function (csvColumnNames) {
        return __awaiter(this, void 0, void 0, function () {
            var stream, firstElement, firstLine, stream, firstElement, firstLine;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(csvColumnNames == null || csvColumnNames === CsvHeaderConfig.NUMBERED)) return [3, 2];
                        stream = this.base.getStream();
                        return [4, stream.next()];
                    case 1:
                        firstElement = _a.sent();
                        if (firstElement.done) {
                            throw new Error('No data was found for CSV parsing.');
                        }
                        firstLine = firstElement.value[CSVDataset.textColumnName];
                        this._csvColumnNames =
                            Array.from(firstLine.split(',').keys()).map(function (x) { return x.toString(); });
                        return [3, 5];
                    case 2:
                        if (!(csvColumnNames === CsvHeaderConfig.READ_FIRST_LINE)) return [3, 4];
                        stream = this.base.getStream();
                        return [4, stream.next()];
                    case 3:
                        firstElement = _a.sent();
                        if (firstElement.done) {
                            throw new Error('No data was found for CSV parsing.');
                        }
                        firstLine = firstElement.value[CSVDataset.textColumnName];
                        this._csvColumnNames = firstLine.split(',');
                        this.hasHeaderLine = true;
                        return [3, 5];
                    case 4:
                        this._csvColumnNames = csvColumnNames;
                        _a.label = 5;
                    case 5: return [2];
                }
            });
        });
    };
    CSVDataset.create = function (input, csvColumnNames) {
        if (csvColumnNames === void 0) { csvColumnNames = CsvHeaderConfig.NUMBERED; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = new CSVDataset(input);
                        return [4, result.setCsvColumnNames(csvColumnNames)];
                    case 1:
                        _a.sent();
                        return [2, result];
                }
            });
        });
    };
    CSVDataset.prototype.getStream = function () {
        var _this = this;
        var lines = this.base.getStream();
        if (this.hasHeaderLine) {
            lines = lines.skip(1);
        }
        return lines.map(function (x) { return _this.makeDatasetElement(x); });
    };
    CSVDataset.prototype.makeDatasetElement = function (element) {
        var line = element[CSVDataset.textColumnName];
        var values = line.split(',');
        var result = {};
        for (var i = 0; i < this._csvColumnNames.length; i++) {
            var value = values[i];
            if (value === '') {
                result[this._csvColumnNames[i]] = undefined;
            }
            else {
                var valueAsNum = Number(value);
                if (isNaN(valueAsNum)) {
                    result[this._csvColumnNames[i]] = value;
                }
                else {
                    result[this._csvColumnNames[i]] = valueAsNum;
                }
            }
        }
        return result;
    };
    CSVDataset.textColumnName = 'line';
    return CSVDataset;
}(dataset_1.Dataset));
exports.CSVDataset = CSVDataset;

},{"../dataset":13,"./text_line_dataset":15}],15:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dataset_1 = require("../dataset");
var TextLineDataset = (function (_super) {
    __extends(TextLineDataset, _super);
    function TextLineDataset(input, columnName) {
        if (columnName === void 0) { columnName = 'line'; }
        var _this = _super.call(this) || this;
        _this.input = input;
        _this.columnName = columnName;
        return _this;
    }
    TextLineDataset.prototype.getStream = function () {
        var _this = this;
        var readStream = this.input.getStream();
        var utf8Stream = readStream.decodeUTF8();
        var lineStream = utf8Stream.split('\n');
        return lineStream.map(function (x) {
            return (_a = {}, _a[_this.columnName] = x, _a);
            var _a;
        });
    };
    return TextLineDataset;
}(dataset_1.Dataset));
exports.TextLineDataset = TextLineDataset;

},{"../dataset":13}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataSource = (function () {
    function DataSource() {
    }
    return DataSource;
}());
exports.DataSource = DataSource;

},{}],17:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var datasource_1 = require("../datasource");
var filereader_stream_1 = require("../streams/filereader_stream");
var FileDataSource = (function (_super) {
    __extends(FileDataSource, _super);
    function FileDataSource(input, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.input = input;
        _this.options = options;
        return _this;
    }
    FileDataSource.prototype.getStream = function () {
        return new filereader_stream_1.FileReaderStream(this.input, this.options);
    };
    return FileDataSource;
}(datasource_1.DataSource));
exports.FileDataSource = FileDataSource;

},{"../datasource":16,"../streams/filereader_stream":22}],18:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var datasource_1 = require("../datasource");
var url_stream_1 = require("../streams/url_stream");
var URLDataSource = (function (_super) {
    __extends(URLDataSource, _super);
    function URLDataSource(url, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.url = url;
        _this.options = options;
        return _this;
    }
    URLDataSource.prototype.getStream = function () {
        return new url_stream_1.URLStream(this.url, this.options);
    };
    return URLDataSource;
}(datasource_1.DataSource));
exports.URLDataSource = URLDataSource;

},{"../datasource":16,"../streams/url_stream":24}],19:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var tensor_1 = require("../../tensor");
function scaleTo01(min, max) {
    var range = max - min;
    var minTensor = tensor_1.Scalar.new(min);
    var rangeTensor = tensor_1.Scalar.new(range);
    return function (value) {
        if (typeof (value) === 'string') {
            throw new Error('Can\'t scale a string.');
        }
        else {
            if (value instanceof tensor_1.Tensor) {
                var result = value.sub(minTensor).div(rangeTensor);
                return result;
            }
            else if (value instanceof Array) {
                return value.map(function (v) { return (v - min) / range; });
            }
            else {
                return (value - min) / range;
            }
        }
    };
}
exports.scaleTo01 = scaleTo01;
function computeDatasetStatistics(dataset, sampleSize, shuffleWindowSize) {
    return __awaiter(this, void 0, void 0, function () {
        var sampleDataset, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sampleDataset = dataset;
                    if (shuffleWindowSize != null) {
                        sampleDataset = sampleDataset.shuffle(shuffleWindowSize);
                    }
                    if (sampleSize != null) {
                        sampleDataset = sampleDataset.take(sampleSize);
                    }
                    result = {};
                    return [4, sampleDataset.forEach(function (e) {
                            for (var key in e) {
                                var value = e[key];
                                if (typeof (value) === 'string') {
                                }
                                else {
                                    var recordMin = void 0;
                                    var recordMax = void 0;
                                    if (value instanceof tensor_1.Tensor) {
                                        recordMin = value.min().dataSync()[0];
                                        recordMax = value.max().dataSync()[0];
                                    }
                                    else if (value instanceof Array) {
                                        recordMin = value.reduce(function (a, b) { return Math.min(a, b); });
                                        recordMax = value.reduce(function (a, b) { return Math.max(a, b); });
                                    }
                                    else if (!isNaN(value) && isFinite(value)) {
                                        recordMin = value;
                                        recordMax = value;
                                    }
                                    else {
                                        throw new Error("Cannot compute statistics: " + key + " = " + value);
                                    }
                                    var columnStats = result[key];
                                    if (columnStats == null) {
                                        columnStats = {
                                            min: Number.POSITIVE_INFINITY,
                                            max: Number.NEGATIVE_INFINITY
                                        };
                                        result[key] = columnStats;
                                    }
                                    columnStats.min = Math.min(columnStats.min, recordMin);
                                    columnStats.max = Math.max(columnStats.max, recordMax);
                                }
                            }
                        })];
                case 1:
                    _a.sent();
                    return [2, result];
            }
        });
    });
}
exports.computeDatasetStatistics = computeDatasetStatistics;

},{"../../tensor":145}],20:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var utf8 = require("utf8");
var data_stream_1 = require("./data_stream");
var string_stream_1 = require("./string_stream");
var ByteStream = (function (_super) {
    __extends(ByteStream, _super);
    function ByteStream() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ByteStream.prototype.decodeUTF8 = function () {
        return new Utf8Stream(this);
    };
    return ByteStream;
}(data_stream_1.DataStream));
exports.ByteStream = ByteStream;
var Utf8Stream = (function (_super) {
    __extends(Utf8Stream, _super);
    function Utf8Stream(upstream) {
        var _this = _super.call(this) || this;
        _this.impl = new Utf8StreamImpl(upstream);
        return _this;
    }
    Utf8Stream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.impl.next()];
            });
        });
    };
    return Utf8Stream;
}(string_stream_1.StringStream));
var Utf8StreamImpl = (function (_super) {
    __extends(Utf8StreamImpl, _super);
    function Utf8StreamImpl(upstream) {
        var _this = _super.call(this) || this;
        _this.upstream = upstream;
        _this.partial = new Uint8Array([]);
        _this.partialBytesValid = 0;
        return _this;
    }
    Utf8StreamImpl.prototype.pump = function () {
        return __awaiter(this, void 0, void 0, function () {
            var chunkResult, chunk, partialBytesRemaining, nextIndex, okUpToIndex, splitUtfWidth, bulk, reassembled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.upstream.next()];
                    case 1:
                        chunkResult = _a.sent();
                        if (chunkResult.done) {
                            if (this.partial.length === 0) {
                                return [2, false];
                            }
                            chunk = new Uint8Array([]);
                        }
                        else {
                            chunk = chunkResult.value;
                        }
                        partialBytesRemaining = this.partial.length - this.partialBytesValid;
                        nextIndex = partialBytesRemaining;
                        okUpToIndex = nextIndex;
                        splitUtfWidth = 0;
                        while (nextIndex < chunk.length) {
                            okUpToIndex = nextIndex;
                            splitUtfWidth = utfWidth(chunk[nextIndex]);
                            nextIndex = okUpToIndex + splitUtfWidth;
                        }
                        if (nextIndex === chunk.length) {
                            okUpToIndex = nextIndex;
                        }
                        bulk = utf8.decode(String.fromCharCode.apply(null, chunk.slice(partialBytesRemaining, okUpToIndex)));
                        if (partialBytesRemaining > 0) {
                            this.partial.set(chunk.slice(0, partialBytesRemaining), this.partialBytesValid);
                            reassembled = utf8.decode(String.fromCharCode.apply(null, this.partial));
                            this.outputQueue.push(reassembled + bulk);
                        }
                        else {
                            this.outputQueue.push(bulk);
                        }
                        if (okUpToIndex === chunk.length) {
                            this.partial = new Uint8Array([]);
                            this.partialBytesValid = 0;
                        }
                        else {
                            this.partial = new Uint8Array(new ArrayBuffer(splitUtfWidth));
                            this.partial.set(chunk.slice(okUpToIndex), 0);
                            this.partialBytesValid = chunk.length - okUpToIndex;
                        }
                        return [2, true];
                }
            });
        });
    };
    return Utf8StreamImpl;
}(data_stream_1.QueueStream));
function utfWidth(firstByte) {
    if (firstByte >= 252) {
        return 6;
    }
    else if (firstByte >= 248) {
        return 5;
    }
    else if (firstByte >= 240) {
        return 4;
    }
    else if (firstByte >= 224) {
        return 3;
    }
    else if (firstByte >= 192) {
        return 2;
    }
    else {
        return 1;
    }
}

},{"./data_stream":21,"./string_stream":23,"utf8":10}],21:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var seedrandom = require("seedrandom");
var globals_1 = require("../../../globals");
var util_1 = require("../../../util");
var growing_ring_buffer_1 = require("../util/growing_ring_buffer");
var ring_buffer_1 = require("../util/ring_buffer");
function streamFromItems(items) {
    return new ArrayStream(items);
}
exports.streamFromItems = streamFromItems;
function streamFromIncrementing(start) {
    var i = start;
    return streamFromFunction(function () { return ({ value: i++, done: false }); });
}
exports.streamFromIncrementing = streamFromIncrementing;
function streamFromFunction(func) {
    return new FunctionCallStream(func);
}
exports.streamFromFunction = streamFromFunction;
function streamFromConcatenated(baseStreams) {
    return ChainedStream.create(baseStreams);
}
exports.streamFromConcatenated = streamFromConcatenated;
function streamFromConcatenatedFunction(streamFunc, count) {
    return streamFromConcatenated(streamFromFunction(streamFunc).take(count));
}
exports.streamFromConcatenatedFunction = streamFromConcatenatedFunction;
var DataStream = (function () {
    function DataStream() {
    }
    DataStream.prototype.collectRemaining = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, x;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        return [4, this.next()];
                    case 1:
                        x = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!!x.done) return [3, 4];
                        result.push(x.value);
                        return [4, this.next()];
                    case 3:
                        x = _a.sent();
                        return [3, 2];
                    case 4: return [2, result];
                }
            });
        });
    };
    DataStream.prototype.resolveFully = function () {
        return __awaiter(this, void 0, void 0, function () {
            var x;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.next()];
                    case 1:
                        x = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!!x.done) return [3, 4];
                        return [4, this.next()];
                    case 3:
                        x = _a.sent();
                        return [3, 2];
                    case 4: return [2];
                }
            });
        });
    };
    DataStream.prototype.filter = function (predicate) {
        return new FilterStream(this, predicate);
    };
    DataStream.prototype.map = function (transform) {
        return new MapStream(this, transform);
    };
    DataStream.prototype.forEach = function (f) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.map(f).resolveFully()];
            });
        });
    };
    DataStream.prototype.batch = function (batchSize, smallLastBatch) {
        if (smallLastBatch === void 0) { smallLastBatch = true; }
        return new BatchStream(this, batchSize, smallLastBatch);
    };
    DataStream.prototype.concatenate = function (stream) {
        return ChainedStream.create(streamFromItems([this, stream]));
    };
    DataStream.prototype.take = function (count) {
        if (count < 0 || count == null) {
            return this;
        }
        return new TakeStream(this, count);
    };
    DataStream.prototype.skip = function (count) {
        if (count < 0 || count == null) {
            return this;
        }
        return new SkipStream(this, count);
    };
    DataStream.prototype.prefetch = function (bufferSize) {
        return new PrefetchStream(this, bufferSize);
    };
    DataStream.prototype.shuffle = function (windowSize, seed) {
        return new ShuffleStream(this, windowSize, seed);
    };
    return DataStream;
}());
exports.DataStream = DataStream;
var ArrayStream = (function (_super) {
    __extends(ArrayStream, _super);
    function ArrayStream(items) {
        var _this = _super.call(this) || this;
        _this.items = items;
        _this.trav = 0;
        return _this;
    }
    ArrayStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                if (this.trav >= this.items.length) {
                    return [2, { value: null, done: true }];
                }
                result = this.items[this.trav];
                this.trav++;
                return [2, { value: result, done: false }];
            });
        });
    };
    return ArrayStream;
}(DataStream));
var FunctionCallStream = (function (_super) {
    __extends(FunctionCallStream, _super);
    function FunctionCallStream(nextFn) {
        var _this = _super.call(this) || this;
        _this.nextFn = nextFn;
        return _this;
    }
    FunctionCallStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.nextFn()];
            });
        });
    };
    return FunctionCallStream;
}(DataStream));
var SkipStream = (function (_super) {
    __extends(SkipStream, _super);
    function SkipStream(upstream, maxCount) {
        var _this = _super.call(this) || this;
        _this.upstream = upstream;
        _this.maxCount = maxCount;
        _this.count = 0;
        return _this;
    }
    SkipStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var skipped;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.count++ < this.maxCount)) return [3, 2];
                        return [4, this.upstream.next()];
                    case 1:
                        skipped = _a.sent();
                        if (skipped.done) {
                            return [2, skipped];
                        }
                        globals_1.dispose(skipped.value);
                        return [3, 0];
                    case 2: return [2, this.upstream.next()];
                }
            });
        });
    };
    return SkipStream;
}(DataStream));
var TakeStream = (function (_super) {
    __extends(TakeStream, _super);
    function TakeStream(upstream, maxCount) {
        var _this = _super.call(this) || this;
        _this.upstream = upstream;
        _this.maxCount = maxCount;
        _this.count = 0;
        return _this;
    }
    TakeStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.count++ >= this.maxCount) {
                    return [2, { value: null, done: true }];
                }
                return [2, this.upstream.next()];
            });
        });
    };
    return TakeStream;
}(DataStream));
var QueueStream = (function (_super) {
    __extends(QueueStream, _super);
    function QueueStream() {
        var _this = _super.call(this) || this;
        _this.outputQueue = new growing_ring_buffer_1.GrowingRingBuffer();
        return _this;
    }
    QueueStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.outputQueue.length() === 0)) return [3, 2];
                        return [4, this.pump()];
                    case 1:
                        if (!(_a.sent())) {
                            return [2, { value: null, done: true }];
                        }
                        return [3, 0];
                    case 2: return [2, { value: this.outputQueue.shift(), done: false }];
                }
            });
        });
    };
    return QueueStream;
}(DataStream));
exports.QueueStream = QueueStream;
var BatchStream = (function (_super) {
    __extends(BatchStream, _super);
    function BatchStream(upstream, batchSize, enableSmallLastBatch) {
        if (enableSmallLastBatch === void 0) { enableSmallLastBatch = true; }
        var _this = _super.call(this) || this;
        _this.upstream = upstream;
        _this.batchSize = batchSize;
        _this.enableSmallLastBatch = enableSmallLastBatch;
        _this.currentBatch = [];
        return _this;
    }
    BatchStream.prototype.pump = function () {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.upstream.next()];
                    case 1:
                        item = _a.sent();
                        if (item.done) {
                            if (this.enableSmallLastBatch && this.currentBatch.length > 0) {
                                this.outputQueue.push(this.currentBatch);
                                this.currentBatch = [];
                                return [2, true];
                            }
                            return [2, false];
                        }
                        this.currentBatch.push(item.value);
                        if (this.currentBatch.length === this.batchSize) {
                            this.outputQueue.push(this.currentBatch);
                            this.currentBatch = [];
                        }
                        return [2, true];
                }
            });
        });
    };
    return BatchStream;
}(QueueStream));
var FilterStream = (function (_super) {
    __extends(FilterStream, _super);
    function FilterStream(upstream, predicate) {
        var _this = _super.call(this) || this;
        _this.upstream = upstream;
        _this.predicate = predicate;
        return _this;
    }
    FilterStream.prototype.pump = function () {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.upstream.next()];
                    case 1:
                        item = _a.sent();
                        if (item.done) {
                            return [2, false];
                        }
                        if (this.predicate(item.value)) {
                            this.outputQueue.push(item.value);
                        }
                        else {
                            globals_1.dispose(item.value);
                        }
                        return [2, true];
                }
            });
        });
    };
    return FilterStream;
}(QueueStream));
var MapStream = (function (_super) {
    __extends(MapStream, _super);
    function MapStream(upstream, transform) {
        var _this = _super.call(this) || this;
        _this.upstream = upstream;
        _this.transform = transform;
        return _this;
    }
    MapStream.prototype.pump = function () {
        return __awaiter(this, void 0, void 0, function () {
            var item, inputTensors, mapped, outputTensors, _i, inputTensors_1, t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.upstream.next()];
                    case 1:
                        item = _a.sent();
                        if (item.done) {
                            return [2, false];
                        }
                        inputTensors = util_1.extractTensorsFromAny(item.value);
                        mapped = this.transform(item.value);
                        outputTensors = util_1.extractTensorsFromAny(mapped);
                        for (_i = 0, inputTensors_1 = inputTensors; _i < inputTensors_1.length; _i++) {
                            t = inputTensors_1[_i];
                            if (!util_1.isTensorInList(t, outputTensors)) {
                                t.dispose();
                            }
                        }
                        this.outputQueue.push(mapped);
                        return [2, true];
                }
            });
        });
    };
    return MapStream;
}(QueueStream));
var ChainedStream = (function (_super) {
    __extends(ChainedStream, _super);
    function ChainedStream() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stream = null;
        _this.lastRead = null;
        return _this;
    }
    ChainedStream.create = function (streams) {
        var c = new ChainedStream();
        c.moreStreams = streams;
        return c;
    };
    ChainedStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.lastRead = this.readFromChain(this.lastRead);
                return [2, this.lastRead];
            });
        });
    };
    ChainedStream.prototype.readFromChain = function (lastRead) {
        return __awaiter(this, void 0, void 0, function () {
            var streamResult, itemResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, lastRead];
                    case 1:
                        _a.sent();
                        if (!(this.stream == null)) return [3, 3];
                        return [4, this.moreStreams.next()];
                    case 2:
                        streamResult = _a.sent();
                        if (streamResult.done) {
                            return [2, { value: null, done: true }];
                        }
                        this.stream = streamResult.value;
                        _a.label = 3;
                    case 3: return [4, this.stream.next()];
                    case 4:
                        itemResult = _a.sent();
                        if (itemResult.done) {
                            this.stream = null;
                            return [2, this.readFromChain(lastRead)];
                        }
                        return [2, itemResult];
                }
            });
        });
    };
    return ChainedStream;
}(DataStream));
exports.ChainedStream = ChainedStream;
var PrefetchStream = (function (_super) {
    __extends(PrefetchStream, _super);
    function PrefetchStream(upstream, bufferSize) {
        var _this = _super.call(this) || this;
        _this.upstream = upstream;
        _this.bufferSize = bufferSize;
        _this.total = 0;
        _this.buffer = new ring_buffer_1.RingBuffer(bufferSize);
        return _this;
    }
    PrefetchStream.prototype.refill = function () {
        while (!this.buffer.isFull()) {
            var v = this.upstream.next();
            this.buffer.push(v);
        }
    };
    PrefetchStream.prototype.next = function () {
        this.refill();
        return this.buffer.shift();
    };
    return PrefetchStream;
}(DataStream));
exports.PrefetchStream = PrefetchStream;
var ShuffleStream = (function (_super) {
    __extends(ShuffleStream, _super);
    function ShuffleStream(upstream, windowSize, seed) {
        var _this = _super.call(this, upstream, windowSize) || this;
        _this.upstream = upstream;
        _this.windowSize = windowSize;
        _this.upstreamExhausted = false;
        _this.random = seedrandom(seed);
        return _this;
    }
    ShuffleStream.prototype.randomInt = function (max) {
        return Math.floor(this.random() * max);
    };
    ShuffleStream.prototype.chooseIndex = function () {
        return this.randomInt(this.buffer.length());
    };
    ShuffleStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var chosenIndex, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.upstreamExhausted) {
                            this.refill();
                        }
                        _a.label = 1;
                    case 1:
                        if (!!this.buffer.isEmpty()) return [3, 3];
                        chosenIndex = this.chooseIndex();
                        return [4, this.buffer.shuffleExcise(chosenIndex)];
                    case 2:
                        result = _a.sent();
                        if (result.done) {
                            this.upstreamExhausted = true;
                        }
                        else {
                            this.refill();
                            return [2, result];
                        }
                        return [3, 1];
                    case 3: return [2, { value: null, done: true }];
                }
            });
        });
    };
    return ShuffleStream;
}(PrefetchStream));
exports.ShuffleStream = ShuffleStream;

},{"../../../globals":36,"../../../util":151,"../util/growing_ring_buffer":25,"../util/ring_buffer":26,"seedrandom":2}],22:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var byte_stream_1 = require("./byte_stream");
var FileReaderStream = (function (_super) {
    __extends(FileReaderStream, _super);
    function FileReaderStream(file, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.file = file;
        _this.options = options;
        _this.offset = options.offset || 0;
        _this.chunkSize = options.chunkSize || 1024 * 1024;
        return _this;
    }
    FileReaderStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var chunk, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.offset >= this.file.size) {
                            return [2, { value: null, done: true }];
                        }
                        chunk = new Promise(function (resolve, reject) {
                            var fileReader = new FileReader();
                            fileReader.onload = function (event) {
                                var data = fileReader.result;
                                if (data instanceof ArrayBuffer) {
                                    data = new Uint8Array(data);
                                }
                                if (!(data instanceof Uint8Array)) {
                                    return reject(new TypeError('FileReader returned unknown type.'));
                                }
                                resolve(data);
                            };
                            fileReader.onabort = function (event) {
                                return reject(new Error('Aborted'));
                            };
                            fileReader.onerror = function (event) {
                                return reject(new Error(event.error));
                            };
                            var end = _this.offset + _this.chunkSize;
                            var slice = _this.file.slice(_this.offset, end);
                            fileReader.readAsArrayBuffer(slice);
                            _this.offset = end;
                        });
                        _a = {};
                        return [4, chunk];
                    case 1: return [2, (_a.value = (_b.sent()), _a.done = false, _a)];
                }
            });
        });
    };
    return FileReaderStream;
}(byte_stream_1.ByteStream));
exports.FileReaderStream = FileReaderStream;

},{"./byte_stream":20}],23:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_stream_1 = require("./data_stream");
var StringStream = (function (_super) {
    __extends(StringStream, _super);
    function StringStream() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StringStream.prototype.split = function (separator) {
        return new SplitStream(this, separator);
    };
    return StringStream;
}(data_stream_1.DataStream));
exports.StringStream = StringStream;
var SplitStream = (function (_super) {
    __extends(SplitStream, _super);
    function SplitStream(upstream, separator) {
        var _this = _super.call(this) || this;
        _this.impl = new SplitStreamImpl(upstream, separator);
        return _this;
    }
    SplitStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.impl.next()];
            });
        });
    };
    return SplitStream;
}(StringStream));
var SplitStreamImpl = (function (_super) {
    __extends(SplitStreamImpl, _super);
    function SplitStreamImpl(upstream, separator) {
        var _this = _super.call(this) || this;
        _this.upstream = upstream;
        _this.separator = separator;
        _this.carryover = '';
        return _this;
    }
    SplitStreamImpl.prototype.pump = function () {
        return __awaiter(this, void 0, void 0, function () {
            var chunkResult, lines, _i, _a, line;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.upstream.next()];
                    case 1:
                        chunkResult = _b.sent();
                        if (chunkResult.done) {
                            if (this.carryover === '') {
                                return [2, false];
                            }
                            this.outputQueue.push(this.carryover);
                            this.carryover = '';
                            return [2, true];
                        }
                        lines = chunkResult.value.split(this.separator);
                        lines[0] = this.carryover + lines[0];
                        for (_i = 0, _a = lines.slice(0, -1); _i < _a.length; _i++) {
                            line = _a[_i];
                            this.outputQueue.push(line);
                        }
                        this.carryover = lines[lines.length - 1];
                        return [2, true];
                }
            });
        });
    };
    return SplitStreamImpl;
}(data_stream_1.QueueStream));

},{"./data_stream":21}],24:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var byte_stream_1 = require("./byte_stream");
var data_stream_1 = require("./data_stream");
var filereader_stream_1 = require("./filereader_stream");
var URLStream = (function (_super) {
    __extends(URLStream, _super);
    function URLStream(url, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.impl = new URLStreamImpl(url, options);
        return _this;
    }
    URLStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.impl.next()];
            });
        });
    };
    return URLStream;
}(byte_stream_1.ByteStream));
exports.URLStream = URLStream;
var URLStreamImpl = (function (_super) {
    __extends(URLStreamImpl, _super);
    function URLStreamImpl(url, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.url = url;
        _this.options = options;
        _this.blobPromise = fetch(url, options).then(function (response) {
            if (response.ok) {
                return response.blob();
            }
            else {
                throw new Error(response.statusText);
            }
        });
        return _this;
    }
    URLStreamImpl.prototype.pump = function () {
        return __awaiter(this, void 0, void 0, function () {
            var blob, chunkResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.fileReaderStream == null)) return [3, 2];
                        return [4, this.blobPromise];
                    case 1:
                        blob = _a.sent();
                        this.fileReaderStream = new filereader_stream_1.FileReaderStream(blob, this.options);
                        _a.label = 2;
                    case 2: return [4, this.fileReaderStream.next()];
                    case 3:
                        chunkResult = _a.sent();
                        if (chunkResult.done) {
                            return [2, false];
                        }
                        this.outputQueue.push(chunkResult.value);
                        return [2, true];
                }
            });
        });
    };
    return URLStreamImpl;
}(data_stream_1.QueueStream));

},{"./byte_stream":20,"./data_stream":21,"./filereader_stream":22}],25:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ring_buffer_1 = require("./ring_buffer");
var GrowingRingBuffer = (function (_super) {
    __extends(GrowingRingBuffer, _super);
    function GrowingRingBuffer() {
        return _super.call(this, GrowingRingBuffer.INITIAL_CAPACITY) || this;
    }
    GrowingRingBuffer.prototype.isFull = function () {
        return false;
    };
    GrowingRingBuffer.prototype.push = function (value) {
        if (_super.prototype.isFull.call(this)) {
            this.expand();
        }
        _super.prototype.push.call(this, value);
    };
    GrowingRingBuffer.prototype.unshift = function (value) {
        if (_super.prototype.isFull.call(this)) {
            this.expand();
        }
        _super.prototype.unshift.call(this, value);
    };
    GrowingRingBuffer.prototype.expand = function () {
        var newCapacity = this.capacity * 2;
        var newData = new Array(newCapacity);
        var len = this.length();
        for (var i = 0; i < len; i++) {
            newData[i] = this.get(this.wrap(this.begin + i));
        }
        this.data = newData;
        this.capacity = newCapacity;
        this.doubledCapacity = 2 * this.capacity;
        this.begin = 0;
        this.end = len;
    };
    GrowingRingBuffer.INITIAL_CAPACITY = 32;
    return GrowingRingBuffer;
}(ring_buffer_1.RingBuffer));
exports.GrowingRingBuffer = GrowingRingBuffer;

},{"./ring_buffer":26}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RingBuffer = (function () {
    function RingBuffer(capacity) {
        this.capacity = capacity;
        this.begin = 0;
        this.end = 0;
        if (capacity < 1) {
            throw new RangeError('Can\'t create ring buffer of capacity < 1.');
        }
        this.data = new Array(capacity);
        this.doubledCapacity = 2 * capacity;
    }
    RingBuffer.prototype.wrap = function (index) {
        while (index < 0) {
            index += this.doubledCapacity;
        }
        return index % this.doubledCapacity;
    };
    RingBuffer.prototype.get = function (index) {
        if (index < 0) {
            throw new RangeError('Can\'t get item at a negative index.');
        }
        return this.data[index % this.capacity];
    };
    RingBuffer.prototype.set = function (index, value) {
        if (index < 0) {
            throw new RangeError('Can\'t set item at a negative index.');
        }
        this.data[index % this.capacity] = value;
    };
    RingBuffer.prototype.length = function () {
        var length = this.end - this.begin;
        if (length < 0) {
            length = this.doubledCapacity + length;
        }
        return length;
    };
    RingBuffer.prototype.isFull = function () {
        return this.length() === this.capacity;
    };
    RingBuffer.prototype.isEmpty = function () {
        return this.length() === 0;
    };
    RingBuffer.prototype.push = function (value) {
        if (this.isFull()) {
            throw new RangeError('Ring buffer is full.');
        }
        this.set(this.end, value);
        this.end = this.wrap(this.end + 1);
    };
    RingBuffer.prototype.pop = function () {
        if (this.isEmpty()) {
            throw new RangeError('Ring buffer is empty.');
        }
        this.end = this.wrap(this.end - 1);
        var result = this.get(this.end);
        this.set(this.end, undefined);
        return result;
    };
    RingBuffer.prototype.unshift = function (value) {
        if (this.isFull()) {
            throw new RangeError('Ring buffer is full.');
        }
        this.begin = this.wrap(this.begin - 1);
        this.set(this.begin, value);
    };
    RingBuffer.prototype.shift = function () {
        if (this.isEmpty()) {
            throw new RangeError('Ring buffer is empty.');
        }
        var result = this.get(this.begin);
        this.set(this.begin, undefined);
        this.begin = this.wrap(this.begin + 1);
        return result;
    };
    RingBuffer.prototype.shuffleExcise = function (relativeIndex) {
        if (this.isEmpty()) {
            throw new RangeError('Ring buffer is empty.');
        }
        var index = this.wrap(this.begin + relativeIndex);
        var result = this.get(index);
        this.set(index, this.pop());
        return result;
    };
    return RingBuffer;
}());
exports.RingBuffer = RingBuffer;

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dataset_1 = require("./data/dataset");
exports.Dataset = dataset_1.Dataset;
var dataset_2 = require("./data/dataset");
exports.datasetFromElements = dataset_2.datasetFromElements;
var csv_dataset_1 = require("./data/datasets/csv_dataset");
exports.CSVDataset = csv_dataset_1.CSVDataset;
var text_line_dataset_1 = require("./data/datasets/text_line_dataset");
exports.TextLineDataset = text_line_dataset_1.TextLineDataset;
var file_data_source_1 = require("./data/sources/file_data_source");
exports.FileDataSource = file_data_source_1.FileDataSource;
var url_data_source_1 = require("./data/sources/url_data_source");
exports.URLDataSource = url_data_source_1.URLDataSource;

},{"./data/dataset":13,"./data/datasets/csv_dataset":14,"./data/datasets/text_line_dataset":15,"./data/sources/file_data_source":17,"./data/sources/url_data_source":18}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tensor_1 = require("../tensor");
var MANIFEST_FILE = 'manifest.json';
var CheckpointLoader = (function () {
    function CheckpointLoader(urlPath) {
        this.urlPath = urlPath;
        if (this.urlPath.charAt(this.urlPath.length - 1) !== '/') {
            this.urlPath += '/';
        }
    }
    CheckpointLoader.prototype.loadManifest = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', _this.urlPath + MANIFEST_FILE);
            xhr.onload = function () {
                _this.checkpointManifest = JSON.parse(xhr.responseText);
                resolve();
            };
            xhr.onerror = function (error) {
                throw new Error(MANIFEST_FILE + " not found at " + _this.urlPath + ". " + error);
            };
            xhr.send();
        });
    };
    CheckpointLoader.prototype.getCheckpointManifest = function () {
        var _this = this;
        if (this.checkpointManifest == null) {
            return new Promise(function (resolve, reject) {
                _this.loadManifest().then(function () {
                    resolve(_this.checkpointManifest);
                });
            });
        }
        return new Promise(function (resolve, reject) {
            resolve(_this.checkpointManifest);
        });
    };
    CheckpointLoader.prototype.getAllVariables = function () {
        var _this = this;
        if (this.variables != null) {
            return new Promise(function (resolve, reject) {
                resolve(_this.variables);
            });
        }
        return new Promise(function (resolve, reject) {
            _this.getCheckpointManifest().then(function (checkpointDefinition) {
                var variableNames = Object.keys(_this.checkpointManifest);
                var variablePromises = [];
                for (var i = 0; i < variableNames.length; i++) {
                    variablePromises.push(_this.getVariable(variableNames[i]));
                }
                Promise.all(variablePromises).then(function (variables) {
                    _this.variables = {};
                    for (var i = 0; i < variables.length; i++) {
                        _this.variables[variableNames[i]] = variables[i];
                    }
                    resolve(_this.variables);
                });
            });
        });
    };
    CheckpointLoader.prototype.getVariable = function (varName) {
        var _this = this;
        if (!(varName in this.checkpointManifest)) {
            throw new Error('Cannot load non-existant variable ' + varName);
        }
        var variableRequestPromiseMethod = function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';
            var fname = _this.checkpointManifest[varName].filename;
            xhr.open('GET', _this.urlPath + fname);
            xhr.onload = function () {
                if (xhr.status === 404) {
                    throw new Error("Not found variable " + varName);
                }
                var values = new Float32Array(xhr.response);
                var tensor = tensor_1.Tensor.make(_this.checkpointManifest[varName].shape, { values: values });
                resolve(tensor);
            };
            xhr.onerror = function (error) {
                throw new Error("Could not fetch variable " + varName + ": " + error);
            };
            xhr.send();
        };
        if (this.checkpointManifest == null) {
            return new Promise(function (resolve, reject) {
                _this.loadManifest().then(function () {
                    new Promise(variableRequestPromiseMethod).then(resolve);
                });
            });
        }
        return new Promise(variableRequestPromiseMethod);
    };
    return CheckpointLoader;
}());
exports.CheckpointLoader = CheckpointLoader;

},{"../tensor":145}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tensor_1 = require("../tensor");
var util = require("../util");
var STATS_SAMPLE_PERCENTAGE = 0.1;
var InMemoryDataset = (function () {
    function InMemoryDataset(dataShapes) {
        this.dataShapes = dataShapes;
        this.normalizationInfo = {};
    }
    InMemoryDataset.prototype.getDataShape = function (dataIndex) {
        return this.dataShapes[dataIndex];
    };
    InMemoryDataset.prototype.getData = function () {
        return this.dataset;
    };
    InMemoryDataset.prototype.getStats = function () {
        var _this = this;
        if (this.dataset == null) {
            throw new Error('Data is null.');
        }
        return this.dataset.map(function (d) { return _this.getStatsForData(d); });
    };
    InMemoryDataset.prototype.getStatsForData = function (data) {
        var inputMin = Number.POSITIVE_INFINITY;
        var inputMax = Number.NEGATIVE_INFINITY;
        var exampleIndices = data.map(function (example, i) { return i; });
        util.shuffle(exampleIndices);
        exampleIndices =
            exampleIndices.slice(exampleIndices.length * STATS_SAMPLE_PERCENTAGE);
        for (var i = 0; i < exampleIndices.length; i++) {
            var inputValues = data[exampleIndices[i]].dataSync();
            for (var j = 0; j < inputValues.length; j++) {
                inputMin = Math.min(inputMin, inputValues[j]);
                inputMax = Math.max(inputMax, inputValues[j]);
            }
        }
        return {
            inputMin: inputMin,
            inputMax: inputMax,
            exampleCount: data.length,
            shape: data[0].shape,
        };
    };
    InMemoryDataset.prototype.normalizeExamplesToRange = function (examples, curLowerBounds, curUpperBounds, newLowerBounds, newUpperBounds) {
        var curBoundsIsPerDimension = (curUpperBounds instanceof Float32Array &&
            curLowerBounds instanceof Float32Array);
        var newBoundsIsPerDimension = (newLowerBounds instanceof Float32Array &&
            newUpperBounds instanceof Float32Array);
        var inputSize = util.sizeFromShape(examples[0].shape);
        var newExamples = [];
        examples.forEach(function (example) {
            var inputValues = example.dataSync();
            var normalizedValues = new Float32Array(inputSize);
            for (var j = 0; j < inputSize; j++) {
                var curLowerBound = curBoundsIsPerDimension ?
                    curLowerBounds[j] :
                    curLowerBounds;
                var curUpperBound = curBoundsIsPerDimension ?
                    curUpperBounds[j] :
                    curUpperBounds;
                var curRange = curUpperBound - curLowerBound;
                var newLowerBound = newBoundsIsPerDimension ?
                    newLowerBounds[j] :
                    newLowerBounds;
                var newUpperBound = newBoundsIsPerDimension ?
                    newUpperBounds[j] :
                    newUpperBounds;
                var newRange = newUpperBound - newLowerBound;
                if (curRange === 0) {
                    normalizedValues[j] = newLowerBound;
                }
                else {
                    normalizedValues[j] = newLowerBound +
                        newRange * (inputValues[j] - curLowerBound) / curRange;
                }
            }
            newExamples.push(tensor_1.Tensor.make(example.shape, { values: normalizedValues }, 'float32'));
        });
        return newExamples;
    };
    InMemoryDataset.prototype.computeBounds = function (dataIndex) {
        var _this = this;
        if (this.dataset == null) {
            throw new Error('Data is null.');
        }
        var size = util.sizeFromShape(this.dataset[dataIndex][0].shape);
        this.normalizationInfo[dataIndex] = {
            isNormalized: false,
            minValues: new Float32Array(size),
            maxValues: new Float32Array(size)
        };
        for (var i = 0; i < size; i++) {
            this.normalizationInfo[dataIndex].minValues[i] = Number.POSITIVE_INFINITY;
            this.normalizationInfo[dataIndex].maxValues[i] = Number.NEGATIVE_INFINITY;
        }
        this.dataset[dataIndex].forEach(function (example) {
            var inputValues = example.dataSync();
            for (var k = 0; k < size; k++) {
                _this.normalizationInfo[dataIndex].minValues[k] = Math.min(_this.normalizationInfo[dataIndex].minValues[k], inputValues[k]);
                _this.normalizationInfo[dataIndex].maxValues[k] = Math.max(_this.normalizationInfo[dataIndex].maxValues[k], inputValues[k]);
            }
        });
    };
    InMemoryDataset.prototype.normalizeWithinBounds = function (dataIndex, lowerBound, upperBound) {
        if (this.dataset == null) {
            throw new Error('Data is null.');
        }
        if (dataIndex >= this.dataset.length) {
            throw new Error('dataIndex out of bounds.');
        }
        if (this.normalizationInfo[dataIndex] == null) {
            this.computeBounds(dataIndex);
        }
        var curLowerBounds;
        var curUpperBounds;
        if (this.normalizationInfo[dataIndex].isNormalized) {
            curLowerBounds = this.normalizationInfo[dataIndex].lowerBound;
            curUpperBounds = this.normalizationInfo[dataIndex].upperBound;
        }
        else {
            curLowerBounds = this.normalizationInfo[dataIndex].minValues;
            curUpperBounds = this.normalizationInfo[dataIndex].maxValues;
        }
        this.dataset[dataIndex] = this.normalizeExamplesToRange(this.dataset[dataIndex], curLowerBounds, curUpperBounds, lowerBound, upperBound);
        this.normalizationInfo[dataIndex].isNormalized = true;
        this.normalizationInfo[dataIndex].lowerBound = lowerBound;
        this.normalizationInfo[dataIndex].upperBound = upperBound;
    };
    InMemoryDataset.prototype.isNormalized = function (dataIndex) {
        return this.normalizationInfo != null &&
            this.normalizationInfo[dataIndex].isNormalized;
    };
    InMemoryDataset.prototype.removeNormalization = function (dataIndex) {
        if (this.dataset == null) {
            throw new Error('Training or test data is null.');
        }
        if (!this.isNormalized(dataIndex)) {
            return;
        }
        this.dataset[dataIndex] = this.normalizeExamplesToRange(this.dataset[dataIndex], this.normalizationInfo[dataIndex].lowerBound, this.normalizationInfo[dataIndex].upperBound, this.normalizationInfo[dataIndex].minValues, this.normalizationInfo[dataIndex].maxValues);
        this.normalizationInfo[dataIndex].isNormalized = false;
    };
    InMemoryDataset.prototype.unnormalizeExamples = function (examples, dataIndex) {
        if (!this.isNormalized(dataIndex)) {
            return examples;
        }
        return this.normalizeExamplesToRange(examples, this.normalizationInfo[dataIndex].lowerBound, this.normalizationInfo[dataIndex].upperBound, this.normalizationInfo[dataIndex].minValues, this.normalizationInfo[dataIndex].maxValues);
    };
    InMemoryDataset.prototype.dispose = function () {
        if (this.dataset == null) {
            return;
        }
        for (var i = 0; i < this.dataset.length; i++) {
            for (var j = 0; j < this.dataset[i].length; j++) {
                this.dataset[i][j].dispose();
            }
        }
        this.dataset = [];
    };
    return InMemoryDataset;
}());
exports.InMemoryDataset = InMemoryDataset;

},{"../tensor":145,"../util":151}],30:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("../util");
var InMemoryShuffledInputProviderBuilder = (function () {
    function InMemoryShuffledInputProviderBuilder(inputs) {
        this.inputs = inputs;
        this.idx = 0;
        this.inputCounter = 0;
        this.epoch = 0;
        this.shuffledIndices = util.createShuffledIndices(inputs[0].length);
        this.numInputs = inputs.length;
        var numExamples = this.inputs[0].length;
        for (var i = 0; i < this.numInputs; i++) {
            util.assert(this.inputs[i].length === numExamples, 'Number of examples must match across different inputs.');
        }
        for (var i = 0; i < this.numInputs; i++) {
            var inputShape = this.inputs[i][0].shape;
            for (var j = 0; j < this.inputs[i].length; j++) {
                util.assertShapesMatch(inputShape, this.inputs[i][j].shape);
            }
        }
    }
    InMemoryShuffledInputProviderBuilder.prototype.getCurrentExampleIndex = function () {
        var returnIdx = this.idx;
        this.inputCounter++;
        if (this.inputCounter >= this.numInputs) {
            this.idx++;
            this.inputCounter = 0;
            if (this.idx >= this.inputs[0].length) {
                this.idx = 0;
                this.epoch++;
            }
        }
        return returnIdx;
    };
    InMemoryShuffledInputProviderBuilder.prototype.getNextInput = function (inputId) {
        var currentExampleIndex = this.getCurrentExampleIndex();
        return this.inputs[inputId][this.shuffledIndices[currentExampleIndex]];
    };
    InMemoryShuffledInputProviderBuilder.prototype.getEpoch = function () {
        return this.epoch;
    };
    InMemoryShuffledInputProviderBuilder.prototype.getInputProviders = function () {
        var inputProviders = [];
        for (var i = 0; i < this.numInputs; i++) {
            inputProviders.push(this.getInputProvider(i));
        }
        return inputProviders;
    };
    return InMemoryShuffledInputProviderBuilder;
}());
exports.InMemoryShuffledInputProviderBuilder = InMemoryShuffledInputProviderBuilder;
var InCPUMemoryShuffledInputProviderBuilder = (function (_super) {
    __extends(InCPUMemoryShuffledInputProviderBuilder, _super);
    function InCPUMemoryShuffledInputProviderBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InCPUMemoryShuffledInputProviderBuilder.prototype.getInputProvider = function (inputId) {
        var shuffledInputProvider = this;
        return {
            getNextCopy: function () {
                return shuffledInputProvider.getNextInput(inputId).clone();
            },
            disposeCopy: function (copy) {
                copy.dispose();
            }
        };
    };
    return InCPUMemoryShuffledInputProviderBuilder;
}(InMemoryShuffledInputProviderBuilder));
exports.InCPUMemoryShuffledInputProviderBuilder = InCPUMemoryShuffledInputProviderBuilder;
var InGPUMemoryShuffledInputProviderBuilder = (function (_super) {
    __extends(InGPUMemoryShuffledInputProviderBuilder, _super);
    function InGPUMemoryShuffledInputProviderBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InGPUMemoryShuffledInputProviderBuilder.prototype.getInputProvider = function (inputId) {
        var shuffledInputProvider = this;
        return {
            getNextCopy: function () {
                return shuffledInputProvider.getNextInput(inputId).clone();
            },
            disposeCopy: function (copy) {
                copy.dispose();
            }
        };
    };
    return InGPUMemoryShuffledInputProviderBuilder;
}(InMemoryShuffledInputProviderBuilder));
exports.InGPUMemoryShuffledInputProviderBuilder = InGPUMemoryShuffledInputProviderBuilder;

},{"../util":151}],31:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var tensor_1 = require("../tensor");
var util = require("../util");
var dataset_1 = require("./dataset");
var PARSING_IMAGE_CANVAS_HEIGHT_PX = 1000;
function getXhrDatasetConfig(jsonConfigPath) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', jsonConfigPath);
        xhr.onload = function () {
            resolve(JSON.parse(xhr.responseText));
        };
        xhr.onerror = function (error) {
            reject(error);
        };
        xhr.send();
    });
}
exports.getXhrDatasetConfig = getXhrDatasetConfig;
var XhrDataset = (function (_super) {
    __extends(XhrDataset, _super);
    function XhrDataset(xhrDatasetConfig) {
        var _this = _super.call(this, xhrDatasetConfig.data.map(function (x) { return x.shape; })) || this;
        _this.xhrDatasetConfig = xhrDatasetConfig;
        return _this;
    }
    XhrDataset.prototype.getTensor = function (info) {
        var dataPromise = info.dataType === 'png' ?
            parseTypedArrayFromPng(info, info.shape) :
            parseTypedArrayFromBinary(info);
        var inputSize = util.sizeFromShape(info.shape);
        return dataPromise.then(function (data) {
            var tensors = [];
            for (var i = 0; i < data.length / inputSize; i++) {
                var values = data.subarray(i * inputSize, (i + 1) * inputSize);
                var tensor = tensor_1.Tensor.make(info.shape, { values: new Float32Array(values) }, 'float32');
                tensors.push(tensor);
            }
            return tensors;
        });
    };
    XhrDataset.prototype.fetchData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promises = _this.xhrDatasetConfig.data.map(function (x) { return _this.getTensor(x); });
            Promise.all(promises).then(function (data) {
                _this.dataset = data;
                resolve();
            });
        });
    };
    return XhrDataset;
}(dataset_1.InMemoryDataset));
exports.XhrDataset = XhrDataset;
function parseTypedArrayFromBinary(info) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', info.path);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function (event) {
            var data = (info.dataType === 'float32') ?
                new Float32Array(xhr.response) :
                new Uint8Array(xhr.response);
            resolve(data);
        };
        xhr.onerror = function (err) { return reject(err); };
        xhr.send();
    });
}
function parseGrayscaleImageData(data, result, resultOffset) {
    var idx = resultOffset;
    for (var i = 0; i < data.length; i += 4) {
        result[idx++] = data[i];
    }
}
function parseRGBImageData(data, result, resultOffset) {
    var idx = resultOffset;
    for (var i = 0; i < data.length; i += 4) {
        result[idx] = data[i];
        result[idx + 1] = data[i + 1];
        result[idx + 2] = data[i + 2];
        idx += 3;
    }
}
function parseImage(img, shape) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var N = img.height;
    var inputSize = util.sizeFromShape(shape);
    var result = new Uint8Array(N * inputSize);
    if (img.width !== shape[0] * shape[1]) {
        throw new Error("Image width (" + img.width + ") must be multiple of " +
            ("rows*columns (" + shape[0] + "*" + shape[1] + ") of the tensor"));
    }
    canvas.width = img.width;
    canvas.height = PARSING_IMAGE_CANVAS_HEIGHT_PX;
    var sx = 0;
    var sWidth = canvas.width;
    var sHeight = canvas.height;
    var dx = 0;
    var dy = 0;
    var dWidth = sWidth;
    var dHeight = sHeight;
    var depth = shape[2];
    var offset = 0;
    var numPasses = Math.ceil(N / canvas.height);
    for (var pass = 0; pass < numPasses; ++pass) {
        var sy = pass * canvas.height;
        if ((pass === numPasses - 1) && (N % canvas.height > 0)) {
            canvas.height = N % canvas.height;
            sHeight = canvas.height;
            dHeight = sHeight;
        }
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        (depth === 1) ? parseGrayscaleImageData(data, result, offset) :
            parseRGBImageData(data, result, offset);
        offset += canvas.height * inputSize;
    }
    return result;
}
function parseTypedArrayFromPng(info, shape) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.setAttribute('crossOrigin', '');
        img.onload = function () {
            var result = parseImage(img, shape);
            img.src = '';
            img = null;
            resolve(result);
        };
        img.src = info.path;
    });
}

},{"../tensor":145,"../util":151,"./dataset":29}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isMobile() {
    var a = navigator.userAgent || navigator.vendor || window.opera;
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i
        .test(a) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
            .test(a.substr(0, 4));
}
exports.isMobile = isMobile;

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function doc(info) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
}
exports.doc = doc;

},{}],34:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./environment");
var globals_1 = require("./globals");
var ops = require("./ops/ops");
var profiler_1 = require("./profiler");
var tape_1 = require("./tape");
var tensor_1 = require("./tensor");
var util = require("./util");
var Engine = (function () {
    function Engine(backend, customBackend, safeMode) {
        this.backend = backend;
        this.customBackend = customBackend;
        this.safeMode = safeMode;
        this.registeredVariables = {};
        this.refCounter = new WeakMap();
        this.nextTapeNodeId = 0;
        this.numBytes = 0;
        this.numTensors = 0;
        this.numDataBuffers = 0;
        this.gradientScopeCount = 0;
        this.customGradientDepth = 0;
        this.activeScope = { keep: [], track: [] };
        this.scopeStack = [this.activeScope];
        this.profiler = new profiler_1.Profiler(backend);
    }
    Engine.prototype.runKernel = function (forwardFunc, inputs, backwardsFunc) {
        var _this = this;
        var result;
        var saved = [];
        var saveFunc = function (x) {
            saved.push(x);
            return x;
        };
        var scopeName = this.activeScope.name;
        if (!environment_1.ENV.get('DEBUG')) {
            result = forwardFunc(this.backend, saveFunc);
        }
        else {
            result = this.profiler.profileKernel(scopeName, function () { return forwardFunc(_this.backend, saveFunc); });
        }
        var recordKernel = this.activeTape != null && this.customGradientDepth === 0;
        if (recordKernel) {
            var tapeNode = {
                id: this.nextTapeNodeId++,
                name: scopeName,
                inputs: inputs,
                output: result,
            };
            if (backwardsFunc != null) {
                tapeNode.gradient = function (dy) { return backwardsFunc(dy, saved); };
            }
            this.activeTape.push(tapeNode);
        }
        return result;
    };
    Engine.prototype.registerTensor = function (a) {
        var refCount = this.refCounter.has(a.dataId) ? this.refCounter.get(a.dataId) : 0;
        this.numTensors++;
        if (refCount === 0) {
            this.numDataBuffers++;
            this.numBytes +=
                util.sizeFromShape(a.shape) * util.bytesPerElement(a.dtype);
            this.backend.register(a.dataId, a.shape, a.dtype);
        }
        this.refCounter.set(a.dataId, refCount + 1);
        if (!(a instanceof tensor_1.Variable)) {
            this.track(a);
        }
    };
    Engine.prototype.registerVariable = function (v) {
        if (this.registeredVariables[v.name] != null) {
            throw new Error("Variable with name " + v.name + " was already registered");
        }
        this.registeredVariables[v.name] = v;
    };
    Engine.prototype.disposeTensor = function (a) {
        if (!this.refCounter.has(a.dataId)) {
            return;
        }
        this.numTensors--;
        var refCount = this.refCounter.get(a.dataId);
        if (refCount <= 1) {
            this.refCounter.delete(a.dataId);
            this.backend.disposeData(a.dataId);
            this.numDataBuffers--;
            this.numBytes -=
                util.sizeFromShape(a.shape) * util.bytesPerElement(a.dtype);
        }
        else {
            this.refCounter.set(a.dataId, refCount - 1);
        }
    };
    Engine.prototype.memory = function () {
        var info = this.backend.memory();
        info.numTensors = this.numTensors;
        info.numDataBuffers = this.numDataBuffers;
        info.numBytes = this.numBytes;
        return info;
    };
    Engine.prototype.shouldRecord = function () {
        return this.activeTape != null && this.customGradientDepth === 0;
    };
    Engine.prototype.addTapeNode = function (inputs, result, gradientsFunc) {
        var inputsMap = {};
        inputs.forEach(function (input, idx) {
            inputsMap[idx] = input;
        });
        var gradient = function (dy) {
            var res = gradientsFunc(dy);
            var resMap = {};
            res.forEach(function (r, idx) {
                resMap[idx] = function () { return r; };
            });
            return resMap;
        };
        var tapeNode = {
            id: this.nextTapeNodeId++,
            name: this.activeScope.name,
            inputs: inputsMap,
            output: result,
            gradient: gradient
        };
        this.activeTape.push(tapeNode);
    };
    Engine.prototype.keep = function (result) {
        if (this.scopeStack.length === 1 && environment_1.ENV.engine.safeMode) {
            throw new Error('Safe mode is ON. Enclose all tensor operations inside dl.tidy(): ' +
                'dl.tidy(() => {...}) to avoid memory leaks.');
        }
        this.activeScope.keep.push(result);
        return result;
    };
    Engine.prototype.startScope = function (name, gradientsMode) {
        if (gradientsMode === void 0) { gradientsMode = false; }
        if (gradientsMode && this.gradientScopeCount === 0) {
            this.activeTape = [];
        }
        if (gradientsMode) {
            this.gradientScopeCount++;
        }
        var scopeInfo = { keep: [], track: [] };
        if (name) {
            scopeInfo.name = name;
        }
        this.scopeStack.push(scopeInfo);
        this.activeScope = scopeInfo;
    };
    Engine.prototype.endScope = function (result, gradientsMode) {
        var _this = this;
        if (gradientsMode === void 0) { gradientsMode = false; }
        if (gradientsMode) {
            this.gradientScopeCount--;
            if (this.gradientScopeCount === 0) {
                this.activeTape = null;
            }
        }
        var tensorsToKeep = this.activeScope.keep;
        var tensorsToTrackInParent = util.extractTensorsFromContainer(result);
        tensorsToKeep = tensorsToKeep.concat(tensorsToTrackInParent);
        for (var i = 0; i < this.activeScope.track.length; i++) {
            var tensor = this.activeScope.track[i];
            if (util.isTensorInList(tensor, tensorsToKeep)) {
                continue;
            }
            if (this.activeTape != null) {
                tensorsToTrackInParent.push(tensor);
            }
            else {
                tensor.dispose();
            }
        }
        this.scopeStack.pop();
        this.activeScope = this.scopeStack.length === 0 ?
            { keep: [], track: [] } :
            this.scopeStack[this.scopeStack.length - 1];
        tensorsToTrackInParent.forEach(function (tensor) {
            if (!util.isTensorInList(tensor, _this.activeScope.keep)) {
                _this.track(tensor);
            }
        });
    };
    Engine.prototype.dispose = function () {
        if (this.customBackend) {
            this.backend.dispose();
        }
    };
    Engine.prototype.gradients = function (f, xs, dy, allowNoGradients) {
        var _this = this;
        if (allowNoGradients === void 0) { allowNoGradients = false; }
        util.assert(xs.length > 0, 'gradients() received an empty list of xs.');
        return globals_1.tidy('gradients', function () {
            var y = f();
            util.assert(y instanceof tensor_1.Tensor, 'The result y returned by f() must be a tensor.');
            var filteredTape = tape_1.getFilteredNodesXToY(_this.activeTape, xs, y);
            if (!allowNoGradients && filteredTape.length === 0 && xs.length > 0) {
                throw new Error('Cannot compute gradient of y=f(x) with respect to x. Make sure ' +
                    'that the f you passed encloses all operations that lead from x ' +
                    'to y.');
            }
            var accumulatedGradientMap = {};
            accumulatedGradientMap[y.id] = (dy == null) ? ops.ones(y.shape) : dy;
            tape_1.backpropagateGradients(accumulatedGradientMap, filteredTape);
            var grads = xs.map(function (x) { return accumulatedGradientMap[x.id]; });
            return { value: y, grads: grads };
        }, true);
    };
    Engine.prototype.customGrad = function (f) {
        var _this = this;
        util.assert(util.isFunction(f), 'The f passed in customGrad(f) must be a function.');
        return function () {
            var inputs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                inputs[_i] = arguments[_i];
            }
            util.assert(inputs.every(function (t) { return t instanceof tensor_1.Tensor; }), 'The args passed in customGrad(f)(x1, x2,...) must all be tensors');
            _this.customGradientDepth++;
            var gradientsFunc;
            var gradientsMode = true;
            var result = globals_1.tidy(f.name, function () {
                var _a = f.apply(void 0, inputs), value = _a.value, gradFunc = _a.gradFunc;
                util.assert(value instanceof tensor_1.Tensor, 'The function f passed in customGrad(f) must return an object ' +
                    'where `obj.value` is a tensor');
                util.assert(util.isFunction(gradFunc), 'The function f passed in customGrad(f) must return an object ' +
                    'where `obj.gradFunc` is a function.');
                gradientsFunc = gradFunc;
                return value;
            }, gradientsMode);
            _this.customGradientDepth--;
            if (_this.shouldRecord()) {
                var gradFunc = function (dy) {
                    var res = gradientsFunc(dy);
                    var grads = Array.isArray(res) ? res : [res];
                    util.assert(grads.length === inputs.length, 'The function f passed in customGrad(f) must return an object ' +
                        'where `obj.gradFunc` is a function that returns the same ' +
                        'number of tensors as inputs passed to f(...).');
                    util.assert(grads.every(function (t) { return t instanceof tensor_1.Tensor; }), 'The function f passed in customGrad(f) must return an object ' +
                        'where `obj.gradFunc` is a function that returns a list of ' +
                        'only tensors.');
                    return grads;
                };
                _this.addTapeNode(inputs, result, gradFunc);
            }
            return result;
        };
    };
    Engine.prototype.write = function (dataId, values) {
        this.backend.write(dataId, values);
    };
    Engine.prototype.readSync = function (dataId) {
        return this.backend.readSync(dataId);
    };
    Engine.prototype.read = function (dataId) {
        return this.backend.read(dataId);
    };
    Engine.prototype.fromPixels = function (pixels, numChannels) {
        return this.backend.fromPixels(pixels, numChannels);
    };
    Engine.prototype.time = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var start, timingInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        start = performance.now();
                        return [4, this.backend.time(query)];
                    case 1:
                        timingInfo = _a.sent();
                        timingInfo.wallMs = performance.now() - start;
                        return [2, timingInfo];
                }
            });
        });
    };
    Engine.prototype.track = function (result) {
        if (this.scopeStack.length === 1 && this.safeMode) {
            throw new Error('Safe mode is ON. Enclose all tensor operations inside dl.tidy(): ' +
                'dl.tidy(() => {op();...}); to avoid memory leaks.');
        }
        this.activeScope.track.push(result);
        return result;
    };
    return Engine;
}());
exports.Engine = Engine;

},{"./environment":35,"./globals":36,"./ops/ops":122,"./profiler":143,"./tape":144,"./tensor":145,"./util":151}],35:[function(require,module,exports){
(function (global){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var device_util = require("./device_util");
var doc_1 = require("./doc");
var engine_1 = require("./engine");
var math_1 = require("./math");
var util = require("./util");
var Type;
(function (Type) {
    Type[Type["NUMBER"] = 0] = "NUMBER";
    Type[Type["BOOLEAN"] = 1] = "BOOLEAN";
    Type[Type["STRING"] = 2] = "STRING";
})(Type = exports.Type || (exports.Type = {}));
exports.URL_PROPERTIES = [
    { name: 'DEBUG', type: Type.BOOLEAN },
    { name: 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION', type: Type.NUMBER },
    { name: 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE', type: Type.BOOLEAN },
    { name: 'WEBGL_VERSION', type: Type.NUMBER },
    { name: 'WEBGL_FLOAT_TEXTURE_ENABLED', type: Type.BOOLEAN }, {
        name: 'WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED',
        type: Type.BOOLEAN
    },
    { name: 'BACKEND', type: Type.STRING }
];
function hasExtension(gl, extensionName) {
    var ext = gl.getExtension(extensionName);
    return ext != null;
}
function getWebGLRenderingContext(webGLVersion) {
    if (webGLVersion === 0) {
        throw new Error('Cannot get WebGL rendering context, WebGL is disabled.');
    }
    var tempCanvas = document.createElement('canvas');
    if (webGLVersion === 1) {
        return (tempCanvas.getContext('webgl') ||
            tempCanvas.getContext('experimental-webgl'));
    }
    return tempCanvas.getContext('webgl2');
}
function loseContext(gl) {
    if (gl != null) {
        var loseContextExtension = gl.getExtension('WEBGL_lose_context');
        if (loseContextExtension == null) {
            throw new Error('Extension WEBGL_lose_context not supported on this browser.');
        }
        loseContextExtension.loseContext();
    }
}
function isWebGLVersionEnabled(webGLVersion) {
    var gl = getWebGLRenderingContext(webGLVersion);
    if (gl != null) {
        loseContext(gl);
        return true;
    }
    return false;
}
function getWebGLDisjointQueryTimerVersion(webGLVersion) {
    if (webGLVersion === 0) {
        return 0;
    }
    var queryTimerVersion;
    var gl = getWebGLRenderingContext(webGLVersion);
    if (hasExtension(gl, 'EXT_disjoint_timer_query_webgl2') &&
        webGLVersion === 2) {
        queryTimerVersion = 2;
    }
    else if (hasExtension(gl, 'EXT_disjoint_timer_query')) {
        queryTimerVersion = 1;
    }
    else {
        queryTimerVersion = 0;
    }
    if (gl != null) {
        loseContext(gl);
    }
    return queryTimerVersion;
}
function isFloatTextureReadPixelsEnabled(webGLVersion) {
    if (webGLVersion === 0) {
        return false;
    }
    var gl = getWebGLRenderingContext(webGLVersion);
    if (webGLVersion === 1) {
        if (!hasExtension(gl, 'OES_texture_float')) {
            return false;
        }
    }
    else {
        if (!hasExtension(gl, 'EXT_color_buffer_float')) {
            return false;
        }
    }
    var frameBuffer = gl.createFramebuffer();
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    var internalFormat = webGLVersion === 2 ? gl.RGBA32F : gl.RGBA;
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 1, 1, 0, gl.RGBA, gl.FLOAT, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    var frameBufferComplete = (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, new Float32Array(4));
    var readPixelsNoError = gl.getError() === gl.NO_ERROR;
    loseContext(gl);
    return frameBufferComplete && readPixelsNoError;
}
function isWebGLGetBufferSubDataAsyncExtensionEnabled(webGLVersion) {
    if (webGLVersion !== 2) {
        return false;
    }
    var gl = getWebGLRenderingContext(webGLVersion);
    var isEnabled = hasExtension(gl, 'WEBGL_get_buffer_sub_data_async');
    loseContext(gl);
    return isEnabled;
}
var SUPPORTED_BACKENDS = ['webgl', 'cpu'];
var Environment = (function () {
    function Environment(features) {
        this.features = {};
        this.BACKEND_REGISTRY = {};
        this.backends = this.BACKEND_REGISTRY;
        if (features != null) {
            this.features = features;
        }
        if (this.get('DEBUG')) {
            console.warn('Debugging mode is ON. The output of every math call will ' +
                'be downloaded to CPU and checked for NaNs. ' +
                'This significantly impacts performance.');
        }
    }
    Environment.setBackend = function (backendType, safeMode) {
        if (safeMode === void 0) { safeMode = false; }
        if (!(backendType in exports.ENV.backends)) {
            throw new Error("Backend type '" + backendType + "' not found in registry");
        }
        exports.ENV.globalMath = new math_1.NDArrayMath(backendType, safeMode);
    };
    Environment.getBackend = function () {
        exports.ENV.initEngine();
        return exports.ENV.currentBackendType;
    };
    Environment.memory = function () {
        return exports.ENV.engine.memory();
    };
    Environment.prototype.get = function (feature) {
        if (feature in this.features) {
            return this.features[feature];
        }
        this.features[feature] = this.evaluateFeature(feature);
        return this.features[feature];
    };
    Environment.prototype.set = function (feature, value) {
        this.features[feature] = value;
    };
    Environment.prototype.getBestBackendType = function () {
        for (var i = 0; i < SUPPORTED_BACKENDS.length; ++i) {
            var backendId = SUPPORTED_BACKENDS[i];
            if (backendId in this.backends) {
                return backendId;
            }
        }
        throw new Error('No backend found in registry.');
    };
    Environment.prototype.evaluateFeature = function (feature) {
        if (feature === 'DEBUG') {
            return false;
        }
        else if (feature === 'BACKEND') {
            return this.getBestBackendType();
        }
        else if (feature === 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') {
            var webGLVersion = this.get('WEBGL_VERSION');
            if (webGLVersion === 0) {
                return 0;
            }
            return getWebGLDisjointQueryTimerVersion(webGLVersion);
        }
        else if (feature === 'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE') {
            return this.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0 &&
                !device_util.isMobile();
        }
        else if (feature === 'WEBGL_VERSION') {
            if (isWebGLVersionEnabled(2)) {
                return 2;
            }
            else if (isWebGLVersionEnabled(1)) {
                return 1;
            }
            return 0;
        }
        else if (feature === 'WEBGL_FLOAT_TEXTURE_ENABLED') {
            return isFloatTextureReadPixelsEnabled(this.get('WEBGL_VERSION'));
        }
        else if (feature === 'WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED') {
            return isWebGLGetBufferSubDataAsyncExtensionEnabled(this.get('WEBGL_VERSION'));
        }
        throw new Error("Unknown feature " + feature + ".");
    };
    Environment.prototype.setFeatures = function (features) {
        this.reset();
        this.features = features;
        this.backends = {};
    };
    Environment.prototype.reset = function () {
        this.features = getFeaturesFromURL();
        if (this.globalMath != null) {
            this.globalMath.dispose();
            this.globalMath = null;
            this.globalEngine = null;
        }
        if (this.backends !== this.BACKEND_REGISTRY) {
            for (var name_1 in this.backends) {
                this.backends[name_1].dispose();
            }
            this.backends = this.BACKEND_REGISTRY;
        }
    };
    Environment.prototype.setMath = function (math, backend, safeMode) {
        if (safeMode === void 0) { safeMode = false; }
        if (this.globalMath === math) {
            return;
        }
        var customBackend = false;
        if (typeof backend === 'string') {
            this.currentBackendType = backend;
            backend = exports.ENV.findBackend(backend);
        }
        else {
            customBackend = true;
            this.currentBackendType = 'custom';
        }
        this.globalEngine = new engine_1.Engine(backend, customBackend, safeMode);
        this.globalMath = math;
    };
    Environment.prototype.findBackend = function (name) {
        return this.backends[name];
    };
    Environment.prototype.addCustomBackend = function (name, factory) {
        if (name in this.backends) {
            throw new Error(name + " backend was already registered");
        }
        try {
            var backend = factory();
            this.backends[name] = backend;
            return true;
        }
        catch (err) {
            return false;
        }
    };
    Environment.prototype.registerBackend = function (name, factory) {
        if (name in this.BACKEND_REGISTRY) {
            throw new Error(name + " backend was already registered as global");
        }
        try {
            var backend = factory();
            this.BACKEND_REGISTRY[name] = backend;
            return true;
        }
        catch (err) {
            return false;
        }
    };
    Object.defineProperty(Environment.prototype, "math", {
        get: function () {
            this.initEngine();
            return this.globalMath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Environment.prototype, "engine", {
        get: function () {
            this.initEngine();
            return this.globalEngine;
        },
        enumerable: true,
        configurable: true
    });
    Environment.prototype.initEngine = function () {
        if (this.globalEngine == null) {
            this.globalMath =
                new math_1.NDArrayMath(exports.ENV.get('BACKEND'), false);
        }
    };
    __decorate([
        doc_1.doc({ heading: 'Environment' })
    ], Environment, "setBackend", null);
    __decorate([
        doc_1.doc({ heading: 'Environment' })
    ], Environment, "getBackend", null);
    __decorate([
        doc_1.doc({ heading: 'Performance', subheading: 'Memory' })
    ], Environment, "memory", null);
    return Environment;
}());
exports.Environment = Environment;
var DEEPLEARNJS_FLAGS_PREFIX = 'dljsflags';
function getFeaturesFromURL() {
    var features = {};
    if (typeof window === 'undefined') {
        return features;
    }
    var urlParams = util.getQueryParams(window.location.search);
    if (DEEPLEARNJS_FLAGS_PREFIX in urlParams) {
        var urlFlags_1 = {};
        var keyValues = urlParams[DEEPLEARNJS_FLAGS_PREFIX].split(',');
        keyValues.forEach(function (keyValue) {
            var _a = keyValue.split(':'), key = _a[0], value = _a[1];
            urlFlags_1[key] = value;
        });
        exports.URL_PROPERTIES.forEach(function (urlProperty) {
            if (urlProperty.name in urlFlags_1) {
                console.log("Setting feature override from URL " + urlProperty.name + ": " +
                    ("" + urlFlags_1[urlProperty.name]));
                if (urlProperty.type === Type.NUMBER) {
                    features[urlProperty.name] = +urlFlags_1[urlProperty.name];
                }
                else if (urlProperty.type === Type.BOOLEAN) {
                    features[urlProperty.name] = urlFlags_1[urlProperty.name] === 'true';
                }
                else if (urlProperty.type === Type.STRING) {
                    features[urlProperty.name] = urlFlags_1[urlProperty.name];
                }
                else {
                    console.warn("Unknown URL param: " + urlProperty.name + ".");
                }
            }
        });
    }
    return features;
}
function getGlobalNamespace() {
    var ns;
    if (typeof (window) !== 'undefined') {
        ns = window;
    }
    else if (typeof (global) !== 'undefined') {
        ns = global;
    }
    else {
        throw new Error('Could not find a global object');
    }
    return ns;
}
function getOrMakeEnvironment() {
    var ns = getGlobalNamespace();
    ns.ENV = ns.ENV || new Environment(getFeaturesFromURL());
    return ns.ENV;
}
exports.ENV = getOrMakeEnvironment();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./device_util":32,"./doc":33,"./engine":34,"./math":104,"./util":151}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gradients_1 = require("./gradients");
var tracking_1 = require("./tracking");
exports.tidy = tracking_1.Tracking.tidy;
exports.keep = tracking_1.Tracking.keep;
exports.dispose = tracking_1.Tracking.dispose;
exports.time = tracking_1.Tracking.time;
exports.grad = gradients_1.Gradients.grad;
exports.valueAndGrad = gradients_1.Gradients.valueAndGrad;
exports.grads = gradients_1.Gradients.grads;
exports.valueAndGrads = gradients_1.Gradients.valueAndGrads;
exports.variableGrads = gradients_1.Gradients.variableGrads;
exports.customGrad = gradients_1.Gradients.customGrad;

},{"./gradients":37,"./tracking":148}],37:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("./doc");
var environment_1 = require("./environment");
var globals_1 = require("./globals");
var tensor_1 = require("./tensor");
var util = require("./util");
var Gradients = (function () {
    function Gradients() {
    }
    Gradients.gradScope = function (nameOrScopeFn, scopeFn) {
        return globals_1.tidy(nameOrScopeFn, scopeFn, true);
    };
    Gradients.grad = function (f) {
        util.assert(util.isFunction(f), 'The f passed in grad(f) must be a function');
        return function (x, dy) {
            util.assert(x instanceof tensor_1.Tensor, 'The x passed in grad(f)(x) must be a tensor');
            util.assert(dy == null || dy instanceof tensor_1.Tensor, 'The dy passed in grad(f)(x, dy) must be a tensor');
            var _a = environment_1.ENV.engine.gradients(function () { return f(x); }, [x], dy), value = _a.value, grads = _a.grads;
            if (dy != null) {
                util.assertShapesMatch(value.shape, dy.shape, 'The shape of dy passed in grad(f)(x, dy) must match the shape ' +
                    'returned by f(x)');
            }
            value.dispose();
            checkGrads(grads);
            return grads[0];
        };
    };
    Gradients.grads = function (f) {
        util.assert(util.isFunction(f), 'The f passed in grads(f) must be a function');
        return function (args, dy) {
            util.assert(Array.isArray(args) && args.every(function (arg) { return arg instanceof tensor_1.Tensor; }), 'The args passed in grads(f)(args) must be an array of tensors');
            util.assert(dy == null || dy instanceof tensor_1.Tensor, 'The dy passed in grads(f)(args, dy) must be a tensor');
            var _a = environment_1.ENV.engine.gradients(function () { return f.apply(void 0, args); }, args, dy), value = _a.value, grads = _a.grads;
            if (dy != null) {
                util.assertShapesMatch(value.shape, dy.shape, 'The shape of dy passed in grads(f)([x1,...], dy) must match the ' +
                    'shape returned by f([x1,...])');
            }
            value.dispose();
            checkGrads(grads);
            return grads;
        };
    };
    Gradients.valueAndGrad = function (f) {
        util.assert(util.isFunction(f), 'The f passed in valueAndGrad(f) must be a function');
        return function (x, dy) {
            util.assert(x instanceof tensor_1.Tensor, 'The x passed in valueAndGrad(f)(x) must be a tensor');
            util.assert(dy == null || dy instanceof tensor_1.Tensor, 'The dy passed in valueAndGrad(f)(x, dy) must be a tensor');
            var _a = environment_1.ENV.engine.gradients(function () { return f(x); }, [x], dy), grads = _a.grads, value = _a.value;
            checkGrads(grads);
            return { grad: grads[0], value: value };
        };
    };
    Gradients.valueAndGrads = function (f) {
        util.assert(util.isFunction(f), 'The f passed in valueAndGrads(f) must be a function');
        return function (args, dy) {
            util.assert(Array.isArray(args) && args.every(function (arg) { return arg instanceof tensor_1.Tensor; }), 'The args passed in valueAndGrads(f)(args) must be array of tensors');
            util.assert(dy == null || dy instanceof tensor_1.Tensor, 'The dy passed in valueAndGrads(f)(args, dy) must be a tensor');
            var res = environment_1.ENV.engine.gradients(function () { return f.apply(void 0, args); }, args, dy);
            if (dy != null) {
                util.assertShapesMatch(res.value.shape, dy.shape, 'The shape of dy passed in valueAndGrads(f)([x1,...], dy) must ' +
                    'match the shape returned by f([x1,...])');
            }
            checkGrads(res.grads);
            return res;
        };
    };
    Gradients.variableGrads = function (f, varList) {
        util.assert(util.isFunction(f), 'The f passed in variableGrads(f) must be a function');
        util.assert(varList == null ||
            Array.isArray(varList) && varList.every(function (v) { return v instanceof tensor_1.Variable; }), 'The varList passed in variableGrads(f, varList) must be an array ' +
            'of variables');
        if (varList == null) {
            varList = [];
            for (var varName in environment_1.ENV.engine.registeredVariables) {
                varList.push(environment_1.ENV.engine.registeredVariables[varName]);
            }
        }
        var originalVarCount = varList.length;
        varList = varList.filter(function (variable) { return variable.trainable; });
        util.assert(varList.length > 0, "variableGrads() expects at least one of the input variables to be " +
            ("trainable, but none of the " + originalVarCount + " variables is ") +
            "trainable.");
        var allowNoGradients = true;
        var _a = environment_1.ENV.engine.gradients(f, varList, null, allowNoGradients), value = _a.value, grads = _a.grads;
        util.assert(grads.some(function (g) { return g != null; }), 'Cannot find a connection between any variable and the result of the ' +
            'loss function y=f(x). Please make sure the operations that use ' +
            'variables are inside the function f passed to minimize().');
        util.assert(value.rank === 0, "The f passed in variableGrads(f) must return a scalar, but it " +
            ("returned a rank-" + value.rank + " tensor"));
        var namedGrads = {};
        varList.forEach(function (v, i) {
            if (grads[i] != null) {
                namedGrads[v.name] = grads[i];
            }
        });
        return { value: value, grads: namedGrads };
    };
    Gradients.customGrad = function (f) {
        return environment_1.ENV.engine.customGrad(f);
    };
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "grad", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "grads", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "valueAndGrad", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "valueAndGrads", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "variableGrads", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Gradients' })
    ], Gradients, "customGrad", null);
    return Gradients;
}());
exports.Gradients = Gradients;
function checkGrads(grads) {
    var numNullGradients = grads.filter(function (g) { return g == null; }).length;
    if (numNullGradients > 0) {
        throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that\n    the f you passed encloses all operations that lead from x to y.");
    }
}

},{"./doc":33,"./environment":35,"./globals":36,"./tensor":145,"./util":151}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../globals");
var tensor_1 = require("../tensor");
var TanHFunc = (function () {
    function TanHFunc() {
        this.one = tensor_1.Scalar.new(1);
    }
    TanHFunc.prototype.output = function (math, x) {
        return math.tanh(x);
    };
    TanHFunc.prototype.der = function (math, x, y) {
        var _this = this;
        return globals_1.tidy(function () {
            var ySquared = math.multiplyStrict(y, y);
            return math.subtract(_this.one, ySquared);
        });
    };
    TanHFunc.prototype.dispose = function () {
        this.one.dispose();
    };
    return TanHFunc;
}());
exports.TanHFunc = TanHFunc;
var ReLUFunc = (function () {
    function ReLUFunc() {
    }
    ReLUFunc.prototype.output = function (math, x) {
        return math.relu(x);
    };
    ReLUFunc.prototype.der = function (math, x, y) {
        return math.step(x);
    };
    ReLUFunc.prototype.dispose = function () { };
    return ReLUFunc;
}());
exports.ReLUFunc = ReLUFunc;
var LeakyReluFunc = (function () {
    function LeakyReluFunc(alpha) {
        this.alpha = alpha;
    }
    LeakyReluFunc.prototype.output = function (math, x) {
        return math.leakyRelu(x, this.alpha);
    };
    LeakyReluFunc.prototype.der = function (math, x, y) {
        return math.step(x, this.alpha);
    };
    LeakyReluFunc.prototype.dispose = function () { };
    return LeakyReluFunc;
}());
exports.LeakyReluFunc = LeakyReluFunc;
var SigmoidFunc = (function () {
    function SigmoidFunc() {
    }
    SigmoidFunc.prototype.output = function (math, x) {
        return math.sigmoid(x);
    };
    SigmoidFunc.prototype.der = function (math, x, y) {
        return globals_1.tidy(function () {
            var ySquared = math.multiplyStrict(y, y);
            return math.subStrict(y, ySquared);
        });
    };
    SigmoidFunc.prototype.dispose = function () { };
    return SigmoidFunc;
}());
exports.SigmoidFunc = SigmoidFunc;
var SquareFunc = (function () {
    function SquareFunc() {
        this.two = tensor_1.Scalar.new(2);
    }
    SquareFunc.prototype.output = function (math, x) {
        return math.multiplyStrict(x, x);
    };
    SquareFunc.prototype.der = function (math, x, y) {
        return math.multiply(this.two, x);
    };
    SquareFunc.prototype.dispose = function () {
        this.two.dispose();
    };
    return SquareFunc;
}());
exports.SquareFunc = SquareFunc;
var EluFunc = (function () {
    function EluFunc() {
    }
    EluFunc.prototype.output = function (math, x) {
        return math.elu(x);
    };
    EluFunc.prototype.der = function (math, x, y) {
        throw new Error('Not implemented');
    };
    EluFunc.prototype.dispose = function () { };
    return EluFunc;
}());
exports.EluFunc = EluFunc;

},{"../globals":36,"../tensor":145}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../globals");
var ops = require("../ops/ops");
var SquareCostFunc = (function () {
    function SquareCostFunc() {
        this.halfOne = globals_1.keep(ops.scalar(0.5));
    }
    SquareCostFunc.prototype.cost = function (x1, x2) {
        var diff = x1.subStrict(x2);
        var diffSquared = diff.square();
        var result = this.halfOne.mul(diffSquared);
        diff.dispose();
        diffSquared.dispose();
        return result;
    };
    SquareCostFunc.prototype.der = function (x1, x2) {
        return x1.subStrict(x2);
    };
    SquareCostFunc.prototype.dispose = function () {
        this.halfOne.dispose();
    };
    return SquareCostFunc;
}());
exports.SquareCostFunc = SquareCostFunc;

},{"../globals":36,"../ops/ops":122}],40:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var concat_util = require("../ops/concat_util");
var conv_util = require("../ops/conv_util");
var tensor_1 = require("../tensor");
var util = require("../util");
var initializers_1 = require("./initializers");
var GraphLayers = (function () {
    function GraphLayers(g) {
        this.g = g;
    }
    GraphLayers.prototype.dense = function (name, x, units, activation, useBias, kernelInitializer, biasInitializer) {
        if (activation === void 0) { activation = null; }
        if (useBias === void 0) { useBias = true; }
        if (kernelInitializer === void 0) { kernelInitializer = new initializers_1.VarianceScalingInitializer(); }
        if (biasInitializer === void 0) { biasInitializer = new initializers_1.ZerosInitializer(); }
        var weights = this.g.variable(name + '-weights', kernelInitializer.initialize([x.shape[0], units], x.shape[0], units));
        var out = this.g.matmul(x, weights);
        if (useBias) {
            var bias = this.g.variable(name + '-bias', biasInitializer.initialize([units], x.shape[0], units));
            out = this.g.add(out, bias);
        }
        if (activation != null) {
            out = activation(out);
        }
        return out;
    };
    return GraphLayers;
}());
exports.GraphLayers = GraphLayers;
var Graph = (function () {
    function Graph() {
        this.nodes = [];
        this.layers = new GraphLayers(this);
    }
    Graph.prototype.variable = function (name, data) {
        return this.addNodeAndReturnOutput(new VariableNode(this, name, data));
    };
    Graph.prototype.placeholder = function (name, shape) {
        return this.addNodeAndReturnOutput(new PlaceholderNode(this, name, shape));
    };
    Graph.prototype.constant = function (value) {
        var finalValue;
        if (typeof value === 'number') {
            finalValue = tensor_1.Scalar.new(value);
        }
        else if (value instanceof tensor_1.Tensor) {
            finalValue = value;
        }
        else if (value instanceof Array) {
            var flatValues = util.flatten(value);
            var vals = new Float32Array(flatValues);
            finalValue = tensor_1.Tensor.make(util.inferShape(value), { values: vals });
        }
        else {
            throw new Error('unimplemented constant type.');
        }
        return this.addNodeAndReturnOutput(new ConstantNode(this, finalValue));
    };
    Graph.prototype.reshape = function (x, shape) {
        return this.addNodeAndReturnOutput(new ReshapeNode(this, 'Reshape', x, shape));
    };
    Graph.prototype.fusedLinearCombination = function (x1, x2, c1, c2) {
        return this.addNodeAndReturnOutput(new FusedLinearCombinationNode(this, x1, x2, c1, c2));
    };
    Graph.prototype.add = function (x1, x2) {
        return this.addNodeAndReturnOutput(new AddNode(this, x1, x2));
    };
    Graph.prototype.subtract = function (x1, x2) {
        return this.addNodeAndReturnOutput(new SubtractNode(this, x1, x2));
    };
    Graph.prototype.multiply = function (x1, x2) {
        return this.addNodeAndReturnOutput(new MultiplyNode(this, x1, x2));
    };
    Graph.prototype.divide = function (x1, x2) {
        return this.addNodeAndReturnOutput(new DivideNode(this, x1, x2));
    };
    Graph.prototype.reduceSum = function (x) {
        return this.addNodeAndReturnOutput(new ReduceSumNode(this, x));
    };
    Graph.prototype.concat1d = function (x1, x2) {
        return this.addNodeAndReturnOutput(new Concat1DNode(this, x1, x2));
    };
    Graph.prototype.concat2d = function (x1, x2, axis) {
        return this.addNodeAndReturnOutput(new Concat2DNode(this, x1, x2, axis));
    };
    Graph.prototype.concat3d = function (x1, x2, axis) {
        return this.addNodeAndReturnOutput(new Concat3DNode(this, x1, x2, axis));
    };
    Graph.prototype.concat4d = function (x1, x2, axis) {
        return this.addNodeAndReturnOutput(new Concat4DNode(this, x1, x2, axis));
    };
    Graph.prototype.matmul = function (x1, x2) {
        return this.addNodeAndReturnOutput(new MatMulNode(this, x1, x2));
    };
    Graph.prototype.conv2d = function (x, w, b, fieldSize, outputDepth, stride, zeroPad) {
        if (stride === void 0) { stride = 1; }
        return this.addNodeAndReturnOutput(new Convolution2DNode(this, x, w, b, fieldSize, outputDepth, stride, zeroPad));
    };
    Graph.prototype.maxPool = function (x, fieldSize, stride, zeroPad) {
        if (stride === void 0) { stride = 1; }
        return this.addNodeAndReturnOutput(new MaxPoolNode(this, x, fieldSize, stride, zeroPad));
    };
    Graph.prototype.exp = function (x) {
        return this.addNodeAndReturnOutput(new ExpNode(this, x));
    };
    Graph.prototype.log = function (x) {
        return this.addNodeAndReturnOutput(new LogNode(this, x));
    };
    Graph.prototype.relu = function (x) {
        return this.addNodeAndReturnOutput(new ReLUNode(this, x));
    };
    Graph.prototype.leakyRelu = function (x, alpha) {
        return this.addNodeAndReturnOutput(new LeakyReLUNode(this, x, alpha));
    };
    Graph.prototype.prelu = function (x, alpha) {
        return this.addNodeAndReturnOutput(new PReLUNode(this, x, alpha));
    };
    Graph.prototype.elu = function (x) {
        return this.addNodeAndReturnOutput(new EluNode(this, x));
    };
    Graph.prototype.tanh = function (x) {
        return this.addNodeAndReturnOutput(new TanHNode(this, x));
    };
    Graph.prototype.sigmoid = function (x) {
        return this.addNodeAndReturnOutput(new SigmoidNode(this, x));
    };
    Graph.prototype.square = function (x) {
        return this.addNodeAndReturnOutput(new SquareNode(this, x));
    };
    Graph.prototype.softmax = function (x) {
        return this.addNodeAndReturnOutput(new SoftmaxNode(this, x));
    };
    Graph.prototype.softmaxCrossEntropyCost = function (x, target) {
        return this.addNodeAndReturnOutput(new SoftmaxCrossEntropyCostNode(this, x, target));
    };
    Graph.prototype.meanSquaredCost = function (label, prediction) {
        return this.addNodeAndReturnOutput(new MeanSquaredCostNode(this, label, prediction));
    };
    Graph.prototype.argmax = function (x) {
        return this.addNodeAndReturnOutput(new ArgMaxNode(this, x));
    };
    Graph.prototype.argmaxEquals = function (x1, x2) {
        return this.addNodeAndReturnOutput(new ArgMaxEqualsNode(this, x1, x2));
    };
    Graph.prototype.addNodeAndReturnOutput = function (node) {
        this.nodes.push(node);
        node.validate();
        return node.output;
    };
    Graph.prototype.getNodes = function () {
        return this.nodes;
    };
    return Graph;
}());
exports.Graph = Graph;
var SymbolicTensor = (function (_super) {
    __extends(SymbolicTensor, _super);
    function SymbolicTensor(shape) {
        var _this = _super.call(this, [], 'float32') || this;
        _this.shape = shape;
        _this.id = SymbolicTensor.nextID++;
        return _this;
    }
    SymbolicTensor.nextID = 0;
    return SymbolicTensor;
}(tensor_1.Tensor));
exports.SymbolicTensor = SymbolicTensor;
var Node = (function () {
    function Node(graph, name, inputs, output) {
        this.graph = graph;
        this.name = name;
        this.inputs = inputs;
        this.output = output;
        this.id = Node.nextID++;
        output.node = this;
    }
    Node.nextID = 0;
    return Node;
}());
exports.Node = Node;
var VariableNode = (function (_super) {
    __extends(VariableNode, _super);
    function VariableNode(graph, name, data) {
        var _this = _super.call(this, graph, name, {}, new SymbolicTensor(data.shape)) || this;
        _this.data = data;
        return _this;
    }
    VariableNode.prototype.validate = function () {
        util.assert(this.data != null, 'Error adding variable op: Data for variable \'' + this.name +
            '\' is null or undefined');
    };
    return VariableNode;
}(Node));
exports.VariableNode = VariableNode;
var PlaceholderNode = (function (_super) {
    __extends(PlaceholderNode, _super);
    function PlaceholderNode(graph, name, shape) {
        return _super.call(this, graph, name, {}, new SymbolicTensor(shape)) || this;
    }
    PlaceholderNode.prototype.validate = function () { };
    return PlaceholderNode;
}(Node));
exports.PlaceholderNode = PlaceholderNode;
var ConstantNode = (function (_super) {
    __extends(ConstantNode, _super);
    function ConstantNode(graph, data) {
        var _this = _super.call(this, graph, 'Constant', {}, new SymbolicTensor(data.shape)) || this;
        _this.data = data;
        return _this;
    }
    ConstantNode.prototype.validate = function () {
        util.assert(this.data != null, 'Error adding constant: data for placeholder \'' + this.name +
            '\' is null or undefined');
    };
    return ConstantNode;
}(Node));
exports.ConstantNode = ConstantNode;
var ReshapeNode = (function (_super) {
    __extends(ReshapeNode, _super);
    function ReshapeNode(graph, name, x, shape) {
        var _this = _super.call(this, graph, name, { x: x }, new SymbolicTensor(shape)) || this;
        _this.name = name;
        _this.x = x;
        _this.shape = shape;
        return _this;
    }
    ReshapeNode.prototype.validate = function () {
        var xSize = util.sizeFromShape(this.x.shape);
        var shapeSize = util.sizeFromShape(this.shape);
        util.assert(xSize === shapeSize, "Error making reshape operation: input to reshape '" + this.name + "'" +
            (" of shape (" + this.x.shape + ") does not match size of ") +
            ("requested shape " + this.shape + "."));
    };
    ReshapeNode.X = 'x';
    return ReshapeNode;
}(Node));
exports.ReshapeNode = ReshapeNode;
var FusedLinearCombinationNode = (function (_super) {
    __extends(FusedLinearCombinationNode, _super);
    function FusedLinearCombinationNode(graph, t1, t2, c1, c2) {
        var _this = _super.call(this, graph, 'Linear Combination', { t1: t1, t2: t2, c1: c1, c2: c2 }, new SymbolicTensor(t1.shape)) || this;
        _this.t1 = t1;
        _this.t2 = t2;
        _this.c1 = c1;
        _this.c2 = c2;
        return _this;
    }
    FusedLinearCombinationNode.prototype.validate = function () {
        util.assertShapesMatch(this.t1.shape, this.t2.shape);
        if (!util.isScalarShape(this.c1.shape)) {
            throw new Error('Error adding fusedLinearCombination: c1 is not a scalar, got ' +
                ("shape: " + this.c1.shape));
        }
        if (!util.isScalarShape(this.c2.shape)) {
            throw new Error('Error adding fusedLinearCombination: c2 is not a scalar, got ' +
                ("shape: " + this.c2.shape));
        }
    };
    FusedLinearCombinationNode.T1 = 't1';
    FusedLinearCombinationNode.T2 = 't2';
    FusedLinearCombinationNode.C1 = 'c1';
    FusedLinearCombinationNode.C2 = 'c2';
    return FusedLinearCombinationNode;
}(Node));
exports.FusedLinearCombinationNode = FusedLinearCombinationNode;
var AddNode = (function (_super) {
    __extends(AddNode, _super);
    function AddNode(graph, t1, t2) {
        var _this = _super.call(this, graph, 'Add', { t1: t1, t2: t2 }, new SymbolicTensor(util.sizeFromShape(t1.shape) === 1 ?
            t2.shape :
            (t1.shape.length < t2.shape.length ? t2.shape : t1.shape))) || this;
        _this.t1 = t1;
        _this.t2 = t2;
        return _this;
    }
    AddNode.prototype.validate = function () {
        util.assert(util.sizeFromShape(this.t1.shape) === 1 ||
            util.sizeFromShape(this.t2.shape) === 1 ||
            util.arraysEqual(this.t1.shape, this.t2.shape) ||
            (this.t1.shape.length === 2 && this.t2.shape.length === 1 &&
                this.t1.shape[1] === this.t2.shape[0]) ||
            (this.t1.shape.length === 1 && this.t2.shape.length === 2 &&
                this.t1.shape[0] === this.t2.shape[1]), 'Error adding add operation op: one of inputs must be scalar, ' +
            ("shapes " + this.t1.shape + " and " + this.t2.shape + " must match,") +
            'or one of them can be broadcasted (2D and 1D).');
    };
    AddNode.T1 = 't1';
    AddNode.T2 = 't2';
    return AddNode;
}(Node));
exports.AddNode = AddNode;
var SubtractNode = (function (_super) {
    __extends(SubtractNode, _super);
    function SubtractNode(graph, t1, t2) {
        var _this = _super.call(this, graph, 'Subtract', { t1: t1, t2: t2 }, new SymbolicTensor(util.sizeFromShape(t1.shape) === 1 ? t2.shape : t1.shape)) || this;
        _this.t1 = t1;
        _this.t2 = t2;
        return _this;
    }
    SubtractNode.prototype.validate = function () {
        util.assert(util.sizeFromShape(this.t1.shape) === 1 ||
            util.sizeFromShape(this.t2.shape) === 1 ||
            util.arraysEqual(this.t1.shape, this.t2.shape), 'Error adding subtract op: one of inputs must be scalar or the ' +
            ("shapes " + this.t1.shape + " and " + this.t2.shape + " must match."));
    };
    SubtractNode.T1 = 't1';
    SubtractNode.T2 = 't2';
    return SubtractNode;
}(Node));
exports.SubtractNode = SubtractNode;
var MultiplyNode = (function (_super) {
    __extends(MultiplyNode, _super);
    function MultiplyNode(graph, t1, t2) {
        var _this = _super.call(this, graph, 'Multiply', { t1: t1, t2: t2 }, new SymbolicTensor(util.sizeFromShape(t1.shape) === 1 ? t2.shape : t1.shape)) || this;
        _this.t1 = t1;
        _this.t2 = t2;
        return _this;
    }
    MultiplyNode.prototype.validate = function () {
        util.assert(util.sizeFromShape(this.t1.shape) === 1 ||
            util.sizeFromShape(this.t2.shape) === 1 ||
            util.arraysEqual(this.t1.shape, this.t2.shape), 'Error adding multiply op: one of inputs must be scalar or the ' +
            ("shapes " + this.t1.shape + " and " + this.t2.shape + " must match."));
    };
    MultiplyNode.T1 = 't1';
    MultiplyNode.T2 = 't2';
    return MultiplyNode;
}(Node));
exports.MultiplyNode = MultiplyNode;
var DivideNode = (function (_super) {
    __extends(DivideNode, _super);
    function DivideNode(graph, t1, t2) {
        var _this = _super.call(this, graph, 'Divide', { t1: t1, t2: t2 }, new SymbolicTensor(util.sizeFromShape(t1.shape) === 1 ? t2.shape : t1.shape)) || this;
        _this.t1 = t1;
        _this.t2 = t2;
        return _this;
    }
    DivideNode.prototype.validate = function () {
        util.assert(util.sizeFromShape(this.t1.shape) === 1 ||
            util.sizeFromShape(this.t2.shape) === 1 ||
            util.arraysEqual(this.t1.shape, this.t2.shape), 'Error adding divide op: one of inputs must be scalar or the ' +
            ("shapes " + this.t1.shape + " and " + this.t2.shape + " must match."));
    };
    DivideNode.T1 = 't1';
    DivideNode.T2 = 't2';
    return DivideNode;
}(Node));
exports.DivideNode = DivideNode;
var ReduceSumNode = (function (_super) {
    __extends(ReduceSumNode, _super);
    function ReduceSumNode(graph, x) {
        return _super.call(this, graph, 'ReduceSum', { x: x }, new SymbolicTensor([])) || this;
    }
    ReduceSumNode.prototype.validate = function () { };
    ReduceSumNode.X = 'x';
    return ReduceSumNode;
}(Node));
exports.ReduceSumNode = ReduceSumNode;
var Concat1DNode = (function (_super) {
    __extends(Concat1DNode, _super);
    function Concat1DNode(graph, x1, x2) {
        return _super.call(this, graph, 'Concat1D', { x1: x1, x2: x2 }, new SymbolicTensor(concat_util.computeOutShape1D(x1.shape, x2.shape))) || this;
    }
    Concat1DNode.prototype.validate = function () { };
    Concat1DNode.X1 = 'x1';
    Concat1DNode.X2 = 'x2';
    return Concat1DNode;
}(Node));
exports.Concat1DNode = Concat1DNode;
var Concat2DNode = (function (_super) {
    __extends(Concat2DNode, _super);
    function Concat2DNode(graph, x1, x2, axis) {
        var _this = _super.call(this, graph, 'Concat2D', { x1: x1, x2: x2 }, new SymbolicTensor(concat_util.computeOutShape(x1.shape, x2.shape, axis))) || this;
        _this.x1 = x1;
        _this.x2 = x2;
        _this.axis = axis;
        return _this;
    }
    Concat2DNode.prototype.validate = function () {
        concat_util.assertParams(this.x1.shape, this.x2.shape, this.axis);
    };
    Concat2DNode.X1 = 'x1';
    Concat2DNode.X2 = 'x2';
    Concat2DNode.AXIS = 'axis';
    return Concat2DNode;
}(Node));
exports.Concat2DNode = Concat2DNode;
var Concat3DNode = (function (_super) {
    __extends(Concat3DNode, _super);
    function Concat3DNode(graph, x1, x2, axis) {
        var _this = _super.call(this, graph, 'Concat3D', { x1: x1, x2: x2 }, new SymbolicTensor(concat_util.computeOutShape(x1.shape, x2.shape, axis))) || this;
        _this.x1 = x1;
        _this.x2 = x2;
        _this.axis = axis;
        return _this;
    }
    Concat3DNode.prototype.validate = function () {
        concat_util.assertParams(this.x1.shape, this.x2.shape, this.axis);
    };
    Concat3DNode.X1 = 'x1';
    Concat3DNode.X2 = 'x2';
    Concat3DNode.AXIS = 'axis';
    return Concat3DNode;
}(Node));
exports.Concat3DNode = Concat3DNode;
var Concat4DNode = (function (_super) {
    __extends(Concat4DNode, _super);
    function Concat4DNode(graph, x1, x2, axis) {
        var _this = _super.call(this, graph, 'Concat4D', { x1: x1, x2: x2 }, new SymbolicTensor(concat_util.computeOutShape(x1.shape, x2.shape, axis))) || this;
        _this.x1 = x1;
        _this.x2 = x2;
        _this.axis = axis;
        return _this;
    }
    Concat4DNode.prototype.validate = function () {
        concat_util.assertParams(this.x1.shape, this.x2.shape, this.axis);
    };
    Concat4DNode.X1 = 'x1';
    Concat4DNode.X2 = 'x2';
    Concat4DNode.AXIS = 'axis';
    return Concat4DNode;
}(Node));
exports.Concat4DNode = Concat4DNode;
function getMatMulOutputShape(x1Shape, x2Shape) {
    if (x1Shape.length === 1 && x2Shape.length === 1) {
        return [1];
    }
    else if (x1Shape.length === 1 && x2Shape.length === 2) {
        return [x2Shape[1]];
    }
    else if (x1Shape.length === 2 && x2Shape.length === 1) {
        return [x1Shape[0]];
    }
    return [x1Shape[0], x2Shape[1]];
}
var MatMulNode = (function (_super) {
    __extends(MatMulNode, _super);
    function MatMulNode(graph, x1, x2) {
        var _this = _super.call(this, graph, 'MatMul', { x1: x1, x2: x2 }, new SymbolicTensor(getMatMulOutputShape(x1.shape, x2.shape))) || this;
        _this.x1 = x1;
        _this.x2 = x2;
        return _this;
    }
    MatMulNode.prototype.validate = function () {
        if (this.x1.shape.length === 2 && this.x2.shape.length === 2) {
            util.assert(this.x1.shape[1] === this.x2.shape[0], 'Error adding matmul op: inner shapes of matrices with shapes ' +
                (this.x1.shape + " and " + this.x2.shape + " must match."));
        }
        else if (this.x1.shape.length === 2 && this.x2.shape.length === 1) {
            util.assert(this.x1.shape[1] === this.x2.shape[0], 'Error adding matmul op: second dimension of matrix with shape ' +
                this.x1.shape.toString() +
                (" must match size of vector with shape " + this.x2.shape + "."));
        }
        else if (this.x1.shape.length === 1 && this.x2.shape.length === 2) {
            util.assert(this.x1.shape[0] === this.x2.shape[0], "Error adding matmul op: size of vector with shape " + this.x1.shape +
                " must match first dimension of matrix with " +
                ("shape " + this.x2.shape + "."));
        }
        else {
            throw new Error('Error adding matmul op: inputs must be vectors or matrices.');
        }
    };
    MatMulNode.X1 = 'x1';
    MatMulNode.X2 = 'x2';
    return MatMulNode;
}(Node));
exports.MatMulNode = MatMulNode;
var Convolution2DNode = (function (_super) {
    __extends(Convolution2DNode, _super);
    function Convolution2DNode(graph, x, w, b, fieldSize, outputDepth, stride, zeroPad) {
        if (stride === void 0) { stride = 1; }
        var _this = _super.call(this, graph, 'Convolution 2D', { x: x, w: w, b: b }, new SymbolicTensor(conv_util.computeOutputShape3D(x.shape, fieldSize, outputDepth, stride, zeroPad))) || this;
        _this.x = x;
        _this.w = w;
        _this.b = b;
        _this.fieldSize = fieldSize;
        _this.outputDepth = outputDepth;
        _this.stride = stride;
        _this.zeroPad = zeroPad;
        return _this;
    }
    Convolution2DNode.prototype.validate = function () {
        util.assert(this.x.shape.length === 3, 'Error adding conv2d op: input must be of rank 3, but got shape: ' +
            (this.x.shape + "."));
        util.assert(this.w.shape.length === 4, 'Error adding conv2d op: weights must be of rank 4, but got shape: ' +
            (this.w.shape + "."));
        util.assert(this.b.shape.length === 1, 'Error adding conv2d op: biases must be of rank 1, but got shape: ' +
            (this.b.shape + "."));
        util.assert(this.x.shape[2] === this.w.shape[2], "Error adding conv2d op: depth of input (" + this.x.shape[2] + ") " +
            ("must match input depth for weights (" + this.w.shape[2] + ")."));
    };
    Convolution2DNode.X = 'x';
    Convolution2DNode.W = 'w';
    Convolution2DNode.B = 'b';
    return Convolution2DNode;
}(Node));
exports.Convolution2DNode = Convolution2DNode;
var MaxPoolNode = (function (_super) {
    __extends(MaxPoolNode, _super);
    function MaxPoolNode(graph, x, fieldSize, stride, zeroPad) {
        if (stride === void 0) { stride = 1; }
        var _this = _super.call(this, graph, 'Max pool', { x: x }, new SymbolicTensor(conv_util.computeOutputShape3D(x.shape, fieldSize, x.shape[2], stride, zeroPad))) || this;
        _this.x = x;
        _this.fieldSize = fieldSize;
        _this.stride = stride;
        _this.zeroPad = zeroPad;
        return _this;
    }
    MaxPoolNode.prototype.validate = function () {
        util.assert(this.x.shape.length === 3, 'Error adding maxPool op: input must be of rank 3, but got shape: ' +
            (this.x.shape + "."));
    };
    MaxPoolNode.X = 'x';
    return MaxPoolNode;
}(Node));
exports.MaxPoolNode = MaxPoolNode;
var ReLUNode = (function (_super) {
    __extends(ReLUNode, _super);
    function ReLUNode(graph, x) {
        return _super.call(this, graph, 'ReLU', { x: x }, new SymbolicTensor(x.shape)) || this;
    }
    ReLUNode.prototype.validate = function () { };
    ReLUNode.X = 'x';
    return ReLUNode;
}(Node));
exports.ReLUNode = ReLUNode;
var LeakyReLUNode = (function (_super) {
    __extends(LeakyReLUNode, _super);
    function LeakyReLUNode(graph, x, alpha) {
        var _this = _super.call(this, graph, 'LeakyReLU', { x: x }, new SymbolicTensor(x.shape)) || this;
        _this.alpha = alpha;
        return _this;
    }
    LeakyReLUNode.prototype.validate = function () { };
    LeakyReLUNode.X = 'x';
    return LeakyReLUNode;
}(Node));
exports.LeakyReLUNode = LeakyReLUNode;
var PReLUNode = (function (_super) {
    __extends(PReLUNode, _super);
    function PReLUNode(graph, x, alpha) {
        var _this = _super.call(this, graph, 'PReLU', { x: x, alpha: alpha }, new SymbolicTensor(x.shape)) || this;
        _this.x = x;
        _this.alpha = alpha;
        return _this;
    }
    PReLUNode.prototype.validate = function () {
        util.assert(util.arraysEqual(this.x.shape, this.alpha.shape), 'Error adding pRelu op: the ' +
            ("shapes x: " + this.x.shape + " and alpha: " + this.alpha.shape + " must match."));
    };
    PReLUNode.X = 'x';
    PReLUNode.ALPHA = 'alpha';
    return PReLUNode;
}(Node));
exports.PReLUNode = PReLUNode;
var EluNode = (function (_super) {
    __extends(EluNode, _super);
    function EluNode(graph, x) {
        return _super.call(this, graph, 'Elu', { x: x }, new SymbolicTensor(x.shape)) || this;
    }
    EluNode.prototype.validate = function () { };
    EluNode.X = 'x';
    return EluNode;
}(Node));
exports.EluNode = EluNode;
var ExpNode = (function (_super) {
    __extends(ExpNode, _super);
    function ExpNode(graph, x) {
        return _super.call(this, graph, 'Exp', { x: x }, new SymbolicTensor(x.shape)) || this;
    }
    ExpNode.prototype.validate = function () { };
    ExpNode.X = 'x';
    return ExpNode;
}(Node));
exports.ExpNode = ExpNode;
var LogNode = (function (_super) {
    __extends(LogNode, _super);
    function LogNode(graph, x) {
        return _super.call(this, graph, 'Log', { x: x }, new SymbolicTensor(x.shape)) || this;
    }
    LogNode.prototype.validate = function () { };
    LogNode.X = 'x';
    return LogNode;
}(Node));
exports.LogNode = LogNode;
var TanHNode = (function (_super) {
    __extends(TanHNode, _super);
    function TanHNode(graph, x) {
        return _super.call(this, graph, 'TanH', { x: x }, new SymbolicTensor(x.shape)) || this;
    }
    TanHNode.prototype.validate = function () { };
    TanHNode.X = 'x';
    return TanHNode;
}(Node));
exports.TanHNode = TanHNode;
var SigmoidNode = (function (_super) {
    __extends(SigmoidNode, _super);
    function SigmoidNode(graph, x) {
        return _super.call(this, graph, 'Sigmoid', { x: x }, new SymbolicTensor(x.shape)) || this;
    }
    SigmoidNode.prototype.validate = function () { };
    SigmoidNode.X = 'x';
    return SigmoidNode;
}(Node));
exports.SigmoidNode = SigmoidNode;
var SquareNode = (function (_super) {
    __extends(SquareNode, _super);
    function SquareNode(graph, x) {
        return _super.call(this, graph, 'Square', { x: x }, new SymbolicTensor(x.shape)) || this;
    }
    SquareNode.prototype.validate = function () { };
    SquareNode.X = 'x';
    return SquareNode;
}(Node));
exports.SquareNode = SquareNode;
var SoftmaxCrossEntropyCostNode = (function (_super) {
    __extends(SoftmaxCrossEntropyCostNode, _super);
    function SoftmaxCrossEntropyCostNode(graph, x, target) {
        var _this = _super.call(this, graph, 'SoftmaxCrossEntropyCost', { x: x, target: target }, new SymbolicTensor([])) || this;
        _this.x = x;
        _this.target = target;
        return _this;
    }
    SoftmaxCrossEntropyCostNode.prototype.validate = function () {
        util.assert(util.arraysEqual(this.x.shape, this.target.shape), "Error adding softmaxCrossEntropyCost op: x shape (" + this.x.shape + ") " +
            ("must match target shape (" + this.target.shape + ")."));
    };
    SoftmaxCrossEntropyCostNode.X = 'x';
    SoftmaxCrossEntropyCostNode.TARGET = 'target';
    return SoftmaxCrossEntropyCostNode;
}(Node));
exports.SoftmaxCrossEntropyCostNode = SoftmaxCrossEntropyCostNode;
var SoftmaxNode = (function (_super) {
    __extends(SoftmaxNode, _super);
    function SoftmaxNode(graph, x) {
        var _this = _super.call(this, graph, 'Softmax', { x: x }, new SymbolicTensor(x.shape)) || this;
        _this.x = x;
        return _this;
    }
    SoftmaxNode.prototype.validate = function () {
        util.assert(this.x.shape.length === 1, 'The input to a softmax must be a 1-D tensor');
        util.assert(this.x.shape[0] >= 2, 'The input to a softmax must have at least 2 values');
    };
    SoftmaxNode.X = 'x';
    return SoftmaxNode;
}(Node));
exports.SoftmaxNode = SoftmaxNode;
var MeanSquaredCostNode = (function (_super) {
    __extends(MeanSquaredCostNode, _super);
    function MeanSquaredCostNode(graph, label, prediction) {
        var _this = _super.call(this, graph, 'Mean Squared Cost', { label: label, prediction: prediction }, new SymbolicTensor([])) || this;
        _this.label = label;
        _this.prediction = prediction;
        return _this;
    }
    MeanSquaredCostNode.prototype.validate = function () {
        util.assert(util.arraysEqual(this.label.shape, this.prediction.shape), "Error adding meanSquaredCost op: label shape (" + this.label.shape + ") " +
            ("must match prediction shape (" + this.prediction.shape + ")."));
    };
    MeanSquaredCostNode.LABEL = 'label';
    MeanSquaredCostNode.PREDICTION = 'prediction';
    return MeanSquaredCostNode;
}(Node));
exports.MeanSquaredCostNode = MeanSquaredCostNode;
var ArgMaxNode = (function (_super) {
    __extends(ArgMaxNode, _super);
    function ArgMaxNode(graph, x) {
        var _this = _super.call(this, graph, 'ArgMax', { x: x }, new SymbolicTensor([1])) || this;
        _this.x = x;
        return _this;
    }
    ArgMaxNode.prototype.validate = function () {
        util.assert(util.sizeFromShape(this.x.shape) > 0, 'Error adding argmax op: input tensor must have at least one entry.');
    };
    ArgMaxNode.X = 'x';
    return ArgMaxNode;
}(Node));
exports.ArgMaxNode = ArgMaxNode;
var ArgMaxEqualsNode = (function (_super) {
    __extends(ArgMaxEqualsNode, _super);
    function ArgMaxEqualsNode(graph, x1, x2) {
        var _this = _super.call(this, graph, 'ArgMaxEquals', { x1: x1, x2: x2 }, new SymbolicTensor([1])) || this;
        _this.x1 = x1;
        _this.x2 = x2;
        return _this;
    }
    ArgMaxEqualsNode.prototype.validate = function () {
        util.assert(util.arraysEqual(this.x1.shape, this.x2.shape), "Error adding ArgMaxEquals op: x1 shape (" + this.x1.shape + ") " +
            ("must match x2 shape (" + this.x2.shape + ")."));
    };
    ArgMaxEqualsNode.X1 = 'x1';
    ArgMaxEqualsNode.X2 = 'x2';
    return ArgMaxEqualsNode;
}(Node));
exports.ArgMaxEqualsNode = ArgMaxEqualsNode;

},{"../ops/concat_util":112,"../ops/conv_util":114,"../tensor":145,"../util":151,"./initializers":43}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../globals");
var tensor_1 = require("../tensor");
var session_1 = require("./session");
var DEFAULT_EVAL_INTERVAL_MS = 1500;
var DEFAULT_COST_INTERVAL_MS = 500;
var DEFAULT_INFERENCE_EXAMPLE_INTERVAL_MS = 3000;
var MetricReduction;
(function (MetricReduction) {
    MetricReduction[MetricReduction["SUM"] = 0] = "SUM";
    MetricReduction[MetricReduction["MEAN"] = 1] = "MEAN";
})(MetricReduction = exports.MetricReduction || (exports.MetricReduction = {}));
var GraphRunner = (function () {
    function GraphRunner(math, session, eventObserver) {
        this.math = math;
        this.session = session;
        this.eventObserver = eventObserver;
        this.lastCostTimestamp = 0;
        this.lastEvalTimestamp = 0;
        this.resetStatistics();
        this.zeroScalar = tensor_1.Scalar.new(0);
    }
    GraphRunner.prototype.resetStatistics = function () {
        this.totalBatchesTrained = 0;
    };
    GraphRunner.prototype.train = function (costTensor, trainFeedEntries, batchSize, optimizer, numBatches, metricTensor, metricFeedEntries, metricBatchSize, metricReduction, evalIntervalMs, costIntervalMs) {
        if (metricReduction === void 0) { metricReduction = MetricReduction.MEAN; }
        if (evalIntervalMs === void 0) { evalIntervalMs = DEFAULT_EVAL_INTERVAL_MS; }
        if (costIntervalMs === void 0) { costIntervalMs = DEFAULT_COST_INTERVAL_MS; }
        this.costTensor = costTensor;
        this.trainFeedEntries = trainFeedEntries;
        this.metricTensor = metricTensor;
        this.metricFeedEntries = metricFeedEntries;
        if (metricBatchSize != null && this.metricBatchSize !== metricBatchSize) {
            if (this.metricBatchSizeScalar != null) {
                this.metricBatchSizeScalar.dispose();
            }
            this.metricBatchSizeScalar = tensor_1.Scalar.new(metricBatchSize);
        }
        this.metricBatchSize = metricBatchSize;
        this.metricReduction = metricReduction;
        this.batchSize = batchSize;
        this.optimizer = optimizer;
        this.metricIntervalMs = evalIntervalMs;
        this.costIntervalMs = costIntervalMs;
        this.currentTrainLoopNumBatches = numBatches;
        this.batchesTrainedThisRun = 0;
        this.isTraining = true;
        this.trainStartTimestamp = performance.now();
        this.trainNetwork();
    };
    GraphRunner.prototype.stopTraining = function () {
        this.isTraining = false;
    };
    GraphRunner.prototype.resumeTraining = function () {
        this.isTraining = true;
        this.trainNetwork();
    };
    GraphRunner.prototype.trainNetwork = function () {
        var _this = this;
        if (this.batchesTrainedThisRun === this.currentTrainLoopNumBatches) {
            this.stopTraining();
        }
        if (!this.isTraining) {
            if (this.eventObserver.doneTrainingCallback != null) {
                this.eventObserver.doneTrainingCallback();
            }
            return;
        }
        var start = performance.now();
        var shouldComputeCost = this.eventObserver.avgCostCallback != null &&
            (start - this.lastCostTimestamp > this.costIntervalMs);
        if (shouldComputeCost) {
            this.lastCostTimestamp = start;
        }
        var costReduction = shouldComputeCost ? session_1.CostReduction.MEAN : session_1.CostReduction.NONE;
        globals_1.tidy(function () {
            var avgCost = _this.session.train(_this.costTensor, _this.trainFeedEntries, _this.batchSize, _this.optimizer, costReduction);
            if (shouldComputeCost) {
                var trainTime = performance.now() - start;
                _this.eventObserver.avgCostCallback(avgCost);
                if (_this.eventObserver.trainExamplesPerSecCallback != null) {
                    var examplesPerSec = (_this.batchSize * 1000 / trainTime);
                    _this.eventObserver.trainExamplesPerSecCallback(examplesPerSec);
                }
            }
            if (_this.eventObserver.metricCallback != null &&
                _this.metricFeedEntries != null &&
                start - _this.lastEvalTimestamp > _this.metricIntervalMs) {
                _this.lastEvalTimestamp = start;
                if (_this.lastComputedMetric != null) {
                    _this.lastComputedMetric.dispose();
                }
                _this.lastComputedMetric = _this.computeMetric();
                _this.eventObserver.metricCallback(_this.lastComputedMetric);
            }
            if (_this.eventObserver.totalTimeCallback != null) {
                _this.eventObserver.totalTimeCallback((start - _this.trainStartTimestamp) / 1000);
            }
            _this.batchesTrainedThisRun++;
            _this.totalBatchesTrained++;
            if (_this.eventObserver.batchesTrainedCallback != null) {
                _this.eventObserver.batchesTrainedCallback(_this.totalBatchesTrained);
            }
        });
        requestAnimationFrame(function () { return _this.trainNetwork(); });
    };
    GraphRunner.prototype.infer = function (inferenceTensor, inferenceFeedEntries, inferenceExampleIntervalMs, inferenceExampleCount, numPasses) {
        var _this = this;
        if (inferenceExampleIntervalMs === void 0) { inferenceExampleIntervalMs = DEFAULT_INFERENCE_EXAMPLE_INTERVAL_MS; }
        if (inferenceExampleCount === void 0) { inferenceExampleCount = 5; }
        if (this.eventObserver.inferenceExamplesCallback == null &&
            this.eventObserver.inferenceExamplesPerSecCallback == null) {
            throw new Error('Cannot start inference loop, no inference example or ' +
                'examples/sec observer provided.');
        }
        for (var i = 0; i < inferenceFeedEntries.length; i++) {
            var feedEntry = inferenceFeedEntries[i];
            if (feedEntry.data instanceof tensor_1.Tensor) {
                throw new Error('Cannot start inference on the model runner with feed entries of ' +
                    'type NDArray. Please use InputProviders.');
            }
        }
        this.inferenceExampleIntervalMs = inferenceExampleIntervalMs;
        this.inferenceTensor = inferenceTensor;
        this.inferenceFeedEntries = inferenceFeedEntries;
        this.inferenceExampleCount = inferenceExampleCount;
        this.currentInferenceLoopNumPasses = numPasses;
        if (!this.isInferring) {
            this.inferencePassesThisRun = 0;
            requestAnimationFrame(function () { return _this.inferNetwork(); });
        }
        this.isInferring = true;
    };
    GraphRunner.prototype.inferNetwork = function () {
        var _this = this;
        if (!this.isInferring ||
            this.inferencePassesThisRun === this.currentInferenceLoopNumPasses) {
            return;
        }
        globals_1.tidy(function () {
            var feeds = [];
            var inferenceValues = [];
            var start = performance.now();
            for (var i = 0; i < _this.inferenceExampleCount; i++) {
                var ndarrayFeedEntries = [];
                for (var j = 0; j < _this.inferenceFeedEntries.length; j++) {
                    var feedEntry = _this.inferenceFeedEntries[j];
                    var nextCopy = feedEntry.data.getNextCopy();
                    ndarrayFeedEntries.push({ tensor: feedEntry.tensor, data: nextCopy });
                }
                feeds.push(ndarrayFeedEntries);
                inferenceValues.push(_this.session.eval(_this.inferenceTensor, ndarrayFeedEntries));
            }
            if (_this.eventObserver.inferenceExamplesPerSecCallback != null) {
                inferenceValues[inferenceValues.length - 1].dataSync();
                var inferenceExamplesPerSecTime = performance.now() - start;
                var examplesPerSec = (_this.inferenceExampleCount * 1000 / inferenceExamplesPerSecTime);
                _this.eventObserver.inferenceExamplesPerSecCallback(examplesPerSec);
            }
            if (_this.eventObserver.inferenceExamplesCallback != null) {
                _this.eventObserver.inferenceExamplesCallback(feeds, inferenceValues);
            }
            _this.inferencePassesThisRun++;
        });
        this.lastInferTimeoutID = window.setTimeout(function () { return _this.inferNetwork(); }, this.inferenceExampleIntervalMs);
    };
    GraphRunner.prototype.stopInferring = function () {
        this.isInferring = false;
        window.clearTimeout(this.lastInferTimeoutID);
    };
    GraphRunner.prototype.isInferenceRunning = function () {
        return this.isInferring;
    };
    GraphRunner.prototype.computeMetric = function () {
        var _this = this;
        if (this.metricFeedEntries == null) {
            throw new Error('Cannot compute metric, no metric FeedEntries provided.');
        }
        var metric = this.zeroScalar;
        return globals_1.tidy(function () {
            for (var i = 0; i < _this.metricBatchSize; i++) {
                var metricValue = _this.session.eval(_this.metricTensor, _this.metricFeedEntries);
                metric = _this.math.add(metric, metricValue.toFloat());
            }
            if (_this.metricReduction === MetricReduction.MEAN) {
                metric = _this.math.divide(metric, _this.metricBatchSizeScalar);
            }
            return metric;
        });
    };
    GraphRunner.prototype.getTotalBatchesTrained = function () {
        return this.totalBatchesTrained;
    };
    GraphRunner.prototype.getLastComputedMetric = function () {
        return this.lastComputedMetric;
    };
    GraphRunner.prototype.setMath = function (math) {
        this.math = math;
    };
    GraphRunner.prototype.setSession = function (session) {
        this.session = session;
    };
    GraphRunner.prototype.setInferenceTensor = function (inferenceTensor) {
        this.inferenceTensor = inferenceTensor;
    };
    GraphRunner.prototype.setInferenceExampleCount = function (inferenceExampleCount) {
        this.inferenceExampleCount = inferenceExampleCount;
    };
    return GraphRunner;
}());
exports.GraphRunner = GraphRunner;

},{"../globals":36,"../tensor":145,"./session":65}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graph_1 = require("./graph");
var priority_queue = require("./priority_queue");
var priority_queue_1 = require("./priority_queue");
function getUnorderedEvaluationSet(nodes, terminatingNodes) {
    var terminatingNodeMap = {};
    var seen = {};
    var set = [];
    var visit = nodes.slice();
    terminatingNodes.forEach(function (node) { return terminatingNodeMap[node.id] = node; });
    var _loop_1 = function () {
        var cur = visit.pop();
        if (seen[cur.id] == null) {
            if (terminatingNodeMap[cur.id] == null) {
                Object.keys(cur.inputs)
                    .map(function (inputName) { return cur.inputs[inputName]; })
                    .forEach(function (input) { return visit.push(input.node); });
            }
            set.push(cur);
            seen[cur.id] = cur;
        }
    };
    while (visit.length !== 0) {
        _loop_1();
    }
    return set;
}
exports.getUnorderedEvaluationSet = getUnorderedEvaluationSet;
function getOrderedEvaluationSet(unorderedEvaluationSet) {
    var set = [];
    var nodeIndices = {};
    var pendingDependencies = {};
    var nodeQueue = new priority_queue_1.PriorityQueue(function (a, b) { return priority_queue.defaultCompare(pendingDependencies[a.id], pendingDependencies[b.id]); }, function (node, newIndex) { return nodeIndices[node.id] = newIndex; });
    unorderedEvaluationSet.forEach(function (node) { return pendingDependencies[node.id] = 0; });
    unorderedEvaluationSet.forEach(function (node) { return Object.keys(node.inputs)
        .map(function (key) { return node.inputs[key]; })
        .forEach(function (input) {
        if (unorderedEvaluationSet.indexOf(input.node) !== -1) {
            pendingDependencies[input.node.id]++;
        }
    }); });
    unorderedEvaluationSet.forEach(function (node) { return nodeQueue.enqueue(node); });
    while (!nodeQueue.empty()) {
        set.unshift(nodeQueue.dequeue());
        Object.keys(set[0].inputs).map(function (key) { return set[0].inputs[key]; }).forEach(function (input) {
            if (unorderedEvaluationSet.indexOf(input.node) === -1) {
                return;
            }
            pendingDependencies[input.node.id]--;
            nodeQueue.update(input.node, nodeIndices[input.node.id]);
        });
    }
    return set;
}
exports.getOrderedEvaluationSet = getOrderedEvaluationSet;
function isInputNode(node) {
    return Object.keys(node.inputs).length === 0;
}
exports.isInputNode = isInputNode;
function shouldBackProp(t) {
    return !(t.node instanceof graph_1.ConstantNode);
}
exports.shouldBackProp = shouldBackProp;
function isPassthroughNode(node, map) {
    var keys = Object.keys(node.inputs);
    for (var i = 0; i < keys.length; i++) {
        var input = node.inputs[keys[i]];
        if (map.get(input, true) === map.get(node.output, true)) {
            return true;
        }
    }
    return false;
}
exports.isPassthroughNode = isPassthroughNode;

},{"./graph":40,"./priority_queue":64}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ops = require("../ops/ops");
var VarianceScalingInitializer = (function () {
    function VarianceScalingInitializer(scale, mode, distribution) {
        if (scale === void 0) { scale = 1.0; }
        if (mode === void 0) { mode = 'fan_in'; }
        if (distribution === void 0) { distribution = 'normal'; }
        this.scale = scale;
        this.mode = mode;
        this.distribution = distribution;
    }
    VarianceScalingInitializer.prototype.initialize = function (weightsShape, inputUnits, outputUnits) {
        var n = 0;
        if (this.mode === 'fan_in') {
            n = inputUnits;
        }
        else if (this.mode === 'fan_out') {
            n = outputUnits;
        }
        else if (this.mode === 'fan_avg') {
            n = (inputUnits + outputUnits) / 2;
        }
        else {
            throw new Error("Unexpected mode for variance scaling initializer: " + this.mode);
        }
        if (this.distribution === 'normal') {
            return ops.truncatedNormal(weightsShape, 0.0, Math.sqrt(this.scale / n));
        }
        else if (this.distribution === 'uniform') {
            return ops.randomUniform(weightsShape, 0.0, Math.sqrt(3 * this.scale / n));
        }
        else {
            throw new Error("Unexpected distribution for variance scaling initializer: " +
                ("" + this.distribution));
        }
    };
    return VarianceScalingInitializer;
}());
exports.VarianceScalingInitializer = VarianceScalingInitializer;
var ZerosInitializer = (function () {
    function ZerosInitializer() {
    }
    ZerosInitializer.prototype.initialize = function (weightsShape, inputUnits, outputUnits) {
        return ops.zeros(weightsShape);
    };
    return ZerosInitializer;
}());
exports.ZerosInitializer = ZerosInitializer;
var OnesInitializer = (function () {
    function OnesInitializer() {
    }
    OnesInitializer.prototype.initialize = function (weightsShape, inputUnits, outputUnits) {
        return ops.ones(weightsShape);
    };
    return OnesInitializer;
}());
exports.OnesInitializer = OnesInitializer;
var ConstantInitializer = (function () {
    function ConstantInitializer(value) {
        if (value === void 0) { value = 0; }
        this.value = value;
    }
    ConstantInitializer.prototype.initialize = function (weightsShape, inputUnits, outputUnits) {
        return ops.fill(weightsShape, this.value);
    };
    return ConstantInitializer;
}());
exports.ConstantInitializer = ConstantInitializer;
var TensorInitializer = (function () {
    function TensorInitializer(tensor) {
        this.tensor = tensor;
    }
    TensorInitializer.prototype.initialize = function (weightsShape, inputUnits, outputUnits) {
        return this.tensor;
    };
    return TensorInitializer;
}());
exports.TensorInitializer = TensorInitializer;
var RandomNormalInitializer = (function () {
    function RandomNormalInitializer(mean, stdev) {
        if (mean === void 0) { mean = 0; }
        if (stdev === void 0) { stdev = .05; }
        this.mean = mean;
        this.stdev = stdev;
    }
    RandomNormalInitializer.prototype.initialize = function (weightsShape, inputUnits, outputUnits) {
        return ops.randomNormal(weightsShape, this.mean, this.stdev);
    };
    return RandomNormalInitializer;
}());
exports.RandomNormalInitializer = RandomNormalInitializer;
var RandomTruncatedNormalInitializer = (function () {
    function RandomTruncatedNormalInitializer(mean, stdev) {
        if (mean === void 0) { mean = 0; }
        if (stdev === void 0) { stdev = .05; }
        this.mean = mean;
        this.stdev = stdev;
    }
    RandomTruncatedNormalInitializer.prototype.initialize = function (weightsShape, inputUnits, outputUnits) {
        return ops.truncatedNormal(weightsShape, this.mean, this.stdev);
    };
    return RandomTruncatedNormalInitializer;
}());
exports.RandomTruncatedNormalInitializer = RandomTruncatedNormalInitializer;
var RandomUniformInitializer = (function () {
    function RandomUniformInitializer(minval, maxval) {
        if (minval === void 0) { minval = -.05; }
        if (maxval === void 0) { maxval = .05; }
        this.minval = minval;
        this.maxval = maxval;
    }
    RandomUniformInitializer.prototype.initialize = function (weightsShape, inputUnits, outputUnits) {
        return ops.randomUniform(weightsShape, this.minval, this.maxval);
    };
    return RandomUniformInitializer;
}());
exports.RandomUniformInitializer = RandomUniformInitializer;

},{"../ops/ops":122}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graph_1 = require("./graph");
var graph_util = require("./graph_util");
var add_1 = require("./ops/add");
var argmax_1 = require("./ops/argmax");
var argmaxequals_1 = require("./ops/argmaxequals");
var concat_1 = require("./ops/concat");
var convolution_1 = require("./ops/convolution");
var divide_1 = require("./ops/divide");
var element_wise_activation_1 = require("./ops/element_wise_activation");
var element_wise_cost_1 = require("./ops/element_wise_cost");
var exp_1 = require("./ops/exp");
var linear_combination_1 = require("./ops/linear_combination");
var log_1 = require("./ops/log");
var matmul_1 = require("./ops/matmul");
var max_pool_1 = require("./ops/max_pool");
var multiply_1 = require("./ops/multiply");
var reduce_sum_1 = require("./ops/reduce_sum");
var reshape_1 = require("./ops/reshape");
var softmax_1 = require("./ops/softmax");
var subtract_1 = require("./ops/subtract");
function emitFromGraphNodes(nodes) {
    var ops = [];
    nodes.forEach(function (node) { return Array.prototype.push.apply(ops, emitOpFromNode(node)); });
    return ops;
}
exports.emitFromGraphNodes = emitFromGraphNodes;
function emitOpFromNode(node) {
    if (node instanceof graph_1.ReshapeNode) {
        return [new reshape_1.Reshape(node.inputs[graph_1.ReshapeNode.X], node.output)];
    }
    else if (node instanceof graph_1.MatMulNode) {
        var x1 = node.inputs[graph_1.MatMulNode.X1];
        var x2 = node.inputs[graph_1.MatMulNode.X2];
        return [new matmul_1.MatMul(x1, x2, node.output)];
    }
    else if (node instanceof graph_1.Convolution2DNode) {
        var w = node.inputs[graph_1.Convolution2DNode.W];
        var x = node.inputs[graph_1.Convolution2DNode.X];
        var b = node.inputs[graph_1.Convolution2DNode.B];
        return [new convolution_1.Convolution2D(w, x, b, node.output, node.fieldSize, node.outputDepth, node.stride, node.zeroPad)];
    }
    else if (node instanceof graph_1.MaxPoolNode) {
        var x = node.inputs[graph_1.MaxPoolNode.X];
        return [new max_pool_1.MaxPool(x, node.output, node.fieldSize, node.stride, node.zeroPad)];
    }
    else if (node instanceof graph_1.ExpNode) {
        return [new exp_1.Exp(node.inputs[graph_1.ExpNode.X], node.output)];
    }
    else if (node instanceof graph_1.LogNode) {
        return [new log_1.Log(node.inputs[graph_1.LogNode.X], node.output)];
    }
    else if (node instanceof graph_1.ReLUNode) {
        return [new element_wise_activation_1.ReLU(node.inputs[graph_1.ReLUNode.X], node.output)];
    }
    else if (node instanceof graph_1.LeakyReLUNode) {
        return [new element_wise_activation_1.LeakyReLU(node.inputs[graph_1.LeakyReLUNode.X], node.output, node.alpha)];
    }
    else if (node instanceof graph_1.PReLUNode) {
        return [new element_wise_activation_1.PReLU(node.inputs[graph_1.PReLUNode.X], node.inputs[graph_1.PReLUNode.ALPHA], node.output)];
    }
    else if (node instanceof graph_1.EluNode) {
        return [new element_wise_activation_1.Elu(node.inputs[graph_1.EluNode.X], node.output)];
    }
    else if (node instanceof graph_1.TanHNode) {
        return [new element_wise_activation_1.TanH(node.inputs[graph_1.TanHNode.X], node.output)];
    }
    else if (node instanceof graph_1.SigmoidNode) {
        return [new element_wise_activation_1.Sigmoid(node.inputs[graph_1.SigmoidNode.X], node.output)];
    }
    else if (node instanceof graph_1.SoftmaxCrossEntropyCostNode) {
        var x = node.inputs[graph_1.SoftmaxCrossEntropyCostNode.X];
        var target = node.inputs[graph_1.SoftmaxCrossEntropyCostNode.TARGET];
        return [new softmax_1.SoftmaxCrossEntropyCost(x, target, node.output)];
    }
    else if (node instanceof graph_1.SoftmaxNode) {
        return [new softmax_1.Softmax(node.inputs[graph_1.SoftmaxNode.X], node.output)];
    }
    else if (node instanceof graph_1.MeanSquaredCostNode) {
        var label = node.inputs[graph_1.MeanSquaredCostNode.LABEL];
        var prediction = node.inputs[graph_1.MeanSquaredCostNode.PREDICTION];
        return [new element_wise_cost_1.MeanSquaredCost(label, prediction, node.output)];
    }
    else if (node instanceof graph_1.ArgMaxEqualsNode) {
        return [new argmaxequals_1.ArgMaxEquals(node.inputs[graph_1.ArgMaxEqualsNode.X1], node.inputs[graph_1.ArgMaxEqualsNode.X2], node.output)];
    }
    else if (node instanceof graph_1.ArgMaxNode) {
        return [new argmax_1.ArgMax(node.x, node.output)];
    }
    else if (node instanceof graph_1.FusedLinearCombinationNode) {
        return [new linear_combination_1.LinearCombination(node.inputs[graph_1.FusedLinearCombinationNode.T1], node.inputs[graph_1.FusedLinearCombinationNode.T2], node.inputs[graph_1.FusedLinearCombinationNode.C1], node.inputs[graph_1.FusedLinearCombinationNode.C2], node.output)];
    }
    else if (node instanceof graph_1.Concat1DNode) {
        return [new concat_1.Concat1D(node.inputs[graph_1.Concat1DNode.X1], node.inputs[graph_1.Concat1DNode.X2], node.output)];
    }
    else if (node instanceof graph_1.Concat2DNode) {
        return [new concat_1.Concat2D(node.inputs[graph_1.Concat2DNode.X1], node.inputs[graph_1.Concat2DNode.X2], node.axis, node.output)];
    }
    else if (node instanceof graph_1.Concat3DNode) {
        return [new concat_1.Concat3D(node.inputs[graph_1.Concat3DNode.X1], node.inputs[graph_1.Concat3DNode.X2], node.axis, node.output)];
    }
    else if (node instanceof graph_1.Concat4DNode) {
        return [new concat_1.Concat4D(node.inputs[graph_1.Concat4DNode.X1], node.inputs[graph_1.Concat4DNode.X2], node.axis, node.output)];
    }
    else if (node instanceof graph_1.SquareNode) {
        return [new element_wise_activation_1.Square(node.inputs[graph_1.SquareNode.X], node.output)];
    }
    else if (node instanceof graph_1.AddNode) {
        return [new add_1.Add(node.inputs[graph_1.AddNode.T1], node.inputs[graph_1.AddNode.T2], node.output)];
    }
    else if (node instanceof graph_1.SubtractNode) {
        return [new subtract_1.Subtract(node.inputs[graph_1.SubtractNode.T1], node.inputs[graph_1.SubtractNode.T2], node.output)];
    }
    else if (node instanceof graph_1.MultiplyNode) {
        return [new multiply_1.Multiply(node.inputs[graph_1.MultiplyNode.T1], node.inputs[graph_1.MultiplyNode.T2], node.output)];
    }
    else if (node instanceof graph_1.DivideNode) {
        return [new divide_1.Divide(node.inputs[graph_1.DivideNode.T1], node.inputs[graph_1.DivideNode.T2], node.output)];
    }
    else if (node instanceof graph_1.ReduceSumNode) {
        return [new reduce_sum_1.ReduceSum(node.inputs[graph_1.ReduceSumNode.X], node.output)];
    }
    else if (graph_util.isInputNode(node)) {
        return [];
    }
    else {
        throw Error("Unsupported node type: " + node.constructor.name);
    }
}

},{"./graph":40,"./graph_util":42,"./ops/add":45,"./ops/argmax":46,"./ops/argmaxequals":47,"./ops/concat":48,"./ops/convolution":49,"./ops/divide":50,"./ops/element_wise_activation":51,"./ops/element_wise_cost":52,"./ops/exp":53,"./ops/linear_combination":54,"./ops/log":55,"./ops/matmul":56,"./ops/max_pool":57,"./ops/multiply":58,"./ops/reduce_sum":60,"./ops/reshape":61,"./ops/softmax":62,"./ops/subtract":63}],45:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var util = require("../../util");
var graph_util = require("../graph_util");
var op_1 = require("./op");
var Add = (function (_super) {
    __extends(Add, _super);
    function Add(x1Tensor, x2Tensor, yTensor) {
        var _this = _super.call(this) || this;
        _this.x1Tensor = x1Tensor;
        _this.x2Tensor = x2Tensor;
        _this.yTensor = yTensor;
        util.assert(util.sizeFromShape(x1Tensor.shape) === 1 ||
            util.sizeFromShape(x2Tensor.shape) === 1 ||
            util.arraysEqual(x1Tensor.shape, x2Tensor.shape) ||
            (x1Tensor.shape.length === 2 && x2Tensor.shape.length === 1 &&
                x1Tensor.shape[1] === x2Tensor.shape[0]) ||
            (x1Tensor.shape.length === 1 && x2Tensor.shape.length === 2 &&
                x1Tensor.shape[0] === x2Tensor.shape[1]), 'One of t1 or t2 must be a scalar, or t1 and t2 must have ' +
            'the same shape, ' +
            'or one of them can be broadcasted (2D and 1D).');
        return _this;
    }
    Add.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x1 = inferenceArrays.get(this.x1Tensor);
        var x2 = inferenceArrays.get(this.x2Tensor);
        globals_1.tidy(function () {
            var result;
            if (util.isScalarShape(x1.shape)) {
                result = math.scalarPlusArray(x1, x2);
            }
            else if (util.isScalarShape(x2.shape)) {
                result = math.scalarPlusArray(x2, x1);
            }
            else {
                result = math.add(x1, x2);
            }
            inferenceArrays.set(_this.yTensor, globals_1.keep(result));
        });
    };
    Add.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        var dy = gradientArrays.get(this.yTensor);
        globals_1.tidy(function () {
            if (graph_util.shouldBackProp(_this.x1Tensor)) {
                if (_this.x1Tensor.shape.length === 1 &&
                    _this.x2Tensor.shape.length === 2 &&
                    _this.x1Tensor.shape[0] === _this.x2Tensor.shape[1]) {
                    var sum = math.sum(dy, 0);
                    gradientArrays.add(_this.x1Tensor, sum);
                }
                else if (util.isScalarShape(_this.x1Tensor.shape)) {
                    var sum = math.sum(dy);
                    gradientArrays.add(_this.x1Tensor, sum);
                }
                else {
                    gradientArrays.add(_this.x1Tensor, math.clone(dy));
                }
            }
            if (graph_util.shouldBackProp(_this.x2Tensor)) {
                if (_this.x1Tensor.shape.length === 2 &&
                    _this.x2Tensor.shape.length === 1 &&
                    _this.x1Tensor.shape[1] === _this.x2Tensor.shape[0]) {
                    var sum = math.sum(dy, 0);
                    gradientArrays.add(_this.x2Tensor, sum);
                }
                else if (util.isScalarShape(_this.x2Tensor.shape)) {
                    var sum = math.sum(dy);
                    gradientArrays.add(_this.x2Tensor, sum);
                }
                else {
                    gradientArrays.add(_this.x2Tensor, math.clone(dy));
                }
            }
        });
    };
    Add.prototype.dispose = function () {
        if (this.dySizeScalar != null) {
            this.dySizeScalar.dispose();
        }
    };
    return Add;
}(op_1.Operation));
exports.Add = Add;

},{"../../globals":36,"../../util":151,"../graph_util":42,"./op":59}],46:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var op_1 = require("./op");
var ArgMax = (function (_super) {
    __extends(ArgMax, _super);
    function ArgMax(xTensor, yTensor) {
        var _this = _super.call(this) || this;
        _this.xTensor = xTensor;
        _this.yTensor = yTensor;
        return _this;
    }
    ArgMax.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x = inferenceArrays.get(this.xTensor);
        globals_1.tidy(function () {
            inferenceArrays.set(_this.yTensor, globals_1.keep(math.argMax(x)));
        });
    };
    ArgMax.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        throw new Error('ArgMax backprop unimplemented');
    };
    return ArgMax;
}(op_1.Operation));
exports.ArgMax = ArgMax;

},{"../../globals":36,"./op":59}],47:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var op_1 = require("./op");
var ArgMaxEquals = (function (_super) {
    __extends(ArgMaxEquals, _super);
    function ArgMaxEquals(x1Tensor, x2Tensor, yTensor) {
        var _this = _super.call(this) || this;
        _this.x1Tensor = x1Tensor;
        _this.x2Tensor = x2Tensor;
        _this.yTensor = yTensor;
        return _this;
    }
    ArgMaxEquals.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x1 = inferenceArrays.get(this.x1Tensor);
        var x2 = inferenceArrays.get(this.x2Tensor);
        globals_1.tidy(function () {
            inferenceArrays.set(_this.yTensor, globals_1.keep(math.argMaxEquals(x1, x2)));
        });
    };
    ArgMaxEquals.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        throw new Error('ArgMaxEquals backprop unimplemented');
    };
    return ArgMaxEquals;
}(op_1.Operation));
exports.ArgMaxEquals = ArgMaxEquals;

},{"../../globals":36,"./op":59}],48:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var concat_util = require("../../ops/concat_util");
var util = require("../../util");
var op_1 = require("./op");
var Concat1D = (function (_super) {
    __extends(Concat1D, _super);
    function Concat1D(x1Tensor, x2Tensor, yTensor) {
        var _this = _super.call(this) || this;
        _this.x1Tensor = x1Tensor;
        _this.x2Tensor = x2Tensor;
        _this.yTensor = yTensor;
        return _this;
    }
    Concat1D.prototype.feedForward = function (math, inferecenArrays) {
        var _this = this;
        var x1 = inferecenArrays.get(this.x1Tensor);
        var x2 = inferecenArrays.get(this.x2Tensor);
        globals_1.tidy(function () {
            var concatResult = math.concat1D(x1, x2);
            inferecenArrays.set(_this.yTensor, globals_1.keep(concatResult));
        });
    };
    Concat1D.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        globals_1.tidy(function () {
            concatBackProp(math, _this.x1Tensor, _this.x2Tensor, _this.yTensor, 0, gradientArrays, inferenceArrays);
        });
    };
    return Concat1D;
}(op_1.Operation));
exports.Concat1D = Concat1D;
var Concat2D = (function (_super) {
    __extends(Concat2D, _super);
    function Concat2D(x1Tensor, x2Tensor, axis, yTensor) {
        var _this = _super.call(this) || this;
        _this.x1Tensor = x1Tensor;
        _this.x2Tensor = x2Tensor;
        _this.axis = axis;
        _this.yTensor = yTensor;
        concat_util.assertParams(x1Tensor.shape, x2Tensor.shape, axis);
        return _this;
    }
    Concat2D.prototype.feedForward = function (math, inferecenArrays) {
        var _this = this;
        var x1 = inferecenArrays.get(this.x1Tensor);
        var x2 = inferecenArrays.get(this.x2Tensor);
        globals_1.tidy(function () {
            var concatResult = math.concat2D(x1, x2, _this.axis);
            inferecenArrays.set(_this.yTensor, globals_1.keep(concatResult));
        });
    };
    Concat2D.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        globals_1.tidy(function () {
            concatBackProp(math, _this.x1Tensor, _this.x2Tensor, _this.yTensor, _this.axis, gradientArrays, inferenceArrays);
        });
    };
    return Concat2D;
}(op_1.Operation));
exports.Concat2D = Concat2D;
var Concat3D = (function (_super) {
    __extends(Concat3D, _super);
    function Concat3D(x1Tensor, x2Tensor, axis, yTensor) {
        var _this = _super.call(this) || this;
        _this.x1Tensor = x1Tensor;
        _this.x2Tensor = x2Tensor;
        _this.axis = axis;
        _this.yTensor = yTensor;
        concat_util.assertParams(x1Tensor.shape, x2Tensor.shape, axis);
        return _this;
    }
    Concat3D.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x1 = inferenceArrays.get(this.x1Tensor);
        var x2 = inferenceArrays.get(this.x2Tensor);
        globals_1.tidy(function () {
            var concatResult = math.concat3D(x1, x2, _this.axis);
            inferenceArrays.set(_this.yTensor, globals_1.keep(concatResult));
        });
    };
    Concat3D.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        globals_1.tidy(function () {
            concatBackProp(math, _this.x1Tensor, _this.x2Tensor, _this.yTensor, _this.axis, gradientArrays, inferenceArrays);
        });
    };
    return Concat3D;
}(op_1.Operation));
exports.Concat3D = Concat3D;
var Concat4D = (function (_super) {
    __extends(Concat4D, _super);
    function Concat4D(x1Tensor, x2Tensor, axis, yTensor) {
        var _this = _super.call(this) || this;
        _this.x1Tensor = x1Tensor;
        _this.x2Tensor = x2Tensor;
        _this.axis = axis;
        _this.yTensor = yTensor;
        concat_util.assertParams(x1Tensor.shape, x2Tensor.shape, axis);
        return _this;
    }
    Concat4D.prototype.feedForward = function (math, inferecenArrays) {
        var _this = this;
        var x1 = inferecenArrays.get(this.x1Tensor);
        var x2 = inferecenArrays.get(this.x2Tensor);
        globals_1.tidy(function () {
            var concatResult = math.concat4D(x1, x2, _this.axis);
            inferecenArrays.set(_this.yTensor, globals_1.keep(concatResult));
        });
    };
    Concat4D.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        globals_1.tidy(function () {
            concatBackProp(math, _this.x1Tensor, _this.x2Tensor, _this.yTensor, _this.axis, gradientArrays, inferenceArrays);
        });
    };
    return Concat4D;
}(op_1.Operation));
exports.Concat4D = Concat4D;
function concatBackProp(math, aTensor, bTensor, yTensor, axis, gradArrays, infArrays) {
    var dy = gradArrays.get(yTensor);
    var a = infArrays.get(aTensor);
    var b = infArrays.get(bTensor);
    var a2D = a.as2D(-1, util.sizeFromShape(a.shape.slice(axis)));
    var b2D = b.as2D(-1, util.sizeFromShape(b.shape.slice(axis)));
    var _a = concat_util.computeGradientSliceShapes(a2D.shape, b2D.shape), aBegin = _a.aBegin, aSize = _a.aSize, bBegin = _a.bBegin, bSize = _a.bSize;
    var dy2D = dy.as2D(-1, a2D.shape[1] + b2D.shape[1]);
    var slice1Result = math.slice2D(dy2D, aBegin, aSize).reshapeAs(a);
    var slice2Result = math.slice2D(dy2D, bBegin, bSize).reshapeAs(b);
    gradArrays.add(aTensor, slice1Result);
    gradArrays.add(bTensor, slice2Result);
}

},{"../../globals":36,"../../ops/concat_util":112,"../../util":151,"./op":59}],49:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var conv_util = require("../../ops/conv_util");
var util = require("../../util");
var op_1 = require("./op");
var Convolution2D = (function (_super) {
    __extends(Convolution2D, _super);
    function Convolution2D(wTensor, xTensor, bTensor, yTensor, fieldSize, outputDepth, stride, zeroPad) {
        if (stride === void 0) { stride = 1; }
        var _this = _super.call(this) || this;
        _this.wTensor = wTensor;
        _this.xTensor = xTensor;
        _this.bTensor = bTensor;
        _this.yTensor = yTensor;
        _this.fieldSize = fieldSize;
        _this.outputDepth = outputDepth;
        _this.stride = stride;
        _this.assertWeightsShape(wTensor.shape);
        _this.zeroPad = zeroPad != null ?
            zeroPad :
            conv_util.computeDefaultPad(_this.xTensor.shape, _this.fieldSize, _this.stride);
        util.assert(util.isInt(_this.zeroPad), "The zero padding (" + _this.zeroPad + ") must be an integer. Change the " +
            "stride and/or zero pad parameters");
        return _this;
    }
    Convolution2D.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var weights = inferenceArrays.get(this.wTensor);
        var biases = inferenceArrays.get(this.bTensor);
        var x = inferenceArrays.get(this.xTensor);
        globals_1.tidy(function () {
            inferenceArrays.set(_this.yTensor, globals_1.keep(math.conv2d(x, weights, biases, _this.stride, _this.zeroPad)));
        });
    };
    Convolution2D.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        var filter = inferenceArrays.get(this.wTensor);
        var x = inferenceArrays.get(this.xTensor);
        var dy = gradientArrays.get(this.yTensor);
        globals_1.tidy(function () {
            var dw = math.conv2dDerFilter(x, dy, filter.shape, _this.stride, _this.zeroPad);
            var db = math.sum(dy, [0, 1]);
            var dx = math.conv2dDerInput(x.shape, dy, filter, _this.stride, _this.zeroPad);
            gradientArrays.add(_this.wTensor, dw);
            gradientArrays.add(_this.bTensor, db);
            gradientArrays.add(_this.xTensor, dx);
        });
    };
    Convolution2D.prototype.assertWeightsShape = function (weightsShape) {
        util.assert(weightsShape[0] === this.fieldSize &&
            weightsShape[1] === this.fieldSize &&
            weightsShape[2] === this.xTensor.shape[2] &&
            weightsShape[3] === this.outputDepth, "weights must be of shape [" + this.fieldSize + "," + this.fieldSize + "," +
            (this.xTensor.shape[2] + "," + this.outputDepth + "] but they are of") +
            ("shape [" + weightsShape + "]"));
    };
    return Convolution2D;
}(op_1.Operation));
exports.Convolution2D = Convolution2D;

},{"../../globals":36,"../../ops/conv_util":114,"../../util":151,"./op":59}],50:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var util = require("../../util");
var graph_util = require("../graph_util");
var op_1 = require("./op");
var Divide = (function (_super) {
    __extends(Divide, _super);
    function Divide(x1Tensor, x2Tensor, yTensor) {
        var _this = _super.call(this) || this;
        _this.x1Tensor = x1Tensor;
        _this.x2Tensor = x2Tensor;
        _this.yTensor = yTensor;
        util.assert(util.sizeFromShape(x1Tensor.shape) === 1 ||
            util.sizeFromShape(x2Tensor.shape) === 1 ||
            util.arraysEqual(x1Tensor.shape, x2Tensor.shape), 'One of t1 or t2 must be a scalar, or t1 and t2 must have ' +
            'the same shape');
        return _this;
    }
    Divide.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var t1 = inferenceArrays.get(this.x1Tensor);
        var t2 = inferenceArrays.get(this.x2Tensor);
        globals_1.tidy(function () {
            var result;
            if (util.isScalarShape(t1.shape)) {
                result = math.scalarDividedByArray(t1, t2);
            }
            else if (util.isScalarShape(t2.shape)) {
                result = math.arrayDividedByScalar(t1, t2);
            }
            else {
                result = math.divide(t1, t2);
            }
            inferenceArrays.set(_this.yTensor, globals_1.keep(result));
        });
    };
    Divide.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        var x1 = inferenceArrays.get(this.x1Tensor);
        var x2 = inferenceArrays.get(this.x2Tensor);
        var dy = gradientArrays.get(this.yTensor);
        var x1IsScalar = util.isScalarShape(x1.shape);
        var x2IsScalar = util.isScalarShape(x2.shape);
        globals_1.tidy(function () {
            if (graph_util.shouldBackProp(_this.x1Tensor)) {
                if (x1IsScalar) {
                    var div = math.divide(dy, x2);
                    gradientArrays.add(_this.x1Tensor, math.sum(div));
                    div.dispose();
                }
                else if (x2IsScalar) {
                    gradientArrays.add(_this.x1Tensor, math.arrayDividedByScalar(dy, x2));
                }
                else {
                    gradientArrays.add(_this.x1Tensor, math.divide(dy, x2));
                }
            }
            if (graph_util.shouldBackProp(_this.x2Tensor)) {
                var x2Squared = math.elementWiseMul(x2, x2);
                var x1OverX2Squared = void 0;
                if (x2IsScalar) {
                    x1OverX2Squared = math.arrayDividedByScalar(x1, x2Squared);
                }
                else if (x1IsScalar) {
                    x1OverX2Squared = math.scalarDividedByArray(x1, x2Squared);
                }
                else {
                    x1OverX2Squared = math.divide(x1, x2Squared);
                }
                var dx2 = math.neg(x1OverX2Squared);
                var dyTimesDerivative = math.elementWiseMul(dy, dx2);
                if (x2IsScalar) {
                    gradientArrays.add(_this.x2Tensor, math.sum(dyTimesDerivative));
                }
                else {
                    gradientArrays.add(_this.x2Tensor, dyTimesDerivative);
                }
            }
        });
    };
    return Divide;
}(op_1.Operation));
exports.Divide = Divide;

},{"../../globals":36,"../../util":151,"../graph_util":42,"./op":59}],51:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var activation_functions_1 = require("../activation_functions");
var op_1 = require("./op");
var ElementWiseActivation = (function (_super) {
    __extends(ElementWiseActivation, _super);
    function ElementWiseActivation(xTensor, yTensor, func) {
        var _this = _super.call(this) || this;
        _this.xTensor = xTensor;
        _this.yTensor = yTensor;
        _this.func = func;
        return _this;
    }
    ElementWiseActivation.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x = inferenceArrays.get(this.xTensor);
        globals_1.tidy(function () {
            inferenceArrays.set(_this.yTensor, globals_1.keep(_this.func.output(math, x)));
        });
    };
    ElementWiseActivation.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        var x = inferenceArrays.get(this.xTensor);
        var y = inferenceArrays.get(this.yTensor);
        var dy = gradientArrays.get(this.yTensor);
        globals_1.tidy(function () {
            var dydx = _this.func.der(math, x, y);
            gradientArrays.add(_this.xTensor, math.elementWiseMul(dy, dydx));
            dydx.dispose();
        });
    };
    ElementWiseActivation.prototype.dispose = function () {
        this.func.dispose();
    };
    return ElementWiseActivation;
}(op_1.Operation));
exports.ElementWiseActivation = ElementWiseActivation;
var ReLU = (function (_super) {
    __extends(ReLU, _super);
    function ReLU(xTensor, yTensor) {
        return _super.call(this, xTensor, yTensor, new activation_functions_1.ReLUFunc()) || this;
    }
    return ReLU;
}(ElementWiseActivation));
exports.ReLU = ReLU;
var LeakyReLU = (function (_super) {
    __extends(LeakyReLU, _super);
    function LeakyReLU(xTensor, yTensor, alpha) {
        return _super.call(this, xTensor, yTensor, new activation_functions_1.LeakyReluFunc(alpha)) || this;
    }
    return LeakyReLU;
}(ElementWiseActivation));
exports.LeakyReLU = LeakyReLU;
var TanH = (function (_super) {
    __extends(TanH, _super);
    function TanH(xTensor, yTensor) {
        return _super.call(this, xTensor, yTensor, new activation_functions_1.TanHFunc()) || this;
    }
    return TanH;
}(ElementWiseActivation));
exports.TanH = TanH;
var Sigmoid = (function (_super) {
    __extends(Sigmoid, _super);
    function Sigmoid(xTensor, yTensor) {
        return _super.call(this, xTensor, yTensor, new activation_functions_1.SigmoidFunc()) || this;
    }
    return Sigmoid;
}(ElementWiseActivation));
exports.Sigmoid = Sigmoid;
var Square = (function (_super) {
    __extends(Square, _super);
    function Square(xTensor, yTensor) {
        return _super.call(this, xTensor, yTensor, new activation_functions_1.SquareFunc()) || this;
    }
    return Square;
}(ElementWiseActivation));
exports.Square = Square;
var Elu = (function (_super) {
    __extends(Elu, _super);
    function Elu(xTensor, yTensor) {
        return _super.call(this, xTensor, yTensor, new activation_functions_1.EluFunc()) || this;
    }
    return Elu;
}(ElementWiseActivation));
exports.Elu = Elu;
var PReLU = (function (_super) {
    __extends(PReLU, _super);
    function PReLU(xTensor, alphaTensor, yTensor) {
        var _this = _super.call(this) || this;
        _this.xTensor = xTensor;
        _this.alphaTensor = alphaTensor;
        _this.yTensor = yTensor;
        return _this;
    }
    PReLU.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x = inferenceArrays.get(this.xTensor);
        var alpha = inferenceArrays.get(this.alphaTensor);
        globals_1.tidy(function () {
            inferenceArrays.set(_this.yTensor, globals_1.keep(math.prelu(x, alpha)));
        });
    };
    PReLU.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        throw new Error('Not implemented');
    };
    return PReLU;
}(op_1.Operation));
exports.PReLU = PReLU;

},{"../../globals":36,"../activation_functions":38,"./op":59}],52:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../environment");
var globals_1 = require("../../globals");
var tensor_1 = require("../../tensor");
var util = require("../../util");
var cost_functions_1 = require("../cost_functions");
var graph_util = require("../graph_util");
var op_1 = require("./op");
var ElementWiseCost = (function (_super) {
    __extends(ElementWiseCost, _super);
    function ElementWiseCost(x1Tensor, x2Tensor, yTensor, func) {
        var _this = _super.call(this) || this;
        _this.x1Tensor = x1Tensor;
        _this.x2Tensor = x2Tensor;
        _this.yTensor = yTensor;
        _this.func = func;
        _this.oneOverNScalar =
            environment_1.ENV.math.keep(tensor_1.Scalar.new(1 / util.sizeFromShape(x1Tensor.shape)));
        return _this;
    }
    ElementWiseCost.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x1 = inferenceArrays.get(this.x1Tensor);
        var x2 = inferenceArrays.get(this.x2Tensor);
        globals_1.tidy(function () {
            var elementWiseCost = _this.func.cost(x1, x2);
            var sum = math.sum(elementWiseCost);
            var result = math.scalarTimesArray(_this.oneOverNScalar, sum);
            inferenceArrays.set(_this.yTensor, globals_1.keep(result));
        });
    };
    ElementWiseCost.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        var x1 = inferenceArrays.get(this.x1Tensor);
        var x2 = inferenceArrays.get(this.x2Tensor);
        globals_1.tidy(function () {
            if (graph_util.shouldBackProp(_this.x1Tensor)) {
                gradientArrays.add(_this.x1Tensor, _this.func.der(x1, x2));
            }
            if (graph_util.shouldBackProp(_this.x2Tensor)) {
                gradientArrays.add(_this.x2Tensor, _this.func.der(x2, x1));
            }
        });
    };
    ElementWiseCost.prototype.dispose = function () {
        this.func.dispose();
        this.oneOverNScalar.dispose();
    };
    return ElementWiseCost;
}(op_1.Operation));
exports.ElementWiseCost = ElementWiseCost;
var MeanSquaredCost = (function (_super) {
    __extends(MeanSquaredCost, _super);
    function MeanSquaredCost(x1Tensor, x2Tensor, yTensor) {
        return _super.call(this, x1Tensor, x2Tensor, yTensor, new cost_functions_1.SquareCostFunc()) || this;
    }
    return MeanSquaredCost;
}(ElementWiseCost));
exports.MeanSquaredCost = MeanSquaredCost;

},{"../../environment":35,"../../globals":36,"../../tensor":145,"../../util":151,"../cost_functions":39,"../graph_util":42,"./op":59}],53:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var graph_util = require("../graph_util");
var op_1 = require("./op");
var Exp = (function (_super) {
    __extends(Exp, _super);
    function Exp(xTensor, yTensor) {
        var _this = _super.call(this) || this;
        _this.xTensor = xTensor;
        _this.yTensor = yTensor;
        return _this;
    }
    Exp.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x = inferenceArrays.get(this.xTensor);
        globals_1.tidy(function () {
            inferenceArrays.set(_this.yTensor, globals_1.keep(math.exp(x)));
        });
    };
    Exp.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        var y = inferenceArrays.get(this.yTensor);
        var dy = gradientArrays.get(this.yTensor);
        globals_1.tidy(function () {
            if (graph_util.shouldBackProp(_this.xTensor)) {
                gradientArrays.add(_this.xTensor, math.elementWiseMul(y, dy));
            }
        });
    };
    return Exp;
}(op_1.Operation));
exports.Exp = Exp;

},{"../../globals":36,"../graph_util":42,"./op":59}],54:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var graph_util = require("../graph_util");
var op_1 = require("./op");
var LinearCombination = (function (_super) {
    __extends(LinearCombination, _super);
    function LinearCombination(x1Tensor, x2Tensor, c1Tensor, c2Tensor, outTensor) {
        var _this = _super.call(this) || this;
        _this.x1Tensor = x1Tensor;
        _this.x2Tensor = x2Tensor;
        _this.c1Tensor = c1Tensor;
        _this.c2Tensor = c2Tensor;
        _this.outTensor = outTensor;
        return _this;
    }
    LinearCombination.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x1 = inferenceArrays.get(this.x1Tensor);
        var x2 = inferenceArrays.get(this.x2Tensor);
        var c1 = inferenceArrays.get(this.c1Tensor).asScalar();
        var c2 = inferenceArrays.get(this.c2Tensor).asScalar();
        globals_1.tidy(function () {
            inferenceArrays.set(_this.outTensor, globals_1.keep(math.scaledArrayAdd(c1, x1, c2, x2)));
        });
    };
    LinearCombination.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        var x1 = inferenceArrays.get(this.x1Tensor);
        var x2 = inferenceArrays.get(this.x2Tensor);
        var c1 = inferenceArrays.get(this.c1Tensor);
        var c2 = inferenceArrays.get(this.c2Tensor);
        var dy = gradientArrays.get(this.outTensor);
        globals_1.tidy(function () {
            if (graph_util.shouldBackProp(_this.x1Tensor)) {
                gradientArrays.add(_this.x1Tensor, math.scalarTimesArray(c1, dy));
            }
            if (graph_util.shouldBackProp(_this.x2Tensor)) {
                gradientArrays.add(_this.x2Tensor, math.scalarTimesArray(c2, dy));
            }
            if (graph_util.shouldBackProp(_this.c1Tensor)) {
                var dotProduct1 = math.elementWiseMul(x1, dy);
                gradientArrays.add(_this.c1Tensor, math.sum(dotProduct1));
            }
            if (graph_util.shouldBackProp(_this.c2Tensor)) {
                var dotProduct2 = math.elementWiseMul(x2, dy);
                gradientArrays.add(_this.c2Tensor, math.sum(dotProduct2));
            }
        });
    };
    return LinearCombination;
}(op_1.Operation));
exports.LinearCombination = LinearCombination;

},{"../../globals":36,"../graph_util":42,"./op":59}],55:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var graph_util = require("../graph_util");
var op_1 = require("./op");
var Log = (function (_super) {
    __extends(Log, _super);
    function Log(xTensor, yTensor) {
        var _this = _super.call(this) || this;
        _this.xTensor = xTensor;
        _this.yTensor = yTensor;
        return _this;
    }
    Log.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x = inferenceArrays.get(this.xTensor);
        globals_1.tidy(function () {
            inferenceArrays.set(_this.yTensor, globals_1.keep(math.log(x)));
        });
    };
    Log.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        var x = inferenceArrays.get(this.xTensor);
        var dy = gradientArrays.get(this.yTensor);
        globals_1.tidy(function () {
            if (graph_util.shouldBackProp(_this.xTensor)) {
                gradientArrays.add(_this.xTensor, math.divide(dy, x));
            }
        });
    };
    return Log;
}(op_1.Operation));
exports.Log = Log;

},{"../../globals":36,"../graph_util":42,"./op":59}],56:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var graph_util = require("../graph_util");
var op_1 = require("./op");
var MatMul = (function (_super) {
    __extends(MatMul, _super);
    function MatMul(x1Tensor, x2Tensor, yTensor) {
        var _this = _super.call(this) || this;
        _this.x1Tensor = x1Tensor;
        _this.x2Tensor = x2Tensor;
        _this.yTensor = yTensor;
        return _this;
    }
    MatMul.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x1 = inferenceArrays.get(this.x1Tensor);
        var x2 = inferenceArrays.get(this.x2Tensor);
        globals_1.tidy(function () {
            if (x1.shape.length === 2 && x2.shape.length === 2) {
                inferenceArrays.set(_this.yTensor, globals_1.keep(math.matMul(x1, x2)));
            }
            else if (x1.shape.length === 2 && x2.shape.length === 1) {
                inferenceArrays.set(_this.yTensor, globals_1.keep(math.matrixTimesVector(x1, x2)));
            }
            else if (x1.shape.length === 1 && x2.shape.length === 2) {
                inferenceArrays.set(_this.yTensor, globals_1.keep(math.vectorTimesMatrix(x1, x2)));
            }
        });
    };
    MatMul.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        var x1 = inferenceArrays.get(this.x1Tensor);
        var x2 = inferenceArrays.get(this.x2Tensor);
        var dy = gradientArrays.get(this.yTensor);
        if (x1.shape.length === 1) {
            x1 = x1.reshape([1, x1.size]);
            dy = dy.reshape([1, dy.size]);
        }
        if (x2.shape.length === 1) {
            x2 = x2.reshape([x2.size, 1]);
            dy = dy.reshape([dy.size, 1]);
        }
        globals_1.tidy(function () {
            if (graph_util.shouldBackProp(_this.x1Tensor)) {
                var dx1 = math.matMul(dy, x2, false, true);
                gradientArrays.add(_this.x1Tensor, _this.x1Tensor.shape.length === 1 ? dx1.as1D() : dx1);
            }
            if (graph_util.shouldBackProp(_this.x2Tensor)) {
                var dx2 = math.matMul(x1, dy, true, false);
                gradientArrays.add(_this.x2Tensor, _this.x2Tensor.shape.length === 1 ? dx2.as1D() : dx2);
            }
        });
    };
    return MatMul;
}(op_1.Operation));
exports.MatMul = MatMul;

},{"../../globals":36,"../graph_util":42,"./op":59}],57:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var conv_util = require("../../ops/conv_util");
var util = require("../../util");
var op_1 = require("./op");
var MaxPool = (function (_super) {
    __extends(MaxPool, _super);
    function MaxPool(xTensor, yTensor, fieldSize, stride, pad) {
        if (stride === void 0) { stride = 1; }
        var _this = _super.call(this) || this;
        _this.xTensor = xTensor;
        _this.yTensor = yTensor;
        _this.fieldSize = fieldSize;
        _this.stride = stride;
        if (pad != null) {
            _this.pad = pad;
        }
        else {
            _this.pad = conv_util.computeDefaultPad(xTensor.shape, _this.fieldSize, _this.stride);
        }
        util.assert(util.isInt(_this.pad), "The zero padding (" + _this.pad + ") must be an integer. Change the " +
            "stride and/or zero pad parameters");
        return _this;
    }
    MaxPool.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x = inferenceArrays.get(this.xTensor);
        globals_1.tidy(function () {
            inferenceArrays.set(_this.yTensor, globals_1.keep(math.maxPool(x, _this.fieldSize, _this.stride, _this.pad)));
        });
    };
    MaxPool.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        var x = inferenceArrays.get(this.xTensor);
        var dy = gradientArrays.get(this.yTensor);
        globals_1.tidy(function () {
            gradientArrays.add(_this.xTensor, math.maxPoolBackprop(dy, x, _this.fieldSize, _this.stride, _this.pad));
        });
    };
    return MaxPool;
}(op_1.Operation));
exports.MaxPool = MaxPool;

},{"../../globals":36,"../../ops/conv_util":114,"../../util":151,"./op":59}],58:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var util = require("../../util");
var graph_util = require("../graph_util");
var op_1 = require("./op");
var Multiply = (function (_super) {
    __extends(Multiply, _super);
    function Multiply(x1Tensor, x2Tensor, yTensor) {
        var _this = _super.call(this) || this;
        _this.x1Tensor = x1Tensor;
        _this.x2Tensor = x2Tensor;
        _this.yTensor = yTensor;
        util.assert(util.sizeFromShape(x1Tensor.shape) === 1 ||
            util.sizeFromShape(x2Tensor.shape) === 1 ||
            util.arraysEqual(x1Tensor.shape, x2Tensor.shape), 'One of t1 or t2 must be a scalar, or t1 and t2 must have ' +
            'the same shape');
        return _this;
    }
    Multiply.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var t1 = inferenceArrays.get(this.x1Tensor);
        var t2 = inferenceArrays.get(this.x2Tensor);
        globals_1.tidy(function () {
            var result;
            if (util.isScalarShape(t1.shape)) {
                result = math.scalarTimesArray(t1, t2);
            }
            else if (util.isScalarShape(t2.shape)) {
                result = math.scalarTimesArray(t2, t1);
            }
            else {
                result = math.elementWiseMul(t1, t2);
            }
            inferenceArrays.set(_this.yTensor, globals_1.keep(result));
        });
    };
    Multiply.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        var x1 = inferenceArrays.get(this.x1Tensor);
        var x2 = inferenceArrays.get(this.x2Tensor);
        var dy = gradientArrays.get(this.yTensor);
        globals_1.tidy(function () {
            if (graph_util.shouldBackProp(_this.x1Tensor)) {
                if (util.isScalarShape(_this.x1Tensor.shape)) {
                    var mul = math.elementWiseMul(dy, x2);
                    gradientArrays.add(_this.x1Tensor, math.sum(mul));
                }
                else if (util.isScalarShape(x2.shape)) {
                    gradientArrays.add(_this.x1Tensor, math.scalarTimesArray(x2, dy));
                }
                else {
                    gradientArrays.add(_this.x1Tensor, math.elementWiseMul(x2, dy));
                }
            }
            if (graph_util.shouldBackProp(_this.x2Tensor)) {
                if (util.isScalarShape(_this.x2Tensor.shape)) {
                    var mul = math.elementWiseMul(dy, x1);
                    gradientArrays.add(_this.x2Tensor, math.sum(mul));
                }
                else if (util.isScalarShape(x1.shape)) {
                    gradientArrays.add(_this.x2Tensor, math.scalarTimesArray(x1, dy));
                }
                else {
                    gradientArrays.add(_this.x2Tensor, math.elementWiseMul(x1, dy));
                }
            }
        });
    };
    return Multiply;
}(op_1.Operation));
exports.Multiply = Multiply;

},{"../../globals":36,"../../util":151,"../graph_util":42,"./op":59}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Operation = (function () {
    function Operation() {
    }
    Operation.prototype.disposeTransientArrays = function (inferenceArrays, gradientArrays) { };
    Operation.prototype.dispose = function () { };
    return Operation;
}());
exports.Operation = Operation;

},{}],60:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../environment");
var globals_1 = require("../../globals");
var tensor_1 = require("../../tensor");
var util = require("../../util");
var graph_util = require("../graph_util");
var op_1 = require("./op");
var ReduceSum = (function (_super) {
    __extends(ReduceSum, _super);
    function ReduceSum(x, outTensor) {
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.outTensor = outTensor;
        util.assertShapesMatch(outTensor.shape, []);
        _this.ones = environment_1.ENV.math.keep(tensor_1.Tensor.ones(x.shape));
        return _this;
    }
    ReduceSum.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x = inferenceArrays.get(this.x);
        globals_1.tidy(function () {
            inferenceArrays.set(_this.outTensor, globals_1.keep(math.sum(x)));
        });
    };
    ReduceSum.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        if (!graph_util.shouldBackProp(this.x)) {
            return;
        }
        globals_1.tidy(function () {
            var dy = gradientArrays.get(_this.outTensor);
            gradientArrays.add(_this.x, math.scalarTimesArray(dy, _this.ones));
        });
    };
    ReduceSum.prototype.dispose = function () {
        this.ones.dispose();
    };
    return ReduceSum;
}(op_1.Operation));
exports.ReduceSum = ReduceSum;

},{"../../environment":35,"../../globals":36,"../../tensor":145,"../../util":151,"../graph_util":42,"./op":59}],61:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var util = require("../../util");
var op_1 = require("./op");
var Reshape = (function (_super) {
    __extends(Reshape, _super);
    function Reshape(xTensor, yTensor) {
        var _this = _super.call(this) || this;
        _this.xTensor = xTensor;
        _this.yTensor = yTensor;
        var xSize = util.sizeFromShape(xTensor.shape);
        var ySize = util.sizeFromShape(yTensor.shape);
        util.assert(xSize === ySize, "The input size (" + xSize + ") and output size (" + ySize + ") must match");
        return _this;
    }
    Reshape.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x = inferenceArrays.get(this.xTensor);
        var clone = math.clone(x);
        globals_1.tidy(function () {
            inferenceArrays.set(_this.yTensor, globals_1.keep(clone.reshape(_this.yTensor.shape)));
        });
    };
    Reshape.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        var dy = gradientArrays.get(this.yTensor);
        var clone = math.clone(dy);
        globals_1.tidy(function () {
            gradientArrays.add(_this.xTensor, clone.reshape(_this.xTensor.shape));
        });
    };
    return Reshape;
}(op_1.Operation));
exports.Reshape = Reshape;

},{"../../globals":36,"../../util":151,"./op":59}],62:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../environment");
var globals_1 = require("../../globals");
var tensor_1 = require("../../tensor");
var util = require("../../util");
var graph_1 = require("../graph");
var graph_util = require("../graph_util");
var op_1 = require("./op");
var Softmax = (function (_super) {
    __extends(Softmax, _super);
    function Softmax(logitsTensor, output) {
        var _this = _super.call(this) || this;
        _this.logitsTensor = logitsTensor;
        _this.output = output;
        return _this;
    }
    Softmax.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var logits = inferenceArrays.get(this.logitsTensor);
        return globals_1.tidy(function () {
            inferenceArrays.set(_this.output, globals_1.keep(math.softmax(logits)));
        });
    };
    Softmax.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        var y = inferenceArrays.get(this.output);
        var dy = gradientArrays.get(this.output);
        globals_1.tidy(function () {
            if (graph_util.shouldBackProp(_this.logitsTensor)) {
                var dlogits = math.elementWiseMul(math.subtract(dy, math.sum(math.elementWiseMul(dy, y))), y);
                gradientArrays.add(_this.logitsTensor, dlogits);
            }
        });
    };
    return Softmax;
}(op_1.Operation));
exports.Softmax = Softmax;
var SoftmaxCrossEntropyCost = (function (_super) {
    __extends(SoftmaxCrossEntropyCost, _super);
    function SoftmaxCrossEntropyCost(logitsTensor, labelTensor, yTensor) {
        var _this = _super.call(this) || this;
        _this.logitsTensor = logitsTensor;
        _this.labelTensor = labelTensor;
        _this.yTensor = yTensor;
        _this.softmaxTensor = new graph_1.SymbolicTensor(logitsTensor.shape);
        _this.epsilon = environment_1.ENV.math.keep(tensor_1.Scalar.new(1e-5));
        return _this;
    }
    SoftmaxCrossEntropyCost.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var logits = inferenceArrays.get(this.logitsTensor);
        var label = inferenceArrays.get(this.labelTensor);
        globals_1.tidy(function () {
            var softmaxResult = math.softmax(logits);
            inferenceArrays.set(_this.softmaxTensor, globals_1.keep(softmaxResult));
            inferenceArrays.set(_this.yTensor, globals_1.keep(crossEntropyCost(math, softmaxResult, label, _this.epsilon)));
        });
    };
    SoftmaxCrossEntropyCost.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        var softmax = inferenceArrays.get(this.softmaxTensor);
        var label = inferenceArrays.get(this.labelTensor);
        globals_1.tidy(function () {
            gradientArrays.add(_this.logitsTensor, math.subtract(softmax, label));
        });
    };
    SoftmaxCrossEntropyCost.prototype.disposeTransientArrays = function (inferenceArrays, gradientArrays) {
        inferenceArrays.disposeArray(this.softmaxTensor);
    };
    SoftmaxCrossEntropyCost.prototype.dispose = function () {
        this.epsilon.dispose();
    };
    return SoftmaxCrossEntropyCost;
}(op_1.Operation));
exports.SoftmaxCrossEntropyCost = SoftmaxCrossEntropyCost;
function crossEntropyCost(math, y, target, epsilon) {
    util.assert(y.size === target.size, 'The output and target must be the same size');
    return globals_1.tidy(function () {
        var yPlusEps = math.scalarPlusArray(epsilon, y);
        var logOutput = math.log(yPlusEps);
        var tarLogOutput = math.elementWiseMul(target, logOutput);
        var costVector = math.neg(tarLogOutput);
        return math.sum(costVector);
    });
}
exports.crossEntropyCost = crossEntropyCost;

},{"../../environment":35,"../../globals":36,"../../tensor":145,"../../util":151,"../graph":40,"../graph_util":42,"./op":59}],63:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var util = require("../../util");
var graph_util = require("../graph_util");
var op_1 = require("./op");
var Subtract = (function (_super) {
    __extends(Subtract, _super);
    function Subtract(t1, t2, outTensor) {
        var _this = _super.call(this) || this;
        _this.t1 = t1;
        _this.t2 = t2;
        _this.outTensor = outTensor;
        util.assert(util.sizeFromShape(t1.shape) === 1 ||
            util.sizeFromShape(t2.shape) === 1 ||
            util.arraysEqual(t1.shape, t2.shape), 'One of t1 or t2 must be a scalar, or t1 and t2 must have ' +
            'the same shape');
        return _this;
    }
    Subtract.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var t1 = inferenceArrays.get(this.t1);
        var t2 = inferenceArrays.get(this.t2);
        globals_1.tidy(function () {
            var result;
            if (util.isScalarShape(t1.shape)) {
                result = math.scalarMinusArray(t1, t2);
            }
            else if (util.isScalarShape(t2.shape)) {
                result = math.arrayMinusScalar(t1, t2);
            }
            else {
                result = math.subtract(t1, t2);
            }
            inferenceArrays.set(_this.outTensor, globals_1.keep(result));
        });
    };
    Subtract.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        var dy = gradientArrays.get(this.outTensor);
        globals_1.tidy(function () {
            if (graph_util.shouldBackProp(_this.t1)) {
                if (util.isScalarShape(_this.t1.shape)) {
                    var sum = math.sum(dy);
                    gradientArrays.add(_this.t1, sum);
                }
                else {
                    gradientArrays.add(_this.t1, math.clone(dy));
                }
            }
            if (graph_util.shouldBackProp(_this.t2)) {
                if (util.isScalarShape(_this.t2.shape)) {
                    var sum = math.sum(dy);
                    var negSum = math.neg(sum);
                    gradientArrays.add(_this.t2, negSum);
                }
                else {
                    gradientArrays.add(_this.t2, math.neg(dy));
                }
            }
        });
    };
    Subtract.prototype.dispose = function () {
        if (this.dySizeScalar != null) {
            this.dySizeScalar.dispose();
        }
    };
    return Subtract;
}(op_1.Operation));
exports.Subtract = Subtract;

},{"../../globals":36,"../../util":151,"../graph_util":42,"./op":59}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function defaultCompare(a, b) {
    if (a === b) {
        return 0;
    }
    else if (a < b) {
        return -1;
    }
    else {
        return 1;
    }
}
exports.defaultCompare = defaultCompare;
var PriorityQueue = (function () {
    function PriorityQueue(comparator, indexObserver) {
        this.comparator = comparator;
        this.indexObserver = indexObserver;
        this.heap = [];
    }
    PriorityQueue.prototype.enqueue = function (t) {
        this.heap.push(t);
        this.onIndexChanged(t, this.heap.length - 1);
        this.siftUp(this.heap.length - 1);
    };
    PriorityQueue.prototype.dequeue = function () {
        if (this.empty()) {
            throw new Error('dequeue called on empty priority queue.');
        }
        var t = this.heap[0];
        this.swap(0, this.heap.length - 1);
        this.heap.pop();
        this.siftDown(0);
        return t;
    };
    PriorityQueue.prototype.update = function (newT, index) {
        var last = (index === this.heap.length - 1);
        if (!last) {
            this.swap(index, this.heap.length - 1);
        }
        this.heap.pop();
        if (!last) {
            if (this.siftUpIndex(index) !== -1) {
                this.siftUp(index);
            }
            else if (this.siftDownIndex(index) !== -1) {
                this.siftDown(index);
            }
        }
        this.enqueue(newT);
    };
    PriorityQueue.prototype.empty = function () {
        return this.heap.length === 0;
    };
    PriorityQueue.prototype.onIndexChanged = function (t, newIndex) {
        if (this.indexObserver) {
            this.indexObserver(t, newIndex);
        }
    };
    PriorityQueue.prototype.getParentIndex = function (index) {
        if (index === 0) {
            return -1;
        }
        return Math.floor((index - 1) / 2);
    };
    PriorityQueue.prototype.getLeftChildIndex = function (index) {
        var candidate = index * 2 + 1;
        return candidate < this.heap.length ? candidate : -1;
    };
    PriorityQueue.prototype.getRightChildIndex = function (index) {
        var candidate = index * 2 + 2;
        return candidate < this.heap.length ? candidate : -1;
    };
    PriorityQueue.prototype.siftUpIndex = function (index) {
        var parentIndex = this.getParentIndex(index);
        if (parentIndex === -1) {
            return -1;
        }
        if (this.compare(parentIndex, index) > 0) {
            return parentIndex;
        }
        return -1;
    };
    PriorityQueue.prototype.siftUp = function (index) {
        var siftIndex = this.siftUpIndex(index);
        while (siftIndex !== -1) {
            this.swap(index, siftIndex);
            index = siftIndex;
            siftIndex = this.siftUpIndex(index);
        }
    };
    PriorityQueue.prototype.siftDownIndex = function (index) {
        if (index >= this.heap.length) {
            return -1;
        }
        var largestChildIndex = index;
        var leftChildIndex = this.getLeftChildIndex(index);
        if ((leftChildIndex !== -1) &&
            (this.compare(leftChildIndex, largestChildIndex) < 0)) {
            largestChildIndex = leftChildIndex;
        }
        var rightChildIndex = this.getRightChildIndex(index);
        if ((rightChildIndex !== -1) &&
            (this.compare(rightChildIndex, largestChildIndex) < 0)) {
            largestChildIndex = rightChildIndex;
        }
        return (largestChildIndex === index) ? -1 : largestChildIndex;
    };
    PriorityQueue.prototype.siftDown = function (index) {
        var siftIndex = this.siftDownIndex(index);
        while (siftIndex !== -1) {
            this.swap(index, siftIndex);
            index = siftIndex;
            siftIndex = this.siftDownIndex(index);
        }
    };
    PriorityQueue.prototype.compare = function (aIndex, bIndex) {
        return this.comparator(this.heap[aIndex], this.heap[bIndex]);
    };
    PriorityQueue.prototype.swap = function (a, b) {
        var temp = this.heap[a];
        this.heap[a] = this.heap[b];
        this.heap[b] = temp;
        this.onIndexChanged(this.heap[a], a);
        this.onIndexChanged(this.heap[b], b);
    };
    return PriorityQueue;
}());
exports.PriorityQueue = PriorityQueue;

},{}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../globals");
var tensor_1 = require("../tensor");
var util = require("../util");
var operation_emitter = require("./operation_emitter");
var session_util = require("./session_util");
var tensor_array_map_1 = require("./tensor_array_map");
var FeedDictionary = (function () {
    function FeedDictionary(feedEntries) {
        var _this = this;
        this.dict = {};
        if (feedEntries) {
            feedEntries.forEach(function (entry) { return _this.dict[entry.tensor.id] = entry; });
        }
    }
    return FeedDictionary;
}());
exports.FeedDictionary = FeedDictionary;
var CostReduction;
(function (CostReduction) {
    CostReduction[CostReduction["NONE"] = 0] = "NONE";
    CostReduction[CostReduction["SUM"] = 1] = "SUM";
    CostReduction[CostReduction["MEAN"] = 2] = "MEAN";
})(CostReduction = exports.CostReduction || (exports.CostReduction = {}));
var Session = (function () {
    function Session(graph, math) {
        this.math = math;
        this.activationArrayMap = new tensor_array_map_1.TensorArrayMap();
        this.runtimeCache = {};
        this.oneScalar = tensor_1.Scalar.new(1);
        this.gradientArrayMap = new tensor_array_map_1.SummedTensorArrayMap(this.math);
    }
    Session.prototype.dispose = function () {
        var _this = this;
        this.activationArrayMap.dispose();
        Object.keys(this.runtimeCache).forEach(function (key) {
            var runtime = _this.runtimeCache[key];
            if (runtime.operations) {
                runtime.operations.forEach(function (op) { return op.dispose(); });
            }
        });
        this.runtimeCache = {};
        if (this.batchSizeScalar != null) {
            this.batchSizeScalar.dispose();
        }
        this.oneScalar.dispose();
    };
    Session.prototype.evalAll = function (tensors, feedEntries) {
        var _this = this;
        return globals_1.tidy(function () {
            var feed = new FeedDictionary(feedEntries);
            var runtime = _this.getOrCreateRuntime(tensors, feed);
            var activations = _this.activationArrayMap;
            session_util.disposeAndInitializeOperationOutputs(runtime.nodes, activations);
            session_util.disposeTransientOperationArrays(runtime.operations, _this.activationArrayMap, _this.gradientArrayMap);
            session_util.addPersistentArraysToTensorArrayMap(runtime.nodes, activations);
            session_util.loadInputsFromFeedDictionaryToTensorArrayMap(feed, activations, _this.math);
            runtime.operations.forEach(function (op) { return op.feedForward(_this.math, activations); });
            var results = tensors.map(function (x) { return activations.get(x); });
            tensors.forEach(function (x) { return activations.delete(x); });
            session_util.releaseFeedDictionaryInputsFromTensorArrayMap(feed, activations, _this.math);
            return results;
        });
    };
    Session.prototype.eval = function (tensor, feedEntries) {
        return this.evalAll([tensor], feedEntries)[0];
    };
    Session.prototype.train = function (costTensor, feedEntries, batchSize, optimizer, costReduction) {
        var _this = this;
        if (costReduction === void 0) { costReduction = CostReduction.NONE; }
        util.assert(util.isScalarShape(costTensor.shape), 'Cost tensor for training must be a scalar value.');
        if (this.prevBatchSize !== batchSize) {
            this.prevBatchSize = batchSize;
            if (this.batchSizeScalar != null) {
                this.batchSizeScalar.dispose();
            }
            this.batchSizeScalar = this.math.keep(tensor_1.Scalar.new(batchSize));
        }
        var feed = new FeedDictionary(feedEntries);
        session_util.throwIfFeedDictionaryContainsNDArrays(feed);
        var runtime = this.getOrCreateRuntime([costTensor], feed);
        var inferenceOperations = runtime.operations;
        var backPropOperations = runtime.operations.slice().reverse();
        var activations = this.activationArrayMap;
        var gradients = this.gradientArrayMap;
        gradients.nullify(costTensor);
        gradients.add(costTensor, this.oneScalar);
        session_util.addPersistentArraysToTensorArrayMap(runtime.nodes, activations);
        optimizer.beforeBatch(this.math, batchSize, runtime, activations, gradients);
        return globals_1.tidy(function () {
            var cost = tensor_1.Scalar.new(0);
            for (var i = 0; i < batchSize; ++i) {
                session_util.disposeAndInitializeOperationOutputs(runtime.nodes, activations);
                session_util.disposeAndInitializeOperationInputGradients(runtime.nodes, gradients);
                session_util.disposeTransientOperationArrays(runtime.operations, activations, gradients);
                session_util.loadInputsFromFeedDictionaryToTensorArrayMap(feed, activations, _this.math);
                inferenceOperations.forEach(function (op) { return op.feedForward(_this.math, activations); });
                backPropOperations.forEach(function (op) { return op.backProp(_this.math, activations, gradients); });
                optimizer.afterExample(_this.math, runtime, activations, gradients);
                session_util.releaseFeedDictionaryInputsFromTensorArrayMap(feed, activations, _this.math);
                cost = _this.updateCostForExample(cost, activations.get(costTensor), costReduction);
            }
            optimizer.afterBatch(_this.math, batchSize, runtime, activations, gradients);
            return _this.updateCostForBatch(cost, costReduction);
        });
    };
    Session.prototype.updateCostForExample = function (totalCost, currCost, costReduction) {
        if (costReduction === CostReduction.MEAN ||
            costReduction === CostReduction.SUM) {
            return this.math.add(totalCost, currCost);
        }
        return totalCost;
    };
    Session.prototype.updateCostForBatch = function (totalCost, costReduction) {
        if (costReduction === CostReduction.MEAN) {
            return this.math.divide(totalCost, this.batchSizeScalar);
        }
        return totalCost;
    };
    Session.prototype.getOrCreateRuntime = function (tensors, feed) {
        var key = this.makeRuntimeCacheKey(tensors, feed);
        var runtime = this.runtimeCache[key];
        if (runtime === undefined) {
            var nodes = session_util.getOrderedEvaluationSetFromEvalTensor(tensors, feed);
            session_util.removeFeedDictionaryNodesFromEvaluationSet(feed, nodes);
            session_util.throwErrorIfEvaluationSetContainsPlaceholderNodes(nodes);
            var operations = operation_emitter.emitFromGraphNodes(nodes);
            runtime = { nodes: nodes, operations: operations };
            this.runtimeCache[key] = runtime;
        }
        return runtime;
    };
    Session.prototype.makeRuntimeCacheKey = function (tensors, feed) {
        return tensors.map(function (x) { return x.id; }).sort().join('_') + '__' +
            Object.keys(feed.dict).sort().join('_');
    };
    return Session;
}());
exports.Session = Session;

},{"../globals":36,"../tensor":145,"../util":151,"./operation_emitter":44,"./session_util":66,"./tensor_array_map":67}],66:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tensor_1 = require("../tensor");
var util = require("../util");
var graph_1 = require("./graph");
var graph_util = require("./graph_util");
function getTerminatingNodesFromFeedDictionary(feedDictionary) {
    return Object.keys(feedDictionary.dict)
        .map(function (tensorID) { return feedDictionary.dict[+tensorID].tensor.node; });
}
exports.getTerminatingNodesFromFeedDictionary = getTerminatingNodesFromFeedDictionary;
function getOrderedEvaluationSetFromEvalTensor(evalTensors, feedDictionary) {
    var terminatingNodes = getTerminatingNodesFromFeedDictionary(feedDictionary);
    var evalNodes = evalTensors.map(function (x) { return x.node; });
    var unorderedEvaluationSet = graph_util.getUnorderedEvaluationSet(evalNodes, terminatingNodes);
    var orderedEvaluationSet = graph_util.getOrderedEvaluationSet(unorderedEvaluationSet);
    return orderedEvaluationSet;
}
exports.getOrderedEvaluationSetFromEvalTensor = getOrderedEvaluationSetFromEvalTensor;
function addPersistentArraysToTensorArrayMap(evaluationSet, tensorArrayMap) {
    evaluationSet.forEach(function (node) {
        if (node instanceof graph_1.VariableNode || node instanceof graph_1.ConstantNode) {
            tensorArrayMap.set(node.output, node.data);
        }
    });
}
exports.addPersistentArraysToTensorArrayMap = addPersistentArraysToTensorArrayMap;
function getVariableNodesFromEvaluationSet(evaluationSet) {
    var nodes = [];
    evaluationSet.forEach(function (node) {
        if (node instanceof graph_1.VariableNode) {
            nodes.push(node);
        }
    });
    return nodes;
}
exports.getVariableNodesFromEvaluationSet = getVariableNodesFromEvaluationSet;
function throwIfFeedDictionaryContainsNDArrays(feedDictionary) {
    Object.keys(feedDictionary.dict).forEach(function (tensorID) {
        if (feedDictionary.dict[+tensorID].data instanceof tensor_1.Tensor) {
            throw new Error('training requires FeedDictionary entries to be InputProviders' +
                'and not NDArrays.');
        }
    });
}
exports.throwIfFeedDictionaryContainsNDArrays = throwIfFeedDictionaryContainsNDArrays;
function loadInputsFromFeedDictionaryToTensorArrayMap(batchFeed, activations, math) {
    Object.keys(batchFeed.dict).forEach(function (tensorID) {
        var feedEntry = batchFeed.dict[+tensorID];
        var data;
        if (feedEntry.data instanceof tensor_1.Tensor) {
            data = feedEntry.data;
        }
        else {
            var provider = feedEntry.data;
            data = provider.getNextCopy();
        }
        util.assert(util.arraysEqual(feedEntry.tensor.shape, data.shape), "Error loading FeedEntry: feeding NDArray of shape " + data.shape + " " +
            ("does not match Tensor (id: " + feedEntry.tensor.id + ") shape: ") +
            (feedEntry.tensor.shape + "."));
        activations.set(feedEntry.tensor, data);
    });
}
exports.loadInputsFromFeedDictionaryToTensorArrayMap = loadInputsFromFeedDictionaryToTensorArrayMap;
function releaseFeedDictionaryInputsFromTensorArrayMap(batchFeed, activations, math) {
    Object.keys(batchFeed.dict).forEach(function (tensorID) {
        var feedEntry = batchFeed.dict[+tensorID];
        if (!(feedEntry.data instanceof tensor_1.Tensor)) {
            var provider = feedEntry.data;
            var feedEntryArray = activations.get(feedEntry.tensor);
            provider.disposeCopy(feedEntryArray);
        }
        activations.delete(feedEntry.tensor);
    });
}
exports.releaseFeedDictionaryInputsFromTensorArrayMap = releaseFeedDictionaryInputsFromTensorArrayMap;
function removeFeedDictionaryNodesFromEvaluationSet(feedDictionary, evaluationSet) {
    var i = 0;
    while (i < evaluationSet.length) {
        var node = evaluationSet[i];
        if (feedDictionary.dict[node.output.id] != null) {
            evaluationSet.splice(i, 1);
        }
        else {
            ++i;
        }
    }
}
exports.removeFeedDictionaryNodesFromEvaluationSet = removeFeedDictionaryNodesFromEvaluationSet;
function disposeAndInitializeOperationOutputs(evaluationSet, tensorArrayMap) {
    evaluationSet.forEach(function (node) {
        if (!graph_util.isInputNode(node)) {
            if (!graph_util.isPassthroughNode(node, tensorArrayMap)) {
                tensorArrayMap.disposeArray(node.output);
            }
            tensorArrayMap.set(node.output, null);
        }
    });
}
exports.disposeAndInitializeOperationOutputs = disposeAndInitializeOperationOutputs;
function disposeAndInitializeOperationInputGradients(evaluationSet, gradients) {
    evaluationSet.forEach(function (node) {
        Object.keys(node.inputs).forEach(function (inputName) {
            var input = node.inputs[inputName];
            if (gradients.get(input, true) !== gradients.get(node.output, true)) {
                gradients.disposeArray(input);
            }
            gradients.nullify(input);
        });
    });
}
exports.disposeAndInitializeOperationInputGradients = disposeAndInitializeOperationInputGradients;
function disposeTransientOperationArrays(operations, activations, gradients) {
    operations.forEach(function (op) { return op.disposeTransientArrays(activations, gradients); });
}
exports.disposeTransientOperationArrays = disposeTransientOperationArrays;
function throwErrorIfEvaluationSetContainsPlaceholderNodes(evaluationSet) {
    evaluationSet.forEach(function (node) {
        if (node instanceof graph_1.PlaceholderNode) {
            var shape = '[' + node.output.shape.join(', ') + ']';
            throw new Error('Placeholder node "' + node.name + '" ' + shape +
                ' not present in feed dictionary.');
        }
    });
}
exports.throwErrorIfEvaluationSetContainsPlaceholderNodes = throwErrorIfEvaluationSetContainsPlaceholderNodes;

},{"../tensor":145,"../util":151,"./graph":40,"./graph_util":42}],67:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var TensorArrayMapBase = (function () {
    function TensorArrayMapBase() {
        this.dict = {};
    }
    TensorArrayMapBase.prototype.get = function (tensor, skipChecks) {
        if (skipChecks === void 0) { skipChecks = false; }
        if (!skipChecks && this.dict[tensor.id] === undefined) {
            throw new Error("tensor " + tensor.id + " not in array map.");
        }
        var nda = this.dict[tensor.id];
        if (!skipChecks && nda === null) {
            throw new Error("tensor " + tensor.id + " has null array.");
        }
        return nda;
    };
    TensorArrayMapBase.prototype.delete = function (tensor) {
        delete this.dict[tensor.id];
    };
    TensorArrayMapBase.prototype.nullify = function (tensor) {
        this.dict[tensor.id] = null;
    };
    TensorArrayMapBase.prototype.disposeArray = function (tensor) {
        if (this.dict[tensor.id] === undefined) {
            return;
        }
        var nda = this.dict[tensor.id];
        if (nda === null) {
            return;
        }
        nda.dispose();
        this.dict[tensor.id] = null;
    };
    TensorArrayMapBase.prototype.size = function () {
        return Object.keys(this.dict).length;
    };
    TensorArrayMapBase.prototype.dispose = function () {
        var _this = this;
        Object.keys(this.dict).forEach(function (tensorID) {
            var nda = _this.dict[+tensorID];
            if (nda) {
                nda.dispose();
            }
        });
        this.dict = {};
    };
    TensorArrayMapBase.prototype.hasNullArray = function (tensor) {
        if (this.dict[tensor.id] === undefined) {
            throw new Error("tensor " + tensor.id + " not in array map.");
        }
        return this.dict[tensor.id] === null;
    };
    return TensorArrayMapBase;
}());
exports.TensorArrayMapBase = TensorArrayMapBase;
var TensorArrayMap = (function (_super) {
    __extends(TensorArrayMap, _super);
    function TensorArrayMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TensorArrayMap.prototype.set = function (tensor, array) {
        this.dict[tensor.id] = array;
    };
    return TensorArrayMap;
}(TensorArrayMapBase));
exports.TensorArrayMap = TensorArrayMap;
var SummedTensorArrayMap = (function (_super) {
    __extends(SummedTensorArrayMap, _super);
    function SummedTensorArrayMap(math) {
        var _this = _super.call(this) || this;
        _this.math = math;
        return _this;
    }
    SummedTensorArrayMap.prototype.add = function (tensor, array) {
        if (this.dict[tensor.id] == null) {
            this.dict[tensor.id] = this.math.keep(array);
        }
        else {
            var oldValue = this.get(tensor);
            var newValue = this.math.keep(this.math.addStrict(oldValue, array));
            this.dict[tensor.id] = newValue;
            oldValue.dispose();
        }
    };
    return SummedTensorArrayMap;
}(TensorArrayMapBase));
exports.SummedTensorArrayMap = SummedTensorArrayMap;

},{}],68:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var browser_util_1 = require("./browser_util");
var contrib = require("./contrib");
exports.contrib = contrib;
var xhr_dataset = require("./data/xhr-dataset");
exports.xhr_dataset = xhr_dataset;
var environment = require("./environment");
exports.environment = environment;
var environment_1 = require("./environment");
var gpgpu_util = require("./kernels/webgl/gpgpu_util");
exports.gpgpu_util = gpgpu_util;
var webgl_util = require("./kernels/webgl/webgl_util");
exports.webgl_util = webgl_util;
var conv_util = require("./ops/conv_util");
exports.conv_util = conv_util;
var test_util = require("./test_util");
exports.test_util = test_util;
var util = require("./util");
exports.util = util;
var version_1 = require("./version");
exports.version = version_1.version;
var checkpoint_loader_1 = require("./data/checkpoint_loader");
exports.CheckpointLoader = checkpoint_loader_1.CheckpointLoader;
var dataset_1 = require("./data/dataset");
exports.InMemoryDataset = dataset_1.InMemoryDataset;
var input_provider_1 = require("./data/input_provider");
exports.InCPUMemoryShuffledInputProviderBuilder = input_provider_1.InCPUMemoryShuffledInputProviderBuilder;
exports.InGPUMemoryShuffledInputProviderBuilder = input_provider_1.InGPUMemoryShuffledInputProviderBuilder;
var xhr_dataset_1 = require("./data/xhr-dataset");
exports.XhrDataset = xhr_dataset_1.XhrDataset;
var environment_2 = require("./environment");
exports.ENV = environment_2.ENV;
exports.Environment = environment_2.Environment;
var graph_1 = require("./graph/graph");
exports.Graph = graph_1.Graph;
exports.SymbolicTensor = graph_1.SymbolicTensor;
var graph_runner_1 = require("./graph/graph_runner");
exports.GraphRunner = graph_runner_1.GraphRunner;
exports.MetricReduction = graph_runner_1.MetricReduction;
var initializers_1 = require("./graph/initializers");
exports.ConstantInitializer = initializers_1.ConstantInitializer;
exports.OnesInitializer = initializers_1.OnesInitializer;
exports.RandomNormalInitializer = initializers_1.RandomNormalInitializer;
exports.RandomTruncatedNormalInitializer = initializers_1.RandomTruncatedNormalInitializer;
exports.RandomUniformInitializer = initializers_1.RandomUniformInitializer;
exports.TensorInitializer = initializers_1.TensorInitializer;
exports.VarianceScalingInitializer = initializers_1.VarianceScalingInitializer;
exports.ZerosInitializer = initializers_1.ZerosInitializer;
var session_1 = require("./graph/session");
exports.CostReduction = session_1.CostReduction;
exports.Session = session_1.Session;
var backend_cpu_1 = require("./kernels/backend_cpu");
exports.MathBackendCPU = backend_cpu_1.MathBackendCPU;
exports.NDArrayMathCPU = backend_cpu_1.NDArrayMathCPU;
var backend_webgl_1 = require("./kernels/backend_webgl");
exports.MathBackendWebGL = backend_webgl_1.MathBackendWebGL;
exports.NDArrayMathGPU = backend_webgl_1.NDArrayMathGPU;
var gpgpu_context_1 = require("./kernels/webgl/gpgpu_context");
exports.GPGPUContext = gpgpu_context_1.GPGPUContext;
var math_1 = require("./math");
exports.NDArrayMath = math_1.NDArrayMath;
var matmul_1 = require("./ops/matmul");
exports.MatrixOrientation = matmul_1.MatrixOrientation;
var adadelta_optimizer_1 = require("./optimizers/adadelta_optimizer");
exports.AdadeltaOptimizer = adadelta_optimizer_1.AdadeltaOptimizer;
var adagrad_optimizer_1 = require("./optimizers/adagrad_optimizer");
exports.AdagradOptimizer = adagrad_optimizer_1.AdagradOptimizer;
var adam_optimizer_1 = require("./optimizers/adam_optimizer");
exports.AdamOptimizer = adam_optimizer_1.AdamOptimizer;
var adamax_optimizer_1 = require("./optimizers/adamax_optimizer");
exports.AdamaxOptimizer = adamax_optimizer_1.AdamaxOptimizer;
var momentum_optimizer_1 = require("./optimizers/momentum_optimizer");
exports.MomentumOptimizer = momentum_optimizer_1.MomentumOptimizer;
var optimizer_1 = require("./optimizers/optimizer");
exports.Optimizer = optimizer_1.Optimizer;
var rmsprop_optimizer_1 = require("./optimizers/rmsprop_optimizer");
exports.RMSPropOptimizer = rmsprop_optimizer_1.RMSPropOptimizer;
var sgd_optimizer_1 = require("./optimizers/sgd_optimizer");
exports.SGDOptimizer = sgd_optimizer_1.SGDOptimizer;
var tensor_1 = require("./tensor");
exports.Array1D = tensor_1.Array1D;
exports.Array2D = tensor_1.Array2D;
exports.Array3D = tensor_1.Array3D;
exports.Array4D = tensor_1.Array4D;
exports.NDArray = tensor_1.NDArray;
exports.Scalar = tensor_1.Scalar;
exports.Tensor = tensor_1.Tensor;
exports.Tensor1D = tensor_1.Tensor1D;
exports.Tensor2D = tensor_1.Tensor2D;
exports.Tensor3D = tensor_1.Tensor3D;
exports.Tensor4D = tensor_1.Tensor4D;
exports.variable = tensor_1.variable;
exports.Variable = tensor_1.Variable;
var types_1 = require("./types");
exports.Rank = types_1.Rank;
var weights_loader_1 = require("./weights_loader");
exports.loadWeights = weights_loader_1.loadWeights;
__export(require("./ops/ops"));
__export(require("./train"));
__export(require("./globals"));
exports.setBackend = environment_1.Environment.setBackend;
exports.getBackend = environment_1.Environment.getBackend;
exports.memory = environment_1.Environment.memory;
exports.nextFrame = browser_util_1.BrowserUtil.nextFrame;

},{"./browser_util":11,"./contrib":27,"./data/checkpoint_loader":28,"./data/dataset":29,"./data/input_provider":30,"./data/xhr-dataset":31,"./environment":35,"./globals":36,"./graph/graph":40,"./graph/graph_runner":41,"./graph/initializers":43,"./graph/session":65,"./kernels/backend_cpu":69,"./kernels/backend_webgl":70,"./kernels/webgl/gpgpu_context":82,"./kernels/webgl/gpgpu_util":84,"./kernels/webgl/webgl_util":103,"./math":104,"./ops/conv_util":114,"./ops/matmul":119,"./ops/ops":122,"./optimizers/adadelta_optimizer":134,"./optimizers/adagrad_optimizer":135,"./optimizers/adam_optimizer":136,"./optimizers/adamax_optimizer":137,"./optimizers/momentum_optimizer":138,"./optimizers/optimizer":139,"./optimizers/rmsprop_optimizer":141,"./optimizers/sgd_optimizer":142,"./tensor":145,"./test_util":147,"./train":149,"./types":150,"./util":151,"./version":152,"./weights_loader":153}],69:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var seedrandom = require("seedrandom");
var environment_1 = require("../environment");
var math_1 = require("../math");
var axis_util = require("../ops/axis_util");
var broadcast_util = require("../ops/broadcast_util");
var concat_util = require("../ops/concat_util");
var ops = require("../ops/ops");
var ops_1 = require("../ops/ops");
var selu_util = require("../ops/selu_util");
var tensor_1 = require("../tensor");
var types = require("../types");
var util = require("../util");
var MathBackendCPU = (function () {
    function MathBackendCPU() {
        this.data = new WeakMap();
        if (typeof document !== 'undefined') {
            this.canvas = document.createElement('canvas');
        }
    }
    MathBackendCPU.prototype.register = function (dataId, shape, dtype) {
        if (this.data.has(dataId)) {
            throw new Error("Data buffer is already registered");
        }
        this.data.set(dataId, null);
    };
    MathBackendCPU.prototype.write = function (dataId, values) {
        if (values == null) {
            throw new Error('MathBackendCPU.write(): values can not be null');
        }
        this.throwIfNoData(dataId);
        this.data.set(dataId, values);
    };
    MathBackendCPU.prototype.fromPixels = function (pixels, numChannels) {
        if (pixels == null) {
            throw new Error('MathBackendCPU.writePixels(): pixels can not be null');
        }
        var vals;
        if (pixels instanceof ImageData) {
            vals = pixels.data;
        }
        else if (pixels instanceof HTMLCanvasElement) {
            vals = pixels.getContext('2d')
                .getImageData(0, 0, pixels.width, pixels.height)
                .data;
        }
        else if (pixels instanceof HTMLImageElement ||
            pixels instanceof HTMLVideoElement) {
            if (this.canvas == null) {
                throw new Error('Can\'t read pixels from HTMLImageElement outside ' +
                    'the browser.');
            }
            this.canvas.width = pixels.width;
            this.canvas.height = pixels.height;
            this.canvas.getContext('2d').drawImage(pixels, 0, 0, pixels.width, pixels.height);
            vals = this.canvas.getContext('2d')
                .getImageData(0, 0, pixels.width, pixels.height)
                .data;
        }
        else {
            throw new Error("pixels is of unknown type: " + pixels.constructor.name);
        }
        var values;
        if (numChannels === 4) {
            values = new Int32Array(vals);
        }
        else {
            var numPixels = pixels.width * pixels.height;
            values = new Int32Array(numPixels * numChannels);
            for (var i = 0; i < numPixels; i++) {
                for (var channel = 0; channel < numChannels; ++channel) {
                    values[i * numChannels + channel] = vals[i * 4 + channel];
                }
            }
        }
        var outShape = [pixels.height, pixels.width, numChannels];
        return ops_1.tensor3d(values, outShape, 'int32');
    };
    MathBackendCPU.prototype.read = function (dataId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.readSync(dataId)];
            });
        });
    };
    MathBackendCPU.prototype.readSync = function (dataId) {
        this.throwIfNoData(dataId);
        return this.data.get(dataId);
    };
    MathBackendCPU.prototype.disposeData = function (dataId) {
        if (this.data.has(dataId)) {
            this.data.delete(dataId);
        }
    };
    MathBackendCPU.prototype.time = function (f) {
        return __awaiter(this, void 0, void 0, function () {
            var start, kernelMs;
            return __generator(this, function (_a) {
                start = performance.now();
                f();
                kernelMs = performance.now() - start;
                return [2, { kernelMs: kernelMs }];
            });
        });
    };
    MathBackendCPU.prototype.memory = function () {
        return {
            unreliable: true
        };
    };
    MathBackendCPU.prototype.throwIfNoData = function (dataId) {
        if (!this.data.has(dataId)) {
            throw new Error("CPU backend: No data found for this tensor. " +
                "Did you change your backend in the middle of the program? " +
                "New backends can't use Tensors created with previous backends");
        }
    };
    MathBackendCPU.prototype.slice = function (x, begin, size) {
        var buffer = ops.buffer(size, x.dtype);
        for (var i = 0; i < buffer.size; ++i) {
            var loc = buffer.indexToLoc(i);
            var xLoc = loc.map(function (idx, j) { return idx + begin[j]; });
            buffer.set.apply(buffer, [x.get.apply(x, xLoc)].concat(loc));
        }
        return buffer.toTensor();
    };
    MathBackendCPU.prototype.reverse = function (x, axis) {
        var buffer = ops.buffer(x.shape, x.dtype);
        var xBuffer = x.buffer();
        var _loop_1 = function (i) {
            var outLoc = buffer.indexToLoc(i);
            var inLoc = outLoc.slice();
            axis.forEach(function (ax) { return inLoc[ax] = x.shape[ax] - 1 - inLoc[ax]; });
            buffer.set.apply(buffer, [xBuffer.get.apply(xBuffer, inLoc)].concat(outLoc));
        };
        for (var i = 0; i < buffer.size; i++) {
            _loop_1(i);
        }
        return buffer.toTensor();
    };
    MathBackendCPU.prototype.concat = function (a, b) {
        var outShape = concat_util.computeOutShape(a.shape, b.shape, 1);
        var buffer = ops.buffer(outShape, a.dtype);
        if (a.shape[0] === 1 && b.shape[0] === 1) {
            var aVals = a.dataSync();
            var bVals = b.dataSync();
            var vals = buffer.values;
            vals.set(aVals, 0);
            vals.set(bVals, a.size);
            return buffer.toTensor();
        }
        for (var i = 0; i < outShape[0]; ++i) {
            for (var j = 0; j < a.shape[1]; ++j) {
                buffer.set(a.get(i, j), i, j);
            }
            for (var j = 0; j < b.shape[1]; ++j) {
                buffer.set(b.get(i, j), i, j + a.shape[1]);
            }
        }
        return buffer.toTensor();
    };
    MathBackendCPU.prototype.neg = function (x) {
        return this.multiply(ops.scalar(-1), x);
    };
    MathBackendCPU.prototype.add = function (a, b) {
        return this.broadcastedBinaryOp(a, b, types.upcastType(a.dtype, b.dtype), function (aValue, bValue) { return aValue + bValue; });
    };
    MathBackendCPU.prototype.subtract = function (a, b) {
        return this.broadcastedBinaryOp(a, b, types.upcastType(a.dtype, b.dtype), function (aValue, bValue) { return aValue - bValue; });
    };
    MathBackendCPU.prototype.pow = function (a, b) {
        return this.broadcastedBinaryOp(a, b, a.dtype, function (aValue, bValue) { return Math.pow(aValue, bValue); });
    };
    MathBackendCPU.prototype.matMul = function (a, b, transposeA, transposeB) {
        var sharedDim = transposeA ? a.shape[0] : a.shape[1];
        var leftDim = transposeA ? a.shape[1] : a.shape[0];
        var rightDim = transposeB ? b.shape[0] : b.shape[1];
        var normalGetter = function (matrix, i, j) {
            return matrix.get(i, j);
        };
        var transposedGetter = function (matrix, i, j) {
            return matrix.get(j, i);
        };
        var aGetter = transposeA ? transposedGetter : normalGetter;
        var bGetter = transposeB ? transposedGetter : normalGetter;
        var values = new Float32Array(leftDim * rightDim);
        var index = 0;
        for (var i = 0; i < leftDim; ++i) {
            for (var j = 0; j < rightDim; ++j) {
                var sum = 0;
                for (var k = 0; k < sharedDim; ++k) {
                    sum += aGetter(a, i, k) * bGetter(b, k, j);
                }
                values[index++] = sum;
            }
        }
        return ops.tensor2d(values, [leftDim, rightDim]);
    };
    MathBackendCPU.prototype.multiply = function (a, b) {
        return this.broadcastedBinaryOp(a, b, types.upcastType(a.dtype, b.dtype), function (aValue, bValue) { return aValue * bValue; });
    };
    MathBackendCPU.prototype.divide = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'float32', function (aValue, bValue) { return aValue / bValue; });
    };
    MathBackendCPU.prototype.sum = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('sum', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var resultDtype = types.upcastType(x.dtype, 'int32');
        var result = ops.zeros(outShape, resultDtype);
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var sum = 0;
            for (var j = 0; j < reduceSize; ++j) {
                sum += aVals[offset + j];
            }
            vals[i] = sum;
        }
        return result;
    };
    MathBackendCPU.prototype.argMin = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('argMin', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ops.zeros(outShape, 'int32');
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var min = aVals[offset];
            var minIndex = 0;
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                if (isNaN(value)) {
                    minIndex = util.NAN_INT32;
                    break;
                }
                if (value < min) {
                    min = value;
                    minIndex = j;
                }
            }
            vals[i] = minIndex;
        }
        return result;
    };
    MathBackendCPU.prototype.argMax = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('argMax', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ops.zeros(outShape, 'int32');
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var max = aVals[offset];
            var maxIndex = 0;
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                if (isNaN(value)) {
                    maxIndex = util.NAN_INT32;
                    break;
                }
                if (value > max) {
                    max = value;
                    maxIndex = j;
                }
            }
            vals[i] = maxIndex;
        }
        return result;
    };
    MathBackendCPU.prototype.equal = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            if (util.isValNaN(aVal, a.dtype) || util.isValNaN(bVal, b.dtype)) {
                return util.getNaN('bool');
            }
            else {
                return (aVal === bVal) ? 1 : 0;
            }
        });
    };
    MathBackendCPU.prototype.notEqual = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            if (util.isValNaN(aVal, a.dtype) || util.isValNaN(bVal, b.dtype)) {
                return util.getNaN('bool');
            }
            else {
                return (aVal !== bVal) ? 1 : 0;
            }
        });
    };
    MathBackendCPU.prototype.less = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            if (util.isValNaN(aVal, a.dtype) || util.isValNaN(bVal, b.dtype)) {
                return util.getNaN('bool');
            }
            else {
                return (aVal < bVal) ? 1 : 0;
            }
        });
    };
    MathBackendCPU.prototype.lessEqual = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            if (util.isValNaN(aVal, a.dtype) || util.isValNaN(bVal, b.dtype)) {
                return util.getNaN('bool');
            }
            else {
                return (aVal <= bVal) ? 1 : 0;
            }
        });
    };
    MathBackendCPU.prototype.greater = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            if (util.isValNaN(aVal, a.dtype) || util.isValNaN(bVal, b.dtype)) {
                return util.getNaN('bool');
            }
            else {
                return (aVal > bVal) ? 1 : 0;
            }
        });
    };
    MathBackendCPU.prototype.greaterEqual = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            if (util.isValNaN(aVal, a.dtype) || util.isValNaN(bVal, b.dtype)) {
                return util.getNaN('bool');
            }
            else {
                return (aVal >= bVal) ? 1 : 0;
            }
        });
    };
    MathBackendCPU.prototype.logicalNot = function (x) {
        var values = x.dataSync();
        var newValues = new Int32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            if (util.isValNaN(values[i], x.dtype)) {
                newValues[i] = util.getNaN('bool');
            }
            else {
                newValues[i] = values[i] ? 0 : 1;
            }
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues }, 'bool');
    };
    MathBackendCPU.prototype.logicalAnd = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            if (util.isValNaN(aVal, a.dtype) || util.isValNaN(bVal, b.dtype)) {
                return util.getNaN('bool');
            }
            else {
                return aVal && bVal;
            }
        });
    };
    MathBackendCPU.prototype.logicalOr = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            if (util.isValNaN(aVal, a.dtype) || util.isValNaN(bVal, b.dtype)) {
                return util.getNaN('bool');
            }
            else {
                return aVal || bVal;
            }
        });
    };
    MathBackendCPU.prototype.logicalXor = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            if (util.isValNaN(aVal, a.dtype) || util.isValNaN(bVal, b.dtype)) {
                return util.getNaN('bool');
            }
            else {
                return aVal ^ bVal;
            }
        });
    };
    MathBackendCPU.prototype.where = function (condition, a, b, dtype) {
        var values = condition.dataSync();
        var aValues = a.dataSync();
        var bValues = b.dataSync();
        var result = ops.zeros(a.shape, dtype);
        var newValues = result.dataSync();
        var index = 0;
        var offset = condition.rank === 0 || condition.rank > 1 || a.rank === 1 ?
            1 :
            a.shape[1];
        for (var i = 0; i < values.length; i++) {
            for (var j = 0; j < offset; j++) {
                if (values[i] === 1) {
                    newValues[index++] = aValues[i];
                }
                else {
                    newValues[index++] = bValues[i];
                }
            }
        }
        return result;
    };
    MathBackendCPU.prototype.topKValues = function (x, k) {
        return this.topK(x, k).values;
    };
    MathBackendCPU.prototype.topKIndices = function (x, k) {
        return this.topK(x, k).indices;
    };
    MathBackendCPU.prototype.topK = function (x, k) {
        var values = x.dataSync();
        var valuesAndIndices = [];
        for (var i = 0; i < values.length; i++) {
            valuesAndIndices.push({ value: values[i], index: i });
        }
        valuesAndIndices.sort(function (a, b) {
            return b.value - a.value;
        });
        var topkValues = util.getTypedArrayFromDType(x.dtype, k);
        var topkIndices = new Int32Array(k);
        for (var i = 0; i < k; i++) {
            topkValues[i] = valuesAndIndices[i].value;
            topkIndices[i] = valuesAndIndices[i].index;
        }
        return {
            values: ops.tensor1d(topkValues, x.dtype),
            indices: tensor_1.Tensor1D.new(topkIndices)
        };
    };
    MathBackendCPU.prototype.min = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('min', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ops.zeros(outShape, x.dtype);
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var min = aVals[0];
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                if (isNaN(value)) {
                    min = Number.NaN;
                    break;
                }
                if (value < min) {
                    min = value;
                }
            }
            vals[i] = min;
        }
        return result;
    };
    MathBackendCPU.prototype.minimum = function (a, b) {
        return this.broadcastedBinaryOp(a, b, a.dtype, function (aVal, bVal) { return Math.min(aVal, bVal); });
    };
    MathBackendCPU.prototype.max = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('max', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ops.zeros(outShape, x.dtype);
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var max = aVals[offset];
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                if (isNaN(value)) {
                    max = Number.NaN;
                    break;
                }
                if (value > max) {
                    max = value;
                }
            }
            vals[i] = max;
        }
        return result;
    };
    MathBackendCPU.prototype.maximum = function (a, b) {
        return this.broadcastedBinaryOp(a, b, a.dtype, function (aVal, bVal) { return Math.max(aVal, bVal); });
    };
    MathBackendCPU.prototype.ceil = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = Math.ceil(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.floor = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = Math.floor(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.exp = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = Math.exp(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.log = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = Math.log(value);
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.sqrt = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = Math.sqrt(value);
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.square = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = value * value;
        }
        return tensor_1.Tensor.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.relu = function (x) {
        var res = ops.zeros(x.shape, x.dtype);
        var resVals = res.dataSync();
        var inVals = x.dataSync();
        for (var i = 0; i < inVals.length; ++i) {
            var val = inVals[i];
            if (util.isValNaN(val, x.dtype)) {
                resVals[i] = util.getNaN(res.dtype);
            }
            else {
                resVals[i] = Math.max(0, inVals[i]);
            }
        }
        return res;
    };
    MathBackendCPU.prototype.elu = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            var v = values[i];
            if (v >= 0) {
                resultValues[i] = v;
            }
            else {
                resultValues[i] = (Math.exp(v) - 1);
            }
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.eluDer = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            var v = values[i];
            if (v >= 0) {
                resultValues[i] = 1;
            }
            else {
                resultValues[i] = Math.exp(v);
            }
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.selu = function (x) {
        var scaleAlpha = selu_util.SELU_SCALEALPHA;
        var scale = selu_util.SELU_SCALE;
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            var v = values[i];
            if (v >= 0) {
                resultValues[i] = scale * v;
            }
            else {
                resultValues[i] = scaleAlpha * (Math.exp(v) - 1);
            }
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.leakyRelu = function (x, alpha) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; i++) {
            var v = values[i];
            if (v >= 0) {
                resultValues[i] = v;
            }
            else {
                resultValues[i] = alpha * v;
            }
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.prelu = function (x, alpha) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        var alphas = alpha.dataSync();
        for (var i = 0; i < values.length; i++) {
            var v = values[i];
            if (v >= 0) {
                resultValues[i] = v;
            }
            else {
                resultValues[i] = alphas[i] * v;
            }
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.preluDer = function (x, alpha) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        var alphas = alpha.dataSync();
        for (var i = 0; i < values.length; i++) {
            var v = values[i];
            if (v > 0) {
                resultValues[i] = 1;
            }
            else if (v < 0) {
                resultValues[i] = alphas[i];
            }
            else {
                resultValues[i] = v;
            }
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.clip = function (x, min, max) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.min(max, Math.max(min, values[i]));
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.abs = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.abs(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.int = function (x) {
        var resultValues = new Int32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = values[i];
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues }, 'int32');
    };
    MathBackendCPU.prototype.sigmoid = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = 1 / (1 + Math.exp(-values[i]));
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.sin = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.sin(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.cos = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.cos(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.tan = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.tan(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.asin = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.asin(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.acos = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.acos(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.atan = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.atan(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.sinh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.sinh(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.cosh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.cosh(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.tanh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = util.tanh(values[i]);
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.step = function (x, alpha) {
        if (alpha === void 0) { alpha = 0; }
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            if (util.isValNaN(value, x.dtype)) {
                resultValues[i] = util.getNaN(x.dtype);
            }
            else {
                resultValues[i] = value > 0 ? 1 : alpha;
            }
        }
        return tensor_1.Tensor.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.conv2d = function (x, filter, convInfo) {
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var padLeft = convInfo.padInfo.left;
        var padTop = convInfo.padInfo.top;
        var y = ops.buffer(convInfo.outShape, x.dtype);
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d2 = 0; d2 < convInfo.outChannels; ++d2) {
                for (var yR = 0; yR < convInfo.outHeight; ++yR) {
                    var xRCorner = yR * convInfo.strideHeight - padLeft;
                    var xRMin = Math.max(0, xRCorner);
                    var xRMax = Math.min(convInfo.inHeight, filterHeight + xRCorner);
                    for (var yC = 0; yC < convInfo.outWidth; ++yC) {
                        var xCCorner = yC * convInfo.strideWidth - padTop;
                        var xCMin = Math.max(0, xCCorner);
                        var xCMax = Math.min(convInfo.inWidth, filterWidth + xCCorner);
                        var dotProd = 0;
                        for (var xR = xRMin; xR < xRMax; ++xR) {
                            var wR = xR - xRCorner;
                            for (var xC = xCMin; xC < xCMax; ++xC) {
                                var wC = xC - xCCorner;
                                for (var d1 = 0; d1 < convInfo.inChannels; ++d1) {
                                    var pixel = x.get(b, xR, xC, d1);
                                    var weight = filter.get(wR, wC, d1, d2);
                                    dotProd += pixel * weight;
                                }
                            }
                        }
                        y.set(dotProd, b, yR, yC, d2);
                    }
                }
            }
        }
        return y.toTensor();
    };
    MathBackendCPU.prototype.conv2dDerInput = function (dy, filter, convInfo) {
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var topPad = filterHeight - 1 - convInfo.padInfo.top;
        var leftPad = filterWidth - 1 - convInfo.padInfo.left;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var dx = ops.buffer(convInfo.inShape, 'float32');
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d1 = 0; d1 < convInfo.inChannels; ++d1) {
                for (var xR = 0; xR < convInfo.inHeight; ++xR) {
                    var xRCorner = xR - leftPad;
                    var xRMin = Math.max(0, Math.ceil(xRCorner / strideHeight));
                    var yRMax = Math.min(convInfo.outHeight, (filterHeight + xRCorner) / strideHeight);
                    for (var xC = 0; xC < convInfo.inWidth; ++xC) {
                        var xCCorner = xC - topPad;
                        var xCMin = Math.max(0, Math.ceil(xCCorner / strideWidth));
                        var yCMax = Math.min(convInfo.outWidth, (filterWidth + xCCorner) / strideWidth);
                        var dotProd = 0;
                        for (var yR = xRMin; yR < yRMax; ++yR) {
                            var wR = yR * strideHeight - xRCorner;
                            for (var yC = xCMin; yC < yCMax; ++yC) {
                                var wC = yC * strideWidth - xCCorner;
                                for (var d2 = 0; d2 < convInfo.outChannels; ++d2) {
                                    var pixel = dy.get(b, yR, yC, d2);
                                    var weight = filter.get(filterHeight - 1 - wR, filterWidth - 1 - wC, d1, d2);
                                    dotProd += pixel * weight;
                                }
                            }
                        }
                        dx.set(dotProd, b, xR, xC, d1);
                    }
                }
            }
        }
        return dx.toTensor();
    };
    MathBackendCPU.prototype.conv2dDerFilter = function (x, dy, convInfo) {
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var dW = ops.buffer(convInfo.filterShape, 'float32');
        var leftPad = convInfo.padInfo.left;
        var topPad = convInfo.padInfo.top;
        for (var wR = 0; wR < filterHeight; ++wR) {
            var yRMin = Math.max(0, Math.ceil((topPad - wR) / strideHeight));
            var yRMax = Math.min(convInfo.outHeight, (convInfo.inHeight + topPad - wR) / strideHeight);
            for (var wC = 0; wC < filterWidth; ++wC) {
                var yCMin = Math.max(0, Math.ceil((leftPad - wC) / strideWidth));
                var yCMax = Math.min(convInfo.outWidth, (convInfo.inWidth + leftPad - wC) / strideWidth);
                for (var d1 = 0; d1 < convInfo.inChannels; ++d1) {
                    for (var d2 = 0; d2 < convInfo.outChannels; ++d2) {
                        var dotProd = 0;
                        for (var b = 0; b < convInfo.batchSize; ++b) {
                            for (var yR = yRMin; yR < yRMax; ++yR) {
                                var xR = wR + yR * strideHeight - topPad;
                                for (var yC = yCMin; yC < yCMax; ++yC) {
                                    var xC = wC + yC * strideWidth - leftPad;
                                    dotProd += x.get(b, xR, xC, d1) * dy.get(b, yR, yC, d2);
                                }
                            }
                        }
                        dW.set(dotProd, wR, wC, d1, d2);
                    }
                }
            }
        }
        return dW.toTensor();
    };
    MathBackendCPU.prototype.depthwiseConv2D = function (x, filter, convInfo) {
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var padLeft = convInfo.padInfo.left;
        var padTop = convInfo.padInfo.top;
        var chMul = convInfo.outChannels / convInfo.inChannels;
        var y = ops.buffer(convInfo.outShape, x.dtype);
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d1 = 0; d1 < convInfo.inChannels; ++d1) {
                for (var yR = 0; yR < convInfo.outHeight; ++yR) {
                    var xRCorner = yR * convInfo.strideHeight - padLeft;
                    var xRMin = Math.max(0, xRCorner);
                    var xRMax = Math.min(convInfo.inHeight, filterHeight + xRCorner);
                    for (var yC = 0; yC < convInfo.outWidth; ++yC) {
                        var xCCorner = yC * convInfo.strideWidth - padTop;
                        var xCMin = Math.max(0, xCCorner);
                        var xCMax = Math.min(convInfo.inWidth, filterWidth + xCCorner);
                        for (var q = 0; q < chMul; ++q) {
                            var dotProd = 0;
                            for (var xR = xRMin; xR < xRMax; ++xR) {
                                var wR = xR - xRCorner;
                                for (var xC = xCMin; xC < xCMax; ++xC) {
                                    var wC = xC - xCCorner;
                                    var pixel = x.get(b, xR, xC, d1);
                                    var weight = filter.get(wR, wC, d1, q);
                                    dotProd += pixel * weight;
                                }
                            }
                            y.set(dotProd, b, yR, yC, d1 * chMul + q);
                        }
                    }
                }
            }
        }
        return y.toTensor();
    };
    MathBackendCPU.prototype.tile = function (x, reps) {
        var newShape = new Array(x.rank);
        for (var i = 0; i < newShape.length; i++) {
            newShape[i] = x.shape[i] * reps[i];
        }
        var result = ops.buffer(newShape, x.dtype);
        var values = x.dataSync();
        for (var i = 0; i < result.values.length; ++i) {
            var newLoc = result.indexToLoc(i);
            var originalLoc = new Array(x.rank);
            for (var i_1 = 0; i_1 < originalLoc.length; i_1++) {
                originalLoc[i_1] = newLoc[i_1] % x.shape[i_1];
            }
            var originalIndex = x.locToIndex(originalLoc);
            result.values[i] = values[originalIndex];
        }
        return result.toTensor();
    };
    MathBackendCPU.prototype.pad = function (x, paddings, constantValue) {
        var outShape = paddings.map(function (p, i) { return p[0] + x.shape[i] + p[1]; });
        var start = paddings.map(function (p) { return p[0]; });
        var xBuffer = x.buffer();
        var buffer = ops.buffer(outShape, x.dtype);
        if (constantValue !== 0) {
            buffer.values.fill(constantValue);
        }
        for (var i = 0; i < x.size; i++) {
            var coords = xBuffer.indexToLoc(i);
            var outCoords = coords.map(function (c, i) { return c + start[i]; });
            buffer.set.apply(buffer, [x.get.apply(x, coords)].concat(outCoords));
        }
        return buffer.toTensor();
    };
    MathBackendCPU.prototype.transpose = function (x, perm) {
        var newShape = new Array(x.rank);
        for (var i = 0; i < newShape.length; i++) {
            newShape[i] = x.shape[perm[i]];
        }
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        var result = tensor_1.Tensor.make(newShape, { values: resultValues });
        for (var i = 0; i < x.size; ++i) {
            var loc = x.indexToLoc(i);
            var newLoc = new Array(loc.length);
            for (var i_2 = 0; i_2 < newLoc.length; i_2++) {
                newLoc[i_2] = loc[perm[i_2]];
            }
            var newIndex = result.locToIndex(newLoc);
            resultValues[newIndex] = values[i];
        }
        return result;
    };
    MathBackendCPU.prototype.gather = function (x, indices, axis) {
        var newShape = x.shape.slice();
        var indicesValues = indices.dataSync();
        newShape[axis] = indicesValues.length;
        var result = ops.zeros(newShape, x.dtype);
        var values = x.dataSync();
        var resultValues = result.dataSync();
        for (var i = 0; i < result.size; ++i) {
            var newLoc = result.indexToLoc(i);
            var originalLoc = newLoc.slice();
            originalLoc[axis] = indicesValues[newLoc[axis]];
            var originalIndex = x.locToIndex(originalLoc);
            resultValues[i] = values[originalIndex];
        }
        return result;
    };
    MathBackendCPU.prototype.pool = function (x, convInfo, poolType) {
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var y = ops.buffer(convInfo.outShape, 'float32');
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d = 0; d < convInfo.inChannels; ++d) {
                for (var yR = 0; yR < convInfo.outHeight; ++yR) {
                    var xRCorner = yR * strideHeight - padTop;
                    var xRMin = Math.max(0, xRCorner);
                    var xRMax = Math.min(convInfo.inHeight, filterHeight + xRCorner);
                    for (var yC = 0; yC < convInfo.outWidth; ++yC) {
                        var xCCorner = yC * strideWidth - padLeft;
                        var xCMin = Math.max(0, xCCorner);
                        var xCMax = Math.min(convInfo.inWidth, filterWidth + xCCorner);
                        var minMaxValue = (poolType === 'max' ? Number.NEGATIVE_INFINITY :
                            Number.POSITIVE_INFINITY);
                        var avgValue = 0;
                        for (var xR = xRMin; xR < xRMax; ++xR) {
                            for (var xC = xCMin; xC < xCMax; ++xC) {
                                var pixel = x.get(b, xR, xC, d);
                                if (isNaN(pixel)) {
                                    minMaxValue = NaN;
                                    avgValue = NaN;
                                    break;
                                }
                                if ((poolType === 'max' && pixel > minMaxValue) ||
                                    (poolType === 'min' && pixel < minMaxValue)) {
                                    minMaxValue = pixel;
                                }
                                else if (poolType === 'avg') {
                                    avgValue += pixel / (filterHeight * filterWidth);
                                }
                            }
                            if (isNaN(minMaxValue)) {
                                break;
                            }
                        }
                        y.set(poolType === 'avg' ? avgValue : minMaxValue, b, yR, yC, d);
                    }
                }
            }
        }
        return y.toTensor();
    };
    MathBackendCPU.prototype.maxPool = function (x, convInfo) {
        return this.pool(x, convInfo, 'max');
    };
    MathBackendCPU.prototype.maxPoolPositions = function (x, convInfo) {
        var maxPositions = ops.buffer(convInfo.outShape, 'int32');
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d = 0; d < convInfo.inChannels; ++d) {
                for (var yR = 0; yR < convInfo.outHeight; ++yR) {
                    var xRCorner = yR * strideHeight - padTop;
                    var xRMin = Math.max(0, xRCorner);
                    var xRMax = Math.min(convInfo.inHeight, filterHeight + xRCorner);
                    for (var yC = 0; yC < convInfo.outWidth; ++yC) {
                        var xCCorner = yC * strideWidth - padLeft;
                        var xCMin = Math.max(0, xCCorner);
                        var xCMax = Math.min(convInfo.inWidth, filterWidth + xCCorner);
                        var maxValue = Number.NEGATIVE_INFINITY;
                        var maxPosition = -1;
                        for (var xR = xRMin; xR < xRMax; ++xR) {
                            var wR = xR - xRCorner;
                            for (var xC = xCMin; xC < xCMax; ++xC) {
                                var wC = xC - xCCorner;
                                var pixel = x.get(b, xR, xC, d);
                                if (pixel > maxValue) {
                                    maxValue = pixel;
                                    maxPosition = wR * filterWidth + wC;
                                }
                            }
                        }
                        maxPositions.set(maxPosition, b, yR, yC, d);
                    }
                }
            }
        }
        return maxPositions.toTensor();
    };
    MathBackendCPU.prototype.maxPoolBackprop = function (dy, x, convInfo) {
        var maxPositions = this.maxPoolPositions(x, convInfo);
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var padLeft = filterWidth - 1 - convInfo.padInfo.left;
        var padTop = filterHeight - 1 - convInfo.padInfo.top;
        var dx = ops.buffer(x.shape, 'float32');
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d = 0; d < convInfo.inChannels; ++d) {
                for (var dxR = 0; dxR < convInfo.inHeight; ++dxR) {
                    for (var dxC = 0; dxC < convInfo.inWidth; ++dxC) {
                        var dyRCorner = dxR - padTop;
                        var dyCCorner = dxC - padLeft;
                        var dotProd = 0;
                        for (var wR = 0; wR < filterHeight; ++wR) {
                            var dyR = (dyRCorner + wR) / strideHeight;
                            if (dyR < 0 || dyR >= convInfo.outHeight ||
                                Math.floor(dyR) !== dyR) {
                                continue;
                            }
                            for (var wC = 0; wC < filterWidth; ++wC) {
                                var dyC = (dyCCorner + wC) / strideWidth;
                                if (dyC < 0 || dyC >= convInfo.outWidth ||
                                    Math.floor(dyC) !== dyC) {
                                    continue;
                                }
                                var maxPos = filterHeight * filterWidth - 1 -
                                    maxPositions.get(b, dyR, dyC, d);
                                var curPos = wR * filterWidth + wC;
                                var mask = maxPos === curPos ? 1 : 0;
                                if (mask === 0) {
                                    continue;
                                }
                                var pixel = dy.get(b, dyR, dyC, d);
                                dotProd += pixel * mask;
                            }
                        }
                        dx.set(dotProd, b, dxR, dxC, d);
                    }
                }
            }
        }
        return dx.toTensor();
    };
    MathBackendCPU.prototype.avgPoolBackprop = function (dy, x, convInfo) {
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var padLeft = filterWidth - 1 - convInfo.padInfo.left;
        var padTop = filterHeight - 1 - convInfo.padInfo.top;
        var dx = ops.buffer(x.shape, 'float32');
        var avgMultiplier = 1 / (filterHeight * filterWidth);
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d = 0; d < convInfo.inChannels; ++d) {
                for (var dxR = 0; dxR < convInfo.inHeight; ++dxR) {
                    for (var dxC = 0; dxC < convInfo.inWidth; ++dxC) {
                        var dyRCorner = dxR - padTop;
                        var dyCCorner = dxC - padLeft;
                        var dotProd = 0;
                        for (var wR = 0; wR < filterHeight; ++wR) {
                            var dyR = (dyRCorner + wR) / strideHeight;
                            if (dyR < 0 || dyR >= convInfo.outHeight ||
                                Math.floor(dyR) !== dyR) {
                                continue;
                            }
                            for (var wC = 0; wC < filterWidth; ++wC) {
                                var dyC = (dyCCorner + wC) / strideWidth;
                                if (dyC < 0 || dyC >= convInfo.outWidth ||
                                    Math.floor(dyC) !== dyC) {
                                    continue;
                                }
                                var pixel = dy.get(b, dyR, dyC, d);
                                dotProd += pixel;
                            }
                        }
                        dx.set(dotProd * avgMultiplier, b, dxR, dxC, d);
                    }
                }
            }
        }
        return dx.toTensor();
    };
    MathBackendCPU.prototype.minPool = function (x, convInfo) {
        return this.pool(x, convInfo, 'min');
    };
    MathBackendCPU.prototype.avgPool = function (x, convInfo) {
        return this.pool(x, convInfo, 'avg').toFloat();
    };
    MathBackendCPU.prototype.resizeBilinear = function (x, newHeight, newWidth, alignCorners) {
        var _a = x.shape, batch = _a[0], oldHeight = _a[1], oldWidth = _a[2], numChannels = _a[3];
        var output = ops.buffer([batch, newHeight, newWidth, numChannels], x.dtype);
        var effectiveInputSize = alignCorners ? [oldHeight - 1, oldWidth - 1] : [oldHeight, oldWidth];
        var effectiveOutputSize = alignCorners ? [newHeight - 1, newWidth - 1] : [newHeight, newWidth];
        for (var b = 0; b < batch; b++) {
            for (var r = 0; r < newHeight; r++) {
                for (var c = 0; c < newWidth; c++) {
                    for (var d = 0; d < numChannels; d++) {
                        var sourceFracRow = (effectiveInputSize[0]) * r / (effectiveOutputSize[0]);
                        var sourceFracCol = (effectiveInputSize[1]) * c / (effectiveOutputSize[1]);
                        var sourceRowFloor = Math.floor(sourceFracRow);
                        var sourceRowCeil = Math.min(oldHeight - 1, Math.ceil(sourceFracRow));
                        var sourceColFloor = Math.floor(sourceFracCol);
                        var sourceColCeil = Math.min(oldWidth - 1, Math.ceil(sourceFracCol));
                        var topLeft = x.get(b, sourceRowFloor, sourceColFloor, d);
                        var bottomLeft = x.get(b, sourceRowCeil, sourceColFloor, d);
                        var topRight = x.get(b, sourceRowFloor, sourceColCeil, d);
                        var bottomRight = x.get(b, sourceRowCeil, sourceColCeil, d);
                        var rowFrac = sourceFracRow - sourceRowFloor;
                        var colFrac = sourceFracCol - sourceColFloor;
                        var top_1 = topLeft + (topRight - topLeft) * colFrac;
                        var bottom = bottomLeft + (bottomRight - bottomLeft) * colFrac;
                        var newValue = top_1 + (bottom - top_1) * rowFrac;
                        output.set(newValue, b, r, c, d);
                    }
                }
            }
        }
        return output.toTensor();
    };
    MathBackendCPU.prototype.batchNormalization4D = function (x, mean, variance, varianceEpsilon, scale, offset) {
        var xValues = x.dataSync();
        var meanValues = mean.dataSync();
        var varianceValues = variance.dataSync();
        var scaleValues = scale ? scale.dataSync() : new Float32Array([1]);
        var offsetValues = offset ? offset.dataSync() : new Float32Array([0]);
        var outValues = new Float32Array(xValues.length);
        for (var i = 0; i < xValues.length; i++) {
            outValues[i] = offsetValues[i % offsetValues.length] +
                (xValues[i] - meanValues[i % meanValues.length]) *
                    scaleValues[i % scaleValues.length] /
                    Math.sqrt(varianceValues[i % varianceValues.length] + varianceEpsilon);
        }
        return ops_1.tensor4d(outValues, x.shape);
    };
    MathBackendCPU.prototype.localResponseNormalization4D = function (x, radius, bias, alpha, beta, normRegion) {
        var output = ops.buffer(x.shape, 'float32');
        var rad = radius;
        var maxW = output.shape[1] - 1;
        var maxH = output.shape[2] - 1;
        var maxD = output.shape[3] - 1;
        var sumAcrossChannels = function (b, r, c, d) {
            var sum = 0.0;
            for (var j = Math.max(0, d - rad); j <= Math.min(d + rad, maxD); j++) {
                var z = x.get(b, r, c, j);
                sum += z * z;
            }
            return sum;
        };
        var sumWithinChannel = function (b, r, c, d) {
            var sum = 0.0;
            for (var u = Math.max(0, r - rad); u <= Math.min(r + rad, maxW); u++) {
                for (var v = Math.max(0, c - rad); v <= Math.min(c + rad, maxH); v++) {
                    sum += Math.pow(x.get(b, u, v, d), 2);
                }
            }
            return sum;
        };
        for (var b = 0; b < output.shape[0]; b++) {
            for (var r = 0; r <= output.shape[1]; r++) {
                for (var c = 0; c < output.shape[2]; c++) {
                    for (var d = 0; d < output.shape[3]; d++) {
                        var sum = normRegion === 'withinChannel' ?
                            sumWithinChannel(b, r, c, d) :
                            sumAcrossChannels(b, r, c, d);
                        var val = x.get(b, r, c, d) * Math.pow(bias + alpha * sum, -beta);
                        output.set(val, b, r, c, d);
                    }
                }
            }
        }
        return output.toTensor();
    };
    MathBackendCPU.prototype.multinomial = function (probabilities, numSamples, seed) {
        var batchSize = probabilities.shape[0];
        var numEvents = probabilities.shape[1];
        var res = ops.zeros([batchSize, numSamples], 'int32');
        var resVals = res.dataSync();
        var probVals = probabilities.dataSync();
        for (var b = 0; b < batchSize; ++b) {
            var offset = b * numEvents;
            var cdf = new Float32Array(numEvents - 1);
            cdf[0] = probVals[offset];
            for (var event_1 = 1; event_1 < cdf.length; ++event_1) {
                cdf[event_1] = cdf[event_1 - 1] + probVals[offset + event_1];
            }
            var random = seedrandom.alea(seed.toString());
            var outOffset = b * numSamples;
            for (var sampleId = 0; sampleId < numSamples; ++sampleId) {
                var r = random();
                resVals[outOffset + sampleId] = cdf.length;
                for (var event_2 = 0; event_2 < cdf.length; event_2++) {
                    if (r < cdf[event_2]) {
                        resVals[outOffset + sampleId] = event_2;
                        break;
                    }
                }
            }
        }
        return res;
    };
    MathBackendCPU.prototype.oneHot = function (indices, depth, onValue, offValue) {
        var res = new Float32Array(indices.size * depth);
        res.fill(offValue);
        for (var event_3 = 0; event_3 < indices.size; ++event_3) {
            res[event_3 * depth + indices.get(event_3)] = onValue;
        }
        return ops.tensor2d(res, [indices.size, depth]);
    };
    MathBackendCPU.prototype.broadcastedBinaryOp = function (a, b, dtype, op) {
        var newShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var result = ops.buffer(newShape, dtype);
        var aValues = a.dataSync();
        var bValues = b.dataSync();
        var aBroadcastDims = broadcast_util.getBroadcastDims(a.shape, newShape);
        var bBroadcastDims = broadcast_util.getBroadcastDims(b.shape, newShape);
        var _loop_2 = function (i) {
            var loc = result.indexToLoc(i);
            var aLoc = loc.slice(-a.rank);
            aBroadcastDims.forEach(function (d) { return aLoc[d] = 0; });
            var aIndex = a.locToIndex(aLoc);
            var bLoc = loc.slice(-b.rank);
            bBroadcastDims.forEach(function (d) { return bLoc[d] = 0; });
            var bIndex = b.locToIndex(bLoc);
            result.values[i] = op(aValues[aIndex], bValues[bIndex]);
        };
        for (var i = 0; i < result.values.length; ++i) {
            _loop_2(i);
        }
        return result.toTensor();
    };
    MathBackendCPU.prototype.dispose = function () { };
    return MathBackendCPU;
}());
exports.MathBackendCPU = MathBackendCPU;
environment_1.ENV.registerBackend('cpu', function () { return new MathBackendCPU(); });
var NDArrayMathCPU = (function (_super) {
    __extends(NDArrayMathCPU, _super);
    function NDArrayMathCPU(safeMode) {
        if (safeMode === void 0) { safeMode = false; }
        var _this = this;
        console.warn('new NDArrayMathCPU() is deprecated. Please use ' +
            'dl.setBackend(\'cpu\').');
        _this = _super.call(this, 'cpu', safeMode) || this;
        return _this;
    }
    return NDArrayMathCPU;
}(math_1.NDArrayMath));
exports.NDArrayMathCPU = NDArrayMathCPU;

},{"../environment":35,"../math":104,"../ops/axis_util":106,"../ops/broadcast_util":109,"../ops/concat_util":112,"../ops/ops":122,"../ops/selu_util":128,"../tensor":145,"../types":150,"../util":151,"seedrandom":2}],70:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var math_1 = require("../math");
var axis_util = require("../ops/axis_util");
var reduce_util = require("../ops/reduce_util");
var tensor_1 = require("../tensor");
var types = require("../types");
var util = require("../util");
var argminmax_gpu_1 = require("./webgl/argminmax_gpu");
var avg_pool_backprop_gpu_1 = require("./webgl/avg_pool_backprop_gpu");
var batchnorm_gpu_1 = require("./webgl/batchnorm_gpu");
var binaryop_gpu = require("./webgl/binaryop_gpu");
var binaryop_gpu_1 = require("./webgl/binaryop_gpu");
var clip_gpu_1 = require("./webgl/clip_gpu");
var concat_gpu_1 = require("./webgl/concat_gpu");
var conv_backprop_gpu_1 = require("./webgl/conv_backprop_gpu");
var conv_gpu_1 = require("./webgl/conv_gpu");
var conv_gpu_depthwise_1 = require("./webgl/conv_gpu_depthwise");
var from_pixels_gpu_1 = require("./webgl/from_pixels_gpu");
var gather_gpu_1 = require("./webgl/gather_gpu");
var gpgpu_context_1 = require("./webgl/gpgpu_context");
var gpgpu_math = require("./webgl/gpgpu_math");
var logical_gpu_1 = require("./webgl/logical_gpu");
var lrn_gpu_1 = require("./webgl/lrn_gpu");
var max_pool_backprop_gpu_1 = require("./webgl/max_pool_backprop_gpu");
var mulmat_gpu_1 = require("./webgl/mulmat_gpu");
var multinomial_gpu_1 = require("./webgl/multinomial_gpu");
var onehot_gpu_1 = require("./webgl/onehot_gpu");
var pad_gpu_1 = require("./webgl/pad_gpu");
var pool_gpu_1 = require("./webgl/pool_gpu");
var reduce_gpu_1 = require("./webgl/reduce_gpu");
var resize_bilinear_gpu_1 = require("./webgl/resize_bilinear_gpu");
var reverse_gpu_1 = require("./webgl/reverse_gpu");
var slice_gpu_1 = require("./webgl/slice_gpu");
var tex_util_1 = require("./webgl/tex_util");
var texture_manager_1 = require("./webgl/texture_manager");
var tile_gpu_1 = require("./webgl/tile_gpu");
var transpose_gpu_1 = require("./webgl/transpose_gpu");
var unary_op = require("./webgl/unaryop_gpu");
var unaryop_gpu_1 = require("./webgl/unaryop_gpu");
var webgl_util = require("./webgl/webgl_util");
var MathBackendWebGL = (function () {
    function MathBackendWebGL(gpgpu, delayedStorage) {
        if (delayedStorage === void 0) { delayedStorage = true; }
        this.gpgpu = gpgpu;
        this.delayedStorage = delayedStorage;
        this.texData = new WeakMap();
        this.uploadWaitMs = 0;
        this.downloadWaitMs = 0;
        this.binaryCache = {};
        this.disposed = false;
        if (environment_1.ENV.get('WEBGL_VERSION') < 1) {
            throw new Error('WebGL is not supported on this device');
        }
        if (gpgpu == null) {
            this.gpgpu = new gpgpu_context_1.GPGPUContext();
            this.gpgpuCreatedLocally = true;
        }
        else {
            this.gpgpuCreatedLocally = false;
        }
        if (typeof document !== 'undefined') {
            this.canvas = document.createElement('canvas');
        }
        this.textureManager = new texture_manager_1.TextureManager(this.gpgpu);
    }
    MathBackendWebGL.prototype.register = function (dataId, shape, dtype) {
        if (this.texData.has(dataId)) {
            throw new Error('Data buffer is already registered');
        }
        this.texData.set(dataId, {
            shape: shape,
            dtype: dtype,
            values: null,
            texture: null,
            texShape: null,
            texType: tex_util_1.TextureType.FLOAT
        });
    };
    MathBackendWebGL.prototype.fromPixels = function (pixels, numChannels) {
        if (pixels == null) {
            throw new Error('MathBackendWebGL.writePixels(): pixels can not be null');
        }
        var texShape = [pixels.height, pixels.width];
        var outShape = [pixels.height, pixels.width, numChannels];
        if (pixels instanceof HTMLVideoElement) {
            if (this.canvas == null) {
                throw new Error('Can\'t read pixels from HTMLImageElement outside ' +
                    'the browser.');
            }
            this.canvas.width = pixels.width;
            this.canvas.height = pixels.height;
            this.canvas.getContext('2d').drawImage(pixels, 0, 0, pixels.width, pixels.height);
            pixels = this.canvas;
        }
        var tempPixelArray = tensor_1.Tensor.make(texShape, {}, 'int32');
        this.texData.get(tempPixelArray.dataId).texType = tex_util_1.TextureType.UNSIGNED_BYTE;
        this.gpgpu.uploadPixelDataToTexture(this.getTexture(tempPixelArray.dataId), pixels);
        var program = new from_pixels_gpu_1.FromPixelsProgram(outShape);
        var res = this.compileAndRun(program, [tempPixelArray]);
        tempPixelArray.dispose();
        return res;
    };
    MathBackendWebGL.prototype.write = function (dataId, values) {
        if (values == null) {
            throw new Error('MathBackendWebGL.write(): values can not be null');
        }
        this.throwIfNoData(dataId);
        var texData = this.texData.get(dataId);
        var texture = texData.texture, texShape = texData.texShape, texType = texData.texType;
        if (texture != null) {
            this.textureManager.releaseTexture(texture, texShape, texType);
            texData.texture = null;
            texData.texShape = null;
        }
        texData.values = values;
        if (!this.delayedStorage) {
            this.uploadToGPU(dataId);
        }
    };
    MathBackendWebGL.prototype.readSync = function (dataId) {
        this.throwIfNoData(dataId);
        var texData = this.texData.get(dataId);
        var texture = texData.texture, values = texData.values, texShape = texData.texShape;
        if (values != null) {
            this.cacheOnCPU(dataId);
            return values;
        }
        var shouldTimeProgram = this.activeTimers != null;
        var start;
        if (shouldTimeProgram) {
            start = performance.now();
        }
        var float32Values = this.gpgpu.downloadMatrixFromTexture(texture, texShape[0], texShape[1]);
        if (shouldTimeProgram) {
            this.downloadWaitMs += performance.now() - start;
        }
        this.cacheOnCPU(dataId, float32Values);
        return texData.values;
    };
    MathBackendWebGL.prototype.read = function (dataId) {
        return __awaiter(this, void 0, void 0, function () {
            var texData, texture, values, texShape, float32Values;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.throwIfNoData(dataId);
                        texData = this.texData.get(dataId);
                        texture = texData.texture, values = texData.values, texShape = texData.texShape;
                        if (values != null) {
                            this.cacheOnCPU(dataId);
                            return [2, values];
                        }
                        if (!environment_1.ENV.get('WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED')) return [3, 2];
                        return [4, this.gpgpu.downloadMatrixFromTextureAsync(texture, texShape[0], texShape[1])];
                    case 1:
                        float32Values = _a.sent();
                        this.cacheOnCPU(dataId, float32Values);
                        return [2, texData.values];
                    case 2:
                        if (environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') === 0) {
                            return [2, this.readSync(dataId)];
                        }
                        return [4, this.gpgpu.runQuery(function () { })];
                    case 3:
                        _a.sent();
                        return [2, this.readSync(dataId)];
                }
            });
        });
    };
    MathBackendWebGL.prototype.time = function (f) {
        return __awaiter(this, void 0, void 0, function () {
            var oldActiveTimers, newActiveTimers, outerMostTime, flattenedActiveTimers, kernelMs, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        oldActiveTimers = this.activeTimers;
                        newActiveTimers = [];
                        outerMostTime = false;
                        if (this.programTimersStack == null) {
                            this.programTimersStack = newActiveTimers;
                            outerMostTime = true;
                        }
                        else {
                            this.activeTimers.push(newActiveTimers);
                        }
                        this.activeTimers = newActiveTimers;
                        f();
                        flattenedActiveTimers = util.flatten(this.activeTimers);
                        this.activeTimers = oldActiveTimers;
                        if (outerMostTime) {
                            this.programTimersStack = null;
                        }
                        return [4, Promise.all(flattenedActiveTimers).then(function (results) {
                                var sum = 0;
                                results.forEach(function (result) { return sum += result; });
                                return sum;
                            })];
                    case 1:
                        kernelMs = _a.sent();
                        res = {
                            uploadWaitMs: this.uploadWaitMs,
                            downloadWaitMs: this.downloadWaitMs,
                            kernelMs: kernelMs,
                            wallMs: null
                        };
                        this.uploadWaitMs = 0;
                        this.downloadWaitMs = 0;
                        return [2, res];
                }
            });
        });
    };
    MathBackendWebGL.prototype.memory = function () {
        return { unreliable: false };
    };
    MathBackendWebGL.prototype.startTimer = function () {
        if (environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0) {
            return this.gpgpu.beginQuery();
        }
        return { startMs: performance.now(), endMs: null };
    };
    MathBackendWebGL.prototype.endTimer = function (query) {
        if (environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0) {
            this.gpgpu.endQuery();
            return query;
        }
        query.endMs = performance.now();
        return query;
    };
    MathBackendWebGL.prototype.getQueryTime = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var timerQuery;
            return __generator(this, function (_a) {
                if (environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0) {
                    return [2, this.gpgpu.pollQueryTime(query)];
                }
                timerQuery = query;
                return [2, timerQuery.endMs - timerQuery.startMs];
            });
        });
    };
    MathBackendWebGL.prototype.disposeData = function (dataId) {
        if (this.texData.has(dataId)) {
            var _a = this.texData.get(dataId), texture = _a.texture, texShape = _a.texShape, texType = _a.texType;
            if (texture != null) {
                this.textureManager.releaseTexture(texture, texShape, texType);
            }
            this.texData.delete(dataId);
        }
    };
    MathBackendWebGL.prototype.getTexture = function (dataId) {
        this.uploadToGPU(dataId);
        return this.texData.get(dataId).texture;
    };
    MathBackendWebGL.prototype.getTextureData = function (dataId) {
        this.uploadToGPU(dataId);
        return this.texData.get(dataId);
    };
    MathBackendWebGL.prototype.getGPGPUContext = function () {
        return this.gpgpu;
    };
    MathBackendWebGL.prototype.slice = function (x, begin, size) {
        var program = new slice_gpu_1.SliceProgram(size);
        var customSetup = program.getCustomSetupFunc(begin);
        return this.compileAndRun(program, [x], null, customSetup);
    };
    MathBackendWebGL.prototype.reverse = function (x, axis) {
        var program = new reverse_gpu_1.ReverseProgram(x.shape, axis);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.concat = function (a, b) {
        var program = new concat_gpu_1.ConcatProgram(a.shape, b.shape);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.neg = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.NEG);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.matMul = function (a, b, transposeA, transposeB) {
        var program = new mulmat_gpu_1.MatMulProgram(a.shape, b.shape, transposeA, transposeB);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.multiply = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.MUL, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, types.upcastType(a.dtype, b.dtype));
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.batchNormalization4D = function (x, mean, variance, varianceEpsilon, scale, offset) {
        var inputs = [x, mean, variance];
        var offsetShape = null;
        if (offset != null) {
            offsetShape = offset.shape;
            inputs.push(offset);
        }
        var scaleShape = null;
        if (scale != null) {
            scaleShape = scale.shape;
            inputs.push(scale);
        }
        var program = new batchnorm_gpu_1.BatchNormProgram(x.shape, mean.shape, variance.shape, offsetShape, scaleShape, varianceEpsilon);
        return this.compileAndRun(program, inputs);
    };
    MathBackendWebGL.prototype.localResponseNormalization4D = function (x, radius, bias, alpha, beta, normRegion) {
        var program = new lrn_gpu_1.LRNProgram(x.shape, radius, bias, alpha, beta, normRegion);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.tile = function (x, reps) {
        var program = new tile_gpu_1.TileProgram(x.shape, reps);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.pad = function (x, paddings, constantValue) {
        var program = new pad_gpu_1.PadProgram(x.shape, paddings, constantValue);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.transpose = function (x, perm) {
        var program = new transpose_gpu_1.TransposeProgram(x.shape, perm);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.gather = function (x, indices, axis) {
        var program = new gather_gpu_1.GatherProgram(x.shape, indices.size, axis);
        return this.compileAndRun(program, [x, indices]);
    };
    MathBackendWebGL.prototype.reduce = function (x, reduceType, dtype) {
        var batchSize = x.shape[0];
        var inSize = x.shape[1];
        var windowSize = reduce_util.computeOptimalWindowSize(inSize);
        var reduceInfo = { windowSize: windowSize, inSize: inSize, batchSize: batchSize };
        var program = new reduce_gpu_1.ReduceProgram(reduceInfo, reduceType);
        var _a = program.outputShape, rows = _a[0], cols = _a[1];
        var output = this.makeOutputArray([rows, cols], dtype);
        this.compileAndRun(program, [x], output);
        if (output.shape[1] === 1) {
            return output;
        }
        return this.reduce(output, reduceType, dtype);
    };
    MathBackendWebGL.prototype.argReduce = function (x, reduceType, bestIndicesA) {
        if (bestIndicesA === void 0) { bestIndicesA = null; }
        var batchSize = x.shape[0];
        var inSize = x.shape[1];
        if (bestIndicesA != null) {
            batchSize = bestIndicesA.shape[0];
            inSize = bestIndicesA.shape[1];
        }
        var windowSize = reduce_util.computeOptimalWindowSize(inSize);
        var reduceInfo = { windowSize: windowSize, inSize: inSize, batchSize: batchSize };
        var program = new argminmax_gpu_1.ArgMinMaxProgram(reduceInfo, reduceType, bestIndicesA == null);
        var _a = program.outputShape, rows = _a[0], cols = _a[1];
        var output = this.makeOutputArray([rows, cols], 'int32');
        var inputs = [x];
        if (bestIndicesA != null) {
            inputs.push(bestIndicesA);
        }
        this.compileAndRun(program, inputs, output);
        if (output.shape[1] === 1) {
            return output;
        }
        return this.argReduce(x, reduceType, output);
    };
    MathBackendWebGL.prototype.sum = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('sum', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        var outputDType = types.sumOutType(x.dtype);
        return this.reduce(a2D, 'sum', outputDType).reshape(outShape);
    };
    MathBackendWebGL.prototype.argMin = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('argMin', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        return this.argReduce(a2D, 'min').reshape(outShape);
    };
    MathBackendWebGL.prototype.argMax = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('argMax', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        return this.argReduce(a2D, 'max').reshape(outShape);
    };
    MathBackendWebGL.prototype.equal = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.EQUAL, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.notEqual = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.NOT_EQUAL, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.less = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.LESS, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.lessEqual = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.LESS_EQUAL, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.greater = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.GREATER, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.greaterEqual = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.GREATER_EQUAL, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.logicalNot = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.LOGICAL_NOT);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.logicalAnd = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.LOGICAL_AND, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.logicalOr = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.LOGICAL_OR, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.logicalXor = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.LOGICAL_XOR, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.where = function (condition, a, b, dtype) {
        var program = new logical_gpu_1.WhereProgram(condition.rank, a.shape, a.rank);
        var output = this.makeOutputArray(program.outputShape, dtype);
        return this.compileAndRun(program, [condition, a, b], output);
    };
    MathBackendWebGL.prototype.topKValues = function (x, k) {
        throw new Error('topKValues GPU not yet implemented!');
    };
    MathBackendWebGL.prototype.topKIndices = function (x, k) {
        throw new Error('topKIndices GPU not yet implemented!');
    };
    MathBackendWebGL.prototype.min = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('min', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        return this.reduce(a2D, 'min', a2D.dtype).reshape(outShape);
    };
    MathBackendWebGL.prototype.minimum = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.MIN, a.shape, b.shape);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.max = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('max', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        return this.reduce(a2D, 'max', a2D.dtype).reshape(outShape);
    };
    MathBackendWebGL.prototype.maximum = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.MAX, a.shape, b.shape);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.divide = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.DIV, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'float32');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.add = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.ADD, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, types.upcastType(a.dtype, b.dtype));
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.subtract = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.SUB, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, types.upcastType(a.dtype, b.dtype));
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.pow = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.POW, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, types.upcastType(a.dtype, b.dtype));
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.ceil = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.CEIL);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.floor = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.FLOOR);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.exp = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.EXP);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.log = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.LOG);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.sqrt = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SQRT);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.square = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SQUARE);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.relu = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.RELU);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.elu = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ELU);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.eluDer = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ELU_DER);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.selu = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SELU);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.leakyRelu = function (x, alpha) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.LEAKY_RELU(alpha));
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.prelu = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.PRELU, a.shape, b.shape);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.preluDer = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.PRELU_DER, a.shape, b.shape);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.int = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.TO_INT);
        var output = this.makeOutputArray(program.outputShape, 'int32');
        return this.compileAndRun(program, [x], output);
    };
    MathBackendWebGL.prototype.clip = function (x, min, max) {
        var program = new clip_gpu_1.ClipProgram(x.shape, min, max);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.abs = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ABS);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.sigmoid = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SIGMOID);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.sin = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SIN);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.cos = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.COS);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.tan = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.TAN);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.asin = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ASIN);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.acos = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ACOS);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.atan = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ATAN);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.sinh = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SINH);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.cosh = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.COSH);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.tanh = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.TANH);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.step = function (x, alpha) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.STEP(alpha));
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.conv2d = function (x, filter, convInfo) {
        var program = new conv_gpu_1.Conv2DProgram(convInfo);
        return this.compileAndRun(program, [x, filter]);
    };
    MathBackendWebGL.prototype.conv2dDerInput = function (dy, filter, convInfo) {
        var program = new conv_backprop_gpu_1.Conv2DDerInputProgram(convInfo);
        return this.compileAndRun(program, [dy, filter]);
    };
    MathBackendWebGL.prototype.conv2dDerFilter = function (x, dy, convInfo) {
        var program = new conv_backprop_gpu_1.Conv2DDerFilterProgram(convInfo);
        return this.compileAndRun(program, [x, dy]);
    };
    MathBackendWebGL.prototype.depthwiseConv2D = function (x, filter, convInfo) {
        var program = new conv_gpu_depthwise_1.DepthwiseConv2DProgram(convInfo);
        return this.compileAndRun(program, [x, filter]);
    };
    MathBackendWebGL.prototype.maxPool = function (x, convInfo) {
        var program = new pool_gpu_1.Pool2DProgram(convInfo, 'max', false);
        var output = this.makeOutputArray(program.outputShape, x.dtype);
        return this.compileAndRun(program, [x], output);
    };
    MathBackendWebGL.prototype.minPool = function (x, convInfo) {
        var program = new pool_gpu_1.Pool2DProgram(convInfo, 'min', false);
        var output = this.makeOutputArray(program.outputShape, x.dtype);
        return this.compileAndRun(program, [x], output);
    };
    MathBackendWebGL.prototype.avgPool = function (x, convInfo) {
        var program = new pool_gpu_1.Pool2DProgram(convInfo, 'avg', false);
        var output = this.makeOutputArray(program.outputShape, 'float32');
        return this.compileAndRun(program, [x], output);
    };
    MathBackendWebGL.prototype.maxPoolBackprop = function (dy, x, convInfo) {
        var getPositions = true;
        var maxPoolPositionsProgram = new pool_gpu_1.Pool2DProgram(convInfo, 'max', getPositions);
        var maxPoolPositions = this.compileAndRun(maxPoolPositionsProgram, [x]);
        var maxPoolBackPropProgram = new max_pool_backprop_gpu_1.MaxPool2DBackpropProgram(convInfo);
        var output = this.makeOutputArray(maxPoolBackPropProgram.outputShape, x.dtype);
        var result = this.compileAndRun(maxPoolBackPropProgram, [dy, maxPoolPositions], output);
        maxPoolPositions.dispose();
        return result;
    };
    MathBackendWebGL.prototype.avgPoolBackprop = function (dy, x, convInfo) {
        var avgPoolBackpropProgram = new avg_pool_backprop_gpu_1.AvgPool2DBackpropProgram(convInfo);
        var output = this.makeOutputArray(avgPoolBackpropProgram.outputShape, x.dtype);
        return this.compileAndRun(avgPoolBackpropProgram, [dy], output);
    };
    MathBackendWebGL.prototype.resizeBilinear = function (x, newHeight, newWidth, alignCorners) {
        var program = new resize_bilinear_gpu_1.ResizeBilinearProgram(x.shape, newHeight, newWidth, alignCorners);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.multinomial = function (probs, numSamples, seed) {
        var batchSize = probs.shape[0];
        var numOutcomes = probs.shape[1];
        var program = new multinomial_gpu_1.MultinomialProgram(batchSize, numOutcomes, numSamples);
        var output = this.makeOutputArray(program.outputShape, 'int32');
        var customSetup = program.getCustomSetupFunc(seed);
        return this.compileAndRun(program, [probs], output, customSetup);
    };
    MathBackendWebGL.prototype.oneHot = function (indices, depth, onValue, offValue) {
        var program = new onehot_gpu_1.OneHotProgram(indices.size, depth, onValue, offValue);
        return this.compileAndRun(program, [indices]);
    };
    MathBackendWebGL.prototype.makeOutputArray = function (shape, dtype) {
        return tensor_1.Tensor.make(shape, {}, dtype);
    };
    MathBackendWebGL.prototype.compileAndRun = function (program, inputs, output, customSetup) {
        var _this = this;
        if (output == null) {
            output = this.makeOutputArray(program.outputShape, inputs[0].dtype);
        }
        var inputsData = inputs.map(function (input) {
            _this.uploadToGPU(input.dataId);
            return { tensor: input, texData: _this.texData.get(input.dataId) };
        });
        this.uploadToGPU(output.dataId);
        var outputData = {
            tensor: output,
            texData: this.texData.get(output.dataId)
        };
        var key = gpgpu_math.makeShaderKey(program, inputsData, outputData);
        var binary = this.getAndSaveBinary(key, function () {
            return gpgpu_math.compileProgram(_this.gpgpu, program, inputsData, outputData);
        });
        var shouldTimeProgram = this.activeTimers != null;
        var query;
        if (shouldTimeProgram) {
            query = this.startTimer();
        }
        gpgpu_math.runProgram(binary, inputsData, outputData, customSetup);
        if (shouldTimeProgram) {
            query = this.endTimer(query);
            this.activeTimers.push(this.getQueryTime(query));
        }
        return output;
    };
    MathBackendWebGL.prototype.getAndSaveBinary = function (key, getBinary) {
        if (!(key in this.binaryCache)) {
            this.binaryCache[key] = getBinary();
        }
        return this.binaryCache[key];
    };
    MathBackendWebGL.prototype.getTextureManager = function () {
        return this.textureManager;
    };
    MathBackendWebGL.prototype.dispose = function () {
        if (this.disposed) {
            return;
        }
        for (var key in this.binaryCache) {
            this.gpgpu.deleteProgram(this.binaryCache[key].webGLProgram);
        }
        this.textureManager.dispose();
        this.canvas.remove();
        if (this.gpgpuCreatedLocally) {
            this.gpgpu.dispose();
        }
        this.disposed = true;
    };
    MathBackendWebGL.prototype.throwIfNoData = function (dataId) {
        if (!this.texData.has(dataId)) {
            throw new Error("WebGL backend: No data found for this tensor. " +
                "Did you change your backend in the middle of the program? " +
                "New backends can't use Tensors created with previous backends");
        }
    };
    MathBackendWebGL.prototype.uploadToGPU = function (dataId) {
        this.throwIfNoData(dataId);
        var texData = this.texData.get(dataId);
        var shape = texData.shape, values = texData.values, texture = texData.texture, dtype = texData.dtype, texType = texData.texType;
        if (texture != null) {
            return;
        }
        var shouldTimeProgram = this.activeTimers != null;
        var start;
        if (shouldTimeProgram) {
            start = performance.now();
        }
        var texShape = webgl_util.getTextureShapeFromLogicalShape(this.gpgpu.gl, shape);
        texData.texShape = texShape;
        var newTexture = this.textureManager.acquireTexture(texShape, texType);
        texData.texture = newTexture;
        if (values != null) {
            this.gpgpu.uploadMatrixToTexture(newTexture, texShape[0], texShape[1], typedArrayToFloat32(values, dtype));
            texData.values = null;
            if (shouldTimeProgram) {
                this.uploadWaitMs += performance.now() - start;
            }
        }
    };
    MathBackendWebGL.prototype.cacheOnCPU = function (dataId, float32Values) {
        var dontKeepCopyOnGPU = this.delayedStorage;
        var texData = this.texData.get(dataId);
        var texture = texData.texture, texShape = texData.texShape, dtype = texData.dtype, texType = texData.texType;
        if (dontKeepCopyOnGPU && texture != null) {
            this.textureManager.releaseTexture(texture, texShape, texType);
            texData.texture = null;
            texData.texShape = null;
        }
        if (float32Values != null) {
            texData.values = float32ToTypedArray(float32Values, dtype);
        }
    };
    return MathBackendWebGL;
}());
exports.MathBackendWebGL = MathBackendWebGL;
environment_1.ENV.registerBackend('webgl', function () { return new MathBackendWebGL(); });
var NDArrayMathGPU = (function (_super) {
    __extends(NDArrayMathGPU, _super);
    function NDArrayMathGPU(gpgpu, safeMode) {
        if (safeMode === void 0) { safeMode = false; }
        var _this = this;
        console.warn('new NDArrayMathGPU() is deprecated. Please use ' +
            'dl.setBackend(\'webgl\').');
        _this = _super.call(this, new MathBackendWebGL(gpgpu), safeMode) || this;
        return _this;
    }
    return NDArrayMathGPU;
}(math_1.NDArrayMath));
exports.NDArrayMathGPU = NDArrayMathGPU;
function float32ToTypedArray(a, dtype) {
    if (dtype === 'float32') {
        return a;
    }
    else if (dtype === 'int32' || dtype === 'bool') {
        var result = (dtype === 'int32') ? new Int32Array(a.length) :
            new Uint8Array(a.length);
        for (var i = 0; i < result.length; ++i) {
            var val = a[i];
            val = isNaN(val) ? util.getNaN(dtype) : Math.round(val);
            result[i] = val;
        }
        return result;
    }
    else {
        throw new Error("Unknown dtype " + dtype);
    }
}
function typedArrayToFloat32(a, dtype) {
    if (a instanceof Float32Array) {
        return a;
    }
    else {
        var res = new Float32Array(a.length);
        for (var i = 0; i < res.length; i++) {
            var val = a[i];
            res[i] = util.isValNaN(val, dtype) ? NaN : val;
        }
        return res;
    }
}

},{"../environment":35,"../math":104,"../ops/axis_util":106,"../ops/reduce_util":125,"../tensor":145,"../types":150,"../util":151,"./webgl/argminmax_gpu":71,"./webgl/avg_pool_backprop_gpu":72,"./webgl/batchnorm_gpu":73,"./webgl/binaryop_gpu":74,"./webgl/clip_gpu":75,"./webgl/concat_gpu":76,"./webgl/conv_backprop_gpu":77,"./webgl/conv_gpu":78,"./webgl/conv_gpu_depthwise":79,"./webgl/from_pixels_gpu":80,"./webgl/gather_gpu":81,"./webgl/gpgpu_context":82,"./webgl/gpgpu_math":83,"./webgl/logical_gpu":85,"./webgl/lrn_gpu":86,"./webgl/max_pool_backprop_gpu":87,"./webgl/mulmat_gpu":88,"./webgl/multinomial_gpu":89,"./webgl/onehot_gpu":90,"./webgl/pad_gpu":91,"./webgl/pool_gpu":92,"./webgl/reduce_gpu":93,"./webgl/resize_bilinear_gpu":94,"./webgl/reverse_gpu":95,"./webgl/slice_gpu":97,"./webgl/tex_util":98,"./webgl/texture_manager":99,"./webgl/tile_gpu":100,"./webgl/transpose_gpu":101,"./webgl/unaryop_gpu":102,"./webgl/webgl_util":103}],71:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArgMinMaxProgram = (function () {
    function ArgMinMaxProgram(reduceInfo, op, firstPass) {
        this.variableNames = ['A'];
        var windowSize = reduceInfo.windowSize;
        var batchSize = reduceInfo.batchSize;
        var inSize = reduceInfo.inSize;
        var outSize = Math.ceil(inSize / windowSize);
        if (!firstPass) {
            this.variableNames.push('bestIndicesA');
        }
        this.outputShape = [batchSize, outSize];
        var compOp = (op === 'max') ? '>' : '<';
        var indexSnippet = firstPass ?
            'inOffset + i;' :
            'round(getBestIndicesA(batch, inOffset + i));';
        this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n        int outIdx = coords[1];\n        int inOffset = outIdx * " + windowSize + ";\n\n        int bestIndex = 0;\n        float bestValue = getA(batch, inOffset);\n\n        for (int i = 0; i < " + windowSize + "; i++) {\n          int inIdx = " + indexSnippet + ";\n          float candidate = getA(batch, inIdx);\n          if (isNaN(candidate)) {\n            setOutput(candidate);\n            return;\n          }\n          if (candidate " + compOp + " bestValue) {\n            bestValue = candidate;\n            bestIndex = inIdx;\n          }\n        }\n        setOutput(float(bestIndex));\n      }\n    ";
    }
    return ArgMinMaxProgram;
}());
exports.ArgMinMaxProgram = ArgMinMaxProgram;

},{}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AvgPool2DBackpropProgram = (function () {
    function AvgPool2DBackpropProgram(convInfo) {
        this.variableNames = ['dy'];
        this.outputShape = convInfo.inShape;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var padTop = filterHeight - 1 - convInfo.padInfo.top;
        var padLeft = filterWidth - 1 - convInfo.padInfo.left;
        var avgMultiplier = 1 / (filterHeight * filterWidth);
        this.userCode = "\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n      const float avgMultiplier = float(" + avgMultiplier + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n\n        ivec2 dyRCCorner = coords.yz - pads;\n        int dyRCorner = dyRCCorner.x;\n        int dyCCorner = dyRCCorner.y;\n\n        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + filterHeight + "; wR++) {\n          float dyR = float(dyRCorner + wR) / " + strideHeight + ".0;\n\n          if (dyR < 0.0 || dyR >= " + convInfo.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          for (int wC = 0; wC < " + filterWidth + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + strideWidth + ".0;\n\n            if (dyC < 0.0 || dyC >= " + convInfo.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            float dyValue = getDy(b, idyR, idyC, d);\n\n            dotProd += dyValue * avgMultiplier;\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
    }
    return AvgPool2DBackpropProgram;
}());
exports.AvgPool2DBackpropProgram = AvgPool2DBackpropProgram;

},{}],73:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var broadcast_util = require("../../ops/broadcast_util");
var BatchNormProgram = (function () {
    function BatchNormProgram(xShape, meanShape, varianceShape, offsetShape, scaleShape, varianceEpsilon) {
        this.outputShape = [];
        this.supportsBroadcasting = true;
        this.variableNames = ['x', 'mean', 'variance'];
        broadcast_util.assertAndGetBroadcastShape(xShape, meanShape);
        broadcast_util.assertAndGetBroadcastShape(xShape, varianceShape);
        var offsetSnippet = '0.0';
        if (offsetShape != null) {
            broadcast_util.assertAndGetBroadcastShape(xShape, offsetShape);
            this.variableNames.push('offset');
            offsetSnippet = 'getOffsetAtOutCoords()';
        }
        var scaleSnippet = '1.0';
        if (scaleShape != null) {
            broadcast_util.assertAndGetBroadcastShape(xShape, scaleShape);
            this.variableNames.push('scale');
            scaleSnippet = 'getScaleAtOutCoords()';
        }
        this.outputShape = xShape;
        this.userCode = "\n      void main() {\n        float x = getXAtOutCoords();\n        float mean = getMeanAtOutCoords();\n        float variance = getVarianceAtOutCoords();\n        float offset = " + offsetSnippet + ";\n        float scale = " + scaleSnippet + ";\n        float inv = scale / sqrt(variance + float(" + varianceEpsilon + "));\n        setOutput((x - mean) * inv + offset);\n      }\n    ";
    }
    return BatchNormProgram;
}());
exports.BatchNormProgram = BatchNormProgram;

},{"../../ops/broadcast_util":109}],74:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var broadcast_util = require("../../ops/broadcast_util");
var CHECK_NAN_SNIPPET = "\n  if (isNaN(a)) return a;\n  if (isNaN(b)) return b;\n";
exports.ADD = 'return a + b;';
exports.SUB = 'return a - b;';
exports.MUL = 'return a * b;';
exports.DIV = 'return a / b;';
exports.POW = "\n  return (round(mod(b, 2.0)) == 0 || round(mod(b, 2.0)) == 2) ?\n      pow(abs(a), b) : sign(a) * pow(abs(a), b);\n";
exports.EQUAL = CHECK_NAN_SNIPPET + "\n  return float(a == b);\n";
exports.NOT_EQUAL = CHECK_NAN_SNIPPET + "\n  return float(a != b);\n";
exports.LESS = CHECK_NAN_SNIPPET + "\n  return float(a < b);\n";
exports.LESS_EQUAL = CHECK_NAN_SNIPPET + "\n  return float(a <= b);\n";
exports.GREATER = CHECK_NAN_SNIPPET + "\n  return float(a > b);\n";
exports.GREATER_EQUAL = CHECK_NAN_SNIPPET + "\n  return float(a >= b);\n";
exports.LOGICAL_AND = CHECK_NAN_SNIPPET + "\n  return float(a >= 1.0 && b >= 1.0);\n";
exports.LOGICAL_OR = CHECK_NAN_SNIPPET + "\n  return float(a >= 1.0 || b >= 1.0);\n";
exports.LOGICAL_XOR = CHECK_NAN_SNIPPET + "\n  return float(a >= 1.0 ^^ b >= 1.0);\n";
exports.PRELU = "\n  return (a >= 0.0) ? a : b * a;\n";
exports.PRELU_DER = "\n  return (a > 0.0) ? 1.0 : ((a < 0.0) ? b : a);\n";
exports.MAX = CHECK_NAN_SNIPPET + "\n  return max(a, b);\n";
exports.MIN = CHECK_NAN_SNIPPET + "\n  return min(a, b);\n";
var BinaryOpProgram = (function () {
    function BinaryOpProgram(op, aShape, bShape) {
        this.variableNames = ['A', 'B'];
        this.supportsBroadcasting = true;
        this.outputShape =
            broadcast_util.assertAndGetBroadcastShape(aShape, bShape);
        this.userCode = "\n      float binaryOperation(float a, float b) {\n        " + op + "\n      }\n\n      void main() {\n        float a = getAAtOutCoords();\n        float b = getBAtOutCoords();\n        setOutput(binaryOperation(a, b));\n      }\n    ";
    }
    return BinaryOpProgram;
}());
exports.BinaryOpProgram = BinaryOpProgram;

},{"../../ops/broadcast_util":109}],75:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClipProgram = (function () {
    function ClipProgram(aShape, min, max) {
        this.variableNames = ['A'];
        this.outputShape = aShape;
        var minFixed = min.toFixed(20);
        var maxFixed = max.toFixed(20);
        this.userCode = "\n      void main() {\n        float value = getAAtOutCoords();\n        if (isNaN(value)) {\n          setOutput(value);\n          return;\n        }\n\n        setOutput(clamp(value, " + minFixed + ", " + maxFixed + "));\n      }\n    ";
    }
    return ClipProgram;
}());
exports.ClipProgram = ClipProgram;

},{}],76:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var concat_util = require("../../ops/concat_util");
var ConcatProgram = (function () {
    function ConcatProgram(aShape, bShape) {
        this.variableNames = ['A', 'B'];
        this.outputShape = [];
        this.outputShape =
            concat_util.computeOutShape(aShape, bShape, 1);
        this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int yR = coords.x;\n        int yC = coords.y;\n\n        float value = 0.0;\n        if (yC < " + aShape[1] + ") {\n          value = getA(yR, yC);\n        } else {\n          yC -= " + aShape[1] + ";\n          value = getB(yR, yC);\n        }\n\n        setOutput(value);\n      }\n    ";
    }
    return ConcatProgram;
}());
exports.ConcatProgram = ConcatProgram;

},{"../../ops/concat_util":112}],77:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Conv2DDerFilterProgram = (function () {
    function Conv2DDerFilterProgram(convInfo) {
        this.variableNames = ['x', 'dy'];
        this.outputShape = convInfo.filterShape;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int wR = coords.x;\n        int wC = coords.y;\n        int d1 = coords.z;\n        int d2 = coords.w;\n\n        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n\n        for (int b = 0; b < " + convInfo.batchSize + "; b++) {\n          for (int yR = 0; yR < " + convInfo.outHeight + "; yR++) {\n            int xR = wR + yR * " + strideHeight + " - " + padTop + ";\n\n            if (xR < 0 || xR >= " + convInfo.inHeight + ") {\n              continue;\n            }\n\n            for (int yC = 0; yC < " + convInfo.outWidth + "; yC++) {\n              int xC = wC + yC * " + strideWidth + " - " + padLeft + ";\n\n              if (xC < 0 || xC >= " + convInfo.inWidth + ") {\n                continue;\n              }\n\n              float dyValue = getDy(b, yR, yC, d2);\n              float xValue = getX(b, xR, xC, d1);\n              dotProd += (xValue * dyValue);\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
    }
    return Conv2DDerFilterProgram;
}());
exports.Conv2DDerFilterProgram = Conv2DDerFilterProgram;
var Conv2DDerInputProgram = (function () {
    function Conv2DDerInputProgram(convInfo) {
        this.variableNames = ['dy', 'W'];
        this.outputShape = convInfo.inShape;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var padTop = filterHeight - 1 - convInfo.padInfo.top;
        var padLeft = filterWidth - 1 - convInfo.padInfo.left;
        this.userCode = "\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d1 = coords[3];\n\n        ivec2 dyCorner = coords.yz - pads;\n        int dyRCorner = dyCorner.x;\n        int dyCCorner = dyCorner.y;\n\n        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + filterHeight + "; wR++) {\n          float dyR = float(dyRCorner + wR) / " + strideHeight + ".0;\n\n          if (dyR < 0.0 || dyR >= " + convInfo.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          int wRPerm = " + filterHeight + " - 1 - wR;\n\n          for (int wC = 0; wC < " + filterWidth + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + strideWidth + ".0;\n\n            if (dyC < 0.0 || dyC >= " + convInfo.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            int wCPerm = " + filterWidth + " - 1 - wC;\n\n            for (int d2 = 0; d2 < " + convInfo.outChannels + "; d2++) {\n              float xValue = getDy(batch, idyR, idyC, d2);\n              float wValue = getW(wRPerm, wCPerm, d1, d2);\n              dotProd += xValue * wValue;\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
    }
    return Conv2DDerInputProgram;
}());
exports.Conv2DDerInputProgram = Conv2DDerInputProgram;

},{}],78:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Conv2DProgram = (function () {
    function Conv2DProgram(convInfo) {
        this.variableNames = ['x', 'W'];
        this.outputShape = convInfo.outShape;
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var inputDepthNearestVec4 = Math.floor(convInfo.inChannels / 4) * 4;
        var inputDepthVec4Remainder = convInfo.inChannels % 4;
        this.userCode = "\n      const ivec2 strides = ivec2(" + strideHeight + ", " + strideWidth + ");\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d2 = coords[3];\n\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + filterHeight + "; wR++) {\n          int xR = xRCorner + wR;\n\n          if (xR < 0 || xR >= " + convInfo.inHeight + ") {\n            continue;\n          }\n\n          for (int wC = 0; wC < " + filterWidth + "; wC++) {\n            int xC = xCCorner + wC;\n\n            if (xC < 0 || xC >= " + convInfo.inWidth + ") {\n              continue;\n            }\n\n            for (int d1 = 0; d1 < " + inputDepthNearestVec4 + "; d1 += 4) {\n              vec4 xValues = vec4(\n                getX(batch, xR, xC, d1),\n                getX(batch, xR, xC, d1 + 1),\n                getX(batch, xR, xC, d1 + 2),\n                getX(batch, xR, xC, d1 + 3)\n              );\n              vec4 wValues = vec4(\n                getW(wR, wC, d1, d2),\n                getW(wR, wC, d1 + 1, d2),\n                getW(wR, wC, d1 + 2, d2),\n                getW(wR, wC, d1 + 3, d2)\n              );\n\n              dotProd += dot(xValues, wValues);\n            }\n\n            if (" + (inputDepthVec4Remainder === 1) + ") {\n              dotProd +=\n                getX(batch, xR, xC, " + inputDepthNearestVec4 + ") *\n                getW(wR, wC, " + inputDepthNearestVec4 + ", d2);\n            } else if (" + (inputDepthVec4Remainder === 2) + ") {\n              vec2 xValues = vec2(\n                getX(batch, xR, xC, " + inputDepthNearestVec4 + "),\n                getX(batch, xR, xC, " + inputDepthNearestVec4 + " + 1)\n              );\n              vec2 wValues = vec2(\n                getW(wR, wC, " + inputDepthNearestVec4 + ", d2),\n                getW(wR, wC, " + inputDepthNearestVec4 + " + 1, d2)\n              );\n              dotProd += dot(xValues, wValues);\n            } else if (" + (inputDepthVec4Remainder === 3) + ") {\n              vec3 xValues = vec3(\n                getX(batch, xR, xC, " + inputDepthNearestVec4 + "),\n                getX(batch, xR, xC, " + inputDepthNearestVec4 + " + 1),\n                getX(batch, xR, xC, " + inputDepthNearestVec4 + " + 2)\n              );\n              vec3 wValues = vec3(\n                getW(wR, wC, " + inputDepthNearestVec4 + ", d2),\n                getW(wR, wC, " + inputDepthNearestVec4 + " + 1, d2),\n                getW(wR, wC, " + inputDepthNearestVec4 + " + 2, d2)\n              );\n              dotProd += dot(xValues, wValues);\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
    }
    return Conv2DProgram;
}());
exports.Conv2DProgram = Conv2DProgram;

},{}],79:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DepthwiseConv2DProgram = (function () {
    function DepthwiseConv2DProgram(convInfo) {
        this.variableNames = ['x', 'W'];
        this.outputShape = convInfo.outShape;
        var xNumRows = convInfo.inHeight;
        var xNumCols = convInfo.inWidth;
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var channelMul = convInfo.outChannels / convInfo.inChannels;
        this.userCode = "\n      const ivec2 strides = ivec2(" + strideHeight + ", " + strideWidth + ");\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords.x;\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int d2 = coords.w;\n        int d1 = d2 / " + channelMul + ";\n        int q = d2 - d1 * " + channelMul + ";\n\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // Convolve x(?, ?, d1) with w(:, :, d1, q) to get y(yR, yC, d2).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        // TODO(dsmilkov): Flatten the two for loops and vec4 the operations.\n        for (int wR = 0; wR < " + filterHeight + "; wR++) {\n          int xR = xRCorner + wR;\n\n          if (xR < 0 || xR >= " + xNumRows + ") {\n            continue;\n          }\n\n          for (int wC = 0; wC < " + filterWidth + "; wC++) {\n            int xC = xCCorner + wC;\n\n            if (xC < 0 || xC >= " + xNumCols + ") {\n              continue;\n            }\n\n            float xVal = getX(batch, xR, xC, d1);\n            float wVal = getW(wR, wC, d1, q);\n            dotProd += xVal * wVal;\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
    }
    return DepthwiseConv2DProgram;
}());
exports.DepthwiseConv2DProgram = DepthwiseConv2DProgram;

},{}],80:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FromPixelsProgram = (function () {
    function FromPixelsProgram(outputShape) {
        this.variableNames = ['A'];
        var height = outputShape[0], width = outputShape[1];
        this.outputShape = outputShape;
        this.userCode = "\n      void main() {\n        ivec3 coords = getOutputCoords();\n        int texR = coords[0];\n        int texC = coords[1];\n        int depth = coords[2];\n        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + width + ".0, " + height + ".0);\n\n        vec4 values = texture2D(A, uv);\n        float value;\n        if (depth == 0) {\n          value = values.r;\n        } else if (depth == 1) {\n          value = values.g;\n        } else if (depth == 2) {\n          value = values.b;\n        } else if (depth == 3) {\n          value = values.a;\n        }\n\n        setOutput(floor(value * 255.0 + 0.5));\n      }\n    ";
    }
    return FromPixelsProgram;
}());
exports.FromPixelsProgram = FromPixelsProgram;

},{}],81:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_compiler_1 = require("./shader_compiler");
var GatherProgram = (function () {
    function GatherProgram(aShape, indicesLength, axis) {
        this.variableNames = ['A', 'indices'];
        var outputShape = aShape.slice();
        outputShape[axis] = indicesLength;
        this.outputShape = outputShape;
        this.rank = outputShape.length;
        var dtype = shader_compiler_1.getCoordsDataType(this.rank);
        var sourceCoords = getSourceCoords(aShape, axis);
        this.userCode = "\n      void main() {\n        " + dtype + " resRC = getOutputCoords();\n        setOutput(getA(" + sourceCoords + "));\n      }\n    ";
    }
    return GatherProgram;
}());
exports.GatherProgram = GatherProgram;
function getSourceCoords(aShape, axis) {
    var rank = aShape.length;
    if (rank > 4) {
        throw Error("Gather for rank " + rank + " is not yet supported");
    }
    if (rank === 1) {
        return "int(getIndices(resRC))";
    }
    var currentCoords = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w'];
    var sourceCoords = [];
    for (var i = 0; i < aShape.length; i++) {
        if (i === axis) {
            sourceCoords.push("int(getIndices(" + currentCoords[i] + "))");
        }
        else {
            sourceCoords.push("" + currentCoords[i]);
        }
    }
    return sourceCoords.join();
}

},{"./shader_compiler":96}],82:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../environment");
var util = require("../../util");
var gpgpu_util = require("./gpgpu_util");
var tex_util = require("./tex_util");
var webgl_util = require("./webgl_util");
var GPGPUContext = (function () {
    function GPGPUContext(gl) {
        this.outputTexture = null;
        this.program = null;
        this.disposed = false;
        this.autoDebugValidate = false;
        this.firstProgram = true;
        if (gl != null) {
            this.gl = gl;
        }
        else {
            this.gl = gpgpu_util.createWebGLContext();
        }
        if (environment_1.ENV.get('WEBGL_VERSION') === 1) {
            this.textureFloatExtension =
                webgl_util.getExtensionOrThrow(this.gl, 'OES_texture_float');
            this.colorBufferFloatExtension =
                this.gl.getExtension('WEBGL_color_buffer_float');
        }
        else {
            this.colorBufferFloatExtension =
                webgl_util.getExtensionOrThrow(this.gl, 'EXT_color_buffer_float');
        }
        this.loseContextExtension =
            webgl_util.getExtensionOrThrow(this.gl, 'WEBGL_lose_context');
        if (environment_1.ENV.get('WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED')) {
            this.getBufferSubDataAsyncExtension =
                this.gl.getExtension('WEBGL_get_buffer_sub_data_async');
        }
        this.vertexBuffer = gpgpu_util.createVertexBuffer(this.gl);
        this.indexBuffer = gpgpu_util.createIndexBuffer(this.gl);
        this.framebuffer = webgl_util.createFramebuffer(this.gl);
    }
    GPGPUContext.prototype.dispose = function () {
        var _this = this;
        if (this.disposed) {
            return;
        }
        if (this.program != null) {
            console.warn('Disposing a GPGPUContext that still has a bound WebGLProgram.' +
                ' This is probably a resource leak, delete the program with ' +
                'GPGPUContext.deleteProgram before disposing.');
        }
        if (this.outputTexture != null) {
            console.warn('Disposing a GPGPUContext that still has a bound output matrix ' +
                'texture.  This is probably a resource leak, delete the output ' +
                'matrix texture with GPGPUContext.deleteMatrixTexture before ' +
                'disposing.');
        }
        var gl = this.gl;
        webgl_util.callAndCheck(gl, function () { return gl.finish(); });
        webgl_util.callAndCheck(gl, function () { return gl.bindFramebuffer(gl.FRAMEBUFFER, null); });
        webgl_util.callAndCheck(gl, function () { return gl.deleteFramebuffer(_this.framebuffer); });
        webgl_util.callAndCheck(gl, function () { return gl.bindBuffer(gl.ARRAY_BUFFER, null); });
        webgl_util.callAndCheck(gl, function () { return gl.deleteBuffer(_this.vertexBuffer); });
        webgl_util.callAndCheck(gl, function () { return gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null); });
        webgl_util.callAndCheck(gl, function () { return gl.deleteBuffer(_this.indexBuffer); });
        this.loseContextExtension.loseContext();
        this.disposed = true;
    };
    GPGPUContext.prototype.enableAutomaticDebugValidation = function (enabled) {
        this.autoDebugValidate = enabled;
        webgl_util.enableDebugWebGLErrorChecking(enabled);
    };
    GPGPUContext.prototype.createMatrixTexture = function (rows, columns) {
        this.throwIfDisposed();
        return gpgpu_util.createMatrixTexture(this.gl, rows, columns);
    };
    GPGPUContext.prototype.uploadPixelDataToTexture = function (texture, pixels) {
        this.throwIfDisposed();
        gpgpu_util.uploadPixelDataToTexture(this.gl, texture, pixels);
    };
    GPGPUContext.prototype.createPackedMatrixTexture = function (rows, columns) {
        this.throwIfDisposed();
        return gpgpu_util.createPackedMatrixTexture(this.gl, rows, columns);
    };
    GPGPUContext.prototype.deleteMatrixTexture = function (texture) {
        var _this = this;
        this.throwIfDisposed();
        if (this.outputTexture === texture) {
            webgl_util.unbindColorTextureFromFramebuffer(this.gl, this.framebuffer);
            this.outputTexture = null;
        }
        webgl_util.callAndCheck(this.gl, function () { return _this.gl.deleteTexture(texture); });
    };
    GPGPUContext.prototype.uploadMatrixToTexture = function (texture, rows, columns, matrix) {
        this.throwIfDisposed();
        var numChannels = 1;
        return gpgpu_util.uploadMatrixToTexture(this.gl, texture, rows, columns, matrix, numChannels);
    };
    GPGPUContext.prototype.uploadMatrixToPackedTexture = function (texture, rows, columns, matrix) {
        this.throwIfDisposed();
        return gpgpu_util.uploadMatrixToPackedTexture(this.gl, texture, rows, columns, matrix);
    };
    GPGPUContext.prototype.downloadMatrixFromTexture = function (texture, rows, columns) {
        var _this = this;
        return this.downloadMatrixDriver(texture, function () {
            return gpgpu_util.downloadMatrixFromOutputTexture(_this.gl, rows, columns);
        });
    };
    GPGPUContext.prototype.downloadMatrixFromTextureAsync = function (texture, rows, columns) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.getBufferSubDataAsyncExtension == null) {
                    throw new Error("Cannot download matrix from output texture asynchronously, " +
                        "WEBGL_get_buffer_sub_data_async is not enabled.");
                }
                return [2, this.downloadMatrixDriverAsync(texture, function () { return gpgpu_util.downloadMatrixFromOutputTextureAsync(_this.gl, _this.getBufferSubDataAsyncExtension, rows, columns); })];
            });
        });
    };
    GPGPUContext.prototype.downloadMatrixFromRGBAColorTexture = function (texture, rows, columns, channels) {
        var _this = this;
        return this.downloadMatrixDriver(texture, function () { return gpgpu_util.downloadMatrixFromRGBAColorTexture(_this.gl, rows, columns, channels); });
    };
    GPGPUContext.prototype.downloadMatrixFromPackedTexture = function (texture, rows, columns) {
        var _this = this;
        return this.downloadMatrixDriver(texture, function () { return gpgpu_util.downloadMatrixFromPackedOutputTexture(_this.gl, rows, columns); });
    };
    GPGPUContext.prototype.createProgram = function (fragmentShaderSource) {
        this.throwIfDisposed();
        var gl = this.gl;
        var fragmentShader = webgl_util.createFragmentShader(gl, fragmentShaderSource);
        var vertexShader = gpgpu_util.createVertexShader(gl);
        var program = webgl_util.createProgram(gl);
        webgl_util.callAndCheck(gl, function () { return gl.attachShader(program, vertexShader); });
        webgl_util.callAndCheck(gl, function () { return gl.attachShader(program, fragmentShader); });
        webgl_util.linkProgram(gl, program);
        if (this.autoDebugValidate) {
            webgl_util.validateProgram(gl, program);
        }
        if (this.firstProgram) {
            this.firstProgram = false;
            this.setProgram(program);
            gpgpu_util.bindVertexProgramAttributeStreams(gl, this.program, this.vertexBuffer);
        }
        return program;
    };
    GPGPUContext.prototype.deleteProgram = function (program) {
        var _this = this;
        this.throwIfDisposed();
        if (program === this.program) {
            this.program = null;
        }
        if (program != null) {
            webgl_util.callAndCheck(this.gl, function () { return _this.gl.deleteProgram(program); });
        }
    };
    GPGPUContext.prototype.setProgram = function (program) {
        var _this = this;
        this.throwIfDisposed();
        this.program = program;
        if ((this.program != null) && this.autoDebugValidate) {
            webgl_util.validateProgram(this.gl, this.program);
        }
        webgl_util.callAndCheck(this.gl, function () { return _this.gl.useProgram(program); });
    };
    GPGPUContext.prototype.getUniformLocation = function (program, uniformName, shouldThrow) {
        if (shouldThrow === void 0) { shouldThrow = true; }
        this.throwIfDisposed();
        if (shouldThrow) {
            return webgl_util.getProgramUniformLocationOrThrow(this.gl, program, uniformName);
        }
        else {
            return webgl_util.getProgramUniformLocation(this.gl, program, uniformName);
        }
    };
    GPGPUContext.prototype.getAttributeLocation = function (program, attribute) {
        var _this = this;
        this.throwIfDisposed();
        return webgl_util.callAndCheck(this.gl, function () { return _this.gl.getAttribLocation(program, attribute); });
    };
    GPGPUContext.prototype.getUniformLocationNoThrow = function (program, uniformName) {
        this.throwIfDisposed();
        return this.gl.getUniformLocation(program, uniformName);
    };
    GPGPUContext.prototype.setInputMatrixTexture = function (inputMatrixTexture, uniformLocation, textureUnit) {
        this.throwIfDisposed();
        this.throwIfNoProgram();
        webgl_util.bindTextureToProgramUniformSampler(this.gl, this.program, inputMatrixTexture, uniformLocation, textureUnit);
    };
    GPGPUContext.prototype.setOutputMatrixTexture = function (outputMatrixTexture, rows, columns) {
        this.setOutputMatrixTextureDriver(outputMatrixTexture, columns, rows);
    };
    GPGPUContext.prototype.setOutputPackedMatrixTexture = function (outputPackedMatrixTexture, rows, columns) {
        this.throwIfDisposed();
        var _a = tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
        this.setOutputMatrixTextureDriver(outputPackedMatrixTexture, width, height);
    };
    GPGPUContext.prototype.setOutputMatrixWriteRegion = function (startRow, numRows, startColumn, numColumns) {
        this.setOutputMatrixWriteRegionDriver(startColumn, startRow, numColumns, numRows);
    };
    GPGPUContext.prototype.setOutputPackedMatrixWriteRegion = function (startRow, numRows, startColumn, numColumns) {
        throw new Error('setOutputPackedMatrixWriteRegion not implemented.');
    };
    GPGPUContext.prototype.debugValidate = function () {
        if (this.program != null) {
            webgl_util.validateProgram(this.gl, this.program);
        }
        webgl_util.validateFramebuffer(this.gl);
    };
    GPGPUContext.prototype.executeProgram = function () {
        this.throwIfDisposed();
        this.throwIfNoProgram();
        var gl = this.gl;
        if (this.autoDebugValidate) {
            this.debugValidate();
        }
        webgl_util.callAndCheck(gl, function () { return gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0); });
    };
    GPGPUContext.prototype.blockUntilAllProgramsCompleted = function () {
        var _this = this;
        this.throwIfDisposed();
        webgl_util.callAndCheck(this.gl, function () { return _this.gl.finish(); });
    };
    GPGPUContext.prototype.getQueryTimerExtension = function () {
        if (this.disjointQueryTimerExtension == null) {
            this.disjointQueryTimerExtension =
                webgl_util.getExtensionOrThrow(this.gl, environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') === 2 ?
                    'EXT_disjoint_timer_query_webgl2' :
                    'EXT_disjoint_timer_query');
        }
        return this.disjointQueryTimerExtension;
    };
    GPGPUContext.prototype.getQueryTimerExtensionWebGL2 = function () {
        return this.getQueryTimerExtension();
    };
    GPGPUContext.prototype.getQueryTimerExtensionWebGL1 = function () {
        return this.getQueryTimerExtension();
    };
    GPGPUContext.prototype.runQuery = function (queryFn) {
        var query = this.beginQuery();
        queryFn();
        this.endQuery();
        return this.pollQueryTime(query);
    };
    GPGPUContext.prototype.beginQuery = function () {
        if (environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') === 2) {
            var gl2 = this.gl;
            var ext_1 = this.getQueryTimerExtensionWebGL2();
            var query_1 = gl2.createQuery();
            gl2.beginQuery(ext_1.TIME_ELAPSED_EXT, query_1);
            return query_1;
        }
        var ext = this.getQueryTimerExtensionWebGL1();
        var query = ext.createQueryEXT();
        ext.beginQueryEXT(ext.TIME_ELAPSED_EXT, query);
        return query;
    };
    GPGPUContext.prototype.endQuery = function () {
        if (environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') === 2) {
            var gl2 = this.gl;
            var ext_2 = this.getQueryTimerExtensionWebGL2();
            gl2.endQuery(ext_2.TIME_ELAPSED_EXT);
            return;
        }
        var ext = this.getQueryTimerExtensionWebGL1();
        ext.endQueryEXT(ext.TIME_ELAPSED_EXT);
    };
    GPGPUContext.prototype.isQueryAvailable = function (query, queryTimerVersion) {
        if (queryTimerVersion === 0) {
            return true;
        }
        if (queryTimerVersion === 2) {
            var gl2 = this.gl;
            var ext = this.getQueryTimerExtensionWebGL2();
            var available = gl2.getQueryParameter(query, gl2.QUERY_RESULT_AVAILABLE);
            var disjoint = this.gl.getParameter(ext.GPU_DISJOINT_EXT);
            return available && !disjoint;
        }
        else {
            var ext = this.getQueryTimerExtensionWebGL1();
            var available = ext.getQueryObjectEXT(query, ext.QUERY_RESULT_AVAILABLE_EXT);
            var disjoint = this.gl.getParameter(ext.GPU_DISJOINT_EXT);
            return available && !disjoint;
        }
    };
    GPGPUContext.prototype.pollQueryTime = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var resolveWithWarning = function () {
                console.warn('Disjoint query timer never available.');
                resolve(-1);
            };
            var queryTimerVersion = environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION');
            util.repeatedTry(function () { return _this.isQueryAvailable(query, queryTimerVersion); })
                .then(function () { return resolve(_this.getQueryTime(query, queryTimerVersion)); })
                .catch(resolveWithWarning);
        });
    };
    GPGPUContext.prototype.getQueryTime = function (query, queryTimerVersion) {
        if (queryTimerVersion === 0) {
            return null;
        }
        if (queryTimerVersion === 2) {
            var gl2 = this.gl;
            var timeElapsedNanos = gl2.getQueryParameter(query, gl2.QUERY_RESULT);
            return timeElapsedNanos / 1000000;
        }
        else {
            var ext = this.getQueryTimerExtensionWebGL1();
            var timeElapsedNanos = ext.getQueryObjectEXT(query, ext.QUERY_RESULT_EXT);
            return timeElapsedNanos / 1000000;
        }
    };
    GPGPUContext.prototype.downloadMatrixDriverSetup = function (texture) {
        this.throwIfDisposed();
        webgl_util.bindColorTextureToFramebuffer(this.gl, texture, this.framebuffer);
        if (this.autoDebugValidate) {
            webgl_util.validateFramebuffer(this.gl);
        }
    };
    GPGPUContext.prototype.downloadMatrixDriverTeardown = function () {
        if (this.outputTexture != null) {
            webgl_util.bindColorTextureToFramebuffer(this.gl, this.outputTexture, this.framebuffer);
            if (this.autoDebugValidate) {
                webgl_util.validateFramebuffer(this.gl);
            }
        }
        else {
            webgl_util.unbindColorTextureFromFramebuffer(this.gl, this.framebuffer);
        }
    };
    GPGPUContext.prototype.downloadMatrixDriver = function (texture, downloadAndDecode) {
        this.downloadMatrixDriverSetup(texture);
        var result = downloadAndDecode();
        this.downloadMatrixDriverTeardown();
        return result;
    };
    GPGPUContext.prototype.downloadMatrixDriverAsync = function (texture, downloadAndDecode) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.downloadMatrixDriverSetup(texture);
                        return [4, downloadAndDecode()];
                    case 1:
                        result = _a.sent();
                        this.downloadMatrixDriverTeardown();
                        return [2, result];
                }
            });
        });
    };
    GPGPUContext.prototype.setOutputMatrixTextureDriver = function (outputMatrixTextureMaybePacked, width, height) {
        this.throwIfDisposed();
        var gl = this.gl;
        webgl_util.bindColorTextureToFramebuffer(gl, outputMatrixTextureMaybePacked, this.framebuffer);
        if (this.autoDebugValidate) {
            webgl_util.validateFramebuffer(gl);
        }
        this.outputTexture = outputMatrixTextureMaybePacked;
        webgl_util.callAndCheck(gl, function () { return gl.viewport(0, 0, width, height); });
        webgl_util.callAndCheck(gl, function () { return gl.scissor(0, 0, width, height); });
    };
    GPGPUContext.prototype.setOutputMatrixWriteRegionDriver = function (x, y, width, height) {
        var _this = this;
        this.throwIfDisposed();
        webgl_util.callAndCheck(this.gl, function () { return _this.gl.scissor(x, y, width, height); });
    };
    GPGPUContext.prototype.throwIfDisposed = function () {
        if (this.disposed) {
            throw new Error('Attempted to use disposed GPGPUContext.');
        }
    };
    GPGPUContext.prototype.throwIfNoProgram = function () {
        if (this.program == null) {
            throw new Error('No GPU program is currently set.');
        }
    };
    return GPGPUContext;
}());
exports.GPGPUContext = GPGPUContext;

},{"../../environment":35,"../../util":151,"./gpgpu_util":84,"./tex_util":98,"./webgl_util":103}],83:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../environment");
var util = require("../../util");
var shader_compiler = require("./shader_compiler");
var NAN_UNIFORM_NAME = 'NaN';
function shouldUploadNaNUniform() {
    return !environment_1.ENV.get('WEBGL_FLOAT_TEXTURE_ENABLED');
}
function compileProgram(gpgpu, program, inputs, output) {
    var userCode = program.userCode;
    var inputInfos = inputs.map(function (input, i) {
        var shapeInfo = {
            logicalShape: input.tensor.shape,
            texShape: input.texData.texShape
        };
        return { name: program.variableNames[i], shapeInfo: shapeInfo };
    });
    var inShapeInfos = inputInfos.map(function (x) { return x.shapeInfo; });
    var outShapeInfo = {
        logicalShape: output.tensor.shape,
        texShape: output.texData.texShape
    };
    var source = shader_compiler.makeShader(inputInfos, outShapeInfo, userCode, program.supportsBroadcasting === true);
    var webGLProgram = gpgpu.createProgram(source);
    var uniformLocations = {};
    for (var i = 0; i < program.variableNames.length; i++) {
        var uniformName = program.variableNames[i];
        uniformLocations[uniformName] =
            gpgpu.getUniformLocation(webGLProgram, uniformName);
    }
    if (shouldUploadNaNUniform()) {
        var throwIfNaNUniformIsNotUsed = false;
        uniformLocations[NAN_UNIFORM_NAME] = gpgpu.getUniformLocation(webGLProgram, NAN_UNIFORM_NAME, throwIfNaNUniformIsNotUsed);
    }
    return {
        program: program,
        source: source,
        webGLProgram: webGLProgram,
        uniformLocations: uniformLocations,
        gpgpu: gpgpu,
        inShapeInfos: inShapeInfos,
        outShapeInfo: outShapeInfo
    };
}
exports.compileProgram = compileProgram;
function validateBinaryAndProgram(shapeInfos, inputs) {
    if (shapeInfos.length !== inputs.length) {
        throw Error("Binary was compiled with " + shapeInfos.length + " inputs, but " +
            ("was executed with " + inputs.length + " inputs"));
    }
    shapeInfos.forEach(function (s, i) {
        var shapeA = s.logicalShape;
        var texShapeA = s.texShape;
        var shapeB = inputs[i].tensor.shape;
        var texShapeB = inputs[i].texData.texShape;
        if (!util.arraysEqual(shapeA, shapeB)) {
            throw Error("Binary was compiled with different shapes than " +
                ("the current args. Shapes " + shapeA + " and " + shapeB + " must match"));
        }
        if (!util.arraysEqual(texShapeA, texShapeB)) {
            throw Error("Binary was compiled with different texture shapes than the" +
                (" current args. Shape " + texShapeA + " and " + texShapeB + " must match"));
        }
    });
}
function runProgram(binary, inputs, output, customSetup) {
    validateBinaryAndProgram(binary.inShapeInfos, inputs);
    validateBinaryAndProgram([binary.outShapeInfo], [output]);
    var outTex = output.texData.texture;
    var outTexShape = output.texData.texShape;
    var gpgpu = binary.gpgpu;
    gpgpu.setOutputMatrixTexture(outTex, outTexShape[0], outTexShape[1]);
    gpgpu.setProgram(binary.webGLProgram);
    inputs.forEach(function (input, i) {
        var tex = input.texData.texture;
        var variableName = binary.program.variableNames[i];
        var variableUniformLocation = binary.uniformLocations[variableName];
        gpgpu.setInputMatrixTexture(tex, variableUniformLocation, i);
    });
    if (shouldUploadNaNUniform()) {
        gpgpu.gl.uniform1f(binary.uniformLocations[NAN_UNIFORM_NAME], NaN);
    }
    if (customSetup != null) {
        customSetup(gpgpu, binary.webGLProgram);
    }
    gpgpu.executeProgram();
}
exports.runProgram = runProgram;
function makeShaderKey(program, inputs, output) {
    var keyInputs = '';
    inputs.concat(output).forEach(function (x) {
        keyInputs += x.tensor.shape + "_" + x.texData.texShape;
    });
    var keyUserCode = program.userCode;
    var keyBroadcast = (program.supportsBroadcasting === true).toString();
    var key = program.constructor.name;
    key += '_' + keyBroadcast + '_' + keyInputs + '_' + keyUserCode;
    return key;
}
exports.makeShaderKey = makeShaderKey;

},{"../../environment":35,"../../util":151,"./shader_compiler":96}],84:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../environment");
var tex_util = require("./tex_util");
var webgl_util = require("./webgl_util");
function getWebGLContextAttributes() {
    return {
        alpha: false,
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        depth: false,
        stencil: false,
        failIfMajorPerformanceCaveat: true
    };
}
exports.getWebGLContextAttributes = getWebGLContextAttributes;
function createWebGLContext(canvas) {
    var attributes = getWebGLContextAttributes();
    var gl;
    if (canvas != null) {
        gl = webgl_util.createWebGLRenderingContextFromCanvas(canvas, attributes);
    }
    else {
        gl = webgl_util.createWebGLRenderingContext(attributes);
    }
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.DEPTH_TEST); });
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.STENCIL_TEST); });
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.BLEND); });
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.DITHER); });
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.POLYGON_OFFSET_FILL); });
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.SAMPLE_COVERAGE); });
    webgl_util.callAndCheck(gl, function () { return gl.enable(gl.SCISSOR_TEST); });
    webgl_util.callAndCheck(gl, function () { return gl.enable(gl.CULL_FACE); });
    webgl_util.callAndCheck(gl, function () { return gl.cullFace(gl.BACK); });
    return gl;
}
exports.createWebGLContext = createWebGLContext;
function createVertexShader(gl) {
    var vertexShaderSource = "\n    precision highp float;\n    attribute vec3 clipSpacePos;\n    attribute vec2 uv;\n    varying vec2 resultUV;\n\n    void main() {\n      gl_Position = vec4(clipSpacePos, 1);\n      resultUV = uv;\n    }";
    return webgl_util.createVertexShader(gl, vertexShaderSource);
}
exports.createVertexShader = createVertexShader;
function createVertexBuffer(gl) {
    var vertexArray = new Float32Array([-1, 1, 0, 0, 1, -1, -1, 0, 0, 0, 1, 1, 0, 1, 1, 1, -1, 0, 1, 0]);
    return webgl_util.createStaticVertexBuffer(gl, vertexArray);
}
exports.createVertexBuffer = createVertexBuffer;
function createIndexBuffer(gl) {
    var triangleVertexIndices = new Uint16Array([0, 1, 2, 2, 1, 3]);
    return webgl_util.createStaticIndexBuffer(gl, triangleVertexIndices);
}
exports.createIndexBuffer = createIndexBuffer;
function getTextureInternalFormat(gl, numChannels) {
    if (!environment_1.ENV.get('WEBGL_FLOAT_TEXTURE_ENABLED')) {
        return gl.RGBA;
    }
    if (environment_1.ENV.get('WEBGL_VERSION') === 2) {
        if (numChannels === 4) {
            return gl.RGBA32F;
        }
        return gl.R32F;
    }
    return gl.RGBA;
}
function getTextureFormat(gl, numChannels) {
    if (!environment_1.ENV.get('WEBGL_FLOAT_TEXTURE_ENABLED')) {
        return gl.RGBA;
    }
    if (environment_1.ENV.get('WEBGL_VERSION') === 2) {
        if (numChannels === 4) {
            return gl.RGBA;
        }
        return gl.RED;
    }
    return gl.RGBA;
}
function getTextureType(gl) {
    if (!environment_1.ENV.get('WEBGL_FLOAT_TEXTURE_ENABLED')) {
        return gl.UNSIGNED_BYTE;
    }
    return gl.FLOAT;
}
function createAndConfigureTexture(gl, width, height, numChannels) {
    webgl_util.validateTextureSize(gl, width, height);
    var texture = webgl_util.createTexture(gl);
    var tex2d = gl.TEXTURE_2D;
    var internalFormat = getTextureInternalFormat(gl, numChannels);
    var format = getTextureFormat(gl, numChannels);
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(tex2d, texture); });
    webgl_util.callAndCheck(gl, function () { return gl.texParameteri(tex2d, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); });
    webgl_util.callAndCheck(gl, function () { return gl.texParameteri(tex2d, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); });
    webgl_util.callAndCheck(gl, function () { return gl.texParameteri(tex2d, gl.TEXTURE_MIN_FILTER, gl.NEAREST); });
    webgl_util.callAndCheck(gl, function () { return gl.texParameteri(tex2d, gl.TEXTURE_MAG_FILTER, gl.NEAREST); });
    webgl_util.callAndCheck(gl, function () { return gl.texImage2D(tex2d, 0, internalFormat, width, height, 0, format, getTextureType(gl), null); });
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, null); });
    return texture;
}
function createMatrixTexture(gl, rows, columns) {
    var _a = tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
    var numChannels = 1;
    return createAndConfigureTexture(gl, width, height, numChannels);
}
exports.createMatrixTexture = createMatrixTexture;
function createColorMatrixTexture(gl, rows, columns) {
    var _a = tex_util.getColorMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
    var numChannels = 4;
    return createAndConfigureTexture(gl, width, height, numChannels);
}
exports.createColorMatrixTexture = createColorMatrixTexture;
function createPackedMatrixTexture(gl, rows, columns) {
    var _a = tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
    var numChannels = 4;
    return createAndConfigureTexture(gl, width, height, numChannels);
}
exports.createPackedMatrixTexture = createPackedMatrixTexture;
function bindVertexProgramAttributeStreams(gl, program, vertexBuffer) {
    var posOffset = 0;
    var uvOffset = 3 * 4;
    var stride = (3 * 4) + (2 * 4);
    webgl_util.callAndCheck(gl, function () { return gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); });
    webgl_util.bindVertexBufferToProgramAttribute(gl, program, 'clipSpacePos', vertexBuffer, 3, stride, posOffset);
    webgl_util.bindVertexBufferToProgramAttribute(gl, program, 'uv', vertexBuffer, 2, stride, uvOffset);
}
exports.bindVertexProgramAttributeStreams = bindVertexProgramAttributeStreams;
function uploadPixelDataToTexture(gl, texture, pixels) {
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, texture); });
    webgl_util.callAndCheck(gl, function () { return gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pixels); });
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, null); });
}
exports.uploadPixelDataToTexture = uploadPixelDataToTexture;
function uploadDataToTexture(gl, texture, width, height, data, numChannels) {
    var textureFormat = getTextureFormat(gl, numChannels);
    webgl_util.validateTextureSize(gl, width, height);
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, texture); });
    webgl_util.callAndCheck(gl, function () { return gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, textureFormat, getTextureType(gl), data); });
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, null); });
}
function uploadMatrixToTexture(gl, texture, rows, columns, matrix, numChannels) {
    var _a = tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
    var unpackedArray;
    if (environment_1.ENV.get('WEBGL_FLOAT_TEXTURE_ENABLED')) {
        var channelsPerTexture = numChannels === 1 ? webgl_util.getChannelsPerTexture() : numChannels;
        if (channelsPerTexture === 1) {
            unpackedArray = matrix;
        }
        else {
            unpackedArray =
                new Float32Array(tex_util.getUnpackedArraySizeFromMatrixSize(matrix.length, channelsPerTexture));
            tex_util.encodeMatrixToUnpackedArray(matrix, unpackedArray, channelsPerTexture);
        }
    }
    else {
        unpackedArray = tex_util.encodeFloatArray(matrix);
    }
    uploadDataToTexture(gl, texture, w, h, unpackedArray, numChannels);
}
exports.uploadMatrixToTexture = uploadMatrixToTexture;
function uploadMatrixToPackedTexture(gl, texture, rows, columns, matrix) {
    var _a = tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
    var packedRGBA = new Float32Array(tex_util.getPackedRGBAArraySizeFromMatrixShape(rows, columns));
    tex_util.encodeMatrixToPackedRGBA(matrix, rows, columns, packedRGBA);
    var numChannels = 4;
    uploadDataToTexture(gl, texture, w, h, packedRGBA, numChannels);
}
exports.uploadMatrixToPackedTexture = uploadMatrixToPackedTexture;
function getDownloadTargetArrayBuffer(rows, columns, channelsPerTexture) {
    var isFloatTexture = environment_1.ENV.get('WEBGL_FLOAT_TEXTURE_ENABLED');
    var downloadTarget;
    if (isFloatTexture) {
        downloadTarget =
            new Float32Array(tex_util.getUnpackedArraySizeFromMatrixSize(rows * columns, channelsPerTexture));
    }
    else {
        downloadTarget = new Uint8Array(rows * columns * channelsPerTexture);
    }
    return downloadTarget;
}
function decodeDownloadTargetArrayBuffer(downloadTarget, rows, columns, channelsPerPixel) {
    var isFloatTexture = environment_1.ENV.get('WEBGL_FLOAT_TEXTURE_ENABLED');
    if (isFloatTexture) {
        var matrix = new Float32Array(rows * columns);
        tex_util.decodeMatrixFromUnpackedArray(downloadTarget, matrix, channelsPerPixel);
        return matrix;
    }
    else {
        return tex_util.decodeToFloatArray(downloadTarget);
    }
}
function downloadMatrixFromOutputTextureAsync(gl, getBufferSubDataAsyncExtension, rows, columns) {
    return __awaiter(this, void 0, void 0, function () {
        var gl2, channelsPerPixel, downloadTarget, bufferSizeBytes, buffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gl2 = gl;
                    channelsPerPixel = 4;
                    downloadTarget = getDownloadTargetArrayBuffer(rows, columns, channelsPerPixel);
                    bufferSizeBytes = downloadTarget instanceof Float32Array ?
                        downloadTarget.length * 4 :
                        downloadTarget;
                    buffer = gl.createBuffer();
                    webgl_util.callAndCheck(gl, function () { return gl.bindBuffer(gl2.PIXEL_PACK_BUFFER, buffer); });
                    webgl_util.callAndCheck(gl, function () { return gl.bufferData(gl2.PIXEL_PACK_BUFFER, bufferSizeBytes, gl.STATIC_DRAW); });
                    webgl_util.callAndCheck(gl, function () {
                        return gl2.readPixels(0, 0, columns, rows, gl.RGBA, getTextureType(gl), 0);
                    });
                    return [4, getBufferSubDataAsyncExtension.getBufferSubDataAsync(gl2.PIXEL_PACK_BUFFER, 0, downloadTarget)];
                case 1:
                    _a.sent();
                    return [2, decodeDownloadTargetArrayBuffer(downloadTarget, rows, columns, channelsPerPixel)];
            }
        });
    });
}
exports.downloadMatrixFromOutputTextureAsync = downloadMatrixFromOutputTextureAsync;
function downloadMatrixFromOutputTexture(gl, rows, columns) {
    var _a = tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
    var channelsPerPixel = 4;
    var downloadTarget = getDownloadTargetArrayBuffer(rows, columns, channelsPerPixel);
    webgl_util.callAndCheck(gl, function () { return gl.readPixels(0, 0, w, h, gl.RGBA, getTextureType(gl), downloadTarget); });
    return decodeDownloadTargetArrayBuffer(downloadTarget, rows, columns, channelsPerPixel);
}
exports.downloadMatrixFromOutputTexture = downloadMatrixFromOutputTexture;
function downloadMatrixFromRGBAColorTexture(gl, rows, columns, channels) {
    var size = rows * columns * 4;
    var downloadTarget = new Uint8Array(size);
    webgl_util.callAndCheck(gl, function () { return gl.readPixels(0, 0, columns, rows, gl.RGBA, gl.UNSIGNED_BYTE, downloadTarget); });
    var packedRGBA = new Float32Array(size);
    for (var i = 0; i < downloadTarget.length; i++) {
        packedRGBA[i] = downloadTarget[i];
    }
    var matrix = new Float32Array(rows * columns * channels);
    tex_util.decodeMatrixFromUnpackedColorRGBAArray(packedRGBA, matrix, channels);
    return matrix;
}
exports.downloadMatrixFromRGBAColorTexture = downloadMatrixFromRGBAColorTexture;
function downloadMatrixFromPackedOutputTexture(gl, rows, columns) {
    var _a = tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
    var packedRGBA = new Float32Array(tex_util.getPackedRGBAArraySizeFromMatrixShape(rows, columns));
    webgl_util.callAndCheck(gl, function () { return gl.readPixels(0, 0, w, h, gl.RGBA, getTextureType(gl), packedRGBA); });
    var matrix = new Float32Array(rows * columns);
    return tex_util.decodeMatrixFromPackedRGBA(packedRGBA, rows, columns, matrix);
}
exports.downloadMatrixFromPackedOutputTexture = downloadMatrixFromPackedOutputTexture;

},{"../../environment":35,"./tex_util":98,"./webgl_util":103}],85:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_compiler_1 = require("./shader_compiler");
var WhereProgram = (function () {
    function WhereProgram(cRank, shape, rank) {
        this.variableNames = ['c', 'a', 'b'];
        this.outputShape = shape;
        var cCoords;
        var abCoords;
        if (rank > 4) {
            throw Error("Where for rank " + rank + " is not yet supported");
        }
        if (rank === 1) {
            abCoords = "resRC";
            cCoords = "resRC";
        }
        else {
            var currentCoords = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w'];
            var cCoordVars = [];
            var abCoordVars = [];
            for (var i = 0; i < shape.length; i++) {
                abCoordVars.push("" + currentCoords[i]);
                if (i < cRank) {
                    cCoordVars.push("" + currentCoords[i]);
                }
            }
            cCoords = cCoordVars.join();
            abCoords = abCoordVars.join();
        }
        var dtype = shader_compiler_1.getCoordsDataType(rank);
        this.userCode = "\n      void main() {\n        " + dtype + " resRC = getOutputCoords();\n        float cVal = getC(" + cCoords + ");\n        if (cVal >= 1.0) {\n          setOutput(getA(" + abCoords + "));\n        } else {\n          setOutput(getB(" + abCoords + "));\n        }\n      }\n    ";
    }
    return WhereProgram;
}());
exports.WhereProgram = WhereProgram;

},{"./shader_compiler":96}],86:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LRNProgram = (function () {
    function LRNProgram(xShape, radius, bias, alpha, beta, normRegion) {
        this.variableNames = ['x'];
        this.outputShape = [];
        var rad = radius;
        var maxW = xShape[1] - 1;
        var maxH = xShape[2] - 1;
        var maxD = xShape[3] - 1;
        this.outputShape = xShape;
        var powOperator;
        var basis = "float(" + bias + ") + float(" + alpha + ") * sum";
        if (beta === 0.5) {
            powOperator = "inversesqrt(" + basis + ")";
        }
        else if (beta === 1.0) {
            powOperator = "1.0/(" + basis + ")";
        }
        else {
            powOperator = "exp(log(" + basis + ") * float(-" + beta + "));";
        }
        if (normRegion === 'withinChannel') {
            this.userCode = "\n        void main() {\n          ivec4 coords = getOutputCoords();\n          int b = coords[0];\n          int r = coords[1];\n          int c = coords[2];\n          int d = coords[3];\n          float x = getX(b, r, c, d);\n          float sum = 0.0;\n          for (int u = -" + rad + "; u <= " + rad + "; u++) {\n            for (int v = -" + rad + "; v <= " + rad + "; v++) {\n              int idx = r + u;\n              int idy = c + v;\n              if (idx >= 0 && idx <= " + maxW + " && idy >= 0 && idy <= " + maxH + ") {\n                float z = getX(b, idx, idy, d);\n                sum += z * z;\n              }\n            }\n          }\n          float val = x * " + powOperator + ";\n          setOutput(val);\n        }\n      ";
        }
        else {
            this.userCode = "\n        void main() {\n          ivec4 coords = getOutputCoords();\n          int b = coords[0];\n          int r = coords[1];\n          int c = coords[2];\n          int d = coords[3];\n          float x = getX(b, r, c, d);\n          float sum = 0.0;\n          for (int j = -" + rad + "; j <= " + rad + "; j++) {\n            int idx = d + j;\n            if (idx >= 0 && idx <=  " + maxD + ") {\n              float z = getX(b, r, c, idx);\n              sum += z * z;\n            }\n          }\n          float val = x * " + powOperator + ";\n          setOutput(val);\n        }\n      ";
        }
    }
    return LRNProgram;
}());
exports.LRNProgram = LRNProgram;

},{}],87:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MaxPool2DBackpropProgram = (function () {
    function MaxPool2DBackpropProgram(convInfo) {
        this.variableNames = ['dy', 'maxPos'];
        this.outputShape = convInfo.inShape;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var padTop = filterHeight - 1 - convInfo.padInfo.top;
        var padLeft = filterWidth - 1 - convInfo.padInfo.left;
        var lastIndex = filterHeight * filterWidth - 1;
        this.userCode = "\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n\n        ivec2 dyRCCorner = coords.yz - pads;\n        int dyRCorner = dyRCCorner.x;\n        int dyCCorner = dyRCCorner.y;\n\n        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + filterHeight + "; wR++) {\n          float dyR = float(dyRCorner + wR) / " + strideHeight + ".0;\n\n          if (dyR < 0.0 || dyR >= " + convInfo.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          for (int wC = 0; wC < " + filterWidth + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + strideWidth + ".0;\n\n            if (dyC < 0.0 || dyC >= " + convInfo.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            float dyValue = getDy(b, idyR, idyC, d);\n            int maxPosValue = " + lastIndex + " - int(getMaxPos(b, idyR, idyC, d));\n\n            // Get the current value, check it against the value from the\n            // position matrix.\n            int curPosValue = wR * " + filterWidth + " + wC;\n            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);\n\n            dotProd += dyValue * mask;\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
    }
    return MaxPool2DBackpropProgram;
}());
exports.MaxPool2DBackpropProgram = MaxPool2DBackpropProgram;

},{}],88:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MatMulProgram = (function () {
    function MatMulProgram(aShape, bShape, transposeA, transposeB) {
        if (transposeA === void 0) { transposeA = false; }
        if (transposeB === void 0) { transposeB = false; }
        this.variableNames = ['matrixA', 'matrixB'];
        var outerShapeA = transposeA ? aShape[1] : aShape[0];
        var outerShapeB = transposeB ? bShape[0] : bShape[1];
        var sharedDim = transposeA ? aShape[0] : aShape[1];
        this.outputShape = [outerShapeA, outerShapeB];
        var aSnippetFromOffset = function (vec4Offset, indexVar) {
            return transposeA ? indexVar + " + " + vec4Offset + ", aRow" :
                "aRow, " + indexVar + " + " + vec4Offset;
        };
        var bSnippetFromOffset = function (vec4Offset, indexVar) {
            return transposeB ? "bCol, " + indexVar + " + " + vec4Offset :
                indexVar + " + " + vec4Offset + ", bCol";
        };
        var sharedDimNearestVec4 = Math.floor(sharedDim / 4) * 4;
        var sharedDimVec4Remainder = sharedDim % 4;
        this.userCode = " float dotARowBCol(int aRow, int bCol) {\n      float result = 0.0;\n      for (int i = 0; i < " + sharedDimNearestVec4 + "; i += 4) {\n        vec4 a = vec4(\n          getMatrixA(" + aSnippetFromOffset(0, 'i') + "),\n          getMatrixA(" + aSnippetFromOffset(1, 'i') + "),\n          getMatrixA(" + aSnippetFromOffset(2, 'i') + "),\n          getMatrixA(" + aSnippetFromOffset(3, 'i') + ")\n        );\n        vec4 b = vec4(\n          getMatrixB(" + bSnippetFromOffset(0, 'i') + "),\n          getMatrixB(" + bSnippetFromOffset(1, 'i') + "),\n          getMatrixB(" + bSnippetFromOffset(2, 'i') + "),\n          getMatrixB(" + bSnippetFromOffset(3, 'i') + ")\n        );\n\n        result += dot(a, b);\n      }\n\n      if (" + (sharedDimVec4Remainder === 1) + ") {\n        result += getMatrixA(" + aSnippetFromOffset(0, sharedDimNearestVec4) + ") *\n          getMatrixB(" + bSnippetFromOffset(0, sharedDimNearestVec4) + ");\n      } else if (" + (sharedDimVec4Remainder === 2) + ") {\n        vec2 a = vec2(\n          getMatrixA(" + aSnippetFromOffset(0, sharedDimNearestVec4) + "),\n          getMatrixA(" + aSnippetFromOffset(1, sharedDimNearestVec4) + ")\n        );\n        vec2 b = vec2(\n          getMatrixB(" + bSnippetFromOffset(0, sharedDimNearestVec4) + "),\n          getMatrixB(" + bSnippetFromOffset(1, sharedDimNearestVec4) + ")\n        );\n        result += dot(a, b);\n      } else if (" + (sharedDimVec4Remainder === 3) + ") {\n        vec3 a = vec3(\n          getMatrixA(" + aSnippetFromOffset(0, sharedDimNearestVec4) + "),\n          getMatrixA(" + aSnippetFromOffset(1, sharedDimNearestVec4) + "),\n          getMatrixA(" + aSnippetFromOffset(2, sharedDimNearestVec4) + ")\n        );\n        vec3 b = vec3(\n          getMatrixB(" + bSnippetFromOffset(0, sharedDimNearestVec4) + "),\n          getMatrixB(" + bSnippetFromOffset(1, sharedDimNearestVec4) + "),\n          getMatrixB(" + bSnippetFromOffset(2, sharedDimNearestVec4) + ")\n        );\n        result += dot(a, b);\n      }\n\n      return result;\n    }\n\n    void main() {\n      ivec2 resRC = getOutputCoords();\n      setOutput(dotARowBCol(resRC.x, resRC.y));\n    }\n    ";
    }
    return MatMulProgram;
}());
exports.MatMulProgram = MatMulProgram;

},{}],89:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MultinomialProgram = (function () {
    function MultinomialProgram(batchSize, numOutcomes, numSamples) {
        this.variableNames = ['probs'];
        this.outputShape = [batchSize, numSamples];
        this.userCode = "\n      uniform float seed;\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n\n        float r = random(seed);\n        float cdf = 0.0;\n\n        for (int i = 0; i < " + (numOutcomes - 1) + "; i++) {\n          cdf += getProbs(batch, i);\n\n          if (r < cdf) {\n            setOutput(float(i));\n            return;\n          }\n        }\n\n        // If no other event happened, last event happened.\n        setOutput(float(" + (numOutcomes - 1) + "));\n      }\n    ";
    }
    MultinomialProgram.prototype.getCustomSetupFunc = function (seed) {
        var _this = this;
        return function (gpgpu, webGLProgram) {
            if (_this.seedLoc == null) {
                _this.seedLoc = gpgpu.getUniformLocation(webGLProgram, 'seed');
            }
            gpgpu.gl.uniform1f(_this.seedLoc, seed);
        };
    };
    return MultinomialProgram;
}());
exports.MultinomialProgram = MultinomialProgram;

},{}],90:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OneHotProgram = (function () {
    function OneHotProgram(numIndices, depth, onValue, offValue) {
        this.variableNames = ['indices'];
        this.outputShape = [numIndices, depth];
        this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int index = round(getIndices(coords.x));\n        setOutput(mix(float(" + offValue + "), float(" + onValue + "),\n                      float(index == coords.y)));\n      }\n    ";
    }
    return OneHotProgram;
}());
exports.OneHotProgram = OneHotProgram;

},{}],91:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_compiler_1 = require("./shader_compiler");
var PadProgram = (function () {
    function PadProgram(xShape, paddings, constantValue) {
        this.variableNames = ['x'];
        this.outputShape = paddings.map(function (p, i) { return p[0] + xShape[i] + p[1]; });
        var rank = xShape.length;
        var type = shader_compiler_1.getCoordsDataType(rank);
        var start = paddings.map(function (p) { return p[0]; }).join(',');
        var end = paddings.map(function (p, i) { return p[0] + xShape[i]; }).join(',');
        var unpackedCoords = ['coords[0]', 'coords[1]', 'coords[2]', 'coords[3]'].slice(0, rank);
        if (rank === 1) {
            this.userCode = "\n        int start = " + start + ";\n        int end = " + end + ";\n\n        void main() {\n          int outC = getOutputCoords();\n          if (outC < start || outC >= end) {\n            setOutput(float(" + constantValue + "));\n          } else {\n            setOutput(getX(outC - start));\n          }\n        }\n      ";
            return;
        }
        this.userCode = "\n      " + type + " start = " + type + "(" + start + ");\n      " + type + " end = " + type + "(" + end + ");\n\n      void main() {\n        " + type + " outC = getOutputCoords();\n        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {\n          setOutput(float(" + constantValue + "));\n        } else {\n          " + type + " coords = outC - start;\n          setOutput(getX(" + unpackedCoords + "));\n        }\n      }\n    ";
    }
    return PadProgram;
}());
exports.PadProgram = PadProgram;

},{"./shader_compiler":96}],92:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pool2DProgram = (function () {
    function Pool2DProgram(convInfo, poolType, computePositions) {
        this.variableNames = ['x'];
        if (poolType === 'avg' && computePositions) {
            throw new Error('Cannot compute positions for average pool.');
        }
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        this.outputShape = convInfo.outShape;
        var isAvgPool = poolType === 'avg';
        var initializationValue = '0.0';
        if (!isAvgPool) {
            if (poolType === 'min') {
                initializationValue = '1.0 / 0.0';
            }
            else {
                initializationValue = '-1.0 / 0.0';
            }
        }
        if (computePositions) {
            var compareOp_1 = poolType === 'min' ? '<=' : '>=';
            this.userCode = "\n        const ivec2 strides = ivec2(" + strideHeight + ", " + strideWidth + ");\n        const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n\n        void main() {\n          ivec4 coords = getOutputCoords();\n          int batch = coords[0];\n          int d = coords[3];\n\n          ivec2 xRCCorner = coords.yz * strides - pads;\n          int xRCorner = xRCCorner.x;\n          int xCCorner = xRCCorner.y;\n\n          // max/min x(?, ?, d) to get y(yR, yC, d).\n          // ? = to be determined\n          float minMaxValue = 0.0;\n          float minMaxValueFound = 0.0;\n          int minMaxPosition = 0;\n          float avgValue = 0.0;\n\n          for (int wR = 0; wR < " + filterHeight + "; wR++) {\n            int xR = xRCorner + wR;\n\n            if (xR < 0 || xR >= " + convInfo.inHeight + ") {\n              continue;\n            }\n\n            for (int wC = 0; wC < " + filterWidth + "; wC++) {\n              int xC = xCCorner + wC;\n\n              if (xC < 0 || xC >= " + convInfo.inWidth + ") {\n                continue;\n              }\n\n              float value = getX(batch, xR, xC, d);\n\n              if (isNaN(value)) {\n                setOutput(value);\n                return;\n              }\n\n              // If a min / max value has already been found, use it. If not,\n              // use the current value.\n              float currMinMaxValue = mix(\n                  value, minMaxValue, minMaxValueFound);\n              if (value " + compareOp_1 + " currMinMaxValue) {\n                minMaxValue = value;\n                minMaxValueFound = 1.0;\n                minMaxPosition = wR * " + filterWidth + " + wC;\n              }\n            }\n          }\n          setOutput(float(minMaxPosition));\n        }\n      ";
            return;
        }
        var compareOp = poolType === 'min' ? 'min' : 'max';
        var returnValue = poolType + "(" + poolType + "(" + poolType + "(" +
            'minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])';
        if (poolType === 'avg') {
            returnValue = "avgValue / " + filterHeight * filterWidth + ".0";
        }
        var filterWidthNearestVec4 = Math.floor(filterWidth / 4) * 4;
        var filterWidthVec4Remainder = filterWidth % 4;
        var updateSnippet = "\n      if (hasNaN(values)) {\n        setOutput(getNaN(values));\n        return;\n      }\n      if (" + isAvgPool + ") {\n        avgValue += dot(values, ones);\n      } else {\n        minMaxValue = " + compareOp + "(values, minMaxValue);\n      }\n    ";
        this.userCode = "\n      const ivec2 strides = ivec2(" + strideHeight + ", " + strideWidth + ");\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n      const float initializationValue = " + initializationValue + ";\n      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);\n\n      float getValue(int batch, int xR, int xC, int d) {\n        if (xC < 0 || xC >= " + convInfo.inWidth + ") {\n          return initializationValue;\n        }\n        return getX(batch, xR, xC, d);\n      }\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d = coords[3];\n\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // max/min x(?, ?, d) to get y(yR, yC, d).\n        // ? = to be determined\n        vec4 minMaxValue = vec4(" + initializationValue + ");\n        float avgValue = 0.0;\n\n        for (int wR = 0; wR < " + filterHeight + "; wR++) {\n          int xR = xRCorner + wR;\n\n          if (xR < 0 || xR >= " + convInfo.inHeight + ") {\n            continue;\n          }\n\n          for (int wC = 0; wC < " + filterWidthNearestVec4 + "; wC += 4) {\n            int xC = xCCorner + wC;\n\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + 1, d),\n              getValue(batch, xR, xC + 2, d),\n              getValue(batch, xR, xC + 3, d)\n            );\n\n            " + updateSnippet + "\n          }\n\n          int xC = xCCorner + " + filterWidthNearestVec4 + ";\n          if (" + (filterWidthVec4Remainder === 1) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              initializationValue,\n              initializationValue,\n              initializationValue\n            );\n            " + updateSnippet + "\n          } else if (" + (filterWidthVec4Remainder === 2) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + 1, d),\n              initializationValue,\n              initializationValue\n            );\n\n            " + updateSnippet + "\n          } else if (" + (filterWidthVec4Remainder === 3) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + 1, d),\n              getValue(batch, xR, xC + 2, d),\n              initializationValue\n            );\n\n            " + updateSnippet + "\n          }\n        }\n        setOutput(" + returnValue + ");\n      }\n    ";
    }
    return Pool2DProgram;
}());
exports.Pool2DProgram = Pool2DProgram;

},{}],93:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReduceProgram = (function () {
    function ReduceProgram(reduceInfo, reduceType) {
        this.variableNames = ['x'];
        var windowSize = reduceInfo.windowSize;
        var batchSize = reduceInfo.batchSize;
        var inSize = reduceInfo.inSize;
        var outSize = Math.ceil(inSize / windowSize);
        this.outputShape = [batchSize, outSize];
        var isReduceSum = reduceType === 'sum';
        var initializationValue = '0.0';
        if (!isReduceSum) {
            if (reduceType === 'min') {
                initializationValue = '1.0 / 0.0';
            }
            else {
                initializationValue = '-1.0 / 0.0';
            }
        }
        var compareOp = reduceType === 'min' ? 'min' : 'max';
        var returnValue = reduceType + "(" + reduceType + "(" + reduceType + "(" +
            'minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])';
        if (reduceType === 'sum') {
            returnValue = "sumValue";
        }
        var windowSizeNearestVec4 = Math.floor(windowSize / 4) * 4;
        var windowSizeVec4Remainder = windowSize % 4;
        var updateSnippet = "\n      if (" + isReduceSum + ") {\n        sumValue += dot(values, ones);\n      } else {\n        if (hasNaN(values)) {\n          setOutput(getNaN(values));\n          return;\n        }\n        minMaxValue = " + compareOp + "(values, minMaxValue);\n      }\n    ";
        var checkOutOfBounds = '';
        if (inSize % windowSize > 0) {
            checkOutOfBounds = "\n        if (inIdx < 0 || inIdx >= " + inSize + ") {\n          return initializationValue;\n        }\n      ";
        }
        this.userCode = "\n      const float initializationValue = " + initializationValue + ";\n      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);\n\n      float getValue(int batch, int inIdx) {\n        " + checkOutOfBounds + "\n        return getX(batch, inIdx);\n      }\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n        int outIdx = coords[1];\n        int inOffset = outIdx * " + windowSize + ";\n\n        vec4 minMaxValue = vec4(" + initializationValue + ");\n        float sumValue = 0.0;\n\n        for (int i = 0; i < " + windowSizeNearestVec4 + "; i += 4) {\n          int inIdx = inOffset + i;\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            getValue(batch, inIdx + 3)\n          );\n\n          " + updateSnippet + "\n        }\n\n        int inIdx = inOffset + " + windowSizeNearestVec4 + ";\n        if (" + (windowSizeVec4Remainder === 1) + ") {\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            initializationValue,\n            initializationValue,\n            initializationValue\n          );\n          " + updateSnippet + "\n        } else if (" + (windowSizeVec4Remainder === 2) + ") {\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            initializationValue,\n            initializationValue\n          );\n          " + updateSnippet + "\n        } else if (" + (windowSizeVec4Remainder === 3) + ") {\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            initializationValue\n          );\n          " + updateSnippet + "\n        }\n        setOutput(" + returnValue + ");\n      }\n    ";
    }
    return ReduceProgram;
}());
exports.ReduceProgram = ReduceProgram;

},{}],94:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResizeBilinearProgram = (function () {
    function ResizeBilinearProgram(inputShape, newHeight, newWidth, alignCorners) {
        this.variableNames = ['A'];
        this.outputShape = [];
        var batch = inputShape[0], oldHeight = inputShape[1], oldWidth = inputShape[2], depth = inputShape[3];
        this.outputShape = [batch, newHeight, newWidth, depth];
        var effectiveInSize = alignCorners ? [oldHeight - 1, oldWidth - 1] : [oldHeight, oldWidth];
        var effectiveOutSize = alignCorners ? [newHeight - 1, newWidth - 1] : [newHeight, newWidth];
        this.userCode = "\n      const vec2 effectiveInputOverOutputRatioRC = vec2(\n          " + effectiveInSize[0] / effectiveOutSize[0] + ",\n          " + effectiveInSize[1] / effectiveOutSize[1] + ");\n      const vec2 inputShapeRC = vec2(" + oldHeight + ".0, " + oldWidth + ".0);\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        ivec2 yRC = coords.yz;\n\n        // Fractional source index.\n        vec2 sourceFracIndexRC = vec2(yRC) * effectiveInputOverOutputRatioRC;\n\n        // Compute the four integer indices.\n        ivec2 sourceFloorRC = ivec2(sourceFracIndexRC);\n        ivec2 sourceCeilRC = ivec2(\n          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));\n\n        float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);\n        float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);\n        float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);\n        float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);\n\n        vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);\n\n        float top = topLeft + (topRight - topLeft) * fracRC.y;\n        float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;\n        float newValue = top + (bottom - top) * fracRC.x;\n\n        setOutput(newValue);\n      }\n    ";
    }
    return ResizeBilinearProgram;
}());
exports.ResizeBilinearProgram = ResizeBilinearProgram;

},{}],95:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_compiler_1 = require("./shader_compiler");
var ReverseProgram = (function () {
    function ReverseProgram(xShape, axis) {
        this.variableNames = ['x'];
        var rank = xShape.length;
        if (rank > 4) {
            throw new Error("WebGL backend: Reverse of rank-" + rank + " tensor is not yet supported");
        }
        this.outputShape = xShape;
        if (rank === 1) {
            this.userCode = "\n        void main() {\n          int coord = getOutputCoords();\n          setOutput(getX(" + xShape[0] + " - coord - 1));\n        }\n      ";
            return;
        }
        var getInCoord = function (i) {
            if (axis.indexOf(i) !== -1 && xShape[i] !== 1) {
                return xShape[i] + " - coords[" + i + "] - 1";
            }
            return "coords[" + i + "]";
        };
        var inCoords = xShape.map(function (_, i) { return getInCoord(i); }).join(',');
        var type = shader_compiler_1.getCoordsDataType(rank);
        this.userCode = "\n      void main() {\n        " + type + " coords = getOutputCoords();\n        setOutput(getX(" + inCoords + "));\n      }\n    ";
    }
    return ReverseProgram;
}());
exports.ReverseProgram = ReverseProgram;

},{"./shader_compiler":96}],96:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../environment");
var util = require("../../util");
var broadcast_util = require("../../ops/broadcast_util");
var tex_util = require("./tex_util");
function makeShader(inputsInfo, outputShape, userCode, broadcast) {
    var sampleSnippet = getSampleSnippet();
    var setOutputSnippet = getSetOutputSnippet();
    var inputPrefixSnippet = inputsInfo.map(function (x) { return "uniform sampler2D " + x.name + ";"; }).join('\n');
    var inputSamplingSnippet = inputsInfo.map(function (x) { return getInputSamplingSnippet(x, outputShape, broadcast); })
        .join('\n');
    var outTexShape = outputShape.texShape;
    var outputSamplingSnippet = getOutputSamplingSnippet(outputShape.logicalShape, outTexShape);
    var source = [
        SHADER_PREFIX, sampleSnippet, setOutputSnippet, inputPrefixSnippet,
        outputSamplingSnippet, inputSamplingSnippet, userCode
    ].join('\n');
    return source;
}
exports.makeShader = makeShader;
function getSampleSnippet() {
    return environment_1.ENV.get('WEBGL_FLOAT_TEXTURE_ENABLED') ?
        FLOAT_TEXTURE_SAMPLE_SNIPPET :
        UNSIGNED_BYTE_TEXTURE_SAMPLE_SNIPPET;
}
function getSetOutputSnippet() {
    return environment_1.ENV.get('WEBGL_FLOAT_TEXTURE_ENABLED') ?
        FLOAT_TEXTURE_SETOUTPUT_SNIPPET :
        UNSIGNED_BYTE_TEXTURE_SETOUTPUT_SNIPPET;
}
function getSamplerFromInInfo(inInfo) {
    var shape = inInfo.shapeInfo.logicalShape;
    switch (shape.length) {
        case 0:
            return getSamplerScalar(inInfo);
        case 1:
            return getSampler1D(inInfo);
        case 2:
            return getSampler2D(inInfo);
        case 3:
            return getSampler3D(inInfo);
        case 4:
            return getSampler4D(inInfo);
        default:
            throw new Error(shape.length + "-D input sampling" +
                " is not yet supported");
    }
}
function getInputSamplingSnippet(inInfo, outShapeInfo, broadcast) {
    var res = getSamplerFlat(inInfo);
    res += getSamplerFromInInfo(inInfo);
    if (broadcast ||
        util.arraysEqual(inInfo.shapeInfo.logicalShape, outShapeInfo.logicalShape)) {
        res += getSamplerAtOutputCoords(inInfo, outShapeInfo, broadcast);
    }
    return res;
}
function getOutputSamplingSnippet(outShape, outTexShape) {
    switch (outShape.length) {
        case 0:
            return getOutputScalarCoords();
        case 1:
            return getOutput1DCoords(outShape, outTexShape);
        case 2:
            return getOutput2DCoords(outShape, outTexShape);
        case 3:
            return getOutput3DCoords(outShape, outTexShape);
        case 4:
            return getOutput4DCoords(outShape, outTexShape);
        default:
            throw new Error(outShape.length + "-D output sampling is not yet supported");
    }
}
var SAMPLE_1D_SNIPPET = "\nvec2 UVfrom1D(int texNumR, int texNumC, int index) {\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n";
var SAMPLE_2D_SNIPPET = "\nvec2 UVfrom2D(int texNumR, int texNumC, int numC, int row, int col) {\n  int index = row * numC + col;\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n";
var SAMPLE_3D_SNIPPET = "\nvec2 UVfrom3D(int texNumR, int texNumC, int stride0,\n    int stride1, int row, int col, int depth) {\n  // Explicitly use integer operations as dot() only works on floats.\n  int index = row * stride0 + col * stride1 + depth;\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n";
var SAMPLE_4D_SNIPPET = "\nvec2 UVfrom4D(int texNumR, int texNumC, int stride0,\n    int stride1, int stride2, int row, int col, int depth,\n    int depth2) {\n  // Explicitly use integer operations as dot() only works on floats.\n  int index = row * stride0 + col * stride1 + depth * stride2 + depth2;\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n";
var UNSIGNED_BYTE_TEXTURE_SAMPLE_SNIPPET = "\n  uniform float NaN;\n\n  const vec4 floatDeltas = vec4(\n      1.0,\n      1.0 / 255.0,\n      1.0 / (255.0 * 255.0),\n      1.0 / (255.0 * 255.0 * 255.0)\n  );\n  const float minValue = " + tex_util.FLOAT_MIN + ".0;\n  const float maxValue = " + tex_util.FLOAT_MAX + ".0;\n  const float range = (maxValue - minValue) / 255.0;\n  const vec2 dotRange = vec2(1.0, range);\n\n  float sample(sampler2D texture, vec2 uv) {\n    vec4 sampleValue = texture2D(texture, uv);\n    if (all(equal(sampleValue, vec4(" + tex_util.BYTE_NAN_VALUE + ")))) {\n      return NaN;\n    }\n\n    vec4 encValue = floor(sampleValue * 255.0 + 0.5);\n    float decodedValue = dot(encValue, floatDeltas);\n    return dot(vec2(minValue, decodedValue), dotRange);\n  }\n";
var UNSIGNED_BYTE_TEXTURE_SETOUTPUT_SNIPPET = "\n  const vec4 floatPowers = vec4(\n    1.0,\n    255.0,\n    255.0 * 255.0,\n    255.0 * 255.0 * 255.0\n  );\n  const vec2 recipRange = vec2(1.0/range);\n  const vec2 recipRange255 = vec2(1.0/(maxValue - minValue));\n\n  void setOutput(float decodedValue) {\n    if (isNaN(decodedValue)) {\n      gl_FragColor = vec4(" + tex_util.BYTE_NAN_VALUE + ");\n      return;\n    }\n\n    float a = dot(vec2(decodedValue, -minValue), recipRange);\n    float b = fract(a) * 255.0;\n    float c = fract(b) * 255.0;\n    float d = fract(c) * 255.0;\n    gl_FragColor = floor(vec4(a, b, c, d)) / 255.0;\n\n    // TODO(dsmilkov): Version above gets better accuracy but probably slower\n    // than the version below. Benchmark to determine if the accuracy is worth\n    // the cost.\n\n    // float normValue = dot(vec2(decodedValue, -minValue), recipRange255);\n    // vec4 f = normValue * floatPowers;\n    // gl_FragColor = floor(fract(f) * 255.0) / 255.0;\n  }\n";
var FLOAT_TEXTURE_SAMPLE_SNIPPET = "\n  float sample(sampler2D texture, vec2 uv) {\n    return texture2D(texture, uv).r;\n  }\n";
var FLOAT_TEXTURE_SETOUTPUT_SNIPPET = "\n  void setOutput(float val) {\n    gl_FragColor = vec4(val, 0, 0, 0);\n  }\n";
var SHADER_PREFIX = "\n  precision highp float;\n  precision highp int;\n  varying vec2 resultUV;\n  const vec2 halfCR = vec2(0.5, 0.5);\n\n  bool isNaN(float val) {\n    float v1 = val * val;\n    float v2 = val * val;\n    return v1 == v2 ? false : true;\n  }\n\n  bool hasNaN(vec4 values) {\n    vec4 v1 = values * values;\n    vec4 v2 = values * values;\n    return any(notEqual(v1, v2));\n  }\n\n  float getNaN(vec4 values) {\n    return dot(vec4(1), values);\n  }\n\n  int round(float value) {\n    return int(floor(value + 0.5));\n  }\n\n  int imod(int x, int y) {\n    return x - y * (x / y);\n  }\n\n  const vec2 randomConst = vec2(\n    23.14069263277926, // e^pi (Gelfond's constant)\n     2.665144142690225 // 2^sqrt(2) (Gelfond\u2013Schneider constant)\n  );\n\n  float random(float seed) {\n      return fract(cos(dot(resultUV * seed, randomConst)) * 12345.6789);\n  }\n\n  " + SAMPLE_1D_SNIPPET + "\n  " + SAMPLE_2D_SNIPPET + "\n  " + SAMPLE_3D_SNIPPET + "\n  " + SAMPLE_4D_SNIPPET + "\n";
function getOutputScalarCoords() {
    return "\n    int getOutputCoords() {\n      return 0;\n    }\n  ";
}
function getOutput1DCoords(shape, texShape) {
    if (texShape[0] === 1) {
        return "\n      int getOutputCoords() {\n        return int(resultUV.x * " + texShape[1] + ".0);\n      }\n    ";
    }
    if (texShape[1] === 1) {
        return "\n      int getOutputCoords() {\n        return int(resultUV.y * " + texShape[0] + ".0);\n      }\n    ";
    }
    return "\n    int getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + texShape[0] + ", " + texShape[1] + "));\n      return resTexRC.x * " + texShape[1] + " + resTexRC.y;\n    }\n  ";
}
function getOutput3DCoords(shape, texShape) {
    var stride0 = shape[1] * shape[2];
    var stride1 = shape[2];
    return "\n    ivec3 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + texShape[0] + ", " + texShape[1] + "));\n      int index = resTexRC.x * " + texShape[1] + " + resTexRC.y;\n      int r = index / " + stride0 + ";\n      index -= r * " + stride0 + ";\n      int c = index / " + stride1 + ";\n      int d = index - c * " + stride1 + ";\n      return ivec3(r, c, d);\n    }\n  ";
}
function getOutput4DCoords(shape, texShape) {
    var stride2 = shape[3];
    var stride1 = shape[2] * stride2;
    var stride0 = shape[1] * stride1;
    return "\n    ivec4 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n        vec2(" + texShape[0] + ", " + texShape[1] + "));\n      int index = resTexRC.x * " + texShape[1] + " + resTexRC.y;\n\n      int r = index / " + stride0 + ";\n      index -= r * " + stride0 + ";\n\n      int c = index / " + stride1 + ";\n      index -= c * " + stride1 + ";\n\n      int d = index / " + stride2 + ";\n      int d2 = index - d * " + stride2 + ";\n\n      return ivec4(r, c, d, d2);\n    }\n  ";
}
function getOutput2DCoords(shape, texShape) {
    if (util.arraysEqual(shape, texShape)) {
        return "\n      ivec2 getOutputCoords() {\n        return ivec2(resultUV.yx * vec2(" + texShape[0] + ", " + texShape[1] + "));\n      }\n    ";
    }
    if (shape[1] === 1) {
        return "\n      ivec2 getOutputCoords() {\n        ivec2 resTexRC = ivec2(resultUV.yx *\n                               vec2(" + texShape[0] + ", " + texShape[1] + "));\n        int index = resTexRC.x * " + texShape[1] + " + resTexRC.y;\n        return ivec2(index, 0);\n      }\n    ";
    }
    if (shape[0] === 1) {
        return "\n      ivec2 getOutputCoords() {\n        ivec2 resTexRC = ivec2(resultUV.yx *\n                               vec2(" + texShape[0] + ", " + texShape[1] + "));\n        int index = resTexRC.x * " + texShape[1] + " + resTexRC.y;\n        return ivec2(0, index);\n      }\n    ";
    }
    return "\n    ivec2 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + texShape[0] + ", " + texShape[1] + "));\n      int index = resTexRC.x * " + texShape[1] + " + resTexRC.y;\n      int r = index / " + shape[1] + ";\n      int c = index - r * " + shape[1] + ";\n      return ivec2(r, c);\n    }\n  ";
}
function getSamplerScalar(inputInfo) {
    var texName = inputInfo.name;
    var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    return "\n    float " + funcName + "() {\n      return sample(" + texName + ", halfCR);\n    }\n  ";
}
function getSampler1D(inputInfo) {
    var texName = inputInfo.name;
    var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    return "\n    float " + funcName + "(int index) {\n      return " + funcName + "Flat(index);\n    }\n  ";
}
function getSampler2D(inputInfo) {
    var shape = inputInfo.shapeInfo.logicalShape;
    var texShape = inputInfo.shapeInfo.texShape;
    var texName = inputInfo.name;
    var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    var texNumR = texShape[0];
    var texNumC = texShape[1];
    if (util.arraysEqual(shape, texShape)) {
        return "\n    float " + funcName + "(int row, int col) {\n      vec2 uv = (vec2(col, row) + halfCR) / vec2(" + texNumC + ".0, " + texNumR + ".0);\n      return sample(" + texName + ", uv);\n    }\n  ";
    }
    var _a = util.squeezeShape(shape), newShape = _a.newShape, keptDims = _a.keptDims;
    var squeezedShape = newShape;
    if (squeezedShape.length < shape.length) {
        var newInputInfo = squeezeInputInfo(inputInfo, squeezedShape);
        var params = ['row', 'col'];
        return "\n      " + getSamplerFromInInfo(newInputInfo) + "\n      float " + funcName + "(int row, int col) {\n        return " + funcName + "(" + getSqueezedParams(params, keptDims) + ");\n      }\n    ";
    }
    if (texNumC === 1) {
        return "\n    float " + funcName + "(int row, int col) {\n      int index = row * " + shape[1] + " + col;\n      vec2 uv = vec2(0.5, (float(index) + 0.5) / " + texNumR + ".0);\n      return sample(" + texName + ", uv);\n    }\n  ";
    }
    if (texNumR === 1) {
        return "\n    float " + funcName + "(int row, int col) {\n      int index = row * " + shape[1] + " + col;\n      vec2 uv = vec2((float(index) + 0.5) / " + texNumC + ".0, 0.5);\n      return sample(" + texName + ", uv);\n    }\n  ";
    }
    return "\n  float " + funcName + "(int row, int col) {\n    vec2 uv = UVfrom2D(" + texNumR + ", " + texNumC + ", " + shape[1] + ", row, col);\n    return sample(" + texName + ", uv);\n  }\n";
}
function getSampler3D(inputInfo) {
    var texShape = inputInfo.shapeInfo.texShape;
    var shape = inputInfo.shapeInfo.logicalShape;
    var texName = inputInfo.name;
    var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    var texNumR = texShape[0];
    var texNumC = texShape[1];
    var stride0 = shape[1] * shape[2];
    var stride1 = shape[2];
    var _a = util.squeezeShape(shape), newShape = _a.newShape, keptDims = _a.keptDims;
    var squeezedShape = newShape;
    if (squeezedShape.length < shape.length) {
        var newInputInfo = squeezeInputInfo(inputInfo, squeezedShape);
        var params = ['row', 'col', 'depth'];
        return "\n        " + getSamplerFromInInfo(newInputInfo) + "\n        float " + funcName + "(int row, int col, int depth) {\n          return " + funcName + "(" + getSqueezedParams(params, keptDims) + ");\n        }\n      ";
    }
    if (texNumC === stride0) {
        return "\n        float " + funcName + "(int row, int col, int depth) {\n          int texR = row;\n          int texC = col * " + stride1 + " + depth;\n          vec2 uv = (vec2(texC, texR) + halfCR) /\n                     vec2(" + texNumC + ".0, " + texNumR + ".0);\n          return sample(" + texName + ", uv);\n        }\n      ";
    }
    if (texNumC === stride1) {
        return "\n    float " + funcName + "(int row, int col, int depth) {\n      int texR = row * " + shape[1] + " + col;\n      int texC = depth;\n      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + texNumC + ".0, " + texNumR + ".0);\n      return sample(" + texName + ", uv);\n    }\n  ";
    }
    return "\n      float " + funcName + "(int row, int col, int depth) {\n        vec2 uv = UVfrom3D(\n            " + texNumR + ", " + texNumC + ", " + stride0 + ", " + stride1 + ", row, col, depth);\n        return sample(" + texName + ", uv);\n      }\n  ";
}
function getSampler4D(inputInfo) {
    var shape = inputInfo.shapeInfo.logicalShape;
    var texShape = inputInfo.shapeInfo.texShape;
    var texName = inputInfo.name;
    var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    var texNumR = texShape[0];
    var texNumC = texShape[1];
    var stride2 = shape[3];
    var stride1 = shape[2] * stride2;
    var stride0 = shape[1] * stride1;
    var _a = util.squeezeShape(shape), newShape = _a.newShape, keptDims = _a.keptDims;
    if (newShape.length < shape.length) {
        var newInputInfo = squeezeInputInfo(inputInfo, newShape);
        var params = ['row', 'col', 'depth', 'depth2'];
        return "\n      " + getSamplerFromInInfo(newInputInfo) + "\n      float " + funcName + "(int row, int col, int depth, int depth2) {\n        return " + funcName + "(" + getSqueezedParams(params, keptDims) + ");\n      }\n    ";
    }
    if (texNumC === stride0) {
        return "\n      float " + funcName + "(int row, int col, int depth, int depth2) {\n        int texR = row;\n        int texC = col * " + stride1 + " + depth * " + stride2 + " + depth2;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                   vec2(" + texNumC + ".0, " + texNumR + ".0);\n        return sample(" + texName + ", uv);\n      }\n    ";
    }
    if (texNumC === stride2) {
        return "\n      float " + funcName + "(int row, int col, int depth, int depth2) {\n        int texR = row * " + shape[1] * shape[2] + " + col * " + shape[2] + " + depth;\n        int texC = depth2;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                  vec2(" + texNumC + ".0, " + texNumR + ".0);\n        return sample(" + texName + ", uv);\n      }\n    ";
    }
    return "\n    float " + funcName + "(int row, int col, int depth, int depth2) {\n      vec2 uv = UVfrom4D(" + texNumR + ", " + texNumC + ", " + stride0 + ", " + stride1 + ",\n          " + stride2 + ", row, col, depth, depth2);\n      return sample(" + texName + ", uv);\n    }\n  ";
}
function getSamplerFlat(inputInfo) {
    var texName = inputInfo.name;
    var texShape = inputInfo.shapeInfo.texShape;
    var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1) + 'Flat';
    var tNumR = texShape[0];
    var tNumC = texShape[1];
    if (tNumC === 1 && tNumR === 1) {
        return "\n      float " + funcName + "(int index) {\n        return sample(" + texName + ", halfCR);\n      }\n    ";
    }
    if (tNumC === 1) {
        return "\n      float " + funcName + "(int index) {\n        vec2 uv = vec2(0.5, (float(index) + 0.5) / " + tNumR + ".0);\n        return sample(" + texName + ", uv);\n      }\n    ";
    }
    if (tNumR === 1) {
        return "\n      float " + funcName + "(int index) {\n        vec2 uv = vec2((float(index) + 0.5) / " + tNumC + ".0, 0.5);\n        return sample(" + texName + ", uv);\n      }\n    ";
    }
    return "\n    float " + funcName + "(int index) {\n      vec2 uv = UVfrom1D(" + tNumR + ", " + tNumC + ", index);\n      return sample(" + texName + ", uv);\n    }\n  ";
}
function getBroadcastOutputCoordsSampler(inputInfo, outShapeInfo, texFuncSnippet, funcName) {
    var inRank = inputInfo.shapeInfo.logicalShape.length;
    var outRank = outShapeInfo.logicalShape.length;
    var type = 'int';
    if (outRank === 2) {
        type = 'ivec2';
    }
    else if (outRank === 3) {
        type = 'ivec3';
    }
    else if (outRank === 4) {
        type = 'ivec4';
    }
    var broadcastDims = broadcast_util.getBroadcastDims(inputInfo.shapeInfo.logicalShape, outShapeInfo.logicalShape);
    var rankDiff = outRank - inRank;
    var coordsSnippet;
    if (inRank === 0) {
        coordsSnippet = '';
    }
    else if (outRank < 2 && broadcastDims.length >= 1) {
        coordsSnippet = 'coords = 0;';
    }
    else {
        coordsSnippet =
            broadcastDims.map(function (d) { return "coords[" + (d + rankDiff) + "] = 0;"; }).join('\n');
    }
    var unpackedCoordsSnippet = '';
    if (outRank < 2 && inRank > 0) {
        unpackedCoordsSnippet = 'coords';
    }
    else {
        unpackedCoordsSnippet = inputInfo.shapeInfo.logicalShape
            .map(function (s, i) { return "coords[" + (i + rankDiff) + "]"; })
            .join(', ');
    }
    return "\n    float " + funcName + "() {\n      " + type + " coords = getOutputCoords();\n      " + coordsSnippet + "\n      return get" + texFuncSnippet + "(" + unpackedCoordsSnippet + ");\n    }\n  ";
}
function getSamplerAtOutputCoords(inputInfo, outShapeInfo, supportsBroadcasting) {
    var inTexShape = inputInfo.shapeInfo.texShape;
    var texName = inputInfo.name;
    var texFuncSnippet = texName.charAt(0).toUpperCase() + texName.slice(1);
    var funcName = 'get' + texFuncSnippet + 'AtOutCoords';
    var broadcastDims = broadcast_util.getBroadcastDims(inputInfo.shapeInfo.logicalShape, outShapeInfo.logicalShape);
    var inRank = inputInfo.shapeInfo.logicalShape.length;
    var outRank = outShapeInfo.logicalShape.length;
    var doBroadcast = supportsBroadcasting && ((outRank > inRank) || broadcastDims.length > 0);
    var broadcastOverOuter = broadcast_util.broadcastDimsAreOuter(broadcastDims);
    if (doBroadcast && !broadcastOverOuter) {
        return getBroadcastOutputCoordsSampler(inputInfo, outShapeInfo, texFuncSnippet, funcName);
    }
    var outTexShape = outShapeInfo.texShape;
    if (util.arraysEqual(inTexShape, outTexShape)) {
        return "\n      float " + funcName + "() {\n        return sample(" + texName + ", resultUV);\n      }\n    ";
    }
    var inSize = util.sizeFromShape(inTexShape);
    var broadcastSnippet = '';
    if (doBroadcast && broadcastOverOuter) {
        broadcastSnippet = "\n        int mainPart = index / " + inSize + ";\n        index -= mainPart * " + inSize + ";\n      ";
    }
    return "\n    float " + funcName + "() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + outTexShape[0] + ", " + outTexShape[1] + "));\n      int index = resTexRC.x * " + outTexShape[1] + " + resTexRC.y;\n      " + broadcastSnippet + "\n      int texR = index / " + inTexShape[1] + ";\n      int texC = index - texR * " + inTexShape[1] + ";\n      vec2 uv = (vec2(texC, texR) + halfCR) /\n                 vec2(" + inTexShape[1] + ".0, " + inTexShape[0] + ".0);\n\n      return sample(" + texName + ", uv);\n    }\n  ";
}
function getCoordsDataType(rank) {
    if (rank <= 1) {
        return 'int';
    }
    else if (rank === 2) {
        return 'ivec2';
    }
    else if (rank === 3) {
        return 'ivec3';
    }
    else if (rank === 4) {
        return 'ivec4';
    }
    else {
        throw Error("GPU for rank " + rank + " is not yet supported");
    }
}
exports.getCoordsDataType = getCoordsDataType;
function squeezeInputInfo(inInfo, squeezedShape) {
    var newInputInfo = JSON.parse(JSON.stringify(inInfo));
    newInputInfo.shapeInfo.logicalShape = squeezedShape;
    return newInputInfo;
}
function getSqueezedParams(params, keptDims) {
    return keptDims.map(function (d) { return params[d]; }).join(', ');
}

},{"../../environment":35,"../../ops/broadcast_util":109,"../../util":151,"./tex_util":98}],97:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_compiler_1 = require("./shader_compiler");
var SliceProgram = (function () {
    function SliceProgram(destSize) {
        this.variableNames = ['source'];
        this.outputShape = destSize;
        this.rank = destSize.length;
        var dtype = shader_compiler_1.getCoordsDataType(this.rank);
        var sourceCoords = getCoords(this.rank);
        this.userCode = "\n      uniform " + dtype + " start;\n\n      void main() {\n        " + dtype + " sourceLoc = start + getOutputCoords();\n        setOutput(getSource(" + sourceCoords + "));\n      }\n    ";
    }
    SliceProgram.prototype.getCustomSetupFunc = function (start) {
        var _this = this;
        if (start.length !== this.rank) {
            throw Error("The rank (" + this.rank + ") of the program must match the " +
                ("length of start (" + start.length + ")"));
        }
        return function (gpgpu, webGLProgram) {
            if (_this.startLoc == null) {
                _this.startLoc = gpgpu.getUniformLocationNoThrow(webGLProgram, 'start');
                if (_this.startLoc == null) {
                    return;
                }
            }
            if (_this.rank === 1) {
                gpgpu.gl.uniform1i(_this.startLoc, start[0]);
            }
            else if (_this.rank === 2) {
                gpgpu.gl.uniform2i(_this.startLoc, start[0], start[1]);
            }
            else if (_this.rank === 3) {
                gpgpu.gl.uniform3i(_this.startLoc, start[0], start[1], start[2]);
            }
            else if (_this.rank === 4) {
                gpgpu.gl.uniform4i(_this.startLoc, start[0], start[1], start[2], start[3]);
            }
            else {
                throw Error("Slicing for rank " + _this.rank + " is not yet supported");
            }
        };
    };
    return SliceProgram;
}());
exports.SliceProgram = SliceProgram;
function getCoords(rank) {
    if (rank === 1) {
        return 'sourceLoc';
    }
    else if (rank === 2) {
        return 'sourceLoc.x, sourceLoc.y';
    }
    else if (rank === 3) {
        return 'sourceLoc.x, sourceLoc.y, sourceLoc.z';
    }
    else if (rank === 4) {
        return 'sourceLoc.x, sourceLoc.y, sourceLoc.z, sourceLoc.w';
    }
    else {
        throw Error("Slicing for rank " + rank + " is not yet supported");
    }
}

},{"./shader_compiler":96}],98:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TextureType;
(function (TextureType) {
    TextureType[TextureType["FLOAT"] = 0] = "FLOAT";
    TextureType[TextureType["UNSIGNED_BYTE"] = 1] = "UNSIGNED_BYTE";
})(TextureType = exports.TextureType || (exports.TextureType = {}));
function getUnpackedMatrixTextureShapeWidthHeight(rows, columns) {
    return [columns, rows];
}
exports.getUnpackedMatrixTextureShapeWidthHeight = getUnpackedMatrixTextureShapeWidthHeight;
function getUnpackedArraySizeFromMatrixSize(matrixSize, channelsPerTexture) {
    return matrixSize * channelsPerTexture;
}
exports.getUnpackedArraySizeFromMatrixSize = getUnpackedArraySizeFromMatrixSize;
function getColorMatrixTextureShapeWidthHeight(rows, columns) {
    return [columns * 4, rows];
}
exports.getColorMatrixTextureShapeWidthHeight = getColorMatrixTextureShapeWidthHeight;
function getMatrixSizeFromUnpackedArraySize(unpackedSize, channelsPerTexture) {
    if (unpackedSize % channelsPerTexture !== 0) {
        throw new Error("unpackedSize (" + unpackedSize + ") must be a multiple of " +
            ("" + channelsPerTexture));
    }
    return unpackedSize / channelsPerTexture;
}
exports.getMatrixSizeFromUnpackedArraySize = getMatrixSizeFromUnpackedArraySize;
function encodeMatrixToUnpackedArray(matrix, unpackedArray, channelsPerTexture) {
    var requiredSize = getUnpackedArraySizeFromMatrixSize(matrix.length, channelsPerTexture);
    if (unpackedArray.length < requiredSize) {
        throw new Error("unpackedArray length (" + unpackedArray.length + ") must be >= " +
            ("" + requiredSize));
    }
    var dst = 0;
    for (var src = 0; src < matrix.length; ++src) {
        unpackedArray[dst] = matrix[src];
        dst += channelsPerTexture;
    }
}
exports.encodeMatrixToUnpackedArray = encodeMatrixToUnpackedArray;
exports.FLOAT_MAX = 20000;
exports.FLOAT_MIN = -exports.FLOAT_MAX;
var FLOAT_RANGE = (exports.FLOAT_MAX - exports.FLOAT_MIN) / 255;
var FLOAT_DELTAS = [1, 1 / 255, 1 / (255 * 255), 1 / (255 * 255 * 255)];
var FLOAT_POWERS = [1, 255, 255 * 255];
exports.BYTE_NAN_VALUE = 0;
function encodeFloatArray(floatArray) {
    var uintArray = new Uint8Array(floatArray.length * 4);
    var _loop_1 = function (i) {
        var value = floatArray[i / 4];
        if (isNaN(value)) {
            uintArray[i] = exports.BYTE_NAN_VALUE;
            uintArray[i + 1] = exports.BYTE_NAN_VALUE;
            uintArray[i + 2] = exports.BYTE_NAN_VALUE;
            uintArray[i + 3] = exports.BYTE_NAN_VALUE;
            return "continue";
        }
        var normalizedValue = (value - exports.FLOAT_MIN) / FLOAT_RANGE;
        var enc = FLOAT_POWERS.map(function (pow) { return pow * normalizedValue; });
        var buckets = enc.map(function (value) { return Math.floor((value % 1) * 255); });
        uintArray[i] = Math.floor(normalizedValue);
        uintArray[i + 1] = buckets[0];
        uintArray[i + 2] = buckets[1];
        uintArray[i + 3] = buckets[2];
    };
    for (var i = 0; i < uintArray.length; i += 4) {
        _loop_1(i);
    }
    return uintArray;
}
exports.encodeFloatArray = encodeFloatArray;
function decodeToFloatArray(uintArray) {
    var floatArray = new Float32Array(uintArray.length / 4);
    var _loop_2 = function (i) {
        if (uintArray[i] === exports.BYTE_NAN_VALUE &&
            uintArray[i + 1] === exports.BYTE_NAN_VALUE &&
            uintArray[i + 2] === exports.BYTE_NAN_VALUE &&
            uintArray[i + 3] === exports.BYTE_NAN_VALUE) {
            floatArray[i / 4] = NaN;
            return "continue";
        }
        var dot = 0;
        FLOAT_DELTAS.forEach(function (delta, j) {
            dot += delta * uintArray[i + j];
        });
        var value = dot * FLOAT_RANGE + exports.FLOAT_MIN;
        floatArray[i / 4] = value;
    };
    for (var i = 0; i < uintArray.length; i += 4) {
        _loop_2(i);
    }
    return floatArray;
}
exports.decodeToFloatArray = decodeToFloatArray;
function decodeMatrixFromUnpackedArray(unpackedArray, matrix, channelsPerTexture) {
    var requiredSize = getMatrixSizeFromUnpackedArraySize(unpackedArray.length, channelsPerTexture);
    if (matrix.length < requiredSize) {
        throw new Error("matrix length (" + matrix.length + ") must be >= " + requiredSize);
    }
    var dst = 0;
    for (var src = 0; src < unpackedArray.length; src += channelsPerTexture) {
        matrix[dst++] = unpackedArray[src];
    }
}
exports.decodeMatrixFromUnpackedArray = decodeMatrixFromUnpackedArray;
function decodeMatrixFromUnpackedColorRGBAArray(unpackedArray, matrix, channels) {
    var requiredSize = unpackedArray.length * channels / 4;
    if (matrix.length < requiredSize) {
        throw new Error("matrix length (" + matrix.length + ") must be >= " + requiredSize);
    }
    var dst = 0;
    for (var src = 0; src < unpackedArray.length; src += 4) {
        for (var c = 0; c < channels; c++) {
            matrix[dst++] = unpackedArray[src + c];
        }
    }
}
exports.decodeMatrixFromUnpackedColorRGBAArray = decodeMatrixFromUnpackedColorRGBAArray;
function getPackedMatrixTextureShapeWidthHeight(rows, columns) {
    return [Math.ceil(columns / 2), Math.ceil(rows / 2)];
}
exports.getPackedMatrixTextureShapeWidthHeight = getPackedMatrixTextureShapeWidthHeight;
function getPackedRGBAArraySizeFromMatrixShape(rows, columns) {
    var _a = getPackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
    return w * h * 4;
}
exports.getPackedRGBAArraySizeFromMatrixShape = getPackedRGBAArraySizeFromMatrixShape;
function encodeMatrixToPackedRGBA(matrix, rows, columns, packedRGBA) {
    var requiredSize = getPackedRGBAArraySizeFromMatrixShape(rows, columns);
    if (packedRGBA.length < requiredSize) {
        throw new Error("packedRGBA length (" + packedRGBA.length + ") must be >= " + requiredSize);
    }
    var _a = getPackedMatrixTextureShapeWidthHeight(rows, columns), textureWidth = _a[0], textureHeight = _a[1];
    var oddWidth = (columns % 2) === 1;
    var oddHeight = (rows % 2) === 1;
    var widthInFullBlocks = Math.floor(columns / 2);
    var heightInFullBlocks = Math.floor(rows / 2);
    {
        var dstStride = (oddWidth ? 4 : 0);
        var oneRow = columns;
        var dst = 0;
        for (var blockY = 0; blockY < heightInFullBlocks; ++blockY) {
            var matrixSrcRow = (blockY * 2 * columns);
            for (var blockX = 0; blockX < widthInFullBlocks; ++blockX) {
                var matrixSrcCol = blockX * 2;
                var src = matrixSrcRow + matrixSrcCol;
                packedRGBA[dst] = matrix[src];
                packedRGBA[dst + 1] = matrix[src + 1];
                packedRGBA[dst + 2] = matrix[src + oneRow];
                packedRGBA[dst + 3] = matrix[src + oneRow + 1];
                dst += 4;
            }
            dst += dstStride;
        }
    }
    if (oddWidth) {
        var src = columns - 1;
        var dst = (textureWidth - 1) * 4;
        var srcStride = 2 * columns;
        var dstStride = textureWidth * 4;
        for (var blockY = 0; blockY < heightInFullBlocks; ++blockY) {
            packedRGBA[dst] = matrix[src];
            packedRGBA[dst + 2] = matrix[src + columns];
            src += srcStride;
            dst += dstStride;
        }
    }
    if (oddHeight) {
        var src = (rows - 1) * columns;
        var dst = (textureHeight - 1) * textureWidth * 4;
        for (var blockX = 0; blockX < widthInFullBlocks; ++blockX) {
            packedRGBA[dst++] = matrix[src++];
            packedRGBA[dst++] = matrix[src++];
            dst += 2;
        }
    }
    if (oddWidth && oddHeight) {
        packedRGBA[packedRGBA.length - 4] = matrix[matrix.length - 1];
    }
    return packedRGBA;
}
exports.encodeMatrixToPackedRGBA = encodeMatrixToPackedRGBA;
function decodeMatrixFromPackedRGBA(packedRGBA, rows, columns, matrix) {
    var requiredSize = rows * columns;
    if (requiredSize < matrix.length) {
        throw new Error("matrix length (" + matrix.length + ") must be >= " + requiredSize);
    }
    var oddWidth = (columns % 2) === 1;
    var oddHeight = (rows % 2) === 1;
    var widthInFullBlocks = Math.floor(columns / 2);
    var heightInFullBlocks = Math.floor(rows / 2);
    var _a = getPackedMatrixTextureShapeWidthHeight(rows, columns), textureWidth = _a[0], textureHeight = _a[1];
    {
        var srcStride = oddWidth ? 4 : 0;
        var dstStride = columns + (oddWidth ? 1 : 0);
        var src = 0;
        var dstRow1 = 0;
        var dstRow2 = columns;
        for (var blockY = 0; blockY < heightInFullBlocks; ++blockY) {
            for (var blockX = 0; blockX < widthInFullBlocks; ++blockX) {
                matrix[dstRow1++] = packedRGBA[src++];
                matrix[dstRow1++] = packedRGBA[src++];
                matrix[dstRow2++] = packedRGBA[src++];
                matrix[dstRow2++] = packedRGBA[src++];
            }
            src += srcStride;
            dstRow1 += dstStride;
            dstRow2 += dstStride;
        }
    }
    if (oddWidth) {
        var src = (textureWidth - 1) * 4;
        var dst = columns - 1;
        var srcStride = textureWidth * 4;
        var dstStride = 2 * columns;
        for (var blockY = 0; blockY < heightInFullBlocks; ++blockY) {
            matrix[dst] = packedRGBA[src];
            matrix[dst + columns] = packedRGBA[src + 2];
            src += srcStride;
            dst += dstStride;
        }
    }
    if (oddHeight) {
        var src = (textureHeight - 1) * textureWidth * 4;
        var dst = (rows - 1) * columns;
        for (var blockX = 0; blockX < widthInFullBlocks; ++blockX) {
            matrix[dst++] = packedRGBA[src++];
            matrix[dst++] = packedRGBA[src++];
            src += 2;
        }
    }
    if (oddWidth && oddHeight) {
        matrix[matrix.length - 1] = packedRGBA[packedRGBA.length - 4];
    }
    return matrix;
}
exports.decodeMatrixFromPackedRGBA = decodeMatrixFromPackedRGBA;

},{}],99:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tex_util_1 = require("./tex_util");
var TextureManager = (function () {
    function TextureManager(gpgpu) {
        this.gpgpu = gpgpu;
        this.numUsedTextures = 0;
        this.numFreeTextures = 0;
        this.freeTextures = {};
        this.logEnabled = false;
        this.allocatedTextures = [];
        this.usedTextureCount = {};
    }
    TextureManager.prototype.acquireTexture = function (shapeRC, texType) {
        if (texType === void 0) { texType = tex_util_1.TextureType.FLOAT; }
        var shapeKey = getKeyFromTextureShape(shapeRC, texType);
        if (!(shapeKey in this.freeTextures)) {
            this.freeTextures[shapeKey] = [];
        }
        if (!(shapeKey in this.usedTextureCount)) {
            this.usedTextureCount[shapeKey] = 0;
        }
        this.usedTextureCount[shapeKey]++;
        if (this.freeTextures[shapeKey].length > 0) {
            this.numFreeTextures--;
            this.numUsedTextures++;
            this.log();
            return this.freeTextures[shapeKey].shift();
        }
        this.numUsedTextures++;
        this.log();
        var newTexture = this.gpgpu.createMatrixTexture(shapeRC[0], shapeRC[1]);
        this.allocatedTextures.push(newTexture);
        return newTexture;
    };
    TextureManager.prototype.releaseTexture = function (texture, shape, texType) {
        if (texType === void 0) { texType = tex_util_1.TextureType.FLOAT; }
        var shapeKey = getKeyFromTextureShape(shape, texType);
        if (!(shapeKey in this.freeTextures)) {
            this.freeTextures[shapeKey] = [];
        }
        this.freeTextures[shapeKey].push(texture);
        this.numFreeTextures++;
        this.numUsedTextures--;
        this.usedTextureCount[shapeKey]--;
        this.log();
    };
    TextureManager.prototype.log = function () {
        if (!this.logEnabled) {
            return;
        }
        var total = this.numFreeTextures + this.numUsedTextures;
        console.log('Free/Used', this.numFreeTextures + " / " + this.numUsedTextures, "(" + total + ")");
    };
    TextureManager.prototype.getNumUsedTextures = function () {
        return this.numUsedTextures;
    };
    TextureManager.prototype.getNumFreeTextures = function () {
        return this.numFreeTextures;
    };
    TextureManager.prototype.dispose = function () {
        var _this = this;
        if (this.allocatedTextures == null) {
            return;
        }
        this.allocatedTextures.forEach(function (texture) {
            _this.gpgpu.deleteMatrixTexture(texture);
        });
        this.freeTextures = null;
        this.allocatedTextures = null;
        this.usedTextureCount = null;
        this.numUsedTextures = 0;
        this.numFreeTextures = 0;
    };
    return TextureManager;
}());
exports.TextureManager = TextureManager;
function getKeyFromTextureShape(shapeRowsCol, texType) {
    return shapeRowsCol[0] + "_" + shapeRowsCol[1] + "_" + texType;
}

},{"./tex_util":98}],100:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_compiler_1 = require("./shader_compiler");
var TileProgram = (function () {
    function TileProgram(aShape, reps) {
        this.variableNames = ['A'];
        var outputShape = new Array(aShape.length);
        for (var i = 0; i < outputShape.length; i++) {
            outputShape[i] = aShape[i] * reps[i];
        }
        this.outputShape = outputShape;
        this.rank = outputShape.length;
        var dtype = shader_compiler_1.getCoordsDataType(this.rank);
        var sourceCoords = getSourceCoords(aShape);
        this.userCode = "\n      void main() {\n        " + dtype + " resRC = getOutputCoords();\n        setOutput(getA(" + sourceCoords + "));\n      }\n    ";
    }
    return TileProgram;
}());
exports.TileProgram = TileProgram;
function getSourceCoords(aShape) {
    var rank = aShape.length;
    if (rank > 4) {
        throw Error("Tile for rank " + rank + " is not yet supported");
    }
    if (rank === 1) {
        return "imod(resRC, " + aShape[0] + ")";
    }
    var currentCoords = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w'];
    var sourceCoords = [];
    for (var i = 0; i < aShape.length; i++) {
        sourceCoords.push("imod(" + currentCoords[i] + ", " + aShape[i] + ")");
    }
    return sourceCoords.join();
}

},{"./shader_compiler":96}],101:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_compiler_1 = require("./shader_compiler");
var TransposeProgram = (function () {
    function TransposeProgram(aShape, newDim) {
        this.variableNames = ['A'];
        var outputShape = new Array(aShape.length);
        for (var i = 0; i < outputShape.length; i++) {
            outputShape[i] = aShape[newDim[i]];
        }
        this.outputShape = outputShape;
        this.rank = outputShape.length;
        var dtype = shader_compiler_1.getCoordsDataType(this.rank);
        var switched = getSwitchedCoords(newDim);
        this.userCode = "\n    void main() {\n      " + dtype + " resRC = getOutputCoords();\n      setOutput(getA(" + switched + "));\n    }\n    ";
    }
    return TransposeProgram;
}());
exports.TransposeProgram = TransposeProgram;
function getSwitchedCoords(newDim) {
    var rank = newDim.length;
    if (rank > 4) {
        throw Error("Transpose for rank " + rank + " is not yet supported");
    }
    var originalOrder = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w'];
    var switchedCoords = new Array(rank);
    for (var i = 0; i < newDim.length; i++) {
        switchedCoords[newDim[i]] = originalOrder[i];
    }
    return switchedCoords.join();
}

},{"./shader_compiler":96}],102:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var selu_util = require("../../ops/selu_util");
var UnaryOpProgram = (function () {
    function UnaryOpProgram(aShape, opSnippet) {
        this.variableNames = ['A'];
        this.outputShape = aShape;
        this.userCode = "\n      float unaryOperation(float x) {\n        " + opSnippet + "\n      }\n\n      void main() {\n        float x = getAAtOutCoords();\n        float y = unaryOperation(x);\n\n        setOutput(y);\n      }\n    ";
    }
    return UnaryOpProgram;
}());
exports.UnaryOpProgram = UnaryOpProgram;
var CHECK_NAN_SNIPPET = "\n  if (isNaN(x)) return x;\n";
exports.ABS = "\n  return abs(x);\n";
exports.RELU = CHECK_NAN_SNIPPET + "\n  return (x < 0.0) ? 0.0 : x;\n";
exports.ELU = "\n  return (x >= 0.0) ? x : (exp(x) - 1.0);\n";
exports.ELU_DER = "\n  return (x >= 0.0) ? 1.0 : exp(x);\n";
exports.SELU = "\n  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.\n  // see: https://arxiv.org/abs/1706.02515\n  float scaleAlpha = " + selu_util.SELU_SCALEALPHA + ";\n  float scale = " + selu_util.SELU_SCALE + ";\n  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);\n";
function LEAKY_RELU(alpha) {
    return "\n    return (x >= 0.0) ? x : " + alpha + " * x;\n  ";
}
exports.LEAKY_RELU = LEAKY_RELU;
function STEP(alpha) {
    if (alpha === void 0) { alpha = 0.0; }
    return CHECK_NAN_SNIPPET + ("\n    return x > 0.0 ? 1.0 : float(" + alpha + ");\n  ");
}
exports.STEP = STEP;
exports.NEG = "\n  return -x;\n";
exports.CEIL = "\n  return ceil(x);\n";
exports.FLOOR = "\n  return floor(x);\n";
exports.EXP = "\n  return exp(x);\n";
exports.LOG = "\n  return log(x);\n";
exports.SQRT = CHECK_NAN_SNIPPET + "\n  return sqrt(x);\n";
exports.SIGMOID = "\n  return 1.0 / (1.0 + exp(-1.0 * x));\n";
exports.SIN = CHECK_NAN_SNIPPET + "\n  return sin(x);\n";
exports.COS = CHECK_NAN_SNIPPET + "\n  return cos(x);\n";
exports.TAN = "\n  return tan(x);\n";
exports.ASIN = CHECK_NAN_SNIPPET + "\n  return asin(x);\n";
exports.ACOS = CHECK_NAN_SNIPPET + "\n  return acos(x);\n";
exports.ATAN = CHECK_NAN_SNIPPET + "\n  return atan(x);\n";
exports.SINH = "\n  float e2x = exp(x);\n  return (e2x - 1.0 / e2x) / 2.0;\n";
exports.COSH = "\n  float e2x = exp(-x);\n  return (e2x + 1.0 / e2x) / 2.0;\n";
exports.TANH = "\n  float e2x = exp(-2.0 * abs(x));\n  return sign(x) * (1.0 - e2x) / (1.0 + e2x);\n";
exports.SQUARE = "\n  return x * x;\n";
exports.LOGICAL_NOT = CHECK_NAN_SNIPPET + "\n  return float(!(x >= 1.0));\n";
exports.TO_INT = "\n  return float(int(x));\n";

},{"../../ops/selu_util":128}],103:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MAX_TEXTURE_SIZE = null;
var util = require("../../util");
var environment_1 = require("../../environment");
function createWebGLRenderingContext(attributes) {
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return createWebGLRenderingContextFromCanvas(canvas, attributes);
}
exports.createWebGLRenderingContext = createWebGLRenderingContext;
function createWebGLRenderingContextFromCanvas(canvas, attributes) {
    var gl;
    var webglVersion = environment_1.ENV.get('WEBGL_VERSION');
    if (webglVersion === 2) {
        gl = canvas.getContext('webgl2', attributes);
    }
    else if (webglVersion === 1) {
        gl = (canvas.getContext('webgl', attributes) ||
            canvas.getContext('experimental-webgl', attributes));
    }
    if (webglVersion === 0 || gl == null) {
        throw new Error('This browser does not support WebGL.');
    }
    return gl;
}
exports.createWebGLRenderingContextFromCanvas = createWebGLRenderingContextFromCanvas;
function callAndCheck(gl, func) {
    var returnValue = func();
    checkWebGLError(gl);
    return returnValue;
}
exports.callAndCheck = callAndCheck;
var webGLDebugErrorCheckingEnabled = false;
function enableDebugWebGLErrorChecking(enabled) {
    webGLDebugErrorCheckingEnabled = enabled;
}
exports.enableDebugWebGLErrorChecking = enableDebugWebGLErrorChecking;
function checkWebGLError(gl) {
    if (webGLDebugErrorCheckingEnabled) {
        var error = gl.getError();
        if (error !== gl.NO_ERROR) {
            throw new Error('WebGL Error: ' + getWebGLErrorMessage(gl, error));
        }
    }
}
exports.checkWebGLError = checkWebGLError;
function getWebGLErrorMessage(gl, status) {
    switch (status) {
        case gl.NO_ERROR:
            return 'NO_ERROR';
        case gl.INVALID_ENUM:
            return 'INVALID_ENUM';
        case gl.INVALID_VALUE:
            return 'INVALID_VALUE';
        case gl.INVALID_OPERATION:
            return 'INVALID_OPERATION';
        case gl.INVALID_FRAMEBUFFER_OPERATION:
            return 'INVALID_FRAMEBUFFER_OPERATION';
        case gl.OUT_OF_MEMORY:
            return 'OUT_OF_MEMORY';
        case gl.CONTEXT_LOST_WEBGL:
            return 'CONTEXT_LOST_WEBGL';
        default:
            return "Unknown error code " + status;
    }
}
exports.getWebGLErrorMessage = getWebGLErrorMessage;
function getExtensionOrThrow(gl, extensionName) {
    return throwIfNull(gl, function () { return gl.getExtension(extensionName); }, 'Extension "' + extensionName + '" not supported on this browser.');
}
exports.getExtensionOrThrow = getExtensionOrThrow;
function createVertexShader(gl, vertexShaderSource) {
    var vertexShader = throwIfNull(gl, function () { return gl.createShader(gl.VERTEX_SHADER); }, 'Unable to create vertex WebGLShader.');
    callAndCheck(gl, function () { return gl.shaderSource(vertexShader, vertexShaderSource); });
    callAndCheck(gl, function () { return gl.compileShader(vertexShader); });
    if (gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS) === false) {
        console.log(gl.getShaderInfoLog(vertexShader));
        throw new Error('Failed to compile vertex shader.');
    }
    return vertexShader;
}
exports.createVertexShader = createVertexShader;
function createFragmentShader(gl, fragmentShaderSource) {
    var fragmentShader = throwIfNull(gl, function () { return gl.createShader(gl.FRAGMENT_SHADER); }, 'Unable to create fragment WebGLShader.');
    callAndCheck(gl, function () { return gl.shaderSource(fragmentShader, fragmentShaderSource); });
    callAndCheck(gl, function () { return gl.compileShader(fragmentShader); });
    if (gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS) === false) {
        logShaderSourceAndInfoLog(fragmentShaderSource, gl.getShaderInfoLog(fragmentShader));
        throw new Error('Failed to compile fragment shader.');
    }
    return fragmentShader;
}
exports.createFragmentShader = createFragmentShader;
var lineNumberRegex = /ERROR: [0-9]+:([0-9]+):/g;
function logShaderSourceAndInfoLog(shaderSource, shaderInfoLog) {
    var lineNumberRegexResult = lineNumberRegex.exec(shaderInfoLog);
    if (lineNumberRegexResult == null) {
        console.log("Couldn't parse line number in error: " + shaderInfoLog);
        console.log(shaderSource);
        return;
    }
    var lineNumber = +lineNumberRegexResult[1];
    var shaderLines = shaderSource.split('\n');
    var pad = shaderLines.length.toString().length + 2;
    var linesWithLineNumbers = shaderLines.map(function (line, lineNumber) {
        return util.rightPad((lineNumber + 1).toString(), pad) + line;
    });
    var maxLineLength = 0;
    for (var i = 0; i < linesWithLineNumbers.length; i++) {
        maxLineLength = Math.max(linesWithLineNumbers[i].length, maxLineLength);
    }
    var beforeErrorLines = linesWithLineNumbers.slice(0, lineNumber - 1);
    var errorLine = linesWithLineNumbers.slice(lineNumber - 1, lineNumber);
    var afterErrorLines = linesWithLineNumbers.slice(lineNumber);
    console.log(beforeErrorLines.join('\n'));
    console.log(shaderInfoLog.split('\n')[0]);
    console.log("%c " + util.rightPad(errorLine[0], maxLineLength), 'border:1px solid red; background-color:#e3d2d2; color:#a61717');
    console.log(afterErrorLines.join('\n'));
}
function createProgram(gl) {
    return throwIfNull(gl, function () { return gl.createProgram(); }, 'Unable to create WebGLProgram.');
}
exports.createProgram = createProgram;
function linkProgram(gl, program) {
    callAndCheck(gl, function () { return gl.linkProgram(program); });
    if (gl.getProgramParameter(program, gl.LINK_STATUS) === false) {
        console.log(gl.getProgramInfoLog(program));
        throw new Error('Failed to link vertex and fragment shaders.');
    }
}
exports.linkProgram = linkProgram;
function validateProgram(gl, program) {
    callAndCheck(gl, function () { return gl.validateProgram(program); });
    if (gl.getProgramParameter(program, gl.VALIDATE_STATUS) === false) {
        console.log(gl.getProgramInfoLog(program));
        throw new Error('Shader program validation failed.');
    }
}
exports.validateProgram = validateProgram;
function createStaticVertexBuffer(gl, data) {
    var buffer = throwIfNull(gl, function () { return gl.createBuffer(); }, 'Unable to create WebGLBuffer');
    callAndCheck(gl, function () { return gl.bindBuffer(gl.ARRAY_BUFFER, buffer); });
    callAndCheck(gl, function () { return gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); });
    return buffer;
}
exports.createStaticVertexBuffer = createStaticVertexBuffer;
function createStaticIndexBuffer(gl, data) {
    var buffer = throwIfNull(gl, function () { return gl.createBuffer(); }, 'Unable to create WebGLBuffer');
    callAndCheck(gl, function () { return gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer); });
    callAndCheck(gl, function () { return gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW); });
    return buffer;
}
exports.createStaticIndexBuffer = createStaticIndexBuffer;
function queryMaxTextureSize(gl) {
    if (MAX_TEXTURE_SIZE != null) {
        return MAX_TEXTURE_SIZE;
    }
    MAX_TEXTURE_SIZE =
        callAndCheck(gl, function () { return gl.getParameter(gl.MAX_TEXTURE_SIZE); });
    return MAX_TEXTURE_SIZE;
}
exports.queryMaxTextureSize = queryMaxTextureSize;
function getChannelsPerTexture() {
    if (!environment_1.ENV.get('WEBGL_FLOAT_TEXTURE_ENABLED')) {
        return 4;
    }
    if (environment_1.ENV.get('WEBGL_VERSION') === 2) {
        return 1;
    }
    return 4;
}
exports.getChannelsPerTexture = getChannelsPerTexture;
function createTexture(gl) {
    return throwIfNull(gl, function () { return gl.createTexture(); }, 'Unable to create WebGLTexture.');
}
exports.createTexture = createTexture;
function validateTextureSize(gl, width, height) {
    var maxTextureSize = queryMaxTextureSize(gl);
    if ((width <= 0) || (height <= 0)) {
        var requested = "[" + width + "x" + height + "]";
        throw new Error('Requested texture size ' + requested + ' is invalid.');
    }
    if ((width > maxTextureSize) || (height > maxTextureSize)) {
        var requested = "[" + width + "x" + height + "]";
        var max = "[" + maxTextureSize + "x" + maxTextureSize + "]";
        throw new Error('Requested texture size ' + requested +
            ' greater than WebGL maximum on this browser / GPU ' + max + '.');
    }
}
exports.validateTextureSize = validateTextureSize;
function createFramebuffer(gl) {
    return throwIfNull(gl, function () { return gl.createFramebuffer(); }, 'Unable to create WebGLFramebuffer.');
}
exports.createFramebuffer = createFramebuffer;
function bindVertexBufferToProgramAttribute(gl, program, attribute, buffer, arrayEntriesPerItem, itemStrideInBytes, itemOffsetInBytes) {
    var loc = gl.getAttribLocation(program, attribute);
    if (loc === -1) {
        return;
    }
    callAndCheck(gl, function () { return gl.bindBuffer(gl.ARRAY_BUFFER, buffer); });
    callAndCheck(gl, function () { return gl.vertexAttribPointer(loc, arrayEntriesPerItem, gl.FLOAT, false, itemStrideInBytes, itemOffsetInBytes); });
    callAndCheck(gl, function () { return gl.enableVertexAttribArray(loc); });
}
exports.bindVertexBufferToProgramAttribute = bindVertexBufferToProgramAttribute;
function bindTextureUnit(gl, texture, textureUnit) {
    validateTextureUnit(gl, textureUnit);
    callAndCheck(gl, function () { return gl.activeTexture(gl.TEXTURE0 + textureUnit); });
    callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, texture); });
}
exports.bindTextureUnit = bindTextureUnit;
function unbindTextureUnit(gl, textureUnit) {
    validateTextureUnit(gl, textureUnit);
    callAndCheck(gl, function () { return gl.activeTexture(gl.TEXTURE0 + textureUnit); });
    callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, null); });
}
exports.unbindTextureUnit = unbindTextureUnit;
function getProgramUniformLocationOrThrow(gl, program, uniformName) {
    return throwIfNull(gl, function () { return gl.getUniformLocation(program, uniformName); }, 'uniform "' + uniformName + '" not present in program.');
}
exports.getProgramUniformLocationOrThrow = getProgramUniformLocationOrThrow;
function getProgramUniformLocation(gl, program, uniformName) {
    return gl.getUniformLocation(program, uniformName);
}
exports.getProgramUniformLocation = getProgramUniformLocation;
function bindTextureToProgramUniformSampler(gl, program, texture, uniformSamplerLocation, textureUnit) {
    callAndCheck(gl, function () { return bindTextureUnit(gl, texture, textureUnit); });
    callAndCheck(gl, function () { return gl.uniform1i(uniformSamplerLocation, textureUnit); });
}
exports.bindTextureToProgramUniformSampler = bindTextureToProgramUniformSampler;
function bindCanvasToFramebuffer(gl) {
    callAndCheck(gl, function () { return gl.bindFramebuffer(gl.FRAMEBUFFER, null); });
    callAndCheck(gl, function () { return gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); });
    callAndCheck(gl, function () { return gl.scissor(0, 0, gl.canvas.width, gl.canvas.height); });
}
exports.bindCanvasToFramebuffer = bindCanvasToFramebuffer;
function bindColorTextureToFramebuffer(gl, texture, framebuffer) {
    callAndCheck(gl, function () { return gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer); });
    callAndCheck(gl, function () { return gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0); });
}
exports.bindColorTextureToFramebuffer = bindColorTextureToFramebuffer;
function unbindColorTextureFromFramebuffer(gl, framebuffer) {
    callAndCheck(gl, function () { return gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer); });
    callAndCheck(gl, function () { return gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0); });
}
exports.unbindColorTextureFromFramebuffer = unbindColorTextureFromFramebuffer;
function validateFramebuffer(gl) {
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error('Error binding framebuffer: ' + getFramebufferErrorMessage(gl, status));
    }
}
exports.validateFramebuffer = validateFramebuffer;
function getFramebufferErrorMessage(gl, status) {
    switch (status) {
        case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            return 'FRAMEBUFFER_INCOMPLETE_ATTACHMENT';
        case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            return 'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT';
        case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            return 'FRAMEBUFFER_INCOMPLETE_DIMENSIONS';
        case gl.FRAMEBUFFER_UNSUPPORTED:
            return 'FRAMEBUFFER_UNSUPPORTED';
        default:
            return "unknown error " + status;
    }
}
exports.getFramebufferErrorMessage = getFramebufferErrorMessage;
function throwIfNull(gl, returnTOrNull, failureMessage) {
    var tOrNull = callAndCheck(gl, function () { return returnTOrNull(); });
    if (tOrNull == null) {
        throw new Error(failureMessage);
    }
    return tOrNull;
}
function validateTextureUnit(gl, textureUnit) {
    var maxTextureUnit = gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1;
    var glTextureUnit = textureUnit + gl.TEXTURE0;
    if (glTextureUnit < gl.TEXTURE0 || glTextureUnit > maxTextureUnit) {
        var textureUnitRange = "[gl.TEXTURE0, gl.TEXTURE" + maxTextureUnit + "]";
        throw new Error("textureUnit must be in " + textureUnitRange + ".");
    }
}
function getTextureShapeFromLogicalShape(gl, logShape) {
    if (logShape.length !== 2) {
        var squeezeResult = util.squeezeShape(logShape);
        logShape = squeezeResult.newShape;
    }
    var maxTexSize = queryMaxTextureSize(gl);
    var size = util.sizeFromShape(logShape);
    if (logShape.length <= 1 && size <= maxTexSize) {
        return [size, 1];
    }
    else if (logShape.length === 2 && logShape[0] <= maxTexSize &&
        logShape[1] <= maxTexSize) {
        return logShape;
    }
    else if (logShape.length === 3 && logShape[0] <= maxTexSize &&
        logShape[1] * logShape[2] <= maxTexSize) {
        return [logShape[0], logShape[1] * logShape[2]];
    }
    else if (logShape.length === 4 && logShape[0] <= maxTexSize &&
        logShape[1] * logShape[2] * logShape[3] <= maxTexSize) {
        return [logShape[0], logShape[1] * logShape[2] * logShape[3]];
    }
    else {
        return util.sizeToSquarishShape(size);
    }
}
exports.getTextureShapeFromLogicalShape = getTextureShapeFromLogicalShape;

},{"../../environment":35,"../../util":151}],104:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./environment");
var array_ops_1 = require("./ops/array_ops");
var batchnorm_1 = require("./ops/batchnorm");
var binary_ops_1 = require("./ops/binary_ops");
var compare_1 = require("./ops/compare");
var conv_1 = require("./ops/conv");
var image_ops_1 = require("./ops/image_ops");
var logical_ops_1 = require("./ops/logical_ops");
var lrn_1 = require("./ops/lrn");
var lstm_1 = require("./ops/lstm");
var matmul_1 = require("./ops/matmul");
var norm_1 = require("./ops/norm");
var ops = require("./ops/ops");
var pool_1 = require("./ops/pool");
var reduction_ops_1 = require("./ops/reduction_ops");
var reverse_1 = require("./ops/reverse");
var slice_1 = require("./ops/slice");
var softmax_1 = require("./ops/softmax");
var transpose_1 = require("./ops/transpose");
var unary_ops_1 = require("./ops/unary_ops");
var tracking_1 = require("./tracking");
var util = require("./util");
var tidy = tracking_1.Tracking.tidy;
var keep = tracking_1.Tracking.keep;
var NDArrayMath = (function () {
    function NDArrayMath(backend, safeMode) {
        this.matMul = matmul_1.MatmulOps.matMul;
        this.vectorTimesMatrix = matmul_1.MatmulOps.vectorTimesMatrix;
        this.outerProduct = matmul_1.MatmulOps.outerProduct;
        this.matrixTimesVector = matmul_1.MatmulOps.matrixTimesVector;
        this.dotProduct = matmul_1.MatmulOps.dotProduct;
        this.slice = slice_1.SliceOps.slice;
        this.slice1D = slice_1.SliceOps.slice1d;
        this.slice2D = slice_1.SliceOps.slice2d;
        this.slice3D = slice_1.SliceOps.slice3d;
        this.slice4D = slice_1.SliceOps.slice4d;
        this.reverse = reverse_1.ReverseOps.reverse;
        this.reverse1D = reverse_1.ReverseOps.reverse1d;
        this.reverse2D = reverse_1.ReverseOps.reverse2d;
        this.reverse3D = reverse_1.ReverseOps.reverse3d;
        this.reverse4D = reverse_1.ReverseOps.reverse4d;
        this.batchNormalization = batchnorm_1.BatchNormOps.batchNormalization;
        this.batchNormalization2D = batchnorm_1.BatchNormOps.batchNormalization2d;
        this.batchNormalization3D = batchnorm_1.BatchNormOps.batchNormalization3d;
        this.batchNormalization4D = batchnorm_1.BatchNormOps.batchNormalization4d;
        this.avgPool = pool_1.PoolOps.avgPool;
        this.maxPool = pool_1.PoolOps.maxPool;
        this.minPool = pool_1.PoolOps.minPool;
        this.maxPoolBackprop = pool_1.PoolOps.maxPoolBackprop;
        this.conv2dTranspose = conv_1.ConvOps.conv2dTranspose;
        this.depthwiseConv2D = conv_1.ConvOps.depthwiseConv2d;
        this.conv2dDerFilter = conv_1.ConvOps.conv2dDerFilter;
        this.conv2dDerInput = conv_1.ConvOps.conv2dDerInput;
        this.argMax = reduction_ops_1.ReductionOps.argMax;
        this.argMin = reduction_ops_1.ReductionOps.argMin;
        this.logSumExp = reduction_ops_1.ReductionOps.logSumExp;
        this.max = reduction_ops_1.ReductionOps.max;
        this.mean = reduction_ops_1.ReductionOps.mean;
        this.min = reduction_ops_1.ReductionOps.min;
        this.moments = reduction_ops_1.ReductionOps.moments;
        this.sum = reduction_ops_1.ReductionOps.sum;
        this.add = binary_ops_1.BinaryOps.add;
        this.addStrict = binary_ops_1.BinaryOps.addStrict;
        this.div = binary_ops_1.BinaryOps.div;
        this.divide = this.div;
        this.divStrict = binary_ops_1.BinaryOps.divStrict;
        this.divideStrict = this.divStrict;
        this.maximum = binary_ops_1.BinaryOps.maximum;
        this.maximumStrict = binary_ops_1.BinaryOps.maximumStrict;
        this.minimum = binary_ops_1.BinaryOps.minimum;
        this.minimumStrict = binary_ops_1.BinaryOps.minimumStrict;
        this.mul = binary_ops_1.BinaryOps.mul;
        this.multiply = this.mul;
        this.mulStrict = binary_ops_1.BinaryOps.mulStrict;
        this.multiplyStrict = this.mulStrict;
        this.pow = binary_ops_1.BinaryOps.pow;
        this.powStrict = binary_ops_1.BinaryOps.powStrict;
        this.sub = binary_ops_1.BinaryOps.sub;
        this.subtract = this.sub;
        this.subStrict = binary_ops_1.BinaryOps.subStrict;
        this.logicalNot = logical_ops_1.LogicalOps.logicalNot;
        this.logicalAnd = logical_ops_1.LogicalOps.logicalAnd;
        this.logicalOr = logical_ops_1.LogicalOps.logicalOr;
        this.logicalXor = logical_ops_1.LogicalOps.logicalXor;
        this.where = logical_ops_1.LogicalOps.where;
        this.transpose = transpose_1.TransposeOps.transpose;
        this.equal = compare_1.CompareOps.equal;
        this.equalStrict = compare_1.CompareOps.equalStrict;
        this.greater = compare_1.CompareOps.greater;
        this.greaterStrict = compare_1.CompareOps.greaterStrict;
        this.greaterEqual = compare_1.CompareOps.greaterEqual;
        this.greaterEqualStrict = compare_1.CompareOps.greaterEqualStrict;
        this.less = compare_1.CompareOps.less;
        this.lessStrict = compare_1.CompareOps.lessStrict;
        this.lessEqual = compare_1.CompareOps.lessEqual;
        this.lessEqualStrict = compare_1.CompareOps.lessEqualStrict;
        this.notEqual = compare_1.CompareOps.notEqual;
        this.notEqualStrict = compare_1.CompareOps.notEqualStrict;
        this.abs = unary_ops_1.UnaryOps.abs;
        this.acos = unary_ops_1.UnaryOps.acos;
        this.asin = unary_ops_1.UnaryOps.asin;
        this.atan = unary_ops_1.UnaryOps.atan;
        this.ceil = unary_ops_1.UnaryOps.ceil;
        this.clip = unary_ops_1.UnaryOps.clipByValue;
        this.cos = unary_ops_1.UnaryOps.cos;
        this.cosh = unary_ops_1.UnaryOps.cosh;
        this.elu = unary_ops_1.UnaryOps.elu;
        this.exp = unary_ops_1.UnaryOps.exp;
        this.floor = unary_ops_1.UnaryOps.floor;
        this.leakyRelu = unary_ops_1.UnaryOps.leakyRelu;
        this.log = unary_ops_1.UnaryOps.log;
        this.neg = unary_ops_1.UnaryOps.neg;
        this.prelu = unary_ops_1.UnaryOps.prelu;
        this.relu = unary_ops_1.UnaryOps.relu;
        this.selu = unary_ops_1.UnaryOps.selu;
        this.sigmoid = unary_ops_1.UnaryOps.sigmoid;
        this.sin = unary_ops_1.UnaryOps.sin;
        this.sinh = unary_ops_1.UnaryOps.sinh;
        this.sqrt = unary_ops_1.UnaryOps.sqrt;
        this.square = unary_ops_1.UnaryOps.square;
        this.step = unary_ops_1.UnaryOps.step;
        this.tan = unary_ops_1.UnaryOps.tan;
        this.tanh = unary_ops_1.UnaryOps.tanh;
        this.norm = norm_1.NormOps.norm;
        this.basicLSTMCell = lstm_1.LSTMOps.basicLSTMCell;
        this.multiRNNCell = lstm_1.LSTMOps.multiRNNCell;
        this.softmax = softmax_1.SoftmaxOps.softmax;
        this.softmaxCrossEntropy = softmax_1.SoftmaxOps.softmaxCrossEntropy;
        this.cast = array_ops_1.ArrayOps.cast;
        this.clone = array_ops_1.ArrayOps.clone;
        this.gather = array_ops_1.ArrayOps.gather;
        this.reshape = array_ops_1.ArrayOps.reshape;
        this.tile = array_ops_1.ArrayOps.tile;
        this.oneHot = array_ops_1.ArrayOps.oneHot;
        this.multinomial = array_ops_1.ArrayOps.multinomial;
        this.pad1D = array_ops_1.ArrayOps.pad1d;
        this.pad2D = array_ops_1.ArrayOps.pad2d;
        this.resizeBilinear3D = image_ops_1.ImageOps.resizeBilinear;
        this.localResponseNormalization3D = lrn_1.LRNOps.localResponseNormalization;
        this.localResponseNormalization4D = lrn_1.LRNOps.localResponseNormalization;
        this.keep = tracking_1.Tracking.keep;
        environment_1.ENV.setMath(this, backend, safeMode);
        this.engine = environment_1.ENV.engine;
        this.dispose = environment_1.ENV.engine.dispose.bind(environment_1.ENV.engine);
        this.registeredVariables = environment_1.ENV.engine.registeredVariables;
        this.startScope = environment_1.ENV.engine.startScope.bind(environment_1.ENV.engine);
        this.endScope = environment_1.ENV.engine.endScope.bind(environment_1.ENV.engine);
    }
    NDArrayMath.prototype.scope = function (scopeFn) {
        var keepFn = function (tensor) { return keep(tensor); };
        var trackFn = function (tensor) { return tensor; };
        return tidy(function () { return scopeFn(keepFn, trackFn); });
    };
    NDArrayMath.prototype.track = function (result) {
        return result;
    };
    NDArrayMath.prototype.topK = function (x, k) {
        util.assert(k <= x.size, "Error in topK: k value (" + k + ") must be less than size of input " +
            ("tensor, got shape " + x.shape + "."));
        var values;
        var indices;
        tidy('topK', function () {
            values = environment_1.ENV.engine.runKernel(function (backend) { return backend.topKValues(x, k); }, { x: x });
            indices = environment_1.ENV.engine.runKernel(function (backend) { return backend.topKIndices(x, k); }, { x: x });
            return values;
        });
        var result = { values: values, indices: indices };
        return result;
    };
    NDArrayMath.prototype.elementWiseMul = function (a, b) {
        return a.mulStrict(b);
    };
    NDArrayMath.prototype.scalarDividedByArray = function (c, a) {
        util.assert(c.size === 1, "Error in scalarDividedByArray: first argument must be rank 0, but " +
            ("got Tensor of rank " + c.rank + "."));
        return c.div(a);
    };
    NDArrayMath.prototype.arrayDividedByScalar = function (a, c) {
        util.assert(c.size === 1, "Error in arrayDividedByScalar: second argument must be rank 0, " +
            ("but got Tensor of rank " + c.rank + "."));
        return a.div(c);
    };
    NDArrayMath.prototype.switchDim = function (x, perm) {
        return ops.transpose(x, perm);
    };
    NDArrayMath.prototype.scalarPlusArray = function (c, a) {
        util.assert(c.size === 1, "Error in scalarPlusArray: first argument must be rank 0, but got " +
            ("rank " + c.rank + "."));
        return this.add(c, a);
    };
    NDArrayMath.prototype.scalarMinusArray = function (c, a) {
        util.assert(c.size === 1, "Error in scalarMinusArray: first argument must be rank 0, but got " +
            ("rank " + c.rank + "."));
        return this.subtract(c, a);
    };
    NDArrayMath.prototype.arrayMinusScalar = function (a, c) {
        util.assert(c.size === 1, "Error in arrayMinusScalar: second argument must be rank 0, but " +
            ("got rank " + c.rank + "."));
        return this.subtract(a, c);
    };
    NDArrayMath.prototype.scaledArrayAdd = function (c1, a, c2, b) {
        var _this = this;
        util.assert(c1.size === 1, "Error in scaledArrayAdd: first argument must rank 0, but got " +
            (" rank " + c1.rank + "."));
        util.assert(c2.size === 1, "Error in scaledArrayAdd: third argument must be rank 0, but got " +
            ("Tensor of rank " + c2.rank + "."));
        util.assertShapesMatch(a.shape, b.shape, 'Error in scaledArrayAdd: ');
        return tidy('scaledArrayAdd', function () {
            return _this.add(_this.multiply(c1, a), _this.multiply(c2, b));
        });
    };
    NDArrayMath.prototype.scalarTimesArray = function (c, a) {
        util.assert(c.size === 1, "Error in arrayDividedByScalar: first argument must be rank 0, but " +
            ("got rank " + c.rank + "."));
        return this.multiply(c, a);
    };
    NDArrayMath.prototype.concat = function (a, b, axis) {
        return ops.concat([a, b], axis);
    };
    NDArrayMath.prototype.concat1D = function (a, b) {
        return ops.concat1d([a, b]);
    };
    NDArrayMath.prototype.concat2D = function (a, b, axis) {
        return ops.concat2d([a, b], axis);
    };
    NDArrayMath.prototype.concat3D = function (a, b, axis) {
        return ops.concat3d([a, b], axis);
    };
    NDArrayMath.prototype.concat4D = function (a, b, axis) {
        return ops.concat4d([a, b], axis);
    };
    NDArrayMath.prototype.conv1d = function (input, filter, bias, stride, pad, dimRoundingMode) {
        if (bias != null) {
            util.assert(bias.rank === 1, "Error in conv1d: bias must be rank 1, but got rank " +
                (bias.rank + "."));
        }
        var res = ops.conv1d(input, filter, stride, pad, dimRoundingMode);
        return res.add(bias);
    };
    NDArrayMath.prototype.conv2d = function (x, filter, bias, strides, pad, dimRoundingMode) {
        if (bias != null) {
            util.assert(bias.rank === 1, "Error in conv2d: bias must be rank 1, but got rank " +
                (bias.rank + "."));
        }
        var res = ops.conv2d(x, filter, strides, pad, dimRoundingMode);
        return res.add(bias);
    };
    NDArrayMath.prototype.argMaxEquals = function (x1, x2) {
        util.assertShapesMatch(x1.shape, x2.shape, 'Error in argMaxEquals: ');
        return x1.argMax().equal(x2.argMax());
    };
    return NDArrayMath;
}());
exports.NDArrayMath = NDArrayMath;

},{"./environment":35,"./ops/array_ops":105,"./ops/batchnorm":107,"./ops/binary_ops":108,"./ops/compare":110,"./ops/conv":113,"./ops/image_ops":115,"./ops/logical_ops":116,"./ops/lrn":117,"./ops/lstm":118,"./ops/matmul":119,"./ops/norm":120,"./ops/ops":122,"./ops/pool":123,"./ops/reduction_ops":126,"./ops/reverse":127,"./ops/slice":129,"./ops/softmax":131,"./ops/transpose":132,"./ops/unary_ops":133,"./tracking":148,"./util":151}],105:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var tensor_1 = require("../tensor");
var tensor_util = require("../tensor_util");
var util = require("../util");
var axis_util_1 = require("./axis_util");
var concat_1 = require("./concat");
var operation_1 = require("./operation");
var rand_1 = require("./rand");
var ArrayOps = (function () {
    function ArrayOps() {
    }
    ArrayOps.tensor = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var inferredShape = util.inferShape(values);
        if (shape != null && inferredShape.length !== 1) {
            util.assertShapesMatch(shape, inferredShape, "Error creating a new Tensor. " +
                ("Inferred shape (" + inferredShape + ") does not match the ") +
                ("provided shape (" + shape + "). "));
        }
        if (!util.isTypedArray(values) && !Array.isArray(values)) {
            values = [values];
        }
        shape = shape || inferredShape;
        return tensor_1.Tensor.make(shape, { values: toTypedArray(values, dtype) }, dtype);
    };
    ArrayOps.scalar = function (value, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        if (util.isTypedArray(value) || Array.isArray(value)) {
            throw new Error('Error creating a new Scalar: value must be a primitive ' +
                '(number|boolean)');
        }
        return ArrayOps.tensor(value, [], dtype);
    };
    ArrayOps.tensor1d = function (values, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var inferredShape = util.inferShape(values);
        if (inferredShape.length !== 1) {
            throw new Error('Error creating a new Tensor1D: values must be a flat/TypedArray');
        }
        return ArrayOps.tensor(values, inferredShape, dtype);
    };
    ArrayOps.tensor2d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var inferredShape = util.inferShape(values);
        if (inferredShape.length !== 2 && inferredShape.length !== 1) {
            throw new Error('Error creating a new Tensor2D: values must be number[][] ' +
                'or flat/TypedArray');
        }
        shape = shape || inferredShape;
        return ArrayOps.tensor(values, shape, dtype);
    };
    ArrayOps.tensor3d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var inferredShape = util.inferShape(values);
        if (inferredShape.length !== 3 && inferredShape.length !== 1) {
            throw new Error('Error creating a new Tensor3D: values must be number[][][]' +
                'or flat/TypedArray');
        }
        shape = shape || inferredShape;
        return ArrayOps.tensor(values, shape, dtype);
    };
    ArrayOps.tensor4d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var inferredShape = util.inferShape(values);
        if (inferredShape.length !== 4 && inferredShape.length !== 1) {
            throw new Error('Error creating a new Tensor4D: values must be number[][][][]' +
                'or flat/TypedArray');
        }
        shape = shape || inferredShape;
        return ArrayOps.tensor(values, shape, dtype);
    };
    ArrayOps.ones = function (shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var values = makeOnesTypedArray(util.sizeFromShape(shape), dtype);
        return tensor_1.Tensor.make(shape, { values: values }, dtype);
    };
    ArrayOps.zeros = function (shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var values = makeZerosTypedArray(util.sizeFromShape(shape), dtype);
        return tensor_1.Tensor.make(shape, { values: values }, dtype);
    };
    ArrayOps.fill = function (shape, value, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var values = util.getTypedArrayFromDType(dtype, util.sizeFromShape(shape));
        values.fill(value);
        return tensor_1.Tensor.make(shape, { values: values }, dtype);
    };
    ArrayOps.onesLike = function (x) {
        return ArrayOps.ones(x.shape, x.dtype);
    };
    ArrayOps.zerosLike = function (x) {
        return ArrayOps.zeros(x.shape, x.dtype);
    };
    ArrayOps.clone = function (x) {
        return tensor_1.Tensor.make(x.shape, { dataId: x.dataId }, x.dtype);
    };
    ArrayOps.randomNormal = function (shape, mean, stdDev, dtype, seed) {
        if (mean === void 0) { mean = 0; }
        if (stdDev === void 0) { stdDev = 1; }
        if (dtype != null && dtype === 'bool') {
            throw new Error("Unsupported data type " + dtype);
        }
        var randGauss = new rand_1.MPRandGauss(mean, stdDev, dtype, false, seed);
        return tensor_1.Tensor.rand(shape, function () { return randGauss.nextValue(); }, dtype);
    };
    ArrayOps.truncatedNormal = function (shape, mean, stdDev, dtype, seed) {
        if (mean === void 0) { mean = 0; }
        if (stdDev === void 0) { stdDev = 1; }
        if (dtype != null && dtype === 'bool') {
            throw new Error("Unsupported data type " + dtype);
        }
        var randGauss = new rand_1.MPRandGauss(mean, stdDev, dtype, true, seed);
        return tensor_1.Tensor.rand(shape, function () { return randGauss.nextValue(); }, dtype);
    };
    ArrayOps.randomUniform = function (shape, minval, maxval, dtype) {
        if (minval === void 0) { minval = 0; }
        if (maxval === void 0) { maxval = 1; }
        if (dtype === void 0) { dtype = 'float32'; }
        return tensor_1.Tensor.rand(shape, function () { return util.randUniform(minval, maxval); }, dtype);
    };
    ArrayOps.rand = function (shape, randFunction, dtype) {
        var size = util.sizeFromShape(shape);
        var values = null;
        if (dtype == null || dtype === 'float32') {
            values = new Float32Array(size);
        }
        else if (dtype === 'int32') {
            values = new Int32Array(size);
        }
        else if (dtype === 'bool') {
            values = new Uint8Array(size);
        }
        else {
            throw new Error("Unknown data type " + dtype);
        }
        for (var i = 0; i < size; i++) {
            values[i] = randFunction();
        }
        return tensor_1.Tensor.make(shape, { values: values }, dtype);
    };
    ArrayOps.multinomial = function (probabilities, numSamples, seed) {
        var numOutcomes = probabilities.size;
        var origRank = probabilities.rank;
        if (numOutcomes < 2) {
            throw new Error("Error in multinomial: you need at least 2 outcomes, but got " +
                (numOutcomes + "."));
        }
        if (origRank > 2) {
            throw new Error("Rank of probabilities must be 1 or 2, but is " + origRank);
        }
        seed = seed || Math.random();
        var prob2D = origRank === 1 ? probabilities.as2D(1, -1) : probabilities;
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.multinomial(prob2D, numSamples, seed); }, { prob2D: prob2D });
        return origRank === 1 ? res.as1D() : res;
    };
    ArrayOps.oneHot = function (indices, depth, onValue, offValue) {
        if (onValue === void 0) { onValue = 1; }
        if (offValue === void 0) { offValue = 0; }
        if (depth < 2) {
            throw new Error("Error in oneHot: depth must be >=2, but it is " + depth);
        }
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.oneHot(indices, depth, onValue, offValue); }, { indices: indices });
    };
    ArrayOps.fromPixels = function (pixels, numChannels) {
        if (numChannels === void 0) { numChannels = 3; }
        if (numChannels > 4) {
            throw new Error('Cannot construct Tensor with more than 4 channels from pixels.');
        }
        return environment_1.ENV.engine.fromPixels(pixels, numChannels);
    };
    ArrayOps.reshape = function (x, shape) {
        shape = util.inferFromImplicitShape(shape, x.size);
        util.assert(x.size === util.sizeFromShape(shape), 'new shape and old shape must have the same number of elements.');
        var grad = function (dy) {
            return { x: function () { return dy.reshape(x.shape); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return tensor_1.Tensor.make(shape, { dataId: x.dataId }, x.dtype); }, { x: x }, grad);
    };
    ArrayOps.squeeze = function (x, axis) {
        return ArrayOps.reshape(x, util.squeezeShape(x.shape, axis).newShape);
    };
    ArrayOps.cast = function (x, dtype) {
        var forw = function (backend) {
            if (!util.hasEncodingLoss(x.dtype, dtype)) {
                return tensor_1.Tensor.make(x.shape, { dataId: x.dataId }, dtype);
            }
            if (dtype === 'int32') {
                return backend.int(x);
            }
            else if (dtype === 'bool') {
                return backend.notEqual(x, ArrayOps.scalar(0, x.dtype));
            }
            else {
                throw new Error("Error in Cast: unknown dtype argument (" + dtype + ")");
            }
        };
        var grad = function (dy) {
            return { x: function () { return dy.clone(); } };
        };
        return environment_1.ENV.engine.runKernel(forw, { x: x }, grad);
    };
    ArrayOps.tile = function (x, reps) {
        util.assert(x.rank === reps.length, "Error in transpose: rank of input " + x.rank + " " +
            ("must match length of reps " + reps + "."));
        var grad = function (dy) {
            var derX = function () {
                var xGrad = ArrayOps.zerosLike(x);
                if (x.rank === 1) {
                    for (var i = 0; i < reps[0]; ++i) {
                        xGrad = xGrad.add(dy.slice([i * x.shape[0]], [x.shape[0]]));
                    }
                }
                else if (x.rank === 2) {
                    for (var i = 0; i < reps[0]; ++i) {
                        for (var j = 0; j < reps[1]; ++j) {
                            xGrad = xGrad.add(dy.slice([i * x.shape[0], j * x.shape[1]], [x.shape[0], x.shape[1]]));
                        }
                    }
                }
                else if (x.rank === 3) {
                    for (var i = 0; i < reps[0]; ++i) {
                        for (var j = 0; j < reps[1]; ++j) {
                            for (var k = 0; k < reps[2]; ++k) {
                                xGrad = xGrad.add(dy.slice([i * x.shape[0], j * x.shape[1], k * x.shape[2]], [x.shape[0], x.shape[1], x.shape[2]]));
                            }
                        }
                    }
                }
                else if (x.rank === 4) {
                    for (var i = 0; i < reps[0]; ++i) {
                        for (var j = 0; j < reps[1]; ++j) {
                            for (var k = 0; k < reps[2]; ++k) {
                                for (var l = 0; l < reps[3]; ++l) {
                                    xGrad = xGrad.add(dy.slice([i * x.shape[0], j * x.shape[1], k * x.shape[2],
                                        l * x.shape[3]], [x.shape[0], x.shape[1], x.shape[2], x.shape[3]]));
                                }
                            }
                        }
                    }
                }
                else {
                    throw new Error("Gradient for tile operation is not implemented for rank-" +
                        (x.rank + " tensors yet."));
                }
                return xGrad;
            };
            return { x: derX };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.tile(x, reps); }, { x: x }, grad);
    };
    ArrayOps.gather = function (x, indices, axis) {
        if (axis === void 0) { axis = 0; }
        var axes = axis_util_1.parseAxisParam(axis, x.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.gather(x, indices, axes[0]); }, { x: x, indices: indices });
    };
    ArrayOps.pad1d = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        util.assert(paddings.length === 2, 'Invalid number of paddings. Must be length of 2.');
        return ArrayOps.pad(x, [paddings], constantValue);
    };
    ArrayOps.pad2d = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        util.assert(paddings.length === 2 && paddings[0].length === 2 &&
            paddings[1].length === 2, 'Invalid number of paddings. Must be length of 2 each.');
        return ArrayOps.pad(x, paddings, constantValue);
    };
    ArrayOps.pad3d = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        util.assert(paddings.length === 3 && paddings[0].length === 2 &&
            paddings[1].length === 2 && paddings[2].length === 2, 'Invalid number of paddings. Must be length of 2 each.');
        return ArrayOps.pad(x, paddings, constantValue);
    };
    ArrayOps.pad4d = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        util.assert(paddings.length === 4 && paddings[0].length === 2 &&
            paddings[1].length === 2 && paddings[2].length === 2 &&
            paddings[3].length === 2, 'Invalid number of paddings. Must be length of 2 each.');
        return ArrayOps.pad(x, paddings, constantValue);
    };
    ArrayOps.pad = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        if (x.rank === 0) {
            throw new Error('pad(scalar) is not defined. Pass non-scalar to pad');
        }
        var begin = paddings.map(function (p) { return p[0]; });
        var grad = function (dy) {
            return { x: function () { return dy.slice(begin, x.shape); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.pad(x, paddings, constantValue); }, { x: x }, grad);
    };
    ArrayOps.stack = function (tensors, axis) {
        if (axis === void 0) { axis = 0; }
        util.assert(tensors.length >= 2, 'Pass at least two tensors to dl.stack');
        var rank = tensors[0].rank;
        var shape = tensors[0].shape;
        var dtype = tensors[0].dtype;
        util.assert(axis <= rank, 'Axis must be <= rank of the tensor');
        tensors.forEach(function (t) {
            util.assertShapesMatch(shape, t.shape, 'All tensors passed to stack must have matching shapes');
        });
        tensors.forEach(function (t) {
            util.assert(dtype === t.dtype, 'All tensors passed to stack must have matching dtypes');
        });
        var expandedTensors = tensors.map(function (t) { return t.expandDims(axis); });
        return concat_1.ConcatOps.concat(expandedTensors, axis);
    };
    ArrayOps.expandDims = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        util.assert(axis <= x.rank, 'Axis must be <= rank of the tensor');
        var newShape = x.shape.slice();
        newShape.splice(axis, 0, 1);
        return ArrayOps.reshape(x, newShape);
    };
    ArrayOps.linspace = function (start, stop, num) {
        if (num === 0) {
            throw new Error('Cannot request zero samples');
        }
        var step = (stop - start) / (num - 1);
        var values = makeZerosTypedArray(num, 'float32');
        values[0] = start;
        for (var i = 1; i < values.length; i++) {
            values[i] = values[i - 1] + step;
        }
        return tensor_1.Tensor1D.new(values, 'float32');
    };
    ArrayOps.range = function (start, stop, step, dtype) {
        if (step === void 0) { step = 1; }
        if (dtype === void 0) { dtype = 'float32'; }
        if (step === 0) {
            throw new Error('Cannot have a step of zero');
        }
        var sameStartStop = start === stop;
        var increasingRangeNegativeStep = start < stop && step < 0;
        var decreasingRangePositiveStep = stop < start && step > 1;
        if (sameStartStop || increasingRangeNegativeStep ||
            decreasingRangePositiveStep) {
            return ArrayOps.zeros([0], dtype);
        }
        var numElements = Math.abs(Math.ceil((stop - start) / step));
        var values = makeZerosTypedArray(numElements, dtype);
        if (stop < start && step === 1) {
            step = -1;
        }
        values[0] = start;
        for (var i = 1; i < values.length; i++) {
            values[i] = values[i - 1] + step;
        }
        return ArrayOps.tensor1d(values, dtype);
    };
    ArrayOps.buffer = function (shape, dtype, values) {
        if (dtype === void 0) { dtype = 'float32'; }
        return new tensor_1.TensorBuffer(shape, dtype, values);
    };
    ArrayOps.print = function (x, verbose) {
        if (verbose === void 0) { verbose = false; }
        console.log(tensor_util.tensorToString(x, verbose));
    };
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "tensor", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "scalar", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "tensor1d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "tensor2d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "tensor3d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "tensor4d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "ones", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "zeros", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "fill", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "onesLike", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "zerosLike", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "clone", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "randomNormal", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "truncatedNormal", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "randomUniform", null);
    __decorate([
        operation_1.operation
    ], ArrayOps, "rand", null);
    __decorate([
        operation_1.operation
    ], ArrayOps, "multinomial", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "oneHot", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "fromPixels", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' }),
        operation_1.operation
    ], ArrayOps, "reshape", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' })
    ], ArrayOps, "squeeze", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' }),
        operation_1.operation
    ], ArrayOps, "cast", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation_1.operation
    ], ArrayOps, "tile", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation_1.operation
    ], ArrayOps, "gather", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' }),
        operation_1.operation
    ], ArrayOps, "pad", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation_1.operation
    ], ArrayOps, "stack", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' }),
        operation_1.operation
    ], ArrayOps, "expandDims", null);
    __decorate([
        operation_1.operation,
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "linspace", null);
    __decorate([
        operation_1.operation,
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "range", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "buffer", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "print", null);
    return ArrayOps;
}());
exports.ArrayOps = ArrayOps;
function makeZerosTypedArray(size, dtype) {
    if (dtype == null || dtype === 'float32') {
        return new Float32Array(size);
    }
    else if (dtype === 'int32') {
        return new Int32Array(size);
    }
    else if (dtype === 'bool') {
        return new Uint8Array(size);
    }
    else {
        throw new Error("Unknown data type $ {dtype}");
    }
}
function makeOnesTypedArray(size, dtype) {
    var array = makeZerosTypedArray(size, dtype);
    for (var i = 0; i < array.length; i++) {
        array[i] = 1;
    }
    return array;
}
function toTypedArray(a, dtype) {
    if (noConversionNeeded(a, dtype)) {
        return a;
    }
    if (Array.isArray(a)) {
        a = util.flatten(a);
    }
    return util.copyTypedArray(a, dtype);
}
function noConversionNeeded(a, dtype) {
    return (a instanceof Float32Array && dtype === 'float32') ||
        (a instanceof Int32Array && dtype === 'int32') ||
        (a instanceof Uint8Array && dtype === 'bool');
}

},{"../doc":33,"../environment":35,"../tensor":145,"../tensor_util":146,"../util":151,"./axis_util":106,"./concat":111,"./operation":121,"./rand":124}],106:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("../util");
function axesAreInnerMostDims(axes, rank) {
    for (var i = 0; i < axes.length; ++i) {
        if (axes[axes.length - i - 1] !== rank - 1 - i) {
            return false;
        }
    }
    return true;
}
exports.axesAreInnerMostDims = axesAreInnerMostDims;
function combineLocations(outputLoc, reduceLoc, axes) {
    var rank = outputLoc.length + reduceLoc.length;
    var loc = [];
    var outIdx = 0;
    var reduceIdx = 0;
    for (var dim = 0; dim < rank; dim++) {
        if (axes.indexOf(dim) === -1) {
            loc.push(outputLoc[outIdx++]);
        }
        else {
            loc.push(reduceLoc[reduceIdx++]);
        }
    }
    return loc;
}
exports.combineLocations = combineLocations;
function computeOutAndReduceShapes(aShape, axes) {
    var outShape = [];
    var rank = aShape.length;
    for (var dim = 0; dim < rank; dim++) {
        if (axes.indexOf(dim) === -1) {
            outShape.push(aShape[dim]);
        }
    }
    var reduceShape = axes.map(function (dim) { return aShape[dim]; });
    return [outShape, reduceShape];
}
exports.computeOutAndReduceShapes = computeOutAndReduceShapes;
function expandShapeToKeepDim(shape, axes) {
    var reduceSubShape = axes.map(function (x) { return 1; });
    return combineLocations(shape, reduceSubShape, axes);
}
exports.expandShapeToKeepDim = expandShapeToKeepDim;
function parseAxisParam(axis, shape) {
    var rank = shape.length;
    axis = axis == null ? shape.map(function (s, i) { return i; }) : [].concat(axis);
    util.assert(axis.every(function (ax) { return ax >= -rank && ax < rank; }), "All values in axis param must be in range [-" + rank + ", " + rank + ") but " +
        ("got axis " + axis));
    util.assert(axis.every(function (ax) { return util.isInt(ax); }), "All values in axis param must be integers but " +
        ("got axis " + axis));
    return axis.map(function (a) { return a < 0 ? rank + a : a; });
}
exports.parseAxisParam = parseAxisParam;
function assertAxesAreInnerMostDims(msg, axes, rank) {
    util.assert(axesAreInnerMostDims(axes, rank), msg + " supports only inner-most axes for now. " +
        ("Got axes " + axes + " and rank-" + rank + " input."));
}
exports.assertAxesAreInnerMostDims = assertAxesAreInnerMostDims;
function getAxesPermutation(axes, rank) {
    if (axesAreInnerMostDims(axes, rank)) {
        return null;
    }
    var result = [];
    for (var i = 0; i < rank; ++i) {
        if (axes.indexOf(i) === -1) {
            result.push(i);
        }
    }
    axes.forEach(function (axis) { return result.push(axis); });
    return result;
}
exports.getAxesPermutation = getAxesPermutation;
function getUndoAxesPermutation(axes) {
    return axes.map(function (axis, i) { return [i, axis]; })
        .sort(function (a, b) { return a[1] - b[1]; })
        .map(function (x) { return x[0]; });
}
exports.getUndoAxesPermutation = getUndoAxesPermutation;
function getInnerMostAxes(numAxes, rank) {
    var res = [];
    for (var i = rank - numAxes; i < rank; ++i) {
        res.push(i);
    }
    return res;
}
exports.getInnerMostAxes = getInnerMostAxes;

},{"../util":151}],107:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var util = require("../util");
var operation_1 = require("./operation");
var BatchNormOps = (function () {
    function BatchNormOps() {
    }
    BatchNormOps.batchNormalization2d = function (x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        util.assert(x.rank === 2, "Error in batchNormalization3D: x must be rank 3 but got rank " +
            (x.rank + "."));
        util.assert(mean.rank === 2 || mean.rank === 1, "Error in batchNormalization2D: mean must be rank 2 or rank 1 but " +
            ("got rank " + mean.rank + "."));
        util.assert(variance.rank === 2 || variance.rank === 1, "Error in batchNormalization2D: variance must be rank 2 or rank 1 " +
            ("but got rank " + variance.rank + "."));
        if (scale != null) {
            util.assert(scale.rank === 2 || scale.rank === 1, "Error in batchNormalization2D: scale must be rank 2 or rank 1 " +
                ("but got rank " + scale.rank + "."));
        }
        if (offset != null) {
            util.assert(offset.rank === 2 || offset.rank === 1, "Error in batchNormalization2D: offset must be rank 2 or rank 1 " +
                ("but got rank " + offset.rank + "."));
        }
        return BatchNormOps.batchNormalization(x, mean, variance, varianceEpsilon, scale, offset);
    };
    BatchNormOps.batchNormalization3d = function (x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        util.assert(x.rank === 3, "Error in batchNormalization3D: x must be rank 3 but got rank " +
            (x.rank + "."));
        util.assert(mean.rank === 3 || mean.rank === 1, "Error in batchNormalization3D: mean must be rank 3 or rank 1 but " +
            ("got rank " + mean.rank + "."));
        util.assert(variance.rank === 3 || variance.rank === 1, "Error in batchNormalization3D: variance must be rank 3 or rank 1 " +
            ("but got rank " + variance.rank + "."));
        if (scale != null) {
            util.assert(scale.rank === 3 || scale.rank === 1, "Error in batchNormalization3D: scale must be rank 3 or rank 1 " +
                ("but got rank " + scale.rank + "."));
        }
        if (offset != null) {
            util.assert(offset.rank === 3 || offset.rank === 1, "Error in batchNormalization3D: offset must be rank 3 or rank 1 " +
                ("but got rank " + offset.rank + "."));
        }
        return BatchNormOps.batchNormalization(x, mean, variance, varianceEpsilon, scale, offset);
    };
    BatchNormOps.batchNormalization4d = function (x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        util.assert(x.rank === 4, "Error in batchNormalization4D: x must be rank 4 but got rank " +
            (x.rank + "."));
        util.assert(mean.rank === 4 || mean.rank === 1, "Error in batchNormalization4D: mean must be rank 4 or rank 1 but " +
            ("got rank " + mean.rank + "."));
        util.assert(variance.rank === 4 || variance.rank === 1, "Error in batchNormalization4D: variance must be rank 4 or rank 1 " +
            ("but got rank " + variance.rank + "."));
        if (scale != null) {
            util.assert(scale.rank === 4 || scale.rank === 1, "Error in batchNormalization4D: scale must be rank 4 or rank 1 " +
                ("but got rank " + scale.rank + "."));
        }
        if (offset != null) {
            util.assert(offset.rank === 4 || offset.rank === 1, "Error in batchNormalization4D: offset must be rank 4 or rank 1 " +
                ("but got rank " + offset.rank + "."));
        }
        return BatchNormOps.batchNormalization(x, mean, variance, varianceEpsilon, scale, offset);
    };
    BatchNormOps.batchNormalization = function (x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        var x4D;
        if (x.rank === 0 || x.rank === 1) {
            x4D = x.as4D(1, 1, 1, x.size);
        }
        else if (x.rank === 2) {
            x4D = x.as4D(1, 1, x.shape[0], x.shape[1]);
        }
        else if (x.rank === 3) {
            x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        else {
            x4D = x;
        }
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.batchNormalization4D(x4D, batchnormReshape4D(mean), batchnormReshape4D(variance), varianceEpsilon, batchnormReshape4D(scale), batchnormReshape4D(offset)); }, { x: x, mean: mean, variance: variance });
        return res.reshape(x.shape);
    };
    __decorate([
        operation_1.operation
    ], BatchNormOps, "batchNormalization2d", null);
    __decorate([
        operation_1.operation
    ], BatchNormOps, "batchNormalization3d", null);
    __decorate([
        operation_1.operation
    ], BatchNormOps, "batchNormalization4d", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Normalization' })
    ], BatchNormOps, "batchNormalization", null);
    return BatchNormOps;
}());
exports.BatchNormOps = BatchNormOps;
function batchnormReshape4D(x) {
    if (x == null) {
        return null;
    }
    if (x.rank === 0) {
        return x.as1D();
    }
    else if (x.rank === 1) {
        return x;
    }
    else if (x.rank === 2) {
        return x.as4D(1, 1, x.shape[0], x.shape[1]);
    }
    else if (x.rank === 3) {
        return x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
    }
    return x;
}

},{"../doc":33,"../environment":35,"../util":151,"./operation":121}],108:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var util = require("../util");
var broadcast_util = require("./broadcast_util");
var operation_1 = require("./operation");
var ops_1 = require("./ops");
var BinaryOps = (function () {
    function BinaryOps() {
    }
    BinaryOps.add = function (a, b) {
        util.assertTypesMatch(a, b);
        var outShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy;
                var reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape(a.shape);
            };
            var derB = function () {
                var res = dy;
                var reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape(b.shape);
            };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.add(a, b); }, { a: a, b: b }, der);
    };
    BinaryOps.addStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in addStrict: ');
        return a.add(b);
    };
    BinaryOps.sub = function (a, b) {
        util.assertTypesMatch(a, b);
        var outShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy;
                var reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape(a.shape);
            };
            var derB = function () {
                var res = dy;
                var reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.neg().reshape(b.shape);
            };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.subtract(a, b); }, { a: a, b: b }, der);
    };
    BinaryOps.subStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in subStrict: ');
        return a.sub(b);
    };
    BinaryOps.pow = function (base, exp) {
        broadcast_util.assertAndGetBroadcastShape(base.shape, exp.shape);
        var grad = function (dy) {
            if (!util.arraysEqual(base.shape, exp.shape) &&
                !util.isScalarShape(exp.shape)) {
                throw new Error("Gradient of pow not yet supported for broadcasted shapes.");
            }
            var derBase = function () {
                var expFloat = exp.toFloat();
                var dx = expFloat.mul(base.toFloat().pow(expFloat.sub(ops_1.scalar(1))));
                return dy.mulStrict(dx);
            };
            return { base: derBase };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.pow(base, exp); }, { base: base }, grad);
    };
    BinaryOps.powStrict = function (base, exp) {
        util.assertShapesMatch(base.shape, exp.shape, 'Error in powStrict: ');
        return base.pow(exp);
    };
    BinaryOps.mul = function (a, b) {
        util.assertTypesMatch(a, b);
        var outShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy.mul(b.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape(a.shape);
                }
                return res;
            };
            var derB = function () {
                var res = dy.mul(a.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape(b.shape);
                }
                return res;
            };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.multiply(a, b); }, { a: a, b: b }, der);
    };
    BinaryOps.mulStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in multiplyStrict: ');
        return a.mul(b);
    };
    BinaryOps.div = function (a, b) {
        var outShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy.div(b.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape(a.shape);
                }
                return res;
            };
            var derB = function () {
                var res = dy.mul(a.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes).reshape(b.shape);
                }
                var tmp = b.square();
                return res.div(tmp.toFloat()).neg();
            };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.divide(a, b); }, { a: a, b: b }, der);
    };
    BinaryOps.divStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in divideStrict: ');
        return a.div(b);
    };
    BinaryOps.minimum = function (a, b) {
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy) {
            var derA = function () { return dy.mul(a.lessEqual(b).toFloat()); };
            var derB = function () { return dy.mul(a.greater(b).toFloat()); };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.minimum(a, b); }, { a: a, b: b }, der);
    };
    BinaryOps.minimumStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in minimumStrict: ');
        return a.minimum(b);
    };
    BinaryOps.maximum = function (a, b) {
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy) {
            var derA = function () { return dy.mul(a.greaterEqual(b).toFloat()); };
            var derB = function () { return dy.mul(a.less(b).toFloat()); };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.maximum(a, b); }, { a: a, b: b }, der);
    };
    BinaryOps.maximumStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in minimumStrict: ');
        return a.maximum(b);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], BinaryOps, "add", null);
    __decorate([
        operation_1.operation
    ], BinaryOps, "addStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], BinaryOps, "sub", null);
    __decorate([
        operation_1.operation
    ], BinaryOps, "subStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], BinaryOps, "pow", null);
    __decorate([
        operation_1.operation
    ], BinaryOps, "powStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], BinaryOps, "mul", null);
    __decorate([
        operation_1.operation
    ], BinaryOps, "mulStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], BinaryOps, "div", null);
    __decorate([
        operation_1.operation
    ], BinaryOps, "divStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], BinaryOps, "minimum", null);
    __decorate([
        operation_1.operation
    ], BinaryOps, "minimumStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], BinaryOps, "maximum", null);
    __decorate([
        operation_1.operation
    ], BinaryOps, "maximumStrict", null);
    return BinaryOps;
}());
exports.BinaryOps = BinaryOps;

},{"../doc":33,"../environment":35,"../util":151,"./broadcast_util":109,"./operation":121,"./ops":122}],109:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getBroadcastDims(inShape, outShape) {
    var inRank = inShape.length;
    var dims = [];
    for (var i = 0; i < inRank; i++) {
        var dim = inRank - 1 - i;
        var a = inShape[dim] || 1;
        var b = outShape[outShape.length - 1 - i] || 1;
        if (b > 1 && a === 1) {
            dims.unshift(dim);
        }
    }
    return dims;
}
exports.getBroadcastDims = getBroadcastDims;
function getReductionAxes(inShape, outShape) {
    var result = [];
    for (var i = 0; i < outShape.length; i++) {
        var inDim = inShape[inShape.length - i - 1];
        var outAxis = outShape.length - i - 1;
        var outDim = outShape[outAxis];
        if (inDim == null || (inDim === 1 && outDim > 1)) {
            result.unshift(outAxis);
        }
    }
    return result;
}
exports.getReductionAxes = getReductionAxes;
function broadcastDimsAreOuter(dims) {
    for (var i = 0; i < dims.length; i++) {
        if (dims[i] !== i) {
            return false;
        }
    }
    return true;
}
exports.broadcastDimsAreOuter = broadcastDimsAreOuter;
function assertAndGetBroadcastShape(shapeA, shapeB) {
    var result = [];
    var errMsg = "Operands could not be broadcast together with shapes " +
        (shapeA + " and " + shapeB + ".");
    var l = Math.max(shapeA.length, shapeB.length);
    for (var i = 0; i < l; i++) {
        var a = shapeA[shapeA.length - i - 1] || 1;
        var b = shapeB[shapeB.length - i - 1] || 1;
        if (a > 1 && b > 1 && a !== b) {
            throw Error(errMsg);
        }
        result.unshift(Math.max(a, b));
    }
    return result;
}
exports.assertAndGetBroadcastShape = assertAndGetBroadcastShape;

},{}],110:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var util = require("../util");
var broadcast_util = require("./broadcast_util");
var operation_1 = require("./operation");
var CompareOps = (function () {
    function CompareOps() {
    }
    CompareOps.notEqual = function (a, b) {
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.notEqual(a, b); }, { a: a, b: b });
    };
    CompareOps.notEqualStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in notEqualStrict: ');
        return a.notEqual(b);
    };
    CompareOps.less = function (a, b) {
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.less(a, b); }, { a: a, b: b });
    };
    CompareOps.lessStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in lessStrict: ');
        return a.less(b);
    };
    CompareOps.equal = function (a, b) {
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.equal(a, b); }, { a: a, b: b });
    };
    CompareOps.equalStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in equalStrict: ');
        return a.equal(b);
    };
    CompareOps.lessEqual = function (a, b) {
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.lessEqual(a, b); }, { a: a, b: b });
    };
    CompareOps.lessEqualStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in lessEqualStrict: ');
        return a.lessEqual(b);
    };
    CompareOps.greater = function (a, b) {
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.greater(a, b); }, { a: a, b: b });
    };
    CompareOps.greaterStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in greaterStrict: ');
        return a.greater(b);
    };
    CompareOps.greaterEqual = function (a, b) {
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.greaterEqual(a, b); }, { a: a, b: b });
    };
    CompareOps.greaterEqualStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in greaterEqualStrict: ');
        return a.greaterEqual(b);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], CompareOps, "notEqual", null);
    __decorate([
        operation_1.operation
    ], CompareOps, "notEqualStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], CompareOps, "less", null);
    __decorate([
        operation_1.operation
    ], CompareOps, "lessStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], CompareOps, "equal", null);
    __decorate([
        operation_1.operation
    ], CompareOps, "equalStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], CompareOps, "lessEqual", null);
    __decorate([
        operation_1.operation
    ], CompareOps, "lessEqualStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], CompareOps, "greater", null);
    __decorate([
        operation_1.operation
    ], CompareOps, "greaterStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], CompareOps, "greaterEqual", null);
    __decorate([
        operation_1.operation
    ], CompareOps, "greaterEqualStrict", null);
    return CompareOps;
}());
exports.CompareOps = CompareOps;

},{"../doc":33,"../environment":35,"../util":151,"./broadcast_util":109,"./operation":121}],111:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var util = require("../util");
var axis_util_1 = require("./axis_util");
var concat_util = require("./concat_util");
var operation_1 = require("./operation");
var ConcatOps = (function () {
    function ConcatOps() {
    }
    ConcatOps.concat1d = function (tensors) {
        return ConcatOps.concat(tensors, 0);
    };
    ConcatOps.concat2d = function (tensors, axis) {
        return ConcatOps.concat(tensors, axis);
    };
    ConcatOps.concat3d = function (tensors, axis) {
        return ConcatOps.concat(tensors, axis);
    };
    ConcatOps.concat4d = function (tensors, axis) {
        return ConcatOps.concat(tensors, axis);
    };
    ConcatOps.concat = function (tensors, axis) {
        if (axis === void 0) { axis = 0; }
        util.assert(tensors.length >= 2, 'Pass at least two tensors to concat');
        var result = tensors[0];
        var axes = axis_util_1.parseAxisParam(axis, result.shape);
        for (var i = 1; i < tensors.length; ++i) {
            result = concat2Tensors(result, tensors[i], axes[0]);
        }
        return result;
    };
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation_1.operation
    ], ConcatOps, "concat", null);
    return ConcatOps;
}());
exports.ConcatOps = ConcatOps;
function concat2Tensors(a, b, axis) {
    concat_util.assertParams(a.shape, b.shape, axis);
    var outShape = concat_util.computeOutShape(a.shape, b.shape, axis);
    var a2D = a.as2D(-1, util.sizeFromShape(a.shape.slice(axis)));
    var b2D = b.as2D(-1, util.sizeFromShape(b.shape.slice(axis)));
    var _a = concat_util.computeGradientSliceShapes(a2D.shape, b2D.shape), aBegin = _a.aBegin, aSize = _a.aSize, bBegin = _a.bBegin, bSize = _a.bSize;
    var der = function (dy) {
        return { a: function () { return dy.slice(aBegin, aSize); }, b: function () { return dy.slice(bBegin, bSize); } };
    };
    var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.concat(a2D, b2D); }, { a: a2D, b: b2D }, der);
    return res.reshape(outShape);
}

},{"../doc":33,"../environment":35,"../util":151,"./axis_util":106,"./concat_util":112,"./operation":121}],112:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("../util");
function assertParams(aShape, bShape, axis) {
    var aRank = aShape.length;
    var bRank = bShape.length;
    util.assert(aShape.length === bShape.length, "Error in concat" + aRank + "D: rank of x1 (" + aRank + ") and x2 (" + bRank + ") " +
        "must be the same.");
    util.assert(axis >= 0 && axis < aRank, "Error in concat" + aRank + "D: axis must be " +
        ("between 0 and " + (aRank - 1) + "."));
    for (var i = 0; i < aRank; i++) {
        util.assert((i === axis) || (aShape[i] === bShape[i]), "Error in concat" + aRank + "D: Shape (" + aShape + ") does not match " +
            ("(" + bShape + ") along the non-concatenated axis " + i + "."));
    }
}
exports.assertParams = assertParams;
function computeOutShape1D(x1Shape, x2Shape) {
    util.assert(x1Shape.length === 1 && x2Shape.length === 1, 'x1 and x2 should be 1d array.');
    var outputShape = x1Shape.slice();
    outputShape[0] += x2Shape[0];
    return outputShape;
}
exports.computeOutShape1D = computeOutShape1D;
function computeOutShape(x1Shape, x2Shape, axis) {
    util.assert(x1Shape.length === x2Shape.length, 'x1 and x2 should have the same rank.');
    var outputShape = x1Shape.slice();
    outputShape[axis] += x2Shape[axis];
    return outputShape;
}
exports.computeOutShape = computeOutShape;
function computeGradientSliceShapes(aShape, bShape) {
    return {
        aBegin: [0, 0],
        aSize: aShape,
        bBegin: [0, aShape[1]],
        bSize: bShape
    };
}
exports.computeGradientSliceShapes = computeGradientSliceShapes;

},{"../util":151}],113:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var util = require("../util");
var conv_util = require("./conv_util");
var operation_1 = require("./operation");
var ConvOps = (function () {
    function ConvOps() {
    }
    ConvOps.conv1d = function (input, filter, stride, pad, dimRoundingMode) {
        var input3D = input;
        var reshapedTo3D = false;
        if (input.rank === 2) {
            reshapedTo3D = true;
            input3D = input.as3D(1, input.shape[0], input.shape[1]);
        }
        util.assert(input3D.rank === 3, "Error in conv1d: input must be rank 3, but got rank " + input3D.rank + ".");
        util.assert(filter.rank === 3, "Error in conv1d: filter must be rank 3, but got rank " +
            (filter.rank + "."));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in conv1d: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        util.assert(input3D.shape[2] === filter.shape[1], "Error in conv1d: depth of input (" + input3D.shape[2] + ") must match  " +
            ("input depth for filter " + filter.shape[1] + "."));
        var filter4D = filter.as4D(1, filter.shape[0], filter.shape[1], filter.shape[2]);
        var input4D = input3D.as4D(input3D.shape[0], 1, input3D.shape[1], input3D.shape[2]);
        var strides = [1, stride];
        var res = ConvOps.conv2d(input4D, filter4D, strides, pad, dimRoundingMode);
        if (reshapedTo3D) {
            return res.as2D(res.shape[2], res.shape[3]);
        }
        return res.as3D(res.shape[0], res.shape[2], res.shape[3]);
    };
    ConvOps.conv2d = function (x, filter, strides, pad, dimRoundingMode) {
        var x4D = x;
        var reshapedTo4D = false;
        if (x.rank === 3) {
            reshapedTo4D = true;
            x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        util.assert(x4D.rank === 4, "Error in conv2d: input must be rank 4, but got rank " + x4D.rank + ".");
        util.assert(filter.rank === 4, "Error in conv2d: filter must be rank 4, but got rank " +
            (filter.rank + "."));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in conv2d: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        util.assert(x4D.shape[3] === filter.shape[2], "Error in conv2d: depth of input (" + x4D.shape[3] + ") must match  " +
            ("input depth for filter " + filter.shape[2] + "."));
        var dilations = 1;
        var convInfo = conv_util.computeConv2DInfo(x4D.shape, filter.shape, strides, dilations, pad, dimRoundingMode);
        var grad = function (dy) {
            return {
                x: function () { return ConvOps.conv2dDerInput(x4D.shape, dy, filter, strides, pad); },
                filter: function () {
                    return ConvOps.conv2dDerFilter(x4D, dy, filter.shape, strides, pad);
                }
            };
        };
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.conv2d(x4D, filter, convInfo); }, { x: x4D, filter: filter }, grad);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    ConvOps.conv2dDerInput = function (xShape, dy, filter, strides, pad, dimRoundingMode) {
        util.assert(xShape.length === dy.rank, "Length of inShape " +
            ("(" + xShape.length + ") and rank of dy (" + dy.rank + ") must match"));
        var xShape4D = xShape;
        var dy4D = dy;
        var reshapedTo4D = false;
        if (dy.rank === 3) {
            reshapedTo4D = true;
            dy4D = dy.as4D(1, dy.shape[0], dy.shape[1], dy.shape[2]);
            xShape4D = [1, xShape[0], xShape[1], xShape[2]];
        }
        var inDepth = xShape4D[3];
        var outDepth = dy4D.shape[3];
        util.assert(xShape4D.length === 4, "Error in conv2dDerInput: inShape must be length 4, but got length " +
            (xShape4D.length + "."));
        util.assert(dy4D.rank === 4, "Error in conv2dDerInput: dy must be rank 4, but got " +
            ("rank " + dy4D.rank));
        util.assert(filter.rank === 4, "Error in conv2dDerInput: filter must be rank 4, but got " +
            ("rank " + filter.rank));
        util.assert(inDepth === filter.shape[2], "Error in conv2dDerInput: depth of input (" + inDepth + ") must " +
            ("match input depth for filter " + filter.shape[2] + "."));
        util.assert(outDepth === filter.shape[3], "Error in conv2dDerInput: depth of output (" + outDepth + ") must" +
            ("match output depth for filter " + filter.shape[3] + "."));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in conv2dDerInput: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var dilations = 1;
        var convInfo = conv_util.computeConv2DInfo(xShape4D, filter.shape, strides, dilations, pad, dimRoundingMode);
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.conv2dDerInput(dy4D, filter, convInfo); }, { dy4D: dy4D });
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    ConvOps.conv2dDerFilter = function (x, dy, filterShape, strides, pad, dimRoundingMode) {
        var x4D = x;
        if (x.rank === 3) {
            x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        var dy4D = dy;
        if (dy4D.rank === 3) {
            dy4D = dy.as4D(1, dy.shape[0], dy.shape[1], dy.shape[2]);
        }
        util.assert(x4D.rank === 4, "Error in conv2dDerFilter: input must be rank 4, but got shape " +
            (x4D.shape + "."));
        util.assert(dy4D.rank === 4, "Error in conv2dDerFilter: dy must be rank 4, but got shape " +
            (dy4D.shape + "."));
        util.assert(filterShape.length === 4, "Error in conv2dDerFilter: filterShape must be length 4, but got " +
            (filterShape + "."));
        util.assert(x4D.shape[3] === filterShape[2], "Error in conv2dDerFilter: depth of input " + x4D.shape[3] + ") must " +
            ("match input depth in filter (" + filterShape[2] + "."));
        util.assert(dy4D.shape[3] === filterShape[3], "Error in conv2dDerFilter: depth of dy (" + dy4D.shape[3] + ") must " +
            ("match output depth for filter (" + filterShape[3] + ")."));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in conv2dDerFilter: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var dilations = 1;
        var convInfo = conv_util.computeConv2DInfo(x4D.shape, filterShape, strides, dilations, pad, dimRoundingMode);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.conv2dDerFilter(x4D, dy4D, convInfo); }, { x4D: x4D, dy4D: dy4D });
    };
    ConvOps.conv2dTranspose = function (x, filter, outputShape, strides, pad, dimRoundingMode) {
        return ConvOps.conv2dDerInput(outputShape, x, filter, strides, pad, dimRoundingMode);
    };
    ConvOps.depthwiseConv2d = function (input, filter, strides, pad, dilations, dimRoundingMode) {
        if (dilations === void 0) { dilations = [1, 1]; }
        var input4D = input;
        var reshapedTo4D = false;
        if (input.rank === 3) {
            reshapedTo4D = true;
            input4D = input.as4D(1, input.shape[0], input.shape[1], input.shape[2]);
        }
        util.assert(input4D.rank === 4, "Error in depthwiseConv2D: input must be rank 4, but got " +
            ("rank " + input4D.rank + "."));
        util.assert(filter.rank === 4, "Error in depthwiseConv2D: filter must be rank 4, but got rank " +
            (filter.rank + "."));
        util.assert(input4D.shape[3] === filter.shape[2], "Error in depthwiseConv2D: number of input channels " +
            ("(" + input4D.shape[3] + ") must match the inChannels dimension in ") +
            ("filter " + filter.shape[2] + "."));
        if (dilations == null) {
            dilations = [1, 1];
        }
        var _a = parseTupleParam(dilations), dilationHeight = _a[0], dilationWidth = _a[1];
        util.assert(dilationHeight === 1 && dilationWidth === 1, 'Error in depthwiseConv2D: dilation rates greater than 1 are not yet ' +
            ("supported. Got dilations '" + dilations + "'"));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in depthwiseConv2D: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var convInfo = conv_util.computeConv2DInfo(input4D.shape, filter.shape, strides, dilations, pad, dimRoundingMode, true);
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.depthwiseConv2D(input4D, filter, convInfo); }, { input4D: input4D, filter: filter });
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Convolution' }),
        operation_1.operation
    ], ConvOps, "conv1d", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Convolution' }),
        operation_1.operation
    ], ConvOps, "conv2d", null);
    __decorate([
        operation_1.operation
    ], ConvOps, "conv2dDerInput", null);
    __decorate([
        operation_1.operation
    ], ConvOps, "conv2dDerFilter", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Convolution' }),
        operation_1.operation
    ], ConvOps, "conv2dTranspose", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Convolution' }),
        operation_1.operation
    ], ConvOps, "depthwiseConv2d", null);
    return ConvOps;
}());
exports.ConvOps = ConvOps;
function parseTupleParam(param) {
    return typeof param === 'number' ? [param, param] : param;
}

},{"../doc":33,"../environment":35,"../util":151,"./conv_util":114,"./operation":121}],114:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("../util");
function computePool2DInfo(inShape, filterSize, strides, pad, roundingMode, dataFormat) {
    if (dataFormat === void 0) { dataFormat = 'channelsLast'; }
    var _a = parseTupleParam(filterSize), filterHeight = _a[0], filterWidth = _a[1];
    var filterShape;
    if (dataFormat === 'channelsLast') {
        filterShape = [filterHeight, filterWidth, inShape[3], inShape[3]];
    }
    else if (dataFormat === 'channelsFirst') {
        filterShape = [filterHeight, filterWidth, inShape[1], inShape[1]];
    }
    else {
        throw new Error("Unknown dataFormat " + dataFormat);
    }
    var dilations = 1;
    return computeConv2DInfo(inShape, filterShape, strides, dilations, pad, roundingMode, false, dataFormat);
}
exports.computePool2DInfo = computePool2DInfo;
function computeConv2DInfo(inShape, filterShape, strides, dilations, pad, roundingMode, depthwise, dataFormat) {
    if (depthwise === void 0) { depthwise = false; }
    if (dataFormat === void 0) { dataFormat = 'channelsLast'; }
    var _a = [-1, -1, -1, -1], batchSize = _a[0], inHeight = _a[1], inWidth = _a[2], inChannels = _a[3];
    if (dataFormat === 'channelsLast') {
        batchSize = inShape[0], inHeight = inShape[1], inWidth = inShape[2], inChannels = inShape[3];
    }
    else if (dataFormat === 'channelsFirst') {
        batchSize = inShape[0], inChannels = inShape[1], inHeight = inShape[2], inWidth = inShape[3];
    }
    else {
        throw new Error("Unknown dataFormat " + dataFormat);
    }
    var filterHeight = filterShape[0], filterWidth = filterShape[1], filterChannels = filterShape[3];
    var _b = parseTupleParam(strides), strideHeight = _b[0], strideWidth = _b[1];
    var _c = parseTupleParam(dilations), dilationHeight = _c[0], dilationWidth = _c[1];
    var effectiveFilterHeight = getEffectiveFilterSize(filterHeight, dilationHeight);
    var effectiveFilterWidth = getEffectiveFilterSize(filterWidth, dilationWidth);
    var _d = getPadAndOutInfo(pad, inHeight, inWidth, strideHeight, strideWidth, effectiveFilterHeight, effectiveFilterWidth, roundingMode), padInfo = _d.padInfo, outHeight = _d.outHeight, outWidth = _d.outWidth;
    var outChannels = depthwise ? filterChannels * inChannels : filterChannels;
    var outShape;
    if (dataFormat === 'channelsFirst') {
        outShape = [batchSize, outChannels, outHeight, outWidth];
    }
    else if (dataFormat === 'channelsLast') {
        outShape = [batchSize, outHeight, outWidth, outChannels];
    }
    return {
        batchSize: batchSize,
        dataFormat: dataFormat,
        inHeight: inHeight,
        inWidth: inWidth,
        inChannels: inChannels,
        outHeight: outHeight,
        outWidth: outWidth,
        outChannels: outChannels,
        padInfo: padInfo,
        strideHeight: strideHeight,
        strideWidth: strideWidth,
        filterHeight: filterHeight,
        filterWidth: filterWidth,
        inShape: inShape,
        outShape: outShape,
        filterShape: filterShape
    };
}
exports.computeConv2DInfo = computeConv2DInfo;
function computeOutputShape3D(inShape, fieldSize, outDepth, stride, zeroPad, roundingMode) {
    if (zeroPad == null) {
        zeroPad = computeDefaultPad(inShape, fieldSize, stride);
    }
    var inputRows = inShape[0];
    var inputCols = inShape[1];
    var outputRows = conditionalRound((inputRows - fieldSize + 2 * zeroPad) / stride + 1, roundingMode);
    util.assert(util.isInt(outputRows), "The output # of rows (" + outputRows + ") must be an integer. Change the " +
        "stride and/or zero pad parameters");
    var outputCols = conditionalRound((inputCols - fieldSize + 2 * zeroPad) / stride + 1, roundingMode);
    util.assert(util.isInt(outputCols), "The output # of columns (" + outputCols + ") must be an integer. Change " +
        "the stride and/or zero pad parameters");
    return [outputRows, outputCols, outDepth];
}
exports.computeOutputShape3D = computeOutputShape3D;
function computeDefaultPad(inputShape, fieldSize, stride) {
    return Math.floor((inputShape[0] * (stride - 1) - stride + fieldSize) / 2);
}
exports.computeDefaultPad = computeDefaultPad;
function computeWeightsShape4D(inputDepth, outputDepth, filterHeight, filterWidth) {
    return [filterHeight, filterWidth, inputDepth, outputDepth];
}
exports.computeWeightsShape4D = computeWeightsShape4D;
function computeDilatedRC(rc, origStride) {
    var rowsDilated = (rc[0] - 1) * origStride + 1;
    var colsDilated = (rc[1] - 1) * origStride + 1;
    return [rowsDilated, colsDilated];
}
exports.computeDilatedRC = computeDilatedRC;
function parseTupleParam(param) {
    return typeof param === 'number' ? [param, param] : param;
}
function getEffectiveFilterSize(filterSize, dilation) {
    if (dilation <= 1) {
        return filterSize;
    }
    return filterSize + (filterSize - 1) * (dilation - 1);
}
function getPadAndOutInfo(pad, inHeight, inWidth, strideHeight, strideWidth, filterHeight, filterWidth, roundingMode) {
    var padInfo;
    var outHeight;
    var outWidth;
    if (typeof pad === 'number') {
        padInfo = { top: pad, bottom: pad, left: pad, right: pad };
        var outShape = computeOutputShape3D([inHeight, inWidth, 1], filterHeight, 1, strideHeight, pad, roundingMode);
        outHeight = outShape[0];
        outWidth = outShape[1];
    }
    else if (pad === 'same') {
        outHeight = Math.ceil(inHeight / strideHeight);
        outWidth = Math.ceil(inWidth / strideWidth);
        var padAlongHeight = (outHeight - 1) * strideHeight + filterHeight - inHeight;
        var padAlongWidth = (outWidth - 1) * strideWidth + filterWidth - inWidth;
        var top_1 = Math.floor(padAlongHeight / 2);
        var bottom = padAlongHeight - top_1;
        var left = Math.floor(padAlongWidth / 2);
        var right = padAlongWidth - left;
        padInfo = { top: top_1, bottom: bottom, left: left, right: right };
    }
    else if (pad === 'valid') {
        padInfo = { top: 0, bottom: 0, left: 0, right: 0 };
        outHeight = Math.ceil((inHeight - filterHeight + 1) / strideHeight);
        outWidth = Math.ceil((inWidth - filterWidth + 1) / strideWidth);
    }
    else {
        throw Error("Unknown padding parameter: " + pad);
    }
    return { padInfo: padInfo, outHeight: outHeight, outWidth: outWidth };
}
function conditionalRound(value, roundingMode) {
    if (!roundingMode) {
        return value;
    }
    switch (roundingMode) {
        case 'round':
            return Math.round(value);
        case 'ceil':
            return Math.ceil(value);
        case 'floor':
            return Math.floor(value);
        default:
            throw new Error("Unknown roundingMode " + roundingMode);
    }
}

},{"../util":151}],115:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var util = require("../util");
var operation_1 = require("./operation");
var ImageOps = (function () {
    function ImageOps() {
    }
    ImageOps.resizeBilinear = function (images, size, alignCorners) {
        if (alignCorners === void 0) { alignCorners = false; }
        util.assert(images.rank === 3 || images.rank === 4, "Error in resizeBilinear: x must be rank 3 or 4, but got " +
            ("rank " + images.rank + "."));
        util.assert(size.length === 2, "Error in resizeBilinear: new shape must 2D, but got shape " +
            (size + "."));
        var batchImages = images;
        var reshapedTo4D = false;
        if (images.rank === 3) {
            reshapedTo4D = true;
            batchImages =
                images.as4D(1, images.shape[0], images.shape[1], images.shape[2]);
        }
        var newHeight = size[0], newWidth = size[1];
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.resizeBilinear(batchImages, newHeight, newWidth, alignCorners); }, { batchImages: batchImages });
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Images', namespace: 'image' }),
        operation_1.operation
    ], ImageOps, "resizeBilinear", null);
    return ImageOps;
}());
exports.ImageOps = ImageOps;

},{"../doc":33,"../environment":35,"../util":151,"./operation":121}],116:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var types = require("../types");
var util = require("../util");
var broadcast_util = require("./broadcast_util");
var operation_1 = require("./operation");
var LogicalOps = (function () {
    function LogicalOps() {
    }
    LogicalOps.logicalNot = function (x) {
        util.assert(x.dtype === 'bool', 'Error Array must be of type bool.');
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.logicalNot(x); }, { x: x });
    };
    LogicalOps.logicalAnd = function (a, b) {
        util.assert(a.dtype === 'bool' && b.dtype === 'bool', 'Error Array must be of type bool.');
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.logicalAnd(a, b); }, { a: a, b: b });
    };
    LogicalOps.logicalOr = function (a, b) {
        util.assert(a.dtype === 'bool' && b.dtype === 'bool', 'Error Array must be of type bool.');
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.logicalOr(a, b); }, { a: a, b: b });
    };
    LogicalOps.logicalXor = function (a, b) {
        util.assert(a.dtype === 'bool' && b.dtype === 'bool', 'Error Array must be of type bool.');
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.logicalXor(a, b); }, { a: a, b: b });
    };
    LogicalOps.where = function (condition, a, b) {
        util.assert(condition.dtype === 'bool' || a.dtype === 'bool' || b.dtype === 'bool', 'Error Array must be of type bool.');
        util.assertShapesMatch(a.shape, b.shape, 'Error in where: ');
        if (condition.rank === 1) {
            util.assert(condition.shape[0] === a.shape[0], 'The first dimension of `a` must match the size of `condition`.');
        }
        else {
            util.assertShapesMatch(condition.shape, b.shape, 'Error in where: ');
        }
        var dtype = types.upcastType(a.dtype, b.dtype);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.where(condition, a, b, dtype); }, { condition: condition, a: a, b: b });
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], LogicalOps, "logicalNot", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], LogicalOps, "logicalAnd", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], LogicalOps, "logicalOr", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], LogicalOps, "logicalXor", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], LogicalOps, "where", null);
    return LogicalOps;
}());
exports.LogicalOps = LogicalOps;

},{"../doc":33,"../environment":35,"../types":150,"../util":151,"./broadcast_util":109,"./operation":121}],117:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var util = require("../util");
var operation_1 = require("./operation");
var LRNOps = (function () {
    function LRNOps() {
    }
    LRNOps.localResponseNormalization = function (x, radius, bias, alpha, beta, normRegion) {
        if (radius === void 0) { radius = 5; }
        if (bias === void 0) { bias = 1; }
        if (alpha === void 0) { alpha = 1; }
        if (beta === void 0) { beta = 0.5; }
        if (normRegion === void 0) { normRegion = 'acrossChannels'; }
        util.assert(x.rank === 4 || x.rank === 3, "Error in localResponseNormalization: x must be rank 3 or 4 but got\n               rank " + x.rank + ".");
        util.assert(util.isInt(radius), "Error in localResponseNormalization3D: radius must be an integer\n                     but got radius " + radius + ".");
        var x4D = x;
        var reshapedTo4D = false;
        if (x.rank === 3) {
            reshapedTo4D = true;
            x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.localResponseNormalization4D(x4D, radius, bias, alpha, beta, normRegion); }, { x4D: x4D });
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        else {
            return res;
        }
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Normalization' }),
        operation_1.operation
    ], LRNOps, "localResponseNormalization", null);
    return LRNOps;
}());
exports.LRNOps = LRNOps;

},{"../doc":33,"../environment":35,"../util":151,"./operation":121}],118:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var operation_1 = require("./operation");
var LSTMOps = (function () {
    function LSTMOps() {
    }
    LSTMOps.multiRNNCell = function (lstmCells, data, c, h) {
        var input = data;
        var newStates = [];
        for (var i = 0; i < lstmCells.length; i++) {
            var output = lstmCells[i](input, c[i], h[i]);
            newStates.push(output[0]);
            newStates.push(output[1]);
            input = output[1];
        }
        var newC = [];
        var newH = [];
        for (var i = 0; i < newStates.length; i += 2) {
            newC.push(newStates[i]);
            newH.push(newStates[i + 1]);
        }
        return [newC, newH];
    };
    LSTMOps.basicLSTMCell = function (forgetBias, lstmKernel, lstmBias, data, c, h) {
        var combined = data.concat(h, 1);
        var weighted = combined.matMul(lstmKernel);
        var res = weighted.add(lstmBias);
        var batchSize = res.shape[0];
        var sliceCols = res.shape[1] / 4;
        var sliceSize = [batchSize, sliceCols];
        var i = res.slice([0, 0], sliceSize);
        var j = res.slice([0, sliceCols], sliceSize);
        var f = res.slice([0, sliceCols * 2], sliceSize);
        var o = res.slice([0, sliceCols * 3], sliceSize);
        var newC = i.sigmoid().mulStrict(j.tanh()).addStrict(c.mulStrict(forgetBias.add(f).sigmoid()));
        var newH = newC.tanh().mulStrict(o.sigmoid());
        return [newC, newH];
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'RNN' }),
        operation_1.operation
    ], LSTMOps, "multiRNNCell", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'RNN' }),
        operation_1.operation
    ], LSTMOps, "basicLSTMCell", null);
    return LSTMOps;
}());
exports.LSTMOps = LSTMOps;

},{"../doc":33,"./operation":121}],119:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var util = require("../util");
var operation_1 = require("./operation");
var MatrixOrientation;
(function (MatrixOrientation) {
    MatrixOrientation[MatrixOrientation["REGULAR"] = 0] = "REGULAR";
    MatrixOrientation[MatrixOrientation["TRANSPOSED"] = 1] = "TRANSPOSED";
})(MatrixOrientation = exports.MatrixOrientation || (exports.MatrixOrientation = {}));
var MatmulOps = (function () {
    function MatmulOps() {
    }
    MatmulOps.matMul = function (a, b, transposeA, transposeB) {
        if (transposeA === void 0) { transposeA = false; }
        if (transposeB === void 0) { transposeB = false; }
        _a = [enumToBool(transposeA), enumToBool(transposeB)], transposeA = _a[0], transposeB = _a[1];
        var innerShapeA = transposeA ? a.shape[0] : a.shape[1];
        var innerShapeB = transposeB ? b.shape[1] : b.shape[0];
        util.assert(a.rank === 2 && b.rank === 2, "Error in matMul: inputs must be rank 2, got ranks " + a.rank +
            (" and " + b.rank + "."));
        util.assert(innerShapeA === innerShapeB, "Error in matMul: inner shapes (" + innerShapeA + ") and (" +
            (innerShapeB + ") of Tensors with shapes " + a.shape + " and ") +
            (b.shape + " and transposeA=" + transposeA) +
            (" and transposeB=" + transposeB + " must match."));
        var grad = function (dy) {
            if (transposeA || transposeB) {
                throw new Error("Backprop for transposed MatMul not yet implemented.");
            }
            return {
                a: function () { return dy.matMul(b.toFloat(), false, true); },
                b: function () { return a.toFloat().matMul(dy, true, false); }
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.matMul(a, b, transposeA, transposeB); }, { a: a, b: b }, grad);
        var _a;
    };
    MatmulOps.vectorTimesMatrix = function (v, matrix) {
        util.assert(v.rank === 1, "Error in vectorTimesMatrix: first input must be rank 1, but got " +
            ("rank " + v.rank + "."));
        util.assert(matrix.rank === 2, "Error in vectorTimesMatrix: second input must be rank 2, but got " +
            ("rank " + matrix.rank + "."));
        util.assert(v.size === matrix.shape[0], "Error in vectorTimesMatrix: size of vector (" + v.size + ") " +
            ("must match first dimension of matrix (" + matrix.shape[0] + ")"));
        return v.as2D(1, -1).matMul(matrix).as1D();
    };
    MatmulOps.matrixTimesVector = function (matrix, v) {
        util.assert(v.rank === 1, "Error in matrixTimesVector: second input must rank 1, but got " +
            ("rank " + v.rank + "."));
        util.assert(matrix.rank === 2, "Error in matrixTimesVector: first input must be a rank 2, but got " +
            ("rank " + matrix.rank + "."));
        util.assert(v.size === matrix.shape[1], "Error in matrixTimesVector: size of first rank 1 input " + v.size + " " +
            "must match inner dimension of second rank 2 input, but got " +
            ("shape " + matrix.shape + "."));
        return matrix.matMul(v.as2D(-1, 1)).as1D();
    };
    MatmulOps.dotProduct = function (v1, v2) {
        util.assert(v1.rank === 1 && v2.rank === 1, "Error in dotProduct: inputs must be rank 1, but got ranks " +
            (v1.rank + " and " + v2.rank + "."));
        util.assert(v1.size === v2.size, "Error in dotProduct: size of inputs (" + v1.size + ") and (" +
            (v2.size + ") must match."));
        return v1.as2D(1, -1).matMul(v2.as2D(-1, 1)).asScalar();
    };
    MatmulOps.outerProduct = function (v1, v2) {
        util.assert(v1.rank === 1 && v2.rank === 1, "Error in outerProduct: inputs must be rank 1, but got ranks " +
            (v1.rank + " and " + v2.rank + "."));
        return v1.as2D(-1, 1).matMul(v2.as2D(1, -1));
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Matrices' }),
        operation_1.operation
    ], MatmulOps, "matMul", null);
    __decorate([
        operation_1.operation
    ], MatmulOps, "vectorTimesMatrix", null);
    __decorate([
        operation_1.operation
    ], MatmulOps, "matrixTimesVector", null);
    __decorate([
        operation_1.operation
    ], MatmulOps, "dotProduct", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Matrices' }),
        operation_1.operation
    ], MatmulOps, "outerProduct", null);
    return MatmulOps;
}());
exports.MatmulOps = MatmulOps;
function enumToBool(transpose) {
    if (transpose === MatrixOrientation.REGULAR) {
        return false;
    }
    if (transpose === MatrixOrientation.TRANSPOSED) {
        return true;
    }
    return transpose;
}

},{"../doc":33,"../environment":35,"../util":151,"./operation":121}],120:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var axis_util = require("./axis_util");
var operation_1 = require("./operation");
var ops = require("./ops");
var NormOps = (function () {
    function NormOps() {
    }
    NormOps.norm = function (x, ord, axis, keepDims) {
        if (ord === void 0) { ord = 'euclidean'; }
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var norm = normImpl(x, ord, axis);
        var keepDimsShape = norm.shape;
        if (keepDims) {
            var axes = axis_util.parseAxisParam(axis, x.shape);
            keepDimsShape = axis_util.expandShapeToKeepDim(norm.shape, axes);
        }
        return norm.reshape(keepDimsShape);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Matrices' }),
        operation_1.operation
    ], NormOps, "norm", null);
    return NormOps;
}());
exports.NormOps = NormOps;
function normImpl(x, p, axis) {
    if (axis === void 0) { axis = null; }
    if (x.rank === 0) {
        return x.abs();
    }
    if (x.rank !== 1 && axis === null) {
        return normImpl(x.reshape([-1]), p, axis);
    }
    if (x.rank === 1 || typeof axis === 'number' ||
        axis instanceof Array && axis.length === 1) {
        if (p === 1) {
            return x.abs().sum(axis);
        }
        if (p === Infinity) {
            return x.abs().max(axis);
        }
        if (p === -Infinity) {
            return x.abs().min(axis);
        }
        if (p === 'euclidean' || p === 2) {
            return x.abs().pow(ops.scalar(2, 'int32')).sum(axis).sqrt();
        }
        throw new Error("Error in norm: invalid ord value: " + p);
    }
    if (axis instanceof Array && axis.length === 2) {
        if (p === 1) {
            return x.abs().sum(axis[0]).max(axis[1] - 1);
        }
        if (p === Infinity) {
            return x.abs().sum(axis[1]).max(axis[0]);
        }
        if (p === -Infinity) {
            return x.abs().sum(axis[1]).min(axis[0]);
        }
        if (p === 'fro' || p === 'euclidean') {
            return x.square().sum(axis).sqrt();
        }
        throw new Error("Error in norm: invalid ord value: " + p);
    }
    throw new Error("Error in norm: invalid axis: " + axis);
}

},{"../doc":33,"./axis_util":106,"./operation":121,"./ops":122}],121:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../globals");
function operation(target, name, descriptor) {
    var fn = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return globals_1.tidy(name, function () { return fn.apply(void 0, args); });
    };
    return descriptor;
}
exports.operation = operation;

},{"../globals":36}],122:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var array_ops_1 = require("./array_ops");
var batchnorm_1 = require("./batchnorm");
var binary_ops_1 = require("./binary_ops");
var compare_1 = require("./compare");
var concat_1 = require("./concat");
var conv_1 = require("./conv");
var image_ops_1 = require("./image_ops");
var logical_ops_1 = require("./logical_ops");
var lrn_1 = require("./lrn");
var lstm_1 = require("./lstm");
var matmul_1 = require("./matmul");
var norm_1 = require("./norm");
var pool_1 = require("./pool");
var reduction_ops_1 = require("./reduction_ops");
var reverse_1 = require("./reverse");
var slice_1 = require("./slice");
var softmax_1 = require("./softmax");
var transpose_1 = require("./transpose");
var unary_ops_1 = require("./unary_ops");
exports.batchNormalization = batchnorm_1.BatchNormOps.batchNormalization;
exports.batchNormalization2d = batchnorm_1.BatchNormOps.batchNormalization2d;
exports.batchNormalization3d = batchnorm_1.BatchNormOps.batchNormalization3d;
exports.batchNormalization4d = batchnorm_1.BatchNormOps.batchNormalization4d;
exports.concat = concat_1.ConcatOps.concat;
exports.concat1d = concat_1.ConcatOps.concat1d;
exports.concat2d = concat_1.ConcatOps.concat2d;
exports.concat3d = concat_1.ConcatOps.concat3d;
exports.concat4d = concat_1.ConcatOps.concat4d;
exports.conv1d = conv_1.ConvOps.conv1d;
exports.conv2d = conv_1.ConvOps.conv2d;
exports.conv2dTranspose = conv_1.ConvOps.conv2dTranspose;
exports.depthwiseConv2d = conv_1.ConvOps.depthwiseConv2d;
exports.matMul = matmul_1.MatmulOps.matMul;
exports.matrixTimesVector = matmul_1.MatmulOps.matrixTimesVector;
exports.outerProduct = matmul_1.MatmulOps.outerProduct;
exports.vectorTimesMatrix = matmul_1.MatmulOps.vectorTimesMatrix;
exports.avgPool = pool_1.PoolOps.avgPool;
exports.maxPool = pool_1.PoolOps.maxPool;
exports.minPool = pool_1.PoolOps.minPool;
exports.transpose = transpose_1.TransposeOps.transpose;
exports.reverse = reverse_1.ReverseOps.reverse;
exports.reverse1d = reverse_1.ReverseOps.reverse1d;
exports.reverse2d = reverse_1.ReverseOps.reverse2d;
exports.reverse3d = reverse_1.ReverseOps.reverse3d;
exports.reverse4d = reverse_1.ReverseOps.reverse4d;
exports.slice = slice_1.SliceOps.slice;
exports.slice1d = slice_1.SliceOps.slice1d;
exports.slice2d = slice_1.SliceOps.slice2d;
exports.slice3d = slice_1.SliceOps.slice3d;
exports.slice4d = slice_1.SliceOps.slice4d;
exports.argMax = reduction_ops_1.ReductionOps.argMax;
exports.argMin = reduction_ops_1.ReductionOps.argMin;
exports.logSumExp = reduction_ops_1.ReductionOps.logSumExp;
exports.max = reduction_ops_1.ReductionOps.max;
exports.mean = reduction_ops_1.ReductionOps.mean;
exports.min = reduction_ops_1.ReductionOps.min;
exports.moments = reduction_ops_1.ReductionOps.moments;
exports.sum = reduction_ops_1.ReductionOps.sum;
exports.equal = compare_1.CompareOps.equal;
exports.equalStrict = compare_1.CompareOps.equalStrict;
exports.greater = compare_1.CompareOps.greater;
exports.greaterStrict = compare_1.CompareOps.greaterStrict;
exports.greaterEqual = compare_1.CompareOps.greaterEqual;
exports.greaterEqualStrict = compare_1.CompareOps.greaterEqualStrict;
exports.less = compare_1.CompareOps.less;
exports.lessStrict = compare_1.CompareOps.lessStrict;
exports.lessEqual = compare_1.CompareOps.lessEqual;
exports.lessEqualStrict = compare_1.CompareOps.lessEqualStrict;
exports.notEqual = compare_1.CompareOps.notEqual;
exports.notEqualStrict = compare_1.CompareOps.notEqualStrict;
exports.logicalNot = logical_ops_1.LogicalOps.logicalNot;
exports.logicalAnd = logical_ops_1.LogicalOps.logicalAnd;
exports.logicalOr = logical_ops_1.LogicalOps.logicalOr;
exports.logicalXor = logical_ops_1.LogicalOps.logicalXor;
exports.where = logical_ops_1.LogicalOps.where;
exports.abs = unary_ops_1.UnaryOps.abs;
exports.acos = unary_ops_1.UnaryOps.acos;
exports.asin = unary_ops_1.UnaryOps.asin;
exports.atan = unary_ops_1.UnaryOps.atan;
exports.ceil = unary_ops_1.UnaryOps.ceil;
exports.clipByValue = unary_ops_1.UnaryOps.clipByValue;
exports.cos = unary_ops_1.UnaryOps.cos;
exports.cosh = unary_ops_1.UnaryOps.cosh;
exports.elu = unary_ops_1.UnaryOps.elu;
exports.exp = unary_ops_1.UnaryOps.exp;
exports.floor = unary_ops_1.UnaryOps.floor;
exports.leakyRelu = unary_ops_1.UnaryOps.leakyRelu;
exports.log = unary_ops_1.UnaryOps.log;
exports.neg = unary_ops_1.UnaryOps.neg;
exports.prelu = unary_ops_1.UnaryOps.prelu;
exports.relu = unary_ops_1.UnaryOps.relu;
exports.selu = unary_ops_1.UnaryOps.selu;
exports.sigmoid = unary_ops_1.UnaryOps.sigmoid;
exports.sin = unary_ops_1.UnaryOps.sin;
exports.sinh = unary_ops_1.UnaryOps.sinh;
exports.sqrt = unary_ops_1.UnaryOps.sqrt;
exports.square = unary_ops_1.UnaryOps.square;
exports.step = unary_ops_1.UnaryOps.step;
exports.tan = unary_ops_1.UnaryOps.tan;
exports.tanh = unary_ops_1.UnaryOps.tanh;
exports.add = binary_ops_1.BinaryOps.add;
exports.addStrict = binary_ops_1.BinaryOps.addStrict;
exports.div = binary_ops_1.BinaryOps.div;
exports.divStrict = binary_ops_1.BinaryOps.divStrict;
exports.maximum = binary_ops_1.BinaryOps.maximum;
exports.maximumStrict = binary_ops_1.BinaryOps.maximumStrict;
exports.minimum = binary_ops_1.BinaryOps.minimum;
exports.minimumStrict = binary_ops_1.BinaryOps.minimumStrict;
exports.mul = binary_ops_1.BinaryOps.mul;
exports.mulStrict = binary_ops_1.BinaryOps.mulStrict;
exports.pow = binary_ops_1.BinaryOps.pow;
exports.powStrict = binary_ops_1.BinaryOps.powStrict;
exports.sub = binary_ops_1.BinaryOps.sub;
exports.subStrict = binary_ops_1.BinaryOps.subStrict;
exports.norm = norm_1.NormOps.norm;
exports.cast = array_ops_1.ArrayOps.cast;
exports.clone = array_ops_1.ArrayOps.clone;
exports.fromPixels = array_ops_1.ArrayOps.fromPixels;
exports.ones = array_ops_1.ArrayOps.ones;
exports.onesLike = array_ops_1.ArrayOps.onesLike;
exports.zeros = array_ops_1.ArrayOps.zeros;
exports.zerosLike = array_ops_1.ArrayOps.zerosLike;
exports.rand = array_ops_1.ArrayOps.rand;
exports.randomNormal = array_ops_1.ArrayOps.randomNormal;
exports.truncatedNormal = array_ops_1.ArrayOps.truncatedNormal;
exports.randomUniform = array_ops_1.ArrayOps.randomUniform;
exports.reshape = array_ops_1.ArrayOps.reshape;
exports.squeeze = array_ops_1.ArrayOps.squeeze;
exports.tile = array_ops_1.ArrayOps.tile;
exports.gather = array_ops_1.ArrayOps.gather;
exports.oneHot = array_ops_1.ArrayOps.oneHot;
exports.linspace = array_ops_1.ArrayOps.linspace;
exports.range = array_ops_1.ArrayOps.range;
exports.buffer = array_ops_1.ArrayOps.buffer;
exports.fill = array_ops_1.ArrayOps.fill;
exports.tensor = array_ops_1.ArrayOps.tensor;
exports.scalar = array_ops_1.ArrayOps.scalar;
exports.tensor1d = array_ops_1.ArrayOps.tensor1d;
exports.tensor2d = array_ops_1.ArrayOps.tensor2d;
exports.tensor3d = array_ops_1.ArrayOps.tensor3d;
exports.tensor4d = array_ops_1.ArrayOps.tensor4d;
exports.print = array_ops_1.ArrayOps.print;
exports.expandDims = array_ops_1.ArrayOps.expandDims;
exports.stack = array_ops_1.ArrayOps.stack;
exports.pad = array_ops_1.ArrayOps.pad;
exports.pad1d = array_ops_1.ArrayOps.pad1d;
exports.pad2d = array_ops_1.ArrayOps.pad2d;
exports.pad3d = array_ops_1.ArrayOps.pad3d;
exports.pad4d = array_ops_1.ArrayOps.pad4d;
exports.basicLSTMCell = lstm_1.LSTMOps.basicLSTMCell;
exports.multiRNNCell = lstm_1.LSTMOps.multiRNNCell;
exports.softmax = softmax_1.SoftmaxOps.softmax;
exports.localResponseNormalization = lrn_1.LRNOps.localResponseNormalization;
var tensor_1 = require("../tensor");
var types_1 = require("../types");
[tensor_1.Tensor, types_1.Rank, tensor_1.Tensor3D, tensor_1.Tensor4D];
exports.losses = {
    softmaxCrossEntropy: softmax_1.SoftmaxOps.softmaxCrossEntropy
};
exports.image = {
    resizeBilinear: image_ops_1.ImageOps.resizeBilinear
};

},{"../tensor":145,"../types":150,"./array_ops":105,"./batchnorm":107,"./binary_ops":108,"./compare":110,"./concat":111,"./conv":113,"./image_ops":115,"./logical_ops":116,"./lrn":117,"./lstm":118,"./matmul":119,"./norm":120,"./pool":123,"./reduction_ops":126,"./reverse":127,"./slice":129,"./softmax":131,"./transpose":132,"./unary_ops":133}],123:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var util = require("../util");
var conv_util = require("./conv_util");
var operation_1 = require("./operation");
var PoolOps = (function () {
    function PoolOps() {
    }
    PoolOps.maxPool = function (x, filterSize, strides, pad, dimRoundingMode) {
        var x4D = x;
        var reshapedTo4D = false;
        if (x.rank === 3) {
            reshapedTo4D = true;
            x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        util.assert(x4D.rank === 4, "Error in maxPool: input must be rank 4 but got rank " + x4D.rank + ".");
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in maxPool: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var convInfo = conv_util.computePool2DInfo(x4D.shape, filterSize, strides, pad, dimRoundingMode);
        var grad = function (dy) {
            return {
                x: function () { return PoolOps.maxPoolBackprop(dy, x4D, filterSize, strides, pad); }
            };
        };
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.maxPool(x4D, convInfo); }, { x: x4D }, grad);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    PoolOps.maxPoolBackprop = function (dy, input, filterSize, strides, pad, dimRoundingMode) {
        util.assert(input.rank === dy.rank, "Rank of input (" + input.rank + ") does not match rank of dy (" + dy.rank + ")");
        var input4D = input;
        var dy4D = dy;
        var reshapedTo4D = false;
        if (input.rank === 3) {
            reshapedTo4D = true;
            input4D = input.as4D(1, input.shape[0], input.shape[1], input.shape[2]);
            dy4D = dy.as4D(1, dy.shape[0], dy.shape[1], dy.shape[2]);
        }
        util.assert(dy4D.rank === 4, "Error in maxPoolBackprop: dy must be rank 4 but got rank " +
            (dy4D.rank + "."));
        util.assert(input4D.rank === 4, "Error in maxPoolBackprop: input must be rank 4 but got rank " +
            (input4D.rank + "."));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in maxPoolBackprop: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var convInfo = conv_util.computePool2DInfo(input4D.shape, filterSize, strides, pad, dimRoundingMode);
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.maxPoolBackprop(dy4D, input4D, convInfo); }, { dy4D: dy4D, input4D: input4D });
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    PoolOps.minPool = function (input, filterSize, strides, pad, dimRoundingMode) {
        var input4D = input;
        var reshapedTo4D = false;
        if (input.rank === 3) {
            reshapedTo4D = true;
            input4D = input.as4D(1, input.shape[0], input.shape[1], input.shape[2]);
        }
        util.assert(input4D.rank === 4, "Error in minPool: x must be rank 4 but got rank " + input4D.rank + ".");
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in minPool: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var convInfo = conv_util.computePool2DInfo(input4D.shape, filterSize, strides, pad, dimRoundingMode);
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.minPool(input4D, convInfo); }, { input4D: input4D });
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    PoolOps.avgPool = function (x, filterSize, strides, pad, dimRoundingMode) {
        var x4D = x;
        var reshapedTo4D = false;
        if (x.rank === 3) {
            reshapedTo4D = true;
            x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        util.assert(x4D.rank === 4, "Error in avgPool: x must be rank 4 but got rank " + x4D.rank + ".");
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in avgPool: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var convInfo = conv_util.computePool2DInfo(x4D.shape, filterSize, strides, pad);
        var grad = function (dy) {
            return {
                x: function () { return PoolOps.avgPoolBackprop(dy, x4D, filterSize, strides, pad); }
            };
        };
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.avgPool(x4D, convInfo); }, { x: x4D }, grad);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    PoolOps.avgPoolBackprop = function (dy, input, filterSize, strides, pad) {
        util.assert(input.rank === dy.rank, "Rank of input (" + input.rank + ") does not match rank of dy (" + dy.rank + ")");
        var input4D = input;
        var dy4D = dy;
        var reshapedTo4D = false;
        if (input.rank === 3) {
            reshapedTo4D = true;
            input4D = input.as4D(1, input.shape[0], input.shape[1], input.shape[2]);
            dy4D = dy.as4D(1, dy.shape[0], dy.shape[1], dy.shape[2]);
        }
        util.assert(dy4D.rank === 4, "Error in avgPoolBackprop: dy must be rank 4 but got rank " +
            (dy4D.rank + "."));
        util.assert(input4D.rank === 4, "Error in avgPoolBackprop: input must be rank 4 but got rank " +
            (input4D.rank + "."));
        var convInfo = conv_util.computePool2DInfo(input4D.shape, filterSize, strides, pad);
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.avgPoolBackprop(dy4D, input4D, convInfo); }, { dy4D: dy4D, input4D: input4D });
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Convolution' }),
        operation_1.operation
    ], PoolOps, "maxPool", null);
    __decorate([
        operation_1.operation
    ], PoolOps, "maxPoolBackprop", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Convolution' }),
        operation_1.operation
    ], PoolOps, "minPool", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Convolution' }),
        operation_1.operation
    ], PoolOps, "avgPool", null);
    __decorate([
        operation_1.operation
    ], PoolOps, "avgPoolBackprop", null);
    return PoolOps;
}());
exports.PoolOps = PoolOps;

},{"../doc":33,"../environment":35,"../util":151,"./conv_util":114,"./operation":121}],124:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var seedrandom = require("seedrandom");
var MPRandGauss = (function () {
    function MPRandGauss(mean, stdDeviation, dtype, truncated, seed) {
        this.mean = mean;
        this.stdDev = stdDeviation;
        this.dtype = dtype;
        this.nextVal = NaN;
        this.truncated = truncated;
        if (this.truncated) {
            this.upper = this.mean + this.stdDev * 2;
            this.lower = this.mean - this.stdDev * 2;
        }
        var seedValue = seed ? seed : Math.random();
        this.random = seedrandom.alea(seedValue.toString());
    }
    MPRandGauss.prototype.nextValue = function () {
        if (!isNaN(this.nextVal)) {
            var value = this.nextVal;
            this.nextVal = NaN;
            return value;
        }
        var resultX, resultY;
        var isValid = false;
        while (!isValid) {
            var v1 = void 0, v2 = void 0, s = void 0;
            do {
                v1 = 2 * this.random() - 1;
                v2 = 2 * this.random() - 1;
                s = v1 * v1 + v2 * v2;
            } while (s >= 1 || s === 0);
            var mul = Math.sqrt(-2.0 * Math.log(s) / s);
            resultX = this.mean + this.stdDev * v1 * mul;
            resultY = this.mean + this.stdDev * v2 * mul;
            if (!this.truncated || this.isValidTruncated(resultX)) {
                isValid = true;
            }
        }
        if (!this.truncated || this.isValidTruncated(resultY)) {
            this.nextVal = this.convertValue(resultY);
        }
        return this.convertValue(resultX);
    };
    MPRandGauss.prototype.convertValue = function (value) {
        if (this.dtype == null || this.dtype === 'float32') {
            return value;
        }
        return Math.round(value);
    };
    MPRandGauss.prototype.isValidTruncated = function (value) {
        return value <= this.upper && value >= this.lower;
    };
    return MPRandGauss;
}());
exports.MPRandGauss = MPRandGauss;

},{"seedrandom":2}],125:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARALLELIZE_THRESHOLD = 30;
function computeOptimalWindowSize(inSize) {
    if (inSize <= exports.PARALLELIZE_THRESHOLD) {
        return inSize;
    }
    return nearestDivisor(inSize, Math.floor(Math.sqrt(inSize)));
}
exports.computeOptimalWindowSize = computeOptimalWindowSize;
function nearestDivisor(size, start) {
    for (var i = start; i < size; ++i) {
        if (size % i === 0) {
            return i;
        }
    }
    return size;
}

},{}],126:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var tensor_1 = require("../tensor");
var util = require("../util");
var axis_util = require("./axis_util");
var operation_1 = require("./operation");
var ops = require("./ops");
var ReductionOps = (function () {
    function ReductionOps() {
    }
    ReductionOps.logSumExp = function (input, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var axes = axis_util.parseAxisParam(axis, input.shape);
        var xMax = input.max(axes, true);
        var a = input.sub(xMax);
        var b = a.exp();
        var c = b.sum(axes);
        var d = c.log();
        var res = xMax.reshape(d.shape).add(d);
        if (keepDims) {
            var newShape = axis_util.expandShapeToKeepDim(res.shape, axes);
            return res.reshape(newShape);
        }
        return res;
    };
    ReductionOps.sum = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var axes = axis_util.parseAxisParam(axis, x.shape);
        var customOp = globals_1.customGrad(function (x) {
            var permutation = axis_util.getAxesPermutation(axes, x.rank);
            var reductionAxes = axes;
            var permutedX = x;
            if (permutation != null) {
                permutedX = x.transpose(permutation);
                reductionAxes =
                    axis_util.getInnerMostAxes(reductionAxes.length, x.rank);
            }
            var value = environment_1.ENV.engine.runKernel(function (backend) { return backend.sum(permutedX, reductionAxes); }, { permutedX: permutedX });
            if (keepDims) {
                var newShape = axis_util.expandShapeToKeepDim(value.shape, axes);
                value = value.reshape(newShape);
            }
            var gradFunc = function (dy) {
                var expandedDyShape = x.shape.slice();
                axes.forEach(function (axis) {
                    expandedDyShape[axis] = 1;
                });
                var expandedDy = dy.reshape(expandedDyShape);
                var derX = expandedDy.mul(tensor_1.Tensor.ones(x.shape, 'float32'));
                return derX;
            };
            return { value: value, gradFunc: gradFunc };
        });
        return customOp(x);
    };
    ReductionOps.mean = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var axes = axis_util.parseAxisParam(axis, x.shape);
        var shapes = axis_util.computeOutAndReduceShapes(x.shape, axes);
        var reduceShape = shapes[1];
        var reduceSize = util.sizeFromShape(reduceShape);
        var customOp = globals_1.customGrad(function (x) {
            var reduceSizeScalar = ops.scalar(reduceSize);
            var res = x.div(reduceSizeScalar);
            var value = res.sum(axis, keepDims);
            var gradFunc = function (dy) {
                var expandedDyShape = x.shape.slice();
                axes.forEach(function (axis) {
                    expandedDyShape[axis] = 1;
                });
                var expandedDy = dy.reshape(expandedDyShape);
                var derX = expandedDy.mul(tensor_1.Tensor.ones(x.shape, 'float32'))
                    .div(reduceSizeScalar);
                return derX;
            };
            return { value: value, gradFunc: gradFunc };
        });
        return customOp(x);
    };
    ReductionOps.min = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var origAxes = axis_util.parseAxisParam(axis, x.shape);
        var axes = origAxes;
        var permutedAxes = axis_util.getAxesPermutation(axes, x.rank);
        if (permutedAxes != null) {
            x = x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, x.rank);
        }
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.min(x, axes); }, { x: x });
        if (keepDims) {
            var newShape = axis_util.expandShapeToKeepDim(res.shape, origAxes);
            return res.reshape(newShape);
        }
        return res;
    };
    ReductionOps.max = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var origAxes = axis_util.parseAxisParam(axis, x.shape);
        var axes = origAxes;
        var permutedAxes = axis_util.getAxesPermutation(axes, x.rank);
        if (permutedAxes != null) {
            x = x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, x.rank);
        }
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.max(x, axes); }, { x: x });
        if (keepDims) {
            var newShape = axis_util.expandShapeToKeepDim(res.shape, origAxes);
            return res.reshape(newShape);
        }
        return res;
    };
    ReductionOps.argMin = function (x, axis) {
        if (axis === void 0) { axis = null; }
        var axes = axis_util.parseAxisParam(axis, x.shape);
        var permutedAxes = axis_util.getAxesPermutation(axes, x.rank);
        if (permutedAxes != null) {
            x = x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, x.rank);
        }
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.argMin(x, axes); }, { x: x });
    };
    ReductionOps.argMax = function (x, axis) {
        if (axis === void 0) { axis = null; }
        var axes = axis_util.parseAxisParam(axis, x.shape);
        var permutedAxes = axis_util.getAxesPermutation(axes, x.rank);
        if (permutedAxes != null) {
            x = x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, x.rank);
        }
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.argMax(x, axes); }, { x: x });
    };
    ReductionOps.moments = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var axes = axis_util.parseAxisParam(axis, x.shape);
        var mean = x.mean(axes, keepDims);
        var keepDimsShape = mean.shape;
        if (!keepDims) {
            keepDimsShape = axis_util.expandShapeToKeepDim(mean.shape, axes);
        }
        var devSquared = x.toFloat().sub(mean.reshape(keepDimsShape)).square();
        var variance = devSquared.mean(axes, keepDims);
        return { mean: mean, variance: variance };
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation_1.operation
    ], ReductionOps, "logSumExp", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation_1.operation
    ], ReductionOps, "sum", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation_1.operation
    ], ReductionOps, "mean", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation_1.operation
    ], ReductionOps, "min", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation_1.operation
    ], ReductionOps, "max", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation_1.operation
    ], ReductionOps, "argMin", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation_1.operation
    ], ReductionOps, "argMax", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Normalization' }),
        operation_1.operation
    ], ReductionOps, "moments", null);
    return ReductionOps;
}());
exports.ReductionOps = ReductionOps;

},{"../doc":33,"../environment":35,"../globals":36,"../tensor":145,"../util":151,"./axis_util":106,"./operation":121,"./ops":122}],127:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var util = require("../util");
var axis_util_1 = require("./axis_util");
var operation_1 = require("./operation");
var ReverseOps = (function () {
    function ReverseOps() {
    }
    ReverseOps.reverse1d = function (x) {
        util.assert(x.rank === 1, "Error in reverse1D: x must be rank 1 but got\n             rank " + x.rank + ".");
        return ReverseOps.reverse(x, 0);
    };
    ReverseOps.reverse2d = function (x, axis) {
        util.assert(x.rank === 2, "Error in reverse2D: x must be rank 2 but got\n             rank " + x.rank + ".");
        return ReverseOps.reverse(x, axis);
    };
    ReverseOps.reverse3d = function (x, axis) {
        util.assert(x.rank === 3, "Error in reverse3D: x must be rank 3 but got\n             rank " + x.rank + ".");
        return ReverseOps.reverse(x, axis);
    };
    ReverseOps.reverse4d = function (x, axis) {
        util.assert(x.rank === 4, "Error in reverse4D: x must be rank 4 but got\n             rank " + x.rank + ".");
        return ReverseOps.reverse(x, axis);
    };
    ReverseOps.reverse = function (x, axis) {
        if (x.rank === 0) {
            return x.clone();
        }
        var axes = axis_util_1.parseAxisParam(axis, x.shape);
        var grad = function (dy) {
            return { x: function () { return dy.reverse(axes); } };
        };
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.reverse(x, axes); }, { x: x }, grad);
        return res.reshapeAs(x);
    };
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation_1.operation
    ], ReverseOps, "reverse", null);
    return ReverseOps;
}());
exports.ReverseOps = ReverseOps;

},{"../doc":33,"../environment":35,"../util":151,"./axis_util":106,"./operation":121}],128:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELU_SCALEALPHA = 1.7580993408473768599402175208123;
exports.SELU_SCALE = 1.0507009873554804934193349852946;

},{}],129:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var util = require("../util");
var operation_1 = require("./operation");
var slice_util = require("./slice_util");
var SliceOps = (function () {
    function SliceOps() {
    }
    SliceOps.slice1d = function (x, begin, size) {
        util.assert(x.rank === 1, "slice1d expects a rank-1 tensor, but got a rank-" + x.rank + " tensor");
        return SliceOps.slice(x, [begin], [size]);
    };
    SliceOps.slice2d = function (x, begin, size) {
        util.assert(x.rank === 2, "slice1d expects a rank-2 tensor, but got a rank-" + x.rank + " tensor");
        return SliceOps.slice(x, begin, size);
    };
    SliceOps.slice3d = function (x, begin, size) {
        util.assert(x.rank === 3, "slice1d expects a rank-3 tensor, but got a rank-" + x.rank + " tensor");
        return SliceOps.slice(x, begin, size);
    };
    SliceOps.slice4d = function (x, begin, size) {
        util.assert(x.rank === 4, "slice1d expects a rank-4 tensor, but got a rank-" + x.rank + " tensor");
        return SliceOps.slice(x, begin, size);
    };
    SliceOps.slice = function (x, begin, size) {
        slice_util.assertParamsValid(x, begin, size);
        if (x.rank === 0) {
            throw new Error('Slicing scalar is not possible');
        }
        var inputShape = x.shape;
        var grad = function (dy) {
            var paddings = [];
            for (var i = 0; i < dy.rank; i++) {
                paddings.push([begin[i], inputShape[i] - begin[i] - size[i]]);
            }
            return { x: function () { return dy.pad(paddings); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.slice(x, begin, size); }, { x: x }, grad);
    };
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation_1.operation
    ], SliceOps, "slice", null);
    return SliceOps;
}());
exports.SliceOps = SliceOps;

},{"../doc":33,"../environment":35,"../util":151,"./operation":121,"./slice_util":130}],130:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("../util");
function assertParamsValid(input, begin, size) {
    util.assert(input.rank === begin.length, "Error in slice" + input.rank + "D: Length of begin " + begin + " must " +
        ("match the rank of the array (" + input.rank + ")."));
    util.assert(input.rank === size.length, "Error in slice" + input.rank + "D: Length of size " + size + " must " +
        ("match the rank of the array (" + input.rank + ")."));
    for (var i = 0; i < input.rank; ++i) {
        util.assert(begin[i] + size[i] <= input.shape[i], "Error in slice" + input.rank + "D: begin[" + i + "] + size[" + i + "] " +
            ("(" + (begin[i] + size[i]) + ") would overflow input.shape[" + i + "] (" + input.shape[i] + ")"));
    }
}
exports.assertParamsValid = assertParamsValid;

},{"../util":151}],131:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var globals_1 = require("../globals");
var util = require("../util");
var axis_util = require("./axis_util");
var operation_1 = require("./operation");
var ops = require("./ops");
var SoftmaxOps = (function () {
    function SoftmaxOps() {
    }
    SoftmaxOps.softmax = function (logits, dim) {
        if (dim === void 0) { dim = -1; }
        if (dim === -1) {
            dim = logits.rank - 1;
        }
        if (dim !== logits.rank - 1) {
            throw Error('Softmax along a non-last dimension is not yet supported. ' +
                ("Logits was rank " + logits.rank + " and dim was " + dim));
        }
        var customOp = globals_1.customGrad(function (logits) {
            var keepDims = true;
            var lse = logits.logSumExp([dim], keepDims);
            var logResult = logits.toFloat().sub(lse);
            var y = logResult.exp();
            var gradFunc = function (dy) {
                var dyTimesY = dy.mul(y);
                var keepDims = true;
                return dyTimesY.sub(dyTimesY.sum([dim], keepDims).mul(y));
            };
            return { value: y, gradFunc: gradFunc };
        });
        return customOp(logits);
    };
    SoftmaxOps.softmaxCrossEntropy = function (labels, logits, dim) {
        if (dim === void 0) { dim = -1; }
        util.assertShapesMatch(labels.shape, logits.shape, 'Error in softmaxCrossEntropy: ');
        if (dim === -1) {
            dim = logits.rank - 1;
        }
        if (dim !== logits.rank - 1) {
            throw Error("Softmax cross entropy along a non-last dimension is not yet " +
                ("supported. Labels / logits was rank " + logits.rank + " ") +
                ("and dim was " + dim));
        }
        var customOp = globals_1.customGrad(function (labels, logits) {
            var predictedProbs = logits.softmax(dim);
            var costVector = ops.scalar(1e-5).add(predictedProbs).log().mul(labels).neg();
            var value = costVector.sum([dim]);
            var gradFunc = function (dy) {
                var dyShape = axis_util.expandShapeToKeepDim(dy.shape, [dim]);
                return [
                    dy.reshape(dyShape).mul(labels.toFloat().sub(predictedProbs)),
                    dy.reshape(dyShape).mul(predictedProbs.sub(labels.toFloat())),
                ];
            };
            return { value: value, gradFunc: gradFunc };
        });
        return customOp(labels, logits);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Normalization' }),
        operation_1.operation
    ], SoftmaxOps, "softmax", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' }),
        operation_1.operation
    ], SoftmaxOps, "softmaxCrossEntropy", null);
    return SoftmaxOps;
}());
exports.SoftmaxOps = SoftmaxOps;

},{"../doc":33,"../globals":36,"../util":151,"./axis_util":106,"./operation":121,"./ops":122}],132:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var util = require("../util");
var axis_util = require("./axis_util");
var operation_1 = require("./operation");
var TransposeOps = (function () {
    function TransposeOps() {
    }
    TransposeOps.transpose = function (x, perm) {
        if (perm == null) {
            perm = x.shape.map(function (s, i) { return i; }).reverse();
        }
        var der = function (dy) {
            var undoPerm = axis_util.getUndoAxesPermutation(perm);
            return { x: function () { return dy.transpose(undoPerm); } };
        };
        util.assert(x.rank === perm.length, "Error in transpose: rank of input " + x.rank + " " +
            ("must match length of perm " + perm + "."));
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.transpose(x, perm); }, { x: x }, der);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Matrices' }),
        operation_1.operation
    ], TransposeOps, "transpose", null);
    return TransposeOps;
}());
exports.TransposeOps = TransposeOps;

},{"../doc":33,"../environment":35,"../util":151,"./axis_util":106,"./operation":121}],133:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var util = require("../util");
var operation_1 = require("./operation");
var ops = require("./ops");
var ops_1 = require("./ops");
var selu_util = require("./selu_util");
var UnaryOps = (function () {
    function UnaryOps() {
    }
    UnaryOps.neg = function (x) {
        var grad = function (dy) {
            return { x: function () { return dy.neg(); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.neg(x); }, { x: x }, grad);
    };
    UnaryOps.ceil = function (x) {
        var grad = function (dy) {
            return { x: function () { return ops.zerosLike(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.ceil(x); }, { x: x }, grad);
    };
    UnaryOps.floor = function (x) {
        var grad = function (dy) {
            return { x: function () { return ops.zerosLike(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.floor(x); }, { x: x }, grad);
    };
    UnaryOps.exp = function (x) {
        var bck = function (dy, saved) {
            var y = saved[0];
            return { x: function () { return dy.mulStrict(y); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend, save) { return save(backend.exp(x)); }, { x: x }, bck);
    };
    UnaryOps.log = function (x) {
        var grad = function (dy) {
            return { x: function () { return dy.divStrict(x.toFloat()); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.log(x); }, { x: x }, grad);
    };
    UnaryOps.sqrt = function (x) {
        var grad = function (dy) {
            return { x: function () { return dy.divStrict(x.toFloat().sqrt().mul(ops.scalar(2))); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.sqrt(x); }, { x: x }, grad);
    };
    UnaryOps.square = function (x) {
        var grad = function (dy) {
            return { x: function () { return dy.mulStrict(x.toFloat().mul(ops.scalar(2))); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.square(x); }, { x: x }, grad);
    };
    UnaryOps.abs = function (x) {
        var grad = function (dy) {
            return { x: function () { return dy.mulStrict(x.toFloat().step(-1)); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.abs(x); }, { x: x }, grad);
    };
    UnaryOps.clipByValue = function (x, clipValueMin, clipValueMax) {
        util.assert((clipValueMin <= clipValueMax), "Error in clip: min (" + clipValueMin + ") must be" +
            ("less than or equal to max (" + clipValueMax + ")."));
        var grad = function (dy) {
            return {
                x: function () { return dy.where(x.greater(ops.scalar(clipValueMin))
                    .logicalAnd(x.less(ops.scalar(clipValueMax))), ops_1.zerosLike(dy)); },
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.clip(x, clipValueMin, clipValueMax); }, { x: x }, grad);
    };
    UnaryOps.relu = function (x) {
        var grad = function (dy) {
            var stepRes = x.step();
            return { x: function () { return dy.mulStrict(stepRes.toFloat()); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.relu(x); }, { x: x }, grad);
    };
    UnaryOps.elu = function (x) {
        var grad = function (dy) {
            return { x: function () { return dy.mulStrict(eluDer(x)); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.elu(x); }, { x: x }, grad);
    };
    UnaryOps.selu = function (x) {
        var grad = function (dy) {
            return {
                x: function () {
                    var mask = x.greater(ops.scalar(0));
                    var scaleAlpha = ops.scalar(selu_util.SELU_SCALEALPHA);
                    var scale = ops.scalar(selu_util.SELU_SCALE);
                    var greaterThanZeroDer = dy.mul(scale);
                    var lessEqualZeroDer = dy.mul(scaleAlpha).mul(x.toFloat().exp());
                    return ops.where(mask, greaterThanZeroDer, lessEqualZeroDer);
                }
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.selu(x); }, { x: x }, grad);
    };
    UnaryOps.leakyRelu = function (x, alpha) {
        if (alpha === void 0) { alpha = 0.2; }
        var grad = function (dy) {
            return { x: function () { return dy.mulStrict(x.step(alpha)); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.leakyRelu(x, alpha); }, { x: x }, grad);
    };
    UnaryOps.prelu = function (x, alpha) {
        var grad = function (dy) {
            return { x: function () { return dy.mulStrict(preluDer(x, alpha)); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.prelu(x, alpha); }, { x: x }, grad);
    };
    UnaryOps.sigmoid = function (x) {
        var grad = function (dy, saved) {
            var y = saved[0];
            return { x: function () { return dy.mulStrict(y.mul(ops.scalar(1).sub(y))); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend, save) { return save(backend.sigmoid(x)); }, { x: x }, grad);
    };
    UnaryOps.sin = function (x) {
        var grad = function (dy) {
            return { x: function () { return x.toFloat().cos().mulStrict(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.sin(x); }, { x: x }, grad);
    };
    UnaryOps.cos = function (x) {
        var grad = function (dy) {
            return { x: function () { return x.toFloat().sin().neg().mulStrict(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.cos(x); }, { x: x }, grad);
    };
    UnaryOps.tan = function (x) {
        var grad = function (dy) {
            return { x: function () { return dy.divStrict(x.cos().square()); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.tan(x); }, { x: x }, grad);
    };
    UnaryOps.asin = function (x) {
        var grad = function (dy) {
            return {
                x: function () {
                    return dy.divStrict(UnaryOps.sqrt(ops.scalar(1).sub(x.toFloat().square())));
                }
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.asin(x); }, { x: x }, grad);
    };
    UnaryOps.acos = function (x) {
        var grad = function (dy) {
            return {
                x: function () {
                    return dy.divStrict(UnaryOps.sqrt(ops.scalar(1).sub(x.toFloat().square())))
                        .neg();
                }
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.acos(x); }, { x: x }, grad);
    };
    UnaryOps.atan = function (x) {
        var grad = function (dy) {
            return { x: function () { return dy.divStrict(ops.scalar(1).add(x.toFloat().square())); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.atan(x); }, { x: x }, grad);
    };
    UnaryOps.sinh = function (x) {
        var grad = function (dy) {
            return { x: function () { return x.toFloat().cosh().mulStrict(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.sinh(x); }, { x: x }, grad);
    };
    UnaryOps.cosh = function (x) {
        var grad = function (dy) {
            return { x: function () { return x.toFloat().sinh().mulStrict(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.cosh(x); }, { x: x }, grad);
    };
    UnaryOps.tanh = function (x) {
        var grad = function (dy, saved) {
            var y = saved[0];
            return { x: function () { return ops.scalar(1).sub(y.square()).mulStrict(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend, save) { return save(backend.tanh(x)); }, { x: x }, grad);
    };
    UnaryOps.step = function (x, alpha) {
        if (alpha === void 0) { alpha = 0.0; }
        var grad = function (dy) {
            return { x: function () { return ops.zerosLike(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.step(x, alpha); }, { x: x }, grad);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "neg", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "ceil", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "floor", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "exp", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "log", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "sqrt", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "square", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "abs", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "clipByValue", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "relu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "elu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "selu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "leakyRelu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "prelu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "sigmoid", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "sin", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "cos", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "tan", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "asin", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "acos", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "atan", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "sinh", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "cosh", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "tanh", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "step", null);
    return UnaryOps;
}());
exports.UnaryOps = UnaryOps;
function preluDer(x, alpha) {
    return environment_1.ENV.engine.runKernel(function (backend) { return backend.preluDer(x, alpha); }, { x: x, alpha: alpha });
}
function eluDer(x) {
    return environment_1.ENV.engine.runKernel(function (backend) { return backend.eluDer(x); }, { x: x });
}

},{"../doc":33,"../environment":35,"../util":151,"./operation":121,"./ops":122,"./selu_util":128}],134:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var tensor_array_map_1 = require("../graph/tensor_array_map");
var ops_1 = require("../ops/ops");
var tensor_1 = require("../tensor");
var optimizer_1 = require("./optimizer");
var AdadeltaOptimizer = (function (_super) {
    __extends(AdadeltaOptimizer, _super);
    function AdadeltaOptimizer(learningRate, rho, specifiedVariableList, epsilon) {
        if (epsilon === void 0) { epsilon = 1e-8; }
        var _this = _super.call(this, learningRate, specifiedVariableList) || this;
        _this.accumulatedGrads = {};
        _this.accumulatedUpdates = {};
        _this.accumulatedSquaredGradientsGraph = new tensor_array_map_1.TensorArrayMap();
        _this.accumulatedUpdatesGraph = new tensor_array_map_1.TensorArrayMap();
        _this.c = globals_1.keep(ops_1.scalar(-learningRate));
        _this.epsilon = globals_1.keep(ops_1.scalar(epsilon));
        _this.rho = globals_1.keep(ops_1.scalar(rho));
        _this.oneMinusRho = globals_1.keep(ops_1.scalar(1 - rho));
        return _this;
    }
    AdadeltaOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        var _loop_1 = function (variableName) {
            var value = environment_1.ENV.engine.registeredVariables[variableName];
            if (this_1.accumulatedGrads[variableName] == null) {
                var trainable_1 = false;
                globals_1.tidy(function () {
                    _this.accumulatedGrads[variableName] =
                        ops_1.zerosLike(value).variable(trainable_1);
                });
            }
            if (this_1.accumulatedUpdates[variableName] == null) {
                var trainable_2 = false;
                globals_1.tidy(function () {
                    _this.accumulatedUpdates[variableName] =
                        ops_1.zerosLike(value).variable(trainable_2);
                });
            }
            var gradient = variableGradients[variableName];
            var accumulatedGrad = this_1.accumulatedGrads[variableName];
            var accumulatedUpdate = this_1.accumulatedUpdates[variableName];
            globals_1.tidy(function () {
                var newAccumulatedGrad = _this.rho.mul(accumulatedGrad)
                    .add(_this.oneMinusRho.mul(gradient.square()));
                var updates = accumulatedUpdate.add(_this.epsilon)
                    .sqrt()
                    .div(accumulatedGrad.add(_this.epsilon).sqrt())
                    .mul(gradient);
                var newAccumulatedUpdate = _this.rho.mul(accumulatedUpdate)
                    .add(_this.oneMinusRho.mul(updates.square()));
                _this.accumulatedGrads[variableName].assign(newAccumulatedGrad);
                _this.accumulatedUpdates[variableName].assign(newAccumulatedUpdate);
                var newValue = _this.c.mul(updates).add(value);
                value.assign(newValue);
            });
        };
        var this_1 = this;
        for (var variableName in variableGradients) {
            _loop_1(variableName);
        }
    };
    AdadeltaOptimizer.prototype.beforeBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        _super.prototype.beforeBatch.call(this, math, batchSize, runtime, activationArrayMap, gradientArrayMap);
        if (this.accumulatedSquaredGradientsGraph.size() === 0) {
            this.variableNodes.forEach(function (node) {
                _this.accumulatedSquaredGradientsGraph.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
                _this.accumulatedUpdatesGraph.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
            });
        }
    };
    AdadeltaOptimizer.prototype.afterBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        if (this.one == null) {
            this.one = globals_1.keep(ops_1.scalar(1));
        }
        globals_1.tidy(function () {
            _this.variableNodes.forEach(function (node) {
                var oldVariable = activationArrayMap.get(node.output);
                var gradient = _this.variableGradients.get(node.output);
                var oldCache = _this.accumulatedSquaredGradientsGraph.get(node.output);
                var oldUpdates = _this.accumulatedUpdatesGraph.get(node.output);
                var gradientSquare = math.multiply(gradient, gradient);
                var cache = math.scaledArrayAdd(_this.rho, oldCache, math.subtract(_this.one, _this.rho), gradientSquare);
                var updates = math.multiply(math.divide(math.sqrt(math.add(oldUpdates, _this.epsilon)), math.sqrt(math.add(oldCache, _this.epsilon))), gradient);
                var variable = math.scaledArrayAdd(_this.cGraph, updates, _this.one, oldVariable);
                var updateSquare = math.multiply(updates, updates);
                var newUpdates = math.scaledArrayAdd(_this.rho, oldUpdates, math.subtract(_this.one, _this.rho), updateSquare);
                _this.accumulatedSquaredGradientsGraph.set(node.output, globals_1.keep(cache));
                _this.accumulatedUpdatesGraph.set(node.output, globals_1.keep(newUpdates));
                activationArrayMap.set(node.output, globals_1.keep(variable));
                node.data = variable;
                oldVariable.dispose();
                oldCache.dispose();
                oldUpdates.dispose();
            });
        });
        this.variableGradients.dispose();
        this.variableGradients = new tensor_array_map_1.TensorArrayMap();
    };
    AdadeltaOptimizer.prototype.dispose = function () {
        var _this = this;
        _super.prototype.dispose.call(this);
        this.c.dispose();
        this.epsilon.dispose();
        this.rho.dispose();
        this.oneMinusRho.dispose();
        if (this.one != null) {
            this.one.dispose();
        }
        if (this.accumulatedSquaredGradientsGraph != null) {
            this.accumulatedSquaredGradientsGraph.dispose();
        }
        if (this.accumulatedUpdatesGraph != null) {
            this.accumulatedUpdatesGraph.dispose();
        }
        if (this.accumulatedUpdates != null) {
            Object.keys(this.accumulatedUpdates)
                .forEach(function (name) { return _this.accumulatedUpdates[name].dispose(); });
            Object.keys(this.accumulatedGrads)
                .forEach(function (name) { return _this.accumulatedGrads[name].dispose(); });
        }
    };
    return AdadeltaOptimizer;
}(optimizer_1.Optimizer));
exports.AdadeltaOptimizer = AdadeltaOptimizer;

},{"../environment":35,"../globals":36,"../graph/tensor_array_map":67,"../ops/ops":122,"../tensor":145,"./optimizer":139}],135:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var tensor_array_map_1 = require("../graph/tensor_array_map");
var ops_1 = require("../ops/ops");
var tensor_1 = require("../tensor");
var optimizer_1 = require("./optimizer");
var AdagradOptimizer = (function (_super) {
    __extends(AdagradOptimizer, _super);
    function AdagradOptimizer(learningRate, specifiedVariableList, initialAccumulatorValue) {
        if (initialAccumulatorValue === void 0) { initialAccumulatorValue = 0.1; }
        var _this = _super.call(this, learningRate, specifiedVariableList) || this;
        _this.learningRate = learningRate;
        _this.initialAccumulatorValue = initialAccumulatorValue;
        _this.accumulatedGrads = {};
        _this.accumulatedSquaredGradients = new tensor_array_map_1.TensorArrayMap();
        _this.c = globals_1.keep(ops_1.scalar(-learningRate));
        _this.epsilon = globals_1.keep(ops_1.scalar(1e-8));
        return _this;
    }
    AdagradOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        var _loop_1 = function (variableName) {
            var value = environment_1.ENV.engine.registeredVariables[variableName];
            if (this_1.accumulatedGrads[variableName] == null) {
                var trainable_1 = false;
                globals_1.tidy(function () {
                    _this.accumulatedGrads[variableName] =
                        ops_1.fill(value.shape, _this.initialAccumulatorValue)
                            .variable(trainable_1);
                });
            }
            var gradient = variableGradients[variableName];
            var accumulatedGrad = this_1.accumulatedGrads[variableName];
            globals_1.tidy(function () {
                var newAccumulatedGrad = accumulatedGrad.add(gradient.square());
                _this.accumulatedGrads[variableName].assign(newAccumulatedGrad);
                var newValue = _this.c
                    .mul(gradient.div(newAccumulatedGrad.add(_this.epsilon).sqrt()))
                    .add(value);
                value.assign(newValue);
            });
        };
        var this_1 = this;
        for (var variableName in variableGradients) {
            _loop_1(variableName);
        }
    };
    AdagradOptimizer.prototype.beforeBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        _super.prototype.beforeBatch.call(this, math, batchSize, runtime, activationArrayMap, gradientArrayMap);
        if (this.accumulatedSquaredGradients.size() === 0) {
            this.variableNodes.forEach(function (node) {
                _this.accumulatedSquaredGradients.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
            });
        }
    };
    AdagradOptimizer.prototype.afterBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        if (this.one == null) {
            this.one = globals_1.keep(ops_1.scalar(1));
        }
        globals_1.tidy(function () {
            _this.variableNodes.forEach(function (node) {
                var oldVariable = activationArrayMap.get(node.output);
                var gradient = _this.variableGradients.get(node.output);
                var oldCache = _this.accumulatedSquaredGradients.get(node.output);
                var gradientSquare = math.multiply(gradient, gradient);
                var cache = math.add(oldCache, gradientSquare);
                var variable = math.scaledArrayAdd(_this.cGraph, math.divide(gradient, math.add(math.sqrt(cache), _this.epsilon)), _this.one, oldVariable);
                _this.accumulatedSquaredGradients.set(node.output, globals_1.keep(cache));
                activationArrayMap.set(node.output, globals_1.keep(variable));
                node.data = variable;
                oldVariable.dispose();
                oldCache.dispose();
            });
        });
        this.variableGradients.dispose();
        this.variableGradients = new tensor_array_map_1.TensorArrayMap();
    };
    AdagradOptimizer.prototype.dispose = function () {
        var _this = this;
        _super.prototype.dispose.call(this);
        this.epsilon.dispose();
        this.c.dispose();
        if (this.one != null) {
            this.one.dispose();
        }
        if (this.accumulatedSquaredGradients != null) {
            this.accumulatedSquaredGradients.dispose();
        }
        if (this.accumulatedGrads != null) {
            Object.keys(this.accumulatedGrads)
                .forEach(function (name) { return _this.accumulatedGrads[name].dispose(); });
        }
    };
    return AdagradOptimizer;
}(optimizer_1.Optimizer));
exports.AdagradOptimizer = AdagradOptimizer;

},{"../environment":35,"../globals":36,"../graph/tensor_array_map":67,"../ops/ops":122,"../tensor":145,"./optimizer":139}],136:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var tensor_array_map_1 = require("../graph/tensor_array_map");
var ops_1 = require("../ops/ops");
var tensor_1 = require("../tensor");
var optimizer_1 = require("./optimizer");
var AdamOptimizer = (function (_super) {
    __extends(AdamOptimizer, _super);
    function AdamOptimizer(learningRate, beta1, beta2, epsilon, specifiedVariableList) {
        if (epsilon === void 0) { epsilon = 1e-8; }
        var _this = _super.call(this, learningRate, specifiedVariableList) || this;
        _this.learningRate = learningRate;
        _this.accumulatedFirstMoment = {};
        _this.accumulatedSecondMoment = {};
        _this.firstMomentGraph = new tensor_array_map_1.TensorArrayMap();
        _this.secondMomentGraph = new tensor_array_map_1.TensorArrayMap();
        _this.c = globals_1.keep(ops_1.scalar(-learningRate));
        _this.eps = globals_1.keep(ops_1.scalar(epsilon));
        _this.beta1 = globals_1.keep(ops_1.scalar(beta1));
        _this.beta2 = globals_1.keep(ops_1.scalar(beta2));
        globals_1.tidy(function () {
            _this.accBeta1 = ops_1.scalar(beta1).variable();
            _this.accBeta2 = ops_1.scalar(beta2).variable();
        });
        _this.oneMinusBeta1 = globals_1.keep(ops_1.scalar(1 - beta1));
        _this.oneMinusBeta2 = globals_1.keep(ops_1.scalar(1 - beta2));
        _this.one = globals_1.keep(ops_1.scalar(1));
        return _this;
    }
    AdamOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        globals_1.tidy(function () {
            var oneMinusAccBeta1 = _this.one.sub(_this.accBeta1);
            var oneMinusAccBeta2 = _this.one.sub(_this.accBeta2);
            for (var variableName in variableGradients) {
                var value = environment_1.ENV.engine.registeredVariables[variableName];
                if (_this.accumulatedFirstMoment[variableName] == null) {
                    var trainable = false;
                    _this.accumulatedFirstMoment[variableName] =
                        ops_1.zerosLike(value).variable(trainable);
                }
                if (_this.accumulatedSecondMoment[variableName] == null) {
                    var trainable = false;
                    _this.accumulatedSecondMoment[variableName] =
                        ops_1.zerosLike(value).variable(trainable);
                }
                var gradient = variableGradients[variableName];
                var firstMoment = _this.accumulatedFirstMoment[variableName];
                var secondMoment = _this.accumulatedSecondMoment[variableName];
                var newFirstMoment = _this.beta1.mul(firstMoment).add(_this.oneMinusBeta1.mul(gradient));
                var newSecondMoment = _this.beta2.mul(secondMoment)
                    .add(_this.oneMinusBeta2.mul(gradient.square()));
                var biasCorrectedFirstMoment = newFirstMoment.div(oneMinusAccBeta1);
                var biasCorrectedSecondMoment = newSecondMoment.div(oneMinusAccBeta2);
                _this.accumulatedFirstMoment[variableName].assign(newFirstMoment);
                _this.accumulatedSecondMoment[variableName].assign(newSecondMoment);
                var newValue = _this.c
                    .mul(biasCorrectedFirstMoment.div(_this.eps.add(biasCorrectedSecondMoment.sqrt())))
                    .add(value);
                value.assign(newValue);
            }
            _this.accBeta1.assign(_this.accBeta1.mul(_this.beta1));
            _this.accBeta2.assign(_this.accBeta2.mul(_this.beta2));
        });
    };
    AdamOptimizer.prototype.beforeBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        _super.prototype.beforeBatch.call(this, math, batchSize, runtime, activationArrayMap, gradientArrayMap);
        if (this.firstMomentGraph.size() === 0) {
            this.variableNodes.forEach(function (node) {
                _this.firstMomentGraph.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
            });
        }
        if (this.secondMomentGraph.size() === 0) {
            this.variableNodes.forEach(function (node) {
                _this.secondMomentGraph.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
            });
        }
    };
    AdamOptimizer.prototype.afterBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        globals_1.tidy(function () {
            var oneMinusAccBeta1 = _this.one.sub(_this.accBeta1);
            var oneMinusAccBeta2 = _this.one.sub(_this.accBeta2);
            _this.variableNodes.forEach(function (node) {
                var oldVariable = activationArrayMap.get(node.output);
                var gradient = _this.variableGradients.get(node.output);
                var oldFirstMoment = _this.firstMomentGraph.get(node.output);
                var oldSecondMoment = _this.secondMomentGraph.get(node.output);
                var newFirstMoment = math.scaledArrayAdd(_this.beta1, oldFirstMoment, _this.oneMinusBeta1, gradient);
                var newSecondMoment = math.scaledArrayAdd(_this.beta2, oldSecondMoment, _this.oneMinusBeta2, gradient.square());
                var biasCorrectedFirstMoment = newFirstMoment.div(oneMinusAccBeta1);
                var biasCorrectedSecondMoment = newSecondMoment.div(oneMinusAccBeta2);
                var variable = math.scaledArrayAdd(_this.cGraph, biasCorrectedFirstMoment.div(_this.eps.add(biasCorrectedSecondMoment.sqrt())), _this.one, oldVariable);
                activationArrayMap.set(node.output, globals_1.keep(variable));
                node.data = variable;
                _this.firstMomentGraph.set(node.output, globals_1.keep(newFirstMoment));
                _this.secondMomentGraph.set(node.output, globals_1.keep(newSecondMoment));
                oldVariable.dispose();
                gradient.dispose();
                oldFirstMoment.dispose();
                oldSecondMoment.dispose();
            });
            _this.accBeta1.assign(_this.accBeta1.mul(_this.beta1));
            _this.accBeta2.assign(_this.accBeta2.mul(_this.beta2));
        });
        this.variableGradients.dispose();
        this.variableGradients = new tensor_array_map_1.TensorArrayMap();
    };
    AdamOptimizer.prototype.dispose = function () {
        var _this = this;
        _super.prototype.dispose.call(this);
        this.c.dispose();
        this.eps.dispose();
        this.beta1.dispose();
        this.beta2.dispose();
        this.accBeta1.dispose();
        this.accBeta2.dispose();
        this.oneMinusBeta1.dispose();
        this.oneMinusBeta2.dispose();
        this.one.dispose();
        if (this.firstMomentGraph != null) {
            this.firstMomentGraph.dispose();
        }
        if (this.secondMomentGraph != null) {
            this.secondMomentGraph.dispose();
        }
        if (this.accumulatedFirstMoment != null) {
            Object.keys(this.accumulatedFirstMoment)
                .forEach(function (name) { return _this.accumulatedFirstMoment[name].dispose(); });
        }
        if (this.accumulatedSecondMoment != null) {
            Object.keys(this.accumulatedSecondMoment)
                .forEach(function (name) { return _this.accumulatedSecondMoment[name].dispose(); });
        }
    };
    return AdamOptimizer;
}(optimizer_1.Optimizer));
exports.AdamOptimizer = AdamOptimizer;

},{"../environment":35,"../globals":36,"../graph/tensor_array_map":67,"../ops/ops":122,"../tensor":145,"./optimizer":139}],137:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var tensor_array_map_1 = require("../graph/tensor_array_map");
var ops_1 = require("../ops/ops");
var tensor_1 = require("../tensor");
var optimizer_1 = require("./optimizer");
var AdamaxOptimizer = (function (_super) {
    __extends(AdamaxOptimizer, _super);
    function AdamaxOptimizer(learningRate, beta1, beta2, epsilon, decay, specifiedVariableList) {
        if (epsilon === void 0) { epsilon = 1e-8; }
        if (decay === void 0) { decay = 0.0; }
        var _this = _super.call(this, learningRate, specifiedVariableList) || this;
        _this.learningRate = learningRate;
        _this.accumulatedFirstMoment = {};
        _this.accumulatedWeightedInfNorm = {};
        _this.firstMomentGraph = new tensor_array_map_1.TensorArrayMap();
        _this.weightedInfNormGraph = new tensor_array_map_1.TensorArrayMap();
        _this.c = globals_1.keep(ops_1.scalar(-learningRate));
        _this.eps = globals_1.keep(ops_1.scalar(epsilon));
        _this.beta1 = globals_1.keep(ops_1.scalar(beta1));
        _this.beta2 = globals_1.keep(ops_1.scalar(beta2));
        _this.decay = globals_1.keep(ops_1.scalar(decay));
        globals_1.tidy(function () {
            _this.iteration = ops_1.scalar(0).variable();
            _this.accBeta1 = ops_1.scalar(beta1).variable();
        });
        _this.oneMinusBeta1 = globals_1.keep(ops_1.scalar(1 - beta1));
        _this.one = globals_1.keep(ops_1.scalar(1));
        return _this;
    }
    AdamaxOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        globals_1.tidy(function () {
            var oneMinusAccBeta1 = _this.one.sub(_this.accBeta1);
            var lr = _this.c.div(_this.one.add(_this.decay.mul(_this.iteration)));
            for (var variableName in variableGradients) {
                var value = environment_1.ENV.engine.registeredVariables[variableName];
                if (_this.accumulatedFirstMoment[variableName] == null) {
                    var trainable = false;
                    _this.accumulatedFirstMoment[variableName] =
                        ops_1.zerosLike(value).variable(trainable);
                }
                if (_this.accumulatedWeightedInfNorm[variableName] == null) {
                    var trainable = false;
                    _this.accumulatedWeightedInfNorm[variableName] =
                        ops_1.zerosLike(value).variable(trainable);
                }
                var gradient = variableGradients[variableName];
                var firstMoment = _this.accumulatedFirstMoment[variableName];
                var weightedInfNorm = _this.accumulatedWeightedInfNorm[variableName];
                var newFirstMoment = _this.beta1.mul(firstMoment).add(_this.oneMinusBeta1.mul(gradient));
                var ut0 = _this.beta2.mul(weightedInfNorm);
                var ut1 = gradient.abs();
                var newWeightedInfNorm = ut0.maximum(ut1);
                _this.accumulatedFirstMoment[variableName].assign(newFirstMoment);
                _this.accumulatedWeightedInfNorm[variableName].assign(newWeightedInfNorm);
                var newValue = lr.div(oneMinusAccBeta1)
                    .mul(newFirstMoment.div(_this.eps.add(newWeightedInfNorm)))
                    .add(value);
                value.assign(newValue);
            }
            _this.iteration.assign(_this.iteration.add(_this.one));
            _this.accBeta1.assign(_this.accBeta1.mul(_this.beta1));
        });
    };
    AdamaxOptimizer.prototype.beforeBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        _super.prototype.beforeBatch.call(this, math, batchSize, runtime, activationArrayMap, gradientArrayMap);
        if (this.firstMomentGraph.size() === 0) {
            this.variableNodes.forEach(function (node) {
                _this.firstMomentGraph.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
            });
        }
        if (this.weightedInfNormGraph.size() === 0) {
            this.variableNodes.forEach(function (node) {
                _this.weightedInfNormGraph.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
            });
        }
    };
    AdamaxOptimizer.prototype.afterBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        globals_1.tidy(function () {
            var lr = _this.cGraph.div(_this.one.add(_this.decay.mul(_this.iteration)));
            _this.variableNodes.forEach(function (node) {
                var oldVariable = activationArrayMap.get(node.output);
                var gradient = _this.variableGradients.get(node.output);
                var oldFirstMoment = _this.firstMomentGraph.get(node.output);
                var oldWeightedInfNorm = _this.weightedInfNormGraph.get(node.output);
                var newFirstMoment = math.scaledArrayAdd(_this.beta1, oldFirstMoment, _this.oneMinusBeta1, gradient);
                var ut0 = _this.beta2.mul(oldWeightedInfNorm);
                var ut1 = gradient.abs();
                var newWeightedInfNorm = ut0.maximum(ut1);
                var variable = math.scaledArrayAdd(_this.one, oldVariable, lr.div(_this.one.sub(_this.accBeta1)), newFirstMoment.div(_this.eps.add(newWeightedInfNorm)));
                activationArrayMap.set(node.output, globals_1.keep(variable));
                node.data = variable;
                _this.firstMomentGraph.set(node.output, globals_1.keep(newFirstMoment));
                _this.weightedInfNormGraph.set(node.output, globals_1.keep(newWeightedInfNorm));
                oldVariable.dispose();
                gradient.dispose();
                oldFirstMoment.dispose();
                oldWeightedInfNorm.dispose();
            });
            _this.iteration.assign(_this.iteration.add(_this.one));
            _this.accBeta1.assign(_this.accBeta1.mul(_this.beta1));
        });
        this.variableGradients.dispose();
        this.variableGradients = new tensor_array_map_1.TensorArrayMap();
    };
    AdamaxOptimizer.prototype.dispose = function () {
        var _this = this;
        _super.prototype.dispose.call(this);
        this.c.dispose();
        this.eps.dispose();
        this.accBeta1.dispose();
        this.beta1.dispose();
        this.beta2.dispose();
        this.oneMinusBeta1.dispose();
        this.decay.dispose();
        this.iteration.dispose();
        this.one.dispose();
        if (this.firstMomentGraph != null) {
            this.firstMomentGraph.dispose();
        }
        if (this.weightedInfNormGraph != null) {
            this.weightedInfNormGraph.dispose();
        }
        if (this.accumulatedFirstMoment != null) {
            Object.keys(this.accumulatedFirstMoment)
                .forEach(function (name) { return _this.accumulatedFirstMoment[name].dispose(); });
        }
        if (this.accumulatedWeightedInfNorm != null) {
            Object.keys(this.accumulatedWeightedInfNorm)
                .forEach(function (name) { return _this.accumulatedWeightedInfNorm[name].dispose(); });
        }
    };
    return AdamaxOptimizer;
}(optimizer_1.Optimizer));
exports.AdamaxOptimizer = AdamaxOptimizer;

},{"../environment":35,"../globals":36,"../graph/tensor_array_map":67,"../ops/ops":122,"../tensor":145,"./optimizer":139}],138:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var tensor_array_map_1 = require("../graph/tensor_array_map");
var ops_1 = require("../ops/ops");
var tensor_1 = require("../tensor");
var sgd_optimizer_1 = require("./sgd_optimizer");
var MomentumOptimizer = (function (_super) {
    __extends(MomentumOptimizer, _super);
    function MomentumOptimizer(learningRate, momentum, specifiedVariableList, useNesterov) {
        if (useNesterov === void 0) { useNesterov = false; }
        var _this = _super.call(this, learningRate, specifiedVariableList) || this;
        _this.learningRate = learningRate;
        _this.momentum = momentum;
        _this.useNesterov = useNesterov;
        _this.m = ops_1.scalar(_this.momentum);
        _this.accumulations = {};
        return _this;
    }
    MomentumOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        var _loop_1 = function (variableName) {
            var value = environment_1.ENV.engine.registeredVariables[variableName];
            if (this_1.accumulations[variableName] == null) {
                var trainable_1 = false;
                globals_1.tidy(function () {
                    _this.accumulations[variableName] =
                        ops_1.zerosLike(value).variable(trainable_1);
                });
            }
            var accumulation = this_1.accumulations[variableName];
            var gradient = variableGradients[variableName];
            globals_1.tidy(function () {
                var newValue;
                var newAccumulation = _this.m.mul(accumulation).add(gradient);
                if (_this.useNesterov) {
                    newValue =
                        _this.c.mul(gradient.add(newAccumulation.mul(_this.m))).add(value);
                }
                else {
                    newValue = _this.c.mul(newAccumulation).add(value);
                }
                _this.accumulations[variableName].assign(newAccumulation);
                value.assign(newValue);
            });
        };
        var this_1 = this;
        for (var variableName in variableGradients) {
            _loop_1(variableName);
        }
    };
    MomentumOptimizer.prototype.beforeBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        if (this.variableVelocitiesGraph == null) {
            this.variableVelocitiesGraph = new tensor_array_map_1.TensorArrayMap();
        }
        _super.prototype.beforeBatch.call(this, math, batchSize, runtime, activationArrayMap, gradientArrayMap);
        if (this.variableVelocitiesGraph.size() === 0) {
            this.variableNodes.forEach(function (node) {
                _this.variableVelocitiesGraph.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
            });
        }
    };
    MomentumOptimizer.prototype.afterBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        globals_1.tidy(function () {
            _this.variableNodes.forEach(function (node) {
                var oldVariable = activationArrayMap.get(node.output);
                var gradient = _this.variableGradients.get(node.output);
                var oldVelocity = _this.variableVelocitiesGraph.get(node.output);
                var variable;
                var velocity = _this.m.mul(oldVelocity).add(gradient);
                if (_this.useNesterov) {
                    variable = _this.cGraph.mul(gradient.add(velocity.mul(_this.m)))
                        .add(oldVariable);
                }
                else {
                    variable = _this.cGraph.mul(velocity).add(oldVariable);
                }
                _this.variableVelocitiesGraph.set(node.output, globals_1.keep(velocity));
                activationArrayMap.set(node.output, globals_1.keep(variable));
                node.data = variable;
                oldVariable.dispose();
                oldVelocity.dispose();
            });
        });
        this.variableGradients.dispose();
        this.variableGradients = new tensor_array_map_1.TensorArrayMap();
    };
    MomentumOptimizer.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.m.dispose();
        if (this.variableVelocitiesGraph != null) {
            this.variableVelocitiesGraph.dispose();
        }
        if (this.accumulations != null) {
            for (var variableName in this.accumulations) {
                this.accumulations[variableName].dispose();
            }
        }
    };
    MomentumOptimizer.prototype.setMomentum = function (momentum) {
        this.momentum = momentum;
    };
    return MomentumOptimizer;
}(sgd_optimizer_1.SGDOptimizer));
exports.MomentumOptimizer = MomentumOptimizer;

},{"../environment":35,"../globals":36,"../graph/tensor_array_map":67,"../ops/ops":122,"../tensor":145,"./sgd_optimizer":142}],139:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var globals_1 = require("../globals");
var session_util = require("../graph/session_util");
var tensor_array_map_1 = require("../graph/tensor_array_map");
var ops = require("../ops/ops");
var tensor_1 = require("../tensor");
var Optimizer = (function () {
    function Optimizer(learningRate, specifiedVariableList) {
        this.learningRate = learningRate;
        this.variableGradients = new tensor_array_map_1.TensorArrayMap();
        if (specifiedVariableList != null) {
            this.specifiedVariableNodes = specifiedVariableList;
        }
    }
    Optimizer.prototype.minimize = function (f, returnCost, varList) {
        if (returnCost === void 0) { returnCost = false; }
        var _a = this.computeGradients(f, varList), value = _a.value, grads = _a.grads;
        this.applyGradients(grads);
        var varNames = Object.keys(grads);
        varNames.forEach(function (varName) { return grads[varName].dispose(); });
        if (returnCost) {
            return value;
        }
        else {
            value.dispose();
            return null;
        }
    };
    Optimizer.prototype.computeGradients = function (f, varList) {
        return globals_1.variableGrads(f, varList);
    };
    Optimizer.prototype.beforeBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        this.variableNodes = this.specifiedVariableNodes == null ?
            session_util.getVariableNodesFromEvaluationSet(runtime.nodes) :
            this.specifiedVariableNodes;
        if (batchSize !== this.prevBatchSize) {
            if (this.cGraph != null) {
                this.cGraph.dispose();
            }
            this.prevBatchSize = batchSize;
            this.cGraph = math.keep(ops.scalar(-this.learningRate / batchSize));
        }
        this.variableNodes.forEach(function (node) { return _this.variableGradients.set(node.output, math.keep(tensor_1.Tensor.zeros(node.output.shape))); });
    };
    Optimizer.prototype.afterExample = function (math, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        globals_1.tidy(function () {
            _this.variableNodes.forEach(function (node) {
                var gradient = gradientArrayMap.get(node.output);
                var accumulatedGradient = _this.variableGradients.get(node.output);
                _this.variableGradients.set(node.output, globals_1.keep(math.add(gradient, accumulatedGradient)));
                accumulatedGradient.dispose();
            });
        });
    };
    Optimizer.prototype.dispose = function () {
        if (this.cGraph != null) {
            this.cGraph.dispose();
        }
        if (this.variableNodes != null) {
            this.variableNodes.forEach(function (node) {
                node.data.dispose();
            });
        }
        if (this.specifiedVariableNodes != null) {
            this.specifiedVariableNodes.forEach(function (node) {
                node.data.dispose();
            });
        }
    };
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers' })
    ], Optimizer.prototype, "minimize", null);
    Optimizer = __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Classes', namespace: 'train' })
    ], Optimizer);
    return Optimizer;
}());
exports.Optimizer = Optimizer;

},{"../doc":33,"../globals":36,"../graph/session_util":66,"../graph/tensor_array_map":67,"../ops/ops":122,"../tensor":145}],140:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var adadelta_optimizer_1 = require("./adadelta_optimizer");
var adagrad_optimizer_1 = require("./adagrad_optimizer");
var adam_optimizer_1 = require("./adam_optimizer");
var adamax_optimizer_1 = require("./adamax_optimizer");
var momentum_optimizer_1 = require("./momentum_optimizer");
var rmsprop_optimizer_1 = require("./rmsprop_optimizer");
var sgd_optimizer_1 = require("./sgd_optimizer");
var OptimizerConstructors = (function () {
    function OptimizerConstructors() {
    }
    OptimizerConstructors.sgd = function (learningRate) {
        return new sgd_optimizer_1.SGDOptimizer(learningRate);
    };
    OptimizerConstructors.momentum = function (learningRate, momentum, useNesterov) {
        if (useNesterov === void 0) { useNesterov = false; }
        return new momentum_optimizer_1.MomentumOptimizer(learningRate, momentum, undefined, useNesterov);
    };
    OptimizerConstructors.rmsprop = function (learningRate, decay, momentum, epsilon) {
        if (decay === void 0) { decay = .9; }
        if (momentum === void 0) { momentum = 0.0; }
        if (epsilon === void 0) { epsilon = 1e-8; }
        return new rmsprop_optimizer_1.RMSPropOptimizer(learningRate, decay, momentum, undefined, epsilon);
    };
    OptimizerConstructors.adam = function (learningRate, beta1, beta2, epsilon) {
        if (learningRate === void 0) { learningRate = 0.001; }
        if (beta1 === void 0) { beta1 = 0.9; }
        if (beta2 === void 0) { beta2 = 0.999; }
        if (epsilon === void 0) { epsilon = 1e-8; }
        return new adam_optimizer_1.AdamOptimizer(learningRate, beta1, beta2, epsilon, undefined);
    };
    OptimizerConstructors.adadelta = function (learningRate, rho, epsilon) {
        if (learningRate === void 0) { learningRate = .001; }
        if (rho === void 0) { rho = .95; }
        if (epsilon === void 0) { epsilon = 1e-8; }
        return new adadelta_optimizer_1.AdadeltaOptimizer(learningRate, rho, undefined, epsilon);
    };
    OptimizerConstructors.adamax = function (learningRate, beta1, beta2, epsilon, decay) {
        if (learningRate === void 0) { learningRate = 0.002; }
        if (beta1 === void 0) { beta1 = 0.9; }
        if (beta2 === void 0) { beta2 = 0.999; }
        if (epsilon === void 0) { epsilon = 1e-8; }
        if (decay === void 0) { decay = 0.0; }
        return new adamax_optimizer_1.AdamaxOptimizer(learningRate, beta1, beta2, epsilon, decay, undefined);
    };
    OptimizerConstructors.adagrad = function (learningRate, initialAccumulatorValue) {
        if (initialAccumulatorValue === void 0) { initialAccumulatorValue = 0.1; }
        return new adagrad_optimizer_1.AdagradOptimizer(learningRate, undefined, initialAccumulatorValue);
    };
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "sgd", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "momentum", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "rmsprop", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "adam", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "adadelta", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "adamax", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "adagrad", null);
    return OptimizerConstructors;
}());
exports.OptimizerConstructors = OptimizerConstructors;

},{"../doc":33,"./adadelta_optimizer":134,"./adagrad_optimizer":135,"./adam_optimizer":136,"./adamax_optimizer":137,"./momentum_optimizer":138,"./rmsprop_optimizer":141,"./sgd_optimizer":142}],141:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var session_util = require("../graph/session_util");
var tensor_array_map_1 = require("../graph/tensor_array_map");
var ops_1 = require("../ops/ops");
var tensor_1 = require("../tensor");
var optimizer_1 = require("./optimizer");
var RMSPropOptimizer = (function (_super) {
    __extends(RMSPropOptimizer, _super);
    function RMSPropOptimizer(learningRate, decay, momentum, specifiedVariableList, epsilon) {
        if (decay === void 0) { decay = 0.9; }
        if (momentum === void 0) { momentum = 0.0; }
        if (epsilon === void 0) { epsilon = 1e-8; }
        var _this = _super.call(this, learningRate, specifiedVariableList) || this;
        _this.learningRate = learningRate;
        _this.accumulatedMeanSquares = {};
        _this.accumulatedMoments = {};
        _this.accumulatedMeanSquaredGraph = new tensor_array_map_1.TensorArrayMap();
        _this.accumulatedMomentGraph = new tensor_array_map_1.TensorArrayMap();
        _this.c = globals_1.keep(ops_1.scalar(learningRate));
        _this.epsilon = globals_1.keep(ops_1.scalar(epsilon));
        _this.decay = globals_1.keep(ops_1.scalar(decay));
        _this.momentum = globals_1.keep(ops_1.scalar(momentum));
        _this.oneMinusDecay = globals_1.keep(ops_1.scalar(1 - decay));
        return _this;
    }
    RMSPropOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        var _loop_1 = function (variableName) {
            var value = environment_1.ENV.engine.registeredVariables[variableName];
            if (this_1.accumulatedMeanSquares[variableName] == null) {
                var trainable_1 = false;
                globals_1.tidy(function () {
                    _this.accumulatedMeanSquares[variableName] =
                        ops_1.zerosLike(value).variable(trainable_1);
                });
            }
            if (this_1.accumulatedMoments[variableName] == null) {
                var trainable_2 = false;
                globals_1.tidy(function () {
                    _this.accumulatedMoments[variableName] =
                        ops_1.zerosLike(value).variable(trainable_2);
                });
            }
            var accumulatedMeanSquare = this_1.accumulatedMeanSquares[variableName];
            var accumulatedMoments = this_1.accumulatedMoments[variableName];
            var gradient = variableGradients[variableName];
            globals_1.tidy(function () {
                var newAccumulatedMeanSquare = _this.decay.mul(accumulatedMeanSquare)
                    .add(_this.oneMinusDecay.mul(gradient.square()));
                var newAccumulatedMoments = _this.momentum.mul(accumulatedMoments)
                    .add(_this.c.mul(gradient).div(newAccumulatedMeanSquare.add(_this.epsilon).sqrt()));
                _this.accumulatedMeanSquares[variableName].assign(newAccumulatedMeanSquare);
                _this.accumulatedMoments[variableName].assign(newAccumulatedMoments);
                var newValue = value.sub(newAccumulatedMoments);
                value.assign(newValue);
            });
        };
        var this_1 = this;
        for (var variableName in variableGradients) {
            _loop_1(variableName);
        }
    };
    RMSPropOptimizer.prototype.beforeBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        this.variableNodes = this.specifiedVariableNodes == null ?
            session_util.getVariableNodesFromEvaluationSet(runtime.nodes) :
            this.specifiedVariableNodes;
        if (batchSize !== this.prevBatchSize) {
            if (this.cGraph != null) {
                this.cGraph.dispose();
            }
            this.prevBatchSize = batchSize;
            this.cGraph = math.keep(ops_1.scalar(this.learningRate / batchSize));
        }
        this.variableNodes.forEach(function (node) { return _this.variableGradients.set(node.output, math.keep(tensor_1.Tensor.zeros(node.output.shape))); });
        if (this.accumulatedMeanSquaredGraph.size() === 0) {
            this.variableNodes.forEach(function (node) {
                _this.accumulatedMeanSquaredGraph.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
                _this.accumulatedMomentGraph.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
            });
        }
    };
    RMSPropOptimizer.prototype.afterBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        globals_1.tidy(function () {
            _this.variableNodes.forEach(function (node) {
                var oldVariable = activationArrayMap.get(node.output);
                var gradient = _this.variableGradients.get(node.output);
                var oldMeanSquare = _this.accumulatedMeanSquaredGraph.get(node.output);
                var oldMoment = _this.accumulatedMomentGraph.get(node.output);
                var meanSquare = math.scaledArrayAdd(_this.decay, oldMeanSquare, _this.oneMinusDecay, gradient.square());
                var moment = math.scaledArrayAdd(_this.momentum, oldMoment, _this.cGraph, gradient.div(meanSquare.add(_this.epsilon).sqrt()));
                var variable = oldVariable.sub(moment);
                _this.accumulatedMeanSquaredGraph.set(node.output, globals_1.keep(meanSquare));
                _this.accumulatedMomentGraph.set(node.output, globals_1.keep(moment));
                activationArrayMap.set(node.output, globals_1.keep(variable));
                node.data = variable;
                oldVariable.dispose();
                oldMeanSquare.dispose();
                oldMoment.dispose();
            });
        });
        this.variableGradients.dispose();
        this.variableGradients = new tensor_array_map_1.TensorArrayMap();
    };
    RMSPropOptimizer.prototype.dispose = function () {
        var _this = this;
        _super.prototype.dispose.call(this);
        this.c.dispose();
        this.epsilon.dispose();
        this.decay.dispose();
        this.momentum.dispose();
        this.oneMinusDecay.dispose();
        if (this.accumulatedMeanSquaredGraph != null) {
            this.accumulatedMeanSquaredGraph.dispose();
        }
        if (this.accumulatedMomentGraph != null) {
            this.accumulatedMomentGraph.dispose();
        }
        if (this.accumulatedMeanSquares != null) {
            Object.keys(this.accumulatedMeanSquares)
                .forEach(function (name) { return _this.accumulatedMeanSquares[name].dispose(); });
        }
        if (this.accumulatedMoments != null) {
            Object.keys(this.accumulatedMoments)
                .forEach(function (name) { return _this.accumulatedMoments[name].dispose(); });
        }
    };
    return RMSPropOptimizer;
}(optimizer_1.Optimizer));
exports.RMSPropOptimizer = RMSPropOptimizer;

},{"../environment":35,"../globals":36,"../graph/session_util":66,"../graph/tensor_array_map":67,"../ops/ops":122,"../tensor":145,"./optimizer":139}],142:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var tensor_array_map_1 = require("../graph/tensor_array_map");
var ops_1 = require("../ops/ops");
var optimizer_1 = require("./optimizer");
var SGDOptimizer = (function (_super) {
    __extends(SGDOptimizer, _super);
    function SGDOptimizer(learningRate, specifiedVariableList) {
        var _this = _super.call(this, learningRate, specifiedVariableList) || this;
        _this.learningRate = learningRate;
        _this.setLearningRate(learningRate);
        return _this;
    }
    SGDOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        var varNames = Object.keys(variableGradients);
        varNames.forEach(function (varName) {
            var gradient = variableGradients[varName];
            var value = environment_1.ENV.engine.registeredVariables[varName];
            globals_1.tidy(function () {
                var newValue = _this.c.mul(gradient).add(value);
                value.assign(newValue);
            });
        });
    };
    SGDOptimizer.prototype.setLearningRate = function (learningRate) {
        this.learningRate = learningRate;
        if (this.c != null) {
            this.c.dispose();
        }
        this.c = environment_1.ENV.math.keep(ops_1.scalar(-learningRate));
    };
    SGDOptimizer.prototype.dispose = function () {
        this.c.dispose();
        if (this.one != null) {
            this.one.dispose();
        }
        _super.prototype.dispose.call(this);
    };
    SGDOptimizer.prototype.afterBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        if (this.one == null) {
            this.one = globals_1.keep(ops_1.scalar(1));
        }
        globals_1.tidy(function () {
            _this.variableNodes.forEach(function (node) {
                var oldVariable = activationArrayMap.get(node.output);
                var gradient = _this.variableGradients.get(node.output);
                var variable = math.scaledArrayAdd(_this.cGraph, gradient, _this.one, oldVariable);
                activationArrayMap.set(node.output, globals_1.keep(variable));
                node.data = variable;
                oldVariable.dispose();
            });
        });
        this.variableGradients.dispose();
        this.variableGradients = new tensor_array_map_1.TensorArrayMap();
    };
    return SGDOptimizer;
}(optimizer_1.Optimizer));
exports.SGDOptimizer = SGDOptimizer;

},{"../environment":35,"../globals":36,"../graph/tensor_array_map":67,"../ops/ops":122,"./optimizer":139}],143:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./util");
var Profiler = (function () {
    function Profiler(backendTimer, logger) {
        this.backendTimer = backendTimer;
        this.logger = logger;
        if (logger == null) {
            this.logger = new Logger();
        }
    }
    Profiler.prototype.profileKernel = function (name, f) {
        var _this = this;
        var result;
        var holdResultWrapperFn = function () {
            result = f();
        };
        var timer = this.backendTimer.time(holdResultWrapperFn);
        var vals = result.dataSync();
        util.checkForNaN(vals, result.dtype, name);
        timer.then(function (timing) {
            _this.logger.logKernelProfile(name, result, vals, timing.kernelMs);
        });
        return result;
    };
    return Profiler;
}());
exports.Profiler = Profiler;
var Logger = (function () {
    function Logger() {
    }
    Logger.prototype.logKernelProfile = function (name, result, vals, timeMs) {
        var time = util.rightPad(timeMs + "ms", 9);
        var paddedName = util.rightPad(name, 25);
        var rank = result.rank;
        var size = result.size;
        var shape = util.rightPad(result.shape.toString(), 14);
        console.log("%c" + paddedName + "\t%c" + time + "\t%c" + rank + "D " + shape + "\t%c" + size, 'font-weight:bold', 'color:red', 'color:blue', 'color: orange');
    };
    return Logger;
}());
exports.Logger = Logger;

},{"./util":151}],144:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./util");
function getFilteredNodesXToY(tape, xs, y) {
    var tensorsFromX = {};
    var nodesFromX = {};
    for (var i = 0; i < xs.length; i++) {
        tensorsFromX[xs[i].id] = true;
    }
    for (var i = 0; i < tape.length; i++) {
        var node = tape[i];
        var nodeInputs = node.inputs;
        for (var inputName in nodeInputs) {
            var input = nodeInputs[inputName];
            var anyInputFromX = false;
            for (var j = 0; j < xs.length; j++) {
                if (tensorsFromX[input.id]) {
                    tensorsFromX[node.output.id] = true;
                    anyInputFromX = true;
                    nodesFromX[node.id] = true;
                    break;
                }
            }
            if (anyInputFromX) {
                break;
            }
        }
    }
    var tensorsLeadToY = {};
    tensorsLeadToY[y.id] = true;
    var nodesToY = {};
    for (var i = tape.length - 1; i >= 0; i--) {
        var node = tape[i];
        var nodeInputs = node.inputs;
        var outputs = [];
        outputs.push(node.output);
        for (var j = 0; j < outputs.length; j++) {
            if (tensorsLeadToY[outputs[j].id]) {
                for (var inputName in nodeInputs) {
                    tensorsLeadToY[nodeInputs[inputName].id] = true;
                    nodesToY[node.id] = true;
                }
                break;
            }
        }
    }
    var filteredTape = [];
    for (var i = 0; i < tape.length; i++) {
        var node = tape[i];
        if (nodesFromX[node.id] && nodesToY[node.id]) {
            var prunedInputs = {};
            for (var inputName in node.inputs) {
                var nodeInput = node.inputs[inputName];
                if (tensorsFromX[nodeInput.id]) {
                    prunedInputs[inputName] = nodeInput;
                }
            }
            var prunedNode = Object.assign({}, node);
            prunedNode.inputs = prunedInputs;
            prunedNode.output = node.output;
            filteredTape.push(prunedNode);
        }
    }
    return filteredTape;
}
exports.getFilteredNodesXToY = getFilteredNodesXToY;
function backpropagateGradients(tensorAccumulatedGradientMap, filteredTape) {
    for (var i = filteredTape.length - 1; i >= 0; i--) {
        var node = filteredTape[i];
        var dy = tensorAccumulatedGradientMap[node.output.id];
        if (node.gradient == null) {
            throw new Error("Cannot compute gradient: gradient function not found " +
                ("for " + node.name + "."));
        }
        var inputGradients = node.gradient(dy);
        for (var inputName in node.inputs) {
            if (!(inputName in inputGradients)) {
                throw new Error("Cannot backprop through input " + inputName + ". " +
                    ("Available gradients found: " + Object.keys(inputGradients) + "."));
            }
            var dx = inputGradients[inputName]();
            var x = node.inputs[inputName];
            if (!util.arraysEqual(dx.shape, x.shape)) {
                throw new Error("Error in gradient for op " + node.name + ". The gradient of input " +
                    ("'" + inputName + "' has shape '" + dx.shape + "', which does not match ") +
                    ("the shape of the input '" + x.shape + "'"));
            }
            if (tensorAccumulatedGradientMap[x.id] == null) {
                tensorAccumulatedGradientMap[x.id] = dx;
            }
            else {
                var curGradient = tensorAccumulatedGradientMap[x.id];
                tensorAccumulatedGradientMap[x.id] = curGradient.add(dx);
                curGradient.dispose();
            }
        }
    }
}
exports.backpropagateGradients = backpropagateGradients;

},{"./util":151}],145:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("./doc");
var environment_1 = require("./environment");
var ops = require("./ops/ops");
var tensor_util = require("./tensor_util");
var util = require("./util");
var TensorBuffer = (function () {
    function TensorBuffer(shape, dtype, values) {
        this.shape = shape;
        this.dtype = dtype;
        this.values = values;
        if (values != null) {
            var n = values.length;
            var size = util.sizeFromShape(shape);
            util.assert(n === size, "Length of values '" + n + "' does not match the size " +
                ("inferred by the shape '" + size + "'"));
        }
        this.values =
            values || util.getTypedArrayFromDType(dtype, util.sizeFromShape(shape));
        this.strides = computeStrides(shape);
        this.size = util.sizeFromShape(shape);
    }
    TensorBuffer.prototype.set = function (value) {
        var locs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            locs[_i - 1] = arguments[_i];
        }
        if (locs.length === 0) {
            locs = [0];
        }
        util.assert(locs.length === this.rank, "The number of provided coordinates (" + locs.length + ") must " +
            ("match the rank (" + this.rank + ")"));
        var index = this.locToIndex(locs);
        this.values[index] = value;
    };
    TensorBuffer.prototype.get = function () {
        var locs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            locs[_i] = arguments[_i];
        }
        if (locs.length === 0) {
            locs = [0];
        }
        var index = locs[locs.length - 1];
        for (var i = 0; i < locs.length - 1; ++i) {
            index += this.strides[i] * locs[i];
        }
        return this.values[index];
    };
    TensorBuffer.prototype.locToIndex = function (locs) {
        if (this.rank === 0) {
            return 0;
        }
        else if (this.rank === 1) {
            return locs[0];
        }
        var index = locs[locs.length - 1];
        for (var i = 0; i < locs.length - 1; ++i) {
            index += this.strides[i] * locs[i];
        }
        return index;
    };
    TensorBuffer.prototype.indexToLoc = function (index) {
        if (this.rank === 0) {
            return [];
        }
        else if (this.rank === 1) {
            return [index];
        }
        var locs = new Array(this.shape.length);
        for (var i = 0; i < locs.length - 1; ++i) {
            locs[i] = Math.floor(index / this.strides[i]);
            index -= locs[i] * this.strides[i];
        }
        locs[locs.length - 1] = index;
        return locs;
    };
    Object.defineProperty(TensorBuffer.prototype, "rank", {
        get: function () {
            return this.shape.length;
        },
        enumerable: true,
        configurable: true
    });
    TensorBuffer.prototype.toTensor = function () {
        return Tensor.make(this.shape, { values: this.values }, this.dtype);
    };
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorBuffer.prototype, "set", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorBuffer.prototype, "get", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], TensorBuffer.prototype, "toTensor", null);
    TensorBuffer = __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], TensorBuffer);
    return TensorBuffer;
}());
exports.TensorBuffer = TensorBuffer;
var Tensor = (function () {
    function Tensor(shape, dtype, values, dataId) {
        this.isDisposed = false;
        this.size = util.sizeFromShape(shape);
        if (values != null) {
            util.assert(this.size === values.length, "Constructing tensor of shape (" + this.size + ") should match the " +
                ("length of values (" + values.length + ")"));
        }
        this.shape = shape;
        this.dtype = dtype || 'float32';
        this.strides = computeStrides(shape);
        this.dataId = dataId != null ? dataId : {};
        this.id = Tensor_1.nextId++;
        this.rankType = (this.rank < 5 ? this.rank.toString() : 'higher');
        environment_1.ENV.engine.registerTensor(this);
        if (values != null) {
            environment_1.ENV.engine.write(this.dataId, values);
        }
    }
    Tensor_1 = Tensor;
    Tensor.ones = function (shape, dtype) {
        return ops.ones(shape, dtype);
    };
    Tensor.zeros = function (shape, dtype) {
        return ops.zeros(shape, dtype);
    };
    Tensor.onesLike = function (x) {
        return ops.onesLike(x);
    };
    Tensor.zerosLike = function (x) {
        return ops.zerosLike(x);
    };
    Tensor.like = function (x) {
        return ops.clone(x);
    };
    Tensor.make = function (shape, data, dtype) {
        return new Tensor_1(shape, dtype, data.values, data.dataId);
    };
    Tensor.fromPixels = function (pixels, numChannels) {
        if (numChannels === void 0) { numChannels = 3; }
        return ops.fromPixels(pixels, numChannels);
    };
    Tensor.rand = function (shape, randFunction, dtype) {
        return ops.rand(shape, randFunction, dtype);
    };
    Tensor.randNormal = function (shape, mean, stdDev, dtype, seed) {
        if (mean === void 0) { mean = 0; }
        if (stdDev === void 0) { stdDev = 1; }
        return ops.randomNormal(shape, mean, stdDev, dtype, seed);
    };
    Tensor.randTruncatedNormal = function (shape, mean, stdDev, dtype, seed) {
        if (mean === void 0) { mean = 0; }
        if (stdDev === void 0) { stdDev = 1; }
        return ops.truncatedNormal(shape, mean, stdDev, dtype, seed);
    };
    Tensor.randUniform = function (shape, a, b, dtype) {
        return ops.randomUniform(shape, a, b, dtype);
    };
    Tensor.prototype.flatten = function () {
        this.throwIfDisposed();
        return this.as1D();
    };
    Tensor.prototype.asScalar = function () {
        this.throwIfDisposed();
        util.assert(this.size === 1, 'The array must have only 1 element.');
        return this.reshape([]);
    };
    Tensor.prototype.as1D = function () {
        this.throwIfDisposed();
        return this.reshape([this.size]);
    };
    Tensor.prototype.as2D = function (rows, columns) {
        this.throwIfDisposed();
        return this.reshape([rows, columns]);
    };
    Tensor.prototype.as3D = function (rows, columns, depth) {
        this.throwIfDisposed();
        return this.reshape([rows, columns, depth]);
    };
    Tensor.prototype.as4D = function (rows, columns, depth, depth2) {
        this.throwIfDisposed();
        return this.reshape([rows, columns, depth, depth2]);
    };
    Tensor.prototype.asType = function (dtype) {
        this.throwIfDisposed();
        return ops.cast(this, dtype);
    };
    Object.defineProperty(Tensor.prototype, "rank", {
        get: function () {
            return this.shape.length;
        },
        enumerable: true,
        configurable: true
    });
    Tensor.prototype.get = function () {
        var locs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            locs[_i] = arguments[_i];
        }
        this.throwIfDisposed();
        if (locs.length === 0) {
            locs = [0];
        }
        var index = locs[locs.length - 1];
        for (var i = 0; i < locs.length - 1; ++i) {
            index += this.strides[i] * locs[i];
        }
        return this.dataSync()[index];
    };
    Tensor.prototype.val = function () {
        var locs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            locs[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (locs.length === 0) {
                            locs = [0];
                        }
                        this.throwIfDisposed();
                        return [4, this.data()];
                    case 1:
                        _a.sent();
                        return [2, this.get.apply(this, locs)];
                }
            });
        });
    };
    Tensor.prototype.locToIndex = function (locs) {
        this.throwIfDisposed();
        if (this.rank === 0) {
            return 0;
        }
        else if (this.rank === 1) {
            return locs[0];
        }
        var index = locs[locs.length - 1];
        for (var i = 0; i < locs.length - 1; ++i) {
            index += this.strides[i] * locs[i];
        }
        return index;
    };
    Tensor.prototype.indexToLoc = function (index) {
        this.throwIfDisposed();
        if (this.rank === 0) {
            return [];
        }
        else if (this.rank === 1) {
            return [index];
        }
        var locs = new Array(this.shape.length);
        for (var i = 0; i < locs.length - 1; ++i) {
            locs[i] = Math.floor(index / this.strides[i]);
            index -= locs[i] * this.strides[i];
        }
        locs[locs.length - 1] = index;
        return locs;
    };
    Tensor.prototype.getValues = function () {
        return this.dataSync();
    };
    Tensor.prototype.getValuesAsync = function () {
        return this.data();
    };
    Tensor.prototype.buffer = function () {
        return ops.buffer(this.shape, this.dtype, this.dataSync());
    };
    Tensor.prototype.data = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.throwIfDisposed();
                return [2, environment_1.ENV.engine.read(this.dataId)];
            });
        });
    };
    Tensor.prototype.dataSync = function () {
        this.throwIfDisposed();
        return environment_1.ENV.engine.readSync(this.dataId);
    };
    Tensor.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        this.isDisposed = true;
        environment_1.ENV.engine.disposeTensor(this);
    };
    Tensor.prototype.throwIfDisposed = function () {
        if (this.isDisposed) {
            throw new Error("Tensor is disposed.");
        }
    };
    Tensor.prototype.toFloat = function () {
        return this.asType('float32');
    };
    Tensor.prototype.toInt = function () {
        return this.asType('int32');
    };
    Tensor.prototype.toBool = function () {
        return this.asType('bool');
    };
    Tensor.prototype.print = function (verbose) {
        if (verbose === void 0) { verbose = false; }
        return ops.print(this, verbose);
    };
    Tensor.prototype.reshape = function (newShape) {
        this.throwIfDisposed();
        return ops.reshape(this, newShape);
    };
    Tensor.prototype.reshapeAs = function (x) {
        this.throwIfDisposed();
        return this.reshape(x.shape);
    };
    Tensor.prototype.expandDims = function (axis) {
        if (axis === void 0) { axis = 0; }
        return ops.expandDims(this, axis);
    };
    Tensor.prototype.squeeze = function (axis) {
        this.throwIfDisposed();
        return ops.squeeze(this, axis);
    };
    Tensor.prototype.clone = function () {
        this.throwIfDisposed();
        return ops.clone(this);
    };
    Tensor.prototype.toString = function () {
        return tensor_util.tensorToString(this, true);
    };
    Tensor.prototype.tile = function (reps) {
        this.throwIfDisposed();
        return ops.tile(this, reps);
    };
    Tensor.prototype.gather = function (indices, axis) {
        if (axis === void 0) { axis = 0; }
        this.throwIfDisposed();
        return ops.gather(this, indices);
    };
    Tensor.prototype.matMul = function (b, transposeA, transposeB) {
        if (transposeA === void 0) { transposeA = false; }
        if (transposeB === void 0) { transposeB = false; }
        this.throwIfDisposed();
        return ops.matMul(this, b, transposeA, transposeB);
    };
    Tensor.prototype.norm = function (ord, axis, keepDims) {
        if (ord === void 0) { ord = 'euclidean'; }
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return ops.norm(this, ord, axis, keepDims);
    };
    Tensor.prototype.slice = function (begin, size) {
        this.throwIfDisposed();
        return ops.slice(this, begin, size);
    };
    Tensor.prototype.reverse = function (axis) {
        this.throwIfDisposed();
        return ops.reverse(this, axis);
    };
    Tensor.prototype.concat = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        this.throwIfDisposed();
        return ops.concat([this, x], axis);
    };
    Tensor.prototype.stack = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        return ops.stack([this, x], axis);
    };
    Tensor.prototype.pad = function (paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        return ops.pad(this, paddings, constantValue);
    };
    Tensor.prototype.batchNormalization = function (mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        this.throwIfDisposed();
        return ops.batchNormalization(this, mean, variance, varianceEpsilon, scale, offset);
    };
    Tensor.prototype.logSumExp = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return ops.logSumExp(this, axis, keepDims);
    };
    Tensor.prototype.sum = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return ops.sum(this, axis, keepDims);
    };
    Tensor.prototype.mean = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return ops.mean(this, axis, keepDims);
    };
    Tensor.prototype.min = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return ops.min(this, axis, keepDims);
    };
    Tensor.prototype.max = function (axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        this.throwIfDisposed();
        return ops.max(this, axis, keepDims);
    };
    Tensor.prototype.argMin = function (axis) {
        if (axis === void 0) { axis = null; }
        this.throwIfDisposed();
        return ops.argMin(this, axis);
    };
    Tensor.prototype.argMax = function (axis) {
        if (axis === void 0) { axis = null; }
        this.throwIfDisposed();
        return ops.argMax(this, axis);
    };
    Tensor.prototype.add = function (x) {
        this.throwIfDisposed();
        return ops.add(this, x);
    };
    Tensor.prototype.addStrict = function (x) {
        this.throwIfDisposed();
        return ops.addStrict(this, x);
    };
    Tensor.prototype.sub = function (x) {
        this.throwIfDisposed();
        return ops.sub(this, x);
    };
    Tensor.prototype.subStrict = function (x) {
        this.throwIfDisposed();
        return ops.subStrict(this, x);
    };
    Tensor.prototype.pow = function (exp) {
        this.throwIfDisposed();
        return ops.pow(this, exp);
    };
    Tensor.prototype.powStrict = function (exp) {
        this.throwIfDisposed();
        return ops.powStrict(this, exp);
    };
    Tensor.prototype.mul = function (x) {
        this.throwIfDisposed();
        return ops.mul(this, x);
    };
    Tensor.prototype.mulStrict = function (x) {
        this.throwIfDisposed();
        return ops.mulStrict(this, x);
    };
    Tensor.prototype.div = function (x) {
        this.throwIfDisposed();
        return ops.div(this, x);
    };
    Tensor.prototype.divStrict = function (x) {
        this.throwIfDisposed();
        return ops.divStrict(this, x);
    };
    Tensor.prototype.minimum = function (x) {
        this.throwIfDisposed();
        return ops.minimum(this, x);
    };
    Tensor.prototype.minimumStrict = function (x) {
        this.throwIfDisposed();
        return ops.minimumStrict(this, x);
    };
    Tensor.prototype.maximum = function (x) {
        this.throwIfDisposed();
        return ops.maximum(this, x);
    };
    Tensor.prototype.maximumStrict = function (x) {
        this.throwIfDisposed();
        return ops.maximumStrict(this, x);
    };
    Tensor.prototype.transpose = function (perm) {
        this.throwIfDisposed();
        return ops.transpose(this, perm);
    };
    Tensor.prototype.notEqual = function (x) {
        this.throwIfDisposed();
        return ops.notEqual(this, x);
    };
    Tensor.prototype.notEqualStrict = function (x) {
        this.throwIfDisposed();
        return ops.notEqualStrict(this, x);
    };
    Tensor.prototype.less = function (x) {
        this.throwIfDisposed();
        return ops.less(this, x);
    };
    Tensor.prototype.lessStrict = function (x) {
        this.throwIfDisposed();
        return ops.lessStrict(this, x);
    };
    Tensor.prototype.equal = function (x) {
        this.throwIfDisposed();
        return ops.equal(this, x);
    };
    Tensor.prototype.equalStrict = function (x) {
        this.throwIfDisposed();
        return ops.equalStrict(this, x);
    };
    Tensor.prototype.lessEqual = function (x) {
        this.throwIfDisposed();
        return ops.lessEqual(this, x);
    };
    Tensor.prototype.lessEqualStrict = function (x) {
        this.throwIfDisposed();
        return ops.lessEqualStrict(this, x);
    };
    Tensor.prototype.greater = function (x) {
        this.throwIfDisposed();
        return ops.greater(this, x);
    };
    Tensor.prototype.greaterStrict = function (x) {
        this.throwIfDisposed();
        return ops.greaterStrict(this, x);
    };
    Tensor.prototype.greaterEqual = function (x) {
        this.throwIfDisposed();
        return ops.greaterEqual(this, x);
    };
    Tensor.prototype.greaterEqualStrict = function (x) {
        this.throwIfDisposed();
        return ops.greaterEqualStrict(this, x);
    };
    Tensor.prototype.logicalAnd = function (x) {
        this.throwIfDisposed();
        return ops.logicalAnd(this, x);
    };
    Tensor.prototype.logicalOr = function (x) {
        this.throwIfDisposed();
        return ops.logicalOr(this, x);
    };
    Tensor.prototype.logicalXor = function (x) {
        this.throwIfDisposed();
        return ops.logicalXor(this, x);
    };
    Tensor.prototype.where = function (condition, x) {
        this.throwIfDisposed();
        return ops.where(condition, this, x);
    };
    Tensor.prototype.neg = function () {
        this.throwIfDisposed();
        return ops.neg(this);
    };
    Tensor.prototype.ceil = function () {
        this.throwIfDisposed();
        return ops.ceil(this);
    };
    Tensor.prototype.floor = function () {
        this.throwIfDisposed();
        return ops.floor(this);
    };
    Tensor.prototype.exp = function () {
        this.throwIfDisposed();
        return ops.exp(this);
    };
    Tensor.prototype.log = function () {
        this.throwIfDisposed();
        return ops.log(this);
    };
    Tensor.prototype.sqrt = function () {
        this.throwIfDisposed();
        return ops.sqrt(this);
    };
    Tensor.prototype.square = function () {
        this.throwIfDisposed();
        return ops.square(this);
    };
    Tensor.prototype.abs = function () {
        this.throwIfDisposed();
        return ops.abs(this);
    };
    Tensor.prototype.clipByValue = function (min, max) {
        this.throwIfDisposed();
        return ops.clipByValue(this, min, max);
    };
    Tensor.prototype.relu = function () {
        this.throwIfDisposed();
        return ops.relu(this);
    };
    Tensor.prototype.elu = function () {
        this.throwIfDisposed();
        return ops.elu(this);
    };
    Tensor.prototype.selu = function () {
        this.throwIfDisposed();
        return ops.selu(this);
    };
    Tensor.prototype.leakyRelu = function (alpha) {
        if (alpha === void 0) { alpha = 0.2; }
        this.throwIfDisposed();
        return ops.leakyRelu(this, alpha);
    };
    Tensor.prototype.prelu = function (alpha) {
        this.throwIfDisposed();
        return ops.prelu(this, alpha);
    };
    Tensor.prototype.sigmoid = function () {
        this.throwIfDisposed();
        return ops.sigmoid(this);
    };
    Tensor.prototype.sin = function () {
        this.throwIfDisposed();
        return ops.sin(this);
    };
    Tensor.prototype.cos = function () {
        this.throwIfDisposed();
        return ops.cos(this);
    };
    Tensor.prototype.tan = function () {
        this.throwIfDisposed();
        return ops.tan(this);
    };
    Tensor.prototype.asin = function () {
        this.throwIfDisposed();
        return ops.asin(this);
    };
    Tensor.prototype.acos = function () {
        this.throwIfDisposed();
        return ops.acos(this);
    };
    Tensor.prototype.atan = function () {
        this.throwIfDisposed();
        return ops.atan(this);
    };
    Tensor.prototype.sinh = function () {
        this.throwIfDisposed();
        return ops.sinh(this);
    };
    Tensor.prototype.cosh = function () {
        this.throwIfDisposed();
        return ops.cosh(this);
    };
    Tensor.prototype.tanh = function () {
        this.throwIfDisposed();
        return ops.tanh(this);
    };
    Tensor.prototype.step = function (alpha) {
        if (alpha === void 0) { alpha = 0.0; }
        this.throwIfDisposed();
        return ops.step(this, alpha);
    };
    Tensor.prototype.softmax = function (dim) {
        if (dim === void 0) { dim = -1; }
        this.throwIfDisposed();
        return ops.softmax(this, dim);
    };
    Tensor.prototype.resizeBilinear = function (newShape2D, alignCorners) {
        if (alignCorners === void 0) { alignCorners = false; }
        this.throwIfDisposed();
        return ops.image.resizeBilinear(this, newShape2D, alignCorners);
    };
    Tensor.prototype.conv1d = function (filter, stride, pad, dimRoundingMode) {
        this.throwIfDisposed();
        return ops.conv1d(this, filter, stride, pad, dimRoundingMode);
    };
    Tensor.prototype.conv2d = function (filter, strides, pad, dimRoundingMode) {
        this.throwIfDisposed();
        return ops.conv2d(this, filter, strides, pad, dimRoundingMode);
    };
    Tensor.prototype.conv2dTranspose = function (filter, outputShape, strides, pad, dimRoundingMode) {
        this.throwIfDisposed();
        return ops.conv2dTranspose(this, filter, outputShape, strides, pad, dimRoundingMode);
    };
    Tensor.prototype.depthwiseConv2D = function (filter, strides, pad, dilations, dimRoundingMode) {
        if (dilations === void 0) { dilations = [1, 1]; }
        this.throwIfDisposed();
        return ops.depthwiseConv2d(this, filter, strides, pad, dilations, dimRoundingMode);
    };
    Tensor.prototype.avgPool = function (filterSize, strides, pad, dimRoundingMode) {
        this.throwIfDisposed();
        return ops.avgPool(this, filterSize, strides, pad, dimRoundingMode);
    };
    Tensor.prototype.maxPool = function (filterSize, strides, pad, dimRoundingMode) {
        this.throwIfDisposed();
        return ops.maxPool(this, filterSize, strides, pad, dimRoundingMode);
    };
    Tensor.prototype.minPool = function (filterSize, strides, pad, dimRoundingMode) {
        this.throwIfDisposed();
        return ops.minPool(this, filterSize, strides, pad, dimRoundingMode);
    };
    Tensor.prototype.localResponseNormalization = function (radius, bias, alpha, beta, normRegion) {
        if (radius === void 0) { radius = 5; }
        if (bias === void 0) { bias = 1; }
        if (alpha === void 0) { alpha = 1; }
        if (beta === void 0) { beta = 0.5; }
        if (normRegion === void 0) { normRegion = 'acrossChannels'; }
        return ops.localResponseNormalization(this, radius, bias, alpha, beta, normRegion);
    };
    Tensor.prototype.variable = function (trainable, name, dtype) {
        if (trainable === void 0) { trainable = true; }
        this.throwIfDisposed();
        return Variable.variable(this, trainable, name, dtype);
    };
    Tensor.nextId = 0;
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "flatten", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "asScalar", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "as1D", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "as2D", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "as3D", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "as4D", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "asType", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "buffer", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "data", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "dataSync", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "dispose", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "toFloat", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "toInt", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "toBool", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "print", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "reshape", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "reshapeAs", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "expandDims", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "squeeze", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "clone", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor.prototype, "toString", null);
    Tensor = Tensor_1 = __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Tensor);
    return Tensor;
    var Tensor_1;
}());
exports.Tensor = Tensor;
exports.NDArray = Tensor;
var Scalar = (function (_super) {
    __extends(Scalar, _super);
    function Scalar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Scalar.new = function (value, dtype) {
        return ops.scalar(value, dtype);
    };
    return Scalar;
}(Tensor));
exports.Scalar = Scalar;
var Tensor1D = (function (_super) {
    __extends(Tensor1D, _super);
    function Tensor1D() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tensor1D.new = function (values, dtype) {
        return ops.tensor1d(values, dtype);
    };
    return Tensor1D;
}(Tensor));
exports.Tensor1D = Tensor1D;
exports.Array1D = Tensor1D;
var Tensor2D = (function (_super) {
    __extends(Tensor2D, _super);
    function Tensor2D() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tensor2D.new = function (shape, values, dtype) {
        return ops.tensor2d(values, shape, dtype);
    };
    return Tensor2D;
}(Tensor));
exports.Tensor2D = Tensor2D;
exports.Array2D = Tensor2D;
var Tensor3D = (function (_super) {
    __extends(Tensor3D, _super);
    function Tensor3D() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tensor3D.new = function (shape, values, dtype) {
        return ops.tensor3d(values, shape, dtype);
    };
    return Tensor3D;
}(Tensor));
exports.Tensor3D = Tensor3D;
exports.Array3D = Tensor3D;
var Tensor4D = (function (_super) {
    __extends(Tensor4D, _super);
    function Tensor4D() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tensor4D.new = function (shape, values, dtype) {
        return ops.tensor4d(values, shape, dtype);
    };
    return Tensor4D;
}(Tensor));
exports.Tensor4D = Tensor4D;
exports.Array4D = Tensor4D;
var Variable = (function (_super) {
    __extends(Variable, _super);
    function Variable(initialValue, trainable, name) {
        if (trainable === void 0) { trainable = true; }
        var _this = _super.call(this, initialValue.shape, initialValue.dtype, null, initialValue.dataId) || this;
        _this.trainable = trainable;
        _this.name = name;
        if (_this.name == null) {
            _this.name = Variable_1.nextVarId.toString();
            Variable_1.nextVarId++;
        }
        environment_1.ENV.engine.registerVariable(_this);
        return _this;
    }
    Variable_1 = Variable;
    Variable.variable = function (initialValue, trainable, name, dtype) {
        if (trainable === void 0) { trainable = true; }
        if (dtype != null && dtype !== initialValue.dtype) {
            initialValue = initialValue.asType(dtype);
        }
        return new Variable_1(initialValue, trainable, name);
    };
    Variable.prototype.assign = function (newValue) {
        if (newValue.dtype !== this.dtype) {
            throw new Error("dtype of the new value (" + newValue.dtype + ") and " +
                ("previous value (" + this.dtype + ") must match"));
        }
        if (!util.arraysEqual(newValue.shape, this.shape)) {
            throw new Error("shape of the new value (" + newValue.shape + ") and " +
                ("previous value (" + this.shape + ") must match"));
        }
        environment_1.ENV.engine.disposeTensor(this);
        this.dataId = newValue.dataId;
        environment_1.ENV.engine.registerTensor(this);
    };
    Variable.nextVarId = 0;
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Variable.prototype, "assign", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], Variable, "variable", null);
    Variable = Variable_1 = __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Classes' })
    ], Variable);
    return Variable;
    var Variable_1;
}(Tensor));
exports.Variable = Variable;
var variable = Variable.variable;
exports.variable = variable;
function computeStrides(shape) {
    var rank = shape.length;
    if (rank < 2) {
        return [];
    }
    var strides = new Array(rank - 1);
    strides[rank - 2] = shape[rank - 1];
    for (var i = rank - 3; i >= 0; --i) {
        strides[i] = strides[i + 1] * shape[i + 1];
    }
    return strides;
}

},{"./doc":33,"./environment":35,"./ops/ops":122,"./tensor_util":146,"./util":151}],146:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./util");
var FORMAT_LIMIT_NUM_VALS = 20;
var FORMAT_NUM_FIRST_LAST_VALS = 3;
var FORMAT_NUM_SIG_DIGITS = 7;
function tensorToString(t, verbose) {
    var vals = t.dataSync();
    var padPerCol = computeMaxSizePerColumn(t);
    var valsLines = subTensorToString(vals, t.shape, t.strides, padPerCol);
    var lines = ['Tensor'];
    if (verbose) {
        lines.push("  dtype: " + t.dtype);
        lines.push("  rank: " + t.rank);
        lines.push("  shape: [" + t.shape + "]");
        lines.push("  values:");
    }
    lines.push(valsLines.map(function (l) { return '    ' + l; }).join('\n'));
    return lines.join('\n');
}
exports.tensorToString = tensorToString;
function computeMaxSizePerColumn(t) {
    var vals = t.dataSync();
    var n = t.size;
    var numCols = t.strides[t.strides.length - 1];
    var padPerCol = new Array(numCols).fill(0);
    if (t.rank > 1) {
        for (var row = 0; row < n / numCols; row++) {
            var offset = row * numCols;
            for (var j = 0; j < numCols; j++) {
                padPerCol[j] =
                    Math.max(padPerCol[j], valToString(vals[offset + j], 0).length);
            }
        }
    }
    return padPerCol;
}
function valToString(val, pad) {
    return util.rightPad(parseFloat(val.toFixed(FORMAT_NUM_SIG_DIGITS)).toString(), pad);
}
function subTensorToString(vals, shape, strides, padPerCol, isLast) {
    if (isLast === void 0) { isLast = true; }
    var size = shape[0];
    var rank = shape.length;
    if (rank === 0) {
        return [vals[0].toString()];
    }
    if (rank === 1) {
        if (size > FORMAT_LIMIT_NUM_VALS) {
            var firstVals = Array.from(vals.subarray(0, FORMAT_NUM_FIRST_LAST_VALS));
            var lastVals = Array.from(vals.subarray(size - FORMAT_NUM_FIRST_LAST_VALS, size));
            return [
                '[' + firstVals.map(function (x, i) { return valToString(x, padPerCol[i]); }).join(', ') +
                    ', ..., ' +
                    lastVals
                        .map(function (x, i) { return valToString(x, padPerCol[size - FORMAT_NUM_FIRST_LAST_VALS + i]); })
                        .join(', ') +
                    ']'
            ];
        }
        return [
            '[' +
                Array.from(vals).map(function (x, i) { return valToString(x, padPerCol[i]); }).join(', ') +
                ']'
        ];
    }
    var subshape = shape.slice(1);
    var substrides = strides.slice(1);
    var stride = strides[0];
    var lines = [];
    if (size > FORMAT_LIMIT_NUM_VALS) {
        for (var i = 0; i < FORMAT_NUM_FIRST_LAST_VALS; i++) {
            var start = i * stride;
            var end = start + stride;
            lines.push.apply(lines, subTensorToString(vals.subarray(start, end), subshape, substrides, padPerCol, false));
        }
        lines.push('...');
        for (var i = size - FORMAT_NUM_FIRST_LAST_VALS; i < size; i++) {
            var start = i * stride;
            var end = start + stride;
            lines.push.apply(lines, subTensorToString(vals.subarray(start, end), subshape, substrides, padPerCol, i === size - 1));
        }
    }
    else {
        for (var i = 0; i < size; i++) {
            var start = i * stride;
            var end = start + stride;
            lines.push.apply(lines, subTensorToString(vals.subarray(start, end), subshape, substrides, padPerCol, i === size - 1));
        }
    }
    var sep = rank === 2 ? ',' : '';
    lines[0] = '[' + lines[0] + sep;
    for (var i = 1; i < lines.length - 1; i++) {
        lines[i] = ' ' + lines[i] + sep;
    }
    var newLineSep = ',\n';
    for (var i = 2; i < rank; i++) {
        newLineSep += '\n';
    }
    lines[lines.length - 1] =
        ' ' + lines[lines.length - 1] + ']' + (isLast ? '' : newLineSep);
    return lines;
}

},{"./util":151}],147:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./environment");
var backend_cpu_1 = require("./kernels/backend_cpu");
var backend_webgl_1 = require("./kernels/backend_webgl");
var tensor_1 = require("./tensor");
var util = require("./util");
exports.WEBGL_ENVS = [
    { 'BACKEND': 'webgl', 'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1 },
    { 'BACKEND': 'webgl', 'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2 },
];
exports.CPU_ENVS = [{ 'BACKEND': 'cpu' }];
exports.ALL_ENVS = exports.WEBGL_ENVS.concat(exports.CPU_ENVS);
exports.TEST_EPSILON = 1e-3;
function expectArraysClose(actual, expected, epsilon) {
    if (epsilon === void 0) { epsilon = exports.TEST_EPSILON; }
    if (!(actual instanceof tensor_1.Tensor) && !(expected instanceof tensor_1.Tensor)) {
        var aType = actual.constructor.name;
        var bType = expected.constructor.name;
        if (aType !== bType) {
            throw new Error("Arrays are of different type actual: " + aType + " " +
                ("vs expected: " + bType));
        }
    }
    else if (actual instanceof tensor_1.Tensor && expected instanceof tensor_1.Tensor) {
        if (actual.dtype !== expected.dtype) {
            throw new Error("Arrays are of different type actual: " + actual.dtype + " " +
                ("vs expected: " + expected.dtype + "."));
        }
        if (!util.arraysEqual(actual.shape, expected.shape)) {
            throw new Error("Arrays are of different shape actual: " + actual.shape + " " +
                ("vs expected: " + expected.shape + "."));
        }
    }
    var actualValues;
    var expectedValues;
    if (actual instanceof tensor_1.Tensor) {
        actualValues = actual.dataSync();
    }
    else {
        actualValues = actual;
    }
    if (expected instanceof tensor_1.Tensor) {
        expectedValues = expected.dataSync();
    }
    else {
        expectedValues = expected;
    }
    if (actualValues.length !== expectedValues.length) {
        throw new Error("Arrays have different lengths actual: " + actualValues.length + " vs " +
            ("expected: " + expectedValues.length + ".\n") +
            ("Actual:   " + actualValues + ".\n") +
            ("Expected: " + expectedValues + "."));
    }
    for (var i = 0; i < expectedValues.length; ++i) {
        var a = actualValues[i];
        var e = expectedValues[i];
        if (!areClose(a, Number(e), epsilon)) {
            throw new Error("Arrays differ: actual[" + i + "] = " + a + ", expected[" + i + "] = " + e + ".\n" +
                ("Actual:   " + actualValues + ".\n") +
                ("Expected: " + expectedValues + "."));
        }
    }
}
exports.expectArraysClose = expectArraysClose;
function expectArraysEqual(actual, expected) {
    return expectArraysClose(actual, expected, 0);
}
exports.expectArraysEqual = expectArraysEqual;
function expectNumbersClose(a, e, epsilon) {
    if (epsilon === void 0) { epsilon = exports.TEST_EPSILON; }
    if (!areClose(a, e, epsilon)) {
        throw new Error("Numbers differ: actual === " + a + ", expected === " + e);
    }
}
exports.expectNumbersClose = expectNumbersClose;
function areClose(a, e, epsilon) {
    if (isNaN(a) && isNaN(e)) {
        return true;
    }
    if (isNaN(a) || isNaN(e) || Math.abs(a - e) > epsilon) {
        return false;
    }
    return true;
}
function expectValuesInRange(actual, low, high) {
    var actualVals;
    if (actual instanceof tensor_1.Tensor) {
        actualVals = actual.dataSync();
    }
    else {
        actualVals = actual;
    }
    for (var i = 0; i < actualVals.length; i++) {
        if (actualVals[i] < low || actualVals[i] > high) {
            throw new Error("Value out of range:" + actualVals[i] + " low: " + low + ", high: " + high);
        }
    }
}
exports.expectValuesInRange = expectValuesInRange;
function describeWithFlags(name, featuresList, tests) {
    featuresList.forEach(function (features) {
        var testName = name + ' ' + JSON.stringify(features);
        executeTests(testName, tests, features);
    });
}
exports.describeWithFlags = describeWithFlags;
function executeTests(testName, tests, features) {
    describe(testName, function () {
        beforeEach(function () {
            environment_1.ENV.setFeatures(features || {});
            environment_1.ENV.addCustomBackend('webgl', function () { return new backend_webgl_1.MathBackendWebGL(); });
            environment_1.ENV.addCustomBackend('cpu', function () { return new backend_cpu_1.MathBackendCPU(); });
            if (features && features.BACKEND != null) {
                environment_1.Environment.setBackend(features.BACKEND);
            }
            environment_1.ENV.engine.startScope();
        });
        afterEach(function () {
            environment_1.ENV.engine.endScope(null);
            environment_1.ENV.reset();
        });
        tests();
    });
}
function assertIsNan(val, dtype) {
    if (!util.isValNaN(val, dtype)) {
        throw new Error("Value " + val + " does not represent NaN for dtype " + dtype);
    }
}
exports.assertIsNan = assertIsNan;

},{"./environment":35,"./kernels/backend_cpu":69,"./kernels/backend_webgl":70,"./tensor":145,"./util":151}],148:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("./doc");
var environment_1 = require("./environment");
var util_1 = require("./util");
var Tracking = (function () {
    function Tracking() {
    }
    Tracking.tidy = function (nameOrFn, fn, gradMode) {
        if (gradMode === void 0) { gradMode = false; }
        var name = null;
        if (fn == null) {
            if (typeof nameOrFn !== 'function') {
                throw new Error('Please provide a function to dl.tidy()');
            }
            fn = nameOrFn;
        }
        else {
            if (typeof nameOrFn !== 'string' && !(nameOrFn instanceof String)) {
                throw new Error('When calling with two arguments, the first argument ' +
                    'to dl.tidy() must be a string');
            }
            if (typeof fn !== 'function') {
                throw new Error('When calling with two arguments, the 2nd argument ' +
                    'to dl.tidy() must be a function');
            }
            name = nameOrFn;
        }
        environment_1.ENV.engine.startScope(name, gradMode);
        var result = fn();
        if (result instanceof Promise) {
            console.warn('Returning a promise inside of tidy is dangerous. ' +
                'This will be a run-time error in 0.6.0');
        }
        environment_1.ENV.engine.endScope(result, gradMode);
        return result;
    };
    Tracking.dispose = function (container) {
        var tensors = util_1.extractTensorsFromAny(container);
        tensors.forEach(function (tensor) { return tensor.dispose(); });
    };
    Tracking.keep = function (result) {
        return environment_1.ENV.engine.keep(result);
    };
    Tracking.time = function (f) {
        return environment_1.ENV.engine.time(f);
    };
    __decorate([
        doc_1.doc({ heading: 'Performance', subheading: 'Memory' })
    ], Tracking, "tidy", null);
    __decorate([
        doc_1.doc({ heading: 'Performance', subheading: 'Memory' })
    ], Tracking, "keep", null);
    __decorate([
        doc_1.doc({ heading: 'Performance', subheading: 'Timing' })
    ], Tracking, "time", null);
    return Tracking;
}());
exports.Tracking = Tracking;

},{"./doc":33,"./environment":35,"./util":151}],149:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var adadelta_optimizer_1 = require("./optimizers/adadelta_optimizer");
var adagrad_optimizer_1 = require("./optimizers/adagrad_optimizer");
var adam_optimizer_1 = require("./optimizers/adam_optimizer");
var adamax_optimizer_1 = require("./optimizers/adamax_optimizer");
var momentum_optimizer_1 = require("./optimizers/momentum_optimizer");
var optimizer_constructors_1 = require("./optimizers/optimizer_constructors");
var rmsprop_optimizer_1 = require("./optimizers/rmsprop_optimizer");
var sgd_optimizer_1 = require("./optimizers/sgd_optimizer");
[momentum_optimizer_1.MomentumOptimizer, sgd_optimizer_1.SGDOptimizer, adadelta_optimizer_1.AdadeltaOptimizer, adagrad_optimizer_1.AdagradOptimizer,
    rmsprop_optimizer_1.RMSPropOptimizer, adamax_optimizer_1.AdamaxOptimizer, adam_optimizer_1.AdamOptimizer];
exports.train = {
    sgd: optimizer_constructors_1.OptimizerConstructors.sgd,
    momentum: optimizer_constructors_1.OptimizerConstructors.momentum,
    adadelta: optimizer_constructors_1.OptimizerConstructors.adadelta,
    adagrad: optimizer_constructors_1.OptimizerConstructors.adagrad,
    rmsprop: optimizer_constructors_1.OptimizerConstructors.rmsprop,
    adamax: optimizer_constructors_1.OptimizerConstructors.adamax,
    adam: optimizer_constructors_1.OptimizerConstructors.adam
};

},{"./optimizers/adadelta_optimizer":134,"./optimizers/adagrad_optimizer":135,"./optimizers/adam_optimizer":136,"./optimizers/adamax_optimizer":137,"./optimizers/momentum_optimizer":138,"./optimizers/optimizer_constructors":140,"./optimizers/rmsprop_optimizer":141,"./optimizers/sgd_optimizer":142}],150:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DType;
(function (DType) {
    DType["float32"] = "float32";
    DType["int32"] = "int32";
    DType["bool"] = "bool";
})(DType = exports.DType || (exports.DType = {}));
var Rank;
(function (Rank) {
    Rank["R0"] = "R0";
    Rank["R1"] = "R1";
    Rank["R2"] = "R2";
    Rank["R3"] = "R3";
    Rank["R4"] = "R4";
})(Rank = exports.Rank || (exports.Rank = {}));
var UpcastInt32AndMap;
(function (UpcastInt32AndMap) {
    UpcastInt32AndMap["float32"] = "float32";
    UpcastInt32AndMap["int32"] = "int32";
    UpcastInt32AndMap["bool"] = "int32";
})(UpcastInt32AndMap || (UpcastInt32AndMap = {}));
var UpcastBoolAndMap;
(function (UpcastBoolAndMap) {
    UpcastBoolAndMap["float32"] = "float32";
    UpcastBoolAndMap["int32"] = "int32";
    UpcastBoolAndMap["bool"] = "bool";
})(UpcastBoolAndMap || (UpcastBoolAndMap = {}));
var UpcastFloat32AndMap;
(function (UpcastFloat32AndMap) {
    UpcastFloat32AndMap["float32"] = "float32";
    UpcastFloat32AndMap["int32"] = "float32";
    UpcastFloat32AndMap["bool"] = "float32";
})(UpcastFloat32AndMap || (UpcastFloat32AndMap = {}));
var upcastTypeMap = {
    float32: UpcastFloat32AndMap,
    int32: UpcastInt32AndMap,
    bool: UpcastBoolAndMap
};
function upcastType(typeA, typeB) {
    return upcastTypeMap[typeA][typeB];
}
exports.upcastType = upcastType;
function sumOutType(type) {
    return upcastType(type, 'int32');
}
exports.sumOutType = sumOutType;

},{}],151:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tensor_1 = require("./tensor");
function shuffle(array) {
    var counter = array.length;
    var temp = 0;
    var index = 0;
    while (counter > 0) {
        index = (Math.random() * counter) | 0;
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
}
exports.shuffle = shuffle;
function clamp(min, x, max) {
    return Math.max(min, Math.min(x, max));
}
exports.clamp = clamp;
function randUniform(a, b) {
    return Math.random() * (b - a) + a;
}
exports.randUniform = randUniform;
function distSquared(a, b) {
    var result = 0;
    for (var i = 0; i < a.length; i++) {
        var diff = Number(a[i]) - Number(b[i]);
        result += diff * diff;
    }
    return result;
}
exports.distSquared = distSquared;
function assert(expr, msg) {
    if (!expr) {
        throw new Error(msg);
    }
}
exports.assert = assert;
function assertShapesMatch(shapeA, shapeB, errorMessagePrefix) {
    if (errorMessagePrefix === void 0) { errorMessagePrefix = ''; }
    assert(arraysEqual(shapeA, shapeB), errorMessagePrefix + ("Shapes " + shapeA + " and " + shapeB + " must match"));
}
exports.assertShapesMatch = assertShapesMatch;
function assertTypesMatch(a, b) {
    assert(a.dtype === b.dtype, "The dtypes of the first (" + a.dtype + ") and " +
        ("second (" + b.dtype + ") input must match"));
}
exports.assertTypesMatch = assertTypesMatch;
function flatten(arr, ret) {
    if (ret === void 0) { ret = []; }
    if (Array.isArray(arr)) {
        for (var i = 0; i < arr.length; ++i) {
            flatten(arr[i], ret);
        }
    }
    else {
        ret.push(arr);
    }
    return ret;
}
exports.flatten = flatten;
function inferShape(val) {
    if (isTypedArray(val)) {
        return [val.length];
    }
    if (!Array.isArray(val)) {
        return [];
    }
    var shape = [];
    while (val instanceof Array) {
        shape.push(val.length);
        val = val[0];
    }
    return shape;
}
exports.inferShape = inferShape;
function sizeFromShape(shape) {
    if (shape.length === 0) {
        return 1;
    }
    var size = shape[0];
    for (var i = 1; i < shape.length; i++) {
        size *= shape[i];
    }
    return size;
}
exports.sizeFromShape = sizeFromShape;
function isScalarShape(shape) {
    return shape.length === 0;
}
exports.isScalarShape = isScalarShape;
function arraysEqual(n1, n2) {
    if (n1.length !== n2.length) {
        return false;
    }
    for (var i = 0; i < n1.length; i++) {
        if (n1[i] !== n2[i]) {
            return false;
        }
    }
    return true;
}
exports.arraysEqual = arraysEqual;
function isInt(a) {
    return a % 1 === 0;
}
exports.isInt = isInt;
function tanh(x) {
    if (Math.tanh != null) {
        return Math.tanh(x);
    }
    if (x === Infinity) {
        return 1;
    }
    else if (x === -Infinity) {
        return -1;
    }
    else {
        var e2x = Math.exp(2 * x);
        return (e2x - 1) / (e2x + 1);
    }
}
exports.tanh = tanh;
function sizeToSquarishShape(size) {
    for (var a = Math.floor(Math.sqrt(size)); a > 1; --a) {
        if (size % a === 0) {
            return [a, size / a];
        }
    }
    return [1, size];
}
exports.sizeToSquarishShape = sizeToSquarishShape;
function createShuffledIndices(n) {
    var shuffledIndices = new Uint32Array(n);
    for (var i = 0; i < n; ++i) {
        shuffledIndices[i] = i;
    }
    shuffle(shuffledIndices);
    return shuffledIndices;
}
exports.createShuffledIndices = createShuffledIndices;
function rightPad(a, size) {
    if (size <= a.length) {
        return a;
    }
    return a + ' '.repeat(size - a.length);
}
exports.rightPad = rightPad;
function repeatedTry(checkFn, delayFn, maxCounter) {
    if (delayFn === void 0) { delayFn = function (counter) { return 0; }; }
    return new Promise(function (resolve, reject) {
        var tryCount = 0;
        var tryFn = function () {
            if (checkFn()) {
                resolve();
                return;
            }
            tryCount++;
            var nextBackoff = delayFn(tryCount);
            if (maxCounter != null && tryCount >= maxCounter) {
                reject();
                return;
            }
            setTimeout(tryFn, nextBackoff);
        };
        setTimeout(tryFn, 0);
    });
}
exports.repeatedTry = repeatedTry;
function getQueryParams(queryString) {
    var params = {};
    queryString.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g, function (s) {
        var t = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            t[_i - 1] = arguments[_i];
        }
        decodeParam(params, t[0], t[1]);
        return t.join('=');
    });
    return params;
}
exports.getQueryParams = getQueryParams;
function decodeParam(params, name, value) {
    params[decodeURIComponent(name)] = decodeURIComponent(value || '');
}
function inferFromImplicitShape(shape, size) {
    var shapeProd = 1;
    var implicitIdx = -1;
    for (var i = 0; i < shape.length; ++i) {
        if (shape[i] > 0) {
            shapeProd *= shape[i];
        }
        else if (shape[i] === -1) {
            if (implicitIdx !== -1) {
                throw Error("Shapes can only have 1 implicit size. " +
                    ("Found -1 at dim " + implicitIdx + " and dim " + i));
            }
            implicitIdx = i;
        }
        else if (shape[i] <= 0) {
            throw Error("Shapes can not be <= 0. Found " + shape[i] + " at dim " + i);
        }
    }
    if (implicitIdx === -1) {
        if (size > 0 && size !== shapeProd) {
            throw Error("Size (" + size + ") must match the product of shape " + shape);
        }
        return shape;
    }
    if (size % shapeProd !== 0) {
        throw Error("The implicit shape can't be a fractional number. " +
            ("Got " + size + " / " + shapeProd));
    }
    var newShape = shape.slice();
    newShape[implicitIdx] = size / shapeProd;
    return newShape;
}
exports.inferFromImplicitShape = inferFromImplicitShape;
exports.NAN_INT32 = 1 << 31;
exports.NAN_BOOL = 255;
exports.NAN_FLOAT32 = NaN;
function getNaN(dtype) {
    if (dtype === 'float32') {
        return exports.NAN_FLOAT32;
    }
    else if (dtype === 'int32') {
        return exports.NAN_INT32;
    }
    else if (dtype === 'bool') {
        return exports.NAN_BOOL;
    }
    else {
        throw new Error("Unknown dtype " + dtype);
    }
}
exports.getNaN = getNaN;
function isValNaN(val, dtype) {
    if (isNaN(val)) {
        return true;
    }
    if (dtype === 'float32') {
        return false;
    }
    else if (dtype === 'int32') {
        return val === exports.NAN_INT32;
    }
    else if (dtype === 'bool') {
        return val === exports.NAN_BOOL;
    }
    else {
        throw new Error("Unknown dtype " + dtype);
    }
}
exports.isValNaN = isValNaN;
function squeezeShape(shape, axis) {
    var newShape = [];
    var keptDims = [];
    var j = 0;
    for (var i = 0; i < shape.length; ++i) {
        if (axis != null) {
            if (axis[j] === i && shape[i] > 1) {
                throw new Error("Can't squeeze axis " + i + " since its dim '" + shape[i] + "' is not 1");
            }
            if ((axis[j] == null || axis[j] > i) && shape[i] === 1) {
                newShape.push(shape[i]);
                keptDims.push(i);
            }
            if (axis[j] <= i) {
                j++;
            }
        }
        if (shape[i] > 1) {
            newShape.push(shape[i]);
            keptDims.push(i);
        }
    }
    return { newShape: newShape, keptDims: keptDims };
}
exports.squeezeShape = squeezeShape;
function getTypedArrayFromDType(dtype, size) {
    var values = null;
    if (dtype == null || dtype === 'float32') {
        values = new Float32Array(size);
    }
    else if (dtype === 'int32') {
        values = new Int32Array(size);
    }
    else if (dtype === 'bool') {
        values = new Uint8Array(size);
    }
    else {
        throw new Error("Unknown data type " + dtype);
    }
    return values;
}
exports.getTypedArrayFromDType = getTypedArrayFromDType;
function isTensorInList(tensor, tensorList) {
    for (var i = 0; i < tensorList.length; i++) {
        if (tensorList[i].id === tensor.id) {
            return true;
        }
    }
    return false;
}
exports.isTensorInList = isTensorInList;
function checkForNaN(vals, dtype, name) {
    for (var i = 0; i < vals.length; i++) {
        if (isValNaN(vals[i], dtype)) {
            throw Error("The result of the '" + name + "' has NaNs.");
        }
    }
}
exports.checkForNaN = checkForNaN;
function flattenNameArrayMap(nameArrayMap, keys) {
    var xs = [];
    if (nameArrayMap instanceof tensor_1.Tensor) {
        xs.push(nameArrayMap);
    }
    else {
        var xMap = nameArrayMap;
        for (var i = 0; i < keys.length; i++) {
            xs.push(xMap[keys[i]]);
        }
    }
    return xs;
}
exports.flattenNameArrayMap = flattenNameArrayMap;
function unflattenToNameArrayMap(keys, flatArrays) {
    if (keys.length !== flatArrays.length) {
        throw new Error("Cannot unflatten Tensor[], keys and arrays are not of same length.");
    }
    var result = {};
    for (var i = 0; i < keys.length; i++) {
        result[keys[i]] = flatArrays[i];
    }
    return result;
}
exports.unflattenToNameArrayMap = unflattenToNameArrayMap;
function hasEncodingLoss(oldType, newType) {
    if (newType === 'float32') {
        return false;
    }
    if (newType === 'int32' && oldType !== 'float32') {
        return false;
    }
    if (newType === 'bool' && oldType === 'bool') {
        return false;
    }
    return true;
}
exports.hasEncodingLoss = hasEncodingLoss;
function copyTypedArray(array, dtype) {
    if (dtype == null || dtype === 'float32') {
        return new Float32Array(array);
    }
    else if (dtype === 'int32') {
        var vals = new Int32Array(array.length);
        for (var i = 0; i < vals.length; ++i) {
            var val = array[i];
            if (isValNaN(val, 'int32')) {
                vals[i] = getNaN('int32');
            }
            else {
                vals[i] = val;
            }
        }
        return vals;
    }
    else if (dtype === 'bool') {
        var bool = new Uint8Array(array.length);
        for (var i = 0; i < bool.length; ++i) {
            var val = array[i];
            if (isValNaN(val, 'bool')) {
                bool[i] = getNaN('bool');
            }
            else if (Math.round(val) !== 0) {
                bool[i] = 1;
            }
        }
        return bool;
    }
    else {
        throw new Error("Unknown data type " + dtype);
    }
}
exports.copyTypedArray = copyTypedArray;
function isTypedArray(a) {
    return a instanceof Float32Array || a instanceof Int32Array ||
        a instanceof Uint8Array;
}
exports.isTypedArray = isTypedArray;
function bytesPerElement(dtype) {
    if (dtype === 'float32' || dtype === 'int32') {
        return 4;
    }
    else if (dtype === 'bool') {
        return 1;
    }
    else {
        throw new Error("Unknown dtype " + dtype);
    }
}
exports.bytesPerElement = bytesPerElement;
function isFunction(f) {
    return !!(f && f.constructor && f.call && f.apply);
}
exports.isFunction = isFunction;
function extractTensorsFromContainer(result) {
    return extractTensorsFromAny(result);
}
exports.extractTensorsFromContainer = extractTensorsFromContainer;
function extractTensorsFromAny(result) {
    if (result == null) {
        return [];
    }
    if (result instanceof tensor_1.Tensor) {
        return [result];
    }
    var list = [];
    var resultObj = result;
    if (!isIterable(resultObj)) {
        return [];
    }
    for (var k in resultObj) {
        var sublist = flatten(resultObj[k]).filter(function (x) { return x instanceof tensor_1.Tensor; });
        list.push.apply(list, sublist);
    }
    return list;
}
exports.extractTensorsFromAny = extractTensorsFromAny;
function isIterable(obj) {
    return Array.isArray(obj) || typeof obj === 'object';
}

},{"./tensor":145}],152:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var version = '0.5.1';
exports.version = version;

},{}],153:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ops_1 = require("./ops/ops");
var util = require("./util");
var DTYPE_VALUE_SIZE_MAP = {
    'float32': 4,
    'int32': 4
};
function loadWeights(manifest, filePathPrefix, weightNames) {
    if (filePathPrefix === void 0) { filePathPrefix = ''; }
    return __awaiter(this, void 0, void 0, function () {
        var groupIndicesToFetchMap, groupWeightsToFetch, weightsFound, allManifestWeightNames, weightsNotFound, groupIndicesToFetch, requests, responses, buffers, weightsTensorMap, bufferIndexOffset;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    groupIndicesToFetchMap = manifest.map(function () { return false; });
                    groupWeightsToFetch = {};
                    weightsFound = weightNames != null ? weightNames.map(function () { return false; }) : [];
                    allManifestWeightNames = [];
                    manifest.forEach(function (manifestGroupConfig, groupIndex) {
                        var groupOffset = 0;
                        manifestGroupConfig.weights.forEach(function (weightsEntry) {
                            var weightsBytes = DTYPE_VALUE_SIZE_MAP[weightsEntry.dtype] *
                                util.sizeFromShape(weightsEntry.shape);
                            var enqueueWeightsForFetchingFn = function () {
                                groupIndicesToFetchMap[groupIndex] = true;
                                if (groupWeightsToFetch[groupIndex] == null) {
                                    groupWeightsToFetch[groupIndex] = [];
                                }
                                groupWeightsToFetch[groupIndex].push({
                                    manifestEntry: weightsEntry,
                                    groupOffset: groupOffset,
                                    sizeBytes: weightsBytes
                                });
                            };
                            if (weightNames != null) {
                                weightNames.forEach(function (weightName, weightIndex) {
                                    if (weightName === weightsEntry.name) {
                                        enqueueWeightsForFetchingFn();
                                        weightsFound[weightIndex] = true;
                                    }
                                });
                            }
                            else {
                                enqueueWeightsForFetchingFn();
                            }
                            allManifestWeightNames.push(weightsEntry.name);
                            groupOffset += weightsBytes;
                        });
                    });
                    if (!weightsFound.every(function (found) { return found; })) {
                        weightsNotFound = weightNames.filter(function (weight, i) { return !weightsFound[i]; });
                        throw new Error("Could not find weights in manifest with names: " +
                            (weightsNotFound.join(', ') + ". \n") +
                            "Manifest JSON has weights with names: " +
                            (allManifestWeightNames.join(', ') + "."));
                    }
                    groupIndicesToFetch = groupIndicesToFetchMap.reduce(function (accumulator, shouldFetch, i) {
                        if (shouldFetch) {
                            accumulator.push(i);
                        }
                        return accumulator;
                    }, []);
                    requests = [];
                    groupIndicesToFetch.forEach(function (i) {
                        manifest[i].paths.forEach(function (filepath) {
                            var fetchUrl = filePathPrefix +
                                (!filePathPrefix.endsWith('/') ? '/' : '') + filepath;
                            requests.push(fetch(fetchUrl));
                        });
                    });
                    return [4, Promise.all(requests)];
                case 1:
                    responses = _a.sent();
                    return [4, Promise.all(responses.map(function (response) { return response.arrayBuffer(); }))];
                case 2:
                    buffers = _a.sent();
                    weightsTensorMap = {};
                    bufferIndexOffset = 0;
                    groupIndicesToFetch.forEach(function (i) {
                        var numBuffers = manifest[i].paths.length;
                        var groupBytes = 0;
                        for (var i_1 = 0; i_1 < numBuffers; i_1++) {
                            groupBytes += buffers[bufferIndexOffset + i_1].byteLength;
                        }
                        var groupBuffer = new ArrayBuffer(groupBytes);
                        var groupByteBuffer = new Uint8Array(groupBuffer);
                        var groupBufferOffset = 0;
                        for (var i_2 = 0; i_2 < numBuffers; i_2++) {
                            var buffer = new Uint8Array(buffers[bufferIndexOffset + i_2]);
                            groupByteBuffer.set(buffer, groupBufferOffset);
                            groupBufferOffset += buffer.byteLength;
                        }
                        var weightsEntries = groupWeightsToFetch[i];
                        weightsEntries.forEach(function (weightsEntry) {
                            var byteBuffer = groupBuffer.slice(weightsEntry.groupOffset, weightsEntry.groupOffset + weightsEntry.sizeBytes);
                            var typedArray;
                            if (weightsEntry.manifestEntry.dtype === 'float32') {
                                typedArray = new Float32Array(byteBuffer);
                            }
                            else if (weightsEntry.manifestEntry.dtype === 'int32') {
                                typedArray = new Int32Array(byteBuffer);
                            }
                            else {
                                throw new Error("Weight " + weightsEntry.manifestEntry.name + " has unknown dtype " +
                                    (weightsEntry.manifestEntry.dtype + "."));
                            }
                            var weightName = weightsEntry.manifestEntry.name;
                            if (weightsTensorMap[weightName] != null) {
                                throw new Error("Duplicate weight with name " + weightName + ". " +
                                    "Please make sure weights names are unique in the manifest JSON.");
                            }
                            weightsTensorMap[weightName] = ops_1.tensor(typedArray, weightsEntry.manifestEntry.shape, weightsEntry.manifestEntry.dtype);
                        });
                        bufferIndexOffset += numBuffers;
                    });
                    return [2, weightsTensorMap];
            }
        });
    });
}
exports.loadWeights = loadWeights;

},{"./ops/ops":122,"./util":151}]},{},[68])(68)
});
this.dl = this.deeplearn;
