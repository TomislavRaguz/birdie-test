
# Birdie Developer Test submission

My solution to the birdie developer test. 
I quite enjoyed working on this because I liked the process 
 of building an app with only a single table as your specification.

While thinking about what data to display in the app I realized I first needed
a better overview of it myself. Considering I was going to use typescript anyway
I whipped up a script to generate the typescript definitions for all the Event type 
variations using data from the table. 

I chose to display mood, food intake and fluid intake in charts beacuse I felt those 
are comparatively harder to have an overview of through more traditional channels than for eg medication
compliance or alerts.
## Deployment

For deployment I chose to use Heroku as recommended in 
the assignment readme. A classic reverse proxy Nginx setup
seemed overkill so I went for a simple approach where the frontend bundle is 
built into the static and served for all non /api routes from a single node process.