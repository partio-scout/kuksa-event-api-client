import type { RequestInfo, RequestInit, Response } from 'node-fetch'

export type FetchFunction = (
  url: RequestInfo,
  init?: RequestInit,
) => Promise<Response>
export function importNodeFetch(): FetchFunction
