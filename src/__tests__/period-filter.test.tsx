// @file src/__tests__/period-filter.test.tsx
/**
 * @overview [UI-DASH-001] period-filter.test.tsx — PeriodFilter 단위/통합 테스트.
 *
 * @call-flow
 * 1. render/mount PeriodFilter
 * 2. assert UI states + interactions
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { PeriodFilter } from '@/components/dashboard/period-filter';

describe('PeriodFilter', () => {
  it('1주일, 1개월, 3개월 버튼을 렌더링해야 합니다.', () => {
    render(<PeriodFilter value="1w" onChange={jest.fn()} />);

    expect(screen.getByTestId('period-filter-1w')).toHaveTextContent('1주일');
    expect(screen.getByTestId('period-filter-1m')).toHaveTextContent('1개월');
    expect(screen.getByTestId('period-filter-3m')).toHaveTextContent('3개월');
  });

  it('선택된 기간 버튼에 aria-pressed=true를 적용해야 합니다.', () => {
    render(<PeriodFilter value="1m" onChange={jest.fn()} />);

    expect(screen.getByTestId('period-filter-1m')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('period-filter-1w')).toHaveAttribute('aria-pressed', 'false');
  });

  it('버튼 클릭 시 onChange를 호출해야 합니다.', () => {
    const onChange = jest.fn();
    render(<PeriodFilter value="1w" onChange={onChange} />);

    fireEvent.click(screen.getByTestId('period-filter-3m'));
    expect(onChange).toHaveBeenCalledWith('3m');
  });
});
