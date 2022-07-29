import { FunctionView } from '../../../view/js/common/FunctionView.js';
import { LoginModel } from '../../../model/auth/LoginModel.js';
import { TabCarInfoModel } from '../../../model/main/Tab01CarInfo/TabCarInfoModel.js';
import { TabCarInfoView } from '../../../view/js/main/Tab01CarInfo/TabCarInfoView.js';
import { CarInfoObj } from '../../../model/main/Tab01CarInfo/CarInfoObj.js';

class TabCarInfoController {
  constructor() {
    this.FunctionView = new FunctionView();
    this.LoginModel = new LoginModel();
    this.TabCarInfoModel = new TabCarInfoModel();
    this.TabCarInfoView = new TabCarInfoView();
  }

  carInfoAjax() {
    $.ajax({
      method: 'GET',
      Headers: {
        credentials: 'include',
      },
      url: 'http://127.0.0.1:53012/v1/cars',
      dataType: 'json',
      async: false,
    })
      .done((response) => {
        const carsJson = response['cars'];

        for (let i = 0; i < carsJson.length; i++) {
          const carInfo = carsJson[i];
          const carObj = new CarInfoObj(carInfo);
          this.TabCarInfoModel.carInfoArray.push(carObj);
        }
      })
      .fail(function (err) {
        console.log('오류발생', err);
      });
  }

  carInfoHTML() {
    this.LoginModel.loginAjax(this.carInfoAjax());

    const carInfo = document.getElementById('car_info');
    let div = document.createElement('div');
    div.classList.add('box_wrap');
    let boxWrap = carInfo.appendChild(div);

    for (let i = 1; i <= this.TabCarInfoModel.carInfoArray.length; i++) {
      if (i < 10) {
        i = this.FunctionView.numberPad(i, 2);
      }

      let carBoxHTML = `<div class="car_box car${i}" id="car_box${i}">
				<div class="title_wrap">
					<div class="car_mark"><i class="xi-car"></i></div>
					<div class="car_name">
						<p class="box_mark car_no">${this.TabCarInfoModel.carInfoArray[i - 1].carNumber}</p>
						<p class="title car_model_nm">${this.TabCarInfoModel.carInfoArray[i - 1].carModel}</p>
					</div>
				</div>
				<div class="car_area">
					<div class="car_img">
						<img src="./view/img/m.webp" alt="" />
					</div>
					<div class="text_wrap">
						<p>고객사 <span class="car_nm">${this.TabCarInfoModel.carInfoArray[i - 1].carNicname}</span></p>
						<p>차량번호 <span class="car_no">${this.TabCarInfoModel.carInfoArray[i - 1].carNumber}</span></p>
						<p>평균운행속도 <span>80km</span></p>
						<p>총운행거리 <span>1m</span></p>
						<p>현재위치 <span>서울 금천구 가산동 가산디지털단지역 5번출구 앞</span></p>
					</div>
				</div>
			</div>`;

      carInfo.insertAdjacentHTML('beforeend', carBoxHTML);

      switch (this.TabCarInfoModel.carInfoArray[i - 1].carColor) {
        case '99FF33':
          document.querySelector(`.car_box.car${i} .box_mark`).classList.add('cm_color01');
          document.querySelector(`.car_box.car${i} .car_mark`).classList.add('car_mark01');
          break;
        case '990033':
          document.querySelector(`.car_box.car${i} .box_mark`).classList.add('cm_color02');
          document.querySelector(`.car_box.car${i} .car_mark`).classList.add('car_mark02');
          break;
        case '99FFCC':
          document.querySelector(`.car_box.car${i} .box_mark`).classList.add('cm_color03');
          document.querySelector(`.car_box.car${i} .car_mark`).classList.add('car_mark03');
          break;
        case '9900CC':
          document.querySelector(`.car_box.car${i} .box_mark`).classList.add('cm_color04');
          document.querySelector(`.car_box.car${i} .car_mark`).classList.add('car_mark04');
          break;
        case '993300':
          document.querySelector(`.car_box.car${i} .box_mark`).classList.add('cm_color05');
          document.querySelector(`.car_box.car${i} .car_mark`).classList.add('car_mark05');
          break;
        case '9933FF':
          document.querySelector(`.car_box.car${i} .box_mark`).classList.add('cm_color06');
          document.querySelector(`.car_box.car${i} .car_mark`).classList.add('car_mark06');
          break;
        case '66CCFF':
          document.querySelector(`.car_box.car${i} .box_mark`).classList.add('cm_color07');
          document.querySelector(`.car_box.car${i} .car_mark`).classList.add('car_mark07');
          break;
      }
    }
    document.getElementById('car_box01').classList.add('active');
  }
}

export { TabCarInfoController };
