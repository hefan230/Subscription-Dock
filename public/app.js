'use strict';

const languages = ['zh', 'en', 'ja'];
const htmlLangs = { zh: 'zh-CN', en: 'en', ja: 'ja' };
const dictionaries = {
  zh: {
    'app.title': 'Subscription Dock',
    'app.subtitle': '个人订阅管理',
    'role.admin': '管理面板',
    'role.guest': '访客模式',
    'auth.username': '用户名',
    'auth.password': '密码',
    'auth.login': '登录',
    'auth.guest': '访客进入',
    'nav.dashboard': '总览',
    'nav.items': '订阅',
    'nav.icons': '图标',
    'nav.settings': '设置',
    'nav.logout': '退出登录',
    'nav.backLogin': '返回登录',
    'eyebrow.dashboard': 'Dashboard',
    'section.upcoming': '即将续费',
    'section.paymentCurrency': '付款货币',
    'section.iconManagement': '图标管理',
    'section.accessSettings': '访问设置',
    'section.currencySettings': '货币设置',
    'section.notificationSettings': '通知提醒',
    'section.backup': '备份',
    'action.add': '新增',
    'action.addSubscription': '新增订阅',
    'action.save': '保存',
    'action.cancel': '取消',
    'action.delete': '删除',
    'action.edit': '编辑',
    'action.renew': '续期',
    'action.uploadIcon': '上传图标',
    'action.refreshRates': '刷新汇率',
    'action.testNotification': '测试通知',
    'action.export': '导出',
    'action.import': '导入',
    'field.name': '名称',
    'field.type': '类型',
    'field.website': '网站',
    'field.amount': '金额',
    'field.currency': '货币',
    'field.cycle': '周期',
    'field.nextRenewal': '下次续费',
    'field.firstPayment': '首次付款',
    'field.status': '状态',
    'field.paymentMethod': '支付方式',
    'field.tags': '标签',
    'field.customIcon': '自定义图标',
    'field.autoRenewal': '自动续费',
    'field.description': '说明',
    'field.notes': '备注',
    'field.baseCurrency': '基准货币',
    'field.allowGuests': '允许访客查看总览和订阅',
    'field.notificationEnabled': '启用到期提醒',
    'field.notificationChannel': '通知渠道',
    'field.reminderDays': '提前提醒天数',
    'field.iconNone': '不使用图标',
    'note.guest': '开启后，未登录用户可以通过登录页的访客按钮进入，只能查看主页总览和订阅列表，不能新增、编辑、续期、删除、导入、导出或修改设置。',
    'note.icons': '图标会保存到图标库，可在新增或编辑订阅时选择。仅支持 400x400 像素的 PNG、JPG、WebP，单个文件不超过 20KB。',
    'note.itemIcon': '可从图标库选择，或上传 400x400 像素、20KB 以内的 PNG、JPG、WebP 并保存到图标库。',
    'note.notifications': '默认提前 3 天提醒。Pushover、Bark、Telegram 三种渠道任选其一。服务启动后会自动检查一次，之后每小时检查一次；同一个订阅、同一个续费日只会推送一次。',
    'placeholder.search': '搜索名称、货币、标签',
    'placeholder.website': 'https://example.com',
    'placeholder.payment': 'Visa / PayPal / Apple Pay',
    'placeholder.tags': 'work, ai, personal',
    'title.dashboardCurrency': '总览折算货币',
    'title.statusFilter': '状态筛选',
    'title.typeFilter': '类型筛选',
    'title.close': '关闭',
    'stats.monthly': '月均支出',
    'stats.annual': '年化支出',
    'stats.due30': '30 天内续费',
    'stats.active': '使用中',
    'unit.items': '项',
    'empty.renewal': '暂无续费日期',
    'empty.currency': '暂无付款货币数据',
    'empty.items': '暂无记录',
    'empty.icons': '暂无图标',
    'label.convertedTo': '折算为 {currency}',
    'label.rateManual': '手动维护',
    'label.rateDate': '汇率日期 {date}',
    'label.rateUpdated': '刷新于 {time}',
    'dialog.new': '新增订阅',
    'dialog.edit': '编辑订阅',
    'date.unset': '未设置',
    'date.overdue': '已过期 {days} 天',
    'date.today': '今天',
    'date.after': '{days} 天后',
    'confirm.deleteIcon': '删除图标「{name}」？',
    'confirm.deleteItem': '删除「{name}」？',
    'confirm.import': '导入会覆盖当前数据，是否继续？',
    'toast.iconLoaded': '图标已载入',
    'toast.iconInvalid': '图标无效',
    'toast.iconSaved': '图标已保存',
    'toast.iconRenamed': '图标已重命名',
    'toast.iconDeleted': '图标已删除',
    'toast.saved': '已保存',
    'toast.deleted': '已删除',
    'toast.renewalUpdated': '已更新续费日期',
    'toast.settingsSaved': '设置已保存',
    'toast.refreshing': '刷新中',
    'toast.ratesRefreshed': '汇率已刷新',
    'toast.ratesPartial': '汇率已刷新，{missing} 沿用原值',
    'toast.notificationSent': '测试通知已发送',
    'toast.exportFailed': '导出失败',
    'toast.importDone': '导入完成',
    'toast.importFailed': '导入失败',
    'toast.iconUploadFailed': '图标上传失败',
    'error.requestFailed': '请求失败',
    'error.startFailed': '启动失败',
    'error.iconType': '图标只支持 PNG、JPG 或 WebP。',
    'error.iconSize': '图标文件不能超过 20KB。',
    'error.iconPixels': '图标必须是 400x400 像素。',
    'error.iconRead': '图标读取失败。',
    'error.iconUnreadable': '图标图片无法读取。',
    'types.subscription': '订阅',
    'types.domain': '域名',
    'types.vps': 'VPS',
    'types.server': '服务器',
    'types.cloud': '云服务',
    'types.license': '许可证',
    'types.ssl': 'SSL',
    'types.membership': '会员',
    'types.api': 'API',
    'types.other': '其他',
    'cycles.weekly': '每周',
    'cycles.monthly': '每月',
    'cycles.quarterly': '每季度',
    'cycles.yearly': '每年',
    'cycles.once': '一次性',
    'statuses.active': '使用中',
    'statuses.paused': '暂停',
    'statuses.cancelled': '已取消',
    'filter.allStatuses': '全部状态',
    'filter.allTypes': '全部类型'
  },
  en: {
    'app.title': 'Subscription Dock',
    'app.subtitle': 'Personal subscription manager',
    'role.admin': 'Admin panel',
    'role.guest': 'Guest mode',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.login': 'Sign in',
    'auth.guest': 'Continue as guest',
    'nav.dashboard': 'Overview',
    'nav.items': 'Subscriptions',
    'nav.icons': 'Icons',
    'nav.settings': 'Settings',
    'nav.logout': 'Sign out',
    'nav.backLogin': 'Back to login',
    'eyebrow.dashboard': 'Dashboard',
    'section.upcoming': 'Upcoming renewals',
    'section.paymentCurrency': 'Payment currency',
    'section.iconManagement': 'Icon library',
    'section.accessSettings': 'Access',
    'section.currencySettings': 'Currencies',
    'section.notificationSettings': 'Notifications',
    'section.backup': 'Backup',
    'action.add': 'Add',
    'action.addSubscription': 'Add subscription',
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.delete': 'Delete',
    'action.edit': 'Edit',
    'action.renew': 'Renew',
    'action.uploadIcon': 'Upload icon',
    'action.refreshRates': 'Refresh rates',
    'action.testNotification': 'Test notification',
    'action.export': 'Export',
    'action.import': 'Import',
    'field.name': 'Name',
    'field.type': 'Type',
    'field.website': 'Website',
    'field.amount': 'Amount',
    'field.currency': 'Currency',
    'field.cycle': 'Cycle',
    'field.nextRenewal': 'Next renewal',
    'field.firstPayment': 'First payment',
    'field.status': 'Status',
    'field.paymentMethod': 'Payment method',
    'field.tags': 'Tags',
    'field.customIcon': 'Custom icon',
    'field.autoRenewal': 'Auto renewal',
    'field.description': 'Description',
    'field.notes': 'Notes',
    'field.baseCurrency': 'Base currency',
    'field.allowGuests': 'Allow guests to view overview and subscriptions',
    'field.notificationEnabled': 'Enable renewal reminders',
    'field.notificationChannel': 'Notification channel',
    'field.reminderDays': 'Reminder days before renewal',
    'field.iconNone': 'No icon',
    'note.guest': 'When enabled, visitors can enter from the login page and view the overview and subscriptions only. They cannot add, edit, renew, delete, import, export, or change settings.',
    'note.icons': 'Icons are stored in the library and can be selected when adding or editing subscriptions. PNG, JPG, or WebP only, exactly 400x400 pixels, up to 20KB each.',
    'note.itemIcon': 'Choose from the icon library, or upload a 400x400 PNG, JPG, or WebP under 20KB and save it to the library.',
    'note.notifications': 'Default reminder is 3 days before renewal. Choose Pushover, Bark, or Telegram. The service checks once after startup and then hourly. Each subscription and renewal date is notified only once.',
    'placeholder.search': 'Search name, currency, or tags',
    'placeholder.website': 'https://example.com',
    'placeholder.payment': 'Visa / PayPal / Apple Pay',
    'placeholder.tags': 'work, ai, personal',
    'title.dashboardCurrency': 'Overview display currency',
    'title.statusFilter': 'Status filter',
    'title.typeFilter': 'Type filter',
    'title.close': 'Close',
    'stats.monthly': 'Monthly average',
    'stats.annual': 'Annualized spend',
    'stats.due30': 'Due in 30 days',
    'stats.active': 'Active',
    'unit.items': 'items',
    'empty.renewal': 'No renewal dates',
    'empty.currency': 'No payment currency data',
    'empty.items': 'No records',
    'empty.icons': 'No icons yet',
    'label.convertedTo': 'Converted to {currency}',
    'label.rateManual': 'Manual',
    'label.rateDate': 'Rate date {date}',
    'label.rateUpdated': 'Updated {time}',
    'dialog.new': 'Add subscription',
    'dialog.edit': 'Edit subscription',
    'date.unset': 'Not set',
    'date.overdue': 'Overdue by {days} days',
    'date.today': 'Today',
    'date.after': 'In {days} days',
    'confirm.deleteIcon': 'Delete icon "{name}"?',
    'confirm.deleteItem': 'Delete "{name}"?',
    'confirm.import': 'Import will overwrite current data. Continue?',
    'toast.iconLoaded': 'Icon loaded',
    'toast.iconInvalid': 'Invalid icon',
    'toast.iconSaved': 'Icon saved',
    'toast.iconRenamed': 'Icon renamed',
    'toast.iconDeleted': 'Icon deleted',
    'toast.saved': 'Saved',
    'toast.deleted': 'Deleted',
    'toast.renewalUpdated': 'Renewal date updated',
    'toast.settingsSaved': 'Settings saved',
    'toast.refreshing': 'Refreshing',
    'toast.ratesRefreshed': 'Rates refreshed',
    'toast.ratesPartial': 'Rates refreshed; {missing} kept previous values',
    'toast.notificationSent': 'Test notification sent',
    'toast.exportFailed': 'Export failed',
    'toast.importDone': 'Import complete',
    'toast.importFailed': 'Import failed',
    'toast.iconUploadFailed': 'Icon upload failed',
    'error.requestFailed': 'Request failed',
    'error.startFailed': 'Startup failed',
    'error.iconType': 'Icon must be PNG, JPG, or WebP.',
    'error.iconSize': 'Icon file must be 20KB or smaller.',
    'error.iconPixels': 'Icon must be exactly 400x400 pixels.',
    'error.iconRead': 'Failed to read icon.',
    'error.iconUnreadable': 'Unable to load icon image.',
    'types.subscription': 'Subscription',
    'types.domain': 'Domain',
    'types.vps': 'VPS',
    'types.server': 'Server',
    'types.cloud': 'Cloud',
    'types.license': 'License',
    'types.ssl': 'SSL',
    'types.membership': 'Membership',
    'types.api': 'API',
    'types.other': 'Other',
    'cycles.weekly': 'Weekly',
    'cycles.monthly': 'Monthly',
    'cycles.quarterly': 'Quarterly',
    'cycles.yearly': 'Yearly',
    'cycles.once': 'One-time',
    'statuses.active': 'Active',
    'statuses.paused': 'Paused',
    'statuses.cancelled': 'Cancelled',
    'filter.allStatuses': 'All statuses',
    'filter.allTypes': 'All types'
  },
  ja: {
    'app.title': 'Subscription Dock',
    'app.subtitle': '個人サブスク管理',
    'role.admin': '管理パネル',
    'role.guest': 'ゲストモード',
    'auth.username': 'ユーザー名',
    'auth.password': 'パスワード',
    'auth.login': 'ログイン',
    'auth.guest': 'ゲストで入る',
    'nav.dashboard': '概要',
    'nav.items': 'サブスク',
    'nav.icons': 'アイコン',
    'nav.settings': '設定',
    'nav.logout': 'ログアウト',
    'nav.backLogin': 'ログインへ戻る',
    'eyebrow.dashboard': 'Dashboard',
    'section.upcoming': 'まもなく更新',
    'section.paymentCurrency': '支払い通貨',
    'section.iconManagement': 'アイコン管理',
    'section.accessSettings': 'アクセス設定',
    'section.currencySettings': '通貨設定',
    'section.notificationSettings': '通知リマインダー',
    'section.backup': 'バックアップ',
    'action.add': '追加',
    'action.addSubscription': 'サブスクを追加',
    'action.save': '保存',
    'action.cancel': 'キャンセル',
    'action.delete': '削除',
    'action.edit': '編集',
    'action.renew': '更新',
    'action.uploadIcon': 'アイコンをアップロード',
    'action.refreshRates': '為替を更新',
    'action.testNotification': '通知テスト',
    'action.export': 'エクスポート',
    'action.import': 'インポート',
    'field.name': '名前',
    'field.type': '種類',
    'field.website': 'サイト',
    'field.amount': '金額',
    'field.currency': '通貨',
    'field.cycle': '周期',
    'field.nextRenewal': '次回更新日',
    'field.firstPayment': '初回支払日',
    'field.status': '状態',
    'field.paymentMethod': '支払い方法',
    'field.tags': 'タグ',
    'field.customIcon': 'カスタムアイコン',
    'field.autoRenewal': '自動更新',
    'field.description': '説明',
    'field.notes': 'メモ',
    'field.baseCurrency': '基準通貨',
    'field.allowGuests': 'ゲストに概要とサブスク閲覧を許可',
    'field.notificationEnabled': '期限リマインダーを有効化',
    'field.notificationChannel': '通知チャンネル',
    'field.reminderDays': '何日前に通知',
    'field.iconNone': 'アイコンなし',
    'note.guest': '有効にすると、未ログインユーザーはログイン画面のゲストボタンから入り、概要とサブスク一覧だけを閲覧できます。追加、編集、更新、削除、インポート、エクスポート、設定変更はできません。',
    'note.icons': 'アイコンはライブラリに保存され、サブスクの追加・編集時に選択できます。PNG、JPG、WebP のみ、400x400 ピクセル、1個20KB以内です。',
    'note.itemIcon': 'アイコンライブラリから選択するか、400x400 の PNG、JPG、WebP を20KB以内でアップロードして保存できます。',
    'note.notifications': '初期値は更新日の3日前通知です。Pushover、Bark、Telegram から1つ選べます。サービス起動後に1回、その後は毎時チェックし、同じサブスクと更新日では1回だけ通知します。',
    'placeholder.search': '名前、通貨、タグを検索',
    'placeholder.website': 'https://example.com',
    'placeholder.payment': 'Visa / PayPal / Apple Pay',
    'placeholder.tags': 'work, ai, personal',
    'title.dashboardCurrency': '概要の表示通貨',
    'title.statusFilter': '状態フィルター',
    'title.typeFilter': '種類フィルター',
    'title.close': '閉じる',
    'stats.monthly': '月平均',
    'stats.annual': '年換算支出',
    'stats.due30': '30日以内の更新',
    'stats.active': '有効',
    'unit.items': '件',
    'empty.renewal': '更新日はありません',
    'empty.currency': '支払い通貨データなし',
    'empty.items': '記録なし',
    'empty.icons': 'アイコンなし',
    'label.convertedTo': '{currency} に換算',
    'label.rateManual': '手動管理',
    'label.rateDate': '為替日 {date}',
    'label.rateUpdated': '更新 {time}',
    'dialog.new': 'サブスクを追加',
    'dialog.edit': 'サブスクを編集',
    'date.unset': '未設定',
    'date.overdue': '{days} 日超過',
    'date.today': '今日',
    'date.after': '{days} 日後',
    'confirm.deleteIcon': 'アイコン「{name}」を削除しますか？',
    'confirm.deleteItem': '「{name}」を削除しますか？',
    'confirm.import': 'インポートすると現在のデータが上書きされます。続行しますか？',
    'toast.iconLoaded': 'アイコンを読み込みました',
    'toast.iconInvalid': 'アイコンが無効です',
    'toast.iconSaved': 'アイコンを保存しました',
    'toast.iconRenamed': 'アイコン名を変更しました',
    'toast.iconDeleted': 'アイコンを削除しました',
    'toast.saved': '保存しました',
    'toast.deleted': '削除しました',
    'toast.renewalUpdated': '更新日を変更しました',
    'toast.settingsSaved': '設定を保存しました',
    'toast.refreshing': '更新中',
    'toast.ratesRefreshed': '為替を更新しました',
    'toast.ratesPartial': '為替を更新しました。{missing} は前回値を使用',
    'toast.notificationSent': 'テスト通知を送信しました',
    'toast.exportFailed': 'エクスポートに失敗しました',
    'toast.importDone': 'インポート完了',
    'toast.importFailed': 'インポートに失敗しました',
    'toast.iconUploadFailed': 'アイコンアップロード失敗',
    'error.requestFailed': 'リクエストに失敗しました',
    'error.startFailed': '起動に失敗しました',
    'error.iconType': 'アイコンは PNG、JPG、WebP のみ対応です。',
    'error.iconSize': 'アイコンファイルは20KB以内にしてください。',
    'error.iconPixels': 'アイコンは必ず 400x400 ピクセルです。',
    'error.iconRead': 'アイコンの読み込みに失敗しました。',
    'error.iconUnreadable': 'アイコン画像を読み込めません。',
    'types.subscription': 'サブスク',
    'types.domain': 'ドメイン',
    'types.vps': 'VPS',
    'types.server': 'サーバー',
    'types.cloud': 'クラウド',
    'types.license': 'ライセンス',
    'types.ssl': 'SSL',
    'types.membership': 'メンバーシップ',
    'types.api': 'API',
    'types.other': 'その他',
    'cycles.weekly': '毎週',
    'cycles.monthly': '毎月',
    'cycles.quarterly': '四半期',
    'cycles.yearly': '毎年',
    'cycles.once': '一回のみ',
    'statuses.active': '利用中',
    'statuses.paused': '一時停止',
    'statuses.cancelled': 'キャンセル済み',
    'filter.allStatuses': 'すべての状態',
    'filter.allTypes': 'すべての種類'
  }
};

const typeKeys = ['subscription', 'domain', 'vps', 'server', 'cloud', 'license', 'ssl', 'membership', 'api', 'other'];
const cycleKeys = ['weekly', 'monthly', 'quarterly', 'yearly', 'once'];
const statusKeys = ['active', 'paused', 'cancelled'];

function detectLanguage() {
  const saved = localStorage.getItem('subscriptionDockLanguage');
  if (languages.includes(saved)) return saved;
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language || 'zh'];
  for (const lang of browserLanguages) {
    const lower = String(lang).toLowerCase();
    if (lower.startsWith('ja')) return 'ja';
    if (lower.startsWith('en')) return 'en';
    if (lower.startsWith('zh')) return 'zh';
  }
  return 'en';
}

let currentLanguage = detectLanguage();

function t(key, params = {}) {
  const source = dictionaries[currentLanguage]?.[key] ?? dictionaries.zh[key] ?? key;
  return source.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? '');
}

function typeLabel(type) {
  return t(`types.${type}`);
}

function cycleLabel(cycle) {
  return t(`cycles.${cycle}`);
}

function statusLabel(status) {
  return t(`statuses.${status}`);
}

const currencyLabels = {
  CNY: '🇨🇳 CNY',
  USD: '🇺🇸 USD',
  JPY: '🇯🇵 JPY',
  EUR: '🇪🇺 EUR',
  TRY: '🇹🇷 TRY',
  INR: '🇮🇳 INR',
  SGD: '🇸🇬 SGD',
  BRL: '🇧🇷 BRL',
  GBP: '🇬🇧 GBP',
  NGN: '🇳🇬 NGN',
  CAD: '🇨🇦 CAD',
  AUD: '🇦🇺 AUD',
  HKD: '🇭🇰 HKD',
  PHP: '🇵🇭 PHP',
  MYR: '🇲🇾 MYR',
  PKR: '🇵🇰 PKR'
};

const currencies = Object.keys(currencyLabels);

function currencyLabel(currency) {
  return currencyLabels[currency] || currency;
}

function roundRate(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number >= 1000000000) return null;
  const rounded = Math.round(number * 100) / 100;
  return rounded > 0 ? rounded : null;
}

function rateInputValue(value) {
  const rounded = roundRate(value);
  return rounded === null ? '' : String(rounded);
}

const state = {
  settings: null,
  icons: [],
  subscriptions: [],
  editingId: null,
  currentIconData: '',
  isAdmin: false,
  guestAllowed: false,
  viewCurrency: '',
  filters: {
    query: '',
    status: 'all',
    type: 'all'
  }
};

const $ = (selector) => document.querySelector(selector);

const elements = {
  loginView: $('#loginView'),
  appView: $('#appView'),
  loginForm: $('#loginForm'),
  guestButton: $('#guestButton'),
  loginError: $('#loginError'),
  languageSelects: document.querySelectorAll('.language-select'),
  userName: $('#userName'),
  logoutButton: $('#logoutButton'),
  navButtons: document.querySelectorAll('.nav-button'),
  sections: document.querySelectorAll('.panel-section'),
  pageTitle: $('#pageTitle'),
  dashboardCurrencySelect: $('#dashboardCurrencySelect'),
  searchInput: $('#searchInput'),
  quickAddButton: $('#quickAddButton'),
  addItemButton: $('#addItemButton'),
  statusFilter: $('#statusFilter'),
  typeFilter: $('#typeFilter'),
  statGrid: $('#statGrid'),
  renewalCount: $('#renewalCount'),
  upcomingList: $('#upcomingList'),
  currencyGroupList: $('#currencyGroupList'),
  baseCurrencyLabel: $('#baseCurrencyLabel'),
  itemList: $('#itemList'),
  itemDialog: $('#itemDialog'),
  itemForm: $('#itemForm'),
  itemIconSelect: $('#itemIconSelect'),
  itemIconInput: $('#itemIconInput'),
  itemIconPreview: $('#itemIconPreview'),
  dialogTitle: $('#dialogTitle'),
  closeDialogButton: $('#closeDialogButton'),
  deleteItemButton: $('#deleteItemButton'),
  allowGuests: $('#allowGuests'),
  saveAccessButton: $('#saveAccessButton'),
  saveSettingsButton: $('#saveSettingsButton'),
  refreshRatesButton: $('#refreshRatesButton'),
  saveNotificationButton: $('#saveNotificationButton'),
  testNotificationButton: $('#testNotificationButton'),
  baseCurrencySelect: $('#baseCurrencySelect'),
  rateGrid: $('#rateGrid'),
  rateUpdatedLabel: $('#rateUpdatedLabel'),
  notificationEnabled: $('#notificationEnabled'),
  notificationChannel: $('#notificationChannel'),
  pushoverToken: $('#pushoverToken'),
  pushoverUserKey: $('#pushoverUserKey'),
  barkServerUrl: $('#barkServerUrl'),
  barkDeviceKey: $('#barkDeviceKey'),
  telegramBotToken: $('#telegramBotToken'),
  telegramChatId: $('#telegramChatId'),
  notificationFields: document.querySelectorAll('[data-channel-field]'),
  uploadIconButton: $('#uploadIconButton'),
  iconLibraryInput: $('#iconLibraryInput'),
  iconLibraryList: $('#iconLibraryList'),
  reminderDays: $('#reminderDays'),
  exportButton: $('#exportButton'),
  importButton: $('#importButton'),
  importFile: $('#importFile'),
  toast: $('#toast')
};

async function api(path, options = {}) {
  const request = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  };

  if (options.body !== undefined) {
    request.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  const response = await fetch(path, request);
  if (response.status === 401 && path !== '/api/session' && path !== '/api/login') {
    showLogin();
  }

  if (response.status === 204) return null;

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(data?.error || t('error.requestFailed'));
  }
  return data;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.hidden = true;
  }, 2600);
}

function showLogin() {
  state.isAdmin = false;
  elements.appView.hidden = true;
  elements.loginView.hidden = false;
  elements.guestButton.hidden = !state.guestAllowed;
}

function showApp(isAdmin = false) {
  state.isAdmin = Boolean(isAdmin);
  elements.userName.textContent = state.isAdmin ? t('role.admin') : t('role.guest');
  elements.quickAddButton.hidden = !state.isAdmin;
  elements.addItemButton.hidden = !state.isAdmin;
  elements.logoutButton.textContent = state.isAdmin ? t('nav.logout') : t('nav.backLogin');
  for (const button of elements.navButtons) {
    if (['settingsSection', 'iconsSection'].includes(button.dataset.section)) {
      button.hidden = !state.isAdmin;
    }
  }
  if (!state.isAdmin) switchSection('dashboardSection');
  elements.loginView.hidden = true;
  elements.appView.hidden = false;
}

function fillSelect(select, entries, selected) {
  select.innerHTML = entries
    .map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`)
    .join('');
  if (selected) select.value = selected;
}

function setFirstTextNode(container, text) {
  if (!container) return;
  const node = [...container.childNodes].find((entry) => entry.nodeType === Node.TEXT_NODE && entry.textContent.trim());
  if (node) node.textContent = `\n          ${text}\n          `;
}

function setLabel(field, key) {
  setFirstTextNode(field?.closest('label'), t(key));
}

function setText(selector, key) {
  const node = $(selector);
  if (node) node.textContent = t(key);
}

function setButtonText(button, key) {
  if (button) button.textContent = t(key);
}

function refreshControlSelects() {
  const typeEntries = typeKeys.map((key) => [key, typeLabel(key)]);
  fillSelect(
    elements.statusFilter,
    [['all', t('filter.allStatuses')], ...statusKeys.map((key) => [key, statusLabel(key)])],
    elements.statusFilter.value || 'all'
  );
  fillSelect(elements.typeFilter, [['all', t('filter.allTypes')], ...typeEntries], elements.typeFilter.value || 'all');
  fillSelect(elements.itemForm.elements.type, typeEntries, elements.itemForm.elements.type.value || 'subscription');
  fillSelect(
    elements.itemForm.elements.billingCycle,
    cycleKeys.map((key) => [key, cycleLabel(key)]),
    elements.itemForm.elements.billingCycle.value || 'monthly'
  );
  fillSelect(
    elements.itemForm.elements.status,
    statusKeys.map((key) => [key, statusLabel(key)]),
    elements.itemForm.elements.status.value || 'active'
  );
  fillSelect(
    elements.itemForm.elements.currency,
    currencies.map((currency) => [currency, currencyLabel(currency)]),
    elements.itemForm.elements.currency.value || 'USD'
  );
  fillSelect(
    elements.baseCurrencySelect,
    currencies.map((currency) => [currency, currencyLabel(currency)]),
    elements.baseCurrencySelect.value || savedBaseCurrency()
  );
  fillSelect(
    elements.dashboardCurrencySelect,
    currencies.map((currency) => [currency, currencyLabel(currency)]),
    elements.dashboardCurrencySelect.value || baseCurrency()
  );
}

function applyTranslations() {
  document.documentElement.lang = htmlLangs[currentLanguage] || 'en';
  document.title = t('app.title');
  for (const select of elements.languageSelects) select.value = currentLanguage;
  elements.userName.textContent = state.isAdmin ? t('role.admin') : t('role.guest');
  elements.logoutButton.textContent = state.isAdmin ? t('nav.logout') : t('nav.backLogin');

  setText('#loginForm .brand-row p', 'app.subtitle');
  setLabel(elements.loginForm.elements.username, 'auth.username');
  setLabel(elements.loginForm.elements.password, 'auth.password');
  setButtonText(elements.loginForm.querySelector('button[type="submit"]'), 'auth.login');
  setButtonText(elements.guestButton, 'auth.guest');

  const navKeys = {
    dashboardSection: 'nav.dashboard',
    itemsSection: 'nav.items',
    iconsSection: 'nav.icons',
    settingsSection: 'nav.settings'
  };
  for (const button of elements.navButtons) {
    const key = navKeys[button.dataset.section];
    if (!key) continue;
    button.title = t(key);
    const textNode = [...button.childNodes].find((entry) => entry.nodeType === Node.TEXT_NODE && entry.textContent.trim());
    if (textNode) textNode.textContent = `\n            ${t(key)}\n          `;
  }
  const activeNav = [...elements.navButtons].find((button) => button.classList.contains('active'));
  const activeTitleKey = navKeys[activeNav?.dataset.section] || 'nav.dashboard';
  elements.pageTitle.textContent = t(activeTitleKey);

  setText('.eyebrow', 'eyebrow.dashboard');
  setText('#dashboardSection .content-grid .surface:nth-child(1) h3', 'section.upcoming');
  setText('#dashboardSection .content-grid .surface:nth-child(2) h3', 'section.paymentCurrency');
  setText('#iconsSection h3', 'section.iconManagement');
  setText('#settingsSection > .settings-surface:nth-child(1) h3', 'section.accessSettings');
  setText('#settingsSection > .settings-surface:nth-child(2) h3', 'section.currencySettings');
  setText('#settingsSection > .settings-surface:nth-child(3) h3', 'section.notificationSettings');
  setText('#settingsSection > .settings-surface:nth-child(4) h3', 'section.backup');

  elements.dashboardCurrencySelect.title = t('title.dashboardCurrency');
  elements.searchInput.placeholder = t('placeholder.search');
  elements.statusFilter.title = t('title.statusFilter');
  elements.typeFilter.title = t('title.typeFilter');
  elements.closeDialogButton.title = t('title.close');

  setButtonText(elements.quickAddButton, 'action.add');
  setButtonText(elements.addItemButton, 'action.addSubscription');
  setButtonText(elements.uploadIconButton, 'action.uploadIcon');
  setButtonText(elements.saveAccessButton, 'action.save');
  setButtonText(elements.refreshRatesButton, 'action.refreshRates');
  setButtonText(elements.saveSettingsButton, 'action.save');
  setButtonText(elements.testNotificationButton, 'action.testNotification');
  setButtonText(elements.saveNotificationButton, 'action.save');
  setButtonText(elements.exportButton, 'action.export');
  setButtonText(elements.importButton, 'action.import');
  setButtonText(elements.deleteItemButton, 'action.delete');
  setButtonText(elements.itemForm.querySelector('[data-close-dialog]'), 'action.cancel');
  setButtonText(elements.itemForm.querySelector('button[type="submit"]'), 'action.save');

  setText('#iconsSection .settings-note', 'note.icons');
  setText('#settingsSection > .settings-surface:nth-child(1) .settings-note', 'note.guest');
  setText('#settingsSection > .settings-surface:nth-child(3) .settings-note', 'note.notifications');
  setText('.icon-upload-control span', 'note.itemIcon');

  setLabel(elements.itemForm.elements.name, 'field.name');
  setLabel(elements.itemForm.elements.type, 'field.type');
  setLabel(elements.itemForm.elements.website, 'field.website');
  setLabel(elements.itemForm.elements.price, 'field.amount');
  setLabel(elements.itemForm.elements.currency, 'field.currency');
  setLabel(elements.itemForm.elements.billingCycle, 'field.cycle');
  setLabel(elements.itemForm.elements.nextRenewal, 'field.nextRenewal');
  setLabel(elements.itemForm.elements.firstPayment, 'field.firstPayment');
  setLabel(elements.itemForm.elements.status, 'field.status');
  setLabel(elements.itemForm.elements.paymentMethod, 'field.paymentMethod');
  setLabel(elements.itemForm.elements.tags, 'field.tags');
  setLabel(elements.itemIconSelect, 'field.customIcon');
  setLabel(elements.itemForm.elements.description, 'field.description');
  setLabel(elements.itemForm.elements.notes, 'field.notes');
  setLabel(elements.baseCurrencySelect, 'field.baseCurrency');
  setLabel(elements.notificationChannel, 'field.notificationChannel');
  setLabel(elements.reminderDays, 'field.reminderDays');
  setLabel(elements.pushoverToken, 'Pushover API Token');
  setLabel(elements.pushoverUserKey, 'Pushover User Key');
  setLabel(elements.barkServerUrl, 'Bark Server URL');
  setLabel(elements.barkDeviceKey, 'Bark Device Key');
  setLabel(elements.telegramBotToken, 'Telegram Bot Token');
  setLabel(elements.telegramChatId, 'Telegram Chat ID');
  setFirstTextNode(elements.allowGuests.closest('label'), t('field.allowGuests'));
  setFirstTextNode(elements.notificationEnabled.closest('label'), t('field.notificationEnabled'));
  setFirstTextNode(elements.itemForm.elements.autoRenewal.closest('label'), t('field.autoRenewal'));

  elements.itemForm.elements.website.placeholder = t('placeholder.website');
  elements.itemForm.elements.paymentMethod.placeholder = t('placeholder.payment');
  elements.itemForm.elements.tags.placeholder = t('placeholder.tags');

  refreshControlSelects();
  renderNotificationFields();
  if (state.settings) renderAll();
}

function setLanguage(language, persist = true) {
  currentLanguage = languages.includes(language) ? language : 'en';
  if (persist) localStorage.setItem('subscriptionDockLanguage', currentLanguage);
  applyTranslations();
}

function setupStaticControls() {
  refreshControlSelects();
  applyTranslations();
}

async function loadState() {
  const data = await api('/api/state');
  state.isAdmin = data.viewer === 'admin';
  state.guestAllowed = Boolean(data.settings?.allowGuests ?? state.guestAllowed);
  state.settings = data.settings;
  if (!currencies.includes(state.viewCurrency)) {
    state.viewCurrency = savedBaseCurrency();
  }
  state.icons = Array.isArray(data.icons) ? data.icons : [];
  state.subscriptions = data.subscriptions;
  renderAll();
}

function renderAll() {
  elements.dashboardCurrencySelect.value = baseCurrency();
  renderDashboard();
  renderItems();
  renderIcons();
  renderSettings();
}

function savedBaseCurrency() {
  return state.settings?.baseCurrency || 'USD';
}

function baseCurrency() {
  return state.viewCurrency || savedBaseCurrency();
}

function convertAmount(amount, currency, target = baseCurrency()) {
  const rates = state.settings?.rates || { USD: 1 };
  const fromRate = Number(rates[currency]) || 1;
  const targetRate = Number(rates[target]) || 1;
  return (Number(amount) || 0) / fromRate * targetRate;
}

function formatMoney(amount, currency = baseCurrency()) {
  const locales = { zh: 'zh-CN', en: 'en-US', ja: 'ja-JP' };
  try {
    return new Intl.NumberFormat(locales[currentLanguage] || 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2
    }).format(amount);
  } catch {
    return `${currency} ${Number(amount || 0).toFixed(2)}`;
  }
}

function monthlyAmount(item) {
  const amount = convertAmount(item.price, item.currency);
  if (item.status !== 'active') return 0;
  return monthlyCycleAmount(amount, item.billingCycle);
}

function monthlyOriginalAmount(item) {
  if (item.status !== 'active') return 0;
  return monthlyCycleAmount(Number(item.price) || 0, item.billingCycle);
}

function monthlyCycleAmount(amount, billingCycle) {
  if (billingCycle === 'weekly') return amount * 52 / 12;
  if (billingCycle === 'monthly') return amount;
  if (billingCycle === 'quarterly') return amount / 3;
  if (billingCycle === 'yearly') return amount / 12;
  return 0;
}

function annualAmount(item) {
  const amount = convertAmount(item.price, item.currency);
  if (item.status !== 'active') return 0;
  if (item.billingCycle === 'weekly') return amount * 52;
  if (item.billingCycle === 'monthly') return amount * 12;
  if (item.billingCycle === 'quarterly') return amount * 4;
  if (item.billingCycle === 'yearly') return amount;
  return 0;
}

function daysUntil(dateString) {
  if (!dateString) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const target = new Date(`${dateString}T00:00:00`).getTime();
  if (Number.isNaN(target)) return null;
  return Math.ceil((target - today) / 86400000);
}

function formatDate(dateString) {
  if (!dateString) return t('date.unset');
  const locales = { zh: 'zh-CN', en: 'en-US', ja: 'ja-JP' };
  try {
    return new Intl.DateTimeFormat(locales[currentLanguage] || 'en-US', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(`${dateString}T00:00:00`));
  } catch {
    return dateString;
  }
}

function dueLabel(days) {
  if (days === null) return t('date.unset');
  if (days < 0) return t('date.overdue', { days: Math.abs(days) });
  if (days === 0) return t('date.today');
  return t('date.after', { days });
}

function filteredItems() {
  const query = state.filters.query.trim().toLowerCase();
  return state.subscriptions.filter((item) => {
    const matchesQuery = !query || [
      item.name,
      item.currency,
      item.tags,
      item.paymentMethod,
      item.website
    ].some((value) => String(value || '').toLowerCase().includes(query));
    const matchesStatus = state.filters.status === 'all' || item.status === state.filters.status;
    const matchesType = state.filters.type === 'all' || item.type === state.filters.type;
    return matchesQuery && matchesStatus && matchesType;
  });
}

function renderDashboard() {
  const activeItems = state.subscriptions.filter((item) => item.status === 'active');
  const monthly = activeItems.reduce((sum, item) => sum + monthlyAmount(item), 0);
  const annual = activeItems.reduce((sum, item) => sum + annualAmount(item), 0);
  const upcoming = activeItems
    .map((item) => ({ ...item, days: daysUntil(item.nextRenewal) }))
    .filter((item) => item.days !== null)
    .sort((left, right) => left.days - right.days);
  const dueSoon = upcoming.filter((item) => item.days <= 30);

  const stats = [
    [t('stats.monthly'), formatMoney(monthly), 'teal'],
    [t('stats.annual'), formatMoney(annual), 'amber'],
    [t('stats.due30'), `${dueSoon.length} ${t('unit.items')}`, 'rose'],
    [t('stats.active'), `${activeItems.length} ${t('unit.items')}`, 'lime']
  ];

  elements.statGrid.innerHTML = stats
    .map(([label, value, color]) => `
      <article class="stat-card">
        <div class="stat-accent" style="background: var(--${color})"></div>
        <p>${escapeHtml(label)}</p>
        <strong>${escapeHtml(value)}</strong>
      </article>
    `)
    .join('');

  elements.renewalCount.textContent = upcoming.length ? `${upcoming.length} ${t('unit.items')}` : '';
  elements.upcomingList.innerHTML = upcoming.slice(0, 8).length
    ? upcoming.slice(0, 8).map(renderMiniRow).join('')
    : `<div class="empty-state">${escapeHtml(t('empty.renewal'))}</div>`;

  const byCurrency = new Map();
  for (const item of activeItems) {
    const key = item.currency || baseCurrency();
    const current = byCurrency.get(key) || { original: 0, converted: 0, count: 0 };
    current.original += monthlyOriginalAmount(item);
    current.converted += monthlyAmount(item);
    current.count += 1;
    byCurrency.set(key, current);
  }
  const currencyGroups = [...byCurrency.entries()].sort((a, b) => b[1].converted - a[1].converted);
  const max = Math.max(...currencyGroups.map((entry) => entry[1].converted), 1);
  elements.baseCurrencyLabel.textContent = t('label.convertedTo', { currency: currencyLabel(baseCurrency()) });
  elements.currencyGroupList.innerHTML = currencyGroups.length
    ? currencyGroups.slice(0, 8).map(([currency, group]) => {
        const width = Math.max(5, Math.round(group.converted / max * 100));
        return `
          <div class="currency-row">
            <div class="row-main">
              <span>${escapeHtml(currencyLabel(currency))} · ${escapeHtml(group.count)} ${escapeHtml(t('unit.items'))}</span>
              <strong>${escapeHtml(formatMoney(group.original, currency))}</strong>
            </div>
            <div class="progress-track">
              <div class="progress-bar" style="--value: ${width}%"></div>
            </div>
          </div>
        `;
      }).join('')
    : `<div class="empty-state">${escapeHtml(t('empty.currency'))}</div>`;
}

function renderMiniRow(item) {
  const amount = formatMoney(convertAmount(item.price, item.currency));
  return `
    <div class="mini-row">
      <div class="row-main">
        <span>${escapeHtml(item.name)}</span>
        <strong>${escapeHtml(dueLabel(item.days))}</strong>
      </div>
      <div class="item-meta">
        <span>${escapeHtml(formatDate(item.nextRenewal))}</span>
        <span>${escapeHtml(amount)}</span>
        <span>${escapeHtml(cycleLabel(item.billingCycle) || item.billingCycle)}</span>
      </div>
    </div>
  `;
}

function renderItems() {
  const items = filteredItems().sort((left, right) => {
    const leftDays = daysUntil(left.nextRenewal);
    const rightDays = daysUntil(right.nextRenewal);
    return (leftDays ?? 99999) - (rightDays ?? 99999);
  });

  elements.itemList.innerHTML = items.length
    ? items.map(renderItemCard).join('')
    : `<div class="empty-state">${escapeHtml(t('empty.items'))}</div>`;
}

function findIcon(iconId) {
  return state.icons.find((icon) => icon.id === iconId);
}

function itemIconData(item) {
  return findIcon(item.iconId)?.iconData || item.iconData || '';
}

function renderItemIcon(item) {
  const iconData = itemIconData(item);
  if (iconData) {
    return `
      <img
        class="item-badge item-icon"
        src="${escapeHtml(iconData)}"
        alt=""
        loading="lazy"
      />
    `;
  }

  return `
    <div class="item-badge fallback-icon">
      ${escapeHtml(item.name.slice(0, 1).toUpperCase())}
    </div>
  `;
}

function renderItemCard(item) {
  const converted = formatMoney(convertAmount(item.price, item.currency));
  const original = formatMoney(item.price, item.currency);
  const days = daysUntil(item.nextRenewal);
  const website = safeUrl(item.website);
  const title = website
    ? `<a href="${escapeHtml(website)}" target="_blank" rel="noreferrer">${escapeHtml(item.name)}</a>`
    : escapeHtml(item.name);
  const actions = state.isAdmin
    ? `
      <div class="item-actions">
        <button class="ghost-button" type="button" data-action="renew" title="${escapeHtml(t('action.renew'))}">${escapeHtml(t('action.renew'))}</button>
        <button class="ghost-button" type="button" data-action="edit" title="${escapeHtml(t('action.edit'))}">${escapeHtml(t('action.edit'))}</button>
        <button class="danger-button" type="button" data-action="delete" title="${escapeHtml(t('action.delete'))}">${escapeHtml(t('action.delete'))}</button>
      </div>
    `
    : '';

  return `
    <article class="item-card" data-id="${escapeHtml(item.id)}">
      ${renderItemIcon(item)}
      <div class="item-body">
        <div class="item-title">
          ${title}
          <span class="pill">${escapeHtml(statusLabel(item.status) || item.status)}</span>
        </div>
        <div class="item-meta">
          <span>${escapeHtml(typeLabel(item.type) || item.type)}</span>
          <span>${escapeHtml(original)}</span>
          <span>${escapeHtml(converted)}</span>
          <span>${escapeHtml(cycleLabel(item.billingCycle) || item.billingCycle)}</span>
          <span>${escapeHtml(dueLabel(days))}</span>
        </div>
      </div>
      ${actions}
    </article>
  `;
}

function iconSelectEntries() {
  return [
    ['', t('field.iconNone')],
    ...state.icons.map((icon) => [icon.id, icon.name || 'Icon'])
  ];
}

function renderIconSelect(selected = '') {
  fillSelect(elements.itemIconSelect, iconSelectEntries(), selected);
}

function renderIcons() {
  renderIconSelect(elements.itemIconSelect.value || '');
  if (!elements.iconLibraryList) return;

  elements.iconLibraryList.innerHTML = state.icons.length
    ? state.icons.map((icon) => `
        <article class="icon-card" data-id="${escapeHtml(icon.id)}">
          <img class="item-icon-preview" src="${escapeHtml(icon.iconData)}" alt="" loading="lazy" />
          <input class="icon-name-input" value="${escapeHtml(icon.name || 'Icon')}" maxlength="80" />
          <div class="item-meta">
            <span>${escapeHtml(icon.mime || 'image')}</span>
            <span>${escapeHtml(icon.bytes || 0)} B</span>
          </div>
          <div class="button-row">
            <button class="ghost-button" type="button" data-action="save-icon">${escapeHtml(t('action.save'))}</button>
            <button class="danger-button" type="button" data-action="delete-icon">${escapeHtml(t('action.delete'))}</button>
          </div>
        </article>
      `).join('')
    : `<div class="empty-state">${escapeHtml(t('empty.icons'))}</div>`;
}

function renderSettings() {
  elements.allowGuests.checked = Boolean(state.settings?.allowGuests);

  fillSelect(
    elements.baseCurrencySelect,
    currencies.map((currency) => [currency, currencyLabel(currency)]),
    savedBaseCurrency()
  );

  const rates = state.settings?.rates || {};
  elements.rateGrid.innerHTML = currencies.map((currency) => `
    <label>
      ${escapeHtml(currencyLabel(currency))}
      <input
        class="rate-input"
        data-currency="${escapeHtml(currency)}"
        type="number"
        min="0.01"
        step="0.01"
        inputmode="decimal"
        value="${escapeHtml(rateInputValue(rates[currency]))}"
      />
    </label>
  `).join('');
  const rateMeta = state.settings?.rateMeta || {};
  const provider = rateMeta.provider === 'Frankfurter' ? 'Frankfurter' : t('label.rateManual');
  const rateDate = rateMeta.date ? ` · ${t('label.rateDate', { date: rateMeta.date })}` : '';
  const updatedAt = rateMeta.updatedAt
    ? ` · ${t('label.rateUpdated', { time: new Date(rateMeta.updatedAt).toLocaleString(htmlLangs[currentLanguage] || 'en') })}`
    : '';
  elements.rateUpdatedLabel.textContent = `${provider}${rateDate}${updatedAt}`;

  const notifications = state.settings?.notifications || {};
  elements.notificationEnabled.checked = Boolean(notifications.enabled);
  elements.notificationChannel.value = notifications.channel || 'pushover';
  elements.pushoverToken.value = notifications.pushoverToken || '';
  elements.pushoverUserKey.value = notifications.pushoverUserKey || '';
  elements.barkServerUrl.value = notifications.barkServerUrl || 'https://api.day.app';
  elements.barkDeviceKey.value = notifications.barkDeviceKey || '';
  elements.telegramBotToken.value = notifications.telegramBotToken || '';
  elements.telegramChatId.value = notifications.telegramChatId || '';
  elements.reminderDays.value = notifications.reminderDays ?? 3;
  renderNotificationFields();
}

function renderNotificationFields() {
  const channel = elements.notificationChannel.value || 'pushover';
  for (const field of elements.notificationFields) {
    field.hidden = field.dataset.channelField !== channel;
  }
}

function openItemDialog(item = null) {
  state.editingId = item?.id || null;
  elements.dialogTitle.textContent = item ? t('dialog.edit') : t('dialog.new');
  elements.deleteItemButton.hidden = !item;
  elements.itemForm.reset();
  state.currentIconData = '';
  elements.itemIconInput.value = '';
  renderIconSelect(item?.iconId || '');
  elements.itemIconPreview.src = itemIconData(item || {}) || '/logo.svg';

  const defaults = {
    type: 'subscription',
    currency: savedBaseCurrency(),
    billingCycle: 'monthly',
    status: 'active',
    autoRenewal: true
  };
  const data = { ...defaults, ...(item || {}) };

  for (const [key, value] of Object.entries(data)) {
    const field = elements.itemForm.elements[key];
    if (!field) continue;
    if (field.type === 'checkbox') {
      field.checked = Boolean(value);
    } else {
      field.value = value ?? '';
    }
  }

  elements.itemDialog.showModal();
}

function closeItemDialog() {
  elements.itemDialog.close();
  state.editingId = null;
}

function formPayload() {
  const form = elements.itemForm;
  const values = Object.fromEntries(new FormData(form).entries());
  return {
    ...values,
    price: Number(values.price || 0),
    autoRenewal: form.elements.autoRenewal.checked,
    iconId: values.iconId || '',
    iconData: ''
  };
}

function readIconFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      reject(new Error(t('error.iconType')));
      return;
    }

    if (file.size > 20 * 1024) {
      reject(new Error(t('error.iconSize')));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (image.naturalWidth !== 400 || image.naturalHeight !== 400) {
        reject(new Error(t('error.iconPixels')));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error(t('error.iconRead')));
      reader.readAsDataURL(file);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(t('error.iconUnreadable')));
    };
    image.src = objectUrl;
  });
}

async function handleIconUpload() {
  const file = elements.itemIconInput.files[0];
  try {
    state.currentIconData = await readIconFile(file);
    elements.itemIconSelect.value = '';
    elements.itemIconPreview.src = state.currentIconData || '/logo.svg';
    showToast(t('toast.iconLoaded'));
  } catch (error) {
    elements.itemIconInput.value = '';
    showToast(error.message || t('toast.iconInvalid'));
  }
}

async function uploadLibraryIcon() {
  const file = elements.iconLibraryInput.files[0];
  if (!file) return;
  const iconData = await readIconFile(file);
  const name = file.name.replace(/\.[^.]+$/, '').slice(0, 80) || 'Icon';
  const data = await api('/api/icons', {
    method: 'POST',
    body: { name, iconData }
  });
  state.icons = data.icons || [data.icon, ...state.icons].filter(Boolean);
  renderIcons();
  showToast(t('toast.iconSaved'));
}

async function saveLibraryIcon(id) {
  const card = [...elements.iconLibraryList.querySelectorAll('[data-id]')]
    .find((entry) => entry.dataset.id === id);
  const icon = state.icons.find((entry) => entry.id === id);
  if (!card || !icon) return;
  const name = card.querySelector('.icon-name-input')?.value || icon.name;
  const data = await api(`/api/icons/${id}`, {
    method: 'PUT',
    body: { name }
  });
  state.icons = data.icons || state.icons.map((entry) => (entry.id === id ? data.icon : entry));
  renderAll();
  showToast(t('toast.iconRenamed'));
}

async function deleteLibraryIcon(id) {
  const icon = state.icons.find((entry) => entry.id === id);
  if (!icon || !window.confirm(t('confirm.deleteIcon', { name: icon.name }))) return;
  const data = await api(`/api/icons/${id}`, { method: 'DELETE' });
  state.icons = data.icons || state.icons.filter((entry) => entry.id !== id);
  state.subscriptions = state.subscriptions.map((item) =>
    item.iconId === id ? { ...item, iconId: '' } : item
  );
  renderAll();
  showToast(t('toast.iconDeleted'));
}

async function saveItem(event) {
  event.preventDefault();
  const payload = formPayload();
  if (state.currentIconData) {
    const created = await api('/api/icons', {
      method: 'POST',
      body: {
        name: payload.name || 'Icon',
        iconData: state.currentIconData
      }
    });
    state.icons = created.icons || [created.icon, ...state.icons].filter(Boolean);
    payload.iconId = created.icon.id;
    payload.iconData = '';
    state.currentIconData = '';
  }
  const path = state.editingId ? `/api/subscriptions/${state.editingId}` : '/api/subscriptions';
  const method = state.editingId ? 'PUT' : 'POST';
  await api(path, { method, body: payload });
  closeItemDialog();
  await loadState();
  showToast(t('toast.saved'));
}

async function deleteItem(id) {
  const item = state.subscriptions.find((entry) => entry.id === id);
  if (!item || !window.confirm(t('confirm.deleteItem', { name: item.name }))) return;
  await api(`/api/subscriptions/${id}`, { method: 'DELETE' });
  await loadState();
  showToast(t('toast.deleted'));
}

async function advanceRenewal(id) {
  const item = state.subscriptions.find((entry) => entry.id === id);
  if (!item || !item.nextRenewal || item.billingCycle === 'once') return;

  const date = new Date(`${item.nextRenewal}T00:00:00`);
  if (item.billingCycle === 'weekly') date.setDate(date.getDate() + 7);
  if (item.billingCycle === 'monthly') date.setMonth(date.getMonth() + 1);
  if (item.billingCycle === 'quarterly') date.setMonth(date.getMonth() + 3);
  if (item.billingCycle === 'yearly') date.setFullYear(date.getFullYear() + 1);

  const nextRenewal = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');

  await api(`/api/subscriptions/${id}`, {
    method: 'PUT',
    body: {
      ...item,
      nextRenewal
    }
  });
  await loadState();
  showToast(t('toast.renewalUpdated'));
}

async function saveSettings(showSavedToast = true) {
  const rates = {};
  for (const input of document.querySelectorAll('.rate-input')) {
    const value = roundRate(input.value);
    if (value !== null) {
      rates[input.dataset.currency] = value;
      input.value = String(value);
    }
  }

  const data = await api('/api/settings', {
    method: 'PUT',
    body: {
      allowGuests: elements.allowGuests.checked,
      baseCurrency: elements.baseCurrencySelect.value,
      rates,
      notifications: {
        enabled: elements.notificationEnabled.checked,
        channel: elements.notificationChannel.value,
        pushoverToken: elements.pushoverToken.value,
        pushoverUserKey: elements.pushoverUserKey.value,
        barkServerUrl: elements.barkServerUrl.value,
        barkDeviceKey: elements.barkDeviceKey.value,
        telegramBotToken: elements.telegramBotToken.value,
        telegramChatId: elements.telegramChatId.value,
        reminderDays: Number(elements.reminderDays.value || 3)
      }
    }
  });
  state.settings = data.settings;
  state.guestAllowed = Boolean(data.settings?.allowGuests);
  renderAll();
  if (showSavedToast) showToast(t('toast.settingsSaved'));
}

async function refreshRates() {
  const originalText = elements.refreshRatesButton.textContent;
  elements.refreshRatesButton.disabled = true;
  elements.refreshRatesButton.textContent = t('toast.refreshing');
  try {
    const data = await api('/api/rates/refresh', { method: 'POST' });
    state.settings = data.settings;
    state.guestAllowed = Boolean(data.settings?.allowGuests);
    renderAll();

    const missing = data.rateInfo?.missing || [];
    if (missing.length) {
      showToast(t('toast.ratesPartial', { missing: missing.join(', ') }));
    } else {
      showToast(t('toast.ratesRefreshed'));
    }
  } finally {
    elements.refreshRatesButton.disabled = false;
    elements.refreshRatesButton.textContent = originalText;
  }
}

async function testNotification() {
  await saveSettings(false);
  await api('/api/notifications/test', { method: 'POST' });
  showToast(t('toast.notificationSent'));
}

async function exportData() {
  const response = await fetch('/api/export');
  if (!response.ok) {
    showToast(t('toast.exportFailed'));
    return;
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  const link = document.createElement('a');
  link.href = url;
  link.download = `subscription-dock-backup-${date}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importData(file) {
  if (!file) return;
  const text = await file.text();
  const data = JSON.parse(text);
  if (!window.confirm(t('confirm.import'))) return;
  const imported = await api('/api/import', {
    method: 'POST',
    body: data
  });
  state.settings = imported.settings;
  state.guestAllowed = Boolean(imported.settings?.allowGuests);
  state.icons = Array.isArray(imported.icons) ? imported.icons : [];
  state.subscriptions = imported.subscriptions;
  renderAll();
  showToast(t('toast.importDone'));
}

function switchSection(sectionId) {
  if (!state.isAdmin && ['settingsSection', 'iconsSection'].includes(sectionId)) {
    sectionId = 'dashboardSection';
  }

  for (const section of elements.sections) {
    section.hidden = section.id !== sectionId;
  }
  for (const button of elements.navButtons) {
    button.classList.toggle('active', button.dataset.section === sectionId);
  }

  const titles = {
    dashboardSection: t('nav.dashboard'),
    itemsSection: t('nav.items'),
    iconsSection: t('nav.icons'),
    settingsSection: t('nav.settings')
  };
  elements.pageTitle.textContent = titles[sectionId] || t('nav.dashboard');
}

function bindEvents() {
  elements.loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    elements.loginError.textContent = '';
    const values = Object.fromEntries(new FormData(elements.loginForm).entries());
    try {
      const data = await api('/api/login', {
        method: 'POST',
        body: values
      });
      showApp(data.user?.role === 'admin');
      await loadState();
    } catch (error) {
      elements.loginError.textContent = error.message;
    }
  });

  elements.guestButton.addEventListener('click', async () => {
    elements.loginError.textContent = '';
    try {
      showApp(false);
      await loadState();
    } catch (error) {
      showLogin();
      elements.loginError.textContent = error.message;
    }
  });

  elements.logoutButton.addEventListener('click', async () => {
    if (!state.isAdmin) {
      showLogin();
      return;
    }
    await api('/api/logout', { method: 'POST' });
    showLogin();
  });

  for (const button of elements.navButtons) {
    button.addEventListener('click', () => switchSection(button.dataset.section));
  }

  for (const select of elements.languageSelects) {
    select.addEventListener('change', () => setLanguage(select.value));
  }

  elements.searchInput.addEventListener('input', () => {
    state.filters.query = elements.searchInput.value;
    renderDashboard();
    renderItems();
  });

  elements.dashboardCurrencySelect.addEventListener('change', () => {
    state.viewCurrency = elements.dashboardCurrencySelect.value;
    renderDashboard();
    renderItems();
  });

  elements.statusFilter.addEventListener('change', () => {
    state.filters.status = elements.statusFilter.value;
    renderItems();
  });

  elements.typeFilter.addEventListener('change', () => {
    state.filters.type = elements.typeFilter.value;
    renderItems();
  });

  elements.quickAddButton.addEventListener('click', () => openItemDialog());
  elements.addItemButton.addEventListener('click', () => openItemDialog());
  elements.closeDialogButton.addEventListener('click', closeItemDialog);
  elements.itemForm.querySelector('[data-close-dialog]').addEventListener('click', closeItemDialog);
  elements.itemForm.addEventListener('submit', saveItem);
  elements.itemIconInput.addEventListener('change', handleIconUpload);
  elements.itemIconSelect.addEventListener('change', () => {
    state.currentIconData = '';
    const icon = findIcon(elements.itemIconSelect.value);
    elements.itemIconPreview.src = icon?.iconData || '/logo.svg';
  });

  elements.deleteItemButton.addEventListener('click', async () => {
    if (!state.editingId) return;
    await deleteItem(state.editingId);
    closeItemDialog();
  });

  elements.itemList.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const card = button.closest('[data-id]');
    const id = card?.dataset.id;
    const item = state.subscriptions.find((entry) => entry.id === id);
    if (!item) return;

    if (button.dataset.action === 'edit') openItemDialog(item);
    if (button.dataset.action === 'delete') await deleteItem(id);
    if (button.dataset.action === 'renew') await advanceRenewal(id);
  });

  elements.rateGrid.addEventListener('focusout', (event) => {
    if (!event.target.classList.contains('rate-input')) return;
    const value = roundRate(event.target.value);
    if (value !== null) event.target.value = String(value);
  });

  elements.saveAccessButton.addEventListener('click', saveSettings);
  elements.saveSettingsButton.addEventListener('click', saveSettings);
  elements.refreshRatesButton.addEventListener('click', refreshRates);
  elements.saveNotificationButton.addEventListener('click', saveSettings);
  elements.notificationChannel.addEventListener('change', renderNotificationFields);
  elements.testNotificationButton.addEventListener('click', testNotification);
  elements.uploadIconButton.addEventListener('click', () => elements.iconLibraryInput.click());
  elements.iconLibraryInput.addEventListener('change', async () => {
    try {
      await uploadLibraryIcon();
    } catch (error) {
      showToast(error.message || t('toast.iconUploadFailed'));
    } finally {
      elements.iconLibraryInput.value = '';
    }
  });
  elements.iconLibraryList.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const id = button.closest('[data-id]')?.dataset.id;
    if (!id) return;
    if (button.dataset.action === 'save-icon') await saveLibraryIcon(id);
    if (button.dataset.action === 'delete-icon') await deleteLibraryIcon(id);
  });
  elements.exportButton.addEventListener('click', exportData);
  elements.importButton.addEventListener('click', () => elements.importFile.click());
  elements.importFile.addEventListener('change', async () => {
    try {
      await importData(elements.importFile.files[0]);
    } catch (error) {
      showToast(error.message || t('toast.importFailed'));
    } finally {
      elements.importFile.value = '';
    }
  });
}

async function init() {
  setupStaticControls();
  bindEvents();

  const session = await api('/api/session');
  state.guestAllowed = Boolean(session.guestAllowed);
  elements.guestButton.hidden = !state.guestAllowed;
  if (session.authenticated) {
    showApp(session.user?.role === 'admin');
    await loadState();
  } else {
    showLogin();
  }
}

init().catch((error) => {
  showLogin();
  elements.loginError.textContent = error.message || t('error.startFailed');
});
