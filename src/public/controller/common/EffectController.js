import { EffectView } from '../../view/js/common/EffectView.js';

class EffectController {
  constructor() {
    this.EffectView = new EffectView();
    this.init();
  }

  init() {
    this.navbarTabEffect();
    this.carListMatchEffect();
    this.carOnOffEffect();
    this.carSelectBtnEffect();
  }

  // 네비게이션 event
  navbarTabEffect() {
    for (let i = 0; i < this.EffectView.navi.length; i++) {
      this.EffectView.navi[i].addEventListener('click', () => {
        this.EffectView.naviEffectList(this.EffectView, i);
      });
    }
  }

  // 탭2, 탭3 차량번호 클릭시 해당차량정보 이동
  carListMatchEffect() {
    for (let i = 0; i < this.EffectView.tabCarIco.length; i++) {
      this.EffectView.tabCarIco[i].addEventListener('click', (e) => {
        this.EffectView.tabCarNumberEffectList(this.EffectView, i, e);
      });
    }
  }

  // 텝1 차량정보확인 차량 on/off effect
  carOnOffEffect() {
    for (let i = 0; i < this.EffectView.tabCarBox.length; i++) {
      this.EffectView.tabCarBox[i].addEventListener('click', () => {
        this.EffectView.carOnOffEffectList(this.EffectView, i);
      });
    }
  }

  // 탭2, 탭3 차량버튼 선택 effect
  carSelectBtnEffect() {
    for (let i = 0; i < this.EffectView.carSelectBtn.length; i++) {
      this.EffectView.carSelectBtn[i].addEventListener('click', () => {
        this.EffectView.carSelectBtnEffectList(this.EffectView, i);
      });
    }
  }
}
new EffectController();
