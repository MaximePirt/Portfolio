document.addEventListener("DOMContentLoaded", function() {
	// Include header
	console.log("DOM loaded");
	fetch("components/header.html")
		.then(response => response.text())
		.then(data => {
			document.getElementById("header").innerHTML = data;
			console.log("Header load with success");

			const headerLoadeedEvent = new Event("headerLoaded");
			document.dispatchEvent(headerLoadeedEvent);

			// const script = document.createElement("script");
			// script.src = "js/button.js";
			// document.body.appendChild(script);
		})
		.catch(error => {
			console.error("Error:", error);
		});

	// Include footer
	fetch("components/footer.html")
		.then(response => response.text())
		.then(data => {
			document.getElementById("footer").innerHTML = data;
		});	
});
