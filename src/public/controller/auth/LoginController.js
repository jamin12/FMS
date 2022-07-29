import { EffectView } from '../../view/js/common/EffectView.js';
import { LoginModel } from '../../model/auth/LoginModel.js';
import { LoginView } from '../../view/js/auth/LoginView.js';

class LoginController {
  constructor() {
    this.LoginView = new LoginView();
    this.LoginModel = new LoginModel();
    this.EffectView = new EffectView();
    this.init();
  }

  init() {
    this.loginBoxHTML();
  }

  // [로그인] 로그인 인풋 박스
  loginBoxHTML() {
    this.LoginView.loginBoxHTML();

    window.onload = () => {
      this.EffectView.loginBoxEffectList(this.LoginView);
    };
  }

  // loginEnter(){
  // 	document.getElementById("login_btn").addEventListener("click",()=>{
  // 		if(window.event.keyCode == 13){
  // 			alert("로그인 엔터키 테스트");
  // 		}
  // 	})
  // }
}

new LoginController();
