/// <reference path="superagent.d.ts" />
import superagent = require('superagent');
import superagentProxy = require('superagent-proxy');

superagentProxy(superagent);
export const request = superagent;
