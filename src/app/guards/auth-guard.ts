import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // Espera el primer valor de authState
  const user = await firstValueFrom(authState(auth));

  return user ? true : router.parseUrl('/home');
};

export const noAuthGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const user = await firstValueFrom(authState(auth));

  return user ? router.parseUrl('/dashboard') : true;
};