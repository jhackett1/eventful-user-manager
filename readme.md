Eventful user manager
=====================

Simple command line utility to manager roles of Eventful users.

You can do four things:
* **Promote** delegates to organisers (admins)
* **Demote** organisers back to delegates
* **Check** a user's current role without changing it
* **Revoke** a user's refresh token, forcing them to sign in again

It uses the Firebase Admin SDK to [add a custom claim](https://firebase.google.com/docs/auth/admin/custom-claims) to the data stored about a user.

How to use it
------------

Clone this repo and run `npm install` to grab the Firebase Admin SDK.

In your Firebase project, go to **Project settings > Service accounts**, and download the private key JSON file.

Put that file in the root folder of this utility and rename it to `serviceAccountKey.json`.

Then, just run `npm run promote | demote | check | revoke user@email.com`, replacing the email with the user's email address and using the right verb for the action you want to perform.

The utility will let you know if the attempt succeeded or not.

Things to remember
------------------

* The user needs to have signed in once already, otherwise Firebase won't recognise the email as belonging to a user.

* The user **won't immediately see or benefit from new organiser permissions**. Their token needs to be refreshed, either manually or by waiting for the token to expire and be refreshed. You should probably remind the user to sign out and back in to the app. You can also revoke their token manually by running the `revoke` command from here.

* Equally, when a user is demoted back down to delegate level, this will only take effect when their token expires. You can revoke their token manually with `revoke`.

To do
-----

1. ~~Add a command to check a user's status~~ Done!
2. ~~Add a command to demote a user back down to delegate level~~ Done!
3. ~~Make tokens revokable~~ Done!
4. Make it globally installable?