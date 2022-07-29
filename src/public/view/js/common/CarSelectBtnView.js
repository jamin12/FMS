import { FunctionView } from './FunctionView.js'

/*******************************************
*  [탭2,탭3] 차량선택 버튼
********************************************/
class CarSelectBtnView {
	constructor(){
		this.FunctionView = new FunctionView();
	}

	carSelectBtnHTML(){
		let div = document.createElement("div");
		div.setAttribute('class','cm_car_select');

		for(let i=1; i<=10; i++){
			if(i < 10){
				i = this.FunctionView.numberPad(i,2);
			}
			let carSelectHTML = `<button class="cm_color${i} car${i}"><i class="xi-car"></i>12가1234</button>`;
			div.insertAdjacentHTML("beforeend",carSelectHTML);
		}
		return div.outerHTML;
	}
}

export { CarSelectBtnView }