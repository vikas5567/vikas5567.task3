import React, { Component } from 'react';
import { Table , TableData } from '@finos/perspective';
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
      // added price_abc and price_def to calculate the ratio won't be displayed in the graph
      price_abc : 'float',
      price_def : 'float',
      // added ratio to show the ratio of price_abc and price_def
      ratio : 'float',
      // timestamp for x-axis
      timestamp : 'date',
      // upper bound and lower bound are some constant values
      upper_bound : 'float',
      lower_bound : 'float',
      // to show the trigger if the ratio either cross upper bound or lower bound
      trigger_alert : 'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      // adding ratio , upper_bound , lower_bound and trigger_alert to columns attributes to show in the graph
      elem.setAttribute('columns', '["ratio", "upper_bound", "lower_bound", "trigger_alert"]');
      // aggregates allows us to handle the duplicate data
      elem.setAttribute('aggregates', JSON.stringify({
        price_abc : 'avg',
        price_def : 'avg',
        ratio : 'avg',
        timestamp : 'distinct count',
        upper_bound : 'avg',
        lower_bound : 'avg',
        trigger_alert : 'avg',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      // TableData in the import lines as it wasn't present earlier
      this.table.update([ DataManipulator.generateRow(this.props.data),] as unknown as TableData);
    }
  }
}

export default Graph;
