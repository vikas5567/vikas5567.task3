import { ServerRespond } from './DataStreamer';

export interface Row {
  TimeStamp: Date,
  ABCStockPrice: number,
  DEFStockPrice: number,
  ratio: number,
  upperBound: number,
  lowerBound: number,
  priceAlert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row{
    const ABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price)/2;
    const DEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price)/2;
    const ratio = ABC / DEF;
    const upper = 1.05;
    const lower = 0.97;
    return {
      TimeStamp: (serverResponds[0].timestamp < serverResponds[1].timestamp) ? 
                  serverResponds[1].timestamp : serverResponds[0].timestamp,
      ABCStockPrice: ABC,
      DEFStockPrice: DEF,
      ratio,
      upperBound: upper,
      lowerBound: lower,
      priceAlert: (ratio > upper || ratio < lower) ? ratio : undefined,
    };
  }
}
