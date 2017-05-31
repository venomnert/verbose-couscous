const ohHey = "Hello World";
let test = 'testing';
let hello = "hello";

console.log(ohHey);

let el = document.querySelector('h1');
el.addEventListener('click', function() {
	if (this.innerHTML === 'changed') {
		this.innerHTML = 'Hello Neerthigan';
	}
	else {
		this.innerHTML = 'changed';
	}
})

// b133c8c93e6948804d9c02a215261afa9b1dad5d
