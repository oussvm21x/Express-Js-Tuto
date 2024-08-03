import { isString } from "util"

export const schemaValidator = {
    username: {
        notEmpty: {
            errorMessage: "Username cannot be empty"
        },
        isString: {
            errorMessage: "Username must be a string"
        },
        isLength: {
            options: {
                min: 3,
                max: 15
            }
        },
    },
    password: {
        notEmpty: {
            errorMessage: "password name must not be empty"
        }
    }
}

export const itemValidator = {

    price: {
        notEmpty: {
            errorMessage: "price must not be empty"
        }
    },
    name: {
        isString: {
            errorMessage: 'Name must be a string'
        }
    }

}