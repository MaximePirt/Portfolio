// document.addEventListener('headerLoaded', function() {
// //Make menu invisible on click on button
// 	let button = document.getElementById('menu_button');
// 	button.addEventListener('click', function() {
// 		let menu = document.getElementById('menu_nav');
// 		if (menu.style.display === 'none')
// 			menu.style.display = 'flex';
// 		else
// 			menu.style.display = 'none';
// 	});
// 	button.addEventListener('keypress', function() {
// 		let menu = document.getElementById('menu_nav');
// 		if (menu.style.display === 'none')
// 			menu.style.display = 'flex';
// 		else
// 			menu.style.display = 'none';
// 	});
// });
console.log('button.js chargé avec succès');

document.addEventListener('headerLoaded', function () {
	console.log('Listener success');


		let button = document.getElementById('menu_button');
		let menu = document.getElementById('menu_nav');
		console.log('wsh');

		if (button && menu) {
			console.log('Éléments trouvés :', button, menu);
		
			button.addEventListener('click', function () {
				if (menu.style.display === 'none' || menu.style.display === '') {
				    menu.style.display = 'flex'; // Set to flex to align items
				} else {
			    menu.style.display = 'none';
				}
   			});
			button.addEventListener('keypress', function () {
				if (menu.style.display === 'none' || menu.style.display === '') {
					menu.style.display = 'flex';
				} else {
					menu.style.display = 'none';
				}
			});
		}
		else {
			console.log('Éléments non trouvés :', button, menu);
		}
});