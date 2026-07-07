const ROUTES = {
  home: null,
  note: null,
  edit: null
};

function navigateTo(hash) {
  window.location.hash = hash;
}

function parseHash() {
  const currentHash = window.location.hash.replace("#", "");

  if (!currentHash) {
    return {
      route: "home",
      param: null
    };
  }

  const parts = currentHash.split("/");

  return {
    route: parts[0],
    param: parts[1] || null
  };
}

function handleRoute() {
  const routeData = parseHash();
  const routeHandler = ROUTES[routeData.route];

  if (typeof routeHandler === "function") {
    routeHandler(routeData.param);
    return;
  }

  const appContent = document.getElementById("app-content");
  appContent.innerHTML = "";

  const title = createElement("h1", "", "404");
  const message = createElement("p", "", "Route not found.");
  const button = createElement("button", "primary-btn", "Back Home");
  button.type = "button";
  button.addEventListener("click", function () {
    navigateTo("");
  });

  appContent.append(title, message, button);
}

window.addEventListener("hashchange", handleRoute);
