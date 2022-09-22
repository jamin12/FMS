/*******************************************
*  [공통] 페이지
********************************************/
class PagingView {

	pagingHTML(mainView){
		const pageDiv = document.createElement('div');
		pageDiv.classList.add('cm_page01');

		let pagePrev = `<a href="#" class="page_prev"> < </a>`;
		pageDiv.insertAdjacentHTML('beforeend',pagePrev);


		for(let i=1; i<=5; i++){
			if(i == 1){
				let pageNum = `<a href="#" class="page_num active">${i}</a>`;
				pageDiv.insertAdjacentHTML('beforeend',pageNum);
			}else{
				let pageNum = `<a href="#" class="page_num">${i}</a>`;
				pageDiv.insertAdjacentHTML('beforeend',pageNum);
			}
		}

		let pageNext = `<a href="#" class="page_next"> > </a>`;
		pageDiv.insertAdjacentHTML('beforeend',pageNext);
	
		return pageDiv.outerHTML;
	}
}

export { PagingView }