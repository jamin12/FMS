import { LoginView } from '../../view/js/auth/LoginView.js';

class LoginModel {
  constructor() {
    this.LoginView = new LoginView();

    this.id = 'ru112ffsff@naver.com';
    this.pw = 'test1234';
  }

  loginAjax(startDone) {
    $.ajax({
      method: 'POST',
      url: `http://175.197.91.20:53012/v1/auth/login`,
      dataType: 'json',
      async: false,
      data: {
        email: this.id,
        password: this.pw,
      },
    })
      .done((response) => {
        console.log('login success', response);
        startDone;
      })
      .fail((err) => {
        console.log('login fail', err);
      });
  }

  // loginInputEnter(){
  // 	if(this.LoginView.userID.value !== "" && this.LoginView.userPW.value){
  // 		console.log("둘다 입력됨")
  // 	}else{
  // 		console.log("하나만 입력됨")
  // 	}
  // }
}

export { LoginModel };
