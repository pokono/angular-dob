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