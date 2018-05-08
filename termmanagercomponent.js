(function () {
    'use strict';
    angular.module(AppName).component("termManager", {
        bindings: {},
        templateUrl: "/Scripts/components/views/termManager.html",
        controller: function (requestService, $scope, $window, $uibModal) {
            var vm = this;
            vm.$onInit = _init;
            vm.termCategory = [];
            vm.termModel = {};
            vm.categoryModalLaunch = _categoryModalLaunch;
            vm.termFormSubmit = _termFormSubmit;
            vm.clearForm = _clearForm;
            vm.allTerms = [];
            vm.popTermForm = _popTermForm;
            vm.deleteTerm = _deleteTerm;
            vm.getAllTerms = _getAllTerms;

            function _init() {
                requestService.ApiRequestService("GET", "/api/TermCategories") //through the api
                    .then(function (response) {
                        vm.termCategory = response.items;


                    })
                    .catch(function (err) {
                        console.log(err)
                    })

                requestService.ApiRequestService("GET", "/api/TermContents") //through the api
                    .then(function (response) {
                        vm.allTerms = response.items;


                    })
                    .catch(function (err) {
                        console.log(err)
                    })

            }

            function _getAllTerms() {
                requestService.ApiRequestService("GET", "/api/TermContents") //through the api
                    .then(function (response) {
                        vm.allTerms = response.items;

                    })
                    .catch(function (err) {
                        console.log(err)
                    })

            }
            function _termFormSubmit() {

                if (!vm.termModel.id) {
                    requestService.ApiRequestService("POST", "/api/TermContents", vm.termModel)
                        .then(function (response) {
                            vm.termModel = {};
                            _getAllTerms();
                            $scope.active = $scope.index = 1;

                        })
                        .catch(function (err) {
                            console.log(err)
                        })

                } else {
                    requestService.ApiRequestService("PUT", "/api/TermContents/" + vm.termModel.id, vm.termModel)
                        .then(function (response) {
                            vm.termModel = {};
                            _getAllTerms();
                            $scope.active = $scope.index = 1;

                        })
                        .catch(function (err) {
                            console.log(err)
                        })

                }
            }

            function _clearForm() {
                vm.termModel = {};
            }

            function _categoryModalLaunch() {

                var modalInstance = $uibModal.open({ //setting the controller to modalInstance
                    animation: vm.animationsEnabled,
                    component: 'termCategoryModalComponent',
                    size: 'md',

                });

                modalInstance.result.then(function () {
                    // this function only executes when the modal is closed

                    _init();

                }, function () {
                    // this function only executes when the modal is dismissed
                    _init();
                });
            }

            function _popTermForm(item) {
                vm.termModel = item;
                $scope.active = $scope.index = 0;
            }

            function _deleteTerm(id) {
                swal({
                    title: "Are you sure you want to delete this term?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#FF0000",
                    confirmButtonText: "Okay",
                    closeOnCancel: true,
                    closeOnConfirm: true
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            requestService.ApiRequestService("DELETE", "/api/TermContents/" + id)
                                .then(function (response) {
                                    _getAllTerms();

                                })
                                .catch(function (err) {
                                    console.log(err);
                                })
                        }
                    });
               
            }
        }
    })
})();
