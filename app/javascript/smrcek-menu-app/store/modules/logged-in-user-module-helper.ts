import firebase from 'firebase/app';
import { LoggedInUser } from '../../models/login/logged-in-user';
import { LoginStateEnum } from "../../models/login/login-state-enum";
import axios from 'axios';
import { UserDto } from '../../models/backend/user-dto';

const API_URL = "http://localhost:3000"; // TODO - put in config

export function retrieveUser(user: firebase.User): Promise<UserDto | undefined> {
  return axios.get<UserDto[]>(API_URL + '/users.json?uid=' + user.uid).then(response => {
    if (response.data && response.data[0] && response.data.length === 1) {
      return response.data[0];
    } else {
      return undefined;
    }
  });
}

export function createUserIfNeeded(user: UserDto, firebaseUser: firebase.User): Promise<UserDto> {
  if (user) {
    return new Promise<UserDto>( resolve => resolve(user));
  }

  const token = (document.querySelector('[name=csrf-token]') as any).content;
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token

  const userToCreate = createUserFromFirebaseUser(firebaseUser);

  return axios.post<UserDto>(API_URL + '/users.json', { user: userToCreate }).then(response => response.data);
}

export function updateUserFromFirebaseUser(user: UserDto, firebaseUser: firebase.User): Promise<UserDto> {
  // TODO - maybe a lambda to update this ?
  let hasChanges = false;
  if (user.name !== firebaseUser.displayName) {
    hasChanges = true;
    console.log('name change', user.name, firebaseUser.displayName);
    user.name = firebaseUser.displayName;
  }
  if (user.email !== firebaseUser.email) {
    hasChanges = true;
    console.log('email change', user.email, firebaseUser.email);
    user.email = firebaseUser.email;
  }

  if (hasChanges) {
    const token = (document.querySelector('[name=csrf-token]') as any).content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token

    return axios.put<UserDto>(API_URL + '/users/' + user.id + '.json', { user: user }).then(response => response.data);
  } else {
    // If no changes just return current user
    return new Promise<UserDto>(resolve => { resolve(user) });
  }
}

export function createUserFromFirebaseUser(firebaseUser: firebase.User): UserDto {
  return {
    name: firebaseUser.displayName,
    email: firebaseUser.email,
    uid: firebaseUser.uid,
    id: undefined
  };
}

/**
 * Creates LoggedInUser (ui user) from firebase user.
 * @param firebaseUser firebase user
 * @return created ui user
 */
export function buildLoggedInUser(user: UserDto): LoggedInUser {
  return {
    loginState: LoginStateEnum.NO_STATE,
    displayName: user.name ? user.name : undefined,
    email: user.email ? user.email : undefined,
    uid: user.uid,
    userId: user.id,
    conflictInfo: {
      existingSignInMethods: [],
      targetLinkProverId: undefined
    }
  };
}