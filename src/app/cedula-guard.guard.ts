import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './services/login.service';

export const cedulaGuardGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const cedula = loginService.getCedula();

  if (cedula) {
    return true;
  } else {
    router.navigate(['/login'])
    return false;
  }

};
