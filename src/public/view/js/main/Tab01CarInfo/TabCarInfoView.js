/*******************************************
*  [탭1] 차량정보확인
********************************************/
class TabCarInfoView {
	constructor(){
		this.carNumber = document.querySelectorAll(".car_no");
		this.carModel = document.querySelectorAll(".car_model_nm");
		this.carNicname = document.querySelectorAll(".car_nm");
	}
}

export { TabCarInfoView }