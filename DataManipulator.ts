import { ServerRespond } from './DataStreamer';

export interface Row {
  stock: string,
  top_ask_price: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) {
   const priceABC =(serverRespond[0].top_ask_price+serverRespond[0].top_bid.price)/2;
   const priceDEF =(serverRespond[1].top_ask_price+serverRespond[1].top_bid.price)/2;
   ratio=priceABC / priceDEF;
   upper_bound=1+0.05;
   lower_bound=1-0.05;
   return serverResponds.map((el: any) => {
    
      return {
        stock: el.stock,
        top_ask_price: el.top_ask && el.top_ask.price || 0,
        timestamp: el.timestamp,
      };
    })
  }
}
