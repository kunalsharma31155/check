import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePatientRecordComponent } from './update-patient-record.component';

describe('UpdatePatientRecordComponent', () => {
  let component: UpdatePatientRecordComponent;
  let fixture: ComponentFixture<UpdatePatientRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePatientRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePatientRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
