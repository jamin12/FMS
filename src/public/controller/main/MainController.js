import { CommonView } from '../../view/js/common/CommonView.js';
import { RoadMapView } from '../../view/js/common/RoadMapView.js';
import { PagingView } from '../../view/js/common/PagingView.js';
import { EffectView } from '../../view/js/common/EffectView.js';
import { TabCarInfoController } from '../../controller/main/Tab01CarInfo/TabCarInfoController.js';
import { TabAllRouteController } from '../../controller/main/Tab02AllRoute/TabAllRouteController.js';
import { TabNowPlayController } from '../../controller/main/Tan03NowPlay/TabNowPlayController.js';

class Main {
  constructor() {
    this.CommonView = new CommonView();
    this.RoadMapView = new RoadMapView();
    this.PagingView = new PagingView();
    this.TabCarInfoController = new TabCarInfoController();
    this.TabAllRouteController = new TabAllRouteController();
    this.TabNowPlayController = new TabNowPlayController();
    this.EffectView = new EffectView();
    this.init();
  }

  init() {
    this.SideMenuCommon();
    this.Tab01CarInfo();
    this.Tab02AllRoute();
    this.Tab03PlaySearch();
    this.RoadMap();
  }

  // [공통] 사이드메뉴 헤더,네비게이션
  SideMenuCommon() {
    this.CommonView.headerHTML();
    this.CommonView.navbarHTML();
  }

  // [공통] 지도맵
  RoadMap() {
    this.RoadMapView.roadMapHTML();
  }

  // [탭1] 차량정보확인
  Tab01CarInfo() {
    this.TabCarInfoController.carInfoHTML();
  }

  // [탭2] 운행이력조회
  Tab02AllRoute() {
    this.TabAllRouteController.allRouteHTML();
  }

  // [탭3] 실시간조회
  Tab03PlaySearch() {
    this.TabNowPlayController.playSearcthHTML(this.mainView);
  }
}

new Main();
