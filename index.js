const colors = require('colors')
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

function malformed(){
    throw Error('Invalid use of user manager. Usage: npm run demote | promote | check <email>')
}

// Stop here if the command isn't properly formed
if (process.argv.length !== 4) {
    malformed()
}

// Deconstruct the command
const verb = process.argv[2]
const email = process.argv[3]

if(verb == 'promote'){
    // PROMOTE
    // Set the organiser claim to true, creating it if it doesn't exist
    addOrganiserClaim(email)
        .then((res) => {
            console.log(`User ${email} has been given organiser role`.bgGreen.black)
            process.exit(0)
        })
        .catch((err) => {
            console.log(colors.bgRed.black('Failed to grant user organiser role: ' + err))
            process.exit(1)
        })
    async function addOrganiserClaim(email){
        const user = await admin.auth().getUserByEmail(email)
        if (user.customClaims && user.customClaims.admin === true) {
            return
        }
        return admin.auth().setCustomUserClaims(user.uid, {
            organiser: true,
        })
    }
} else if(verb == 'demote'){
    // DEMOTE
    // Set the organiser claim to false if it exists
    removeOrganiserClaim(email)
        .then((res) => {
            console.log(`User ${email} has been demoted to delegate role`.bgGreen.black)
            process.exit(0)
        }).catch((err) => {
            console.log(colors.bgRed.black('Failed to demote to delegate role: ' + err))
            process.exit(1)
        })
    async function removeOrganiserClaim(email){
        const user = await admin.auth().getUserByEmail(email)
        return admin.auth().setCustomUserClaims(user.uid, {
            organiser: false,
        })
    }
} else if(verb == 'check'){
    // CHECK
    // Log the user's custom claims to the console. Change nothing.
    checkClaims(email)
        .then((res) => {
            console.log(`User's custom claims are:`.blue)
            console.log(colors.bgBlue.black(res))
            process.exit(0)
        })
        .catch((err) => {
            console.log(colors.bgRed.black('Failed to check user: ' + err))
            process.exit(1)
        })
    async function checkClaims(email){
        const user = await admin.auth().getUserByEmail(email)
        return user.customClaims
    }
} else if(verb == 'revoke'){
    // REVOKE
    // Invalidate the user's session, forcing them to sign in again
    admin.auth().getUserByEmail(email)
        .then((user)=>{
            admin.auth().revokeRefreshTokens(user.uid)
                .then(() => {
                    console.log("User's refresh token successfully revoked. They will have to sign in again.".bgGreen.black)
                    process.exit(0)
                })
                .catch((err) => {
                    console.log(colors.bgRed.black('Failed to revoke refresh token: ' + err))
                    process.exit(1)
                })
        })

} else {
    malformed()
}

