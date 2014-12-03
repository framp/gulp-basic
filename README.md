#gulp-start

A good starting point for creating a static web application.

##Requirements

    npm install -g gulp bower

Installing [bower](http://bower.io/) is not required, but is heavily suggested.

##How to
To fire up your project just move into the `source` directory and run `gulp` (or check out the full [Commands Reference](#commands-reference)).

The example project will get compiled and a browser window should open with your project.

In the `source` directory you'll find several directories:
 - `templates`: [Handlebars](handlebarsjs.com) templates for your views
 - `data`: [JSON](http://www.json.org/) data containing the data you want to display with your templates
 - `contents`: [toml](https://github.com/toml-lang/toml) files containing your localized strings
 - `images`: Images needed by your application
 - `stylesheets`: [sass](http://sass-lang.com/) stylesheets used to define the look of your application
 - `scripts`: JavaScript files to embed in your application
 - `gulpfile`: The script which make everything automatic (that you shouldn't touch)

By editing and creating files inside these directory you'll be able to create a web application in an efficient way.

###Templates
It's a good practice to separate your data from your design. That's why gulp-start includes [Handlebars](handlebarsjs.com) templates to generate your HTML.
Including partials is supported from the `partials` and `layouts` directories - and we're supporting layouts through [handlebars-layouts](https://github.com/shannonmoeller/handlebars-layouts).

One more thing: We don't want your beautifully crafted website to have ugly ".html" URL.
gulp-start will only generate `index.html` for `index.hbs` files (at any depth) in your `/templates` directory.

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

The default language is the one whose directory in `/contents` starts with a `_`.

If you need to provide translations which are common in different pages you can simply insert them in the `/contents/ln-LN/partials.toml` file: it will be used in all your pages.

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

We chose [toml](https://github.com/toml-lang/toml) over [JSON](http://www.json.org/) for language files because it's easier to use for such a flat structure.

###Images
All the images you put inside will be copied to `$dest/images`. 

In production mode we'll copy an [optimized](https://github.com/imagemin/imagemin) image with a version number suffix, so that browsers won't have cache problems. The end result will be `/images/image.v1.png`.
 
###Stylesheets
Thanks to [sass](http://sass-lang.com/) your stylesheets will have a nice readable structure. Screw the 5k LOC '.css`!

Only `index.scss` files (at any depth, in every subdirectory) will be parsed and used to generate corrisponding `index.css` files. 

In production mode we'll generate an [optimized](https://github.com/jakubpawlowicz/clean-css) and [autoprefixed](https://github.com/postcss/autoprefixer) file in `index.v1.min.css`.

Our suggestion is to leverage the modularity of [sass](http://sass-lang.com/) and use the `index.scss` file only for `@import` of well named `sass` modules.

If you need to import modules form thirdy-party you can install them using [bower](http://bower.io/):

    bower install --save meyer-reset

And `@import` them directly:

    index.scss
    @import 'meyer-reset/stylesheets/meyer-reset';
    @import 'colors';
    @import 'general';
    @import 'menu';
    @import 'homepage';

This is working only because `bower_components` is one of the `includedPaths` used by `libsass` when looking for a file.

###Scripts
Say goodbye to spaghetti-code! gulp-start relies on [browserify](http://browserify.org/) to help you organize your code following CommonJS syntax.

Like in all the other modules, only your `index.js` files, at any depth,  will be used to generate files. We suggest you to use your `index.js` files only for importing other scripts.

    index.js
    require('./core');
    require('./routes');
    
Again, feel free to install packages from [bower](http://bower.io/) (even the ones who are using AMD).

    bower install --save jquery
    
And use them freely:

    var $ = require('jquery');
    $(document).ready(function(){
      $(document.body).css('background', '#ff6699');
    });

###Gulpfile
gulp-start is, obviously, using [gulp](http://gulpjs.com/), the awesome streaming build system.

The `gulpfile.js` is used to generate your application and work with it. If everything suits your taste you don't have to touch anything.

We believe that if you want to customize more your workflow, you should be able to do it.

The main gulpfile only defines the main commands you can run with gulp-start, delegating the bulk of the work to scripts contained in the `gulpfile` directory.

####templates.js
We load the languages from `/contents` and create a gulp stream for each language and setup handlebars and its helpers. Feel free to throw in more helpers if you need to.

For each stream we load data and contents with [gulp-data](https://github.com/colynb/gulp-data) and pipe everything to [gulp-handlebars-html](https://github.com/framp/gulp-handlebars-html).

####images.js
This one is easy: we just use [imagemin](https://github.com/sindresorhus/gulp-imagemin) to compress our images.

####stylesheets.js
We're just using [gulp-sass](https://github.com/dlmanning/gulp-sass), [gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer) and [gulp-minify-css](https://github.com/jonathanepollack/gulp-minify-css).

####scripts.js
We use [gulp-browserify](https://github.com/deepak1556/gulp-browserify) with the [bowerify](https://github.com/ninefold/bowerify) and the [deamdify](https://github.com/jaredhanson/deamdify) transforms.

We compress everything using [gulp-uglify](https://github.com/terinjokes/gulp-uglify).

####misc.js
The tasks in misc are used to:
 - increase the `version` and force the production `environment`
 - setup the livereload server thanks to [gulp-connect](https://github.com/avevlad/gulp-connect)
 - open a browser window with your project thanks to [gulp-open](https://github.com/stevelacy/gulp-open)

####A note on debug
We use [gulp-debug](https://github.com/sindresorhus/gulp-debug) together with  [gulp-if](https://github.com/robrich/gulp-if) to help you debug your building process only when you want to.

####A note on cache and remember
We use [gulp-cached](https://github.com/wearefractal/gulp-cached) and [gulp-remember](https://github.com/ahaurw01/gulp-remember) to reduce the amount of unneeded work done when rebuilding files.

Unfortunately this is not always trivial and we, currently, can't use that when a task has external untracked dependencies (eg. a file which includes other files and which needs to be recreated when one of its dependencies update).

####A note on clean tasks
The clean tasks should be straightforward. We do roughly the same thing as the `process-` task while stripping all the gulp plugins who actually do something to the file contents. After `gulp.dest` we use [vinyl-paths](https://github.com/sindresorhus/vinyl-paths) to retrieve our paths and just pass them to `fs.unlink`.

##Commands Reference
 - `gulp`: build the application in development mode and launch a livereload server
 - `gulp deploy`: `clean-all` and build the application in production mode and increment the `version` of the application (the `version` is used only in when deploying)
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

Passing parameters to gulp can be done to override some of the default values:
 - `--dest=..` will override the destination in which your file are generated
 - `--version=0` will override the `version`
 - `--debug=false` will display debugging information about your building process
 - `--environment=development` will override your environment (which is `production` when you're deploying or `develpoment` when running all the other commands)
 - `NODE_ENV=production gulp...` is just another way to set the environment

##Why did you bother writing all these little pesky details?
I strongly feel like one of the major issues in nowadays frameworks is communication.

Several frameworks abstract a lot of what they do without documenting stuff clearly enough; the result is a magic box users simply use without understanding. And no, they won't be happy after finding a bug and understanding they have no idea what the hell is happening.

The solution is transparency.

##License
MIT
