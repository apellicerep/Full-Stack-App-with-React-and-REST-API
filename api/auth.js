const auth = require('basic-auth')
const User = require('./models').User
const bcryptjs = require('bcryptjs');



const authenticateUser = async (req, res, next) => {
    let message = null;
    let currentUser = {};
    let user;


    // Get the user's credentials from the Authorization header.
    const credentials = auth(req);
    console.log(auth(req))

    if (credentials) {

        // Look for a user whose `username` matches the credentials `name` property.
        user = await User.findOne({
            where: { emailAddress: credentials.name }
        })

        if (user) {
            const { id, emailAddress, firstName, lastName, password } = user.toJSON()
            const authenticated = bcryptjs
                .compareSync(credentials.pass, password);
            if (authenticated) {
                console.log(`Authentication successful for username: ${credentials.name}`);
                currentUser.id = id;
                currentUser.emailAddress = emailAddress
                currentUser.firstName = firstName
                currentUser.lastName = lastName

                // Store the user on the Request object.
                req.currentUser = currentUser; //nos servira para saber quien hace el request.
            } else {
                message = `Wrong password for email: ${credentials.name}`;
            }
        } else {
            message = `User not found with email: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: [message] });
    } else {
        next();
    }

};

module.exports = { authenticateUser }