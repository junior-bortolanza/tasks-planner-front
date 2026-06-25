import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from "@angular/router";
import { Subscription } from 'rxjs';
import { RouterState } from '../../../../core/router/router-state';
import { MatMenuModule } from '@angular/material/menu';
import { Auth } from '../../../../services/auth';
import { User } from '../../../../services/user';



@Component({
  selector: 'app-top-menu',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule, MatMenuModule],
  templateUrl: './top-menu.html',
  styleUrl: './top-menu.scss',
})
export class TopMenu implements OnInit, OnDestroy {
  appLogo = "assets/logo-agendador-javanauta.png"

  rotaAtual: string = '';
  inscricaoRota!: Subscription;

  private routerService = inject(RouterState);
  private authService = inject(Auth);
  private userService = inject(User)
  private route = inject(Router);

  ngOnInit(): void {
    this.inscricaoRota = this.routerService.rotaAtual$.subscribe(url => {
      this.rotaAtual = url;
    })
  }

  ngOnDestroy(): void {
    this.inscricaoRota.unsubscribe();
  }

  estaNaRotaRegister(): boolean {
    return this.rotaAtual === '/register'
  }
  estaNaRotaLogin(): boolean {
    return this.rotaAtual === '/login'
  }

  get estaLogado(): boolean {
    return this.authService.isLoggedIn();
  }

  pegarInicialUsuario(): string {

    const user = this.userService.getUser();

    if (user && user.name) {
      return user.name.charAt(0).toUpperCase();
    }

    return '?';

  }

  logout(): void {
    this.authService.logout();
    this.route.navigate(['/login']);
  }
}
