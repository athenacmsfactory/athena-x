import { ParserEngine } from '../../5-engine/parser-engine.js';

export class ChocoladeShopTypeParser extends ParserEngine {
    constructor() {
        super('chocolade-shop-type');
    }

    async customParsing(data) {
        return data;
    }
}