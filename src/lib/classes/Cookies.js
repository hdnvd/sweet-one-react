import { Cookies as ReactCookies } from 'react-cookie';

const warning = () => {
    return false;
};

export default class Cookies {
    constructor() {
        if (typeof window !== 'undefined') this._cookies = new ReactCookies();
        else
            this._cookies = {
                get: warning,
                set: warning,
                remove: warning,
            };
    }
    setCookies(opts) {
        this._cookies = new ReactCookies(Object.assign({}, opts));
    }
    get cookies() {
        return this._cookies;
    }
}

