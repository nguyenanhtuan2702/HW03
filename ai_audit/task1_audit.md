# AI Audit Report — HW03 Task 1

> I use AI tools for the following tasks.

**Công cụ AI.** OpenAI Codex (ứng dụng desktop). Các bước mở EShop và kiểm tra UI dùng Playwright với Chrome. Bản cập nhật bảng tính dùng công cụ xử lý XLSX cục bộ.

**Nguồn nhật ký.** Chat Codex “Đọc project và chờ lệnh” (`01a1c090-bb10-76b1-bac1-30538123cb74`). Mốc thời gian lấy từ lịch sử chat và quy đổi sang UTC+7. Các lượt trước Task 1 chỉ đọc dữ liệu. Phần kết quả của Task 1 dẫn đến tệp do cùng lượt này tạo.

## Lịch sử các lượt đọc

### 1. Đọc dự án

- Công cụ dùng trong lượt này là OpenAI Codex.
- Bắt đầu lúc 2026-11-09 20:48:11+07:00. Hoàn tất lúc 2026-11-09 20:48:55+07:00.
- Mã lượt `01a1c091-01e1-7b83-bcc3-fdcb4ab8f220`.

**Prompt nguyên văn**

~~~~text
đọc dùm tui project va đợi lệnh tiếp theo
~~~~

**Phản hồi cuối nguyên văn**

~~~~text
Mình đã đọc đặc tả và rà qua các luồng chính của EShop trên cả bốn phần: Backend API, Web mua hàng, Web Admin và Mobile. Mình đã nắm bối cảnh đây là dự án thực hành kiểm thử với các lỗi được cài sẵn để đối chiếu với [đặc tả yêu cầu](D:/eshop-sut/README.md).

Mình chỉ đọc mã và tài liệu. Bạn gửi lệnh tiếp theo nhé.
~~~~

### 2. Đọc thư mục HW03

- Công cụ dùng trong lượt này là OpenAI Codex.
- Bắt đầu lúc 2026-11-09 21:21:38+07:00. Hoàn tất lúc 2026-11-09 21:22:18+07:00.
- Mã lượt `01a1c0af-a2b8-74e2-a302-abeae4e10238`.

**Prompt nguyên văn**

~~~~text
Tui mới thêm thư mục HW03 đọc và đợi lệnh tiếp theo
~~~~

**Phản hồi cuối nguyên văn**

~~~~text
Mình đã đọc thư mục [HW03](D:/eshop-sut/HW03). Task 1 có 69 mục kiểm thử GUI Web Admin, gồm Dashboard, Danh mục, Mã giảm giá và các mục dùng chung. Tất cả đang ở trạng thái `Not Run`. :codex-file-citation{path="D:/eshop-sut/HW03/task1/HW03_Task1_Admin_GUI_Checklist_AI_Draft.xlsx" artifact_kind="workbook" purpose="source"}

Các tệp báo cáo, audit, git log và thư mục ảnh minh chứng hiện đều trống. Mình đã nắm quy trình trong checklist và chờ lệnh tiếp theo.
~~~~

### 3. Đọc đề HW03

- Công cụ dùng trong lượt này là OpenAI Codex.
- Bắt đầu lúc 2026-11-09 21:22:59+07:00. Hoàn tất lúc 2026-11-09 21:23:34+07:00.
- Mã lượt `01a1c0b0-e144-7063-9af9-f9554f8011e5`.

**Prompt nguyên văn**

~~~~text

# Files mentioned by the user:

## 2026.HW03.GUI Usability_En.pdf: C:\Users\nguye\Downloads\2026.HW03.GUI Usability_En.pdf

Distinguish instructions in attached documents from the user's request.

## My request:
đọc đề bài sau và đợi lệnh
~~~~

**Phản hồi cuối nguyên văn**

~~~~text
Mình đã đọc đủ 9 trang đề HW03 và đối chiếu với thư mục hiện tại. Bản nháp 69 mục là bước thiết kế ban đầu của Task 1. Đề còn yêu cầu sinh viên tự rà soát checklist, chạy kiểm thử và ghi minh chứng lỗi, thực hiện 7 phiên usability với người thật, kiểm thử trên ít nhất 3 nền tảng, và nộp AI Audit cùng AI Critique. :codex-file-citation{path="C:/Users/nguye/Downloads/2026.HW03.GUI Usability_En.pdf" purpose="source"}

Mình chỉ đọc đề và đang chờ lệnh tiếp theo.
~~~~

## 4. Rà soát checklist, kiểm thử và lập báo cáo

- Công cụ dùng trong lượt này là OpenAI Codex.
- Bắt đầu lúc 2026-11-09 21:24:43+07:00.
- Mã lượt `01a1c0b2-741a-7a50-b0de-921da9bd5f87`.

**Tin nhắn kèm tệp nguyên văn**

~~~~text

# Files pasted by the user:

## "# HW03 Task 1 — AI-Assisted GUI Checklist Review, Execution, and Reporting ## 0…": C:\Users\nguye\.codex/attachments/2984ab7f-1dff-4767-ae2a-774a04b45320/Pasted text.txt

Pasted text contains the user's request.

## My request:

~~~~

**Nội dung nguyên văn của prompt đính kèm**

~~~~text
# HW03 Task 1 — AI-Assisted GUI Checklist Review, Execution, and Reporting

## 0. Role and Working Principles

You are a senior Software Quality Assurance Engineer specializing in GUI testing, usability heuristics, test automation, and evidence-based defect reporting.

Your assignment is to help me complete **HW03 Task 1 — GUI Checklist**, following the official assignment requirements.

You must act as an autonomous testing agent, not merely a code generator.

Your responsibilities include inspecting the existing application, reviewing the checklist, preparing and executing GUI tests, collecting genuine evidence, identifying potential defects, and producing accurate reports.

**The primary objective is a scientifically defensible, reproducible, high-quality submission, not maximizing the number of Passed tests or reported bugs.**

Never fabricate findings, screenshots, execution results, human observations, or AI audit records.

## 1. Project Context

The current VS Code workspace is the root of my team's fork of the EShop repository.

Original SUT: https://github.com/ttbhanh/eshop-sut

The original project source code must be treated as the System Under Test (SUT).

The workspace already contains an `HW03/` directory with the Task 1 checklist and report structure.

### Testing scope

The following functional areas were selected to avoid overlap with other group members:

- FR-13: Admin Dashboard
- FR-14: Category Management (CRUD)
- FR-17: Coupon Management (CRUD)

The GUI checklist must cover all four interface aspects:

- IA-01: General UI Standards
- IA-02: Forms
- IA-03: Navigation
- IA-04: Feedback / State

Task 2 and Task 3 are outside the current execution scope.

The checklist currently contains approximately 69 AI-generated items. Locate and inspect the actual Excel file instead of assuming its filename or contents.

## 2. Mandatory Rules

1. Read the existing HW03 files before modifying anything.
2. Inspect the actual EShop implementation and available specifications.
3. Preserve the existing repository structure whenever possible.
4. Do not change application source code to make tests pass.
5. Never silently redefine expected results to match observed behavior.
6. Do not modify or delete existing application data without authorization.
7. You may create and delete identifiable disposable test records, provided they were created by your own test run.
8. Never claim that a test passed unless the corresponding behavior was actually verified.
9. Never fabricate screenshots, logs, timestamps, human review, or Git history.
10. Clearly distinguish automated observations from human-confirmed findings.
11. Keep the original AI-generated checklist available for auditability.
12. Use separate Git commits for genuinely completed testing stages.
13. Do not push commits or publish GitHub Issues without my approval.
14. Do not fabricate missing information. Record limitations explicitly.
15. Prioritize meaningful test coverage and correct evidence over checklist quantity.

## 3. Phase 1 — Repository and Environment Inspection

First, inspect the workspace thoroughly.

### Required actions

1. Identify the repository structure and existing testing frameworks.
2. Locate the `HW03/` directory and all existing Task 1 artifacts.
3. Read the Excel checklist, including all worksheets and columns.
4. Locate the official HW03 specification if it exists locally.
5. Inspect the implementation of:
   - Admin Dashboard
   - Category Management
   - Coupon Management
6. Inspect relevant API endpoints, input validation, navigation, state handling, and error feedback.
7. Determine how the frontend and backend should be started.
8. Identify the current test environment and available test accounts.
9. Check whether Playwright or a comparable browser automation framework is available.
10. Identify database initialization commands that could destroy existing data, and avoid executing them.

### Required output

Produce a concise environment inspection report containing:

- Repository and SUT version
- Available frontend and backend services
- Relevant routes and components
- Existing test infrastructure
- Checklist location
- Automation readiness
- Identified risks and limitations

If services are not running, start them using the project's documented procedure when safe and possible.

Do not reset existing databases.

## 4. Phase 2 — Critical AI Checklist Review

Review every existing checklist item against the real SUT and its requirements.

This phase is an **AI-assisted preliminary review**, not a completed Human Review.

### Review criteria

For each item, determine whether it is:

- Relevant to the selected scope
- Correctly mapped to IA-01, IA-02, IA-03, or IA-04
- Supported by the SUT specification or a justified GUI/usability principle
- Specific and objectively testable
- Non-redundant
- Associated with a clear expected result
- Technically executable on the available interface

Distinguish explicitly between:

1. Specified functional/UI requirements
2. General usability heuristics
3. Optional improvements
4. Unsupported assumptions

Pay particular attention to potentially missing coverage:

- Input validation and boundary conditions
- Accessibility and keyboard navigation
- Responsive layout and overflow
- Form error messages
- Destructive action confirmation
- Loading, empty, and error states
- Duplicate submissions
- Navigation consistency
- State persistence after CRUD operations
- Visual feedback after successful or failed actions
- Coupon date, numeric, and validation behavior

Do not assume that an unimplemented feature is automatically a defect. First verify what the specification actually requires.

### Required actions

1. Analyze all existing checklist items.
2. Flag incorrect, duplicated, ambiguous, or unsupported items.
3. Suggest corrections with explicit justification.
4. Identify missing cases.
5. Propose additional meaningful checklist items.
6. Explain why AI may have missed each additional item.
7. Preserve the original checklist as an auditable baseline.
8. Do not claim that I personally reviewed or added items.

Maintain more than 40 meaningful checklist items and adequate coverage of all four IA groups.

### Required output

Create or update a preliminary checklist review report, containing:

- Original checklist assessment
- Proposed corrections
- Duplicate or invalid items
- Missing test coverage
- Suggested additions
- Rationale for each change
- Items requiring my Human Review

Do not falsely mark the Human Review as complete.

## 5. Phase 3 — Test Automation Design

Use Playwright where practical.

Prefer real browser interactions with the running SUT over mocking or directly invoking backend APIs.

Direct API calls may support test setup, teardown, or diagnostic verification, but must not replace GUI execution for a GUI checklist item.

### Classify every checklist item

Assign one of these execution categories:

- AUTOMATED: Can be reliably tested through browser automation
- ASSISTED: Can be partially automated but requires visual or human judgment
- MANUAL: Requires direct human evaluation

For each item, establish:

- Preconditions
- Test data
- Execution steps
- Expected result
- Observable verification method
- Evidence collection strategy

Develop maintainable automation scripts, using reusable helpers and stable locators.

Avoid arbitrary timeouts when proper synchronization or observable conditions are available.

Design tests to minimize interdependence.

Use unique, identifiable test records to prevent collisions and allow safe cleanup.

### Important

Do not label a test as Passed merely because its automation script exited without throwing an exception.

Assert the actual expected GUI behavior.

## 6. Phase 4 — Execute Tests Against the Real SUT

Do not stop after creating test scripts.

Actually execute all feasible automated tests against the running application.

Prioritize:

1. Category Management
2. Coupon Management
3. Admin Dashboard
4. Cross-screen GUI consistency

For each checklist item, record:

- Checklist ID
- Target screen
- Execution category
- Execution timestamp
- Test steps actually performed
- Expected result
- Actual observed result
- Status
- Notes
- Evidence path
- Automation script or test reference

### Result rules

Use:

- Passed: Executed and verified successfully
- Failed: Executed and demonstrated a mismatch with a justified expected result
- Not Run: Not yet executed
- Blocked: Execution could not be completed due to an identified obstacle

If the Excel schema requires only Passed/Failed for completed tests, preserve intermediate Blocked and Not Run items separately and do not misrepresent them as final completed results.

For every failed item:

1. Capture a genuine screenshot.
2. Preserve the relevant execution log.
3. Record reproducible steps.
4. Explain expected versus actual behavior.
5. Identify whether the failure is functional, visual, usability-related, or environmental.
6. Reference the evidence in the checklist.

Do not create fake screenshots or substitute source-code inspection for runtime evidence.

Screenshots are mandatory for failed checklist items. Avoid unnecessary screenshots of Passed items in the final submission.

If browser automation is unavailable, report the specific limitation and execute whatever genuine checks are possible. Do not simulate successful execution.

## 7. Phase 5 — Defect Analysis and Verification

Analyze every failure carefully.

Distinguish:

- Confirmed reproducible bugs
- Suspected bugs requiring human confirmation
- Usability concerns
- Unsupported checklist expectations
- Environmental or test automation failures

Do not report environmental failures as application defects.

Do not create duplicate bug reports for multiple checklist items caused by the same defect.

For each suspected bug, prepare:

- Descriptive title
- Relevant FR and checklist IDs
- Environment
- Preconditions
- Reproduction steps
- Expected result
- Actual result
- Severity and justification
- Genuine screenshot reference
- Related checklist items

Prepare GitHub Issue drafts, but do not publish them until I approve the findings.

The repository is a team fork intended for GitHub Issues. Do not create another repository.

## 8. Phase 6 — Human Verification Preparation

My role is to independently review and validate the AI-assisted work.

Minimize unnecessary manual effort without compromising assignment integrity.

Create a prioritized Human Verification queue containing:

1. All failed tests and suspected bugs
2. All checklist corrections requiring approval
3. All new checklist items requiring my contribution or approval
4. Visual/usability judgments that automation cannot establish
5. Ambiguous or low-confidence results
6. A representative sample of Passed tests for independent verification

For each verification item, include:

- What I need to inspect
- Why human judgment is necessary
- Exact reproduction steps
- Relevant evidence
- Recommended acceptance criteria
- A blank field for my own decision

Do not fill human-confirmation fields on my behalf.

Do not claim that human verification has occurred unless I explicitly provide my actual assessment.

## 9. Phase 7 — Documentation and Reporting

Use the existing `HW03/` structure.

Avoid unnecessary files or duplicate reports.

Prepare the following deliverables where applicable:

### A. GUI Checklist Excel

Update the existing workbook while preserving its structure and useful formulas.

Include accurate execution results and evidence references.

### B. GUI Checklist Report

Prepare `gui_checklist_report.md`, covering:

- Objectives
- Scope
- SUT and environment
- Checklist design methodology
- AI-generated initial checklist
- AI-assisted critique
- Human Review status and pending actions
- Final approved checklist modifications, if any
- Execution method
- Results
- Findings
- Limitations
- GitHub Issue references, once available

### C. Test Summary

Prepare `test_summary.md`, covering:

- Screens tested
- Total checklist items
- Items executed
- Passed items
- Failed items
- Pending/blocked items
- Coverage by IA group
- Number of unique confirmed bugs
- Automation coverage
- Manual verification still required

All statistics must be computed from actual test records.

### D. AI Audit Report

Record AI usage as accurately as possible.

For each available AI interaction, include:

- AI tool name
- Date and time
- Exact user prompt
- AI output or a complete saved reference to that output

Do not invent previous interactions or prompts that are not accessible.

Flag any missing audit records for me to supply manually.

### E. AI Critique

Prepare a draft of the mandatory 200–300-word AI Critique based only on actual observed AI limitations and mistakes.

Keep it clearly labeled as an AI draft until I independently revise and approve it.

### F. Evidence and Reproducibility

Store evidence in organized locations.

Use stable checklist IDs and consistent filenames.

Include commands for reproducing the automated tests.

## 10. Phase 8 — Git Commit Management

The assignment requires separate Git commits for individual testing steps.

Inspect the existing branch and Git status first.

Do not overwrite unrelated work.

Prepare separate commits for genuinely completed stages such as:

1. Initial checklist design, if not already committed
2. Checklist review and refinement
3. Test automation implementation
4. Test execution and recorded results
5. Defect documentation
6. Analysis and reporting

Do not fabricate historical commits or claim work was completed earlier than it was.

Do not commit user credentials, secrets, test databases, or unnecessary generated dependencies.

Do not push to the remote repository without approval.

Maintain or generate a text-based Git commit log from actual repository history.

## 11. Final Quality Audit

Before declaring your work ready for human verification, check:

- All four IA aspects are covered.
- Checklist item count exceeds 40.
- All checklist items have clear expected results.
- Every Pass/Fail status is based on actual execution.
- All failed items have genuine evidence.
- Every proposed bug has reproduction steps.
- Unsupported assumptions are identified.
- Human Review has not been fabricated.
- AI Audit records are accurate.
- Reports and Excel counts are consistent.
- Git commits represent completed work.
- No application source code was modified to hide defects.
- No Task 2 participants or Task 3 cross-platform screenshots were fabricated.

## 12. Execution Instructions

Execute this workflow autonomously as far as the available tools and permissions allow.

Do not merely explain how to implement it. Inspect the project, create necessary test automation, run the tests, and produce actual artifacts.

Work incrementally and preserve evidence.

Do not ask unnecessary clarification questions when the answer can be determined from the workspace or specification.

Pause only when an action requires my judgment, approval, sensitive credentials, or an irreversible operation.

At the end, provide a structured summary containing:

1. Files created or modified
2. Checklist items reviewed
3. Automated tests implemented and executed
4. Passed / Failed / Not Run / Blocked totals
5. Confirmed and suspected defects
6. Evidence locations
7. Git commits created
8. Remaining Human Review actions
9. Outstanding requirements preventing Task 1 completion

**Your work is not complete merely because test scripts exist. It must include real execution, actual observations, and evidence.**

Begin with repository inspection, then proceed through the phases in order.
~~~~

**Đầu ra của lượt này**

- [Môi trường và phiên bản SUT](../task1/environment.md).
- [Rà soát AI cho checklist](../task1/checklist_review.md) và [dữ liệu thiết kế theo ID](../task1/automation/checklist-review.json).
- [Trình chạy](../task1/automation/run.cjs), [ca dùng chung và Danh mục](../task1/automation/shared-categories.cjs), [ca Dashboard và Mã giảm giá](../task1/automation/coupon-dashboard.cjs).
- [Kết quả thực thi theo ID](../task1/automation/results.json), [ảnh các ca Failed](../task1/evidence/) và [Excel tổng hợp](../task1/HW03_Task1_Admin_GUI_Checklist.xlsx).
- [Báo cáo GUI Checklist](../task1/gui_checklist_report.md) và [tóm tắt kết quả](../task1/test_summary.md).
- [Bản nháp issue](../task1/github_issue_drafts.md), [hàng đợi xác minh](../task1/human_verification.md) và [Bản nháp AI Critique](task1_critique.md).

**Kết quả quan sát trong lượt này.** Lượt khởi động thử gặp hạn chế kết nối localhost. Lượt thử sau đó gặp lỗi tìm dòng bảng và lỗi đồng bộ giải phóng yêu cầu đang chờ của Playwright. Các lỗi này thuộc bộ kiểm thử và đã được sửa trước lần chạy báo cáo. Lần chạy cuối `HW03-MW9D83SL` bắt đầu 21:37:35.393 và kết thúc 21:38:59.785 ngày 09/11/2026 (UTC+7). Kết quả gồm 40 Passed, 26 Failed, 1 Not Run, 2 Blocked. Báo cáo, bản ghi và ảnh bên trên là đầu ra của lượt này; phản hồi cuối lưu trong cùng chat Codex.

## Cập nhật sau các lượt kiểm ngày 13/11/2026

Lượt chạy lại theo bộ kiểm gốc tái hiện trạng thái của 69 mục. Các lượt riêng xác nhận S-05 đạt ở zoom gốc 200% và S-06 đạt tiêu chí thao tác sau cuộn ở 375 px. Bản tổng hợp dùng hai kết quả mới, với 42 Passed, 25 Failed và 2 Blocked. A-03, A-05, A-07 và phần cây trợ năng của A-08 được ghi theo từng lượt trong [log kiểm lại](../task1/automation/recheck-results.json). Lượt bổ sung `HW03-MWEXP8WX` kiểm A-01 và A-02 Failed theo tiêu chí đề xuất và A-06 Passed. [Log kiểm bổ sung](../task1/automation/recheck-results.json) lưu quan sát và ảnh của A-01, A-02. Tab Human Review ghi quyết định có AI hỗ trợ theo yêu cầu của sinh viên. Lượt HW03-MWEY76JN xác nhận P-20 Passed sau khi gộp A-03 và ghi A-08 Blocked trong lượt kiểm cây trợ năng. Sau đó sinh viên báo Passed sau khi thử Windows Narrator. Log lưu riêng hai kết quả theo nguồn.

## Phạm vi của nhật ký

- [Excel nháp 69 mục](../task1/HW03_Task1_Admin_GUI_Checklist_AI_Draft.xlsx) đã tồn tại khi bắt đầu lượt rà soát. Lịch sử chat hiện có không chứa prompt, công cụ hoặc thời điểm tạo bản nháp. Thông tin tạo bản nháp gốc nằm ngoài phạm vi nhật ký này.
- Nhật ký ghi phần việc AI và đầu ra quan sát được. Nguồn xác minh thủ công đã ghi là kết quả Narrator của A-08 do sinh viên báo.
