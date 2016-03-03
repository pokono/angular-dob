angular.module('angularDob', []);
angular.module('angularDob')
	.factory('CommonDob', [function() {
		var common = {};
		// String "mm / dd / yyyy"
		common['parseDob'] = function(value) {
			var day, month, year, _ref;

			value = value || '';
			value = value.replace(/\s/g, '');

			_ref = value.split('/', 3);

			// TODO: Multiple formats implementation.
			day = _ref[1];
			month = _ref[0];
			year = _ref[2];

			day = parseInt(day, 10);
			month = parseInt(month, 10);
			year = parseInt(year, 10);

			return {
				day: day,
				month: month,
				year: year
			};
		};

		return common;
	}]);
angular.module('angularDob')
	.factory('_FormatDob', ['CommonDob', '$filter', function(CommonDob, $filter) {

		var _hasTextSelected = function($target) {
			var ref;

			if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== $target.prop('selectionEnd')) {
				return true;
			}

			if (typeof document !== "undefined" && document !== null ? (ref = document.selection) != null ? typeof ref.createRange === "function" ? ref.createRange().text : void 0 : void 0 : void 0) {
				return true;
			}

			return false;
		};

		// DOB
		_restrictDob = function(e) {
			var $target, digit, value;

			$target = angular.element(e.currentTarget);
			digit = String.fromCharCode(e.which);

			if (!/^\d+$/.test(digit) && !e.meta && e.keyCode >= 46) {
				e.preventDefault();
				return;
			}

			if (_hasTextSelected($target)) {
				return;
			}

			value = $target.val() + digit;
			value = value.replace(/\D/g, '');

			if (value.length > 8) {
				e.preventDefault();
				return;
			}
		};

		_formatDob = function(e) {
			var $target, digit, val;

			digit = String.fromCharCode(e.which);

			if (!/^\d+$/.test(digit) && !e.meta && e.keyCode >= 46) {
				e.preventDefault();
				return;
			}

			$target = angular.element(e.currentTarget);
			val = $target.val() + digit;
			original = $target.val();

			if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
				e.preventDefault();
				return $target.val("0" + val + " / ");

			} else if (/^\d\d$/.test(val)) {
				e.preventDefault();
				return $target.val("" + val + " / ");

			} else if (/^\d\d\s\/\s\d$/.test(val) && (digit !== '0' && digit !== '1' && digit !== '2' && digit !== '3')) {
				e.preventDefault();
				return $target.val("" + original + '0' + digit + " / ");
			} else if (/^\d\d\s\/\s\d\d$/.test(val)) {
				e.preventDefault();
				return $target.val("" + val + " / ");
			}
		};

		_formatForwardDob = function(e) {
			var $target, digit, val;

			digit = String.fromCharCode(e.which);

			if (!/^\d+$/.test(digit) && !e.meta && e.keyCode >= 46) {
				return;
			}

			$target = angular.element(e.currentTarget);
			val = $target.val();

			if (/^\d\d$/.test(val)) {
				return $target.val("" + val + " / ");
			}
			else if (/^\d\d\s\/\s\d\d$/.test(val)) {
				return $target.val("" + val + " / ");
			}
		};

		_formatForwardSlash = function(e) {
			var $target, slash, val;

			slash = String.fromCharCode(e.which);

			if (slash !== '/') {
				return;
			}

			$target = angular.element(e.currentTarget);
			val = $target.val();

			if (/^\d$/.test(val) && val !== '0') {
				return $target.val("0" + val + " / ");
			} else if (/^\d\d\s\/\s\d$/.test(val)) {
				return $target.val("" + val + " / ");
			}
		};

		_formatBackDob = function(e) {
			var $target, value;

			if (e.meta) {
				return;
			}

			$target = angular.element(e.currentTarget);
			value = $target.val();

			if (e.which !== 8) {
				return;
			}

			if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
				return;
			}

			if (/\d(\s|\/)+$/.test(value)) {
				e.preventDefault();
				return $target.val(value.replace(/\d(\s|\/)*$/, ''));

			} else if (/\s\/\s?\d?$/.test(value)) {
				e.preventDefault();
				return $target.val(value.replace(/\s\/\s?\d?$/, ''));

			}
		};

		var _parseDob = function(value) {
			if (value != null) {
				var obj = CommonDob.parseDob(value);
				var dob = new Date(obj.year, obj.month - 1, obj.day);
				obj.text = $filter('date')(dob, 'MM/dd/yyyy');
				return obj;
			}
			return null;
		};

		var _getFormattedDob = function(value) {
			if (value != null) {
				var obj = CommonDob.parseDob(value);
				var dob = new Date(obj.year, obj.month - 1, obj.day);
				return $filter('date')(dob, 'MM / dd / yyyy');
			}
			return null;
		};

		return function(elem, ctrl) {
			elem.bind('keypress', _restrictDob);
			elem.bind('keypress', _formatDob);
			elem.bind('keypress', _formatForwardSlash);
			elem.bind('keypress', _formatForwardDob);
			elem.bind('keydown', _formatBackDob);

			ctrl.$parsers.push(_parseDob);
			ctrl.$formatters.push(_getFormattedDob);
		};

	}])

	.directive('dobFormat', ['$window', '_FormatDob', function($window, _FormatDob) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elem, attr, ctrl) {
				_FormatDob(elem, ctrl);
			}
		}
	}]);
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

			void 0;
			void 0;
			void 0;

			// Check that there is no overflow.
			if (dob.getFullYear() != year
				|| dob.getMonth() != month
				|| dob.getDate() != day) {
				return false;
			}

			currentTime = new Date;
			dob.setMonth(dob.getMonth() - 1);
			dob.setMonth(dob.getMonth() + 1, 1);

			void 0;

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
