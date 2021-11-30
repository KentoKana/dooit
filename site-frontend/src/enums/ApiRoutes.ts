export enum AuthRoute {
    Login = "http://localhost:4000/user/login",
    SignOut = "http://localhost:4000/user/sign-out",
    Create = "http://localhost:4000/user/create",
    GetUser = "http://localhost:4000/user",
    ResetPassword = "http://localhost:4000/user/reset-password"
}

export enum UserRoute {
    GetUserProfile = "http://localhost:4000/user/user-profile",
    UpdateUserProfile = "http://localhost:4000/user/update-user-profile"
}

export enum ProjectRoute {
    GetAllProjectsForUser = "http://localhost:4000/project/get-all-for-user",
    CreateProject = "http://localhost:4000/project/create-project",
    GetProjectCreateOptions = "http://localhost:4000/project/get-project-create-options"
}