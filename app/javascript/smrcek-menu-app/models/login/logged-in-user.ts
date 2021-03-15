import { LoginConflictInfo } from './login-conflict-info';
import { LoginStateEnum } from './login-state-enum';

export interface LoggedInUser {
    loginState: LoginStateEnum;
    uid?: string;
    email?: string;
    displayName?: string;
    conflictInfo: LoginConflictInfo;
    userId: number;
};