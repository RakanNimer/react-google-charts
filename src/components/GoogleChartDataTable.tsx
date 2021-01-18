import * as React from "react";
import {
  GoogleViz,
  GoogleChartWrapper,
  GoogleDataTable,
  ReactGoogleChartProps,
  GoogleChartDashboard,
  ReactGoogleChartPropsWithDefaults
} from "../types";
import { DEFAULT_CHART_COLORS } from "../constants";

import { loadDataTableFromSpreadSheet } from "../load-data-table-from-spreadsheet";
import { ContextConsumer } from "../Context";

const GRAY_COLOR = "#CCCCCC";
export type ChartDrawArgs = {
  data: ReactGoogleChartProps["data"];
};

export type GoogleChartDataTableProps = {
  googleChartWrapper: GoogleChartWrapper;
  google: GoogleViz;
  googleChartDashboard: GoogleChartDashboard | null;
};
interface State {
  hiddenColumns: string[];
}
export class GoogleChartDataTableInner extends React.Component<
  ReactGoogleChartPropsWithDefaults & GoogleChartDataTableProps,
  State
> {
  state = {
    hiddenColumns: []
  } as State;

  private listenToLegendToggle = () => {
    const { google, googleChartWrapper } = this.props;
    google.visualization.events.addListener(
      googleChartWrapper,
      "select",
      () => {
        const chart = googleChartWrapper.getChart();
        const selection = chart.getSelection();
        const dataTable = googleChartWrapper.getDataTable();
        if (
          selection.length === 0 ||
          // We want to listen to when a whole row is selected. This is the case only when row === null
          selection[0].row !== null ||
          dataTable === null
        ) {
          return;
        }
        const columnIndex = selection[0].column;
        const columnID = this.getColumnID(dataTable, columnIndex);
        if (this.state.hiddenColumns.includes(columnID)) {
          this.setState(state => ({
            ...state,
            hiddenColumns: [
              ...state.hiddenColumns.filter(colID => colID !== columnID)
            ]
          }));
        } else {
          this.setState(state => ({
            ...state,
            hiddenColumns: [...state.hiddenColumns, columnID]
          }));
        }
      }
    );
  };

  private applyFormatters = (dataTable: GoogleDataTable, formatters: any[]) => {
    const { google } = this.props;
    for (let formatter of formatters) {
      switch (formatter.type) {
        case "ArrowFormat": {
          const vizFormatter = new google.visualization.ArrowFormat(
            formatter.options
          );
          vizFormatter.format(dataTable, formatter.column);
          break;
        }
        case "BarFormat": {
          const vizFormatter = new google.visualization.BarFormat(
            formatter.options
          );
          vizFormatter.format(dataTable, formatter.column);
          break;
        }
        case "ColorFormat": {
          const vizFormatter = new google.visualization.ColorFormat(
            formatter.options
          );
          const { ranges } = formatter;
          for (let range of ranges) {
            vizFormatter.addRange(...range);
          }
          vizFormatter.format(dataTable, formatter.column);
          break;
        }
        case "DateFormat": {
          const vizFormatter = new google.visualization.DateFormat(
            formatter.options
          );
          vizFormatter.format(dataTable, formatter.column);
          break;
        }
        case "NumberFormat": {
          const vizFormatter = new google.visualization.NumberFormat(
            formatter.options
          );
          vizFormatter.format(dataTable, formatter.column);
          break;
        }
        case "PatternFormat": {
          const vizFormatter = new google.visualization.PatternFormat(
            formatter.options
          );
          vizFormatter.format(dataTable, formatter.column);
          break;
        }
      }
    }
  };
  private getColumnID = (dataTable: GoogleDataTable, columnIndex: number) => {
    return (
      dataTable.getColumnId(columnIndex) ||
      dataTable.getColumnLabel(columnIndex)
    );
  };
  private draw = async ({
    data,
    diffdata,
    rows,
    columns,
    options,
    legend_toggle,
    legendToggle,
    chartType,
    formatters,
    spreadSheetUrl,
    spreadSheetQueryParameters
  }: ReactGoogleChartPropsWithDefaults) => {
    const { google, googleChartWrapper } = this.props;
    let dataTable: GoogleDataTable;
    let chartDiff = null;
    if (diffdata !== null) {
      const oldData = google.visualization.arrayToDataTable(diffdata.old);
      const newData = google.visualization.arrayToDataTable(diffdata.new);
      chartDiff = google.visualization[chartType].prototype.computeDiff(
        oldData,
        newData
      );
    }
    if (data !== null) {
      if (Array.isArray(data)) {
        dataTable = google.visualization.arrayToDataTable(data);
      } else {
        dataTable = new google.visualization.DataTable(data);
      }
    } else if (rows !== null && columns !== null) {
      dataTable = google.visualization.arrayToDataTable([columns, ...rows]);
    } else if (spreadSheetUrl !== null) {
      dataTable = (await loadDataTableFromSpreadSheet(
        google,
        spreadSheetUrl,
        spreadSheetQueryParameters
      )) as GoogleDataTable;
    } else {
      dataTable = google.visualization.arrayToDataTable([]);
    }
    const columnCount = dataTable.getNumberOfColumns();

    const viewColumns = Array(columnCount)
    .fill(0)
    .map((c, i) => {
      const columnID = this.getColumnID(dataTable, i);
      if (this.state.hiddenColumns.includes(columnID)) {
        return {
          label: dataTable.getColumnLabel(i),
          type: dataTable.getColumnType(i),
          calc: () => null,
        };
      } else {
        return i;
      }
    });
    const chart = googleChartWrapper.getChart();
    if (googleChartWrapper.getChartType() === "Timeline") {
      chart && chart.clearChart();
    }
    googleChartWrapper.setChartType(chartType);
    googleChartWrapper.setOptions(options);
    const viewTable = new google.visualization.DataView(dataTable);
    viewTable.setColumns(viewColumns);
    googleChartWrapper.setDataTable(viewTable);
    googleChartWrapper.draw();
    if (this.props.googleChartDashboard !== null) {
      this.props.googleChartDashboard.draw(dataTable);
    }

    if (chartDiff !== null) {
      googleChartWrapper.setDataTable(chartDiff);
      googleChartWrapper.draw();
    }
    if (formatters !== null) {
      this.applyFormatters(dataTable, formatters);
      googleChartWrapper.setDataTable(dataTable);
      googleChartWrapper.draw();
    }
    if (legendToggle === true || legend_toggle === true) {
      this.grayOutHiddenColumns({ options });
    }
    return;
  };
  private grayOutHiddenColumns = ({
    options
  }: {
    options: ReactGoogleChartPropsWithDefaults["options"];
  }) => {
    const { googleChartWrapper } = this.props;
    const dataTable = googleChartWrapper.getDataTable();
    if (dataTable === null) return;
    const columnCount = dataTable.getNumberOfColumns();
    const hasAHiddenColumn = this.state.hiddenColumns.length > 0;
    if (hasAHiddenColumn === false) return;
    const colors = Array.from({ length: columnCount - 1 }).map(
      (dontcare, i) => {
        const columnID = this.getColumnID(dataTable, i + 1);
        if (this.state.hiddenColumns.includes(columnID)) {
          return GRAY_COLOR;
        } else if (
          typeof options.colors !== "undefined" &&
          options.colors !== null
        ) {
          return options.colors[i];
        } else {
          return DEFAULT_CHART_COLORS[i];
        }
      }
    );
    googleChartWrapper.setOptions({
      ...options,
      colors
    });
    googleChartWrapper.draw();
  };
  private onResize = () => {
    const { googleChartWrapper } = this.props;
    googleChartWrapper.draw();
  };
  componentDidMount() {
    this.draw(this.props);
    window.addEventListener("resize", this.onResize);
    if (this.props.legend_toggle || this.props.legendToggle) {
      this.listenToLegendToggle();
    }
  }

  componentWillUnmount() {
    const { google, googleChartWrapper } = this.props;
    window.removeEventListener("resize", this.onResize);
    google.visualization.events.removeAllListeners(googleChartWrapper);
    if (googleChartWrapper.getChartType() === "Timeline") {
      googleChartWrapper.getChart() &&
        googleChartWrapper.getChart().clearChart();
    }
  }

  componentDidUpdate() {
    this.draw(this.props);
  }
  render() {
    return null;
  }
}

export class GoogleChartDataTable extends React.Component<
  GoogleChartDataTableProps
> {
  componentDidMount() {}

  componentWillUnmount() {}
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { google, googleChartWrapper, googleChartDashboard } = this.props;
    return (
      <ContextConsumer
        render={props => {
          return (
            <GoogleChartDataTableInner
              {...props}
              google={google}
              googleChartWrapper={googleChartWrapper}
              googleChartDashboard={googleChartDashboard}
            />
          );
        }}
      />
    );
  }
}
