const couponTab = 'Mã Giảm Giá';
const headings = {
  revenue: 'Tổng doanh thu',
  orders: 'Tổng số đơn hàng',
};
const fields = {
  code: 'input[placeholder^="Mã coupon"]',
  type: 'select',
  value: 'input[placeholder^="Giá trị %"], input[placeholder^="Số tiền"]',
  minimum: 'input[placeholder^="Đơn tối thiểu"]',
  date: 'input[type="date"]',
  uses: 'input[placeholder^="Số lần dùng"]',
};

const date = '2099-12-31';
const expiredDate = '2020-01-01';
const codeFor = (t, suffix) => `${t.tag}-${suffix}`.toUpperCase();
const numberOnScreen = (text) => Number(text.replace(/[^0-9-]/g, ''));
const currency = /^\d{1,3}(?:[.,\s\u00a0\u202f]\d{3})*\s*₫$/;
const expiryName = /hết hạn/i;

function form(t) {
  return t.page.locator('form').filter({ has: t.page.getByRole('button', { name: 'Tạo mã', exact: true }) });
}

function field(t, key) {
  return form(t).locator(fields[key]);
}

function submitButton(t) {
  return form(t).getByRole('button', { name: 'Tạo mã', exact: true });
}

function couponRow(t, code) {
  return t.page.getByRole('row').filter({ has: t.page.getByRole('cell', { name: code, exact: true }) });
}

function metric(t, label) {
  return t.page.getByRole('heading', { name: label, exact: label === headings.orders, level: 3 })
    .locator('..').locator('p');
}

async function apiJson(t, method, path, data) {
  const response = await t.api[method](path, { data });
  if (!response.ok()) t.block(`Yêu cầu chuẩn bị/đối chiếu ${method.toUpperCase()} ${path} trả HTTP ${response.status()}.`);
  return response.json();
}

async function createOrder(t, amount, delivered) {
  const fixture = await apiJson(t, 'post', '/api/checkout', {
    total_amount: amount,
    shipping_address: `Địa chỉ thử nghiệm ${t.tag}`,
  });
  if (delivered) {
    for (const status of ['confirmed', 'shipping', 'delivered']) {
      await apiJson(t, 'put', `/api/admin/orders/${fixture.orderId}/status`, { status });
    }
  }
  t.note(`Dữ liệu thử qua API: đơn #${fixture.orderId}, ${amount} ₫, ${delivered ? 'delivered' : 'pending'}.`);
}

async function createCouponFixture(t, code, overrides = {}) {
  await apiJson(t, 'post', '/api/admin/coupons', {
    code,
    type: 'fixed',
    discount_value: 12000,
    min_order_amount: 20000,
    expired_at: date,
    max_uses_per_user: 2,
    ...overrides,
  });
  t.note(`Tạo coupon dùng một lần cho kiểm thử: ${code}.`);
  await t.refresh();
  await t.open(couponTab);
  await couponRow(t, code).waitFor({ state: 'visible' });
}

async function fillCoupon(t, overrides = {}) {
  const data = {
    code: codeFor(t, 'GUI'),
    type: 'percent',
    value: '12',
    minimum: '20000',
    date,
    uses: '2',
    ...overrides,
  };
  await field(t, 'code').fill(data.code);
  await field(t, 'type').selectOption(data.type);
  for (const key of ['value', 'minimum', 'date', 'uses']) {
    await field(t, key).fill(data[key]);
  }
  t.note(`Nhập coupon qua GUI: ${JSON.stringify(data)}.`);
  return data;
}

function waitForCouponResponse(t, method) {
  return t.page.waitForResponse((response) =>
    response.url().includes('/api/admin/coupons') && response.request().method() === method,
  { timeout: 8000 }).catch(() => null);
}

async function submitCoupon(t) {
  await form(t).evaluate((element) => {
    element.dataset.hw03Invalid = '';
    element.addEventListener('invalid', (event) => {
      const field = event.target;
      element.dataset.hw03Invalid = JSON.stringify({
        name: field.getAttribute('placeholder') || field.tagName,
        message: field.validationMessage,
      });
    }, { capture: true, once: true });
  });
  const responsePending = waitForCouponResponse(t, 'POST');
  const dialogStart = t.dialogs.length;
  t.note('Bấm Tạo mã và quan sát phản hồi giao diện.');
  await submitButton(t).click();
  const invalid = await form(t).getAttribute('data-hw03-invalid');
  if (invalid) {
    const detail = JSON.parse(invalid);
    t.note(`Validation của trình duyệt tại ${detail.name}: ${detail.message}`);
    return { invalid: detail, dialogs: t.dialogs.slice(dialogStart) };
  }
  const response = await responsePending;
  if (!response) t.block('Bấm Tạo mã nhưng không thu được phản hồi POST hoặc sự kiện validation trình duyệt.');
  await response.finished();
  // Read the GUI after the network handler has had a chance to render its response.
  await t.page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
  t.note(`POST coupon trả HTTP ${response.status()}.`);
  return { response, dialogs: t.dialogs.slice(dialogStart) };
}

async function createThroughGui(t, overrides) {
  const data = await fillCoupon(t, overrides);
  const { response } = await submitCoupon(t);
  const code = data.code.toUpperCase();
  t.check(response?.ok(), `Không lưu được coupon hợp lệ ${code} qua nút Tạo mã.`);
  await expectCouponRow(t, code);
  return { data, code, row: couponRow(t, code) };
}

async function expectCouponRow(t, code) {
  try {
    await couponRow(t, code).waitFor({ state: 'visible' });
  } catch (error) {
    if (error.name !== 'TimeoutError') throw error;
    t.check(false, `Lệnh tạo mã ${code} thành công nhưng không tìm thấy hàng tương ứng trong bảng.`);
  }
}

async function invalidCoupon(t, overrides, description) {
  await t.open(couponTab);
  const data = await fillCoupon(t, overrides);
  const result = await submitCoupon(t);
  if (result.invalid) {
    t.check(Boolean(result.invalid.message), `Trình duyệt chặn ${description} nhưng không đưa ra hướng dẫn.`);
    return `Trình duyệt chặn ${description} tại “${result.invalid.name}”: ${result.invalid.message}`;
  }
  if (result.response.ok() && data.code) {
    const row = couponRow(t, data.code.toUpperCase());
    await row.waitFor({ state: 'visible' }).catch((error) => {
      if (error.name !== 'TimeoutError') throw error;
    });
  }
  const rowVisible = data.code && await couponRow(t, data.code.toUpperCase()).isVisible();
  t.check(!result.response.ok(), `Form chấp nhận ${description} và POST trả HTTP ${result.response.status()}${rowVisible ? `, mã ${data.code.toUpperCase()} xuất hiện trong bảng` : ''}.`);
  const hasFeedback = result.dialogs.length > 0 || await t.page.getByRole('alert').count() > 0;
  if (overrides.minimum === undefined) {
    t.check(hasFeedback, `Hệ thống từ chối ${description} nhưng không tìm thấy thông báo lỗi trên GUI.`);
  }
  return `Hệ thống từ chối ${description} với HTTP ${result.response.status()}${hasFeedback ? ' và có phản hồi lỗi' : ''}.`;
}

async function deleteCoupon(t, code, acceptConfirm = false) {
  const row = couponRow(t, code);
  const responsePending = waitForCouponResponse(t, 'DELETE');
  const dialogStart = t.dialogs.length;
  let requestSent = false;
  const trackDelete = (request) => {
    if (request.url().includes('/api/admin/coupons/') && request.method() === 'DELETE') requestSent = true;
  };
  t.page.on('request', trackDelete);
  t.chooseDialog?.(acceptConfirm ? 'accept' : 'dismiss');
  try {
    t.note(`Bấm Xóa tại hàng ${code}${acceptConfirm ? ' và chấp nhận xác nhận nếu có' : ' và hủy xác nhận nếu có'}.`);
    await row.getByRole('button', { name: 'Xóa', exact: true }).click();
    const confirm = t.dialogs.slice(dialogStart).find((dialog) => dialog.type === 'confirm');
    if (confirm && !acceptConfirm) {
      await t.page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
      t.note(`Đã hủy hộp thoại xác nhận “${confirm.message}”.`);
      return { confirm, requestSent };
    }
    const response = await responsePending;
    if (!response) t.block('Không thu được phản hồi DELETE hoặc hộp thoại xác nhận khi bấm Xóa.');
    t.check(response.ok(), `Xóa ${code} trả HTTP ${response.status()}.`);
    await row.waitFor({ state: 'detached' }).catch((error) => {
      if (error.name !== 'TimeoutError') throw error;
      t.check(false, `DELETE trả HTTP ${response.status()} nhưng hàng ${code} vẫn còn trong bảng.`);
    });
    t.note(`DELETE trả HTTP ${response.status()} và hàng ${code} biến mất khỏi bảng.`);
    return { confirm, response };
  } finally {
    t.page.off('request', trackDelete);
    t.chooseDialog?.('dismiss');
  }
}

async function dashboardCounts(t) {
  const orders = await apiJson(t, 'get', '/api/admin/orders');
  return {
    count: orders.length,
    delivered: orders.filter((order) => order.status === 'delivered')
      .reduce((total, order) => total + Number(order.total_amount), 0),
  };
}

async function headingVisible(t, title) {
  t.check(await t.page.getByRole('heading', { name: title, exact: true, level: 2 }).isVisible(),
    `Không thấy tiêu đề view “${title}”.`);
}

module.exports = {
  'D-01': async (t) => {
    t.note('Đọc hai nhãn thẻ thống kê trên Dashboard.');
    const labels = await t.page.getByRole('heading', { level: 3 }).allTextContents();
    t.check(labels.length === 2 && labels.some((name) => name.startsWith(headings.revenue))
      && labels.includes(headings.orders), `Hai nhãn chỉ số quan sát được: ${JSON.stringify(labels)}.`);
    return `Hai nhãn đang hiển thị: ${labels.join(' và ')}.`;
  },
  'D-02': async (t) => {
    if ((await dashboardCounts(t)).delivered < 1000) {
      await createOrder(t, 1234567, true);
      await t.refresh();
    }
    const displayed = (await metric(t, headings.revenue).textContent()).trim();
    t.note(`Đọc nguyên văn giá trị doanh thu: “${displayed}”.`);
    t.check(currency.test(displayed) && numberOnScreen(displayed) >= 1000,
      `Doanh thu “${displayed}” không thể hiện số có phân nhóm hàng nghìn và ký hiệu ₫.`);
    return `Doanh thu ${displayed} có dấu phân nhóm hàng nghìn và ký hiệu ₫. Giá trị số được đối chiếu riêng tại D-07.`;
  },
  'D-03': async (t) => {
    const displayed = (await metric(t, headings.orders).textContent()).trim();
    t.note(`Đọc nguyên văn Tổng số đơn hàng: “${displayed}”.`);
    t.check(/^\d+$/.test(displayed), `Tổng số đơn hàng hiển thị “${displayed}”, khác số nguyên không kèm đơn vị.`);
    return `Tổng số đơn hàng hiển thị số nguyên ${displayed}, không có ký hiệu tiền.`;
  },
  'D-04': async (t) => {
    const viewport = t.page.viewportSize();
    try {
      for (const [width, height] of [[1280, 800], [1024, 768]]) {
        await t.page.setViewportSize({ width, height });
        t.note(`Đo khung nội dung và vị trí hai thẻ ở viewport ${width}×${height} CSS px.`);
        const cards = await t.page.getByRole('heading', { level: 3 }).evaluateAll((headings) =>
          headings.map((heading) => {
            const card = heading.parentElement;
            const box = card.getBoundingClientRect();
            return { left: box.left, right: box.right, scroll: card.scrollWidth, client: card.clientWidth };
          }));
        t.check(cards.length === 2 && cards[0].right <= cards[1].left + 1
          && cards.every((card) => card.left >= 0 && card.right <= width + 1 && card.scroll <= card.client + 1),
        `Thẻ thống kê chồng lấn hoặc vượt vùng hiển thị ở chiều rộng ${width}px: ${JSON.stringify(cards)}.`);
      }
      return 'Hai thẻ không chồng hoặc tràn ở viewport 1280×800 và 1024×768 CSS px tại zoom mặc định.';
    } catch (error) {
      await t.capture();
      throw error;
    } finally {
      if (viewport) await t.page.setViewportSize(viewport);
    }
  },
  'D-05': async (t) => {
    const label = (await t.page.getByRole('heading', { level: 3, name: /Tổng doanh thu/ }).textContent()).trim();
    t.note(`Đọc nhãn doanh thu “${label}”.`);
    t.check(!/\bDelivered\b/i.test(label), `Nhãn “${label}” dùng “Delivered” cho trạng thái đã giao, trong khi các nhãn trạng thái dành cho người dùng tiếng Việt.`);
    return `Nhãn doanh thu “${label}” không dùng tên trạng thái tiếng Anh.`;
  },
  'D-06': async (t) => {
    await t.open('Danh mục');
    await headingVisible(t, 'Quản lý Danh mục');
    await t.open('Dashboard');
    await headingVisible(t, 'Dashboard');
    t.check(await metric(t, headings.revenue).isVisible() && await metric(t, headings.orders).isVisible(),
      'Chuyển về Dashboard nhưng không hiển thị đủ hai thẻ thống kê.');
    return 'Từ Danh mục, bấm Dashboard và thấy đúng tiêu đề cùng hai thẻ thống kê.';
  },
  'D-07': async (t) => {
    await createOrder(t, 246810, true);
    await createOrder(t, 135790, false);
    const expected = (await dashboardCounts(t)).delivered;
    await t.refresh();
    const displayed = (await metric(t, headings.revenue).textContent()).trim();
    t.note(`Đối chiếu tổng các đơn delivered = ${expected} ₫ với giá trị Dashboard “${displayed}”.`);
    t.check(numberOnScreen(displayed) === expected,
      `Dashboard hiển thị ${displayed}; tổng đối chiếu của riêng đơn đã giao là ${expected} ₫.`);
    return `Dashboard hiển thị đúng ${displayed} so với tổng các đơn đã giao, đã kiểm với đơn pending có giá trị khác 0.`;
  },
  'D-08': async (t) => {
    await createOrder(t, 195000, false);
    const { count } = await dashboardCounts(t);
    await t.refresh();
    const displayed = (await metric(t, headings.orders).textContent()).trim();
    t.note(`Đối chiếu Tổng số đơn hàng “${displayed}” với ${count} đơn mà API liệt kê.`);
    t.check(displayed === String(count), `Dashboard hiển thị ${displayed}; danh sách đối chiếu có ${count} đơn hàng.`);
    return `Dashboard hiển thị ${displayed}, khớp ${count} đơn của tập dữ liệu.`;
  },
  'D-09': async (t) => {
    const { count } = await dashboardCounts(t);
    if (count !== 0) t.block(`Cần dữ liệu không có đơn hàng, sandbox hiện có ${count} đơn.`);
    const displayed = await Promise.all(Object.values(headings).map(async (label) => (await metric(t, label).textContent()).trim()));
    t.note(`API xác nhận 0 đơn; đọc hai thẻ Dashboard: ${JSON.stringify(displayed)}.`);
    t.check(displayed[0] === '0 ₫' && displayed[1] === '0', `Dashboard trống hiển thị ${displayed.join(' / ')}, dự kiến 0 ₫ và 0.`);
    return 'Dữ liệu đã tải, 0 đơn hàng và 0 ₫ hiển thị đúng khi API trả danh sách rỗng.';
  },
  'D-10': async (t) => {
    let release;
    let started;
    let finished;
    let routeStarted = false;
    let releaseError;
    const gate = new Promise((resolve) => { release = resolve; });
    const requestStarted = new Promise((resolve) => { started = resolve; });
    const routeFinished = new Promise((resolve) => { finished = resolve; });
    const routePattern = '**/api/admin/orders';
    const handler = async (route) => {
      routeStarted = true;
      started();
      await gate;
      try {
        await route.continue();
      } catch (error) {
        releaseError = error;
      } finally {
        finished();
      }
    };
    await t.page.route(routePattern, handler);
    const loaded = t.page.waitForResponse((response) =>
      response.url().endsWith('/api/admin/orders') && response.request().method() === 'GET',
    { timeout: 12000 }).catch(() => null);
    let timeout;
    try {
      await t.page.reload({ waitUntil: 'domcontentloaded' });
      const arrived = await Promise.race([
        requestStarted.then(() => true),
        new Promise((resolve) => { timeout = setTimeout(() => resolve(false), 5000); }),
      ]);
      if (!arrived) t.block('Không quan sát được yêu cầu đơn hàng sau khi tải lại Dashboard.');
      t.note('Giữ yêu cầu GET đơn hàng thực tại biên trình duyệt, quan sát Dashboard khi phản hồi còn chờ. Không thay thế nội dung phản hồi.');
      const indicator = await t.page.locator('[role="status"], [role="progressbar"], [aria-busy="true"]')
        .or(t.page.getByText(/đang tải|loading/i)).first().isVisible();
      const visibleMetrics = await Promise.all(Object.values(headings).map(async (label) =>
        await metric(t, label).isVisible() ? (await metric(t, label).textContent()).trim() : 'ẩn'));
      if (!indicator) await t.capture();
      t.check(indicator, `Khi GET đơn hàng chưa được chuyển đi, giao diện đã hiển thị ${visibleMetrics.join(' và ')} và không có trạng thái đang tải nhận biết được.`);
      return 'Dashboard có chỉ báo tải trong lúc yêu cầu dữ liệu thật còn chờ.';
    } finally {
      clearTimeout(timeout);
      release();
      if (routeStarted) {
        await routeFinished;
        if (releaseError) t.note(`Kết nối bị gián đoạn lúc trả yêu cầu đã giữ: ${releaseError.message}`);
        else await loaded;
      }
      await t.page.unroute(routePattern, handler);
    }
  },
  'P-01': async (t) => {
    await t.open(couponTab);
    await headingVisible(t, 'Quản lý Mã Giảm Giá');
    return 'View hiển thị tiêu đề “Quản lý Mã Giảm Giá”.';
  },
  'P-02': async (t) => {
    await t.open(couponTab);
    const actual = await t.page.getByRole('columnheader').allTextContents();
    const expected = ['Mã', 'Loại', 'Giá trị', 'Đơn tối thiểu', 'Hết hạn', 'Giới hạn/người', 'Hành động'];
    t.note(`Đọc các tiêu đề cột: ${actual.join(' | ')}.`);
    t.check(expected.every((label, index) => label === actual[index]?.trim()),
      `Bảng không có bộ nhãn cột mong đợi. Thực tế: ${actual.join(' | ')}.`);
    return 'Bảng có đủ bảy nhãn cột theo thứ tự mã, loại, giá trị, đơn tối thiểu, hạn, lượt và hành động.';
  },
  'P-03': async (t) => {
    await t.open(couponTab);
    const percent = await couponRow(t, 'SAVE10').getByRole('cell').nth(2).textContent();
    const fixed = (await couponRow(t, 'BIGBUY').getByRole('cell').nth(2).textContent()).trim();
    t.note(`Đọc giá trị hai mã seed: SAVE10 “${percent}”, BIGBUY “${fixed}”.`);
    t.check(percent.trim() === '10%' && currency.test(fixed) && numberOnScreen(fixed) === 50000,
      `Giá trị coupon hiển thị “${percent}” và “${fixed}”, khác định dạng 10% và 50.000 ₫.`);
    return `Coupon phần trăm hiển thị ${percent.trim()}, coupon cố định hiển thị ${fixed} có phân nhóm nghìn và ký hiệu ₫.`;
  },
  'P-04': async (t) => {
    await t.open(couponTab);
    const viewport = t.page.viewportSize();
    try {
      for (const width of [1280, 1024, 768]) {
        await t.page.setViewportSize({ width, height: 900 });
        t.note(`Đo kích thước sáu trường và nút Tạo mã ở ${width}×900 CSS px.`);
        const bounds = await form(t).locator('input,select,button').evaluateAll((controls) => controls.map((control) => {
          const box = control.getBoundingClientRect();
          return {
            left: box.left, right: box.right, top: box.top, bottom: box.bottom,
            label: control.getAttribute('placeholder') || control.textContent.trim() || control.tagName,
          };
        }));
        const clipped = bounds.find((box) => box.left < 0 || box.right > width + 1);
        const overlap = bounds.some((a, index) => bounds.slice(index + 1).some((b) =>
          a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom));
        t.check(bounds.length === 7 && !clipped && !overlap,
          `Form coupon ở ${width}px có ${bounds.length} điều khiển. ${clipped ? `“${clipped.label}” vượt cạnh phải tới x=${Math.round(clipped.right)}.` : ''}${overlap ? ' Có ô nhập chồng lấn.' : ''}`);
      }
      return 'Sáu trường và nút Tạo mã đều nằm trong viewport và không chồng nhau ở 1280, 1024 và 768 CSS px.';
    } catch (error) {
      await t.capture();
      throw error;
    } finally {
      if (viewport) await t.page.setViewportSize(viewport);
    }
  },
  'P-05': async (t) => {
    await t.open(couponTab);
    const unlabeled = await form(t).locator('input,select').evaluateAll((controls) => controls
      .filter((control) => !control.labels.length && !control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby'))
      .map((control) => control.getAttribute('placeholder') || control.tagName));
    t.note(`Kiểm tra nhãn liên kết bền vững của sáu điều khiển: ${unlabeled.length} điều khiển không có label/aria-label/aria-labelledby.`);
    t.check(unlabeled.length === 0, `Các điều khiển không có nhãn bền vững: ${unlabeled.join(', ')}. Placeholder hoặc lựa chọn hiện tại không thay thế nhãn.`);
    return 'Sáu trường có nhãn liên kết hoặc tên truy cập bền vững.';
  },
  'P-06': async (t) => {
    await t.open(couponTab);
    const formText = await form(t).innerText();
    t.note(`Quan sát nội dung form và dấu * bên cạnh nhãn: ${JSON.stringify(formText)}.`);
    const unmarked = [];
    for (const key of Object.keys(fields)) {
      if (!await field(t, key).evaluate((input) =>
        [...input.labels].some((label) => label.getClientRects().length > 0 && label.innerText.includes('*')))) {
        unmarked.push(key);
      }
    }
    t.check(unmarked.length === 0, `Form không gắn dấu * cạnh nhãn cho các trường bắt buộc FR-17: ${unmarked.join(', ')}.`);
    return 'Cả sáu trường bắt buộc có dấu * cạnh nhãn hiển thị.';
  },
  'P-07': (t) => invalidCoupon(t, { code: '' }, 'mã coupon rỗng'),
  'P-08': async (t) => {
    const code = codeFor(t, 'DUP');
    await createCouponFixture(t, code);
    await fillCoupon(t, { code });
    const { response, dialogs } = await submitCoupon(t);
    const count = await couponRow(t, code).count();
    const feedback = dialogs.map((item) => item.message).join(' ');
    t.check(response && !response.ok() && count === 1,
      `Gửi trùng mã ${code}: HTTP ${response?.status() ?? 'không gửi'}, ${count} hàng trùng mã trong GUI.`);
    t.check(/đã (tồn tại|được sử dụng)|mã trùng|duplicate (coupon|code)|already exists/i.test(feedback),
      `Mã ${code} được giữ một bản ghi, nhưng thông báo giao diện là “${feedback || '(không có)'}” thay vì giải thích rõ mã đã tồn tại.`);
    return `Mã trùng bị từ chối, còn một hàng và thông báo giải thích mã đã tồn tại: “${feedback}”.`;
  },
  'P-09': async (t) => {
    await t.open(couponTab);
    const data = await fillCoupon(t, { code: codeFor(t, 'CASE').toLowerCase() });
    const shown = await field(t, 'code').inputValue();
    const { response } = await submitCoupon(t);
    t.check(response?.ok(), `Không lưu được mã khi nhập chữ thường “${data.code}”.`);
    await expectCouponRow(t, shown);
    t.check(await couponRow(t, shown).count() === 1, `Dạng code hiển thị trong form “${shown}” không có đúng một hàng tương ứng sau khi lưu.`);
    return `Nhập “${data.code}”; form hiển thị “${shown}” trước khi gửi và bảng lưu cùng chuỗi.`;
  },
  'P-10': async (t) => {
    await t.open(couponTab);
    await field(t, 'type').selectOption('percent');
    const percentLabel = await field(t, 'type').locator('option:checked').textContent();
    const percentHint = await field(t, 'value').getAttribute('placeholder');
    await field(t, 'type').selectOption('fixed');
    const fixedLabel = await field(t, 'type').locator('option:checked').textContent();
    const fixedHint = await field(t, 'value').getAttribute('placeholder');
    t.note(`Đổi loại: ${percentLabel} → ${percentHint}; ${fixedLabel} → ${fixedHint}.`);
    t.check(percentLabel.includes('%') && percentHint.includes('%')
      && fixedLabel.includes('₫') && fixedHint.startsWith('Số tiền'),
    `Dropdown và gợi ý không phân biệt đơn vị: ${percentLabel} / ${percentHint}, ${fixedLabel} / ${fixedHint}.`);
    return 'Dropdown phân biệt phần trăm và số tiền cố định, gợi ý của trường giá trị đổi tương ứng.';
  },
  'P-11': (t) => invalidCoupon(t, { value: '0' }, 'giá trị giảm 0'),
  'P-12': (t) => invalidCoupon(t, { value: '-10' }, 'giá trị giảm -10'),
  'P-13': (t) => invalidCoupon(t, { minimum: '-1' }, 'đơn tối thiểu -1 ₫'),
  'P-14': (t) => invalidCoupon(t, { uses: '0' }, 'giới hạn 0 lượt'),
  'P-15': (t) => invalidCoupon(t, { date: '' }, 'ngày hết hạn để trống'),
  'P-16': async (t) => {
    await t.open(couponTab);
    await field(t, 'date').fill(date);
    await field(t, 'minimum').focus();
    await t.page.keyboard.press('Tab');
    t.check(await field(t, 'date').evaluate((input) => document.activeElement === input),
      'Tab từ Đơn tối thiểu không đưa focus vào Ngày hết hạn.');
    await t.page.keyboard.press('ArrowDown');
    const after = await field(t, 'date').inputValue();
    t.note(`Tab vào trường ngày và bấm ArrowDown: ${date} → ${after}.`);
    t.check(Boolean(after) && after !== date, 'Tab đã vào trường ngày nhưng ArrowDown không chỉnh được giá trị ngày.');
    let reachedUses = false;
    for (let step = 0; step < 5 && !reachedUses; step++) {
      await t.page.keyboard.press('Tab');
      reachedUses = await field(t, 'uses').evaluate((input) => document.activeElement === input);
    }
    t.check(reachedUses, 'Không thoát được trường ngày bằng Tab sang Số lần dùng tối đa.');
    return `Tab vào được trường ngày, bàn phím đổi giá trị thành ${after}, sau đó Tab sang giới hạn lượt dùng.`;
  },
  'P-17': async (t) => {
    await t.open('Dashboard');
    await headingVisible(t, 'Dashboard');
    await t.open(couponTab);
    await headingVisible(t, 'Quản lý Mã Giảm Giá');
    t.check(await submitButton(t).isVisible() && await t.page.getByRole('table').isVisible(),
      'Sau khi mở Mã Giảm Giá từ Dashboard, không thấy đủ form tạo mã và bảng coupon.');
    return 'Bấm menu Mã Giảm Giá từ Dashboard mở đúng tiêu đề, form tạo mã và bảng coupon.';
  },
  'P-18': async (t) => {
    await t.open(couponTab);
    await field(t, 'code').focus();
    const actual = ['code'];
    for (let step = 0; step < 12 && !actual.includes('submit'); step++) {
      await t.page.keyboard.press('Tab');
      const active = await t.page.evaluate((selectors) => {
        const element = document.activeElement;
        if (element.matches('button') && element.textContent.trim() === 'Tạo mã') return 'submit';
        return Object.entries(selectors).find(([, selector]) => element.matches(selector))?.[0]
          || element.tagName;
      }, fields);
      if (actual.at(-1) !== active) actual.push(active);
    }
    const expected = ['code', 'type', 'value', 'minimum', 'date', 'uses', 'submit'];
    t.note(`Trình tự Tab: ${actual.join(' → ')}. Gộp các segment lặp liền nhau của ô date.`);
    t.check(actual.join('|') === expected.join('|'), `Trình tự focus thực tế ${actual.join(' → ')}; mong đợi ${expected.join(' → ')}.`);
    return `Focus đi qua sáu trường rồi đến Tạo mã đúng thứ tự: ${actual.join(' → ')}.`;
  },
  'P-19': async (t) => {
    await t.open(couponTab);
    const data = await fillCoupon(t);
    const { response, dialogs } = await submitCoupon(t);
    t.check(response?.ok(), 'Không tạo được coupon hợp lệ để quan sát phản hồi thành công.');
    const row = couponRow(t, data.code.toUpperCase());
    await row.waitFor({ state: 'visible' });
    const indicator = await t.page.getByText(/tạo mã thành công|đã tạo mã|lưu thành công/i).first().isVisible();
    const message = dialogs.find((item) => /thành công|đã tạo/i.test(item.message));
    const inView = await row.getByRole('cell').first().evaluate((cell) => {
      const rect = cell.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight && rect.left >= 0 && rect.right <= window.innerWidth;
    });
    t.note(`Quan sát phản hồi ngay sau tạo: có thông báo=${Boolean(indicator || message)}, mã mới nằm trong vùng nhìn=${inView}.`);
    t.check(indicator || message || inView, `Mã ${data.code.toUpperCase()} chỉ xuất hiện phía dưới vùng nhìn hiện tại, không có thông báo thành công; form đã đặt lại về mặc định.`);
    return indicator || message
      ? 'GUI có phản hồi xác nhận tạo mã thành công.'
      : `Mã ${data.code.toUpperCase()} xuất hiện ngay trong vùng nhìn sau khi tạo, không cần cuộn. Form không hiện thông báo thành công riêng.`;
  },
  'P-20': async (t) => {
    await t.open(couponTab);
    const { row, code } = await createThroughGui(t, { type: 'fixed', value: '5000', minimum: '0', uses: '1' });
    const values = (await row.getByRole('cell').allTextContents()).map((value) => value.trim());
    t.note(`Hàng mới: ${values.join(' | ')}.`);
    t.check(await row.count() === 1 && values[0] === code && values[1] === 'Cố định'
      && numberOnScreen(values[2]) === 5000 && numberOnScreen(values[3]) === 0
      && values[4] === date && values[5] === '1 lần',
    `Coupon mới không xuất hiện đúng một lần với giá trị đã nhập. Hàng quan sát: ${values.join(' | ')}.`);
    return `Coupon ${code} xuất hiện đúng một lần với loại cố định, giá trị 5.000 ₫, tối thiểu 0 ₫, hạn ${date}, giới hạn 1 lượt.`;
  },
  'P-21': async (t) => {
    const code = codeFor(t, 'ERR');
    await createCouponFixture(t, code);
    await fillCoupon(t, { code });
    const { response, dialogs } = await submitCoupon(t);
    if (!response || response.ok()) t.block('Không kích hoạt được lỗi gửi trùng mã để kiểm tra vị trí thông báo.');
    const inline = await form(t).evaluate((element) => {
      const button = element.querySelector('button');
      const edge = button.getBoundingClientRect().top;
      const candidates = [...element.querySelectorAll('[role="alert"], [aria-live], p, span')];
      return candidates.some((candidate) => candidate.getClientRects().length > 0
        && candidate.getBoundingClientRect().bottom <= edge
        && /lỗi|đã tồn tại|không thể|trùng|error/i.test(candidate.textContent));
    });
    t.check(inline, `Tạo mã trùng trả HTTP ${response.status()}. Sau khi đóng hộp thoại “${dialogs.map((item) => item.message).join(' ') || '(không có)'}”, form không hiển thị thông báo lỗi phía trên nút Tạo mã.`);
    return 'Sau khi gửi mã trùng, có thông báo lỗi hiển thị trong form phía trên nút Tạo mã.';
  },
  'P-22': async (t) => {
    const code = codeFor(t, 'CONFIRM');
    await createCouponFixture(t, code);
    const outcome = await deleteCoupon(t, code);
    t.check(Boolean(outcome.confirm), `Bấm Xóa một lần đã xóa ${code} và cập nhật bảng, không có hộp thoại xác nhận.`);
    return `Hộp thoại xác nhận được mở trước khi xóa, bấm hủy giữ lại coupon ${code}.`;
  },
  'P-23': async (t) => {
    const code = codeFor(t, 'CANCEL');
    await createCouponFixture(t, code);
    const outcome = await deleteCoupon(t, code);
    if (!outcome.confirm) t.block('Không có hộp thoại xác nhận để thực hiện thao tác Hủy (xem P-22).');
    t.check(!outcome.requestSent && await couponRow(t, code).isVisible(),
      `Đã chọn Hủy nhưng ${outcome.requestSent ? 'trình duyệt gửi DELETE' : `hàng ${code} không còn hiển thị`}.`);
    return `Đã chọn Hủy, không gửi DELETE và coupon ${code} vẫn có trong bảng.`;
  },
  'P-24': async (t) => {
    const code = codeFor(t, 'DELETE');
    await createCouponFixture(t, code);
    const codes = async () => t.page.locator('table tbody tr td:first-child').allTextContents();
    const before = (await codes()).map((value) => value.trim());
    await deleteCoupon(t, code, true);
    const after = (await codes()).map((value) => value.trim());
    t.note(`Trước xóa có ${before.length} hàng, sau xóa có ${after.length} hàng.`);
    t.check(before.filter((value) => value !== code).sort().join('|') === after.sort().join('|'),
      `Xóa ${code} làm thay đổi hàng khác. Trước: ${before.join(', ')}. Sau: ${after.join(', ')}.`);
    return `Đúng hàng ${code} biến mất; ${after.length} mã khác giữ nguyên.`;
  },
  'P-25': async (t) => {
    const code = codeFor(t, 'EXPIRED');
    await createCouponFixture(t, code, { expired_at: expiredDate });
    const expired = (await couponRow(t, code).getByRole('cell').nth(4).textContent()).trim();
    const active = (await couponRow(t, 'SAVE10').getByRole('cell').nth(4).textContent()).trim();
    t.note(`Coupon thử hạn ${expiredDate} hiện “${expired}”; SAVE10 hiện “${active}”.`);
    t.check(expiryName.test(expired) && active === date,
      `Trạng thái hạn không phân biệt coupon quá hạn “${expired}” và coupon còn hạn “${active}”.`);
    return `Mã hết hạn ngày ${expiredDate} hiển thị “${expired}”; mã còn hạn hiển thị ngày ${active}.`;
  },
  'P-26': async (t) => {
    if (!t.emptyList) t.block('Chưa có fixture danh sách coupon rỗng trên sandbox riêng.');
    return t.emptyList('coupons', async () => {
      await t.refresh();
      await t.open(couponTab);
      const rows = await t.page.locator('table tbody tr').count();
      if (rows !== 0) t.block(`Fixture rỗng không có hiệu lực, GUI vẫn hiển thị ${rows} hàng.`);
      const emptyText = await t.page.getByText(/chưa có mã|không có mã|danh sách (đang )?trống/i).first().isVisible();
      t.note(`Danh sách coupon rỗng trên sandbox: ${rows} hàng; trạng thái rỗng hiển thị: ${emptyText}.`);
      t.check(emptyText, `Sau khi dữ liệu tải xong, bảng coupon có ${rows} hàng nhưng không có thông báo danh sách rỗng.`);
      return 'Giao diện hiển thị thông báo rõ ràng khi danh sách coupon rỗng.';
    });
  },
};
