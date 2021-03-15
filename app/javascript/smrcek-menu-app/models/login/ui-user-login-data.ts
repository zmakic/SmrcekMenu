// TODO - split into registration, login and conflict data!
export interface UIUserLoginData {
  email: string;
  password: string;
  
  // TODO - think about enum in typescript
  loginType: string;
};