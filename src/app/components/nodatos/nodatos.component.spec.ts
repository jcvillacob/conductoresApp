import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodatosComponent } from './nodatos.component';

describe('NodatosComponent', () => {
  let component: NodatosComponent;
  let fixture: ComponentFixture<NodatosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodatosComponent]
    });
    fixture = TestBed.createComponent(NodatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
