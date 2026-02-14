/**
 * @file cli-interface.js
 * @description Gecentraliseerde readline interface voor alle wizards.
 */

import readline from 'readline';

let _rl = null;

export const getRl = () => {
    if (!_rl) {
        _rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    return _rl;
};

// Exporteer rl als een getter voor backwards compatibility indien mogelijk, 
// maar we gebruiken liever getRl(). Voor nu laten we rl bestaan als proxy.
export const rl = {
    question: (q, cb) => getRl().question(q, cb),
    close: () => {
        if (_rl) {
            _rl.close();
            _rl = null;
        }
    }
};

// Exporteer een promise-gebaseerde 'ask' functie.
export const ask = (query) => new Promise((resolve) => getRl().question(query, resolve));

export const closeRl = () => rl.close();
