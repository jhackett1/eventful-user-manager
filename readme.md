Eventful User Manager
=====================

Simple command line utility to give organiser (aka admin) permissions to Eventful users.

It uses the Firebase Admin SDK to add a custom claim to the data stored about a user.

How to use it
------------

Clone this repo and run `npm install` to grab the Firebase Admin SDK.

In your Firebase project, go to **Project settings > Service accounts**, and download the private key JSON file.

Put that file in the root folder of this utility and rename it to `serviceAccountKey.json`.

Then, just run `npm run promote user@email.com`, replacing the email with the user's email address.

The utility will let you know if the attempt succeeded or not.

Things to remember
------------------

* The user needs to have signed in once already, otherwise Firebase won't recognise the email as belonging to a user.
* The user **won't immediately see or benefit from their raised permissions**. The token needs to be refreshed, either manually or by waiting for the token to expire and be refreshed. You should probably remind the user to sign out and back in to the app.
* You can't demote users back down to delegate level using this. The easiest way is to delete their user from Firebase, then have them sign in from scratch.

To do
-----

1. Add a command to check a user's status
2. Add a command to demote a user back down to delegate level