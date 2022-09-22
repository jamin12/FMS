
class CarInfoObj{
	constructor(jsonObject){
		this.carColor = jsonObject.car_color;
		this.carModel = jsonObject.car_model_nm;
		this.carNicname = jsonObject.car_nm;
		this.carNumber = jsonObject.car_no
		this.onoff = jsonObject.onoff;
		this.lat = jsonObject.lat;
		this.lng = jsonObject.lng;
		this.createdAt = jsonObject.created_at;
		this.updatedAt = jsonObject.updatedAt;
	}
}

export {CarInfoObj};