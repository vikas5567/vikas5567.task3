import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number, 
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined 
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask_price + serverRespond[0].top_bid_price) / 2;
    const priceDEF = (serverRespond[1].top_ask_price + serverRespond[1].top_bid_price) / 2;
    const ratio = priceABC / priceDEF
    const upper_bound = 1 + 0.05
    const lower_bound = 1 - 0.05
    const timestamp = serverRespond[0].timestamp > serverRespond[1].timestamp
    ? serverRespond[0].timestamp
    : serverRespond[1].timestamp;

    return {
      price_abc : priceABC,
      price_def : priceDEF,
      ratio,
      timestamp,
      upper_bound : upper_bound,
      lower_bound: lower_bound,
      trigger_alert: (ratio > upper_bound || ratio < lower_bound) ? ratio : undefined
    };
  }
}
