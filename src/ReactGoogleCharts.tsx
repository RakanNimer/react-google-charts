import * as React from "react";
import {
  GoogleViz,
  GoogleChartWrapperChartType,
  ChartWrapperOptions,
  GoogleChartWrapper,
  GoogleVizEventName,
  GoogleChartAction,
  GoogleDataTable,
  GoogleDataTableRow,
  GoogleDataTableColumn,
  GoogleChartVersion,
  GoogleChartPackages,
  GoogleDataTableCell
} from "./types";
import { DEFAULT_CHART_COLORS } from "./constants";
import { ReactGoogleChartsLoader } from "./ReactGoogleChartsLoader";

const GRAY_COLOR = "#CCCCCC";

let uniqueID = 0;
const generateUniqueID = () => {
  uniqueID += 1;
  return `reactgooglegraph-${uniqueID}`;
};

export type ReactGoogleChartEvent = {
  eventName: GoogleVizEventName;
  callback: (
    eventCallbackArgs: {
      chartWrapper: GoogleChartWrapper;
      props: ReactGoogleChartPropsWithDefaults;
      google: GoogleViz;
      state: ReactGoogleChartState;
      eventArgs: any;
    }
  ) => void;
};

export type ReactGoogleChartProps = {
  height?: string | number;
  width?: string | number;
  graphID?: string;
  chartType: GoogleChartWrapperChartType;
  diffdata?: {
    old: any;
    new: any;
  };
  options?: ChartWrapperOptions["options"];
  loader?: JSX.Element;
  data?: any[] | {};
  rows?: GoogleDataTableRow[];
  columns?: GoogleDataTableColumn[];
  chartActions?: GoogleChartAction[];
  chartEvents?: ReactGoogleChartEvent[];
  chartVersion?: GoogleChartVersion;
  chartPackages?: GoogleChartPackages[];
  chartLanguage?: string;
  mapsApiKey?: string;
  graph_id?: string;
  legendToggle?: boolean;
  legend_toggle?: boolean;
  getChartWrapper?: (
    chartWrapper: GoogleChartWrapper,
    google: GoogleViz
  ) => void;
  className?: string;
  style?: React.CSSProperties;
  formatters?: {
    column: number;
    type:
      | "ArrowFormat"
      | "BarFormat"
      | "ColorFormat"
      | "DateFormat"
      | "NumberFormat"
      | "PatternFormat";
    options?: {};
  }[];
  spreadSheetUrl?: string;
  spreadSheetQueryParameters?: {
    headers: number;
    gid?: number | string;
    sheet?: string;
    query?: string;
  };
  rootProps?: any;
  // control props
  controlType?: null;
  controlOptions?: null;
};

export type ReactGoogleChartState = {
  loadingStatus: "loading" | "errored" | "ready";
  google: null | GoogleViz;
  hiddenColumns: string[];
};

export const chartDefaultProps = {
  // <DEPRECATED_PROPS>
  graph_id: null as null | string,
  legend_toggle: false,
  // </DEPRECATED_PROPS>
  graphID: null,
  options: {
    colors: null as null | string[]
  } as ChartWrapperOptions["options"],
  data: null,
  rows: null as null | GoogleDataTableCell[][],
  columns: null as null | GoogleDataTableColumn[],
  diffdata: null as null | { old: any; new: any },
  chartEvents: null as null | ReactGoogleChartEvent[],
  legendToggle: false,
  chartActions: null as null | GoogleChartAction[],
  getChartWrapper: (chartWrapper: GoogleChartWrapper, google: GoogleViz) => {},
  className: "",
  style: {},
  formatters: null,
  spreadSheetUrl: null,
  spreadSheetQueryParameters: {
    headers: 1,
    gid: 1
  },
  rootProps: {},
  // control props
  controlType: null,
  controlOptions: null
};

export type ReactGoogleChartPropsWithDefaults = typeof chartDefaultProps &
  ReactGoogleChartProps;

export const loadDataTableFromSpreadSheet = async (
  googleViz: GoogleViz,
  spreadSheetUrl: string,
  urlParams: {
    headers?: number;
    gid?: any;
    sheet?: string;
    query?: string;
  } = {}
) => {
  return new Promise((resolve, reject) => {
    const headers = `${
      urlParams.headers ? `headers=${urlParams.headers}` : `headers=0`
    }`;
    const queryString = `${
      urlParams.query ? `&tq=${encodeURIComponent(urlParams.query)}` : ``
    }`;
    const gid = `${urlParams.gid ? `&gid=${urlParams.gid}` : ""}`;
    const sheet = `${urlParams.sheet ? `&sheet=${urlParams.sheet}` : ""}`;
    const urlQueryString = `${headers}${gid}${sheet}${queryString}`;
    const urlToSpreadSheet = `${spreadSheetUrl}/gviz/tq?${urlQueryString}`; //&tq=${queryString}`;
    const query = new googleViz.visualization.Query(urlToSpreadSheet);
    query.send((response: any) => {
      if (response.isError()) {
        reject(
          `Error in query:  ${response.getMessage()} ${response.getDetailedMessage()}`
        );
      } else {
        resolve(response.getDataTable());
      }
    });
  });
};

export class Chart extends React.Component<
  ReactGoogleChartProps,
  ReactGoogleChartState
> {
  state: ReactGoogleChartState = {
    loadingStatus: "loading",
    google: null,
    hiddenColumns: []
  };
  graphID: null | string = null;
  chartWrapper: GoogleChartWrapper | null = null;
  static defaultProps = chartDefaultProps;
  static defaultProps = chartDefaultProps;
  // dashboard and control references
  Dashboard: null = null;
  dashboardref: null = null;
  controlWrapper: null = null;

  private getGraphID = () => {
    const { graphID, graph_id } = this
      .props as ReactGoogleChartPropsWithDefaults;
    let instanceGraphID: string;
    if (graphID === null && graph_id === null) {
      if (this.graphID === null) {
        instanceGraphID = generateUniqueID();
      } else {
        instanceGraphID = this.graphID;
      }
    } else if (graphID !== null && graph_id === null) {
      instanceGraphID = graphID;
    } else if (graph_id !== null && graphID === null) {
      instanceGraphID = graph_id;
    } else {
      instanceGraphID = graphID;
    }
    this.graphID = instanceGraphID;
    return this.graphID as string;
  };

  private setdashboardref = element => {
    // get reference of dashboard div, so dashboard object can be created
    this.dashboardref = element;
  };

  private draw = async () => {
    if (this.chartWrapper === null || this.state.google === null) return;

    const {
      data,
      diffdata,
      columns,
      rows,
      options,
      legend_toggle,
      legendToggle,
      chartType,
      formatters,
      spreadSheetUrl,
      spreadSheetQueryParameters
    } = this.props as ReactGoogleChartPropsWithDefaults;
    let dataTable: GoogleDataTable;
    let chartDiff = null;
    if (diffdata !== null) {
      const oldData = this.state.google.visualization.arrayToDataTable(
        diffdata.old
      );
      const newData = this.state.google.visualization.arrayToDataTable(
        diffdata.new
      );
      chartDiff = this.state.google.visualization[
        chartType
      ].prototype.computeDiff(oldData, newData);
    }
    if (data !== null) {
      if (Array.isArray(data)) {
        dataTable = this.state.google.visualization.arrayToDataTable(data);
      } else {
        dataTable = new this.state.google.visualization.DataTable(data);
      }
    } else if (rows !== null && columns !== null) {
      dataTable = this.state.google.visualization.arrayToDataTable([
        columns,
        ...rows
      ]);
    } else if (spreadSheetUrl !== null) {
      dataTable = (await loadDataTableFromSpreadSheet(
        this.state.google,
        spreadSheetUrl,
        spreadSheetQueryParameters
      )) as GoogleDataTable;
    } else {
      dataTable = this.state.google.visualization.arrayToDataTable([]);
    }

    const columnCount = dataTable.getNumberOfColumns();
    for (let i = 0; i < columnCount; i += 1) {
      const columnID = this.getColumnID(dataTable, i);
      if (this.state.hiddenColumns.includes(columnID)) {
        const previousColumnLabel = dataTable.getColumnLabel(i);
        const previousColumnID = dataTable.getColumnId(i);
        const previousColumnType = dataTable.getColumnType(i);
        dataTable.removeColumn(i);
        dataTable.addColumn({
          label: previousColumnLabel,
          id: previousColumnID,
          type: previousColumnType
        });
      }
    }
    const chart = this.chartWrapper.getChart();
    if (this.chartWrapper.getChartType() === "Timeline") {
      chart && chart.clearChart();
    }
    if (this.props.controlType === null || this.props.controlOptions === null) {
      // no controls. draw chart normally.
      this.chartWrapper.setOptions(options);
      this.chartWrapper.setDataTable(dataTable);
      this.chartWrapper.draw();
    } else {
      let cOptions = {
        controlType: this.props.controlType,
        containerId: `filter_div_${this.getGraphID()}`,
        options: this.props.controlOptions
      };
      this.controlWrapper = new this.state.google.visualization.ControlWrapper(
        cOptions
      );
      this.Dashboard = new this.state.google.visualization.Dashboard(
        this.dashboardref
      );
      this.Dashboard.bind(this.controlWrapper, this.chartWrapper);
      this.Dashboard.draw(dataTable);
    }

    if (chartDiff !== null) {
      this.chartWrapper.setDataTable(chartDiff);
      this.chartWrapper.draw();
    }
    if (formatters !== null) {
      this.applyFormatters(dataTable, formatters);
      this.chartWrapper.setDataTable(dataTable);
      this.chartWrapper.draw();
    }
    if (legendToggle === true || legend_toggle === true) {
      this.grayOutHiddenColumns();
    }
  };

  private applyFormatters = (dataTable: GoogleDataTable, formatters: any[]) => {
    if (this.state.google === null) return;
    for (let formatter of formatters) {
      switch (formatter.type) {
        case "ArrowFormat": {
          const vizFormatter = new this.state.google.visualization.ArrowFormat(
            formatter.options
          );
          vizFormatter.format(dataTable, formatter.column);
          break;
        }
        case "BarFormat": {
          const vizFormatter = new this.state.google.visualization.BarFormat(
            formatter.options
          );
          vizFormatter.format(dataTable, formatter.column);
          break;
        }
        case "ColorFormat": {
          const vizFormatter = new this.state.google.visualization.ColorFormat(
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
          const vizFormatter = new this.state.google.visualization.DateFormat(
            formatter.options
          );
          vizFormatter.format(dataTable, formatter.column);
          break;
        }
        case "NumberFormat": {
          const vizFormatter = new this.state.google.visualization.NumberFormat(
            formatter.options
          );
          vizFormatter.format(dataTable, formatter.column);
          break;
        }
        case "PatternFormat": {
          const vizFormatter = new this.state.google.visualization.PatternFormat(
            formatter.options
          );
          vizFormatter.format(dataTable, formatter.column);
          break;
        }
      }
    }
  };

  private grayOutHiddenColumns = () => {
    if (this.chartWrapper === null || this.state.google === null) return;
    const dataTable = this.chartWrapper.getDataTable();
    if (dataTable === null) return;

    const columnCount = dataTable.getNumberOfColumns();
    const hasAHiddenColumn = this.state.hiddenColumns.length > 0;
    if (hasAHiddenColumn === false) return;

    const { options } = this.props as ReactGoogleChartPropsWithDefaults;

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
    this.chartWrapper.setOptions({
      ...this.props.options,
      colors
    });
    this.chartWrapper.draw();
  };
  onResize = () => {
    if (this.chartWrapper === null) return;
    this.chartWrapper.draw();
  };
  componentDidMount() {
    this.setState({ loadingStatus: "loading" });
    window.addEventListener("resize", this.onResize);
  }
  componentDidUpdate(
    prevProps: ReactGoogleChartPropsWithDefaults,
    prevState: ReactGoogleChartState
  ) {
    const props = this.props as ReactGoogleChartPropsWithDefaults;
    if (
      prevState.loadingStatus !== "ready" &&
      this.state.loadingStatus === "ready" &&
      this.state.google !== null
    ) {
      const chartConfig = {
        chartType: this.props.chartType,
        options: this.props.options,
        containerId: this.getGraphID()
      };
      this.chartWrapper = new this.state.google.visualization.ChartWrapper(
        chartConfig
      );
      this.listenToChartEvents();
      this.draw();
      props.getChartWrapper(this.chartWrapper, this.state.google);
      return;
    }
    if (props.chartEvents !== prevProps.chartEvents) {
      this.listenToChartEvents();
    }
    if (props.chartActions !== null || prevProps.chartActions !== null) {
      if (props.chartActions !== prevProps.chartActions) {
        this.setChartActions(props.chartActions, prevProps.chartActions);
      }
    }

    if (props.data !== prevProps.data) {
      this.draw();
    }
    if (props.rows !== prevProps.rows || props.columns !== prevProps.columns) {
      this.draw();
    }
  }
  componentWillUnmount() {
    if (this.chartWrapper === null || this.state.google === null) {
      return;
    }
    window.removeEventListener("resize", this.onResize);
    this.state.google.visualization.events.removeAllListeners(
      this.chartWrapper
    );
    if (this.chartWrapper.getChartType() === "Timeline") {
      this.chartWrapper.getChart() && this.chartWrapper.getChart().clearChart();
    }
  }
  private setChartActions = (
    currentActions: GoogleChartAction[],
    previousActions: GoogleChartAction[]
  ) => {
    if (this.chartWrapper === null) return;
    const chart = this.chartWrapper.getChart();
    for (let chartAction of previousActions) {
      chart.removeAction(chartAction.id);
    }
    for (let chartAction of currentActions) {
      chart.setAction({
        id: chartAction.id,
        text: chartAction.text,
        action: () =>
          chartAction.action(this.chartWrapper as GoogleChartWrapper)
      });
    }
  };
  private getColumnID = (dataTable: GoogleDataTable, columnIndex: number) => {
    return (
      dataTable.getColumnId(columnIndex) ||
      dataTable.getColumnLabel(columnIndex)
    );
  };
  private listenToChartEvents = () => {
    if (this.state.google === null || this.chartWrapper === null) {
      return;
    }
    this.state.google.visualization.events.removeAllListeners(
      this.chartWrapper
    );
    const { chartEvents, legend_toggle, legendToggle } = this
      .props as ReactGoogleChartPropsWithDefaults;
    if (chartEvents !== null) {
      for (let event of chartEvents) {
        const { eventName, callback } = event;
        this.state.google.visualization.events.addListener(
          this.chartWrapper,
          eventName,
          (...args: any[]) => {
            if (this.chartWrapper !== null && this.state.google !== null) {
              callback({
                chartWrapper: this.chartWrapper,
                props: this.props as ReactGoogleChartPropsWithDefaults,
                google: this.state.google,
                state: this.state,
                eventArgs: args
              });
            }
          }
        );
      }
    }
    if (legendToggle === true || legend_toggle === true) {
      this.listenToLegendToggle();
    }
  };
  private listenToLegendToggle = () => {
    if (this.state.google === null || this.chartWrapper === null) {
      return;
    }
    this.state.google.visualization.events.addListener(
      this.chartWrapper,
      "select",
      () => {
        if (this.chartWrapper === null) return;
        const chart = this.chartWrapper.getChart();
        const selection = chart.getSelection();
        const dataTable = this.chartWrapper.getDataTable();
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
          this.setState(
            state => ({
              ...state,
              hiddenColumns: [
                ...state.hiddenColumns.filter(colID => colID !== columnID)
              ]
            }),
            () => {
              this.draw();
            }
          );
        } else {
          this.setState(
            state => ({
              ...state,
              hiddenColumns: [...state.hiddenColumns, columnID]
            }),
            () => {
              this.draw();
            }
          );
        }
      }
    );
  };

  private handleGoogleChartsLoaderScriptLoaded = (
    windowGoogleCharts: GoogleViz
  ) => {
    const {
      chartVersion: version,
      chartPackages: packages,
      chartLanguage: language,
      mapsApiKey
    } = this.props;
    windowGoogleCharts.charts.load(version || "current", {
      packages: packages || ["corechart"],
      language: language || "en",
      mapsApiKey
    });
    windowGoogleCharts.charts.setOnLoadCallback(() => {
      this.setState(state => ({
        ...state,
        loadingStatus: "ready",
        google: windowGoogleCharts
      }));
    });
  };
  private handleGoogleChartsLoaderScriptErrored = () => {
    this.setState(state => ({ ...state, loadingStatus: "errored" }));
  };

  render() {
    const divStyle = {
      height:
        this.props.height || (this.props.options && this.props.options.height),
      width:
        this.props.width || (this.props.options && this.props.options.width),
      ...this.props.style
    };
    return (
      <div id={`dashboard_div_${this.getGraphID()}`} ref={this.setdashboardref}>
        <div
          id={this.getGraphID()}
          style={divStyle}
          className={this.props.className}
          {...this.props.rootProps}
        >
          <ReactGoogleChartsLoader
            onError={this.handleGoogleChartsLoaderScriptErrored}
            onLoad={() => {
              const windowWithGoogle = window as Window & {
                google?: GoogleViz;
              };
              if (windowWithGoogle.google) {
                this.handleGoogleChartsLoaderScriptLoaded(
                  windowWithGoogle.google as GoogleViz
                );
              }
            }}
          />
          {this.state.loadingStatus === "loading" &&
            (this.props.loader ? this.props.loader : "Rendering Chart...")}
        </div>
        <div id={`filter_div_${this.getGraphID()}`} />
      </div>
    );
  }
}

export default Chart;
