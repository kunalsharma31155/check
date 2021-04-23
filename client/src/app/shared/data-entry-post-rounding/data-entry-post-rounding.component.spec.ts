import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEntryPostRoundingComponent } from './data-entry-post-rounding.component';

describe('DataEntryPostRoundingComponent', () => {
  let component: DataEntryPostRoundingComponent;
  let fixture: ComponentFixture<DataEntryPostRoundingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataEntryPostRoundingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataEntryPostRoundingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
