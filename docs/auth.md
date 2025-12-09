# /POST/ /api/auth/register
## Request Body
```json
    {
        "email": "john.doe@test.com",
        "username": "John Doe",
        "password": "********"
    }
```

## Response
### Success
```json
    {
        "meta": {
            "code": "201",
            "status": "success",
            "message": "User registered successfully."
        },
        "data": null
    }
```
### Failed
```json
    {
        "meta": {
            "code": "400",
            "status": "error",
            "message": "Email already exists or invalid input."
        },
        "error": "string[] | string | null"
    }
```


# /POST/ /api/auth/login
## Request Body
```json
    {
        "email": "john.doe@test.com",
        "password": "********"
    }
```

## Response
### Success
```json
    {
        "meta": {
            "code": "201",
            "status": "success",
            "message": "Login successful."
        },
        "data": {
            "token": "token"
        }
    }
```
### Failed
```json
    {
        "meta": {
            "code": "401",
            "status": "error",
            "message": "Invalid email or password."
        },
        "data": null
    }
```
