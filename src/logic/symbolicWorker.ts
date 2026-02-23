/**
 * TODO: implement this to avoid blocking the main thread with heavy symbolic computations.
 * 
 *
 * Runs symbolic computation (parse → compose → simplify) off the main thread.
 * Comunicación:
 *   IN  → { id, formula, iterations }
 *   OUT → { id, result }  |  { id, error }
 */

import { parseExpr }    from "../symbolic/parser";
import { stringifyMath } from "../symbolic/stringify";
import { composeAST }   from "../symbolic/composeAST";
import { simplifyAST }  from "../symbolic/simplifyAST";

export interface WorkerRequest {
  id: number;
  formula: string;
  iterations: number;
}

export interface WorkerResponse {
  id: number;
  result?: {
    base:  { pretty: string };
    steps: { pretty: string }[];
  };
  error?: string;
}

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { id, formula, iterations } = e.data;

  try {
    const formulaFixed = formula.replace(/\bTAU\b/g, "(PI*2)");
    const base    = parseExpr(formulaFixed);
    let current   = parseExpr("x");
    const steps: { pretty: string }[] = [];

    for (let i = 0; i < iterations; i++) {
      current = simplifyAST(composeAST(base, current));
      steps.push({ pretty: stringifyMath(current) });
    }

    const response: WorkerResponse = {
      id,
      result: { base: { pretty: stringifyMath(base) }, steps },
    };
    self.postMessage(response);

  } catch (err) {
    const response: WorkerResponse = { id, error: String(err) };
    self.postMessage(response);
  }
};