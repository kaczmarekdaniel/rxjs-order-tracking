export interface TItem {
    id: string;
    name: string;
    category: string;
  }

export interface ColumnType {
    name: string;
    items: TItem[];

}
  
 export interface AppState {
    [category: string]: TItem[];
  }