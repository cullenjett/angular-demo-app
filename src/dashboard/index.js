import DashboardComponent from "./dashboard.component";

angular
  .module('app.dashboard', [])

  .config(($routeProvider) => {
    $routeProvider
      .when('/', {
        template: "<dashboard></dashboard>"
      })
  })

  .component('dashboard', DashboardComponent)