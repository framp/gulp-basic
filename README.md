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
 - `gulp` TODO
 - `gulp deploy` TODO
 - `gulp clean-all` TODO
 - `gulp process-all` TODO
 - `gulp process-templates` TODO
 - `gulp process-images` TODO
 - `gulp process-stylesheets` TODO
 - `gulp process-scripts` TODO

###Templates
It's a good practice to separate your data from your design. That's why gulp-start includes [Handlebars](handlebarsjs.com) templates.

To force you create ".html"-less URL gulp-start will only parse `index.hbs` files (at any depth) in your `/templates` directory.
TODO

###Data
TODO

###Contents
TODO

###Images
TODO
 
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
