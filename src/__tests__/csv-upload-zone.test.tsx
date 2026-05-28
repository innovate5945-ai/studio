// @file src/__tests__/csv-upload-zone.test.tsx
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { CsvUploadZone } from '@/components/upload/csv-upload-zone';
import { processCsvUpload } from '@/actions/csv-upload';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('@/actions/csv-upload', () => ({
  processCsvUpload: jest.fn(),
}));

const mockProcessCsvUpload = processCsvUpload as jest.MockedFunction<typeof processCsvUpload>;

function createFile(name: string, type: string, content = 'date,symbol') {
  return new File([content], name, { type });
}

/**
 * @fileOverview [UI-CSV-001] CsvUploadZone 테스트
 */
describe('CsvUploadZone', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockProcessCsvUpload.mockResolvedValue({
      success: true,
      tradeCount: 142,
      assetCount: 3,
      fileName: 'trades.csv',
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('점선 테두리 드롭존을 렌더링해야 합니다.', () => {
    render(<CsvUploadZone />);

    const dropZone = screen.getByTestId('csv-drop-zone');
    expect(dropZone).toHaveClass('border-dashed');
    expect(dropZone).toHaveClass('border-white/10');
  });

  it('Drag Over 시 테두리 색상이 primary로 변경되어야 합니다.', () => {
    render(<CsvUploadZone />);

    const dropZone = screen.getByTestId('csv-drop-zone');
    fireEvent.dragEnter(dropZone);

    expect(dropZone).toHaveClass('border-primary');
    expect(dropZone).toHaveClass('bg-primary/10');
  });

  it('xlsx 업로드 시 인라인 에러를 표시해야 합니다.', () => {
    render(<CsvUploadZone />);

    const input = screen.getByTestId('csv-file-input');
    const invalidFile = createFile(
      'report.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    fireEvent.change(input, { target: { files: [invalidFile] } });

    expect(screen.getByTestId('csv-upload-error')).toBeInTheDocument();
    expect(screen.getByText(/Excel 파일\(\.xlsx\)/i)).toBeInTheDocument();
  });

  it('CSV 선택 시 프로그레스 바 시뮬레이션이 시작되어야 합니다.', async () => {
    render(<CsvUploadZone />);

    const input = screen.getByTestId('csv-file-input');
    const csvFile = createFile('trades.csv', 'text/csv');

    fireEvent.change(input, { target: { files: [csvFile] } });

    expect(screen.getByTestId('csv-upload-progress')).toBeInTheDocument();
    expect(screen.getByText(/0%/)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByText(/20%/)).toBeInTheDocument();
  });

  it('업로드 완료 시 성공 모달을 표시해야 합니다.', async () => {
    render(<CsvUploadZone />);

    const input = screen.getByTestId('csv-file-input');
    const csvFile = createFile('trades.csv', 'text/csv');

    fireEvent.change(input, { target: { files: [csvFile] } });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockProcessCsvUpload).toHaveBeenCalledWith({
        fileName: 'trades.csv',
        fileSize: csvFile.size,
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('csv-success-dialog')).toBeInTheDocument();
      expect(screen.getByText(/Import Successful/i)).toBeInTheDocument();
      expect(screen.getByText(/142/)).toBeInTheDocument();
    });
  });
});
