# AI Audit · HW03 Task 3

I use AI tools for the following tasks.

- **Công cụ:** OpenAI Codex desktop, Playwright, PowerShell, công cụ xuất Excel và GitHub CLI để đối chiếu issue hiện có.
- **Thời điểm:** 14/11/2026, UTC+7. Giờ bắt đầu và kết thúc từng lượt có trong JSON của trình chạy.
- **Đầu ra thực tế:** Đối chiếu Excel cuối của Task 1, trích SUT theo commit, chạy GUI cách ly, thu ảnh thật, phân loại chênh lệch giữa trình duyệt, tạo ma trận và báo cáo. Kiểm tra đăng nhập Web Admin qua proxy cục bộ để chuẩn bị phiên Safari. Những phép thử chưa có kết quả giữ trạng thái Not Run hoặc Blocked.
- **Xác nhận của sinh viên:** Sinh viên cung cấp danh tính để đặt overlay trực tiếp trên phiên kiểm thử và cho biết lựa chọn Safari qua BrowserStack hoặc LambdaTest. Nhật ký không lưu thông tin đăng nhập cloud.
- **Nguồn kiểm tra:** [Kế hoạch](test_plan.md), [môi trường](environment_matrix.md), [kết quả](test_summary.md) và các JSON trong [automation](automation/).

## Xác minh khả năng chạy Safari với Sauce Labs · 14/11/2026

- **Yêu cầu cập nhật:** Sau khi duyệt kế hoạch, sinh viên yêu cầu ưu tiên một smoke test Safari/macOS thật qua Sauce Labs Automated tại `eu-central`, tunnel `hw03-task3`. Kiểm tra đăng nhập, dữ liệu, hình ảnh và job ID trước khi quyết định triển khai adapter.
- **Công cụ:** Codex, PowerShell, Node.js, Selenium WebDriver, Sauce Connect và log HTTP tối thiểu từ bản sao EShop. Dòng log tunnel do sinh viên cung cấp ghi Ready lúc 14:48:28 UTC+7. Runner kiểm lại `is_ready` từ Sauce khi xác thực được.
- **Kiểm tra cục bộ:** Web Admin dựng từ commit gốc trên cổng 8080 và proxy `/api/categories` trả HTTP 200 với đủ ba danh mục fixture. Kết quả tại [log chuẩn bị](automation/sauce-smoke-HW03-MWG4OKQW.json). Lượt này chỉ xác nhận môi trường cục bộ. Các job Safari thật có log riêng.
- **Lượt Sauce đầu:** API xác nhận tunnel Ready. Job `690fb1970f804f1590b71b6f33df8b26` tạo Safari 18.3 trên macOS 14.6 sau khoảng 33 giây. Không quan sát được form đăng nhập tại `http://localhost:8080`. Phiên đã đóng, chưa có ảnh SUT từ Safari và chưa có ca checklist được chấm. [Log smoke test](automation/sauce-smoke-HW03-MWG4Q3MZ.json).
- **Điều chỉnh chẩn đoán:** Cho phép thử có điều kiện `http://localtest.me:8080` trong cùng tunnel sau khi xác minh DNS chỉ trả loopback. Runner thử `localhost:8080` trước, ghi URL thực và không cộng smoke test vào checklist. [Hướng dẫn Sauce Labs](https://docs.saucelabs.com/secure-connections/sauce-connect-5/guides/localhost-proxying/).
- **Lượt Sauce thứ hai:** Job `71be65571f2042e5b7db41e19c2efd3d` tạo được Safari 18.3 trên macOS 14.6. Cả hai URL trong lượt này chưa hiển thị form. Log Sauce Connect do sinh viên cung cấp báo DNS `192.168.1.1:53` không phân giải được `localhost` khi proxy request Web Admin. [Log smoke test](automation/sauce-smoke-HW03-MWG58LSC.json).
- **Sửa đường vào Safari:** Dùng `http://localtest.me:8080` cho Safari. Kiểm tra cục bộ xác nhận tên này phân giải `127.0.0.1`, Vite chấp nhận hostname và cả HTML, JavaScript, API danh mục trả HTTP 200. Runner yêu cầu thêm phép kiểm qua proxy debug của Sauce Connect trước khi mở job mới. [Log kiểm cục bộ](automation/sauce-smoke-HW03-MWG5H2UG.json).
- **Smoke test đạt lúc 15:39:02 UTC+7:** Job `bfeaf87fe1ca4ad5b2d70804cb49569d` chạy Safari 18.3 trên macOS 14.6. Proxy chẩn đoán trả HTTP 200. Safari đăng nhập qua `http://localtest.me:8080`, thấy Dashboard có một đơn và Danh mục có ba hàng. Backend ghi HTTP 200 cho login, orders và categories. Probe `/api/v1/healthz` dùng `localhost` tiếp tục báo lỗi DNS trong terminal Sauce Connect, trong khi toàn bộ phép kiểm EShop của job đã đạt. [Log smoke test](automation/sauce-smoke-HW03-MWG5L5L2.json).
- **Rà minh chứng:** Xem ảnh WebDriver và video gốc Sauce. Trích nguyên khung hình giây 39,35 từ video 1440 × 900, không sửa nội dung. Hình có thanh địa chỉ Safari, giao diện Danh mục, họ tên, MSSV, email và overlay môi trường khớp metadata. Đây là minh chứng smoke test. Checklist Safari vẫn chưa thực thi. Khung hình từ video (hồ sơ Moodle).

## Thực thi checklist Safari · 14/11/2026

- **Yêu cầu tiếp theo:** Sinh viên chấp thuận phương án A, dùng job smoke hiện có làm bằng chứng hạ tầng và triển khai đủ 70 ID qua Safari thật, giữ nguyên kỳ vọng Task 1.
- **Codex / Selenium / Sauce Connect:** Viết adapter dùng lại các hàm đọc trạng thái GUI, oracle và fixture hiện có. Kiểm thử adapter với ChromeDriver cục bộ trước khi dùng phút Trial. Các kết quả chẩn đoán cục bộ được tách khỏi kết quả Safari.
- **Lượt Safari thực:** Job [d857a88ec8e34180979511249d9ad963](automation/safari-apple-HW03-MWG642BV.json) chạy 43 ID Shared, Dashboard và Categories trước khi chạm ngưỡng dừng. Job [4c0a2ccc22474141b16e786d3235ff89](automation/safari-apple-HW03-MWG6ER88.json) tiếp tục 26 ID Coupon. Mỗi ca ghi JSON và ảnh ngay sau khi chấm. S-05 cần zoom gốc và minh chứng Menu Safari.
- **Cách chấm các ca đặc biệt:** Ghi nhận C-16/C-20 bị proxy Sauce chuyển lỗi ngắt socket thành HTTP 5xx ở lượt đầu, giữ Blocked. C-18/P-23 thiếu hộp thoại Hủy. Chênh lệch bàn phím được ghi để xác minh thiết lập Safari trước khi xếp thành lỗi tương thích mới. Ảnh định danh chỉ lưu trong hồ sơ nộp.
- **Lượt kiểm lại lúc 20:15 UTC+7:** Job `0d6aefc38bdf46078cebad2c73bc855c` quan sát C-16 Failed, C-20 Passed và S-06 Blocked vì hết thời gian chờ dữ liệu. Đã rà ảnh, xác nhận email trong overlay bị nhập nhầm. Giữ hồ sơ gốc để truy vết và loại lượt này khỏi ma trận nộp bài. Sinh viên đã xác nhận email đúng trước lượt chụp lại. [Log gốc](automation/safari-apple-HW03-MWGFHBWF.json) · [Quyết định rà minh chứng](automation/safari-evidence-review.json).
- **Lượt chụp lại lúc 20:18–20:19 UTC+7:** Job `ba7c0ecc1c22497b826118331715a170` chạy Safari 18.3 trên macOS 14.6. Đã kiểm bằng mắt ba ảnh gốc và xác nhận họ tên, MSSV, email khớp danh tính sinh viên. C-16 Failed vì phản hồi thêm không hướng dẫn cách khôi phục. C-20 Passed vì có thông báo lỗi và hàng vẫn còn. S-06 Blocked sau khi đã thêm, xem và xóa danh mục ở 375 CSS px, vì WebDriver dừng khi đi qua form Coupon. [Log và đường dẫn ảnh mới](automation/safari-apple-HW03-MWGFLFKB.json).
- **Lượt Safari Live, ảnh nhận lúc 21:00 UTC+7:** Sinh viên thao tác trong phiên Safari 18/macOS 14 và cung cấp ba ảnh được lưu nguyên byte. S-06 chuyển từ Blocked thành Failed vì form Mã Giảm Giá bị ép hẹp ở 375 × 812 CSS px, khiến sinh viên không hoàn tất tạo mã. Đối chiếu lời báo “C-05” với nội dung ảnh zoom và ghi quan sát Dashboard cho S-05. S-05 ghi Blocked vì mới có ảnh Dashboard, chưa xác minh mức 200% và thao tác ở hai màn còn lại. Số phiên bản phụ và job ID Live chưa thu được. [Log và ảnh Live](automation/safari-apple-HW03-MWGGKOQX-live.json).
- **Xác nhận bổ sung cho S-05:** Sinh viên báo đã kiểm thủ công zoom 200% trên Safari và Firefox, kết quả đều đạt. Ma trận chuyển hai kết quả sang Passed theo xác nhận này. Firefox không có ảnh của lượt kiểm. Ảnh Dashboard Safari không hiển thị mức zoom. Các log trước đó ghi lại đúng trạng thái tại thời điểm của từng lượt. [Safari](automation/safari-apple-S05-confirmation.json) · [Firefox](automation/firefox-windows-S05-confirmation.json).

## Prompt nguyên văn

~~~~markdown
# PROMPT CHO CODEX — HW03 TASK 3: CROSS-BROWSER / CROSS-PLATFORM TESTING

Bạn là Senior Software Test Engineer chuyên về GUI Testing, Cross-Browser Testing, Playwright và kiểm thử dựa trên đặc tả.

Tôi đang hoàn thành bài tập HW03 – GUI & Usability trên hệ thống EShop.

**Nhiệm vụ của bạn: Triển khai Task 3 hoàn chỉnh dựa trên toàn bộ kết quả Task 1 đã có, tự động hóa tối đa những bước hợp lệ và tạo đầy đủ minh chứng, bảng đối chiếu, báo cáo.**

Hãy chủ động đọc repository, lập kế hoạch, triển khai, thực thi, xác minh và hoàn thiện deliverables. Không dừng ở việc chỉ tạo kế hoạch hoặc viết test script.

## 1. BỐI CẢNH DỰ ÁN

- Workspace: `D:\eshop-sut`
- Repository: EShop fork.
- SUT baseline Task 1: commit `8f3059fbec0512cc8f04972afe6ca20411a98471`.
- Branch Task 1 đã ghi nhận: `main`. Hãy kiểm tra branch và HEAD hiện tại trước khi thực hiện.
- Phạm vi kiểm thử:
  - FR-13: Admin Dashboard.
  - FR-14: Category Management.
  - FR-17: Coupon Management.
- Bao phủ 4 nhóm:
  - IA-01: General UI standards.
  - IA-02: Forms.
  - IA-03: Navigation.
  - IA-04: Feedback / state.

**Thông tin Task 1:**

- 69 checklist ID gốc.
- 1 test case bổ sung C-22.
- Tổng 70 mục: 43 Passed, 25 Failed, 2 Blocked.
- Có các mục A-01–A-08 được xem xét riêng, không tự ý gộp tất cả vào thống kê 70 mục.
- Đã có script Playwright thực thi GUI, dữ liệu thử cách ly, log, ảnh và GitHub Issues.

Các tài liệu cần tìm và đọc đầy đủ:

1. `HW03/task1/HW03_Task1_Admin_GUI_Checklist.xlsx`
2. `HW03/task1/HW03_Task1_Admin_GUI_Checklist_AI_Draft.xlsx`
3. `HW03/task1/checklist_review.md`
4. `HW03/task1/environment.md`
5. `HW03/task1/gui_checklist_report.md`
6. `HW03/task1/human_verification.md`
7. `HW03/task1/github_issue_drafts.md`
8. `HW03/task1/test_summary.md`
9. `HW03/task1/automation/checklist-review.json`
10. `HW03/task1/automation/results.json`
11. `HW03/task1/automation/recheck-results.json`
12. `HW03/task1/automation/run.cjs`

Nếu đường dẫn khác thực tế, hãy tìm trong repository thay vì tự tạo tài liệu thay thế.

Ưu tiên Excel cuối cùng đã rà soát thay vì AI Draft. Không coi kết quả Chrome của Task 1 là kết quả trên các môi trường mới.

Đọc thêm `README.md`, `api_specification.md`, frontend/backend và file đề HW03 nếu có trong workspace.

## 2. YÊU CẦU CHÍNH XÁC CỦA TASK 3

Theo đề HW03:

- Perform Task 1 across at least three platforms.
- BrowserStack hoặc LambdaTest trial được ưu tiên mạnh.
- Có thể dùng cloud testing tool khác hoặc thiết bị vật lý thật nếu đáp ứng bằng chứng.
- Phủ Chrome, Firefox và Safari (hoặc Android Chrome).
- Có thể thay một môi trường bằng Expo Go trên điện thoại thật nếu kiểm thử mobile app thực tế.
- Screenshot phải thể hiện môi trường kiểm thử, URL của SUT và overlay student email.
- Quy định chống gian lận còn yêu cầu ảnh có student ID và full name.
- Toàn bộ chạy thử phải là thực nghiệm thật.

**Tuyệt đối không tự coi Chromium, Firefox và WebKit của Playwright là bằng chứng đủ ba nền tảng thật.** WebKit không đồng nghĩa với Safari thực tế.

### Chiến lược ưu tiên

1. Chrome trên Windows.
2. Firefox trên Windows.
3. Safari trên macOS/iOS thông qua BrowserStack hoặc LambdaTest, hoặc Android Chrome trên thiết bị thật.

Nếu có quyền truy cập cloud testing, hãy sử dụng cloud testing và Local Tunnel khi cần để truy cập SUT localhost.

Nếu không có tài khoản hoặc quyền truy cập phù hợp, vẫn triển khai và chạy các môi trường thực sự có sẵn; sau đó chuẩn bị hướng dẫn cụ thể để tôi hoàn thiện môi trường thứ ba.

Không giả vờ đã chạy một môi trường chưa truy cập được. Không tạo kết quả Passed cho môi trường chưa thử.

## 3. GIAI ĐOẠN A — AUDIT TASK 1 VÀ THIẾT KẾ TASK 3

Trước tiên:

1. Kiểm tra Git branch, HEAD và working tree.
2. Đọc toàn bộ dữ liệu Task 1.
3. Xác định số lượng ID, trạng thái và phạm vi thực tế.
4. Đánh giá khả năng tái sử dụng bộ Playwright.
5. Liệt kê những test chạy tự động được, những test cần kiểm tra bằng người hoặc công cụ riêng.
6. Kiểm tra các môi trường browser hiện có.
7. Kiểm tra khả năng sử dụng BrowserStack/LambdaTest nếu có cấu hình kết nối thực tế.
8. Xác định rủi ro làm thay đổi dữ liệu hoặc ghi đè bằng chứng.

Tạo `HW03/task3/test_plan.md` bao gồm:

- Objective.
- Scope.
- Browser/platform matrix.
- Test strategy.
- Test data and isolation.
- Entry/exit criteria.
- Evidence requirements.
- Risks and limitations.
- Traceability tới checklist Task 1.

Giữ nguyên các checklist ID gốc. Nếu một test chỉ thực hiện được trên một số môi trường, phải giải thích rõ.

Không tự sửa tiêu chí Expected Result nhằm làm tăng số lượng Passed.

## 4. GIAI ĐOẠN B — THIẾT LẬP MÔI TRƯỜNG AN TOÀN

Hãy kiểm tra chính xác cách chạy sandbox của Task 1 trước khi viết runner mới.

Cảnh báo quan trọng từ Task 1:

- `backend/database.js` có thể khởi tạo lại database ngay khi được nạp.
- Không chạy `node backend/database.js` trực tiếp.
- Không chạy backend gốc theo cách gây DROP/CREATE database chính.
- Không xóa hoặc reset dữ liệu của Task 1 và Task 2.
- Không động vào các phiên usability đang chạy.
- Không xóa `.remote-state` hoặc `running.lock` khi chưa kiểm tra tiến trình liên quan.

Ưu tiên tái sử dụng runner sao chép backend vào thư mục tạm và tạo SQLite độc lập.

Cho từng môi trường:

- Tạo hoặc khôi phục test fixture có kiểm soát.
- Dùng tài khoản Admin demo phù hợp với sandbox.
- Đảm bảo dữ liệu trước test có thể tái lập.
- Không làm thay đổi dữ liệu của môi trường khác.
- Giải phóng các tiến trình do runner tạo.
- Ghi log setup/teardown và lỗi nếu có.

Nếu có xung đột cổng, kiểm tra tiến trình trước; không kill hoặc xóa tùy tiện.

## 5. GIAI ĐOẠN C — THỰC THI CROSS-BROWSER TESTING

Thực hiện lại checklist Task 1 trong từng môi trường thực sự có sẵn.

### Đối với mỗi test case

Ghi lại:

- Checklist ID.
- Screen và IA group.
- Platform ID.
- Browser, browser version.
- OS, OS version và device.
- Preconditions/test data.
- Actual execution steps.
- Expected result.
- Actual result.
- Status: Passed / Failed / Blocked / Not Run / N/A.
- Thời điểm thực thi.
- Evidence path.
- Console/network error nếu liên quan.
- GitHub Issue URL nếu có.

Quy tắc:

- Chỉ đánh dấu Passed sau khi đã quan sát hoặc đối chiếu thực tế.
- Chỉ đánh dấu Failed khi có sai lệch so với oracle được áp dụng đúng.
- Blocked khi có trở ngại xác định.
- Not Run khi chưa có lần thử.
- N/A chỉ khi tiêu chí thật sự không áp dụng cho nền tảng, kèm lý do.

Không sao chép 43 Passed, 25 Failed từ Task 1 sang Firefox/Safari.

Không suy ra một test đạt chỉ vì chương trình không ném exception.

### Các nhóm cần chú ý

**IA-01:** Bố cục, font, màu sắc, độ tương phản, zoom 200%, viewport 375 CSS px, text clipping.

**IA-02:** Trường form, nhãn, validation, Unicode, numeric inputs, date input, Enter-to-submit, xử lý giá trị trống/âm/trùng.

**IA-03:** Chuyển Dashboard/Categories/Coupons, trạng thái active, keyboard tab order, focus visibility và focus recovery.

**IA-04:** Loading, kết nối mạng, phản hồi thành công/thất bại, cập nhật danh sách, duplicate submission, xóa và trạng thái sau reload.

Không thêm yêu cầu sửa danh mục qua GUI chỉ vì backend có API PUT: Task 1 đã xác định phạm vi UI thực tế là thêm, xem, xóa.

### Dữ liệu và oracle

- Ưu tiên sử dụng test fixture đã có.
- Với Dashboard, doanh thu phải được đối chiếu độc lập từ đơn delivered.
- Với Category/Coupon, kiểm tra UI thực tế.
- API chỉ dùng để chuẩn bị hoặc đối chiếu khi phù hợp.
- Không kết luận bằng cách chỉ gọi API.
- Không xóa dữ liệu không thuộc lượt test.

## 6. GIAI ĐOẠN D — BẰNG CHỨNG XÁC THỰC

Đây là phần quan trọng nhất.

Mỗi môi trường phải có bằng chứng cho thấy quá trình kiểm thử thực sự diễn ra trên browser/OS/device đó.

Tạo thư mục `HW03/task3/evidence/` và các thư mục con theo môi trường thực tế.

Ảnh minh chứng cần thể hiện:

- Giao diện EShop đang chạy thật.
- Browser/OS/device được sử dụng.
- Địa chỉ truy cập SUT.
- Student email hiển thị dưới dạng overlay theo đề.
- Student ID và full name theo yêu cầu chống gian lận.

Nếu chưa có student email, ID và full name được xác minh, hãy hỏi tôi trước khi tạo ảnh chính thức. Không tự suy đoán.

Ưu tiên ảnh chụp trực tiếp từ phiên kiểm thử và thể hiện cả chrome trình duyệt/địa chỉ cùng thông tin môi trường hoặc giao diện cloud testing.

Screenshot chỉ chụp viewport bằng Playwright không chứng minh đầy đủ browser/OS/device, nên phải bổ sung ảnh xác minh môi trường phù hợp.

Overlay phải hiện diện trong phiên thử thật khi chụp ảnh. Không được ghép, chỉnh sửa hoặc tạo screenshot giả sau khi chụp.

Đối với các test Failed, lưu screenshot thật và log liên quan. Đối với mỗi môi trường, cần ảnh định danh môi trường ngay cả khi không có lỗi mới.

Không lấy lại ảnh Chrome Task 1 rồi đổi tên thành ảnh Firefox hoặc Safari.

Không sử dụng AI image generation để tạo bằng chứng.

Nếu chưa thể truy cập thiết bị thật hoặc BrowserStack, ghi rõ phần bằng chứng còn thiếu và hướng dẫn tôi tự hoàn thành.

## 7. GIAI ĐOẠN E — SO SÁNH BA MÔI TRƯỜNG

Tạo ma trận kiểm thử:

`HW03/task3/cross_browser_matrix.xlsx`

Mỗi checklist ID phải có kết quả riêng theo từng môi trường, gồm:

- ID và IA.
- Expected result.
- Chrome result.
- Firefox result.
- Safari/Android Chrome result.
- Notes.
- Differences.
- Evidence.
- Issue URL.

Không làm mất lịch sử của checklist Task 1.

Tạo bảng thống kê:

- Tổng test case.
- Số đã thực thi trên từng môi trường.
- Passed.
- Failed.
- Blocked.
- Not Run.
- N/A.
- Các lỗi chung trên tất cả browser.
- Các lỗi chỉ xuất hiện trên một browser.
- Các lỗi nghi ngờ là cross-browser compatibility.

Phân biệt:

**Existing SUT issue:** lỗi đã có ở Task 1 và vẫn tái hiện.

**Cross-browser issue:** lỗi có khác biệt giữa các môi trường kiểm thử.

**Testing limitation:** không đủ dữ liệu hoặc công cụ để kết luận.

Không đếm một lỗi chung ba lần như ba bug độc lập.

## 8. GIAI ĐOẠN F — BUG REPORT VÀ GITHUB ISSUES

Đọc `HW03/task1/github_issue_drafts.md` và kiểm tra danh sách GitHub Issues hiện có khi có quyền truy cập.

Nếu lỗi Task 1 tái hiện trên browser mới:

- Liên kết tới issue hiện tại.
- Bổ sung thông tin compatibility và minh chứng khi thích hợp.
- Không tạo issue trùng.

Nếu phát hiện lỗi mới chỉ xảy ra trên một browser:

- Ghi environment thật.
- Preconditions.
- Steps to reproduce.
- Expected vs Actual.
- Screenshot.
- Severity và rationale.
- Browser comparison.

Báo cáo phải nằm trong Markdown và GitHub Issues theo yêu cầu bài tập.

Chỉ tạo/cập nhật issue khi có bằng chứng xác thực. Nếu chưa có quyền GitHub, hãy tạo bản nháp và đánh dấu chưa đăng, không tuyên bố đã đăng.

## 9. GIAI ĐOẠN G — VIẾT BÁO CÁO TASK 3

Tạo `HW03/task3/cross_browser_report.md` theo văn phong báo cáo kiểm thử học thuật, không viết như tài liệu hướng dẫn sử dụng công cụ.

Cấu trúc:

1. Objectives and Scope.
2. SUT and Test Environments.
3. Test Design and Reuse from Task 1.
4. Cross-Browser Test Execution.
5. Results and Comparison.
6. Browser-Specific Issues.
7. Common GUI Issues.
8. Evidence and Traceability.
9. Threats to Validity and Limitations.
10. Conclusion.

Mọi nhận định phải dựa vào execution log, screenshot và oracle.

Chỉ ra:

- Những lỗi chung đã xác nhận.
- Những khác biệt đáng chú ý.
- Mức độ ổn định của UI trên các môi trường.
- Những test cần human verification.
- Phạm vi chưa kiểm được.

Không chế số liệu.

## 10. GIAI ĐOẠN H — AI AUDIT, GIT VÀ ĐÓNG GÓI

Đề HW03 yêu cầu:

- AI Audit Report.
- AI Critique 200–300 words cho toàn bài.
- Git commits theo từng bước kiểm thử.
- Git commit log.
- Báo cáo Markdown/PDF trong submission cuối.

Trong Task 3:

1. Ghi prompt này vào AI Audit.
2. Ghi tên công cụ, thời điểm sử dụng và output thực tế.
3. Không giả mạo timestamp hoặc AI interactions.
4. Tạo commits riêng cho thiết kế, thực thi, bug reporting và báo cáo khi có thể.
5. Không commit secrets, access tokens, passwords hoặc database có thông tin nhạy cảm.
6. Không sửa lịch sử Git.
7. Không tự push lên GitHub của nhóm.
8. Chỉ stage các file liên quan Task 3; tôn trọng thay đổi chưa commit của tôi.
9. Tạo file git commit log.

Có thể chuẩn bị nội dung Task 3 để tích hợp vào báo cáo chung HW03 nhưng không được tự kết luận Task 2 đã hoàn tất.

## 11. CẤU TRÚC OUTPUT MONG MUỐN

Tổ chức kết quả dưới `HW03/task3/`:

- `README.md`
- `test_plan.md`
- `environment_matrix.md`
- `cross_browser_matrix.xlsx`
- `cross_browser_report.md`
- `test_summary.md`
- `github_issue_drafts.md` nếu có bug mới/chưa đăng
- `human_verification.md`
- `ai_audit.md`
- `git_commit_log.txt`
- `automation/` chứa script và log thực thi
- `evidence/` chứa screenshot thật theo từng môi trường

Được phép thay đổi chi tiết cấu trúc nếu hợp lý hơn, nhưng phải giữ traceability và dễ kiểm tra/chấm điểm.

## 12. QUY TẮC LÀM VIỆC

Hãy thực hiện công việc theo thứ tự:

**Audit → Plan → Environment setup → Execute → Capture evidence → Compare → Report → Verify.**

Không dừng chỉ vì công việc dài. Tiếp tục những phần có thể làm an toàn.

Chỉ hỏi tôi khi thiếu thông tin hoặc quyền truy cập thực sự cần thiết, chẳng hạn:

- Student ID, full name hoặc student email.
- Tài khoản BrowserStack/LambdaTest.
- Quyền sử dụng thiết bị thật.
- Quyền đăng GitHub Issue.

Không yêu cầu tôi cung cấp mật khẩu vào nội dung chat hay file mã nguồn; dùng cơ chế nhập bí mật phù hợp.

Nếu thiếu một môi trường bắt buộc, hãy hoàn thiện những môi trường hiện có, đánh dấu môi trường chưa chạy và trình bày hướng dẫn tiếp tục. Không gọi Task 3 hoàn thành khi chưa đủ ba môi trường hợp lệ.

Trước khi kết thúc, tự audit:

- Đã sử dụng đúng bản checklist Task 1 chưa?
- 70 mục có được đối chiếu đầy đủ theo từng môi trường không?
- Có ít nhất ba môi trường hợp lệ đã được kiểm thử thật không?
- Bằng chứng có đủ danh tính và môi trường theo đề không?
- Các screenshot có xác thực không?
- Kết quả có khác biệt hợp lý với Task 1 và được giải thích không?
- Có sửa nhầm SUT hoặc dữ liệu Task 1/Task 2 không?
- Các issue có trùng không?
- AI Audit và commit log có đầy đủ không?
- Mọi khẳng định trong báo cáo có bằng chứng không?

**Bắt đầu bằng việc kiểm tra repository và dữ liệu Task 1 hiện có, sau đó chủ động triển khai Task 3 tới mức hoàn thiện tối đa.**

Khi kết thúc, báo cáo ngắn gọn:

1. Những phần đã hoàn thành.
2. Những môi trường đã thực sự chạy.
3. Thống kê kết quả.
4. Vị trí các file.
5. Các phần còn cần tôi xác minh hoặc thao tác thủ công.
6. Những yêu cầu đề bài chưa đáp ứng, nếu có.
~~~~
