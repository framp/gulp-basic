#gulp-start

A good starting point for creating a static web application.

##What do you get
As soon as you start with your project you'll find several directories:
 - `templates`
 - `data` 
 - `contents`
 - `images`
 - `stylesheets`
 - `scripts`
 - `gulpfile`

###How to
Before diving in the directories structure, we're going to list all the commands you can run with gulp-start:
 - `gulp`: build the application in development mode and launch a livereload server
 - `gulp deploy`: `clean-all` and build the application in production mode and increment the `version` of the application
 - `gulp clean-all`: call all the `clean-*` tasks and clean all the files
 - `gulp process-all`: call all the `process-*` tasks and build all the files needed
 - `gulp process-templates`: build .html files from your .hbs templates
 - `gulp process-images`: optimize images files
 - `gulp process-stylesheets`: build .css files from your .scss stylesheets
 - `gulp process-scripts`: build .js files from your scripts
 - `gulp clean-templates`: clean templates generated with `process-templats`
 - `gulp clean-images`: clean images generated with `process-imags`
 - `gulp clean-stylesheets`: clean stylesheets generated with `process-stylesheets`
 - `gulp clean-scripts`: clean scripts generated with `process-scripts`

###Templates
It's a good practice to separate your data from your design. That's why gulp-start includes [Handlebars](handlebarsjs.com) templates.

We don't want your beautifully crafted website to have ugly ".html" URL.
gulp-start will only generate `index.html` for `index.hbs` files (at any depth) in your `/templates` directory.
Including partials is supported from the `partials` and `layouts` directories - and we're supporting layouts through [handlebars-layouts](https://www.npmjs.org/package/handlebars-layouts).

    templates/layouts/main.hbs
    <html>
    <head></head>
    <body>
      {{> header}}
      <div>
      {{#block "body"}}{{/block}}
      </div>
      {{> footer}}
    </body>
    </html>
    
    templates/partials/header.hbs
    Footer
    
    templates/partials/footer.hbs
    Header
    
    templates/index.hbs
    {{#extend "main"}}
      {{#content "body"}}
        Hello World
      {{/content}}
    {{/extend}}

###Data
To define data you simply create a `index.json` file on the same path of your template file in `/data`.
Data is language agnostic.

    data/index.json 
    {
      "object": "Framp"
    }
    
    templates/index.hbs
    {{#extend "main"}}
      {{#content "body"}}
        Hello {{object}}
      {{/content}}
    {{/extend}}

###Contents
To define contents in different languages you simply create a `index.toml` file on the same path of your template file in `/contents/ln-LN/`, where `ln-LN` is the country-language choice of your language.
The default language, will be generated in the root of the destination folder. All the other languages will live in `/ln-LN` subdirectories.

You'll be able to use your strings in templates using the [handlebars-tr](https://github.com/framp/handlebars-tr) plugin. Your translations will have access to the whole context, letting you use variables in them.

    data/index.json 
    {
      "object": "Framp"
    }
    
    contents/_en-US/index.json
    greeting = "Hello {{object}}"
    
    contents/it-IT/index.json
    greeting = "Ciao {{object}}"
    
    templates/index.hbs
    {{#extend "main"}}
      {{#content "body"}}
        {{tr "greeting"}}
      {{/content}}
    {{/extend}}

This small example will generate `$dest/index.html` in `en-US` and `$dest/it-IT/index.html` in `it-IT`.
We chose [toml](https://github.com/toml-lang/toml) over [JSON](http://www.json.org/) for language files because it's easier for such a flat structure.

###Images
All the images you put inside will be optimized and copied to `$dest/images`. 

Oh, we'll also add a version number in production mode, so that browsers won't have cache problems.
 
###Stylesheets
Thanks to [sass](http://sass-lang.com/) your stylesheets.
TODO

###Scripts
Say goodbye to spaghetti-code! gulp-start relies on [browserify](http://browserify.org/) to help you organize your code.
TODO

###Gulpfile
gulp-start is, obviously, using [gulp](http://gulpjs.com/), an awesome streaming build system.

The `gulpfile.js` is used to generate your application and work with it. If everything suits your taste you don't have to touch anything.

We believe that if you want to customize more your workflow, you should be able to do it.

The main gulpfile only defines the main commands you can run with gulp-start, delegating the bulk of the work to scripts contained in the `gulpfile` directory.

####templates.js
TODO

####images.js
TODO

####stylesheets.js
TODO

####scripts.s
TODO

####misc.js
TODO

##License
MIT
