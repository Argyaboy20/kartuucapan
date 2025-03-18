import { Component, OnInit } from '@angular/core';

interface Photo {
  thumbnail: string;
  fullsize: string;
  description: string;
  date: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  // Anniversary date
  anniversaryDate: Date = new Date('2024-08-26');
  daysCount: number = 0;
  monthsCount: number = 0;
  nextMilestone: string = '';
  daysToNextMilestone: number = 0;
  showMonthlyReminder: boolean = false;
  nextMonthlyDate: Date = new Date();
  
  // Photo gallery
  photos: Photo[] = [
    {
      thumbnail: 'assets/photos/thumb1.jpg',
      fullsize: 'assets/photos/photo1.jpg',
      description: 'Our first date at Central Park',
      date: 'August 26, 2024'
    },
    {
      thumbnail: 'assets/photos/thumb2.jpg',
      fullsize: 'assets/photos/photo2.jpg',
      description: 'Beautiful sunset at the beach',
      date: 'September 10, 2024'
    },
    {
      thumbnail: 'assets/photos/thumb3.jpg',
      fullsize: 'assets/photos/photo3.jpg',
      description: 'Movie night under the stars',
      date: 'September 23, 2024'
    },
    {
      thumbnail: 'assets/photos/thumb4.jpg',
      fullsize: 'assets/photos/photo4.jpg',
      description: 'Candlelight dinner for our special day',
      date: 'October 5, 2024'
    },
    {
      thumbnail: 'assets/photos/thumb5.jpg',
      fullsize: 'assets/photos/photo5.jpg',
      description: 'Hiking adventure in the mountains',
      date: 'October 19, 2024'
    },
    {
      thumbnail: 'assets/photos/thumb6.jpg',
      fullsize: 'assets/photos/photo6.jpg',
      description: 'Coffee and conversations we cherish',
      date: 'November 2, 2024'
    }
  ];
  
  // Modal controls
  isModalOpen: boolean = false;
  currentIndex: number = 0;
  currentPhoto: Photo | null = null;

  constructor() {}

  ngOnInit() {
    // Update the counter initially
    this.updateDaysCount();
    
    // Update the counter every hour
    setInterval(() => {
      this.updateDaysCount();
    }, 3600000); // 1 hour in milliseconds
    
    // Check for monthly anniversary
    this.checkMonthlyAnniversary();
  }

  updateDaysCount() {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.anniversaryDate.getTime());
    this.daysCount = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate months count
    this.calculateMonthsCount();
    
    // Calculate next milestone
    this.calculateNextMilestone();
  }
  
  calculateMonthsCount() {
    const now = new Date();
    const years = now.getFullYear() - this.anniversaryDate.getFullYear();
    let months = now.getMonth() - this.anniversaryDate.getMonth();
    
    if (months < 0) {
      months += 12;
      months += (years - 1) * 12;
    } else {
      months += years * 12;
    }
    
    // Adjust for day of month
    if (now.getDate() < this.anniversaryDate.getDate()) {
      months--;
    }
    
    this.monthsCount = months;
  }
  
  checkMonthlyAnniversary() {
    const now = new Date();
    // Show reminder if it's the 26th of any month
    this.showMonthlyReminder = now.getDate() === this.anniversaryDate.getDate();
    
    // Calculate the next monthly anniversary date
    let nextMonth = new Date(now.getFullYear(), now.getMonth(), this.anniversaryDate.getDate());
    if (now.getDate() > this.anniversaryDate.getDate() || 
       (now.getDate() === this.anniversaryDate.getDate() && 
        now.getHours() >= 23 && now.getMinutes() >= 59)) {
      nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, this.anniversaryDate.getDate());
    }
    this.nextMonthlyDate = nextMonth;
    
    // Check monthly anniversary status daily
    setTimeout(() => {
      this.checkMonthlyAnniversary();
    }, 86400000); // 24 hours in milliseconds
  }

  calculateNextMilestone() {
    const milestones = [
      { days: 30, name: '1 Month Anniversary' },
      { days: 50, name: '50 Days of Love' },
      { days: 100, name: '100 Days Together' },
      { days: 180, name: '6 Months Anniversary' },
      { days: 365, name: '1 Year Anniversary' },
      { days: 500, name: '500 Days of Love' },
      { days: 730, name: '2 Years Anniversary' },
      { days: 1095, name: '3 Years Anniversary' },
      { days: 1460, name: '4 Years Anniversary' },
      { days: 1825, name: '5 Years Anniversary' },
      { days: 3650, name: '10 Years Anniversary' }
    ];
    
    for (const milestone of milestones) {
      if (this.daysCount < milestone.days) {
        this.nextMilestone = milestone.name;
        this.daysToNextMilestone = milestone.days - this.daysCount;
        return;
      }
    }
    
    // If no upcoming milestone is found, calculate the next anniversary
    const yearsPassed = Math.floor(this.daysCount / 365);
    const nextYearAnniversary = (yearsPassed + 1) * 365;
    this.nextMilestone = `${yearsPassed + 1} Years Anniversary`;
    this.daysToNextMilestone = nextYearAnniversary - this.daysCount;
  }

  openPhotoModal(index: number) {
    this.currentIndex = index;
    this.currentPhoto = this.photos[index];
    this.isModalOpen = true;
  }
  
  closePhotoModal() {
    this.isModalOpen = false;
  }
  
  nextPhoto() {
    if (this.currentIndex < this.photos.length - 1) {
      this.currentIndex++;
      this.currentPhoto = this.photos[this.currentIndex];
    }
  }

  prevPhoto() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentPhoto = this.photos[this.currentIndex];
    }
  }

  rotate3DPhoto(position: string) {
    const element = document.querySelector(`.partner-photo.${position}`);
    if (element) {
      if (element.classList.contains(`rotate-${position}`)) {
        element.classList.remove(`rotate-${position}`);
      } else {
        element.classList.add(`rotate-${position}`);
      }
    }
  }
}