import React, { Component } from 'react';
import { Table, TableData } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      TimeStamp: 'date',
      ABCStockPrice: 'float',
      DEFStockPrice: 'float',
      ratio: 'float',
      upperBound: 'float',
      lowerBound: 'float',
      priceAlert: 'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["TimeStamp"]');
      elem.setAttribute('columns', '["ratio", "upperBound", "lowerBound", "priceAlert"]');
      elem.setAttribute('aggregates', JSON.stringify({
        TimeStamp: 'distinct count',
        ABCStockPrice: 'avg',
        DEFStockPrice: 'avg',
        ratio: 'avg',
        upperBound: 'avg',
        lowerBound: 'avg',
        priceAlert: 'avg',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),
      ] as unknown as TableData);
    }
  }
}

export default Graph;
