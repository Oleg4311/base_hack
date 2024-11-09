"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIsoDate = exports.lz = void 0;
const lz = (n) => `0${n}`.slice(-2);
exports.lz = lz;
const toIsoDate = (date) => {
    const [day, month, year] = date.split(".");
    return `${year}-${(0, exports.lz)(month)}-${(0, exports.lz)(day)}`;
};
exports.toIsoDate = toIsoDate;
