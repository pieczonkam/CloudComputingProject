/*jshint esversion: 6 */
function addZero(value) {
	'use strict';

	value = value.toString();
	if (value.length === 1) 
        return '0' + value;
	return value;
}

function showSpinner()
{
    'use strict';

    if (document.getElementById('toggler-button').offsetParent)
    {
        document.getElementById('toggler-icon').style.display = 'none';
        document.getElementById('spinner-collapse').style.display = 'block';
    }
    else
        document.getElementById('spinner-normal').style.display = 'block';
}

function hideSpinner()
{
    'use strict';

    document.getElementById('spinner-collapse').style.display = 'none';
    document.getElementById('toggler-icon').style.display = 'block';
    document.getElementById('spinner-normal').style.display = 'none';
}