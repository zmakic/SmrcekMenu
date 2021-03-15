import { firebaseAuthProvider } from '../../../services/firebase';
import { Module } from "vuex";
import { LoggedInUser } from '../../models/login/logged-in-user';
import { LoginStateEnum } from "../../models/login/login-state-enum";
import { UIUserLoginData } from '../../models/login/ui-user-login-data';
import firebase from 'firebase/app';
import {
    buildLoggedInUser, createUserIfNeeded,
    retrieveUser, updateUserFromFirebaseUser
} from './logged-in-user-module-helper';
// import * as _ from 'lodash'; // TODO - switch for testing one or the other
import _ from '../../../utils/myLodash'; // TODO - check how to do import *

import { AppState } from "../../models/app-state";
import { LoginTypeEnum } from "../../models/login/login-type-enum";
import { LoginConflictInfo } from '../../models/login/login-conflict-info';

// **************************************************************
// FAKE TEST DATA, REMOVE WHEN API CORS IS RESOLVED / START
//var mock = new MockAdapter(axiosInstanceTest)

// Add mocked responses
// mock.onGet("https://dev-edit-crud-service.p4c-htz/entity/types").reply(200, ENTITY_TYPES_DATA);
// mock.onGet("https://dev-edit-crud-service.p4c-htz/entity").reply(200, ALL_ENTITIES_DATA);
// mock.onPost("https://dev-edit-crud-service.p4c-htz/entity").reply((config: any) => {
//  ALL_ENTITIES_DATA.entity.push(JSON.parse(config.data) as EntityDto);
//  return [200, config.data];
//});

// FAKE TEST DATA, REMOVE WHEN API CORS IS RESOLVED / END
// **************************************************************
export const LoggedInUserModule: Module<LoggedInUser, AppState> = {
    namespaced: true,
    state() {
        return {
            loginState: LoginStateEnum.NOT_LOGGED_IN,
            uid: undefined,
            email: undefined,
            displayName: undefined,
            userId: undefined,
            conflictInfo: {
                existingSignInMethods: [],
                targetLinkProverId: undefined
            } as LoginConflictInfo
        }
    },
    mutations: {
        startLogin(state: LoggedInUser) {
            state.loginState = LoginStateEnum.LOGIN_STARTED;

            console.log('LOGIN STATE', LoginStateEnum[state.loginState]);
        },
        quitLoggingIn(state: LoggedInUser) {
            state.loginState = LoginStateEnum.NOT_LOGGED_IN;

            console.log('LOGIN STATE', LoginStateEnum[state.loginState]);
        },

        startRegistration(state: LoggedInUser) {
            state.loginState = LoginStateEnum.REGISTRATION_STARTED;

            console.log('LOGIN STATE', LoginStateEnum[state.loginState]);
        },
        quitRegistration(state: LoggedInUser) {
            state.loginState = LoginStateEnum.NOT_LOGGED_IN;

            console.log('LOGIN STATE', LoginStateEnum[state.loginState]);
        },

        setLoginInConflict(state: LoggedInUser, payload: LoginConflictInfo) {
            state.loginState = LoginStateEnum.LOGIN_CONFLICT;
            state.conflictInfo = { ...state.conflictInfo, ...payload };

            console.log('LOGIN STATE', LoginStateEnum[state.loginState]);
        },
        quitConflictResolution(state: LoggedInUser) {
            state.loginState = LoginStateEnum.NOT_LOGGED_IN;

            console.log('LOGIN STATE', LoginStateEnum[state.loginState]);
        },

        clearUser(state: LoggedInUser) {
            state.loginState = LoginStateEnum.NOT_LOGGED_IN;
            state.uid = undefined;
            state.email = undefined;
            state.displayName = undefined;


            console.log('LOGIN STATE', LoginStateEnum[state.loginState]);
        },
        setUserAsLogged (state: LoggedInUser, user: LoggedInUser) {
            state.loginState = LoginStateEnum.LOGGED_IN;
            state.uid = user.uid;
            state.email = user.email;
            state.displayName = user.displayName;
            state.userId = user.userId;
            console.log('state set to user', user);
            //state = Object.assign(state, user)

            console.log('LOGIN STATE', LoginStateEnum[state.loginState]);
        },
    },
    actions: {
        setUserFromFirebase ({ commit, dispatch }, firebaseLoggedInUser: firebase.User | undefined): Promise<LoggedInUser | undefined> {
            console.log('setUserFromFirebase', firebaseLoggedInUser);
            if (firebaseLoggedInUser?.uid) {
                return retrieveUser(firebaseLoggedInUser)
                    .then(retrievedUser => createUserIfNeeded(retrievedUser, firebaseLoggedInUser))
                    .then(createdOrRetrievedUser => updateUserFromFirebaseUser(createdOrRetrievedUser, firebaseLoggedInUser))
                    .then(updatedUser => buildLoggedInUser(updatedUser))
                    .then(loggedInUser => {
                        commit('setUserAsLogged', loggedInUser);
                        return loggedInUser
                    })
                    .catch(reason => {
                        console.log("SOME API ERROR", reason);
                        throw reason;
                    });
            } else {
                commit('clearUser');

                return new Promise((resolve, reject) => {
                    resolve(undefined);
                });
            }
        },
        startConflictResolution({ commit }, payload: any) { // TODO - add type reason: any, email: string, password: string
            firebaseAuthProvider.fetchSignInMethodsForEmail(payload.reason.email).then(signInMethods => {
                console.log('signInMethods', signInMethods);
                if (_.includes(signInMethods, "password")) { // TODO - "password" to some constant
                    commit('setLoginInConflict', {
                        existingSignInMethods: signInMethods,
                        targetLinkProverId: payload.reason.credential.providerId
                    } as LoginConflictInfo);
                } else if (_.includes(signInMethods, "google.com")) { // TODO - "password" to some constant
                    commit('setLoginInConflict', {
                        existingSignInMethods: signInMethods,
                        targetLinkProverId: payload.reason.credential.providerId
                    } as LoginConflictInfo);
                }
            });
        },
        finalizeConflictResolution({commit}, payload: UIUserLoginData) { // TODO -add type
            const facebookProvider = new firebase.auth.FacebookAuthProvider();

            this.dispatch('LoggedInUserModule/loginUser', payload).then(userCredentials => {
                firebaseAuthProvider.currentUser?.linkWithPopup(facebookProvider).then((result) => {
                    // Accounts successfully linked.
                    var credential = result.credential;
                    var user = result.user;

                    if (result.credential) {
                        firebaseAuthProvider.signInWithCredential(result.credential);
                    }
                    // ...
                }).catch((error) => {
                    // Handle Errors here.
                    // ...
                    console.log("LINK ERROR", error);
                });

            });
        },
        registerUser({}, payload: UIUserLoginData): Promise<firebase.auth.UserCredential> {
            let registerPromise = new Promise<firebase.auth.UserCredential>((resolve, reject) => {});

            switch(payload.loginType) {
                case LoginTypeEnum.EMAIL:
                    registerPromise = firebaseAuthProvider.createUserWithEmailAndPassword(payload.email, payload.password);
                    break;
            }

            return registerPromise;
        },
        loginUser({}, payload: UIUserLoginData): Promise<firebase.auth.UserCredential> {
            const self = this;

            // create empty promise, to have correct return type if wrong loginType sent
            let loginPromise = new Promise<firebase.auth.UserCredential>((resolve, reject) => {
                resolve(undefined as any);
            });

            switch(payload.loginType) {
                case LoginTypeEnum.EMAIL:
                    loginPromise = firebaseAuthProvider.signInWithEmailAndPassword(payload.email, payload.password);
                    break;
                case LoginTypeEnum.FACEBOOK:
                    const fbProvider = new firebase.auth.FacebookAuthProvider();
                    fbProvider.setCustomParameters({
                        display: "popup",
                    });
                    loginPromise = firebaseAuthProvider.signInWithPopup(fbProvider);
                    break;
                case LoginTypeEnum.GOOGLE:
                    const googleProvider = new firebase.auth.GoogleAuthProvider();
                    googleProvider.setCustomParameters({
                        display: "popup",
                    });
                    loginPromise = firebaseAuthProvider.signInWithPopup(googleProvider);
                    break;
            }

            return loginPromise.catch(reason => {
                if (reason.code === "auth/account-exists-with-different-credential") {
                    console.log("CREDENTIALS CONFLICT", reason);
                    self.dispatch('LoggedInUserModule/startConflictResolution', { reason: reason });
                    return reason;
                }
                if (reason.code === "auth/wrong-password") {
                    console.log("WRONG PASS OR CREDENTIALS CONFLICT", reason)


                    throw reason;
                }

                throw reason;
            });;
        },
        logout(): Promise<void> {
            return firebaseAuthProvider.signOut().then(function() {
                // Sign-out successful.
            }, function() {
                // TODO - An error happened.
            });
        }
    },
}
