/*******************************************
*  [공통] 이펙트 
********************************************/
class EffectView {
	constructor(){
		this.navi =  document.querySelectorAll('.navbar ul li a'); //메뉴 네비게이션
		this.tabConts = document.querySelectorAll('.tab'); //탭
		this.tabCarIco = document.querySelectorAll('.tab table td .category'); //테이블 차
 		this.tabCarBox = document.querySelectorAll('.side_menu .car_info .car_box'); //카박스
		this.carSelectBtn = document.querySelectorAll('.cm_car_select button');
	}

	// 로그인 인풋 박스
	loginBoxEffectList(loginView){
		loginView.loginBox.classList.add("active");
	}

	// 네비게이션
	naviEffectList(mainView,i){
		for(let i=0; i<mainView.tabCarBox.length; i++){
			if(mainView.tabCarBox[i].classList.contains('active')){
				mainView.tabCarBox[i].classList.remove('active');
				mainView.tabCarBox[0].classList.add('active');
				document.getElementById('car_info').scrollTo(0,0);
			}
		}

		for(let i=0; i<mainView.tabConts.length; i++){
			mainView.tabConts[i].classList.remove('active');
		}
		mainView.tabConts[i].classList.add('active');
	}

	// 탭2, 탭3 차량번호 클릭시 이동
	tabCarNumberEffectList(mainView,i,e){
		for(let i=0; i<mainView.tabConts.length; i++){
			mainView.tabConts[i].classList.remove('active');
		}
		mainView.tabConts[0].classList.add('active');

		for(let i=0; i<mainView.tabCarBox.length; i++){ 
			mainView.tabCarBox[i].classList.remove('active');
		}

		for(let i=0; i<mainView.tabCarIco.length; i++){
			mainView.tabConts[0].classList.add('active');

			if(e.target.classList.contains(`car0${i + 1}`)){
				mainView.tabCarBox[i].classList.add('active');
				
				
				let location = document.querySelector(`.car0${i + 1}`).offsetTop;
				document.getElementById('car_info').scrollTo(0,location - 180);
			}
		}
	}

	// 텝1 차량정보확인 차량 on/off
	carOnOffEffectList(mainView,i){
		if(!mainView.tabCarBox[i].classList.contains('off')){
			for(let i=0; i<mainView.tabCarBox.length; i++){
				mainView.tabCarBox[i].classList.remove('active');
			}
			mainView.tabCarBox[i].classList.toggle('active');
		}
	}

	// 탭2, 탭3 차량버튼 선택 effect
	carSelectBtnEffectList(mainView,i){
		for(let i=0; i<mainView.carSelectBtn.length; i++){
			mainView.carSelectBtn[i].classList.remove('active');
		}
		mainView.carSelectBtn[i].classList.add('active');
	}


}

export { EffectView };