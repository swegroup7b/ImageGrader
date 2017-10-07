(function () {
  'use strict';

  angular
    .module('grader')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  /*
  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Grader',
      state: 'grader',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'grader', {
      title: 'Start Session',
      state: 'grader.upload',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'grader', {
      title: 'Resume Session',
      state: 'grader.annotator',
      roles: ['*']
    });
  }*/
  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Image Grader',
      state: 'grader',
      roles: ['*'],
      type: 'dropdown'
    });

    menuService.addSubMenuItem('topbar', 'grader', {
      title: 'New Session',
      state: 'grader.upload',
      roles: ['*']
    });

    menuService.addSubMenuItem('topbar', 'grader', {
      title: 'Resume',
      title: 'Resume',
      state: 'grader.annotator',
      roles: ['*']
    });
  }
}());
