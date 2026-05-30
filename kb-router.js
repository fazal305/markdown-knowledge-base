const ROUTES = {
    home: null,
    note: null,
    edit: null
};

/* Navigate to a hash */

function navigateTo(hash) {

    window.location.hash = hash;

}

/* Parse current hash */

function parseHash() {

    let currentHash = window.location.hash.replace('#', '');

    if (!currentHash) {

        return {
            route: 'home',
            param: null
        };

    }

    const parts = currentHash.split('/');

    return {
        route: parts[0],
        param: parts[1] || null
    };

}

/* Handle route changes */

function handleRoute() {

    const routeData = parseHash();

    const routeHandler = ROUTES[routeData.route];

    if (typeof routeHandler === 'function') {

        routeHandler(routeData.param);

    } else {

        $('#app-content').html(`
            <h1>404</h1>
            <p>Route not found.</p>

            <button class="btn btn-info" onclick="navigateTo('')">
                Back Home
            </button>
        `);

    }

}

/* Listen for navigation */

window.addEventListener('hashchange', handleRoute);

window.addEventListener('load', handleRoute);