import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table';

describe('TableComponent', () => {
  let component: TableComponent<Record<string, unknown>>;
  let fixture: ComponentFixture<TableComponent<Record<string, unknown>>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
