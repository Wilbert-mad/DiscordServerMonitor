import { Setting } from './types';

export interface Payload {
  op: string | null;
  data: any | null;
}

// export const requestLogin = JSON.stringify(<Payload>{
//   op: 'request-login',
// });

export const AuthFaildUserExist = JSON.stringify(<Payload>{
  op: '@_AuthFaild-UserExist',
});

export const AuthFaildUserNotExisting = JSON.stringify(<Payload>{
  op: '@_AuthFaild-UserNotExisting',
});

export const AuthFaildIdefity = JSON.stringify(<Payload>{
  op: '@_AuthFaild-IDEF',
});

export const AuthPassed = (LOGIN_TOKEN: string, User: Setting) =>
  JSON.stringify(<Payload>{
    op: '@AuthPassedLogin',
    data: { LOGIN_TOKEN, User },
  });

export const InvalidToken = JSON.stringify(<Payload>{
  op: '@tokenInvalid',
});

export const UnknownError = JSON.stringify(<Payload>{
  op: '@_unknownError',
});

export const Closed = JSON.stringify(<Payload>{
  op: '@Closed',
});

export const Relog = JSON.stringify(<Payload>{
  op: '@Relog_atempt',
});

export const MessageCreate = (data: string) =>
  JSON.stringify(<Payload>{
    op: '@messageCreate',
    data,
  });
