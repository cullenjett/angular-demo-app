import DashboardComponent from "./dashboard.component";

angular
  .module('app.dashboard', [])

  .config(($stateProvider) => {
    $stateProvider
      .state('app.dashboard', {
        url: '/',
        template: "<dashboard></dashboard>",
        public: true
      })
  })

  .component('dashboard', DashboardComponent)