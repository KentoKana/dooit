export const generateFirebaseAuthErrorMessage = (errorCode: string) => {
    switch (errorCode) {
        case "auth/user-not-found":
            return "No user found with matching credentials."
        case "auth/wrong-password":
            return "Invalid password."
        case "auth/too-many-requests":
            return "Too many wrong attemps. Please try again later."
        case "auth/email-already-exists":
            return "User with this e-mail already exists.";
        case "auth/email-already-in-use":
            return "User with this e-mail already in use.";
        default:
            return "Something went wrong ..."
    }
}

export const isNullOrUndefined = (value: any) => {
    if (value !== null && value !== undefined) {
        return false
    }
    return true;
}