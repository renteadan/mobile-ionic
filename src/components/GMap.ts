
import './GMap.css';

let map: google.maps.Map;

/**
 * The CenterControl adds a control to the map that recenters the map on
 * Chicago.
 */
class CenterControl {
  private map_: google.maps.Map;
  private center_: google.maps.LatLng;
  private currentMarker_: google.maps.Marker;
  constructor(
    controlDiv: HTMLElement,
    map: google.maps.Map,
    center: google.maps.LatLngLiteral,
    setCenter: any
  ) {
    this.map_ = map;
    // Set the center property upon construction
    this.center_ = new google.maps.LatLng(center);
    this.currentMarker_ = addMarker(this.center_.toJSON(), map);
    controlDiv.style.clear = "both";

    // Set CSS for the control border
    const goCenterUI = document.createElement("div");
    goCenterUI.id = "goCenterUI";
    goCenterUI.title = "Click to recenter the map";
    controlDiv.appendChild(goCenterUI);

    // Set CSS for the control interior
    const goCenterText = document.createElement("div");
    goCenterText.id = "goCenterText";
    goCenterText.innerHTML = "Center Map";
    goCenterUI.appendChild(goCenterText);

    // Set CSS for the setCenter control border
    const setCenterUI = document.createElement("div");
    setCenterUI.id = "setCenterUI";
    setCenterUI.title = "Click to change the center of the map";
    controlDiv.appendChild(setCenterUI);

    // Set CSS for the control interior
    const setCenterText = document.createElement("div");
    setCenterText.id = "setCenterText";
    setCenterText.innerHTML = "Set Center";
    setCenterUI.appendChild(setCenterText);

    map.addListener("click", (event) => {
      const newCenter = new google.maps.LatLng(event.latLng.toJSON());
      this.center_ = newCenter;
      this.currentMarker_.setMap(null);
      this.currentMarker_ = addMarker(event.latLng.toJSON(), map);
      const currentCenter = this.center_;
      this.map_.setCenter(currentCenter);
    });

    function addMarker(location: google.maps.LatLngLiteral, map: google.maps.Map) {
      // Add the marker at the clicked location, and add the next-available label
      // from the array of alphabetical characters.

      const marker = new google.maps.Marker({
        position: location,
        label: 'D',
        map: map,
      });

      return marker;
    }

    // Set up the click event listener for 'Center Map': Set the center of
    // the map
    // to the current center of the control.
    goCenterUI.addEventListener("click", () => {
    });

    // Set up the click event listener for 'Set Center': Set the center of
    // the control to the current center of the map.
    setCenterUI.addEventListener("click", () => {
      const newCenter = this.map_.getCenter();
      setCenter(newCenter.lat(), newCenter.lng());
    });
  }
}

export function initMap(currentCenter:google.maps.LatLngLiteral, setCenter: any): void {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    zoom: 12,
    center: currentCenter,
  });

  // Create the DIV to hold the control and call the CenterControl()
  // constructor passing in this DIV.
  const centerControlDiv = document.createElement("div");
  const control = new CenterControl(centerControlDiv, map, currentCenter, setCenter);

  // @ts-ignore
  centerControlDiv.index = 1;
  centerControlDiv.style.paddingTop = "10px";
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
}