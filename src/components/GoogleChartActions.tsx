import * as React from "react";
import {
  GoogleViz,
  GoogleChartWrapper,
  ReactGoogleChartProps,
  GoogleChartAction,
  ReactGoogleChartPropsWithDefaults
} from "../types";

import { ContextConsumer } from "../Context";

export type ChartDrawArgs = {
  data: ReactGoogleChartProps["data"];
};

export interface Props {
  googleChartWrapper: GoogleChartWrapper;
  google: GoogleViz;
  chartActions: ReactGoogleChartPropsWithDefaults["chartActions"];
}

export class GoogleChartActionsInner extends React.Component<Props> {
  componentDidMount() {
    const { chartActions } = this.props;
    this.setChartActions(chartActions, []);
  }
  componentDidUpdate(prevProps: Props) {
    const { chartActions } = this.props;
    this.setChartActions(chartActions, prevProps.chartActions);
  }
  shouldComponentUpdate() {
    return false;
  }
  private setChartActions = (
    currentActions: GoogleChartAction[],
    previousActions: GoogleChartAction[]
  ) => {
    const { googleChartWrapper } = this.props;
    if (googleChartWrapper === null) return;

    const chart = googleChartWrapper.getChart();
    if (chart === null) return;

    for (let chartAction of previousActions) {
      chart.removeAction(chartAction.id);
    }
    for (let chartAction of currentActions) {
      chart.setAction({
        id: chartAction.id,
        text: chartAction.text,
        action: () => chartAction.action(googleChartWrapper)
      });
    }
  };
  render() {
    return null;
  }
}

export class GoogleChartActions extends React.Component<Props> {
  render() {
    const { google, googleChartWrapper } = this.props;
    return (
      <ContextConsumer
        render={propsFromContext => {
          return (
            <GoogleChartActionsInner
              googleChartWrapper={googleChartWrapper}
              google={google}
              chartActions={propsFromContext.chartActions}
            />
          );
          return null;
        }}
      />
    );
  }
}
