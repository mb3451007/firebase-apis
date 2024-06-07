export interface FoodNode {
  name: string;
  children?: FoodNode[];
}

export interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
