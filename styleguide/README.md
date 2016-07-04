# Almanac

Almanac is Mobify's living styleguide. For detailed documentation on the benefits and how-to's, see our [official Living Style Guide documentation](https://mobify.atlassian.net/wiki/display/LT/Working+with+a+Living+Style+Guide).

## Viewing Almanac
1. Run `grunt preview` or `grunt almanac`
2. Visit `http://localhost:4444` in a browser

## File Description

`index.html`

The browser's entry point into Almanac. This is boilerplate code that ensures that stylesheets and JS is loaded, as well as providing placeholder markup to be replaced by Almanac markup. This file does not require any modifications.

`almanac.dust`

Boilerplate dust template, it is where the overall Almanac structure and design is maintained. This file does not require any modifications.

`almanac-components.dust`

This dust template is where project components are showcased with their static mock data. This is the real 'meat' of Almanac: all components in a project should be included here.

`data/`

This is where Almanac-specific mock data is stored. Data files return a pre-populated JSON data context object that matches with it's designated component. A good practice is to demonstrate all variations of each component by returning a context containing arrays of data which highlight all possible visual states.

`context.js`

This is Almanac's view file. All data files from `data/` are required in and assigned to key-value pairs based on their designated component, thus forming Almanac's complete data context.

`config.js`

This is a standard require.js config file that paths out all Almanac's dependencies so they may be required in correctly.

`ui.js`

This file is responsible for Almanac's UI scripts and interactions, which include:

- Taking the completed Almanac data context from `context.js` and using it to render out the full Almanac template and its contents
- Setting up the Table of Contents component directory, its [Pinny](https://github.com/mobify/pinny), and all necessary event bindings
- Setting up the Table of Content's search autocomplete functionality

`table-of-contents.dust`

This is the dust template for the Table of Contents component directory. This is also boilerplate that won't be modified much. It is kept as a separate template because its contents are dynamically generated and rendered in `ui.js`.

`almanac.scss`

This is the parent stylesheet for Almanac's base theme. This file should not color the project components in any way.

`build/`

This is where Almanac is built into when `grunt almanac` or `grunt preview` is run. It is ignored from git changes.
