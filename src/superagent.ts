/// <reference path="superagent.d.ts" />
import superagent = require('superagent');
import superagentAsPromised = require('superagent-as-promised');

superagentAsPromised(superagent);
export const request = superagent;
