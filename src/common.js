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
					console.error('dob-format-mode attribute invalid: ' + mode);
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
