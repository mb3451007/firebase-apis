import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ExampleFlatNode, FoodNode } from './tree.model';

import { TREE_DATA } from './tree-data';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-mat-tree',
  templateUrl: './mat-tree.component.html',
  styleUrls: ['./mat-tree.component.css']
})
export class MatTreeComponent implements OnInit {
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadTreeData();
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  drop(event: CdkDragDrop<ExampleFlatNode[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.updateTreeDataStructure();
    this.saveTreeData();
  }

  updateTreeDataStructure() {
    const tree = this.dataSource.data;
    this.dataSource.data = this.treeFlattener.flattenNodes(tree);
  }

  saveTreeData(): void {
    this.userService.saveTreeData(this.dataSource.data as FoodNode[]).catch(error => {
      console.error('Error saving tree data:', error);
    });
  }

  loadTreeData(): void {
    this.userService.loadTreeData().subscribe((data:any) => {
      this.dataSource.data = data;
    }, (error:any) => {
      console.error('Error loading tree data:', error);
      this.dataSource.data = TREE_DATA; // Fallback to default tree data
    });
  }
}
