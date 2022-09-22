/*******************************************
*  [공통] 공통으로 사용하는 함수 모음 
********************************************/
class FunctionView {
	// 숫자 자리수 맞추기
	numberPad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
	}

}

export { FunctionView }