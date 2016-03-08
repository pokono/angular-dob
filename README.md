# Angular DOB

An Angular Module that provides directives for *formatting* and *validating* date of birth.

### Credits

Heavily inspired by Angular Payments. https://github.com/laurihy/angular-payments
Thank You!

## Usage

To use Angular DOB, add *angularDob* as a dependency to your AngularJS module or app.

The module ships 2 directives, both of which should be added as attributes to elements. 

* dobValidate
* dobFormat

### dobValidate

Is used for validating fields on the client side. Usage:

```html
    <input type="text" ng-model="blah" dob-validate />
```

For validation to work, the element must have an associated ng-model -value.

#### Optional Parameters
   
**Max Date** - Maximum date that will be considered valid.
```html
    <input type="text" ng-model="blah" dob-validate dob-validate-max-date="yyyy/mm/dd"/>
```

**Min Date** — Minimum date that will be considered valid.
```html
    <input type="text" ng-model="blah" dob-validate dob-validate-min-date="yyyy/mm/dd"/>
```

### dobFormat

Is used for formatting fields.

```html
	<input type="text" ng-model="blah" dob-format />
```
	
For formatting to work, the element must have an associated ng-model -value.


## Example

See example-folder.

The variable *blah* will get filled with an object like this: 
```js
    {"day":8,"month":10,"year":1986,"text":"10/08/1986"}
```


## Contributors

Contributions or feature requests are welcome. Guidelines will be here soon. ;)
Thank you!


## License 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



