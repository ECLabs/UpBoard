angular.module('firebase.config', [])
  .constant('FBURL', 'https://boiling-heat-9947.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password'])

  .constant('loginRedirectPath', '/login');
