import { mutationOptions } from '@tanstack/react-query';

import {
  signInWithUsernameControllerSignInWithUsername,
  signUpWithUsernameControllerSignUpWithUsername,
} from '@/lib/apis/_generated/quizzesGameIoBackend';
import type {
  SignInWithUsernameDto,
  SignUpWithUsernameDto,
} from '@/lib/apis/_generated/quizzesGameIoBackend.schemas';

export const authQueries = {
  signUp: mutationOptions({
    mutationFn: (data: SignUpWithUsernameDto) =>
      signUpWithUsernameControllerSignUpWithUsername(data),
    mutationKey: ['auth', 'signUp'] as const,
  }),
  signIn: mutationOptions({
    mutationFn: (data: SignInWithUsernameDto) =>
      signInWithUsernameControllerSignInWithUsername(data),
    mutationKey: ['auth', 'signIn'] as const,
  }),
};
