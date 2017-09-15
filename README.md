# event_mapper
This app was built over the course of three major sprints, total to around ~18 hours. (Estimate subject to change)

Originally planned for a 2 week build time, but opportunity arose that required immediate execution. The app is functional and working. Moving forward, refactoring and dealing with technical debt will be important. 

**Todo:**
* Major refactoring of code. Cleaner code, cleaner architecture, & unit tests. 
* Optimize for mobile devices. 
* Add animation to show key interactions and improve user experience.
* Improve or replace date range widget. Need to be able to specific timer faster. Would also be nice if it updated time initially, to clearly show it is a time picker to user.
* Add feature to search area. Currently hard-coded to downtown KC. 
* Switch from API key to OAuth
* Add better comments and create docs outlining project. [I have done something similar for an earlier project.](https://github.com/noah-dev/todo_django/blob/master/README.md)

**Change Log**
## 9/11/17
* **Fixed an exception that could cause the UI to fail to load. Was trying to interact with undefined variable**
* **Initial refactor of angular code complete. Changes include:**
* Global/local variable usage has been significantly reduced. Down to just 3 variables for markers, info window, and map. 
* Switched from jQuery AJAX code to Angular AJAX ($HTTP) code. 
* Created marker remove function to replace code in two different places. 
* Renamed variables to be more consistent with website name
