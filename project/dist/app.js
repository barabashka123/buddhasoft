
angular.module('app', ['ui.router', 'angularUUID2'])

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('app', {
                controller: 'appCtrl',
                templateUrl: 'index.html',
                resolve: {
                    data: function ($window) {
                        var list = [{title: 'one', price: 12, image: '01', description: 'one one', id: 1},
                            {title: 'two', price: 1, image: '02', description: 'one one', id: 2},
                            {title: 'three', price: 2, image: '03', description: 'one one', id: 3},
                            {title: 'four', price: 14, image: '04', description: 'one one', id: 4},
                            {title: 'five', price: 9, image: '05', description: 'one one', id: 0}];

                       return $window.localStorage.getItem("key") ? JSON.parse($window.localStorage.getItem("key")) : list;

                    }
                }
            })
            .state('app.main', {
                url: '/main',
                controller: 'mainCtrl',
                templateUrl: 'main.html'
            })
            .state('app.single', {
                url: '/single/:id',
                controller: 'appSingleCtrl',
                templateUrl: 'single.html'
            })
            .state('app.create', {
                url: '/create/:id',
                controller: 'appCreateCtrl',
                templateUrl: 'create.html'
            })
        $urlRouterProvider.otherwise('/main');
    })

    .controller('appCtrl', function ($scope, $state) {
     
        $state.go('app.main');
    })
    .controller('mainCtrl', function ($scope, $state, data, $window) {

        $scope.listProducts = data;

        function vmOpen(product) {
            $state.go('app.single', {id : product.id});
        }
        function vmCreate() {
            $state.go('app.create');
        }

        function vmDelete(id) {
            if (confirm('Are you sure?')){
                data.forEach(function (item, i) {
                    if(item.id == id){
                        data.splice(i, 1);
                        $window.localStorage.setItem('key', JSON.stringify(data));
                    }
                })
            }
        }
        function vmEdit(id) {
            $state.go('app.create', { id: id });
        }

        $scope.open = vmOpen;
        $scope.create = vmCreate;
        $scope.delete = vmDelete;
        $scope.edit = vmEdit;
    })
    .controller('appSingleCtrl', function ($scope, $state, $stateParams, data) {

        $scope.product = data.filter(x => (x.id == $stateParams.id))[0];

        function vmBack() {
            $state.go('app.main');
        }
        $scope.back = vmBack;
    })
    .controller('appCreateCtrl', function ($scope, $state, data, $window, uuid2, $stateParams) {

        if ($stateParams.id){
            //edit
            $scope.product = data.filter(function (item) {
                return item.id == $stateParams.id;
            })[0];
            console.log($scope.product );
        }
        
        function vmAdd(product) {

            if ($stateParams.id){
                //edit product
                data.forEach(function (item) {
                    if (item.id == $stateParams.id){

                        item.title = product.title;
                        item.price = product.price;
                        item.image = product.image;
                        item.description = product.description;

                        $window.localStorage.setItem('key', JSON.stringify(data));
                        vmBack();
                    }
                })

            } else {
                //add product
                product.id = uuid2.newuuid();
                data.push(product);
                $window.localStorage.setItem('key', JSON.stringify(data));

                vmBack();
            }
        }
        function vmBack() {
            $state.go('app.main');
        }
        
        $scope.add = vmAdd;
        
    })
   