import { CarSelectBtnView } from '../../../view/js/common/CarSelectBtnView.js';
import { PagingView } from '../../../view/js/common/PagingView.js';
import { TabNowPlayView } from '../../../view/js/main/Tab03NowPlay/TabNowPlayView.js';
import { TabNowPlayModel } from '../../../model/main/Tab03NowPlay/TabNowPlayModel.js';
import { TabAllRouteController } from '../Tab02AllRoute/TabAllRouteController.js';

class TabNowPlayController {
  constructor() {
    this.CarSelectBtnView = new CarSelectBtnView();
    this.PagingView = new PagingView();
    this.TabNowPlayView = new TabNowPlayView();
    this.TabNowPlayModel = new TabNowPlayModel();
    this.tabAllRouteController = new TabAllRouteController();
  }

  playSearcthHTML() {
    document.getElementById('play_search').innerHTML = `<div class="car_box car02">
			<div class="title_wrap">
				<p class="cm_title01">실시간조회</p>
			</div>
			
			${this.CarSelectBtnView.carSelectBtnHTML()}

			<div class="table_wrap">
				<table class="cm_table01">
					<thead>
						<tr>
							<th>구분</th>
							<th>운전지역</th>
							<th>평균운행속도</th>
							<th>총운행거리</th>
							<th>운행시간대</th>
						</tr>
					</thead>
					${this.tabAllRouteController.carPlayListHTML()}
				</table>
			</div>

			<div class="page_wrap">
			${this.PagingView.pagingHTML()}
			</div>
		</div>`;
  }
}

export { TabNowPlayController };
