declare module 'superagent' {
  const superagent: any;
  export = superagent;
}

declare module 'superagent-proxy' {
  function superagentProxy(superagent: any): any;
  export = superagentProxy;
}
