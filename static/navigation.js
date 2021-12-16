/*jshint esversion: 6 */
function showCurrentPage() {
	var current_page = sessionStorage.getItem('current_page');
	if (!current_page)
		showHomePage();
	else
		switch (current_page) {
			case 'login':
				showLoginForm();
				break;
			case 'register':
				showRegisterForm();
				break;
			case 'profile':
                var user_id = sessionStorage.getItem('user_id');
                if (user_id)
				    showProfile(parseInt(user_id));
                else showProfile(-1);
				break;
            case 'edit_user':
                showEditUserForm();
                break;
            case 'found_users':
                showFoundUsers();
                break;
            case 'friends':
                showFriends();
                break;
			case 'home':
			default:
				showHomePage();
		}
}

function showHomePage() {
	'use strict';

    sessionStorage.setItem('return_from_profile_dest', 'showHomePage()')
	sessionStorage.setItem('current_page', 'home');
    showSpinner();
	sendRequest('/friends/suggestions', 'GET').then(function(result) {
		var response = JSON.parse(result);

		if (response.not_logged_in) {
            document.getElementById('nav-links').innerHTML = `<li class="nav-item me-2">
                                                                    <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showLoginForm()"><i class="fas fa-sign-in-alt"></i>&nbsp;&nbsp;Zaloguj się</a>
                                                                </li>
                                                                <li class="nav-item me-2">
                                                                    <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showRegisterForm()"><i class="fas fa-user-plus"></i>&nbsp;&nbsp;Zarejestruj się</a>
                                                                </li>`;
			document.getElementById('content').innerHTML = `<div class="container bg-dark shadow text-white p-5 mt-5 mb-5">
                                                                <h1 class="text-center">Witaj na MeetUp!<br><br/>Stronie, która pozwoli Ci zawrzeć wiele nowych znajomości!</h1>
                                                            </div>`;

            hideSpinner();
        } else {
            if (response.success) {
                document.getElementById('nav-links').innerHTML = `<li class="nav-item me-2">
                                                                        <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showProfile(-1)"><i class="fas fa-user"></i>&nbsp;&nbsp;Profil</a>
                                                                    </li>
                                                                    <li class="nav-item me-2">
                                                                        <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showFriends()"><i class="fas fa-users"></i>&nbsp;&nbsp;Znajomi</a>
                                                                    </li>
                                                                    <li class="nav-item me-2">
                                                                        <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="logoutUser()"><i class="fas fa-sign-out-alt"></i>&nbsp;&nbsp;Wyloguj się</a>
                                                                    </li>`;

                var content = `<div class="container bg-dark shadow text-white py-5 my-5">
                                    <h2 class="pb-4 fw-bold text-uppercase text-center">Proponowani znajomi</h2>`;
                for (const el in response) {
                    if (el != 'success') {
                        content += `<a class="link-light" href="javascript:void(0)" onclick="showProfile(${response[el]['id']})"><h3 class="py-3" style="border-bottom: 1px solid rgb(200, 200, 200);">&nbsp;&nbsp;${response[el]['fname']} ${response[el]['lname']}</h3></a>`;
                    }
                }
                content += `</div>`;
                document.getElementById('content').innerHTML = content;

                hideSpinner();
            } else {
                throw 'Error';
            }
        }
	}).catch(function() {
		document.getElementById('content').innerHTML = `<div class="container bg-dark shadow p-5 mt-5 mb-5">
                                                            <h1 class="text-center text-danger">Coś poszło nie tak! Proszę spróbować ponownie</h1>
                                                        </div>`;
        hideSpinner();
	});
}

function showLoginForm() {
	'use strict';

	sessionStorage.setItem('current_page', 'login');
	sendRequest('/login', 'GET').then(function(result) {
		var response = JSON.parse(result);

		if (response.logged_in) {
			showHomePage();
        }
		else {
			document.getElementById('nav-links').innerHTML = `<li class="nav-item me-2">
                                                                    <a class="nav-link active disabled" aria-current="page" href="javascript:void(0)"><i class="fas fa-sign-in-alt"></i>&nbsp;&nbsp;Zaloguj się</a>
                                                                </li>
                                                                <li class="nav-item me-2">
                                                                    <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showRegisterForm()"><i class="fas fa-user-plus"></i>&nbsp;&nbsp;Zarejestruj się</a>
                                                                </li>`;
			document.getElementById('content').innerHTML = `<div id="login-form" class="container py-5">
                                                                <div class="row d-flex justify-content-center align-items-center">
                                                                    <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                                                                        <div class="card bg-dark text-white">
                                                                            <div class="card-body p-5">
                                                                                <div class="mb-md-5 mt-md-4">
                                                                                    <h2 class="fw-bold mb-5 text-uppercase text-center">Logowanie</h2>
                                                                                    <div class="form-outline form-white mb-4">
                                                                                        <input class="form-control form-control-lg" type="email" name="email" placeholder="Adres email"/>
                                                                                        <p id="email-error-msg" class="text-danger mt-2 h6"></p>
                                                                                    </div>
                                                                                    <div class="form-outline form-white mb-4">
                                                                                        <input class="form-control form-control-lg" type="password" name="password" placeholder="Hasło"/>
                                                                                        <p id="password-error-msg" class="text-danger mt-2 h6"></p>
                                                                                    </div>
                                                                                    <p id="login-error-msg" class="text-danger text-center mb-5 h4" style="display: none;"></p>
                                                                                    <button class="btn btn-outline-primary btn-lg w-100" onclick="loginUser()">Zaloguj się</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>        
                                                                    </div>
                                                                </div>
                                                            </div>`;
		}
	}).catch(function() {
		showHomePage();
	});
}

function showRegisterForm() {
	'use strict';

	sessionStorage.setItem('current_page', 'register');
	sendRequest('/login', 'GET').then(function(result) {
		var response = JSON.parse(result);

		if (response.logged_in) {
			showHomePage();
        }
		else {
			document.getElementById('nav-links').innerHTML = `<li class="nav-item me-2">
                                                                    <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showLoginForm()"><i class="fas fa-sign-in-alt"></i>&nbsp;&nbsp;Zaloguj się</a>
                                                                </li>
                                                                <li class="nav-item me-2">
                                                                    <a class="nav-link active disabled" aria-current="page" href="javascript:void(0)"><i class="fas fa-user-plus"></i>&nbsp;&nbsp;Zarejestruj się</a>
                                                                </li>`;
			document.getElementById('content').innerHTML = `<div id="register-form" class="container py-5">
                                                                <div class="row d-flex justify-content-center align-items-center">
                                                                    <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                                                                        <div class="card bg-dark text-white">
                                                                            <div class="card-body p-5">
                                                                                <div class="mb-md-5 mt-md-4">
                                                                                    <h2 class="fw-bold mb-5 text-uppercase text-center">Rejestracja</h2>
                                                                                    <div class="form-outline form-white mb-4">
                                                                                        <input class="form-control form-control-lg" type="text" name="fname" placeholder="Imię"/>
                                                                                        <p id="fname-error-msg" class="text-danger mt-2 h6"></p>
                                                                                    </div>
                                                                                    <div class="form-outline form-white mb-4">
                                                                                        <input class="form-control form-control-lg" type="text" name="lname" placeholder="Nazwisko"/>
                                                                                        <p id="lname-error-msg" class="text-danger mt-2 h6"></p>
                                                                                    </div>
                                                                                    <div class="form-outline form-white mb-4">
                                                                                        <input class="form-control form-control-lg" type="text" name="birth-date" placeholder="Data urodzenia (dd/mm/rrrr)"/>
                                                                                        <p id="birth-date-error-msg" class="text-danger mt-2 h6"></p>
                                                                                    </div>
                                                                                    <div class="form-outline form-white mb-4">
                                                                                        <input class="form-control form-control-lg" type="email" name="email" placeholder="Adres email"/>
                                                                                        <p id="email-error-msg" class="text-danger mt-2 h6"></p>
                                                                                    </div>
                                                                                    <div class="form-outline form-white mb-4">
                                                                                        <input class="form-control form-control-lg" type="password" name="password" placeholder="Hasło"/>
                                                                                        <p id="password-error-msg" class="text-danger mt-2 h6"></p>
                                                                                    </div>
                                                                                    <div class="form-outline form-white mb-4">
                                                                                        <input class="form-control form-control-lg" type="password" name="repeat-password" placeholder="Powtórz hasło"/>
                                                                                        <p id="repeat-password-error-msg" class="text-danger mt-2 h6"></p>
                                                                                    </div>
                                                                                    <p id="registration-error-msg" class="text-danger text-center mb-5 h4" style="display: none;"></p>
                                                                                    <p id="registration-success-msg" class="text-success text-center mb-5 h4" style="display: none;"></p>
                                                                                    <button class="btn btn-outline-primary btn-lg w-100" onclick="registerUser()">Zarejestruj się</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>        
                                                                    </div>
                                                                </div>
                                                            </div>`;
		}
	}).catch(function() {
		showHomePage();
	});
}

function showProfile(id) {
	'use strict';

    var return_from_profile_dest = sessionStorage.getItem('return_from_profile_dest');
    if (!return_from_profile_dest)
        return_from_profile_dest = 'showHomePage()';
    sessionStorage.setItem('user_id', String(id));
	sessionStorage.setItem('current_page', 'profile');
    if (id === -1) {
        showSpinner();
        sendRequest('/user/-1', 'GET').then(function(result) {
            var response = JSON.parse(result);

            if (response.not_logged_in) {
                hideSpinner();
                showHomePage();
            } else {
                if (response.success) {
                    document.getElementById('nav-links').innerHTML = `<li class="nav-item me-2">
                                                                            <a class="nav-link active disabled" aria-current="page" href="javascript:void(0)"><i class="fas fa-user"></i>&nbsp;&nbsp;Profil</a>
                                                                        </li>
                                                                        <li class="nav-item me-2">
                                                                            <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showFriends()"><i class="fas fa-users"></i>&nbsp;&nbsp;Znajomi</a>
                                                                        </li>
                                                                        <li class="nav-item me-2">
                                                                            <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="logoutUser()"><i class="fas fa-sign-out-alt"></i>&nbsp;&nbsp;Wyloguj się</a>
                                                                        </li>`;
                    document.getElementById('content').innerHTML = `<div class="container bg-dark shadow text-white p-5 mt-5 mb-5">
                                                                        <h2 class="pb-3">${response.fname} ${response.lname}&nbsp;&nbsp;<a class="link-secondary" href="javascript:void(0)" onclick="showEditUserForm()" title="Edytuj"><i class="fas fa-edit"></i></a></h2>
                                                                        <p class="ms-3"><strong>Email:&nbsp;&nbsp;</strong>${response.email}</p>
                                                                        <p class="ms-3"><strong>Data urodzenia:&nbsp;&nbsp;</strong>${response.birth_date}</p>
                                                                        <p class="ms-3"><strong>Znajomi:&nbsp;&nbsp;</strong>${response.friends_count}</p>
                                                                    </div>`;
                    hideSpinner();          
                }
                else {
                    hideSpinner();
                    showHomePage();
                }
            }
        }).catch(function() {
            hideSpinner();
            showHomePage();
        });   
    } else {
        showSpinner();
        sendRequest('/user/' + String(id), 'GET').then(function(result) {
            var response = JSON.parse(result);

            if (response.success) {
                if (response.logged_in) {
                    var friend_action = `<a class="link-success" href="javascript:void(0)" onclick="addFriend(${id})"><i class="fas fa-user-plus"></i>&nbsp;&nbsp;Dodaj do znajomych</a>`;
                    if (response.is_friend) {
                        friend_action = `<a class="link-danger" href="javascript:void(0)" onclick="removeFriend(${id})"><i class="fas fa-user-minus"></i>&nbsp;&nbsp;Usuń ze znajomych</a>`;
                    }

                    document.getElementById('nav-links').innerHTML = `<li class="nav-item me-2">
                                                                            <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showProfile(-1)"><i class="fas fa-user"></i>&nbsp;&nbsp;Profil</a>
                                                                        </li>
                                                                        <li class="nav-item me-2">
                                                                            <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showFriends()"><i class="fas fa-users"></i>&nbsp;&nbsp;Znajomi</a>
                                                                        </li>
                                                                        <li class="nav-item me-2">
                                                                            <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="logoutUser()"><i class="fas fa-sign-out-alt"></i>&nbsp;&nbsp;Wyloguj się</a>
                                                                        </li>`;
                    document.getElementById('content').innerHTML = `<div class="container bg-dark shadow text-white p-5 mt-5 mb-5">
                                                                        <h2 class="pb-3">${response.fname} ${response.lname}</h2>
                                                                        <p class="ms-3"><strong>Data urodzenia:&nbsp;&nbsp;</strong>${response.birth_date}</p>
                                                                        <p class="ms-3"><strong>Znajomi:&nbsp;&nbsp;</strong>${response.friends_count}</p>
                                                                        <p class="mt-3" style="padding-bottom: 0;">${friend_action}</p>
                                                                        <p class="mt-3" style="padding-bottom: 0;"><a class="link-secondary" href="javascript:void(0)" onclick="${return_from_profile_dest}"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;Powrót</a></p>
                                                                    </div>`;
                    hideSpinner();
                } else {
                    document.getElementById('nav-links').innerHTML = `<li class="nav-item me-2">
                                                                            <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showLoginForm()"><i class="fas fa-sign-in-alt"></i>&nbsp;&nbsp;Zaloguj się</a>
                                                                        </li>
                                                                        <li class="nav-item me-2">
                                                                            <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showRegisterForm()"><i class="fas fa-user-plus"></i>&nbsp;&nbsp;Zarejestruj się</a>
                                                                        </li>`;
                    document.getElementById('content').innerHTML = `<div class="container bg-dark shadow text-white p-5 mt-5 mb-5">
                                                                        <h2 class="pb-3">${response.fname} ${response.lname}</h2>
                                                                        <p class="ms-3"><strong>Data urodzenia:&nbsp;&nbsp;</strong>${response.birth_date}</p>
                                                                        <p class="ms-3"><strong>Znajomi:&nbsp;&nbsp;</strong>${response.friends_count}</p>
                                                                        <p class="mt-3" style="padding-bottom: 0;"><a class="link-secondary" href="javascript:void(0)" onclick="showFoundUsers()"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;Powrót</a></p>
                                                                    </div>`;
                    hideSpinner();
                }
            } else {
                hideSpinner();
                showHomePage();
            }
        }).catch(function() {
            hideSpinner();
            showHomePage();
        });
    }
}

function showEditUserForm() {
    'use strict';

	sessionStorage.setItem('current_page', 'edit_user');
    showSpinner();
    sendRequest('/user/-1', 'GET').then(function(result) {
        var response = JSON.parse(result);

        if (response.not_logged_in) {
            hideSpinner();
            showHomePage();
        } else {
            if (response.success) {
                document.getElementById('nav-links').innerHTML = `<li class="nav-item me-2">
                                                                        <a class="nav-link active disabled" aria-current="page" href="javascript:void(0)"><i class="fas fa-user"></i>&nbsp;&nbsp;Profil</a>
                                                                    </li>
                                                                    <li class="nav-item me-2">
                                                                        <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showFriends()"><i class="fas fa-users"></i>&nbsp;&nbsp;Znajomi</a>
                                                                    </li>
                                                                    <li class="nav-item me-2">
                                                                        <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="logoutUser()"><i class="fas fa-sign-out-alt"></i>&nbsp;&nbsp;Wyloguj się</a>
                                                                    </li>`;
                document.getElementById('content').innerHTML = `<div id="edit-user-form" class="container py-5">
                                                                    <div class="row d-flex justify-content-center align-items-center">
                                                                        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                                                                            <div class="card bg-dark text-white">
                                                                                <div class="card-body p-5 pb-4">
                                                                                    <div class="mb-md-5 mt-md-4">
                                                                                        <h2 class="fw-bold mb-5 text-uppercase text-center">Edytuj swoje dane</h2>
                                                                                        <div class="form-outline form-white mb-4">
                                                                                            <input class="form-control form-control-lg" type="text" name="fname" placeholder="Imię" value="${response.fname}"/>
                                                                                            <p id="fname-error-msg" class="text-danger mt-2 h6"></p>
                                                                                        </div>
                                                                                        <div class="form-outline form-white mb-4">
                                                                                            <input class="form-control form-control-lg" type="text" name="lname" placeholder="Nazwisko" value="${response.lname}"/>
                                                                                            <p id="lname-error-msg" class="text-danger mt-2 h6"></p>
                                                                                        </div>
                                                                                        <div class="form-outline form-white mb-4">
                                                                                            <input class="form-control form-control-lg" type="text" name="birth-date" placeholder="Data urodzenia (dd/mm/rrrr)" value="${response.birth_date}"/>
                                                                                            <p id="birth-date-error-msg" class="text-danger mt-2 h6"></p>
                                                                                        </div>
                                                                                        <div class="form-outline form-white mb-4">
                                                                                            <input class="form-control form-control-lg" type="email" name="email" placeholder="${response.email}" disabled/>
                                                                                        </div>
                                                                                        <div class="form-outline form-white mb-4">
                                                                                            <input class="form-control form-control-lg" type="password" name="password" placeholder="Nowe hasło (opcjonalne)"/>
                                                                                            <p id="password-error-msg" class="text-danger mt-2 h6"></p>
                                                                                        </div>
                                                                                        <div class="form-outline form-white mb-4">
                                                                                            <input class="form-control form-control-lg" type="password" name="repeat-password" placeholder="Powtórz nowe hasło"/>
                                                                                            <p id="repeat-password-error-msg" class="text-danger mt-2 h6"></p>
                                                                                        </div>
                                                                                        <p id="edit-user-error-msg" class="text-danger text-center mb-5 h4" style="display: none;"></p>
                                                                                        <button class="btn btn-outline-primary btn-lg w-100" onclick="editUser()">Zatwierdź</button>
                                                                                        <p class="w-100 text-center mt-3" style="padding-bottom: 0;"><a class="link-secondary" href="javascript:void(0)" onclick="showProfile(-1)"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;Powrót</a></p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>        
                                                                        </div>
                                                                    </div>
                                                                </div>`;
                hideSpinner();
            }
            else {
                hideSpinner();
                showHomePage();
            }
        }
    }).catch(function() {
        hideSpinner();
        showHomePage();
    });
}

function showFoundUsers() {
    'use strict';

    sessionStorage.setItem('return_from_profile_dest', 'showFoundUsers()');
	sessionStorage.setItem('current_page', 'found_users');
    var name_str = String(document.getElementsByName('find-users')[0].value);
    if (name_str.replace(/\s/g, '') === '')
        name_str = '*';
	showSpinner();
    sendRequest('/users/' + name_str, 'GET').then(function(result) {
        var response = JSON.parse(result);

        if (response.success) {
            var nmb_of_records = 0;
            var nmb_of_records_text = '';

            if (response.logged_in) {
                for (const el in response) {
                    if (el != 'success' && el != 'logged_in') {
                        nmb_of_records++;
                    }
                }
                if (nmb_of_records === 1) {
                    nmb_of_records_text = 'wynik';
                }
                else {
                    nmb_of_records_text = 'wyniki/-ów';
                }

                document.getElementById('nav-links').innerHTML = `<li class="nav-item me-2">
                                                                        <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showProfile(-1)"><i class="fas fa-user"></i>&nbsp;&nbsp;Profil</a>
                                                                    </li>
                                                                    <li class="nav-item me-2">
                                                                        <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showFriends()"><i class="fas fa-users"></i>&nbsp;&nbsp;Znajomi</a>
                                                                    </li>
                                                                    <li class="nav-item me-2">
                                                                        <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="logoutUser()"><i class="fas fa-sign-out-alt"></i>&nbsp;&nbsp;Wyloguj się</a>
                                                                    </li>`;
                
                var content = `<div class="container bg-dark shadow text-white py-5 my-5">
                                    <h2 class="pb-4 fw-bold text-uppercase text-center">Znaleziono ${nmb_of_records} ${nmb_of_records_text} dla zapytania <i>${name_str}</i></h2>`;
                for (const el in response) {
                    if (el != 'success' && el != 'logged_in') {
                        content += `<a class="link-light" href="javascript:void(0)" onclick="showProfile(${response[el]['id']})"><h3 class="py-3" style="border-bottom: 1px solid rgb(200, 200, 200);">&nbsp;&nbsp;${response[el]['fname']} ${response[el]['lname']}</h3></a>`;
                    }
                }
                content += `</div>`;
                document.getElementById('content').innerHTML = content;

                hideSpinner();
            } else {
                for (const el in response) {
                    if (el != 'success') {
                        nmb_of_records++;
                    }
                }
                if (nmb_of_records === 1) {
                    nmb_of_records_text = 'wynik';
                }
                else {
                    switch(nmb_of_records % 10) {
                        case 2:
                        case 3:
                        case 4:
                            nmb_of_records_text = 'wyniki';
                            break;
                        default:
                            nmb_of_records_text = 'wyników';
                    }
                }

                document.getElementById('nav-links').innerHTML = `<li class="nav-item me-2">
                                                                        <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showLoginForm()"><i class="fas fa-sign-in-alt"></i>&nbsp;&nbsp;Zaloguj się</a>
                                                                    </li>
                                                                    <li class="nav-item me-2">
                                                                        <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showRegisterForm()"><i class="fas fa-user-plus"></i>&nbsp;&nbsp;Zarejestruj się</a>
                                                                    </li>`;

                var content = `<div class="container bg-dark shadow text-white py-5 my-5">
                                    <h2 class="pb-4 fw-bold text-uppercase text-center">Znaleziono ${nmb_of_records} ${nmb_of_records_text} dla zapytania <i>${name_str}</i></h2>`;
                for (const el in response) {
                    if (el != 'success') {
                        content += `<a class="link-light" href="javascript:void(0)" onclick="showProfile(${response[el]['id']})"><h3 class="py-3" style="border-bottom: 1px solid rgb(200, 200, 200);">&nbsp;&nbsp;${response[el]['fname']} ${response[el]['lname']}</h3></a>`;
                    }
                }
                content += `</div>`;
                document.getElementById('content').innerHTML = content;
                
                hideSpinner();
            }
        } else {
            hideSpinner();
            showHomePage();
        }
    }).catch(function() {
        hideSpinner();
        showHomePage();
    });
}

function showFriends() {
    'use strict';

    sessionStorage.setItem('return_from_profile_dest', 'showFriends()');
	sessionStorage.setItem('current_page', 'friends');
    showSpinner();
    sendRequest('/friends/profile', 'GET').then(function(result) {
        var response = JSON.parse(result);

        if (response.not_logged_in) {
            hideSpinner();
            showHomePage();
        } else {
            if (response.success) {
                document.getElementById('nav-links').innerHTML = `<li class="nav-item me-2">
                                                                            <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="showProfile(-1)"><i class="fas fa-user"></i>&nbsp;&nbsp;Profil</a>
                                                                        </li>
                                                                        <li class="nav-item me-2">
                                                                            <a class="nav-link active disabled" aria-current="page" href="javascript:void(0)"><i class="fas fa-users"></i>&nbsp;&nbsp;Znajomi</a>
                                                                        </li>
                                                                        <li class="nav-item me-2">
                                                                            <a class="nav-link" aria-current="page" href="javascript:void(0)" onclick="logoutUser()"><i class="fas fa-sign-out-alt"></i>&nbsp;&nbsp;Wyloguj się</a>
                                                                        </li>`;
                var content = `<div class="container bg-dark shadow text-white py-5 my-5">
                                    <h2 class="pb-4 fw-bold text-uppercase text-center">Lista Twoich znajomych</h2>`;
                let i = 0;
                for (const el in response) {
                    if (el !== 'success') {
                        i++;
                        content += `<a class="link-light" href="javascript:void(0)" onclick="showProfile(${response[el]['id']})"><h3 class="py-3" style="border-bottom: 1px solid rgb(200, 200, 200);">&nbsp;&nbsp;${response[el]['fname']} ${response[el]['lname']}</h3></a>`;
                    }
                }
                if (i === 0) {
                    content += `<h3 class="py-3 text-center">Nie masz jeszcze żadnych znajomych</h3>`;
                }
                content += `</div>`;
                document.getElementById('content').innerHTML = content;

                hideSpinner();
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