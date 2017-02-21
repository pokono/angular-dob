angular.module('angularDob', []);
angular.module('angularDob')
	.factory('CommonDob', [function() {
		
		var common = {};
		
		common['MODE_MDY'] = 'mm/dd/yyyy';
		common['MODE_DMY'] = 'dd/mm/yyyy';

		common['mode'] = common.MODE_MDY;

		common['setMode'] = function(mode) {
			if (!mode) return;
			switch (mode) {
				case this.MODE_MDY:
				case this.MODE_DMY:
					common['mode'] = mode;
				break;
				default:
					void 0;
				break;
			}
		};

		common['isDMY'] = function(mode) {
			return this.mode == this.MODE_DMY;
		};

		common['isMDY'] = function(mode) {
			return this.mode == this.MODE_MDY;
		};

		// String "mm / dd / yyyy".
		common['parseDob'] = function(value) {
			var day, month, year, _ref;

			value = value || '';
			value = value.replace(/\s/g, '');

			_ref = value.split('/', 3);

			// Multiple formats implementation.
			if (this.isDMY()) {
				day = _ref[0];
				month = _ref[1];
			} else {
				day = _ref[1];
				month = _ref[0];
			}

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

		common['parseDate'] = function(value) {
			// String "yyyy-mm-dd"
			var day, month, year, _ref;

			value = value || '';
			value = value.replace(/\s/g, '');

			_ref = value.split('-', 3);

			// TODO: Multiple formats implementation.
			day = _ref[2];
			month = _ref[1];
			year = _ref[0];

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

			if (CommonDob.isDMY()) { // Handle DD/MM/YYYY format.
				if (/^\d$/.test(val) && (val !== '0' && val !== '1' && val !== '2' && val !== '3')) {
					e.preventDefault();
					return $target.val("0" + val + " / ");
				} else if (/^\d\d$/.test(val)) {
					e.preventDefault();
					return $target.val("" + val + " / ");
				} else if (/^\d\d\s\/\s\d$/.test(val) && (digit !== '0' && digit !== '1')) {
					e.preventDefault();
					return $target.val("" + original + '0' + digit + " / ");
				} else if (/^\d\d\s\/\s\d\d$/.test(val)) {
					e.preventDefault();
					return $target.val("" + val + " / ");
				}
			} else { // Handle MM/DD/YYYY format.
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
				var format = '';
				if (CommonDob.isDMY()) {
					format = 'dd / MM / yyyy';
				} else {
					format = 'MM / dd / yyyy';
				}
				obj.text = $filter('date')(dob, format);
				return obj;
			}
			return null;
		};

		var _getFormattedDob = function(value) {
            if (value != null) {
                var obj = null;
                switch (typeof value) {
                    case 'string':
                        obj = CommonDob.parseDob(value);
                        break;
                    case 'object':
                        obj = value;
                        break
                }
                var dob = new Date(obj.year, obj.month - 1, obj.day);
                var format = '';
                if (CommonDob.isDMY()) {
                    format = 'dd / MM / yyyy';
                } else {
                    format = 'MM / dd / yyyy';
                }
                return $filter('date')(dob, format);
            }
            return null;
		};

		return function(elem, ctrl, attr) {
			CommonDob.setMode(attr.dobFormatMode);

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
				_FormatDob(elem, ctrl, attr);
			}
		}
	}]);
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

			void 0;
			void 0;
			void 0;

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
