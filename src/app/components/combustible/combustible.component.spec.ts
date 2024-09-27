import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombustibleComponent } from './combustible.component';

describe('CombustibleComponent', () => {
  let component: CombustibleComponent;
  let fixture: ComponentFixture<CombustibleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CombustibleComponent]
    });
    fixture = TestBed.createComponent(CombustibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
