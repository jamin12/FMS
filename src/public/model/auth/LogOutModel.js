
class LogOutModel {
	logOutAjax(){
		$.ajax({
			method:"GET",
			url:`http://175.197.91.20:53012/v1/auth/logout`,
			dataType:'json',
			// data:{
			// 	"id": this.id,
			// 	"password": this.pw
			// }
		}).done((response) => {
			console.log("logout success",response);
			startDone;
		}).fail((err)=>{
			console.log("logout fail",err);
		});
	}
}

export { LogOutModel }