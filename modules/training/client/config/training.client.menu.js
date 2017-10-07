(function () {
  'use strict';

  angular
    .module('training')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Training module
  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Training',
      state: 'tutorial',
      roles: ['*']
    });

    menuService.addMenuItem('topbar', {
      title: 'Grade Our Images',
      state: 'imageset',
      roles: ['*']
    });
  }
}());
