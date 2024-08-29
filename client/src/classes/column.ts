// import { BehaviorSubject } from 'rxjs';
// import { TItem } from '../types/main';

// export class Column {
//   private items$: BehaviorSubject<TItem[]>;

//   constructor(private category: string) {
//     this.items$ = new BehaviorSubject<TItem[]>([]);
    
//   }

//   getItemsObservable() {
//     return this.items$.asObservable();
//   }

//   getItems(): TItem[] {
//     return this.items$.getValue();
//   }

//   addItem(item: TItem) {
//     this.items$.next([...this.items$.getValue(), item]);
//   }

//   removeItem(itemId: string) {
//     this.items$.next(this.items$.getValue().filter(item => item.id !== itemId));
//   }
// }
