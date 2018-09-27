#!/usr/bin/env node

const colors = require('colors')
const fs = require('fs')
const actions = require('./actions')

// Check if the config JSON exists and stop if it's not found
if(!fs.existsSync('./serviceAccountKey.json'))
    throw Error("No private key file found. Please add it to the root folder to continue.")

// Deconstruct the command
const verb = process.argv[2]
const email = process.argv[3]

if(verb == 'promote'){
    // PROMOTE
    // Set the organiser claim to true, creating it if it doesn't exist
    actions.promoteUser(email)
        .then((res) => {
            console.log(`User ${email} has been promoted to organiser role. \n\nTell them to log out and back in. `.bgGreen.black)
            process.exit(0)
        })
        .catch((err) => {
            console.log(colors.bgRed.black('Failed to promote user to organiser role: ' + err))
            process.exit(1)
        })

} else if(verb == 'demote'){
    // DEMOTE
    // Set the organiser claim to false if it exists
    actions.demoteUser(email)
        .then(actions.revokeToken(email))
        .then((res) => {
            console.log(`User ${email} has been demoted to delegate role and their token has been revoked.`.bgGreen.black)
            process.exit(0)
        }).catch((err) => {
            console.log(colors.bgRed.black('Failed to demote to delegate role: ' + err))
            process.exit(1)
        })

} else if(verb == 'check'){
    // CHECK
    // Log the user's custom claims to the console. Change nothing.
    actions.checkUser(email)
        .then((res) => {
            console.log(`User's custom claims are:`.blue)
            console.log(colors.bgBlue.black(res))
            process.exit(0)
        })
        .catch((err) => {
            console.log(colors.bgRed.black('Failed to check user: ' + err))
            process.exit(1)
        })

} else if(verb == 'revoke'){
    // REVOKE
    // Invalidate the user's session, forcing them to sign in again
    actions.revokeToken(email)
        .then(()=>{
            console.log("User's refresh token successfully revoked. \n\nThey will have to sign in again.".bgGreen.black)
            process.exit(0)
        })
        .catch((error)=>{
            console.log(colors.bgRed.black('Failed to revoke refresh token: ' + err))
            process.exit(1)
        })

} else if(verb == 'list'){

    actions.listUsers()
        .then((listUsersResult)=>{
            const organisers = listUsersResult.users.filter((user)=>{
                if(user.customClaims && user.customClaims.organiser === true)
                    return user
            })
            if(organisers.length > 0){
                console.log("Organisers are:\n".bgBlue.black)
                organisers.forEach(function(user) {
                    if(user.customClaims && user.customClaims.organiser === true)
                        console.log(`${user.toJSON().displayName} (${user.toJSON().email} `.bgBlue.black);
                })
            } else {
                console.log("No organisers to display.".bgBlue.black)
         
            }
            process.exit(0)
        })
        .catch((err)=>{
            console.log(colors.bgRed.black("Couldn't list organisers: ", err))
            process.exit(1)
        })

} else {
    throw Error('Invalid use of user manager. Usage: npm run demote | promote | check | revoke <email>')
}