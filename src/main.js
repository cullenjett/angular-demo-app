import './js/modules/quickstart-users';
import '../tmp/templates';
import Base from "./js/modules/quickbase-client"

var mainApp = angular.module("mainApp", ["quickstart-users"])

mainApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', { 
      templateUrl: 'partials/app/dashboard-template.html', 
      controller: "DashboardController" 
    })
});

mainApp.controller('DashboardController', function($scope){
  console.log('dashboard controller...');

	Base.activities.doQuery({ rid: { XEX: "" }}, {}, function(activities){
    activities.forEach(function(activity, index){
      var row = $("#activityTemplate").clone().removeAttr("id");

      $(row).find(".number").html(index + 1);
      $(row).find(".customerName").html(activity.customerName);
      $(row).find(".type").html(activity.type);
      $(row).find(".date").html(BaseHelpers.dateToString(activity.date));

      $("#activities").append(row);
    });
	});
})