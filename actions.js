const admin = require('firebase-admin')

const serviceAccount = require('./serviceAccountKey.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

module.exports = {
    promoteUser: async function(email){
        const user = await admin.auth().getUserByEmail(email)
        if (user.customClaims && user.customClaims.admin === true) {
            return
        }
        return admin.auth().setCustomUserClaims(user.uid, {
            organiser: true,
        })
    }, 
    demoteUser: async function(email){
        const user = await admin.auth().getUserByEmail(email)
        return admin.auth().setCustomUserClaims(user.uid, {
            organiser: false,
        })
    }, 
    checkUser: async function(email){
        const user = await admin.auth().getUserByEmail(email)
        return user.customClaims
    }, 
    revokeToken: async function(email){
        const user = await admin.auth().getUserByEmail(email)
        return admin.auth().revokeRefreshTokens(user.uid)
    },
    listUsers: async function(){
        const listUsersResult = await admin.auth().listUsers(1000)
        return listUsersResult
    }
}