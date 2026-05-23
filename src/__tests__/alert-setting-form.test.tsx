import { render, screen, fireEvent } from "@testing-library/react"
import { AlertSettingForm } from "@/components/alert-setting-form"

// Mock Toast Hook
jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}))

/**
 * @fileOverview AlertSettingForm 컴포넌트 기능 및 접근성 테스트
 */
describe("AlertSettingForm Component", () => {
  const mockOnSave = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Happy Path (정상 렌더링)", () => {
    it("슬라이더와 입력 필드가 기본값(5%, 5회)으로 렌더링되어야 합니다.", () => {
      render(<AlertSettingForm />)
      
      // 현재 설정 텍스트 확인
      expect(screen.getByText(/현재 설정: 당일 -5% 손실 시 제한/i)).toBeInTheDocument()
      // 입력 필드 기본값 확인
      expect(screen.getByLabelText(/매매횟수 상한 입력/i)).toHaveValue(5)
      // 단위(회) 확인
      expect(screen.getByText("회")).toBeInTheDocument()
    })

    it("슬라이더의 최소/최대 범위 가이드가 표시되어야 합니다.", () => {
      render(<AlertSettingForm />)
      expect(screen.getByText(/최소 1%/i)).toBeInTheDocument()
      expect(screen.getByText(/최대 20%/i)).toBeInTheDocument()
    })
  })

  describe("Edge States (상태별 피드백)", () => {
    it("isLoading이 true일 경우 스켈레톤 UI를 표시해야 합니다.", () => {
      render(<AlertSettingForm isLoading={true} />)
      // 실제 폼 타이틀이 없어야 함 (스켈레톤 상태)
      expect(screen.queryByText(/알람 설정/i)).not.toBeInTheDocument()
    })

    it("isError가 true일 경우 에러 알림 배너를 표시해야 합니다.", () => {
      render(<AlertSettingForm isError={true} />)
      expect(screen.getByText(/오류 발생/i)).toBeInTheDocument()
      expect(screen.getByText(/서버 설정 로드 중 문제가 발생했습니다/i)).toBeInTheDocument()
    })

    it("입력 필드에 0을 입력하면 에러 메시지가 표시되고 버튼이 비활성화되어야 합니다.", () => {
      render(<AlertSettingForm />)
      const input = screen.getByLabelText(/매매횟수 상한 입력/i)
      const saveButton = screen.getByRole("button", { name: /설정 저장/i })

      fireEvent.change(input, { target: { value: "0" } })
      
      expect(screen.getByText(/⚠ 매매 횟수는 최소 1회 이상 입력해야 합니다./i)).toBeInTheDocument()
      expect(saveButton).toBeDisabled()
    })

    it("입력 필드에 음수를 입력하면 에러 메시지가 표시되어야 합니다.", () => {
      render(<AlertSettingForm />)
      const input = screen.getByLabelText(/매매횟수 상한 입력/i)
      fireEvent.change(input, { target: { value: "-1" } })
      expect(screen.getByText(/⚠ 매매 횟수는 최소 1회 이상 입력해야 합니다./i)).toBeInTheDocument()
    })

    it("입력 필드가 비어있으면 저장 버튼이 비활성화되어야 합니다.", () => {
      render(<AlertSettingForm />)
      const input = screen.getByLabelText(/매매횟수 상한 입력/i)
      fireEvent.change(input, { target: { value: "" } })
      const saveButton = screen.getByRole("button", { name: /설정 저장/i })
      expect(saveButton).toBeDisabled()
    })
  })

  describe("Accessibility (접근성)", () => {
    it("입력 필드에 적절한 htmlFor/id 가 연결되어 있어야 합니다.", () => {
      render(<AlertSettingForm />)
      const label = screen.getByText(/매매횟수 상한/i)
      const input = screen.getByLabelText(/매매횟수 상한 입력/i)
      expect(label).toHaveAttribute("for", input.id)
    })

    it("슬라이더에 스크린 리더를 위한 aria-label이 설정되어 있어야 합니다.", () => {
      render(<AlertSettingForm />)
      const slider = screen.getByLabelText(/손실폭 설정 슬라이더/i)
      expect(slider).toBeInTheDocument()
    })
  })
})
