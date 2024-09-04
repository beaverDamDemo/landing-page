# to run with Koala

non-free Prepros has been replaced by free Koala.
download Koala from here: http://koala-app.com/

# Koala set up

assets/js/src/init.js goes translated into assets/js/init.min.js
Remember to check Harmony(ES6+)

assets/css/src/styles.scss goes translated into assets/css/styles.min.css

# Without Koala

npm install -g sass
go to css directory
sass --style=compressed src:css

# To run

php -S localhost:4200

# Run with node

npm install -g http-server
command to go to the directory where your HTML is and run `http-server -p 4200`
