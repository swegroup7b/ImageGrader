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
      state: 'training',
      roles: ['user', 'admin'],
      type: 'dropdown'
    });

    menuService.addSubMenuItem('topbar', 'training', {
      title: 'How to Grade',
      state: 'training.example',
      roles: ['user', 'admin']
    });

    menuService.addSubMenuItem('topbar', 'training', {
      title: 'Interactive Tutorial',
      state: 'training.interactive',
      roles: ['user', 'admin']
    });
  }
}());
