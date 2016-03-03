angular.module('angularDob')
	.factory('_ValidateDob', ['CommonDob', function(CommonDob) {


		var validateDob = function(val) {
			// valid if empty - let ng-required handle empty
			if (val == null || val.length == 0) return true;

			obj = CommonDob.parseDob(val);

			day = obj.day;
			month = obj.month;
			year = obj.year;

			var currentTime, dob;

			if (!(month && year && day)) {
				return false;
			}

			if (!/^\d+$/.test(day)) {
				return false;
			}

			if (!/^\d+$/.test(month)) {
				return false;
			}

			if (!/^\d+$/.test(year)) {
				return false;
			}

			if (!(parseInt(month, 10) <= 12)) {
				return false;
			}

			dob = new Date(year, month, day);

			console.log(dob.getFullYear() + ' ' + year);
			console.log(dob.getMonth() + ' ' + month);
			console.log(dob.getDate() + ' ' + day);

			// Check that there is no overflow.
			if (dob.getFullYear() != year
				|| dob.getMonth() != month
				|| dob.getDate() != day) {
				return false;
			}

			currentTime = new Date;
			dob.setMonth(dob.getMonth() - 1);
			dob.setMonth(dob.getMonth() + 1, 1);

			console.log(dob < currentTime);

			return dob < currentTime;
		};

		return function(val, ctrl, scope, attr) {
			return validateDob(val);
		}
	}])

	.directive('dobValidate', ['$window', '_ValidateDob', function($window, _ValidateDob) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elem, attr, ctrl) {

				var type = attr.dobValidate;

				var validateFn = function(val) {
					var valid = _ValidateDob(val, ctrl, scope, attr);
					ctrl.$setValidity(type, valid);
					return valid ? val : undefined;
				};

				ctrl.$formatters.push(validateFn);
				ctrl.$parsers.push(validateFn);
			}
		}
	}]);
