/// <reference path="superagent.d.ts" />
import superagent = require('superagent');
import superagentAsPromised = require('superagent-as-promised');
import superagentProxy = require('superagent-proxy');

superagentAsPromised(superagent);
superagentProxy(superagent);
export const request = superagent;
