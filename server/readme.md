# Routes

- ## GET /api/users
    get user details from access token
    ### request
        {
            access_token
        }
    ### response
        {
            username
        }

- ## POST /api/users
    register a new user
    ### request
        {
            username,
            password
        }
    ### response
        {
            access_token: {
                token,
                expiresAt
            },
            refreshToken
        }

- ## PATCH /api/users
    modifies user
    ### request
        {
            access_token
        }

- ## DELETE /api/users
    deletes user
    ### request
        {
            access_token
        }

- ## POST /api/login
    login
    ### request
        {
            username,
            password
        }
    ### response
        {
            access_token: {
                token,
                expiresAt
            },
            refreshToken
        }

- ## POST /api/logout
    logout
    ### request
        {
            refresh_token
        }

- ## POST /api/token
    get new access token
    ### request
        {
            refresh_token
        }
    ### response
        {
            access_token
        }