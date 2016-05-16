import DashboardComponent from "./dashboard.component";

angular
  .module('app.dashboard', [])

  .config(($stateProvider) => {
    $stateProvider
      .state('app.dashboard', {
        url: '/',
        template: "<dashboard></dashboard>",
        title: 'Dashboard'
      })
  })

  .component('dashboard', DashboardComponent)