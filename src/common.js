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