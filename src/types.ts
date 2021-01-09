// Complete Google Charts Type Definition : https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/google.visualization/index.d.ts
import { chartDefaultProps } from "./default-props";

export type ReactGoogleChartPropsWithDefaults = typeof chartDefaultProps &
  ReactGoogleChartProps;

export type GoogleVizDrawToolbar = (
  toolbarContainer: HTMLDivElement,
  components: GoogleChartToolbarItem[]
) => any;

export type GoogleViz = {
  charts: GoogleChartLoader;
  visualization: {
    ChartWrapper: GoogleChartWrapper;
    ChartEditor: GoogleChartEditor;
    DataTable: GoogleDataTable;
    events: GoogleVizEvents;
    arrayToDataTable: GoogleArrayToDataTable;
    drawToolbar: GoogleVizDrawToolbar;
    [otherKeys: string]: any;
  };
};

export type GoogleChartTicks = (number | Date)[];

export type GoogleChartEditor = {
  new (): GoogleChartEditor;
  openDialog: (
    chartWrapper: GoogleChartWrapper,
    chartEditorOptions?: { dataSourceInput?: any; [otherKeyMaybe: string]: any }
  ) => null;
  getChartWrapper: () => GoogleChartWrapper;
  setChartWrapper: (chartWrapper: GoogleChartWrapper) => GoogleChartWrapper;
  closeDialog: () => null;
};

export type GoogleChartLoaderOptions = {
  packages?: GoogleChartPackages[];
  language?: string;
  mapsApiKey?: string;
};
export type GoogleChartLoader = {
  load: (
    version: GoogleChartVersion,
    googleChartOptions: GoogleChartLoaderOptions
  ) => void;
  setOnLoadCallback: (callback: () => void) => void;
};
export interface ChartWrapperProps {
  chartType: GoogleChartWrapperChartType;
  containerId?: string;
  options?: {
    width?: number;
    height?: number;
    is3D?: boolean;
    title?: string;
    backgroundColor: string;
  };
  dataTable?: {};
  dataSourceUrl?: string;
  query?: string;
  refreshInterval?: number;
  view?: any[] | {};
  render?: (props: ChartWrapperProps, chartWrapper: GoogleChartWrapper) => any;
  children?: (
    props: ChartWrapperProps,
    chartWrapper: GoogleChartWrapper
  ) => any;
}

export type VizEventsProps = {
  chartWrapper: GoogleChartWrapper;
  onReady?: (chartWrapper: GoogleChartWrapper) => any;
  onError?: (chartWrapper: GoogleChartWrapper) => any;
  onSelect?: (selection: Array<{ row?: any; column?: any }>) => any;
  render?: (props: VizEventsProps, chartWrapper: GoogleChartWrapper) => any;
  children?: (props: VizEventsProps, chartWrapper: GoogleChartWrapper) => any;
};

/*
 *
 * <GoogleChartsTypes>
 *
 */

/*
 *
 * Reference + Docs:
 * https://developers.google.com/chart/interactive/docs/reference#constructor_3
 * https://developers.google.com/chart/interactive/docs/reference#google.visualization.drawchart
 *
 */
export type GoogleChartWrapperChartType =
  | "AnnotationChart"
  | "AreaChart"
  | "BarChart"
  | "BubbleChart"
  | "Calendar"
  | "CandlestickChart"
  | "ColumnChart"
  | "ComboChart"
  | "DiffChart"
  | "DonutChart"
  | "Gantt"
  | "Gauge"
  | "GeoChart"
  | "Histogram"
  | "LineChart"
  | "Line"
  | "Bar"
  | "Map"
  | "OrgChart"
  | "PieChart"
  | "Sankey"
  | "ScatterChart"
  | "SteppedAreaChart"
  | "Table"
  | "Timeline"
  | "TreeMap"
  | "WaterfallChart"
  | "WordTree";

// https://developers.google.com/chart/interactive/docs/reference#google.visualization.drawchart
export interface ChartWrapperOptions {
  chartType: string;
  containerId: string;
  options: Partial<{
    width: number;
    height: number;
    is3D: boolean;
    title: string;
    backgroundColor: string;
    hAxis?: {
      minValue?: any;
      maxValue?: any;
      ticks?: GoogleChartTicks;
      title?: string;
      viewWindow?: { max?: any; min?: any };
      [otherOptionKey: string]: any;
    };
    vAxis?: {
      minValue?: any;
      maxValue?: any;
      ticks?: GoogleChartTicks;
      title?: string;
      viewWindow?: { max?: any; min?: any };
      [otherOptionKey: string]: any;
    };
    legend: any;
    colors: string[];
    [otherOptionKey: string]: any;
  }>;
  dataTable?: GoogleDataTable;
  dataSourceUrl?: string;
  query?: string;
  refreshInterval?: number;
  view: any[] | {};
  [otherOptionKey: string]: any;
}

export type GoogleChartAction = {
  id: string;
  text: string;
  action: (chartWrapper: GoogleChartWrapper) => void;
};

export type GoogleChartControlProp = {
  controlType:
    | "CategoryFilter"
    | "ChartRangeFilter"
    | "DateRangeFilter"
    | "NumberRangeFilter"
    | "StringFilter";
  options: {};
  controlWrapperParams?: {};
  controlID?: string;
  controlPosition?: "top" | "bottom";
  controlEvents?: ReactGoogleChartEvent[];
};

export type GoogleChartWrapper = {
  new (chartWrapperOptions: Partial<ChartWrapperOptions>): GoogleChartWrapper;
  draw: (chartArgs?: ChartWrapperProps) => any;
  toJSON: () => string;
  clone: () => GoogleChartWrapper;
  getDataSourceUrl: () => string;
  getDataTable: () => GoogleDataTable | null; // null if datasourceurl set or ref to DataTable
  getChartType: () => GoogleChartWrapperChartType;
  getChartName: () => string;
  getChart: () => {
    removeAction: (actionID: string) => void;
    getSelection: () => { row?: any; column?: any }[];
    setAction: (ChartAction: GoogleChartAction) => void;
    getImageURI: () => void;
    clearChart: () => void; // Clears the chart, and releases all of its allocated resources.
  }; // ref to chart
  getContainerId: () => string;
  getQuery: () => string;
  getRefreshInterval: () => number;
  getOption: (key: string, opt_default_value?: any) => any; // returns opt_default_value if key not found
  getOptions: () => {};
  getSelection: () => { row?: any; column?: any }[];
  getView: () => {} | any[]; // Same format as toJSON

  setDataSourceUrl: (url: string) => void;
  setDataTable: (table: any) => void;
  setChartType: (chartType: GoogleChartWrapperChartType) => void;
  setChartName: (name: string) => void; // Sets an arbitrary name for the chart. This is not shown anywhere on the chart, unless a custom chart is explicitly designed to use it.
  setContainerId: (id: string) => void; // Sets the ID of the containing DOM element for the chart.
  setQuery: (query_string: string) => void; // Sets a query string, if this chart queries a data source. You must also set the data source URL if specifying this value.
  setRefreshInterval: (interval: number) => void; // Sets the refresh interval for this chart, if it queries a data source. You must also set a data source URL if specifying this value. Zero indicates no refresh.
  setOption: (key: string, value: any) => void; // 	Sets a single chart option value, where key is the option name and value is the value. To unset an option, pass in null for the value. Note that key may be a qualified name, such as 'vAxis.title'.
  setOptions: (options_obj: Partial<ChartWrapperOptions["options"]>) => void; //
};

export type GoogleVizEventName =
  | "ready"
  | "error"
  | "select"
  | "animationfinish"
  | "statechange"
  | "ok"
  | "cancel"
  | "animationstart";

export type GoogleVizEvents = {
  addListener: (
    chartWrapper: GoogleChartWrapper | GoogleChartControl | GoogleChartEditor,
    name: GoogleVizEventName,
    onEvent: (chartWrapper: GoogleChartWrapper) => any
  ) => any;
  removeListener: (
    chartWrapper: GoogleChartWrapper,
    name: GoogleVizEventName,
    callback: Function
  ) => any;
  removeAllListeners: (chartWrapper: GoogleChartWrapper) => any;
};

export type GoogleChartPackages =
  | "corechart"
  | "charteditor"
  | "controls"
  | "calendar"
  | "gantt"
  | "gauge"
  | "geochart"
  | "map"
  | "orgchart"
  | "sankey"
  | "table"
  | "timeline"
  | "treemap"
  | "wordtree";

export type GoogleChartVersion = "current" | "upcoming";

export type GoogleDataTableColumnType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "timeofday";

// export type GoogleDataTable = {
//   addColumn: (type: GoogleDataTableColumnType) => number;
// };

// Reference https://developers.google.com/chart/interactive/docs/roles
export enum GoogleDataTableColumnRoleType {
  annotation = "annotation",
  annotationText = "annotationText",
  certainty = "certainty",
  emphasis = "emphasis",
  interval = "interval",
  scope = "scope",
  style = "style",
  tooltip = "tooltip",
  domain = "domain"
}

export type GoogleDataTableColumn =
  | {
      type: GoogleDataTableColumnType;
      label?: string; //  A label for the column.
      role?: GoogleDataTableColumnRoleType;
      pattern?: string;
      p?: {};
      id?: string;
    }
  | string;

// Ref : https://developers.google.com/chart/interactive/docs/reference#dataparam

export type GoogleDataTableCell =
  | {
      v?: any; // The cell value. Type should match DataTableColumn type field
      f?: string; // A string version of the v value, formatted for display.
      p?: {};
    }
  | string
  | number
  | boolean
  | Date
  | null;

export type GoogleDataTableRow = GoogleDataTableCell[];

export type GoogleDataTableJS = {
  cols: GoogleDataTableColumn[];
  rows: {
    c: GoogleDataTableRow;
  }[];
  p?: {};
};

// Reference : https://developers.google.com/chart/interactive/docs/reference#DataTable

export type GoogleDataTableRowFilter = {
  column: number;
  value: any;
  minValue?: any;
  maxValue?: any;
};

export type GoogleDataTableSortColumns =
  | number
  | {
      column: number;
      desc: boolean;
    }
  | number[]
  | {
      column: number;
      desc: boolean;
    }[];

export type GoogleDataTable = {
  // https://developers.google.com/chart/interactive/docs/reference#dataparam
  new (dataParam: any): GoogleDataTable;
  addColumn: (column: GoogleDataTableColumn) => number;
  addRow: (row?: GoogleDataTableRow) => number;
  addRows: (rows?: GoogleDataTableRow[] | number[] | any[]) => number;
  clone: () => GoogleDataTable;

  getColumnId: (columnIndex: number) => string;
  getColumnLabel: (columnIndex: number) => string;
  getColumnPattern: (columnIndex: number) => string;
  getColumnProperties: (columnIndex: number) => {};
  getColumnProperty: (columnIndex: number, name: string) => any;
  getColumnRange: (
    columnIndex: number
  ) => { min: number | null; max: number | null };
  getColumnRole: (columnIndex: number) => GoogleDataTableColumnRoleType;
  getColumnType: (columnIndex: number) => GoogleDataTableColumnType;
  getDistinctValues: (columnIndex: number) => any[];
  getFilteredRows: (filters: GoogleDataTableRowFilter[]) => number[];
  getFormattedValue: (rowIndex: number, columnIndex: number) => string;
  getNumberOfColumns: () => number;
  getNumberOfRows: () => number;
  getProperties: (rowIndex: number, columnIndex: number) => {};
  getProperty: (rowIndex: number, columnIndex: number, name: string) => any;
  getRowProperties: (rowIndex: number) => {};
  getRowProperty: (rowIndex: number, name: string) => any;
  getSortedRows: (sortColumns: GoogleDataTableSortColumns) => number[];
  getTableProperties: () => {};
  getTableProperty: (name: string) => any;
  getValue: (
    rowIndex: number,
    columnIndex: number
  ) => boolean | string | number | Date | number[] | null;
  insertColumn: (
    columnIndex: number,
    type: GoogleDataTableColumnType,
    label?: string,
    id?: string
  ) => void;
  insertRows: (
    rowIndex: number,
    numberOrArray: GoogleDataTableRow[] | number
  ) => void;
  removeColumn: (columnIndex: number) => void;
  removeColumns: (columnIndex: number, numberOfColumns: number) => void;
  removeRow: (rowIndex: number) => void;
  removeRows: (rowIndex: number, numberOfColumns: number) => void;
  setCell: (
    rowIndex: number,
    columnIndex: number,
    value?: any,
    formattedValue?: string,
    properties?: {}
  ) => {};
  setColumnLabel: (columnIndex: number, label: string) => void;
  setColumnProperty: (columnIndex: number, name: string, value: any) => void;
  setColumnProperties: (columnIndex: number, properties: {} | null) => void;
  setFormattedValue: (
    rowIndex: number,
    columnIndex: number,
    formattedValue: string
  ) => void;
  setProperty: (
    rowIndex: number,
    columnIndex: number,
    name: string,
    value: any
  ) => void;
  setProperties: (
    rowIndex: number,
    columnIndex: number,
    properties: {} | null
  ) => void;

  setRowProperty: (rowIndex: number, name: string, value: any) => void;
  setRowProperties: (rowIndex: number, properties: {} | null) => void;
  setTableProperties: (properties: {} | null) => void;
  setValue: (rowIndex: number, columnIndex: number, value: string) => void;
  sort: (sortColumns: GoogleDataTableSortColumns) => void;
  toJSON: () => string; // GoogleDataTableJS
};

export type GoogleArrayToDataTable = (
  data: any[][],
  isFirstRowLabels?: boolean
) => GoogleDataTable;

export type GoogleChartOptions = {
  width?: number;
  height?: number;
  is3D?: boolean;
  backgroundColor: string;

  title?: string;
  hAxis?: {
    minValue?: any;
    maxValue?: any;
    ticks?: GoogleChartTicks;
    title?: string;
    viewWindow?: { max?: any; min?: any; [otherOptionKey: string]: any };
    [otherOptionKey: string]: any;
  };
  vAxis?: {
    minValue?: any;
    maxValue?: any;
    ticks?: GoogleChartTicks;
    title?: string;
    viewWindow?: { max?: any; min?: any; [otherOptionKey: string]: any };
    [otherOptionKey: string]: any;
  };
  bubble?: {};
  pieHole?: number;
  redFrom?: number;
  redTo?: number;
  yellowFrom?: number;
  yellowTo?: number;
  minorTicks?: number;
  legend?:
    | string
    | {
        position?: string;
        maxLines?: number;
        [otherOptionKey: string]: any;
      };
  curveType?: string;
  showTooltip?: boolean;
  showInfoWindow?: boolean;
  allowHtml?: boolean;
  isStacked?: string | boolean;
  minColor?: string;
  midColor?: string;
  maxColor?: string;
  headerHeight?: number;
  fontColor?: string;
  showScale?: boolean;
  bar?: { groupWidth?: string }; // Remove space between bars.
  candlestick?: {
    fallingColor?: { strokeWidth?: number; fill?: string }; // red
    risingColor?: { strokeWidth?: number; fill?: string }; // green
    [otherOptionKey: string]: any;
  };
  wordtree?: {
    format?: string;
    word?: string;
    [otherOptionKey: string]: any;
  };
  [otherOptionKey: string]: any;
};

/*
 *
 * </GoogleChartsTypes>
 *
 */

export type WindowWithMaybeGoogle = Window & { google?: any };

export type ReactGoogleChartEvent = {
  eventName: GoogleVizEventName;
  callback: (eventCallbackArgs: {
    chartWrapper: GoogleChartWrapper;
    controlWrapper?: GoogleChartControl;
    props: ReactGoogleChartProps;
    google: GoogleViz;
    eventArgs: any;
  }) => void;
};

export type GoogleChartToolbarItem = {
  type: "igoogle" | "html" | "csv" | "htmlcode";
  datasource: string;
  gadget?: string;
  userPrefs?: {
    "3d": number;
    [otherKeyMaybe: string]: any;
  };
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
  errorElement?: JSX.Element;
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
  getChartEditor?: (args: {
    chartEditor: GoogleChartEditor;
    chartWrapper: GoogleChartWrapper;
    google: GoogleViz;
  }) => void;
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
    access_token?: string;
  };
  rootProps?: any;
  controls?: GoogleChartControlProp[];
  render?: ReactGoogleChartDashboardRender;
  //https://developers.google.com/chart/interactive/docs/gallery/toolbar#example_1
  toolbarItems?: GoogleChartToolbarItem[];
  toolbarID?: string;
};

export type GoogleChartDashboard = {
  draw: (data: GoogleDataTable) => void;
  bind: (
    controlWrapperOrWrappers: GoogleChartControl | GoogleChartControl[],
    chartWrapper: GoogleChartWrapper
  ) => void;
};

export type ReactGoogleChartDashboardRender = ({
  renderControl,
  renderChart,
  renderToolbar
}: {
  renderControl: (
    filter: ({
      control,
      controlProp
    }: {
      control: GoogleChartControl;
      controlProp: GoogleChartControlProp;
    }) => boolean
  ) => any;
  renderChart: () => any;
  renderToolbar: () => any;
}) => any;
export type GoogleChartControlOptions = any;
export type GoogleChartControl = {
  getContainerId: () => string;
  getOptions: () => GoogleChartControlOptions;
  getState: () => any;
  setState: (state: any) => void;
  setOptions: (options: GoogleChartControlOptions) => void;
  setControlType: (controlType: string) => void;
};

export type ReactGoogleChartState = {
  loadingStatus: "loading" | "errored" | "ready";
  google: null | GoogleViz;
  // hiddenColumns: string[];
};

export type ReactGoogleChartContext = {
  data: ReactGoogleChartProps["data"];
  rows: ReactGoogleChartProps["rows"] | null;
  columns: ReactGoogleChartProps["columns"] | null;
  diffdata: ReactGoogleChartProps["diffdata"] | null;
  options: ReactGoogleChartProps["options"] | null;
  legend_toggle: ReactGoogleChartProps["legend_toggle"] | null;
  legendToggle: ReactGoogleChartProps["legendToggle"] | null;
  chartType: ReactGoogleChartProps["chartType"] | null;
  formatters: ReactGoogleChartProps["formatters"] | null;
  spreadSheetUrl: ReactGoogleChartProps["spreadSheetUrl"] | null;
  spreadSheetQueryParameters:
    | ReactGoogleChartProps["spreadSheetQueryParameters"]
    | null;
};
