(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tf = require('@tensorflow/tfjs-core');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
}

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var ENV = tf.env();
/** The batched command encoders size in the device queue. */
ENV.registerFlag('WEBGPU_DEFERRED_SUBMIT_BATCH_SIZE', function () { return 15; });
/**
 * Whether we forward execution to the CPU backend if tensors are small and
 * reside on the CPU.
 */
ENV.registerFlag('WEBGPU_CPU_FORWARD', function () { return true; });
/**
 * Thread register block size for matmul kernel.
 */
ENV.registerFlag('WEBGPU_MATMUL_WORK_PER_THREAD', function () { return 4; });
/**
 * Whether to use conv2d_naive which directly implement the conv2d logic rather
 * than using a matmul to simulate.
 */
ENV.registerFlag('WEBGPU_USE_NAIVE_CONV2D', function () { return false; });
/**
 * Whether to use conv2dTranspose_naive which directly implement the
 * conv2dTranspose logic rather than using a matmul to simulate.
 */
ENV.registerFlag('WEBGPU_USE_NAIVE_CONV2D_TRANSPOSE', function () { return false; });
/**
 * Whether we will run im2col as a separate shader for convolution.
 */
ENV.registerFlag('WEBGPU_CONV_SEPARATE_IM2COL_SHADER', function () { return false; });
/**
 * Whether we use low power GPU. Otherwise, a high performance GPU will be
 * requested.
 */
ENV.registerFlag('WEBGPU_USE_LOW_POWER_GPU', function () { return false; });
/**
 * Threshold for input tensor size that determines whether WebGPU backend will
 * delegate computation to CPU.
 *
 * Default value is 128.
 */
ENV.registerFlag('CPU_HANDOFF_SIZE_THRESHOLD', function () { return 128; });

var arrayProduct = function (arr) {
    var product = 1;
    for (var i = 0; i < arr.length; i++) {
        product *= arr[i];
    }
    return product;
};
function tilesFitEvenlyIntoShape(tileSize, shape) {
    if (tileSize.length !== shape.length) {
        throw new Error("Cannot compute whether rank " + tileSize.length +
            (" tiles fit evenly into rank " + shape.length + " shape") +
            " - ranks must match.");
    }
    return shape.every(function (dim, dimIdx) { return dim % tileSize[dimIdx] === 0; });
}
// Computes dispatch geometry based on layout of output dimensions and
// workGroupSize.
function computeDispatch(layout, outputShape, workGroupSize, elementsPerThread) {
    if (workGroupSize === void 0) { workGroupSize = [1, 1, 1]; }
    if (elementsPerThread === void 0) { elementsPerThread = [1, 1, 1]; }
    return [
        Math.ceil(arrayProduct(layout.x.map(function (d) { return outputShape[d]; })) /
            (workGroupSize[0] * elementsPerThread[0])),
        layout.y ? Math.ceil(arrayProduct(layout.y.map(function (d) { return outputShape[d]; })) /
            (workGroupSize[1] * elementsPerThread[1])) :
            1,
        layout.z ? Math.ceil(arrayProduct(layout.z.map(function (d) { return outputShape[d]; })) /
            (workGroupSize[2] * elementsPerThread[2])) :
            1
    ];
}
function computeWorkGroupSizeForConv2d(layout, outputShape) {
    var dim0 = arrayProduct(layout.x.map(function (d) { return outputShape[d]; }));
    var dim1 = arrayProduct(layout.y.map(function (d) { return outputShape[d]; }));
    // TODO(jiajia.qin@intel.com): More fine tune based on outputShape.
    // These are experimental values. Usually, we need to adjust the work group
    // size based on the output shape. For example, when one dimension is smaller
    // than 4, it will be wasteful if we assign a larger size for this dimension,
    // which results lots of threads doing useless work and reduces parallelism
    // of hardware threads. But it is always a balance between work group size
    // and shared memory. If one dimension is too small, such as 1, shared memory
    // will won't be fully utilized.
    if (dim0 <= 4) {
        return [4, 16, 1];
    }
    if (dim1 <= 4) {
        return [16, 4, 1];
    }
    return [16, 16, 1];
}
function computeWorkGroupSizeForMatMul(dimAOuter, dimInner, dimBOuter) {
    // These are experimental values. Usually, we need to adjust the work group
    // size based on the input shapes to improve the EU occupancy.
    // 64 (16 x 4) is the default tile size. If one dimension can't be divisible
    // by 64, it means some threads will be idle. To improve the thread
    // utilization, reducing the work group size may be a good way.
    if (dimAOuter === 1) {
        return [64, 1, 1];
    }
    else if (dimBOuter === 1) {
        return [1, 64, 1];
    }
    else if (dimInner % 64 === 0 && dimBOuter % 64 === 0) {
        return [16, 16, 1];
    }
    else if (dimInner < 192 && dimBOuter < 192) {
        return [8, 8, 1];
    }
    return [16, 16, 1];
}
function computeWorkPerThreadForConv2d(layout, outputShape) {
    var dim0 = arrayProduct(layout.x.map(function (d) { return outputShape[d]; }));
    var dim1 = arrayProduct(layout.y.map(function (d) { return outputShape[d]; }));
    // TODO(jiajia.qin@intel.com): More fine tune based on outputShape.
    // The following conditions correspond to the values set in
    // computeWorkGroupSizeForConv2d.
    if (dim0 <= 4) {
        return [1, 2, 1];
    }
    if (dim1 <= 4) {
        return [2, 1, 1];
    }
    return [2, 2, 1];
}
function flatDispatchLayout(shape) {
    return { x: shape.map(function (d, i) { return i; }) };
}
function GPUBytesPerElement(dtype) {
    if (dtype === 'float32' || dtype === 'int32' || dtype === 'bool' ||
        dtype === 'string') {
        return 4;
    }
    else if (dtype === 'complex64') {
        return 8;
    }
    else {
        throw new Error("Unknown dtype " + dtype);
    }
}
function ArrayBufferToTypedArray(data, dtype) {
    if (dtype === 'float32') {
        return new Float32Array(data);
    }
    else if (dtype === 'int32') {
        return new Int32Array(data);
    }
    else if (dtype === 'bool' || dtype === 'string') {
        var dataAsInt32Array = new Int32Array(data);
        var boolData = new ArrayBuffer(dataAsInt32Array.length);
        var dataAsTypedArray = new Uint8Array(boolData);
        for (var i = 0; i < dataAsInt32Array.length; i++) {
            dataAsTypedArray[i] = dataAsInt32Array[i];
        }
        return dataAsTypedArray;
    }
    else {
        throw new Error("Unknown dtype " + dtype);
    }
}

var webgpu_util = {
    __proto__: null,
    tilesFitEvenlyIntoShape: tilesFitEvenlyIntoShape,
    computeDispatch: computeDispatch,
    computeWorkGroupSizeForConv2d: computeWorkGroupSizeForConv2d,
    computeWorkGroupSizeForMatMul: computeWorkGroupSizeForMatMul,
    computeWorkPerThreadForConv2d: computeWorkPerThreadForConv2d,
    flatDispatchLayout: flatDispatchLayout,
    GPUBytesPerElement: GPUBytesPerElement,
    ArrayBufferToTypedArray: ArrayBufferToTypedArray
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function makeMatMulPackedVec4Source(workPerThread) {
    return "\n    vec4 mm_readA(int row, int col);\n    vec4 mm_readB(int row, int col);\n    void mm_write(int row, int col, vec4 value);\n\n    const int RowPerThread = " + workPerThread[1] + ";\n    const int ColPerThread = " + workPerThread[0] + "; // only support ColPerThread = 4\n    const int TileAOuter = int(gl_WorkGroupSize.y) * RowPerThread;\n    const int TileBOuter = int(gl_WorkGroupSize.x) * ColPerThread;\n    const int TileInner = TileBOuter;\n\n    shared vec4 mm_Asub[TileAOuter][TileInner / ColPerThread];\n    shared vec4 mm_Bsub[TileInner][TileBOuter / ColPerThread];\n\n    void mm_matMul(int dimAOuter, int dimInner, int dimBOuter) {\n      int tileRow = int(gl_LocalInvocationID.y) * RowPerThread;\n      int tileCol = int(gl_LocalInvocationID.x);\n\n      int globalRow = int(gl_GlobalInvocationID.y) * RowPerThread;\n      int globalCol = int(gl_GlobalInvocationID.x);\n\n      int numTiles = (dimInner - 1) / TileInner + 1;\n\n      vec4 acc[RowPerThread];\n      vec4 ACached;\n      vec4 BCached[4];\n\n      // Without this initialization strange values show up in acc.\n      for (int innerRow = 0; innerRow < RowPerThread; innerRow++) {\n          acc[innerRow] = vec4(0.0, 0.0, 0.0, 0.0);\n      }\n\n      // Loop over shared dimension.\n      int globalColA = tileCol;\n      const int RowPerThreadB = TileInner / int(gl_WorkGroupSize.y);\n      int tileRowB = int(gl_LocalInvocationID.y) * RowPerThreadB;\n      for (int t = 0; t < numTiles; t++) {\n        // Load one tile of A into local memory.\n        for (int innerRow = 0; innerRow < RowPerThread; innerRow++) {\n            int inputRow = tileRow + innerRow;\n            int inputCol = tileCol;\n\n            mm_Asub[inputRow][inputCol] = mm_readA(\n                globalRow + innerRow,\n                globalColA);\n        }\n        globalColA += TileInner / ColPerThread;\n\n        // Load one tile of B into local memory.\n        for (int innerRow = 0; innerRow < RowPerThreadB; innerRow++) {\n            int inputRow = tileRowB + innerRow;\n            int inputCol = tileCol;\n\n            mm_Bsub[inputRow][inputCol] = mm_readB(\n              t * TileInner + inputRow,\n              globalCol);\n        }\n\n        barrier();\n\n        // Compute acc values for a single thread.\n        for (int k = 0; k < TileInner / ColPerThread; k++) {\n          BCached[0] = mm_Bsub[k * ColPerThread][tileCol];\n          BCached[1] = mm_Bsub[k * ColPerThread + 1][tileCol];\n          BCached[2] = mm_Bsub[k * ColPerThread + 2][tileCol];\n          BCached[3] = mm_Bsub[k * ColPerThread + 3][tileCol];\n\n          for (int i = 0; i < RowPerThread; i++) {\n            ACached = mm_Asub[tileRow + i][k];\n            acc[i] = BCached[0] * ACached.x + acc[i];\n            acc[i] = BCached[1] * ACached.y + acc[i];\n            acc[i] = BCached[2] * ACached.z + acc[i];\n            acc[i] = BCached[3] * ACached.w + acc[i];\n          }\n        }\n        barrier();\n      }\n\n      for (int innerRow = 0; innerRow < RowPerThread; innerRow++) {\n        mm_write(globalRow + innerRow,\n          globalCol,\n          acc[innerRow]);\n      }\n    }\n  ";
}
function makeMatMulVectorVec4Source() {
    return "\n    vec4 mm_readA(int row, int col);\n    vec4 mm_readB(int row, int col);\n    void mm_write(int row, int col, vec4 value);\n\n    const int TileSize = int(gl_WorkGroupSize.x) * 4;\n\n    shared vec4 mm_Asub[TileSize / 4];\n\n    void mm_matMul(int dimAOuter, int dimInner, int dimBOuter) {\n      int tileCol = int(gl_LocalInvocationID.x);\n      int globalCol = int(gl_GlobalInvocationID.x);\n      int globalRow = int(gl_GlobalInvocationID.y);\n\n      int numTiles = (dimInner - 1) / TileSize + 1;\n\n      // Without this initialization strange values show up in acc.\n      vec4 acc = vec4(0.0);\n\n      // Loop over shared dimension.\n      for (int t = 0; t < numTiles; t++) {\n        // Load one tile of A into local memory.\n        int colA = t * TileSize / 4 + tileCol;\n        mm_Asub[tileCol] = mm_readA(globalRow, colA);\n        barrier();\n\n        // Compute acc values for a single thread.\n        for (int k = 0; k < TileSize / 4; k++) {\n          int rowB = t * TileSize + k * 4;\n          vec4 BCached0 = mm_readB(rowB, globalCol);\n          vec4 BCached1 = mm_readB(rowB + 1, globalCol);\n          vec4 BCached2 = mm_readB(rowB + 2, globalCol);\n          vec4 BCached3 = mm_readB(rowB + 3, globalCol);\n\n          vec4 ACached = mm_Asub[k];\n          acc += BCached0 * ACached.x;\n          acc += BCached1 * ACached.y;\n          acc += BCached2 * ACached.z;\n          acc += BCached3 * ACached.w;\n        }\n\n        barrier();\n      }\n\n      if (globalRow < dimAOuter && globalCol < dimBOuter) {\n        mm_write(globalRow, globalCol, acc);\n      }\n    }\n  ";
}
var MatMulPackedVec4Program = /** @class */ (function () {
    function MatMulPackedVec4Program(aShape, outputShape, rowPerThread, bias, activation, preluActivationWeights) {
        var _a;
        if (bias === void 0) { bias = null; }
        if (activation === void 0) { activation = null; }
        if (preluActivationWeights === void 0) { preluActivationWeights = null; }
        this.variableNames = ['A', 'B'];
        this.workGroupSize = [16, 16, 1];
        this.isVec4 = true;
        this.vecSize = 4;
        this.outputShape = outputShape;
        this.workGroupSize = computeWorkGroupSizeForMatMul(outputShape[1], aShape[2], outputShape[2]);
        this.dispatchLayout = { x: [2], y: [1], z: [0] };
        if (outputShape[1] === 1) {
            rowPerThread = 1;
        }
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [this.vecSize, rowPerThread, 1]);
        var addBias = bias != null;
        var hasPreluActivationWeights = preluActivationWeights != null;
        if (addBias) {
            this.variableNames.push('bias');
        }
        if (hasPreluActivationWeights) {
            this.variableNames.push('preluActivationWeights');
        }
        this.workPerThread = rowPerThread;
        this.aShape = aShape;
        this.addBias = addBias;
        this.activation = activation;
        this.hasPreluActivationWeights = hasPreluActivationWeights;
        _a = this.getShapeFit(), this.fitA = _a[0], this.fitB = _a[1];
        this.shaderKey = "matMulPackedVec4_" + rowPerThread + "_" + activation + "_" + this.fitA + "_" + this.fitB + "_" + (this.outputShape[1] > 1);
    }
    MatMulPackedVec4Program.prototype.getShapeFit = function () {
        var dimInner = this.aShape[2];
        var dimBOuter = this.outputShape[2];
        var bShape = [this.outputShape[0], dimInner, dimBOuter];
        var tileAOuter = this.workGroupSize[1] * this.workPerThread;
        var tileBOuter = this.workGroupSize[0] * this.vecSize;
        var tileInner = tileBOuter; // Make sure tileInner is divisible by 4.
        var tileSizeA = [tileAOuter, tileInner];
        var tileSizeB = [tileInner, tileBOuter];
        return [
            tilesFitEvenlyIntoShape(tileSizeA, this.aShape.slice(1)),
            tilesFitEvenlyIntoShape(tileSizeB, bShape.slice(1))
        ];
    };
    MatMulPackedVec4Program.prototype.getUserCode = function () {
        var sampleA = this.fitA ?
            "A[batch * batchASize + row * dimInner / 4 + col]" :
            "coordsInBounds(ivec2(row, col * 4), ivec2(dimAOuter, dimInner)) ?\n            A[batch * batchASize + row * dimInner / 4 + col] :\n            vec4(0.0, 0.0, 0.0, 0.0)";
        var sampleB = this.fitB ?
            "B[batch * batchBSize + row * dimBOuter / 4 + col]" :
            "coordsInBounds(ivec2(row, col * 4), ivec2(dimInner, dimBOuter)) ?\n            B[batch * batchBSize + row * dimBOuter / 4 + col] :\n            vec4(0.0, 0.0, 0.0, 0.0)";
        var activationSnippet = '', applyActivationSnippet = '';
        if (this.activation) {
            if (this.hasPreluActivationWeights) {
                activationSnippet = "vec4 activation(vec4 a, ivec3 outCoord) {\n                  vec4 b = getPreluActivationWeightsAtOutCoords(outCoord);\n                  " + this.activation + "\n                }";
            }
            else {
                activationSnippet = "\n                vec4 activation(vec4 a, ivec3 outCoord) {\n                  " + this.activation + "\n                }";
            }
            applyActivationSnippet = 'value = activation(value, outCoord);';
        }
        var addBiasSnippet = this.addBias ? 'value += getBiasAtOutCoords(outCoord);' : '';
        var userCode = "\n      " + activationSnippet + "\n      int dimAOuter = aShape[1];\n      int dimInner = aShape[2];\n      int dimBOuter = bShape[2];\n      int batch;\n\n      " + (this.outputShape[1] > 1 ?
            makeMatMulPackedVec4Source([this.vecSize, this.workPerThread, 1]) :
            makeMatMulVectorVec4Source()) + "\n\n      vec4 mm_readA(int row, int col) {\n        int batchASize = aShape[1] * aShape[2] / " + this.vecSize + ";\n        return " + sampleA + ";\n      }\n\n      vec4 mm_readB(int row, int col) {\n        // TODO: This is not covered in unit tests.\n        int batchBSize = bShape[1] * bShape[2] / " + this.vecSize + ";\n        return " + sampleB + ";\n      }\n\n      void mm_write(int row, int col, vec4 value) {\n        if (row < dimAOuter && col * 4 < dimBOuter)\n        {\n          ivec3 outCoord = ivec3(batch, row, col * 4);\n          " + addBiasSnippet + "\n          " + applyActivationSnippet + "\n          setOutput(outCoord[0], outCoord[1], outCoord[2], value);\n        }\n      }\n\n      void main() {\n        batch = int(gl_GlobalInvocationID.z);\n        mm_matMul(dimAOuter, dimInner, dimBOuter);\n      }\n    ";
        return userCode;
    };
    return MatMulPackedVec4Program;
}());

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function makeMatMulPackedSource(workPerThread) {
    return "\n    float mm_readA(int row, int col);\n    float mm_readB(int row, int col);\n    void mm_write(int row, int col, float value);\n    void mm_matMul(int dimAOuter, int dimInner, int dimBOuter);\n\n    const int RowPerThread = " + workPerThread[1] + ";\n    const int ColPerThread = " + workPerThread[0] + ";\n    const int TileAOuter = int(gl_WorkGroupSize.y) * RowPerThread;\n    const int TileBOuter = int(gl_WorkGroupSize.x) * ColPerThread;\n    const int TileInner = TileAOuter > TileBOuter ? TileAOuter : TileBOuter;\n\n    shared float mm_Asub[TileAOuter][TileInner];\n    shared float mm_Bsub[TileInner][TileBOuter];\n\n    void mm_matMul(int dimAOuter, int dimInner, int dimBOuter) {\n      int tileRow = int(gl_LocalInvocationID.y) * RowPerThread;\n      int tileCol = int(gl_LocalInvocationID.x) * ColPerThread;\n\n      int globalRow = int(gl_GlobalInvocationID.y) * RowPerThread;\n      int globalCol = int(gl_GlobalInvocationID.x) * ColPerThread;\n\n      int numTiles = (dimInner - 1) / TileInner + 1;\n\n      float acc[RowPerThread][ColPerThread];\n      float ACached;\n      float BCached[ColPerThread];\n\n      // Without this initialization strange values show up in acc.\n      for (int innerRow = 0; innerRow < RowPerThread; innerRow++) {\n        for (int innerCol = 0; innerCol < ColPerThread; innerCol++) {\n          acc[innerRow][innerCol] = 0.0;\n        }\n      }\n\n      const int ColPerThreadA = TileInner / int(gl_WorkGroupSize.x);\n      int tileColA = int(gl_LocalInvocationID.x) * ColPerThreadA;\n      const int RowPerThreadB = TileInner / int(gl_WorkGroupSize.y);\n      int tileRowB = int(gl_LocalInvocationID.y) * RowPerThreadB;\n\n      // Loop over shared dimension.\n      for (int t = 0; t < numTiles; t++) {\n        // Load one tile of A into local memory.\n        for (int innerRow = 0; innerRow < RowPerThread; innerRow++) {\n          for (int innerCol = 0; innerCol < ColPerThreadA; innerCol++) {\n            int inputRow = tileRow + innerRow;\n            int inputCol = tileColA + innerCol;\n\n            mm_Asub[inputRow][inputCol] = mm_readA(\n                globalRow + innerRow,\n                t * TileInner + inputCol);\n          }\n        }\n        // Load one tile of B into local memory.\n        for (int innerRow = 0; innerRow < RowPerThreadB; innerRow++) {\n          for (int innerCol = 0; innerCol < ColPerThread; innerCol++) {\n            int inputRow = tileRowB + innerRow;\n            int inputCol = tileCol + innerCol;\n\n            mm_Bsub[inputRow][inputCol] = mm_readB(\n              t * TileInner + inputRow,\n              globalCol + innerCol);;\n          }\n        }\n\n        barrier();\n\n        // Compute acc values for a single thread.\n        for (int k = 0; k < TileInner; k++) {\n          for (int inner = 0; inner < ColPerThread; inner++) {\n            BCached[inner] = mm_Bsub[k][tileCol + inner];\n          }\n\n          for (int innerRow = 0; innerRow < RowPerThread; innerRow++) {\n            ACached = mm_Asub[tileRow + innerRow][k];\n            for (int innerCol = 0; innerCol < ColPerThread; innerCol++) {\n              acc[innerRow][innerCol] += ACached * BCached[innerCol];\n            }\n          }\n        }\n\n        barrier();\n      }\n\n      for (int innerRow = 0; innerRow < RowPerThread; innerRow++) {\n        for (int innerCol = 0; innerCol < ColPerThread; innerCol++) {\n\n          if ((globalCol + innerCol) < dimBOuter &&\n              (globalRow + innerRow) < dimAOuter) {\n            mm_write(globalRow + innerRow,\n                     globalCol + innerCol,\n                     acc[innerRow][innerCol]);\n          }\n        }\n      }\n    }\n  ";
}
function makeMatMulVectorSource() {
    return "\n    float mm_readA(int row, int col);\n    float mm_readB(int row, int col);\n    void mm_write(int row, int col, float value);\n    void mm_matMul(int dimAOuter, int dimInner, int dimBOuter);\n\n    const int TileSize = int(gl_WorkGroupSize.x) * 4;\n\n    shared vec4 mm_Asub[TileSize / 4];\n\n    void mm_matMul(int dimAOuter, int dimInner, int dimBOuter) {\n      int tileCol = int(gl_LocalInvocationID.x);\n      int globalCol = int(gl_GlobalInvocationID.x);\n      int globalRow = int(gl_GlobalInvocationID.y);\n\n      int numTiles = (dimInner - 1) / TileSize + 1;\n\n      // Without this initialization strange values show up in acc.\n      float acc = 0.0;\n\n      // Loop over shared dimension.\n      for (int t = 0; t < numTiles; t++) {\n        // Load one tile of A into local memory.\n        int colA = t * TileSize + tileCol * 4;\n        mm_Asub[tileCol] = vec4(mm_readA(globalRow, colA),\n                                mm_readA(globalRow, colA + 1),\n                                mm_readA(globalRow, colA + 2),\n                                mm_readA(globalRow, colA + 3));\n        barrier();\n\n        // Compute acc values for a single thread.\n        for (int k = 0; k < TileSize / 4; k++) {\n          int rowB = t * TileSize + k * 4;\n          vec4 BCached = vec4(mm_readB(rowB, globalCol),\n                              mm_readB(rowB + 1, globalCol),\n                              mm_readB(rowB + 2, globalCol),\n                              mm_readB(rowB + 3, globalCol));\n\n          vec4 ACached = mm_Asub[k];\n          acc += dot(ACached, BCached);\n        }\n\n        barrier();\n      }\n\n      if (globalRow < dimAOuter && globalCol < dimBOuter) {\n        mm_write(globalRow, globalCol, acc);\n      }\n    }\n  ";
}
var MatMulPackedProgram = /** @class */ (function () {
    function MatMulPackedProgram(aShape, outputShape, workPerThread, transposeA, transposeB, bias, activation, preluActivationWeights) {
        var _a;
        if (transposeA === void 0) { transposeA = false; }
        if (transposeB === void 0) { transposeB = false; }
        if (bias === void 0) { bias = null; }
        if (activation === void 0) { activation = null; }
        if (preluActivationWeights === void 0) { preluActivationWeights = null; }
        this.variableNames = ['A', 'B'];
        this.workGroupSize = [16, 16, 1];
        this.outputShape = outputShape;
        this.dispatchLayout = { x: [2], y: [1], z: [0] };
        var dimInner = transposeA ? aShape[1] : aShape[2];
        this.workGroupSize =
            computeWorkGroupSizeForMatMul(outputShape[1], dimInner, outputShape[2]);
        if (outputShape[1] === 1 || outputShape[2] === 1) {
            workPerThread = 1;
        }
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [workPerThread, workPerThread, 1]);
        // If dispaching number is one, it means only one work group is running.
        // For modern GPUs, it supports multiple work groups running in parallel.
        // So there may be some idle hardware threads.
        // In this case, we prefer to reduce the work per thread and improve the
        // thread utilization
        if (tf.util.arraysEqual(this.dispatch, [1, 1, 1])) {
            workPerThread = 1;
            this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [workPerThread, workPerThread, 1]);
        }
        var addBias = bias != null;
        var hasPreluActivationWeights = preluActivationWeights != null;
        if (addBias) {
            this.variableNames.push('bias');
        }
        if (hasPreluActivationWeights) {
            this.variableNames.push('preluActivationWeights');
        }
        this.workPerThread = workPerThread;
        this.aShape = aShape;
        this.transposeA = transposeA;
        this.transposeB = transposeB;
        this.addBias = addBias;
        this.activation = activation;
        this.hasPreluActivationWeights = hasPreluActivationWeights;
        var dimBOuter = this.outputShape[2];
        var bShape = this.transposeB ?
            [this.outputShape[0], dimBOuter, dimInner] :
            [this.outputShape[0], dimInner, dimBOuter];
        _a = this.getShapeFit(bShape), this.fitA = _a[0], this.fitB = _a[1];
        this.shaderKey =
            "matMulPacked_" + this.workPerThread + "_" + transposeA + "_" + transposeB + "_" + activation + "_" + this.fitA + "_" + this.fitB + "_" + (this.outputShape[1] > 1);
    }
    MatMulPackedProgram.prototype.getShapeFit = function (bShape) {
        var tileAOuter = this.workGroupSize[1] * this.workPerThread;
        var tileBOuter = this.workGroupSize[0] * this.workPerThread;
        var tileInner = tileAOuter > tileBOuter ? tileAOuter : tileBOuter;
        if (this.outputShape[1] === 1) {
            tileInner *=
                4; // for makeMatMulVectorSource, tileSize = gl_WorkGroupSize.x * 4.
        }
        tf.util.assert(tileInner % this.workGroupSize[0] === 0 &&
            tileInner % this.workGroupSize[1] === 0, function () { return "tileInner must be multiple of workgroupsize.x " +
            "and workgroupsize.y"; });
        var tileSizeA = [tileAOuter, tileInner];
        var tileSizeB = [tileInner, tileBOuter];
        return [
            tilesFitEvenlyIntoShape(tileSizeA, this.aShape.slice(1)),
            tilesFitEvenlyIntoShape(tileSizeB, bShape.slice(1))
        ];
    };
    MatMulPackedProgram.prototype.getUserCode = function () {
        var sampleA;
        if (this.transposeA === false) {
            sampleA = this.fitA ?
                "A[batch * batchASize + row * dimInner + col]" :
                "coordsInBounds(ivec2(row, col), ivec2(dimAOuter, dimInner)) ?\n            A[batch * batchASize + row * dimInner + col] : 0";
        }
        else {
            sampleA = this.fitA ?
                "A[batch * batchASize + col * dimAOuter + row]" :
                "coordsInBounds(ivec2(row, col), ivec2(dimAOuter, dimInner)) ?\n            A[batch* batchASize + col * dimAOuter + row] : 0";
        }
        var sampleB;
        if (this.transposeB === false) {
            sampleB = this.fitB ?
                "B[batch * batchBSize + row * dimBOuter + col]" :
                "coordsInBounds(ivec2(row, col), ivec2(dimInner, dimBOuter)) ?\n            B[batch * batchBSize + row * dimBOuter + col] : 0";
        }
        else {
            sampleB = this.fitB ?
                "B[batch * batchBSize + col * dimInner + row]" :
                "coordsInBounds(ivec2(row, col), ivec2(dimInner, dimBOuter)) ?\n            B[batch * batchBSize + col * dimInner + row] : 0";
        }
        var activationSnippet = '', applyActivationSnippet = '';
        if (this.activation) {
            if (this.hasPreluActivationWeights) {
                activationSnippet = "float activation(float a, ivec3 outCoord) {\n              float b = getPreluActivationWeightsAtOutCoords(outCoord);\n              " + this.activation + "\n            }";
            }
            else {
                activationSnippet = "\n              float activation(float a, ivec3 outCoord) {\n                " + this.activation + "\n              }\n            ";
            }
            applyActivationSnippet = 'value = activation(value, outCoord);';
        }
        var addBiasSnippet = this.addBias ? 'value += getBiasAtOutCoords(outCoord);' : '';
        var userCode = "\n      " + activationSnippet + "\n\n      int dimAOuter = " + (this.transposeA === true ? "aShape[2]" : "aShape[1]") + ";\n      int dimInner = " + (this.transposeA === true ? "aShape[1]" : "aShape[2]") + ";\n      int dimBOuter = " + (this.transposeB === true ? "bShape[1]" : "bShape[2]") + ";\n\n      int batch;\n\n      " + (this.outputShape[1] > 1 ?
            makeMatMulPackedSource([this.workPerThread, this.workPerThread, 1]) :
            makeMatMulVectorSource()) + "\n      float mm_readA(int row, int col) {\n        int batchASize = aShape[1] * aShape[2];\n        return " + sampleA + ";\n      }\n      float mm_readB(int row, int col) {\n        int batchBSize = bShape[1] * bShape[2];\n        return " + sampleB + ";\n      }\n      void mm_write(int row, int col, float value) {\n        ivec3 outCoord = ivec3(batch, row, col);\n        " + addBiasSnippet + "\n        " + applyActivationSnippet + "\n        setOutput(batch, row, col, value);\n      }\n      void main() {\n        batch = int(gl_GlobalInvocationID.z);\n        mm_matMul(dimAOuter, dimInner, dimBOuter);\n      }\n    ";
        return userCode;
    };
    return MatMulPackedProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function reshape(args) {
    var inputs = args.inputs, attrs = args.attrs;
    var x = inputs.x;
    var shape = attrs.shape;
    var xSize = tf.util.sizeFromShape(x.shape);
    var $shape = tf.util.inferFromImplicitShape(shape, xSize);
    var $xSize = tf.util.sizeFromShape($shape);
    tf.util.assert(xSize === $xSize, function () { return "The new shape (" + $shape + ") has " + $xSize + " elements and the old " +
        ("shape (" + x.shape + ") has " + xSize + " elements. The new shape and old ") +
        "shape must have the same number of elements."; });
    // Backend needs to track refCount for the dataId for reshape op
    args.backend.incRef(x.dataId);
    return { dataId: x.dataId, shape: $shape, dtype: x.dtype };
}
var reshapeConfig = {
    kernelName: tf.Reshape,
    backendName: 'webgpu',
    kernelFunc: reshape
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function batchMatMulImpl(_a) {
    var a = _a.a, b = _a.b, transposeA = _a.transposeA, transposeB = _a.transposeB, backend = _a.backend, _b = _a.bias, bias = _b === void 0 ? null : _b, _c = _a.preluActivationWeights, preluActivationWeights = _c === void 0 ? null : _c, _d = _a.leakyreluAlpha, _e = _a.activation, activation = _e === void 0 ? null : _e;
    var aRank = a.shape.length;
    var bRank = b.shape.length;
    var innerShapeA = transposeA ? a.shape[aRank - 2] : a.shape[aRank - 1];
    var innerShapeB = transposeB ? b.shape[bRank - 1] : b.shape[bRank - 2];
    var outerShapeA = transposeA ? a.shape[aRank - 1] : a.shape[aRank - 2];
    var outerShapeB = transposeB ? b.shape[bRank - 2] : b.shape[bRank - 1];
    var outerDimsA = a.shape.slice(0, -2);
    var outerDimsB = b.shape.slice(0, -2);
    var batchDimA = tf.util.sizeFromShape(outerDimsA);
    var batchDimB = tf.util.sizeFromShape(outerDimsB);
    var batchDimsCompatible = batchDimA === batchDimB || batchDimA === 1 || batchDimB === 1;
    tf.util.assert(aRank >= 2 && bRank >= 2 && batchDimsCompatible, function () { return "Error in matMul: the input batch dimensions must either be the " +
        "same or at least one input batch dimension must be 1. Got input " +
        ("batch dimensions of (" + outerDimsA + ") and (" + outerDimsB + ")."); });
    var outShapeOuterDims = batchDimA > batchDimB ? a.shape.slice(0, -2) : b.shape.slice(0, -2);
    var outShape = outShapeOuterDims.concat([outerShapeA, outerShapeB]);
    tf.util.assert(innerShapeA === innerShapeB, function () { return "Error in matMul: inner shapes (" + innerShapeA + ") and (" +
        (innerShapeB + ") of Tensors with shapes " + a.shape + " and ") +
        (b.shape + " and transposeA=" + transposeA) +
        (" and transposeB=" + transposeB + " must match."); });
    var a3dShape = transposeA ?
        [batchDimA, innerShapeA, outerShapeA] :
        [batchDimA, outerShapeA, innerShapeA];
    var b3dShape = transposeB ?
        [batchDimB, outerShapeB, innerShapeB] :
        [batchDimB, innerShapeB, outerShapeB];
    // The rest of the implementation is designed to operate on rank-3 tensors
    var a3d = reshape({ inputs: { x: a }, backend: backend, attrs: { shape: a3dShape } });
    var b3d = reshape({ inputs: { x: b }, backend: backend, attrs: { shape: b3dShape } });
    var intermediates = [a3d, b3d];
    var batchDim = Math.max(batchDimA, batchDimB);
    var useVec4 = a.shape[2] % 4 === 0 && b.shape[2] % 4 === 0 && !transposeA &&
        !transposeB && outerShapeB >= 32;
    var fusedActivation = activation ?
        backend.mapActivationToShaderProgram(activation, useVec4) :
        null;
    var program;
    if (useVec4) {
        // TODO: Currently we need to make sure that a.shape[2] and b.shape[2]
        // are divisible by 4 since we use vec4 to get data. In future, we can
        // remove this limitation by insert 0 to pack data.
        program = new MatMulPackedVec4Program(a3dShape, [batchDim, outerShapeA, outerShapeB], tf.env().get('WEBGPU_MATMUL_WORK_PER_THREAD'), bias, fusedActivation, preluActivationWeights);
    }
    else {
        program = new MatMulPackedProgram(a3dShape, [batchDim, outerShapeA, outerShapeB], tf.env().get('WEBGPU_MATMUL_WORK_PER_THREAD'), transposeA, transposeB, bias, fusedActivation, preluActivationWeights);
    }
    var inputs = [a3d, b3d];
    if (bias) {
        inputs.push(bias);
    }
    if (preluActivationWeights) {
        inputs.push(preluActivationWeights);
    }
    var out = backend.runWebGPUProgram(program, inputs, a.dtype);
    var outReshaped = reshape({ inputs: { x: out }, backend: backend, attrs: { shape: outShape } });
    intermediates.push(out);
    for (var _i = 0, intermediates_1 = intermediates; _i < intermediates_1.length; _i++) {
        var i = intermediates_1[_i];
        backend.disposeData(i.dataId);
    }
    return outReshaped;
}

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function _fusedMatMul(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var a = inputs.a, b = inputs.b, bias = inputs.bias, preluActivationWeights = inputs.preluActivationWeights;
    var transposeA = attrs.transposeA, transposeB = attrs.transposeB, activation = attrs.activation, leakyreluAlpha = attrs.leakyreluAlpha;
    return batchMatMulImpl({
        a: a,
        b: b,
        transposeA: transposeA,
        transposeB: transposeB,
        backend: backend,
        bias: bias,
        preluActivationWeights: preluActivationWeights,
        leakyreluAlpha: leakyreluAlpha,
        activation: activation
    });
}
var _fusedMatMulConfig = {
    kernelName: tf._FusedMatMul,
    backendName: 'webgpu',
    kernelFunc: _fusedMatMul,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// (Ar + Ai)(Br + Bi) =
// ArBr + ArBi + AiBr + AiBi = ArBr - AB + ArBi + AiBr
// Yr = ArBr - AB
// Yi = ArBi + AiBr
var COMPLEX_MULTIPLY = {
    REAL: 'return areal * breal - aimag * bimag;',
    IMAG: 'return areal * bimag + aimag * breal;'
};
var BinaryOpComplexProgram = /** @class */ (function () {
    function BinaryOpComplexProgram(op, aShape, bShape) {
        this.variableNames = ['AReal', 'AImag', 'BReal', 'BImag'];
        this.workGroupSize = [128, 1, 1];
        this.outputShape = tf.backend_util.assertAndGetBroadcastShape(aShape, bShape);
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        this.shaderKey = "binaryOpComplex_" + op;
        this.op = op;
        this.size = tf.util.sizeFromShape(this.outputShape);
    }
    BinaryOpComplexProgram.prototype.getUserCode = function () {
        var userCode = "\n      float binaryOpComplex(\n          float areal, float aimag, float breal, float bimag) {\n        " + this.op + "\n      }\n\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n        if(index < size) {\n          float areal = getARealAtOutCoords();\n          float aimag = getAImagAtOutCoords();\n          float breal = getBRealAtOutCoords();\n          float bimag = getBImagAtOutCoords();\n          setOutput(index, binaryOpComplex(areal, aimag, breal, bimag));\n        }\n      }\n    ";
        return userCode;
    };
    return BinaryOpComplexProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function getGlslDifferences() {
    var defineSpecialNaN = "\n      bool isnan_custom(float val) {\n        return (val > 0.0 || val < 0.0) ? false : val != 0.0;\n      }\n\n      bvec4 isnan_custom(vec4 val) {\n        return bvec4(isnan_custom(val.x),\n          isnan_custom(val.y), isnan_custom(val.z), isnan_custom(val.w));\n      }\n\n      #define isnan(value) isnan_custom(value)\n    ";
    return {
        defineSpecialNaN: defineSpecialNaN
    };
}

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// Generates GLSL that computes strides.
function symbolicallyComputeStrides(indicesArr, variableName) {
    if (Math.max.apply(Math, indicesArr) > 3) {
        throw new Error('Cannot symbolically compute strides for rank > 4 tensor.');
    }
    var numCoords = indicesArr.length;
    var shape = indicesArr.map(function (d) { return variableName + "[" + d + "]"; });
    var strides = new Array(numCoords - 1);
    strides[numCoords - 2] = shape[numCoords - 1];
    for (var i = numCoords - 3; i >= 0; --i) {
        strides[i] = "(" + strides[i + 1] + " * " + shape[i + 1] + ")";
    }
    return strides;
}

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
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
function mapToGlslTypes(type, isVec4) {
    if (type === 'float32') {
        return isVec4 ? 'vec4' : 'float';
    }
    else if (type === 'int32') {
        return isVec4 ? 'ivec4' : 'int';
    }
    else if (type === 'bool') {
        return isVec4 ? 'bvec4' : 'bool';
    }
    return type;
}
function makeShader(inputInfo, outputData, program, isFromPixel) {
    if (isFromPixel === void 0) { isFromPixel = false; }
    var outputBufferStr = "    layout(std430, set = 0, binding = 0) writeonly buffer ssbOut {\n      " + mapToGlslTypes(outputData.dtype, program.isVec4) + " result[];\n    };";
    if (isFromPixel === true) {
        var getCoords_1 = generateGetCoordsFromFlatIndex(outputData.shape);
        return [
            SHADER_PREFIX, outputBufferStr, program.getUserCode(), getCoords_1
        ].join('\n');
    }
    var prefixSnippets = [];
    if (program.workGroupSize != null) {
        prefixSnippets.push("\n      layout (local_size_x = " + program.workGroupSize[0] + ",\n              local_size_y = " + program.workGroupSize[1] + ",\n              local_size_z = " + program.workGroupSize[2] + ") in;\n    ");
    }
    // Output buffer.
    prefixSnippets.push("\n    layout(std430, set = 0, binding = 0) writeonly buffer ssbOut {\n      " + mapToGlslTypes(outputData.dtype, program.isVec4) + " result[];\n    };\n  ");
    program.variableNames.forEach(function (x, i) {
        prefixSnippets.push("\n      layout(std430, set = 0, binding = " + (1 + i) + ") readonly buffer ssb" + x + " {\n        " + mapToGlslTypes(inputInfo[i].dtype, program.isVec4) + " " + x + "[];\n      };\n    ");
    });
    var uniformDeclaration = 'float NAN; ';
    program.variableNames.forEach(function (x, i) {
        uniformDeclaration += getCoordsDataType(inputInfo[i].shape.length) + " " + (x.charAt(0).toLowerCase() + x.slice(1)) + "Shape; ";
    });
    uniformDeclaration +=
        getCoordsDataType(outputData.shape.length) + " outShape; ";
    var stridesLength = outputData.shape.length - 1;
    uniformDeclaration += getCoordsDataType(stridesLength) + " outShapeStrides; ";
    if (program.size != null) {
        uniformDeclaration += 'int size; ';
    }
    if (program.uniforms) {
        uniformDeclaration += program.uniforms;
    }
    if (uniformDeclaration !== '') {
        prefixSnippets.push("\n        layout(std140, set = 0, binding = " + (1 + program.variableNames.length) + ") uniform Uniforms {\n            " + uniformDeclaration + "\n        };\n    ");
    }
    prefixSnippets.push(getGlslDifferences().defineSpecialNaN);
    var _a = generateGetOutputCoords(outputData.shape, program.dispatchLayout), getOutputCoords = _a[0], dispatchLayoutRank = _a[1];
    var getCoords = generateGetCoordsFromFlatIndex(outputData.shape);
    var sources = [
        SHADER_PREFIX, prefixSnippets.join('\n'), SAMPLING_SNIPPETS, getCoords,
        getOutputCoords,
        getSetOutputSnippet(outputData.shape, outputData.dtype, program.isVec4)
    ];
    if (dispatchLayoutRank === outputData.shape.length) {
        // Input sampling snippet is only meaningful when the output isn't getting
        // implicitly reshaped (like it does in conv2d_matmul).
        var inputSamplingSnippet = inputInfo
            .map(function (x) { return getInputSamplingSnippet(x, outputData.shape, program.isVec4, program.dispatchLayout.x.length ===
            outputData.shape.length); })
            .join('\n');
        sources.push(inputSamplingSnippet);
    }
    sources.push(program.getUserCode());
    var source = sources.join('\n');
    return source;
}
var SHADER_PREFIX = "#version 450\n\n  int idiv(int a, int b, float sign) {\n    int res = a / b;\n    int mod = a % b;\n    if (sign < 0. && mod != 0) {\n      res -= 1;\n    }\n    return res;\n  }\n\n  // Checks whether coordinates lie within the bounds of the shape.\n  bool coordsInBounds(ivec4 coord, ivec4 shape) {\n    return all(greaterThanEqual(coord, ivec4(0))) &&\n        all(lessThan(coord, shape));\n  }\n\n  bool coordsInBounds(ivec3 coord, ivec3 shape) {\n    return all(greaterThanEqual(coord, ivec3(0))) &&\n        all(lessThan(coord, shape));\n  }\n\n  bool coordsInBounds(ivec2 coord, ivec2 shape) {\n    return all(greaterThanEqual(coord, ivec2(0))) &&\n        all(lessThan(coord, shape));\n  }\n";
var SAMPLING_SNIPPETS = "\n  int getFlatIndex(int coord, int shape) {\n    return coord;\n  }\n\n  int getFlatIndex(ivec2 coords, ivec2 shape) {\n    return int(dot(coords, ivec2(shape.y, 1.)));\n  }\n\n  int getFlatIndex(ivec3 coords, ivec3 shape) {\n    return int(dot(coords, ivec3(shape.y * shape.z, shape.z, 1.)));\n  }\n\n  int getFlatIndex(ivec4 coords, ivec4 shape) {\n    return int(dot(coords, ivec4(\n      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1.)));\n  }\n";
function getSetOutputSnippet(outShape, outBufferType, isVec4) {
    var outRank = outShape.length;
    var glslType = mapToGlslTypes(outBufferType, isVec4);
    var snippet;
    if (isVec4) {
        snippet = "void setOutput(int flatIndex, vec4 value) {\n      result[flatIndex] = " + (glslType === 'ivec4' ?
            'ivec4(value)' :
            (glslType === 'bvec4' ? 'bvec4(value)' : 'value')) + ";\n    }\n    void setOutput(int flatIndex, ivec4 value) {\n      result[flatIndex] = " + (glslType === 'vec4' ?
            'vec4(value)' :
            (glslType === 'bvec4' ? 'bvec4(value)' : 'value')) + ";\n    }";
    }
    else {
        snippet = "void setOutput(int flatIndex, float value) {\n      result[flatIndex] = " + (glslType === 'int' ? 'int(value)' :
            (glslType === 'bool' ? 'bool(value)' : 'value')) + ";\n    }\n    void setOutput(int flatIndex, int value) {\n      result[flatIndex] = " + (glslType === 'float' ?
            'float(value)' :
            (glslType === 'bool' ? 'bool(value)' : 'value')) + ";\n    }";
    }
    if (outRank >= 2) {
        switch (outRank) {
            case 2:
                snippet += "\n        int getOutputFlatIndex(ivec2 coords) {\n          return int(dot(coords, ivec2(outShapeStrides, 1)));\n        }\n        ";
                break;
            case 3:
                snippet += "\n        int getOutputFlatIndex(ivec3 coords) {\n          return int(dot(coords, ivec3(outShapeStrides.x, outShapeStrides.y, 1)));\n        }\n        ";
                break;
            case 4:
                snippet += "\n        int getOutputFlatIndex(ivec4 coords) {\n          return int(dot(coords, ivec4(\n            outShapeStrides.x, outShapeStrides.y, outShapeStrides.z, 1)));\n        }\n        ";
                break;
            default:
                tf.util.assert(false, function () { return "Unsupported " + outRank + "D shape"; });
                break;
        }
        var dims = ['d0', 'd1', 'd2', 'd3'].slice(0, outRank);
        var type = getCoordsDataType(outRank);
        if (isVec4) {
            snippet += "\n      void setOutput(" + dims.map(function (d) { return "int " + d; }).join(', ') + ", vec4 value) {\n        int flatIndex = getOutputFlatIndex(" + type + "(" + dims.join(', ') + "));\n        setOutput(flatIndex / 4, value);\n      }\n      void setOutput(" + dims.map(function (d) { return "int " + d; }).join(', ') + ", ivec4 value) {\n        int flatIndex = getOutputFlatIndex(" + type + "(" + dims.join(', ') + "));\n        setOutput(flatIndex / 4, value);\n      }\n    ";
        }
        else {
            snippet += "\n      void setOutput(" + dims.map(function (d) { return "int " + d; }).join(', ') + ", float value) {\n        int flatIndex = getOutputFlatIndex(" + type + "(" + dims.join(', ') + "));\n        setOutput(flatIndex, value);\n      }\n      void setOutput(" + dims.map(function (d) { return "int " + d; }).join(', ') + ", int value) {\n        int flatIndex = getOutputFlatIndex(" + type + "(" + dims.join(', ') + "));\n        setOutput(flatIndex, value);\n      }\n    ";
        }
    }
    return snippet;
}
function getInputSamplingSnippet(inInfo, outShape, isVec4, isFlatDispatchLayout) {
    var res = getSamplerFromInInfo(inInfo, isVec4);
    var inShape = inInfo.shape;
    if (inShape.length <= outShape.length) {
        res += getSamplerAtOutputCoords(inInfo, outShape, isVec4, isFlatDispatchLayout);
    }
    return res;
}
function getSamplerFromInInfo(inInfo, isVec4) {
    var texName = inInfo.name;
    var rank = inInfo.shape.length;
    var type = getCoordsDataType(rank);
    var funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    var dims = ['d0', 'd1', 'd2', 'd3'].slice(0, rank);
    var inputs = dims.map(function (d) { return "int " + d; }).join(', ');
    if (rank < 1) {
        if (isVec4) {
            return "\n        vec4 " + funcName + "() {\n          return vec4(" + texName + "[0]);\n        }\n      ";
        }
        return "\n      float " + funcName + "() {\n        return float(" + texName + "[0]);\n      }\n    ";
    }
    var shapeStr = texName.charAt(0).toLowerCase() + texName.slice(1) + "Shape";
    if (isVec4) {
        return "\n      vec4 " + funcName + "(" + inputs + ") {\n        return vec4(" + texName + "[getFlatIndex(" + type + "(" + dims.join(',') + "),\n          " + shapeStr + ") / 4]);\n      }\n      ";
    }
    return "\n    float " + funcName + "(" + inputs + ") {\n      return float(" + texName + "[getFlatIndex(" + type + "(" + dims.join(',') + "),\n        " + shapeStr + ")]);\n    }\n   ";
}
function getSamplerAtOutputCoords(inInfo, outShape, isVec4, isFlatDispatchLayout) {
    var texName = inInfo.name;
    var texFuncSnippet = texName.charAt(0).toUpperCase() + texName.slice(1);
    var funcName = 'get' + texFuncSnippet + 'AtOutCoords';
    var inRank = inInfo.shape.length;
    var outRank = outShape.length;
    var type = getCoordsDataType(outRank);
    // If the inShape equals the outShape and the dispatch layout is flat, we can
    // directly use |gl_GlobalInvocationID.x| as the index and don't need coords
    // conversion between these two shapes.
    if (tf.util.arraysEqual(inInfo.shape, outShape) && isFlatDispatchLayout) {
        if (isVec4) {
            return "\n        vec4 " + funcName + "() {\n          return vec4(" + texName + "[gl_GlobalInvocationID.x]);\n        }\n\n        vec4 " + funcName + "(" + type + " coords) {\n          return vec4(" + texName + "[" + (outRank > 1 ? 'getOutputFlatIndex(coords)' : 'coords') + " / 4]);\n        }\n        ";
        }
        else {
            return "\n      float " + funcName + "() {\n        return float(" + texName + "[gl_GlobalInvocationID.x]);\n      }\n\n      float " + funcName + "(" + type + " coords) {\n        return float(" + texName + "[" + (outRank > 1 ? 'getOutputFlatIndex(coords)' : 'coords') + "]);\n      }\n      ";
        }
    }
    var broadcastDims = tf.backend_util.getBroadcastDims(inInfo.shape, outShape);
    var rankDiff = outRank - inRank;
    var coordsSnippet = '';
    if (inRank === 0) {
        if (isVec4) {
            return "\n      vec4 " + funcName + "() {\n        return get" + texFuncSnippet + "();\n      }\n\n      vec4 " + funcName + "(" + type + " coords) {\n        return get" + texFuncSnippet + "();\n      }\n    ";
        }
        return "\n      float " + funcName + "() {\n        return get" + texFuncSnippet + "();\n      }\n\n      float " + funcName + "(" + type + " coords) {\n        return get" + texFuncSnippet + "();\n      }\n    ";
    }
    else {
        if (outRank < 2 && broadcastDims.length >= 1) {
            coordsSnippet = 'coords = 0;';
        }
        else {
            coordsSnippet =
                broadcastDims.map(function (d) { return "coords[" + (d + rankDiff) + "] = 0;"; }).join('\n');
        }
    }
    var unpackedCoordsSnippet = '';
    if (outRank < 2 && inRank > 0) {
        unpackedCoordsSnippet = 'coords';
    }
    else {
        if (outRank > 1) {
            var coordsType = getCoordsDataType(inRank);
            var coordsValues = inInfo.shape.map(function (s, i) { return "coords[" + (i + rankDiff) + "]"; }).join(', ');
            unpackedCoordsSnippet = coordsType + "(" + coordsValues + ")";
        }
        else {
            unpackedCoordsSnippet = 'coords';
        }
    }
    var shapeStr = texName.charAt(0).toLowerCase() + texName.slice(1) + "Shape";
    if (isVec4) {
        return "\n      vec4 " + funcName + "() {\n        " + type + " coords = getOutputCoords();\n        " + coordsSnippet + "\n        return " + texName + "[getFlatIndex(" + unpackedCoordsSnippet + ", " + shapeStr + ") / 4];\n      }\n\n      vec4 " + funcName + "(" + type + " coords) {\n        " + coordsSnippet + "\n        return " + texName + "[getFlatIndex(" + unpackedCoordsSnippet + ", " + shapeStr + ") / 4];\n      }\n    ";
    }
    return "\n    float " + funcName + "() {\n      " + type + " coords = getOutputCoords();\n      " + coordsSnippet + "\n      return float(" + texName + "[getFlatIndex(" + unpackedCoordsSnippet + ", " + shapeStr + ")]);\n    }\n\n    float " + funcName + "(" + type + " coords) {\n      " + coordsSnippet + "\n      return float(" + texName + "[getFlatIndex(" + unpackedCoordsSnippet + ", " + shapeStr + ")]);\n    }\n  ";
}
/**
 * Generates getOutputCoords() function that computes output coordinates from
 * dispatch geometry to reduce arithmetic.
 */
function generateGetOutputCoords(outShape, dispatchLayout) {
    var x = dispatchLayout.x, _a = dispatchLayout.y, y = _a === void 0 ? [] : _a, _b = dispatchLayout.z, z = _b === void 0 ? [] : _b;
    var outRank = outShape.length;
    if (x.length === outRank) {
        var dtype_1 = getCoordsDataType(outRank);
        var snippet_1 = dtype_1 + " getOutputCoords() {\n      return getCoordsFromFlatIndex(int(gl_GlobalInvocationID.x));\n    }\n    ";
        return [snippet_1, outRank];
    }
    var gatherDimensionsStr = '';
    var dims = [x, y, z];
    var rank = 0;
    for (var i = 0; i < dims.length; i++) {
        var arr = dims[i];
        if (arr.length === 0) {
            continue;
        }
        rank += arr.length;
        if (arr.length === 1) {
            gatherDimensionsStr += "int d" + arr[0] + " =\n        int(gl_GlobalInvocationID[" + i + "]);";
        }
        else {
            var strides = symbolicallyComputeStrides(arr, 'outShape');
            gatherDimensionsStr += "int index" + i + " =\n          int(gl_GlobalInvocationID[" + i + "]);";
            for (var j = 0; j < strides.length; j++) {
                gatherDimensionsStr += "int d" + arr[j] + " = index" + i + " / " + strides[j] + ";";
                if (j === strides.length - 1) {
                    gatherDimensionsStr += "int d" + arr[j + 1] + " = " +
                        ("index" + i + " - d" + arr[j] + " * " + strides[j] + ";");
                }
                else {
                    gatherDimensionsStr += "index" + i + " -= d" + arr[j] + " * " + strides[j] + ";";
                }
            }
        }
    }
    var dimensions = [];
    for (var i = 0; i < rank; i++) {
        dimensions.push("d" + i);
    }
    var dtype = getCoordsDataType(rank);
    var snippet = dtype + " getOutputCoords() {\n    " + gatherDimensionsStr + "\n  ";
    if (dimensions.length === 0) {
        snippet += "return " + dtype + "(0);}";
    }
    else {
        snippet += "return " + dtype + "(" + dimensions.join(',') + ");}";
    }
    return [snippet, rank];
}
/**
 * Derives logical coordinates from a flat index. Performs integer division
 * with each stride and decrements the index until the index equals the final
 * dimension coordinate.
 */
function generateGetCoordsFromFlatIndex(shape) {
    var rank = shape.length;
    if (rank <= 1) {
        return "int getCoordsFromFlatIndex(int index) {return index; }";
    }
    var strides = tf.util.computeStrides(shape);
    var dtype = getCoordsDataType(rank);
    var coords = [];
    for (var i = 0; i < rank; i++) {
        coords.push("d" + i);
    }
    if (strides.length === 1) {
        return "    ivec2 getCoordsFromFlatIndex(int index) {\n      int d0 = index / outShapeStrides; int d1 = index - d0 * outShapeStrides;\n      return ivec2(d0,d1);\n    }";
    }
    var snippet = strides
        .map(function (_, i) {
        var line1 = "int " + coords[i] + " = index / outShapeStrides[" + i + "]";
        var line2 = i === strides.length - 1 ?
            "int " + coords[i + 1] + " = index - " + coords[i] + " * outShapeStrides[" + i + "]" :
            "index -= " + coords[i] + " * outShapeStrides[" + i + "]";
        return line1 + "; " + line2 + ";";
    })
        .join('');
    return "\n    " + dtype + " getCoordsFromFlatIndex(int index) {\n      " + snippet + "\n      return " + dtype + "(" + coords.join(',') + ");\n    }\n  ";
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var BinaryOpSharedProgram = /** @class */ (function () {
    function BinaryOpSharedProgram(op, aShape, bShape, useSharedMemoryWithB) {
        this.variableNames = ['A', 'B'];
        // This is an experimental value when using shared memory.
        var workGroupSizeX = 512;
        this.workGroupSize = [workGroupSizeX, 1, 1];
        this.outputShape = tf.backend_util.assertAndGetBroadcastShape(aShape, bShape);
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.lastDimensionSize = useSharedMemoryWithB ? bShape[0] : aShape[0];
        if (this.lastDimensionSize < 512) {
            this.workPerThread = 1;
        }
        else if (this.lastDimensionSize < 1024) {
            this.workPerThread = 2;
        }
        else {
            this.workPerThread = 4;
        }
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [this.workPerThread, 1, 1]);
        this.useSharedMemoryWithB = useSharedMemoryWithB;
        this.op = op;
        this.size = tf.util.sizeFromShape(this.outputShape);
        this.sizeFit =
            this.size % (this.workGroupSize[0] * this.workPerThread) === 0;
        // this.lastDimensionSize is used as sharedBuf array size, so can not be
        // used as uniform.
        this.shaderKey = "binaryShared_" + op + "_" + this.lastDimensionSize + "_" + this.useSharedMemoryWithB + "_" + this.sizeFit;
    }
    BinaryOpSharedProgram.prototype.getUserCode = function () {
        var type = getCoordsDataType(this.outputShape.length);
        var sharedIndexSnippet = this.lastDimensionSize > 1 ?
            "coords[" + (this.outputShape.length - 1) + "]" :
            '0';
        var accessDataSnippet = this.useSharedMemoryWithB ?
            "float a = getAAtOutCoords(coords);\n         float b = sharedBuf[" + sharedIndexSnippet + "];" :
            "float a = sharedBuf[" + sharedIndexSnippet + "];\n         float b = getBAtOutCoords(coords);";
        var writeDataSnippet = this.sizeFit ?
            type + " coords = getCoordsFromFlatIndex(flatIndex);\n\n         " + accessDataSnippet + "\n         setOutput(flatIndex, binaryOperation(a, b));" :
            "if(flatIndex < size) {\n            " + type + " coords = getCoordsFromFlatIndex(flatIndex);\n\n            " + accessDataSnippet + "\n            setOutput(flatIndex, binaryOperation(a, b));\n          }";
        var userCode = "\n        float binaryOperation(float a, float b) {\n          " + this.op + "\n        }\n\n        shared float sharedBuf[" + this.lastDimensionSize + "];\n        void main() {\n          int index = int(gl_GlobalInvocationID.x);\n          int localIndex = int(gl_LocalInvocationIndex);\n\n          // Fill in the shared memory buffer. Here we need a loop to make sure\n          // that all data in A|B are uploaded when |sharedMemorySize| is larger\n          // than work group size.\n          while(localIndex < " + this.lastDimensionSize + ")\n          {\n            sharedBuf[localIndex] = " + (this.useSharedMemoryWithB ? 'B' : 'A') + "[localIndex];\n            localIndex += int(gl_WorkGroupSize.x);\n          }\n          barrier();\n\n          for(int i = 0; i < " + this.workPerThread + "; i++) {\n            int flatIndex = index * " + this.workPerThread + " + i;\n\n            " + writeDataSnippet + "\n          }\n        }\n        ";
        return userCode;
    };
    return BinaryOpSharedProgram;
}());

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var BinaryOpVec4Program = /** @class */ (function () {
    function BinaryOpVec4Program(op, aShape, bShape) {
        this.variableNames = ['A', 'B'];
        this.workPerThread = 4;
        this.isVec4 = true;
        // TODO(jiajia.qin@intel.com): Heuristically select a good work group size.
        var workGroupSizeX = 128;
        this.workGroupSize = [workGroupSizeX, 1, 1];
        this.outputShape = tf.backend_util.assertAndGetBroadcastShape(aShape, bShape);
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [this.workPerThread, 1, 1]);
        this.op = op;
        this.fitShape = this.size % this.workGroupSize[0] === 0;
        this.shaderKey = "binaryVec4_" + op + "_" + this.fitShape;
        this.size = tf.util.sizeFromShape(this.outputShape) / this.workPerThread;
    }
    BinaryOpVec4Program.prototype.getUserCode = function () {
        var userCode;
        if (this.fitShape) {
            userCode = "\n      vec4 binaryOperation(vec4 a, vec4 b) {\n        " + this.op + "\n      }\n\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n        vec4 a = vec4(A[index]);\n        vec4 b = vec4(B[index]);\n        setOutput(index, binaryOperation(a, b));\n      }\n    ";
        }
        else {
            userCode = "\n      vec4 binaryOperation(vec4 a, vec4 b) {\n        " + this.op + "\n      }\n\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n        if (index < size)\n        {\n          vec4 a = vec4(A[index]);\n          vec4 b = vec4(B[index]);\n          setOutput(index, binaryOperation(a, b));\n        }\n      }\n    ";
        }
        return userCode;
    };
    return BinaryOpVec4Program;
}());

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var BinaryOpProgram = /** @class */ (function () {
    function BinaryOpProgram(op, aShape, bShape) {
        this.variableNames = ['A', 'B'];
        // TODO(jiajia.qin@intel.com): Heuristically select a good work group size.
        var workGroupSizeX = 128;
        this.workGroupSize = [workGroupSizeX, 1, 1];
        this.outputShape = tf.backend_util.assertAndGetBroadcastShape(aShape, bShape);
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.size = tf.util.sizeFromShape(this.outputShape);
        this.sizeFit = this.size % workGroupSizeX === 0;
        this.shapesFit = tf.util.arraysEqual(aShape, bShape) && this.sizeFit;
        this.workPerThread = this.sizeFit || this.shapesFit ? 1 : 2;
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [this.workPerThread, 1, 1]);
        this.shaderKey = "binary_" + op + "_" + this.sizeFit + "_" + this.shapesFit;
        this.op = op;
    }
    BinaryOpProgram.prototype.getUserCode = function () {
        var userCode;
        if (this.shapesFit) {
            userCode = "\n          float binaryOperation(float a, float b) {\n            " + this.op + "\n          }\n\n          void main() {\n            int index = int(gl_GlobalInvocationID.x);\n\n            float a = float(A[index]);\n            float b = float(B[index]);\n            setOutput(index, binaryOperation(a, b));\n          }\n        ";
        }
        else if (this.sizeFit) {
            var type = getCoordsDataType(this.outputShape.length);
            userCode = "\n      float binaryOperation(float a, float b) {\n        " + this.op + "\n      }\n\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n\n        " + type + " coords = getCoordsFromFlatIndex(index);\n\n        float a = getAAtOutCoords(coords);\n        float b = getBAtOutCoords(coords);\n        setOutput(index, binaryOperation(a, b));\n      }\n      ";
        }
        else {
            var type = getCoordsDataType(this.outputShape.length);
            userCode = "\n      float binaryOperation(float a, float b) {\n        " + this.op + "\n      }\n\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n\n        for(int i = 0; i < " + this.workPerThread + "; i++) {\n          int flatIndex = index * " + this.workPerThread + " + i;\n\n          if(flatIndex < size) {\n            " + type + " coords = getCoordsFromFlatIndex(flatIndex);\n\n            float a = getAAtOutCoords(coords);\n            float b = getBAtOutCoords(coords);\n            setOutput(flatIndex, binaryOperation(a, b));\n          }\n        }\n      }\n      ";
        }
        return userCode;
    };
    return BinaryOpProgram;
}());

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var BinaryOpType;
(function (BinaryOpType) {
    BinaryOpType[BinaryOpType["MUL"] = 0] = "MUL";
    BinaryOpType[BinaryOpType["ADD"] = 1] = "ADD";
    BinaryOpType[BinaryOpType["SUB"] = 2] = "SUB";
    BinaryOpType[BinaryOpType["DIV"] = 3] = "DIV";
    BinaryOpType[BinaryOpType["EQUAL"] = 4] = "EQUAL";
    BinaryOpType[BinaryOpType["GREATER"] = 5] = "GREATER";
    BinaryOpType[BinaryOpType["GREATER_EQUAL"] = 6] = "GREATER_EQUAL";
    BinaryOpType[BinaryOpType["LESS"] = 7] = "LESS";
    BinaryOpType[BinaryOpType["LESS_EQUAL"] = 8] = "LESS_EQUAL";
    BinaryOpType[BinaryOpType["LOGICAL_AND"] = 9] = "LOGICAL_AND";
    BinaryOpType[BinaryOpType["NOT_EQUAL"] = 10] = "NOT_EQUAL";
    BinaryOpType[BinaryOpType["SQUARED_DIFFERENCE"] = 11] = "SQUARED_DIFFERENCE";
    BinaryOpType[BinaryOpType["INT_DIV"] = 12] = "INT_DIV";
    BinaryOpType[BinaryOpType["POW"] = 13] = "POW";
    BinaryOpType[BinaryOpType["PRELU"] = 14] = "PRELU";
    BinaryOpType[BinaryOpType["MAX"] = 15] = "MAX";
    BinaryOpType[BinaryOpType["MIN"] = 16] = "MIN";
})(BinaryOpType || (BinaryOpType = {}));
var CHECK_NAN_SNIPPET = "\nif (isnan(a)) return a;\nif (isnan(b)) return b;\n";
var CHECK_NAN_SNIPPET_VEC4 = "\nresult.r = isNaN.r > 0. ? NAN : result.r;\nresult.g = isNaN.g > 0. ? NAN : result.g;\nresult.b = isNaN.b > 0. ? NAN : result.b;\nresult.a = isNaN.a > 0. ? NAN : result.a;\n";
function getMinMaxString(op, useVec4) {
    var checkNanSnippet = useVec4 ? CHECK_NAN_SNIPPET_VEC4 : CHECK_NAN_SNIPPET;
    return useVec4 ? "\n  vec4 result = vec4(" + op + "(a, b));\n  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));\n  " + checkNanSnippet +
        "\n  return result;\n" :
        checkNanSnippet + ("\n  return " + op + "(a, b);\n");
}
function getBinaryOpString(type, useVec4) {
    switch (type) {
        case BinaryOpType.MUL:
            return 'return a * b;';
        case BinaryOpType.ADD:
            return 'return a + b;';
        case BinaryOpType.SUB:
            return 'return a - b;';
        case BinaryOpType.DIV:
            return 'return a / b;';
        case BinaryOpType.EQUAL:
            return useVec4 ? 'return vec4(equal(a, b));' : 'return float(a == b);';
        case BinaryOpType.GREATER:
            return useVec4 ? 'return vec4(greaterThan(a, b));' :
                'return float(a > b);';
        case BinaryOpType.GREATER_EQUAL:
            return useVec4 ? 'return vec4(greaterThanEqual(a, b));' :
                'return float(a >= b);';
        case BinaryOpType.LESS:
            return useVec4 ? 'return vec4(lessThan(a, b));' : 'return float(a < b);';
        case BinaryOpType.LESS_EQUAL:
            return useVec4 ? 'return vec4(lessThanEqual(a, b));' :
                'return float(a <= b);';
        case BinaryOpType.LOGICAL_AND:
            return useVec4 ? "return vec4(\n      vec4(greaterThanEqual(a, vec4(1.0))) *\n      vec4(greaterThanEqual(b, vec4(1.0))));" :
                'return float(float(a) >= 1.0 && float(b) >= 1.0);';
        case BinaryOpType.NOT_EQUAL:
            return useVec4 ? 'return vec4(notEqual(a, b));' : 'return float(a != b);';
        case BinaryOpType.SQUARED_DIFFERENCE:
            return 'return (a - b) * (a - b);';
        case BinaryOpType.INT_DIV:
            return useVec4 ? "\n      ivec4 ia = round(a);\n      ivec4 ib = round(b);\n      bvec4 cond = notEqual(ib, ivec4(0));\n      ivec4 result = ivec4(0);\n      vec4 s = sign(a) * sign(b);\n\n      // Windows (D3D) wants guaranteed non-zero int division at compile-time.\n      if (cond[0]) {\n        result[0] = idiv(ia[0], ib[0], s[0]);\n      }\n      if (cond[1]) {\n        result[1] = idiv(ia[1], ib[1], s[1]);\n      }\n      if (cond[2]) {\n        result[2] = idiv(ia[2], ib[2], s[2]);\n      }\n      if (cond[3]) {\n        result[3] = idiv(ia[3], ib[3], s[3]);\n      }\n      return vec4(result);\n    " :
                "\n    float s = sign(a) * sign(b);\n    int ia = int(round(a));\n    int ib = int(round(b));\n    return float(idiv(ia, ib, s));\n  ";
        case BinaryOpType.PRELU:
            return useVec4 ? "\n      vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));\n      return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);\n    " :
                'return (a < 0.) ? b * a : a;';
        case BinaryOpType.MAX:
            return getMinMaxString('max', useVec4);
        case BinaryOpType.MIN:
            return getMinMaxString('min', useVec4);
        case BinaryOpType.POW:
            return useVec4 ? "\n      // isModRound1 has 1 for components with round(mod(b, 2.0)) == 1, 0 otherwise.\n      vec4 isModRound1 = vec4(equal(round(mod(b, 2.0)), ivec4(1)));\n      vec4 multiplier = sign(a) * isModRound1 + (vec4(1.0) - isModRound1);\n      vec4 result = multiplier * pow(abs(a), b);\n\n      // Ensure that a^0 = 1, including 0^0 = 1 as this correspond to TF and JS\n      bvec4 isExpZero = equal(b, vec4(0.0));\n      result.r = isExpZero.r ? 1.0 : result.r;\n      result.g = isExpZero.g ? 1.0 : result.g;\n      result.b = isExpZero.b ? 1.0 : result.b;\n      result.a = isExpZero.a ? 1.0 : result.a;\n\n      vec4 isNaN = vec4(lessThan(a, vec4(0.0))) * vec4(lessThan(floor(b), b));\n      " + CHECK_NAN_SNIPPET_VEC4 + "\n      return result;\n    " :
                "\n    if(a < 0.0 && floor(b) < b){\n      return NAN;\n    }\n    if (b == 0.0) {\n      return 1.0;\n    }\n    return (round(mod(b, 2.0)) != 1) ?\n        pow(abs(a), b) : sign(a) * pow(abs(a), b);\n  ";
        default:
            throw new Error("BinaryType " + type + " is not implemented!");
    }
}
function getBinaryProgram(op, aShape, bShape) {
    var useVec4 = tf.util.arraysEqual(aShape, bShape) && tf.util.sizeFromShape(aShape) % 4 === 0;
    var opStr = getBinaryOpString(op, useVec4);
    if (useVec4) {
        return new BinaryOpVec4Program(opStr, aShape, bShape);
    }
    var useSharedMemoryWithA = aShape.length === 1 && bShape.length > 1 && aShape[0] < 2048;
    var useSharedMemoryWithB = bShape.length === 1 && aShape.length > 1 && bShape[0] < 2048;
    if (useSharedMemoryWithA || useSharedMemoryWithB) {
        return new BinaryOpSharedProgram(opStr, aShape, bShape, useSharedMemoryWithB);
    }
    else {
        return new BinaryOpProgram(opStr, aShape, bShape);
    }
}

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function identity(args) {
    var inputs = args.inputs;
    var x = inputs.x;
    args.backend.incRef(x.dataId);
    return { dataId: x.dataId, shape: x.shape, dtype: x.dtype };
}
var identityConfig = {
    kernelName: tf.Identity,
    backendName: 'webgpu',
    kernelFunc: identity
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Complex tensors share data with their real and imaginary components. Complex
 * tensors' reference to the components is tracked by refCount on the individual
 * component. The refCounts are increased by the identity call.
 *
 * When a complex tensor is disposed, it will reduce the refCount on the
 * components by calling disposeData on each.
 */
function complex(args) {
    var inputs = args.inputs, backend = args.backend;
    var real = inputs.real, imag = inputs.imag;
    var complexInfo = backend.makeTensorInfo(real.shape, 'complex64');
    var complex = backend.tensorMap.get(complexInfo.dataId);
    var realTensorInfo = identity({ inputs: { x: real }, backend: backend });
    var imagTensorInfo = identity({ inputs: { x: imag }, backend: backend });
    complex.complexTensorInfos = { real: realTensorInfo, imag: imagTensorInfo };
    return complexInfo;
}
var complexConfig = {
    kernelName: tf.Complex,
    backendName: 'webgpu',
    kernelFunc: complex
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var RELU = 'return max(a, 0.0);';
var RELU6 = 'return clamp(a, 0.0, 6.0);';
var LINEAR = "return a;";
var ELU = "return (a >= 0.0) ? a : (exp(a) - 1.0);";
var ELU_VEC4 = "\n  vec4 result;\n\n  result.r = (a.r >= 0.0) ? a.r : (exp(a.r) - 1.0);\n  result.g = (a.g >= 0.0) ? a.g : (exp(a.g) - 1.0);\n  result.b = (a.b >= 0.0) ? a.b : (exp(a.b) - 1.0);\n  result.a = (a.a >= 0.0) ? a.a : (exp(a.a) - 1.0);\n\n  return result;\n";
var RELU_VEC4 = "\n  vec4 result = a * vec4(greaterThanEqual(a, vec4(0.0)));\n  bvec4 isNaN = isnan(a);\n\n  result.r = isNaN.r ? a.r : result.r;\n  result.g = isNaN.g ? a.g : result.g;\n  result.b = isNaN.b ? a.b : result.b;\n  result.a = isNaN.a ? a.a : result.a;\n\n  return result;\n";
var SIGMOID = "return 1.0 / (1.0 + exp(-1.0 * a));";
var ABS = "return abs(a);";
var SQUARE = "return a * a;";
var NEG = "return -a;";
var TANH = "\n  float e2x = exp(-2.0 * abs(a));\n  return sign(a) * (1.0 - e2x) / (1.0 + e2x);\n";
var EXP = "return exp(a);";
var LOG = "if (a < 0.0) return 1.0/0.0;\n  return log(a);";
var TO_INT = "return float(int(a));";
var SQRT = "return sqrt(a);";
var UnaryOpProgram = /** @class */ (function () {
    function UnaryOpProgram(outputShape, op) {
        this.variableNames = ['A'];
        // TODO(jiajia.qin@intel.com): Heuristically select a good work group size.
        var workGroupSizeX = 128;
        this.workGroupSize = [workGroupSizeX, 1, 1];
        this.outputShape = outputShape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        this.op = op;
        this.shaderKey = "unary_" + op;
        this.size = tf.util.sizeFromShape(this.outputShape);
    }
    UnaryOpProgram.prototype.getUserCode = function () {
        return "\n      float unaryOperation(float a) {\n        " + this.op + "\n      }\n\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n        if (index < size)\n        {\n          float a = getAAtOutCoords();\n          setOutput(index, unaryOperation(a));\n        }\n      }\n      ";
    };
    return UnaryOpProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Template that creates a `KernelFunc` for unary ops.
 * @param opSnippet Op snippet to create `UnaryOpProgram`.
 * @param cpuKernelImpl Optional. Shared functionality from tfjs-backend-cpu, it
 *     will be involved when necessary.
 * @param dtype Optional. If set, the result has this dtype. Otherwise, the
 *     result has the same dtype as the first input. This is mainly used in
 *     comparison kernels, such as Equal, Less, Greater, etc.
 */
function unaryKernelFunc(_a) {
    var opSnippet = _a.opSnippet, cpuKernelImpl = _a.cpuKernelImpl, dtype = _a.dtype;
    return function (_a) {
        var inputs = _a.inputs, backend = _a.backend;
        var x = inputs.x;
        var webgpuBackend = backend;
        var $dtype = dtype || x.dtype;
        if (webgpuBackend.shouldExecuteOnCPU([x]) && cpuKernelImpl != null) {
            var xData = webgpuBackend.tensorMap.get(x.dataId);
            var outValues = cpuKernelImpl(xData.values, $dtype);
            return webgpuBackend.makeTensorInfo(x.shape, $dtype, outValues);
        }
        var program = new UnaryOpProgram(x.shape, opSnippet);
        return webgpuBackend.runWebGPUProgram(program, [x], $dtype);
    };
}
/**
 * Template that creates a `KernelFunc` for binary ops.
 * @param opSnippet Op snippet to create `BinaryOpProgram`.
 * @param cpuKernelImpl Optional. Shared functionality from tfjs-backend-cpu, it
 *     will be involved when necessary.
 * @param dtype Optional. If set, the result has this dtype. Otherwise, the
 *     result has the same dtype as the first input. This is mainly used in
 *     comparison kernels, such as Equal, Less, Greater, etc.
 */
function binaryKernelFunc(_a) {
    var opSnippet = _a.opSnippet, cpuKernelImpl = _a.cpuKernelImpl, _b = _a.supportsComplex, supportsComplex = _b === void 0 ? false : _b, dtype = _a.dtype;
    return function (_a) {
        var _b;
        var inputs = _a.inputs, backend = _a.backend;
        var _c = inputs, a = _c.a, b = _c.b;
        var webgpuBackend = backend;
        if (supportsComplex && a.dtype === 'complex64') {
            var aData = webgpuBackend.tensorMap.get(a.dataId);
            var bData = webgpuBackend.tensorMap.get(b.dataId);
            var real = void 0, imag = void 0;
            if (opSnippet !== BinaryOpType.MUL) {
                _b = [
                    [aData.complexTensorInfos.real, bData.complexTensorInfos.real],
                    [aData.complexTensorInfos.imag, bData.complexTensorInfos.imag]
                ].map(function (complexParts) {
                    var aPart = complexParts[0], bPart = complexParts[1];
                    var aHandle = {
                        dataId: aPart.dataId,
                        dtype: aPart.dtype,
                        shape: a.shape
                    };
                    var bHandle = {
                        dataId: bPart.dataId,
                        dtype: bPart.dtype,
                        shape: b.shape
                    };
                    var program = getBinaryProgram(opSnippet, a.shape, b.shape);
                    return webgpuBackend.runWebGPUProgram(program, [aHandle, bHandle], tf.upcastType(aPart.dtype, bPart.dtype));
                }), real = _b[0], imag = _b[1];
            }
            else {
                var realProgram = new BinaryOpComplexProgram(COMPLEX_MULTIPLY.REAL, a.shape, b.shape);
                var imagProgram = new BinaryOpComplexProgram(COMPLEX_MULTIPLY.IMAG, a.shape, b.shape);
                var inputs_1 = [
                    {
                        dataId: aData.complexTensorInfos.real.dataId,
                        dtype: aData.complexTensorInfos.real.dtype,
                        shape: a.shape
                    },
                    {
                        dataId: aData.complexTensorInfos.imag.dataId,
                        dtype: aData.complexTensorInfos.imag.dtype,
                        shape: a.shape
                    },
                    {
                        dataId: bData.complexTensorInfos.real.dataId,
                        dtype: bData.complexTensorInfos.real.dtype,
                        shape: b.shape
                    },
                    {
                        dataId: bData.complexTensorInfos.imag.dataId,
                        dtype: bData.complexTensorInfos.imag.dtype,
                        shape: b.shape
                    }
                ];
                real = webgpuBackend.runWebGPUProgram(realProgram, inputs_1, 'float32');
                imag = webgpuBackend.runWebGPUProgram(imagProgram, inputs_1, 'float32');
            }
            var complexOutput = complex({ inputs: { real: real, imag: imag }, backend: webgpuBackend });
            webgpuBackend.disposeData(real.dataId);
            webgpuBackend.disposeData(imag.dataId);
            // TODO: Implement CPU forwarding for complex inputs.
            return complexOutput;
        }
        var $dtype = dtype || tf.upcastType(a.dtype, b.dtype);
        if ((a.dtype === 'string' || b.dtype === 'string' ||
            webgpuBackend.shouldExecuteOnCPU([a, b])) &&
            cpuKernelImpl != null) {
            var aData = webgpuBackend.tensorMap.get(a.dataId).values;
            var bData = webgpuBackend.tensorMap.get(b.dataId).values;
            var decodedAVals = a.dtype === 'string' ?
                // tslint:disable-next-line: no-any
                tf.backend_util.fromUint8ToStringArray(aData) :
                aData;
            var decodedBVals = a.dtype === 'string' ?
                // tslint:disable-next-line: no-any
                tf.backend_util.fromUint8ToStringArray(bData) :
                bData;
            var _d = cpuKernelImpl(a.shape, b.shape, decodedAVals, decodedBVals, $dtype), outValues = _d[0], outShape = _d[1];
            return webgpuBackend.makeTensorInfo(outShape, $dtype, outValues);
        }
        var program = getBinaryProgram(opSnippet, a.shape, b.shape);
        return webgpuBackend.runWebGPUProgram(program, [a, b], $dtype);
    };
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function simpleAbsImpl(vals) {
    const resultValues = new Float32Array(vals.length);
    for (let i = 0; i < vals.length; ++i) {
        resultValues[i] = Math.abs(vals[i]);
    }
    return resultValues;
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Template that creates implementation for binary ops. Supports broadcast.
 */
function createSimpleBinaryKernelImpl(op) {
    return (aShape, bShape, aVals, bVals, dtype) => {
        const newShape = tf.backend_util.assertAndGetBroadcastShape(aShape, bShape);
        const resultRank = newShape.length;
        const resultStrides = tf.util.computeStrides(newShape);
        const resultSize = tf.util.sizeFromShape(newShape);
        const result = tf.util.getTypedArrayFromDType(dtype, resultSize);
        const aRank = aShape.length;
        const bRank = bShape.length;
        const aStrides = tf.util.computeStrides(aShape);
        const bStrides = tf.util.computeStrides(bShape);
        const aBroadcastDims = tf.backend_util.getBroadcastDims(aShape, newShape);
        const bBroadcastDims = tf.backend_util.getBroadcastDims(bShape, newShape);
        if (aBroadcastDims.length + bBroadcastDims.length === 0) {
            for (let i = 0; i < result.length; ++i) {
                result[i] = op(aVals[i % aVals.length], bVals[i % bVals.length]);
            }
        }
        else {
            for (let i = 0; i < result.length; ++i) {
                const loc = tf.util.indexToLoc(i, resultRank, resultStrides);
                const aLoc = loc.slice(-aRank);
                aBroadcastDims.forEach(d => aLoc[d] = 0);
                const aIndex = tf.util.locToIndex(aLoc, aRank, aStrides);
                const bLoc = loc.slice(-bRank);
                bBroadcastDims.forEach(d => bLoc[d] = 0);
                const bIndex = tf.util.locToIndex(bLoc, bRank, bStrides);
                result[i] = op(aVals[aIndex], bVals[bIndex]);
            }
        }
        return [result, newShape];
    };
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const addImpl = createSimpleBinaryKernelImpl(((a, b) => a + b));

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Template that creates implementation for unary op.
 */
function createSimpleUnaryImpl(op) {
    return (values, dtype, attrs) => {
        const newValues = tf.util.getTypedArrayFromDType(dtype, values.length);
        for (let i = 0; i < values.length; ++i) {
            newValues[i] = op(values[i], attrs);
        }
        return newValues;
    };
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const ceilImpl = createSimpleUnaryImpl((xi) => Math.ceil(xi));

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function concatImpl(inputs, outShape, dtype, simplyConcat) {
    const outVals = tf.util.getArrayFromDType(dtype, tf.util.sizeFromShape(outShape));
    if (simplyConcat && dtype !== 'string') {
        // Use built-in TypedArray.set() method for speed.
        let offset = 0;
        inputs.forEach(input => {
            const size = tf.util.sizeFromShape(input.shape);
            outVals.set(input.vals, offset);
            offset += size;
        });
    }
    else {
        let colOffset = 0;
        inputs.forEach(input => {
            const decodedData = dtype === 'string' ?
                tf.backend_util.fromUint8ToStringArray(input.vals) :
                input.vals;
            let tIdx = 0;
            for (let row = 0; row < input.shape[0]; ++row) {
                const resIdx = row * outShape[1] + colOffset;
                for (let col = 0; col < input.shape[1]; ++col) {
                    outVals[resIdx + col] = decodedData[tIdx++];
                }
            }
            colOffset += input.shape[1];
        });
    }
    return outVals;
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const equalImpl = createSimpleBinaryKernelImpl((a, b) => (a === b) ? 1 : 0);

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const expImpl = createSimpleUnaryImpl((xi) => Math.exp(xi));

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const expm1Impl = createSimpleUnaryImpl((xi) => Math.expm1(xi));

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const floorImpl = createSimpleUnaryImpl((xi) => Math.floor(xi));

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function gatherNdImpl(indicesData, paramsBuf, dtype, numSlices, sliceRank, sliceSize, strides, paramsShape, paramsSize) {
    const outBuf = tf.buffer([numSlices, sliceSize], dtype);
    for (let i = 0; i < numSlices; i++) {
        const index = [];
        let flattenIndex = 0;
        for (let j = 0; j < sliceRank; j++) {
            const dim = indicesData[i * sliceRank + j];
            flattenIndex += dim * strides[j];
            index.push(dim);
        }
        if (flattenIndex < 0 || flattenIndex >= paramsSize / sliceSize) {
            throw new Error(`Invalid indices: ${index} does not index into ${paramsShape}`);
        }
        for (let k = 0; k < sliceSize; k++) {
            outBuf.values[i * sliceSize + k] =
                paramsBuf.get(...paramsBuf.indexToLoc(flattenIndex * sliceSize + k));
        }
    }
    return outBuf;
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function gatherV2Impl(xBuf, indicesBuf, flattenOutputShape) {
    const outBuf = tf.buffer(flattenOutputShape, xBuf.dtype);
    for (let i = 0; i < outBuf.size; ++i) {
        const newLoc = outBuf.indexToLoc(i);
        const originalLoc = newLoc.slice();
        const batchIdx = originalLoc[0];
        const indicesIdx = originalLoc[2];
        const indicesIndex = indicesBuf.locToIndex([batchIdx, indicesIdx]);
        originalLoc[2] = indicesBuf.values[indicesIndex];
        const originalIndex = xBuf.locToIndex(originalLoc);
        outBuf.values[i] = xBuf.values[originalIndex];
    }
    return outBuf;
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const greaterImpl = createSimpleBinaryKernelImpl((a, b) => (a > b) ? 1 : 0);

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const greaterEqualImpl = createSimpleBinaryKernelImpl((a, b) => (a >= b) ? 1 : 0);

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const lessImpl = createSimpleBinaryKernelImpl((a, b) => (a < b) ? 1 : 0);

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const lessEqualImpl = createSimpleBinaryKernelImpl((a, b) => (a <= b) ? 1 : 0);

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const logImpl = createSimpleUnaryImpl((xi) => Math.log(xi));

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function maxImpl(aVals, reduceSize, outShape, dtype) {
    const vals = tf.util.getTypedArrayFromDType(dtype, tf.util.sizeFromShape(outShape));
    for (let i = 0; i < vals.length; ++i) {
        const offset = i * reduceSize;
        let max = aVals[offset];
        for (let j = 0; j < reduceSize; ++j) {
            const value = aVals[offset + j];
            if (Number.isNaN(value) ||
                value > max) { // comparison with NaN always return false
                max = value;
            }
        }
        vals[i] = max;
    }
    return vals;
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const maximumImpl = createSimpleBinaryKernelImpl(((aValue, bValue) => Math.max(aValue, bValue)));

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const minimumImpl = createSimpleBinaryKernelImpl(((aValue, bValue) => Math.min(aValue, bValue)));

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const multiplyImpl = createSimpleBinaryKernelImpl(((aValue, bValue) => aValue * bValue));

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function negImpl(xVals, xShape, xDtype) {
    const minusOne = tf.util.createScalarValue(-1, xDtype);
    return multiplyImpl([], xShape, minusOne, xVals, xDtype);
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const notEqualImpl = createSimpleBinaryKernelImpl(((a, b) => (a !== b) ? 1 : 0));

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function transposeImpl(xVals, xShape, dtype, perm, newShape) {
    const xRank = xShape.length;
    const xSize = tf.util.sizeFromShape(xShape);
    const xStrides = tf.util.computeStrides(xShape);
    const newStrides = tf.util.computeStrides(newShape);
    const result = tf.util.getTypedArrayFromDType(dtype, tf.util.sizeFromShape(newShape));
    for (let i = 0; i < xSize; ++i) {
        const loc = tf.util.indexToLoc(i, xRank, xStrides);
        // Permute location.
        const newLoc = new Array(loc.length);
        for (let i = 0; i < newLoc.length; i++) {
            newLoc[i] = loc[perm[i]];
        }
        const newIndex = tf.util.locToIndex(newLoc, xRank, newStrides);
        result[newIndex] = xVals[i];
    }
    return result;
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function prodImpl(xShape, xDtype, xVals, reductionAxes) {
    const [outShape, reduceShape] = tf.backend_util.computeOutAndReduceShapes(xShape, reductionAxes);
    const outDtype = tf.upcastType(xDtype, 'int32');
    const outVals = tf.util.makeZerosTypedArray(tf.util.sizeFromShape(outShape), outDtype);
    const reduceSize = tf.util.sizeFromShape(reduceShape);
    for (let i = 0; i < outVals.length; ++i) {
        const offset = i * reduceSize;
        let prod = 1;
        for (let j = 0; j < reduceSize; ++j) {
            prod *= xVals[offset + j];
        }
        outVals[i] = prod;
    }
    return { outVals, outShape, outDtype };
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function rangeImpl(start, stop, step, dtype) {
    const sameStartStop = start === stop;
    const increasingRangeNegativeStep = start < stop && step < 0;
    const decreasingRangePositiveStep = stop < start && step > 1;
    if (sameStartStop || increasingRangeNegativeStep ||
        decreasingRangePositiveStep) {
        return tf.util.makeZerosTypedArray(0, dtype);
    }
    const numElements = Math.abs(Math.ceil((stop - start) / step));
    const values = tf.util.makeZerosTypedArray(numElements, dtype);
    if (stop < start && step === 1) {
        // Auto adjust the step's sign if it hasn't been set
        // (or was set to 1)
        step = -1;
    }
    values[0] = start;
    for (let i = 1; i < values.length; i++) {
        values[i] = values[i - 1] + step;
    }
    return values;
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const rsqrtImpl = createSimpleUnaryImpl((xi) => 1 / Math.sqrt(xi));

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function sliceImpl(vals, begin, size, shape, dtype) {
    const isContinous = tf.slice_util.isSliceContinous(shape, begin, size);
    const length = tf.util.sizeFromShape(size);
    const xStrides = tf.util.computeStrides(shape);
    if (isContinous) {
        const flatOffset = tf.slice_util.computeFlatOffset(begin, xStrides);
        if (dtype === 'string') {
            return vals.slice(flatOffset, flatOffset + length);
        }
        return vals.subarray(flatOffset, flatOffset + length);
    }
    const decodedData = dtype === 'string' ?
        tf.backend_util.fromUint8ToStringArray(vals) :
        vals;
    const inBuf = tf.buffer(shape, dtype, decodedData);
    const outBuf = tf.buffer(size, dtype);
    for (let i = 0; i < outBuf.size; ++i) {
        const outLoc = outBuf.indexToLoc(i);
        const inLoc = outLoc.map((idx, j) => idx + begin[j]);
        outBuf.set(inBuf.get(...inLoc), ...outLoc);
    }
    if (dtype === 'string') {
        return tf.backend_util.fromStringArrayToUint8(outBuf.values);
    }
    return outBuf.values;
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function stridedSliceImpl(outShape, xBuf, strides, begin) {
    const outBuf = tf.buffer(outShape, xBuf.dtype);
    for (let i = 0; i < outBuf.size; i++) {
        const loc = outBuf.indexToLoc(i);
        const newLoc = new Array(loc.length);
        for (let j = 0; j < newLoc.length; j++) {
            newLoc[j] = loc[j] * strides[j] + begin[j];
        }
        outBuf.set(xBuf.get(...newLoc), ...loc);
    }
    return outBuf;
}

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * The StringNGramsOp class creates ngrams from ragged string data.
 * The constructor contains all attributes related to the operation such as
 * padding widths and strings, and the compute function can be used to
 * compute the ngrams for different ragged tensor inputs.
 */
class StringNGramsOp {
    constructor(separator, nGramWidths, leftPad, rightPad, padWidth, preserveShortSequences) {
        this.separator = tf.util.encodeString(separator);
        this.nGramWidths = nGramWidths;
        this.leftPad = tf.util.encodeString(leftPad);
        this.rightPad = tf.util.encodeString(rightPad);
        this.padWidth = padWidth;
        this.preserveShort = preserveShortSequences;
    }
    getPadWidth(nGramWidth) {
        // Ngrams can be padded with either a fixed pad width or a dynamic pad
        // width depending on the 'padWidth' arg, but in no case should the padding
        // ever be wider than 'nGramWidth' - 1.
        return Math.min(this.padWidth < 0 ? nGramWidth - 1 : this.padWidth, nGramWidth - 1);
    }
    getNumNGrams(length, nGramWidth) {
        const padWidth = this.getPadWidth(nGramWidth);
        return Math.max(0, ((length + 2 * padWidth) - nGramWidth) + 1);
    }
    createNGrams(data, splitIndex, output, outputStartIndex, numNGrams, nGramWidth) {
        for (let nGramIndex = 0; nGramIndex < numNGrams; ++nGramIndex) {
            const padWidth = this.getPadWidth(nGramWidth);
            const leftPadding = Math.max(0, padWidth - nGramIndex);
            const rightPadding = Math.max(0, padWidth - (numNGrams - (nGramIndex + 1)));
            const numTokens = nGramWidth - (leftPadding + rightPadding);
            const dataStartIndex = splitIndex + (leftPadding > 0 ? 0 : nGramIndex - padWidth);
            // Calculate the total expected size of the nGram so we can reserve the
            // correct amount of space in the string.
            let nGramSize = 0;
            // Size of the left padding.
            nGramSize += leftPadding * this.leftPad.length;
            // Size of the tokens.
            for (let n = 0; n < numTokens; ++n) {
                nGramSize += data[dataStartIndex + n].length;
            }
            // Size of the right padding.
            nGramSize += rightPadding * this.rightPad.length;
            // Size of the separators.
            const numSeparators = leftPadding + rightPadding + numTokens - 1;
            nGramSize += numSeparators * this.separator.length;
            // Build the nGram.
            output[outputStartIndex + nGramIndex] = new Uint8Array(nGramSize);
            const nGram = output[outputStartIndex + nGramIndex];
            let nextNGramIndex = 0;
            const appendToNGram = (str) => str.forEach((value) => nGram[nextNGramIndex++] = value);
            for (let n = 0; n < leftPadding; ++n) {
                appendToNGram(this.leftPad);
                appendToNGram(this.separator);
            }
            // Only output first numTokens - 1 pairs of data and separator
            for (let n = 0; n < numTokens - 1; ++n) {
                appendToNGram(data[dataStartIndex + n]);
                appendToNGram(this.separator);
            }
            // Handle case when there are no tokens or no right padding as these
            // can result in consecutive separators.
            if (numTokens > 0) {
                // If we have tokens, then output last and then pair each separator
                // with the right padding that follows, to ensure nGram ends either with
                // the token or with the right pad.
                appendToNGram(data[dataStartIndex + numTokens - 1]);
                for (let n = 0; n < rightPadding; ++n) {
                    appendToNGram(this.separator);
                    appendToNGram(this.rightPad);
                }
            }
            else {
                // If we don't have tokens, then the last item inserted into the nGram
                // has been the separator from the left padding loop above. Hence,
                // output right pad and separator and make sure to finish with a
                // padding, not a separator.
                for (let n = 0; n < rightPadding - 1; ++n) {
                    appendToNGram(this.rightPad);
                    appendToNGram(this.separator);
                }
                appendToNGram(this.rightPad);
            }
        }
    }
    // Data and splits together form the definition of the ragged tensor,
    // where data is 1 dimensional and contains the values of the tensor
    // and splits denotes the indices at which each row starts.
    compute(data, splits) {
        // Validate that the splits are valid indices into data, only if there are
        // splits specified.
        const inputDataSize = data.length;
        const splitsSize = splits.length;
        if (splitsSize > 0) {
            let prevSplit = splits[0];
            if (prevSplit !== 0) {
                throw new Error(`First split value must be 0, got ${prevSplit}`);
            }
            for (let i = 1; i < splitsSize; ++i) {
                let validSplits = splits[i] >= prevSplit;
                validSplits = validSplits && (splits[i] <= inputDataSize);
                if (!validSplits) {
                    throw new Error(`Invalid split value ${splits[i]}, must be in [${prevSplit}, ${inputDataSize}]`);
                }
                prevSplit = splits[i];
            }
            if (prevSplit !== inputDataSize) {
                throw new Error(`Last split value must be data size. Expected ${inputDataSize}, got ${prevSplit}`);
            }
        }
        const numBatchItems = splitsSize - 1;
        const nGramsSplits = tf.util.getArrayFromDType('int32', splitsSize);
        // If there is no data or size, return an empty ragged tensor.
        if (inputDataSize === 0 || splitsSize === 0) {
            const empty = new Array(inputDataSize);
            for (let i = 0; i <= numBatchItems; ++i) {
                nGramsSplits[i] = 0;
            }
            return [empty, nGramsSplits];
        }
        nGramsSplits[0] = 0;
        for (let i = 1; i <= numBatchItems; ++i) {
            const length = splits[i] - splits[i - 1];
            let numNGrams = 0;
            this.nGramWidths.forEach((nGramWidth) => {
                numNGrams += this.getNumNGrams(length, nGramWidth);
            });
            if (this.preserveShort && length > 0 && numNGrams === 0) {
                numNGrams = 1;
            }
            nGramsSplits[i] = nGramsSplits[i - 1] + numNGrams;
        }
        const nGrams = new Array(nGramsSplits[numBatchItems]);
        for (let i = 0; i < numBatchItems; ++i) {
            const splitIndex = splits[i];
            let outputStartIdx = nGramsSplits[i];
            this.nGramWidths.forEach((nGramWidth) => {
                const length = splits[i + 1] - splits[i];
                const numNGrams = this.getNumNGrams(length, nGramWidth);
                this.createNGrams(data, splitIndex, nGrams, outputStartIdx, numNGrams, nGramWidth);
                outputStartIdx += numNGrams;
            });
            // If we're preserving short sequences, check to see if no sequence was
            // generated by comparing the current output start idx to the original
            // one (nGramSplitsdata). If no ngrams were generated, then they will
            // be equal (since we increment outputStartIdx by numNGrams every
            // time we create a set of ngrams.)
            if (this.preserveShort && outputStartIdx === nGramsSplits[i]) {
                const dataLength = splits[i + 1] - splits[i];
                // One legitimate reason to not have any ngrams when this.preserveShort
                // is true is if the sequence itself is empty. In that case, move on.
                if (dataLength === 0) {
                    continue;
                }
                // We don't have to worry about dynamic padding sizes here: if padding
                // was dynamic, every sequence would have had sufficient padding to
                // generate at least one nGram.
                const nGramWidth = dataLength + 2 * this.padWidth;
                const numNGrams = 1;
                this.createNGrams(data, splitIndex, nGrams, outputStartIdx, numNGrams, nGramWidth);
            }
        }
        return [nGrams, nGramsSplits];
    }
}
function stringNGramsImpl(data, dataSplits, separator, nGramWidths, leftPad, rightPad, padWidth, preserveShortSequences) {
    return new StringNGramsOp(separator, nGramWidths, leftPad, rightPad, padWidth, preserveShortSequences)
        .compute(data, dataSplits);
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const subImpl = createSimpleBinaryKernelImpl(((aValue, bValue) => aValue - bValue));

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * An implementation of the tile kernel shared between webgl and cpu for string
 * tensors only.
 */
function tileImpl(xBuf, reps) {
    const newShape = new Array(xBuf.rank);
    for (let i = 0; i < newShape.length; i++) {
        newShape[i] = xBuf.shape[i] * reps[i];
    }
    const result = tf.buffer(newShape, xBuf.dtype);
    for (let i = 0; i < result.values.length; ++i) {
        const newLoc = result.indexToLoc(i);
        const originalLoc = new Array(xBuf.rank);
        for (let j = 0; j < originalLoc.length; j++) {
            originalLoc[j] = newLoc[j] % xBuf.shape[j];
        }
        const originalIndex = xBuf.locToIndex(originalLoc);
        result.values[i] = xBuf.values[originalIndex];
    }
    return result;
}

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var addImplCPU = addImpl, ceilImplCPU = ceilImpl, concatImplCPU = concatImpl, equalImplCPU = equalImpl, expImplCPU = expImpl, expm1ImplCPU = expm1Impl, floorImplCPU = floorImpl, gatherNdImplCPU = gatherNdImpl, gatherV2ImplCPU = gatherV2Impl, greaterEqualImplCPU = greaterEqualImpl, greaterImplCPU = greaterImpl, lessEqualImplCPU = lessEqualImpl, lessImplCPU = lessImpl, logImplCPU = logImpl, maxImplCPU = maxImpl, maximumImplCPU = maximumImpl, minimumImplCPU = minimumImpl, multiplyImplCPU = multiplyImpl, negImplCPU = negImpl, notEqualImplCPU = notEqualImpl, prodImplCPU = prodImpl, rangeImplCPU = rangeImpl, rsqrtImplCPU = rsqrtImpl, simpleAbsImplCPU = simpleAbsImpl, sliceImplCPU = sliceImpl, stridedSliceImplCPU = stridedSliceImpl, stringNGramsImplCPU = stringNGramsImpl, subImplCPU = subImpl, tileImplCPU = tileImpl, transposeImplCPU = transposeImpl;

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var abs = unaryKernelFunc({ opSnippet: ABS, cpuKernelImpl: simpleAbsImplCPU });
var absConfig = {
    kernelName: tf.Abs,
    backendName: 'webgpu',
    kernelFunc: abs
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var addKernelFunc = binaryKernelFunc({
    opSnippet: BinaryOpType.ADD,
    cpuKernelImpl: addImplCPU,
    supportsComplex: true
});
var addConfig = {
    kernelName: tf.Add,
    backendName: 'webgpu',
    kernelFunc: addKernelFunc
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var AddNPackedProgram = /** @class */ (function () {
    function AddNPackedProgram(shapes) {
        this.workPerThread = 4;
        this.workGroupSize = [64, 1, 1];
        this.outputShape = shapes[0];
        this.variableNames = shapes.map(function (_, i) { return "T" + i; });
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [this.workPerThread, 1, 1]);
        this.shaderKey = 'addN';
        this.size = tf.util.sizeFromShape(this.outputShape);
    }
    AddNPackedProgram.prototype.getUserCode = function () {
        var snippets = [];
        // Get target elements from every input tensor.
        this.variableNames.forEach(function (variable) {
            snippets.push("float v" + variable + " = get" + variable + "AtOutCoords(coords);");
        });
        // Calculate the sum of all elements.
        var operation = this.variableNames
            .map(function (variable) {
            return "v" + variable;
        })
            .join(' + ');
        var type = getCoordsDataType(this.outputShape.length);
        var userCode = "\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n        for (int i = 0; i < " + this.workPerThread + "; i++) {\n          int flatIndex = index * " + this.workPerThread + " + i;\n          if (flatIndex < size) {\n            " + type + " coords = getCoordsFromFlatIndex(flatIndex);\n            " + snippets.join('\n        ') + "\n            setOutput(flatIndex, " + operation + ");\n          }\n        }\n      }\n    ";
        return userCode;
    };
    return AddNPackedProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function addN(args) {
    var inputs = args.inputs, backend = args.backend;
    var tensors = inputs;
    if (tensors.length === 1) {
        return identity({ inputs: { x: tensors[0] }, backend: backend });
    }
    var dtype = tensors.map(function (t) { return t.dtype; }).reduce(function (d1, d2) { return tf.upcastType(d1, d2); });
    var shapes = tensors.map(function (t) { return t.shape; });
    var program = new AddNPackedProgram(shapes);
    return backend.runWebGPUProgram(program, tensors, dtype);
}
var addNConfig = {
    kernelName: tf.AddN,
    backendName: 'webgpu',
    kernelFunc: addN
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var ArgMinMaxProgram = /** @class */ (function () {
    function ArgMinMaxProgram(inputShape, axis, reduceType) {
        this.variableNames = ['x'];
        this.uniforms = 'int axis;';
        var axes = [axis];
        tf.backend_util.assertAxesAreInnerMostDims('arg' + reduceType.charAt(0).toUpperCase() + reduceType.slice(1), axes, inputShape.length);
        this.op = reduceType === 'min' ? '<' : '>';
        // |outShape| is the shape with the removed axis
        // |reduceShape| is the shape we are reducing. i.e. [ inputShape[axis] ]
        var _a = tf.backend_util.computeOutAndReduceShapes(inputShape, axes), outputShape = _a[0], reduceShape = _a[1];
        this.outputShape = outputShape.length === 0 ? [1] : outputShape;
        // Length of the axis we're reducing on.
        var reduceSize = tf.util.sizeFromShape(reduceShape);
        // The number of comparisons each thread will do
        this.reductionFactor = 2;
        var xMaxThreads = 1024; // gl_MaxComputeWorkGroupSize
        var xThreads = Math.min(Math.ceil(reduceSize / this.reductionFactor), xMaxThreads);
        this.workGroupSize = [xThreads, 1, 1];
        this.dispatchLayout = { x: [], y: this.outputShape.map(function (d, i) { return i; }) };
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        this.inputShape = inputShape;
        this.shaderKey = "argMinMax" + this.op;
    }
    ArgMinMaxProgram.prototype.getUserCode = function () {
        var _this = this;
        // When this.workGroupSize[0] > 1, each thread reduces Length /
        // this.workGroupSize[0] values. Thes results are stored in shared memory
        // and iteratively reduced.
        var reduceInSharedMemory = this.workGroupSize[0] > 1;
        var sharedMemorySnippet = "\n      shared int xBestIndices[WorkGroupSize];\n      shared float xBestValues[WorkGroupSize];\n    ";
        var sharedMemoryReduceSnippet = "\n      xBestIndices[gl_LocalInvocationID.x] = bestIndex;\n      xBestValues[gl_LocalInvocationID.x] = bestValue;\n\n      int currentSize = WorkGroupSize;\n      while (currentSize > 1) {\n        barrier();\n\n        for (int w = 0; w < " + this.reductionFactor + "; ++w) {\n          int i = int(gl_LocalInvocationID.x) * " + this.reductionFactor + " + w;\n          if (i < currentSize) {\n            int candidateIndex = xBestIndices[i];\n            float candidate = xBestValues[i];\n            if (candidate " + this.op + " bestValue && !isnan(candidate)) {\n              bestValue = candidate;\n              bestIndex = candidateIndex;\n            }\n          }\n        }\n\n        xBestIndices[gl_LocalInvocationID.x] = bestIndex;\n        xBestValues[gl_LocalInvocationID.x] = bestValue;\n\n        currentSize = DIV_CEIL(currentSize, " + this.reductionFactor + ");\n      }\n\n      if (gl_LocalInvocationID.x == 0) {\n        setOutput(flatOutputIndex, int(bestIndex));\n      }\n    ";
        var outputCoordsType = getCoordsDataType(this.outputShape.length);
        var indexOutputCoords = function (outputCoords, index) {
            if (_this.outputShape.length === 1) {
                return outputCoords;
            }
            else {
                return outputCoords + "[" + index + "]";
            }
        };
        var indexInputShape = function (index) {
            if (_this.inputShape.length === 1) {
                return 'xShape';
            }
            else {
                return "xShape[" + index + "]";
            }
        };
        var userCode = "\n      #define DIV_CEIL(x, y) (((x) - 1) / (y) + 1)\n\n      const int WorkGroupSize = int(gl_WorkGroupSize.x);\n\n      " + (reduceInSharedMemory ? sharedMemorySnippet : '') + "\n\n      // In order to get a flattened index into the input tensor, we need to\n      // add back the index along the reduced dimension to |outputCoords|.\n      // This function outputs the offset to the first value along\n      // |axis| and the stride to get the next value of the input along |axis|.\n      ivec2 getInputCoordInfo() {\n        const " + outputCoordsType + " outputCoords = getOutputCoords();\n        int i = " + (this.outputShape.length - 1) + ";\n\n        int stride = 1;\n        int inputStride = 1;\n        int offset = 0;\n\n        for (int r = 1; r <= " + this.inputShape.length + "; ++r) {\n          int length = " + indexInputShape(this.inputShape.length + " - r") + ";\n          if (" + this.inputShape.length + " - r == axis) {\n            inputStride = stride;\n          } else {\n            offset += " + indexOutputCoords('outputCoords', 'i--') + " * stride;\n          }\n          stride *= length;\n        }\n\n        return ivec2(offset, inputStride);\n      }\n\n      int getInputIndex(ivec2 coordInfo, int index) {\n        return coordInfo[0] + coordInfo[1] * index;\n      }\n\n      void main() {\n        const ivec2 coordInfo = getInputCoordInfo();\n\n        int bestIndex = 0;\n        float bestValue = float(x[getInputIndex(coordInfo, bestIndex)]);\n\n        const int Length = " + indexInputShape('axis') + ";\n        const int WorkPerThread = DIV_CEIL(Length, WorkGroupSize);\n\n        for (int w = 0; w < WorkPerThread; ++w) {\n          int i = int(gl_GlobalInvocationID.x) * WorkPerThread + w;\n          if (i < Length) {\n            float candidate = float(x[getInputIndex(coordInfo, i)]);\n            if (candidate " + this.op + " bestValue && !isnan(candidate)) {\n              bestValue = candidate;\n              bestIndex = i;\n            }\n          }\n        }\n\n        const int flatOutputIndex = int(gl_GlobalInvocationID.y);\n        " + (reduceInSharedMemory ? sharedMemoryReduceSnippet :
            'setOutput(flatOutputIndex, int(bestIndex));') + "\n      }\n    ";
        return userCode;
    };
    return ArgMinMaxProgram;
}());

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var TransposeSharedProgram = /** @class */ (function () {
    function TransposeSharedProgram(aShape, newDim) {
        this.variableNames = ['A'];
        this.workGroupSize = [32, 32, 1];
        var outputShape = new Array(aShape.length);
        for (var i = 0; i < outputShape.length; i++) {
            outputShape[i] = aShape[newDim[i]];
        }
        this.outputShape = outputShape;
        this.dispatchLayout = { x: [0], y: [1] };
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [1, 1, 1]);
        this.shaderKey = 'transposeShared';
    }
    TransposeSharedProgram.prototype.getUserCode = function () {
        var userCode = "\n    const int TILE_DIM = " + this.workGroupSize[0] + ";\n    shared float tile[TILE_DIM][TILE_DIM + 1];\n    void main() {\n        int index = int(gl_GlobalInvocationID.x);\n        int x = int(gl_WorkGroupID.x) * TILE_DIM + int(gl_LocalInvocationID.x);\n        int y = int(gl_WorkGroupID.y) * TILE_DIM + int(gl_LocalInvocationID.y);\n        int width = outShape[0];\n        int height = outShape[1];\n        if (x < width && y < height) {\n          tile[gl_LocalInvocationID.y][gl_LocalInvocationID.x] =\n              A[y * width + x];\n        }\n        barrier();\n\n        x = int(gl_WorkGroupID.y) * TILE_DIM + int(gl_LocalInvocationID.x);\n        y = int(gl_WorkGroupID.x) * TILE_DIM + int(gl_LocalInvocationID.y);\n        if (x < height && y < width) {\n          setOutput((y * height + x), tile[gl_LocalInvocationID.x]\n            [gl_LocalInvocationID.y]);\n        }\n      }\n    ";
        return userCode;
    };
    return TransposeSharedProgram;
}());

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var TransposeProgram = /** @class */ (function () {
    function TransposeProgram(aShape, newDim) {
        this.variableNames = ['A'];
        this.workPerThread = 4;
        this.workGroupSize = [64, 1, 1];
        var outputShape = new Array(aShape.length);
        for (var i = 0; i < outputShape.length; i++) {
            outputShape[i] = aShape[newDim[i]];
        }
        this.outputShape = outputShape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [this.workPerThread, 1, 1]);
        this.newDim = newDim;
        this.shaderKey = "transpose_" + newDim;
        this.size = tf.util.sizeFromShape(this.outputShape);
    }
    TransposeProgram.prototype.getUserCode = function () {
        var dtype = getCoordsDataType(this.outputShape.length);
        var switched = getSwitchedCoords(this.newDim);
        var userCode = "\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n\n        for(int i = 0; i < " + this.workPerThread + "; i++) {\n          int flatIndex = index * " + this.workPerThread + " + i;\n          if(flatIndex < size) {\n            " + dtype + " resRC = getCoordsFromFlatIndex(flatIndex);\n            setOutput(flatIndex, A[getFlatIndex(\n              " + dtype + "(" + switched + "), aShape)]);\n          }\n        }\n      }\n    ";
        return userCode;
    };
    return TransposeProgram;
}());
function getSwitchedCoords(newDim) {
    var rank = newDim.length;
    if (rank > 4) {
        throw Error("Transpose for rank " + rank + " is not yet supported");
    }
    var switchedCoords = new Array(rank);
    for (var i = 0; i < newDim.length; i++) {
        switchedCoords[newDim[i]] = "resRC[" + i + "]";
    }
    return switchedCoords.join();
}

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function transpose(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var perm = attrs.perm;
    var webgpuBackend = backend;
    var xRank = x.shape.length;
    var newShape = new Array(xRank);
    for (var i = 0; i < newShape.length; i++) {
        newShape[i] = x.shape[perm[i]];
    }
    if (backend.shouldExecuteOnCPU([x])) {
        var xData = webgpuBackend.tensorMap.get(x.dataId);
        var values = xData.values;
        var outValues = transposeImplCPU(values, x.shape, x.dtype, perm, newShape);
        return backend.makeTensorInfo(newShape, x.dtype, outValues);
    }
    if (x.shape.length === 2 && tf.util.arraysEqual(perm, [1, 0])) {
        var program_1 = new TransposeSharedProgram(x.shape, perm);
        return webgpuBackend.runWebGPUProgram(program_1, [x], x.dtype);
    }
    var program = new TransposeProgram(x.shape, perm);
    return webgpuBackend.runWebGPUProgram(program, [x], x.dtype);
}
var transposeConfig = {
    kernelName: tf.Transpose,
    backendName: 'webgpu',
    kernelFunc: transpose
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function argMax(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var axis = attrs.axis;
    var axes = tf.util.parseAxisParam(axis, x.shape);
    var permutedAxes = tf.backend_util.getAxesPermutation(axes, x.shape.length);
    var $x = x;
    var intermediateTensorInfos = [];
    if (permutedAxes != null) {
        $x = transpose({ inputs: { x: x }, backend: backend, attrs: { perm: permutedAxes } });
        intermediateTensorInfos.push($x);
        axes = tf.backend_util.getInnerMostAxes(axes.length, $x.shape.length);
    }
    tf.backend_util.assertAxesAreInnerMostDims('argMax', [axes[0]], $x.shape.length);
    var program = new ArgMinMaxProgram($x.shape, axes[0], 'max');
    var uniformData = [{ type: 'int32', data: [axes[0]] }];
    var out = backend.runWebGPUProgram(program, [$x], 'int32', uniformData);
    intermediateTensorInfos.forEach(function (t) { return backend.disposeData(t.dataId); });
    return out;
}
var argMaxConfig = {
    kernelName: tf.ArgMax,
    backendName: 'webgpu',
    kernelFunc: argMax
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function argMin(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var axis = attrs.axis;
    var axes = tf.util.parseAxisParam(axis, x.shape);
    var permutedAxes = tf.backend_util.getAxesPermutation(axes, x.shape.length);
    var $x = x;
    var intermediateTensorInfos = [];
    if (permutedAxes != null) {
        $x = transpose({ inputs: { x: x }, backend: backend, attrs: { perm: permutedAxes } });
        intermediateTensorInfos.push($x);
        axes = tf.backend_util.getInnerMostAxes(axes.length, $x.shape.length);
    }
    tf.backend_util.assertAxesAreInnerMostDims('argMin', [axes[0]], $x.shape.length);
    var program = new ArgMinMaxProgram($x.shape, axes[0], 'min');
    var uniformData = [{ type: 'int32', data: [axes[0]] }];
    var out = backend.runWebGPUProgram(program, [$x], 'int32', uniformData);
    intermediateTensorInfos.forEach(function (t) { return backend.disposeData(t.dataId); });
    return out;
}
var argMinConfig = {
    kernelName: tf.ArgMin,
    backendName: 'webgpu',
    kernelFunc: argMin
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var Pool2DProgram = /** @class */ (function () {
    function Pool2DProgram(convInfo, poolType) {
        this.variableNames = ['x'];
        this.uniforms = 'ivec2 pad, stride, dilation, convDims, filterDims;';
        // TODO(jiajia.qin@intel.com): Dynamically choose different workGroupSize for
        // different output shapes.
        this.workGroupSize = [128, 1, 1];
        this.outputShape = convInfo.outShape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        this.shaderKey = "pool2D_" + poolType;
        this.poolType = poolType;
    }
    Pool2DProgram.prototype.getUserCode = function () {
        var updateSnippet = "resultValue = max(value, resultValue);";
        if (this.poolType === 'avg') {
            updateSnippet = "resultValue += value; count += 1.0;";
        }
        var returnValue = "resultValue";
        if (this.poolType === 'avg') {
            returnValue = "resultValue / count";
        }
        var userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        if (coordsInBounds(coords, outShape)) {\n          int batch = coords[0];\n          ivec2 xRCCorner = coords.yz * stride - pad;\n          int xRCorner = xRCCorner.x;\n          int xCCorner = xRCCorner.y;\n\n          float resultValue = " + (this.poolType === 'avg' ? '0.0' : '-1.0 / 1e-20') + ";\n          float count = 0.0;\n\n          for (int wR = 0; wR < filterDims.x; wR += dilation.x) {\n            int xR = xRCorner + wR;\n\n            if (xR < 0 || xR >= convDims.x) {\n              continue;\n            }\n\n            for (int wC = 0; wC < filterDims.y; wC += dilation.y) {\n              int xC = xCCorner + wC;\n              if (xC < 0 || xC >= convDims.y) {\n                continue;\n              }\n\n              float value = getX(batch, xR, xC, coords[3]);\n              " + updateSnippet + "\n            }\n          }\n\n          setOutput(batch, coords[1], coords[2], coords[3], " + returnValue + ");\n        }\n      }\n    ";
        return userCode;
    };
    return Pool2DProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var PoolWithFilterSizeEqualsOneProgram = /** @class */ (function () {
    function PoolWithFilterSizeEqualsOneProgram(convInfo) {
        this.variableNames = ['x'];
        this.uniforms = 'ivec2 pad, stride, dilation, convDims, filterDims;';
        this.workGroupSize = [256, 1, 1];
        this.outputShape = convInfo.outShape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        this.shaderKey = 'poolWithFilterSizeEqualsOne';
    }
    PoolWithFilterSizeEqualsOneProgram.prototype.getUserCode = function () {
        var userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d = coords[3];\n\n        if (all(lessThan(coords, outShape))) {\n          ivec2 xRCCorner = coords.yz * stride;\n          int xRCorner = xRCCorner.x;\n          int xCCorner = xRCCorner.y;\n\n          float value = getX(batch, xRCorner, xCCorner, d);\n          setOutput(batch, coords[1], coords[2], d, value);\n        }\n      }\n    ";
        return userCode;
    };
    return PoolWithFilterSizeEqualsOneProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function avgPool(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var filterSize = attrs.filterSize, strides = attrs.strides, pad = attrs.pad, dimRoundingMode = attrs.dimRoundingMode;
    var dilations = 1;
    var convInfo = tf.backend_util.computePool2DInfo(x.shape, filterSize, strides, dilations, pad, dimRoundingMode);
    if (convInfo.filterWidth === 1 && convInfo.filterHeight === 1 &&
        tf.util.arraysEqual(convInfo.inShape, convInfo.outShape)) {
        return identity({ inputs: { x: x }, backend: backend });
    }
    var program;
    if (convInfo.filterHeight === 1 && convInfo.filterWidth === 1) {
        program = new PoolWithFilterSizeEqualsOneProgram(convInfo);
    }
    else {
        program = new Pool2DProgram(convInfo, 'avg');
    }
    var dimensions = [
        { type: 'int32', data: [convInfo.padInfo.top, convInfo.padInfo.left] },
        { type: 'int32', data: [convInfo.strideHeight, convInfo.strideWidth] },
        { type: 'int32', data: [convInfo.dilationHeight, convInfo.dilationWidth] },
        { type: 'int32', data: [convInfo.inHeight, convInfo.inWidth] }, {
            type: 'int32',
            data: [convInfo.effectiveFilterHeight, convInfo.effectiveFilterWidth]
        }
    ];
    return backend.runWebGPUProgram(program, [x], x.dtype, dimensions);
}
var avgPoolConfig = {
    kernelName: tf.AvgPool,
    backendName: 'webgpu',
    kernelFunc: avgPool
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function batchMatMul(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var a = inputs.a, b = inputs.b;
    var transposeA = attrs.transposeA, transposeB = attrs.transposeB;
    return batchMatMulImpl({ a: a, b: b, transposeA: transposeA, transposeB: transposeB, backend: backend });
}
var batchMatMulConfig = {
    kernelName: tf.BatchMatMul,
    backendName: 'webgpu',
    kernelFunc: batchMatMul,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var SliceProgram = /** @class */ (function () {
    function SliceProgram(start, destSize) {
        this.variableNames = ['source'];
        this.workPerThread = 1;
        this.workGroupSize = [64, 1, 1];
        this.outputShape = destSize;
        this.rank = destSize.length;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [this.workPerThread, 1, 1]);
        this.start = start;
        this.uniforms = getCoordsDataType(start.length) + " start; ";
        this.shaderKey = 'slice';
        this.size = tf.util.sizeFromShape(this.outputShape);
    }
    SliceProgram.prototype.getUserCode = function () {
        var dtype = getCoordsDataType(this.rank);
        var sourceCoords = getCoords(this.rank);
        var coordSum;
        if (this.start.length === 1) {
            coordSum = this.outputShape.map(function (_, i) {
                return "sourceLoc." + coords[i] + " = start + coords." + coords[i] + ";";
            });
        }
        else {
            coordSum = this.outputShape.map(function (_, i) {
                return "sourceLoc." + coords[i] + " = start[" + i + "] + coords." + coords[i] + ";";
            });
        }
        var userCode = "\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n        if (index < size)\n        {\n          " + dtype + " sourceLoc;\n          " + dtype + " coords = getOutputCoords();\n          " + coordSum.join('\n') + "\n          setOutput(index, getSource(" + sourceCoords + "));\n        }\n      }\n    ";
        return userCode;
    };
    return SliceProgram;
}());
var coords = ['x', 'y', 'z', 'w', 'u', 'v'];
function getCoords(rank) {
    if (rank === 1) {
        return 'sourceLoc';
    }
    else if (rank <= 6) {
        return coords.slice(0, rank).map(function (coord) { return "sourceLoc." + coord; }).join(',');
    }
    else {
        throw Error("Slicing for rank " + rank + " is not yet supported");
    }
}

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function slice(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var begin = attrs.begin, size = attrs.size;
    var _a = tf.slice_util.parseSliceParams(x, begin, size), $begin = _a[0], $size = _a[1];
    tf.slice_util.assertParamsValid(x, $begin, $size);
    if (backend.shouldExecuteOnCPU([x]) || x.dtype === 'string') {
        var xBufferInfo = backend.tensorMap.get(x.dataId);
        var outValues = sliceImplCPU(xBufferInfo.values, $begin, $size, x.shape, x.dtype);
        return backend.makeTensorInfo($size, x.dtype, outValues);
    }
    if (tf.util.sizeFromShape($size) === 0) {
        return backend.makeTensorInfo($size, x.dtype, []);
    }
    // TODO(xing.xu): Add shadow slice support.
    var program = new SliceProgram($begin, $size);
    var uniformData = [{ type: 'int32', data: $begin }];
    return backend.runWebGPUProgram(program, [x], x.dtype, uniformData);
}
var sliceConfig = {
    kernelName: tf.Slice,
    backendName: 'webgpu',
    kernelFunc: slice
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var batchToSpaceND = function (args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var blockShape = attrs.blockShape, crops = attrs.crops;
    tf.util.assert(x.shape.length <= 4, function () { return 'batchToSpaceND for rank > 4 with a WebGPU backend not ' +
        'implemented yet'; });
    var prod = blockShape.reduce(function (a, b) { return a * b; });
    var reshaped = tf.backend_util.getReshaped(x.shape, blockShape, prod);
    var permuted = tf.backend_util.getPermuted(reshaped.length, blockShape.length);
    var reshapedPermuted = tf.backend_util.getReshapedPermuted(x.shape, blockShape, prod);
    var sliceBeginCoords = tf.backend_util.getSliceBeginCoords(crops, blockShape.length);
    var sliceSize = tf.backend_util.getSliceSize(reshapedPermuted, crops, blockShape.length);
    var toDispose = [];
    var reshapedIntermediate = reshape({ inputs: { x: x }, backend: backend, attrs: { shape: reshaped } });
    var transposedIntermediate = transpose({ inputs: { x: reshapedIntermediate }, backend: backend, attrs: { perm: permuted } });
    var reshapedIntermediate2 = reshape({
        inputs: { x: transposedIntermediate },
        backend: backend,
        attrs: { shape: reshapedPermuted }
    });
    var sliced = slice({
        inputs: { x: reshapedIntermediate2 },
        backend: backend,
        attrs: { begin: sliceBeginCoords, size: sliceSize }
    });
    toDispose.push(reshapedIntermediate);
    toDispose.push(transposedIntermediate);
    toDispose.push(reshapedIntermediate2);
    toDispose.forEach(function (t) { return backend.disposeData(t.dataId); });
    return sliced;
};
var batchToSpaceNDConfig = {
    kernelName: tf.BatchToSpaceND,
    backendName: 'webgpu',
    kernelFunc: batchToSpaceND
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var notEqual = binaryKernelFunc({
    opSnippet: BinaryOpType.NOT_EQUAL,
    dtype: 'bool',
    cpuKernelImpl: notEqualImplCPU
});
var notEqualConfig = {
    kernelName: tf.NotEqual,
    backendName: 'webgpu',
    kernelFunc: notEqual
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function real(args) {
    var inputs = args.inputs, backend = args.backend;
    var input = inputs.input;
    var inputData = backend.tensorMap.get(input.dataId);
    return identity({ inputs: { x: inputData.complexTensorInfos.real }, backend: backend });
}
var realConfig = {
    kernelName: tf.Real,
    backendName: 'webgpu',
    kernelFunc: real
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function int(input, backend) {
    var program = new UnaryOpProgram(input.shape, TO_INT);
    var output = backend.runWebGPUProgram(program, [input], 'int32');
    return { dataId: output.dataId, shape: output.shape, dtype: output.dtype };
}

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function cast(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var dtype = attrs.dtype;
    // Casting to complex64.
    if (dtype === 'complex64') {
        if (x.dtype === 'complex64') {
            return identity({ inputs: { x: x }, backend: backend });
        }
        // TODO: Import kernel function once zeros is modularized.
        var zerosTensor = tf.zeros(x.shape);
        var floatX = cast({ inputs: { x: x }, backend: backend, attrs: { dtype: 'float32' } });
        var result = complex({ inputs: { real: floatX, imag: zerosTensor }, backend: backend });
        zerosTensor.dispose();
        backend.disposeData(floatX.dataId);
        return result;
    }
    // Casting from complex64
    if (x.dtype === 'complex64') {
        var realPart = real({ inputs: { input: x }, backend: backend });
        var result = cast({ inputs: { x: realPart }, backend: backend, attrs: { dtype: dtype } });
        backend.disposeData(realPart.dataId);
        return result;
    }
    if (!tf.util.hasEncodingLoss(x.dtype, dtype)) {
        // We don't change the underlying data, since we cast to higher
        // precision.
        var result = identity({ inputs: { x: x }, backend: backend });
        return { dataId: result.dataId, shape: result.shape, dtype: dtype };
    }
    if (dtype === 'int32') {
        return int(x, backend);
    }
    if (dtype === 'bool') {
        var zerosTensorInfo = backend.makeTensorInfo([], 'bool', tf.util.getTypedArrayFromDType('bool', 1));
        var binaryInputs = { a: x, b: zerosTensorInfo };
        var result = notEqual({ inputs: binaryInputs, backend: backend });
        return result;
    }
    throw new Error("Error in Cast: failed to cast " + x.dtype + " to " + dtype);
}
var castConfig = {
    kernelName: tf.Cast,
    backendName: 'webgpu',
    kernelFunc: cast
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var CEIL = "return ceil(a);";
var ceil = unaryKernelFunc({ opSnippet: CEIL, cpuKernelImpl: ceilImplCPU });
var ceilConfig = {
    kernelName: tf.Ceil,
    backendName: 'webgpu',
    kernelFunc: ceil
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var ClipVec4Program = /** @class */ (function () {
    function ClipVec4Program(outputShape) {
        this.variableNames = ['A'];
        this.uniforms = 'float minVal; float maxVal;';
        this.workPerThread = 4;
        this.workGroupSize = [64, 1, 1];
        this.isVec4 = true;
        this.outputShape = outputShape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [this.workPerThread, 1, 1]);
        this.shaderKey = 'clipVec4';
        this.size = tf.util.sizeFromShape(this.outputShape) / 4;
    }
    ClipVec4Program.prototype.getUserCode = function () {
        var userCode = "\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n          if(index < size) {\n            vec4 value = getAAtOutCoords();\n            if (any(isnan(value))) {\n              setOutput(index, value);\n              return;\n            }\n\n            setOutput(index, clamp(value, minVal, maxVal));\n          }\n      }\n    ";
        return userCode;
    };
    return ClipVec4Program;
}());

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var ClipProgram = /** @class */ (function () {
    function ClipProgram(outputShape) {
        this.variableNames = ['A'];
        this.uniforms = 'float minVal; float maxVal;';
        this.workGroupSize = [64, 1, 1];
        this.outputShape = outputShape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        this.shaderKey = 'clip';
        this.size = tf.util.sizeFromShape(this.outputShape);
    }
    ClipProgram.prototype.getUserCode = function () {
        var userCode = "\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n        if(index < size) {\n          float value = getAAtOutCoords();\n          if (isnan(value)) {\n            setOutput(index, value);\n            return;\n          }\n          setOutput(index, clamp(value, minVal, maxVal));\n        }\n      }\n    ";
        return userCode;
    };
    return ClipProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function clipByValue(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var clipValueMin = attrs.clipValueMin, clipValueMax = attrs.clipValueMax;
    var program;
    var uniformData = [
        { type: 'float32', data: [clipValueMin] },
        { type: 'float32', data: [clipValueMax] }
    ];
    if (tf.util.sizeFromShape(x.shape) % 4 === 0) {
        program = new ClipVec4Program(x.shape);
    }
    else {
        program = new ClipProgram(x.shape);
    }
    return backend.runWebGPUProgram(program, [x], x.dtype, uniformData);
}
var clipByValueConfig = {
    kernelName: tf.ClipByValue,
    backendName: 'webgpu',
    kernelFunc: clipByValue
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var ConcatProgram = /** @class */ (function () {
    function ConcatProgram(shapes) {
        this.workPerThread = 4;
        this.workGroupSize = [64, 1, 1];
        this.outputShape =
            tf.backend_util.computeOutShape(shapes, 1 /* axis */);
        this.variableNames = shapes.map(function (_, i) { return "T" + i; });
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [this.workPerThread, 1, 1]);
        this.shapes = shapes;
        // shapes is used by const snippets.
        this.shaderKey = "concat" + shapes;
        this.size = tf.util.sizeFromShape(this.outputShape);
    }
    ConcatProgram.prototype.getUserCode = function () {
        var offsets = new Array(this.shapes.length - 1);
        var snippets = [];
        if (offsets.length > 0) {
            offsets[0] = this.shapes[0][1];
            for (var i = 1; i < offsets.length; i++) {
                offsets[i] = offsets[i - 1] + this.shapes[i][1];
            }
            snippets.push("if (yC < " + offsets[0] + ") setOutput(coords.x, coords.y, getT0(yR, yC));");
            for (var i = 1; i < offsets.length; i++) {
                var shift = offsets[i - 1];
                snippets.push("else if (yC < " + offsets[i] + ") " +
                    ("setOutput(coords.x, coords.y, getT" + i + "(yR, yC-" + shift + "));"));
            }
            var lastIndex = offsets.length;
            var lastShift = offsets[offsets.length - 1];
            snippets.push("else setOutput(coords.x, coords.y, getT" + lastIndex + "(yR, yC-" + lastShift + "));");
        }
        else {
            snippets.push("setOutput(coords.x, coords.y, getT0(yR, yC));");
        }
        var userCode = "\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n\n        for(int i = 0; i < " + this.workPerThread + "; i++) {\n          int flatIndex = index * " + this.workPerThread + " + i;\n          if(flatIndex < size) {\n            ivec2 coords = getCoordsFromFlatIndex(flatIndex);\n            int yR = coords.x;\n            int yC = coords.y;\n\n            " + snippets.join('\n        ') + "\n          }\n        }\n      }\n    ";
        return userCode;
    };
    return ConcatProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function imag(args) {
    var inputs = args.inputs, backend = args.backend;
    var input = inputs.input;
    var inputData = backend.tensorMap.get(input.dataId);
    return identity({ inputs: { x: inputData.complexTensorInfos.imag }, backend: backend });
}
var imagConfig = {
    kernelName: tf.Imag,
    backendName: 'webgpu',
    kernelFunc: imag
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function concatImpl$1(inputs, axis, backend) {
    var dtype = inputs[0].dtype;
    if (dtype === 'complex64') {
        var reals = inputs.map(function (t) { return real({ inputs: { input: t }, backend: backend }); });
        var imags = inputs.map(function (t) { return imag({ inputs: { input: t }, backend: backend }); });
        var realConcated = concatImpl$1(reals, axis, backend);
        var imagConcated = concatImpl$1(imags, axis, backend);
        var result = complex({ inputs: { real: realConcated, imag: imagConcated }, backend: backend });
        reals.forEach(function (r) { return backend.disposeData(r.dataId); });
        imags.forEach(function (i) { return backend.disposeData(i.dataId); });
        backend.disposeData(realConcated.dataId);
        backend.disposeData(imagConcated.dataId);
        return result;
    }
    var runOnCpu = backend.shouldExecuteOnCPU(inputs);
    // Run on cpu if dtype is string. For string, the backend represents it
    // as Uint8Array[], where each Uint8Array is a character. Given that the
    // computation is only on the outer array, uploading the whole data onto
    // gpu is wasteful. Also, currently webgpu doesn't have a design to
    // upload and retrieve Uint8Array[] between cpu and gpu. Therefore, we
    // just run the kernel on cpu if dtype is string.
    if (dtype === 'string') {
        runOnCpu = true;
    }
    if (runOnCpu) {
        // Any concat of n-dimensional tensors across any axis can be reduced to
        // a concatenation of two-dimensional tensors across the axis 1 by first
        // partitioning the axes of the original tensors into those less than the
        // axis to be concatenated and the rest. Then reshape the tensors
        // into a two-dimensional tensor by collapsing these two sets of axes and
        // concatenate the resulting matrices across the axis 1, finally reshaping
        // the result to have the proper shape.
        var tensors2D_1 = inputs.map(function (t) {
            var innerSize = tf.util.sizeFromShape(t.shape.slice(axis));
            var shape = [-1, innerSize];
            return reshape({ inputs: { x: t }, backend: backend, attrs: { shape: shape } });
        });
        var inputsValShapes = tensors2D_1.map(function (t) {
            return { vals: backend.readSync(t.dataId), shape: t.shape };
        });
        // Concats 2d tensors along axis=1.
        var outShape_1 = tf.backend_util.computeOutShape(tensors2D_1.map(function (t) { return t.shape; }), 1 /* axis */);
        var simplyConcat = tensors2D_1[0].shape[0] === 1;
        var outVals = concatImplCPU(inputsValShapes, outShape_1, dtype, simplyConcat);
        var finalOutShape = tf.backend_util.computeOutShape(inputs.map(function (t) { return t.shape; }), axis);
        var outInfo = backend.makeTensorInfo(finalOutShape, dtype, outVals);
        tensors2D_1.forEach(function (t) { return backend.disposeData(t.dataId); });
        return outInfo;
    }
    var _a = computeTensors2D(inputs, axis, backend), tensors2D = _a.tensors2D, outShape = _a.outShape;
    var program = new ConcatProgram((tensors2D).map(function (t) { return t.shape; }));
    var res = backend.runWebGPUProgram(program, tensors2D, tensors2D[0].dtype);
    tensors2D.forEach(function (r) { return backend.disposeData(r.dataId); });
    var reshapedResult = reshape({ inputs: { x: res }, backend: backend, attrs: { shape: outShape } });
    backend.disposeData(res.dataId);
    return reshapedResult;
}
function computeTensors2D(inputs, axis, backend) {
    var outShape = tf.backend_util.computeOutShape(inputs.map(function (t) { return t.shape; }), axis);
    var tensors2D = inputs.map(function (t) { return reshape({
        inputs: { x: t },
        backend: backend,
        attrs: {
            shape: [
                tf.util.sizeFromShape(t.shape.slice(0, axis)),
                tf.util.sizeFromShape(t.shape.slice(axis))
            ]
        }
    }); });
    return { tensors2D: tensors2D, outShape: outShape };
}

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function concat(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var axis = attrs.axis;
    var $axis = tf.util.parseAxisParam(axis, inputs[0].shape)[0];
    var outShape = tf.backend_util.computeOutShape(inputs.map(function (t) { return t.shape; }), $axis);
    if (tf.util.sizeFromShape(outShape) === 0) {
        return backend.makeTensorInfo(outShape, inputs[0].dtype, []);
    }
    // Keep only non-empty tensors (ignore tensors with 0 in their shape).
    var $inputs = inputs.filter(function (t) { return tf.util.sizeFromShape(t.shape) > 0; });
    if ($inputs.length === 1) {
        return identity({ inputs: { x: $inputs[0] }, backend: backend });
    }
    var shapes = $inputs.map(function (t) { return t.shape; });
    tf.backend_util.assertParamsConsistent(shapes, $axis);
    return concatImpl$1($inputs, $axis, backend);
}
var concatConfig = {
    kernelName: tf.Concat,
    backendName: 'webgpu',
    kernelFunc: concat
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var Im2ColProgram = /** @class */ (function () {
    function Im2ColProgram(outputShape, isChannelsLast) {
        this.variableNames = ['A'];
        this.uniforms = "ivec2 pad, stride, dilation; int outWidth, itemsPerBlockRow,\n      inChannels;";
        this.workPerThread = 4;
        this.workGroupSize = [64, 1, 1];
        this.outputShape = outputShape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [this.workPerThread, 1, 1]);
        this.isChannelsLast = isChannelsLast;
        this.shaderKey = "im2col_" + this.isChannelsLast;
        this.size = tf.util.sizeFromShape(this.outputShape);
    }
    Im2ColProgram.prototype.getUserCode = function () {
        var rowDim = this.isChannelsLast ? 0 : 1;
        var colDim = this.isChannelsLast ? 1 : 2;
        var userCode = "\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n\n        for(int i=0; i<" + this.workPerThread + "; i++) {\n          int flatIndex = index * " + this.workPerThread + " + i;\n\n          ivec2 rc = getCoordsFromFlatIndex(flatIndex);\n\n          if(flatIndex < size) {\n            int blockIndex = rc[0];\n            int pos = rc[1];\n\n            int offsetY = int(blockIndex / outWidth) * stride[1] - pad[1];\n            int d0 = offsetY + dilation[1] * (pos / itemsPerBlockRow);\n            float value = 0.0;\n            if(d0 < aShape[" + rowDim + "] && d0 >= 0) {\n              int offsetX = int(mod(blockIndex, outWidth) * stride[0] -\n                pad[0]);\n              int d1 = offsetX + dilation[0] * (int(mod(pos,\n                itemsPerBlockRow) / inChannels));\n              int ch = int(mod(pos, inChannels));\n              if(d1 < aShape[" + colDim + "] && d1 >= 0) {\n                value = getA(d0, d1, ch);\n              }\n            }\n            setOutput(flatIndex, value);\n          }\n        }\n      }\n    ";
        return userCode;
    };
    return Im2ColProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// For 1x1 kernels that iterate through every point in the input, convolution
// can be expressed as matrix multiplication (without need for memory
// remapping).
function conv2dByMatMul(_a) {
    var x = _a.x, filter = _a.filter, convInfo = _a.convInfo, backend = _a.backend, _b = _a.bias, bias = _b === void 0 ? null : _b, _c = _a.preluActivationWeights, preluActivationWeights = _c === void 0 ? null : _c, _d = _a.leakyreluAlpha, leakyreluAlpha = _d === void 0 ? 0 : _d, _e = _a.activation, activation = _e === void 0 ? null : _e;
    var xShape = x.shape;
    var isChannelsLast = convInfo.dataFormat === 'channelsLast';
    var transposeA = false;
    var transposeB = false;
    var targetShape = isChannelsLast ? xShape[0] * xShape[1] * xShape[2] :
        xShape[0] * xShape[2] * xShape[3];
    var xReshaped = reshape({
        inputs: { x: x },
        backend: backend,
        attrs: { shape: [1, targetShape, convInfo.inChannels] }
    });
    var filterReshaped = reshape({
        inputs: { x: filter },
        backend: backend,
        attrs: { shape: [1, convInfo.inChannels, convInfo.outChannels] }
    });
    var result = batchMatMulImpl({
        a: xReshaped,
        b: filterReshaped,
        transposeA: transposeA,
        transposeB: transposeB,
        backend: backend,
        bias: bias,
        activation: activation,
        preluActivationWeights: preluActivationWeights,
        leakyreluAlpha: leakyreluAlpha
    });
    var out = reshape({ inputs: { x: result }, backend: backend, attrs: { shape: convInfo.outShape } });
    backend.disposeData(xReshaped.dataId);
    backend.disposeData(filterReshaped.dataId);
    backend.disposeData(result.dataId);
    return out;
}
// Implements the im2row algorithm as outlined in "High Performance
// Convolutional Neural Networks for Document Processing" (Suvisoft, 2006)
function conv2dWithIm2Col(_a) {
    var x = _a.x, filter = _a.filter, convInfo = _a.convInfo, backend = _a.backend, _b = _a.bias, _c = _a.preluActivationWeights, _d = _a.leakyreluAlpha, _e = _a.activation;
    // Rearranges conv2d input so each block to be convolved over forms the
    // column of a new matrix with shape [filterWidth * filterHeight *
    // inChannels, outHeight * outWidth]. The filter is also rearranged so each
    // output channel forms a row of a new matrix with shape [outChannels,
    // filterWidth * filterHeight * inChannels]. The convolution is then
    // computed by multiplying these matrices and reshaping the result.
    var filterWidth = convInfo.filterWidth, filterHeight = convInfo.filterHeight, inChannels = convInfo.inChannels, strideWidth = convInfo.strideWidth, strideHeight = convInfo.strideHeight, padInfo = convInfo.padInfo, outWidth = convInfo.outWidth, outHeight = convInfo.outHeight, dilationWidth = convInfo.dilationWidth, dilationHeight = convInfo.dilationHeight, dataFormat = convInfo.dataFormat;
    var isChannelsLast = dataFormat === 'channelsLast';
    var sharedDim = filterWidth * filterHeight * inChannels;
    var numCols = outHeight * outWidth;
    var x2ColShape = [numCols, sharedDim];
    var transposeA = false;
    var transposeB = false;
    var intermediates = [];
    var xSqueezed = reshape({ inputs: { x: x }, backend: backend, attrs: { shape: x.shape.slice(1) } });
    var w2Row = reshape({ inputs: { x: filter }, backend: backend, attrs: { shape: [1, sharedDim, -1] } });
    intermediates.push(xSqueezed);
    intermediates.push(w2Row);
    var im2ColProgram = new Im2ColProgram(x2ColShape, isChannelsLast);
    var dimensions = [
        { type: 'int32', data: [padInfo.left, padInfo.top] },
        { type: 'int32', data: [strideWidth, strideHeight] },
        { type: 'int32', data: [dilationWidth, dilationHeight] },
        { type: 'int32', data: [outWidth] },
        { type: 'int32', data: [inChannels * filterWidth] },
        { type: 'int32', data: [inChannels] }
    ];
    var im2Col = backend.runWebGPUProgram(im2ColProgram, [xSqueezed], xSqueezed.dtype, dimensions);
    var im2Col3D = reshape({
        inputs: { x: im2Col },
        backend: backend,
        attrs: { shape: [1, x2ColShape[0], x2ColShape[1]] }
    });
    intermediates.push(im2Col);
    intermediates.push(im2Col3D);
    var matMulProgram = new MatMulPackedProgram([1, x2ColShape[0], x2ColShape[1]], [1, numCols, convInfo.outChannels], tf.env().get('WEBGPU_MATMUL_WORK_PER_THREAD'), transposeA, transposeB);
    var result = backend.runWebGPUProgram(matMulProgram, [im2Col3D, w2Row], im2Col3D.dtype);
    var outShape = isChannelsLast ?
        [1, outHeight, outWidth, convInfo.outChannels] :
        [1, convInfo.outChannels, outHeight, outWidth];
    var out = reshape({ inputs: { x: result }, backend: backend, attrs: { shape: outShape } });
    intermediates.push(result);
    for (var _i = 0, intermediates_1 = intermediates; _i < intermediates_1.length; _i++) {
        var i = intermediates_1[_i];
        backend.disposeData(i.dataId);
    }
    return out;
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var Conv2DMMVec4Program = /** @class */ (function () {
    function Conv2DMMVec4Program(convInfo, addBias, activation, hasPreluActivationWeights, hasLeakyreluAlpha) {
        var _a;
        if (addBias === void 0) { addBias = false; }
        if (activation === void 0) { activation = null; }
        if (hasPreluActivationWeights === void 0) { hasPreluActivationWeights = false; }
        if (hasLeakyreluAlpha === void 0) { hasLeakyreluAlpha = false; }
        this.variableNames = ['x', 'W'];
        this.uniforms = 'ivec2 filterDims, pad, stride, dilation;';
        this.isVec4 = true;
        this.outputShape = convInfo.outShape;
        tf.util.assert(convInfo.dataFormat === 'channelsLast', function () { return 'TODO: NCHW is unimplemented'; });
        this.dispatchLayout = { x: [3], y: [1, 2], z: [0] };
        this.workGroupSize = [16, 16, 1];
        var elementsPerThread = [4, 4, 1];
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, elementsPerThread);
        this.convInfo = convInfo;
        this.addBias = addBias;
        this.activation = activation;
        this.hasPreluActivationWeights = hasPreluActivationWeights;
        this.hasLeakyreluAlpha = hasLeakyreluAlpha;
        if (this.addBias) {
            this.variableNames.push('bias');
        }
        if (this.hasPreluActivationWeights) {
            this.variableNames.push('preluActivationWeights');
        }
        if (this.hasLeakyreluAlpha) {
            this.variableNames.push('leakyreluAlpha');
        }
        _a = this.getShapeFit(elementsPerThread), this.fitA = _a[0], this.fitB = _a[1];
        this.shaderKey =
            "conv2DMMVec4_" + this.activation + "_" + this.fitA + "_" + this.fitB;
    }
    Conv2DMMVec4Program.prototype.getShapeFit = function (elementsPerThread) {
        var tileAOuter = this.workGroupSize[1] * elementsPerThread[1];
        var tileBOuter = this.workGroupSize[0] * elementsPerThread[0];
        var tileInner = tileBOuter;
        var tileSizeA = [tileAOuter, tileInner];
        var tileSizeB = [tileInner, tileBOuter];
        var dimAOuter = this.outputShape[1] * this.outputShape[2];
        var dimBOuter = this.outputShape[3];
        var dimInner = this.convInfo.filterHeight * this.convInfo.filterWidth *
            this.convInfo.inChannels;
        return [
            tilesFitEvenlyIntoShape(tileSizeA, [dimAOuter, dimInner]),
            tilesFitEvenlyIntoShape(tileSizeB, [dimInner, dimBOuter])
        ];
    };
    Conv2DMMVec4Program.prototype.getUserCode = function () {
        var elementsPerThread = [4, 4, 1];
        var matMulSource = makeMatMulPackedVec4Source(elementsPerThread);
        // Below code only applys to valid padding type.
        var sampleAWithRemainder = "int flatIndex = getFlatIndex(coord, xShape);\n        int divBy4Remainder = flatIndex % 4;\n        int divBy4Index = flatIndex / 4;\n        vec4 curData = x[divBy4Index];\n        if (divBy4Remainder == 0) {\n          temp = curData;\n        } else {\n          // TODO: This could end up being a redundant load with another one in\n          // the same shader invocation. Perhaps there's an opportunity for\n          // optimization\n          vec4 nextData = x[divBy4Index + 1];\n          if (divBy4Remainder == 1) {\n            temp = vec4(curData.yzw, nextData.x);\n          } else if (divBy4Remainder == 2) {\n            temp = vec4(curData.zw, nextData.xy);\n          } else if (divBy4Remainder == 3) {\n            temp = vec4(curData.w, nextData.xyz);\n          }\n        }\n        ";
        var remainder = this.convInfo.inChannels % 4;
        var remainderSnippet = remainder === 0 ?
            "// The bounds checking is always needed since we use it to pad zero for\n        // the 'same' padding type.\n        resData = coordsInBounds(coord, xShape) ?\n        x[getFlatIndex(coord, xShape) / 4] : vec4(0.0, 0.0, 0.0, 0.0);" :
            "vec4 temp = vec4(0, 0, 0, 0);\n        " + sampleAWithRemainder + "\n        resData = temp;\n        if (WCol == (filterDims[1] - 1)) {\n          coord = ivec4(\n            coord.x, coord.y + 1, coord.z + 1 - filterDims[1], 0);\n          " + sampleAWithRemainder + "\n          if (inChCoord == 0) {\n            resData = vec4(resData.xyz, temp.x);\n          } else if (inChCoord == 1) {\n            resData = vec4(resData.xy, temp.xy);\n          } else {\n            resData = vec4(resData.x, temp.xyz);\n          }\n        }\n        ";
        var readASnippet = "int outRow = r / outShape[2];\n        int outCol = r % outShape[2];\n        int WRow = c / (filterDims[1] * xShape[3]);\n        int WCol = (c / xShape[3]) % filterDims[1];\n        int inChCoord = c % xShape[3];\n        ivec4 coord = ivec4(\n            batch,\n            outRow * stride[0] + dilation[0] * WRow - pad[0],\n            outCol * stride[1] + dilation[1] * WCol - pad[1],\n            inChCoord);\n        vec4 resData = vec4(0, 0, 0, 0);\n        " + remainderSnippet + "\n        return resData;";
        var sampleA = this.fitA ? "" + readASnippet : "if (r < dimAOuter && c < dimInner) {\n          " + readASnippet + "\n        } else {\n          return vec4(0.0, 0.0, 0.0, 0.0);\n        }";
        var sampleB = this.fitB ?
            "W[row * dimBOuter / 4 + col]" :
            "coordsInBounds(ivec2(row, col * 4), ivec2(dimInner, dimBOuter)) ?\n            W[row * dimBOuter / 4 + col] : vec4(0.0, 0.0, 0.0, 0.0)";
        var activationSnippet = '', applyActivationSnippet = '';
        if (this.activation) {
            if (this.hasPreluActivationWeights) {
                activationSnippet = "vec4 activation(vec4 a, ivec4 outCoord) {\n          vec4 b = getPreluActivationWeightsAtOutCoords(outCoord);\n          " + this.activation + "\n        }";
            }
            else if (this.hasLeakyreluAlpha) {
                activationSnippet = "vec4 activation(vec4 a) {\n          vec4 b = getLeakyreluAlphaAtOutCoords();\n          " + this.activation + "\n        }";
                throw new Error('Leakyrelu is not supported.');
            }
            else {
                activationSnippet = "\n        vec4 activation(vec4 a, ivec4 outCoord) {\n          " + this.activation + "\n        }";
            }
            applyActivationSnippet = "value = activation(value, outCoord);";
        }
        var addBiasSnippet = this.addBias ? 'ivec4 coords = getOutputCoords(); ' +
            'value += getBiasAtOutCoords(outCoord);' :
            '';
        var userCode = "\n        " + activationSnippet + "\n        " + matMulSource + "\n\n        int batch;\n        int dimAOuter = outShape[1] * outShape[2];\n        int dimBOuter = outShape[3];\n        int dimInner = filterDims[0] * filterDims[1] * xShape[3];\n        vec4 mm_readA(int row, int col) {\n          int r = int(row), c = int(col * 4);\n          " + sampleA + ";\n        }\n\n        vec4 mm_readB(int row, int col) {\n          return " + sampleB + ";\n        }\n\n        void mm_write(int row, int col, vec4 value) {\n          if (row < dimAOuter && col * 4 < dimBOuter)\n          {\n            ivec4 outCoord = ivec4(\n              batch,\n              row / outShape[2],\n              row % outShape[2],\n              col * 4);\n            " + addBiasSnippet + "\n            " + applyActivationSnippet + "\n            setOutput(outCoord[0], outCoord[1], outCoord[2], outCoord[3],\n              value);\n          }\n        }\n\n        void main() {\n          batch = int(gl_GlobalInvocationID.z);\n\n          mm_matMul(dimAOuter, dimInner, dimBOuter);\n        }\n      ";
        return userCode;
    };
    return Conv2DMMVec4Program;
}());

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var Conv2DMMProgram = /** @class */ (function () {
    function Conv2DMMProgram(convInfo, addBias, activation, hasPreluActivationWeights) {
        var _a;
        if (addBias === void 0) { addBias = false; }
        if (activation === void 0) { activation = null; }
        if (hasPreluActivationWeights === void 0) { hasPreluActivationWeights = false; }
        this.variableNames = ['x', 'W'];
        this.uniforms = 'ivec2 filterDims, pad, stride, dilation;';
        this.outputShape = convInfo.outShape;
        tf.util.assert(convInfo.dataFormat === 'channelsLast', function () { return 'TODO: NCHW is unimplemented'; });
        this.dispatchLayout = { x: [3], y: [1, 2], z: [0] };
        this.workGroupSize =
            computeWorkGroupSizeForConv2d(this.dispatchLayout, this.outputShape);
        this.elementsPerThread =
            computeWorkPerThreadForConv2d(this.dispatchLayout, this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, this.elementsPerThread);
        if (addBias) {
            this.variableNames.push('bias');
        }
        if (hasPreluActivationWeights) {
            this.variableNames.push('preluActivationWeights');
        }
        this.convInfo = convInfo;
        this.addBias = addBias;
        this.activation = activation;
        this.hasPreluActivationWeights = hasPreluActivationWeights;
        _a = this.getShapeFit(), this.fitA = _a[0], this.fitB = _a[1];
        this.shaderKey = "conv2DMM_" + this.elementsPerThread + "_" + this.activation + "_" + this.fitA + "_" + this.fitB;
    }
    Conv2DMMProgram.prototype.getShapeFit = function () {
        var tileAOuter = this.workGroupSize[1] * this.elementsPerThread[1];
        var tileBOuter = this.workGroupSize[0] * this.elementsPerThread[0];
        var tileInner = tileAOuter > tileBOuter ? tileAOuter : tileBOuter;
        tf.util.assert(tileInner % this.workGroupSize[0] === 0 &&
            tileInner % this.workGroupSize[1] === 0, function () {
            // tslint:disable-next-line: max-line-length
            return 'tileInner must be multiple of workgroupsize.x and workgroupsize.y';
        });
        var tileSizeA = [tileAOuter, tileInner];
        var tileSizeB = [tileInner, tileBOuter];
        var dimAOuter = this.outputShape[1] * this.outputShape[2];
        var dimBOuter = this.outputShape[3];
        var dimInner = this.convInfo.filterHeight * this.convInfo.filterWidth *
            this.convInfo.inChannels;
        return [
            tilesFitEvenlyIntoShape(tileSizeA, [dimAOuter, dimInner]),
            tilesFitEvenlyIntoShape(tileSizeB, [dimInner, dimBOuter])
        ];
    };
    Conv2DMMProgram.prototype.getUserCode = function () {
        var matMulSource = makeMatMulPackedSource(this.elementsPerThread);
        var readASnippet = "\n    int outRow = row / outShape[2];\n    int outCol = row % outShape[2];\n\n    int WRow = col / (filterDims[1] * xShape[3]);\n    int WCol = (col / xShape[3]) % filterDims[1];\n\n    ivec4 coord = ivec4(\n        batch,\n        outRow * stride[0] + dilation[0] * WRow - pad[0],\n        outCol * stride[1] + dilation[1] * WCol - pad[1],\n        col % xShape[3]);\n    // The bounds checking is always needed since we use it to pad zero for the\n    // 'same' padding type.\n    return coordsInBounds(coord, xShape) ? x[getFlatIndex(coord, xShape)] : 0;";
        var sampleA = this.fitA ? "" + readASnippet :
            "if (row < dimAOuter && col < dimInner) {\n      " + readASnippet + "\n    } else {\n      return 0;\n    }";
        var sampleB = this.fitB ?
            "W[row * dimBOuter + col]" :
            "coordsInBounds(ivec2(row, col), ivec2(dimInner, dimBOuter)) ?\n        W[row * dimBOuter + col] : 0";
        var activationSnippet = '', applyActivationSnippet = '';
        if (this.activation) {
            if (this.hasPreluActivationWeights) {
                activationSnippet = "float activation(float a, ivec4 outCoord) {\n                  float b = getPreluActivationWeightsAtOutCoords(outCoord);\n                  " + this.activation + "\n                }";
            }
            else {
                activationSnippet = "\n                  float activation(float a, ivec4 outCoord) {\n                    " + this.activation + "\n                  }\n                ";
            }
            applyActivationSnippet = "value = activation(value, outCoord);";
        }
        var addBiasSnippet = this.addBias ? 'value += getBiasAtOutCoords(outCoord);' : '';
        var userCode = "\n    " + activationSnippet + "\n    " + matMulSource + "\n\n    int batch;\n    int dimAOuter = outShape[1] * outShape[2];\n    int dimBOuter = outShape[3];\n    int dimInner = filterDims[0] * filterDims[1] * xShape[3];\n    float mm_readA(int row, int col) {\n      " + sampleA + "\n    }\n\n    float mm_readB(int row, int col) {\n      return " + sampleB + ";\n    }\n\n    void mm_write(int row, int col, float value) {\n      ivec4 outCoord = ivec4(\n          batch,\n          row / outShape[2],\n          row % outShape[2],\n          col);\n      " + addBiasSnippet + "\n      " + applyActivationSnippet + "\n      result[getFlatIndex(outCoord, outShape)] = value;\n    }\n\n    void main() {\n      batch = int(gl_GlobalInvocationID.z);\n\n      mm_matMul(dimAOuter, dimInner, dimBOuter);\n    }\n  ";
        return userCode;
    };
    return Conv2DMMProgram;
}());

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var Conv2DNaiveProgram = /** @class */ (function () {
    function Conv2DNaiveProgram(convInfo, addBias, activation, hasPreluActivationWeights) {
        if (addBias === void 0) { addBias = false; }
        if (activation === void 0) { activation = null; }
        if (hasPreluActivationWeights === void 0) { hasPreluActivationWeights = false; }
        this.variableNames = ['x', 'W'];
        this.uniforms = 'ivec2 filterDims, pad, stride, dilation;';
        this.workGroupSize = [128, 1, 1];
        this.outputShape = convInfo.outShape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        tf.util.assert(convInfo.dataFormat === 'channelsLast', function () { return 'TODO: NCHW is unimplemented'; });
        if (addBias) {
            this.variableNames.push('bias');
        }
        if (hasPreluActivationWeights) {
            this.variableNames.push('preluActivationWeights');
        }
        this.convInfo = convInfo;
        this.addBias = addBias;
        this.activation = activation;
        this.hasPreluActivationWeights = hasPreluActivationWeights;
        this.shaderKey = "conv2DNaive_" + activation;
    }
    Conv2DNaiveProgram.prototype.getUserCode = function () {
        var activationSnippet = '', applyActivationSnippet = '';
        if (this.activation) {
            if (this.hasPreluActivationWeights) {
                activationSnippet = "float activation(float a) {\n                  float b = getPreluActivationWeightsAtOutCoords();\n                  " + this.activation + "\n                }";
            }
            else {
                activationSnippet = "\n                  float activation(float a) {\n                    " + this.activation + "\n                  }\n                ";
            }
            applyActivationSnippet = "value = activation(value);";
        }
        var addBiasSnippet = this.addBias ? 'value += getBiasAtOutCoords();' : '';
        var userCode = "\n      " + activationSnippet + "\n      float readInp(int batch, int row, int col, int chan) {\n        ivec4 coord = ivec4(batch, row, col, chan);\n        return coordsInBounds(coord, xShape) ?\n          getX(batch, row, col, chan) : 0;\n      }\n\n      float readFilt(int row, int col, int xChannel, int outChannel) {\n        ivec4 coord = ivec4(row, col, xChannel, outChannel);\n        return coordsInBounds(coord, wShape) ?\n          getW(row, col, xChannel, outChannel) : 0;\n      }\n\n      void writeResult(int batch, int row, int col, int chan, float value) {\n        ivec4 coord = ivec4(batch, row, col, chan);\n        if (coordsInBounds(coord, outShape)) {\n          " + addBiasSnippet + "\n          " + applyActivationSnippet + "\n          setOutput(batch, row, col, chan, value);\n        }\n      }\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int outChannel = coords[3];\n\n        float acc = 0.0;\n\n        for (int row = 0; row < filterDims[0]; ++row) {\n          for (int col = 0; col < filterDims[1]; ++col) {\n            for (int xChannel = 0; xChannel < xShape[3]; ++xChannel) {\n              float v = readInp(batch,\n                  coords[1] * stride[0] + dilation[0] * row - pad[0],\n                  coords[2] * stride[1] + dilation[1] * col - pad[1],\n                  xChannel);\n              float f = readFilt(row, col, xChannel, outChannel);\n              acc += v * f;\n            }\n          }\n        }\n\n        writeResult(batch, coords[1], coords[2], outChannel, acc);\n      }\n    ";
        return userCode;
    };
    return Conv2DNaiveProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function conv2d(args) {
    var inputs = args.inputs, attrs = args.attrs, backend = args.backend;
    var x = inputs.x, filter = inputs.filter;
    var strides = attrs.strides, pad = attrs.pad, dataFormat = attrs.dataFormat, dilations = attrs.dilations, dimRoundingMode = attrs.dimRoundingMode;
    var $dataFormat = tf.backend_util.convertConv2DDataFormat(dataFormat);
    var convInfo = tf.backend_util.computeConv2DInfo(x.shape, filter.shape, strides, dilations, pad, dimRoundingMode, false /* depthwise */, $dataFormat);
    if (convInfo.filterHeight === 1 && convInfo.filterWidth === 1 &&
        convInfo.dilationHeight === 1 && convInfo.dilationWidth === 1 &&
        convInfo.strideHeight === 1 && convInfo.strideWidth === 1 &&
        (convInfo.padInfo.type === 'SAME' || convInfo.padInfo.type === 'VALID')) {
        return conv2dByMatMul({ x: x, filter: filter, convInfo: convInfo, backend: backend });
    }
    if (tf.env().getBool('WEBGPU_CONV_SEPARATE_IM2COL_SHADER') && x.shape[0] === 1) {
        return conv2dWithIm2Col({ x: x, filter: filter, convInfo: convInfo, backend: backend });
    }
    var program;
    if (tf.env().getBool('WEBGPU_USE_NAIVE_CONV2D')) {
        // TODO(kainino0x): This may be obsolete, but is kept for reference.
        program = new Conv2DNaiveProgram(convInfo);
    }
    else if (
    // TODO(jiajia.qin@intel.com): It seems that the vec4 version is not
    // good if convInfo.outChannels is too small. For example, input = [1,
    // 128, 128, 4], filter = [25, 25, 4, 4]. In this case, lots of theads
    // will run idle. So temporarily, use 64 as the threshold.
    (convInfo.inChannels % 4 === 0 ||
        (convInfo.inChannels === 3 && convInfo.padInfo.type === 'VALID')) &&
        convInfo.outChannels % 4 === 0 && convInfo.outChannels >= 64) {
        program = new Conv2DMMVec4Program(convInfo);
    }
    else {
        program = new Conv2DMMProgram(convInfo);
    }
    var padInfo = [convInfo.padInfo.top, convInfo.padInfo.left];
    var dimensions = [
        { type: 'int32', data: [convInfo.filterHeight, convInfo.filterWidth] },
        { type: 'int32', data: padInfo.slice() },
        { type: 'int32', data: [convInfo.strideHeight, convInfo.strideWidth] },
        { type: 'int32', data: [convInfo.dilationHeight, convInfo.dilationWidth] }
    ];
    return backend.runWebGPUProgram(program, [x, filter], x.dtype, dimensions);
}
var conv2DConfig = {
    kernelName: tf.Conv2D,
    backendName: 'webgpu',
    kernelFunc: conv2d
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var Conv2DDerInputMMProgram = /** @class */ (function () {
    function Conv2DDerInputMMProgram(convInfo) {
        this.variableNames = ['x', 'W'];
        this.uniforms = 'ivec2 filterDims, pads, stride; ivec4 outBackprop;';
        this.outputShape = convInfo.inShape;
        tf.util.assert(convInfo.dataFormat === 'channelsLast', function () { return 'TODO: NCHW is unimplemented'; });
        this.dispatchLayout = { x: [3], y: [1, 2], z: [0] };
        this.workGroupSize =
            computeWorkGroupSizeForConv2d(this.dispatchLayout, this.outputShape);
        this.elementsPerThread =
            computeWorkPerThreadForConv2d(this.dispatchLayout, this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, this.elementsPerThread);
        this.shaderKey = "conv2DDerInputMM_" + this.elementsPerThread;
    }
    Conv2DDerInputMMProgram.prototype.getUserCode = function () {
        var matMulSource = makeMatMulPackedSource(this.elementsPerThread);
        var readASnippet = "\n    int outRow = row / outShape[2];\n    int outCol = row % outShape[2];\n\n    int WRow = col / (filterDims[1] * outBackprop[3]);\n    int WCol = (col / outBackprop[3]) % filterDims[1];\n    float xR = float(outRow - pads[0] + WRow) / float(stride[0]);\n    float xC = float(outCol - pads[1] + WCol) / float(stride[1]);\n    if (xR < 0.0 || xR >= float(outBackprop[1]) || fract(xR) > 0.0) {\n      return 0;\n    }\n    if (xC < 0.0 || xC >= float(outBackprop[2]) || fract(xC) > 0.0) {\n      return 0;\n    }\n    ivec4 coord = ivec4(\n        batch,\n        int(xR),\n        int(xC),\n        col % outBackprop[3]);\n    return x[getFlatIndex(coord, xShape)];";
        var sampleA = "if (row < dimAOuter && col < dimInner) {\n      " + readASnippet + "\n    } else {\n      return 0;\n    }";
        var userCode = "\n    " + matMulSource + "\n\n    int batch;\n    int dimAOuter = outShape[1] * outShape[2];\n    int dimBOuter = outShape[3];\n    int dimInner = filterDims[0] * filterDims[1] * outBackprop[3];\n\n    float mm_readA(int row, int col) {\n      " + sampleA + "\n    }\n\n    float mm_readB(int row, int col) {\n      if (row < dimInner && col < dimBOuter)\n      {\n        int WRow = row / (filterDims[1] * outBackprop[3]);\n        int WCol = (row / outBackprop[3]) % filterDims[1];\n        ivec4 coord = ivec4(\n            filterDims.x - 1 - WRow,\n            filterDims.y - 1 - WCol,\n            col,\n            row % outBackprop[3]);\n        return W[getFlatIndex(coord, wShape)];\n      } else\n      {\n        return 0;\n      }\n    }\n\n    void mm_write(int row, int col, float value) {\n      ivec4 outCoord = ivec4(\n          batch,\n          row / outShape[2],\n          row % outShape[2],\n          col);\n      result[getFlatIndex(outCoord, outShape)] = value;\n    }\n\n    void main() {\n      batch = int(gl_GlobalInvocationID.z);\n\n      mm_matMul(dimAOuter, dimInner, dimBOuter);\n    }\n  ";
        return userCode;
    };
    return Conv2DDerInputMMProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var Conv2DDerInputProgram = /** @class */ (function () {
    function Conv2DDerInputProgram(convInfo) {
        this.variableNames = ['dy', 'W'];
        this.uniforms = 'ivec2 filterDims, pads, stride; ivec4 outBackprop;';
        this.workGroupSize = [64, 1, 1];
        this.outputShape = convInfo.inShape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        this.isChannelsLast = convInfo.dataFormat === 'channelsLast';
        this.shaderKey = "conv2DDerInput_" + this.isChannelsLast;
    }
    Conv2DDerInputProgram.prototype.getUserCode = function () {
        var rowDim = this.isChannelsLast ? 1 : 2;
        var colDim = this.isChannelsLast ? 2 : 3;
        var channelDim = this.isChannelsLast ? 3 : 1;
        return "\n    void main() {\n      ivec4 coords = getOutputCoords();\n      if (coordsInBounds(coords, outShape)) {\n        int batch = coords[0];\n        int d1 = coords[" + channelDim + "];\n\n        ivec2 dyCorner = ivec2(coords[" + rowDim + "], coords[" + colDim + "]) - pads;\n        int dyRCorner = dyCorner.x;\n        int dyCCorner = dyCorner.y;\n\n        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < filterDims.x; wR++) {\n          float dyR = float(dyRCorner + wR) / float(stride.x);\n\n          if (dyR < 0.0 || dyR >= float(outBackprop[1]) || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          int wRPerm = filterDims.x - 1 - wR;\n\n          for (int wC = 0; wC < filterDims.y; wC++) {\n            float dyC = float(dyCCorner + wC) / float(stride.y);\n\n            if (dyC < 0.0 || dyC >= float(outBackprop[2]) ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            int wCPerm = filterDims.y - 1 - wC;\n\n            for (int d2 = 0; d2 < outBackprop[3]; d2++) {\n\n              if (" + this.isChannelsLast + ") {\n                float xValue = getDy(batch, idyR, idyC, d2);\n                float wValue = getW(wRPerm, wCPerm, d1, d2);\n                dotProd += xValue * wValue;\n              } else {\n                float xValue = getDy(batch, d2, idyR, idyC);\n                float wValue = getW(wRPerm, wCPerm, d1, d2);\n                dotProd += xValue * wValue;\n              }\n\n            }\n          }\n        }\n        setOutput(coords[0], coords[1], coords[2], coords[3], dotProd);\n      }\n    }\n  ";
    };
    return Conv2DDerInputProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function conv2DBackpropInput(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var dy = inputs.dy, filter = inputs.filter;
    var inputShape = attrs.inputShape, strides = attrs.strides, pad = attrs.pad, dataFormat = attrs.dataFormat, dimRoundingMode = attrs.dimRoundingMode;
    var $dataFormat = tf.backend_util.convertConv2DDataFormat(dataFormat);
    var convInfo = tf.backend_util.computeConv2DInfo(inputShape, filter.shape, strides, 1 /* dilations */, pad, dimRoundingMode, false, $dataFormat);
    var program;
    if (tf.env().getBool('WEBGPU_USE_NAIVE_CONV2D_TRANSPOSE')) {
        // Keep Conv2DDerInputProgram for reference.
        program = new Conv2DDerInputProgram(convInfo);
    }
    else {
        program = new Conv2DDerInputMMProgram(convInfo);
    }
    var dimensions = [
        { type: 'int32', data: [convInfo.filterHeight, convInfo.filterWidth] },
        {
            type: 'int32',
            data: [
                convInfo.filterHeight - 1 - convInfo.padInfo.top,
                convInfo.filterWidth - 1 - convInfo.padInfo.left
            ]
        },
        { type: 'int32', data: [convInfo.strideHeight, convInfo.strideWidth] },
        {
            type: 'int32',
            data: [
                convInfo.batchSize, convInfo.outHeight, convInfo.outWidth,
                convInfo.outChannels
            ]
        },
    ];
    return backend.runWebGPUProgram(program, [dy, filter], 'float32', dimensions);
}
var conv2DBackpropInputConfig = {
    kernelName: tf.Conv2DBackpropInput,
    backendName: 'webgpu',
    kernelFunc: conv2DBackpropInput,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var CropAndResizeProgram = /** @class */ (function () {
    function CropAndResizeProgram(channnel, boxShape, cropSize, method) {
        this.variableNames = ['Image', 'Boxes', 'BoxInd'];
        this.uniforms = 'float extrapolationValue;';
        this.workGroupSize = [64, 1, 1];
        var numBoxes = boxShape[0];
        this.outputShape = [numBoxes, cropSize[0], cropSize[1], channnel];
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        this.methodId = method === 'bilinear' ? 1 : 0;
        this.cropHeightBiggerThan1 = this.outputShape[1] > 1;
        this.cropWidthBiggerThan1 = this.outputShape[2] > 1;
        this.shaderKey = "cropAndResize_" + this.methodId + "_" + this.cropHeightBiggerThan1 + "_" + this.cropWidthBiggerThan1;
    }
    CropAndResizeProgram.prototype.getUserCode = function () {
        var _a = ["float(imageShape[1] - 1)", "float(imageShape[2] - 1)"], inputHeightFloat = _a[0], inputWidthFloat = _a[1];
        var _b = this.cropHeightBiggerThan1 ?
            [
                "(" + inputHeightFloat + " / float(outShape[1] - 1))",
                '(y2-y1) * height_ratio',
                "y1*" + inputHeightFloat + " + float(y)*(height_scale)",
            ] :
            [
                '0.0',
                '0.0',
                "0.5 * (y1+y2) * " + inputHeightFloat,
            ], heightRatio = _b[0], heightScale = _b[1], inY = _b[2];
        var _c = this.cropWidthBiggerThan1 ?
            [
                "(" + inputWidthFloat + " / float(outShape[2] - 1))",
                '(x2-x1) * width_ratio',
                "x1*" + inputWidthFloat + " + float(x)*(width_scale)",
            ] :
            [
                '0.0',
                '0.0',
                "0.5 * (x1+x2) * " + inputWidthFloat,
            ], widthRatio = _c[0], widthScale = _c[1], inX = _c[2];
        // Reference implementation
        // tslint:disable-next-line:max-line-length
        // https://github.com/tensorflow/tensorflow/blob/master/tensorflow/core/kernels/crop_and_resize_op_gpu.cu.cc
        var userCode = "\n      void writeResult(ivec4 coords,float value) {\n        if (coordsInBounds(coords, outShape)) {\n          setOutput(coords[0], coords[1], coords[2], coords[3], value);\n        }\n      }\n      void main() {\n        const float height_ratio = float(" + heightRatio + ");\n        const float width_ratio = float(" + widthRatio + ");\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int y = coords[1];\n        int x = coords[2];\n        int d = coords[3];\n        // get box vals\n        float y1 = getBoxes(b,0);\n        float x1 = getBoxes(b,1);\n        float y2 = getBoxes(b,2);\n        float x2 = getBoxes(b,3);\n        // get image in batch index\n        int bInd = int(round(getBoxInd(b)));\n        if(bInd < 0 || bInd >= outShape[0]) {\n          return;\n        }\n        float height_scale = " + heightScale + ";\n        float width_scale = " + widthScale + ";\n        float in_y = " + inY + ";\n        if( in_y < 0.0 || in_y > " + inputHeightFloat + " ) {\n          writeResult(coords,extrapolationValue);\n          return;\n        }\n        float in_x = " + inX + ";\n        if( in_x < 0.0 || in_x > " + inputWidthFloat + " ) {\n          writeResult(coords,extrapolationValue);\n          return;\n        }\n        vec2 sourceFracIndexCR = vec2(in_x,in_y);\n        if(" + this.methodId + " == 1) {\n          // Compute the four integer indices.\n          ivec2 sourceFloorCR = ivec2(sourceFracIndexCR);\n          ivec2 sourceCeilCR = ivec2(ceil(sourceFracIndexCR));\n          float topLeft = getImage(bInd, sourceFloorCR.y, sourceFloorCR.x, d);\n          float bottomLeft = getImage(bInd, sourceCeilCR.y, sourceFloorCR.x, d);\n          float topRight = getImage(bInd, sourceFloorCR.y, sourceCeilCR.x, d);\n          float bottomRight = getImage(bInd, sourceCeilCR.y, sourceCeilCR.x, d);\n          vec2 fracCR = sourceFracIndexCR - vec2(sourceFloorCR);\n          float top = topLeft + (topRight - topLeft) * fracCR.x;\n          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;\n          float newValue = top + (bottom - top) * fracCR.y;\n          writeResult(coords,newValue);\n        } else {\n          // Compute the coordinators of nearest neighbor point.\n          ivec2 sourceNearestCR = ivec2(floor(\n            sourceFracIndexCR + vec2(0.5,0.5)));\n          float newValue = getImage(\n            bInd, sourceNearestCR.y, sourceNearestCR.x, d);\n          writeResult(coords,newValue);\n        }\n      }\n    ";
        return userCode;
    };
    return CropAndResizeProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var cropAndResize = function (args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var image = inputs.image, boxes = inputs.boxes, boxInd = inputs.boxInd;
    var cropSize = attrs.cropSize, method = attrs.method, extrapolationValue = attrs.extrapolationValue;
    var program = new CropAndResizeProgram(image.shape[3], boxes.shape, cropSize, method);
    var uniformData = [{ type: 'float32', data: [extrapolationValue] }];
    return backend.runWebGPUProgram(program, [image, boxes, boxInd], 'float32', uniformData);
};
var cropAndResizeConfig = {
    kernelName: tf.CropAndResize,
    backendName: 'webgpu',
    kernelFunc: cropAndResize
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var DepthwiseConv2DProgram = /** @class */ (function () {
    function DepthwiseConv2DProgram(convInfo, addBias, activation, hasPreluActivation) {
        if (addBias === void 0) { addBias = false; }
        if (activation === void 0) { activation = null; }
        if (hasPreluActivation === void 0) { hasPreluActivation = false; }
        this.variableNames = ['x', 'W'];
        this.uniforms = 'ivec2 filterDims, pad, stride, dilation, inDims;';
        // This is an experimental value.
        this.workGroupSize = [256, 1, 1];
        this.outputShape = convInfo.outShape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        tf.util.assert(convInfo.dataFormat === 'channelsLast', function () { return 'TODO: NCHW is unimplemented'; });
        if (addBias) {
            this.variableNames.push('bias');
        }
        if (hasPreluActivation) {
            this.variableNames.push('preluActivationWeights');
        }
        this.convInfo = convInfo;
        this.addBias = addBias;
        this.activation = activation;
        this.hasPreluActivation = hasPreluActivation;
        this.shaderKey = "depthwise_" + activation + "_" + this.convInfo.outChannels / this.convInfo.inChannels;
    }
    DepthwiseConv2DProgram.prototype.getUserCode = function () {
        var channelMul = this.convInfo.outChannels / this.convInfo.inChannels;
        var activationSnippet = '', applyActivationSnippet = '';
        if (this.activation) {
            if (this.hasPreluActivation) {
                activationSnippet = "float activation(float a) {\n          float b = getPreluActivationWeightsAtOutCoords();\n          " + this.activation + "\n        }";
            }
            else {
                activationSnippet = "\n          float activation(float a) {\n            " + this.activation + "\n          }\n        ";
            }
            applyActivationSnippet = "dotProd = activation(dotProd);";
        }
        var addBiasSnippet = this.addBias ? 'dotProd += getBiasAtOutCoords();' : '';
        var userCode = "\n      " + activationSnippet + "\n\n      void writeResult(int batch, int row, int col, int chan, float value) {\n        ivec4 coord = ivec4(batch, row, col, chan);\n        if (coordsInBounds(coord, outShape)) {\n          setOutput(batch, row, col, chan, value);\n        }\n      }\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        ivec2 xRCCorner = coords.yz * stride - pad;\n        int d2 = coords[3];\n        int d1 = d2 / " + channelMul + ";\n        int q = d2 - d1 * " + channelMul + ";\n\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // Convolve x(?, ?, d1) with w(:, :, d1, q) to get y(yR, yC, d2).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        // TODO(xing.xu): Flatten the two for loops and vec4 the operations.\n        for (int wR = 0; wR < filterDims[0]; wR++) {\n          int xR = xRCorner + wR * dilation[0];\n\n          if (xR < 0 || xR >= inDims[0]) {\n            continue;\n          }\n\n          for (int wC = 0; wC < filterDims[1]; wC++) {\n            int xC = xCCorner + wC * dilation[1];\n\n            if (xC < 0 || xC >= inDims[1]) {\n              continue;\n            }\n\n            float xVal = getX(batch, xR, xC, d1);\n            float wVal = getW(wR, wC, d1, q);\n            dotProd += xVal * wVal;\n          }\n        }\n\n        " + addBiasSnippet + "\n        " + applyActivationSnippet + "\n        writeResult(batch, coords[1], coords[2], d2, dotProd);\n      }\n    ";
        return userCode;
    };
    return DepthwiseConv2DProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function depthwiseConv2dNative(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x, filter = inputs.filter;
    var strides = attrs.strides, pad = attrs.pad, dilations = attrs.dilations, dimRoundingMode = attrs.dimRoundingMode;
    var $dilations = dilations;
    if ($dilations == null) {
        $dilations = [1, 1];
    }
    var convInfo = tf.backend_util.computeConv2DInfo(x.shape, filter.shape, strides, $dilations, pad, dimRoundingMode, true /* depthwise */);
    var program = new DepthwiseConv2DProgram(convInfo);
    var dimensions = [
        { type: 'int32', data: [convInfo.filterHeight, convInfo.filterWidth] },
        { type: 'int32', data: [convInfo.padInfo.top, convInfo.padInfo.left] },
        { type: 'int32', data: [convInfo.strideHeight, convInfo.strideWidth] },
        { type: 'int32', data: [convInfo.dilationHeight, convInfo.dilationWidth] },
        { type: 'int32', data: [convInfo.inHeight, convInfo.inWidth] }
    ];
    return backend.runWebGPUProgram(program, [x, filter], x.dtype, dimensions);
}
var depthwiseConv2dNativeConfig = {
    kernelName: tf.DepthwiseConv2dNative,
    backendName: 'webgpu',
    kernelFunc: depthwiseConv2dNative,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var multiplyKernelFunc = binaryKernelFunc({
    opSnippet: BinaryOpType.MUL,
    cpuKernelImpl: multiplyImplCPU,
    supportsComplex: true
});
var multiplyConfig = {
    kernelName: tf.Multiply,
    backendName: 'webgpu',
    kernelFunc: multiplyKernelFunc
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var ReduceProgram = /** @class */ (function () {
    function ReduceProgram(reduceInfo, reduceType, outputDtype) {
        this.variableNames = ['x'];
        this.uniforms = 'int reduceSize;';
        this.inputShape = [reduceInfo.batchSize, reduceInfo.inSize];
        var outputShape = tf.backend_util.computeOutAndReduceShapes(this.inputShape, [1])[0];
        this.outputShape = outputShape.length === 0 ? [1] : outputShape;
        this.reductionFactor = 2;
        var xMaxThreads = 1024;
        var xThreads = Math.min(Math.ceil(reduceInfo.inSize / this.reductionFactor), xMaxThreads);
        this.workGroupSize = [xThreads, 1, 1];
        this.dispatchLayout = { x: [], y: this.outputShape.map(function (d, i) { return i; }) };
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        this.reduceType = reduceType;
        this.shaderKey = "reduce_" + reduceType + "_" + outputDtype;
    }
    ReduceProgram.prototype.getUserCode = function () {
        var reduceInSharedMemory = this.workGroupSize[0] > 1;
        var reduceOp = "";
        var initValue = '0.0';
        if (this.reduceType === 'min' || this.reduceType === 'max') {
            reduceOp = "\n         if (isnan(candidate)) {\n          bestValue = float(NAN);\n         } else if (candidate " + (this.reduceType === 'min' ? '<' : '>') + "\n           bestValue)\n           {  bestValue = candidate; }";
            initValue = 'float(x[offset])';
        }
        else if (this.reduceType === 'sum' || this.reduceType === 'mean') {
            reduceOp = ' bestValue += candidate; ';
        }
        else if (this.reduceType === 'prod') {
            reduceOp = ' bestValue *= candidate; ';
            initValue = '1.0';
        }
        var outputSnippet = this.reduceType === 'mean' ?
            "setOutput(flatOutputIndex, bestValue / float(reduceSize));" :
            "setOutput(flatOutputIndex, bestValue);";
        var sharedMemorySnippet = "\n         shared float xBestValues[WorkGroupSize];\n       ";
        var sharedMemoryReduceSnippet = "\n       xBestValues[gl_LocalInvocationID.x] = bestValue;\n       " + (this.reduceType === 'sum' || this.reduceType === 'mean' ||
            this.reduceType === 'prod' ?
            "bestValue=" + initValue + ";" :
            ' ') + "\n       int currentSize = WorkGroupSize;\n       while (currentSize > 1) {\n         barrier();\n         for (int w = 0; w < " + this.reductionFactor + "; ++w) {\n           int i = int(gl_LocalInvocationID.x) * " + this.reductionFactor + " + w;\n           if (i < currentSize) {\n             float candidate = xBestValues[i];\n             " + reduceOp + "\n           }\n         }\n         barrier();\n         xBestValues[gl_LocalInvocationID.x] = bestValue;\n         currentSize = DIV_CEIL(currentSize, " + this.reductionFactor + ");\n         " + (this.reduceType === 'sum' || this.reduceType === 'mean' ||
            this.reduceType === 'prod' ?
            "if(currentSize > 1) bestValue=" + initValue + ";" :
            '') + "\n       }\n       if (gl_LocalInvocationID.x == 0) {\n         " + outputSnippet + "\n       }\n     ";
        var outputCoordsType = getCoordsDataType(this.outputShape.length);
        var userCode = "\n       #define DIV_CEIL(x, y) (((x) - 1) / (y) + 1)\n       const int WorkGroupSize = int(gl_WorkGroupSize.x);\n       " + (reduceInSharedMemory ? sharedMemorySnippet : '') + "\n       int getOffset() {\n         const " + outputCoordsType + " outputCoords = getOutputCoords();\n         int offset = " + (this.outputShape.length === 1 ? 'outputCoords' :
            'outputCoords[0]') + " * reduceSize;\n         return offset;\n       }\n       void main() {\n         const int offset= getOffset();\n         float bestValue = " + initValue + ";\n         const int Length = reduceSize;\n         const int WorkPerThread = DIV_CEIL(Length, WorkGroupSize);\n         for (int w = 0; w < WorkPerThread; ++w) {\n           int i = int(gl_GlobalInvocationID.x) * WorkPerThread + w;\n           if (i < Length) {\n             float candidate = float(x[offset + i]);\n             " + reduceOp + "\n           }\n         }\n         const int flatOutputIndex = int(gl_GlobalInvocationID.y);\n         " + (reduceInSharedMemory ? sharedMemoryReduceSnippet : outputSnippet) + "\n       }\n     ";
        return userCode;
    };
    return ReduceProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function reduce(x, axis, keepDims, reduceType, backend) {
    var xRank = x.shape.length;
    var toDispose = [];
    var origAxes = tf.util.parseAxisParam(axis, x.shape);
    var axes = origAxes;
    var permutedAxes = tf.backend_util.getAxesPermutation(axes, xRank);
    var input = x;
    if (permutedAxes != null) {
        input = transpose({ inputs: { x: x }, attrs: { perm: permutedAxes }, backend: backend });
        axes = tf.backend_util.getInnerMostAxes(axes.length, xRank);
        toDispose.push(input);
    }
    tf.backend_util.assertAxesAreInnerMostDims(reduceType, axes, xRank);
    var _a = tf.backend_util.computeOutAndReduceShapes(input.shape, axes), reduceOutShape = _a[0], reduceShape = _a[1];
    var resOutShape = reduceOutShape;
    if (keepDims) {
        // rather than reshape at the end, set the target shape here.
        resOutShape = tf.backend_util.expandShapeToKeepDim(reduceOutShape, origAxes);
    }
    var res;
    if ((reduceType === 'max' || reduceType === 'prod') &&
        backend.shouldExecuteOnCPU([input])) {
        var xVals = backend.tensorMap.get(input.dataId).values;
        switch (reduceType) {
            case 'max':
                var outValues = maxImplCPU(xVals, tf.util.sizeFromShape(reduceShape), resOutShape, x.dtype);
                res = backend.makeTensorInfo(resOutShape, x.dtype, outValues);
                break;
            case 'prod':
                var _b = prodImplCPU(input.shape, input.dtype, xVals, axes), outVals = _b.outVals, outShape = _b.outShape, outDtype = _b.outDtype;
                res = backend.makeTensorInfo(outShape, outDtype, outVals);
                break;
            default:
                throw new Error(reduceType + " CPU implementation is not yet supported.");
        }
    }
    else {
        var inSize = tf.util.sizeFromShape(reduceShape);
        var xSize = tf.util.sizeFromShape(input.shape);
        var batchSize = xSize / inSize;
        var reduceInfo = { windowSize: inSize, inSize: inSize, batchSize: batchSize, outSize: 1 };
        var dtype = reduceType === 'mean' ? 'float32' : tf.sumOutType(x.dtype);
        var uniformData = [
            { type: 'int32', data: [inSize] },
        ];
        var program = new ReduceProgram(reduceInfo, reduceType, dtype);
        var reduced = backend.runWebGPUProgram(program, [input], dtype, uniformData);
        toDispose.push(reduced);
        res = reshape({ inputs: { x: reduced }, attrs: { shape: resOutShape }, backend: backend });
    }
    toDispose.forEach(function (t) { return backend.disposeData(t.dataId); });
    return res;
}

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function sum(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var axis = attrs.axis, keepDims = attrs.keepDims;
    return reduce(x, axis, keepDims, 'sum', backend);
}
var sumConfig = {
    kernelName: tf.Sum,
    backendName: 'webgpu',
    kernelFunc: sum
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function einsum(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var equation = attrs.equation;
    var tensors = inputs;
    var _a = tf.backend_util.decodeEinsumEquation(equation, tensors.length), allDims = _a.allDims, summedDims = _a.summedDims, idDims = _a.idDims;
    tf.backend_util.checkEinsumDimSizes(allDims.length, idDims, tensors);
    var _b = tf.backend_util.getEinsumComputePath(summedDims, idDims), path = _b.path, steps = _b.steps;
    var nSteps = steps.length;
    var out = null;
    var numDimsRemaining = allDims.length;
    var tensorsToDispose = [];
    for (var i = 0; i < nSteps; ++i) {
        for (var _i = 0, _c = steps[i]; _i < _c.length; _i++) {
            var idTerm = _c[_i];
            var _d = tf.backend_util.getEinsumPermutation(numDimsRemaining, idDims[idTerm]), perm = _d.permutationIndices, dimsToExpand = _d.expandDims;
            var x = void 0;
            if (tf.backend_util.isIdentityPermutation(perm)) {
                x = tensors[idTerm];
            }
            else {
                x = transpose({ inputs: { x: tensors[idTerm] }, backend: backend, attrs: { perm: perm } });
                tensorsToDispose.push(x);
            }
            var targetShape = x.shape.slice();
            for (var k = 0; k < dimsToExpand.length; ++k) {
                targetShape.splice(dimsToExpand[k], 0, 1);
            }
            if (!tf.util.arraysEqual(x.shape, targetShape)) {
                x = reshape({ inputs: { x: x }, backend: backend, attrs: { shape: targetShape } });
                tensorsToDispose.push(x);
            }
            if (out === null) {
                out = x;
            }
            else {
                // tslint:disable-next-line: no-unnecessary-type-assertion
                out =
                    multiplyKernelFunc({ inputs: { a: x, b: out }, backend: backend });
                tensorsToDispose.push(out);
            }
        }
        if (i < nSteps - 1) {
            if (path[i] >= 0) {
                out = sum({
                    inputs: { x: out },
                    backend: backend,
                    attrs: {
                        axis: path[i] - (allDims.length - numDimsRemaining),
                        keepDims: false
                    }
                });
                tensorsToDispose.push(out);
            }
            numDimsRemaining--;
        }
    }
    // Clean up intermediate tensors.
    for (var _e = 0, tensorsToDispose_1 = tensorsToDispose; _e < tensorsToDispose_1.length; _e++) {
        var tensorInfo = tensorsToDispose_1[_e];
        if (tensorInfo === out) {
            continue;
        }
        backend.disposeData(tensorInfo.dataId);
    }
    return out;
}
var einsumConfig = {
    kernelName: tf.Einsum,
    backendName: 'webgpu',
    kernelFunc: einsum
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var elu = unaryKernelFunc({ opSnippet: ELU });
var eluConfig = {
    kernelName: tf.Elu,
    backendName: 'webgpu',
    kernelFunc: elu
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var equal = binaryKernelFunc({ opSnippet: BinaryOpType.EQUAL, dtype: 'bool', cpuKernelImpl: equalImplCPU });
var equalConfig = {
    kernelName: tf.Equal,
    backendName: 'webgpu',
    kernelFunc: equal
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var exp = unaryKernelFunc({ opSnippet: EXP, cpuKernelImpl: expImplCPU });
var expConfig = {
    kernelName: tf.Exp,
    backendName: 'webgpu',
    kernelFunc: exp
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function expandDims(args) {
    var inputs = args.inputs, attrs = args.attrs, backend = args.backend;
    var dim = attrs.dim;
    var input = inputs.input;
    var inputRank = input.shape.length;
    var newShape = input.shape.slice();
    var $dim = dim;
    if (dim < 0) {
        // Negative value is counted from the tail of rank.
        tf.util.assert(-(inputRank + 1) <= dim, function () { return "Axis must be in the interval [" + -(inputRank + 1) + ", " + inputRank + "]"; });
        $dim = inputRank + dim + 1;
    }
    newShape.splice($dim, 0, 1);
    return reshape({ inputs: { x: input }, backend: backend, attrs: { shape: newShape } });
}
var expandDimsConfig = {
    kernelName: tf.ExpandDims,
    backendName: 'webgpu',
    kernelFunc: expandDims,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var EXPM1 = "return exp(a) - 1.0;";
var expm1 = unaryKernelFunc({ opSnippet: EXPM1, cpuKernelImpl: expm1ImplCPU });
var expm1Config = {
    kernelName: tf.Expm1,
    backendName: 'webgpu',
    kernelFunc: expm1
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var FillProgram = /** @class */ (function () {
    function FillProgram(shape) {
        this.variableNames = [];
        this.outputShape = [];
        this.uniforms = 'float value;';
        this.workPerThread = 4;
        this.workGroupSize = [16, 1, 1];
        this.outputShape = shape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [this.workPerThread, 1, 1]);
        this.shaderKey = 'fill';
        this.size = tf.util.sizeFromShape(this.outputShape);
    }
    FillProgram.prototype.getUserCode = function () {
        var userCode = "\n    void main() {\n      int index = int(gl_GlobalInvocationID.x);\n      for (int i = 0; i < " + this.workPerThread + "; i++) {\n        int flatIndex = index * " + this.workPerThread + " + i;\n        if (flatIndex < size) {\n          setOutput(flatIndex, float(value));\n        }\n      }\n    }\n  ";
        return userCode;
    };
    return FillProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function fill(args) {
    var backend = args.backend, attrs = args.attrs;
    var shape = attrs.shape, value = attrs.value;
    var dtype = attrs.dtype;
    dtype = dtype || tf.util.inferDtype(value);
    if (dtype === 'string') {
        // String type should be handled in CPU memory.
        var values = tf.util.getArrayFromDType(dtype, tf.util.sizeFromShape(shape));
        values.fill(value);
        return backend.makeTensorInfo(shape, dtype, values);
    }
    else {
        var program = new FillProgram(shape);
        var uniformData = [{ type: 'float32', data: [value] }];
        return backend.runWebGPUProgram(program, [], dtype, uniformData);
    }
}
var fillConfig = {
    kernelName: tf.Fill,
    backendName: 'webgpu',
    kernelFunc: fill
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var FLOOR = "return floor(a);";
var floor = unaryKernelFunc({ opSnippet: FLOOR, cpuKernelImpl: floorImplCPU });
var floorConfig = {
    kernelName: tf.Floor,
    backendName: 'webgpu',
    kernelFunc: floor
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var floorDiv = binaryKernelFunc({ opSnippet: BinaryOpType.INT_DIV, dtype: 'int32' });
var floorDivConfig = {
    kernelName: tf.FloorDiv,
    backendName: 'webgpu',
    kernelFunc: floorDiv
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var FromPixelsProgram = /** @class */ (function () {
    function FromPixelsProgram(outputShape) {
        this.outputShape = [0];
        this.variableNames = [];
        this.workGroupSize = [256, 1, 1]; // The empirical value.
        this.lastUniformData = [];
        this.inputTexture = null;
        this.lastPixelSize = { width: 0, height: 0 };
        this.disposed = false;
        this.updateOutputShape(outputShape);
        this.shaderKey = 'fromPixels';
    }
    FromPixelsProgram.prototype.updateOutputShape = function (outputShape) {
        if (tf.util.arraysEqual(this.outputShape, outputShape)) {
            return;
        }
        this.outputShape = outputShape;
        this.workPerThread = outputShape[2]; // numChannels in outputShape.
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [this.workPerThread, 1, 1]);
    };
    FromPixelsProgram.prototype.getUserCode = function () {
        var userCode = "\n    layout (local_size_x = " + this.workGroupSize[0] + ",\n      local_size_y = 1,\n      local_size_z = 1) in;\n    layout(set = 0, binding = 1, rgba8) uniform readonly image2D srcImage;\n    layout(set = 0, binding = 2) uniform Meta {\n      int size;\n      int numChannels;\n      ivec2 outShapeStrides;\n    };\n\n    ivec3 getCoordsFromFlatIndex(int flatIndexBase);\n\n    void main() {\n      int flatIndexBase = int(gl_GlobalInvocationID.x) * numChannels;\n      ivec3 coords = getCoordsFromFlatIndex(flatIndexBase);\n      int texR = coords[0];\n      int texC = coords[1];\n      int depth = coords[2];\n      vec4 values = imageLoad(srcImage, ivec2(texC, texR));\n      for(int i = 0; i < numChannels; i++) {\n        float value = values[i];\n        int flatIndex = flatIndexBase + i;\n        if (flatIndex < size) {\n          result[flatIndex] = int(floor(255.0 * value));\n        }\n      }\n    }\n    ";
        return userCode;
    };
    FromPixelsProgram.prototype.setPipeline = function (pipeline) {
        this.pipeline = pipeline;
    };
    FromPixelsProgram.prototype.setUniform = function (device, uniformData) {
        var _this = this;
        // Create the uniform buffer if it does not exist.
        // The uniform buffer size is fixed so we can hold
        // and reuse it always.
        if (!this.uniform) {
            var uniformBuffer = device.createBuffer({
                size: uniformData.length *
                    4,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
            this.uniform = uniformBuffer;
        }
        // No need to update uniform buffer if no changes.
        if (!uniformData ||
            ((uniformData.length === this.lastUniformData.length) &&
                uniformData.every(function (v, i) { return v === _this.lastUniformData[i]; }))) {
            return;
        }
        device.queue.writeBuffer(this.uniform, 0, new Uint32Array(uniformData));
        this.lastUniformData = uniformData;
    };
    FromPixelsProgram.prototype.makeInputTexture = function (device, pixelWidth, pixelHeight) {
        if (!this.inputTexture || this.lastPixelSize.width !== pixelWidth ||
            this.lastPixelSize.height !== pixelHeight) {
            if (this.inputTexture) {
                this.inputTexture.destroy();
            }
            this.inputTexture = device.createTexture({
                size: [pixelWidth, pixelHeight],
                format: 'rgba8unorm',
                usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE |
                    GPUTextureUsage.RENDER_ATTACHMENT,
            });
            this.lastPixelSize.width = pixelWidth;
            this.lastPixelSize.height = pixelHeight;
        }
        return this.inputTexture;
    };
    FromPixelsProgram.prototype.dispose = function () {
        if (this.disposed) {
            return;
        }
        if (this.uniform) {
            this.uniform.destroy();
        }
        if (this.inputTexture) {
            this.inputTexture.destroy();
        }
        this.disposed = true;
    };
    return FromPixelsProgram;
}());

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var makeBindGroup = function (device, bindGroupLayout, inputs, output, uniforms) {
    var bindings = [output].concat(inputs);
    if (uniforms) {
        bindings.push(uniforms);
    }
    return device.createBindGroup({
        layout: bindGroupLayout,
        entries: bindings.map(function (b, i) { return ({ binding: i, resource: b }); }),
    });
};
var compileProgram = function (glslang, device, program, pipelineLayout, inputsData, output, isFromPixel) {
    if (isFromPixel === void 0) { isFromPixel = false; }
    var outputData = { dtype: output.dtype, shape: output.shape };
    var source = makeShader(inputsData, outputData, program, isFromPixel);
    var result = glslang.compileGLSLZeroCopy(source, 'compute', false);
    if (result.data.length === 0) {
        throw new Error('Shader compilation failed');
    }
    var module = device.createShaderModule({ code: result.data });
    var pipeline = device.createComputePipeline({ layout: pipelineLayout, compute: { module: module, entryPoint: 'main' } });
    result.free();
    return pipeline;
};
function makeShaderKey(program, shapes, types, broadcastDimsKey, inputShapesEqualsOutShape) {
    if (broadcastDimsKey === void 0) { broadcastDimsKey = ''; }
    if (inputShapesEqualsOutShape === void 0) { inputShapesEqualsOutShape = ''; }
    var key = (program.workGroupSize ? program.workGroupSize.join(',') : '') +
        shapes.map(function (shape) { return shape.length; }).join(',') + types.join(',') +
        program.variableNames.join(',') + broadcastDimsKey +
        inputShapesEqualsOutShape + program.shaderKey;
    return key;
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use backend file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function fromPixelsImageBitmap(args) {
    var imageBitmap = args.imageBitmap, backend = args.backend, attrs = args.attrs;
    var numChannels = attrs.numChannels;
    var outShape = [imageBitmap.height, imageBitmap.width, numChannels];
    var size = tf.util.sizeFromShape(outShape);
    var strides = tf.util.computeStrides(outShape);
    var uniformData = [size, numChannels].concat(strides);
    var output = backend.makeTensorInfo(outShape, 'int32');
    if (!backend.fromPixelProgram) {
        backend.fromPixelProgram = new FromPixelsProgram(outShape);
    }
    else {
        backend.fromPixelProgram.updateOutputShape(outShape);
    }
    // Different outShape will affect preprocessor result,
    // e.g. getCoordsFromFlatIndex. FromPixelsImageBitmap need
    // to recompile the pipeline to get the correct result.
    // FromPixelsImageBitmap leverages webgpu backend pipeline
    // cache system to avoid useless recompile.
    var outputShapes = [output.shape];
    var outputTypes = [output.dtype];
    var key = makeShaderKey(backend.fromPixelProgram, outputShapes, outputTypes);
    var pipeline = backend.getAndSavePipeline(key, function () {
        return compileProgram(backend.glslang, backend.device, backend.fromPixelProgram, backend.fromPixelLayout.pipelineLayout, [], output, true);
    });
    backend.fromPixelProgram.setPipeline(pipeline);
    backend.queue.copyImageBitmapToTexture({ imageBitmap: imageBitmap, origin: { x: 0, y: 0 } }, {
        texture: backend.fromPixelProgram.makeInputTexture(backend.device, imageBitmap.width, imageBitmap.height)
    }, [imageBitmap.width, imageBitmap.height]);
    var info = backend.tensorMap.get(output.dataId);
    info.bufferInfo.buffer = backend.acquireBuffer(info.bufferInfo.byteSize);
    backend.fromPixelProgram.setUniform(backend.device, uniformData);
    backend.recordFromPixelsCommands(info.bufferInfo.buffer);
    backend.submitQueue();
    return output;
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use backend file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var fromPixelsConfig = {
    kernelName: tf.FromPixels,
    backendName: 'webgpu',
    kernelFunc: fromPixels,
};
var fromPixels2DContext;
function fromPixels(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var pixels = inputs.pixels;
    var numChannels = attrs.numChannels;
    if (pixels == null) {
        throw new Error('pixels passed to tf.browser.fromPixels() can not be null');
    }
    var outShape = [pixels.height, pixels.width, numChannels];
    var imageData = pixels.data;
    if (tf.env().getBool('IS_BROWSER')) {
        if (!(pixels instanceof HTMLVideoElement) &&
            !(pixels instanceof HTMLImageElement) &&
            !(pixels instanceof HTMLCanvasElement) &&
            !(pixels instanceof ImageData) && !(pixels instanceof ImageBitmap) &&
            !(pixels.data instanceof Uint8Array)) {
            throw new Error('pixels passed to tf.browser.fromPixels() must be either an ' +
                "HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData, " +
                "ImageBitmap " +
                "or {data: Uint32Array, width: number, height: number}, " +
                ("but was " + pixels.constructor.name));
        }
        if (pixels instanceof ImageBitmap) {
            return fromPixelsImageBitmap({ imageBitmap: pixels, backend: backend, attrs: attrs });
        }
        if (pixels instanceof HTMLVideoElement ||
            pixels instanceof HTMLImageElement ||
            pixels instanceof HTMLCanvasElement) {
            if (fromPixels2DContext == null) {
                fromPixels2DContext = document.createElement('canvas').getContext('2d');
            }
            fromPixels2DContext.canvas.width = pixels.width;
            fromPixels2DContext.canvas.height = pixels.height;
            fromPixels2DContext.drawImage(pixels, 0, 0, pixels.width, pixels.height);
            pixels = fromPixels2DContext.canvas;
        }
        // TODO: Remove this once we figure out how to upload textures directly to
        // WebGPU.
        var imageDataLivesOnGPU = pixels instanceof HTMLVideoElement ||
            pixels instanceof HTMLImageElement ||
            pixels instanceof HTMLCanvasElement;
        if (imageDataLivesOnGPU) {
            imageData =
                fromPixels2DContext.getImageData(0, 0, pixels.width, pixels.height)
                    .data;
        }
    }
    // TODO: Encoding should happen on GPU once we no longer have to download
    // image data to the CPU.
    var pixelArray = imageData;
    if (numChannels != null && numChannels !== 4) {
        pixelArray = new Uint8Array(pixels.width * pixels.height * numChannels);
        var dataLength = imageData.length;
        var j = 0;
        for (var i = 0; i < dataLength; i++) {
            if (i % 4 < numChannels) {
                pixelArray[j++] = imageData[i];
            }
        }
    }
    var output = backend.makeTensorInfo(outShape, 'int32');
    var info = backend.tensorMap.get(output.dataId);
    info.values = new Int32Array(pixelArray);
    backend.maybeReleaseBuffer(output.dataId);
    backend.uploadToGPU(output.dataId);
    return output;
}

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var BatchNormProgram = /** @class */ (function () {
    function BatchNormProgram(xShape, meanShape, varianceShape, offsetShape, scaleShape) {
        this.uniforms = 'float varianceEpsilon;';
        // This is an experimental value.
        this.workGroupSize = [128, 1, 1];
        this.variableNames = ['x', 'mean', 'variance'];
        tf.backend_util.assertAndGetBroadcastShape(xShape, meanShape);
        tf.backend_util.assertAndGetBroadcastShape(xShape, varianceShape);
        this.outputShape = xShape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        if (offsetShape != null) {
            tf.backend_util.assertAndGetBroadcastShape(xShape, offsetShape);
            this.variableNames.push('offset');
        }
        if (scaleShape != null) {
            tf.backend_util.assertAndGetBroadcastShape(xShape, scaleShape);
            this.variableNames.push('scale');
        }
        this.offsetShape = offsetShape;
        this.scaleShape = scaleShape;
        this.shaderKey = 'batchNorm';
    }
    BatchNormProgram.prototype.getUserCode = function () {
        var offsetSnippet = '0.0';
        if (this.offsetShape != null) {
            offsetSnippet = 'getOffsetAtOutCoords()';
        }
        var scaleSnippet = '1.0';
        if (this.scaleShape != null) {
            scaleSnippet = 'getScaleAtOutCoords()';
        }
        var dim = this.outputShape.length;
        var coordsDataType = getCoordsDataType(dim);
        var setOutput = 'setOutput(coords[0], coords[1], coords[2], coords[3], value);';
        if (dim === 2) {
            setOutput = 'setOutput(coords[0], coords[1], value);';
        }
        if (dim === 3) {
            setOutput = 'setOutput(coords[0], coords[1], coords[2], value);';
        }
        var userCode = "\n      void writeResult(" + coordsDataType + " coords,float value) {\n        if (coordsInBounds(coords, outShape)) {\n          " + setOutput + "\n        }\n      }\n      void main() {\n        " + coordsDataType + " coords = getOutputCoords();\n        float x = getXAtOutCoords();\n        float mean = getMeanAtOutCoords();\n        float variance = getVarianceAtOutCoords();\n        float offset = " + offsetSnippet + ";\n        float scale = " + scaleSnippet + ";\n        float inv = scale * inversesqrt(variance + float(varianceEpsilon));\n        writeResult(coords,dot(vec3(x, -mean, offset), vec3(inv, inv, 1)));\n      }\n  ";
        return userCode;
    };
    return BatchNormProgram;
}());

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var fusedBatchNormConfig = {
    kernelName: tf.FusedBatchNorm,
    backendName: 'webgpu',
    kernelFunc: function (_a) {
        var inputs = _a.inputs, attrs = _a.attrs, backend = _a.backend;
        var _b = inputs, x = _b.x, scale = _b.scale, offset = _b.offset, mean = _b.mean, variance = _b.variance;
        var varianceEpsilon = attrs.varianceEpsilon;
        var webGPUBackend = backend;
        var batchNormInputs = [x, mean, variance];
        var offsetShape = null;
        if (offset != null) {
            offsetShape = offset.shape;
            batchNormInputs.push(offset);
        }
        var scaleShape = null;
        if (scale != null) {
            scaleShape = scale.shape;
            batchNormInputs.push(scale);
        }
        var program = new BatchNormProgram(x.shape, mean.shape, variance.shape, offsetShape, scaleShape);
        var uniformData = [{ type: 'float32', data: [varianceEpsilon] }];
        return webGPUBackend.runWebGPUProgram(program, batchNormInputs, x.dtype, uniformData);
    }
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function fusedConv2d(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x, filter = inputs.filter, bias = inputs.bias, preluActivationWeights = inputs.preluActivationWeights;
    var strides = attrs.strides, pad = attrs.pad, dataFormat = attrs.dataFormat, dilations = attrs.dilations, dimRoundingMode = attrs.dimRoundingMode, activation = attrs.activation, leakyreluAlpha = attrs.leakyreluAlpha;
    var $dataFormat = tf.backend_util.convertConv2DDataFormat(dataFormat);
    var convInfo = tf.backend_util.computeConv2DInfo(x.shape, filter.shape, strides, dilations, pad, dimRoundingMode, false /* depthwise */, $dataFormat);
    var hasBias = bias != null;
    var hasPreluActivationWeights = preluActivationWeights != null;
    var program;
    if (convInfo.filterHeight === 1 && convInfo.filterWidth === 1 &&
        convInfo.dilationHeight === 1 && convInfo.dilationWidth === 1 &&
        convInfo.strideHeight === 1 && convInfo.strideWidth === 1 &&
        (convInfo.padInfo.type === 'SAME' || convInfo.padInfo.type === 'VALID')) {
        return conv2dByMatMul({
            x: x,
            filter: filter,
            convInfo: convInfo,
            backend: backend,
            bias: bias,
            activation: activation,
            preluActivationWeights: preluActivationWeights,
            leakyreluAlpha: leakyreluAlpha
        });
    }
    var useNaive = tf.env().getBool('WEBGPU_USE_NAIVE_CONV2D');
    var useVec4 = convInfo.inChannels % 4 === 0 && convInfo.outChannels % 4 === 0;
    var packed = !useNaive && useVec4;
    var fusedActivation = activation ?
        backend.mapActivationToShaderProgram(activation, packed) :
        null;
    if (useNaive) {
        // TODO(kainino0x): This may be obsolete, but is kept for reference.
        program = new Conv2DNaiveProgram(convInfo, hasBias, fusedActivation, hasPreluActivationWeights);
    }
    else if (useVec4) {
        program = new Conv2DMMVec4Program(convInfo, hasBias, fusedActivation, hasPreluActivationWeights);
    }
    else {
        program = new Conv2DMMProgram(convInfo, hasBias, fusedActivation, hasPreluActivationWeights);
    }
    var padInfo = [convInfo.padInfo.top, convInfo.padInfo.left];
    var inputVar = [x, filter];
    if (hasBias) {
        inputVar.push(bias);
    }
    if (hasPreluActivationWeights) {
        inputVar.push(preluActivationWeights);
    }
    var dimensions = [
        { type: 'int32', data: [convInfo.filterHeight, convInfo.filterWidth] },
        { type: 'int32', data: padInfo.slice() },
        { type: 'int32', data: [convInfo.strideHeight, convInfo.strideWidth] },
        { type: 'int32', data: [convInfo.dilationHeight, convInfo.dilationWidth] }
    ];
    return backend.runWebGPUProgram(program, inputVar, x.dtype, dimensions);
}
var fusedConv2DConfig = {
    kernelName: tf.FusedConv2D,
    backendName: 'webgpu',
    kernelFunc: fusedConv2d,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function fusedDepthwiseConv2D(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x, filter = inputs.filter, bias = inputs.bias, preluActivationWeights = inputs.preluActivationWeights;
    var strides = attrs.strides, pad = attrs.pad, dilations = attrs.dilations, dimRoundingMode = attrs.dimRoundingMode, activation = attrs.activation;
    var $dilations = dilations;
    if ($dilations == null) {
        $dilations = [1, 1];
    }
    tf.util.assert(tf.backend_util.eitherStridesOrDilationsAreOne(strides, $dilations), function () { return 'Error in depthwiseConv2d: Either strides or dilations must be ' +
        ("1. Got strides " + strides + " and dilations '" + $dilations + "'"); });
    var convInfo = tf.backend_util.computeConv2DInfo(x.shape, filter.shape, strides, $dilations, pad, dimRoundingMode, true /* depthwise */);
    var fusedActivation = activation ? backend.mapActivationToShaderProgram(activation) : null;
    var programInputs = [x, filter];
    var hasBias = bias != null;
    var hasPreluActivationWeights = preluActivationWeights != null;
    if (hasBias) {
        programInputs.push(bias);
    }
    if (hasPreluActivationWeights) {
        programInputs.push(preluActivationWeights);
    }
    var program = new DepthwiseConv2DProgram(convInfo, hasBias, fusedActivation, hasPreluActivationWeights);
    var dimensions = [
        { type: 'int32', data: [convInfo.filterHeight, convInfo.filterWidth] },
        { type: 'int32', data: [convInfo.padInfo.top, convInfo.padInfo.left] },
        { type: 'int32', data: [convInfo.strideHeight, convInfo.strideWidth] },
        { type: 'int32', data: [convInfo.dilationHeight, convInfo.dilationWidth] },
        { type: 'int32', data: [convInfo.inHeight, convInfo.inWidth] }
    ];
    var result = backend.runWebGPUProgram(program, programInputs, 'float32', dimensions);
    return result;
}
var fusedDepthwiseConv2DConfig = {
    kernelName: tf.FusedDepthwiseConv2D,
    backendName: 'webgpu',
    kernelFunc: fusedDepthwiseConv2D,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var GatherNDProgram = /** @class */ (function () {
    function GatherNDProgram(sliceDim, shape) {
        this.variableNames = ['A', 'indices'];
        this.workGroupSize = [64, 1, 1];
        this.outputShape = shape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        this.shaderKey = "gathernd_" + sliceDim;
        this.size = tf.util.sizeFromShape(this.outputShape);
        this.sliceDim = sliceDim;
        this.uniforms = "int sliceDim; " + getCoordsDataType(sliceDim) + " strides;";
    }
    GatherNDProgram.prototype.getUserCode = function () {
        var dtype = getCoordsDataType(this.outputShape.length);
        var strideString;
        if (this.sliceDim > 1) {
            strideString = 'strides[j]';
        }
        else {
            strideString = 'strides';
        }
        var userCode = "\n         void main() {\n          int currentIndex = int(gl_GlobalInvocationID.x);\n          " + dtype + " coords = getOutputCoords();\n          int flattenIndex = 0;\n          for (int j = 0; j < sliceDim; j++) {\n            int index = int(round(getIndices(coords[0], j)));\n            int strideNum = " + strideString + ";\n            flattenIndex += index * strideNum;\n          }\n          if (currentIndex < size) {\n            setOutput(currentIndex, getA(flattenIndex, coords[1]));\n          }\n        }\n      ";
        return userCode;
    };
    return GatherNDProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function gatherNd(args) {
    var inputs = args.inputs, backend = args.backend;
    var params = inputs.params, indices = inputs.indices;
    var indicesShape = indices.shape;
    var sliceRank = indicesShape[indicesShape.length - 1];
    var paramsSize = tf.util.sizeFromShape(params.shape);
    var _a = tf.backend_util.prepareAndValidate(params, indices), resultShape = _a[0], numSlices = _a[1], sliceSize = _a[2], strides = _a[3];
    var flattenIndices = reshape({ inputs: { x: indices }, backend: backend, attrs: { shape: [numSlices, sliceRank] } });
    var flattenX = reshape({
        inputs: { x: params },
        backend: backend,
        attrs: { shape: [(tf.util.sizeFromShape(params.shape) / sliceSize), sliceSize] }
    });
    if (backend.shouldExecuteOnCPU([params, indices]) ||
        params.dtype === 'string') {
        var indicesData = backend.readSync(indices.dataId);
        var paramsBuf = backend.bufferSync(params);
        var outValue = gatherNdImplCPU(indicesData, paramsBuf, params.dtype, numSlices, sliceRank, sliceSize, strides, params.shape, paramsSize);
        return backend.makeTensorInfo(resultShape, params.dtype, outValue.values);
    }
    var program = new GatherNDProgram(sliceRank, [numSlices, sliceSize]);
    var uniformData = [{ type: 'int32', data: [sliceRank] }, { type: 'int32', data: strides }];
    var res = backend.runWebGPUProgram(program, [flattenX, flattenIndices], flattenX.dtype, uniformData);
    var reshaped = reshape({ inputs: { x: res }, backend: backend, attrs: { shape: resultShape } });
    backend.disposeData(flattenIndices.dataId);
    backend.disposeData(flattenX.dataId);
    backend.disposeData(res.dataId);
    return reshaped;
}
var gatherNdConfig = {
    kernelName: tf.GatherNd,
    backendName: 'webgpu',
    kernelFunc: gatherNd
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var GatherProgram = /** @class */ (function () {
    function GatherProgram(aShape, outputShape) {
        this.variableNames = ['A', 'indices'];
        this.workGroupSize = [64, 1, 1];
        this.outputShape = aShape.slice();
        this.aShape = aShape;
        this.outputShape = outputShape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        this.shaderKey = "gather";
        this.size = tf.util.sizeFromShape(this.outputShape);
    }
    GatherProgram.prototype.getUserCode = function () {
        var sourceCoords = getSourceCoords(this.aShape);
        var userCode = "\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n        ivec4 resRC = getOutputCoords();\n        if (index < size) {\n          setOutput(index, getA(" + sourceCoords + "));\n        }\n      }\n    ";
        return userCode;
    };
    return GatherProgram;
}());
// The input and output are always flattened into rank 4 tensors.
function getSourceCoords(aShape) {
    var currentCoords = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w'];
    var sourceCoords = [];
    for (var i = 0; i < aShape.length; i++) {
        if (i === 2) {
            sourceCoords.push('int(getIndices(resRC.x, resRC.z))');
        }
        else {
            sourceCoords.push("" + currentCoords[i]);
        }
    }
    return sourceCoords.join();
}

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function gatherV2(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x, indices = inputs.indices;
    var axis = attrs.axis, batchDims = attrs.batchDims;
    var parsedAxis = tf.util.parseAxisParam(axis, x.shape)[0];
    var shapeInfo = tf.backend_util.segment_util.collectGatherOpShapeInfo(x, indices, parsedAxis, batchDims);
    var indicesSize = tf.util.sizeFromShape(indices.shape);
    var toDispose = [];
    var flattenX = reshape({
        inputs: { x: x },
        backend: backend,
        attrs: {
            shape: [
                shapeInfo.batchSize, shapeInfo.outerSize, shapeInfo.dimSize,
                shapeInfo.sliceSize
            ]
        }
    });
    var flattenIndex = reshape({
        inputs: { x: indices },
        backend: backend,
        attrs: { shape: [shapeInfo.batchSize, indicesSize / shapeInfo.batchSize] }
    });
    toDispose.push(flattenX);
    toDispose.push(flattenIndex);
    var flattenOutputShape = [
        shapeInfo.batchSize, shapeInfo.outerSize, indicesSize / shapeInfo.batchSize,
        shapeInfo.sliceSize
    ];
    if (backend.shouldExecuteOnCPU([x, indices])) {
        var indicesBufferInfo = backend.tensorMap.get(flattenIndex.dataId);
        var indicesValues = indicesBufferInfo.values;
        var indicesBuf = tf.buffer(flattenIndex.shape, flattenIndex.dtype, indicesValues);
        var xBufferInfo = backend.tensorMap.get(flattenX.dataId);
        var xValues = xBufferInfo.values;
        var xBuf = tf.buffer(flattenX.shape, flattenX.dtype, xValues);
        var outBuf = gatherV2ImplCPU(xBuf, indicesBuf, flattenOutputShape);
        toDispose.forEach(function (t) { return backend.disposeData(t.dataId); });
        return backend.makeTensorInfo(shapeInfo.outputShape, outBuf.dtype, outBuf.values);
    }
    var program = new GatherProgram(flattenX.shape, flattenOutputShape);
    var res = backend.runWebGPUProgram(program, [flattenX, flattenIndex], flattenX.dtype);
    toDispose.push(res);
    var reshaped = reshape({ inputs: { x: res }, backend: backend, attrs: { shape: shapeInfo.outputShape } });
    toDispose.forEach(function (t) { return backend.disposeData(t.dataId); });
    return reshaped;
}
var gatherV2Config = {
    kernelName: tf.GatherV2,
    backendName: 'webgpu',
    kernelFunc: gatherV2
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var greater = binaryKernelFunc({
    opSnippet: BinaryOpType.GREATER,
    cpuKernelImpl: greaterImplCPU,
    dtype: 'bool',
});
var greaterConfig = {
    kernelName: tf.Greater,
    backendName: 'webgpu',
    kernelFunc: greater
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var greaterEqual = binaryKernelFunc({
    opSnippet: BinaryOpType.GREATER_EQUAL,
    dtype: 'bool',
    cpuKernelImpl: greaterEqualImplCPU
});
var greaterEqualConfig = {
    kernelName: tf.GreaterEqual,
    backendName: 'webgpu',
    kernelFunc: greaterEqual
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var less = binaryKernelFunc({ opSnippet: BinaryOpType.LESS, dtype: 'bool', cpuKernelImpl: lessImplCPU });
var lessConfig = {
    kernelName: tf.Less,
    backendName: 'webgpu',
    kernelFunc: less
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var lessEqual = binaryKernelFunc({
    opSnippet: BinaryOpType.LESS_EQUAL,
    dtype: 'bool',
    cpuKernelImpl: lessEqualImplCPU
});
var lessEqualConfig = {
    kernelName: tf.LessEqual,
    backendName: 'webgpu',
    kernelFunc: lessEqual
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var log = unaryKernelFunc({ opSnippet: LOG, cpuKernelImpl: logImplCPU });
var logConfig = {
    kernelName: tf.Log,
    backendName: 'webgpu',
    kernelFunc: log
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var logicalAnd = binaryKernelFunc({
    opSnippet: BinaryOpType.LOGICAL_AND,
    dtype: 'bool'
});
var logicalAndConfig = {
    kernelName: tf.LogicalAnd,
    backendName: 'webgpu',
    kernelFunc: logicalAnd
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function max(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var reductionIndices = attrs.reductionIndices, keepDims = attrs.keepDims;
    return reduce(x, reductionIndices, keepDims, 'max', backend);
}
var maxConfig = {
    kernelName: tf.Max,
    backendName: 'webgpu',
    kernelFunc: max
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var maximum = binaryKernelFunc({
    opSnippet: BinaryOpType.MAX,
    cpuKernelImpl: maximumImplCPU,
});
var maximumConfig = {
    kernelName: tf.Maximum,
    backendName: 'webgpu',
    kernelFunc: maximum
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function maxPool(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var filterSize = attrs.filterSize, strides = attrs.strides, pad = attrs.pad, dimRoundingMode = attrs.dimRoundingMode;
    var dilations = 1;
    var convInfo = tf.backend_util.computePool2DInfo(x.shape, filterSize, strides, dilations, pad, dimRoundingMode);
    var program;
    if (convInfo.filterHeight === 1 && convInfo.filterWidth === 1) {
        if (tf.util.arraysEqual(convInfo.inShape, convInfo.outShape)) {
            return identity({ inputs: { x: x }, backend: backend });
        }
        program = new PoolWithFilterSizeEqualsOneProgram(convInfo);
    }
    else {
        program = new Pool2DProgram(convInfo, 'max');
    }
    var dimensions = [
        { type: 'int32', data: [convInfo.padInfo.top, convInfo.padInfo.left] },
        { type: 'int32', data: [convInfo.strideHeight, convInfo.strideWidth] },
        { type: 'int32', data: [convInfo.dilationHeight, convInfo.dilationWidth] },
        { type: 'int32', data: [convInfo.inHeight, convInfo.inWidth] }, {
            type: 'int32',
            data: [convInfo.effectiveFilterHeight, convInfo.effectiveFilterWidth]
        }
    ];
    return backend.runWebGPUProgram(program, [x], x.dtype, dimensions);
}
var maxPoolConfig = {
    kernelName: tf.MaxPool,
    backendName: 'webgpu',
    kernelFunc: maxPool
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function mean(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var keepDims = attrs.keepDims, axis = attrs.axis;
    return reduce(x, axis, keepDims, 'mean', backend);
}
var meanConfig = {
    kernelName: tf.Mean,
    backendName: 'webgpu',
    kernelFunc: mean
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function min(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var axis = attrs.axis, keepDims = attrs.keepDims;
    return reduce(x, axis, keepDims, 'min', backend);
}
var minConfig = {
    kernelName: tf.Min,
    backendName: 'webgpu',
    kernelFunc: min
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var minimum = binaryKernelFunc({
    opSnippet: BinaryOpType.MIN,
    cpuKernelImpl: minimumImplCPU,
});
var minimumConfig = {
    kernelName: tf.Minimum,
    backendName: 'webgpu',
    kernelFunc: minimum
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var MirrorPadProgram = /** @class */ (function () {
    function MirrorPadProgram(xShape, paddings, mode) {
        var _this = this;
        this.uniforms = '';
        this.variableNames = ['x'];
        this.workGroupSize = [64, 1, 1];
        this.outputShape = paddings.map(function (p, i) { return p[0] /* beforePad */ + xShape[i] + p[1]; } /* afterPad */);
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        this.xShape = xShape;
        paddings.map(function (_, i) { return _this.uniforms += " ivec2 pad" + i + ";"; });
        this.offset = mode === 'reflect' ? 0 : 1;
        this.shaderKey = "mirrorPad_" + mode;
        this.size = tf.util.sizeFromShape(this.outputShape);
    }
    MirrorPadProgram.prototype.getUserCode = function () {
        var rank = this.xShape.length;
        // The length of paddings are same with the rank of the input tensor.
        var start = this.xShape.map(function (_, i) { return "pad" + i + "[0]"; }).join(',');
        var end = this.xShape
            .map(function (_, i) { return "pad" + i + "[0] + xShape" + (rank > 1 ? "[" + i + "]" : ''); })
            .join(',');
        var shaderStart = rank === 1 ? 'start' : 'start[i]';
        var shaderEnd = rank === 1 ? 'end' : 'end[i]';
        var shaderOutC = rank === 1 ? 'outC' : 'outC[i]';
        var dtype = getCoordsDataType(rank);
        var unpackedCoords = rank > 1 ?
            ['coords[0]', 'coords[1]', 'coords[2]', 'coords[3]'].slice(0, rank) :
            'coords';
        return "\n      " + dtype + " start = " + dtype + "(" + start + ");\n      " + dtype + " end = " + dtype + "(" + end + ");\n\n      void main() {\n        " + dtype + " outC = getOutputCoords();\n        int index = int(gl_GlobalInvocationID.x);\n        if (index < size)\n        {\n          for (int i = 0; i < " + rank + "; i++) {\n            if (" + shaderOutC + " < " + shaderStart + ") {\n              " + shaderOutC + " = " + shaderStart + " * 2 - " + shaderOutC + " - " + this.offset + ";\n            } else if(" + shaderOutC + " >= " + shaderEnd + ") {\n              " + shaderOutC + " = (" + shaderEnd + " - 1) * 2 - " + shaderOutC + " + " + this.offset + ";\n            }\n          }\n          " + dtype + " coords = outC - start;\n          setOutput(index, getX(" + unpackedCoords + "));\n        }\n      }\n    ";
    };
    return MirrorPadProgram;
}());

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var mirrorPadConfig = {
    kernelName: tf.MirrorPad,
    backendName: 'webgpu',
    kernelFunc: function (_a) {
        var inputs = _a.inputs, attrs = _a.attrs, backend = _a.backend;
        var x = inputs.x;
        var _b = attrs, paddings = _b.paddings, mode = _b.mode;
        var webGPUBackend = backend;
        var uniformData = paddings.map(function (p) {
            return { type: 'int32', data: [p[0], p[1]] };
        });
        var program = new MirrorPadProgram(x.shape, paddings, mode);
        var output = webGPUBackend.runWebGPUProgram(program, [x], x.dtype, uniformData);
        return output;
    }
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// This doesn't use unaryKernelFunc because negImplCPU is not of type
// SimpleUnaryKernelImplCPU.
function neg(args) {
    var inputs = args.inputs, backend = args.backend;
    var x = inputs.x;
    if (backend.shouldExecuteOnCPU([x])) {
        var xData = backend.tensorMap.get(x.dataId);
        var _a = negImplCPU(xData.values, x.shape, x.dtype), outValues = _a[0], newShape = _a[1];
        return backend.makeTensorInfo(newShape, x.dtype, outValues);
    }
    var program = new UnaryOpProgram(x.shape, NEG);
    return backend.runWebGPUProgram(program, [x], x.dtype);
}
var negConfig = {
    kernelName: tf.Neg,
    backendName: 'webgpu',
    kernelFunc: neg
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function nonMaxSuppressionV3(args) {
    console.warn('tf.nonMaxSuppression() in webgpu locks the UI thread. ' +
        'Call tf.nonMaxSuppressionAsync() instead');
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var boxes = inputs.boxes, scores = inputs.scores;
    var maxOutputSize = attrs.maxOutputSize, iouThreshold = attrs.iouThreshold, scoreThreshold = attrs.scoreThreshold;
    var boxesVals = backend.readSync(boxes.dataId);
    var scoresVals = backend.readSync(scores.dataId);
    var selectedIndices = tf.kernel_impls.nonMaxSuppressionV3Impl(boxesVals, scoresVals, maxOutputSize, iouThreshold, scoreThreshold).selectedIndices;
    return backend.makeTensorInfo([selectedIndices.length], 'int32', new Int32Array(selectedIndices));
}
var nonMaxSuppressionV3Config = {
    kernelName: tf.NonMaxSuppressionV3,
    backendName: 'webgpu',
    kernelFunc: nonMaxSuppressionV3
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function nonMaxSuppressionV5(args) {
    console.warn('tf.nonMaxSuppression() in webgpu locks the UI thread. ' +
        'Call tf.nonMaxSuppressionAsync() instead');
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var boxes = inputs.boxes, scores = inputs.scores;
    var maxOutputSize = attrs.maxOutputSize, iouThreshold = attrs.iouThreshold, scoreThreshold = attrs.scoreThreshold, softNmsSigma = attrs.softNmsSigma;
    var boxesVals = backend.readSync(boxes.dataId);
    var scoresVals = backend.readSync(scores.dataId);
    var maxOutputSizeVal = maxOutputSize;
    var iouThresholdVal = iouThreshold;
    var scoreThresholdVal = scoreThreshold;
    var softNmsSigmaVal = softNmsSigma;
    var _a = tf.kernel_impls.nonMaxSuppressionV5Impl(boxesVals, scoresVals, maxOutputSizeVal, iouThresholdVal, scoreThresholdVal, softNmsSigmaVal), selectedIndices = _a.selectedIndices, selectedScores = _a.selectedScores;
    return [
        backend.makeTensorInfo([selectedIndices.length], 'int32', new Int32Array(selectedIndices)),
        backend.makeTensorInfo([selectedScores.length], 'float32', new Float32Array(selectedScores))
    ];
}
var nonMaxSuppressionV5Config = {
    kernelName: tf.NonMaxSuppressionV5,
    backendName: 'webgpu',
    kernelFunc: nonMaxSuppressionV5
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function zerosLike(args) {
    var inputs = args.inputs, backend = args.backend;
    var x = inputs.x;
    if (x.dtype === 'complex64') {
        var realPart = real({ inputs: { input: x }, backend: backend });
        var r = zerosLike({ inputs: { x: realPart }, backend: backend });
        var imagPart = imag({ inputs: { input: x }, backend: backend });
        var i = zerosLike({ inputs: { x: imagPart }, backend: backend });
        var result = complex({ inputs: { real: r, imag: i }, backend: backend });
        backend.disposeData(realPart.dataId);
        backend.disposeData(r.dataId);
        backend.disposeData(imagPart.dataId);
        backend.disposeData(i.dataId);
        return result;
    }
    else {
        return fill({
            attrs: {
                shape: x.shape,
                dtype: x.dtype,
                value: x.dtype === 'string' ? '' : 0
            },
            backend: backend
        });
    }
}
var zerosLikeConfig = {
    kernelName: tf.ZerosLike,
    backendName: 'webgpu',
    kernelFunc: zerosLike
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function onesLike(args) {
    var inputs = args.inputs, backend = args.backend;
    var x = inputs.x;
    if (x.dtype === 'string') {
        throw new Error('onesLike is not supported under string dtype');
    }
    else if (x.dtype === 'complex64') {
        var realPart = real({ inputs: { input: x }, backend: backend });
        var r = onesLike({ inputs: { x: realPart }, backend: backend });
        var imagPart = imag({ inputs: { input: x }, backend: backend });
        var i = zerosLike({ inputs: { x: imagPart }, backend: backend });
        var result = complex({ inputs: { real: r, imag: i }, backend: backend });
        backend.disposeData(realPart.dataId);
        backend.disposeData(r.dataId);
        backend.disposeData(imagPart.dataId);
        backend.disposeData(i.dataId);
        return result;
    }
    else {
        return fill({ attrs: { shape: x.shape, dtype: x.dtype, value: 1 }, backend: backend });
    }
}
var onesLikeConfig = {
    kernelName: tf.OnesLike,
    backendName: 'webgpu',
    kernelFunc: onesLike
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function pack(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var axis = attrs.axis;
    if (inputs.length === 1) {
        return expandDims({ inputs: { input: inputs[0] }, backend: backend, attrs: { dim: axis } });
    }
    var shape = inputs[0].shape;
    var dtype = inputs[0].dtype;
    inputs.forEach(function (t) {
        tf.util.assertShapesMatch(shape, t.shape, 'All tensors passed to stack must have matching shapes');
        tf.util.assert(dtype === t.dtype, function () { return 'All tensors passed to stack must have matching dtypes'; });
    });
    var intermediateTensorInfos = [];
    var expandedTensors = inputs.map(function (t) {
        var expandedT = expandDims({ inputs: { input: t }, backend: backend, attrs: { dim: axis } });
        intermediateTensorInfos.push(expandedT);
        return expandedT;
    });
    var result = concat({ inputs: expandedTensors, backend: backend, attrs: { axis: axis } });
    intermediateTensorInfos.forEach(function (t) { return backend.disposeData(t.dataId); });
    return result;
}
var packConfig = {
    kernelName: tf.Pack,
    backendName: 'webgpu',
    kernelFunc: pack
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var PadProgram = /** @class */ (function () {
    function PadProgram(xShape, paddings) {
        var _this = this;
        this.variableNames = ['x'];
        this.uniforms = 'float constantValue;';
        this.workPerThread = 8;
        this.workGroupSize = [16, 1, 1];
        this.outputShape = paddings.map(function (p, i) { return p[0] /* beforePad */ + xShape[i] + p[1]; } /* afterPad */);
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [this.workPerThread, 1, 1]);
        paddings.map(function (_, i) { return _this.uniforms += " ivec2 pad" + i + ";"; });
        this.xShape = xShape;
        this.shaderKey = 'pad';
        this.size = tf.util.sizeFromShape(this.outputShape);
    }
    PadProgram.prototype.getUserCode = function () {
        var rank = this.xShape.length;
        var type = getCoordsDataType(rank);
        // The length of paddings are same with the rank of the input tensor.
        var start = this.xShape.map(function (_, i) { return "pad" + i + "[0]"; }).join(',');
        var end = this.xShape
            .map(function (_, i) { return "pad" + i + "[0] + xShape" + (rank > 1 ? "[" + i + "]" : ''); })
            .join(',');
        var startValue = rank > 1 ? type + "(" + start + ")" : "" + start;
        var endValue = rank > 1 ? type + "(" + end + ")" : "" + end;
        var leftPadCondition = rank > 1 ? "any(lessThan(outC, start))" : "outC < start";
        var rightPadCondition = rank > 1 ? "any(greaterThanEqual(outC, end))" : "outC >= end";
        var unpackedCoords = rank > 1 ?
            ['coords[0]', 'coords[1]', 'coords[2]', 'coords[3]'].slice(0, rank) :
            'coords';
        var userCode = "\n      " + type + " start = " + startValue + ";\n      " + type + " end = " + endValue + ";\n\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n\n        for (int i = 0; i < " + this.workPerThread + "; i++) {\n          int flatIndex = index * " + this.workPerThread + " + i;\n\n          if (flatIndex < size) {\n            " + type + " outC = getCoordsFromFlatIndex(flatIndex);\n\n            if (" + leftPadCondition + " || " + rightPadCondition + ") {\n              setOutput(flatIndex, constantValue);\n            } else {\n              " + type + " coords = outC - start;\n              setOutput(flatIndex, getX(" + unpackedCoords + "));\n            }\n          }\n        }\n      }\n    ";
        return userCode;
    };
    return PadProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var padV2 = function (args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var paddings = attrs.paddings, constantValue = attrs.constantValue;
    if (paddings.every(function (p) { return tf.util.arraysEqual(p, [0, 0]); })) {
        return identity({ inputs: { x: x }, backend: backend });
    }
    var uniformData = [{ type: 'float32', data: [constantValue] }];
    paddings.map(function (p) { return uniformData.push({ type: 'int32', data: [p[0], p[1]] }); });
    var program = new PadProgram(x.shape, paddings);
    return backend.runWebGPUProgram(program, [x], x.dtype, uniformData);
};
var padV2Config = {
    kernelName: tf.PadV2,
    backendName: 'webgpu',
    kernelFunc: padV2
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var pow = binaryKernelFunc({
    opSnippet: BinaryOpType.POW,
});
var powConfig = {
    kernelName: tf.Pow,
    backendName: 'webgpu',
    kernelFunc: pow
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function prelu(args) {
    var inputs = args.inputs, backend = args.backend;
    var x = inputs.x, alpha = inputs.alpha;
    var program = new BinaryOpProgram(getBinaryOpString(BinaryOpType.PRELU), x.shape, alpha.shape);
    return backend.runWebGPUProgram(program, [x, alpha], x.dtype);
}
var preluConfig = {
    kernelName: tf.Prelu,
    backendName: 'webgpu',
    kernelFunc: prelu
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function prod(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var axis = attrs.axis, keepDims = attrs.keepDims;
    return reduce(x, axis, keepDims, 'prod', backend);
}
var prodConfig = {
    kernelName: tf.Prod,
    backendName: 'webgpu',
    kernelFunc: prod
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var range = function (args) {
    var backend = args.backend, attrs = args.attrs;
    var start = attrs.start, stop = attrs.stop, step = attrs.step, dtype = attrs.dtype;
    var values = rangeImplCPU(start, stop, step, dtype);
    return backend.makeTensorInfo([values.length], dtype, values);
};
var rangeConfig = {
    kernelName: tf.Range,
    backendName: 'webgpu',
    kernelFunc: range
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var realDiv = binaryKernelFunc({ opSnippet: BinaryOpType.DIV });
var realDivConfig = {
    kernelName: tf.RealDiv,
    backendName: 'webgpu',
    kernelFunc: realDiv
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var relu = unaryKernelFunc({ opSnippet: RELU });
var reluConfig = {
    kernelName: tf.Relu,
    backendName: 'webgpu',
    kernelFunc: relu
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var relu6 = unaryKernelFunc({ opSnippet: RELU6 });
var relu6Config = {
    kernelName: tf.Relu6,
    backendName: 'webgpu',
    kernelFunc: relu6
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var ResizeBilinearProgram = /** @class */ (function () {
    function ResizeBilinearProgram(inputShape, newHeight, newWidth, alignCorners) {
        this.variableNames = ['x'];
        this.workGroupSize = [64, 1, 1];
        this.outputShape = [inputShape[0], newHeight, newWidth, inputShape[3]];
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        this.alignCorners = alignCorners;
        this.shaderKey = "resizeBilinear_" + alignCorners + "_" + (this.outputShape[1] > 1) + "_" + (this.outputShape[2] > 1);
    }
    ResizeBilinearProgram.prototype.getUserCode = function () {
        var adjustHeight = this.alignCorners && this.outputShape[1] > 1;
        var adjustWidth = this.alignCorners && this.outputShape[2] > 1;
        var userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        if (all(lessThan(coords, outShape))) {\n          int b = coords[0];\n          int d = coords[3];\n          ivec2 rc = coords.yz;\n\n          vec2 effectiveInSize = vec2(\n            " + (adjustHeight ? "xShape.y - 1.0" : "xShape.y") + ",\n            " + (adjustWidth ? "xShape.z - 1.0" : "xShape.z") + ");\n\n          vec2 effectiveOutSize = vec2(\n            " + (adjustHeight ? "outShape.y - 1.0" : "outShape.y") + ",\n            " + (adjustWidth ? "outShape.z - 1.0" : "outShape.z") + ");\n\n          vec2 effectiveInputOverOutputRatioRC =\n              effectiveInSize / effectiveOutSize;\n\n          // Fractional source index\n          vec2 sourceFracIndexRC = vec2(rc) * effectiveInputOverOutputRatioRC;\n\n          // Compute the four integer indices.\n          ivec2 sourceFloorRC = ivec2(sourceFracIndexRC);\n          ivec2 sourceCeilRC = ivec2(\n            min(xShape.yz - 1.0, ceil(sourceFracIndexRC)));\n\n          float topLeft = getX(b, sourceFloorRC.x, sourceFloorRC.y, d);\n          float bottomLeft = getX(b, sourceCeilRC.x, sourceFloorRC.y, d);\n          float topRight = getX(b, sourceFloorRC.x, sourceCeilRC.y, d);\n          float bottomRight = getX(b, sourceCeilRC.x, sourceCeilRC.y, d);\n\n          vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);\n\n          float top = topLeft + (topRight - topLeft) * fracRC.y;\n          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;\n          float newValue = top + (bottom - top) * fracRC.x;\n\n          setOutput(b, coords[1], coords[2], d, newValue);\n        }\n      }\n    ";
        return userCode;
    };
    return ResizeBilinearProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function resizeBilinear(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var images = inputs.images;
    var alignCorners = attrs.alignCorners, size = attrs.size;
    var newHeight = size[0], newWidth = size[1];
    var program = new ResizeBilinearProgram(images.shape, newHeight, newWidth, alignCorners);
    return backend.runWebGPUProgram(program, [images], 'float32');
}
var resizeBilinearConfig = {
    kernelName: tf.ResizeBilinear,
    backendName: 'webgpu',
    kernelFunc: resizeBilinear
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var ResizeNearestNeighborProgram = /** @class */ (function () {
    function ResizeNearestNeighborProgram(inputShape, newHeight, newWidth, alignCorners, halfPixelCenters) {
        this.variableNames = ['x'];
        this.workGroupSize = [64, 1, 1];
        this.outputShape = [inputShape[0], newHeight, newWidth, inputShape[3]];
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        this.alignCorners = alignCorners;
        this.halfPixelCenters = halfPixelCenters;
        this.shaderKey =
            "resizeNearest_" + alignCorners + "_" + (this.outputShape[1] > 1) + "_" + (this.outputShape[2] > 1) + "_" + halfPixelCenters;
    }
    ResizeNearestNeighborProgram.prototype.getUserCode = function () {
        // When align corners is false, we rounds the value with floor.
        var roundBase = this.alignCorners ? '0.5' : '0.0';
        var sourceFracIndexRC;
        if (this.halfPixelCenters) {
            sourceFracIndexRC =
                "max((vec2(rc) + vec2(0.5)) * effectiveInputOverOutputRatioRC" +
                    ", vec2(0.0))";
        }
        else {
            sourceFracIndexRC = "vec2(rc) * effectiveInputOverOutputRatioRC";
        }
        var adjustHeight = this.alignCorners && this.outputShape[1] > 1;
        var adjustWidth = this.alignCorners && this.outputShape[2] > 1;
        var userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        if (all(lessThan(coords, outShape))) {\n          int b = coords[0];\n          int d = coords[3];\n          ivec2 rc = coords.yz;\n\n          vec2 effectiveInSize = vec2(\n            " + (adjustHeight ? "xShape.y - 1.0" : "xShape.y") + ",\n            " + (adjustWidth ? "xShape.z - 1.0" : "xShape.z") + ");\n\n          vec2 effectiveOutSize = vec2(\n            " + (adjustHeight ? "outShape.y - 1.0" : "outShape.y") + ",\n            " + (adjustWidth ? "outShape.z - 1.0" : "outShape.z") + ");\n\n          vec2 effectiveInputOverOutputRatioRC =\n              effectiveInSize / effectiveOutSize;\n\n          // Fractional source index\n          vec2 sourceFracIndexRC = " + sourceFracIndexRC + ";\n\n          // Compute the coordinators of nearest neighbor point.\n          const vec2 inputShapeRC = vec2(xShape.y, xShape.z);\n          ivec2 sourceNearestRC = ivec2(\n            min(inputShapeRC - 1.0, floor(sourceFracIndexRC + " + roundBase + ")));\n          float newValue = getX(b, sourceNearestRC.x, sourceNearestRC.y, d);\n\n          setOutput(b, coords[1], coords[2], d, newValue);\n        }\n      }\n    ";
        return userCode;
    };
    return ResizeNearestNeighborProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function resizeNearestNeighbor(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var images = inputs.images;
    var alignCorners = attrs.alignCorners, halfPixelCenters = attrs.halfPixelCenters, size = attrs.size;
    var newHeight = size[0], newWidth = size[1];
    var program = new ResizeNearestNeighborProgram(images.shape, newHeight, newWidth, alignCorners, halfPixelCenters);
    return backend.runWebGPUProgram(program, [images], images.dtype);
}
var resizeNearestNeighborConfig = {
    kernelName: tf.ResizeNearestNeighbor,
    backendName: 'webgpu',
    kernelFunc: resizeNearestNeighbor
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var RSQRT = "return inversesqrt(a);";
var rsqrt = unaryKernelFunc({ opSnippet: RSQRT, cpuKernelImpl: rsqrtImplCPU });
var rsqrtConfig = {
    kernelName: tf.Rsqrt,
    backendName: 'webgpu',
    kernelFunc: rsqrt
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var SelectProgram = /** @class */ (function () {
    function SelectProgram(cRank, shape, rank) {
        this.variableNames = ['c', 'a', 'b'];
        this.workPerThread = 4;
        this.workGroupSize = [16, 1, 1];
        this.outputShape = shape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [this.workPerThread, 1, 1]);
        this.cRank = cRank;
        this.rank = rank;
        this.shaderKey = 'select';
        this.size = tf.util.sizeFromShape(this.outputShape);
    }
    SelectProgram.prototype.getUserCode = function () {
        var cCoords;
        var abCoords;
        if (this.rank > 4) {
            throw Error("Where for rank " + this.rank + " is not yet supported");
        }
        if (this.rank === 1) {
            abCoords = "resRC";
            cCoords = "resRC";
        }
        else {
            var currentCoords = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w'];
            var cCoordVars = [];
            var abCoordVars = [];
            for (var i = 0; i < this.outputShape.length; i++) {
                abCoordVars.push("" + currentCoords[i]);
                if (i < this.cRank) {
                    cCoordVars.push("" + currentCoords[i]);
                }
            }
            cCoords = cCoordVars.join();
            abCoords = abCoordVars.join();
        }
        var dtype = getCoordsDataType(this.rank);
        var userCode = "\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n\n        for (int i = 0; i < " + this.workPerThread + "; i++) {\n          int flatIndex = index * " + this.workPerThread + " + i;\n\n          if (flatIndex < size) {\n            " + dtype + " resRC = getOutputCoords();\n            float cVal = getC(" + cCoords + ");\n            if (cVal >= 1.0) {\n              setOutput(flatIndex,getA(" + abCoords + "));\n            } else {\n              setOutput(flatIndex,getB(" + abCoords + "));\n            }\n          }\n        }\n      }\n    ";
        return userCode;
    };
    return SelectProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function select(args) {
    var inputs = args.inputs, backend = args.backend;
    var condition = inputs.condition, t = inputs.t, e = inputs.e;
    var program = new SelectProgram(condition.shape.length, t.shape, t.shape.length);
    return backend.runWebGPUProgram(program, [condition, t, e], tf.upcastType(t.dtype, e.dtype));
}
var selectConfig = {
    kernelName: tf.Select,
    backendName: 'webgpu',
    kernelFunc: select
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var sigmoid = unaryKernelFunc({ opSnippet: SIGMOID });
var sigmoidConfig = {
    kernelName: tf.Sigmoid,
    backendName: 'webgpu',
    kernelFunc: sigmoid,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var sub = binaryKernelFunc({
    opSnippet: BinaryOpType.SUB,
    cpuKernelImpl: subImplCPU,
    supportsComplex: true
});
var subConfig = {
    kernelName: tf.Sub,
    backendName: 'webgpu',
    kernelFunc: sub
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function softmax(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var logits = inputs.logits;
    var dim = attrs.dim;
    var axes = tf.util.parseAxisParam([dim], logits.shape);
    var maxLogit = max({
        inputs: { x: logits },
        backend: backend,
        attrs: { reductionIndices: axes, keepDims: false }
    });
    var expandedShape = tf.backend_util.expandShapeToKeepDim(maxLogit.shape, axes);
    var maxLogitsReshaped = reshape({ inputs: { x: maxLogit }, backend: backend, attrs: { shape: expandedShape } });
    var a = sub({ inputs: { a: logits, b: maxLogitsReshaped }, backend: backend });
    var b = exp({ inputs: { x: a }, backend: backend });
    var sumExp = sum({ inputs: { x: b }, backend: backend, attrs: { axis: axes, keepDims: false } });
    var sumExpReshaped = reshape({ inputs: { x: sumExp }, backend: backend, attrs: { shape: expandedShape } });
    var res = realDiv({ inputs: { a: b, b: sumExpReshaped }, backend: backend });
    backend.disposeData(maxLogit.dataId);
    backend.disposeData(maxLogitsReshaped.dataId);
    backend.disposeData(a.dataId);
    backend.disposeData(b.dataId);
    backend.disposeData(sumExp.dataId);
    backend.disposeData(sumExpReshaped.dataId);
    return res;
}
var softmaxConfig = {
    kernelName: tf.Softmax,
    backendName: 'webgpu',
    kernelFunc: softmax
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var spaceToBatchND = function (args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var blockShape = attrs.blockShape, paddings = attrs.paddings;
    tf.util.assert(x.shape.length <= 4, function () { return 'spaceToBatchND for rank > 4 with a WebGPU backend not ' +
        'implemented yet'; });
    var prod = blockShape.reduce(function (a, b) { return a * b; });
    var completePaddings = [[0, 0]];
    completePaddings.push.apply(completePaddings, paddings);
    for (var i = 1 + blockShape.length; i < x.shape.length; ++i) {
        completePaddings.push([0, 0]);
    }
    var toDispose = [];
    var paddedX = padV2({
        inputs: { x: x },
        backend: backend,
        attrs: { paddings: completePaddings, constantValue: 0 }
    });
    var reshapedPaddedShape = tf.backend_util.getReshaped(paddedX.shape, blockShape, prod, false);
    var permutedReshapedPaddedPermutation = tf.backend_util.getPermuted(reshapedPaddedShape.length, blockShape.length, false);
    var flattenShape = tf.backend_util.getReshapedPermuted(paddedX.shape, blockShape, prod, false);
    var reshapedPaddedX = reshape({ inputs: { x: paddedX }, backend: backend, attrs: { shape: reshapedPaddedShape } });
    var paddedXT = transpose({
        inputs: { x: reshapedPaddedX },
        backend: backend,
        attrs: { perm: permutedReshapedPaddedPermutation }
    });
    var result = reshape({ inputs: { x: paddedXT }, backend: backend, attrs: { shape: flattenShape } });
    toDispose.push(paddedX);
    toDispose.push(reshapedPaddedX);
    toDispose.push(paddedXT);
    toDispose.forEach(function (t) { return backend.disposeData(t.dataId); });
    return result;
};
var spaceToBatchNDConfig = {
    kernelName: tf.SpaceToBatchND,
    backendName: 'webgpu',
    kernelFunc: spaceToBatchND
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var sqrt = unaryKernelFunc({ opSnippet: SQRT });
var sqrtConfig = {
    kernelName: tf.Sqrt,
    backendName: 'webgpu',
    kernelFunc: sqrt
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var squareConfig = {
    kernelName: tf.Square,
    backendName: 'webgpu',
    kernelFunc: function (_a) {
        var inputs = _a.inputs, backend = _a.backend;
        var x = inputs.x;
        var webGPUBackend = backend;
        var program = new UnaryOpProgram(x.shape, SQUARE);
        return webGPUBackend.runWebGPUProgram(program, [x], x.dtype);
    }
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var squaredDifference = binaryKernelFunc({
    opSnippet: BinaryOpType.SQUARED_DIFFERENCE,
});
var squaredDifferenceConfig = {
    kernelName: tf.SquaredDifference,
    backendName: 'webgpu',
    kernelFunc: squaredDifference
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var StridedSliceProgram = /** @class */ (function () {
    function StridedSliceProgram(destSize) {
        this.variableNames = ['x'];
        // TODO(xing.xu): Increase the workPerThread.
        this.workPerThread = 1;
        this.workGroupSize = [64, 1, 1];
        this.outputShape = destSize;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize, [this.workPerThread, 1, 1]);
        this.dtype = getCoordsDataType(this.outputShape.length);
        this.uniforms = this.dtype + " begin; " + this.dtype + " strides; ";
        this.shaderKey = 'stridedSlice';
        this.size = tf.util.sizeFromShape(this.outputShape);
    }
    StridedSliceProgram.prototype.getUserCode = function () {
        var _this = this;
        var rank = this.outputShape.length;
        var newCoords = '';
        if (rank === 1) {
            newCoords = 'coords * strides + begin';
        }
        else {
            var outputAxis_1 = 0;
            newCoords =
                this.outputShape
                    .map(function (_, i) {
                    outputAxis_1++;
                    return _this.outputShape.length === 1 ?
                        "coords * strides[" + i + "] + begin[" + i + "]" :
                        "coords[" + (outputAxis_1 - 1) + "] * strides[" + i + "] + begin[" + i + "]";
                })
                    .join(',');
        }
        var userCode = "\n       void main() {\n         int index = int(gl_GlobalInvocationID.x);\n         if (index < size)\n         {\n           " + this.dtype + " coords = getOutputCoords();\n           setOutput(index, getX(" + newCoords + "));\n         }\n       }\n     ";
        return userCode;
    };
    return StridedSliceProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function stridedSlice(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var x = inputs.x;
    var begin = attrs.begin, end = attrs.end, strides = attrs.strides, beginMask = attrs.beginMask, endMask = attrs.endMask, ellipsisMask = attrs.ellipsisMask, newAxisMask = attrs.newAxisMask, shrinkAxisMask = attrs.shrinkAxisMask;
    var _a = tf.slice_util.sliceInfo(x.shape, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask), nonStrided = _a.nonStrided, $begin = _a.$begin, $strides = _a.$strides, size = _a.size, newShape = _a.newShape, outShape = _a.outShape;
    var $x = reshape({ inputs: { x: x }, backend: backend, attrs: { shape: newShape } });
    var result;
    if (nonStrided) {
        var sliced = slice({ inputs: { x: $x }, backend: backend, attrs: { begin: $begin, size: size } });
        result = reshape({ inputs: { x: sliced }, backend: backend, attrs: { shape: outShape } });
        backend.disposeData(sliced.dataId);
    }
    else if (outShape.some(function (axis) { return axis === 0; })) {
        result = backend.makeTensorInfo(outShape, x.dtype, []);
    }
    else {
        var shouldExecuteOnCPU = backend.shouldExecuteOnCPU([$x]);
        if (shouldExecuteOnCPU) {
            var xBufferInfo = backend.tensorMap.get($x.dataId);
            var values = xBufferInfo.values;
            var xBuf = tf.buffer($x.shape, $x.dtype, values);
            var resultValues = stridedSliceImplCPU(outShape, xBuf, $strides, $begin);
            result = backend.makeTensorInfo(outShape, $x.dtype, resultValues.values);
        }
        else {
            var program = new StridedSliceProgram(outShape);
            var uniformData = [{ type: 'int32', data: $begin }, { type: 'int32', data: $strides }];
            result = backend.runWebGPUProgram(program, [$x], $x.dtype, uniformData);
        }
    }
    var resultReshaped = reshape({ inputs: { x: result }, backend: backend, attrs: { shape: outShape } });
    backend.disposeData($x.dataId);
    backend.disposeData(result.dataId);
    return resultReshaped;
}
var stridedSliceConfig = {
    kernelName: tf.StridedSlice,
    backendName: 'webgpu',
    kernelFunc: stridedSlice
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function stringNGrams(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var separator = attrs.separator, nGramWidths = attrs.nGramWidths, leftPad = attrs.leftPad, rightPad = attrs.rightPad, padWidth = attrs.padWidth, preserveShortSequences = attrs.preserveShortSequences;
    var data = inputs.data, dataSplits = inputs.dataSplits;
    var $data = backend.readSync(data.dataId);
    var $dataSplits = backend.readSync(dataSplits.dataId);
    var _a = stringNGramsImplCPU($data, $dataSplits, separator, nGramWidths, leftPad, rightPad, padWidth, preserveShortSequences), nGrams = _a[0], nGramsSplits = _a[1];
    return [
        backend.makeTensorInfo([nGrams.length], 'string', nGrams),
        backend.makeTensorInfo(dataSplits.shape, 'int32', nGramsSplits),
    ];
}
var stringNGramsConfig = {
    kernelName: tf.StringNGrams,
    backendName: 'webgpu',
    kernelFunc: stringNGrams,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var tanh = unaryKernelFunc({ opSnippet: TANH });
var tanhConfig = {
    kernelName: tf.Tanh,
    backendName: 'webgpu',
    kernelFunc: tanh
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var TileProgram = /** @class */ (function () {
    function TileProgram(aShape, reps) {
        this.variableNames = ['A'];
        this.workGroupSize = [64, 1, 1];
        var outputShape = new Array(aShape.length);
        for (var i = 0; i < outputShape.length; i++) {
            outputShape[i] = aShape[i] * reps[i];
        }
        this.outputShape = outputShape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        this.rank = this.outputShape.length;
        this.size = tf.util.sizeFromShape(this.outputShape);
        this.shaderKey = 'tile';
    }
    TileProgram.prototype.getUserCode = function () {
        var dtype = getCoordsDataType(this.rank);
        var sourceCoords = getSourceCoords$1(this.rank);
        var userCode = "\n      void main() {\n        int index = int(gl_GlobalInvocationID.x);\n        if (index < size) {\n          " + dtype + " resRC = getOutputCoords();\n          setOutput(index, getA(" + sourceCoords + "));\n        }\n      }\n    ";
        return userCode;
    };
    return TileProgram;
}());
function getSourceCoords$1(rank) {
    if (rank >= 5) {
        throw Error("Tile for rank " + rank + " is not yet supported");
    }
    if (rank === 1) {
        return "(resRC % aShape)";
    }
    var currentCoords = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w'];
    var sourceCoords = [];
    for (var i = 0; i < rank; i++) {
        sourceCoords.push("(" + currentCoords[i] + " % aShape[" + i + "])");
    }
    return sourceCoords.join();
}

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function tile(params) {
    var inputs = params.inputs, backend = params.backend, attrs = params.attrs;
    var x = inputs.x;
    var reps = attrs.reps;
    // tile gpu program cannot handle rank >= 5 case.
    if (backend.shouldExecuteOnCPU([x]) || x.dtype === 'string' ||
        x.shape.length >= 5) {
        // Even thought string tensor is always on CPU, just to be consistent on how
        // to access tensor data.
        var data = backend.readSync(x.dataId);
        var value = x.dtype === 'string' ?
            data.map(function (d) { return tf.util.decodeString(d); }) :
            data;
        var buf = tf.buffer(x.shape, x.dtype, value);
        var outBuf = tileImplCPU(buf, reps);
        return backend.makeTensorInfo(outBuf.shape, outBuf.dtype, outBuf.values);
    }
    var program = new TileProgram(x.shape, reps);
    var output = backend.runWebGPUProgram(program, [x], x.dtype);
    return output;
}
var tileConfig = {
    kernelName: tf.Tile,
    backendName: 'webgpu',
    kernelFunc: tile,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var TransformProgram = /** @class */ (function () {
    function TransformProgram(outShape) {
        this.variableNames = ['Image', 'Transforms'];
        this.uniforms = 'int interpolationModeId; int fillModeId; float fillValue;';
        this.workGroupSize = [64, 1, 1];
        this.outputShape = outShape;
        this.dispatchLayout = flatDispatchLayout(this.outputShape);
        this.dispatch = computeDispatch(this.dispatchLayout, this.outputShape, this.workGroupSize);
        this.shaderKey = 'transform';
    }
    TransformProgram.prototype.getUserCode = function () {
        var userCode = "\n            float mapCoord(float outCoord, float len) {\n              float inCoord = outCoord;\n              if(fillModeId == 2) {\n                if (inCoord < 0.0) {\n                  if (len <= 1.0) {\n                    inCoord = 0.0;\n                  } else {\n                    float sz2 = 2.0 * len;\n                    if (inCoord < sz2) {\n                      inCoord = sz2 * float(int(float(-inCoord / sz2))) +\n                      inCoord;\n                    }\n                    inCoord = inCoord < -len ? inCoord + sz2 : -inCoord - 1.0;\n                  }\n                } else if (inCoord > len - 1.0) {\n                  if (len <= 1.0) {\n                    inCoord = 0.0;\n                  } else {\n                    float sz2 = 2.0 * len;\n                    inCoord -= sz2 * float(int(float(inCoord / sz2)));\n                    if (inCoord >= len) {\n                      inCoord = sz2 - inCoord - 1.0;\n                    }\n                  }\n                }\n                return clamp(inCoord, 0.0, len - 1.0);\n              } else if (fillModeId == 3) {\n                if (inCoord < 0.0) {\n                  if (len <= 1.0) {\n                    inCoord = 0.0;\n                  } else {\n                    float sz = len - 1.0;\n                    inCoord += len * (float(int(float(-inCoord / sz))) + 1.0);\n                  }\n                } else if (inCoord > len - 1.0) {\n                  if (len <= 1.0) {\n                    inCoord = 0.0;\n                  } else {\n                    float sz = len - 1.0;\n                    inCoord -= len * float(int(float(inCoord / sz)));\n                  }\n                }\n                return clamp(inCoord, 0.0, len - 1.0);\n              } else if (fillModeId == 4) {\n                return clamp(outCoord, 0.0, len - 1.0);\n              } else {\n                return outCoord;\n              }\n            }\n\n            float readWithFillValue(int batch, int coordY, int coordX,\n              int channel) {\n              float outputValue;\n              if (0 <= coordY && coordY < imageShape[1] && 0 <= coordX && coordX < imageShape[2]) {\n                  outputValue = getImage(batch, coordY, coordX, channel);\n              } else {\n                outputValue = fillValue;\n              }\n              return outputValue;\n            }\n\n          void main() {\n            ivec4 coords = getOutputCoords();\n            if (coordsInBounds(coords, outShape)) {\n              float outputValue;\n              int batch = coords[0];\n              int x = coords[2];\n              int y = coords[1];\n              int channel = coords[3];\n              float xf = float(x);\n              float yf = float(y);\n              float a1 = getTransforms(batch, 0);\n              float a2 = getTransforms(batch, 1);\n              float a3 = getTransforms(batch, 2);\n              float b1 = getTransforms(batch, 3);\n              float b2 = getTransforms(batch, 4);\n              float b3 = getTransforms(batch, 5);\n              float c1 = getTransforms(batch, 6);\n              float c2 = getTransforms(batch, 7);\n              float projection = c1 * xf + c2 * yf + 1.0;\n              if (projection == 0.0) {\n                outputValue = fillValue;\n              } else {\n                float inX = (a1 * xf + a2 * yf + a3) / projection;\n                float inY = (b1 * xf + b2 * yf + b3) / projection;\n                float mapX = mapCoord(inX, float(imageShape[2]));\n                float mapY = mapCoord(inY, float(imageShape[1]));\n\n                if (interpolationModeId == 1) {\n                  int coordY = int(round(mapY));\n                  int coordX = int(round(mapX));\n                  outputValue = readWithFillValue(batch, coordY, coordX,\n                    channel);\n                } else {\n                  float yFloor = floor(mapY);\n                  float xFloor = floor(mapX);\n                  float yCeil = yFloor + 1.0;\n                  float xCeil = xFloor + 1.0;\n                  float valueYFloor = (xCeil - mapX) *\n                  readWithFillValue(batch, int(yFloor), int(xFloor), channel) +\n                  (mapX - xFloor) *\n                  readWithFillValue(batch, int(yFloor), int(xCeil), channel);\n                  float valueYCeil = (xCeil - mapX) *\n                  readWithFillValue(batch, int(yCeil), int(xFloor), channel) +\n                  (mapX - xFloor) *\n                  readWithFillValue(batch, int(yCeil), int(xCeil), channel);\n                  outputValue = (yCeil - mapY) * valueYFloor +\n                  (mapY - yFloor) * valueYCeil;\n                }\n              }\n              setOutput(coords[0], coords[1], coords[2], coords[3], outputValue);\n            }\n          }\n        ";
        return userCode;
    };
    return TransformProgram;
}());

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function transform(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var image = inputs.image, transforms = inputs.transforms;
    var interpolation = attrs.interpolation, fillMode = attrs.fillMode, fillValue = attrs.fillValue, outputShape = attrs.outputShape;
    var _a = image.shape, batch = _a[0], imageHeight = _a[1], imageWidth = _a[2], numChannels = _a[3];
    var _b = outputShape != null ? outputShape : [imageHeight, imageWidth], outHeight = _b[0], outWidth = _b[1];
    var outShape = [batch, outHeight, outWidth,
        numChannels];
    var program = new TransformProgram(outShape);
    var interpolationModeId = interpolation === 'nearest' ? 1 : 2;
    var fillModeId;
    switch (fillMode) {
        case 'constant':
            fillModeId = 1;
            break;
        case 'reflect':
            fillModeId = 2;
            break;
        case 'wrap':
            fillModeId = 3;
            break;
        case 'nearest':
            fillModeId = 4;
            break;
        default:
            fillModeId = 1;
            break;
    }
    var uniformData = [
        { type: 'int32', data: [interpolationModeId] },
        { type: 'int32', data: [fillModeId] }, { type: 'float32', data: [fillValue] }
    ];
    return backend.runWebGPUProgram(program, [image, transforms], 'float32', uniformData);
}
var transformConfig = {
    kernelName: tf.Transform,
    backendName: 'webgpu',
    kernelFunc: transform
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function unpack(args) {
    var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
    var value = inputs.value;
    var axis = attrs.axis;
    if (axis < 0) {
        axis += value.shape.length;
    }
    var x = value;
    var xRank = x.shape.length;
    var num = value.shape[axis];
    var outShape = new Array(xRank - 1);
    var outIndex = 0;
    for (var i = 0; i < xRank; i++) {
        if (i !== axis) {
            outShape[outIndex++] = x.shape[i];
        }
    }
    var toDispose = [];
    var begin = new Array(xRank).fill(0);
    var size = x.shape.slice();
    size[axis] = 1;
    var res = new Array(num);
    for (var i = 0; i < res.length; i++) {
        begin[axis] = i;
        var sliced = slice({ inputs: { x: x }, backend: backend, attrs: { begin: begin, size: size } });
        var reshaped = reshape({ inputs: { x: sliced }, backend: backend, attrs: { shape: outShape } });
        res[i] = reshaped;
        toDispose.push(sliced);
    }
    toDispose.forEach(function (t) { return backend.disposeData(t.dataId); });
    return res;
}
var unpackConfig = {
    kernelName: tf.Unpack,
    backendName: 'webgpu',
    kernelFunc: unpack
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// List all kernel configs here
var kernelConfigs = [
    _fusedMatMulConfig,
    absConfig,
    addConfig,
    addNConfig,
    argMaxConfig,
    argMinConfig,
    avgPoolConfig,
    batchMatMulConfig,
    batchToSpaceNDConfig,
    castConfig,
    ceilConfig,
    clipByValueConfig,
    complexConfig,
    concatConfig,
    conv2DConfig,
    conv2DBackpropInputConfig,
    cropAndResizeConfig,
    depthwiseConv2dNativeConfig,
    einsumConfig,
    eluConfig,
    equalConfig,
    expandDimsConfig,
    expConfig,
    expm1Config,
    fillConfig,
    fromPixelsConfig,
    floorConfig,
    floorDivConfig,
    fusedBatchNormConfig,
    fusedConv2DConfig,
    fusedDepthwiseConv2DConfig,
    gatherNdConfig,
    gatherV2Config,
    greaterConfig,
    greaterEqualConfig,
    identityConfig,
    imagConfig,
    lessConfig,
    lessEqualConfig,
    logConfig,
    logicalAndConfig,
    maxConfig,
    maximumConfig,
    maxPoolConfig,
    meanConfig,
    minConfig,
    minimumConfig,
    mirrorPadConfig,
    multiplyConfig,
    negConfig,
    nonMaxSuppressionV3Config,
    nonMaxSuppressionV5Config,
    notEqualConfig,
    onesLikeConfig,
    packConfig,
    padV2Config,
    preluConfig,
    prodConfig,
    powConfig,
    rangeConfig,
    realConfig,
    realDivConfig,
    reluConfig,
    relu6Config,
    reshapeConfig,
    resizeBilinearConfig,
    resizeNearestNeighborConfig,
    rsqrtConfig,
    selectConfig,
    sigmoidConfig,
    sliceConfig,
    stridedSliceConfig,
    stringNGramsConfig,
    softmaxConfig,
    spaceToBatchNDConfig,
    sqrtConfig,
    squareConfig,
    squaredDifferenceConfig,
    subConfig,
    sumConfig,
    tanhConfig,
    tileConfig,
    transformConfig,
    transposeConfig,
    unpackConfig,
    zerosLikeConfig
];
for (var _i = 0, kernelConfigs_1 = kernelConfigs; _i < kernelConfigs_1.length; _i++) {
    var kernelConfig = kernelConfigs_1[_i];
    tf.registerKernel(kernelConfig);
}


var Module = (function() {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  return (
function(Module) {
  Module = Module || {};

var d;d||(d=typeof Module !== 'undefined' ? Module : {});d.compileGLSLZeroCopy=function(a,b,c){c=!!c;if("vertex"===b)var e=0;else if("fragment"===b)e=4;else if("compute"===b)e=5;else throw Error("shader_stage must be 'vertex', 'fragment', or 'compute'");b=d._malloc(4);var g=d._malloc(4),f=aa([a,e,c,b,g]);c=ba(b);a=ba(g);d._free(b);d._free(g);if(0===f)throw Error("GLSL compilation failed");b={};g=c/4;b.data=d.HEAPU32.subarray(g,g+a);b.free=function(){d._destroy_output_buffer(f);};return b};
d.compileGLSL=function(a,b,c){a=d.compileGLSLZeroCopy(a,b,c);b=a.data.slice();a.free();return b};var k={},p;for(p in d)d.hasOwnProperty(p)&&(k[p]=d[p]);var ca="./this.program",r=!1,t=!1;r="object"===typeof window;t="function"===typeof importScripts;var u="",w;
if(r||t)t?u=self.location.href:document.currentScript&&(u=document.currentScript.src),_scriptDir&&(u=_scriptDir),0!==u.indexOf("blob:")?u=u.substr(0,u.lastIndexOf("/")+1):u="",t&&(w=function(a){var b=new XMLHttpRequest;b.open("GET",a,!1);b.responseType="arraybuffer";b.send(null);return new Uint8Array(b.response)});var da=d.print||console.log.bind(console),x=d.printErr||console.warn.bind(console);for(p in k)k.hasOwnProperty(p)&&(d[p]=k[p]);k=null;d.thisProgram&&(ca=d.thisProgram);var y;
d.wasmBinary&&(y=d.wasmBinary);"object"!==typeof WebAssembly&&x("no native wasm support detected");function ba(a){var b="i32";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":return z[a>>0];case "i8":return z[a>>0];case "i16":return A[a>>1];case "i32":return B[a>>2];case "i64":return B[a>>2];case "float":return C[a>>2];case "double":return D[a>>3];default:E("invalid type for getValue: "+b);}return null}var F,ea=new WebAssembly.Table({initial:861,maximum:861,element:"anyfunc"}),fa=!1;
function ha(){var a=d._convert_glsl_to_spirv;a||E("Assertion failed: Cannot call unknown function convert_glsl_to_spirv, make sure it is exported");return a}
function aa(a){var b=["string","number","boolean","number","number"],c={string:function(a){var b=0;if(null!==a&&void 0!==a&&0!==a){var c=(a.length<<2)+1;b=ia(c);G(a,H,b,c);}return b},array:function(a){var b=ia(a.length);z.set(a,b);return b}},e=ha(),g=[],f=0;if(a)for(var h=0;h<a.length;h++){var m=c[b[h]];m?(0===f&&(f=ja()),g[h]=m(a[h])):g[h]=a[h];}a=e.apply(null,g);0!==f&&ka(f);return a}var la="undefined"!==typeof TextDecoder?new TextDecoder("utf8"):void 0;
function ma(a,b,c){var e=b+c;for(c=b;a[c]&&!(c>=e);)++c;if(16<c-b&&a.subarray&&la)return la.decode(a.subarray(b,c));for(e="";b<c;){var g=a[b++];if(g&128){var f=a[b++]&63;if(192==(g&224))e+=String.fromCharCode((g&31)<<6|f);else {var h=a[b++]&63;g=224==(g&240)?(g&15)<<12|f<<6|h:(g&7)<<18|f<<12|h<<6|a[b++]&63;65536>g?e+=String.fromCharCode(g):(g-=65536,e+=String.fromCharCode(55296|g>>10,56320|g&1023));}}else e+=String.fromCharCode(g);}return e}function I(a){return a?ma(H,a,void 0):""}
function G(a,b,c,e){if(0<e){e=c+e-1;for(var g=0;g<a.length;++g){var f=a.charCodeAt(g);if(55296<=f&&57343>=f){var h=a.charCodeAt(++g);f=65536+((f&1023)<<10)|h&1023;}if(127>=f){if(c>=e)break;b[c++]=f;}else {if(2047>=f){if(c+1>=e)break;b[c++]=192|f>>6;}else {if(65535>=f){if(c+2>=e)break;b[c++]=224|f>>12;}else {if(c+3>=e)break;b[c++]=240|f>>18;b[c++]=128|f>>12&63;}b[c++]=128|f>>6&63;}b[c++]=128|f&63;}}b[c]=0;}}
function na(a){for(var b=0,c=0;c<a.length;++c){var e=a.charCodeAt(c);55296<=e&&57343>=e&&(e=65536+((e&1023)<<10)|a.charCodeAt(++c)&1023);127>=e?++b:b=2047>=e?b+2:65535>=e?b+3:b+4;}return b}"undefined"!==typeof TextDecoder&&new TextDecoder("utf-16le");function oa(a){0<a%65536&&(a+=65536-a%65536);return a}var J,z,H,A,pa,B,K,C,D;
function qa(a){J=a;d.HEAP8=z=new Int8Array(a);d.HEAP16=A=new Int16Array(a);d.HEAP32=B=new Int32Array(a);d.HEAPU8=H=new Uint8Array(a);d.HEAPU16=pa=new Uint16Array(a);d.HEAPU32=K=new Uint32Array(a);d.HEAPF32=C=new Float32Array(a);d.HEAPF64=D=new Float64Array(a);}var ra=d.TOTAL_MEMORY||16777216;d.wasmMemory?F=d.wasmMemory:F=new WebAssembly.Memory({initial:ra/65536});F&&(J=F.buffer);ra=J.byteLength;qa(J);B[79464]=5560896;
function L(a){for(;0<a.length;){var b=a.shift();if("function"==typeof b)b();else {var c=b.T;"number"===typeof c?void 0===b.R?d.dynCall_v(c):d.dynCall_vi(c,b.R):c(void 0===b.R?null:b.R);}}}var sa=[],ta=[],ua=[],va=[];function wa(){var a=d.preRun.shift();sa.unshift(a);}var M=0,N=null;d.preloadedImages={};d.preloadedAudios={};function E(a){if(d.onAbort)d.onAbort(a);da(a);x(a);fa=!0;throw new WebAssembly.RuntimeError("abort("+a+"). Build with -s ASSERTIONS=1 for more info.");}
function ya(){var a=O;return String.prototype.startsWith?a.startsWith("data:application/octet-stream;base64,"):0===a.indexOf("data:application/octet-stream;base64,")}var O=wasmuri;if(!ya()){var za=O;O=d.locateFile?d.locateFile(za,u):u+za;}function Aa(){try{if(y)return new Uint8Array(y);if(w)return w(O);throw "both async and sync fetching of the wasm failed";}catch(a){E(a);}}
function Ba(){return y||!r&&!t||"function"!==typeof fetch?new Promise(function(a){a(Aa());}):fetch(O,{credentials:"same-origin"}).then(function(a){if(!a.ok)throw "failed to load wasm binary file at '"+O+"'";return a.arrayBuffer()}).catch(function(){return Aa()})}ta.push({T:function(){Ca();}});var Da=[null,[],[]],Ea=0;function Fa(){Ea+=4;return B[Ea-4>>2]}var Ga={};
function Ha(a){switch(a){case 1:return 0;case 2:return 1;case 4:return 2;case 8:return 3;default:throw new TypeError("Unknown type size: "+a);}}var Ia=void 0;function P(a){for(var b="";H[a];)b+=Ia[H[a++]];return b}var Ja={},Ka={};function Na(a,b){if(void 0===a)a="_unknown";else {a=a.replace(/[^a-zA-Z0-9_]/g,"$");var c=a.charCodeAt(0);a=48<=c&&57>=c?"_"+a:a;}return (new Function("body","return function "+a+'() {\n    "use strict";    return body.apply(this, arguments);\n};\n'))(b)}
function Oa(a){var b=Error,c=Na(a,function(b){this.name=a;this.message=b;b=Error(b).stack;void 0!==b&&(this.stack=this.toString()+"\n"+b.replace(/^Error(:[^\n]*)?\n/,""));});c.prototype=Object.create(b.prototype);c.prototype.constructor=c;c.prototype.toString=function(){return void 0===this.message?this.name:this.name+": "+this.message};return c}var Pa=void 0;function Q(a){throw new Pa(a);}
function R(a,b,c){c=c||{};if(!("argPackAdvance"in b))throw new TypeError("registerType registeredInstance requires argPackAdvance");var e=b.name;a||Q('type "'+e+'" must have a positive integer typeid pointer');if(Ka.hasOwnProperty(a)){if(c.U)return;Q("Cannot register type '"+e+"' twice");}Ka[a]=b;Ja.hasOwnProperty(a)&&(b=Ja[a],delete Ja[a],b.forEach(function(a){a();}));}var Qa=[],S=[{},{value:void 0},{value:null},{value:!0},{value:!1}];
function Ra(a){switch(a){case void 0:return 1;case null:return 2;case !0:return 3;case !1:return 4;default:var b=Qa.length?Qa.pop():S.length;S[b]={W:1,value:a};return b}}function Sa(a){return this.fromWireType(K[a>>2])}function Ta(a){if(null===a)return "null";var b=typeof a;return "object"===b||"array"===b||"function"===b?a.toString():""+a}
function Ua(a,b){switch(b){case 2:return function(a){return this.fromWireType(C[a>>2])};case 3:return function(a){return this.fromWireType(D[a>>3])};default:throw new TypeError("Unknown float type: "+a);}}
function Va(a,b,c){switch(b){case 0:return c?function(a){return z[a]}:function(a){return H[a]};case 1:return c?function(a){return A[a>>1]}:function(a){return pa[a>>1]};case 2:return c?function(a){return B[a>>2]}:function(a){return K[a>>2]};default:throw new TypeError("Unknown integer type: "+a);}}var Wa={};
function Xa(){if(!Ya){var a={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"===typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:ca},b;for(b in Wa)a[b]=Wa[b];var c=[];for(b in a)c.push(b+"="+a[b]);Ya=c;}return Ya}var Ya;function T(a){return 0===a%4&&(0!==a%100||0===a%400)}function Za(a,b){for(var c=0,e=0;e<=b;c+=a[e++]);return c}var U=[31,29,31,30,31,30,31,31,30,31,30,31],V=[31,28,31,30,31,30,31,31,30,31,30,31];
function W(a,b){for(a=new Date(a.getTime());0<b;){var c=a.getMonth(),e=(T(a.getFullYear())?U:V)[c];if(b>e-a.getDate())b-=e-a.getDate()+1,a.setDate(1),11>c?a.setMonth(c+1):(a.setMonth(0),a.setFullYear(a.getFullYear()+1));else {a.setDate(a.getDate()+b);break}}return a}
function $a(a,b,c,e){function g(a,b,c){for(a="number"===typeof a?a.toString():a||"";a.length<b;)a=c[0]+a;return a}function f(a,b){return g(a,b,"0")}function h(a,b){function c(a){return 0>a?-1:0<a?1:0}var f;0===(f=c(a.getFullYear()-b.getFullYear()))&&0===(f=c(a.getMonth()-b.getMonth()))&&(f=c(a.getDate()-b.getDate()));return f}function m(a){switch(a.getDay()){case 0:return new Date(a.getFullYear()-1,11,29);case 1:return a;case 2:return new Date(a.getFullYear(),0,3);case 3:return new Date(a.getFullYear(),
0,2);case 4:return new Date(a.getFullYear(),0,1);case 5:return new Date(a.getFullYear()-1,11,31);case 6:return new Date(a.getFullYear()-1,11,30)}}function q(a){a=W(new Date(a.J+1900,0,1),a.P);var b=m(new Date(a.getFullYear()+1,0,4));return 0>=h(m(new Date(a.getFullYear(),0,4)),a)?0>=h(b,a)?a.getFullYear()+1:a.getFullYear():a.getFullYear()-1}var l=B[e+40>>2];e={Z:B[e>>2],Y:B[e+4>>2],N:B[e+8>>2],M:B[e+12>>2],K:B[e+16>>2],J:B[e+20>>2],O:B[e+24>>2],P:B[e+28>>2],ia:B[e+32>>2],X:B[e+36>>2],$:l?I(l):""};
c=I(c);l={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"};for(var n in l)c=c.replace(new RegExp(n,"g"),l[n]);var v="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
La="January February March April May June July August September October November December".split(" ");l={"%a":function(a){return v[a.O].substring(0,3)},"%A":function(a){return v[a.O]},"%b":function(a){return La[a.K].substring(0,3)},"%B":function(a){return La[a.K]},"%C":function(a){return f((a.J+1900)/100|0,2)},"%d":function(a){return f(a.M,2)},"%e":function(a){return g(a.M,2," ")},"%g":function(a){return q(a).toString().substring(2)},"%G":function(a){return q(a)},"%H":function(a){return f(a.N,2)},
"%I":function(a){a=a.N;0==a?a=12:12<a&&(a-=12);return f(a,2)},"%j":function(a){return f(a.M+Za(T(a.J+1900)?U:V,a.K-1),3)},"%m":function(a){return f(a.K+1,2)},"%M":function(a){return f(a.Y,2)},"%n":function(){return "\n"},"%p":function(a){return 0<=a.N&&12>a.N?"AM":"PM"},"%S":function(a){return f(a.Z,2)},"%t":function(){return "\t"},"%u":function(a){return a.O||7},"%U":function(a){var b=new Date(a.J+1900,0,1),c=0===b.getDay()?b:W(b,7-b.getDay());a=new Date(a.J+1900,a.K,a.M);return 0>h(c,a)?f(Math.ceil((31-
c.getDate()+(Za(T(a.getFullYear())?U:V,a.getMonth()-1)-31)+a.getDate())/7),2):0===h(c,b)?"01":"00"},"%V":function(a){var b=m(new Date(a.J+1900,0,4)),c=m(new Date(a.J+1901,0,4)),e=W(new Date(a.J+1900,0,1),a.P);return 0>h(e,b)?"53":0>=h(c,e)?"01":f(Math.ceil((b.getFullYear()<a.J+1900?a.P+32-b.getDate():a.P+1-b.getDate())/7),2)},"%w":function(a){return a.O},"%W":function(a){var b=new Date(a.J,0,1),c=1===b.getDay()?b:W(b,0===b.getDay()?1:7-b.getDay()+1);a=new Date(a.J+1900,a.K,a.M);return 0>h(c,a)?f(Math.ceil((31-
c.getDate()+(Za(T(a.getFullYear())?U:V,a.getMonth()-1)-31)+a.getDate())/7),2):0===h(c,b)?"01":"00"},"%y":function(a){return (a.J+1900).toString().substring(2)},"%Y":function(a){return a.J+1900},"%z":function(a){a=a.X;var b=0<=a;a=Math.abs(a)/60;return (b?"+":"-")+String("0000"+(a/60*100+a%60)).slice(-4)},"%Z":function(a){return a.$},"%%":function(){return "%"}};for(n in l)0<=c.indexOf(n)&&(c=c.replace(new RegExp(n,"g"),l[n](e)));n=ab(c);if(n.length>b)return 0;z.set(n,a);return n.length-1}
for(var bb=Array(256),X=0;256>X;++X)bb[X]=String.fromCharCode(X);Ia=bb;Pa=d.BindingError=Oa("BindingError");d.InternalError=Oa("InternalError");d.count_emval_handles=function(){for(var a=0,b=5;b<S.length;++b)void 0!==S[b]&&++a;return a};d.get_first_emval=function(){for(var a=5;a<S.length;++a)if(void 0!==S[a])return S[a];return null};function ab(a){var b=Array(na(a)+1);G(a,b,0,b.length);return b}
var db={j:function(){},g:function(){d.___errno_location&&(B[d.___errno_location()>>2]=63);return -1},v:function(a,b){Ea=b;try{var c=Fa();var e=Fa();if(-1===c||0===e)var g=-28;else {var f=Ga.V[c];if(f&&e===f.fa){var h=(void 0).da(f.ca);Ga.ba(c,h,e,f.flags);(void 0).ha(h);Ga.V[c]=null;f.aa&&Y(f.ga);}g=0;}return g}catch(m){return E(m),-m.S}},d:function(){},s:function(a,b,c,e,g){var f=Ha(c);b=P(b);R(a,{name:b,fromWireType:function(a){return !!a},toWireType:function(a,b){return b?e:g},argPackAdvance:8,readValueFromPointer:function(a){if(1===
c)var e=z;else if(2===c)e=A;else if(4===c)e=B;else throw new TypeError("Unknown boolean type size: "+b);return this.fromWireType(e[a>>f])},L:null});},q:function(a,b){b=P(b);R(a,{name:b,fromWireType:function(a){var b=S[a].value;4<a&&0===--S[a].W&&(S[a]=void 0,Qa.push(a));return b},toWireType:function(a,b){return Ra(b)},argPackAdvance:8,readValueFromPointer:Sa,L:null});},e:function(a,b,c){c=Ha(c);b=P(b);R(a,{name:b,fromWireType:function(a){return a},toWireType:function(a,b){if("number"!==typeof b&&"boolean"!==
typeof b)throw new TypeError('Cannot convert "'+Ta(b)+'" to '+this.name);return b},argPackAdvance:8,readValueFromPointer:Ua(b,c),L:null});},b:function(a,b,c,e,g){function f(a){return a}b=P(b);-1===g&&(g=4294967295);var h=Ha(c);if(0===e){var m=32-8*c;f=function(a){return a<<m>>>m};}var q=-1!=b.indexOf("unsigned");R(a,{name:b,fromWireType:f,toWireType:function(a,c){if("number"!==typeof c&&"boolean"!==typeof c)throw new TypeError('Cannot convert "'+Ta(c)+'" to '+this.name);if(c<e||c>g)throw new TypeError('Passing a number "'+
Ta(c)+'" from JS side to C/C++ side to an argument of type "'+b+'", which is outside the valid range ['+e+", "+g+"]!");return q?c>>>0:c|0},argPackAdvance:8,readValueFromPointer:Va(b,h,0!==e),L:null});},a:function(a,b,c){function e(a){a>>=2;var b=K;return new g(b.buffer,b[a+1],b[a])}var g=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array][b];c=P(c);R(a,{name:c,fromWireType:e,argPackAdvance:8,readValueFromPointer:e},{U:!0});},f:function(a,b){b=P(b);var c="std::string"===
b;R(a,{name:b,fromWireType:function(a){var b=K[a>>2];if(c){var f=H[a+4+b],e=0;0!=f&&(e=f,H[a+4+b]=0);var m=a+4;for(f=0;f<=b;++f){var q=a+4+f;if(0==H[q]){m=I(m);if(void 0===l)var l=m;else l+=String.fromCharCode(0),l+=m;m=q+1;}}0!=e&&(H[a+4+b]=e);}else {l=Array(b);for(f=0;f<b;++f)l[f]=String.fromCharCode(H[a+4+f]);l=l.join("");}Y(a);return l},toWireType:function(a,b){b instanceof ArrayBuffer&&(b=new Uint8Array(b));var f="string"===typeof b;f||b instanceof Uint8Array||b instanceof Uint8ClampedArray||b instanceof
Int8Array||Q("Cannot pass non-string to std::string");var e=(c&&f?function(){return na(b)}:function(){return b.length})(),g=cb(4+e+1);K[g>>2]=e;if(c&&f)G(b,H,g+4,e+1);else if(f)for(f=0;f<e;++f){var q=b.charCodeAt(f);255<q&&(Y(g),Q("String has UTF-16 code units that do not fit in 8 bits"));H[g+4+f]=q;}else for(f=0;f<e;++f)H[g+4+f]=b[f];null!==a&&a.push(Y,g);return g},argPackAdvance:8,readValueFromPointer:Sa,L:function(a){Y(a);}});},r:function(a,b,c){c=P(c);if(2===b){var e=function(){return pa};var g=
1;}else 4===b&&(e=function(){return K},g=2);R(a,{name:c,fromWireType:function(a){for(var b=e(),c=K[a>>2],f=Array(c),l=a+4>>g,n=0;n<c;++n)f[n]=String.fromCharCode(b[l+n]);Y(a);return f.join("")},toWireType:function(a,c){var f=c.length,h=cb(4+f*b),l=e();K[h>>2]=f;for(var n=h+4>>g,v=0;v<f;++v)l[n+v]=c.charCodeAt(v);null!==a&&a.push(Y,h);return h},argPackAdvance:8,readValueFromPointer:Sa,L:function(a){Y(a);}});},t:function(a,b){b=P(b);R(a,{ea:!0,name:b,argPackAdvance:0,fromWireType:function(){},toWireType:function(){}});},
c:function(){E();},n:function(a,b,c){H.set(H.subarray(b,b+c),a);},o:function(a){if(2147418112<a)return !1;for(var b=Math.max(z.length,16777216);b<a;)536870912>=b?b=oa(2*b):b=Math.min(oa((3*b+2147483648)/4),2147418112);a:{try{F.grow(b-J.byteLength+65535>>16);qa(F.buffer);var c=1;break a}catch(e){}c=void 0;}return c?!0:!1},h:function(a,b){var c=0;Xa().forEach(function(e,g){var f=b+c;g=B[a+4*g>>2]=f;for(f=0;f<e.length;++f)z[g++>>0]=e.charCodeAt(f);z[g>>0]=0;c+=e.length+1;});return 0},i:function(a,b){var c=
Xa();B[a>>2]=c.length;var e=0;c.forEach(function(a){e+=a.length+1;});B[b>>2]=e;return 0},l:function(){return 0},m:function(){return 0},k:function(a,b,c,e){try{for(var g=0,f=0;f<c;f++){for(var h=B[b+8*f>>2],m=B[b+(8*f+4)>>2],q=0;q<m;q++){var l=H[h+q],n=Da[a];0===l||10===l?((1===a?da:x)(ma(n,0)),n.length=0):n.push(l);}g+=m;}B[e>>2]=g;return 0}catch(v){return E(v),v.S}},memory:F,w:function(){},p:function(){},u:function(a,b,c,e){return $a(a,b,c,e)},table:ea},eb=function(){function a(a){d.asm=a.exports;M--;
d.monitorRunDependencies&&d.monitorRunDependencies(M);0==M&&(N&&(a=N,N=null,a()));}function b(b){a(b.instance);}function c(a){return Ba().then(function(a){return WebAssembly.instantiate(a,e)}).then(a,function(a){x("failed to asynchronously prepare wasm: "+a);E(a);})}var e={env:db,wasi_unstable:db};M++;d.monitorRunDependencies&&d.monitorRunDependencies(M);if(d.instantiateWasm)try{return d.instantiateWasm(e,a)}catch(g){return x("Module.instantiateWasm callback failed with error: "+
g),!1}(function(){if(y||"function"!==typeof WebAssembly.instantiateStreaming||ya()||"function"!==typeof fetch)return c(b);fetch(O,{credentials:"same-origin"}).then(function(a){return WebAssembly.instantiateStreaming(a,e).then(b,function(a){x("wasm streaming compile failed: "+a);x("falling back to ArrayBuffer instantiation");c(b);})});})();return {}}();d.asm=eb;var Ca=d.___wasm_call_ctors=function(){return d.asm.x.apply(null,arguments)};d._convert_glsl_to_spirv=function(){return d.asm.y.apply(null,arguments)};
d._destroy_output_buffer=function(){return d.asm.z.apply(null,arguments)};var cb=d._malloc=function(){return d.asm.A.apply(null,arguments)},Y=d._free=function(){return d.asm.B.apply(null,arguments)};d.___getTypeName=function(){return d.asm.C.apply(null,arguments)};d.___embind_register_native_and_builtin_types=function(){return d.asm.D.apply(null,arguments)};
var ja=d.stackSave=function(){return d.asm.E.apply(null,arguments)},ia=d.stackAlloc=function(){return d.asm.F.apply(null,arguments)},ka=d.stackRestore=function(){return d.asm.G.apply(null,arguments)};d.dynCall_vi=function(){return d.asm.H.apply(null,arguments)};d.dynCall_v=function(){return d.asm.I.apply(null,arguments)};d.asm=eb;var Z;d.then=function(a){if(Z)a(d);else {var b=d.onRuntimeInitialized;d.onRuntimeInitialized=function(){b&&b();a(d);};}return d};N=function fb(){Z||gb();Z||(N=fb);};
function gb(){function a(){if(!Z&&(Z=!0,!fa)){L(ta);L(ua);if(d.onRuntimeInitialized)d.onRuntimeInitialized();if(d.postRun)for("function"==typeof d.postRun&&(d.postRun=[d.postRun]);d.postRun.length;){var a=d.postRun.shift();va.unshift(a);}L(va);}}if(!(0<M)){if(d.preRun)for("function"==typeof d.preRun&&(d.preRun=[d.preRun]);d.preRun.length;)wa();L(sa);0<M||(d.setStatus?(d.setStatus("Running..."),setTimeout(function(){setTimeout(function(){d.setStatus("");},1);a();},1)):a());}}d.run=gb;
if(d.preInit)for("function"==typeof d.preInit&&(d.preInit=[d.preInit]);0<d.preInit.length;)d.preInit.pop()();gb();


  return Module
}
);
})();
var glslangInit = (() => {
  const initialize = () => {
    return new Promise(resolve => {
      Module({
        locateFile() {
          return wasmuri;
        },
        onRuntimeInitialized() {
          resolve({
            compileGLSLZeroCopy: this.compileGLSLZeroCopy,
            compileGLSL: this.compileGLSL,
          });
        },
      });
    });
  };

  let instance;
  return () => {
    if (!instance) {
      instance = initialize();
    }
    return instance;
  };
})();

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var BufferManager = /** @class */ (function () {
    function BufferManager(device) {
        this.device = device;
        this.numUsedBuffers = 0;
        this.numFreeBuffers = 0;
        this.freeBuffers = new Map();
        this.usedBuffers = new Map();
        this.numBytesUsed = 0;
        this.numBytesAllocated = 0;
    }
    BufferManager.prototype.acquireBuffer = function (byteSize, usage) {
        var key = getBufferKey(byteSize, usage);
        if (!this.freeBuffers.has(key)) {
            this.freeBuffers.set(key, []);
        }
        if (!this.usedBuffers.has(key)) {
            this.usedBuffers.set(key, []);
        }
        this.numBytesUsed += byteSize;
        this.numUsedBuffers++;
        if (this.freeBuffers.get(key).length > 0) {
            this.numFreeBuffers--;
            var newBuffer_1 = this.freeBuffers.get(key).shift();
            this.usedBuffers.get(key).push(newBuffer_1);
            return newBuffer_1;
        }
        this.numBytesAllocated += byteSize;
        var newBuffer = this.device.createBuffer({ size: byteSize, usage: usage });
        this.usedBuffers.get(key).push(newBuffer);
        return newBuffer;
    };
    BufferManager.prototype.releaseBuffer = function (buffer, byteSize, usage) {
        if (this.freeBuffers == null) {
            return;
        }
        var key = getBufferKey(byteSize, usage);
        if (!this.freeBuffers.has(key)) {
            this.freeBuffers.set(key, []);
        }
        this.freeBuffers.get(key).push(buffer);
        this.numFreeBuffers++;
        this.numUsedBuffers--;
        var bufferList = this.usedBuffers.get(key);
        var bufferIndex = bufferList.indexOf(buffer);
        if (bufferIndex < 0) {
            throw new Error('Cannot release a buffer that was never provided by this ' +
                'buffer manager');
        }
        bufferList.splice(bufferIndex, 1);
        this.numBytesUsed -= byteSize;
    };
    BufferManager.prototype.getNumUsedBuffers = function () {
        return this.numUsedBuffers;
    };
    BufferManager.prototype.getNumFreeBuffers = function () {
        return this.numFreeBuffers;
    };
    BufferManager.prototype.reset = function () {
        this.freeBuffers = new Map();
        this.usedBuffers = new Map();
        this.numUsedBuffers = 0;
        this.numFreeBuffers = 0;
        this.numBytesUsed = 0;
        this.numBytesAllocated = 0;
    };
    BufferManager.prototype.dispose = function () {
        if (this.freeBuffers == null && this.usedBuffers == null) {
            return;
        }
        this.freeBuffers.forEach(function (buffers, key) {
            buffers.forEach(function (buff) {
                buff.destroy();
            });
        });
        this.usedBuffers.forEach(function (buffers, key) {
            buffers.forEach(function (buff) {
                buff.destroy();
            });
        });
        this.freeBuffers = null;
        this.usedBuffers = null;
        this.numUsedBuffers = 0;
        this.numFreeBuffers = 0;
        this.numBytesUsed = 0;
        this.numBytesAllocated = 0;
    };
    return BufferManager;
}());
function getBufferKey(byteSize, usage) {
    return byteSize + "_" + usage;
}

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// Empirically determined constant used to determine size threshold for handing
// off execution to the CPU.
var CPU_HANDOFF_SIZE_THRESHOLD = tf.env().getNumber('CPU_HANDOFF_SIZE_THRESHOLD');
var DEFAULT_GPUBUFFER_USAGE = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;
var WebGPUBackend = /** @class */ (function (_super) {
    __extends(WebGPUBackend, _super);
    function WebGPUBackend(device, glslang, supportTimeQuery) {
        if (supportTimeQuery === void 0) { supportTimeQuery = false; }
        var _this = _super.call(this) || this;
        _this.commandQueueOwnedIds = new WeakSet();
        _this.tensorDisposalQueue = [];
        _this.uniformDisposalQueue = [];
        _this.disposed = false;
        _this.uploadWaitMs = 0;
        _this.downloadWaitMs = 0;
        _this.computePassNumberInEncoder = 0;
        _this.layoutCache = {};
        _this.pipelineCache = {};
        _this.device = device;
        _this.queue = device.queue;
        _this.currentCommandEncoder = null;
        _this.glslang = glslang;
        _this.supportTimeQuery = supportTimeQuery;
        _this.bufferManager = new BufferManager(_this.device);
        _this.tensorMap = new tf.DataStorage(_this, tf.engine());
        if (_this.supportTimeQuery) {
            _this.querySet = _this.device.createQuerySet({
                type: 'timestamp',
                count: 2,
            });
        }
        // FromPixel has only one input texture.
        _this.fromPixelLayout = _this.createTextureLayout();
        return _this;
    }
    WebGPUBackend.prototype.nextDataId = function () {
        return WebGPUBackend.nextDataId++;
    };
    WebGPUBackend.prototype.floatPrecision = function () {
        return 32;
    };
    WebGPUBackend.prototype.flushDisposalQueue = function () {
        var _this = this;
        this.tensorDisposalQueue.forEach(function (d) {
            _this.maybeReleaseBuffer(d);
            _this.tensorMap.delete(d);
        });
        this.uniformDisposalQueue.forEach(function (d) { return _this.bufferManager.releaseBuffer(d.buffer, d.byteSize, d.usage); });
        this.tensorDisposalQueue = [];
        this.uniformDisposalQueue = [];
    };
    /**
     * Dispose the memory if the dataId has 0 refCount. Return true if the memory
     * is released or memory is not managed in this backend, false if memory is
     * not cleared.
     * @param dataId
     * @oaram force Optional, remove the data regardless of refCount
     */
    WebGPUBackend.prototype.disposeData = function (dataId, force) {
        if (force === void 0) { force = false; }
        if (this.tensorMap.has(dataId)) {
            var data = this.tensorMap.get(dataId);
            data.refCount--;
            if (!force && data.refCount > 0) {
                return false;
            }
            if (this.commandQueueOwnedIds.has(dataId)) {
                this.tensorDisposalQueue.push(dataId);
                return false;
            }
            else {
                this.maybeReleaseBuffer(dataId);
            }
            var complexTensorInfos = this.tensorMap.get(dataId).complexTensorInfos;
            if (complexTensorInfos != null) {
                this.disposeData(complexTensorInfos.real.dataId, true);
                this.disposeData(complexTensorInfos.imag.dataId, true);
            }
            this.tensorMap.delete(dataId);
        }
        return true;
    };
    WebGPUBackend.prototype.memory = function () {
        return {
            numBytesInGPU: this.bufferManager.numBytesUsed,
            numBytesAllocatedInGPU: this.bufferManager.numBytesAllocated,
            unreliable: false
        };
    };
    WebGPUBackend.prototype.getBufferManager = function () {
        return this.bufferManager;
    };
    WebGPUBackend.prototype.acquireBuffer = function (byteSize, usage) {
        if (usage === void 0) { usage = DEFAULT_GPUBUFFER_USAGE; }
        return this.bufferManager.acquireBuffer(byteSize, usage);
    };
    WebGPUBackend.prototype.maybeReleaseBuffer = function (dataId) {
        var info = this.tensorMap.get(dataId);
        if (info != null && info.bufferInfo.buffer != null) {
            this.bufferManager.releaseBuffer(info.bufferInfo.buffer, info.bufferInfo.byteSize, info.bufferInfo.usage);
            info.bufferInfo.buffer = null;
        }
    };
    /** Return refCount of a `TensorData`. */
    WebGPUBackend.prototype.refCount = function (dataId) {
        if (this.tensorMap.has(dataId)) {
            var tensorData = this.tensorMap.get(dataId);
            return tensorData.refCount;
        }
        return 0;
    };
    /** Increase refCount of a `TensorData`. */
    WebGPUBackend.prototype.incRef = function (dataId) {
        var tensorData = this.tensorMap.get(dataId);
        tensorData.refCount++;
    };
    /** Decrease refCount of a `TensorData`. */
    WebGPUBackend.prototype.decRef = function (dataId) {
        if (this.tensorMap.has(dataId)) {
            var tensorData = this.tensorMap.get(dataId);
            tensorData.refCount--;
        }
    };
    WebGPUBackend.prototype.write = function (values, shape, dtype) {
        if (dtype === 'complex64' && values != null) {
            throw new Error("Cannot write to a complex64 dtype. " +
                "Please use tf.complex(real, imag).");
        }
        var dataId = { id: this.nextDataId() };
        var byteSize = tf.util.sizeFromShape(shape) * GPUBytesPerElement(dtype);
        // bool is stored in Uint8Array, converted it to Int32Array.
        if (dtype === 'bool' && values instanceof Uint8Array) {
            values = Int32Array.from(values);
        }
        this.tensorMap.set(dataId, {
            dtype: dtype,
            values: values,
            bufferInfo: { byteSize: byteSize, usage: DEFAULT_GPUBUFFER_USAGE },
            refCount: 1
        });
        return dataId;
    };
    WebGPUBackend.prototype.move = function (dataId, values, shape, dtype, refCount) {
        if (dtype === 'complex64') {
            throw new Error("Cannot write to a complex64 dtype. " +
                "Please use tf.complex(real, imag).");
        }
        var byteSize = tf.util.sizeFromShape(shape) * GPUBytesPerElement(dtype);
        this.tensorMap.set(dataId, {
            dtype: dtype,
            values: values,
            bufferInfo: { byteSize: byteSize, usage: DEFAULT_GPUBUFFER_USAGE },
            refCount: refCount
        });
    };
    WebGPUBackend.prototype.submitQueue = function () {
        this.queue.submit([this.currentCommandEncoder.finish()]);
        this.currentCommandEncoder = null;
        this.computePassNumberInEncoder = 0;
        this.commandQueueOwnedIds = new WeakSet();
        this.flushDisposalQueue();
    };
    WebGPUBackend.prototype.getBuffer = function (dataId) {
        this.uploadToGPU(dataId);
        return this.tensorMap.get(dataId).bufferInfo.buffer;
    };
    WebGPUBackend.prototype.ensureCommandEncoderReady = function () {
        if (!this.currentCommandEncoder) {
            this.currentCommandEncoder = this.device.createCommandEncoder();
        }
    };
    WebGPUBackend.prototype.getBufferData = function (info) {
        return __awaiter(this, void 0, void 0, function () {
            var staging, values;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (info.values != null) {
                            // Data is on the CPU.
                            return [2 /*return*/, info.values];
                        }
                        staging = this.acquireBuffer(info.bufferInfo.byteSize, GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ);
                        this.ensureCommandEncoderReady();
                        this.currentCommandEncoder.copyBufferToBuffer(info.bufferInfo.buffer, 0, staging, 0, info.bufferInfo.byteSize);
                        this.submitQueue();
                        return [4 /*yield*/, staging.mapAsync(GPUMapMode.READ)];
                    case 1:
                        _a.sent();
                        values = staging.getMappedRange().slice(0);
                        staging.unmap();
                        if (staging != null) {
                            this.bufferManager.releaseBuffer(staging, info.bufferInfo.byteSize, GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ);
                        }
                        return [2 /*return*/, values];
                }
            });
        });
    };
    WebGPUBackend.prototype.convertAndCacheOnCPU = function (dataId, data) {
        var info = this.tensorMap.get(dataId);
        this.maybeReleaseBuffer(dataId);
        info.values = data;
        return info.values;
    };
    // TODO: Remove once this is fixed:
    // https://github.com/tensorflow/tfjs/issues/1595
    WebGPUBackend.prototype.readSync = function (dataId) {
        var texData = this.tensorMap.get(dataId);
        var values = texData.values;
        if (values == null) {
            throw new Error('WebGPU readSync is only available for CPU-resident tensors.');
        }
        return values;
    };
    WebGPUBackend.prototype.read = function (dataId) {
        return __awaiter(this, void 0, void 0, function () {
            var info, values, vals, ps, realValues, imagValues, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.tensorMap.has(dataId)) {
                            throw new Error("Tensor " + dataId + " was not registered!");
                        }
                        info = this.tensorMap.get(dataId);
                        values = info.values;
                        if (values != null) {
                            // TODO(xing.xu@intel.com): Merge backend_util.BackendValues and
                            // backend_util.TypedArray.
                            return [2 /*return*/, this.convertAndCacheOnCPU(dataId, values)];
                        }
                        if (!(info.dtype === 'complex64')) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all([
                                this.read(info.complexTensorInfos.real.dataId),
                                this.read(info.complexTensorInfos.imag.dataId)
                            ])];
                    case 1:
                        ps = _a.sent();
                        realValues = ps[0];
                        imagValues = ps[1];
                        vals = tf.backend_util.mergeRealAndImagArrays(realValues, imagValues);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.getBufferData(info)];
                    case 3:
                        data = _a.sent();
                        vals =
                            ArrayBufferToTypedArray(data, info.dtype);
                        _a.label = 4;
                    case 4:
                        this.convertAndCacheOnCPU(dataId, vals);
                        return [2 /*return*/, vals];
                }
            });
        });
    };
    WebGPUBackend.prototype.bufferSync = function (t) {
        var data = this.readSync(t.dataId);
        var decodedData = data;
        if (t.dtype === 'string') {
            try {
                // Decode the bytes into string.
                decodedData = data.map(function (d) { return tf.util.decodeString(d); });
            }
            catch (_a) {
                throw new Error('Failed to decode encoded string bytes into utf-8');
            }
        }
        return tf.buffer(t.shape, t.dtype, decodedData);
    };
    WebGPUBackend.prototype.time = function (f) {
        return __awaiter(this, void 0, void 0, function () {
            var oldActiveTimers, newActiveTimers, outerMostTime, flattenedActiveTimerQueries, flattenedActiveTimerNames, res, kernelMs;
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
                        flattenedActiveTimerQueries = tf.util.flatten(this.activeTimers.map(function (d) { return d.query; }))
                            .filter(function (d) { return d != null; });
                        flattenedActiveTimerNames = tf.util.flatten(this.activeTimers.map(function (d) { return d.name; }))
                            .filter(function (d) { return d != null; });
                        this.activeTimers = oldActiveTimers;
                        if (outerMostTime) {
                            this.programTimersStack = null;
                        }
                        res = {
                            uploadWaitMs: this.uploadWaitMs,
                            downloadWaitMs: this.downloadWaitMs,
                            kernelMs: null,
                            wallMs: null
                        };
                        return [4 /*yield*/, Promise.all(flattenedActiveTimerQueries)];
                    case 1:
                        kernelMs = _a.sent();
                        res['kernelMs'] = tf.util.sum(kernelMs);
                        res['getExtraProfileInfo'] = function () {
                            return kernelMs.map(function (d, i) { return ({ name: flattenedActiveTimerNames[i], ms: d }); })
                                .map(function (d) { return d.name + ": " + d.ms; })
                                .join(', ');
                        };
                        this.uploadWaitMs = 0;
                        this.downloadWaitMs = 0;
                        return [2 /*return*/, res];
                }
            });
        });
    };
    WebGPUBackend.prototype.getAndSavePipeline = function (key, getPipeline) {
        if (!(key in this.pipelineCache)) {
            this.pipelineCache[key] = getPipeline();
        }
        return this.pipelineCache[key];
    };
    WebGPUBackend.prototype.makeTensorInfo = function (shape, dtype, values) {
        var dataId;
        if (dtype === 'string' && values != null && values.length > 0 &&
            tf.util.isString(values[0])) {
            var encodedValues = values.map(function (d) { return tf.util.encodeString(d); });
            dataId = this.write(encodedValues, shape, dtype);
        }
        else {
            dataId = this.write(values, shape, dtype);
        }
        return { dataId: dataId, shape: shape, dtype: dtype };
    };
    WebGPUBackend.prototype.tensorToBinding = function (tensor) {
        if (!tensor) {
            return null;
        }
        var tensorData = this.tensorMap.get(tensor.dataId);
        return {
            offset: 0,
            size: tensorData.bufferInfo.byteSize,
            buffer: tensorData.bufferInfo.buffer
        };
    };
    WebGPUBackend.prototype.getQueryTime = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.supportTimeQuery) {
                    return [2 /*return*/, this.getTimeFromQuerySet(query)];
                }
                else {
                    return [2 /*return*/, 0];
                }
            });
        });
    };
    WebGPUBackend.prototype.uploadToGPU = function (dataId) {
        var info = this.tensorMap.get(dataId);
        if (info.bufferInfo.buffer != null) {
            // Already on the GPU.
            return;
        }
        info.bufferInfo.buffer = this.acquireBuffer(info.bufferInfo.byteSize);
        if (info.values) {
            this.queue.writeBuffer(info.bufferInfo.buffer, 0, info.values);
            // TODO: WebGPU doesn't support read data synchronously from GPU to CPU.
            // So it will report error when switching backend from WebGPU to others.
            // There are two situations: 1) swithcing the backend after running a
            // model; 2) swithcing the backend within the model. Temporarilly keep the
            // values on CPU to solve the first issue.
            // info.values = null;
        }
    };
    WebGPUBackend.prototype.makeUniformsDataView = function (data) {
        var dimensionsBuffer = this.acquireBuffer(data.byteLength, GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM);
        this.queue.writeBuffer(dimensionsBuffer, 0, data);
        return { offset: 0, size: data.byteLength, buffer: dimensionsBuffer };
    };
    WebGPUBackend.prototype.arrayToDataView = function (arrays, length) {
        var BYTES_PER_ELEMENT = 4;
        var uniformDataView = new DataView(new ArrayBuffer(length * BYTES_PER_ELEMENT));
        var dataViewIndex = 0;
        arrays.forEach(function (array) {
            var arrayData = array.data;
            if (array.type !== 'int32' && array.type !== 'float32') {
                throw new Error(array.type + " not supported!");
            }
            if (array.type === 'int32') {
                arrayData.forEach(function (d) {
                    uniformDataView.setInt32(dataViewIndex * BYTES_PER_ELEMENT, d, true);
                    dataViewIndex++;
                });
            }
            else {
                arrayData.forEach(function (d) {
                    uniformDataView.setFloat32(dataViewIndex * BYTES_PER_ELEMENT, d, true);
                    dataViewIndex++;
                });
            }
        });
        return uniformDataView;
    };
    WebGPUBackend.prototype.computePadding = function (uniformsWithType) {
        var currentOffset = 0;
        var padding = 0;
        var dataViewIndex = 0;
        var dimUniformsData = [];
        uniformsWithType.forEach(function (d, i) {
            if (d.data.length === 0) {
                d.data = [1];
            }
            // Complete std140 layout rules are documented here:
            // tslint:disable-next-line:max-line-length
            // https://www.khronos.org/registry/OpenGL/specs/gl/glspec45.core.pdf#page=159
            var baseAlignment;
            switch (d.data.length) {
                case 0:
                    baseAlignment = 1;
                    break;
                case 1:
                    baseAlignment = 1;
                    break;
                case 2:
                    baseAlignment = 2;
                    break;
                case 3:
                    baseAlignment = 4;
                    break;
                case 4:
                    baseAlignment = 4;
                    break;
                default:
                    tf.util.assert(false, function () { return "Unsupported " + d.data.length + "D shape"; });
            }
            padding = Math.ceil(currentOffset / baseAlignment) * baseAlignment -
                currentOffset;
            for (var p = 0; p < padding; ++p) {
                dimUniformsData.push({ type: 'int32', data: [0] });
                dataViewIndex++;
            }
            dimUniformsData.push({ type: d.type, data: d.data });
            dataViewIndex = dataViewIndex + d.data.length;
            currentOffset += d.data.length + padding;
        });
        return this.arrayToDataView(dimUniformsData, dataViewIndex);
    };
    // This layout is used by all programs except fromPixel.
    WebGPUBackend.prototype.createLayout = function (inputEntrySize) {
        var bindGroupLayoutEntries = [];
        // Output buffer binding layout.
        bindGroupLayoutEntries.push({
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'storage' }
        });
        // Input buffer binding layout. Depends on variableNames length.
        for (var i = 0; i < inputEntrySize; i++) {
            bindGroupLayoutEntries.push({
                binding: i + 1,
                visibility: GPUShaderStage.COMPUTE,
                buffer: { type: 'read-only-storage' }
            });
        }
        bindGroupLayoutEntries.push({
            binding: inputEntrySize + 1,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'uniform' }
        });
        var bindGroupLayout = this.device.createBindGroupLayout({ entries: bindGroupLayoutEntries });
        var pipelineLayout = this.device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] });
        return { bindGroupLayout: bindGroupLayout, pipelineLayout: pipelineLayout };
    };
    // This layout is only used by fromPixel.
    WebGPUBackend.prototype.createTextureLayout = function () {
        var bindGroupLayoutEntries = [];
        // Output buffer binding layout.
        bindGroupLayoutEntries.push({
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'storage' }
        });
        // Input buffer binding layout.
        bindGroupLayoutEntries.push({
            binding: 1,
            visibility: GPUShaderStage.COMPUTE,
            storageTexture: { access: 'read-only', format: 'rgba8unorm' }
        });
        // Uniform buffer binding layout.
        bindGroupLayoutEntries.push({
            binding: 2,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'uniform' }
        });
        var fromPixelBindGroupLayout = this.device.createBindGroupLayout({ entries: bindGroupLayoutEntries });
        var fromPixelPipelineLayout = this.device.createPipelineLayout({ bindGroupLayouts: [fromPixelBindGroupLayout] });
        return {
            bindGroupLayout: fromPixelBindGroupLayout,
            pipelineLayout: fromPixelPipelineLayout
        };
    };
    WebGPUBackend.prototype.getCachedOrCreateLayout = function (inputEntrySize) {
        if (!(inputEntrySize in this.layoutCache)) {
            this.layoutCache[inputEntrySize] = this.createLayout(inputEntrySize);
        }
        return this.layoutCache[inputEntrySize];
    };
    WebGPUBackend.prototype.runWebGPUProgram = function (program, inputs, outputDtype, programUniforms) {
        var _this = this;
        var output = this.makeTensorInfo(program.outputShape, outputDtype);
        // There are five kinds of uniforms: NAN, shapes, shape strides, program
        // size, program defined uniforms.
        var uniformsWithType = [{ type: 'float32', data: [NaN] }];
        var bufferShapes = inputs.concat(output).map(function (d) { return d.shape; });
        bufferShapes.map(function (d) {
            uniformsWithType.push({ type: 'int32', data: d });
        });
        var strides = tf.util.computeStrides(output.shape);
        uniformsWithType.push({ type: 'int32', data: strides });
        if (program.size != null) {
            uniformsWithType.push({ type: 'int32', data: [program.size] });
        }
        if (programUniforms) {
            uniformsWithType = uniformsWithType.concat(programUniforms);
        }
        var uniforms = null;
        var uniformsDataView = this.computePadding(uniformsWithType);
        var uniformsByteLength = uniformsDataView.byteLength;
        uniforms = this.makeUniformsDataView(uniformsDataView);
        var inputsData = inputs.map(function (input, i) {
            if (input.dtype === 'complex64') {
                throw new Error("GPGPUProgram does not support complex64 input. For complex64 " +
                    "dtypes, please separate the program into real and imaginary " +
                    "parts.");
            }
            _this.uploadToGPU(input.dataId);
            return {
                // Returning dtype from tensorMap because it reflects dtype
                // of underlying buffer, rather than abstract dtype.
                dtype: _this.tensorMap.get(input.dataId).dtype,
                shape: input.shape,
                name: program.variableNames[i]
            };
        });
        this.uploadToGPU(output.dataId);
        var bufferTypes = inputsData.map(function (d) { return d.dtype; }).concat(output.dtype);
        var broadcastDims = inputsData.map(function (d) { return tf.backend_util.getBroadcastDims(d.shape, output.shape); });
        var inputShapesEqualsOutShape = inputsData.map(function (d) { return tf.util.arraysEqual(d.shape, output.shape); }).join('_');
        var broadcastDimsKey = broadcastDims.map(function (d) { return d.join('_'); }).join(';');
        var key = makeShaderKey(program, bufferShapes, bufferTypes, broadcastDimsKey, inputShapesEqualsOutShape);
        var _a = this.getCachedOrCreateLayout(program.variableNames.length), bindGroupLayout = _a.bindGroupLayout, pipelineLayout = _a.pipelineLayout;
        var pipeline = this.getAndSavePipeline(key, function () {
            return compileProgram(_this.glslang, _this.device, program, pipelineLayout, inputsData, output);
        });
        var shouldTimeProgram = this.activeTimers != null;
        // Creating bind groups on the fly should never be a bottleneck.
        var bg = makeBindGroup(this.device, bindGroupLayout, inputs.map(function (t) { return _this.tensorToBinding(t); }), this.tensorToBinding(output), uniforms);
        this.ensureCommandEncoderReady();
        var pass = this.currentCommandEncoder.beginComputePass();
        if (shouldTimeProgram) {
            if (this.supportTimeQuery) {
                pass.writeTimestamp(this.querySet, 0);
            }
        }
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bg);
        pass.dispatch(program.dispatch[0], program.dispatch[1], program.dispatch[2]);
        if (shouldTimeProgram) {
            if (this.supportTimeQuery) {
                pass.writeTimestamp(this.querySet, 1);
            }
        }
        pass.endPass();
        this.computePassNumberInEncoder++;
        inputs.forEach(function (input) {
            _this.commandQueueOwnedIds.add(input.dataId);
        });
        this.commandQueueOwnedIds.add(output.dataId);
        if (uniforms) {
            var uniformInfo = {
                byteSize: uniformsByteLength,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
                buffer: uniforms.buffer
            };
            this.uniformDisposalQueue.push(uniformInfo);
        }
        if (tf.env().get('WEBGPU_DEFERRED_SUBMIT_BATCH_SIZE') <= this.computePassNumberInEncoder) {
            this.submitQueue();
        }
        if (shouldTimeProgram) {
            this.activeTimers.push({
                name: program.constructor.name,
                query: this.getQueryTime(this.querySet)
            });
        }
        return output;
    };
    WebGPUBackend.prototype.recordFromPixelsCommands = function (output) {
        var bindGroup = this.device.createBindGroup({
            layout: this.fromPixelLayout.bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: output,
                    }
                },
                {
                    binding: 1,
                    resource: this.fromPixelProgram.inputTexture.createView(),
                },
                {
                    binding: 2,
                    resource: {
                        buffer: this.fromPixelProgram.uniform,
                    }
                }
            ],
        });
        this.ensureCommandEncoderReady();
        var passEncoder = this.currentCommandEncoder.beginComputePass();
        passEncoder.setPipeline(this.fromPixelProgram.pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatch(this.fromPixelProgram.dispatch[0], this.fromPixelProgram.dispatch[1], this.fromPixelProgram.dispatch[2]);
        passEncoder.endPass();
    };
    WebGPUBackend.prototype.getTimeFromQuerySet = function (querySet) {
        return __awaiter(this, void 0, void 0, function () {
            var queryBuffer, dst, arrayBuf, timeElapsedNanos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryBuffer = this.acquireBuffer(16, GPUBufferUsage.COPY_SRC | GPUBufferUsage.QUERY_RESOLVE);
                        dst = this.acquireBuffer(16, GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST);
                        this.ensureCommandEncoderReady();
                        this.currentCommandEncoder.resolveQuerySet(querySet, 0, 2, queryBuffer, 0);
                        this.currentCommandEncoder.copyBufferToBuffer(queryBuffer, 0, dst, 0, 16);
                        this.submitQueue();
                        return [4 /*yield*/, dst.mapAsync(GPUMapMode.READ)];
                    case 1:
                        _a.sent();
                        arrayBuf = new BigUint64Array(dst.getMappedRange());
                        timeElapsedNanos = Number((arrayBuf[1] - arrayBuf[0]));
                        dst.unmap();
                        this.bufferManager.releaseBuffer(dst, 16, GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST);
                        this.bufferManager.releaseBuffer(queryBuffer, 16, GPUBufferUsage.COPY_SRC | GPUBufferUsage.QUERY_RESOLVE);
                        // Return milliseconds.
                        return [2 /*return*/, timeElapsedNanos / 1000000];
                }
            });
        });
    };
    WebGPUBackend.prototype.shouldExecuteOnCPU = function (inputs, sizeThreshold) {
        var _this = this;
        if (sizeThreshold === void 0) { sizeThreshold = CPU_HANDOFF_SIZE_THRESHOLD; }
        return tf.env().getBool('WEBGPU_CPU_FORWARD') &&
            inputs.every(function (input) {
                return _this.tensorMap.get(input.dataId).bufferInfo.buffer == null &&
                    tf.util.sizeFromShape(input.shape) < sizeThreshold;
            });
    };
    WebGPUBackend.prototype.mapActivationToShaderProgram = function (activation, packed) {
        if (packed === void 0) { packed = false; }
        if (activation === 'linear') {
            return LINEAR;
        }
        else if (activation === 'relu') {
            return packed ? RELU_VEC4 : RELU;
        }
        else if (activation === 'elu') {
            return packed ? ELU_VEC4 : ELU;
        }
        else if (activation === 'relu6') {
            return RELU6;
        }
        else if (activation === 'prelu') {
            return getBinaryOpString(BinaryOpType.PRELU, packed);
        }
        else if (activation === 'sigmoid') {
            return SIGMOID;
        }
        throw new Error("Activation " + activation + " has not been implemented for the WebGPU backend.");
    };
    WebGPUBackend.prototype.numDataIds = function () {
        return this.tensorMap.numDataIds() - this.tensorDisposalQueue.length;
    };
    WebGPUBackend.prototype.dispose = function () {
        if (this.disposed) {
            return;
        }
        this.bufferManager.dispose();
        if (this.fromPixelProgram) {
            this.fromPixelProgram.dispose();
        }
        this.disposed = true;
    };
    WebGPUBackend.nextDataId = 0;
    return WebGPUBackend;
}(tf.KernelBackend));

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

var webgpu = {
    __proto__: null,
    webgpu_util: webgpu_util,
    WebGPUBackend: WebGPUBackend
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var _this = undefined;
tf.registerBackend('webgpu', function () { return __awaiter(_this, void 0, void 0, function () {
    var glslang, gpuDescriptor, adapter, deviceDescriptor, supportTimeQuery, device;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Remove it once we figure out how to correctly read the tensor data before
                // the tensor is disposed in profiling mode.
                tf.env().set('CHECK_COMPUTATION_FOR_ERRORS', false);
                return [4 /*yield*/, glslangInit()];
            case 1:
                glslang = _a.sent();
                gpuDescriptor = {
                    powerPreference: tf.env().get('WEBGPU_USE_LOW_POWER_GPU') ? 'low-power' :
                        'high-performance'
                };
                return [4 /*yield*/, navigator.gpu.requestAdapter(gpuDescriptor)];
            case 2:
                adapter = _a.sent();
                deviceDescriptor = {};
                supportTimeQuery = adapter.features.has('timestamp-query');
                if (supportTimeQuery) {
                    deviceDescriptor = {
                        nonGuaranteedFeatures: ['timestamp-query']
                    };
                }
                else {
                    console.warn("This device doesn't support timestamp-query extension. " +
                        "Zero will shown for the kernel time when profiling mode is enabled. " +
                        "Using performance.now is not workable for webgpu since it doesn't " +
                        "support synchronously to read data from GPU.");
                }
                return [4 /*yield*/, adapter.requestDevice(deviceDescriptor)];
            case 3:
                device = _a.sent();
                return [2 /*return*/, new WebGPUBackend(device, glslang, supportTimeQuery)];
        }
    });
}); }, 3 /*priority*/);

exports.webgpu = webgpu;


},{"@tensorflow/tfjs-core":3}],2:[function(require,module,exports){
var x = require('./tf-backend-webgpu.node.js');

},{"./tf-backend-webgpu.node.js":1}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,setImmediate){(function (){
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var EPSILON_FLOAT32 = 1e-7;
var EPSILON_FLOAT16 = 1e-4;
/** Convenient class for storing tensor-related data. */
var DataStorage = /** @class */ (function () {
    function DataStorage(backend, dataMover) {
        this.backend = backend;
        this.dataMover = dataMover;
        this.data = new WeakMap();
        this.dataIdsCount = 0;
    }
    DataStorage.prototype.get = function (dataId) {
        if (!this.data.has(dataId)) {
            this.dataMover.moveData(this.backend, dataId);
        }
        return this.data.get(dataId);
    };
    DataStorage.prototype.set = function (dataId, value) {
        this.dataIdsCount++;
        this.data.set(dataId, value);
    };
    DataStorage.prototype.has = function (dataId) {
        return this.data.has(dataId);
    };
    DataStorage.prototype.delete = function (dataId) {
        this.dataIdsCount--;
        return this.data.delete(dataId);
    };
    DataStorage.prototype.numDataIds = function () {
        return this.dataIdsCount;
    };
    return DataStorage;
}());
/**
 * The interface that defines the kernels that should be implemented when
 * adding a new backend. New backends don't need to implement every one of the
 * methods, this can be done gradually (throw an error for unimplemented
 * methods).
 */
var KernelBackend = /** @class */ (function () {
    function KernelBackend() {
    }
    KernelBackend.prototype.refCount = function (dataId) {
        return notYetImplemented('refCount');
    };
    KernelBackend.prototype.incRef = function (dataId) {
        return notYetImplemented('incRef');
    };
    KernelBackend.prototype.timerAvailable = function () {
        return true;
    };
    KernelBackend.prototype.time = function (f) {
        return notYetImplemented('time');
    };
    KernelBackend.prototype.read = function (dataId) {
        return notYetImplemented('read');
    };
    KernelBackend.prototype.readSync = function (dataId) {
        return notYetImplemented('readSync');
    };
    KernelBackend.prototype.numDataIds = function () {
        return notYetImplemented('numDataIds');
    };
    KernelBackend.prototype.disposeData = function (dataId, force) {
        return notYetImplemented('disposeData');
    };
    KernelBackend.prototype.write = function (values, shape, dtype) {
        return notYetImplemented('write');
    };
    KernelBackend.prototype.move = function (dataId, values, shape, dtype, refCount) {
        return notYetImplemented('move');
    };
    KernelBackend.prototype.memory = function () {
        return notYetImplemented('memory');
    };
    /** Returns the highest precision for floats in bits (e.g. 16 or 32) */
    KernelBackend.prototype.floatPrecision = function () {
        return notYetImplemented('floatPrecision');
    };
    /** Returns the smallest representable number.  */
    KernelBackend.prototype.epsilon = function () {
        return this.floatPrecision() === 32 ? EPSILON_FLOAT32 : EPSILON_FLOAT16;
    };
    KernelBackend.prototype.dispose = function () {
        return notYetImplemented('dispose');
    };
    return KernelBackend;
}());
function notYetImplemented(kernelName) {
    throw new Error("'" + kernelName + "' not yet implemented or not found in the registry. " +
        "This kernel may not be supported by the tfjs backend you have chosen");
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Shuffles the array in-place using Fisher-Yates algorithm.
 *
 * ```js
 * const a = [1, 2, 3, 4, 5];
 * tf.util.shuffle(a);
 * console.log(a);
 * ```
 *
 * @param array The array to shuffle in-place.
 *
 * @doc {heading: 'Util', namespace: 'util'}
 */
// tslint:disable-next-line:no-any
function shuffle(array) {
    var counter = array.length;
    var temp = 0;
    var index = 0;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = (Math.random() * counter) | 0;
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
}
/**
 * Shuffles two arrays in-place the same way using Fisher-Yates algorithm.
 *
 * ```js
 * const a = [1,2,3,4,5];
 * const b = [11,22,33,44,55];
 * tf.util.shuffleCombo(a, b);
 * console.log(a, b);
 * ```
 *
 * @param array The first array to shuffle in-place.
 * @param array2 The second array to shuffle in-place with the same permutation
 *     as the first array.
 *
 * @doc {heading: 'Util', namespace: 'util'}
 */
function shuffleCombo(
// tslint:disable-next-line:no-any
array, 
// tslint:disable-next-line:no-any
array2) {
    if (array.length !== array2.length) {
        throw new Error("Array sizes must match to be shuffled together " +
            ("First array length was " + array.length) +
            ("Second array length was " + array2.length));
    }
    var counter = array.length;
    var temp, temp2;
    var index = 0;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = (Math.random() * counter) | 0;
        // Decrease counter by 1
        counter--;
        // And swap the last element of each array with it
        temp = array[counter];
        temp2 = array2[counter];
        array[counter] = array[index];
        array2[counter] = array2[index];
        array[index] = temp;
        array2[index] = temp2;
    }
}
/** Clamps a value to a specified range. */
function clamp(min, x, max) {
    return Math.max(min, Math.min(x, max));
}
function nearestLargerEven(val) {
    return val % 2 === 0 ? val : val + 1;
}
function sum(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}
/**
 * Returns a sample from a uniform [a, b) distribution.
 *
 * @param a The minimum support (inclusive).
 * @param b The maximum support (exclusive).
 * @return A pseudorandom number on the half-open interval [a,b).
 */
function randUniform(a, b) {
    var r = Math.random();
    return (b * r) + (1 - r) * a;
}
/** Returns the squared Euclidean distance between two vectors. */
function distSquared(a, b) {
    var result = 0;
    for (var i = 0; i < a.length; i++) {
        var diff = Number(a[i]) - Number(b[i]);
        result += diff * diff;
    }
    return result;
}
/**
 * Asserts that the expression is true. Otherwise throws an error with the
 * provided message.
 *
 * ```js
 * const x = 2;
 * tf.util.assert(x === 2, 'x is not 2');
 * ```
 *
 * @param expr The expression to assert (as a boolean).
 * @param msg A function that returns the message to report when throwing an
 *     error. We use a function for performance reasons.
 *
 * @doc {heading: 'Util', namespace: 'util'}
 */
function assert(expr, msg) {
    if (!expr) {
        throw new Error(typeof msg === 'string' ? msg : msg());
    }
}
function assertShapesMatch(shapeA, shapeB, errorMessagePrefix) {
    if (errorMessagePrefix === void 0) { errorMessagePrefix = ''; }
    assert(arraysEqual(shapeA, shapeB), function () { return errorMessagePrefix + (" Shapes " + shapeA + " and " + shapeB + " must match"); });
}
function assertNonNull(a) {
    assert(a != null, function () { return "The input to the tensor constructor must be a non-null value."; });
}
// NOTE: We explicitly type out what T extends instead of any so that
// util.flatten on a nested array of number doesn't try to infer T as a
// number[][], causing us to explicitly type util.flatten<number>().
/**
 *  Flattens an arbitrarily nested array.
 *
 * ```js
 * const a = [[1, 2], [3, 4], [5, [6, [7]]]];
 * const flat = tf.util.flatten(a);
 * console.log(flat);
 * ```
 *
 *  @param arr The nested array to flatten.
 *  @param result The destination array which holds the elements.
 *  @param skipTypedArray If true, avoids flattening the typed arrays. Defaults
 *      to false.
 *
 * @doc {heading: 'Util', namespace: 'util'}
 */
function flatten(arr, result, skipTypedArray) {
    if (result === void 0) { result = []; }
    if (skipTypedArray === void 0) { skipTypedArray = false; }
    if (result == null) {
        result = [];
    }
    if (Array.isArray(arr) || isTypedArray(arr) && !skipTypedArray) {
        for (var i = 0; i < arr.length; ++i) {
            flatten(arr[i], result, skipTypedArray);
        }
    }
    else {
        result.push(arr);
    }
    return result;
}
/**
 * Returns the size (number of elements) of the tensor given its shape.
 *
 * ```js
 * const shape = [3, 4, 2];
 * const size = tf.util.sizeFromShape(shape);
 * console.log(size);
 * ```
 *
 * @doc {heading: 'Util', namespace: 'util'}
 */
function sizeFromShape(shape) {
    if (shape.length === 0) {
        // Scalar.
        return 1;
    }
    var size = shape[0];
    for (var i = 1; i < shape.length; i++) {
        size *= shape[i];
    }
    return size;
}
function isScalarShape(shape) {
    return shape.length === 0;
}
function arraysEqual(n1, n2) {
    if (n1 === n2) {
        return true;
    }
    if (n1 == null || n2 == null) {
        return false;
    }
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
function isInt(a) {
    return a % 1 === 0;
}
function tanh(x) {
    // tslint:disable-next-line:no-any
    if (Math.tanh != null) {
        // tslint:disable-next-line:no-any
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
function sizeToSquarishShape(size) {
    var width = Math.ceil(Math.sqrt(size));
    return [width, Math.ceil(size / width)];
}
/**
 * Creates a new array with randomized indicies to a given quantity.
 *
 * ```js
 * const randomTen = tf.util.createShuffledIndices(10);
 * console.log(randomTen);
 * ```
 *
 * @param number Quantity of how many shuffled indicies to create.
 *
 * @doc {heading: 'Util', namespace: 'util'}
 */
function createShuffledIndices(n) {
    var shuffledIndices = new Uint32Array(n);
    for (var i = 0; i < n; ++i) {
        shuffledIndices[i] = i;
    }
    shuffle(shuffledIndices);
    return shuffledIndices;
}
function rightPad(a, size) {
    if (size <= a.length) {
        return a;
    }
    return a + ' '.repeat(size - a.length);
}
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
        tryFn();
    });
}
/**
 * Given the full size of the array and a shape that may contain -1 as the
 * implicit dimension, returns the inferred shape where -1 is replaced.
 * E.g. For shape=[2, -1, 3] and size=24, it will return [2, 4, 3].
 *
 * @param shape The shape, which may contain -1 in some dimension.
 * @param size The full size (number of elements) of the array.
 * @return The inferred shape where -1 is replaced with the inferred size.
 */
function inferFromImplicitShape(shape, size) {
    var shapeProd = 1;
    var implicitIdx = -1;
    for (var i = 0; i < shape.length; ++i) {
        if (shape[i] >= 0) {
            shapeProd *= shape[i];
        }
        else if (shape[i] === -1) {
            if (implicitIdx !== -1) {
                throw Error("Shapes can only have 1 implicit size. " +
                    ("Found -1 at dim " + implicitIdx + " and dim " + i));
            }
            implicitIdx = i;
        }
        else if (shape[i] < 0) {
            throw Error("Shapes can not be < 0. Found " + shape[i] + " at dim " + i);
        }
    }
    if (implicitIdx === -1) {
        if (size > 0 && size !== shapeProd) {
            throw Error("Size(" + size + ") must match the product of shape " + shape);
        }
        return shape;
    }
    if (shapeProd === 0) {
        throw Error("Cannot infer the missing size in [" + shape + "] when " +
            "there are 0 elements");
    }
    if (size % shapeProd !== 0) {
        throw Error("The implicit shape can't be a fractional number. " +
            ("Got " + size + " / " + shapeProd));
    }
    var newShape = shape.slice();
    newShape[implicitIdx] = size / shapeProd;
    return newShape;
}
function parseAxisParam(axis, shape) {
    var rank = shape.length;
    // Normalize input
    axis = axis == null ? shape.map(function (s, i) { return i; }) : [].concat(axis);
    // Check for valid range
    assert(axis.every(function (ax) { return ax >= -rank && ax < rank; }), function () {
        return "All values in axis param must be in range [-" + rank + ", " + rank + ") but " +
            ("got axis " + axis);
    });
    // Check for only integers
    assert(axis.every(function (ax) { return isInt(ax); }), function () { return "All values in axis param must be integers but " +
        ("got axis " + axis); });
    // Handle negative axis.
    return axis.map(function (a) { return a < 0 ? rank + a : a; });
}
/** Reduces the shape by removing all dimensions of shape 1. */
function squeezeShape(shape, axis) {
    var newShape = [];
    var keptDims = [];
    var isEmptyArray = axis != null && Array.isArray(axis) && axis.length === 0;
    var axes = (axis == null || isEmptyArray) ?
        null :
        parseAxisParam(axis, shape).sort();
    var j = 0;
    for (var i = 0; i < shape.length; ++i) {
        if (axes != null) {
            if (axes[j] === i && shape[i] !== 1) {
                throw new Error("Can't squeeze axis " + i + " since its dim '" + shape[i] + "' is not 1");
            }
            if ((axes[j] == null || axes[j] > i) && shape[i] === 1) {
                newShape.push(shape[i]);
                keptDims.push(i);
            }
            if (axes[j] <= i) {
                j++;
            }
        }
        if (shape[i] !== 1) {
            newShape.push(shape[i]);
            keptDims.push(i);
        }
    }
    return { newShape: newShape, keptDims: keptDims };
}
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
function getArrayFromDType(dtype, size) {
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
    else if (dtype === 'string') {
        values = new Array(size);
    }
    else {
        throw new Error("Unknown data type " + dtype);
    }
    return values;
}
function checkConversionForErrors(vals, dtype) {
    for (var i = 0; i < vals.length; i++) {
        var num = vals[i];
        if (isNaN(num) || !isFinite(num)) {
            throw Error("A tensor of type " + dtype + " being uploaded contains " + num + ".");
        }
    }
}
/** Returns true if the dtype is valid. */
function isValidDtype(dtype) {
    return dtype === 'bool' || dtype === 'complex64' || dtype === 'float32' ||
        dtype === 'int32' || dtype === 'string';
}
/**
 * Returns true if the new type can't encode the old type without loss of
 * precision.
 */
function hasEncodingLoss(oldType, newType) {
    if (newType === 'complex64') {
        return false;
    }
    if (newType === 'float32' && oldType !== 'complex64') {
        return false;
    }
    if (newType === 'int32' && oldType !== 'float32' && oldType !== 'complex64') {
        return false;
    }
    if (newType === 'bool' && oldType === 'bool') {
        return false;
    }
    return true;
}
function isTypedArray(a) {
    return a instanceof Float32Array || a instanceof Int32Array ||
        a instanceof Uint8Array;
}
function bytesPerElement(dtype) {
    if (dtype === 'float32' || dtype === 'int32') {
        return 4;
    }
    else if (dtype === 'complex64') {
        return 8;
    }
    else if (dtype === 'bool') {
        return 1;
    }
    else {
        throw new Error("Unknown dtype " + dtype);
    }
}
/**
 * Returns the approximate number of bytes allocated in the string array - 2
 * bytes per character. Computing the exact bytes for a native string in JS is
 * not possible since it depends on the encoding of the html page that serves
 * the website.
 */
function bytesFromStringArray(arr) {
    if (arr == null) {
        return 0;
    }
    var bytes = 0;
    arr.forEach(function (x) { return bytes += x.length; });
    return bytes;
}
/** Returns true if the value is a string. */
function isString(value) {
    return typeof value === 'string' || value instanceof String;
}
function isBoolean(value) {
    return typeof value === 'boolean';
}
function isNumber(value) {
    return typeof value === 'number';
}
function inferDtype(values) {
    if (Array.isArray(values)) {
        return inferDtype(values[0]);
    }
    if (values instanceof Float32Array) {
        return 'float32';
    }
    else if (values instanceof Int32Array || values instanceof Uint8Array) {
        return 'int32';
    }
    else if (isNumber(values)) {
        return 'float32';
    }
    else if (isString(values)) {
        return 'string';
    }
    else if (isBoolean(values)) {
        return 'bool';
    }
    return 'float32';
}
function isFunction(f) {
    return !!(f && f.constructor && f.call && f.apply);
}
function nearestDivisor(size, start) {
    for (var i = start; i < size; ++i) {
        if (size % i === 0) {
            return i;
        }
    }
    return size;
}
function computeStrides(shape) {
    var rank = shape.length;
    if (rank < 2) {
        return [];
    }
    // Last dimension has implicit stride of 1, thus having D-1 (instead of D)
    // strides.
    var strides = new Array(rank - 1);
    strides[rank - 2] = shape[rank - 1];
    for (var i = rank - 3; i >= 0; --i) {
        strides[i] = strides[i + 1] * shape[i + 1];
    }
    return strides;
}
function createNestedArray(offset, shape, a, isComplex) {
    if (isComplex === void 0) { isComplex = false; }
    var ret = new Array();
    if (shape.length === 1) {
        var d = shape[0] * (isComplex ? 2 : 1);
        for (var i = 0; i < d; i++) {
            ret[i] = a[offset + i];
        }
    }
    else {
        var d = shape[0];
        var rest = shape.slice(1);
        var len = rest.reduce(function (acc, c) { return acc * c; }) * (isComplex ? 2 : 1);
        for (var i = 0; i < d; i++) {
            ret[i] = createNestedArray(offset + i * len, rest, a, isComplex);
        }
    }
    return ret;
}
// Provide a nested array of TypedArray in given shape.
function toNestedArray(shape, a, isComplex) {
    if (isComplex === void 0) { isComplex = false; }
    if (shape.length === 0) {
        // Scalar type should return a single number.
        return a[0];
    }
    var size = shape.reduce(function (acc, c) { return acc * c; }) * (isComplex ? 2 : 1);
    if (size === 0) {
        // A tensor with shape zero should be turned into empty list.
        return [];
    }
    if (size !== a.length) {
        throw new Error("[" + shape + "] does not match the input size " + a.length + (isComplex ? ' for a complex tensor' : '') + ".");
    }
    return createNestedArray(0, shape, a, isComplex);
}
function makeOnesTypedArray(size, dtype) {
    var array = makeZerosTypedArray(size, dtype);
    for (var i = 0; i < array.length; i++) {
        array[i] = 1;
    }
    return array;
}
function makeZerosTypedArray(size, dtype) {
    if (dtype == null || dtype === 'float32' || dtype === 'complex64') {
        return new Float32Array(size);
    }
    else if (dtype === 'int32') {
        return new Int32Array(size);
    }
    else if (dtype === 'bool') {
        return new Uint8Array(size);
    }
    else {
        throw new Error("Unknown data type " + dtype);
    }
}
/**
 * Make nested `TypedArray` filled with zeros.
 * @param shape The shape information for the nested array.
 * @param dtype dtype of the array element.
 */
function makeZerosNestedTypedArray(shape, dtype) {
    var size = shape.reduce(function (prev, curr) { return prev * curr; }, 1);
    if (dtype == null || dtype === 'float32') {
        return toNestedArray(shape, new Float32Array(size));
    }
    else if (dtype === 'int32') {
        return toNestedArray(shape, new Int32Array(size));
    }
    else if (dtype === 'bool') {
        return toNestedArray(shape, new Uint8Array(size));
    }
    else {
        throw new Error("Unknown data type " + dtype);
    }
}
function assertNonNegativeIntegerDimensions(shape) {
    shape.forEach(function (dimSize) {
        assert(Number.isInteger(dimSize) && dimSize >= 0, function () {
            return "Tensor must have a shape comprised of positive integers but got " +
                ("shape [" + shape + "].");
        });
    });
}
/**
 * Computes flat index for a given location (multidimentionsal index) in a
 * Tensor/multidimensional array.
 *
 * @param locs Location in the tensor.
 * @param rank Rank of the tensor.
 * @param strides Tensor strides.
 */
function locToIndex(locs, rank, strides) {
    if (rank === 0) {
        return 0;
    }
    else if (rank === 1) {
        return locs[0];
    }
    var index = locs[locs.length - 1];
    for (var i = 0; i < locs.length - 1; ++i) {
        index += strides[i] * locs[i];
    }
    return index;
}
/**
 * Computes the location (multidimensional index) in a tensor/multidimentional
 * array for a given flat index.
 *
 * @param index Index in flat array.
 * @param rank Rank of tensor.
 * @param strides Strides of tensor.
 */
function indexToLoc(index, rank, strides) {
    if (rank === 0) {
        return [];
    }
    else if (rank === 1) {
        return [index];
    }
    var locs = new Array(rank);
    for (var i = 0; i < locs.length - 1; ++i) {
        locs[i] = Math.floor(index / strides[i]);
        index -= locs[i] * strides[i];
    }
    locs[locs.length - 1] = index;
    return locs;
}
/**
 * This method asserts whether an object is a Promise instance.
 * @param object
 */
// tslint:disable-next-line: no-any
function isPromise(object) {
    //  We chose to not use 'obj instanceOf Promise' for two reasons:
    //  1. It only reliably works for es6 Promise, not other Promise
    //  implementations.
    //  2. It doesn't work with framework that uses zone.js. zone.js monkey patch
    //  the async calls, so it is possible the obj (patched) is comparing to a
    //  pre-patched Promise.
    return object && object.then && typeof object.then === 'function';
}

/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// Expects flags from URL in the format ?tfjsflags=FLAG1:1,FLAG2:true.
var TENSORFLOWJS_FLAGS_PREFIX = 'tfjsflags';
/**
 * The environment contains evaluated flags as well as the registered platform.
 * This is always used as a global singleton and can be retrieved with
 * `tf.env()`.
 *
 * @doc {heading: 'Environment'}
 */
var Environment = /** @class */ (function () {
    // tslint:disable-next-line: no-any
    function Environment(global) {
        this.global = global;
        this.flags = {};
        this.flagRegistry = {};
        this.urlFlags = {};
        // Jasmine spies on this in 'environment_test.ts'
        this.getQueryParams = getQueryParams;
        this.populateURLFlags();
    }
    Environment.prototype.setPlatform = function (platformName, platform) {
        if (this.platform != null) {
            console.warn("Platform " + this.platformName + " has already been set. " +
                ("Overwriting the platform with " + platform + "."));
        }
        this.platformName = platformName;
        this.platform = platform;
    };
    Environment.prototype.registerFlag = function (flagName, evaluationFn, setHook) {
        this.flagRegistry[flagName] = { evaluationFn: evaluationFn, setHook: setHook };
        // Override the flag value from the URL. This has to happen here because the
        // environment is initialized before flags get registered.
        if (this.urlFlags[flagName] != null) {
            var flagValue = this.urlFlags[flagName];
            console.warn("Setting feature override from URL " + flagName + ": " + flagValue + ".");
            this.set(flagName, flagValue);
        }
    };
    Environment.prototype.getAsync = function (flagName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (flagName in this.flags) {
                            return [2 /*return*/, this.flags[flagName]];
                        }
                        _a = this.flags;
                        _b = flagName;
                        return [4 /*yield*/, this.evaluateFlag(flagName)];
                    case 1:
                        _a[_b] = _c.sent();
                        return [2 /*return*/, this.flags[flagName]];
                }
            });
        });
    };
    Environment.prototype.get = function (flagName) {
        if (flagName in this.flags) {
            return this.flags[flagName];
        }
        var flagValue = this.evaluateFlag(flagName);
        if (isPromise(flagValue)) {
            throw new Error("Flag " + flagName + " cannot be synchronously evaluated. " +
                "Please use getAsync() instead.");
        }
        this.flags[flagName] = flagValue;
        return this.flags[flagName];
    };
    Environment.prototype.getNumber = function (flagName) {
        return this.get(flagName);
    };
    Environment.prototype.getBool = function (flagName) {
        return this.get(flagName);
    };
    Environment.prototype.getFlags = function () {
        return this.flags;
    };
    Object.defineProperty(Environment.prototype, "features", {
        // For backwards compatibility.
        get: function () {
            return this.flags;
        },
        enumerable: true,
        configurable: true
    });
    Environment.prototype.set = function (flagName, value) {
        if (this.flagRegistry[flagName] == null) {
            throw new Error("Cannot set flag " + flagName + " as it has not been registered.");
        }
        this.flags[flagName] = value;
        if (this.flagRegistry[flagName].setHook != null) {
            this.flagRegistry[flagName].setHook(value);
        }
    };
    Environment.prototype.evaluateFlag = function (flagName) {
        if (this.flagRegistry[flagName] == null) {
            throw new Error("Cannot evaluate flag '" + flagName + "': no evaluation function found.");
        }
        return this.flagRegistry[flagName].evaluationFn();
    };
    Environment.prototype.setFlags = function (flags) {
        this.flags = Object.assign({}, flags);
    };
    Environment.prototype.reset = function () {
        this.flags = {};
        this.urlFlags = {};
        this.populateURLFlags();
    };
    Environment.prototype.populateURLFlags = function () {
        var _this = this;
        if (typeof this.global === 'undefined' ||
            typeof this.global.location === 'undefined' ||
            typeof this.global.location.search === 'undefined') {
            return;
        }
        var urlParams = this.getQueryParams(this.global.location.search);
        if (TENSORFLOWJS_FLAGS_PREFIX in urlParams) {
            var keyValues = urlParams[TENSORFLOWJS_FLAGS_PREFIX].split(',');
            keyValues.forEach(function (keyValue) {
                var _a = keyValue.split(':'), key = _a[0], value = _a[1];
                _this.urlFlags[key] = parseValue(key, value);
            });
        }
    };
    return Environment;
}());
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
function decodeParam(params, name, value) {
    params[decodeURIComponent(name)] = decodeURIComponent(value || '');
}
function parseValue(flagName, value) {
    value = value.toLowerCase();
    if (value === 'true' || value === 'false') {
        return value === 'true';
    }
    else if ("" + +value === value) {
        return +value;
    }
    throw new Error("Could not parse value flag value " + value + " for flag " + flagName + ".");
}
/**
 * Returns the current environment (a global singleton).
 *
 * The environment object contains the evaluated feature values as well as the
 * active platform.
 *
 * @doc {heading: 'Environment'}
 */
function env() {
    return exports.ENV;
}
exports.ENV = null;
function setEnvironmentGlobal(environment) {
    exports.ENV = environment;
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// Note that the identifier globalNameSpace is scoped to this module, but will
// always resolve to the same global object regardless of how the module is
// resolved.
// tslint:disable-next-line:no-any
var globalNameSpace;
// tslint:disable-next-line:no-any
function getGlobalNamespace() {
    if (globalNameSpace == null) {
        // tslint:disable-next-line:no-any
        var ns = void 0;
        if (typeof (window) !== 'undefined') {
            ns = window;
        }
        else if (typeof (global) !== 'undefined') {
            ns = global;
        }
        else if (typeof (process) !== 'undefined') {
            ns = process;
        }
        else if (typeof (self) !== 'undefined') {
            ns = self;
        }
        else {
            throw new Error('Could not find a global object');
        }
        globalNameSpace = ns;
    }
    return globalNameSpace;
}
// tslint:disable-next-line:no-any
function getGlobalMap() {
    var ns = getGlobalNamespace();
    if (ns._tfGlobals == null) {
        ns._tfGlobals = new Map();
    }
    return ns._tfGlobals;
}
/**
 * Returns a globally accessible 'singleton' object.
 *
 * @param key the name of the object
 * @param init a function to initialize to initialize this object
 *             the first time it is fetched.
 */
function getGlobal(key, init) {
    var globalMap = getGlobalMap();
    if (globalMap.has(key)) {
        return globalMap.get(key);
    }
    else {
        var singleton = init();
        globalMap.set(key, singleton);
        return globalMap.get(key);
    }
}

var Abs = 'Abs';
var Acos = 'Acos';
var Acosh = 'Acosh';
var Add = 'Add';
var AddN = 'AddN';
var All = 'All';
var Any = 'Any';
var ArgMax = 'ArgMax';
var ArgMin = 'ArgMin';
var Asin = 'Asin';
var Asinh = 'Asinh';
var Atan = 'Atan';
var Atanh = 'Atanh';
var Atan2 = 'Atan2';
var AvgPool = 'AvgPool';
var AvgPoolGrad = 'AvgPoolGrad';
var AvgPool3D = 'AvgPool3D';
var AvgPool3DGrad = 'AvgPool3DGrad';
var BatchMatMul = 'BatchMatMul';
var BatchToSpaceND = 'BatchToSpaceND';
var Bincount = 'Bincount';
var BroadcastTo = 'BroadcastTo';
var Cast = 'Cast';
var Ceil = 'Ceil';
var ClipByValue = 'ClipByValue';
var Complex = 'Complex';
var ComplexAbs = 'ComplexAbs';
var Concat = 'Concat';
var Conv2D = 'Conv2D';
var Conv2DBackpropFilter = 'Conv2DBackpropFilter';
var Conv2DBackpropInput = 'Conv2DBackpropInput';
var Conv3D = 'Conv3D';
var Conv3DBackpropFilterV2 = 'Conv3DBackpropFilterV2';
var Conv3DBackpropInputV2 = 'Conv3DBackpropInputV2';
var Cos = 'Cos';
var Cosh = 'Cosh';
var Cumsum = 'Cumsum';
var CropAndResize = 'CropAndResize';
var DenseBincount = 'DenseBincount';
var DepthToSpace = 'DepthToSpace';
var DepthwiseConv2dNative = 'DepthwiseConv2dNative';
var DepthwiseConv2dNativeBackpropFilter = 'DepthwiseConv2dNativeBackpropFilter';
var DepthwiseConv2dNativeBackpropInput = 'DepthwiseConv2dNativeBackpropInput';
var Diag = 'Diag';
var Dilation2D = 'Dilation2D';
var Dilation2DBackpropInput = 'Dilation2DBackpropInput';
var Dilation2DBackpropFilter = 'Dilation2DBackpropFilter';
var RealDiv = 'RealDiv';
var Einsum = 'Einsum';
var Elu = 'Elu';
var EluGrad = 'EluGrad';
var Erf = 'Erf';
var Equal = 'Equal';
var Exp = 'Exp';
var ExpandDims = 'ExpandDims';
var Expm1 = 'Expm1';
var FFT = 'FFT';
var Fill = 'Fill';
var FlipLeftRight = 'FlipLeftRight';
var Floor = 'Floor';
var FloorDiv = 'FloorDiv';
var FusedBatchNorm = 'FusedBatchNorm';
var GatherV2 = 'GatherV2';
var GatherNd = 'GatherNd';
var Greater = 'Greater';
var GreaterEqual = 'GreaterEqual';
var Identity = 'Identity';
var IFFT = 'IFFT';
var Imag = 'Imag';
var IsFinite = 'IsFinite';
var IsInf = 'IsInf';
var IsNan = 'IsNan';
var LeakyRelu = 'LeakyRelu';
var Less = 'Less';
var LessEqual = 'LessEqual';
var LinSpace = 'LinSpace';
var Log = 'Log';
var Log1p = 'Log1p';
var LogicalAnd = 'LogicalAnd';
var LogicalNot = 'LogicalNot';
var LogicalOr = 'LogicalOr';
var LogSoftmax = 'LogSoftmax';
var LRN = 'LRN';
var LRNGrad = 'LRNGrad';
var Max = 'Max';
var Maximum = 'Maximum';
var MaxPool = 'MaxPool';
var MaxPoolGrad = 'MaxPoolGrad';
var MaxPool3D = 'MaxPool3D';
var MaxPool3DGrad = 'MaxPool3DGrad';
var MaxPoolWithArgmax = 'MaxPoolWithArgmax';
var Mean = 'Mean';
var Min = 'Min';
var Minimum = 'Minimum';
var MirrorPad = 'MirrorPad';
var Mod = 'Mod';
var Multinomial = 'Multinomial';
var Multiply = 'Multiply';
var Neg = 'Neg';
var NotEqual = 'NotEqual';
var NonMaxSuppressionV3 = 'NonMaxSuppressionV3';
var NonMaxSuppressionV4 = 'NonMaxSuppressionV4';
var NonMaxSuppressionV5 = 'NonMaxSuppressionV5';
var OnesLike = 'OnesLike';
var OneHot = 'OneHot';
var Pack = 'Pack';
var PadV2 = 'PadV2';
var Pool = 'Pool';
var Pow = 'Pow';
var Prelu = 'Prelu';
var Prod = 'Prod';
var Range = 'Range';
var Real = 'Real';
var Reciprocal = 'Reciprocal';
var Relu = 'Relu';
var Reshape = 'Reshape';
var ResizeNearestNeighbor = 'ResizeNearestNeighbor';
var ResizeNearestNeighborGrad = 'ResizeNearestNeighborGrad';
var ResizeBilinear = 'ResizeBilinear';
var ResizeBilinearGrad = 'ResizeBilinearGrad';
var Relu6 = 'Relu6';
var Reverse = 'Reverse';
var Round = 'Round';
var Rsqrt = 'Rsqrt';
var ScatterNd = 'ScatterNd';
var Select = 'Select';
var Selu = 'Selu';
var Slice = 'Slice';
var Sin = 'Sin';
var Sinh = 'Sinh';
var Sign = 'Sign';
var Sigmoid = 'Sigmoid';
var Softplus = 'Softplus';
var Sqrt = 'Sqrt';
var Sum = 'Sum';
var SpaceToBatchND = 'SpaceToBatchND';
var SplitV = 'SplitV';
var Softmax = 'Softmax';
var SparseFillEmptyRows = 'SparseFillEmptyRows';
var SparseReshape = 'SparseReshape';
var SparseSegmentMean = 'SparseSegmentMean';
var SparseSegmentSum = 'SparseSegmentSum';
var SparseToDense = 'SparseToDense';
var SquaredDifference = 'SquaredDifference';
var Square = 'Square';
var StridedSlice = 'StridedSlice';
var StringNGrams = 'StringNGrams';
var StringSplit = 'StringSplit';
var StringToHashBucketFast = 'StringToHashBucketFast';
var Sub = 'Sub';
var Tan = 'Tan';
var Tanh = 'Tanh';
var Tile = 'Tile';
var TopK = 'TopK';
var Transform = 'Transform';
var Transpose = 'Transpose';
var Unique = 'Unique';
var Unpack = 'Unpack';
var UnsortedSegmentSum = 'UnsortedSegmentSum';
var ZerosLike = 'ZerosLike';
/**
 * TensorFlow.js-only kernels
 */
var Step = 'Step';
var FromPixels = 'FromPixels';
var RotateWithOffset = 'RotateWithOffset';
var _FusedMatMul = '_FusedMatMul';
var FusedConv2D = 'FusedConv2D';
var FusedDepthwiseConv2D = 'FusedDepthwiseConv2D';

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var kernelRegistry = getGlobal('kernelRegistry', function () { return new Map(); });
var gradRegistry = getGlobal('gradRegistry', function () { return new Map(); });
/**
 * Returns the kernel function (code) associated with the provided names.
 *
 * @param kernelName The official name of the kernel.
 * @param backendName The official name of the backend.
 */
function getKernel(kernelName, backendName) {
    var key = makeKey(kernelName, backendName);
    return kernelRegistry.get(key);
}
/**
 * Returns the registered gradient info associated with the provided kernel.
 * @param kernelName The official TF kernel name.
 */
function getGradient(kernelName) {
    return gradRegistry.get(kernelName);
}
function getKernelsForBackend(backendName) {
    var it = kernelRegistry.entries();
    var result = [];
    while (true) {
        var _a = it.next(), done = _a.done, value = _a.value;
        if (done) {
            break;
        }
        var key = value[0], config = value[1];
        var backend = key.split('_')[0];
        if (backend === backendName) {
            result.push(config);
        }
    }
    return result;
}
/**
 * Registers the function (forward pass) for the kernel in a global registry.
 *
 * @param config A config object with the following properties:
 * - `kernelName` The official name of the kernel.
 * - `backendName` The official name of the backend.
 * - `kernelFunc` The function to run during the forward pass of the kernel.
 * - `setupFunc` Optional. Gets called once, after the backend initializes.
 * - `disposeFunc` Optional. Gets called once, right before the backend is
 * disposed.
 */
function registerKernel(config) {
    var kernelName = config.kernelName, backendName = config.backendName;
    var key = makeKey(kernelName, backendName);
    if (kernelRegistry.has(key)) {
        console.warn("The kernel '" + kernelName + "' for backend " +
            ("'" + backendName + "' is already registered"));
    }
    kernelRegistry.set(key, config);
}
/**
 * Registers a gradient function for a given kernel in the global registry,
 * to be used during the back-propagation of that kernel.
 *
 * @param config An object with the following properties:
 * - `kernelName` The name of the kernel that the gradient function is for.
 * - `gradFunc` The function to run during back-propagation.
 */
function registerGradient(config) {
    var kernelName = config.kernelName;
    if (gradRegistry.has(kernelName)) {
        // TODO (yassogba) after 3.0 assess whether we need to keep this gated
        // to debug mode.
        if (env().getBool('DEBUG')) {
            console.warn("Overriding the gradient for '" + kernelName + "'");
        }
    }
    gradRegistry.set(kernelName, config);
}
/**
 * Removes the kernel function from the registry.
 *
 * @param kernelName The official name of the kernel.
 * @param backendName The official name of the backend.
 *
 */
function unregisterKernel(kernelName, backendName) {
    var key = makeKey(kernelName, backendName);
    if (!kernelRegistry.has(key)) {
        throw new Error("The kernel '" + kernelName + "' for backend " +
            ("'" + backendName + "' is not registered"));
    }
    kernelRegistry.delete(key);
}
/** Removes the registered gradient from the global registry. */
function unregisterGradient(kernelName) {
    if (!gradRegistry.has(kernelName)) {
        throw new Error("The gradient '" + kernelName + "' for backend is not registered");
    }
    gradRegistry.delete(kernelName);
}
/**
 * Finds kernels that have already been registered to a backend and re-registers
 * them for a new backend. Useful for registering custom backends.
 * @param registeredBackendName Already registered backend.
 * @param newBackendName New backend.
 */
function copyRegisteredKernels(registeredBackendName, newBackendName) {
    var kernels = getKernelsForBackend(registeredBackendName);
    kernels.forEach(function (kernelConfig) {
        var newKernelConfig = Object.assign({}, kernelConfig, { backendName: newBackendName });
        registerKernel(newKernelConfig);
    });
}
function makeKey(kernelName, backendName) {
    return backendName + "_" + kernelName;
}

var long_1 = Long;

/**
 * wasm optimizations, to do native i64 multiplication and divide
 */
var wasm = null;

try {
  wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
    0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11
  ])), {}).exports;
} catch (e) {
  // no wasm support :(
}

/**
 * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
 *  See the from* functions below for more convenient ways of constructing Longs.
 * @exports Long
 * @class A Long class for representing a 64 bit two's-complement integer value.
 * @param {number} low The low (signed) 32 bits of the long
 * @param {number} high The high (signed) 32 bits of the long
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @constructor
 */
function Long(low, high, unsigned) {

    /**
     * The low 32 bits as a signed value.
     * @type {number}
     */
    this.low = low | 0;

    /**
     * The high 32 bits as a signed value.
     * @type {number}
     */
    this.high = high | 0;

    /**
     * Whether unsigned or not.
     * @type {boolean}
     */
    this.unsigned = !!unsigned;
}

// The internal representation of a long is the two given signed, 32-bit values.
// We use 32-bit pieces because these are the size of integers on which
// Javascript performs bit-operations.  For operations like addition and
// multiplication, we split each number into 16 bit pieces, which can easily be
// multiplied within Javascript's floating-point representation without overflow
// or change in sign.
//
// In the algorithms below, we frequently reduce the negative case to the
// positive case by negating the input(s) and then post-processing the result.
// Note that we must ALWAYS check specially whether those values are MIN_VALUE
// (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
// a positive number, it overflows back into a negative).  Not handling this
// case would often result in infinite recursion.
//
// Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
// methods on which they depend.

/**
 * An indicator used to reliably determine if an object is a Long or not.
 * @type {boolean}
 * @const
 * @private
 */
Long.prototype.__isLong__;

Object.defineProperty(Long.prototype, "__isLong__", { value: true });

/**
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 * @inner
 */
function isLong(obj) {
    return (obj && obj["__isLong__"]) === true;
}

/**
 * Tests if the specified object is a Long.
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 */
Long.isLong = isLong;

/**
 * A cache of the Long representations of small integer values.
 * @type {!Object}
 * @inner
 */
var INT_CACHE = {};

/**
 * A cache of the Long representations of small unsigned integer values.
 * @type {!Object}
 * @inner
 */
var UINT_CACHE = {};

/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromInt(value, unsigned) {
    var obj, cachedObj, cache;
    if (unsigned) {
        value >>>= 0;
        if (cache = (0 <= value && value < 256)) {
            cachedObj = UINT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
        if (cache)
            UINT_CACHE[value] = obj;
        return obj;
    } else {
        value |= 0;
        if (cache = (-128 <= value && value < 128)) {
            cachedObj = INT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, value < 0 ? -1 : 0, false);
        if (cache)
            INT_CACHE[value] = obj;
        return obj;
    }
}

/**
 * Returns a Long representing the given 32 bit integer value.
 * @function
 * @param {number} value The 32 bit integer in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromInt = fromInt;

/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromNumber(value, unsigned) {
    if (isNaN(value))
        return unsigned ? UZERO : ZERO;
    if (unsigned) {
        if (value < 0)
            return UZERO;
        if (value >= TWO_PWR_64_DBL)
            return MAX_UNSIGNED_VALUE;
    } else {
        if (value <= -TWO_PWR_63_DBL)
            return MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL)
            return MAX_VALUE;
    }
    if (value < 0)
        return fromNumber(-value, unsigned).neg();
    return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
}

/**
 * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
 * @function
 * @param {number} value The number in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromNumber = fromNumber;

/**
 * @param {number} lowBits
 * @param {number} highBits
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromBits(lowBits, highBits, unsigned) {
    return new Long(lowBits, highBits, unsigned);
}

/**
 * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
 *  assumed to use 32 bits.
 * @function
 * @param {number} lowBits The low 32 bits
 * @param {number} highBits The high 32 bits
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromBits = fromBits;

/**
 * @function
 * @param {number} base
 * @param {number} exponent
 * @returns {number}
 * @inner
 */
var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

/**
 * @param {string} str
 * @param {(boolean|number)=} unsigned
 * @param {number=} radix
 * @returns {!Long}
 * @inner
 */
function fromString(str, unsigned, radix) {
    if (str.length === 0)
        throw Error('empty string');
    if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
        return ZERO;
    if (typeof unsigned === 'number') {
        // For goog.math.long compatibility
        radix = unsigned,
        unsigned = false;
    } else {
        unsigned = !! unsigned;
    }
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');

    var p;
    if ((p = str.indexOf('-')) > 0)
        throw Error('interior hyphen');
    else if (p === 0) {
        return fromString(str.substring(1), unsigned, radix).neg();
    }

    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 8));

    var result = ZERO;
    for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i),
            value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
            var power = fromNumber(pow_dbl(radix, size));
            result = result.mul(power).add(fromNumber(value));
        } else {
            result = result.mul(radixToPower);
            result = result.add(fromNumber(value));
        }
    }
    result.unsigned = unsigned;
    return result;
}

/**
 * Returns a Long representation of the given string, written using the specified radix.
 * @function
 * @param {string} str The textual representation of the Long
 * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to signed
 * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
 * @returns {!Long} The corresponding Long value
 */
Long.fromString = fromString;

/**
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromValue(val, unsigned) {
    if (typeof val === 'number')
        return fromNumber(val, unsigned);
    if (typeof val === 'string')
        return fromString(val, unsigned);
    // Throws for non-objects, converts non-instanceof Long:
    return fromBits(val.low, val.high, typeof unsigned === 'boolean' ? unsigned : val.unsigned);
}

/**
 * Converts the specified value to a Long using the appropriate from* function for its type.
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long}
 */
Long.fromValue = fromValue;

// NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
// no runtime penalty for these.

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_16_DBL = 1 << 16;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_24_DBL = 1 << 24;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

/**
 * @type {!Long}
 * @const
 * @inner
 */
var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

/**
 * @type {!Long}
 * @inner
 */
var ZERO = fromInt(0);

/**
 * Signed zero.
 * @type {!Long}
 */
Long.ZERO = ZERO;

/**
 * @type {!Long}
 * @inner
 */
var UZERO = fromInt(0, true);

/**
 * Unsigned zero.
 * @type {!Long}
 */
Long.UZERO = UZERO;

/**
 * @type {!Long}
 * @inner
 */
var ONE = fromInt(1);

/**
 * Signed one.
 * @type {!Long}
 */
Long.ONE = ONE;

/**
 * @type {!Long}
 * @inner
 */
var UONE = fromInt(1, true);

/**
 * Unsigned one.
 * @type {!Long}
 */
Long.UONE = UONE;

/**
 * @type {!Long}
 * @inner
 */
var NEG_ONE = fromInt(-1);

/**
 * Signed negative one.
 * @type {!Long}
 */
Long.NEG_ONE = NEG_ONE;

/**
 * @type {!Long}
 * @inner
 */
var MAX_VALUE = fromBits(0xFFFFFFFF|0, 0x7FFFFFFF|0, false);

/**
 * Maximum signed value.
 * @type {!Long}
 */
Long.MAX_VALUE = MAX_VALUE;

/**
 * @type {!Long}
 * @inner
 */
var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF|0, 0xFFFFFFFF|0, true);

/**
 * Maximum unsigned value.
 * @type {!Long}
 */
Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

/**
 * @type {!Long}
 * @inner
 */
var MIN_VALUE = fromBits(0, 0x80000000|0, false);

/**
 * Minimum signed value.
 * @type {!Long}
 */
Long.MIN_VALUE = MIN_VALUE;

/**
 * @alias Long.prototype
 * @inner
 */
var LongPrototype = Long.prototype;

/**
 * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
 * @returns {number}
 */
LongPrototype.toInt = function toInt() {
    return this.unsigned ? this.low >>> 0 : this.low;
};

/**
 * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
 * @returns {number}
 */
LongPrototype.toNumber = function toNumber() {
    if (this.unsigned)
        return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
    return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
};

/**
 * Converts the Long to a string written in the specified radix.
 * @param {number=} radix Radix (2-36), defaults to 10
 * @returns {string}
 * @override
 * @throws {RangeError} If `radix` is out of range
 */
LongPrototype.toString = function toString(radix) {
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');
    if (this.isZero())
        return '0';
    if (this.isNegative()) { // Unsigned Longs are never negative
        if (this.eq(MIN_VALUE)) {
            // We need to change the Long value before it can be negated, so we remove
            // the bottom-most digit in this base and then recurse to do the rest.
            var radixLong = fromNumber(radix),
                div = this.div(radixLong),
                rem1 = div.mul(radixLong).sub(this);
            return div.toString(radix) + rem1.toInt().toString(radix);
        } else
            return '-' + this.neg().toString(radix);
    }

    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
        rem = this;
    var result = '';
    while (true) {
        var remDiv = rem.div(radixToPower),
            intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
            digits = intval.toString(radix);
        rem = remDiv;
        if (rem.isZero())
            return digits + result;
        else {
            while (digits.length < 6)
                digits = '0' + digits;
            result = '' + digits + result;
        }
    }
};

/**
 * Gets the high 32 bits as a signed integer.
 * @returns {number} Signed high bits
 */
LongPrototype.getHighBits = function getHighBits() {
    return this.high;
};

/**
 * Gets the high 32 bits as an unsigned integer.
 * @returns {number} Unsigned high bits
 */
LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
    return this.high >>> 0;
};

/**
 * Gets the low 32 bits as a signed integer.
 * @returns {number} Signed low bits
 */
LongPrototype.getLowBits = function getLowBits() {
    return this.low;
};

/**
 * Gets the low 32 bits as an unsigned integer.
 * @returns {number} Unsigned low bits
 */
LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
    return this.low >>> 0;
};

/**
 * Gets the number of bits needed to represent the absolute value of this Long.
 * @returns {number}
 */
LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
    if (this.isNegative()) // Unsigned Longs are never negative
        return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
    var val = this.high != 0 ? this.high : this.low;
    for (var bit = 31; bit > 0; bit--)
        if ((val & (1 << bit)) != 0)
            break;
    return this.high != 0 ? bit + 33 : bit + 1;
};

/**
 * Tests if this Long's value equals zero.
 * @returns {boolean}
 */
LongPrototype.isZero = function isZero() {
    return this.high === 0 && this.low === 0;
};

/**
 * Tests if this Long's value equals zero. This is an alias of {@link Long#isZero}.
 * @returns {boolean}
 */
LongPrototype.eqz = LongPrototype.isZero;

/**
 * Tests if this Long's value is negative.
 * @returns {boolean}
 */
LongPrototype.isNegative = function isNegative() {
    return !this.unsigned && this.high < 0;
};

/**
 * Tests if this Long's value is positive.
 * @returns {boolean}
 */
LongPrototype.isPositive = function isPositive() {
    return this.unsigned || this.high >= 0;
};

/**
 * Tests if this Long's value is odd.
 * @returns {boolean}
 */
LongPrototype.isOdd = function isOdd() {
    return (this.low & 1) === 1;
};

/**
 * Tests if this Long's value is even.
 * @returns {boolean}
 */
LongPrototype.isEven = function isEven() {
    return (this.low & 1) === 0;
};

/**
 * Tests if this Long's value equals the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.equals = function equals(other) {
    if (!isLong(other))
        other = fromValue(other);
    if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
        return false;
    return this.high === other.high && this.low === other.low;
};

/**
 * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.eq = LongPrototype.equals;

/**
 * Tests if this Long's value differs from the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.notEquals = function notEquals(other) {
    return !this.eq(/* validates */ other);
};

/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.neq = LongPrototype.notEquals;

/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.ne = LongPrototype.notEquals;

/**
 * Tests if this Long's value is less than the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lessThan = function lessThan(other) {
    return this.comp(/* validates */ other) < 0;
};

/**
 * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lt = LongPrototype.lessThan;

/**
 * Tests if this Long's value is less than or equal the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
    return this.comp(/* validates */ other) <= 0;
};

/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lte = LongPrototype.lessThanOrEqual;

/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.le = LongPrototype.lessThanOrEqual;

/**
 * Tests if this Long's value is greater than the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.greaterThan = function greaterThan(other) {
    return this.comp(/* validates */ other) > 0;
};

/**
 * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.gt = LongPrototype.greaterThan;

/**
 * Tests if this Long's value is greater than or equal the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
    return this.comp(/* validates */ other) >= 0;
};

/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.gte = LongPrototype.greaterThanOrEqual;

/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.ge = LongPrototype.greaterThanOrEqual;

/**
 * Compares this Long's value with the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
LongPrototype.compare = function compare(other) {
    if (!isLong(other))
        other = fromValue(other);
    if (this.eq(other))
        return 0;
    var thisNeg = this.isNegative(),
        otherNeg = other.isNegative();
    if (thisNeg && !otherNeg)
        return -1;
    if (!thisNeg && otherNeg)
        return 1;
    // At this point the sign bits are the same
    if (!this.unsigned)
        return this.sub(other).isNegative() ? -1 : 1;
    // Both are positive if at least one is unsigned
    return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
};

/**
 * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
LongPrototype.comp = LongPrototype.compare;

/**
 * Negates this Long's value.
 * @returns {!Long} Negated Long
 */
LongPrototype.negate = function negate() {
    if (!this.unsigned && this.eq(MIN_VALUE))
        return MIN_VALUE;
    return this.not().add(ONE);
};

/**
 * Negates this Long's value. This is an alias of {@link Long#negate}.
 * @function
 * @returns {!Long} Negated Long
 */
LongPrototype.neg = LongPrototype.negate;

/**
 * Returns the sum of this and the specified Long.
 * @param {!Long|number|string} addend Addend
 * @returns {!Long} Sum
 */
LongPrototype.add = function add(addend) {
    if (!isLong(addend))
        addend = fromValue(addend);

    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;

    var b48 = addend.high >>> 16;
    var b32 = addend.high & 0xFFFF;
    var b16 = addend.low >>> 16;
    var b00 = addend.low & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

/**
 * Returns the difference of this and the specified Long.
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
LongPrototype.subtract = function subtract(subtrahend) {
    if (!isLong(subtrahend))
        subtrahend = fromValue(subtrahend);
    return this.add(subtrahend.neg());
};

/**
 * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
 * @function
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
LongPrototype.sub = LongPrototype.subtract;

/**
 * Returns the product of this and the specified Long.
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
LongPrototype.multiply = function multiply(multiplier) {
    if (this.isZero())
        return ZERO;
    if (!isLong(multiplier))
        multiplier = fromValue(multiplier);

    // use wasm support if present
    if (wasm) {
        var low = wasm.mul(this.low,
                           this.high,
                           multiplier.low,
                           multiplier.high);
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    if (multiplier.isZero())
        return ZERO;
    if (this.eq(MIN_VALUE))
        return multiplier.isOdd() ? MIN_VALUE : ZERO;
    if (multiplier.eq(MIN_VALUE))
        return this.isOdd() ? MIN_VALUE : ZERO;

    if (this.isNegative()) {
        if (multiplier.isNegative())
            return this.neg().mul(multiplier.neg());
        else
            return this.neg().mul(multiplier).neg();
    } else if (multiplier.isNegative())
        return this.mul(multiplier.neg()).neg();

    // If both longs are small, use float multiplication
    if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
        return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.

    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;

    var b48 = multiplier.high >>> 16;
    var b32 = multiplier.high & 0xFFFF;
    var b16 = multiplier.low >>> 16;
    var b00 = multiplier.low & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

/**
 * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
 * @function
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
LongPrototype.mul = LongPrototype.multiply;

/**
 * Returns this Long divided by the specified. The result is signed if this Long is signed or
 *  unsigned if this Long is unsigned.
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
LongPrototype.divide = function divide(divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);
    if (divisor.isZero())
        throw Error('division by zero');

    // use wasm support if present
    if (wasm) {
        // guard against signed division overflow: the largest
        // negative number / -1 would be 1 larger than the largest
        // positive number, due to two's complement.
        if (!this.unsigned &&
            this.high === -0x80000000 &&
            divisor.low === -1 && divisor.high === -1) {
            // be consistent with non-wasm code path
            return this;
        }
        var low = (this.unsigned ? wasm.div_u : wasm.div_s)(
            this.low,
            this.high,
            divisor.low,
            divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    if (this.isZero())
        return this.unsigned ? UZERO : ZERO;
    var approx, rem, res;
    if (!this.unsigned) {
        // This section is only relevant for signed longs and is derived from the
        // closure library as a whole.
        if (this.eq(MIN_VALUE)) {
            if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                return MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
            else if (divisor.eq(MIN_VALUE))
                return ONE;
            else {
                // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                var halfThis = this.shr(1);
                approx = halfThis.div(divisor).shl(1);
                if (approx.eq(ZERO)) {
                    return divisor.isNegative() ? ONE : NEG_ONE;
                } else {
                    rem = this.sub(divisor.mul(approx));
                    res = approx.add(rem.div(divisor));
                    return res;
                }
            }
        } else if (divisor.eq(MIN_VALUE))
            return this.unsigned ? UZERO : ZERO;
        if (this.isNegative()) {
            if (divisor.isNegative())
                return this.neg().div(divisor.neg());
            return this.neg().div(divisor).neg();
        } else if (divisor.isNegative())
            return this.div(divisor.neg()).neg();
        res = ZERO;
    } else {
        // The algorithm below has not been made for unsigned longs. It's therefore
        // required to take special care of the MSB prior to running it.
        if (!divisor.unsigned)
            divisor = divisor.toUnsigned();
        if (divisor.gt(this))
            return UZERO;
        if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
            return UONE;
        res = UZERO;
    }

    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    rem = this;
    while (rem.gte(divisor)) {
        // Approximate the result of division. This may be a little greater or
        // smaller than the actual value.
        approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

        // We will tweak the approximate result by changing it in the 48-th digit or
        // the smallest non-fractional digit, whichever is larger.
        var log2 = Math.ceil(Math.log(approx) / Math.LN2),
            delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48),

        // Decrease the approximation until it is smaller than the remainder.  Note
        // that if it is too large, the product overflows and is negative.
            approxRes = fromNumber(approx),
            approxRem = approxRes.mul(divisor);
        while (approxRem.isNegative() || approxRem.gt(rem)) {
            approx -= delta;
            approxRes = fromNumber(approx, this.unsigned);
            approxRem = approxRes.mul(divisor);
        }

        // We know the answer can't be zero... and actually, zero would cause
        // infinite recursion since we would make no progress.
        if (approxRes.isZero())
            approxRes = ONE;

        res = res.add(approxRes);
        rem = rem.sub(approxRem);
    }
    return res;
};

/**
 * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
LongPrototype.div = LongPrototype.divide;

/**
 * Returns this Long modulo the specified.
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.modulo = function modulo(divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);

    // use wasm support if present
    if (wasm) {
        var low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(
            this.low,
            this.high,
            divisor.low,
            divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    return this.sub(this.div(divisor).mul(divisor));
};

/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.mod = LongPrototype.modulo;

/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.rem = LongPrototype.modulo;

/**
 * Returns the bitwise NOT of this Long.
 * @returns {!Long}
 */
LongPrototype.not = function not() {
    return fromBits(~this.low, ~this.high, this.unsigned);
};

/**
 * Returns the bitwise AND of this Long and the specified.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.and = function and(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
};

/**
 * Returns the bitwise OR of this Long and the specified.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.or = function or(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
};

/**
 * Returns the bitwise XOR of this Long and the given one.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.xor = function xor(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
};

/**
 * Returns this Long with bits shifted to the left by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftLeft = function shiftLeft(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    else if (numBits < 32)
        return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
    else
        return fromBits(0, this.low << (numBits - 32), this.unsigned);
};

/**
 * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shl = LongPrototype.shiftLeft;

/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftRight = function shiftRight(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    else if (numBits < 32)
        return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
    else
        return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
};

/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shr = LongPrototype.shiftRight;

/**
 * Returns this Long with bits logically shifted to the right by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    numBits &= 63;
    if (numBits === 0)
        return this;
    else {
        var high = this.high;
        if (numBits < 32) {
            var low = this.low;
            return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
        } else if (numBits === 32)
            return fromBits(high, 0, this.unsigned);
        else
            return fromBits(high >>> (numBits - 32), 0, this.unsigned);
    }
};

/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shru = LongPrototype.shiftRightUnsigned;

/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;

/**
 * Converts this Long to signed.
 * @returns {!Long} Signed long
 */
LongPrototype.toSigned = function toSigned() {
    if (!this.unsigned)
        return this;
    return fromBits(this.low, this.high, false);
};

/**
 * Converts this Long to unsigned.
 * @returns {!Long} Unsigned long
 */
LongPrototype.toUnsigned = function toUnsigned() {
    if (this.unsigned)
        return this;
    return fromBits(this.low, this.high, true);
};

/**
 * Converts this Long to its byte representation.
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {!Array.<number>} Byte representation
 */
LongPrototype.toBytes = function toBytes(le) {
    return le ? this.toBytesLE() : this.toBytesBE();
};

/**
 * Converts this Long to its little endian byte representation.
 * @returns {!Array.<number>} Little endian byte representation
 */
LongPrototype.toBytesLE = function toBytesLE() {
    var hi = this.high,
        lo = this.low;
    return [
        lo        & 0xff,
        lo >>>  8 & 0xff,
        lo >>> 16 & 0xff,
        lo >>> 24       ,
        hi        & 0xff,
        hi >>>  8 & 0xff,
        hi >>> 16 & 0xff,
        hi >>> 24
    ];
};

/**
 * Converts this Long to its big endian byte representation.
 * @returns {!Array.<number>} Big endian byte representation
 */
LongPrototype.toBytesBE = function toBytesBE() {
    var hi = this.high,
        lo = this.low;
    return [
        hi >>> 24       ,
        hi >>> 16 & 0xff,
        hi >>>  8 & 0xff,
        hi        & 0xff,
        lo >>> 24       ,
        lo >>> 16 & 0xff,
        lo >>>  8 & 0xff,
        lo        & 0xff
    ];
};

/**
 * Creates a Long from its byte representation.
 * @param {!Array.<number>} bytes Byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {Long} The corresponding Long value
 */
Long.fromBytes = function fromBytes(bytes, unsigned, le) {
    return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
};

/**
 * Creates a Long from its little endian byte representation.
 * @param {!Array.<number>} bytes Little endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
    return new Long(
        bytes[0]       |
        bytes[1] <<  8 |
        bytes[2] << 16 |
        bytes[3] << 24,
        bytes[4]       |
        bytes[5] <<  8 |
        bytes[6] << 16 |
        bytes[7] << 24,
        unsigned
    );
};

/**
 * Creates a Long from its big endian byte representation.
 * @param {!Array.<number>} bytes Big endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
    return new Long(
        bytes[4] << 24 |
        bytes[5] << 16 |
        bytes[6] <<  8 |
        bytes[7],
        bytes[0] << 24 |
        bytes[1] << 16 |
        bytes[2] <<  8 |
        bytes[3],
        unsigned
    );
};

var LongExports = {
    __proto__: null,
    'default': long_1,
    __moduleExports: long_1
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// tslint:disable-next-line
var Long$1 = 
// tslint:disable-next-line
long_1 || LongExports;
function hexToLong(hex) {
    return Long$1.fromString(hex, true, 16);
}
// Some primes between 2^63 and 2^64 for various uses.
// Hex 0xc3a5c85c97cb3127
var k0 = hexToLong('c3a5c85c97cb3127');
// Hex 0xb492b66fbe98f273
var k1 = hexToLong('b492b66fbe98f273');
// Hex 0x9ae16a3b2f90404f
var k2 = hexToLong('9ae16a3b2f90404f');
function shiftMix(val) {
    return val.xor(val.shru(47));
}
function fetch$1(s, offset, numBytes) {
    var bytes = s.slice(offset, offset + numBytes);
    return Long$1.fromBytes(Array.from(bytes), true, true);
}
function fetch64(s, offset) {
    return fetch$1(s, offset, 8);
}
function fetch32(s, offset) {
    return fetch$1(s, offset, 4);
}
function rotate64(val, shift) {
    // Avoid shifting by 64: doing so yields an undefined result.
    return shift === 0 ? val : val.shru(shift).or(val.shl(64 - shift));
}
function hashLen16(u, v, mul) {
    if (mul === void 0) { mul = hexToLong('9ddfea08eb382d69'); }
    // Murmur-inspired hashing.
    var a = u.xor(v).mul(mul);
    a = a.xor(a.shru(47));
    var b = v.xor(a).mul(mul);
    b = b.xor(b.shru(47));
    b = b.mul(mul);
    return b;
}
// Return a 16-byte hash for 48 bytes.  Quick and dirty.
// Callers do best to use "random-looking" values for a and b.
function weakHashLen32WithSeeds(w, x, y, z, a, b) {
    a = a.add(w);
    b = rotate64(b.add(a).add(z), 21);
    var c = a;
    a = a.add(x);
    a = a.add(y);
    b = b.add(rotate64(a, 44));
    return [a.add(z), b.add(c)];
}
function weakHashLen32WithSeedsStr(s, offset, a, b) {
    return weakHashLen32WithSeeds(fetch64(s, offset), fetch64(s, offset + 8), fetch64(s, offset + 16), fetch64(s, offset + 24), a, b);
}
function hashLen0to16(s, len) {
    if (len === void 0) { len = s.length; }
    if (len >= 8) {
        var mul = k2.add(len * 2);
        var a = fetch64(s, 0).add(k2);
        var b = fetch64(s, len - 8);
        var c = rotate64(b, 37).mul(mul).add(a);
        var d = rotate64(a, 25).add(b).mul(mul);
        return hashLen16(c, d, mul);
    }
    if (len >= 4) {
        var mul = k2.add(len * 2);
        var a = fetch32(s, 0);
        return hashLen16(a.shl(3).add(len), fetch32(s, len - 4), mul);
    }
    if (len > 0) {
        var a = s[0];
        var b = s[len >> 1];
        var c = s[len - 1];
        var y = a + (b << 8);
        var z = len + (c << 2);
        return shiftMix(k2.mul(y).xor(k0.mul(z))).mul(k2);
    }
    return k2;
}
function hashLen17to32(s, len) {
    if (len === void 0) { len = s.length; }
    var mul = k2.add(len * 2);
    var a = fetch64(s, 0).mul(k1);
    var b = fetch64(s, 8);
    var c = fetch64(s, len - 8).mul(mul);
    var d = fetch64(s, len - 16).mul(k2);
    return hashLen16(rotate64(a.add(b), 43).add(rotate64(c, 30)).add(d), a.add(rotate64(b.add(k2), 18)).add(c), mul);
}
function hashLen33to64(s, len) {
    if (len === void 0) { len = s.length; }
    var mul = k2.add(len * 2);
    var a = fetch64(s, 0).mul(k2);
    var b = fetch64(s, 8);
    var c = fetch64(s, len - 8).mul(mul);
    var d = fetch64(s, len - 16).mul(k2);
    var y = rotate64(a.add(b), 43).add(rotate64(c, 30)).add(d);
    var z = hashLen16(y, a.add(rotate64(b.add(k2), 18)).add(c), mul);
    var e = fetch64(s, 16).mul(mul);
    var f = fetch64(s, 24);
    var g = y.add(fetch64(s, len - 32)).mul(mul);
    var h = z.add(fetch64(s, len - 24)).mul(mul);
    return hashLen16(rotate64(e.add(f), 43).add(rotate64(g, 30)).add(h), e.add(rotate64(f.add(a), 18)).add(g), mul);
}
function fingerPrint64(s, len) {
    var _a, _b;
    if (len === void 0) { len = s.length; }
    var seed = Long$1.fromNumber(81, true);
    if (len <= 32) {
        if (len <= 16) {
            return hashLen0to16(s, len);
        }
        else {
            return hashLen17to32(s, len);
        }
    }
    else if (len <= 64) {
        return hashLen33to64(s, len);
    }
    // For strings over 64 bytes we loop.  Internal state consists of
    // 56 bytes: v, w, x, y, and z.
    var x = seed;
    var y = seed.mul(k1).add(113);
    var z = shiftMix(y.mul(k2).add(113)).mul(k2);
    var v = [Long$1.UZERO, Long$1.UZERO];
    var w = [Long$1.UZERO, Long$1.UZERO];
    x = x.mul(k2).add(fetch64(s, 0));
    var offset = 0;
    // Set end so that after the loop we have 1 to 64 bytes left to process.
    var end = ((len - 1) >> 6) * 64;
    var last64 = end + ((len - 1) & 63) - 63;
    do {
        x = rotate64(x.add(y).add(v[0]).add(fetch64(s, offset + 8)), 37).mul(k1);
        y = rotate64(y.add(v[1]).add(fetch64(s, offset + 48)), 42).mul(k1);
        x = x.xor(w[1]);
        y = y.add(v[0]).add(fetch64(s, offset + 40));
        z = rotate64(z.add(w[0]), 33).mul(k1);
        v = weakHashLen32WithSeedsStr(s, offset, v[1].mul(k1), x.add(w[0]));
        w = weakHashLen32WithSeedsStr(s, offset + 32, z.add(w[1]), y.add(fetch64(s, offset + 16)));
        _a = [x, z], z = _a[0], x = _a[1];
        offset += 64;
    } while (offset !== end);
    var mul = k1.add(z.and(0xff).shl(1));
    // Point to the last 64 bytes of input.
    offset = last64;
    w[0] = w[0].add((len - 1) & 63);
    v[0] = v[0].add(w[0]);
    w[0] = w[0].add(v[0]);
    x = rotate64(x.add(y).add(v[0]).add(fetch64(s, offset + 8)), 37).mul(mul);
    y = rotate64(y.add(v[1]).add(fetch64(s, offset + 48)), 42).mul(mul);
    x = x.xor(w[1].mul(9));
    y = y.add(v[0].mul(9).add(fetch64(s, offset + 40)));
    z = rotate64(z.add(w[0]), 33).mul(mul);
    v = weakHashLen32WithSeedsStr(s, offset, v[1].mul(mul), x.add(w[0]));
    w = weakHashLen32WithSeedsStr(s, offset + 32, z.add(w[1]), y.add(fetch64(s, offset + 16)));
    _b = [x, z], z = _b[0], x = _b[1];
    return hashLen16(hashLen16(v[0], w[0], mul).add(shiftMix(y).mul(k0)).add(z), hashLen16(v[1], w[1], mul).add(x), mul);
}

/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Create typed array for scalar value. Used for storing in `DataStorage`.
 */
function createScalarValue(value, dtype) {
    if (dtype === 'string') {
        return encodeString(value);
    }
    return toTypedArray([value], dtype);
}
function noConversionNeeded(a, dtype) {
    return (a instanceof Float32Array && dtype === 'float32') ||
        (a instanceof Int32Array && dtype === 'int32') ||
        (a instanceof Uint8Array && dtype === 'bool');
}
function toTypedArray(a, dtype) {
    if (dtype === 'string') {
        throw new Error('Cannot convert a string[] to a TypedArray');
    }
    if (Array.isArray(a)) {
        a = flatten(a);
    }
    if (env().getBool('DEBUG')) {
        checkConversionForErrors(a, dtype);
    }
    if (noConversionNeeded(a, dtype)) {
        return a;
    }
    if (dtype == null || dtype === 'float32' || dtype === 'complex64') {
        return new Float32Array(a);
    }
    else if (dtype === 'int32') {
        return new Int32Array(a);
    }
    else if (dtype === 'bool') {
        var bool = new Uint8Array(a.length);
        for (var i = 0; i < bool.length; ++i) {
            if (Math.round(a[i]) !== 0) {
                bool[i] = 1;
            }
        }
        return bool;
    }
    else {
        throw new Error("Unknown data type " + dtype);
    }
}
/**
 * Returns the current high-resolution time in milliseconds relative to an
 * arbitrary time in the past. It works across different platforms (node.js,
 * browsers).
 *
 * ```js
 * console.log(tf.util.now());
 * ```
 *
 * @doc {heading: 'Util', namespace: 'util'}
 */
function now() {
    return env().platform.now();
}
/**
 * Returns a platform-specific implementation of
 * [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
 *
 * If `fetch` is defined on the global object (`window`, `process`, etc.),
 * `tf.util.fetch` returns that function.
 *
 * If not, `tf.util.fetch` returns a platform-specific solution.
 *
 * ```js
 * const resource = await tf.util.fetch('https://unpkg.com/@tensorflow/tfjs');
 * // handle response
 * ```
 *
 * @doc {heading: 'Util'}
 */
function fetch$2(path, requestInits) {
    return env().platform.fetch(path, requestInits);
}
/**
 * Encodes the provided string into bytes using the provided encoding scheme.
 *
 * @param s The string to encode.
 * @param encoding The encoding scheme. Defaults to utf-8.
 *
 * @doc {heading: 'Util'}
 */
function encodeString(s, encoding) {
    if (encoding === void 0) { encoding = 'utf-8'; }
    encoding = encoding || 'utf-8';
    return env().platform.encode(s, encoding);
}
/**
 * Decodes the provided bytes into a string using the provided encoding scheme.
 * @param bytes The bytes to decode.
 *
 * @param encoding The encoding scheme. Defaults to utf-8.
 *
 * @doc {heading: 'Util'}
 */
function decodeString(bytes, encoding) {
    if (encoding === void 0) { encoding = 'utf-8'; }
    encoding = encoding || 'utf-8';
    return env().platform.decode(bytes, encoding);
}

var util = {
    __proto__: null,
    createScalarValue: createScalarValue,
    toTypedArray: toTypedArray,
    now: now,
    fetch: fetch$2,
    encodeString: encodeString,
    decodeString: decodeString,
    shuffle: shuffle,
    shuffleCombo: shuffleCombo,
    clamp: clamp,
    nearestLargerEven: nearestLargerEven,
    sum: sum,
    randUniform: randUniform,
    distSquared: distSquared,
    assert: assert,
    assertShapesMatch: assertShapesMatch,
    assertNonNull: assertNonNull,
    flatten: flatten,
    sizeFromShape: sizeFromShape,
    isScalarShape: isScalarShape,
    arraysEqual: arraysEqual,
    isInt: isInt,
    tanh: tanh,
    sizeToSquarishShape: sizeToSquarishShape,
    createShuffledIndices: createShuffledIndices,
    rightPad: rightPad,
    repeatedTry: repeatedTry,
    inferFromImplicitShape: inferFromImplicitShape,
    parseAxisParam: parseAxisParam,
    squeezeShape: squeezeShape,
    getTypedArrayFromDType: getTypedArrayFromDType,
    getArrayFromDType: getArrayFromDType,
    checkConversionForErrors: checkConversionForErrors,
    isValidDtype: isValidDtype,
    hasEncodingLoss: hasEncodingLoss,
    isTypedArray: isTypedArray,
    bytesPerElement: bytesPerElement,
    bytesFromStringArray: bytesFromStringArray,
    isString: isString,
    isBoolean: isBoolean,
    isNumber: isNumber,
    inferDtype: inferDtype,
    isFunction: isFunction,
    nearestDivisor: nearestDivisor,
    computeStrides: computeStrides,
    toNestedArray: toNestedArray,
    makeOnesTypedArray: makeOnesTypedArray,
    makeZerosTypedArray: makeZerosTypedArray,
    makeZerosNestedTypedArray: makeZerosNestedTypedArray,
    assertNonNegativeIntegerDimensions: assertNonNegativeIntegerDimensions,
    locToIndex: locToIndex,
    indexToLoc: indexToLoc,
    isPromise: isPromise,
    hexToLong: hexToLong,
    fingerPrint64: fingerPrint64
};

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var Profiler = /** @class */ (function () {
    function Profiler(backendTimer, logger) {
        this.backendTimer = backendTimer;
        this.logger = logger;
        if (logger == null) {
            this.logger = new Logger();
        }
    }
    Profiler.prototype.profileKernel = function (kernelName, inputs, f) {
        var outputs;
        var holdResultWrapperFn = function () {
            outputs = f();
        };
        var timer;
        var start = now();
        if (this.backendTimer.timerAvailable()) {
            timer = this.backendTimer.time(holdResultWrapperFn);
        }
        else {
            holdResultWrapperFn();
            for (var _i = 0, outputs_1 = outputs; _i < outputs_1.length; _i++) {
                var output = outputs_1[_i];
                output.dataSync();
            }
            timer = Promise.resolve({ kernelMs: now() - start });
        }
        if (env().getBool('CHECK_COMPUTATION_FOR_ERRORS')) {
            var _loop_1 = function (i) {
                var output = outputs[i];
                // Dangling promise here because we don't want to propagate up
                // asynchronicity.
                output.data().then(function (tensorVals) {
                    checkComputationForErrors(tensorVals, output.dtype, kernelName);
                });
            };
            for (var i = 0; i < outputs.length; i++) {
                _loop_1(i);
            }
        }
        var kernelProfile = {
            kernelName: kernelName,
            outputs: outputs,
            inputs: inputs,
            timeMs: timer.then(function (timing) { return timing.kernelMs; }),
            extraInfo: timer.then(function (timing) { return timing.getExtraProfileInfo != null ?
                timing.getExtraProfileInfo() :
                ''; })
        };
        return kernelProfile;
    };
    Profiler.prototype.logKernelProfile = function (kernelProfile) {
        var _this = this;
        var kernelName = kernelProfile.kernelName, outputs = kernelProfile.outputs, timeMs = kernelProfile.timeMs, inputs = kernelProfile.inputs, extraInfo = kernelProfile.extraInfo;
        outputs.forEach(function (result) {
            Promise.all([result.data(), timeMs, extraInfo]).then(function (valueContainer) {
                _this.logger.logKernelProfile(kernelName, result, valueContainer[0], valueContainer[1], inputs, valueContainer[2]);
            });
        });
    };
    return Profiler;
}());
function checkComputationForErrors(vals, dtype, kernelName) {
    if (dtype !== 'float32') {
        // Only floating point computations will generate NaN values
        return false;
    }
    for (var i = 0; i < vals.length; i++) {
        var num = vals[i];
        if (isNaN(num) || !isFinite(num)) {
            // Throwing custom exception so behavior is testable.
            console.warn("Found " + num + " in the result of '" + kernelName + "'");
            return true;
        }
    }
    return false;
}
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.logKernelProfile = function (name, result, vals, timeMs, inputs, extraInfo) {
        var time = typeof timeMs === 'number' ? rightPad(timeMs + "ms", 9) :
            timeMs['error'];
        var paddedName = rightPad(name, 25);
        var rank = result.rank;
        var size = result.size;
        var shape = rightPad(result.shape.toString(), 14);
        var inputShapesDescription = '';
        for (var name_1 in inputs) {
            var input = inputs[name_1];
            if (input != null) {
                // The input might be a non-tensor (e.g HTMLImageElement), in which case
                // we claim the output shape as input shape.
                var inputShape = input.shape || result.shape;
                var inputRank = inputShape.length;
                inputShapesDescription +=
                    name_1 + ": " + inputRank + "D " + (inputRank > 0 ? inputShape : '') + " ";
            }
        }
        console.log("%c" + paddedName + "\t%c" + time + "\t%c" + rank + "D " + shape + "\t%c" + size + "\t%c" + inputShapesDescription + "\t%c" + extraInfo, 'font-weight:bold', 'color:red', 'color:blue', 'color: orange', 'color: green', 'color: steelblue');
    };
    return Logger;
}());

/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Computes a list of TapeNodes that connect x to y, filtering everything else
 * out and preserving the order of the original tape elements.
 *
 * @param tape The tape elements to filter.
 * @param xs The input Tensors.
 * @param y The output Tensor.
 */
function getFilteredNodesXToY(tape, xs, y) {
    // Forward pass to compute all the nodes and Tensors that are transitively a
    // function of x.
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
                    node.outputs.forEach(function (output) { return tensorsFromX[output.id] = true; });
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
    // Backward pass to find all of the nodes and Tensors that lead to y.
    var tensorsLeadToY = {};
    tensorsLeadToY[y.id] = true;
    var nodesToY = {};
    for (var i = tape.length - 1; i >= 0; i--) {
        var node = tape[i];
        var nodeInputs = node.inputs;
        // If any of the outputs lead to y, mark all of the inputs as leading to y.
        for (var j = 0; j < node.outputs.length; j++) {
            if (tensorsLeadToY[node.outputs[j].id]) {
                for (var inputName in nodeInputs) {
                    tensorsLeadToY[nodeInputs[inputName].id] = true;
                    nodesToY[node.id] = true;
                }
                break;
            }
        }
    }
    // Return the paths that come from x and lead to y.
    var filteredTape = [];
    for (var i = 0; i < tape.length; i++) {
        var node = tape[i];
        if (nodesFromX[node.id] && nodesToY[node.id]) {
            // Prune the inputs from the node that aren't a function of x.
            var prunedInputs = {};
            for (var inputName in node.inputs) {
                var nodeInput = node.inputs[inputName];
                if (tensorsFromX[nodeInput.id]) {
                    prunedInputs[inputName] = nodeInput;
                }
            }
            // Copy the node and overwrite inputsAndArgs to the pruned version.
            var prunedNode = Object.assign({}, node);
            prunedNode.inputs = prunedInputs;
            prunedNode.outputs = node.outputs;
            filteredTape.push(prunedNode);
        }
    }
    return filteredTape;
}
/**
 * Backpropagate gradients through the filtered TapeNodes.
 *
 * @param tensorAccumulatedGradientMap A map of Tensor to its gradient. This map
 * is mutated by this method.
 * @param filteredTape The filtered TapeNodes to backprop through.
 */
function backpropagateGradients(tensorAccumulatedGradientMap, filteredTape, tidy, add) {
    var _loop_1 = function (i) {
        var node = filteredTape[i];
        var dys = [];
        node.outputs.forEach(function (o) {
            var gradTensor = tensorAccumulatedGradientMap[o.id];
            if (gradTensor != null) {
                dys.push(gradTensor);
            }
            else {
                // This particular output is not in the back-propagation subgraph, so it
                // does not affect the final output, thus we put null for its dy.
                dys.push(null);
            }
        });
        if (node.gradient == null) {
            throw new Error("Cannot compute gradient: gradient function not found " +
                ("for " + node.kernelName + "."));
        }
        // Backprop dy through this node and accumulate gradients over the inputs.
        var inputGradients = node.gradient(dys);
        var _loop_2 = function (inputName) {
            if (!(inputName in inputGradients)) {
                throw new Error("Cannot backprop through input " + inputName + ". " +
                    ("Available gradients found: " + Object.keys(inputGradients) + "."));
            }
            // Call the gradient function.
            var dx = tidy(function () { return inputGradients[inputName](); });
            if (dx.dtype !== 'float32') {
                throw new Error("Error in gradient for op " + node.kernelName + ". The gradient of input " +
                    (inputName + " must have 'float32' dtype, but has '" + dx.dtype + "'"));
            }
            var x = node.inputs[inputName];
            if (!arraysEqual(dx.shape, x.shape)) {
                throw new Error("Error in gradient for op " + node.kernelName + ". The gradient of input " +
                    ("'" + inputName + "' has shape '" + dx.shape + "', which does not match ") +
                    ("the shape of the input '" + x.shape + "'"));
            }
            if (tensorAccumulatedGradientMap[x.id] == null) {
                tensorAccumulatedGradientMap[x.id] = dx;
            }
            else {
                var curGradient = tensorAccumulatedGradientMap[x.id];
                tensorAccumulatedGradientMap[x.id] = add(curGradient, dx);
                curGradient.dispose();
            }
        };
        for (var inputName in node.inputs) {
            _loop_2(inputName);
        }
    };
    // Walk the tape backward and keep a map of Tensor to its gradient.
    for (var i = filteredTape.length - 1; i >= 0; i--) {
        _loop_1(i);
    }
}

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// Maximum number of values before we decide to show ellipsis.
var FORMAT_LIMIT_NUM_VALS = 20;
// Number of first and last values to show when displaying a, b,...,y, z.
var FORMAT_NUM_FIRST_LAST_VALS = 3;
// Number of significant digits to show.
var FORMAT_NUM_SIG_DIGITS = 7;
function tensorToString(vals, shape, dtype, verbose) {
    var strides = computeStrides(shape);
    var padPerCol = computeMaxSizePerColumn(vals, shape, dtype, strides);
    var rank = shape.length;
    var valsLines = subTensorToString(vals, shape, dtype, strides, padPerCol);
    var lines = ['Tensor'];
    if (verbose) {
        lines.push("  dtype: " + dtype);
        lines.push("  rank: " + rank);
        lines.push("  shape: [" + shape + "]");
        lines.push("  values:");
    }
    lines.push(valsLines.map(function (l) { return '    ' + l; }).join('\n'));
    return lines.join('\n');
}
function computeMaxSizePerColumn(vals, shape, dtype, strides) {
    var n = sizeFromShape(shape);
    var numCols = strides[strides.length - 1];
    var padPerCol = new Array(numCols).fill(0);
    var rank = shape.length;
    var valuesOrTuples = dtype === 'complex64' ? createComplexTuples(vals) : vals;
    if (rank > 1) {
        for (var row = 0; row < n / numCols; row++) {
            var offset = row * numCols;
            for (var j = 0; j < numCols; j++) {
                padPerCol[j] = Math.max(padPerCol[j], valToString(valuesOrTuples[offset + j], 0, dtype).length);
            }
        }
    }
    return padPerCol;
}
function valToString(val, pad, dtype) {
    var valStr;
    if (Array.isArray(val)) {
        valStr = parseFloat(val[0].toFixed(FORMAT_NUM_SIG_DIGITS)) + " + " +
            (parseFloat(val[1].toFixed(FORMAT_NUM_SIG_DIGITS)) + "j");
    }
    else if (isString(val)) {
        valStr = "'" + val + "'";
    }
    else if (dtype === 'bool') {
        valStr = boolNumToString(val);
    }
    else {
        valStr = parseFloat(val.toFixed(FORMAT_NUM_SIG_DIGITS)).toString();
    }
    return rightPad(valStr, pad);
}
function boolNumToString(v) {
    return v === 0 ? 'false' : 'true';
}
function subTensorToString(vals, shape, dtype, strides, padPerCol, isLast) {
    if (isLast === void 0) { isLast = true; }
    var storagePerElement = dtype === 'complex64' ? 2 : 1;
    var size = shape[0];
    var rank = shape.length;
    if (rank === 0) {
        if (dtype === 'complex64') {
            var complexTuple = createComplexTuples(vals);
            return [valToString(complexTuple[0], 0, dtype)];
        }
        if (dtype === 'bool') {
            return [boolNumToString(vals[0])];
        }
        return [vals[0].toString()];
    }
    if (rank === 1) {
        if (size > FORMAT_LIMIT_NUM_VALS) {
            var firstValsSize = FORMAT_NUM_FIRST_LAST_VALS * storagePerElement;
            var firstVals = Array.from(vals.slice(0, firstValsSize));
            var lastVals = Array.from(vals.slice((size - FORMAT_NUM_FIRST_LAST_VALS) * storagePerElement, size * storagePerElement));
            if (dtype === 'complex64') {
                firstVals = createComplexTuples(firstVals);
                lastVals = createComplexTuples(lastVals);
            }
            return [
                '[' +
                    firstVals.map(function (x, i) { return valToString(x, padPerCol[i], dtype); })
                        .join(', ') +
                    ', ..., ' +
                    lastVals
                        .map(function (x, i) { return valToString(x, padPerCol[size - FORMAT_NUM_FIRST_LAST_VALS + i], dtype); })
                        .join(', ') +
                    ']'
            ];
        }
        var displayVals = dtype === 'complex64' ? createComplexTuples(vals) :
            Array.from(vals);
        return [
            '[' +
                displayVals.map(function (x, i) { return valToString(x, padPerCol[i], dtype); })
                    .join(', ') +
                ']'
        ];
    }
    // The array is rank 2 or more.
    var subshape = shape.slice(1);
    var substrides = strides.slice(1);
    var stride = strides[0] * storagePerElement;
    var lines = [];
    if (size > FORMAT_LIMIT_NUM_VALS) {
        for (var i = 0; i < FORMAT_NUM_FIRST_LAST_VALS; i++) {
            var start = i * stride;
            var end = start + stride;
            lines.push.apply(lines, subTensorToString(vals.slice(start, end), subshape, dtype, substrides, padPerCol, false /* isLast */));
        }
        lines.push('...');
        for (var i = size - FORMAT_NUM_FIRST_LAST_VALS; i < size; i++) {
            var start = i * stride;
            var end = start + stride;
            lines.push.apply(lines, subTensorToString(vals.slice(start, end), subshape, dtype, substrides, padPerCol, i === size - 1 /* isLast */));
        }
    }
    else {
        for (var i = 0; i < size; i++) {
            var start = i * stride;
            var end = start + stride;
            lines.push.apply(lines, subTensorToString(vals.slice(start, end), subshape, dtype, substrides, padPerCol, i === size - 1 /* isLast */));
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
function createComplexTuples(vals) {
    var complexTuples = [];
    for (var i = 0; i < vals.length; i += 2) {
        complexTuples.push([vals[i], vals[i + 1]]);
    }
    return complexTuples;
}

/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * A mutable object, similar to `tf.Tensor`, that allows users to set values
 * at locations before converting to an immutable `tf.Tensor`.
 *
 * See `tf.buffer` for creating a tensor buffer.
 *
 * @doc {heading: 'Tensors', subheading: 'Classes'}
 */
var TensorBuffer = /** @class */ (function () {
    function TensorBuffer(shape, dtype, values) {
        var _this = this;
        this.dtype = dtype;
        this.shape = shape.slice();
        this.size = sizeFromShape(shape);
        if (values != null) {
            var n_1 = values.length;
            assert(n_1 === this.size, function () { return "Length of values '" + n_1 + "' does not match the size " +
                ("inferred by the shape '" + _this.size + "'."); });
        }
        if (dtype === 'complex64') {
            throw new Error("complex64 dtype TensorBuffers are not supported. Please create " +
                "a TensorBuffer for the real and imaginary parts separately and " +
                "call tf.complex(real, imag).");
        }
        this.values = values || getArrayFromDType(dtype, this.size);
        this.strides = computeStrides(shape);
    }
    /**
     * Sets a value in the buffer at a given location.
     *
     * @param value The value to set.
     * @param locs  The location indices.
     *
     * @doc {heading: 'Tensors', subheading: 'Creation'}
     */
    TensorBuffer.prototype.set = function (value) {
        var _this = this;
        var locs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            locs[_i - 1] = arguments[_i];
        }
        if (locs.length === 0) {
            locs = [0];
        }
        assert(locs.length === this.rank, function () { return "The number of provided coordinates (" + locs.length + ") must " +
            ("match the rank (" + _this.rank + ")"); });
        var index = this.locToIndex(locs);
        this.values[index] = value;
    };
    /**
     * Returns the value in the buffer at the provided location.
     *
     * @param locs The location indices.
     *
     * @doc {heading: 'Tensors', subheading: 'Creation'}
     */
    TensorBuffer.prototype.get = function () {
        var locs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            locs[_i] = arguments[_i];
        }
        if (locs.length === 0) {
            locs = [0];
        }
        var i = 0;
        for (var _a = 0, locs_1 = locs; _a < locs_1.length; _a++) {
            var loc = locs_1[_a];
            if (loc < 0 || loc >= this.shape[i]) {
                var msg = "Requested out of range element at " + locs + ". " +
                    ("  Buffer shape=" + this.shape);
                throw new Error(msg);
            }
            i++;
        }
        var index = locs[locs.length - 1];
        for (var i_1 = 0; i_1 < locs.length - 1; ++i_1) {
            index += this.strides[i_1] * locs[i_1];
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
    /**
     * Creates an immutable `tf.Tensor` object from the buffer.
     *
     * @doc {heading: 'Tensors', subheading: 'Creation'}
     */
    TensorBuffer.prototype.toTensor = function () {
        return trackerFn().makeTensor(this.values, this.shape, this.dtype);
    };
    return TensorBuffer;
}());
// For tracking tensor creation and disposal.
var trackerFn = null;
// Used by chaining methods to call into ops.
var opHandler = null;
/**
 * An external consumer can register itself as the tensor tracker. This way
 * the Tensor class can notify the tracker for every tensor created and
 * disposed.
 */
function setTensorTracker(fn) {
    trackerFn = fn;
}
/**
 * An external consumer can register itself as the op handler. This way the
 * Tensor class can have chaining methods that call into ops via the op
 * handler.
 */
function setOpHandler(handler) {
    opHandler = handler;
}
/**
 * A `tf.Tensor` object represents an immutable, multidimensional array of
 * numbers that has a shape and a data type.
 *
 * For performance reasons, functions that create tensors do not necessarily
 * perform a copy of the data passed to them (e.g. if the data is passed as a
 * `Float32Array`), and changes to the data will change the tensor. This is not
 * a feature and is not supported. To avoid this behavior, use the tensor before
 * changing the input data or create a copy with `copy = tf.add(yourTensor, 0)`.
 *
 * See `tf.tensor` for details on how to create a `tf.Tensor`.
 *
 * @doc {heading: 'Tensors', subheading: 'Classes'}
 */
var Tensor = /** @class */ (function () {
    function Tensor(shape, dtype, dataId, id) {
        /** Whether this tensor has been globally kept. */
        this.kept = false;
        this.isDisposedInternal = false;
        this.shape = shape.slice();
        this.dtype = dtype || 'float32';
        this.size = sizeFromShape(shape);
        this.strides = computeStrides(shape);
        this.dataId = dataId;
        this.id = id;
        this.rankType = (this.rank < 5 ? this.rank.toString() : 'higher');
    }
    Object.defineProperty(Tensor.prototype, "rank", {
        get: function () {
            return this.shape.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a promise of `tf.TensorBuffer` that holds the underlying data.
     *
     * @doc {heading: 'Tensors', subheading: 'Classes'}
     */
    Tensor.prototype.buffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var vals;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.data()];
                    case 1:
                        vals = _a.sent();
                        return [2 /*return*/, opHandler.buffer(this.shape, this.dtype, vals)];
                }
            });
        });
    };
    /**
     * Returns a `tf.TensorBuffer` that holds the underlying data.
     * @doc {heading: 'Tensors', subheading: 'Classes'}
     */
    Tensor.prototype.bufferSync = function () {
        return opHandler.buffer(this.shape, this.dtype, this.dataSync());
    };
    /**
     * Returns the tensor data as a nested array. The transfer of data is done
     * asynchronously.
     *
     * @doc {heading: 'Tensors', subheading: 'Classes'}
     */
    Tensor.prototype.array = function () {
        return __awaiter(this, void 0, void 0, function () {
            var vals;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.data()];
                    case 1:
                        vals = _a.sent();
                        return [2 /*return*/, toNestedArray(this.shape, vals, this.dtype === 'complex64')];
                }
            });
        });
    };
    /**
     * Returns the tensor data as a nested array. The transfer of data is done
     * synchronously.
     *
     * @doc {heading: 'Tensors', subheading: 'Classes'}
     */
    Tensor.prototype.arraySync = function () {
        return toNestedArray(this.shape, this.dataSync(), this.dtype === 'complex64');
    };
    /**
     * Asynchronously downloads the values from the `tf.Tensor`. Returns a
     * promise of `TypedArray` that resolves when the computation has finished.
     *
     * @doc {heading: 'Tensors', subheading: 'Classes'}
     */
    Tensor.prototype.data = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, bytes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.throwIfDisposed();
                        data = trackerFn().read(this.dataId);
                        if (!(this.dtype === 'string')) return [3 /*break*/, 2];
                        return [4 /*yield*/, data];
                    case 1:
                        bytes = _a.sent();
                        try {
                            return [2 /*return*/, bytes.map(function (b) { return decodeString(b); })];
                        }
                        catch (_b) {
                            throw new Error('Failed to decode the string bytes into utf-8. ' +
                                'To get the original bytes, call tensor.bytes().');
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * Synchronously downloads the values from the `tf.Tensor`. This blocks the
     * UI thread until the values are ready, which can cause performance issues.
     *
     * @doc {heading: 'Tensors', subheading: 'Classes'}
     */
    Tensor.prototype.dataSync = function () {
        this.throwIfDisposed();
        var data = trackerFn().readSync(this.dataId);
        if (this.dtype === 'string') {
            try {
                return data.map(function (b) { return decodeString(b); });
            }
            catch (_a) {
                throw new Error('Failed to decode the string bytes into utf-8. ' +
                    'To get the original bytes, call tensor.bytes().');
            }
        }
        return data;
    };
    /** Returns the underlying bytes of the tensor's data. */
    Tensor.prototype.bytes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.throwIfDisposed();
                        return [4 /*yield*/, trackerFn().read(this.dataId)];
                    case 1:
                        data = _a.sent();
                        if (this.dtype === 'string') {
                            return [2 /*return*/, data];
                        }
                        else {
                            return [2 /*return*/, new Uint8Array(data.buffer)];
                        }
                }
            });
        });
    };
    /**
     * Disposes `tf.Tensor` from memory.
     *
     * @doc {heading: 'Tensors', subheading: 'Classes'}
     */
    Tensor.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        trackerFn().disposeTensor(this);
        this.isDisposedInternal = true;
    };
    Object.defineProperty(Tensor.prototype, "isDisposed", {
        get: function () {
            return this.isDisposedInternal;
        },
        enumerable: true,
        configurable: true
    });
    Tensor.prototype.throwIfDisposed = function () {
        if (this.isDisposed) {
            throw new Error("Tensor is disposed.");
        }
    };
    /**
     * Prints the `tf.Tensor`. See `tf.print` for details.
     *
     * @param verbose Whether to print verbose information about the tensor,
     *    including dtype and size.
     *
     * @doc {heading: 'Tensors', subheading: 'Classes'}
     */
    Tensor.prototype.print = function (verbose) {
        if (verbose === void 0) { verbose = false; }
        return opHandler.print(this, verbose);
    };
    /**
     * Returns a copy of the tensor. See `tf.clone` for details.
     * @doc {heading: 'Tensors', subheading: 'Classes'}
     */
    Tensor.prototype.clone = function () {
        this.throwIfDisposed();
        return opHandler.clone(this);
    };
    /**
     * Returns a human-readable description of the tensor. Useful for logging.
     *
     * @doc {heading: 'Tensors', subheading: 'Classes'}
     */
    Tensor.prototype.toString = function (verbose) {
        if (verbose === void 0) { verbose = false; }
        var vals = this.dataSync();
        return tensorToString(vals, this.shape, this.dtype, verbose);
    };
    Tensor.prototype.cast = function (dtype) {
        this.throwIfDisposed();
        return opHandler.cast(this, dtype);
    };
    Tensor.prototype.variable = function (trainable, name, dtype) {
        if (trainable === void 0) { trainable = true; }
        this.throwIfDisposed();
        return trackerFn().makeVariable(this, trainable, name, dtype);
    };
    return Tensor;
}());
Object.defineProperty(Tensor, Symbol.hasInstance, {
    value: function (instance) {
        // Implementation note: we should use properties of the object that will be
        // defined before the constructor body has finished executing (methods).
        // This is because when this code is transpiled by babel, babel will call
        // classCallCheck before the constructor body is run.
        // See https://github.com/tensorflow/tfjs/issues/3384 for backstory.
        return !!instance && instance.data != null && instance.dataSync != null &&
            instance.throwIfDisposed != null;
    }
});
function getGlobalTensorClass() {
    // Use getGlobal so that we can augment the Tensor class across package
    // boundaries becase the node resolution alg may result in different modules
    // being returned for this file depending on the path they are loaded from.
    return getGlobal('Tensor', function () {
        return Tensor;
    });
}
// Global side effect. Cache global reference to Tensor class
getGlobalTensorClass();
/**
 * A mutable `tf.Tensor`, useful for persisting state, e.g. for training.
 *
 * @doc {heading: 'Tensors', subheading: 'Classes'}
 */
var Variable = /** @class */ (function (_super) {
    __extends(Variable, _super);
    function Variable(initialValue, trainable, name, tensorId) {
        var _this = _super.call(this, initialValue.shape, initialValue.dtype, initialValue.dataId, tensorId) || this;
        _this.trainable = trainable;
        _this.name = name;
        return _this;
    }
    /**
     * Assign a new `tf.Tensor` to this variable. The new `tf.Tensor` must have
     * the same shape and dtype as the old `tf.Tensor`.
     *
     * @param newValue New tensor to be assigned to this variable.
     *
     * @doc {heading: 'Tensors', subheading: 'Classes'}
     */
    Variable.prototype.assign = function (newValue) {
        if (newValue.dtype !== this.dtype) {
            throw new Error("dtype of the new value (" + newValue.dtype + ") and " +
                ("previous value (" + this.dtype + ") must match"));
        }
        if (!arraysEqual(newValue.shape, this.shape)) {
            throw new Error("shape of the new value (" + newValue.shape + ") and " +
                ("previous value (" + this.shape + ") must match"));
        }
        trackerFn().disposeTensor(this);
        this.dataId = newValue.dataId;
        trackerFn().incRef(this, null /* backend */);
    };
    Variable.prototype.dispose = function () {
        trackerFn().disposeVariable(this);
        this.isDisposedInternal = true;
    };
    return Variable;
}(Tensor));
Object.defineProperty(Variable, Symbol.hasInstance, {
    value: function (instance) {
        return instance instanceof Tensor && instance.assign != null &&
            instance.assign instanceof Function;
    }
});

/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
(function (Rank) {
    Rank["R0"] = "R0";
    Rank["R1"] = "R1";
    Rank["R2"] = "R2";
    Rank["R3"] = "R3";
    Rank["R4"] = "R4";
    Rank["R5"] = "R5";
    Rank["R6"] = "R6";
})(exports.Rank || (exports.Rank = {}));
// Looks for upcasting types. Used, for example, in operations with mixed dtype
// inputs.
var UpcastInt32AndMap;
(function (UpcastInt32AndMap) {
    UpcastInt32AndMap["float32"] = "float32";
    UpcastInt32AndMap["int32"] = "int32";
    UpcastInt32AndMap["bool"] = "int32";
    UpcastInt32AndMap["complex64"] = "complex64";
})(UpcastInt32AndMap || (UpcastInt32AndMap = {}));
var UpcastBoolAndMap;
(function (UpcastBoolAndMap) {
    UpcastBoolAndMap["float32"] = "float32";
    UpcastBoolAndMap["int32"] = "int32";
    UpcastBoolAndMap["bool"] = "bool";
    UpcastBoolAndMap["complex64"] = "complex64";
})(UpcastBoolAndMap || (UpcastBoolAndMap = {}));
var UpcastFloat32AndMap;
(function (UpcastFloat32AndMap) {
    UpcastFloat32AndMap["float32"] = "float32";
    UpcastFloat32AndMap["int32"] = "float32";
    UpcastFloat32AndMap["bool"] = "float32";
    UpcastFloat32AndMap["complex64"] = "complex64";
})(UpcastFloat32AndMap || (UpcastFloat32AndMap = {}));
var UpcastComplex64AndMap;
(function (UpcastComplex64AndMap) {
    UpcastComplex64AndMap["float32"] = "complex64";
    UpcastComplex64AndMap["int32"] = "complex64";
    UpcastComplex64AndMap["bool"] = "complex64";
    UpcastComplex64AndMap["complex64"] = "complex64";
})(UpcastComplex64AndMap || (UpcastComplex64AndMap = {}));
var upcastTypeMap = {
    'float32': UpcastFloat32AndMap,
    'int32': UpcastInt32AndMap,
    'bool': UpcastBoolAndMap,
    'complex64': UpcastComplex64AndMap
};
function upcastType(typeA, typeB) {
    if (typeA === 'string' || typeB === 'string') {
        if (typeA === 'string' && typeB === 'string') {
            return 'string';
        }
        throw new Error("Can not upcast " + typeA + " with " + typeB);
    }
    return upcastTypeMap[typeA][typeB];
}
/** Returns the output type after summation. */
function sumOutType(type) {
    return upcastType(type, 'int32');
}

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function makeTypesMatch(a, b) {
    if (a.dtype === b.dtype) {
        return [a, b];
    }
    var dtype = upcastType(a.dtype, b.dtype);
    return [a.cast(dtype), b.cast(dtype)];
}
function assertTypesMatch(a, b) {
    assert(a.dtype === b.dtype, function () { return "The dtypes of the first(" + a.dtype + ") and" +
        (" second(" + b.dtype + ") input must match"); });
}
function isTensorInList(tensor, tensorList) {
    return tensorList.some(function (x) { return x.id === tensor.id; });
}
/**
 * Extracts any `Tensor`s found within the provided object.
 *
 * @param container an object that may be a `Tensor` or may directly contain
 *   `Tensor`s, such as a `Tensor[]` or `{key: Tensor, ...}`. In general it
 *   is safe to pass any object here, except that `Promise`s are not
 *   supported.
 * @returns An array of `Tensors` found within the passed object. If the
 *   argument is simply a `Tensor', a list containing that `Tensor` is
 *   returned. If the object is not a `Tensor` or does not
 *   contain `Tensors`, an empty list is returned.
 */
function getTensorsInContainer(result) {
    var list = [];
    var seen = new Set();
    walkTensorContainer(result, list, seen);
    return list;
}
function walkTensorContainer(container, list, seen) {
    if (container == null) {
        return;
    }
    if (container instanceof Tensor) {
        list.push(container);
        return;
    }
    if (!isIterable(container)) {
        return;
    }
    // Iteration over keys works also for arrays.
    var iterable = container;
    for (var k in iterable) {
        var val = iterable[k];
        if (!seen.has(val)) {
            seen.add(val);
            walkTensorContainer(val, list, seen);
        }
    }
}
// tslint:disable-next-line:no-any
function isIterable(obj) {
    return Array.isArray(obj) || typeof obj === 'object';
}

var tensor_util = {
    __proto__: null,
    makeTypesMatch: makeTypesMatch,
    assertTypesMatch: assertTypesMatch,
    isTensorInList: isTensorInList,
    getTensorsInContainer: getTensorsInContainer
};

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function isRegisteredKernelInvocation(kernelInvocation) {
    return kernelInvocation.kernelName != null;
}
var EngineState = /** @class */ (function () {
    function EngineState() {
        // Public since optimizers will use it.
        this.registeredVariables = {};
        this.nextTapeNodeId = 0;
        this.numBytes = 0;
        this.numTensors = 0;
        this.numStringTensors = 0;
        this.numDataBuffers = 0;
        // Number of nested tf.grad() statements when computing higher-order
        // gradients. E.g. `1` for first-order gradients and `2` for second-order
        // gradients. Used to track if the tape should be removed after a backprop.
        this.gradientDepth = 0;
        // Number of nested kernel calls. When kernel depth is greater than 1, we turn
        // off the tape.
        this.kernelDepth = 0;
        this.scopeStack = [];
        /**
         * Keeps track of the number of data moves during a kernel execution. We
         * maintain a stack since kernels can call other kernels, recursively.
         */
        this.numDataMovesStack = [];
        this.nextScopeId = 0;
        this.tensorInfo = new WeakMap();
        this.profiling = false;
        this.activeProfile = {
            newBytes: 0,
            newTensors: 0,
            peakBytes: 0,
            kernels: [],
            result: null,
            get kernelNames() {
                return Array.from(new Set(this.kernels.map(function (k) { return k.name; })));
            }
        };
    }
    EngineState.prototype.dispose = function () {
        for (var variableName in this.registeredVariables) {
            this.registeredVariables[variableName].dispose();
        }
    };
    return EngineState;
}());
var Engine = /** @class */ (function () {
    function Engine(ENV) {
        this.ENV = ENV;
        this.registry = {};
        this.registryFactory = {};
        this.pendingBackendInitId = 0;
        this.state = new EngineState();
    }
    Engine.prototype.ready = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sortedBackends, i, backendName, success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.pendingBackendInit != null) {
                            return [2 /*return*/, this.pendingBackendInit.then(function () { })];
                        }
                        if (this.backendInstance != null) {
                            return [2 /*return*/];
                        }
                        sortedBackends = this.getSortedBackends();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < sortedBackends.length)) return [3 /*break*/, 5];
                        backendName = sortedBackends[i];
                        return [4 /*yield*/, this.initializeBackend(backendName).success];
                    case 2:
                        success = _a.sent();
                        if (!success) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.setBackend(backendName)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: throw new Error("Could not initialize any backends, all backend initializations " +
                        "failed.");
                }
            });
        });
    };
    Object.defineProperty(Engine.prototype, "backend", {
        get: function () {
            if (this.pendingBackendInit != null) {
                throw new Error("Backend '" + this.backendName + "' has not yet been initialized. Make " +
                    "sure to await tf.ready() or await tf.setBackend() before calling " +
                    "other methods");
            }
            if (this.backendInstance == null) {
                var _a = this.initializeBackendsAndReturnBest(), name_1 = _a.name, asyncInit = _a.asyncInit;
                if (asyncInit) {
                    throw new Error("The highest priority backend '" + name_1 + "' has not yet been " +
                        "initialized. Make sure to await tf.ready() or " +
                        "await tf.setBackend() before calling other methods");
                }
                this.setBackend(name_1);
            }
            return this.backendInstance;
        },
        enumerable: true,
        configurable: true
    });
    Engine.prototype.backendNames = function () {
        return Object.keys(this.registryFactory);
    };
    Engine.prototype.findBackend = function (backendName) {
        if (!(backendName in this.registry)) {
            // If the backend hasn't been initialized but we have a registry entry for
            // it, initialize it and return it.
            if (backendName in this.registryFactory) {
                var asyncInit = this.initializeBackend(backendName).asyncInit;
                if (asyncInit) {
                    // Backend is not ready yet.
                    return null;
                }
            }
            else {
                return null;
            }
        }
        return this.registry[backendName];
    };
    Engine.prototype.findBackendFactory = function (backendName) {
        if (!(backendName in this.registryFactory)) {
            return null;
        }
        return this.registryFactory[backendName].factory;
    };
    Engine.prototype.registerBackend = function (backendName, factory, priority) {
        if (priority === void 0) { priority = 1; }
        if (backendName in this.registryFactory) {
            console.warn(backendName + " backend was already registered. " +
                "Reusing existing backend factory.");
            return false;
        }
        this.registryFactory[backendName] = { factory: factory, priority: priority };
        return true;
    };
    Engine.prototype.setBackend = function (backendName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, success, asyncInit, result, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.registryFactory[backendName] == null) {
                            throw new Error("Backend name '" + backendName + "' not found in registry");
                        }
                        this.backendName = backendName;
                        if (!(this.registry[backendName] == null)) return [3 /*break*/, 4];
                        this.backendInstance = null;
                        _a = this.initializeBackend(backendName), success = _a.success, asyncInit = _a.asyncInit;
                        if (!asyncInit) return [3 /*break*/, 2];
                        return [4 /*yield*/, success];
                    case 1:
                        _b = _c.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _b = success;
                        _c.label = 3;
                    case 3:
                        result = _b;
                        if (!result) {
                            return [2 /*return*/, false];
                        }
                        _c.label = 4;
                    case 4:
                        this.backendInstance = this.registry[backendName];
                        this.setupRegisteredKernels();
                        // Reset the profiler.
                        this.profiler = new Profiler(this.backendInstance);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    Engine.prototype.setupRegisteredKernels = function () {
        var _this = this;
        var kernels = getKernelsForBackend(this.backendName);
        kernels.forEach(function (kernel) {
            if (kernel.setupFunc != null) {
                kernel.setupFunc(_this.backendInstance);
            }
        });
    };
    Engine.prototype.disposeRegisteredKernels = function (backendName) {
        var _this = this;
        var kernels = getKernelsForBackend(backendName);
        kernels.forEach(function (kernel) {
            if (kernel.disposeFunc != null) {
                kernel.disposeFunc(_this.registry[backendName]);
            }
        });
    };
    /**
     * Initializes a backend by looking up the backend name in the factory
     * registry and calling the factory method. Returns a boolean representing
     * whether the initialization of the backend suceeded. Throws an error if
     * there is no backend in the factory registry.
     */
    Engine.prototype.initializeBackend = function (backendName) {
        var _this = this;
        var registryFactoryEntry = this.registryFactory[backendName];
        if (registryFactoryEntry == null) {
            throw new Error("Cannot initialize backend " + backendName + ", no registration found.");
        }
        try {
            var backend = registryFactoryEntry.factory();
            /* Test if the factory returns a promise.
            Done in a more liberal way than
            previous 'Promise.resolve(backend)===backend'
            as we needed to account for custom Promise
            implementations (e.g. Angular) */
            if (backend && !(backend instanceof KernelBackend) &&
                typeof backend.then === 'function') {
                var promiseId_1 = ++this.pendingBackendInitId;
                var success = backend
                    .then(function (backendInstance) {
                    // Outdated promise. Another backend was set in the meantime.
                    if (promiseId_1 < _this.pendingBackendInitId) {
                        return false;
                    }
                    _this.registry[backendName] = backendInstance;
                    _this.pendingBackendInit = null;
                    return true;
                })
                    .catch(function (err) {
                    // Outdated promise. Another backend was set in the meantime.
                    if (promiseId_1 < _this.pendingBackendInitId) {
                        return false;
                    }
                    _this.pendingBackendInit = null;
                    console.warn("Initialization of backend " + backendName + " failed");
                    console.warn(err.stack || err.message);
                    return false;
                });
                this.pendingBackendInit = success;
                return { success: success, asyncInit: true };
            }
            else {
                this.registry[backendName] = backend;
                return { success: true, asyncInit: false };
            }
        }
        catch (err) {
            console.warn("Initialization of backend " + backendName + " failed");
            console.warn(err.stack || err.message);
            return { success: false, asyncInit: false };
        }
    };
    Engine.prototype.removeBackend = function (backendName) {
        if (!(backendName in this.registryFactory)) {
            throw new Error(backendName + " backend not found in registry");
        }
        if (this.backendName === backendName && this.pendingBackendInit != null) {
            // There is a pending promise of the backend we want to remove. Make it
            // obsolete.
            this.pendingBackendInitId++;
        }
        if (backendName in this.registry) {
            this.disposeRegisteredKernels(backendName);
            this.registry[backendName].dispose();
            delete this.registry[backendName];
        }
        delete this.registryFactory[backendName];
        // Unset the backend if it is active.
        if (this.backendName === backendName) {
            this.pendingBackendInit = null;
            this.backendName = null;
            this.backendInstance = null;
        }
    };
    Engine.prototype.getSortedBackends = function () {
        var _this = this;
        if (Object.keys(this.registryFactory).length === 0) {
            throw new Error('No backend found in registry.');
        }
        return Object.keys(this.registryFactory).sort(function (a, b) {
            // Highest priority comes first.
            return _this.registryFactory[b].priority -
                _this.registryFactory[a].priority;
        });
    };
    Engine.prototype.initializeBackendsAndReturnBest = function () {
        var sortedBackends = this.getSortedBackends();
        for (var i = 0; i < sortedBackends.length; i++) {
            var backendName = sortedBackends[i];
            var _a = this.initializeBackend(backendName), success = _a.success, asyncInit = _a.asyncInit;
            if (asyncInit || success) {
                return { name: backendName, asyncInit: asyncInit };
            }
        }
        throw new Error("Could not initialize any backends, all backend initializations " +
            "failed.");
    };
    Engine.prototype.moveData = function (backend, dataId) {
        var info = this.state.tensorInfo.get(dataId);
        var srcBackend = info.backend;
        var values = this.readSync(dataId);
        var refCount = srcBackend.refCount(dataId);
        // Delete the tensor from the old backend and move it to the new
        // backend.
        srcBackend.disposeData(dataId, true);
        info.backend = backend;
        backend.move(dataId, values, info.shape, info.dtype, refCount);
        if (this.shouldCheckForMemLeaks()) {
            // Track the number of moves during a kernel execution to correctly
            // detect memory leaks.
            this.state.numDataMovesStack[this.state.numDataMovesStack.length - 1]++;
        }
    };
    Engine.prototype.tidy = function (nameOrFn, fn) {
        var _this = this;
        var name = null;
        if (fn == null) {
            // Called with only 1 argument.
            if (typeof nameOrFn !== 'function') {
                throw new Error('Please provide a function to tidy()');
            }
            fn = nameOrFn;
        }
        else {
            // Called with 2 arguments.
            if (typeof nameOrFn !== 'string' && !(nameOrFn instanceof String)) {
                throw new Error('When calling with two arguments, the first argument ' +
                    'to tidy() must be a string');
            }
            if (typeof fn !== 'function') {
                throw new Error('When calling with two arguments, the 2nd argument ' +
                    'to tidy() must be a function');
            }
            name = nameOrFn;
            // TODO(nsthorat,smilkov): Do operation logging and performance
            // profiling.
        }
        var result;
        return this.scopedRun(function () { return _this.startScope(name); }, function () { return _this.endScope(result); }, function () {
            result = fn();
            if (result instanceof Promise) {
                console.error('Cannot return a Promise inside of tidy.');
            }
            return result;
        });
    };
    Engine.prototype.scopedRun = function (start, end, f) {
        start();
        try {
            var res = f();
            end();
            return res;
        }
        catch (ex) {
            end();
            throw ex;
        }
    };
    Engine.prototype.nextTensorId = function () {
        return Engine.nextTensorId++;
    };
    Engine.prototype.nextVariableId = function () {
        return Engine.nextVariableId++;
    };
    /**
     * This method is called instead of the public-facing tensor.clone() when
     * saving a tensor for backwards pass. It makes sure to add the clone
     * operation to the tape regardless of being called inside a kernel
     * execution.
     */
    Engine.prototype.clone = function (x) {
        var y = ENGINE.runKernel(Identity, { x: x });
        var inputs = { x: x };
        var grad = function (dy) { return ({
            x: function () {
                var dtype = 'float32';
                var gradInputs = { x: dy };
                var attrs = { dtype: dtype };
                return ENGINE.runKernel(Cast, gradInputs, 
                // tslint:disable-next-line: no-unnecessary-type-assertion
                attrs);
            }
        }); };
        var saved = [];
        this.addTapeNode(this.state.activeScope.name, inputs, [y], grad, saved, {});
        return y;
    };
    /**
     * Execute a kernel with the given name and return the output tensor.
     *
     * @param kernelName The name of the kernel to execute.
     * @param inputs A map of input names to tensors.
     * @param attrs A map of attribute names to their values. An attribute is a
     *     primitive (non-tensor) input to the kernel.
     * @param inputsToSave A list of tensors, inputs to save for the backprop
     *     computation.
     * @param outputsToSave A list of booleans, specifying which output to save
     *     for the backprop computation. These are booleans since the output
     * tensors are not visible to the user.
     */
    Engine.prototype.runKernel = function (kernelName, inputs, attrs) {
        var hasKernel = getKernel(kernelName, this.backendName) != null;
        if (!hasKernel) {
            throw new Error("Kernel '" + kernelName + "' not registered for backend '" + this.backendName + "'");
        }
        return this.runKernelFunc({ kernelName: kernelName, inputs: inputs, attrs: attrs });
    };
    Engine.prototype.shouldCheckForMemLeaks = function () {
        return this.ENV.getBool('IS_TEST');
    };
    Engine.prototype.checkKernelForMemLeak = function (kernelName, numDataIdsBefore, outInfos) {
        var numDataIdsAfter = this.backend.numDataIds();
        // Count the number of data ids associated with the result of the kernel.
        var numOutputDataIds = 0;
        outInfos.forEach(function (info) {
            // Complex numbers allocate 3 data ids, one for 'real', one for
            // 'imaginary', and one for the container that holds the former two.
            numOutputDataIds += (info.dtype === 'complex64' ? 3 : 1);
        });
        // Account for the number of moves during kernel execution. A "data move"
        // can happen in the middle of a kernel execution, placing a new (key,value)
        // pair in the data storage. Since data moves have net zero effect (we
        // always remove the data from the old backend), we have to cancel them out
        // when detecting memory leaks.
        var numMoves = this.state.numDataMovesStack[this.state.numDataMovesStack.length - 1];
        var dataIdsLeaked = numDataIdsAfter - numDataIdsBefore - numOutputDataIds - numMoves;
        if (dataIdsLeaked > 0) {
            throw new Error("Backend '" + this.backendName + "' has an internal memory leak " +
                ("(" + dataIdsLeaked + " data ids) after running '" + kernelName + "'"));
        }
    };
    /**
     * Internal helper method to execute a kernel Func
     *
     * Use `runKernel` to execute kernels from outside of engine.
     */
    Engine.prototype.runKernelFunc = function (kernelParams) {
        var _this = this;
        var outputs;
        var saved = [];
        var isTapeOn = this.isTapeOn();
        var startingBytecount = this.state.numBytes;
        var startingNumTensors = this.state.numTensors;
        if (this.shouldCheckForMemLeaks()) {
            this.state.numDataMovesStack.push(0);
        }
        var kernelFunc;
        if (this.backendName == null) {
            // backend has not been initialized yet (backend initialization is lazy
            // can be deferred until an op/ kernel is run).
            // The below getter has side effects that will try to initialize the
            // backend and set properties like this.backendName
            // tslint:disable-next-line: no-unused-expression
            this.backend;
        }
        var out;
        var kernelOrScopeName = isRegisteredKernelInvocation(kernelParams) ?
            kernelParams.kernelName :
            this.state.activeScope != null ? this.state.activeScope.name : '';
        // Create the kernelFunc from either a registered kernel OR passed in
        // forward/backward functions (used by custom grad). In this context a
        // kernelFunc wraps a kernel implementation with some bookkeeping.
        if (isRegisteredKernelInvocation(kernelParams)) {
            var kernelName_1 = kernelParams.kernelName, inputs_1 = kernelParams.inputs, attrs_1 = kernelParams.attrs;
            if (this.backendName == null) {
                // backend has not been initialized yet (backend initialization is lazy
                // can be deferred until an op/ kernel is run).
                // The below getter has side effects that will try to initialize the
                // backend and set properties like this.backendName
                // tslint:disable-next-line: no-unused-expression
                this.backend;
            }
            var kernel_1 = getKernel(kernelName_1, this.backendName);
            assert(kernel_1 != null, function () { return "Cannot find registered kernel '" + kernelName_1 + "' for backend '" + _this.backendName + "'"; });
            kernelFunc = function () {
                var numDataIdsBefore = _this.backend.numDataIds();
                out = kernel_1.kernelFunc({ inputs: inputs_1, attrs: attrs_1, backend: _this.backend });
                var outInfos = Array.isArray(out) ? out : [out];
                if (_this.shouldCheckForMemLeaks()) {
                    _this.checkKernelForMemLeak(kernelName_1, numDataIdsBefore, outInfos);
                }
                var outTensors = outInfos.map(function (outInfo) {
                    // todo (yassogba) remove this option (Tensor) when node backend
                    // methods have been modularized and they all return tensorInfo.
                    // TensorInfos do not have a rank attribute.
                    if (outInfo.rank != null) {
                        return outInfo;
                    }
                    var _a = outInfo, dataId = _a.dataId, shape = _a.shape, dtype = _a.dtype;
                    return _this.makeTensorFromDataId(dataId, shape, dtype);
                });
                // Save any required inputs and outputs.
                // Do not save unless we are recording to the tape. Otherwise it would
                // cause a mem leak since there would be no backprop for these tensors
                // (which would otherwise dispose them).
                if (isTapeOn) {
                    var tensorsToSave = _this.getTensorsForGradient(kernelName_1, inputs_1, outTensors);
                    saved = _this.saveTensorsForBackwardMode(tensorsToSave);
                }
                return outTensors;
            };
        }
        else {
            var forwardFunc_1 = kernelParams.forwardFunc;
            // Running a customGrad op.
            var saveFunc_1 = function (tensors) {
                // Do not save unless we are recording to the tape. Otherwise it would
                // cause a mem leak since we would never run backprop, which disposes
                // the kept tensors.
                if (!isTapeOn) {
                    return;
                }
                saved = tensors.map(function (tensor) { return _this.keep(_this.clone(tensor)); });
            };
            kernelFunc = function () {
                var numDataIdsBefore = _this.backend.numDataIds();
                out = _this.tidy(function () { return forwardFunc_1(_this.backend, saveFunc_1); });
                var outs = (Array.isArray(out) ? out : [out]);
                if (_this.shouldCheckForMemLeaks()) {
                    // Scope name is used to print a more helpful error message if needed.
                    _this.checkKernelForMemLeak(kernelOrScopeName, numDataIdsBefore, outs);
                }
                return outs;
            };
        }
        //
        // Run the kernelFunc. Optionally profiling it.
        //
        var inputs = kernelParams.inputs, attrs = kernelParams.attrs;
        var backwardsFunc = isRegisteredKernelInvocation(kernelParams) ?
            null :
            kernelParams.backwardsFunc;
        var kernelProfile;
        this.scopedRun(
        // Stop recording to a tape when running a kernel.
        function () { return _this.state.kernelDepth++; }, function () { return _this.state.kernelDepth--; }, function () {
            if (!_this.ENV.getBool('DEBUG') && !_this.state.profiling) {
                outputs = kernelFunc();
            }
            else {
                kernelProfile = _this.profiler.profileKernel(kernelOrScopeName, inputs, function () { return kernelFunc(); });
                if (_this.ENV.getBool('DEBUG')) {
                    _this.profiler.logKernelProfile(kernelProfile);
                }
                outputs = kernelProfile.outputs;
            }
        });
        if (isTapeOn) {
            this.addTapeNode(kernelOrScopeName, inputs, outputs, backwardsFunc, saved, attrs);
        }
        if (this.state.profiling) {
            this.state.activeProfile.kernels.push({
                name: kernelOrScopeName,
                bytesAdded: this.state.numBytes - startingBytecount,
                totalBytesSnapshot: this.state.numBytes,
                tensorsAdded: this.state.numTensors - startingNumTensors,
                totalTensorsSnapshot: this.state.numTensors,
                inputShapes: Object.keys(inputs).map(function (key) { return inputs[key] != null ? inputs[key].shape : null; }),
                outputShapes: outputs.map(function (item) { return item.shape; }),
                kernelTimeMs: kernelProfile.timeMs,
                extraInfo: kernelProfile.extraInfo
            });
        }
        return (Array.isArray(out) ? outputs : outputs[0]);
    };
    /**
     * Saves tensors used in forward mode for use in backward mode.
     *
     * @param tensors the list of tensors to save.
     */
    Engine.prototype.saveTensorsForBackwardMode = function (tensors) {
        var _this = this;
        var saved = tensors.map(function (tensor) { return _this.keep(_this.clone(tensor)); });
        return saved;
    };
    /**
     * Returns a list of tensors to save for a given gradient calculation.
     *
     * @param kernelName name of kernel to look up gradient for.
     * @param inputs a map of input tensors.
     * @param outputs an array of output tensors from forward mode of kernel.
     */
    Engine.prototype.getTensorsForGradient = function (kernelName, inputs, outputs) {
        var gradConfig = getGradient(kernelName);
        if (gradConfig != null) {
            var inputsToSave = gradConfig.inputsToSave || [];
            var outputsToSave_1 = gradConfig.outputsToSave || [];
            // If saveAllInputs is true, all inputs will be saved. Otherwise, inputs
            // specified in inputsToSave will be saved.
            var inputTensorsToSave = void 0;
            if (gradConfig.saveAllInputs) {
                assert(Array.isArray(inputs), function () { return 'saveAllInputs is true, expected inputs to be an array.'; });
                inputTensorsToSave = Object.keys(inputs).map(function (key) { return inputs[key]; });
            }
            else {
                inputTensorsToSave = inputsToSave.map(function (inputName) { return inputs[inputName]; });
            }
            var outputTensorsToSave = outputs.filter(function (_, i) { return outputsToSave_1[i]; });
            return inputTensorsToSave.concat(outputTensorsToSave);
        }
        // We return an empty list rather than throw an error because the kernel we
        // are looking up may not actually be relevant to backproping through the
        // overall function
        //
        // See 'does not error if irrelevant (pruned) ops are missing grads' test
        // in gradients_test.ts for an example.
        return [];
    };
    /**
     * Internal method used by public APIs for tensor creation. Makes a new
     * tensor with the provided shape, dtype and values. It always
     * creates a new data id and writes the values to the underlying backend.
     */
    Engine.prototype.makeTensor = function (values, shape, dtype, backend) {
        if (values == null) {
            throw new Error('Values passed to engine.makeTensor() are null');
        }
        dtype = dtype || 'float32';
        backend = backend || this.backend;
        var backendVals = values;
        if (dtype === 'string' && isString(values[0])) {
            backendVals = values.map(function (d) { return encodeString(d); });
        }
        var dataId = backend.write(backendVals, shape, dtype);
        var t = new Tensor(shape, dtype, dataId, this.nextTensorId());
        this.trackTensor(t, backend);
        // Count bytes for string tensors.
        if (dtype === 'string') {
            var info = this.state.tensorInfo.get(dataId);
            var newBytes = bytesFromStringArray(backendVals);
            this.state.numBytes += newBytes - info.bytes;
            info.bytes = newBytes;
        }
        return t;
    };
    /**
     * Internal method used by backends. Makes a new tensor
     * that is a wrapper around an existing data id. It doesn't create
     * a new data id, only increments the ref count used in memory tracking.
     */
    Engine.prototype.makeTensorFromDataId = function (dataId, shape, dtype, backend) {
        dtype = dtype || 'float32';
        var t = new Tensor(shape, dtype, dataId, this.nextTensorId());
        this.trackTensor(t, backend);
        return t;
    };
    Engine.prototype.makeVariable = function (initialValue, trainable, name, dtype) {
        if (trainable === void 0) { trainable = true; }
        name = name || this.nextVariableId().toString();
        if (dtype != null && dtype !== initialValue.dtype) {
            initialValue = initialValue.cast(dtype);
        }
        var v = new Variable(initialValue, trainable, name, this.nextTensorId());
        if (this.state.registeredVariables[v.name] != null) {
            throw new Error("Variable with name " + v.name + " was already registered");
        }
        this.state.registeredVariables[v.name] = v;
        this.incRef(v, this.backend);
        return v;
    };
    Engine.prototype.trackTensor = function (a, backend) {
        this.state.numTensors++;
        if (a.dtype === 'string') {
            this.state.numStringTensors++;
        }
        // Bytes for complex numbers are counted by their components. Bytes for
        // string tensors are counted when writing values.
        var bytes = 0;
        if (a.dtype !== 'complex64' && a.dtype !== 'string') {
            bytes = a.size * bytesPerElement(a.dtype);
        }
        this.state.numBytes += bytes;
        if (!this.state.tensorInfo.has(a.dataId)) {
            this.state.numDataBuffers++;
            this.state.tensorInfo.set(a.dataId, {
                backend: backend || this.backend,
                dtype: a.dtype,
                shape: a.shape,
                bytes: bytes
            });
        }
        if (!(a instanceof Variable)) {
            this.track(a);
        }
    };
    // Track the tensor by dataId and increase the refCount for the dataId in the
    // backend.
    // TODO(pyu10055): This is currently used by makeVariable method, to increase
    // refCount on the backend for the dataId. It can potentially be replaced with
    // Identity op indead of calling backend directly.
    Engine.prototype.incRef = function (a, backend) {
        this.trackTensor(a, backend);
        this.backend.incRef(a.dataId);
    };
    Engine.prototype.removeDataId = function (dataId, backend) {
        if (this.state.tensorInfo.has(dataId) &&
            this.state.tensorInfo.get(dataId).backend === backend) {
            this.state.tensorInfo.delete(dataId);
            this.state.numDataBuffers--;
        }
    };
    Engine.prototype.disposeTensor = function (a) {
        if (!this.state.tensorInfo.has(a.dataId)) {
            return;
        }
        var info = this.state.tensorInfo.get(a.dataId);
        this.state.numTensors--;
        if (a.dtype === 'string') {
            this.state.numStringTensors--;
            this.state.numBytes -= info.bytes;
        }
        // Don't count bytes for complex numbers as they are counted by their
        // components.
        if (a.dtype !== 'complex64' && a.dtype !== 'string') {
            var bytes = a.size * bytesPerElement(a.dtype);
            this.state.numBytes -= bytes;
        }
        // Remove the reference to dataId if backend dispose the data successfully
        if (info.backend.disposeData(a.dataId)) {
            this.removeDataId(a.dataId, info.backend);
        }
        // TODO(nsthorat): Construct an error and save the stack trace for
        // debugging when in debug mode. Creating a stack trace is too expensive
        // to do unconditionally.
    };
    Engine.prototype.disposeVariables = function () {
        for (var varName in this.state.registeredVariables) {
            var v = this.state.registeredVariables[varName];
            this.disposeVariable(v);
        }
    };
    Engine.prototype.disposeVariable = function (v) {
        this.disposeTensor(v);
        if (this.state.registeredVariables[v.name] != null) {
            delete this.state.registeredVariables[v.name];
        }
    };
    Engine.prototype.memory = function () {
        var info = this.backend.memory();
        info.numTensors = this.state.numTensors;
        info.numDataBuffers = this.state.numDataBuffers;
        info.numBytes = this.state.numBytes;
        if (this.state.numStringTensors > 0) {
            info.unreliable = true;
            if (info.reasons == null) {
                info.reasons = [];
            }
            info.reasons.push('Memory usage by string tensors is approximate ' +
                '(2 bytes per character)');
        }
        return info;
    };
    Engine.prototype.profile = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var startBytes, startNumTensors, _a, _i, _b, kernel, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        this.state.profiling = true;
                        startBytes = this.state.numBytes;
                        startNumTensors = this.state.numTensors;
                        this.state.activeProfile.kernels = [];
                        _a = this.state.activeProfile;
                        return [4 /*yield*/, query()];
                    case 1:
                        _a.result = _e.sent();
                        this.state.profiling = false;
                        this.state.activeProfile.peakBytes = Math.max.apply(Math, this.state.activeProfile.kernels.map(function (d) { return d.totalBytesSnapshot; }));
                        this.state.activeProfile.newBytes = this.state.numBytes - startBytes;
                        this.state.activeProfile.newTensors =
                            this.state.numTensors - startNumTensors;
                        _i = 0, _b = this.state.activeProfile.kernels;
                        _e.label = 2;
                    case 2:
                        if (!(_i < _b.length)) return [3 /*break*/, 6];
                        kernel = _b[_i];
                        _c = kernel;
                        return [4 /*yield*/, kernel.kernelTimeMs];
                    case 3:
                        _c.kernelTimeMs = _e.sent();
                        _d = kernel;
                        return [4 /*yield*/, kernel.extraInfo];
                    case 4:
                        _d.extraInfo = _e.sent();
                        _e.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/, this.state.activeProfile];
                }
            });
        });
    };
    Engine.prototype.isTapeOn = function () {
        return this.state.gradientDepth > 0 && this.state.kernelDepth === 0;
    };
    Engine.prototype.addTapeNode = function (kernelName, inputs, outputs, gradientsFunc, saved, attrs) {
        var _this = this;
        var tapeNode = { id: this.state.nextTapeNodeId++, kernelName: kernelName, inputs: inputs, outputs: outputs, saved: saved };
        var gradConfig = getGradient(kernelName);
        if (gradConfig != null) {
            gradientsFunc = gradConfig.gradFunc;
        }
        if (gradientsFunc != null) {
            tapeNode.gradient = function (dys) {
                // TODO(smilkov): To optimize back-prop, pass dys that are not used in
                // the backprop graph to the user as null instead of zeros
                dys = dys.map(function (dy, i) {
                    if (dy == null) {
                        var output = outputs[i];
                        var vals = makeZerosTypedArray(output.size, output.dtype);
                        return _this.makeTensor(vals, output.shape, output.dtype);
                    }
                    return dy;
                });
                // Grad functions of ops with single outputs expect a dy, while ops
                // with multiple outputs expect dys (array of dy).
                return gradientsFunc(dys.length > 1 ? dys : dys[0], saved, attrs);
            };
        }
        this.state.activeTape.push(tapeNode);
    };
    Engine.prototype.keep = function (result) {
        result.kept = true;
        return result;
    };
    Engine.prototype.startTape = function () {
        if (this.state.gradientDepth === 0) {
            this.state.activeTape = [];
        }
        this.state.gradientDepth++;
    };
    Engine.prototype.endTape = function () {
        this.state.gradientDepth--;
    };
    /**
     * Start a scope. Use this with endScope() to achieve the same functionality
     * as scope() without the need for a function closure.
     */
    Engine.prototype.startScope = function (name) {
        var scopeInfo = {
            track: [],
            name: 'unnamed scope',
            id: this.state.nextScopeId++
        };
        if (name) {
            scopeInfo.name = name;
        }
        this.state.scopeStack.push(scopeInfo);
        this.state.activeScope = scopeInfo;
    };
    /**
     * End a scope. Use this with startScope() to achieve the same functionality
     * as scope() without the need for a function closure.
     */
    Engine.prototype.endScope = function (result) {
        var _this = this;
        var tensorsToTrackInParent = getTensorsInContainer(result);
        var tensorsToTrackInParentSet = new Set(tensorsToTrackInParent.map(function (t) { return t.id; }));
        // Dispose the arrays tracked in this scope.
        for (var i = 0; i < this.state.activeScope.track.length; i++) {
            var tensor = this.state.activeScope.track[i];
            if (!tensor.kept && !tensorsToTrackInParentSet.has(tensor.id)) {
                tensor.dispose();
            }
        }
        var oldScope = this.state.scopeStack.pop();
        this.state.activeScope = this.state.scopeStack.length === 0 ?
            null :
            this.state.scopeStack[this.state.scopeStack.length - 1];
        // Track the current result in the parent scope.
        tensorsToTrackInParent.forEach(function (tensor) {
            // Only track the tensor if was allocated in the inner scope and is not
            // globally kept.
            if (!tensor.kept && tensor.scopeId === oldScope.id) {
                _this.track(tensor);
            }
        });
    };
    /**
     * Returns gradients of `f` with respect to each of the `xs`. The gradients
     * returned are of the same length as `xs`, but some might be null if `f`
     * was not a function of that `x`. It also takes optional dy to multiply the
     * gradient, which defaults to `1`.
     */
    Engine.prototype.gradients = function (f, xs, dy, allowNoGradients) {
        var _this = this;
        if (allowNoGradients === void 0) { allowNoGradients = false; }
        assert(xs.length > 0, function () { return 'gradients() received an empty list of xs.'; });
        if (dy != null && dy.dtype !== 'float32') {
            throw new Error("dy must have 'float32' dtype, but has '" + dy.dtype + "'");
        }
        var y = this.scopedRun(function () { return _this.startTape(); }, function () { return _this.endTape(); }, function () { return _this.tidy('forward', f); });
        assert(y instanceof Tensor, function () { return 'The result y returned by f() must be a tensor.'; });
        // Filter out the nodes that don't connect x => y.
        var filteredTape = getFilteredNodesXToY(this.state.activeTape, xs, y);
        if (!allowNoGradients && filteredTape.length === 0 && xs.length > 0) {
            throw new Error('Cannot compute gradient of y=f(x) with respect to x. Make sure ' +
                'that the f you passed encloses all operations that lead from x ' +
                'to y.');
        }
        return this.tidy('backward', function () {
            var accumulatedGradientMap = {};
            accumulatedGradientMap[y.id] = (dy == null) ? ones(y.shape) : dy;
            // Backprop gradients through the filtered nodes.
            backpropagateGradients(accumulatedGradientMap, filteredTape, 
            // Pass the tidy function to avoid circular dep with `tape.ts`.
            function (f) { return _this.tidy(f); }, 
            // Pass an add function to avoide a circular dep with `tape.ts`.
            add);
            var grads = xs.map(function (x) { return accumulatedGradientMap[x.id]; });
            if (_this.state.gradientDepth === 0) {
                // This means that we are not computing higher-order gradients
                // and can clean up the tape.
                _this.state.activeTape.forEach(function (node) {
                    for (var _i = 0, _a = node.saved; _i < _a.length; _i++) {
                        var tensor = _a[_i];
                        tensor.dispose();
                    }
                });
                _this.state.activeTape = null;
            }
            return { value: y, grads: grads };
        });
    };
    Engine.prototype.customGrad = function (f) {
        var _this = this;
        assert(isFunction(f), function () { return 'The f passed in customGrad(f) must be a function.'; });
        return function () {
            var inputs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                inputs[_i] = arguments[_i];
            }
            assert(inputs.every(function (t) { return t instanceof Tensor; }), function () { return 'The args passed in customGrad(f)(x1, x2,...) must all be ' +
                'tensors'; });
            var res;
            var inputMap = {};
            inputs.forEach(function (input, i) {
                inputMap[i] = input;
            });
            var forwardFunc = function (_, save) {
                res = f.apply(void 0, inputs.concat([save]));
                assert(res.value instanceof Tensor, function () { return 'The function f passed in customGrad(f) must return an ' +
                    'object where `obj.value` is a tensor'; });
                assert(isFunction(res.gradFunc), function () { return 'The function f passed in customGrad(f) must return an ' +
                    'object where `obj.gradFunc` is a function.'; });
                return res.value;
            };
            var backwardsFunc = function (dy, saved) {
                var gradRes = res.gradFunc(dy, saved);
                var grads = Array.isArray(gradRes) ? gradRes : [gradRes];
                assert(grads.length === inputs.length, function () { return 'The function f passed in customGrad(f) must return an ' +
                    'object where `obj.gradFunc` is a function that returns ' +
                    'the same number of tensors as inputs passed to f(...).'; });
                assert(grads.every(function (t) { return t instanceof Tensor; }), function () { return 'The function f passed in customGrad(f) must return an ' +
                    'object where `obj.gradFunc` is a function that returns ' +
                    'a list of only tensors.'; });
                var gradMap = {};
                grads.forEach(function (grad, i) {
                    gradMap[i] = function () { return grad; };
                });
                return gradMap;
            };
            return _this.runKernelFunc({
                forwardFunc: forwardFunc,
                backwardsFunc: backwardsFunc,
                inputs: inputMap,
            });
        };
    };
    Engine.prototype.readSync = function (dataId) {
        // Route the read to the correct backend.
        var info = this.state.tensorInfo.get(dataId);
        return info.backend.readSync(dataId);
    };
    Engine.prototype.read = function (dataId) {
        // Route the read to the correct backend.
        var info = this.state.tensorInfo.get(dataId);
        return info.backend.read(dataId);
    };
    Engine.prototype.time = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var start, timingInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        start = now();
                        return [4 /*yield*/, this.backend.time(query)];
                    case 1:
                        timingInfo = _a.sent();
                        timingInfo.wallMs = now() - start;
                        return [2 /*return*/, timingInfo];
                }
            });
        });
    };
    /**
     * Tracks a Tensor in the current scope to be automatically cleaned up
     * when the current scope ends, and returns the value.
     *
     * @param result The Tensor to track in the current scope.
     */
    Engine.prototype.track = function (result) {
        if (this.state.activeScope != null) {
            result.scopeId = this.state.activeScope.id;
            this.state.activeScope.track.push(result);
        }
        return result;
    };
    Object.defineProperty(Engine.prototype, "registeredVariables", {
        get: function () {
            return this.state.registeredVariables;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Resets the engine state. Removes all backends but does not remove
     * registered backend factories.
     */
    Engine.prototype.reset = function () {
        // Make any pending promise obsolete.
        this.pendingBackendInitId++;
        this.state.dispose();
        this.ENV.reset();
        this.state = new EngineState();
        for (var backendName in this.registry) {
            this.disposeRegisteredKernels(backendName);
            this.registry[backendName].dispose();
            delete this.registry[backendName];
        }
        this.backendName = null;
        this.backendInstance = null;
        this.pendingBackendInit = null;
    };
    Engine.nextTensorId = 0;
    Engine.nextVariableId = 0;
    return Engine;
}());
function ones(shape) {
    var values = makeOnesTypedArray(sizeFromShape(shape), 'float32');
    return ENGINE.makeTensor(values, shape, 'float32');
}
function getOrMakeEngine() {
    var ns = getGlobalNamespace();
    if (ns._tfengine == null) {
        var environment = new Environment(ns);
        ns._tfengine = new Engine(environment);
    }
    setEnvironmentGlobal(ns._tfengine.ENV);
    // Tell the current tensor interface that the global engine is responsible
    // for tracking.
    setTensorTracker(function () { return ns._tfengine; });
    return ns._tfengine;
}
var ENGINE = getOrMakeEngine();
/**
 * A implementation of the add op for use within engine and tape.
 *
 * This allows us to avoid a circular dependency between add.ts and engine.
 * It is exported to be available in tape tests.
 */
function add(a, b) {
    // We duplicate Add here to avoid a circular dependency with add.ts.
    var inputs = { a: a, b: b };
    return ENGINE.runKernel(Add, inputs);
}

/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// tslint:disable-next-line:no-any
function _isNavigatorDefined() {
    return typeof navigator !== 'undefined' && navigator != null;
}
function isMobile(nav) {
    if (nav || _isNavigatorDefined()) {
        if (!nav) {
            nav = navigator;
        }
        if (nav.product === 'ReactNative') {
            return true;
        }
        // tslint:disable-next-line:no-any
        var a = nav.userAgent || nav.vendor || window.opera;
        // tslint:disable-next-line:max-line-length
        return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i
            .test(a) ||
            // tslint:disable-next-line:max-line-length
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
                .test(a.substr(0, 4));
    }
    return false;
}
function isBrowser() {
    return (typeof window !== 'undefined' && window.document != null) ||
        //@ts-ignore
        (typeof WorkerGlobalScope !== 'undefined');
}

var device_util = {
    __proto__: null,
    isMobile: isMobile,
    isBrowser: isBrowser
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var ENV = env();
/**
 * This file contains environment-related flag registrations.
 */
/** Whether to enable debug mode. */
ENV.registerFlag('DEBUG', function () { return false; }, function (debugValue) {
    if (debugValue) {
        console.warn('Debugging mode is ON. The output of every math call will ' +
            'be downloaded to CPU and checked for NaNs. ' +
            'This significantly impacts performance.');
    }
});
/** Whether we are in a browser (as versus, say, node.js) environment. */
ENV.registerFlag('IS_BROWSER', function () { return isBrowser(); });
/** Whether we are in a browser (as versus, say, node.js) environment. */
ENV.registerFlag('IS_NODE', function () { return (typeof process !== 'undefined') &&
    (typeof process.versions !== 'undefined') &&
    (typeof process.versions.node !== 'undefined'); });
/** Whether this browser is Chrome. */
ENV.registerFlag('IS_CHROME', function () { return typeof navigator !== 'undefined' && navigator != null &&
    navigator.userAgent != null && /Chrome/.test(navigator.userAgent) &&
    /Google Inc/.test(navigator.vendor); });
/**
 * True when the environment is "production" where we disable safety checks
 * to gain performance.
 */
ENV.registerFlag('PROD', function () { return false; });
/**
 * Whether to do sanity checks when inferring a shape from user-provided
 * values, used when creating a new tensor.
 */
ENV.registerFlag('TENSORLIKE_CHECK_SHAPE_CONSISTENCY', function () { return ENV.getBool('DEBUG'); });
/** Whether deprecation warnings are enabled. */
ENV.registerFlag('DEPRECATION_WARNINGS_ENABLED', function () { return true; });
/** True if running unit tests. */
ENV.registerFlag('IS_TEST', function () { return false; });
/** Whether to check computation result for errors. */
ENV.registerFlag('CHECK_COMPUTATION_FOR_ERRORS', function () { return true; });
/** Whether the backend needs to wrap input to imageBitmap. */
ENV.registerFlag('WRAP_TO_IMAGEBITMAP', function () { return false; });

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function inferShape(val, dtype) {
    var firstElem = val;
    if (isTypedArray(val)) {
        return dtype === 'string' ? [] : [val.length];
    }
    if (!Array.isArray(val)) {
        return []; // Scalar.
    }
    var shape = [];
    while (Array.isArray(firstElem) ||
        isTypedArray(firstElem) && dtype !== 'string') {
        shape.push(firstElem.length);
        firstElem = firstElem[0];
    }
    if (Array.isArray(val) &&
        env().getBool('TENSORLIKE_CHECK_SHAPE_CONSISTENCY')) {
        deepAssertShapeConsistency(val, shape, []);
    }
    return shape;
}
function deepAssertShapeConsistency(val, shape, indices) {
    indices = indices || [];
    if (!(Array.isArray(val)) && !isTypedArray(val)) {
        assert(shape.length === 0, function () { return "Element arr[" + indices.join('][') + "] is a primitive, " +
            ("but should be an array/TypedArray of " + shape[0] + " elements"); });
        return;
    }
    assert(shape.length > 0, function () { return "Element arr[" + indices.join('][') + "] should be a primitive, " +
        ("but is an array of " + val.length + " elements"); });
    assert(val.length === shape[0], function () { return "Element arr[" + indices.join('][') + "] should have " + shape[0] + " " +
        ("elements, but has " + val.length + " elements"); });
    var subShape = shape.slice(1);
    for (var i = 0; i < val.length; ++i) {
        deepAssertShapeConsistency(val[i], subShape, indices.concat(i));
    }
}
function assertDtype(expectedDtype, actualDType, argName, functionName) {
    if (expectedDtype === 'string_or_numeric') {
        return;
    }
    if (expectedDtype == null) {
        throw new Error("Expected dtype cannot be null.");
    }
    if (expectedDtype !== 'numeric' && expectedDtype !== actualDType ||
        expectedDtype === 'numeric' && actualDType === 'string') {
        throw new Error("Argument '" + argName + "' passed to '" + functionName + "' must " +
            ("be " + expectedDtype + " tensor, but got " + actualDType + " tensor"));
    }
}
function convertToTensor(x, argName, functionName, parseAsDtype) {
    if (parseAsDtype === void 0) { parseAsDtype = 'numeric'; }
    if (x instanceof Tensor) {
        assertDtype(parseAsDtype, x.dtype, argName, functionName);
        return x;
    }
    var inferredDtype = inferDtype(x);
    // If the user expects a bool/int/float, use that info to update the
    // inferredDtype when it is not a string.
    if (inferredDtype !== 'string' &&
        ['bool', 'int32', 'float32'].indexOf(parseAsDtype) >= 0) {
        inferredDtype = parseAsDtype;
    }
    assertDtype(parseAsDtype, inferredDtype, argName, functionName);
    if ((x == null) ||
        (!isTypedArray(x) && !Array.isArray(x) && typeof x !== 'number' &&
            typeof x !== 'boolean' && typeof x !== 'string')) {
        var type = x == null ? 'null' : x.constructor.name;
        throw new Error("Argument '" + argName + "' passed to '" + functionName + "' must be a " +
            ("Tensor or TensorLike, but got '" + type + "'"));
    }
    var inferredShape = inferShape(x, inferredDtype);
    if (!isTypedArray(x) && !Array.isArray(x)) {
        x = [x];
    }
    var skipTypedArray = true;
    var values = inferredDtype !== 'string' ?
        toTypedArray(x, inferredDtype) :
        flatten(x, [], skipTypedArray);
    return ENGINE.makeTensor(values, inferredShape, inferredDtype);
}
function convertToTensorArray(arg, argName, functionName, parseAsDtype) {
    if (parseAsDtype === void 0) { parseAsDtype = 'numeric'; }
    if (!Array.isArray(arg)) {
        throw new Error("Argument " + argName + " passed to " + functionName + " must be a " +
            '`Tensor[]` or `TensorLike[]`');
    }
    var tensors = arg;
    return tensors.map(function (t, i) {
        return convertToTensor(t, argName + "[" + i + "]", functionName, parseAsDtype);
    });
}

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var OP_SCOPE_SUFFIX = '__op';
/**
 * Used for wrapping functions that perform math operations on
 * Tensors. The function will be wrapped in a named scope that cleans all
 * memory usage after the function is done.
 */
function op(f) {
    var keys = Object.keys(f);
    if (keys.length !== 1) {
        throw new Error("Please provide an object with a single key " +
            "(operation name) mapping to a function. Got an object with " +
            (keys.length + " keys."));
    }
    var opName = keys[0];
    var fn = f[opName];
    // Strip the underscore from the end of the function name.
    if (opName.endsWith('_')) {
        opName = opName.substring(0, opName.length - 1);
    }
    // add an __op suffix to distinguish ops from kernels in tf.profile
    opName = opName + OP_SCOPE_SUFFIX;
    // tslint:disable-next-line:no-any
    var f2 = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        ENGINE.startScope(opName);
        try {
            var result = fn.apply(void 0, args);
            if (isPromise(result)) {
                console.error('Cannot return a Promise inside of tidy.');
            }
            ENGINE.endScope(result);
            return result;
        }
        catch (ex) {
            ENGINE.endScope(null);
            throw ex;
        }
    };
    Object.defineProperty(f2, 'name', { value: opName, configurable: true });
    // tslint:disable-next-line:no-any
    return f2;
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Converts two real numbers to a complex number.
 *
 * Given a tensor `real` representing the real part of a complex number, and a
 * tensor `imag` representing the imaginary part of a complex number, this
 * operation returns complex numbers elementwise of the form [r0, i0, r1, i1],
 * where r represents the real part and i represents the imag part.
 *
 * The input tensors real and imag must have the same shape.
 *
 * ```js
 * const real = tf.tensor1d([2.25, 3.25]);
 * const imag = tf.tensor1d([4.75, 5.75]);
 * const complex = tf.complex(real, imag);
 *
 * complex.print();
 * ```
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
function complex_(real, imag) {
    var $real = convertToTensor(real, 'real', 'complex');
    var $imag = convertToTensor(imag, 'imag', 'complex');
    assertShapesMatch($real.shape, $imag.shape, "real and imag shapes, " + $real.shape + " and " + $imag.shape + ", " +
        "must match in call to tf.complex().");
    var inputs = { real: $real, imag: $imag };
    return ENGINE.runKernel(Complex, inputs);
}
var complex = op({ complex_: complex_ });

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/** This is shared code across all tensor creation methods. */
function makeTensor(values, shape, inferredShape, dtype) {
    if (dtype == null) {
        dtype = inferDtype(values);
    }
    if (dtype === 'complex64') {
        throw new Error("Cannot construct a complex64 tensor directly. " +
            "Please use tf.complex(real, imag).");
    }
    if (!isTypedArray(values) && !Array.isArray(values) &&
        typeof values !== 'number' && typeof values !== 'boolean' &&
        typeof values !== 'string') {
        throw new Error('values passed to tensor(values) must be a number/boolean/string or ' +
            'an array of numbers/booleans/strings, or a TypedArray');
    }
    if (shape != null) {
        assertNonNegativeIntegerDimensions(shape);
        var providedSize_1 = sizeFromShape(shape);
        var inferredSize_1 = sizeFromShape(inferredShape);
        assert(providedSize_1 === inferredSize_1, function () {
            return "Based on the provided shape, [" + shape + "], the tensor should have " +
                (providedSize_1 + " values but has " + inferredSize_1);
        });
        for (var i = 0; i < inferredShape.length; ++i) {
            var inferred = inferredShape[i];
            var flatDimsDontMatch = i === inferredShape.length - 1 ?
                inferred !== sizeFromShape(shape.slice(i)) :
                true;
            assert(inferredShape[i] === shape[i] || !flatDimsDontMatch, function () { return "Error creating a new Tensor. Inferred shape " +
                ("(" + inferredShape + ") does not match the provided ") +
                ("shape (" + shape + "). "); });
        }
    }
    if (!isTypedArray(values) && !Array.isArray(values)) {
        values = [values];
    }
    shape = shape || inferredShape;
    values = dtype !== 'string' ?
        toTypedArray(values, dtype) :
        flatten(values, [], true);
    return ENGINE.makeTensor(values, shape, dtype);
}

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Creates a `tf.Tensor` with the provided values, shape and dtype.
 *
 * ```js
 * // Pass an array of values to create a vector.
 * tf.tensor([1, 2, 3, 4]).print();
 * ```
 *
 * ```js
 * // Pass a nested array of values to make a matrix or a higher
 * // dimensional tensor.
 * tf.tensor([[1, 2], [3, 4]]).print();
 * ```
 *
 * ```js
 * // Pass a flat array and specify a shape yourself.
 * tf.tensor([1, 2, 3, 4], [2, 2]).print();
 * ```
 *
 * @param values The values of the tensor. Can be nested array of numbers,
 *     or a flat array, or a `TypedArray`. If the values are strings,
 *     they will be encoded as utf-8 and kept as `Uint8Array[]`.
 * @param shape The shape of the tensor. Optional. If not provided,
 *   it is inferred from `values`.
 * @param dtype The data type.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
function tensor(values, shape, dtype) {
    var inferredShape = inferShape(values, dtype);
    return makeTensor(values, shape, inferredShape, dtype);
}

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/* Type definitions for exporting and importing of models. */
/**
 * A map from Tensor dtype to number of bytes per element of the Tensor.
 */
var DTYPE_VALUE_SIZE_MAP = {
    'float32': 4,
    'float16': 2,
    'int32': 4,
    'uint16': 2,
    'uint8': 1,
    'bool': 1,
    'complex64': 8
};

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/** Number of bytes reserved for the length of the string. (32bit integer). */
var NUM_BYTES_STRING_LENGTH = 4;
/**
 * Encode a map from names to weight values as an ArrayBuffer, along with an
 * `Array` of `WeightsManifestEntry` as specification of the encoded weights.
 *
 * This function does not perform sharding.
 *
 * This function is the reverse of `decodeWeights`.
 *
 * @param tensors A map ("dict") from names to tensors.
 * @param group Group to which the weights belong (optional).
 * @returns A `Promise` of
 *   - A flat `ArrayBuffer` with all the binary values of the `Tensor`s
 *     concatenated.
 *   - An `Array` of `WeightManifestEntry`s, carrying information including
 *     tensor names, `dtype`s and shapes.
 * @throws Error: on unsupported tensor `dtype`.
 */
function encodeWeights(tensors, group) {
    return __awaiter(this, void 0, void 0, function () {
        var specs, dataPromises, names, _loop_1, i, tensorValues;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    specs = [];
                    dataPromises = [];
                    names = Array.isArray(tensors) ?
                        tensors.map(function (tensor) { return tensor.name; }) :
                        Object.keys(tensors);
                    _loop_1 = function (i) {
                        var name_1 = names[i];
                        var t = Array.isArray(tensors) ? tensors[i].tensor : tensors[name_1];
                        if (t.dtype !== 'float32' && t.dtype !== 'int32' && t.dtype !== 'bool' &&
                            t.dtype !== 'string' && t.dtype !== 'complex64') {
                            throw new Error("Unsupported dtype in weight '" + name_1 + "': " + t.dtype);
                        }
                        var spec = { name: name_1, shape: t.shape, dtype: t.dtype };
                        if (t.dtype === 'string') {
                            var utf8bytes = new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                                var vals, totalNumBytes, bytes, offset, i_1, val, bytesOfLength;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, t.bytes()];
                                        case 1:
                                            vals = _a.sent();
                                            totalNumBytes = vals.reduce(function (p, c) { return p + c.length; }, 0) +
                                                NUM_BYTES_STRING_LENGTH * vals.length;
                                            bytes = new Uint8Array(totalNumBytes);
                                            offset = 0;
                                            for (i_1 = 0; i_1 < vals.length; i_1++) {
                                                val = vals[i_1];
                                                bytesOfLength = new Uint8Array(new Uint32Array([val.length]).buffer);
                                                bytes.set(bytesOfLength, offset);
                                                offset += NUM_BYTES_STRING_LENGTH;
                                                bytes.set(val, offset);
                                                offset += val.length;
                                            }
                                            resolve(bytes);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            dataPromises.push(utf8bytes);
                        }
                        else {
                            dataPromises.push(t.data());
                        }
                        if (group != null) {
                            spec.group = group;
                        }
                        specs.push(spec);
                    };
                    for (i = 0; i < names.length; ++i) {
                        _loop_1(i);
                    }
                    return [4 /*yield*/, Promise.all(dataPromises)];
                case 1:
                    tensorValues = _a.sent();
                    return [2 /*return*/, { data: concatenateTypedArrays(tensorValues), specs: specs }];
            }
        });
    });
}
/**
 * Decode flat ArrayBuffer as weights.
 *
 * This function does not handle sharding.
 *
 * This function is the reverse of `encodeWeights`.
 *
 * @param buffer A flat ArrayBuffer carrying the binary values of the tensors
 *   concatenated in the order specified in `specs`.
 * @param specs Specifications of the names, dtypes and shapes of the tensors
 *   whose value are encoded by `buffer`.
 * @return A map from tensor name to tensor value, with the names corresponding
 *   to names in `specs`.
 * @throws Error, if any of the tensors has unsupported dtype.
 */
function decodeWeights(buffer, specs) {
    // TODO(adarob, cais): Support quantization.
    var out = {};
    var float16Decode;
    var offset = 0;
    for (var _i = 0, specs_1 = specs; _i < specs_1.length; _i++) {
        var spec = specs_1[_i];
        var name_2 = spec.name;
        var dtype = spec.dtype;
        var shape = spec.shape;
        var size = sizeFromShape(shape);
        var values = void 0;
        if ('quantization' in spec) {
            var quantization = spec.quantization;
            if (quantization.dtype === 'uint8' || quantization.dtype === 'uint16') {
                if (!('min' in quantization && 'scale' in quantization)) {
                    throw new Error("Weight " + spec.name + " with quantization " + quantization.dtype + " " +
                        "doesn't have corresponding metadata min and scale.");
                }
            }
            else if (quantization.dtype === 'float16') {
                if (dtype !== 'float32') {
                    throw new Error("Weight " + spec.name + " is quantized with " + quantization.dtype + " " +
                        ("which only supports weights of type float32 not " + dtype + "."));
                }
            }
            else {
                throw new Error("Weight " + spec.name + " has unknown " +
                    ("quantization dtype " + quantization.dtype + ". ") +
                    "Supported quantization dtypes are: " +
                    "'uint8', 'uint16', and 'float16'.");
            }
            var quantizationSizeFactor = DTYPE_VALUE_SIZE_MAP[quantization.dtype];
            var byteBuffer = buffer.slice(offset, offset + size * quantizationSizeFactor);
            var quantizedArray = (quantization.dtype === 'uint8') ?
                new Uint8Array(byteBuffer) :
                new Uint16Array(byteBuffer);
            if (dtype === 'float32') {
                if (quantization.dtype === 'uint8' || quantization.dtype === 'uint16') {
                    values = new Float32Array(quantizedArray.length);
                    for (var i = 0; i < quantizedArray.length; i++) {
                        var v = quantizedArray[i];
                        values[i] = v * quantization.scale + quantization.min;
                    }
                }
                else if (quantization.dtype === 'float16') {
                    if (float16Decode === undefined) {
                        float16Decode = getFloat16Decoder();
                    }
                    values = float16Decode(quantizedArray);
                }
                else {
                    throw new Error("Unsupported quantization type " + quantization.dtype + " " +
                        "for weight type float32.");
                }
            }
            else if (dtype === 'int32') {
                if (quantization.dtype !== 'uint8' && quantization.dtype !== 'uint16') {
                    throw new Error("Unsupported quantization type " + quantization.dtype + " " +
                        "for weight type int32.");
                }
                values = new Int32Array(quantizedArray.length);
                for (var i = 0; i < quantizedArray.length; i++) {
                    var v = quantizedArray[i];
                    values[i] = Math.round(v * quantization.scale + quantization.min);
                }
            }
            else {
                throw new Error("Unsupported dtype in weight '" + name_2 + "': " + dtype);
            }
            offset += size * quantizationSizeFactor;
        }
        else if (dtype === 'string') {
            var size_1 = sizeFromShape(spec.shape);
            values = [];
            for (var i = 0; i < size_1; i++) {
                var byteLength = new Uint32Array(buffer.slice(offset, offset + NUM_BYTES_STRING_LENGTH))[0];
                offset += NUM_BYTES_STRING_LENGTH;
                var bytes = new Uint8Array(buffer.slice(offset, offset + byteLength));
                values.push(bytes);
                offset += byteLength;
            }
        }
        else {
            var dtypeFactor = DTYPE_VALUE_SIZE_MAP[dtype];
            var byteBuffer = buffer.slice(offset, offset + size * dtypeFactor);
            if (dtype === 'float32') {
                values = new Float32Array(byteBuffer);
            }
            else if (dtype === 'int32') {
                values = new Int32Array(byteBuffer);
            }
            else if (dtype === 'bool') {
                values = new Uint8Array(byteBuffer);
            }
            else if (dtype === 'complex64') {
                values = new Float32Array(byteBuffer);
                var real = new Float32Array(values.length / 2);
                var image = new Float32Array(values.length / 2);
                for (var i = 0; i < real.length; i++) {
                    real[i] = values[i * 2];
                    image[i] = values[i * 2 + 1];
                }
                var realTensor = tensor(real, shape, 'float32');
                var imageTensor = tensor(image, shape, 'float32');
                out[name_2] = complex(realTensor, imageTensor);
                realTensor.dispose();
                imageTensor.dispose();
            }
            else {
                throw new Error("Unsupported dtype in weight '" + name_2 + "': " + dtype);
            }
            offset += size * dtypeFactor;
        }
        if (dtype !== 'complex64') {
            out[name_2] = tensor(values, shape, dtype);
        }
    }
    return out;
}
/**
 * Concatenate TypedArrays into an ArrayBuffer.
 */
function concatenateTypedArrays(xs) {
    // TODO(adarob, cais): Support quantization.
    if (xs === null) {
        throw new Error("Invalid input value: " + JSON.stringify(xs));
    }
    var totalByteLength = 0;
    // `normalizedXs` is here for this reason: a `TypedArray`'s `buffer'
    // can have a different byte length from that of the `TypedArray` itself,
    // for example, when the `TypedArray` is created from an offset in an
    // `ArrayBuffer`. `normliazedXs` holds `TypedArray`s whose `buffer`s match
    // the `TypedArray` in byte length. If an element of `xs` does not show
    // this property, a new `TypedArray` that satisfy this property will be
    // constructed and pushed into `normalizedXs`.
    var normalizedXs = [];
    xs.forEach(function (x) {
        totalByteLength += x.byteLength;
        // tslint:disable:no-any
        normalizedXs.push(x.byteLength === x.buffer.byteLength ? x :
            new x.constructor(x));
        if (!(x instanceof Float32Array || x instanceof Int32Array ||
            x instanceof Uint8Array)) {
            throw new Error("Unsupported TypedArray subtype: " + x.constructor.name);
        }
        // tslint:enable:no-any
    });
    var y = new Uint8Array(totalByteLength);
    var offset = 0;
    normalizedXs.forEach(function (x) {
        y.set(new Uint8Array(x.buffer), offset);
        offset += x.byteLength;
    });
    return y.buffer;
}
// Use Buffer on Node.js instead of Blob/atob/btoa
var useNodeBuffer = typeof Buffer !== 'undefined' &&
    (typeof Blob === 'undefined' || typeof atob === 'undefined' ||
        typeof btoa === 'undefined');
/**
 * Calculate the byte length of a JavaScript string.
 *
 * Note that a JavaScript string can contain wide characters, therefore the
 * length of the string is not necessarily equal to the byte length.
 *
 * @param str Input string.
 * @returns Byte length.
 */
function stringByteLength(str) {
    if (useNodeBuffer) {
        return Buffer.byteLength(str);
    }
    return new Blob([str]).size;
}
/**
 * Encode an ArrayBuffer as a base64 encoded string.
 *
 * @param buffer `ArrayBuffer` to be converted.
 * @returns A string that base64-encodes `buffer`.
 */
function arrayBufferToBase64String(buffer) {
    if (useNodeBuffer) {
        return Buffer.from(buffer).toString('base64');
    }
    var buf = new Uint8Array(buffer);
    var s = '';
    for (var i = 0, l = buf.length; i < l; i++) {
        s += String.fromCharCode(buf[i]);
    }
    return btoa(s);
}
/**
 * Decode a base64 string as an ArrayBuffer.
 *
 * @param str Base64 string.
 * @returns Decoded `ArrayBuffer`.
 */
function base64StringToArrayBuffer(str) {
    if (useNodeBuffer) {
        var buf = Buffer.from(str, 'base64');
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    var s = atob(str);
    var buffer = new Uint8Array(s.length);
    for (var i = 0; i < s.length; ++i) {
        buffer.set([s.charCodeAt(i)], i);
    }
    return buffer.buffer;
}
/**
 * Concatenate a number of ArrayBuffers into one.
 *
 * @param buffers A number of array buffers to concatenate.
 * @returns Result of concatenating `buffers` in order.
 */
function concatenateArrayBuffers(buffers) {
    if (buffers.length === 1) {
        return buffers[0];
    }
    var totalByteLength = 0;
    buffers.forEach(function (buffer) {
        totalByteLength += buffer.byteLength;
    });
    var temp = new Uint8Array(totalByteLength);
    var offset = 0;
    buffers.forEach(function (buffer) {
        temp.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
    });
    return temp.buffer;
}
/**
 * Get the basename of a path.
 *
 * Behaves in a way analogous to Linux's basename command.
 *
 * @param path
 */
function basename(path) {
    var SEPARATOR = '/';
    path = path.trim();
    while (path.endsWith(SEPARATOR)) {
        path = path.slice(0, path.length - 1);
    }
    var items = path.split(SEPARATOR);
    return items[items.length - 1];
}
/**
 * Populate ModelArtifactsInfo fields for a model with JSON topology.
 * @param modelArtifacts
 * @returns A ModelArtifactsInfo object.
 */
function getModelArtifactsInfoForJSON(modelArtifacts) {
    if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
        throw new Error('Expected JSON model topology, received ArrayBuffer.');
    }
    return {
        dateSaved: new Date(),
        modelTopologyType: 'JSON',
        modelTopologyBytes: modelArtifacts.modelTopology == null ?
            0 :
            stringByteLength(JSON.stringify(modelArtifacts.modelTopology)),
        weightSpecsBytes: modelArtifacts.weightSpecs == null ?
            0 :
            stringByteLength(JSON.stringify(modelArtifacts.weightSpecs)),
        weightDataBytes: modelArtifacts.weightData == null ?
            0 :
            modelArtifacts.weightData.byteLength,
    };
}
/**
 * Computes mantisa table for casting Float16 to Float32
 * See http://www.fox-toolkit.org/ftp/fasthalffloatconversion.pdf
 *
 * @returns Uint32Array, 2048 mantissa lookup values.
 */
function computeFloat16MantisaTable() {
    var convertMantissa = function (i) {
        var m = i << 13;
        var e = 0;
        while ((m & 0x00800000) === 0) {
            e -= 0x00800000;
            m <<= 1;
        }
        m &= ~0x00800000;
        e += 0x38800000;
        return m | e;
    };
    var mantisaTable = new Uint32Array(2048);
    mantisaTable[0] = 0;
    for (var i = 1; i < 1024; i++) {
        mantisaTable[i] = convertMantissa(i);
    }
    for (var i = 1024; i < 2048; i++) {
        mantisaTable[i] = 0x38000000 + ((i - 1024) << 13);
    }
    return mantisaTable;
}
/**
 * Computes exponent table for casting Float16 to Float32
 * See http://www.fox-toolkit.org/ftp/fasthalffloatconversion.pdf
 *
 * @returns Uint32Array, 64 exponent lookup values.
 */
function computeFloat16ExponentTable() {
    var exponentTable = new Uint32Array(64);
    exponentTable[0] = 0;
    exponentTable[31] = 0x47800000;
    exponentTable[32] = 0x80000000;
    exponentTable[63] = 0xc7800000;
    for (var i = 1; i < 31; i++) {
        exponentTable[i] = i << 23;
    }
    for (var i = 33; i < 63; i++) {
        exponentTable[i] = 0x80000000 + ((i - 32) << 23);
    }
    return exponentTable;
}
/**
 * Computes offset table for casting Float16 to Float32
 * See http://www.fox-toolkit.org/ftp/fasthalffloatconversion.pdf
 *
 * @returns Uint32Array, 6d offset values.
 */
function computeFloat16OffsetTable() {
    var offsetTable = new Uint32Array(64);
    for (var i = 0; i < 64; i++) {
        offsetTable[i] = 1024;
    }
    offsetTable[0] = offsetTable[32] = 0;
    return offsetTable;
}
/**
 * Retrieve a Float16 decoder which will decode a ByteArray of Float16 values
 * to a Float32Array.
 *
 * @returns Function (buffer: Uint16Array) => Float32Array which decodes
 *          the Uint16Array of Float16 bytes to a Float32Array.
 */
function getFloat16Decoder() {
    // Algorithm is based off of
    // http://www.fox-toolkit.org/ftp/fasthalffloatconversion.pdf
    // Cache lookup tables
    var mantisaTable = computeFloat16MantisaTable();
    var exponentTable = computeFloat16ExponentTable();
    var offsetTable = computeFloat16OffsetTable();
    return function (quantizedArray) {
        var buffer = new ArrayBuffer(4 * quantizedArray.length);
        var bufferUint32View = new Uint32Array(buffer);
        for (var index = 0; index < quantizedArray.length; index++) {
            var float16Bits = quantizedArray[index];
            var float32Bits = mantisaTable[offsetTable[float16Bits >> 10] + (float16Bits & 0x3ff)] +
                exponentTable[float16Bits >> 10];
            bufferUint32View[index] = float32Bits;
        }
        return new Float32Array(buffer);
    };
}

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var IORouterRegistry = /** @class */ (function () {
    function IORouterRegistry() {
        this.saveRouters = [];
        this.loadRouters = [];
    }
    IORouterRegistry.getInstance = function () {
        if (IORouterRegistry.instance == null) {
            IORouterRegistry.instance = new IORouterRegistry();
        }
        return IORouterRegistry.instance;
    };
    /**
     * Register a save-handler router.
     *
     * @param saveRouter A function that maps a URL-like string onto an instance
     * of `IOHandler` with the `save` method defined or `null`.
     */
    IORouterRegistry.registerSaveRouter = function (saveRouter) {
        IORouterRegistry.getInstance().saveRouters.push(saveRouter);
    };
    /**
     * Register a load-handler router.
     *
     * @param loadRouter A function that maps a URL-like string onto an instance
     * of `IOHandler` with the `load` method defined or `null`.
     */
    IORouterRegistry.registerLoadRouter = function (loadRouter) {
        IORouterRegistry.getInstance().loadRouters.push(loadRouter);
    };
    /**
     * Look up IOHandler for saving, given a URL-like string.
     *
     * @param url
     * @returns If only one match is found, an instance of IOHandler with the
     * `save` method defined. If no match is found, `null`.
     * @throws Error, if more than one match is found.
     */
    IORouterRegistry.getSaveHandlers = function (url) {
        return IORouterRegistry.getHandlers(url, 'save');
    };
    /**
     * Look up IOHandler for loading, given a URL-like string.
     *
     * @param url
     * @param loadOptions Optional, custom load options.
     * @returns All valid handlers for `url`, given the currently registered
     *   handler routers.
     */
    IORouterRegistry.getLoadHandlers = function (url, loadOptions) {
        return IORouterRegistry.getHandlers(url, 'load', loadOptions);
    };
    IORouterRegistry.getHandlers = function (url, handlerType, loadOptions) {
        var validHandlers = [];
        var routers = handlerType === 'load' ?
            IORouterRegistry.getInstance().loadRouters :
            IORouterRegistry.getInstance().saveRouters;
        routers.forEach(function (router) {
            var handler = router(url, loadOptions);
            if (handler !== null) {
                validHandlers.push(handler);
            }
        });
        return validHandlers;
    };
    return IORouterRegistry;
}());
var registerSaveRouter = function (loudRouter) {
    return IORouterRegistry.registerSaveRouter(loudRouter);
};
var registerLoadRouter = function (loudRouter) {
    return IORouterRegistry.registerLoadRouter(loudRouter);
};
var getSaveHandlers = function (url) {
    return IORouterRegistry.getSaveHandlers(url);
};
var getLoadHandlers = function (url, loadOptions) {
    return IORouterRegistry.getLoadHandlers(url, loadOptions);
};

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var DATABASE_NAME = 'tensorflowjs';
var DATABASE_VERSION = 1;
// Model data and ModelArtifactsInfo (metadata) are stored in two separate
// stores for efficient access of the list of stored models and their metadata.
// 1. The object store for model data: topology, weights and weight manifests.
var MODEL_STORE_NAME = 'models_store';
// 2. The object store for ModelArtifactsInfo, including meta-information such
//    as the type of topology (JSON vs binary), byte size of the topology, byte
//    size of the weights, etc.
var INFO_STORE_NAME = 'model_info_store';
function getIndexedDBFactory() {
    if (!env().getBool('IS_BROWSER')) {
        // TODO(cais): Add more info about what IOHandler subtypes are available.
        //   Maybe point to a doc page on the web and/or automatically determine
        //   the available IOHandlers and print them in the error message.
        throw new Error('Failed to obtain IndexedDB factory because the current environment' +
            'is not a web browser.');
    }
    // tslint:disable-next-line:no-any
    var theWindow = typeof window === 'undefined' ? self : window;
    var factory = theWindow.indexedDB || theWindow.mozIndexedDB ||
        theWindow.webkitIndexedDB || theWindow.msIndexedDB ||
        theWindow.shimIndexedDB;
    if (factory == null) {
        throw new Error('The current browser does not appear to support IndexedDB.');
    }
    return factory;
}
function setUpDatabase(openRequest) {
    var db = openRequest.result;
    db.createObjectStore(MODEL_STORE_NAME, { keyPath: 'modelPath' });
    db.createObjectStore(INFO_STORE_NAME, { keyPath: 'modelPath' });
}
/**
 * IOHandler subclass: Browser IndexedDB.
 *
 * See the doc string of `browserIndexedDB` for more details.
 */
var BrowserIndexedDB = /** @class */ (function () {
    function BrowserIndexedDB(modelPath) {
        this.indexedDB = getIndexedDBFactory();
        if (modelPath == null || !modelPath) {
            throw new Error('For IndexedDB, modelPath must not be null, undefined or empty.');
        }
        this.modelPath = modelPath;
    }
    BrowserIndexedDB.prototype.save = function (modelArtifacts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO(cais): Support saving GraphDef models.
                if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
                    throw new Error('BrowserLocalStorage.save() does not support saving model topology ' +
                        'in binary formats yet.');
                }
                return [2 /*return*/, this.databaseAction(this.modelPath, modelArtifacts)];
            });
        });
    };
    BrowserIndexedDB.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.databaseAction(this.modelPath)];
            });
        });
    };
    /**
     * Perform database action to put model artifacts into or read model artifacts
     * from IndexedDB object store.
     *
     * Whether the action is put or get depends on whether `modelArtifacts` is
     * specified. If it is specified, the action will be put; otherwise the action
     * will be get.
     *
     * @param modelPath A unique string path for the model.
     * @param modelArtifacts If specified, it will be the model artifacts to be
     *   stored in IndexedDB.
     * @returns A `Promise` of `SaveResult`, if the action is put, or a `Promise`
     *   of `ModelArtifacts`, if the action is get.
     */
    BrowserIndexedDB.prototype.databaseAction = function (modelPath, modelArtifacts) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var openRequest = _this.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
            openRequest.onupgradeneeded = function () { return setUpDatabase(openRequest); };
            openRequest.onsuccess = function () {
                var db = openRequest.result;
                if (modelArtifacts == null) {
                    // Read model out from object store.
                    var modelTx = db.transaction(MODEL_STORE_NAME, 'readonly');
                    var modelStore = modelTx.objectStore(MODEL_STORE_NAME);
                    var getRequest_1 = modelStore.get(_this.modelPath);
                    getRequest_1.onsuccess = function () {
                        if (getRequest_1.result == null) {
                            db.close();
                            return reject(new Error("Cannot find model with path '" + _this.modelPath + "' " +
                                "in IndexedDB."));
                        }
                        else {
                            resolve(getRequest_1.result.modelArtifacts);
                        }
                    };
                    getRequest_1.onerror = function (error) {
                        db.close();
                        return reject(getRequest_1.error);
                    };
                    modelTx.oncomplete = function () { return db.close(); };
                }
                else {
                    // Put model into object store.
                    var modelArtifactsInfo_1 = getModelArtifactsInfoForJSON(modelArtifacts);
                    // First, put ModelArtifactsInfo into info store.
                    var infoTx_1 = db.transaction(INFO_STORE_NAME, 'readwrite');
                    var infoStore_1 = infoTx_1.objectStore(INFO_STORE_NAME);
                    var putInfoRequest_1 = infoStore_1.put({ modelPath: _this.modelPath, modelArtifactsInfo: modelArtifactsInfo_1 });
                    var modelTx_1;
                    putInfoRequest_1.onsuccess = function () {
                        // Second, put model data into model store.
                        modelTx_1 = db.transaction(MODEL_STORE_NAME, 'readwrite');
                        var modelStore = modelTx_1.objectStore(MODEL_STORE_NAME);
                        var putModelRequest = modelStore.put({
                            modelPath: _this.modelPath,
                            modelArtifacts: modelArtifacts,
                            modelArtifactsInfo: modelArtifactsInfo_1
                        });
                        putModelRequest.onsuccess = function () { return resolve({ modelArtifactsInfo: modelArtifactsInfo_1 }); };
                        putModelRequest.onerror = function (error) {
                            // If the put-model request fails, roll back the info entry as
                            // well.
                            infoStore_1 = infoTx_1.objectStore(INFO_STORE_NAME);
                            var deleteInfoRequest = infoStore_1.delete(_this.modelPath);
                            deleteInfoRequest.onsuccess = function () {
                                db.close();
                                return reject(putModelRequest.error);
                            };
                            deleteInfoRequest.onerror = function (error) {
                                db.close();
                                return reject(putModelRequest.error);
                            };
                        };
                    };
                    putInfoRequest_1.onerror = function (error) {
                        db.close();
                        return reject(putInfoRequest_1.error);
                    };
                    infoTx_1.oncomplete = function () {
                        if (modelTx_1 == null) {
                            db.close();
                        }
                        else {
                            modelTx_1.oncomplete = function () { return db.close(); };
                        }
                    };
                }
            };
            openRequest.onerror = function (error) { return reject(openRequest.error); };
        });
    };
    BrowserIndexedDB.URL_SCHEME = 'indexeddb://';
    return BrowserIndexedDB;
}());
var indexedDBRouter = function (url) {
    if (!env().getBool('IS_BROWSER')) {
        return null;
    }
    else {
        if (!Array.isArray(url) && url.startsWith(BrowserIndexedDB.URL_SCHEME)) {
            return browserIndexedDB(url.slice(BrowserIndexedDB.URL_SCHEME.length));
        }
        else {
            return null;
        }
    }
};
IORouterRegistry.registerSaveRouter(indexedDBRouter);
IORouterRegistry.registerLoadRouter(indexedDBRouter);
/**
 * Creates a browser IndexedDB IOHandler for saving and loading models.
 *
 * ```js
 * const model = tf.sequential();
 * model.add(
 *     tf.layers.dense({units: 1, inputShape: [100], activation: 'sigmoid'}));
 *
 * const saveResult = await model.save('indexeddb://MyModel'));
 * console.log(saveResult);
 * ```
 *
 * @param modelPath A unique identifier for the model to be saved. Must be a
 *   non-empty string.
 * @returns An instance of `BrowserIndexedDB` (sublcass of `IOHandler`),
 *   which can be used with, e.g., `tf.Model.save`.
 */
function browserIndexedDB(modelPath) {
    return new BrowserIndexedDB(modelPath);
}
function maybeStripScheme(key) {
    return key.startsWith(BrowserIndexedDB.URL_SCHEME) ?
        key.slice(BrowserIndexedDB.URL_SCHEME.length) :
        key;
}
var BrowserIndexedDBManager = /** @class */ (function () {
    function BrowserIndexedDBManager() {
        this.indexedDB = getIndexedDBFactory();
    }
    BrowserIndexedDBManager.prototype.listModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var openRequest = _this.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
                        openRequest.onupgradeneeded = function () { return setUpDatabase(openRequest); };
                        openRequest.onsuccess = function () {
                            var db = openRequest.result;
                            var tx = db.transaction(INFO_STORE_NAME, 'readonly');
                            var store = tx.objectStore(INFO_STORE_NAME);
                            // tslint:disable:max-line-length
                            // Need to cast `store` as `any` here because TypeScript's DOM
                            // library does not have the `getAll()` method even though the
                            // method is supported in the latest version of most mainstream
                            // browsers:
                            // https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/getAll
                            // tslint:enable:max-line-length
                            // tslint:disable-next-line:no-any
                            var getAllInfoRequest = store.getAll();
                            getAllInfoRequest.onsuccess = function () {
                                var out = {};
                                for (var _i = 0, _a = getAllInfoRequest.result; _i < _a.length; _i++) {
                                    var item = _a[_i];
                                    out[item.modelPath] = item.modelArtifactsInfo;
                                }
                                resolve(out);
                            };
                            getAllInfoRequest.onerror = function (error) {
                                db.close();
                                return reject(getAllInfoRequest.error);
                            };
                            tx.oncomplete = function () { return db.close(); };
                        };
                        openRequest.onerror = function (error) { return reject(openRequest.error); };
                    })];
            });
        });
    };
    BrowserIndexedDBManager.prototype.removeModel = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                path = maybeStripScheme(path);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var openRequest = _this.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
                        openRequest.onupgradeneeded = function () { return setUpDatabase(openRequest); };
                        openRequest.onsuccess = function () {
                            var db = openRequest.result;
                            var infoTx = db.transaction(INFO_STORE_NAME, 'readwrite');
                            var infoStore = infoTx.objectStore(INFO_STORE_NAME);
                            var getInfoRequest = infoStore.get(path);
                            var modelTx;
                            getInfoRequest.onsuccess = function () {
                                if (getInfoRequest.result == null) {
                                    db.close();
                                    return reject(new Error("Cannot find model with path '" + path + "' " +
                                        "in IndexedDB."));
                                }
                                else {
                                    // First, delete the entry in the info store.
                                    var deleteInfoRequest = infoStore.delete(path);
                                    var deleteModelData_1 = function () {
                                        // Second, delete the entry in the model store.
                                        modelTx = db.transaction(MODEL_STORE_NAME, 'readwrite');
                                        var modelStore = modelTx.objectStore(MODEL_STORE_NAME);
                                        var deleteModelRequest = modelStore.delete(path);
                                        deleteModelRequest.onsuccess = function () {
                                            return resolve(getInfoRequest.result.modelArtifactsInfo);
                                        };
                                        deleteModelRequest.onerror = function (error) {
                                            return reject(getInfoRequest.error);
                                        };
                                    };
                                    // Proceed with deleting model data regardless of whether deletion
                                    // of info data succeeds or not.
                                    deleteInfoRequest.onsuccess = deleteModelData_1;
                                    deleteInfoRequest.onerror = function (error) {
                                        deleteModelData_1();
                                        db.close();
                                        return reject(getInfoRequest.error);
                                    };
                                }
                            };
                            getInfoRequest.onerror = function (error) {
                                db.close();
                                return reject(getInfoRequest.error);
                            };
                            infoTx.oncomplete = function () {
                                if (modelTx == null) {
                                    db.close();
                                }
                                else {
                                    modelTx.oncomplete = function () { return db.close(); };
                                }
                            };
                        };
                        openRequest.onerror = function (error) { return reject(openRequest.error); };
                    })];
            });
        });
    };
    return BrowserIndexedDBManager;
}());

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var PATH_SEPARATOR = '/';
var PATH_PREFIX = 'tensorflowjs_models';
var INFO_SUFFIX = 'info';
var MODEL_TOPOLOGY_SUFFIX = 'model_topology';
var WEIGHT_SPECS_SUFFIX = 'weight_specs';
var WEIGHT_DATA_SUFFIX = 'weight_data';
var MODEL_METADATA_SUFFIX = 'model_metadata';
function getModelKeys(path) {
    return {
        info: [PATH_PREFIX, path, INFO_SUFFIX].join(PATH_SEPARATOR),
        topology: [PATH_PREFIX, path, MODEL_TOPOLOGY_SUFFIX].join(PATH_SEPARATOR),
        weightSpecs: [PATH_PREFIX, path, WEIGHT_SPECS_SUFFIX].join(PATH_SEPARATOR),
        weightData: [PATH_PREFIX, path, WEIGHT_DATA_SUFFIX].join(PATH_SEPARATOR),
        modelMetadata: [PATH_PREFIX, path, MODEL_METADATA_SUFFIX].join(PATH_SEPARATOR)
    };
}
/**
 * Get model path from a local-storage key.
 *
 * E.g., 'tensorflowjs_models/my/model/1/info' --> 'my/model/1'
 *
 * @param key
 */
function getModelPathFromKey(key) {
    var items = key.split(PATH_SEPARATOR);
    if (items.length < 3) {
        throw new Error("Invalid key format: " + key);
    }
    return items.slice(1, items.length - 1).join(PATH_SEPARATOR);
}
function maybeStripScheme$1(key) {
    return key.startsWith(BrowserLocalStorage.URL_SCHEME) ?
        key.slice(BrowserLocalStorage.URL_SCHEME.length) :
        key;
}
/**
 * IOHandler subclass: Browser Local Storage.
 *
 * See the doc string to `browserLocalStorage` for more details.
 */
var BrowserLocalStorage = /** @class */ (function () {
    function BrowserLocalStorage(modelPath) {
        if (!env().getBool('IS_BROWSER') || typeof window === 'undefined' ||
            typeof window.localStorage === 'undefined') {
            // TODO(cais): Add more info about what IOHandler subtypes are
            // available.
            //   Maybe point to a doc page on the web and/or automatically determine
            //   the available IOHandlers and print them in the error message.
            throw new Error('The current environment does not support local storage.');
        }
        this.LS = window.localStorage;
        if (modelPath == null || !modelPath) {
            throw new Error('For local storage, modelPath must not be null, undefined or empty.');
        }
        this.modelPath = modelPath;
        this.keys = getModelKeys(this.modelPath);
    }
    /**
     * Save model artifacts to browser local storage.
     *
     * See the documentation to `browserLocalStorage` for details on the saved
     * artifacts.
     *
     * @param modelArtifacts The model artifacts to be stored.
     * @returns An instance of SaveResult.
     */
    BrowserLocalStorage.prototype.save = function (modelArtifacts) {
        return __awaiter(this, void 0, void 0, function () {
            var topology, weightSpecs, modelArtifactsInfo, result;
            return __generator(this, function (_a) {
                if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
                    throw new Error('BrowserLocalStorage.save() does not support saving model topology ' +
                        'in binary formats yet.');
                }
                else {
                    topology = JSON.stringify(modelArtifacts.modelTopology);
                    weightSpecs = JSON.stringify(modelArtifacts.weightSpecs);
                    modelArtifactsInfo = getModelArtifactsInfoForJSON(modelArtifacts);
                    try {
                        this.LS.setItem(this.keys.info, JSON.stringify(modelArtifactsInfo));
                        this.LS.setItem(this.keys.topology, topology);
                        this.LS.setItem(this.keys.weightSpecs, weightSpecs);
                        this.LS.setItem(this.keys.weightData, arrayBufferToBase64String(modelArtifacts.weightData));
                        result = {
                            format: modelArtifacts.format,
                            generatedBy: modelArtifacts.generatedBy,
                            convertedBy: modelArtifacts.convertedBy
                        };
                        if (modelArtifacts.signature != null) {
                            result.signature = modelArtifacts.signature;
                        }
                        if (modelArtifacts.userDefinedMetadata != null) {
                            result.userDefinedMetadata = modelArtifacts.userDefinedMetadata;
                        }
                        if (modelArtifacts.modelInitializer != null) {
                            result.modelInitializer = modelArtifacts.modelInitializer;
                        }
                        this.LS.setItem(this.keys.modelMetadata, JSON.stringify(result));
                        return [2 /*return*/, { modelArtifactsInfo: modelArtifactsInfo }];
                    }
                    catch (err) {
                        // If saving failed, clean up all items saved so far.
                        this.LS.removeItem(this.keys.info);
                        this.LS.removeItem(this.keys.topology);
                        this.LS.removeItem(this.keys.weightSpecs);
                        this.LS.removeItem(this.keys.weightData);
                        this.LS.removeItem(this.keys.modelMetadata);
                        throw new Error("Failed to save model '" + this.modelPath + "' to local storage: " +
                            "size quota being exceeded is a possible cause of this failure: " +
                            ("modelTopologyBytes=" + modelArtifactsInfo.modelTopologyBytes + ", ") +
                            ("weightSpecsBytes=" + modelArtifactsInfo.weightSpecsBytes + ", ") +
                            ("weightDataBytes=" + modelArtifactsInfo.weightDataBytes + "."));
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Load a model from local storage.
     *
     * See the documentation to `browserLocalStorage` for details on the saved
     * artifacts.
     *
     * @returns The loaded model (if loading succeeds).
     */
    BrowserLocalStorage.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var info, out, topology, weightSpecs, metadataString, metadata, weightDataBase64;
            return __generator(this, function (_a) {
                info = JSON.parse(this.LS.getItem(this.keys.info));
                if (info == null) {
                    throw new Error("In local storage, there is no model with name '" + this.modelPath + "'");
                }
                if (info.modelTopologyType !== 'JSON') {
                    throw new Error('BrowserLocalStorage does not support loading non-JSON model ' +
                        'topology yet.');
                }
                out = {};
                topology = JSON.parse(this.LS.getItem(this.keys.topology));
                if (topology == null) {
                    throw new Error("In local storage, the topology of model '" + this.modelPath + "' " +
                        "is missing.");
                }
                out.modelTopology = topology;
                weightSpecs = JSON.parse(this.LS.getItem(this.keys.weightSpecs));
                if (weightSpecs == null) {
                    throw new Error("In local storage, the weight specs of model '" + this.modelPath + "' " +
                        "are missing.");
                }
                out.weightSpecs = weightSpecs;
                metadataString = this.LS.getItem(this.keys.modelMetadata);
                if (metadataString != null) {
                    metadata = JSON.parse(metadataString);
                    out.format = metadata['format'];
                    out.generatedBy = metadata['generatedBy'];
                    out.convertedBy = metadata['convertedBy'];
                    if (metadata['signature'] != null) {
                        out.signature = metadata['signature'];
                    }
                    if (metadata['userDefinedMetadata'] != null) {
                        out.userDefinedMetadata = metadata['userDefinedMetadata'];
                    }
                    if (metadata['modelInitializer'] != null) {
                        out.modelInitializer = metadata['modelInitializer'];
                    }
                }
                weightDataBase64 = this.LS.getItem(this.keys.weightData);
                if (weightDataBase64 == null) {
                    throw new Error("In local storage, the binary weight values of model " +
                        ("'" + this.modelPath + "' are missing."));
                }
                out.weightData = base64StringToArrayBuffer(weightDataBase64);
                return [2 /*return*/, out];
            });
        });
    };
    BrowserLocalStorage.URL_SCHEME = 'localstorage://';
    return BrowserLocalStorage;
}());
var localStorageRouter = function (url) {
    if (!env().getBool('IS_BROWSER')) {
        return null;
    }
    else {
        if (!Array.isArray(url) && url.startsWith(BrowserLocalStorage.URL_SCHEME)) {
            return browserLocalStorage(url.slice(BrowserLocalStorage.URL_SCHEME.length));
        }
        else {
            return null;
        }
    }
};
IORouterRegistry.registerSaveRouter(localStorageRouter);
IORouterRegistry.registerLoadRouter(localStorageRouter);
/**
 * Factory function for local storage IOHandler.
 *
 * This `IOHandler` supports both `save` and `load`.
 *
 * For each model's saved artifacts, four items are saved to local storage.
 *   - `${PATH_SEPARATOR}/${modelPath}/info`: Contains meta-info about the
 *     model, such as date saved, type of the topology, size in bytes, etc.
 *   - `${PATH_SEPARATOR}/${modelPath}/topology`: Model topology. For Keras-
 *     style models, this is a stringized JSON.
 *   - `${PATH_SEPARATOR}/${modelPath}/weight_specs`: Weight specs of the
 *     model, can be used to decode the saved binary weight values (see
 *     item below).
 *   - `${PATH_SEPARATOR}/${modelPath}/weight_data`: Concatenated binary
 *     weight values, stored as a base64-encoded string.
 *
 * Saving may throw an `Error` if the total size of the artifacts exceed the
 * browser-specific quota.
 *
 * @param modelPath A unique identifier for the model to be saved. Must be a
 *   non-empty string.
 * @returns An instance of `IOHandler`, which can be used with, e.g.,
 *   `tf.Model.save`.
 */
function browserLocalStorage(modelPath) {
    return new BrowserLocalStorage(modelPath);
}
var BrowserLocalStorageManager = /** @class */ (function () {
    function BrowserLocalStorageManager() {
        assert(env().getBool('IS_BROWSER'), function () { return 'Current environment is not a web browser'; });
        assert(typeof window === 'undefined' ||
            typeof window.localStorage !== 'undefined', function () { return 'Current browser does not appear to support localStorage'; });
        this.LS = window.localStorage;
    }
    BrowserLocalStorageManager.prototype.listModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var out, prefix, suffix, i, key, modelPath;
            return __generator(this, function (_a) {
                out = {};
                prefix = PATH_PREFIX + PATH_SEPARATOR;
                suffix = PATH_SEPARATOR + INFO_SUFFIX;
                for (i = 0; i < this.LS.length; ++i) {
                    key = this.LS.key(i);
                    if (key.startsWith(prefix) && key.endsWith(suffix)) {
                        modelPath = getModelPathFromKey(key);
                        out[modelPath] = JSON.parse(this.LS.getItem(key));
                    }
                }
                return [2 /*return*/, out];
            });
        });
    };
    BrowserLocalStorageManager.prototype.removeModel = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, info;
            return __generator(this, function (_a) {
                path = maybeStripScheme$1(path);
                keys = getModelKeys(path);
                if (this.LS.getItem(keys.info) == null) {
                    throw new Error("Cannot find model at path '" + path + "'");
                }
                info = JSON.parse(this.LS.getItem(keys.info));
                this.LS.removeItem(keys.info);
                this.LS.removeItem(keys.topology);
                this.LS.removeItem(keys.weightSpecs);
                this.LS.removeItem(keys.weightData);
                return [2 /*return*/, info];
            });
        });
    };
    return BrowserLocalStorageManager;
}());

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var URL_SCHEME_SUFFIX = '://';
var ModelStoreManagerRegistry = /** @class */ (function () {
    function ModelStoreManagerRegistry() {
        this.managers = {};
    }
    ModelStoreManagerRegistry.getInstance = function () {
        if (ModelStoreManagerRegistry.instance == null) {
            ModelStoreManagerRegistry.instance = new ModelStoreManagerRegistry();
        }
        return ModelStoreManagerRegistry.instance;
    };
    /**
     * Register a save-handler router.
     *
     * @param saveRouter A function that maps a URL-like string onto an instance
     * of `IOHandler` with the `save` method defined or `null`.
     */
    ModelStoreManagerRegistry.registerManager = function (scheme, manager) {
        assert(scheme != null, function () { return 'scheme must not be undefined or null.'; });
        if (scheme.endsWith(URL_SCHEME_SUFFIX)) {
            scheme = scheme.slice(0, scheme.indexOf(URL_SCHEME_SUFFIX));
        }
        assert(scheme.length > 0, function () { return 'scheme must not be an empty string.'; });
        var registry = ModelStoreManagerRegistry.getInstance();
        assert(registry.managers[scheme] == null, function () { return "A model store manager is already registered for scheme '" + scheme + "'."; });
        registry.managers[scheme] = manager;
    };
    ModelStoreManagerRegistry.getManager = function (scheme) {
        var manager = this.getInstance().managers[scheme];
        if (manager == null) {
            throw new Error("Cannot find model manager for scheme '" + scheme + "'");
        }
        return manager;
    };
    ModelStoreManagerRegistry.getSchemes = function () {
        return Object.keys(this.getInstance().managers);
    };
    return ModelStoreManagerRegistry;
}());
/**
 * Helper method for parsing a URL string into a scheme and a path.
 *
 * @param url E.g., 'localstorage://my-model'
 * @returns A dictionary with two fields: scheme and path.
 *   Scheme: e.g., 'localstorage' in the example above.
 *   Path: e.g., 'my-model' in the example above.
 */
function parseURL(url) {
    if (url.indexOf(URL_SCHEME_SUFFIX) === -1) {
        throw new Error("The url string provided does not contain a scheme. " +
            "Supported schemes are: " +
            ("" + ModelStoreManagerRegistry.getSchemes().join(',')));
    }
    return {
        scheme: url.split(URL_SCHEME_SUFFIX)[0],
        path: url.split(URL_SCHEME_SUFFIX)[1],
    };
}
function cloneModelInternal(sourceURL, destURL, deleteSource) {
    if (deleteSource === void 0) { deleteSource = false; }
    return __awaiter(this, void 0, void 0, function () {
        var loadHandlers, loadHandler, saveHandlers, saveHandler, sourceScheme, sourcePath, sameMedium, modelArtifacts, saveResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assert(sourceURL !== destURL, function () { return "Old path and new path are the same: '" + sourceURL + "'"; });
                    loadHandlers = IORouterRegistry.getLoadHandlers(sourceURL);
                    assert(loadHandlers.length > 0, function () { return "Copying failed because no load handler is found for source URL " + sourceURL + "."; });
                    assert(loadHandlers.length < 2, function () { return "Copying failed because more than one (" + loadHandlers.length + ") " +
                        ("load handlers for source URL " + sourceURL + "."); });
                    loadHandler = loadHandlers[0];
                    saveHandlers = IORouterRegistry.getSaveHandlers(destURL);
                    assert(saveHandlers.length > 0, function () { return "Copying failed because no save handler is found for destination " +
                        ("URL " + destURL + "."); });
                    assert(saveHandlers.length < 2, function () { return "Copying failed because more than one (" + loadHandlers.length + ") " +
                        ("save handlers for destination URL " + destURL + "."); });
                    saveHandler = saveHandlers[0];
                    sourceScheme = parseURL(sourceURL).scheme;
                    sourcePath = parseURL(sourceURL).path;
                    sameMedium = sourceScheme === parseURL(sourceURL).scheme;
                    return [4 /*yield*/, loadHandler.load()];
                case 1:
                    modelArtifacts = _a.sent();
                    if (!(deleteSource && sameMedium)) return [3 /*break*/, 3];
                    return [4 /*yield*/, ModelStoreManagerRegistry.getManager(sourceScheme)
                            .removeModel(sourcePath)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, saveHandler.save(modelArtifacts)];
                case 4:
                    saveResult = _a.sent();
                    if (!(deleteSource && !sameMedium)) return [3 /*break*/, 6];
                    return [4 /*yield*/, ModelStoreManagerRegistry.getManager(sourceScheme)
                            .removeModel(sourcePath)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/, saveResult.modelArtifactsInfo];
            }
        });
    });
}
/**
 * List all models stored in registered storage mediums.
 *
 * For a web browser environment, the registered mediums are Local Storage and
 * IndexedDB.
 *
 * ```js
 * // First create and save a model.
 * const model = tf.sequential();
 * model.add(tf.layers.dense(
 *     {units: 1, inputShape: [10], activation: 'sigmoid'}));
 * await model.save('localstorage://demo/management/model1');
 *
 * // Then list existing models.
 * console.log(JSON.stringify(await tf.io.listModels()));
 *
 * // Delete the model.
 * await tf.io.removeModel('localstorage://demo/management/model1');
 *
 * // List models again.
 * console.log(JSON.stringify(await tf.io.listModels()));
 * ```
 *
 * @returns A `Promise` of a dictionary mapping URLs of existing models to
 * their model artifacts info. URLs include medium-specific schemes, e.g.,
 *   'indexeddb://my/model/1'. Model artifacts info include type of the
 * model's topology, byte sizes of the topology, weights, etc.
 *
 * @doc {
 *   heading: 'Models',
 *   subheading: 'Management',
 *   namespace: 'io',
 *   ignoreCI: true
 * }
 */
function listModels() {
    return __awaiter(this, void 0, void 0, function () {
        var schemes, out, _i, schemes_1, scheme, schemeOut, path, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    schemes = ModelStoreManagerRegistry.getSchemes();
                    out = {};
                    _i = 0, schemes_1 = schemes;
                    _a.label = 1;
                case 1:
                    if (!(_i < schemes_1.length)) return [3 /*break*/, 4];
                    scheme = schemes_1[_i];
                    return [4 /*yield*/, ModelStoreManagerRegistry.getManager(scheme).listModels()];
                case 2:
                    schemeOut = _a.sent();
                    for (path in schemeOut) {
                        url = scheme + URL_SCHEME_SUFFIX + path;
                        out[url] = schemeOut[path];
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, out];
            }
        });
    });
}
/**
 * Remove a model specified by URL from a reigstered storage medium.
 *
 * ```js
 * // First create and save a model.
 * const model = tf.sequential();
 * model.add(tf.layers.dense(
 *     {units: 1, inputShape: [10], activation: 'sigmoid'}));
 * await model.save('localstorage://demo/management/model1');
 *
 * // Then list existing models.
 * console.log(JSON.stringify(await tf.io.listModels()));
 *
 * // Delete the model.
 * await tf.io.removeModel('localstorage://demo/management/model1');
 *
 * // List models again.
 * console.log(JSON.stringify(await tf.io.listModels()));
 * ```
 *
 * @param url A URL to a stored model, with a scheme prefix, e.g.,
 *   'localstorage://my-model-1', 'indexeddb://my/model/2'.
 * @returns ModelArtifactsInfo of the deleted model (if and only if deletion
 *   is successful).
 * @throws Error if deletion fails, e.g., if no model exists at `path`.
 *
 * @doc {
 *   heading: 'Models',
 *   subheading: 'Management',
 *   namespace: 'io',
 *   ignoreCI: true
 * }
 */
function removeModel(url) {
    return __awaiter(this, void 0, void 0, function () {
        var schemeAndPath, manager;
        return __generator(this, function (_a) {
            schemeAndPath = parseURL(url);
            manager = ModelStoreManagerRegistry.getManager(schemeAndPath.scheme);
            return [2 /*return*/, manager.removeModel(schemeAndPath.path)];
        });
    });
}
/**
 * Copy a model from one URL to another.
 *
 * This function supports:
 *
 * 1. Copying within a storage medium, e.g.,
 *    `tf.io.copyModel('localstorage://model-1', 'localstorage://model-2')`
 * 2. Copying between two storage mediums, e.g.,
 *    `tf.io.copyModel('localstorage://model-1', 'indexeddb://model-1')`
 *
 * ```js
 * // First create and save a model.
 * const model = tf.sequential();
 * model.add(tf.layers.dense(
 *     {units: 1, inputShape: [10], activation: 'sigmoid'}));
 * await model.save('localstorage://demo/management/model1');
 *
 * // Then list existing models.
 * console.log(JSON.stringify(await tf.io.listModels()));
 *
 * // Copy the model, from Local Storage to IndexedDB.
 * await tf.io.copyModel(
 *     'localstorage://demo/management/model1',
 *     'indexeddb://demo/management/model1');
 *
 * // List models again.
 * console.log(JSON.stringify(await tf.io.listModels()));
 *
 * // Remove both models.
 * await tf.io.removeModel('localstorage://demo/management/model1');
 * await tf.io.removeModel('indexeddb://demo/management/model1');
 * ```
 *
 * @param sourceURL Source URL of copying.
 * @param destURL Destination URL of copying.
 * @returns ModelArtifactsInfo of the copied model (if and only if copying
 *   is successful).
 * @throws Error if copying fails, e.g., if no model exists at `sourceURL`, or
 *   if `oldPath` and `newPath` are identical.
 *
 * @doc {
 *   heading: 'Models',
 *   subheading: 'Management',
 *   namespace: 'io',
 *   ignoreCI: true
 * }
 */
function copyModel(sourceURL, destURL) {
    return __awaiter(this, void 0, void 0, function () {
        var deleteSource;
        return __generator(this, function (_a) {
            deleteSource = false;
            return [2 /*return*/, cloneModelInternal(sourceURL, destURL, deleteSource)];
        });
    });
}
/**
 * Move a model from one URL to another.
 *
 * This function supports:
 *
 * 1. Moving within a storage medium, e.g.,
 *    `tf.io.moveModel('localstorage://model-1', 'localstorage://model-2')`
 * 2. Moving between two storage mediums, e.g.,
 *    `tf.io.moveModel('localstorage://model-1', 'indexeddb://model-1')`
 *
 * ```js
 * // First create and save a model.
 * const model = tf.sequential();
 * model.add(tf.layers.dense(
 *     {units: 1, inputShape: [10], activation: 'sigmoid'}));
 * await model.save('localstorage://demo/management/model1');
 *
 * // Then list existing models.
 * console.log(JSON.stringify(await tf.io.listModels()));
 *
 * // Move the model, from Local Storage to IndexedDB.
 * await tf.io.moveModel(
 *     'localstorage://demo/management/model1',
 *     'indexeddb://demo/management/model1');
 *
 * // List models again.
 * console.log(JSON.stringify(await tf.io.listModels()));
 *
 * // Remove the moved model.
 * await tf.io.removeModel('indexeddb://demo/management/model1');
 * ```
 *
 * @param sourceURL Source URL of moving.
 * @param destURL Destination URL of moving.
 * @returns ModelArtifactsInfo of the copied model (if and only if copying
 *   is successful).
 * @throws Error if moving fails, e.g., if no model exists at `sourceURL`, or
 *   if `oldPath` and `newPath` are identical.
 *
 * @doc {
 *   heading: 'Models',
 *   subheading: 'Management',
 *   namespace: 'io',
 *   ignoreCI: true
 * }
 */
function moveModel(sourceURL, destURL) {
    return __awaiter(this, void 0, void 0, function () {
        var deleteSource;
        return __generator(this, function (_a) {
            deleteSource = true;
            return [2 /*return*/, cloneModelInternal(sourceURL, destURL, deleteSource)];
        });
    });
}

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var PlatformBrowser = /** @class */ (function () {
    function PlatformBrowser() {
    }
    PlatformBrowser.prototype.fetch = function (path, init) {
        return fetch(path, init);
    };
    PlatformBrowser.prototype.now = function () {
        return performance.now();
    };
    PlatformBrowser.prototype.encode = function (text, encoding) {
        if (encoding !== 'utf-8' && encoding !== 'utf8') {
            throw new Error("Browser's encoder only supports utf-8, but got " + encoding);
        }
        if (this.textEncoder == null) {
            this.textEncoder = new TextEncoder();
        }
        return this.textEncoder.encode(text);
    };
    PlatformBrowser.prototype.decode = function (bytes, encoding) {
        return new TextDecoder(encoding).decode(bytes);
    };
    return PlatformBrowser;
}());
if (env().get('IS_BROWSER')) {
    env().setPlatform('browser', new PlatformBrowser());
    // Register LocalStorage IOHandler
    try {
        ModelStoreManagerRegistry.registerManager(BrowserLocalStorage.URL_SCHEME, new BrowserLocalStorageManager());
    }
    catch (err) {
    }
    // Register IndexedDB IOHandler
    try {
        ModelStoreManagerRegistry.registerManager(BrowserIndexedDB.URL_SCHEME, new BrowserIndexedDBManager());
    }
    catch (err) {
    }
}

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// We are wrapping this within an object so it can be stubbed by Jasmine.
var getNodeFetch = {
    // tslint:disable-next-line:no-require-imports
    importFetch: function () { return require('node-fetch'); }
};
var systemFetch;
var PlatformNode = /** @class */ (function () {
    function PlatformNode() {
        // tslint:disable-next-line:no-require-imports
        this.util = require('util');
        // According to the spec, the built-in encoder can do only UTF-8 encoding.
        // https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/TextEncoder
        this.textEncoder = new this.util.TextEncoder();
    }
    PlatformNode.prototype.fetch = function (path, requestInits) {
        if (env().global.fetch != null) {
            return env().global.fetch(path, requestInits);
        }
        if (systemFetch == null) {
            systemFetch = getNodeFetch.importFetch();
        }
        return systemFetch(path, requestInits);
    };
    PlatformNode.prototype.now = function () {
        var time = process.hrtime();
        return time[0] * 1000 + time[1] / 1000000;
    };
    PlatformNode.prototype.encode = function (text, encoding) {
        if (encoding !== 'utf-8' && encoding !== 'utf8') {
            throw new Error("Node built-in encoder only supports utf-8, but got " + encoding);
        }
        return this.textEncoder.encode(text);
    };
    PlatformNode.prototype.decode = function (bytes, encoding) {
        if (bytes.length === 0) {
            return '';
        }
        return new this.util.TextDecoder(encoding).decode(bytes);
    };
    return PlatformNode;
}());
if (env().get('IS_NODE')) {
    env().setPlatform('node', new PlatformNode());
}

/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Creates an empty `tf.TensorBuffer` with the specified `shape` and `dtype`.
 *
 * The values are stored in CPU as `TypedArray`. Fill the buffer using
 * `buffer.set()`, or by modifying directly `buffer.values`.
 *
 * When done, call `buffer.toTensor()` to get an immutable `tf.Tensor` with
 * those values.
 *
 * ```js
 * // Create a buffer and set values at particular indices.
 * const buffer = tf.buffer([2, 2]);
 * buffer.set(3, 0, 0);
 * buffer.set(5, 1, 0);
 *
 * // Convert the buffer back to a tensor.
 * buffer.toTensor().print();
 * ```
 *
 * @param shape An array of integers defining the output tensor shape.
 * @param dtype The dtype of the buffer. Defaults to 'float32'.
 * @param values The values of the buffer as `TypedArray`. Defaults to
 * zeros.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
function buffer(shape, dtype, values) {
    if (dtype === void 0) { dtype = 'float32'; }
    dtype = dtype || 'float32';
    assertNonNegativeIntegerDimensions(shape);
    return new TensorBuffer(shape, dtype, values);
}

/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Casts a `tf.Tensor` to a new dtype.
 *
 * ```js
 * const x = tf.tensor1d([1.5, 2.5, 3]);
 * tf.cast(x, 'int32').print();
 * ```
 * @param x The input tensor to be casted.
 * @param dtype The dtype to cast the input tensor to.
 *
 * @doc {heading: 'Tensors', subheading: 'Transformations'}
 */
function cast_(x, dtype) {
    var $x = convertToTensor(x, 'x', 'cast');
    // Sanity checks.
    if (!isValidDtype(dtype)) {
        throw new Error("Failed to cast to unknown dtype " + dtype);
    }
    if (dtype === 'string' && $x.dtype !== 'string' ||
        dtype !== 'string' && $x.dtype === 'string') {
        throw new Error('Only strings can be casted to strings');
    }
    var inputs = { x: $x };
    var attrs = { dtype: dtype };
    return ENGINE.runKernel(Cast, inputs, attrs);
}
var cast = op({ cast_: cast_ });

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Creates a new tensor with the same values and shape as the specified
 * tensor.
 *
 * ```js
 * const x = tf.tensor([1, 2]);
 *
 * x.clone().print();
 * ```
 *
 * @param x The tensor to clone.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
function clone_(x) {
    var $x = convertToTensor(x, 'x', 'clone', 'string_or_numeric');
    var inputs = { x: $x };
    // Note this op is called tf.identity in python. Hence the kernel name used
    // here.
    return ENGINE.runKernel(Identity, inputs);
}
var clone = op({ clone_: clone_ });

/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Prints information about the `tf.Tensor` including its data.
 *
 * ```js
 * const verbose = true;
 * tf.tensor2d([1, 2, 3, 4], [2, 2]).print(verbose);
 * ```
 * @param x The tensor to be printed.
 * @param verbose Whether to print verbose information about the ` Tensor`,
 * including dtype and size.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
function print(x, verbose) {
    if (verbose === void 0) { verbose = false; }
    console.log(x.toString(verbose));
}

/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
getOrMakeEngine();
var opHandler$1 = {
    buffer: buffer,
    cast: cast,
    clone: clone,
    print: print
};
setOpHandler(opHandler$1);

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var DEFAULT_FILE_NAME_PREFIX = 'model';
var DEFAULT_JSON_EXTENSION_NAME = '.json';
var DEFAULT_WEIGHT_DATA_EXTENSION_NAME = '.weights.bin';
function defer(f) {
    return new Promise(function (resolve) { return setTimeout(resolve); }).then(f);
}
var BrowserDownloads = /** @class */ (function () {
    function BrowserDownloads(fileNamePrefix) {
        if (!env().getBool('IS_BROWSER')) {
            // TODO(cais): Provide info on what IOHandlers are available under the
            //   current environment.
            throw new Error('browserDownloads() cannot proceed because the current environment ' +
                'is not a browser.');
        }
        if (fileNamePrefix.startsWith(BrowserDownloads.URL_SCHEME)) {
            fileNamePrefix = fileNamePrefix.slice(BrowserDownloads.URL_SCHEME.length);
        }
        if (fileNamePrefix == null || fileNamePrefix.length === 0) {
            fileNamePrefix = DEFAULT_FILE_NAME_PREFIX;
        }
        this.modelTopologyFileName = fileNamePrefix + DEFAULT_JSON_EXTENSION_NAME;
        this.weightDataFileName =
            fileNamePrefix + DEFAULT_WEIGHT_DATA_EXTENSION_NAME;
    }
    BrowserDownloads.prototype.save = function (modelArtifacts) {
        return __awaiter(this, void 0, void 0, function () {
            var weightsURL, weightsManifest, modelTopologyAndWeightManifest, modelTopologyAndWeightManifestURL, jsonAnchor_1, weightDataAnchor_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof (document) === 'undefined') {
                            throw new Error('Browser downloads are not supported in ' +
                                'this environment since `document` is not present');
                        }
                        weightsURL = window.URL.createObjectURL(new Blob([modelArtifacts.weightData], { type: 'application/octet-stream' }));
                        if (!(modelArtifacts.modelTopology instanceof ArrayBuffer)) return [3 /*break*/, 1];
                        throw new Error('BrowserDownloads.save() does not support saving model topology ' +
                            'in binary formats yet.');
                    case 1:
                        weightsManifest = [{
                                paths: ['./' + this.weightDataFileName],
                                weights: modelArtifacts.weightSpecs
                            }];
                        modelTopologyAndWeightManifest = {
                            modelTopology: modelArtifacts.modelTopology,
                            format: modelArtifacts.format,
                            generatedBy: modelArtifacts.generatedBy,
                            convertedBy: modelArtifacts.convertedBy,
                            weightsManifest: weightsManifest
                        };
                        if (modelArtifacts.signature != null) {
                            modelTopologyAndWeightManifest.signature = modelArtifacts.signature;
                        }
                        if (modelArtifacts.userDefinedMetadata != null) {
                            modelTopologyAndWeightManifest.userDefinedMetadata =
                                modelArtifacts.userDefinedMetadata;
                        }
                        if (modelArtifacts.modelInitializer != null) {
                            modelTopologyAndWeightManifest.modelInitializer =
                                modelArtifacts.modelInitializer;
                        }
                        modelTopologyAndWeightManifestURL = window.URL.createObjectURL(new Blob([JSON.stringify(modelTopologyAndWeightManifest)], { type: 'application/json' }));
                        jsonAnchor_1 = this.jsonAnchor == null ? document.createElement('a') :
                            this.jsonAnchor;
                        jsonAnchor_1.download = this.modelTopologyFileName;
                        jsonAnchor_1.href = modelTopologyAndWeightManifestURL;
                        // Trigger downloads by evoking a click event on the download anchors.
                        // When multiple downloads are started synchronously, Firefox will only
                        // save the last one.
                        return [4 /*yield*/, defer(function () { return jsonAnchor_1.dispatchEvent(new MouseEvent('click')); })];
                    case 2:
                        // Trigger downloads by evoking a click event on the download anchors.
                        // When multiple downloads are started synchronously, Firefox will only
                        // save the last one.
                        _a.sent();
                        if (!(modelArtifacts.weightData != null)) return [3 /*break*/, 4];
                        weightDataAnchor_1 = this.weightDataAnchor == null ?
                            document.createElement('a') :
                            this.weightDataAnchor;
                        weightDataAnchor_1.download = this.weightDataFileName;
                        weightDataAnchor_1.href = weightsURL;
                        return [4 /*yield*/, defer(function () { return weightDataAnchor_1.dispatchEvent(new MouseEvent('click')); })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, { modelArtifactsInfo: getModelArtifactsInfoForJSON(modelArtifacts) }];
                }
            });
        });
    };
    BrowserDownloads.URL_SCHEME = 'downloads://';
    return BrowserDownloads;
}());
var BrowserFiles = /** @class */ (function () {
    function BrowserFiles(files) {
        if (files == null || files.length < 1) {
            throw new Error("When calling browserFiles, at least 1 file is required, " +
                ("but received " + files));
        }
        this.files = files;
    }
    BrowserFiles.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var jsonFile, weightFiles;
            var _this = this;
            return __generator(this, function (_a) {
                jsonFile = this.files[0];
                weightFiles = this.files.slice(1);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var jsonReader = new FileReader();
                        jsonReader.onload = function (event) {
                            // tslint:disable-next-line:no-any
                            var modelJSON = JSON.parse(event.target.result);
                            var modelTopology = modelJSON.modelTopology;
                            if (modelTopology == null) {
                                reject(new Error("modelTopology field is missing from file " + jsonFile.name));
                                return;
                            }
                            if (weightFiles.length === 0) {
                                resolve({ modelTopology: modelTopology });
                            }
                            var weightsManifest = modelJSON.weightsManifest;
                            if (weightsManifest == null) {
                                reject(new Error("weightManifest field is missing from file " + jsonFile.name));
                                return;
                            }
                            var pathToFile;
                            try {
                                pathToFile =
                                    _this.checkManifestAndWeightFiles(weightsManifest, weightFiles);
                            }
                            catch (err) {
                                reject(err);
                                return;
                            }
                            var weightSpecs = [];
                            var paths = [];
                            var perFileBuffers = [];
                            weightsManifest.forEach(function (weightsGroup) {
                                weightsGroup.paths.forEach(function (path) {
                                    paths.push(path);
                                    perFileBuffers.push(null);
                                });
                                weightSpecs.push.apply(weightSpecs, weightsGroup.weights);
                            });
                            weightsManifest.forEach(function (weightsGroup) {
                                weightsGroup.paths.forEach(function (path) {
                                    var weightFileReader = new FileReader();
                                    weightFileReader.onload = function (event) {
                                        // tslint:disable-next-line:no-any
                                        var weightData = event.target.result;
                                        var index = paths.indexOf(path);
                                        perFileBuffers[index] = weightData;
                                        if (perFileBuffers.indexOf(null) === -1) {
                                            var result = {
                                                modelTopology: modelTopology,
                                                weightSpecs: weightSpecs,
                                                weightData: concatenateArrayBuffers(perFileBuffers),
                                                format: modelJSON.format,
                                                generatedBy: modelJSON.generatedBy,
                                                convertedBy: modelJSON.convertedBy
                                            };
                                            if (modelJSON.signature != null) {
                                                result.signature = modelJSON.signature;
                                            }
                                            if (modelJSON.userDefinedMetadata != null) {
                                                result.userDefinedMetadata = modelJSON.userDefinedMetadata;
                                            }
                                            if (modelJSON.modelInitializer != null) {
                                                result.modelInitializer = modelJSON.modelInitializer;
                                            }
                                            resolve(result);
                                        }
                                    };
                                    weightFileReader.onerror = function (error) {
                                        return reject("Failed to weights data from file of path '" + path + "'.");
                                    };
                                    weightFileReader.readAsArrayBuffer(pathToFile[path]);
                                });
                            });
                        };
                        jsonReader.onerror = function (error) { return reject("Failed to read model topology and weights manifest JSON " +
                            ("from file '" + jsonFile.name + "'. BrowserFiles supports loading ") +
                            "Keras-style tf.Model artifacts only."); };
                        jsonReader.readAsText(jsonFile);
                    })];
            });
        });
    };
    /**
     * Check the compatibility between weights manifest and weight files.
     */
    BrowserFiles.prototype.checkManifestAndWeightFiles = function (manifest, files) {
        var basenames = [];
        var fileNames = files.map(function (file) { return basename(file.name); });
        var pathToFile = {};
        for (var _i = 0, manifest_1 = manifest; _i < manifest_1.length; _i++) {
            var group = manifest_1[_i];
            group.paths.forEach(function (path) {
                var pathBasename = basename(path);
                if (basenames.indexOf(pathBasename) !== -1) {
                    throw new Error("Duplicate file basename found in weights manifest: " +
                        ("'" + pathBasename + "'"));
                }
                basenames.push(pathBasename);
                if (fileNames.indexOf(pathBasename) === -1) {
                    throw new Error("Weight file with basename '" + pathBasename + "' is not provided.");
                }
                else {
                    pathToFile[path] = files[fileNames.indexOf(pathBasename)];
                }
            });
        }
        if (basenames.length !== files.length) {
            throw new Error("Mismatch in the number of files in weights manifest " +
                ("(" + basenames.length + ") and the number of weight files provided ") +
                ("(" + files.length + ")."));
        }
        return pathToFile;
    };
    return BrowserFiles;
}());
var browserDownloadsRouter = function (url) {
    if (!env().getBool('IS_BROWSER')) {
        return null;
    }
    else {
        if (!Array.isArray(url) && url.startsWith(BrowserDownloads.URL_SCHEME)) {
            return browserDownloads(url.slice(BrowserDownloads.URL_SCHEME.length));
        }
        else {
            return null;
        }
    }
};
IORouterRegistry.registerSaveRouter(browserDownloadsRouter);
/**
 * Creates an IOHandler that triggers file downloads from the browser.
 *
 * The returned `IOHandler` instance can be used as model exporting methods such
 * as `tf.Model.save` and supports only saving.
 *
 * ```js
 * const model = tf.sequential();
 * model.add(tf.layers.dense(
 *     {units: 1, inputShape: [10], activation: 'sigmoid'}));
 * const saveResult = await model.save('downloads://mymodel');
 * // This will trigger downloading of two files:
 * //   'mymodel.json' and 'mymodel.weights.bin'.
 * console.log(saveResult);
 * ```
 *
 * @param fileNamePrefix Prefix name of the files to be downloaded. For use with
 *   `tf.Model`, `fileNamePrefix` should follow either of the following two
 *   formats:
 *   1. `null` or `undefined`, in which case the default file
 *      names will be used:
 *      - 'model.json' for the JSON file containing the model topology and
 *        weights manifest.
 *      - 'model.weights.bin' for the binary file containing the binary weight
 *        values.
 *   2. A single string or an Array of a single string, as the file name prefix.
 *      For example, if `'foo'` is provided, the downloaded JSON
 *      file and binary weights file will be named 'foo.json' and
 *      'foo.weights.bin', respectively.
 * @param config Additional configuration for triggering downloads.
 * @returns An instance of `BrowserDownloads` `IOHandler`.
 *
 * @doc {
 *   heading: 'Models',
 *   subheading: 'Loading',
 *   namespace: 'io',
 *   ignoreCI: true
 * }
 */
function browserDownloads(fileNamePrefix) {
    if (fileNamePrefix === void 0) { fileNamePrefix = 'model'; }
    return new BrowserDownloads(fileNamePrefix);
}
/**
 * Creates an IOHandler that loads model artifacts from user-selected files.
 *
 * This method can be used for loading from files such as user-selected files
 * in the browser.
 * When used in conjunction with `tf.loadLayersModel`, an instance of
 * `tf.LayersModel` (Keras-style) can be constructed from the loaded artifacts.
 *
 * ```js
 * // Note: This code snippet won't run properly without the actual file input
 * //   elements in the HTML DOM.
 *
 * // Suppose there are two HTML file input (`<input type="file" ...>`)
 * // elements.
 * const uploadJSONInput = document.getElementById('upload-json');
 * const uploadWeightsInput = document.getElementById('upload-weights');
 * const model = await tf.loadLayersModel(tf.io.browserFiles(
 *     [uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
 * ```
 *
 * @param files `File`s to load from. Currently, this function supports only
 *   loading from files that contain Keras-style models (i.e., `tf.Model`s), for
 *   which an `Array` of `File`s is expected (in that order):
 *   - A JSON file containing the model topology and weight manifest.
 *   - Optionally, One or more binary files containing the binary weights.
 *     These files must have names that match the paths in the `weightsManifest`
 *     contained by the aforementioned JSON file, or errors will be thrown
 *     during loading. These weights files have the same format as the ones
 *     generated by `tensorflowjs_converter` that comes with the `tensorflowjs`
 *     Python PIP package. If no weights files are provided, only the model
 *     topology will be loaded from the JSON file above.
 * @returns An instance of `Files` `IOHandler`.
 *
 * @doc {
 *   heading: 'Models',
 *   subheading: 'Loading',
 *   namespace: 'io',
 *   ignoreCI: true
 * }
 */
function browserFiles(files) {
    return new BrowserFiles(files);
}

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Monitor Promise.all progress, fire onProgress callback function.
 *
 * @param promises Promise list going to be monitored
 * @param onProgress Callback function. Fired when a promise resolved.
 * @param startFraction Optional fraction start. Default to 0.
 * @param endFraction Optional fraction end. Default to 1.
 */
function monitorPromisesProgress(promises, onProgress, startFraction, endFraction) {
    checkPromises(promises);
    startFraction = startFraction == null ? 0 : startFraction;
    endFraction = endFraction == null ? 1 : endFraction;
    checkFraction(startFraction, endFraction);
    var resolvedPromise = 0;
    var registerMonitor = function (promise) {
        promise.then(function (value) {
            var fraction = startFraction +
                ++resolvedPromise / promises.length * (endFraction - startFraction);
            // pass fraction as parameter to callback function.
            onProgress(fraction);
            return value;
        });
        return promise;
    };
    function checkPromises(promises) {
        assert(promises != null && Array.isArray(promises) && promises.length > 0, function () { return 'promises must be a none empty array'; });
    }
    function checkFraction(startFraction, endFraction) {
        assert(startFraction >= 0 && startFraction <= 1, function () { return "Progress fraction must be in range [0, 1], but " +
            ("got startFraction " + startFraction); });
        assert(endFraction >= 0 && endFraction <= 1, function () { return "Progress fraction must be in range [0, 1], but " +
            ("got endFraction " + endFraction); });
        assert(endFraction >= startFraction, function () { return "startFraction must be no more than endFraction, but " +
            ("got startFraction " + startFraction + " and endFraction ") +
            ("" + endFraction); });
    }
    return Promise.all(promises.map(registerMonitor));
}

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Reads binary weights data from a number of URLs.
 *
 * @param fetchURLs URLs to send the HTTP requests at, using `fetch` calls.
 * @param requestOptions RequestInit (options) for the HTTP requests.
 * @param fetchFunc Optional overriding value for the `window.fetch` function.
 * @param onProgress Optional, progress callback function, fired periodically
 *   before the load is completed.
 * @returns A `Promise` of an Array of `ArrayBuffer`. The Array has the same
 *   length as `fetchURLs`.
 */
function loadWeightsAsArrayBuffer(fetchURLs, loadOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var fetchFunc, requests, fetchStartFraction, fetchEndFraction, responses, _a, bufferPromises, bufferStartFraction, bufferEndFraction, buffers, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (loadOptions == null) {
                        loadOptions = {};
                    }
                    fetchFunc = loadOptions.fetchFunc == null ? env().platform.fetch :
                        loadOptions.fetchFunc;
                    requests = fetchURLs.map(function (fetchURL) {
                        return fetchFunc(fetchURL, loadOptions.requestInit, { isBinary: true });
                    });
                    fetchStartFraction = 0;
                    fetchEndFraction = 0.5;
                    if (!(loadOptions.onProgress == null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.all(requests)];
                case 1:
                    _a = _c.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, monitorPromisesProgress(requests, loadOptions.onProgress, fetchStartFraction, fetchEndFraction)];
                case 3:
                    _a = _c.sent();
                    _c.label = 4;
                case 4:
                    responses = _a;
                    bufferPromises = responses.map(function (response) { return response.arrayBuffer(); });
                    bufferStartFraction = 0.5;
                    bufferEndFraction = 1;
                    if (!(loadOptions.onProgress == null)) return [3 /*break*/, 6];
                    return [4 /*yield*/, Promise.all(bufferPromises)];
                case 5:
                    _b = _c.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, monitorPromisesProgress(bufferPromises, loadOptions.onProgress, bufferStartFraction, bufferEndFraction)];
                case 7:
                    _b = _c.sent();
                    _c.label = 8;
                case 8:
                    buffers = _b;
                    return [2 /*return*/, buffers];
            }
        });
    });
}
/**
 * Reads a weights manifest JSON configuration, fetches the weights and
 * returns them as `Tensor`s.
 *
 * @param manifest The weights manifest JSON.
 * @param filePathPrefix The path prefix for filenames given in the manifest.
 *     Defaults to the empty string.
 * @param weightNames The names of the weights to be fetched.
 */
function loadWeights(manifest, filePathPrefix, weightNames, requestInit) {
    if (filePathPrefix === void 0) { filePathPrefix = ''; }
    return __awaiter(this, void 0, void 0, function () {
        var fetchWeights, loadWeights;
        return __generator(this, function (_a) {
            fetchWeights = function (fetchUrls) {
                return loadWeightsAsArrayBuffer(fetchUrls, { requestInit: requestInit });
            };
            loadWeights = weightsLoaderFactory(fetchWeights);
            return [2 /*return*/, loadWeights(manifest, filePathPrefix, weightNames)];
        });
    });
}
/**
 * Creates a function, which reads a weights manifest JSON configuration,
 * fetches the weight files using the specified function and returns them as
 * `Tensor`s.
 *
 * ```js
 * // example for creating a nodejs weight loader, which reads the weight files
 * // from disk using fs.readFileSync
 *
 * import * as fs from 'fs'
 *
 * const fetchWeightsFromDisk = (filePaths: string[]) =>
 *   filePaths.map(filePath => fs.readFileSync(filePath).buffer)
 *
 * const loadWeights = tf.io.weightsLoaderFactory(fetchWeightsFromDisk)
 *
 * const manifest = JSON.parse(
 *   fs.readFileSync('./my_model-weights_manifest').toString()
 * )
 * const weightMap = await loadWeights(manifest, './')
 * ```
 * @param fetchWeightsFunction The function used for fetching the weight files.
 * @returns Weight loading function.
 */
function weightsLoaderFactory(fetchWeightsFunction) {
    var _this = this;
    return function (manifest, filePathPrefix, weightNames) {
        if (filePathPrefix === void 0) { filePathPrefix = ''; }
        return __awaiter(_this, void 0, void 0, function () {
            var groupIndicesToFetchMap, groupWeightsToFetch, weightsFound, allManifestWeightNames, weightsNotFound, groupIndicesToFetch, fetchUrls, buffers, weightsTensorMap, bufferIndexOffset;
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
                                var rawDtype = ('quantization' in weightsEntry) ?
                                    weightsEntry.quantization.dtype :
                                    weightsEntry.dtype;
                                var weightsBytes = DTYPE_VALUE_SIZE_MAP[rawDtype] *
                                    sizeFromShape(weightsEntry.shape);
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
                            weightsNotFound = weightNames.filter(function (_, i) { return !weightsFound[i]; });
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
                        fetchUrls = [];
                        groupIndicesToFetch.forEach(function (i) {
                            manifest[i].paths.forEach(function (filepath) {
                                var fetchUrl = filePathPrefix +
                                    (!filePathPrefix.endsWith('/') ? '/' : '') + filepath;
                                fetchUrls.push(fetchUrl);
                            });
                        });
                        return [4 /*yield*/, fetchWeightsFunction(fetchUrls)];
                    case 1:
                        buffers = _a.sent();
                        weightsTensorMap = {};
                        bufferIndexOffset = 0;
                        groupIndicesToFetch.forEach(function (i) {
                            var numBuffers = manifest[i].paths.length;
                            var groupBytes = 0;
                            for (var i_1 = 0; i_1 < numBuffers; i_1++) {
                                groupBytes += buffers[bufferIndexOffset + i_1].byteLength;
                            }
                            // Create a buffer for the whole group.
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
                                var nameToTensorMap = decodeWeights(byteBuffer, [weightsEntry.manifestEntry]);
                                for (var name_1 in nameToTensorMap) {
                                    weightsTensorMap[name_1] = nameToTensorMap[name_1];
                                }
                            });
                            bufferIndexOffset += numBuffers;
                        });
                        return [2 /*return*/, weightsTensorMap];
                }
            });
        });
    };
}

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var OCTET_STREAM_MIME_TYPE = 'application/octet-stream';
var JSON_TYPE = 'application/json';
var HTTPRequest = /** @class */ (function () {
    function HTTPRequest(path, loadOptions) {
        this.DEFAULT_METHOD = 'POST';
        if (loadOptions == null) {
            loadOptions = {};
        }
        this.weightPathPrefix = loadOptions.weightPathPrefix;
        this.onProgress = loadOptions.onProgress;
        this.weightUrlConverter = loadOptions.weightUrlConverter;
        if (loadOptions.fetchFunc != null) {
            assert(typeof loadOptions.fetchFunc === 'function', function () { return 'Must pass a function that matches the signature of ' +
                '`fetch` (see ' +
                'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)'; });
            this.fetch = loadOptions.fetchFunc;
        }
        else {
            this.fetch = env().platform.fetch;
        }
        assert(path != null && path.length > 0, function () { return 'URL path for http must not be null, undefined or ' +
            'empty.'; });
        if (Array.isArray(path)) {
            assert(path.length === 2, function () { return 'URL paths for http must have a length of 2, ' +
                ("(actual length is " + path.length + ")."); });
        }
        this.path = path;
        if (loadOptions.requestInit != null &&
            loadOptions.requestInit.body != null) {
            throw new Error('requestInit is expected to have no pre-existing body, but has one.');
        }
        this.requestInit = loadOptions.requestInit || {};
    }
    HTTPRequest.prototype.save = function (modelArtifacts) {
        return __awaiter(this, void 0, void 0, function () {
            var init, weightsManifest, modelTopologyAndWeightManifest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
                            throw new Error('BrowserHTTPRequest.save() does not support saving model topology ' +
                                'in binary formats yet.');
                        }
                        init = Object.assign({ method: this.DEFAULT_METHOD }, this.requestInit);
                        init.body = new FormData();
                        weightsManifest = [{
                                paths: ['./model.weights.bin'],
                                weights: modelArtifacts.weightSpecs,
                            }];
                        modelTopologyAndWeightManifest = {
                            modelTopology: modelArtifacts.modelTopology,
                            format: modelArtifacts.format,
                            generatedBy: modelArtifacts.generatedBy,
                            convertedBy: modelArtifacts.convertedBy,
                            weightsManifest: weightsManifest
                        };
                        if (modelArtifacts.signature != null) {
                            modelTopologyAndWeightManifest.signature = modelArtifacts.signature;
                        }
                        if (modelArtifacts.userDefinedMetadata != null) {
                            modelTopologyAndWeightManifest.userDefinedMetadata =
                                modelArtifacts.userDefinedMetadata;
                        }
                        if (modelArtifacts.modelInitializer != null) {
                            modelTopologyAndWeightManifest.modelInitializer =
                                modelArtifacts.modelInitializer;
                        }
                        init.body.append('model.json', new Blob([JSON.stringify(modelTopologyAndWeightManifest)], { type: JSON_TYPE }), 'model.json');
                        if (modelArtifacts.weightData != null) {
                            init.body.append('model.weights.bin', new Blob([modelArtifacts.weightData], { type: OCTET_STREAM_MIME_TYPE }), 'model.weights.bin');
                        }
                        return [4 /*yield*/, this.fetch(this.path, init)];
                    case 1:
                        response = _a.sent();
                        if (response.ok) {
                            return [2 /*return*/, {
                                    modelArtifactsInfo: getModelArtifactsInfoForJSON(modelArtifacts),
                                    responses: [response],
                                }];
                        }
                        else {
                            throw new Error("BrowserHTTPRequest.save() failed due to HTTP response status " +
                                (response.status + "."));
                        }
                }
            });
        });
    };
    /**
     * Load model artifacts via HTTP request(s).
     *
     * See the documentation to `tf.io.http` for details on the saved
     * artifacts.
     *
     * @returns The loaded model artifacts (if loading succeeds).
     */
    HTTPRequest.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modelConfigRequest, modelConfig, e_1, message, modelTopology, weightsManifest, generatedBy, convertedBy, format, signature, userDefinedMetadata, weightSpecs, weightData, results, artifacts, initializer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch(this.path, this.requestInit)];
                    case 1:
                        modelConfigRequest = _a.sent();
                        if (!modelConfigRequest.ok) {
                            throw new Error("Request to " + this.path + " failed with status code " +
                                (modelConfigRequest.status + ". Please verify this URL points to ") +
                                "the model JSON of the model to load.");
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, modelConfigRequest.json()];
                    case 3:
                        modelConfig = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        message = "Failed to parse model JSON of response from " + this.path + ".";
                        // TODO(nsthorat): Remove this after some time when we're comfortable that
                        // .pb files are mostly gone.
                        if (this.path.endsWith('.pb')) {
                            message += ' Your path contains a .pb file extension. ' +
                                'Support for .pb models have been removed in TensorFlow.js 1.0 ' +
                                'in favor of .json models. You can re-convert your Python ' +
                                'TensorFlow model using the TensorFlow.js 1.0 conversion scripts ' +
                                'or you can convert your.pb models with the \'pb2json\'' +
                                'NPM script in the tensorflow/tfjs-converter repository.';
                        }
                        else {
                            message += ' Please make sure the server is serving valid ' +
                                'JSON for this request.';
                        }
                        throw new Error(message);
                    case 5:
                        modelTopology = modelConfig.modelTopology;
                        weightsManifest = modelConfig.weightsManifest;
                        generatedBy = modelConfig.generatedBy;
                        convertedBy = modelConfig.convertedBy;
                        format = modelConfig.format;
                        signature = modelConfig.signature;
                        userDefinedMetadata = modelConfig.userDefinedMetadata;
                        // We do not allow both modelTopology and weightsManifest to be missing.
                        if (modelTopology == null && weightsManifest == null) {
                            throw new Error("The JSON from HTTP path " + this.path + " contains neither model " +
                                "topology or manifest for weights.");
                        }
                        if (!(weightsManifest != null)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.loadWeights(weightsManifest)];
                    case 6:
                        results = _a.sent();
                        weightSpecs = results[0], weightData = results[1];
                        _a.label = 7;
                    case 7:
                        artifacts = {
                            modelTopology: modelTopology,
                            weightSpecs: weightSpecs,
                            weightData: weightData,
                            generatedBy: generatedBy,
                            convertedBy: convertedBy,
                            format: format
                        };
                        if (signature != null) {
                            artifacts.signature = signature;
                        }
                        if (userDefinedMetadata != null) {
                            artifacts.userDefinedMetadata = userDefinedMetadata;
                        }
                        initializer = modelConfig.modelInitializer;
                        if (initializer) {
                            artifacts.modelInitializer = initializer;
                        }
                        return [2 /*return*/, artifacts];
                }
            });
        });
    };
    HTTPRequest.prototype.loadWeights = function (weightsManifest) {
        return __awaiter(this, void 0, void 0, function () {
            var weightPath, _a, prefix, suffix, pathPrefix, weightSpecs, _i, weightsManifest_1, entry, fetchURLs, urlPromises, _b, weightsManifest_2, weightsGroup, _c, _d, path, _e, _f, _g, buffers;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        weightPath = Array.isArray(this.path) ? this.path[1] : this.path;
                        _a = parseUrl(weightPath), prefix = _a[0], suffix = _a[1];
                        pathPrefix = this.weightPathPrefix || prefix;
                        weightSpecs = [];
                        for (_i = 0, weightsManifest_1 = weightsManifest; _i < weightsManifest_1.length; _i++) {
                            entry = weightsManifest_1[_i];
                            weightSpecs.push.apply(weightSpecs, entry.weights);
                        }
                        fetchURLs = [];
                        urlPromises = [];
                        for (_b = 0, weightsManifest_2 = weightsManifest; _b < weightsManifest_2.length; _b++) {
                            weightsGroup = weightsManifest_2[_b];
                            for (_c = 0, _d = weightsGroup.paths; _c < _d.length; _c++) {
                                path = _d[_c];
                                if (this.weightUrlConverter != null) {
                                    urlPromises.push(this.weightUrlConverter(path));
                                }
                                else {
                                    fetchURLs.push(pathPrefix + path + suffix);
                                }
                            }
                        }
                        if (!this.weightUrlConverter) return [3 /*break*/, 2];
                        _f = (_e = fetchURLs.push).apply;
                        _g = [fetchURLs];
                        return [4 /*yield*/, Promise.all(urlPromises)];
                    case 1:
                        _f.apply(_e, _g.concat([_h.sent()]));
                        _h.label = 2;
                    case 2: return [4 /*yield*/, loadWeightsAsArrayBuffer(fetchURLs, {
                            requestInit: this.requestInit,
                            fetchFunc: this.fetch,
                            onProgress: this.onProgress
                        })];
                    case 3:
                        buffers = _h.sent();
                        return [2 /*return*/, [weightSpecs, concatenateArrayBuffers(buffers)]];
                }
            });
        });
    };
    HTTPRequest.URL_SCHEME_REGEX = /^https?:\/\//;
    return HTTPRequest;
}());
/**
 * Extract the prefix and suffix of the url, where the prefix is the path before
 * the last file, and suffix is the search params after the last file.
 * ```
 * const url = 'http://tfhub.dev/model/1/tensorflowjs_model.pb?tfjs-format=file'
 * [prefix, suffix] = parseUrl(url)
 * // prefix = 'http://tfhub.dev/model/1/'
 * // suffix = '?tfjs-format=file'
 * ```
 * @param url the model url to be parsed.
 */
function parseUrl(url) {
    var lastSlash = url.lastIndexOf('/');
    var lastSearchParam = url.lastIndexOf('?');
    var prefix = url.substring(0, lastSlash);
    var suffix = lastSearchParam > lastSlash ? url.substring(lastSearchParam) : '';
    return [prefix + '/', suffix];
}
function isHTTPScheme(url) {
    return url.match(HTTPRequest.URL_SCHEME_REGEX) != null;
}
var httpRouter = function (url, loadOptions) {
    if (typeof fetch === 'undefined' &&
        (loadOptions == null || loadOptions.fetchFunc == null)) {
        // `http` uses `fetch` or `node-fetch`, if one wants to use it in
        // an environment that is not the browser or node they have to setup a
        // global fetch polyfill.
        return null;
    }
    else {
        var isHTTP = true;
        if (Array.isArray(url)) {
            isHTTP = url.every(function (urlItem) { return isHTTPScheme(urlItem); });
        }
        else {
            isHTTP = isHTTPScheme(url);
        }
        if (isHTTP) {
            return http(url, loadOptions);
        }
    }
    return null;
};
IORouterRegistry.registerSaveRouter(httpRouter);
IORouterRegistry.registerLoadRouter(httpRouter);
/**
 * Creates an IOHandler subtype that sends model artifacts to HTTP server.
 *
 * An HTTP request of the `multipart/form-data` mime type will be sent to the
 * `path` URL. The form data includes artifacts that represent the topology
 * and/or weights of the model. In the case of Keras-style `tf.Model`, two
 * blobs (files) exist in form-data:
 *   - A JSON file consisting of `modelTopology` and `weightsManifest`.
 *   - A binary weights file consisting of the concatenated weight values.
 * These files are in the same format as the one generated by
 * [tfjs_converter](https://js.tensorflow.org/tutorials/import-keras.html).
 *
 * The following code snippet exemplifies the client-side code that uses this
 * function:
 *
 * ```js
 * const model = tf.sequential();
 * model.add(
 *     tf.layers.dense({units: 1, inputShape: [100], activation: 'sigmoid'}));
 *
 * const saveResult = await model.save(tf.io.http(
 *     'http://model-server:5000/upload', {requestInit: {method: 'PUT'}}));
 * console.log(saveResult);
 * ```
 *
 * If the default `POST` method is to be used, without any custom parameters
 * such as headers, you can simply pass an HTTP or HTTPS URL to `model.save`:
 *
 * ```js
 * const saveResult = await model.save('http://model-server:5000/upload');
 * ```
 *
 * The following GitHub Gist
 * https://gist.github.com/dsmilkov/1b6046fd6132d7408d5257b0976f7864
 * implements a server based on [flask](https://github.com/pallets/flask) that
 * can receive the request. Upon receiving the model artifacts via the requst,
 * this particular server reconsistutes instances of [Keras
 * Models](https://keras.io/models/model/) in memory.
 *
 *
 * @param path A URL path to the model.
 *   Can be an absolute HTTP path (e.g.,
 *   'http://localhost:8000/model-upload)') or a relative path (e.g.,
 *   './model-upload').
 * @param requestInit Request configurations to be used when sending
 *    HTTP request to server using `fetch`. It can contain fields such as
 *    `method`, `credentials`, `headers`, `mode`, etc. See
 *    https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
 *    for more information. `requestInit` must not have a body, because the
 * body will be set by TensorFlow.js. File blobs representing the model
 * topology (filename: 'model.json') and the weights of the model (filename:
 * 'model.weights.bin') will be appended to the body. If `requestInit` has a
 * `body`, an Error will be thrown.
 * @param loadOptions Optional configuration for the loading. It includes the
 *   following fields:
 *   - weightPathPrefix Optional, this specifies the path prefix for weight
 *     files, by default this is calculated from the path param.
 *   - fetchFunc Optional, custom `fetch` function. E.g., in Node.js,
 *     the `fetch` from node-fetch can be used here.
 *   - onProgress Optional, progress callback function, fired periodically
 *     before the load is completed.
 * @returns An instance of `IOHandler`.
 *
 * @doc {
 *   heading: 'Models',
 *   subheading: 'Loading',
 *   namespace: 'io',
 *   ignoreCI: true
 * }
 */
function http(path, loadOptions) {
    return new HTTPRequest(path, loadOptions);
}
/**
 * Deprecated. Use `tf.io.http`.
 * @param path
 * @param loadOptions
 */
function browserHTTPRequest(path, loadOptions) {
    return http(path, loadOptions);
}

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var PassthroughLoader = /** @class */ (function () {
    function PassthroughLoader(modelArtifacts) {
        this.modelArtifacts = modelArtifacts;
    }
    PassthroughLoader.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.modelArtifacts];
            });
        });
    };
    return PassthroughLoader;
}());
var PassthroughSaver = /** @class */ (function () {
    function PassthroughSaver(saveHandler) {
        this.saveHandler = saveHandler;
    }
    PassthroughSaver.prototype.save = function (modelArtifacts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.saveHandler(modelArtifacts)];
            });
        });
    };
    return PassthroughSaver;
}());
/**
 * Creates an IOHandler that loads model artifacts from memory.
 *
 * When used in conjunction with `tf.loadLayersModel`, an instance of
 * `tf.LayersModel` (Keras-style) can be constructed from the loaded artifacts.
 *
 * ```js
 * const model = await tf.loadLayersModel(tf.io.fromMemory(
 *     modelTopology, weightSpecs, weightData));
 * ```
 *
 * @param modelArtifacts a object containing model topology (i.e., parsed from
 *   the JSON format).
 * @param weightSpecs An array of `WeightsManifestEntry` objects describing the
 *   names, shapes, types, and quantization of the weight data.
 * @param weightData A single `ArrayBuffer` containing the weight data,
 *   concatenated in the order described by the weightSpecs.
 * @param trainingConfig Model training configuration. Optional.
 *
 * @returns A passthrough `IOHandler` that simply loads the provided data.
 */
function fromMemory(modelArtifacts, weightSpecs, weightData, trainingConfig) {
    if (arguments.length === 1) {
        var isModelArtifacts = modelArtifacts.modelTopology != null ||
            modelArtifacts.weightSpecs != null;
        if (isModelArtifacts) {
            return new PassthroughLoader(modelArtifacts);
        }
        else {
            // Legacy support: with only modelTopology.
            // TODO(cais): Remove this deprecated API.
            console.warn('Please call tf.io.fromMemory() with only one argument. ' +
                'The argument should be of type ModelArtifacts. ' +
                'The multi-argument signature of tf.io.fromMemory() has been ' +
                'deprecated and will be removed in a future release.');
            return new PassthroughLoader({ modelTopology: modelArtifacts });
        }
    }
    else {
        // Legacy support.
        // TODO(cais): Remove this deprecated API.
        console.warn('Please call tf.io.fromMemory() with only one argument. ' +
            'The argument should be of type ModelArtifacts. ' +
            'The multi-argument signature of tf.io.fromMemory() has been ' +
            'deprecated and will be removed in a future release.');
        return new PassthroughLoader({
            modelTopology: modelArtifacts,
            weightSpecs: weightSpecs,
            weightData: weightData,
            trainingConfig: trainingConfig
        });
    }
}
/**
 * Creates an IOHandler that passes saved model artifacts to a callback.
 *
 * ```js
 * function handleSave(artifacts) {
 *   // ... do something with the artifacts ...
 *   return {modelArtifactsInfo: {...}, ...};
 * }
 *
 * const saveResult = model.save(tf.io.withSaveHandler(handleSave));
 * ```
 *
 * @param saveHandler A function that accepts a `ModelArtifacts` and returns a
 *     `SaveResult`.
 */
function withSaveHandler(saveHandler) {
    return new PassthroughSaver(saveHandler);
}

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

var io = {
    __proto__: null,
    browserFiles: browserFiles,
    browserHTTPRequest: browserHTTPRequest,
    concatenateArrayBuffers: concatenateArrayBuffers,
    decodeWeights: decodeWeights,
    encodeWeights: encodeWeights,
    fromMemory: fromMemory,
    getLoadHandlers: getLoadHandlers,
    getModelArtifactsInfoForJSON: getModelArtifactsInfoForJSON,
    getSaveHandlers: getSaveHandlers,
    http: http,
    isHTTPScheme: isHTTPScheme,
    loadWeights: loadWeights,
    registerLoadRouter: registerLoadRouter,
    registerSaveRouter: registerSaveRouter,
    weightsLoaderFactory: weightsLoaderFactory,
    withSaveHandler: withSaveHandler,
    copyModel: copyModel,
    listModels: listModels,
    moveModel: moveModel,
    removeModel: removeModel
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Computes the dot product of two matrices, A * B. These must be matrices.
 *
 * ```js
 * const a = tf.tensor2d([1, 2], [1, 2]);
 * const b = tf.tensor2d([1, 2, 3, 4], [2, 2]);
 *
 * a.matMul(b).print();  // or tf.matMul(a, b)
 * ```
 * @param a First matrix in dot product operation.
 * @param b Second matrix in dot product operation.
 * @param transposeA If true, `a` is transposed before multiplication.
 * @param transposeB If true, `b` is transposed before multiplication.
 *
 * @doc {heading: 'Operations', subheading: 'Matrices'}
 */
function matMul_(a, b, transposeA, transposeB) {
    var _a;
    if (transposeA === void 0) { transposeA = false; }
    if (transposeB === void 0) { transposeB = false; }
    var $a = convertToTensor(a, 'a', 'matMul');
    var $b = convertToTensor(b, 'b', 'matMul');
    _a = makeTypesMatch($a, $b), $a = _a[0], $b = _a[1];
    var inputs = { a: $a, b: $b };
    var attrs = { transposeA: transposeA, transposeB: transposeB };
    return ENGINE.runKernel(BatchMatMul, inputs, attrs);
}
var matMul = op({ matMul_: matMul_ });

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Creates a one-hot `tf.Tensor`. The locations represented by `indices` take
 * value `onValue` (defaults to 1), while all other locations take value
 * `offValue` (defaults to 0). If `indices` is rank `R`, the output has rank
 * `R+1` with the last axis of size `depth`.
 *
 * ```js
 * tf.oneHot(tf.tensor1d([0, 1], 'int32'), 3).print();
 * ```
 *
 * @param indices `tf.Tensor` of indices with dtype `int32`.
 * @param depth The depth of the one hot dimension.
 * @param onValue A number used to fill in the output when the index matches
 * the location.
 * @param offValue A number used to fill in the output when the index does
 *     not match the location.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
function oneHot_(indices, depth, onValue, offValue) {
    if (onValue === void 0) { onValue = 1; }
    if (offValue === void 0) { offValue = 0; }
    if (depth < 2) {
        throw new Error("Error in oneHot: depth must be >=2, but it is " + depth);
    }
    var $indices = convertToTensor(indices, 'indices', 'oneHot', 'int32');
    var inputs = { indices: $indices };
    var attrs = { depth: depth, onValue: onValue, offValue: offValue };
    return ENGINE.runKernel(OneHot, inputs, attrs);
}
var oneHot = op({ oneHot_: oneHot_ });

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Transposes the `tf.Tensor`. Permutes the dimensions according to `perm`.
 *
 * The returned `tf.Tensor`'s dimension `i` will correspond to the input
 * dimension `perm[i]`. If `perm` is not given, it is set to `[n-1...0]`,
 * where `n` is the rank of the input `tf.Tensor`. Hence by default, this
 * operation performs a regular matrix transpose on 2-D input `tf.Tensor`s.
 *
 * ```js
 * const a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
 *
 * a.transpose().print();  // or tf.transpose(a)
 * ```
 *
 * @param x The tensor to transpose.
 * @param perm The permutation of the dimensions of a.
 *
 * @doc {heading: 'Operations', subheading: 'Matrices'}
 */
function transpose_(x, perm) {
    var $x = convertToTensor(x, 'x', 'transpose');
    if (perm == null) {
        perm = $x.shape.map(function (s, i) { return i; }).reverse();
    }
    assert($x.rank === perm.length, function () { return "Error in transpose: rank of input " + $x.rank + " " +
        ("must match length of perm " + perm + "."); });
    perm.forEach(function (axis) {
        assert(axis >= 0 && axis < $x.rank, function () { return "All entries in 'perm' must be between 0 and " + ($x.rank - 1) +
            (" but got " + perm); });
    });
    if ($x.rank <= 1) {
        return $x.clone();
    }
    var inputs = { x: $x };
    var attrs = { perm: perm };
    return ENGINE.runKernel(Transpose, inputs, attrs);
}
var transpose = op({ transpose_: transpose_ });

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Computes the confusion matrix from true labels and predicted labels.
 *
 * ```js
 * const labels = tf.tensor1d([0, 1, 2, 1, 0], 'int32');
 * const predictions = tf.tensor1d([0, 2, 2, 1, 0], 'int32');
 * const numClasses = 3;
 * const out = tf.math.confusionMatrix(labels, predictions, numClasses);
 * out.print();
 * // Expected output matrix:
 * // [[2, 0, 0],
 * //  [0, 1, 1],
 * //  [0, 0, 1]]
 * ```
 *
 * @param labels The target labels, assumed to be 0-based integers
 *   for the classes. The shape is `[numExamples]`, where
 *   `numExamples` is the number of examples included.
 * @param predictions The predicted classes, assumed to be
 *   0-based integers for the classes. Must have the same shape as `labels`.
 * @param numClasses Number of all classes, as an integer.
 *   Its value must be larger than the largest element in `labels` and
 *   `predictions`.
 * @returns The confusion matrix as a int32-type 2D tensor. The value at
 *   row `r` and column `c` is the number of times examples of actual class
 *   `r` were predicted as class `c`.
 *
 * @doc {heading: 'Operations', subheading: 'Evaluation'}
 */
function confusionMatrix_(labels, predictions, numClasses) {
    var $labels = convertToTensor(labels, 'labels', 'confusionMatrix');
    var $predictions = convertToTensor(predictions, 'predictions', 'confusionMatrix');
    assert(numClasses == null || numClasses > 0 && Number.isInteger(numClasses), function () { return "If provided, numClasses must be a positive integer, " +
        ("but got " + numClasses); });
    assert($labels.rank === 1, function () { return "Expected the rank of labels to be 1, but got " + $labels.rank; });
    assert($predictions.rank === 1, function () { return "Expected the rank of predictions to be 1, " +
        ("but got " + $predictions.rank); });
    assert($labels.shape[0] === $predictions.shape[0], function () { return "Mismatch in the number of examples: " +
        ($labels.shape[0] + " vs. " + $predictions.shape[0] + ". ") +
        "Labels and predictions should have the same number of elements."; });
    assert(numClasses > 0 && Number.isInteger(numClasses), function () { return "numClasses is required to be a positive integer, but got " +
        ("" + numClasses); });
    // TODO(cais): In the future, if oneHot supports tensors inputs for
    //   `numClasses`, `confusionMatrix` can make `numClasses` optional.
    var oneHotLabels = oneHot(cast($labels, 'int32'), numClasses);
    var oneHotPredictions = oneHot(cast($predictions, 'int32'), numClasses);
    var oneHotLabelsT = transpose(oneHotLabels);
    var product = matMul(oneHotLabelsT, oneHotPredictions);
    return cast(product, 'int32');
}
var confusionMatrix = op({ confusionMatrix_: confusionMatrix_ });

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

var math = {
    __proto__: null,
    confusionMatrix: confusionMatrix
};

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Creates rank-3 `tf.Tensor` with the provided values, shape and dtype.
 *
 * The same functionality can be achieved with `tf.tensor`, but in general
 * we recommend using `tf.tensor3d` as it makes the code more readable.
 *
 *  ```js
 * // Pass a nested array.
 * tf.tensor3d([[[1], [2]], [[3], [4]]]).print();
 * ```
 * ```js
 * // Pass a flat array and specify a shape.
 * tf.tensor3d([1, 2, 3, 4], [2, 2, 1]).print();
 * ```
 *
 * @param values The values of the tensor. Can be nested array of numbers,
 *     or a flat array, or a `TypedArray`.
 * @param shape The shape of the tensor. If not provided,  it is inferred from
 *     `values`.
 * @param dtype The data type.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
function tensor3d(values, shape, dtype) {
    assertNonNull(values);
    if (shape != null && shape.length !== 3) {
        throw new Error('tensor3d() requires shape to have three numbers');
    }
    var inferredShape = inferShape(values, dtype);
    if (inferredShape.length !== 3 && inferredShape.length !== 1) {
        throw new Error('tensor3d() requires values to be number[][][] or flat/TypedArray');
    }
    if (inferredShape.length === 1 && shape == null) {
        throw new Error('tensor3d() requires shape to be provided when `values` ' +
            'are a flat array');
    }
    return makeTensor(values, shape, inferredShape, dtype);
}

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var fromPixels2DContext;
/**
 * Creates a `tf.Tensor` from an image.
 *
 * ```js
 * const image = new ImageData(1, 1);
 * image.data[0] = 100;
 * image.data[1] = 150;
 * image.data[2] = 200;
 * image.data[3] = 255;
 *
 * tf.browser.fromPixels(image).print();
 * ```
 *
 * @param pixels The input image to construct the tensor from. The
 * supported image types are all 4-channel. You can also pass in an image
 * object with following attributes:
 * `{data: Uint8Array; width: number; height: number}`
 * @param numChannels The number of channels of the output tensor. A
 * numChannels value less than 4 allows you to ignore channels. Defaults to
 * 3 (ignores alpha channel of input image).
 *
 * @returns A Tensor3D with the shape `[height, width, numChannels]`.
 *
 * @doc {heading: 'Browser', namespace: 'browser', ignoreCI: true}
 */
function fromPixels_(pixels, numChannels) {
    if (numChannels === void 0) { numChannels = 3; }
    // Sanity checks.
    if (numChannels > 4) {
        throw new Error('Cannot construct Tensor with more than 4 channels from pixels.');
    }
    if (pixels == null) {
        throw new Error('pixels passed to tf.browser.fromPixels() can not be null');
    }
    var isPixelData = false;
    var isImageData = false;
    var isVideo = false;
    var isImage = false;
    var isCanvasLike = false;
    var isImageBitmap = false;
    if (pixels.data instanceof Uint8Array) {
        isPixelData = true;
    }
    else if (typeof (ImageData) !== 'undefined' && pixels instanceof ImageData) {
        isImageData = true;
    }
    else if (typeof (HTMLVideoElement) !== 'undefined' &&
        pixels instanceof HTMLVideoElement) {
        isVideo = true;
    }
    else if (typeof (HTMLImageElement) !== 'undefined' &&
        pixels instanceof HTMLImageElement) {
        isImage = true;
        // tslint:disable-next-line: no-any
    }
    else if (pixels.getContext != null) {
        isCanvasLike = true;
    }
    else if (typeof (ImageBitmap) !== 'undefined' && pixels instanceof ImageBitmap) {
        isImageBitmap = true;
    }
    else {
        throw new Error('pixels passed to tf.browser.fromPixels() must be either an ' +
            "HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData " +
            "in browser, or OffscreenCanvas, ImageData in webworker" +
            " or {data: Uint32Array, width: number, height: number}, " +
            ("but was " + pixels.constructor.name));
    }
    if (isVideo) {
        var HAVE_CURRENT_DATA_READY_STATE = 2;
        if (isVideo &&
            pixels.readyState <
                HAVE_CURRENT_DATA_READY_STATE) {
            throw new Error('The video element has not loaded data yet. Please wait for ' +
                '`loadeddata` event on the <video> element.');
        }
    }
    // If the current backend has 'FromPixels' registered, it has a more
    // efficient way of handling pixel uploads, so we call that.
    var kernel = getKernel(FromPixels, ENGINE.backendName);
    if (kernel != null) {
        var inputs = { pixels: pixels };
        var attrs = { numChannels: numChannels };
        return ENGINE.runKernel(FromPixels, inputs, attrs);
    }
    var _a = isVideo ?
        [
            pixels.videoWidth,
            pixels.videoHeight
        ] :
        [pixels.width, pixels.height], width = _a[0], height = _a[1];
    var vals;
    if (isCanvasLike) {
        vals =
            // tslint:disable-next-line:no-any
            pixels.getContext('2d').getImageData(0, 0, width, height).data;
    }
    else if (isImageData || isPixelData) {
        vals = pixels.data;
    }
    else if (isImage || isVideo || isImageBitmap) {
        if (fromPixels2DContext == null) {
            fromPixels2DContext = document.createElement('canvas').getContext('2d');
        }
        fromPixels2DContext.canvas.width = width;
        fromPixels2DContext.canvas.height = height;
        fromPixels2DContext.drawImage(pixels, 0, 0, width, height);
        vals = fromPixels2DContext.getImageData(0, 0, width, height).data;
    }
    var values;
    if (numChannels === 4) {
        values = new Int32Array(vals);
    }
    else {
        var numPixels = width * height;
        values = new Int32Array(numPixels * numChannels);
        for (var i = 0; i < numPixels; i++) {
            for (var channel = 0; channel < numChannels; ++channel) {
                values[i * numChannels + channel] = vals[i * 4 + channel];
            }
        }
    }
    var outShape = [height, width, numChannels];
    return tensor3d(values, outShape, 'int32');
}
// Helper functions for |fromPixelsAsync| to check whether the input can
// be wrapped into imageBitmap.
function isPixelData(pixels) {
    return (pixels != null) && (pixels.data instanceof Uint8Array);
}
function isImageBitmapFullySupported() {
    return typeof window !== 'undefined' &&
        typeof (ImageBitmap) !== 'undefined' &&
        window.hasOwnProperty('createImageBitmap');
}
function isNonEmptyPixels(pixels) {
    return pixels != null && pixels.width !== 0 && pixels.height !== 0;
}
function canWrapPixelsToImageBitmap(pixels) {
    return isImageBitmapFullySupported() && !(pixels instanceof ImageBitmap) &&
        isNonEmptyPixels(pixels) && !isPixelData(pixels);
}
/**
 * Creates a `tf.Tensor` from an image in async way.
 *
 * ```js
 * const image = new ImageData(1, 1);
 * image.data[0] = 100;
 * image.data[1] = 150;
 * image.data[2] = 200;
 * image.data[3] = 255;
 *
 * (await tf.browser.fromPixelsAsync(image)).print();
 * ```
 * This API is the async version of fromPixels. The API will first
 * check |WRAP_TO_IMAGEBITMAP| flag, and try to wrap the input to
 * imageBitmap if the flag is set to true.
 *
 * @param pixels The input image to construct the tensor from. The
 * supported image types are all 4-channel. You can also pass in an image
 * object with following attributes:
 * `{data: Uint8Array; width: number; height: number}`
 * @param numChannels The number of channels of the output tensor. A
 * numChannels value less than 4 allows you to ignore channels. Defaults to
 * 3 (ignores alpha channel of input image).
 *
 * @doc {heading: 'Browser', namespace: 'browser', ignoreCI: true}
 */
function fromPixelsAsync(pixels, numChannels) {
    if (numChannels === void 0) { numChannels = 3; }
    return __awaiter(this, void 0, void 0, function () {
        var inputs, imageBitmap, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inputs = null;
                    if (!(env().getBool('WRAP_TO_IMAGEBITMAP') &&
                        canWrapPixelsToImageBitmap(pixels))) return [3 /*break*/, 5];
                    imageBitmap = void 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, createImageBitmap(pixels, { premultiplyAlpha: 'none' })];
                case 2:
                    // wrap in try-catch block, because createImageBitmap may not work
                    // properly in some browsers, e.g.
                    // https://bugzilla.mozilla.org/show_bug.cgi?id=1335594
                    // tslint:disable-next-line: no-any
                    imageBitmap = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    imageBitmap = null;
                    return [3 /*break*/, 4];
                case 4:
                    // createImageBitmap will clip the source size.
                    // In some cases, the input will have larger size than its content.
                    // E.g. new Image(10, 10) but with 1 x 1 content. Using
                    // createImageBitmap will clip the size from 10 x 10 to 1 x 1, which
                    // is not correct. We should avoid wrapping such resouce to
                    // imageBitmap.
                    if (imageBitmap != null && imageBitmap.width === pixels.width &&
                        imageBitmap.height === pixels.height) {
                        inputs = imageBitmap;
                    }
                    else {
                        inputs = pixels;
                    }
                    return [3 /*break*/, 6];
                case 5:
                    inputs = pixels;
                    _a.label = 6;
                case 6: return [2 /*return*/, fromPixels_(inputs, numChannels)];
            }
        });
    });
}
/**
 * Draws a `tf.Tensor` of pixel values to a byte array or optionally a
 * canvas.
 *
 * When the dtype of the input is 'float32', we assume values in the range
 * [0-1]. Otherwise, when input is 'int32', we assume values in the range
 * [0-255].
 *
 * Returns a promise that resolves when the canvas has been drawn to.
 *
 * @param img A rank-2 tensor with shape `[height, width]`, or a rank-3 tensor
 * of shape `[height, width, numChannels]`. If rank-2, draws grayscale. If
 * rank-3, must have depth of 1, 3 or 4. When depth of 1, draws
 * grayscale. When depth of 3, we draw with the first three components of
 * the depth dimension corresponding to r, g, b and alpha = 1. When depth of
 * 4, all four components of the depth dimension correspond to r, g, b, a.
 * @param canvas The canvas to draw to.
 *
 * @doc {heading: 'Browser', namespace: 'browser'}
 */
function toPixels(img, canvas) {
    return __awaiter(this, void 0, void 0, function () {
        var $img, originalImgTensor, _a, height, width, depth, data, multiplier, bytes, i, rgba, d, value, j, ctx, imageData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    $img = convertToTensor(img, 'img', 'toPixels');
                    if (!(img instanceof Tensor)) {
                        originalImgTensor = $img;
                        $img = cast(originalImgTensor, 'int32');
                        originalImgTensor.dispose();
                    }
                    if ($img.rank !== 2 && $img.rank !== 3) {
                        throw new Error("toPixels only supports rank 2 or 3 tensors, got rank " + $img.rank + ".");
                    }
                    _a = $img.shape.slice(0, 2), height = _a[0], width = _a[1];
                    depth = $img.rank === 2 ? 1 : $img.shape[2];
                    if (depth > 4 || depth === 2) {
                        throw new Error("toPixels only supports depth of size " +
                            ("1, 3 or 4 but got " + depth));
                    }
                    if ($img.dtype !== 'float32' && $img.dtype !== 'int32') {
                        throw new Error("Unsupported type for toPixels: " + $img.dtype + "." +
                            " Please use float32 or int32 tensors.");
                    }
                    return [4 /*yield*/, $img.data()];
                case 1:
                    data = _b.sent();
                    multiplier = $img.dtype === 'float32' ? 255 : 1;
                    bytes = new Uint8ClampedArray(width * height * 4);
                    for (i = 0; i < height * width; ++i) {
                        rgba = [0, 0, 0, 255];
                        for (d = 0; d < depth; d++) {
                            value = data[i * depth + d];
                            if ($img.dtype === 'float32') {
                                if (value < 0 || value > 1) {
                                    throw new Error("Tensor values for a float32 Tensor must be in the " +
                                        ("range [0 - 1] but encountered " + value + "."));
                                }
                            }
                            else if ($img.dtype === 'int32') {
                                if (value < 0 || value > 255) {
                                    throw new Error("Tensor values for a int32 Tensor must be in the " +
                                        ("range [0 - 255] but encountered " + value + "."));
                                }
                            }
                            if (depth === 1) {
                                rgba[0] = value * multiplier;
                                rgba[1] = value * multiplier;
                                rgba[2] = value * multiplier;
                            }
                            else {
                                rgba[d] = value * multiplier;
                            }
                        }
                        j = i * 4;
                        bytes[j + 0] = Math.round(rgba[0]);
                        bytes[j + 1] = Math.round(rgba[1]);
                        bytes[j + 2] = Math.round(rgba[2]);
                        bytes[j + 3] = Math.round(rgba[3]);
                    }
                    if (canvas != null) {
                        canvas.width = width;
                        canvas.height = height;
                        ctx = canvas.getContext('2d');
                        imageData = new ImageData(bytes, width, height);
                        ctx.putImageData(imageData, 0, 0);
                    }
                    if ($img !== img) {
                        $img.dispose();
                    }
                    return [2 /*return*/, bytes];
            }
        });
    });
}
var fromPixels = op({ fromPixels_: fromPixels_ });

var browser = {
    __proto__: null,
    fromPixelsAsync: fromPixelsAsync,
    toPixels: toPixels,
    fromPixels: fromPixels
};

/**
 * Validate gather nd inputs.
 *
 * @param tensor The tensor contains the source values.
 * @param indices The tensor contains the indices to slice the source.
 *
 * @returns [resultShape, numUpdates, sliceSize, strides]
 */
function prepareAndValidate(tensor, indices) {
    var tensorRank = tensor.shape.length;
    var indicesRank = indices.shape.length;
    if (tensorRank < 1) {
        throw new Error('tf.gatherND() expects the input to be rank 1 or higher,' +
            (" but the rank was " + tensorRank + "."));
    }
    if (indicesRank < 1) {
        throw new Error('tf.gatherND() expects the indices to be rank 1 or higher,' +
            (" but the rank was " + indicesRank + "."));
    }
    if (indices.dtype !== 'int32') {
        throw new Error('tf.gatherND() expects the indices to be int32 type,' +
            (" but the dtype was " + indices.dtype + "."));
    }
    if (indices.shape[indicesRank - 1] > tensorRank) {
        throw new Error('index innermost dimension length must be <= tensor rank; saw: ' +
            (indices.shape[indicesRank - 1] + " vs. " + tensorRank));
    }
    if (sizeFromShape(tensor.shape) === 0) {
        throw new Error('Requested more than 0 entries, but input is empty.' +
            (" Input shape: " + tensor.shape + "."));
    }
    var indicesShape = indices.shape;
    var sliceRank = indicesShape[indicesShape.length - 1];
    // The result shape is
    //   indices.shape[:-1] + params.shape[indices.shape[-1]:]
    var nResult = 1;
    for (var i = 0; i < indicesShape.length - 1; ++i) {
        nResult *= indicesShape[i];
    }
    var inputShape = tensor.shape;
    var resultShape = indicesShape.slice();
    resultShape.pop();
    var sliceSize = 1;
    for (var i = sliceRank; i < tensorRank; ++i) {
        sliceSize *= inputShape[i];
        resultShape.push(inputShape[i]);
    }
    var strides = computeStrides(tensor.shape).map(function (stride) { return stride / sliceSize; }).concat([1]).slice(0, sliceRank);
    return [resultShape, nResult, sliceSize, strides];
}

var gather_nd_util = {
    __proto__: null,
    prepareAndValidate: prepareAndValidate
};

/**
 * Check whether updates.shape = indices.shape[:batchDim] +
 * shape[sliceDim:]
 *
 * @param x The input tensor.
 */
function validateUpdateShape(shape, indices, updates) {
    var sliceDim = (indices.rank > 1) ? indices.shape[indices.rank - 1] : 1;
    var batchDim = (indices.rank > 1) ? indices.rank - 1 : 1;
    var shapeError = 'Must have updates.shape = indices.shape[:batchDim] + ' +
        ("shape[sliceDim:], got updates.shape: " + updates.shape) +
        (", indices.shape: " + indices.shape + ", shape: " + shape) +
        (", sliceDim: " + sliceDim + ", and batchDim: " + batchDim + ".");
    if (updates.rank < batchDim) {
        throw new Error(shapeError + (" update.rank < " + batchDim + ". "));
    }
    if (shape.length < sliceDim + (updates.rank - batchDim)) {
        throw new Error(shapeError +
            (" Output shape length < " + (sliceDim + (updates.rank - batchDim))));
    }
    if (updates.rank !== batchDim + shape.length - sliceDim) {
        throw new Error(shapeError + (" update.rank != " + (batchDim + shape.length - sliceDim)));
    }
    for (var d = 0; d < batchDim; ++d) {
        if (updates.shape[d] !== indices.shape[d]) {
            throw new Error(shapeError +
                (" updates.shape[" + d + "] (" + updates.shape[d] + ") != indices.shape[" + d + "] (" + indices.shape[d] + ")."));
        }
    }
    for (var d = 0; d < updates.rank - batchDim; ++d) {
        if (updates.shape[d + batchDim] !== shape[d + sliceDim]) {
            throw new Error(shapeError +
                (" updates.shape[" + (d + batchDim) + "] (" + updates.shape[d + batchDim] + ") != shape[" + (d + batchDim) + "] (" + shape[d + batchDim] + ")"));
        }
    }
}
/**
 * Validate scatter nd inputs.
 *
 * @param update The tensor contains the update values.
 * @param indices The tensor contains the indices for the update values.
 * @param shape The shape of the output tensor.
 */
function validateInput(updates, indices, shape) {
    if (indices.rank < 1) {
        throw new Error('tf.scatterND() expects the indices to be rank 1 or higher,' +
            (" but the rank was " + indices.rank + "."));
    }
    if (updates.rank < 1) {
        throw new Error('tf.scatterND() expects the updates to be rank 1 or higher,' +
            (" but the rank was " + updates.rank + "."));
    }
    if (indices.dtype !== 'int32') {
        throw new Error("The dtype of 'indices' should be int32, but got dtype: " + indices.dtype);
    }
    if (shape.length < 1) {
        throw new Error("Output rank must be greater or equal to 1, but got shape: " + shape);
    }
    if (shape.length === 0) {
        if (indices.size === 0) {
            throw new Error("Indices specified for empty output. indices shape: " + indices.shape);
        }
        if (updates.size === 0) {
            throw new Error("Updates specified for empty output. updates shape: " + updates.shape);
        }
    }
    validateUpdateShape(shape, indices, updates);
}
/**
 * Calculate the shape information for the output.
 *
 * @param update The tensor contains the update values.
 * @param indices The tensor contains the indices for the update values.
 * @param shape The shape of the output tensor.
 *
 * @returns ScatterShapeInfo
 */
function calculateShapes(updates, indices, shape) {
    // Calculate the number of dimensions in indices
    var indicesRank = indices.shape.length;
    var sliceRank = (indicesRank > 1) ? indices.shape[indicesRank - 1] : 1;
    // Calculate the number of elements that make up each slice of our updated
    // tensor. This allows us to work with flattened tensors and copy over whole
    // slices at a time.
    var totalNd = shape.length;
    var sliceSize = 1;
    for (var i = sliceRank; i < totalNd; ++i) {
        sliceSize *= shape[i];
    }
    var safeSliceDim = (sliceRank < 1) ? 1 : sliceRank;
    var numUpdates = sizeFromShape(indices.shape) / safeSliceDim;
    var strides = computeStrides(shape.slice(0, sliceRank)).concat([1]);
    var outputSize = sizeFromShape(shape);
    return { sliceRank: sliceRank, numUpdates: numUpdates, sliceSize: sliceSize, strides: strides, outputSize: outputSize };
}

var scatter_nd_util = {
    __proto__: null,
    validateUpdateShape: validateUpdateShape,
    validateInput: validateInput,
    calculateShapes: calculateShapes
};

/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function assertParamsValid(input, begin, size) {
    var inputRank = input.shape.length;
    assert(inputRank === begin.length, function () { return "Error in slice" + inputRank + "D: Length of begin " + begin + " must " +
        ("match the rank of the array (" + inputRank + ")."); });
    assert(inputRank === size.length, function () { return "Error in slice" + inputRank + "D: Length of size " + size + " must " +
        ("match the rank of the array (" + inputRank + ")."); });
    var _loop_1 = function (i) {
        assert(begin[i] + size[i] <= input.shape[i], function () { return "Error in slice" + inputRank + "D: begin[" + i + "] + size[" + i + "] " +
            ("(" + (begin[i] + size[i]) + ") would overflow input.shape[" + i + "] (" + input.shape[i] + ")"); });
    };
    for (var i = 0; i < inputRank; ++i) {
        _loop_1(i);
    }
}
/** Converts a binary mask to an array of axes. Used in stridedSlice(). */
function maskToAxes(mask) {
    var axes = [];
    var axis = 0;
    while (mask > 0) {
        if (mask & 1) {
            axes.push(axis);
        }
        mask /= 2;
        axis++;
    }
    return axes;
}
/** Computes the output shape given the strided slice params. */
function computeOutShape(begin, end, strides) {
    var size = [];
    for (var axis = 0; axis < begin.length; axis++) {
        size[axis] = Math.ceil((end[axis] - begin[axis]) / strides[axis]);
    }
    return size;
}
// Creates full selection at the elided dimensions. If the dimension matches
// the ellipsis mask, override the current stride value. Otherwise, insert.
function stridesWithElidedDims(strides, ellipsisInsertionIndex, numElidedAxes, inputShape) {
    var newStrides = strides.slice();
    for (var i = newStrides.length; i < inputShape.length; i++) {
        newStrides.push(1);
    }
    for (var i = 0; i < numElidedAxes; i++) {
        if (i === 0) {
            newStrides[ellipsisInsertionIndex] = 1;
        }
        else {
            newStrides.splice(ellipsisInsertionIndex, 0 /* num elements to delete */, 1 /* element to add */);
            newStrides.pop();
        }
    }
    return newStrides;
}
function unnormalizeAxis(ellipsisInsertionIndex, numElidedAxes, normalizedAxis) {
    if (normalizedAxis <= ellipsisInsertionIndex) {
        return normalizedAxis;
    }
    return normalizedAxis - (numElidedAxes - 1);
}
function getElidedAxes(numElidedAxes, ellipsisInsertionIndex) {
    var elidedAxes = [];
    for (var i = 0; i < numElidedAxes; i++) {
        elidedAxes.push(ellipsisInsertionIndex + i);
    }
    return elidedAxes;
}
// Normalize the start, end and strides.
function getNormalizedAxes(inputShape, ellipsisAxes, numInterpolatedAxes, begin, end, strides, beginMask, endMask, ellipsisMask) {
    var inputRank = inputShape.length;
    var normalizedBegin = new Array(inputRank), normalizedEnd = new Array(inputRank), normalizedStrides = new Array(inputRank);
    if (ellipsisAxes.length && numInterpolatedAxes > 0) {
        var fullIndex = ellipsisAxes[0];
        // The ellipsis applies to the masked index as well as any dimensions
        // that are interpolated.
        var numElidedAxes = numInterpolatedAxes + 1;
        normalizedBegin = startIndicesWithElidedDims(beginMask, fullIndex, numElidedAxes, begin, inputShape);
        normalizedEnd = stopIndicesWithElidedDims(endMask, fullIndex, numElidedAxes, end, inputShape);
        normalizedStrides =
            stridesWithElidedDims(strides, fullIndex, numElidedAxes, inputShape);
    }
    else {
        for (var axis = 0; axis < inputRank; axis++) {
            normalizedBegin[axis] = startForAxis(beginMask, begin, strides, inputShape, axis, ellipsisMask);
            normalizedEnd[axis] =
                stopForAxis(endMask, end, strides, inputShape, axis, ellipsisMask);
            normalizedStrides[axis] = stridesForAxis(strides, axis, ellipsisMask);
        }
    }
    return {
        begin: normalizedBegin,
        end: normalizedEnd,
        strides: normalizedStrides
    };
}
// Creates full selection at the elided dimensions. If the dimension matches
// the ellipsis mask, override the current start value. Otherwise, insert.
function startIndicesWithElidedDims(beginMask, ellipsisInsertionIndex, numElidedAxes, originalBegin, inputShape) {
    var newIndices = inputShape.slice();
    var elidedAxes = getElidedAxes(numElidedAxes, ellipsisInsertionIndex);
    for (var axis = 0; axis < newIndices.length; axis++) {
        if (elidedAxes.indexOf(axis) > -1) {
            newIndices[axis] = 0;
        }
        else {
            var originalAxis = unnormalizeAxis(ellipsisInsertionIndex, numElidedAxes, axis);
            var originalValue = originalBegin[originalAxis];
            if (beginMask & 1 << originalAxis) {
                originalValue = 0;
            }
            newIndices[axis] = originalValue;
        }
    }
    return newIndices;
}
// Creates full selection at the elided dimensions. If the dimension matches
// the ellipsis mask, override the current stop value. Otherwise, insert.
function stopIndicesWithElidedDims(endMask, ellipsisInsertionIndex, numElidedAxes, originalEnd, inputShape) {
    var newIndices = inputShape.slice();
    var elidedAxes = getElidedAxes(numElidedAxes, ellipsisInsertionIndex);
    for (var axis = 0; axis < newIndices.length; axis++) {
        if (elidedAxes.indexOf(axis) > -1) {
            newIndices[axis] = Number.MAX_SAFE_INTEGER;
        }
        else {
            var originalAxis = unnormalizeAxis(ellipsisInsertionIndex, numElidedAxes, axis);
            var originalValue = originalEnd[originalAxis];
            if (endMask & 1 << originalAxis) {
                originalValue = Number.MAX_SAFE_INTEGER;
            }
            newIndices[axis] = originalValue;
        }
    }
    for (var i = 0; i < newIndices.length; i++) {
        // Handle negative indices
        var axisSize = inputShape[i];
        if (newIndices[i] < 0) {
            newIndices[i] += axisSize;
        }
        newIndices[i] = clamp(0, newIndices[i], inputShape[i]);
    }
    return newIndices;
}
function stridesForAxis(strides, axis, ellipsisMask) {
    var stride = strides[axis];
    if (ellipsisMask & (1 << axis) || stride == null) {
        stride = 1;
    }
    return stride;
}
function startForAxis(beginMask, startIndices, strides, inputShape, axis, ellipsisMask) {
    // Begin with the specified index
    var start = startIndices[axis];
    var stride = strides[axis] || 1;
    // Check the axis bit from right of masked axes, or the begin index is not set
    // for the axis.
    if (beginMask & 1 << axis || ellipsisMask & 1 << axis || start == null) {
        if (stride > 0) {
            // Forward iteration - use the first element. These values will get
            // clamped below (Note: We could have set them to 0 and axis_size-1, but
            // use lowest() and max() to maintain symmetry with StopForAxis())
            start = Number.MIN_SAFE_INTEGER;
        }
        else {
            // Backward iteration - use the last element.
            start = Number.MAX_SAFE_INTEGER;
        }
    }
    // Handle negative indices
    var axisSize = inputShape[axis];
    if (start < 0) {
        start += axisSize;
    }
    // Clamping
    start = clamp(0, start, axisSize - 1);
    return start;
}
function stopForAxis(endMask, stopIndices, strides, inputShape, axis, ellipsisMask) {
    // Begin with the specified index
    var stop = stopIndices[axis];
    var stride = strides[axis] || 1;
    // Check the axis bit from right of masked axes, or if the stop index is not
    // set for this axis.
    if (endMask & (1 << axis) || ellipsisMask & (1 << axis) || stop == null) {
        if (stride > 0) {
            // Forward iteration - use the last element. These values will get
            // clamped below
            stop = Number.MAX_SAFE_INTEGER;
        }
        else {
            // Backward iteration - use the first element.
            stop = Number.MIN_SAFE_INTEGER;
        }
    }
    // Handle negative indices
    var axisSize = inputShape[axis];
    if (stop < 0) {
        stop += axisSize;
    }
    // Clamping
    // Because the end index points one past the last element, we need slightly
    // different clamping ranges depending on the direction.
    if (stride > 0) {
        // Forward iteration
        stop = clamp(0, stop, axisSize);
    }
    else {
        // Backward iteration
        stop = clamp(-1, stop, axisSize - 1);
    }
    return stop;
}
/**
 * Returns true if the slice occupies a continous set of elements in the
 * 'flat' space.
 */
function isSliceContinous(shape, begin, size) {
    // Index of the first axis that has size > 1.
    var firstNonOneAxis = size.length;
    for (var i = 0; i < size.length; i++) {
        if (size[i] > 1) {
            firstNonOneAxis = i;
            break;
        }
    }
    for (var i = firstNonOneAxis + 1; i < size.length; i++) {
        if (begin[i] > 0 || size[i] !== shape[i]) {
            return false;
        }
    }
    return true;
}
function computeFlatOffset(begin, strides) {
    var flatOffset = begin.length > 0 ? begin[begin.length - 1] : 1;
    for (var i = 0; i < begin.length - 1; i++) {
        flatOffset += begin[i] * strides[i];
    }
    return flatOffset;
}
function parseSliceParams(x, begin, size) {
    // The following logic allows for more ergonomic calls.
    var begin_;
    var xRank = x.shape.length;
    if (typeof begin === 'number') {
        begin_ = [begin].concat(new Array(xRank - 1).fill(0));
    }
    else if (begin.length < xRank) {
        begin_ = begin.concat(new Array(xRank - begin.length).fill(0));
    }
    else {
        begin_ = begin.slice();
    }
    begin_.forEach(function (d) {
        assert(d !== -1, function () { return 'slice() does not support negative begin indexing.'; });
    });
    var size_;
    if (size == null) {
        size_ = new Array(xRank).fill(-1);
    }
    else if (typeof size === 'number') {
        size_ = [size].concat(new Array(xRank - 1).fill(-1));
    }
    else if (size.length < xRank) {
        size_ = size.concat(new Array(xRank - size.length).fill(-1));
    }
    else {
        size_ = size;
    }
    size_ = size_.map(function (d, i) {
        if (d >= 0) {
            return d;
        }
        else {
            assert(d === -1, function () { return "Negative size values should be exactly -1 but got " +
                (d + " for the slice() size at index " + i + "."); });
            return x.shape[i] - begin_[i];
        }
    });
    return [begin_, size_];
}
function sliceInfo(xShape, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask) {
    // make a copy because it may be modified further down.
    var $begin = begin.slice();
    var $end = end.slice();
    var $strides = strides;
    if (strides == null) {
        $strides = new Array($begin.length);
    }
    var ellipsisAxes = maskToAxes(ellipsisMask);
    if (ellipsisAxes.length > 1) {
        throw new Error('Multiple ellipses in slice is not allowed.');
    }
    if (ellipsisMask !== 0 && newAxisMask !== 0) {
        throw new Error('Using both ellipsisMask and newAxisMask is not yet supported.');
    }
    if (ellipsisMask !== 0 && shrinkAxisMask !== 0) {
        throw new Error('Using both ellipsisMask and shrinkAxisMask is not yet supported.');
    }
    var numInterpolatedAxes = xShape.length - $begin.length;
    // Expand the dims of x based on the newAxisMask.
    var expandAxes = maskToAxes(newAxisMask);
    var newShape = xShape.slice();
    expandAxes.forEach(function (axis) {
        $begin[axis] = 0;
        $end[axis] = 1;
        newShape.splice(axis, 0, 1);
    });
    var _a = getNormalizedAxes(newShape, ellipsisAxes, numInterpolatedAxes, $begin, $end, $strides, beginMask, endMask, ellipsisMask), normalizedBegin = _a.begin, normalizedEnd = _a.end, normalizedStrides = _a.strides;
    $begin = normalizedBegin;
    $end = normalizedEnd;
    $strides = normalizedStrides;
    var shrinkAxes = maskToAxes(shrinkAxisMask);
    // Adjust the ends based on the shrink mask.
    shrinkAxes.forEach(function (axis) {
        $end[axis] = $begin[axis] + 1;
        $strides[axis] = 1;
    });
    // Figure out the output shape.
    var size = computeOutShape($begin, $end, $strides);
    // Remove the axes based on shrinkMask.
    var outShape = size.filter(function (_, axis) { return shrinkAxes.indexOf(axis) === -1; });
    var nonStrided = $strides.every(function (v) { return v === 1; });
    return { nonStrided: nonStrided, $begin: $begin, $end: $end, $strides: $strides, size: size, newShape: newShape, outShape: outShape };
}

var slice_util = {
    __proto__: null,
    assertParamsValid: assertParamsValid,
    maskToAxes: maskToAxes,
    computeOutShape: computeOutShape,
    stridesWithElidedDims: stridesWithElidedDims,
    getNormalizedAxes: getNormalizedAxes,
    startIndicesWithElidedDims: startIndicesWithElidedDims,
    stopIndicesWithElidedDims: stopIndicesWithElidedDims,
    stridesForAxis: stridesForAxis,
    startForAxis: startForAxis,
    stopForAxis: stopForAxis,
    isSliceContinous: isSliceContinous,
    computeFlatOffset: computeFlatOffset,
    parseSliceParams: parseSliceParams,
    sliceInfo: sliceInfo
};

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Serializable defines the serialization contract.
 *
 * TFJS requires serializable classes to return their className when asked
 * to avoid issues with minification.
 */
var Serializable = /** @class */ (function () {
    function Serializable() {
    }
    /**
     * Return the class name for this class to use in serialization contexts.
     *
     * Generally speaking this will be the same thing that constructor.name
     * would have returned.  However, the class name needs to be robust
     * against minification for serialization/deserialization to work properly.
     *
     * There's also places such as initializers.VarianceScaling, where
     * implementation details between different languages led to different
     * class hierarchies and a non-leaf node is used for serialization purposes.
     */
    Serializable.prototype.getClassName = function () {
        return this.constructor
            .className;
    };
    /**
     * Creates an instance of T from a ConfigDict.
     *
     * This works for most descendants of serializable.  A few need to
     * provide special handling.
     * @param cls A Constructor for the class to instantiate.
     * @param config The Configuration for the object.
     */
    /** @nocollapse */
    Serializable.fromConfig = function (cls, config) {
        return new cls(config);
    };
    return Serializable;
}());
/**
 * Maps string keys to class constructors.
 *
 * Used during (de)serialization from the cross-language JSON format, which
 * requires the class name in the serialization format matches the class
 * names as used in Python, should it exist.
 */
var SerializationMap = /** @class */ (function () {
    function SerializationMap() {
        this.classNameMap = {};
    }
    /**
     * Returns the singleton instance of the map.
     */
    SerializationMap.getMap = function () {
        if (SerializationMap.instance == null) {
            SerializationMap.instance = new SerializationMap();
        }
        return SerializationMap.instance;
    };
    /**
     * Registers the class as serializable.
     */
    SerializationMap.register = function (cls) {
        SerializationMap.getMap().classNameMap[cls.className] =
            [cls, cls.fromConfig];
    };
    return SerializationMap;
}());
/**
 * Register a class with the serialization map of TensorFlow.js.
 *
 * This is often used for registering custom Layers, so they can be
 * serialized and deserialized.
 *
 * Example:
 *
 * ```js
 * class MyCustomLayer extends tf.layers.Layer {
 *   static className = 'MyCustomLayer';
 *
 *   constructor(config) {
 *     super(config);
 *   }
 * }
 * tf.serialization.registerClass(MyCustomLayer);
 * ```
 *
 * @param cls The class to be registered. It must have a public static member
 *   called `className` defined and the value must be a non-empty string.
 *
 * @doc {heading: 'Models', subheading: 'Serialization', ignoreCI: true}
 */
function registerClass(cls) {
    assert(cls.className != null, function () { return "Class being registered does not have the static className " +
        "property defined."; });
    assert(typeof cls.className === 'string', function () { return "className is required to be a string, but got type " +
        typeof cls.className; });
    assert(cls.className.length > 0, function () { return "Class being registered has an empty-string as its className, " +
        "which is disallowed."; });
    SerializationMap.register(cls);
}

var serialization = {
    __proto__: null,
    Serializable: Serializable,
    SerializationMap: SerializationMap,
    registerClass: registerClass
};

/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var TEST_EPSILON_FLOAT32 = 1e-3;
var TEST_EPSILON_FLOAT16 = 1e-1;
function expectArraysClose(actual, expected, epsilon) {
    if (epsilon == null) {
        epsilon = testEpsilon();
    }
    return expectArraysPredicate(actual, expected, function (a, b) { return areClose(a, b, epsilon); });
}
function testEpsilon() {
    return ENGINE.backend.floatPrecision() === 32 ? TEST_EPSILON_FLOAT32 :
        TEST_EPSILON_FLOAT16;
}
function expectArraysPredicate(actual, expected, predicate) {
    var checkClassType = true;
    if (isTypedArray(actual) || isTypedArray(expected)) {
        checkClassType = false;
    }
    if (isTypedArray(actual) && isTypedArray(expected)) {
        checkClassType = true;
    }
    if (checkClassType) {
        var aType = actual.constructor.name;
        var bType = expected.constructor.name;
        if (aType !== bType) {
            throw new Error("Arrays are of different type. Actual: " + aType + ". " +
                ("Expected: " + bType));
        }
    }
    if (Array.isArray(actual) && Array.isArray(expected)) {
        var actualShape = inferShape(actual);
        var expectedShape = inferShape(expected);
        if (!arraysEqual(actualShape, expectedShape)) {
            throw new Error("Arrays have different shapes. " +
                ("Actual: [" + actualShape + "]. Expected: [" + expectedShape + "]"));
        }
    }
    var actualFlat = isTypedArray(actual) ? actual : flatten(actual);
    var expectedFlat = isTypedArray(expected) ?
        expected :
        flatten(expected);
    if (actualFlat.length !== expectedFlat.length) {
        throw new Error("Arrays have different lengths actual: " + actualFlat.length + " vs " +
            ("expected: " + expectedFlat.length + ".\n") +
            ("Actual:   " + actualFlat + ".\n") +
            ("Expected: " + expectedFlat + "."));
    }
    for (var i = 0; i < expectedFlat.length; ++i) {
        var a = actualFlat[i];
        var e = expectedFlat[i];
        if (!predicate(a, e)) {
            throw new Error("Arrays differ: actual[" + i + "] = " + a + ", expected[" + i + "] = " + e + ".\n" +
                ("Actual:   " + actualFlat + ".\n") +
                ("Expected: " + expectedFlat + "."));
        }
    }
}
function expectPromiseToFail(fn, done) {
    fn().then(function () { return done.fail(); }, function () { return done(); });
}
function expectArraysEqual(actual, expected) {
    var exp = typeof expected === 'string' || typeof expected === 'number' ||
        typeof expected === 'boolean' ?
        [expected] :
        expected;
    if (isString(actual) || isString(actual[0]) ||
        isString(expected) || isString(expected[0])) {
        // tslint:disable-next-line: triple-equals
        return expectArraysPredicate(actual, exp, function (a, b) { return a == b; });
    }
    return expectArraysPredicate(actual, expected, function (a, b) { return areClose(a, b, 0); });
}
function expectNumbersClose(a, e, epsilon) {
    if (epsilon == null) {
        epsilon = testEpsilon();
    }
    if (!areClose(a, e, epsilon)) {
        throw new Error("Numbers differ: actual === " + a + ", expected === " + e);
    }
}
function areClose(a, e, epsilon) {
    if (!isFinite(a) && !isFinite(e)) {
        return true;
    }
    if (isNaN(a) || isNaN(e) || Math.abs(a - e) > epsilon) {
        return false;
    }
    return true;
}
function expectValuesInRange(actual, low, high) {
    for (var i = 0; i < actual.length; i++) {
        if (actual[i] < low || actual[i] > high) {
            throw new Error("Value out of range:" + actual[i] + " low: " + low + ", high: " + high);
        }
    }
}
function expectArrayBuffersEqual(actual, expected) {
    // Safari & Jasmine don't like comparing ArrayBuffers directly. Wrapping in
    // a Float32Array solves this issue.
    expect(new Float32Array(actual)).toEqual(new Float32Array(expected));
}
/** Encodes strings into utf-8 bytes. */
function encodeStrings(a) {
    for (var i = 0; i < a.length; i++) {
        var val = a[i];
        if (Array.isArray(val)) {
            encodeStrings(val);
        }
        else {
            a[i] = encodeString(val);
        }
    }
    return a;
}

var test_util = {
    __proto__: null,
    TEST_EPSILON_FLOAT16: TEST_EPSILON_FLOAT16,
    expectArraysClose: expectArraysClose,
    testEpsilon: testEpsilon,
    expectPromiseToFail: expectPromiseToFail,
    expectArraysEqual: expectArraysEqual,
    expectNumbersClose: expectNumbersClose,
    expectValuesInRange: expectValuesInRange,
    expectArrayBuffersEqual: expectArrayBuffersEqual,
    encodeStrings: encodeStrings
};

/** @license See the LICENSE file. */
// This code is auto-generated, do not modify this file!
var version = '3.7.0';

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Enables production mode which disables correctness checks in favor of
 * performance.
 *
 * @doc {heading: 'Environment'}
 */
function enableProdMode() {
    env().set('PROD', true);
}
/**
 * Enables debug mode which will log information about all executed kernels:
 * the elapsed time of the kernel execution, as well as the rank, shape, and
 * size of the output tensor.
 *
 * Debug mode will significantly slow down your application as it will
 * download the result of every operation to the CPU. This should not be used in
 * production. Debug mode does not affect the timing information of the kernel
 * execution as we do not measure download time in the kernel execution time.
 *
 * See also: `tf.profile`, `tf.memory`.
 *
 * @doc {heading: 'Environment'}
 */
function enableDebugMode() {
    env().set('DEBUG', true);
}
/** Globally disables deprecation warnings */
function disableDeprecationWarnings() {
    env().set('DEPRECATION_WARNINGS_ENABLED', false);
    console.warn("TensorFlow.js deprecation warnings have been disabled.");
}
/** Warn users about deprecated functionality. */
function deprecationWarn(msg) {
    if (env().getBool('DEPRECATION_WARNINGS_ENABLED')) {
        console.warn(msg + ' You can disable deprecation warnings with ' +
            'tf.disableDeprecationWarnings().');
    }
}
/**
 * Dispose all variables kept in backend engine.
 *
 * @doc {heading: 'Environment'}
 */
function disposeVariables() {
    ENGINE.disposeVariables();
}
/**
 * It returns the global engine that keeps track of all tensors and backends.
 *
 * @doc {heading: 'Environment'}
 */
function engine() {
    return ENGINE;
}
/**
 * Returns memory info at the current time in the program. The result is an
 * object with the following properties:
 *
 * - `numBytes`: Number of bytes allocated (undisposed) at this time.
 * - `numTensors`: Number of unique tensors allocated.
 * - `numDataBuffers`: Number of unique data buffers allocated
 *   (undisposed) at this time, which is ≤ the number of tensors
 *   (e.g. `a.reshape(newShape)` makes a new Tensor that shares the same
 *   data buffer with `a`).
 * - `unreliable`: True if the memory usage is unreliable. See `reasons` when
 *    `unreliable` is true.
 * - `reasons`: `string[]`, reasons why the memory is unreliable, present if
 *    `unreliable` is true.
 *
 * WebGL Properties:
 * - `numBytesInGPU`: Number of bytes allocated (undisposed) in the GPU only at
 *     this time.
 *
 * @doc {heading: 'Performance', subheading: 'Memory'}
 */
function memory() {
    return ENGINE.memory();
}
/**
 * Executes the provided function `f()` and returns a promise that resolves
 * with information about the function's memory use:
 * - `newBytes`: the number of new bytes allocated
 * - `newTensors`: the number of new tensors created
 * - `peakBytes`: the peak number of bytes allocated
 * - `kernels`: an array of objects for each kernel involved that reports
 * their input and output shapes, number of bytes used, and number of new
 * tensors created.
 * - `kernelNames`: an array of unique strings with just the names of the
 * kernels in the `kernels` array.
 *
 * ```js
 * const profile = await tf.profile(() => {
 *   const x = tf.tensor1d([1, 2, 3]);
 *   let x2 = x.square();
 *   x2.dispose();
 *   x2 = x.square();
 *   x2.dispose();
 *   return x;
 * });
 *
 * console.log(`newBytes: ${profile.newBytes}`);
 * console.log(`newTensors: ${profile.newTensors}`);
 * console.log(`byte usage over all kernels: ${profile.kernels.map(k =>
 * k.totalBytesSnapshot)}`);
 * ```
 *
 *
 * @doc {heading: 'Performance', subheading: 'Profile'}
 */
function profile(f) {
    return ENGINE.profile(f);
}
/**
 * Executes the provided function `fn` and after it is executed, cleans up all
 * intermediate tensors allocated by `fn` except those returned by `fn`.
 * `fn` must not return a Promise (async functions not allowed). The returned
 * result can be a complex object.
 *
 * Using this method helps avoid memory leaks. In general, wrap calls to
 * operations in `tf.tidy` for automatic memory cleanup.
 *
 * NOTE: Variables do *not* get cleaned up when inside a tidy(). If you want to
 * dispose variables, please use `tf.disposeVariables` or call dispose()
 * directly on variables.
 *
 * ```js
 * // y = 2 ^ 2 + 1
 * const y = tf.tidy(() => {
 *   // a, b, and one will be cleaned up when the tidy ends.
 *   const one = tf.scalar(1);
 *   const a = tf.scalar(2);
 *   const b = a.square();
 *
 *   console.log('numTensors (in tidy): ' + tf.memory().numTensors);
 *
 *   // The value returned inside the tidy function will return
 *   // through the tidy, in this case to the variable y.
 *   return b.add(one);
 * });
 *
 * console.log('numTensors (outside tidy): ' + tf.memory().numTensors);
 * y.print();
 * ```
 *
 * @param nameOrFn The name of the closure, or the function to execute.
 *     If a name is provided, the 2nd argument should be the function.
 *     If debug mode is on, the timing and the memory usage of the function
 *     will be tracked and displayed on the console using the provided name.
 * @param fn The function to execute.
 *
 * @doc {heading: 'Performance', subheading: 'Memory'}
 */
function tidy(nameOrFn, fn) {
    return ENGINE.tidy(nameOrFn, fn);
}
/**
 * Disposes any `tf.Tensor`s found within the provided object.
 *
 * @param container an object that may be a `tf.Tensor` or may directly
 *     contain `tf.Tensor`s, such as a `Tensor[]` or `{key: Tensor, ...}`. If
 *     the object is not a `tf.Tensor` or does not contain `Tensors`, nothing
 *     happens. In general it is safe to pass any object here, except that
 *     `Promise`s are not supported.
 *
 * @doc {heading: 'Performance', subheading: 'Memory'}
 */
function dispose(container) {
    var tensors = getTensorsInContainer(container);
    tensors.forEach(function (tensor) { return tensor.dispose(); });
}
/**
 * Keeps a `tf.Tensor` generated inside a `tf.tidy` from being disposed
 * automatically.
 *
 * ```js
 * let b;
 * const y = tf.tidy(() => {
 *   const one = tf.scalar(1);
 *   const a = tf.scalar(2);
 *
 *   // b will not be cleaned up by the tidy. a and one will be cleaned up
 *   // when the tidy ends.
 *   b = tf.keep(a.square());
 *
 *   console.log('numTensors (in tidy): ' + tf.memory().numTensors);
 *
 *   // The value returned inside the tidy function will return
 *   // through the tidy, in this case to the variable y.
 *   return b.add(one);
 * });
 *
 * console.log('numTensors (outside tidy): ' + tf.memory().numTensors);
 * console.log('y:');
 * y.print();
 * console.log('b:');
 * b.print();
 * ```
 *
 * @param result The tensor to keep from being disposed.
 *
 * @doc {heading: 'Performance', subheading: 'Memory'}
 */
function keep(result) {
    return ENGINE.keep(result);
}
/**
 * Executes `f()` and returns a promise that resolves with timing
 * information.
 *
 * The result is an object with the following properties:
 *
 * - `wallMs`: Wall execution time.
 * - `kernelMs`: Kernel execution time, ignoring data transfer. If using the
 * WebGL backend and the query timer extension is not available, this will
 * return an error object.
 * - On `WebGL` The following additional properties exist:
 *   - `uploadWaitMs`: CPU blocking time on texture uploads.
 *   - `downloadWaitMs`: CPU blocking time on texture downloads (readPixels).
 *
 * ```js
 * const x = tf.randomNormal([20, 20]);
 * const time = await tf.time(() => x.matMul(x));
 *
 * console.log(`kernelMs: ${time.kernelMs}, wallTimeMs: ${time.wallMs}`);
 * ```
 *
 * @param f The function to execute and time.
 *
 * @doc {heading: 'Performance', subheading: 'Timing'}
 */
function time(f) {
    return ENGINE.time(f);
}
/**
 * Sets the backend (cpu, webgl, wasm, etc) responsible for creating tensors and
 * executing operations on those tensors. Returns a promise that resolves
 * to a boolean if the backend initialization was successful.
 *
 * Note this disposes the current backend, if any, as well as any tensors
 * associated with it. A new backend is initialized, even if it is of the
 * same type as the previous one.
 *
 * @param backendName The name of the backend. Currently supports
 *     `'webgl'|'cpu'` in the browser, `'tensorflow'` under node.js
 *     (requires tfjs-node), and `'wasm'` (requires tfjs-backend-wasm).
 *
 * @doc {heading: 'Backends'}
 */
function setBackend(backendName) {
    return ENGINE.setBackend(backendName);
}
/**
 * Returns a promise that resolves when the currently selected backend (or the
 * highest priority one) has initialized. Await this promise when you are using
 * a backend that has async initialization.
 *
 * @doc {heading: 'Backends'}
 */
function ready() {
    return ENGINE.ready();
}
/**
 * Returns the current backend name (cpu, webgl, etc). The backend is
 * responsible for creating tensors and executing operations on those tensors.
 *
 * @doc {heading: 'Backends'}
 */
function getBackend() {
    return ENGINE.backendName;
}
/**
 * Removes a backend and the registered factory.
 *
 * @doc {heading: 'Backends'}
 */
function removeBackend(name) {
    ENGINE.removeBackend(name);
}
/**
 * Finds the backend registered under the provided name. Returns null if the
 * name is not in the registry, or the registration hasn't finished yet.
 */
function findBackend(name) {
    return ENGINE.findBackend(name);
}
/**
 * Finds the backend factory registered under the provided name. Returns a
 * function that produces a new backend when called. Returns null if the name
 * is not in the registry.
 */
function findBackendFactory(name) {
    return ENGINE.findBackendFactory(name);
}
/**
 * Registers a global backend. The registration should happen when importing
 * a module file (e.g. when importing `backend_webgl.ts`), and is used for
 * modular builds (e.g. custom tfjs bundle with only webgl support).
 *
 * @param factory The backend factory function. When called, it should
 * return a backend instance, or a promise of an instance.
 * @param priority The priority of the backend (higher = more important).
 *     In case multiple backends are registered, the priority is used to find
 *     the best backend. Defaults to 1.
 * @return False if there is already a registered backend under this name, true
 *     if not.
 *
 * @doc {heading: 'Backends'}
 */
function registerBackend(name, factory, priority) {
    if (priority === void 0) { priority = 1; }
    return ENGINE.registerBackend(name, factory, priority);
}
/**
 * Gets the current backend. If no backends have been initialized, this will
 * attempt to initialize the best backend. Will throw an error if the highest
 * priority backend has async initialization, in which case, you should call
 * 'await tf.ready()' before running other code.
 *
 * @doc {heading: 'Backends'}
 */
function backend() {
    return ENGINE.backend;
}
/**
 * Sets the global platform.
 *
 * @param platformName The name of this platform.
 * @param platform A platform implementation.
 */
function setPlatform(platformName, platform) {
    env().setPlatform(platformName, platform);
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 *