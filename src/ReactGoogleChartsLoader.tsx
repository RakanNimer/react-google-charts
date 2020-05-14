import * as React from "react";
//@ts-ignore
import { ContextProvider } from "./Context";
import { ReactGoogleChartPropsWithDefaults, ReactGoogleChartState, GoogleViz, ReactLoaderProps } from "./types";
import { chartDefaultProps } from './default-props'
import { GoogleChartLoader } from "./components/GoogleChartLoader";

export class Loader extends React.Component<ReactLoaderProps, ReactGoogleChartState>{
  state = {
    loadingStatus: "loading" as ReactGoogleChartState["loadingStatus"],
    google: null as ReactGoogleChartState["google"]
  };
  _isMounted = false;

  static defaultProps = chartDefaultProps;

  render(){
    const {
      chartLanguage,
      chartPackages,
      chartVersion,
      mapsApiKey,
      
    } = this.props;
    return(
      <ContextProvider value={{chartLanguage, chartPackages, chartVersion, mapsApiKey} as ReactGoogleChartPropsWithDefaults}>
        <GoogleChartLoader {...{ chartLanguage, chartPackages, chartVersion, mapsApiKey }}
          onLoad={this.onLoad}
          onError={this.onError}
        />
      </ContextProvider>
    )
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onLoad = (google: GoogleViz) => {
    if (this.isFullyLoaded(google)) {
      this.onSuccess(google);
    } else {
      // IE11: window.google is not fully set, we have to wait
      const id = setInterval(() => {
        const google = (window as Window & {
          google?: GoogleViz;
        }).google;

        if (this._isMounted) {
          if (google && this.isFullyLoaded(google)) {
            clearInterval(id);
            this.onSuccess(google);
          }
        } else {
          clearInterval(id);
        }

      }, 1000);
    }
  }
  onSuccess = (google: GoogleViz) => {
    const { onSucces } = this.props;
    this.setState({
      loadingStatus: "ready",
      google
    });
    onSucces && onSucces(google);
  };

  onError = () => {
    this.setState({
      loadingStatus: "errored"
    });
  };
  isFullyLoaded(google: GoogleViz) {
    const { controls, toolbarItems, getChartEditor } = this.props;

    return (
      google &&
      google.visualization &&
      google.visualization.ChartWrapper &&
      google.visualization.Dashboard &&
      (!controls || google.visualization.ChartWrapper) &&
      (!getChartEditor || google.visualization.ChartEditor) &&
      (!toolbarItems || google.visualization.drawToolbar)
    );
  }
}
