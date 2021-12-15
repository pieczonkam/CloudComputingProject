/*jshint esversion: 6 */
function loginUser() {
	'use strict';

	sendRequest('/login', 'GET').then(function(result) {
		var response = JSON.parse(result);
		if (response.logged_in)
			showHomePage();
		else {
			const email_error_msg = document.getElementById('email-error-msg');
			const password_error_msg = document.getElementById('password-error-msg');

			const email = String(document.getElementsByName('email')[0].value).toLowerCase();
			const password = String(document.getElementsByName('password')[0].value);

			const email_re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			const password_re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,20}$/;
			var data_valid = true;

			email_error_msg.innerHTML = '';
			password_error_msg.innerHTML = '';

			// Email validation
			if (email.length === 0) {
				data_valid = false;
				email_error_msg.innerHTML = `Proszę podać adres email`;
			} else if (!email.match(email_re)) {
				data_valid = false;
				email_error_msg.innerHTML = `Proszę podać poprawny adres email`;
			}

			// Password validation
			if (password.length === 0) {
				data_valid = false;
				password_error_msg.innerHTML = `Proszę podać hasło`;
			} else if (!password.match(password_re)) {
				data_valid = false;
				password_error_msg.innerHTML = `Proszę podać poprawne hasło:<br></br>
                                                &bull; Od 8 do 20 znaków<br></br>
                                                &bull; Przynajmniej jedna mała litera<br></br>
                                                &bull; Przynajmniej jedna duża litera<br></br>
                                                &bull; Przynajmniej jedna cyfra<br></br>
                                                &bull; Przynajmniej jeden znak specjalny`;
			}

			// Send request if data is valid
			if (data_valid) {
                showSpinner();
				const login_error_msg = document.getElementById('login-error-msg');

				var message = {
					'email': email,
					'password': CryptoJS.MD5(password).toString()
				};
				message = JSON.stringify(message);
				sendRequest('/login', 'POST', message).then(function(result) {
					login_error_msg.style.display = 'none';
					login_error_msg.innerHTML = '';

					var response = JSON.parse(result);
					if (response.success) {
						showHomePage();
                        hideSpinner();
					} else {
						document.getElementsByName('password')[0].value = '';
						login_error_msg.style.display = 'block';
						login_error_msg.innerHTML = `Podano błędny adres email lub hasło`;
                        hideSpinner();
					}
				}).catch(function() {
					login_error_msg.style.display = 'block';
					login_error_msg.innerHTML = `Logowanie nie powiodło się, proszę spróbować ponownie`;
                    hideSpinner();
				});
			}
		}
	}).catch(function() {
		showHomePage();
	});
}

function registerUser() {
	'use strict';

	sendRequest('/login', 'GET').then(function(result) {
		var response = JSON.parse(result);
		if (response.logged_in)
			showHomePage();
		else {
			const fname_error_msg = document.getElementById('fname-error-msg');
			const lname_error_msg = document.getElementById('lname-error-msg');
			const birth_date_error_msg = document.getElementById('birth-date-error-msg');
			const email_error_msg = document.getElementById('email-error-msg');
			const password_error_msg = document.getElementById('password-error-msg');
			const repeat_password_error_msg = document.getElementById('repeat-password-error-msg');

			const fname = String(document.getElementsByName('fname')[0].value);
			const lname = String(document.getElementsByName('lname')[0].value);
			const birth_date = String(document.getElementsByName('birth-date')[0].value);
			const email = String(document.getElementsByName('email')[0].value).toLowerCase();
			const password = String(document.getElementsByName('password')[0].value);
			const repeat_password = String(document.getElementsByName('repeat-password')[0].value);

			const email_re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			const password_re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,20}$/;
			var data_valid = true;

			fname_error_msg.innerHTML = '';
			lname_error_msg.innerHTML = '';
			birth_date_error_msg.innerHTML = '';
			email_error_msg.innerHTML = '';
			password_error_msg.innerHTML = '';
			repeat_password_error_msg.innerHTML = '';

			// Fname validation
			if (fname.length === 0) {
				data_valid = false;
				fname_error_msg.innerHTML = `Proszę podać imię`;
			}

			// Lname validation
			if (lname.length === 0) {
				data_valid = false;
				lname_error_msg.innerHTML = `Proszę podać nazwisko`;
			}

			// Birth date validation
			var birth_date_valid = '';
			if (birth_date.length === 0) {
				data_valid = false;
				birth_date_error_msg.innerHTML = `Proszę podać datę urodzenia`;
			} else {
				var birth_date_split = birth_date.split('/');
				if (birth_date_split.length === 3) {
					var day = birth_date_split[0];
					var month = birth_date_split[1];
					var year = birth_date_split[2];
					var date_obj = new Date(year + '/' + month + '/' + day);
					if (date_obj.toString() === 'Invalid Date') {
						data_valid = false;
						birth_date_error_msg.innerHTML = `Proszę podać poprawną datę urodzenia`;
					} else {
						day = parseInt(day);
						month = parseInt(month);
						year = parseInt(year);
						if (day !== date_obj.getDate() || month !== date_obj.getMonth() + 1 || year !== date_obj.getFullYear()) {
							data_valid = false;
							birth_date_error_msg.innerHTML = `Proszę podać poprawną datę urodzenia`;
						} else birth_date_valid = addZero(day) + '/' + addZero(month) + '/' + year;
					}
				} else {
					data_valid = false;
					birth_date_error_msg.innerHTML = `Proszę podać poprawną datę urodzenia`;
				}
			}

			// Email validation
			if (email.length === 0) {
				data_valid = false;
				email_error_msg.innerHTML = `Proszę podać adres email`;
			} else if (!email.match(email_re)) {
				data_valid = false;
				email_error_msg.innerHTML = `Proszę podać poprawny adres email`;
			}

			// Password validation
			if (password.length === 0) {
				data_valid = false;
				password_error_msg.innerHTML = `Proszę podać hasło`;
			} else if (!password.match(password_re)) {
				data_valid = false;
				password_error_msg.innerHTML = `Proszę podać poprawne hasło:<br></br>
                                                &bull; Od 8 do 20 znaków<br></br>
                                                &bull; Przynajmniej jedna mała litera<br></br>
                                                &bull; Przynajmniej jedna duża litera<br></br>
                                                &bull; Przynajmniej jedna cyfra<br></br>
                                                &bull; Przynajmniej jeden znak specjalny`;
			}

			// Repeat password validation
			if (repeat_password.length === 0) {
				data_valid = false;
				repeat_password_error_msg.innerHTML = `Proszę powtórzyć hasło`;
			} else if (repeat_password !== password) {
				data_valid = false;
				repeat_password_error_msg.innerHTML = `Podano różne hasła`;
			}

			if (data_valid) {
                showSpinner();
				const registration_success_msg = document.getElementById('registration-success-msg');
				const registration_error_msg = document.getElementById('registration-error-msg');

				var message = {
					'fname': fname,
					'lname': lname,
					'birth_date': birth_date_valid,
					'email': email,
					'password': CryptoJS.MD5(password).toString()
				};
				message = JSON.stringify(message);
				sendRequest('/user/-1', 'POST', message).then(function(result) {
					registration_success_msg.style.display = 'none';
					registration_error_msg.style.display = 'none';
					registration_success_msg.innerHTML = '';
					registration_error_msg.innerHTML = '';

					var response = JSON.parse(result);
					if (response.success) {
						registration_success_msg.style.display = 'block';
						registration_success_msg.innerHTML = `Rejestracja powiodła się! Możesz się teraz zalogować`;
                        hideSpinner();
					} else {
						registration_error_msg.style.display = 'block';
						registration_error_msg.innerHTML = `Podany adres email jest już zajęty`;
                        hideSpinner();
					}
				}).catch(function() {
					registration_error_msg.style.display = 'block';
					registration_error_msg.innerHTML = `Rejestracja nie powiodła się, proszę spróbować ponownie`;
                    hideSpinner();
				});
			}
		}
	}).catch(function() {
		showHomePage();
	});
}

function logoutUser() {
	'use strict';

	sendRequest('/logout', 'GET').then(function() {
		showHomePage();
	}).catch(function(error) {
		console.log(error);
	});
}

function editUser() {
    'use strict';

	sendRequest('/login', 'GET').then(function(result) {
		var response = JSON.parse(result);
		if (response.logged_in) {
			const fname_error_msg = document.getElementById('fname-error-msg');
			const lname_error_msg = document.getElementById('lname-error-msg');
			const birth_date_error_msg = document.getElementById('birth-date-error-msg');
			const password_error_msg = document.getElementById('password-error-msg');
			const repeat_password_error_msg = document.getElementById('repeat-password-error-msg');

			const fname = String(document.getElementsByName('fname')[0].value);
			const lname = String(document.getElementsByName('lname')[0].value);
			const birth_date = String(document.getElementsByName('birth-date')[0].value);
			const password = String(document.getElementsByName('password')[0].value);
			const repeat_password = String(document.getElementsByName('repeat-password')[0].value);

			const password_re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,20}$/;
			var data_valid = true;

			fname_error_msg.innerHTML = '';
			lname_error_msg.innerHTML = '';
			birth_date_error_msg.innerHTML = '';
			password_error_msg.innerHTML = '';
			repeat_password_error_msg.innerHTML = '';

			// Fname validation
			if (fname.length === 0) {
				data_valid = false;
				fname_error_msg.innerHTML = `Proszę podać imię`;
			}

			// Lname validation
			if (lname.length === 0) {
				data_valid = false;
				lname_error_msg.innerHTML = `Proszę podać nazwisko`;
			}

			// Birth date validation
			var birth_date_valid = '';
			if (birth_date.length === 0) {
				data_valid = false;
				birth_date_error_msg.innerHTML = `Proszę podać datę urodzenia`;
			} else {
				var birth_date_split = birth_date.split('/');
				if (birth_date_split.length === 3) {
					var day = birth_date_split[0];
					var month = birth_date_split[1];
					var year = birth_date_split[2];
					var date_obj = new Date(year + '/' + month + '/' + day);
					if (date_obj.toString() === 'Invalid Date') {
						data_valid = false;
						birth_date_error_msg.innerHTML = `Proszę podać poprawną datę urodzenia`;
					} else {
						day = parseInt(day);
						month = parseInt(month);
						year = parseInt(year);
						if (day !== date_obj.getDate() || month !== date_obj.getMonth() + 1 || year !== date_obj.getFullYear()) {
							data_valid = false;
							birth_date_error_msg.innerHTML = `Proszę podać poprawną datę urodzenia`;
						} else birth_date_valid = addZero(day) + '/' + addZero(month) + '/' + year;
					}
				} else {
					data_valid = false;
					birth_date_error_msg.innerHTML = `Proszę podać poprawną datę urodzenia`;
				}
			}

			// Password validation
            var update_password = true;
			if (password.length === 0)
				update_password = false;
			else if (!password.match(password_re)) {
				data_valid = false;
				password_error_msg.innerHTML = `Proszę podać poprawne hasło:<br></br>
                                                &bull; Od 8 do 20 znaków<br></br>
                                                &bull; Przynajmniej jedna mała litera<br></br>
                                                &bull; Przynajmniej jedna duża litera<br></br>
                                                &bull; Przynajmniej jedna cyfra<br></br>
                                                &bull; Przynajmniej jeden znak specjalny`;
			}

			// Repeat password validation
			if (repeat_password !== password) {
				data_valid = false;
				repeat_password_error_msg.innerHTML = `Podano różne hasła`;
			}

			if (data_valid) {
                showSpinner();
				const edit_user_error_msg = document.getElementById('edit-user-error-msg');

                if (update_password)
                    var message = {
                        'fname': fname,
                        'lname': lname,
                        'birth_date': birth_date_valid,
                        'password': CryptoJS.MD5(password).toString()
                    };
                else
                    var message = {
                        'fname': fname,
                        'lname': lname,
                        'birth_date': birth_date_valid,
                    };
				message = JSON.stringify(message);
				sendRequest('/user/-1', 'PUT', message).then(function(result) {
					edit_user_error_msg.style.display = 'none';
					edit_user_error_msg.innerHTML = '';

					var response = JSON.parse(result);
					if (response.success) {
						showProfile(-1);
                        hideSpinner();
					} else {
						edit_user_error_msg.style.display = 'block';
						edit_user_error_msg.innerHTML = `Edycja danych nie powiodła się, proszę spróbować ponownie`;
                        hideSpinner();
					}
				}).catch(function() {
					edit_user_error_msg.style.display = 'block';
					edit_user_error_msg.innerHTML = `Edycja danych nie powiodła się, proszę spróbować ponownie`;
                    hideSpinner();
				});
			}
        } else
            showHomePage();
	}).catch(function() {
		showHomePage();
	});
}

function addFriend(id) {
    'use strict';

    sendRequest('/login', 'GET').then(function(result) {
        var response = JSON.parse(result);
        if (response.logged_in) {
            showSpinner();
            sendRequest('/friend/' + id, 'POST').then(function(result_2) {
                var response_2 = JSON.parse(result_2);
                if (response_2.success) {
                    showProfile(id);
                } else {
                    showHomePage();
                    hideSpinner();
                }
            }).catch(function() {
                showHomePage();
                hideSpinner();
            });
        }
        else {
            showHomePage();
        }
    }).catch(function() {
        showHomePage();
    });
}

function removeFriend(id) {
    'use strict';

    sendRequest('/login', 'GET').then(function(result) {
        var response = JSON.parse(result);
        if (response.logged_in) {
            showSpinner();
            sendRequest('/friend/' + id, 'DELETE').then(function(result_2) {
                var response_2 = JSON.parse(result_2);
                if (response_2.success) {
                    showProfile(id);
                } else {
                    showHomePage();
                    hideSpinner();
                }
            }).catch(function() {
                showHomePage();
                hideSpinner();
            });
        }
        else {
            showHomePage();
        }
    }).catch(function() {
        showHomePage();
    });
}