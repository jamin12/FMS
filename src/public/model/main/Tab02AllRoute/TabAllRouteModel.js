import { FunctionView } from '../../../view/js/common/FunctionView.js'
import { TabAllRouteView } from '../../../view/js/main/Tab02AllRoute/TabAllRouteView.js'

class TabAllRouteModel {
	constructor(){
		this.FunctionView = new FunctionView();
		this.TabAllRouteView = new TabAllRouteView();
	}
	//조회기간 - 현재 날짜
	pastToday(){
		let pastToday = new Date();
	
		let pastYear = pastToday.getFullYear(); // 현재 년도
		let pastMonth = pastToday.getMonth() + 1; // 현재 월 (0부터시작)
		let pastDay = pastToday.getDate(); // 현재 일
	
		if(pastMonth < 10){
			pastMonth =	this.FunctionView.numberPad(pastMonth,2)
		}

		this.TabAllRouteView.pastTodayInput.value = pastYear + "-" + pastMonth  + "-" + pastDay;
	}

	// 과거이력조회 - 1주일
	pastWeek(){
		let pastToday = new Date();

		let pastYear = pastToday.getFullYear(); // 현재 년도
		let pastMonth = pastToday.getMonth() + 1; // 현재 월 (0부터시작)
		let pastDay = pastToday.getDate(); // 현재 일

		if(pastMonth < 10){
			pastMonth =	this.FunctionView.numberPad(pastMonth,2)
		}
	
		this.pastToday();
	
		const setDay = this.FunctionView.numberPad(pastDay - 7,2);
		this.TabAllRouteView.pastPrevInput.value = pastYear + "-" + pastMonth  + "-" + setDay;
	}

	// 과거이력조회 - 개월
	pastMonth(num){
		let pastToday = new Date();
	
		let pastYear = pastToday.getFullYear(); // 현재 년도
		let pastMonth = pastToday.getMonth() + 1; // 현재 월 (0부터시작)
		let pastDay = pastToday.getDate(); // 현재 일
	
		if(pastMonth < 10){
			pastMonth =	this.FunctionView.numberPad(pastMonth,2)
		}
	
		this.pastToday();
	
		const setMonth = this.FunctionView.numberPad(pastMonth - num,2);
		this.TabAllRouteView.pastPrevInput.value = pastYear + "-" + setMonth  + "-" + pastDay;
	}
}

export { TabAllRouteModel }