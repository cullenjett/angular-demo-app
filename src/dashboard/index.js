import DashboardComponent from "./dashboard.component";

angular
  .module('app.dashboard', [])

  .config(($stateProvider) => {
    $stateProvider
      .state('dashboard', {
        url: '/',
        template: "<dashboard></dashboard>"
      })
  })

  .component('dashboard', DashboardComponent)