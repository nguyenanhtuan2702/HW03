const fs = require('node:fs');
const path = require('node:path');
const { entries, environment, platforms, statuses, counts } = require('./summarize.cjs');

const task = path.resolve(__dirname, '..');
const labels = { 'chrome-windows': 'Chrome / Windows', 'firefox-windows': 'Firefox / Windows', 'safari-apple': 'Safari / Apple' };
const chrome = platforms[0];
const firefox = platforms[1];
const safari = platforms[2];
const common = entries.filter((e) => e.outcomes[chrome].status === 'Failed' && e.outcomes[firefox].status === 'Failed');
const commonAll = common.filter((e) => e.outcomes[safari].status === 'Failed');
const different = entries.filter((e) => ['Khác biệt trạng thái Windows', 'Khác biệt cần xác minh'].includes(e.classification));
const unavailable = entries.filter((e) => platforms.some((p) => e.outcomes[p].status === 'Blocked'));
const link = (name, url) => url ? `[${name}](${url})` : '—';
function actual(record) {
  const message = record.actual || record.notes || '—';
  if (record.id === 'S-06' && record.status === 'Blocked' && record.steps?.some((step) => step.includes('Thêm, xem và xóa danh mục'))) {
    return 'Đã thêm, xem và xóa danh mục ở viewport 375 CSS px. WebDriver dừng khi thao tác form Coupon.';
  }
  if (message.includes('Task 3 window could not take focus')) return 'Cửa sổ thử không nhận focus trước thao tác zoom.';
  if (/phím zoom gốc chưa đạt|không xác minh được zoom gốc/i.test(message)) return message;
  return message.split(/\r?\n/)[0];
}
const tableValue = (value) => value.replaceAll('|', '\\|');
const save = (name, text) => fs.writeFileSync(path.join(task, name), text.trim() + '\n');

const table = `| Môi trường | Tổng | Có lượt thử | ${statuses.join(' | ')} |\n|---|---:|---:|---:|---:|---:|---:|---:|\n` + platforms.map((p) => {
  const c = counts[p];
  return `| ${labels[p]} | ${entries.length} | ${entries.length - c['Not Run'] - c['N/A']} | ${statuses.map((s) => c[s]).join(' | ')} |`;
}).join('\n');
const inventory = platforms.map((p) => {
  const { primary, proof } = environment[p];
  if (!primary) return `| ${p} | Chưa có lượt checklist | — | — | ${link('Ảnh minh chứng hạ tầng', proof?.metadata.platformEvidence)} |`;
  const m = primary.metadata;
  return `| ${p} | ${m.browser} | ${m.os}, ${m.device} | ${m.mode}, [${m.runId}](automation/${primary.name})${m.jobId ? ` · Sauce ${m.jobId}` : ''} | ${link('Ảnh cửa sổ', proof?.metadata.platformEvidence)} |`;
}).join('\n');
const issueLinks = [...new Set(common.map((e) => e.issue).filter(Boolean))];
const missing = entries.filter((e) => e.outcomes[safari].status === 'Not Run').map((e) => e.id);
const safariLive = entries.filter((e) => e.outcomes[safari].log?.endsWith('-live.json'));
const zoom = entries.find((e) => e.id === 'S-05');
const manualZoom = [firefox, safari].filter((p) => zoom.outcomes[p].log?.endsWith('-S05-confirmation.json'));
const diffTable = different.length ? `| ID | Chrome / Windows | Firefox / Windows | Safari / macOS |\n|---|---|---|---|\n${different.map((e) => {
  const format = (p) => { const a = e.outcomes[p]; return `${a.status}. ${tableValue(actual(a))} ${a.evidence ? link('Ảnh', a.evidence) : link('Log', a.log)}`; };
  return `| ${e.id} | ${platforms.map(format).join(' | ')} |`;
}).join('\n')}` : 'Chưa ghi nhận chênh lệch Passed/Failed trong các cặp kết quả đã đủ dữ liệu.';

save('environment_matrix.md', `# Môi trường Task 3

| ID | Browser | OS / thiết bị | Chế độ và lượt chính | Minh chứng nhận diện |
|---|---|---|---|---|
${inventory}

- URL Web Admin http://localhost:5174. API fixture http://localhost:3000. Nguồn SUT 8f3059fbec0512cc8f04972afe6ca20411a98471.
- Các lượt chính dùng bản build Vite trong sandbox, Playwright và SQLite mới từ seed. Firefox là bản Playwright trên Windows. Ảnh nhận diện có thể lấy từ một phiên headed riêng của cùng bản trình duyệt.
- Safari dùng Sauce Labs Automated tại EU Central, qua http://localtest.me:8080. [Log xác minh hạ tầng](automation/sauce-smoke-HW03-MWG5L5L2.json) · [Hướng dẫn chạy](human_verification.md).
${safariLive.length ? `- Lượt kiểm thủ công dùng Sauce Labs Live tại EU Central, qua https://localtest.me:8443. Phiên chọn Safari 18 và macOS 14. Chưa thu được số hiệu phụ và Sauce Live job ID. ${link('Log và minh chứng Live', safariLive[0].outcomes[safari].log)}.` : ''}
`);

save('test_summary.md', `# Tóm tắt Task 3

${table}

Cột Có lượt thử gồm cả Blocked. Hai môi trường Windows có ${common.length} ID cùng Failed, đại diện ${issueLinks.length} issue Task 1. ${commonAll.length} trong các ID này đã tái hiện trên cả ba môi trường. Có ${different.length} chênh lệch Passed/Failed cần xác minh và ${unavailable.length} ID có ít nhất một kết quả Blocked.

${diffTable}

[Ma trận đầy đủ](cross_browser_matrix.xlsx) · [Báo cáo](cross_browser_report.md) · [Môi trường](environment_matrix.md)
`);

save('cross_browser_report.md', `# Báo cáo kiểm thử đa trình duyệt · HW03 Task 3

## 1. Mục tiêu và phạm vi

Kiểm tra mức độ nhất quán của Dashboard, Danh mục và Mã giảm giá trên các trình duyệt khác nhau, bao phủ IA-01 đến IA-04. Phạm vi gồm 70 ID lấy từ Excel cuối của Task 1, bao gồm C-22. A-01 đến A-08 được theo dõi riêng trong Task 1.

## 2. SUT và môi trường

SUT lấy từ commit 8f3059fbec0512cc8f04972afe6ca20411a98471. Phiên bản trình duyệt, OS, thiết bị, chế độ và bằng chứng từng lượt được ghi trong [bảng môi trường](environment_matrix.md).

## 3. Thiết kế và tái sử dụng

ID, tiêu chí chấp nhận và bước thiết kế lấy từ [Excel Task 1](../task1/HW03_Task1_Admin_GUI_Checklist.xlsx). Các phép thử được thực hiện lại qua GUI. Kiểm S-06 bằng thao tác thêm, xem và xóa tại 375 CSS px. C-22 xóa bằng Enter, kiểm điều khiển nhận focus sau Tab. API chuẩn bị fixture và đối chiếu độc lập doanh thu của đơn giao thành công.

## 4. Thực thi

Mỗi lượt trích SUT sang bản sao tạm và khởi tạo SQLite riêng. Runner kiểm dữ liệu hiển thị sau đăng nhập, phục hồi fixture giữa các ca, lưu lỗi mạng và hộp thoại liên quan. Các lượt chẩn đoán được lưu cạnh lượt chính. Bản build được phục vụ bằng Vite preview trên loopback. Backend tạm bỏ cache của phản hồi API để mỗi ca đọc đúng fixture. Chế độ thử và giới hạn theo từng case xem trong log.

## 5. Kết quả và so sánh

${table}

## 6. Khác biệt giữa trình duyệt

${diffTable}

${safariLive.some((e) => e.id === 'S-06' && e.outcomes[safari].status === 'Failed') ? 'S-06 đạt khi thao tác qua Playwright trên Chrome/Firefox. Trong Safari Live, ở cùng chiều rộng CSS, sinh viên không hoàn tất được form Mã Giảm Giá bằng thao tác trực tiếp. Mức ảnh hưởng đã được quan sát trong điều kiện này. Phương pháp thao tác và phiên thử khác nhau, nên chưa xác lập nguyên nhân riêng của Safari.' : ''}

Tại các ca phụ thuộc hành vi control native, thông báo khác ngôn ngữ hoặc cách dùng phím cần được xét theo tiêu chí của ca. Sự khác biệt chỉ được ghi là lỗi tương thích khi tái hiện sai lệch bằng thao tác tương ứng trên các trình duyệt.

Phiên Sauce gửi phím Tab thông qua WebDriver. Cần xác minh thiết lập điều hướng bàn phím của Safari khi đối chiếu ca focus vì thiết lập này có thể thay đổi việc Tab đi tới nút hoặc điều khiển. [Hướng dẫn bàn phím Safari](https://support.apple.com/guide/safari/keyboard-shortcuts-and-gestures-cpsh003/mac).

## 7. Lỗi chung đã quan sát

${common.length ? common.map((e) => `- **${e.id}** ${tableValue(actual(e.outcomes[chrome]))} ${link('Ảnh Chrome', e.outcomes[chrome].evidence)} · ${link('Ảnh Firefox', e.outcomes[firefox].evidence)}${e.outcomes[safari].status === 'Failed' ? ` · ${link('Ảnh Safari', e.outcomes[safari].evidence)}` : ` · Safari ${e.outcomes[safari].status}`}${e.issue ? ` · ${link('Issue Task 1', e.issue)}` : ''}`).join('\n') : 'Chưa có đủ kết quả để nhận diện lỗi chung.'}

Các ID có cùng GitHub Issue được tính theo issue để tránh đếm trùng. Phạm vi kết luận hiện chỉ áp dụng cho các môi trường có dữ liệu quan sát.

## 8. Minh chứng và truy vết

[Ma trận](cross_browser_matrix.xlsx) liên kết ảnh và issue theo ID. Tab Thực thi ghi kết quả, bước, thời điểm, lỗi liên quan và tệp JSON gốc. Ảnh viewport được chụp trong trang đang chạy với overlay danh tính. Ảnh cửa sổ có thanh địa chỉ được liệt kê trong [bảng môi trường](environment_matrix.md).
${manualZoom.length ? `\nS-05 được ghi Passed theo xác nhận kiểm thủ công của sinh viên trên ${manualZoom.map((p) => labels[p]).join(' và ')}. Firefox không có ảnh cho ca này. Safari có ảnh Dashboard, ảnh không hiển thị mức 200%. ${manualZoom.map((p) => link(`Xác nhận ${labels[p]}`, zoom.outcomes[p].log)).join(' · ')}.` : ''}

## 9. Giới hạn

${unavailable.map((e) => `- **${e.id}** ${platforms.filter((p) => e.outcomes[p].status === 'Blocked').map((p) => `${labels[p]} · ${tableValue(actual(e.outcomes[p]))} ${link('Log', e.outcomes[p].log)}`).join(' · ')}`).join('\n')}
- Firefox dùng bản Playwright, mức tương đồng với Firefox phát hành chính thức còn phụ thuộc tích hợp nền tảng. [Tài liệu Playwright](https://playwright.dev/docs/browsers).
${missing.length ? `- Safari còn ${missing.length} ca chưa chạy (${missing.join(', ')}). S-05 cần zoom gốc và ảnh mức 200%.` : '- Tất cả ID Safari đã có lượt thử, gồm các ca Blocked liệt kê ở trên.'}

## 10. Kết luận

Task 3 ghi kết quả riêng cho từng môi trường. Safari có ${counts[safari].Passed} Passed, ${counts[safari].Failed} Failed, ${counts[safari].Blocked} Blocked và ${counts[safari]['Not Run']} Not Run. [Kết quả kiểm thủ công](human_verification.md).
`);

save('github_issue_drafts.md', `# Đối chiếu GitHub Issues · Task 3

Các lỗi tái hiện được dẫn về issue Task 1 hiện có trên fork. Đã đối chiếu ${issueLinks.length} liên kết từ Excel cuối với danh sách issue trên GitHub ngày 14/11/2026.

${issueLinks.map((url) => `- [#${url.split('/').at(-1)}](${url}) · ${common.filter((e) => e.issue === url).map((e) => e.id).join(', ')}`).join('\n')}

${different.length ? `## Chênh lệch cần xác minh\n\n${diffTable}\n\nChưa đăng issue mới cho chênh lệch cần kiểm lại thao tác native hoặc ảnh hưởng của trình chạy.` : 'Các kết quả hiện có chưa xác lập lỗi mới theo trình duyệt.'}
`);



