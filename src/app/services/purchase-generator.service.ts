import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList }
  from 'angularfire2/database';
@Injectable({
  providedIn: 'root'
})
export class PurchaseGeneratorService {
  workItems: AngularFireList<any>;
  constructor(db: AngularFireDatabase) {
    this.workItems = db.list('job-queue');
  }

  createPurchases() {
    const firstNames = [
      ['Brielle', 'Darla', 'Fran', 'Gwen', 'Juliann', 'Lily', 'Maria', 'Piper', 'Susan', 'Tammy'],
      ['Ben', 'George', 'John', 'Mark', 'Mike', 'Nate', 'Paul', 'Roman', 'Stewart', 'Toby', 'Zach']
    ];
  
    const lastNames = ['Crocker', 'Fisher', 'Fitzgerald', 'Johnson', 'Georgeson', 'Parker', 'Robertson', 'Thompson', 'Walker', 'Woo'],

    createEvent = () => {
        const randGender = Math.round(Math.random()),
            randFirstName = Math.floor(Math.random() * 10),
            randLastName = Math.floor(Math.random() * 10),
            randAge = Math.floor((Math.random() * 82) + 18),
            randCost = parseFloat((Math.random() * 300).toFixed(2)),
            customerName = firstNames[randGender][randFirstName] + ' ' + lastNames[randLastName],
            customerGender = randGender == 0 ? 'Female' : 'Male';
        
        this.workItems.push({
            eventName: 'Purchases',
            customer: {
                name: customerName,
                age: randAge,
                gender: customerGender
            },
            cost: randCost,
            createdAt: new Date()
        });
    };
    (function loop() {
      setTimeout( () => {
          createEvent();
          loop();
      }, Math.floor((Math.random() * 10) + 1)); // Randomize between 1 and 10 seconds // Math.floor((Math.random() * 10) + 1)
    }());
  }
}
