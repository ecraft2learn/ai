(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(factory((global.hpjs = {})));
}(this, (function (exports) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/* eslint-disable no-bitwise */
// https://gist.github.com/banksean/300494
// Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,

// https://github.com/jrus/random-js/blob/master/random.coffee

var POW_NEG_26 = Math.pow(2, -26);
var POW_NEG_27 = Math.pow(2, -27);
var POW_32 = Math.pow(2, 32);

var RandomState = function () {
  function RandomState(seed) {
    classCallCheck(this, RandomState);

    this.bits = {};
    this.seed = seed === undefined ? new Date().getTime() : seed;
    this.N = 624;
    this.M = 397;
    this.MATRIX_A = 0x9908b0df; /* constant vector a */
    this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
    this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

    this.mt = new Array(this.N); /* the array for the state vector */
    this.mti = this.N + 1; /* mti==N+1 means mt[N] is not initialized */

    this.initGen(this.seed);
  }

  /* initializes mt[N] with a seed */


  RandomState.prototype.initGen = function initGen(seed) {
    this.mt[0] = seed >>> 0;
    for (this.mti = 1; this.mti < this.N; this.mti += 1) {
      var s = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30;
      this.mt[this.mti] =
      // eslint-disable-next-line no-mixed-operators
      (((s & 0xffff0000) >>> 16) * 1812433253 << 16) + (s & 0x0000ffff) * 1812433253 + this.mti;
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
      this.mt[this.mti] >>>= 0;
      /* for >32 bit machines */
    }
    this.next_gauss = null;
  };

  RandomState.prototype.randint = function randint() {
    var y = void 0;
    var mag01 = [0x0, this.MATRIX_A];
    /* mag01[x] = x * MATRIX_A  for x=0,1 */

    if (this.mti >= this.N) {
      /* generate N words at one time */
      var kk = void 0;

      if (this.mti === this.N + 1) {
        /* if initGen() has not been called, */
        this.initGen(5489);
      } /* a default initial seed is used */

      for (kk = 0; kk < this.N - this.M; kk += 1) {
        y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
        this.mt[kk] = this.mt[kk + this.M] ^ y >>> 1 ^ mag01[y & 0x1];
      }
      for (; kk < this.N - 1; kk += 1) {
        y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
        this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ y >>> 1 ^ mag01[y & 0x1];
      }
      y = this.mt[this.N - 1] & this.UPPER_MASK | this.mt[0] & this.LOWER_MASK;
      this.mt[this.N - 1] = this.mt[this.M - 1] ^ y >>> 1 ^ mag01[y & 0x1];

      this.mti = 0;
    }

    y = this.mt[this.mti += 1];

    /* Tempering */
    y ^= y >>> 11;
    y ^= y << 7 & 0x9d2c5680;
    y ^= y << 15 & 0xefc60000;
    y ^= y >>> 18;

    return y >>> 0;
  };

  RandomState.prototype.random = function random() {
    // Return a random float in the range [0, 1), with a full 53
    // bits of entropy.
    var val = this.randint();
    var lowBits = val >>> 6;
    var highBits = val >>> 5;
    return (highBits + lowBits * POW_NEG_26) * POW_NEG_27;
  };

  RandomState.prototype.randbelow = function randbelow(upperBound) {
    if (upperBound <= 0) {
      return 0;
    }
    var lg = function lg(x) {
      return Math.LOG2E * Math.log(x + 1e-10) >> 0;
    };
    if (upperBound <= 0x100000000) {
      var r = upperBound;
      var bits = this.bits[upperBound] || (this.bits[upperBound] = lg(upperBound - 1) + 1); // memoize values for `bits`
      while (r >= upperBound) {
        r = this.randint() >>> 32 - bits;
        if (r < 0) {
          r += POW_32;
        }
      }
      return r;
    }
    return this.randint() % upperBound;
  };

  RandomState.prototype.randrange = function randrange(start, stop, step) {
    // Return a random integer N in range `[start...stop] by step`
    if (stop === undefined) {
      return this.randbelow(start);
    } else if (!step) {
      return start + this.randbelow(stop - start);
    }
    return start + step * this.randbelow(Math.floor((stop - start) / step));
  };

  RandomState.prototype.gauss = function gauss() {
    var mu = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var sigma = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    // Gaussian distribution. `mu` is the mean, and `sigma` is the standard
    // deviation. Notes:
    //   * uses the "polar method"
    //   * we generate pairs; keep one in a cache for next time
    var z = this.next_gauss;
    if (z != null) {
      this.next_gauss = null;
    } else {
      var s = void 0;
      var u = void 0;
      var v = void 0;
      while (!s || !(s < 1)) {
        u = 2 * this.random() - 1;
        v = 2 * this.random() - 1;
        s = u * u + v * v;
      }
      var w = Math.sqrt(-2 * Math.log(s) / s);
      z = u * w;this.next_gauss = v * w;
    }
    return mu + z * sigma; // Alias for the `gauss` function
  };

  RandomState.prototype.uniform = function uniform(a, b) {
    // Return a random floating point number N such that a <= N <= b for
    // a <= b and b <= N <= a for b < a.
    return a + this.random() * (b - a);
  };

  return RandomState;
}();

var BaseSpace = function BaseSpace() {
  var _this = this;

  classCallCheck(this, BaseSpace);

  this.eval = function (expr, _ref) {
    var rState = _ref.rng;

    if (expr === undefined || expr === null) {
      return expr;
    }
    var rng = rState;
    if (rng === undefined) {
      rng = new RandomState();
    }
    var name = expr.name,
        rest = objectWithoutProperties(expr, ['name']);

    var space = _this[name];
    if (typeof space !== 'function') {
      if (Array.isArray(expr)) {
        return expr.map(function (item) {
          return _this.eval(item, { rng: rng });
        });
      }
      if ((typeof expr === 'undefined' ? 'undefined' : _typeof(expr)) === 'object') {
        return Object.keys(expr).reduce(function (r, key) {
          var _babelHelpers$extends;

          return _extends({}, r, (_babelHelpers$extends = {}, _babelHelpers$extends[key] = _this.eval(expr[key], { rng: rng }), _babelHelpers$extends));
        }, {});
      }
      return expr;
    }
    return space(rest, rng);
  };
};


var STATUS_NEW = 'new';
var STATUS_RUNNING = 'running';
var STATUS_SUSPENDED = 'suspended';
var STATUS_OK = 'ok';
var STATUS_FAIL = 'fail';
var STATUS_STRINGS = ['new', // computations have not started
'running', // computations are in prog
'suspended', // computations have been suspended, job is not finished
'ok', // computations are finished, terminated normally
'fail']; // computations are finished, terminated with error


// -- named constants for job execution pipeline
var JOB_STATE_NEW = 0;
var JOB_STATE_RUNNING = 1;
var JOB_STATE_DONE = 2;
var JOB_STATE_ERROR = 3;
var JOB_STATES = [JOB_STATE_NEW, JOB_STATE_RUNNING, JOB_STATE_DONE, JOB_STATE_ERROR];

var TRIAL_KEYS = ['id', 'result', 'args', 'state', 'book_time', 'refresh_time'];

var range = function range(start, end) {
  return Array.from({ length: end - start }, function (v, k) {
    return k + start;
  });
};

var Trials = function () {
  function Trials() {
    var _this2 = this;

    var expKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    classCallCheck(this, Trials);

    this.refresh = function () {
      if (_this2.expKey === null) {
        _this2.trials = _this2.dynamicTrials.filter(function (trial) {
          return trial.state !== JOB_STATE_ERROR;
        });
      } else {
        _this2.trials = _this2.dynamicTrials.filter(function (trial) {
          return trial.state !== JOB_STATE_ERROR && trial.expKey === _this2.expKey;
        });
        _this2.ids = [];
      }
    };

    this.assertValidTrial = function (trial) {
      if (Object.keys(trial).length <= 0) {
        throw new Error('trial should be an object');
      }
      var missingTrialKey = TRIAL_KEYS.find(function (key) {
        return trial[key] === undefined;
      });
      if (missingTrialKey !== undefined) {
        throw new Error('trial missing key ' + missingTrialKey);
      }
      if (trial.expKey !== _this2.expKey) {
        throw new Error('wrong trial expKey ' + trial.expKey + ', expected ' + _this2.expKey);
      }
      return trial;
    };

    this.internalInsertTrialDocs = function (docs) {
      var rval = docs.map(function (doc) {
        return doc.id;
      });
      _this2.dynamicTrials = [].concat(_this2.dynamicTrials, docs);
      return rval;
    };

    this.insertTrialDoc = function (trial) {
      var doc = _this2.assertValidTrial(trial);
      return _this2.internalInsertTrialDocs([doc])[0];
    };

    this.insertTrialDocs = function (trials) {
      var docs = trials.map(function (trial) {
        return _this2.assertValidTrial(trial);
      });
      return _this2.internalInsertTrialDocs(docs);
    };

    this.newTrialIds = function (N) {
      var aa = _this2.ids.length;
      var rval = range(aa, aa + N);
      _this2.ids = [].concat(_this2.ids, rval);
      return rval;
    };

    this.newTrialDocs = function (ids, results, args) {
      var rval = [];
      for (var i = 0; i < ids.length; i += 1) {
        var doc = {
          state: JOB_STATE_NEW,
          id: ids[i],
          result: results[i],
          args: args[i]
        };
        doc.expKey = _this2.expKey;
        doc.book_time = null;
        doc.refresh_time = null;
        rval.push(doc);
      }
      return rval;
    };

    this.deleteAll = function () {
      _this2.dynamicTrials = [];
      _this2.refresh();
    };

    this.countByStateSynced = function (arg) {
      var trials = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var vTrials = trials === null ? _this2.trials : trials;
      var vArg = Array.isArray(arg) ? arg : [arg];
      var queue = vTrials.filter(function (doc) {
        return vArg.indexOf(doc.state) >= 0;
      });
      return queue.length;
    };

    this.countByStateUnsynced = function (arg) {
      var expTrials = _this2.expKey !== null ? _this2.dynamicTrials.map(function (trial) {
        return trial.expKey === _this2.expKey;
      }) : _this2.dynamicTrials;
      return _this2.countByStateSynced(arg, expTrials);
    };

    this.losses = function () {
      return _this2.results.map(function (r) {
        return r.loss || r.accuracy;
      });
    };

    this.statuses = function () {
      return _this2.results.map(function (r) {
        return r.status;
      });
    };

    this.ids = [];
    this.dynamicTrials = [];
    this.trials = [];
    this.expKey = expKey;
    if (refresh) {
      this.refresh();
    }
  }

  Trials.prototype.bestTrial = function bestTrial() {
    var compare = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (a, b) {
      return a.loss !== undefined ? a.loss < b.loss : a.accuracy > b.accuracy;
    };

    var best = this.trials[0];
    this.trials.forEach(function (trial) {
      if (trial.result.status === STATUS_OK && compare(trial.result, best.result)) {
        best = trial;
      }
    });
    return best;
  };

  createClass(Trials, [{
    key: 'length',
    get: function get$$1() {
      return this.trials.length;
    }
  }, {
    key: 'results',
    get: function get$$1() {
      return this.trials.map(function (trial) {
        return trial.result;
      });
    }
  }, {
    key: 'args',
    get: function get$$1() {
      return this.trials.map(function (trial) {
        return trial.args;
      });
    }
  }, {
    key: 'argmin',
    get: function get$$1() {
      var best = this.bestTrial();
      return best !== undefined ? best.args : undefined;
    }
  }, {
    key: 'argmax',
    get: function get$$1() {
      var best = this.bestTrial(function (a, b) {
        return a.loss !== undefined ? a.loss > b.loss : a.accuracy > b.accuracy;
      });
      return best !== undefined ? best.args : undefined;
    }
  }]);
  return Trials;
}();

var Domain = function Domain(fn, expr, params) {
  var _this3 = this;

  classCallCheck(this, Domain);

  this.evaluate = function () {
    var _ref2 = asyncToGenerator(function* (args) {
      var rval = yield _this3.fn(args, _this3.params);
      var result = void 0;
      if (typeof rval === 'number' && !Number.isNaN(rval)) {
        result = { loss: rval, status: STATUS_OK };
      } else {
        result = rval;
        if (result === undefined) {
          throw new Error('Optimization function should return a loss value');
        }
        var _result = result,
            status = _result.status,
            loss = _result.loss,
            accuracy = _result.accuracy;

        if (STATUS_STRINGS.indexOf(status) < 0) {
          throw new Error('invalid status ' + status);
        }
        if (status === STATUS_OK && loss === undefined && accuracy === undefined) {
          throw new Error('invalid loss and accuracy');
        }
      }
      return result;
    });

    return function (_x5) {
      return _ref2.apply(this, arguments);
    };
  }();

  this.newResult = function () {
    return {
      status: STATUS_NEW
    };
  };

  this.fn = fn;
  this.expr = expr;
  this.params = params;
};

/* eslint-disable camelcase,no-await-in-loop */

var getTimeStatmp = function getTimeStatmp() {
  return new Date().getTime();
};

var FMinIter = function () {
  function FMinIter(algo, domain, trials) {
    var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        rng = _ref.rng,
        _ref$catchExceptions = _ref.catchExceptions,
        catchExceptions = _ref$catchExceptions === undefined ? false : _ref$catchExceptions,
        _ref$max_queue_len = _ref.max_queue_len,
        max_queue_len = _ref$max_queue_len === undefined ? 1 : _ref$max_queue_len,
        _ref$max_evals = _ref.max_evals,
        max_evals = _ref$max_evals === undefined ? Number.MAX_VALUE : _ref$max_evals;

    var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    classCallCheck(this, FMinIter);

    _initialiseProps.call(this);

    this.catchExceptions = catchExceptions;
    this.algo = algo;
    this.domain = domain;
    this.trials = trials;
    this.callbacks = params.callbacks || {};
    this.max_queue_len = max_queue_len;
    this.max_evals = max_evals;
    this.rng = rng;
  }

  FMinIter.prototype.serial_evaluate = function () {
    var _ref2 = asyncToGenerator(function* () {
      var N = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
      var _callbacks = this.callbacks,
          onExperimentBegin = _callbacks.onExperimentBegin,
          onExperimentEnd = _callbacks.onExperimentEnd;

      var n = N;
      var stopped = false;
      for (var i = 0; i < this.trials.dynamicTrials.length; i += 1) {
        var trial = this.trials.dynamicTrials[i];
        if (trial.state === JOB_STATE_NEW) {
          trial.state = JOB_STATE_RUNNING;
          var now = getTimeStatmp();
          trial.book_time = now;
          trial.refresh_time = now;
          try {
            if (typeof onExperimentBegin === 'function') {
              if ((yield onExperimentBegin(i, trial)) === true) {
                stopped = true;
              }
            }
            // eslint-disable-next-line no-await-in-loop
            var result = yield this.domain.evaluate(trial.args);
            trial.state = JOB_STATE_DONE;
            trial.result = result;
            trial.refresh_time = getTimeStatmp();
          } catch (e) {
            trial.state = JOB_STATE_ERROR;
            trial.error = e + ', ' + e.message;
            trial.refresh_time = getTimeStatmp();
            if (!this.catchExceptions) {
              this.trials.refresh();
              throw e;
            }
          }
          if (typeof onExperimentEnd === 'function') {
            if ((yield onExperimentEnd(i, trial)) === true) {
              stopped = true;
            }
          }
        }
        n -= 1;
        if (n === 0 || stopped) {
          break;
        }
      }
      this.trials.refresh();
      return stopped;
    });

    function serial_evaluate() {
      return _ref2.apply(this, arguments);
    }

    return serial_evaluate;
  }();

  return FMinIter;
}();

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.run = function () {
    var _ref4 = asyncToGenerator(function* (N) {
      var trials = _this.trials,
          algo = _this.algo;

      var n_queued = 0;

      var get_queue_len = function get_queue_len() {
        return _this.trials.countByStateUnsynced(JOB_STATE_NEW);
      };

      var stopped = false;
      while (n_queued < N) {
        var _qlen = get_queue_len();
        while (_qlen < _this.max_queue_len && n_queued < N) {
          var n_to_enqueue = Math.min(_this.max_queue_len - _qlen, N - n_queued);
          var new_ids = trials.newTrialIds(n_to_enqueue);
          trials.refresh();
          var new_trials = algo(new_ids, _this.domain, trials, _this.rng.randrange(0, Math.pow(2, 31) - 1));
          console.assert(new_ids.length >= new_trials.length);
          if (new_trials.length) {
            _this.trials.insertTrialDocs(new_trials);
            _this.trials.refresh();
            n_queued += new_trials.length;
            _qlen = get_queue_len();
          } else {
            stopped = true;
            break;
          }
        }
        stopped = stopped || (yield _this.serial_evaluate());
        if (stopped) {
          break;
        }
      }
      var qlen = get_queue_len();
      if (qlen) {
        var msg = 'Exiting run, not waiting for ' + qlen + ' jobs.';
        console.error(msg);
      }
    });

    return function (_x9) {
      return _ref4.apply(this, arguments);
    };
  }();

  this.exhaust = asyncToGenerator(function* () {
    var n_done = _this.trials.length;
    yield _this.run(_this.max_evals - n_done);
    _this.trials.refresh();
    return _this;
  });
};

var fmin = (function () {
  var _ref3 = asyncToGenerator(function* (fn, space, algo, max_evals) {
    var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var defTrials = params.trials,
        rngDefault = params.rng,
        _params$catchExceptio = params.catchExceptions,
        catchExceptions = _params$catchExceptio === undefined ? false : _params$catchExceptio;


    var rng = void 0;
    if (rngDefault) {
      rng = rngDefault;
    } else {
      rng = new RandomState();
    }
    var trials = void 0;
    if (!defTrials) {
      trials = new Trials();
    } else {
      trials = defTrials;
    }

    var domain = new Domain(fn, space, params);

    var rval = new FMinIter(algo, domain, trials, { max_evals: max_evals, rng: rng, catchExceptions: catchExceptions }, params);
    yield rval.exhaust();
    return trials;
  });

  return function (_x4, _x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
})();

var RandomSearch = function (_BaseSpace) {
  inherits(RandomSearch, _BaseSpace);

  function RandomSearch() {
    var _temp, _this, _ret;

    classCallCheck(this, RandomSearch);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, _BaseSpace.call.apply(_BaseSpace, [this].concat(args))), _this), _this.choice = function (params, rng) {
      var options = params.options;

      var idx = rng.randrange(0, options.length, 1);
      var option = options[idx];
      var arg = _this.eval(option, { rng: rng });
      return arg;
    }, _this.randint = function (params, rng) {
      return rng.randrange(0, params.upper, 1);
    }, _this.uniform = function (params, rng) {
      var low = params.low,
          high = params.high;

      return rng.uniform(low, high);
    }, _this.quniform = function (params, rng) {
      var low = params.low,
          high = params.high,
          q = params.q;

      return Math.round(rng.uniform(low, high) / q) * q;
    }, _this.loguniform = function (params, rng) {
      var low = params.low,
          high = params.high;

      return Math.exp(rng.uniform(low, high));
    }, _this.qloguniform = function (params, rng) {
      var low = params.low,
          high = params.high,
          q = params.q;

      return Math.round(Math.exp(rng.uniform(low, high)) / q) * q;
    }, _this.normal = function (params, rng) {
      var mu = params.mu,
          sigma = params.sigma;

      return rng.gauss(mu, sigma);
    }, _this.qnormal = function (params, rng) {
      var mu = params.mu,
          sigma = params.sigma,
          q = params.q;

      return Math.round(rng.gauss(mu, sigma) / q) * q;
    }, _this.lognormal = function (params, rng) {
      var mu = params.mu,
          sigma = params.sigma;

      return Math.exp(rng.gauss(mu, sigma));
    }, _this.qlognormal = function (params, rng) {
      var mu = params.mu,
          sigma = params.sigma,
          q = params.q;

      return Math.round(Math.exp(rng.gauss(mu, sigma)) / q) * q;
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  return RandomSearch;
}(BaseSpace);

var randomSample = function randomSample(space) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var rs = new RandomSearch();
  var args = rs.eval(space, params);
  if (Object.keys(args).length === 1) {
    var results = Object.keys(args).map(function (key) {
      return args[key];
    });
    return results.length === 1 ? results[0] : results;
  }
  return args;
};

var randomSearch = function randomSearch(newIds, domain, trials, seed) {
  var rng = new RandomState(seed);
  var rval = [];
  var rs = new RandomSearch();
  newIds.forEach(function (newId) {
    var paramsEval = rs.eval(domain.expr, { rng: rng });
    var result = domain.newResult();
    rval = [].concat(rval, trials.newTrialDocs([newId], [result], [paramsEval]));
  });
  return rval;
};

/* eslint-disable class-methods-use-this */

var GridSearchParam = function () {
  function GridSearchParam(params, gs) {
    var _this = this;

    classCallCheck(this, GridSearchParam);

    this.getSample = function () {
      return undefined;
    };

    this.sample = function (index) {
      if (index < 0 || index >= _this.numSamples) {
        throw new Error('invalid sample index "' + index + '"');
      }
      return _this.getSample(index);
    };

    this.params = params;
    this.gs = gs;
  }

  createClass(GridSearchParam, [{
    key: 'numSamples',
    get: function get$$1() {
      return 1;
    }
  }]);
  return GridSearchParam;
}();

var GridSearchNotImplemented = function (_GridSearchParam) {
  inherits(GridSearchNotImplemented, _GridSearchParam);

  function GridSearchNotImplemented() {
    var _temp, _this2, _ret;

    classCallCheck(this, GridSearchNotImplemented);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this2 = possibleConstructorReturn(this, _GridSearchParam.call.apply(_GridSearchParam, [this].concat(args))), _this2), _this2.getSample = function (index) {
      return _this2.params.options[index];
    }, _temp), possibleConstructorReturn(_this2, _ret);
  }

  createClass(GridSearchNotImplemented, [{
    key: 'numSamples',
    get: function get$$1() {
      throw new Error('Can not evaluate length of non-discrete parameter "' + this.params.name + '"');
    }
  }]);
  return GridSearchNotImplemented;
}(GridSearchParam);

var GridSearchChoice = function (_GridSearchParam2) {
  inherits(GridSearchChoice, _GridSearchParam2);

  function GridSearchChoice() {
    var _temp2, _this3, _ret2;

    classCallCheck(this, GridSearchChoice);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this3 = possibleConstructorReturn(this, _GridSearchParam2.call.apply(_GridSearchParam2, [this].concat(args))), _this3), _this3.getSample = function (index) {
      return _this3.params.options[index];
    }, _temp2), possibleConstructorReturn(_this3, _ret2);
  }

  createClass(GridSearchChoice, [{
    key: 'numSamples',
    get: function get$$1() {
      var _this4 = this;

      return this.params.options.reduce(function (r, e) {
        return r + _this4.gs.numSamples(e);
      }, 0);
    }
  }]);
  return GridSearchChoice;
}(GridSearchParam);

var GridSearchRandInt = function (_GridSearchParam3) {
  inherits(GridSearchRandInt, _GridSearchParam3);

  function GridSearchRandInt() {
    var _temp3, _this5, _ret3;

    classCallCheck(this, GridSearchRandInt);

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return _ret3 = (_temp3 = (_this5 = possibleConstructorReturn(this, _GridSearchParam3.call.apply(_GridSearchParam3, [this].concat(args))), _this5), _this5.getSample = function (index) {
      return index;
    }, _temp3), possibleConstructorReturn(_this5, _ret3);
  }

  createClass(GridSearchRandInt, [{
    key: 'numSamples',
    get: function get$$1() {
      return this.params.upper;
    }
  }]);
  return GridSearchRandInt;
}(GridSearchParam);

var GridSearchUniform = function (_GridSearchParam4) {
  inherits(GridSearchUniform, _GridSearchParam4);

  function GridSearchUniform() {
    var _temp4, _this6, _ret4;

    classCallCheck(this, GridSearchUniform);

    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return _ret4 = (_temp4 = (_this6 = possibleConstructorReturn(this, _GridSearchParam4.call.apply(_GridSearchParam4, [this].concat(args))), _this6), _this6.getSample = function (index) {
      return _this6.params.low + index * _this6.params.q;
    }, _temp4), possibleConstructorReturn(_this6, _ret4);
  }

  createClass(GridSearchUniform, [{
    key: 'numSamples',
    get: function get$$1() {
      return Math.floor((this.params.high - this.params.low) / this.params.q) + 1;
    }
  }]);
  return GridSearchUniform;
}(GridSearchParam);

var GridSearchNormal = function (_GridSearchParam5) {
  inherits(GridSearchNormal, _GridSearchParam5);

  function GridSearchNormal() {
    var _temp5, _this7, _ret5;

    classCallCheck(this, GridSearchNormal);

    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return _ret5 = (_temp5 = (_this7 = possibleConstructorReturn(this, _GridSearchParam5.call.apply(_GridSearchParam5, [this].concat(args))), _this7), _this7.getSample = function (index) {
      return _this7.params.mu - 2 * _this7.params.sigma + index * _this7.params.q;
    }, _temp5), possibleConstructorReturn(_this7, _ret5);
  }

  createClass(GridSearchNormal, [{
    key: 'numSamples',
    get: function get$$1() {
      return Math.floor(4 * this.params.sigma / this.params.q) + 1;
    }
  }]);
  return GridSearchNormal;
}(GridSearchParam);

var GridSearchParamas = {
  choice: GridSearchChoice,
  randint: GridSearchRandInt,
  quniform: GridSearchUniform,
  qloguniform: GridSearchUniform,
  qnormal: GridSearchNormal,
  qlognormal: GridSearchNormal,
  uniform: GridSearchNotImplemented,
  loguniform: GridSearchNotImplemented,
  normal: GridSearchNotImplemented,
  lognormal: GridSearchNotImplemented
};

var GridSearch = function (_BaseSpace) {
  inherits(GridSearch, _BaseSpace);

  function GridSearch() {
    var _temp6, _this8, _ret6;

    classCallCheck(this, GridSearch);

    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    return _ret6 = (_temp6 = (_this8 = possibleConstructorReturn(this, _BaseSpace.call.apply(_BaseSpace, [this].concat(args))), _this8), _this8.numSamples = function (expr) {
      var flat = _this8.samples(expr);
      return flat.reduce(function (r, o) {
        return r * o.samples;
      }, 1);
    }, _this8.samples = function (expr) {
      if (!expr) {
        return expr;
      }
      var flat = [];
      var name = expr.name;

      var Param = GridSearchParamas[name];
      if (Param === undefined) {
        if (Array.isArray(expr)) {
          expr.forEach(function (el) {
            return flat.push.apply(flat, _this8.samples(el));
          });
        }
        if (typeof expr === 'string') {
          flat.push({ name: name, samples: 1, expr: expr });
        }
        if ((typeof expr === 'undefined' ? 'undefined' : _typeof(expr)) === 'object') {
          Object.keys(expr).forEach(function (key) {
            return flat.push.apply(flat, _this8.samples(expr[key]));
          });
        }
      } else {
        flat.push({ name: name, samples: new Param(expr, _this8).numSamples, expr: expr });
      }
      return flat;
    }, _temp6), possibleConstructorReturn(_this8, _ret6);
  }

  return GridSearch;
}(BaseSpace);

var gridSample = function gridSample(space) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var gs = new GridSearch();
  var args = gs.eval(space, params);
  if (Object.keys(args).length === 1) {
    var results = Object.keys(args).map(function (key) {
      return args[key];
    });
    return results.length === 1 ? results[0] : results;
  }
  return args;
};

var gridSearch = function gridSearch(newIds, domain, trials) {
  var rval = [];
  var gs = new GridSearch();
  newIds.forEach(function (newId) {
    var paramsEval = gs.eval(domain.expr);
    var result = domain.newResult();
    rval = [].concat(rval, trials.newTrialDocs([newId], [result], [paramsEval]));
  });
  return rval;
};

var choice = function choice(options) {
  return { name: 'choice', options: options };
};
var randint = function randint(upper) {
  return { name: 'randint', upper: upper };
};
var uniform = function uniform(low, high) {
  return { name: 'uniform', low: low, high: high };
};
var quniform = function quniform(low, high, q) {
  return {
    name: 'quniform', low: low, high: high, q: q
  };
};
var loguniform = function loguniform(low, high) {
  return { name: 'loguniform', low: low, high: high };
};
var qloguniform = function qloguniform(low, high, q) {
  return {
    name: 'qloguniform', low: low, high: high, q: q
  };
};
var normal = function normal(mu, sigma) {
  return { name: 'normal', mu: mu, sigma: sigma };
};
var qnormal = function qnormal(mu, sigma, q) {
  return {
    name: 'qnormal', mu: mu, sigma: sigma, q: q
  };
};
var lognormal = function lognormal(mu, sigma) {
  return { name: 'lognormal', mu: mu, sigma: sigma };
};
var qlognormal = function qlognormal(mu, sigma, q) {
  return {
    name: 'qlognormal', mu: mu, sigma: sigma, q: q
  };
};

var search = {
  randomSearch: randomSearch,
  gridSearch: gridSearch
};

var sample = {
  randomSample: randomSample,
  gridSample: gridSample
};

exports.fmin = fmin;
exports.RandomState = RandomState;
exports.choice = choice;
exports.randint = randint;
exports.uniform = uniform;
exports.quniform = quniform;
exports.loguniform = loguniform;
exports.qloguniform = qloguniform;
exports.normal = normal;
exports.qnormal = qnormal;
exports.lognormal = lognormal;
exports.qlognormal = qlognormal;
exports.search = search;
exports.sample = sample;
exports.STATUS_NEW = STATUS_NEW;
exports.STATUS_RUNNING = STATUS_RUNNING;
exports.STATUS_SUSPENDED = STATUS_SUSPENDED;
exports.STATUS_OK = STATUS_OK;
exports.STATUS_FAIL = STATUS_FAIL;
exports.STATUS_STRINGS = STATUS_STRINGS;
exports.JOB_STATE_NEW = JOB_STATE_NEW;
exports.JOB_STATE_RUNNING = JOB_STATE_RUNNING;
exports.JOB_STATE_DONE = JOB_STATE_DONE;
exports.JOB_STATE_ERROR = JOB_STATE_ERROR;
exports.JOB_STATES = JOB_STATES;
exports.TRIAL_KEYS = TRIAL_KEYS;
exports.range = range;
exports.Trials = Trials;
exports.Domain = Domain;

Object.defineProperty(exports, '__esModule', { value: true });

})));
