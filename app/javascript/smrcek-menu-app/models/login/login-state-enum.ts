export enum LoginStateEnum {
    // NO_STATE is here for when creating object for which state is not important
    NO_STATE = -1,

    NOT_LOGGED_IN = 0,

    LOGIN_STARTED = 9,
    LOGGED_IN = 10,

    LOGIN_CONFLICT = 20,

    REGISTRATION_STARTED = 30
}
