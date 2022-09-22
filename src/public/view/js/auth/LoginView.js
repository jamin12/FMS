class LoginView {
	constructor(){
		this.loginBox = document.getElementById("login_box");
		this.userID = document.getElementById("id");
		this.userPW = document.getElementById("pw");
	}

	loginBoxHTML(){
		const loginBoxHTML = 
		`<div class="logo"><p>MOBILTECH</p></div>
		<div class="input_wrap">
			<div class="id_wrap">
				<div class="icon_box"><img src="./view/img/person.svg" alt=""></div>
				<input type="text" placeholder="아이디" id="id">
			</div>
			<div class="pw_wrap">
				<div class="icon_box"><img src="./view/img/lock.svg" alt=""></div>
				<input type="password" placeholder="비밀번호" id="pw">
			</div>
		</div>

		<div class="btn_wrap">
			<button class="cm_btn01" id="login_btn">로그인</button>
		</div>`

		this.loginBox.insertAdjacentHTML('afterbegin',loginBoxHTML);
	}

}

export { LoginView }