/*jshint esversion: 6 */
function loginValidation() {
	'use strict';

	var data_valid = true;
	var email = '';
	var password = '';

	if (document.getElementById('login-form')) {
		const email_error_msg = document.getElementById('email-error-msg');
		const password_error_msg = document.getElementById('password-error-msg');
		const email_re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		const password_re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,20}$/;

		email = String(document.getElementsByName('email')[0].value).toLowerCase();
		password = String(document.getElementsByName('password')[0].value);
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
	} else {
		data_valid = false;
	}

	return {
		valid: data_valid,
		email: email,
		password: password
	};
}

function registerValidation() {
	'use strict';

	var data_valid = true;
	var fname = '';
	var lname = '';
	var birth_date = '';
	var birth_date_valid = '';
	var email = '';
	var password = '';
	var repeat_password = '';

	if (document.getElementById('register-form')) {
		const fname_error_msg = document.getElementById('fname-error-msg');
		const lname_error_msg = document.getElementById('lname-error-msg');
		const birth_date_error_msg = document.getElementById('birth-date-error-msg');
		const email_error_msg = document.getElementById('email-error-msg');
		const password_error_msg = document.getElementById('password-error-msg');
		const repeat_password_error_msg = document.getElementById('repeat-password-error-msg');
		const email_re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		const password_re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,20}$/;

		fname = String(document.getElementsByName('fname')[0].value);
		lname = String(document.getElementsByName('lname')[0].value);
		birth_date = String(document.getElementsByName('birth-date')[0].value);
		email = String(document.getElementsByName('email')[0].value).toLowerCase();
		password = String(document.getElementsByName('password')[0].value);
		repeat_password = String(document.getElementsByName('repeat-password')[0].value);
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
					} else {
						birth_date_valid = addZero(day) + '/' + addZero(month) + '/' + year;
					}
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
	} else {
		data_valid = false;
	}

	return {
		valid: data_valid,
		fname: fname,
		lname: lname,
		birth_date: birth_date_valid,
		email: email,
		password: password
	};
}

function editUserValidation() {
	'use strict';

	var data_valid = true;
	var fname = '';
	var lname = '';
	var birth_date = '';
	var birth_date_valid = '';
	var password = '';
	var repeat_password = '';

	if (document.getElementById('edit-user-form')) {
		const fname_error_msg = document.getElementById('fname-error-msg');
		const lname_error_msg = document.getElementById('lname-error-msg');
		const birth_date_error_msg = document.getElementById('birth-date-error-msg');
		const password_error_msg = document.getElementById('password-error-msg');
		const repeat_password_error_msg = document.getElementById('repeat-password-error-msg');
		const password_re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,20}$/;

		fname = String(document.getElementsByName('fname')[0].value);
		lname = String(document.getElementsByName('lname')[0].value);
		birth_date = String(document.getElementsByName('birth-date')[0].value);
		password = String(document.getElementsByName('password')[0].value);
		repeat_password = String(document.getElementsByName('repeat-password')[0].value);
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
					} else {
						birth_date_valid = addZero(day) + '/' + addZero(month) + '/' + year;
					}
				}
			} else {
				data_valid = false;
				birth_date_error_msg.innerHTML = `Proszę podać poprawną datę urodzenia`;
			}
		}

		// Password validation
		if (password.length !== 0 && !password.match(password_re)) {
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
	} else {
		data_valid = false;
	}

	return {
		valid: data_valid,
		fname: fname,
		lname: lname,
		birth_date: birth_date_valid,
		password: password
	};
}