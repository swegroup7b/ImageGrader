(function () {
  'use strict';

  angular
    .module('grader')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Grader module
  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Image Grader',
      state: 'grader',
      roles: ['user', 'admin'],
      type: 'dropdown'
    });

    menuService.addSubMenuItem('topbar', 'grader', {
      title: 'New Session',
      state: 'grader.upload',
      roles: ['user', 'admin']
    });

    menuService.addSubMenuItem('topbar', 'grader', {
      title: 'Resume',
      state: 'grader.annotator',
      roles: ['user', 'admin']
    });

    menuService.addMenuItem('topbar', {
      title: 'Grading History',
      state: 'history',
      roles: ['user', 'admin']
    });
  }
}());
