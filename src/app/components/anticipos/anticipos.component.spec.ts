import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnticiposComponent } from './anticipos.component';

describe('AnticiposComponent', () => {
  let component: AnticiposComponent;
  let fixture: ComponentFixture<AnticiposComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnticiposComponent]
    });
    fixture = TestBed.createComponent(AnticiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
