/*******************************************
*  [공통] 사이드메뉴
********************************************/
class CommonView {
	// [공통] 헤더(로고) HTML
	headerHTML() {
		document.getElementById('logo').innerHTML = 
		`<a href="/index"><img src="./view/img/logo_simbol.jpg" alt=""><span>MOBILTECH</span></a>`;
	}

	// [공통] 네비게이션 HTML
	navbarHTML(){
		document.getElementById('navbar').innerHTML =
		`<ul>
		<li>
			<a href="#" class="car_info"><i class="xi-view-list"></i> 차량정보확인</a>
		</li>
		<li>
			<a href="#" class="all_route"><i class="xi-calendar-list"></i> 운행이력조회</a>
		</li>
		<li>
			<a href="#" class="play_search"><i class="xi-alarm-clock"></i> 실시간조회</a>
		</li>
	</ul>`
	}

	
}

export { CommonView };