angular.module('angularDob')
	.factory('_ValidateDob', ['CommonDob', function(CommonDob) {

		var validateDob = function(val, attr) {
			// valid if empty - let ng-required handle empty.
			if (val == null || val.length == 0) return true;

			var maxDate = attr.hasOwnProperty('dobValidateMaxDate') ? attr.dobValidateMaxDate : null;
			var minDate = attr.hasOwnProperty('dobValidateMinDate') ? attr.dobValidateMinDate : null;
			var minimumTime = new Date;
			var dob;
			var isValid = true;

			console.log('#### VALIADATE DOB ####');
			console.log(val);
			console.log('#######################');

			if (typeof val === 'object') { // Newer angular.
				obj = val; // Take original values.
			} else {
				obj = CommonDob.parseDob(val);
			}

			day = obj.day;
			month = obj.month;
			year = obj.year;

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

			dob = new Date(year, month - 1, day);

			// Check that there is no overflow.
			if (dob.getFullYear() != year
				|| dob.getMonth() != month - 1
				|| dob.getDate() != day) {
				return false;
			}

			isValid = dob < minimumTime;

			// Greater than today.
			if (maxDate && isValid) {
				var objMaxDate = CommonDob.parseDate(maxDate);
				minimumTime = new Date(objMaxDate.year, objMaxDate.month - 1, objMaxDate.day);
				isValid = dob < minimumTime;
			}

			if (minDate && isValid) {
				var objMinDate = CommonDob.parseDate(minDate);
				minimumTime = new Date(objMinDate.year, objMinDate.month - 1, objMinDate.day);
				isValid = dob > minimumTime;
			}

			return isValid;
		};

		return function(val, ctrl, scope, attr) {
			// CommonDob.setMode(attr.dobFormatMode);
			return validateDob(val, attr);
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
