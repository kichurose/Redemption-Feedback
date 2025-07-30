import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { RedemptionPortalComponent } from './redemption-portal.component';

describe('RedemptionPortalComponent', () => {
  let component: RedemptionPortalComponent;
  let fixture: ComponentFixture<RedemptionPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedemptionPortalComponent, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedemptionPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate email format', () => {
    component.email = 'invalid-email';
    component.claimCode = 'test123';
    component.onRedeem();
    expect(component.message).toContain('valid email address');
    expect(component.messageType).toBe('error');
  });

  it('should require both email and claim code', () => {
    component.email = '';
    component.claimCode = '';
    component.onRedeem();
    expect(component.message).toContain('fill in both');
    expect(component.messageType).toBe('error');
  });
});
