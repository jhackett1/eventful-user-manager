Eventful user manager
=====================

Simple command line utility to manage roles of Eventful users.

You can do five things:
* **Promote** delegates to organisers (aka admins)
* **Demote** organisers back to delegates
* **Check** a specific user's current role without changing it
* **List** all users with the organiser role
* **Revoke** a user's refresh token, forcing them to sign in again

It uses the Firebase Admin SDK to [modify custom claims](https://firebase.google.com/docs/auth/admin/custom-claims) stored with the user.

How to use it
------------

Clone this repo and run `npm install` to grab the Firebase Admin SDK.

In your Firebase project, go to **Project settings > Service accounts**, and download the private key JSON file.

Put that file in the root folder of this utility and rename it to `serviceAccountKey.json`.

Then, just run `npm run promote | demote | check | revoke user@email.com`, replacing the email with the user's email address and using the right verb for the action you want to perform.

The utility will let you know if the attempt succeeded or not.

You can also run `npm run list` without supplying an email.

Things to remember
------------------

* The user needs to have signed in once already, otherwise Firebase won't recognise the email as belonging to a user.

* The user **won't immediately see or benefit from new organiser permissions**. Their token needs to be refreshed, either manually or by waiting for the token to expire. You should either tell the user to sign out and back in to the app, or revoke their token manually by running the `revoke` command from here.

* Demoting a user automatically revokes their token at the same time.

To do
-----

1. ~~Add a command to check a user's status~~ Done!
2. ~~Add a command to demote a user back down to delegate level~~ Done!
3. ~~Make tokens revokable~~ Done!
4. ~~Demoting a user should auto-revoke their token~~ Done!
5. ~~Add a command to list all organisers~~ Done!
6. Make it globally installable (in progress)

