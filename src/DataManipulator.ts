import { ServerRespond } from './DataStreamer';

export interface Row {
  ratio: number;
  lower_bound: number;
  upper_bound: number;
  trigger_alert?: number;
  price_abc: number;
  price_def: number;
  timestamp: Date;
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1.05;
    const lowerBound = 0.95;
    let triggerAlert;

    if (ratio > upperBound || ratio < lowerBound) {
      triggerAlert = ratio;
    }

    return {
      ratio,
      lower_bound: lowerBound,
      upper_bound: upperBound,
      trigger_alert: triggerAlert,
      price_abc: priceABC,
      price_def: priceDEF,
      timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ? serverResponds[0].timestamp : serverResponds[1].timestamp,
    };
  }
}
