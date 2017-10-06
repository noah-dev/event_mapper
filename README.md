# event_mapper
![](https://github.com/noah-dev/event_mapper/blob/master/docs/demo.gif)
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
## 9/19/17
* Further refactored Angular JS code
* Search area can now be set by user. Using editable google map shape for UI
* Back-end code created to support afromentioned search area feature. Notably the meetup api seems to only accept whole miles. So extra code was added to check distance and filter out. Still needs refinment. 
* Implemented a categorizer using IBM's Natural Language Understanding API. Functional, but needs optimization work. 

## 10/05/17
* Implemented a loading screen to show the app is responding. Improved UX
