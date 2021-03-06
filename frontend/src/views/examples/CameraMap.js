import React from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

import axios from 'axios';
import { Tooltip } from 'reactstrap';

import 'mapbox-gl/dist/mapbox-gl.css';

import * as aedData from "../../data/aedLocation.json";

class CameraMap extends React.Component {

  state = {
    viewport: {
      latitude: 1.340863,
      longitude: 103.8303918,
      zoom: 11,
      width: "100vw",
      height: "100vh",
    },
    cameraCoordinates: [],
    coordinate: {
      latitude: 1.25865466476467,
      longitude: 103.818390225510001
    },
    popupInfo: null,
    showPopup: true,
    tooltipOpen: false
  }

  arr = [];

  toggle = () => this.setState({
    tooltipOpen: !this.state.tooltipOpen
  });

  componentDidMount() {
    console.log("component did mount camera map");

    axios.get("https://4v3nsgopzi.execute-api.ap-southeast-1.amazonaws.com/scan_camera")
      .then(res => {
        console.log(res);
        const marker = res.data.map((coordinates) => {
          return ({
            latitude: parseFloat(coordinates.location.S.split(',')[0]),
            longitude: parseFloat(coordinates.location.S.split(',')[1]),
            address: coordinates.address.S,
            show: false
          })
        })

        console.log(marker)

        this.setState({
          cameraCoordinates: marker
        })
      })
  }


  render() {

    const markerList = this.state.cameraCoordinates.map((cameraCoordinate, index) => {
      return (<Marker
        key={index}
        latitude={cameraCoordinate.latitude}
        longitude={cameraCoordinate.longitude}
      >
        <i className="ni ni-camera-compact text-danger" id={"test-" + index}></i>
        {
          index === 0 ?
            <Tooltip placement="right" isOpen={this.state.tooltipOpen} target={"test-" + index} toggle={this.toggle}>
              {cameraCoordinate.address}
            </Tooltip>
            :
            ""
        }

      </Marker >)
    })

    const { showPopup } = this.state;

    return (
      <div>
        <ReactMapGL
          {...this.state.viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          onViewportChange={(view) => {
            this.setState({
              viewport: view
            })
          }}
          mapStyle="mapbox://styles/qtxbryan/ckbcehlci0yt01is4202useay"
          style={{ maxWidth: "100%" }}
          children={this.props.children}
        >

          {markerList}

        </ReactMapGL>
      </div >
    );
  }

};

export default CameraMap;
