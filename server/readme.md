# Routes

-   ## GET /api/users

    get user details from access token

    ### request body

        {
            accessToken
        }

    ### request headers

        Authorization: Bearer ${accessToken}

    ### response

        {
            username
        }

-   ## POST /api/users

    register a new user

    ### request

        {
            username,
            password
        }

    ### response

        {
            accessToken: {
                token,
                expiresAt
            },
            refreshToken
        }

-   ## PATCH /api/users

    modifies user

    ### request body

        {
            username?,
            password?
        }

    ### request headers

        Authorization: Bearer ${accessToken}

-   ## DELETE /api/users

    deletes user

    ### request headers

        Authorization: Bearer ${accessToken}

-   ## POST /api/login

    login

    ### request

        {
            username,
            password
        }

    ### response

        {
            accessToken: {
                token,
                expiresAt
            },
            refreshToken
        }

-   ## POST /api/logout

    logout

    ### request

        {
            refreshToken
        }

-   ## POST /api/token
    get new access token
    ### request
        {
            refreshToken
        }
    ### response
        {
            accessToken: {
                token,
                expiresAt
            },
            refreshToken
        }
