/*jshint esversion: 6 */
function loginUser() {
	'use strict';

	var validation_result = loginValidation();
	var data_valid = validation_result.valid;
	var email = validation_result.email;
	var password = validation_result.password;

	if (data_valid) {
		const login_error_msg = document.getElementById('login-error-msg');
		login_error_msg.style.display = 'none';
		login_error_msg.innerHTML = '';

		var message = {
			'email': email,
			'password': CryptoJS.MD5(password).toString()
		};
		message = JSON.stringify(message);

		showSpinner();
		sendRequest('/login', 'POST', message).then(function(result) {
			var response = JSON.parse(result);

			if (response.logged_in) {
				hideSpinner();
				showHomePage();
			} else {
				if (response.success) {
					hideSpinner();
					showHomePage();
				} else {
					login_error_msg.style.display = 'block';
					login_error_msg.innerHTML = `Podano błędny adres email lub hasło`;
					hideSpinner();
				}
			}
		}).catch(function() {
			login_error_msg.style.display = 'block';
			login_error_msg.innerHTML = `Logowanie nie powiodło się, proszę spróbować ponownie`;
			hideSpinner();
		});
	}
}

function registerUser() {
	'use strict';

	var validation_result = registerValidation();
	var data_valid = validation_result.valid;
	var fname = validation_result.fname;
	var lname = validation_result.lname;
	var birth_date = validation_result.birth_date;
	var email = validation_result.email;
	var password = validation_result.password;

	if (data_valid) {
		const registration_success_msg = document.getElementById('registration-success-msg');
		const registration_error_msg = document.getElementById('registration-error-msg');
		registration_success_msg.style.display = 'none';
		registration_error_msg.style.display = 'none';
		registration_success_msg.innerHTML = '';
		registration_error_msg.innerHTML = '';

		var message = {
			'fname': fname,
			'lname': lname,
			'birth_date': birth_date,
			'email': email,
			'password': CryptoJS.MD5(password).toString()
		};
		message = JSON.stringify(message);

		showSpinner();
		sendRequest('/user/-1', 'POST', message).then(function(result) {
			var response = JSON.parse(result);

			if (response.logged_in) {
				hideSpinner();
				showHomePage();
			} else {
				if (response.success) {
					registration_success_msg.style.display = 'block';
					registration_success_msg.innerHTML = `Rejestracja powiodła się! Możesz się teraz zalogować`;
					hideSpinner();
				} else {
					registration_error_msg.style.display = 'block';
					registration_error_msg.innerHTML = `Podany adres email jest już zajęty`;
					hideSpinner();
				}
			}
		}).catch(function() {
			registration_error_msg.style.display = 'block';
			registration_error_msg.innerHTML = `Rejestracja nie powiodła się, proszę spróbować ponownie`;
			hideSpinner();
		});
	}
}

function logoutUser() {
	'use strict';

	showSpinner();
	sendRequest('/logout', 'GET').then(function() {
		hideSpinner();
		showHomePage();
	}).catch(function() {
		hideSpinner();
		showHomePage();
	});
}

function editUser() {
	'use strict';

	var validation_result = editUserValidation();
	var data_valid = validation_result.valid;
	var fname = validation_result.fname;
	var lname = validation_result.lname;
	var birth_date = validation_result.birth_date;
	var password = validation_result.password;

	if (data_valid) {
		const edit_user_error_msg = document.getElementById('edit-user-error-msg');
		edit_user_error_msg.style.display = 'none';
		edit_user_error_msg.innerHTML = '';

		var message;
		if (password.length !== 0) {
			message = {
				'fname': fname,
				'lname': lname,
				'birth_date': birth_date,
				'password': CryptoJS.MD5(password).toString()
			};
		} else {
			message = {
				'fname': fname,
				'lname': lname,
				'birth_date': birth_date
			};
		}
		message = JSON.stringify(message);

		showSpinner();
		sendRequest('/user/-1', 'PUT', message).then(function(result) {
			var response = JSON.parse(result);

			if (response.not_logged_in) {
				hideSpinner();
				showHomePage();
			} else {
				if (response.success) {
					hideSpinner();
					showProfile(-1);
				} else {
					edit_user_error_msg.style.display = 'block';
					edit_user_error_msg.innerHTML = `Edycja danych nie powiodła się, proszę spróbować ponownie`;
					hideSpinner();
				}
			}
		}).catch(function() {
			edit_user_error_msg.style.display = 'block';
			edit_user_error_msg.innerHTML = `Edycja danych nie powiodła się, proszę spróbować ponownie`;
			hideSpinner();
		});
	}
}

function addFriend(id) {
	'use strict';

	showSpinner();
	sendRequest('/friend/' + id, 'POST').then(function(result) {
		var response = JSON.parse(result);

		if (response.not_logged_in) {
			hideSpinner();
			showHomePage();
		} else {
			if (response.success) {
				hideSpinner();
				showProfile(id);
			} else {
				hideSpinner();
				showHomePage();
			}
		}
	}).catch(function() {
		hideSpinner();
		showHomePage();
	});
}

function removeFriend(id) {
	'use strict';

	showSpinner();
	sendRequest('/friend/' + id, 'DELETE').then(function(result) {
		var response = JSON.parse(result);

		if (response.not_logged_in) {
			hideSpinner();
			showHomePage();
		} else {
			if (response.success) {
				hideSpinner();
				showProfile(id);
			} else {
				hideSpinner();
				showHomePage();
			}
		}
	}).catch(function() {
		hideSpinner();
		showHomePage();
	});
}