declare module 'superagent' {
  const superagent: any;
  export = superagent;
}

declare module 'superagent-as-promised' {
  function superagentAsPromised(superagent: any): any;
  export = superagentAsPromised;
}

declare module 'superagent-proxy' {
  function superagentProxy(superagent: any): any;
  export = superagentProxy;
}
