import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  
  // Mapping route ke title
  private titleMap = new Map([
    ['/', 'Our Anniversary\'s Card 💚'],
    ['/confirmation', 'Confirmation Message'],
    ['/lovestory', 'Our Love Story 💚🤎'],
  ]);

  constructor(
    private router: Router,
    private titleService: Title
  ) {
    // Listen to router events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('Navigation to:', event.urlAfterRedirects);
      
      // Set title berdasarkan route
      const title = this.titleMap.get(event.urlAfterRedirects) || 'Our Anniversary\'s Card 💚';
      
      // Set dengan delay untuk memastikan tidak ke-override
      setTimeout(() => {
        this.titleService.setTitle(title);
        console.log('Title set to:', title);
      }, 100);
    });
  }
}