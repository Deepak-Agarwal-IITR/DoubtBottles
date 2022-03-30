# DoubtSolver
➢ A web platform for students to ask their questions. Teachers can make courses and students can ask doubts according to lectures. 
➢ Conversation are done using text editor, images and replying in a chain. 
➢ Students have to enroll themselves in course created by Teachers/Instructor. 
➢ Teacher can make announcements, polls. 
➢ Notification feature is added to find the important updates.
➢ Build Using NodeJS, ExpressJS, MongoDB, Mongoose, Cloudinary

Note: “There is branch in which basics of google oauth is implemented.”

To start the application: 
You should have Node, MongoDB, Terminal on your device.

Make a ".env" file in the root directory and paste the following lines:
If you have an cloudinary account: 
CLOUDINARY_CLOUD_NAME= <YOUR_CLOUD_NAME> 
CLOUDINARY_KEY=<YOUR_API_KEY> 
CLOUDINARY_SECRET=<YOUR_CLOUDINARY_SECRET>

For using Google OAuth, add these line:
GOOGLE_CLIENT_ID=<YOUR_CLIENT_ID> 
GOOGLE_CLIENT_SECRET=<YOUR_SECRET>

Open MongoDB. Open the terminal and run,
npm install
node seeds/ // This will delete the data in database if exists and will create 3 users.
node app.js
Open localhost:8080 in your browser.
