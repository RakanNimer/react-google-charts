import * as React from "react";
import * as ReactDOM from "react-dom";
import { Chart, Loader } from "../src";
// Reference : https://developers.google.com/chart/interactive/docs/gallery/timeline
const columns = [
  { type: "string", id: "President" },
  { type: "date", id: "Start" },
  { type: "date", id: "End" }
];

const rows = [
  ["Washington", new Date(1789, 3, 30), new Date(1797, 2, 4)],
  ["Adams", new Date(1797, 2, 4), new Date(1801, 2, 4)],
  ["Jefferson", new Date(1801, 2, 4), new Date(1809, 2, 4)]
];

const companyOne = [
  ["Name", "Popularity"],
  ["Cesar", 250],
  ["Rachel", 4200],
  ["Patrick", 2900],
  ["Eric", 8200]
];

const companyTwo = [
  ["Name", "Popularity"],
  ["Cesar", 370],
  ["Rachel", 600],
  ["Patrick", 700],
  ["Eric", 1500]
];
const DiffChart = () => {
  return (
    <Chart
      chartType="ColumnChart"
      diffdata={{ old: companyOne, new: companyTwo }}
      width="100%"
      height="400px"
    />
  );
};

class App extends React.Component {
  componentDidMount() {
    setInterval(() => {
      this.setState({ refresh: Date.now() });
    }, 1000);
  }
  render() {
    return (
      <div className="App">
        <DiffChart />
        <Chart
          chartType="Timeline"
          data={[columns, ...rows]}
          width="100%"
          height="400px"
        />
      </div>
    );
  }
}

const gaugeOptions = {
  width: 400,
  height: 120,
  redFrom: 90,
  redTo: 100,
  yellowFrom: 75,
  yellowTo: 90,
  minorTicks: 5
};

const Issue317 = () => {
  const [chartType, setChartType] = React.useState<
    "AreaChart" | "BarChart" | "Table"
  >("AreaChart");

  const columns = [
    {
      type: "string",
      label: "year"
    },
    {
      label: "AttentionSpan",
      type: "number"
    }
  ];
  const rows = [["2015", 5], ["2016", 3], ["2018", 1]];
  return (
    <div className="App">
      <button onClick={() => setChartType("BarChart")}>barChart</button>
      <button onClick={() => setChartType("Table")}>Table</button>
      <h3>{chartType}</h3>
      <Chart
        chartType={chartType}
        width="100%"
        height="400px"
        legendToggle
        rows={rows}
        columns={columns}
      />
    </div>
  );
};

class LoaderTest extends React.Component<{data:Array<any>}, {google: any, dataTable:any, rows:any, columns:any, aggregate:boolean}> {
  constructor(props) {
    super(props)
  
    this.state = {
      dataTable:null,
      rows:null,
      columns:null,
      google:null,
      aggregate:false
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(this.state.dataTable && this.state.dataTable !== prevState.dataTable){
      this.changeData();
    }
    if(this.state.google && this.props.data !== prevProps.data)
      this.onSucces(this.state.google)
  }
  
  render() {
    const { rows, columns, google } = this.state;
    return (
      <div>
        <Chart
          chartType="ScatterChart"
          width="100%"
          height="400px"
          legendToggle
          rows={rows}
          columns={columns}
        />

          
          <button onClick={() => {this.setState({aggregate:!this.state.aggregate}); this.changeData()}}>Aggregate</button>
        {!google && <Loader onSucces={this.onSucces}></Loader>}
      </div>
    );
  }

  onSucces = (google) => {
    let dataTable = new google.visualization.arrayToDataTable(this.props.data)
    this.setState({
      dataTable,
      google,
    })
  }

  changeData = () => {
    const { dataTable, google, aggregate } = this.state;
    let newDataTable = aggregate ? google.visualization.data.group(
      dataTable, 
      [{column:0, modifier:this.modifierFunc, type:'number'}],
      [{column:1, aggregation: google.visualization.data.sum, type:'number'}, {column:2, aggregation: google.visualization.data.sum, type:'number'}]
    ) : dataTable

    let array = this.dataTableToArray(newDataTable)
    this.setState({rows:array, columns:this.props.data[0]})
  }
  modifierFunc = (ele) => {
    return ele % 20
  }

  dataTableToArray = (dataTable) => {
    let rows = [[...dataTable.vg]]
    dataTable.wg.forEach((row, i) => {
      row.c.forEach((element, j) => {
        if(!rows[i]) rows[i] = []
        rows[i][j] = element.v
      });
    });
    return rows
  }
}

class InteractiveChart extends React.Component<{}, { data: any[][] }> {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        [
          {
            type: "number",
            label: "Age"
          },
          {
            type: "number",
            label: "Weight",
            color: "green"
          },
          {
            type: "number",
            label: "test"
          }
        ],
        [4, 5.5, 1],
        [8, 12, 2],
        [11, 14, 3]
      ]
    };
  }

  componentDidMount() {
    let i = 0;
    setInterval(() => {
      i++;
      if (i > 10) return;
      this.setState(state => {
        return Object.assign({}, state, {
          data: [
            ...state.data,
            [20 * i, 10 * Math.random(), 10 * Math.random()]
          ]
        });
      });
    }, 500);
  }
  render() {
    return (
      <div>
        <LoaderTest data={this.state.data}></LoaderTest>
        <Issue317 />
        <Chart
          chartType="Gauge"
          width="100%"
          height="400px"
          data={[
            [
              { type: "string", label: "Label" },
              { type: "number", label: "Value" }
            ],
            ["Memory", 80],
            ["CPU", 55],
            ["Network", 20]
          ]}
          options={gaugeOptions}
        />
        <App />
        <Chart
          chartType="BarChart"
          data={{
            cols: [
              { id: "task", label: "Task", type: "string" },
              { id: "hours", label: "Hours per Day", type: "number" }
            ],
            rows: [
              { c: [{ v: "Work" }, { v: 11 }] },
              { c: [{ v: "Eat" }, { v: 2 }] },
              { c: [{ v: "Commute" }, { v: 2 }] },
              { c: [{ v: "Watch TV" }, { v: 2 }] },
              { c: [{ v: "Sleep" }, { v: 7, f: "7.000" }] }
            ]
          }}
          options={{ colors: ["green"] }}
          width="100%"
          height="400px"
          legendToggle
        />
        <Chart
          chartType="ScatterChart"
          data={this.state.data}
          options={{
            title: "Age vs. Weight comparison",
            hAxis: { title: "Age", minValue: 0, maxValue: 15 },
            vAxis: { title: "Weight", minValue: 0, maxValue: 15 },
            legend: "none"
          }}
          width="100%"
          height="400px"
          legendToggle
          getChartWrapper={chartWrapper => {
            console.log("chart ", chartWrapper.getChart());
          }}
        />
        <Chart
          chartType="ScatterChart"
          columns={["Age", "Weight", "Test"]}
          rows={[[8, 12, 1], [4, 5.5, 2]]}
          options={{}}
          width="100%"
          height="400px"
          legendToggle
        />
        
       
      </div>
    );
  }
}

ReactDOM.render(<InteractiveChart />, document.getElementById("app"));
