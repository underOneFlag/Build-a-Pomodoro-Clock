(function() {

function $(x) {
	const selected = document.querySelectorAll(x);
	const newArray = [];

	for(let i = 0, len = selected.length; i < len; ++i)
		newArray.push(selected[i]);

	return newArray;
}



})();