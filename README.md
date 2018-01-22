# employees-sample

Simple web component for demonstration of interaction with WebTutor

### Install

Clone and then install the repository to the any folder(for example in `/wt/web/components`) in root directory of WebTutor
```
git clone https://github.com/maksimyurkov/employees-sample
cd employees-sample
npm install
```

### Usage

For all browsers + IE11

```html
<script src="/components/employees-sample/node_modules/@webcomponents/webcomponentsjs/webcomponents-lite.js"></script>
<link rel="stylesheet" href="/components/employees-sample/node_modules/cleanslate/cleanslate.css">
<script type="module" src="/components/employees-sample/employees-sample-es6.js"></script>
<script nomodule src="/components/employees-sample/employees-sample-es5.js"></script>
<employees-sample api-url="/components/employees-sample/webtutor-api.html" default-avatar-url="/components/employees-sample/default-avatar.jpg"></employees-sample>
```

### Build
```
npm run build
```
