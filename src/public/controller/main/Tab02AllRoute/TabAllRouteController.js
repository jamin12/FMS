import { FunctionView } from '../../../view/js/common/FunctionView.js';
import { CarSelectBtnView } from '../../../view/js/common/CarSelectBtnView.js';
import { PagingView } from '../../../view/js/common/PagingView.js';
import { TabAllRouteView } from '../../../view/js/main/Tab02AllRoute/TabAllRouteView.js';
import { TabAllRouteModel } from '../../../model/main/Tab02AllRoute/TabAllRouteModel.js';

class TabAllRouteController {
  constructor() {
    this.FunctionView = new FunctionView();
    this.CarSelectBtnView = new CarSelectBtnView();
    this.PagingView = new PagingView();
  }

  allRouteHTML() {
    document.getElementById('all_route').innerHTML = `<div class="title_wrap">
			<p class="cm_title01">운행이력조회</p>
		</div>

		${this.CarSelectBtnView.carSelectBtnHTML()}

		<div class="contrl">
			<p>조회기간</p>
			<input type="text" id="past_prev" />
			<p>~</p>
			<input type="text" id="past_today"/>
			<button class="cm_btn01">조회</button>
		</div>

		<div class="contrl_btn">
			<ul>
				<li><button class="cm_btn01" id="past_week">1주일</button></li>
				<li><button class="cm_btn01" id="past_month1" value="1">1개월</button></li>
				<li><button class="cm_btn01" id="past_month3" value="3">3개월</button></li>
				<li><button class="cm_btn01" id="past_month6" value="6">6개월</button></li>
			</ul>
		</div>

		<div class="table_wrap">
			<table class="cm_table01 all_route_table">
				<thead>
					<tr>
						<th>구분</th>
						<th>운전지역</th>
						<th>평균운행속도</th>
						<th>총운행거리</th>
						<th>운행시간대</th>
					</tr>
				</thead>
				${this.carPlayListHTML()}
			</table>
		</div>
	
		<div class="page_wrap">
				${this.PagingView.pagingHTML()}
		</div>`;

    this.TabAllRouteView = new TabAllRouteView();
    this.TabAllRouteModel = new TabAllRouteModel();

    this.TabAllRouteView.pastWeek.addEventListener('click', () => {
      this.TabAllRouteModel.pastWeek();
    });

    this.TabAllRouteView.pastMonth01.addEventListener('click', (e) => {
      this.TabAllRouteModel.pastMonth(e.target.value);
    });

    this.TabAllRouteView.pastMonth03.addEventListener('click', (e) => {
      this.TabAllRouteModel.pastMonth(e.target.value);
    });

    this.TabAllRouteView.pastMonth06.addEventListener('click', (e) => {
      this.TabAllRouteModel.pastMonth(e.target.value);
    });
  }

  carPlayListHTML() {
    const carListTableTbody = document.createElement('tbody');

    for (let i = 1; i <= 10; i++) {
      if (i < 10) {
        i = this.FunctionView.numberPad(i, 2);
      }

      let carListTd = `<tr>
				<td><div class="category cm_color${i} car${i}"><i class="xi-car"></i>12가1234</div></td>
				<td>서울 금천구 가산동</td>
				<td>평균운행속도</td>
				<td>1m</td>
				<td>13시</td>
			</tr>`;

      carListTableTbody.insertAdjacentHTML('beforeend', carListTd);
    }
    return carListTableTbody.innerHTML;
  }
}

export { TabAllRouteController };
