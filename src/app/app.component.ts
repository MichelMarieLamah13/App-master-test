import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { AgmInfoWindow } from "@agm/core";
import { DataModel, DeviceList, EventData, marker } from "src/models/Response";
import { MyServiceService } from "./my-service.service";
import {
  DeviceList1,
  EventData1,
  Response1,
  tableModel,
} from "src/models/Response2";
import { User } from "src/models/User";
import { ResizeEvent } from "angular-resizable-element";
import { EChartOption } from "echarts";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title: string = "Map App";
  lat: number = 22.0574;
  lng: number = 78.9382;
  zoom: number = 4;
  url: string;
  url2: string;
  loader: boolean = false;
  singleMarker: marker = new marker();
  DeviceList: DeviceList[];
  EventData: EventData[];
  SingleEventData: EventData = new EventData();

  DataModel: DataModel;
  Response1: Response1 = new Response1();
  DeviceList1: DeviceList1[];
  EventData1: EventData1[];
  tableModelList = new Array<tableModel>();
  tableModel: tableModel;
  MarkerTitleArray: String[];
  @Input() isLoader: Boolean;
  isExpanded: boolean;
  ExistDeviceID: string;
  CountLength: number = 0;
  icon = {
    labelOrigin: { x: 16, y: 48 },
    url: "./assets/images/Voiture_ 2.svg",
    scaledSize: {
      width: 20,
      height: 40,
    },
  };

  icon1 = {
    labelOrigin: { x: 16, y: 48 },
    url: "./assets/images/vehicle.png",
    scaledSize: {
      width: 20,
      height: 40,
    },
    rotation: 90,
  };
  icon2 = {
    labelOrigin: { x: 16, y: 48 },
    url: "./assets/images/voitureEnMarche.png",
    scaledSize: {
      width: 20,
      height: 40,
    },
    rotation: 190,
  };

  iconSymbol1 = {
    path: "./assets/images/vehicle.svg",
    rotation: 0,
    anchor: { x: 16, y: 48 },
  };
  iconSymbol2 = {
    path: "./assets/images/Voiture_ 2.svg",
    rotation: 0,
    anchor: { x: 16, y: 48 },
  };

  clusterOptions = {
    imagePath:
      "https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m",
    gridSize: 30,
    zoomOnClick: false,
    maxZoom: 10,
    minimumClusterSize: 2,
  };

  mapOptions = {
    fitbounds: true,
    latitude: 0,
    longitude: 0,
    maxZoom: null,
    minZoom: 3,
    zoom: 8,
    disableDefaultUI: true,
    styles: [
      {
        featureType: "administrative.country",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  user: User = new User();
  localhost: string = "backup.sendatrack.com";

  isStart = false;
  isFinal = false;
  start = new EventData1();
  final = new EventData1();

  @ViewChild("container") container: ElementRef;
  @ViewChild("leftPanel") leftPanel: ElementRef;
  @ViewChild("rightPanel") rightPanel: ElementRef;
  @ViewChild("ngbTabset") ngbTabset: any;

  maxWidthLeftRight: number = 0;
  maxHeightLeftRight: number = 0;
  maxHeightTopBottom: number = 0;
  demoChartInit: number = 60;
  demoChartHeight: number;

  displayMode: number = 0;
  constructor(private service: MyServiceService) {}
  ngOnInit() {
    this.defineTimestamp();
    this.GetConnectedUser();
    this.GetResponse();
    this.setMapCenter();

    this.maxWidthLeftRight = this.leftPanel.nativeElement.offsetWidth;
    this.maxHeightTopBottom = this.rightPanel.nativeElement.offsetHeight;
    this.maxHeightLeftRight = this.container.nativeElement.offsetHeight;
    /*this.leftStyle = {
      ...this.leftStyle,
      height: `${this.maxHeightLeftRight + 100}px`,
    };*/
    this.leftStyle = {
      ...this.leftStyle,
      height: `${window.innerHeight}px`,
    };
    this.demoChartHeight = this.demoChartInit;
  }

  defaultUser: User[] = [
    new User("motivation", "admin", "motivation123321"),
    new User("alaqsa", "admin", "19641964"),
    new User("actitrans", "admin", "666666"),
  ];
  GetConnectedUser() {
    let compte = localStorage.getItem("compte");
    let login = localStorage.getItem("login");
    let motDePass = localStorage.getItem("motDePass");
    let server = localStorage.getItem("serveur");
    this.user.compte = compte ? compte : this.defaultUser[2].compte;
    this.user.login = login ? login : this.defaultUser[2].login;
    this.user.motDePass = motDePass ? motDePass : this.defaultUser[2].motDePass;
    this.localhost = server ? server : this.localhost;
  }

  //in 10 seconds do something
  GetResponse() {
    this.url =
      "http://" +
      this.localhost +
      ":8080/events7/data.jsonx?a=" +
      this.user.compte +
      "&p=" +
      this.user.motDePass +
      "&u=" +
      this.user.login +
      "&g=all&l=1&at=true";
    this.service.GetData1(this.url).subscribe(
      (data) => {
        let da = data as any;
        this.DataModel = da;
        localStorage.setItem("DeviceList", JSON.stringify(da.DeviceList));
        let LocalDeviceList = JSON.parse(localStorage.getItem("DeviceList"));
        if (
          LocalDeviceList == null ||
          LocalDeviceList.length != this.CountLength
        ) {
          console.log("5 sece");
          this.CountLength = LocalDeviceList.length;
          this.DeviceList = this.DataModel.DeviceList;
          this.EventData = [];
          // For filtering
          this.DeviceListFiltered = this.DeviceList;
          this.DeviceList.forEach((deviceData) => {
            deviceData.EventData.forEach((eventDataItem) => {
              eventDataItem.markerDescription = deviceData.Device_desc;
              eventDataItem.isActive = true;
              eventDataItem.icon = this.getIcon(eventDataItem);
              this.EventData.push(eventDataItem);
            });
          });
          localStorage.setItem(
            "EventDataVehicle",
            JSON.stringify(this.EventData)
          );
        }
        if (this.CountLength == LocalDeviceList.length) {
          console.log(" 5 seconds equal");

        }

        //
      },
      (err) => console.error(err),
      () => console.log("5  done loading")
    );
    setTimeout(() => {
      this.GetResponse();
      //window.location.reload();
    }, 5000);
  }
  previousWindow: AgmInfoWindow = null;

  clickMarker(infoWindow: AgmInfoWindow, event) {
    if (this.previousWindow) {
      this.previousWindow.close();
    }
    this.previousWindow = infoWindow;
    console.log(event);
  }
  //   fieldsChange(values:any,id:any) {
  //    this.GetTableDatAndFill(values,id);
  //  }

  GetTableDatAndFill(checkBoxValue: any, DeviceId: any) {
    //  this.isLoader=true;
    //remove from map

    var chxBox = checkBoxValue.currentTarget.checked;
    if (!chxBox) {
      this.EventData = this.EventData.filter(
        (item) => item.Device !== DeviceId
      );
    } else {
      let data = JSON.parse(localStorage.getItem("EventDataVehicle"));

      this.SingleEventData = data.find((item) => item.Device === DeviceId);
      this.EventData.push(this.SingleEventData);
    }
  }

  tempPath: any[] = [];
  rf:number=0;
  rt:number=0;
  defineTimestamp(){
    let midday = new Date();
    midday.setHours(0,0,0);
    let midnight = new Date();
    midnight.setHours(23,59,59);
    this.rf = this.dateToEpoch(midday);
    this.rt = this.dateToEpoch(midnight);
  }
  dateToEpoch(date:Date):number{
    return Math.floor(date.getTime()/1000.0)
  }
  expanded(DeviceId: string, DeviceDesc: string = "") {
    this.latLngAllPath = [];
    this.tempPath = [];
    this.drawPath(0, 0);
    console.log(DeviceId);
    this.isLoader = true;
    if (this.ExistDeviceID != DeviceId) {
      this.ngbTabset.select("1");
      this.url =
        "http://" +
        this.localhost +
        ":8080/eventsApp2/data.jsonx?a=" +
        this.user.compte +
        "&p=" +
        this.user.motDePass +
        "&u=" +
        this.user.login +
        "&d=" +
        DeviceId +
        "&rf="+this.rf+"&rt="+this.rt+"&l=5000&at=true";
        console.log(this.url);
      //http://backup.sendatrack.com:8080/events7/data.jsonx?a=motivation&p=motivation123321&u=admin&d=v11&rf=1625443200&rt=1625529599&l=5000&at=true
      //http://gsAddressServApp:8080/events7/data.jsonx?a=motivation&p=motivation123321&u=admin&d=v11&rf=1625443200&rt=1625529599&l=5000&at=true
      this.service.GetData1(this.url).subscribe(
        (data) => {
          let da = data as any;
          this.Response1 = da;
          //fill table
          this.tableModelList = [];
          this.chartData = [];
          this.DeviceList1 = this.Response1.DeviceList;
          this.DeviceList1.forEach((deviceData1) => {
            if (deviceData1.EventData.length) {
              this.latLngCurrentDay = deviceData1.EventData;
              deviceData1.EventData.forEach((eventDataItem, i) => {
                this.chartData.push([
                  new Date(eventDataItem.Timestamp * 1000),
                  eventDataItem.Speed,
                ]);
                this.tableModel = new tableModel();
                if (
                  eventDataItem.StatusCode == 62465 ||
                  eventDataItem.StatusCode == 61714
                ) {
                  if (!this.isStart) {
                    this.start = eventDataItem;
                    this.isStart = true;
                  } else if (i == deviceData1.EventData.length - 1) {
                    this.final = eventDataItem;
                    this.isFinal = true;
                  }
                } else if (eventDataItem.StatusCode == 62467) {
                  if (this.isStart && !this.isFinal) {
                    this.final = eventDataItem;
                    this.isFinal = true;
                  }
                }

                if (this.isStart) {
                  this.tempPath.push(eventDataItem);
                }

                if (this.isStart && this.isFinal) {
                  this.tableModel.start = this.start.Timestamp * 1000;
                  this.tableModel.initialPosition = this.start.Address;
                  this.tableModel.final = this.final.Timestamp * 1000;
                  this.tableModel.finalPosition = this.final.Address;
                  this.tableModel.duration = this.convertHMS(
                    this.final.Timestamp - this.start.Timestamp
                  );
                  this.tableModel.distance =
                    this.final.Odometer - this.start.Odometer;

                  this.tableModelList.push(this.tableModel);
                  this.isLoader = false;
                  this.ExistDeviceID = DeviceId;

                  this.isStart = false;
                  this.isFinal = false;
                  this.latLngAllPath.push(this.tempPath);
                  this.tempPath = [];
                }
              });
            } else {
              this.isLoader = false;
              this.ExistDeviceID = DeviceId;

              this.isStart = false;
              this.isFinal = false;
            }
          });
          let x: number = this.tableModelList.length;
          if (x) {
            this.setTopBottomHeightOnClick(x);
            this.getEchartOptions(DeviceDesc);
          }
        },
        (err) => console.error(err),
        () => console.log("done loading ")
      );
    } else if (this.ExistDeviceID == DeviceId) {
      this.clearFromTitle();
    }
  }

  clearFromTitle(mar: EventData = null) {
    this.tableModelList = [];
    this.isLoader = false;
    this.ExistDeviceID = "";
    this.setTopBottomHeightOnClick(0);
    this.chartOption = {};
    if (mar) {
      this.mapOptions.latitude = mar.GPSPoint_lat;
      this.mapOptions.longitude = mar.GPSPoint_lon;
      this.mapOptions.zoom = 22; // max zoom allowed
    }
    this.drawPath(0, 0);
  }
  setTopBottomHeightOnClick(x: number) {
    this.containerHeight = this.rightPanel.nativeElement.offsetHeight;
    //this.bottomHeight = x ? 160 + 80 * (x - 1) : 160;
    this.bottomHeight = x ? 160 + 300 : 160;
    this.topHeight = this.containerHeight - this.bottomHeight;
    this.setGridHeightTop();
    this.demoChartHeight = x ? 400 : this.demoChartInit;
  }
  setMapCenter() {
    var geo = navigator.geolocation;
    if (geo) {
      geo.getCurrentPosition(
        (position) => {
          this.mapOptions.latitude = position.coords.latitude;
          this.mapOptions.longitude = position.coords.longitude;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  convertHMS(value: number) {
    let hours = Math.floor(value / 3600); // get hours
    let minutes = Math.floor((value - hours * 3600) / 60); // get minutes
    let seconds = value - hours * 3600 - minutes * 60; //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    let sHours = hours < 10 ? "0" + hours : hours;
    let sMinutes = minutes < 10 ? "0" + minutes : minutes;
    let sSeconds = seconds < 10 ? "0" + seconds : seconds;
    let res = "";
    if (hours) {
      res += sHours + "h";
    }
    if (minutes) {
      res += sMinutes + "min";
    }
    if (seconds) {
      res += sSeconds + "s";
    }
    return res;
  }

  rightStyle: object = {};
  leftStyle: object = {};
  topStyle: object = {};
  bottomStyle: object = {};
  containerWidth: number = 0;
  containerHeight: number = 0;
  leftWidth: number = 0;
  rightWidth: number = 0;
  topHeight: number = 0;
  bottomHeight: number = 0;
  setGridWidthLeft() {
    this.leftStyle = {
      ...this.leftStyle,
      "max-width": `${this.leftWidth}px`,
    };
    this.rightStyle = {
      ...this.rightStyle,
      "min-width": `${this.rightWidth}px`,
    };
  }
  setGridHeightTop() {
    this.topStyle = {
      ...this.topStyle,
      "max-height": `${this.topHeight}px`,
    };
    this.bottomStyle = {
      ...this.bottomStyle,
      "min-height": `${this.bottomHeight}px`,
    };
  }
  onResizingLeft(event: ResizeEvent): void {
    //this.containerWidth = this.container.nativeElement.offsetWidth;
    this.containerWidth = window.innerWidth;
    this.leftWidth = event.rectangle.width;
    this.rightWidth = this.containerWidth - this.leftWidth;
    this.setGridWidthLeft();
  }
  validateLeft(event: ResizeEvent): boolean {
    const MIN_DIMENSIONS_PX: number = 100;
    const MAX_DIMENSIONS_PX: number = this.maxWidthLeftRight;
    if (
      event.rectangle.width < MIN_DIMENSIONS_PX ||
      event.rectangle.width > MAX_DIMENSIONS_PX
    ) {
      return false;
    }
    return true;
  }

  onResizingTop(event: ResizeEvent): void {
    this.containerHeight = this.rightPanel.nativeElement.offsetHeight;
    this.topHeight = event.rectangle.height;
    this.bottomHeight = this.containerHeight - this.topHeight;
    this.setGridHeightTop();
  }
  validateTop(event: ResizeEvent): boolean {
    const MIN_DIMENSIONS_PX: number = 100;
    const MAX_DIMENSIONS_PX: number = this.maxHeightTopBottom;
    if (
      event.rectangle.height < MIN_DIMENSIONS_PX ||
      event.rectangle.height > MAX_DIMENSIONS_PX
    ) {
      return false;
    }
    return true;
  }

  getIcon(marker: EventData) {
    let tmp = 50;
    var icon = {
      labelOrigin: { x: tmp, y: tmp }, //16,48
      url: "./assets/images/va.png",
      scaledSize: {
        width: tmp, //20, 90
        height: tmp, //40, 90
      },
    };
    if (marker.StatusCode != 62467) {
      switch (marker.Heading_desc) {
        case "N":
          icon.url = "./assets/images/vmn.png";
          break;
        case "NE":
          icon.url = "./assets/images/vmne.png";
          break;
        case "NO":
          icon.url = "./assets/images/vmno.png";
          break;
        case "S":
          icon.url = "./assets/images/vms.png";
          break;
        case "SE":
          icon.url = "./assets/images/vmse.png";
          break;
        case "SO":
          icon.url = "./assets/images/vmso.png";
          break;

        case "E":
          icon.url = "./assets/images/vme.png";
          break;
        case "O":
          icon.url = "./assets/images/vmo.png";
          break;

        default:
          icon.url = "./assets/images/vmn.png";
          break;
      }
    }
    return icon;
  }

  public valueToSearch: string = "";
  public DeviceListFiltered: DeviceList[] = [];
  filterAccordion($event) {
    this.DeviceListFiltered = this.DeviceList.filter((value) => {
      var x = value.Device_desc.includes(this.valueToSearch);
      if (x) {
        return value;
      }
    });
  }

  chartOption: EChartOption = {};
  chartData: Array<Array<any>> = [];
  getEchartOptions(DeviceDesc: string = "") {
    this.chartOption = {
      tooltip: {
        trigger: "axis",
        position: function (pt) {
          return [pt[0], "10%"];
        },
      },
      title: {
        left: "center",
        text: "Vitesse à chaque instant de " + DeviceDesc,
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: "none",
            title: {
              zoom: "Zoom sur zone",
              back: "Enlever le zoom",
            },
          },
          restore: { title: "Restaurer" },
          saveAsImage: { title: "Télécharger" },
        },
      },
      xAxis: {
        name: "Date et Heure",
        type: "time",
        boundaryGap: false,
      },
      yAxis: {
        name: "Vitesse[Km/h]",
        type: "value",
        boundaryGap: false,
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 100,
        },
        {
          start: 0,
          end: 100,
        },
      ],
      series: [
        {
          name: "Vitesse",
          type: "line",
          smooth: true,
          symbol: "none",
          areaStyle: {},
          data: this.chartData,
        },
      ],
    };
  }

  latLngAllPath: any[] = [];
  latLngCurrentPath: any[] = [];
  latLngCurrentDay: any[] = [];
  latLngPathStartEnd: any[] = [];
  drawPath(index: number = 0, mode: number = 0) {
    var pathIconStart: object = {
      labelOrigin: { x: 0, y: 0 }, //16,48
      url: "./assets/images/pinStart.png",
      scaledSize: {
        width: 60, //20
        height: 60, //40
      },
    };
    var pathIconEnd: object = {
      labelOrigin: { x: 0, y: 0 }, //16,48
      url: "./assets/images/pinEnd.png",
      scaledSize: {
        width: 60, //20
        height: 60, //40
      },
    };
    this.displayMode = mode;
    this.latLngCurrentPath = [];
    this.latLngPathStartEnd = [];
    if (mode != 0) {
      if (mode == 1) {
        this.latLngCurrentPath = this.latLngAllPath[index];
      } else if (mode == 2) {
        this.latLngCurrentPath = this.latLngCurrentDay;
      }
      let start = this.latLngCurrentPath[0];
      start.icon = pathIconStart;
      this.latLngPathStartEnd.push(start);
      let end = this.latLngCurrentPath[this.latLngCurrentPath.length - 1];
      end.icon = pathIconEnd;
      this.latLngPathStartEnd.push(end);
    }
  }

  map: any;
  onMapReady(map: any) {
    this.map = map;
  }
  onZoomChange(currentZoom: number) {
    this.mapOptions.zoom = currentZoom;
  }

}
