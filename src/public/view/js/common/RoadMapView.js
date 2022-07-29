/*******************************************
*  [공통] 지도맵
********************************************/
class RoadMapView {
	constructor(){
		this.init();
	}

	init(){
		this.roadMapHTML();
	}

	roadMapHTML(){
		document.getElementById('road_map').innerHTML =
		`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6332.334692922188!2d126.87927302745938!3d37.48037713326524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b61e25b1b386f%3A0xd5613d238dea6907!2zN-2YuOyEoOqwgOyCsOuUlOyngO2EuOuLqOyngOyXrQ!5e0!3m2!1sko!2skr!4v1655366049759!5m2!1sko!2skr" width="100%" height="100%" style="border: 0" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
	}

}

export { RoadMapView };