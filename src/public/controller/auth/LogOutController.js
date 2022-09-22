import { LogOutView } from '../../view/js/auth/LogOutView.js'
import { LogOutModel } from '../../model/auth/LogOutModel.js'

class LogOutController{
	constructor(){
		this.LogOutView = new LogOutView();
		this.LogOutModel = new LogOutModel();
	}

}

new LogOutController();