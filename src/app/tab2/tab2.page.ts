import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  private noButtonClickCount = 0;
  private disappointmentMessages = [
    'Yahhh macaa iya cihh? 😢 Coba dipikir lagi deh...',
    'Macak ndaa cayanggg siihhh? 😭 Masss cedihhh nihhh...',
    'Hmm, masss ndaa pelcaya kamu ndaa cayangg. Pasti cayang kan? ❤️'
  ];
  
  @ViewChild('noButton', { static: false }) noButton!: ElementRef;
  private messageBoxRect: DOMRect | null = null;
  private buttonRect: DOMRect | null = null;
  private buttonContainer: HTMLElement | null = null;
  // Flag to track if a touch event is in progress
  private touchInProgress = false;
  // Flag to detect if we're on mobile
  private isMobileDevice = false;

  constructor(
    private alertController: AlertController,
    private router: Router
  ) {
    // Check if we're on a mobile device
    this.isMobileDevice = this.checkIfMobile();
  }

  // Helper function to detect mobile devices
  checkIfMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (window.innerWidth <= 768);
  }

  ngAfterViewInit() {
    // Get reference to the button container with null check
    const buttonContainerElement = document.querySelector('.button-container');
    if (buttonContainerElement) {
      this.buttonContainer = buttonContainerElement as HTMLElement;
    }
    
    // Get reference to the no button
    const noButtonElement = document.querySelector('.no-button');
    if (noButtonElement) {
      // Add desktop mouseover event
      noButtonElement.addEventListener('mouseover', () => this.moveNoButton());
      
      // Add mobile touch events
      noButtonElement.addEventListener('touchstart', (e) => {
        // Prevent default to avoid scrolling and clicking
        e.preventDefault();
        e.stopPropagation();
        this.touchInProgress = true;
        this.moveNoButton();
        return false;
      }, { passive: false });
      
      // Prevent actual click on mobile
      noButtonElement.addEventListener('click', (e) => {
        if (this.isMobileDevice) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        return true; // Menambahkan return value
      });
      
      // Add touchmove event to detect when user tries to follow the button
      document.addEventListener('touchmove', (e) => {
        if (this.touchInProgress) {
          const touch = e.touches[0];
          const elementAtTouch = document.elementFromPoint(touch.clientX, touch.clientY);
          if (elementAtTouch && elementAtTouch.classList.contains('no-button')) {
            this.moveNoButton();
          }
        }
      }, { passive: true });
      
      // Reset touch flag when touch ends
      document.addEventListener('touchend', () => {
        this.touchInProgress = false;
      });
      
      // Initially capture the message box and button sizes for boundary calculations
      setTimeout(() => {
        const messageBoxElement = document.querySelector('.message-box');
        if (messageBoxElement) {
          this.messageBoxRect = messageBoxElement.getBoundingClientRect();
        }
        
        this.buttonRect = noButtonElement.getBoundingClientRect();
      }, 500);
    }
  }

  // Function to move the "No" button
  moveNoButton() {
    const noButtonElement = document.querySelector('.no-button') as HTMLElement | null;
    if (!noButtonElement) return;
    
    // Refresh measurements in case of window resize
    const messageBoxElement = document.querySelector('.message-box');
    if (messageBoxElement) {
      this.messageBoxRect = messageBoxElement.getBoundingClientRect();
    } else {
      return; // Exit if message box not found
    }
    
    this.buttonRect = noButtonElement.getBoundingClientRect();
    
    // Calculate maximum distances to move while staying in container
    if (!this.messageBoxRect || !this.buttonRect) return;
    
    const maxX = this.messageBoxRect.width - this.buttonRect.width - 40; // 40px for padding
    const maxY = 100; // Limit vertical movement
    
    // Generate random positions within boundaries
    const randomX = Math.floor(Math.random() * maxX) - (maxX / 2);
    const randomY = Math.floor(Math.random() * maxY) - (maxY / 2);
    
    // Apply the transformation
    noButtonElement.style.transform = `translate(${randomX}px, ${randomY}px)`;
    noButtonElement.style.transition = 'transform 0.2s ease-out';
  }

  // Function for when the "YES" button is clicked
  async sayYes() {
    const alert = await this.alertController.create({
      header: 'Yeay!',
      message: 'Ayahhh juga cayanggg kamuuuu! 💚',
      buttons: [{
        text: 'OK',
        handler: () => {
          // Navigate to tab3 when OK is clicked
          this.router.navigate(['/lovestory']);
        }
      }]
    });

    await alert.present();
  }

  // Function for when the "NO" button is clicked
  async sayNo() {
    // On mobile, don't proceed with the click action
    if (this.isMobileDevice) {
      this.moveNoButton();
      return;
    }
    
    // For desktop, proceed as normal
    // Get the current disappointment message based on click count
    const message = this.disappointmentMessages[this.noButtonClickCount];
    
    const alert = await this.alertController.create({
      header: 'Macaa cihhh? 🥺',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
    
    // Increment the click count, but don't go beyond array length
    if (this.noButtonClickCount < this.disappointmentMessages.length - 1) {
      this.noButtonClickCount++;
    } else {
      // Reset to 0 after showing all messages
      this.noButtonClickCount = 0;
    }
    
    // Reset button position after alert is closed
    setTimeout(() => {
      const noButtonElement = document.querySelector('.no-button') as HTMLElement | null;
      if (noButtonElement) {
        noButtonElement.style.transform = 'translate(0, 0)';
      }
    }, 500);
  }
}