import {
  Stack, Row, Grid, H1, H2, H3, Text, Card, CardBody, CardHeader,
  Pill, Button, Stat, Divider, Spacer, Callout,
  useHostTheme, useCanvasState,
} from "cursor/canvas";

function WireBox({
  label, height = 32, accent = false, muted = false, children, flex, style,
}: {
  label?: string; height?: number | string; accent?: boolean; muted?: boolean;
  children?: any; flex?: number; style?: any;
}) {
  const theme = useHostTheme();
  return (
    <div style={{
      height: typeof height === "number" ? height : undefined,
      minHeight: typeof height === "string" ? height : undefined,
      flex, background: accent ? theme.accent.primary + "22" : muted ? theme.fill.quaternary : theme.fill.secondary,
      border: `1px solid ${accent ? theme.accent.primary + "66" : theme.stroke.tertiary}`,
      borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "6px 8px", gap: 4, ...style,
    }}>
      {label && <span style={{ fontSize: 10, color: accent ? theme.accent.primary : theme.text.tertiary, fontWeight: 500, letterSpacing: "0.04em", textAlign: "center" }}>{label}</span>}
      {children}
    </div>
  );
}

function NavWire({ page }: { page?: string }) {
  const theme = useHostTheme();
  return (
    <WireBox label="" height={44} accent>
      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "0 4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 8, height: 8, background: theme.accent.primary, borderRadius: "50%" }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: theme.accent.primary, letterSpacing: "-0.02em" }}>MyBuild</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginLeft: 4 }}>
          {["ホーム", "ランキング", "車を探す"].map((l) => (
            <span key={l} style={{ fontSize: 10, color: l === page ? theme.accent.primary : theme.text.secondary, fontWeight: l === page ? 600 : 400 }}>{l}</span>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 10, color: theme.text.secondary }}>★ お気に入り</span>
          <span style={{ fontSize: 10, color: theme.text.tertiary }}>|</span>
          <span style={{ fontSize: 10, color: theme.text.secondary }}>ログアウト</span>
        </div>
      </div>
    </WireBox>
  );
}

function CompareBarWire() {
  const theme = useHostTheme();
  return (
    <div style={{ background: theme.bg.elevated, border: `1px solid ${theme.stroke.secondary}`, borderRadius: 8, padding: "8px 16px", display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
      <span style={{ fontSize: 10, color: theme.text.tertiary, flexShrink: 0 }}>比較カート:</span>
      <WireBox label="スープラ 2022" height={28} accent style={{ minWidth: 90 }} />
      <WireBox label="GR86 2023" height={28} accent style={{ minWidth: 80 }} />
      <div style={{ flex: 1 }} />
      <div style={{ background: theme.accent.primary, borderRadius: 4, padding: "4px 14px" }}>
        <span style={{ fontSize: 10, color: theme.text.onAccent, fontWeight: 600 }}>比較する →</span>
      </div>
      <span style={{ fontSize: 10, color: theme.text.tertiary }}>✕ クリア</span>
    </div>
  );
}

// ===== S-01 ログイン =====
function S01Login() {
  const theme = useHostTheme();
  return (
    <Stack gap={8}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, padding: "8px 0" }}>
        <div style={{ width: 10, height: 10, background: theme.accent.primary, borderRadius: "50%" }} />
        <span style={{ fontSize: 15, fontWeight: 800, color: theme.accent.primary, letterSpacing: "-0.02em" }}>MyBuild</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 16px" }}>
        <div style={{ width: 320, background: theme.fill.secondary, border: `1px solid ${theme.stroke.secondary}`, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.text.primary }}>ログイン</div>
            <div style={{ fontSize: 10, color: theme.text.tertiary, marginTop: 2 }}>MyBuildへようこそ</div>
          </div>
          {[{ label: "メールアドレス", ph: "you@example.com" }, { label: "パスワード", ph: "••••••••" }].map((f) => (
            <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 500, color: theme.text.secondary }}>{f.label}</span>
              <div style={{ background: theme.bg.editor, border: `1px solid ${theme.stroke.secondary}`, borderRadius: 6, height: 34, display: "flex", alignItems: "center", padding: "0 10px" }}>
                <span style={{ fontSize: 10, color: theme.text.quaternary }}>{f.ph}</span>
              </div>
            </div>
          ))}
          <div style={{ background: "#ef4444" + "18", border: `1px solid ${"#ef4444" + "44"}`, borderRadius: 6, padding: "6px 10px" }}>
            <span style={{ fontSize: 9, color: "#ef4444" }}>メールアドレスまたはパスワードが正しくありません</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 14, height: 14, border: `1px solid ${theme.stroke.secondary}`, borderRadius: 3 }} />
            <span style={{ fontSize: 9, color: theme.text.tertiary }}>ログイン状態を保持する</span>
          </div>
          <div style={{ background: theme.accent.primary, borderRadius: 6, padding: "9px 0", textAlign: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: theme.text.onAccent }}>ログイン</span>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: 9, color: theme.text.quaternary }}>※ アカウント登録は管理者が行います</span>
      </div>
    </Stack>
  );
}

// ===== S-02 ホーム =====
function S02Home() {
  const theme = useHostTheme();
  return (
    <Stack gap={10}>
      <NavWire page="ホーム" />
      <div style={{ background: theme.accent.primary + "18", border: `1px solid ${theme.accent.primary + "44"}`, borderRadius: 10, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 8, alignItems: "center", textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: theme.accent.primary, letterSpacing: "-0.02em" }}>クルマの性能を、数字で比べる。</div>
        <div style={{ fontSize: 10, color: theme.text.secondary }}>メーカー・車名・スペックで絞り込んで、理想の一台を見つけよう</div>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <div style={{ background: theme.accent.primary, borderRadius: 6, padding: "6px 18px" }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: theme.text.onAccent }}>車を探す →</span>
          </div>
          <div style={{ background: theme.fill.tertiary, border: `1px solid ${theme.stroke.secondary}`, borderRadius: 6, padding: "6px 18px" }}>
            <span style={{ fontSize: 10, color: theme.text.secondary }}>ランキングを見る</span>
          </div>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: theme.text.primary }}>最高速度ランキング TOP 5</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: theme.accent.primary }}>すべて見る →</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { rank: 1, model: "スープラ RZ", val: "250 km/h" },
            { rank: 2, model: "レクサス LC", val: "250 km/h" },
            { rank: 3, model: "GR Yaris RZ", val: "230 km/h" },
            { rank: 4, model: "GR86", val: "226 km/h" },
            { rank: 5, model: "クラウン RS", val: "220 km/h" },
          ].map((c) => (
            <div key={c.rank} style={{ flex: 1, background: theme.fill.secondary, border: `1px solid ${c.rank <= 3 ? theme.accent.primary + "55" : theme.stroke.tertiary}`, borderRadius: 8, padding: "10px 8px" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: c.rank <= 3 ? theme.accent.primary : theme.text.quaternary }}>#{c.rank}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: theme.text.primary, marginTop: 2 }}>{c.model}</div>
              <div style={{ fontSize: 9, color: theme.text.tertiary, marginTop: 2 }}>{c.val}</div>
              <div style={{ marginTop: 6, background: theme.accent.primary + "22", borderRadius: 3, padding: "3px 0", textAlign: "center" }}>
                <span style={{ fontSize: 8, color: theme.accent.primary }}>詳細 →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CompareBarWire />
    </Stack>
  );
}

// ===== S-03 ランキング =====
function S03Ranking() {
  const theme = useHostTheme();
  const [metric, setMetric] = useCanvasState<string>("ranking_metric_v2", "top_speed_kmh");
  const metrics = [
    { key: "top_speed_kmh", label: "最高速度", unit: "km/h", asc: false },
    { key: "max_power_ps", label: "最高出力", unit: "PS", asc: false },
    { key: "max_torque_nm", label: "最大トルク", unit: "Nm", asc: false },
    { key: "handling_score", label: "ハンドリング", unit: "pt", asc: false },
    { key: "acceleration_0_100_sec", label: "0-100加速", unit: "秒", asc: true },
    { key: "fuel_efficiency_km_per_l", label: "燃費", unit: "km/L", asc: false },
  ];
  const selectedMetric = metrics.find((m) => m.key === metric) ?? metrics[0];
  const cars = [
    { rank: 1, model: "スープラ RZ", year: 2023, val: "250" },
    { rank: 2, model: "レクサス LC 500", year: 2022, val: "250" },
    { rank: 3, model: "GR Yaris RZ", year: 2022, val: "230" },
    { rank: 4, model: "GR86", year: 2023, val: "226" },
    { rank: 5, model: "クラウン RS", year: 2023, val: "220" },
    { rank: 6, model: "ハリアー F Sport", year: 2022, val: "200" },
    { rank: 7, model: "カムリ WS", year: 2023, val: "195" },
    { rank: 8, model: "RAV4 Adventure", year: 2023, val: "190" },
    { rank: 9, model: "プリウス Z", year: 2023, val: "175" },
    { rank: 10, model: "アルファード Z", year: 2022, val: "180" },
  ];
  return (
    <Stack gap={10}>
      <NavWire page="ランキング" />
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: theme.text.primary }}>性能ランキング</span>
        <span style={{ fontSize: 10, color: theme.text.tertiary }}>上位10台</span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {metrics.map((m) => (
          <span key={m.key}>
            <Pill active={metric === m.key} onClick={() => setMetric(m.key)}>
              {m.label}{m.asc ? " ↑小順" : ""}
            </Pill>
          </span>
        ))}
      </div>
      <div style={{ background: theme.fill.secondary, border: `1px solid ${theme.stroke.tertiary}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "6px 12px", background: theme.fill.tertiary, borderBottom: `1px solid ${theme.stroke.tertiary}` }}>
          <span style={{ fontSize: 9, color: theme.text.tertiary, width: 28 }}>順位</span>
          <span style={{ fontSize: 9, color: theme.text.tertiary, flex: 1 }}>車両</span>
          <span style={{ fontSize: 9, color: theme.text.tertiary, width: 80, textAlign: "right" }}>{selectedMetric.label}（{selectedMetric.unit}）</span>
        </div>
        {cars.map((c, i) => {
          const barW = `${(parseInt(c.val) / 250) * 100}%`;
          return (
            <div key={c.rank} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: i < cars.length - 1 ? `1px solid ${theme.stroke.tertiary}` : "none", background: i % 2 === 0 ? "transparent" : theme.fill.tertiary + "22" }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: c.rank <= 3 ? theme.accent.primary : theme.text.quaternary, width: 28, textAlign: "center" }}>{c.rank}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: theme.text.primary }}>{c.model}</span>
                  <span style={{ fontSize: 9, color: theme.text.tertiary }}>{c.year}</span>
                </div>
                <div style={{ marginTop: 4, height: 3, background: theme.fill.tertiary, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: barW, height: "100%", background: c.rank <= 3 ? theme.accent.primary : theme.accent.primary + "55", borderRadius: 2 }} />
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: c.rank <= 3 ? theme.accent.primary : theme.text.primary, width: 80, textAlign: "right" }}>
                {c.val} <span style={{ fontSize: 8, fontWeight: 400 }}>{selectedMetric.unit}</span>
              </span>
            </div>
          );
        })}
      </div>
    </Stack>
  );
}

// ===== S-04 車検索 =====
function S04CarSearch() {
  const theme = useHostTheme();
  const cars = ["スープラ", "GR86", "GR Yaris", "プリウス", "クラウン", "RAV4"];
  return (
    <Stack gap={10}>
      <NavWire page="車を探す" />
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ flex: 1, background: theme.bg.editor, border: `1px solid ${theme.stroke.secondary}`, borderRadius: 6, height: 36, display: "flex", alignItems: "center", padding: "0 12px" }}>
          <span style={{ fontSize: 10, color: theme.text.quaternary }}>🔍　車名・グレードで検索...</span>
        </div>
        <div style={{ background: theme.accent.primary, borderRadius: 6, padding: "8px 16px" }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: theme.text.onAccent }}>検索</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 148, flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: theme.text.primary, marginBottom: 8 }}>絞り込み</div>
          <div style={{ background: theme.fill.secondary, border: `1px solid ${theme.stroke.tertiary}`, borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "メーカー", type: "select" }, { label: "駆動方式", type: "select" },
              { label: "燃料種別", type: "select" }, { label: "年式（下限）", type: "input" },
              { label: "年式（上限）", type: "input" }, { label: "価格（上限）", type: "input" },
            ].map((f) => (
              <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 9, color: theme.text.tertiary }}>{f.label}</span>
                <div style={{ background: theme.bg.editor, border: `1px solid ${theme.stroke.tertiary}`, borderRadius: 4, height: 24, display: "flex", alignItems: "center", padding: "0 8px" }}>
                  <span style={{ fontSize: 9, color: theme.text.quaternary }}>{f.type === "select" ? "▾ すべて" : "入力..."}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 2, background: theme.accent.primary, borderRadius: 4, padding: "5px 0", textAlign: "center" }}>
              <span style={{ fontSize: 9, color: theme.text.onAccent, fontWeight: 600 }}>絞り込む</span>
            </div>
            <div style={{ background: theme.fill.tertiary, borderRadius: 4, padding: "5px 0", textAlign: "center" }}>
              <span style={{ fontSize: 9, color: theme.text.secondary }}>リセット</span>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 9, color: theme.text.tertiary }}>15件 表示中（1〜12件）</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 9, color: theme.text.tertiary }}>並び順: メーカー ▾</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {cars.map((name) => (
              <div key={name} style={{ background: theme.fill.secondary, border: `1px solid ${theme.stroke.tertiary}`, borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ height: 48, background: theme.fill.tertiary, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 20 }}>🚗</span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: theme.text.primary }}>{name}</div>
                <div style={{ fontSize: 9, color: theme.text.tertiary }}>Toyota · 2023</div>
                <div style={{ fontSize: 9, color: theme.text.secondary }}>258 PS · FR · ¥499万</div>
                <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                  <div style={{ flex: 1, background: theme.accent.primary + "22", borderRadius: 3, padding: "4px 0", textAlign: "center" }}>
                    <span style={{ fontSize: 8, color: theme.accent.primary }}>詳細を見る</span>
                  </div>
                  <div style={{ background: theme.fill.tertiary, borderRadius: 3, padding: "4px 6px" }}>
                    <span style={{ fontSize: 8, color: theme.text.secondary }}>+ 比較</span>
                  </div>
                  <div style={{ background: theme.fill.tertiary, borderRadius: 3, padding: "4px 6px" }}>
                    <span style={{ fontSize: 9, color: theme.text.tertiary }}>★</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 4 }}>
            {["← 前", "1", "2", "→ 次"].map((p) => (
              <div key={p} style={{ background: p === "1" ? theme.accent.primary : theme.fill.tertiary, borderRadius: 4, padding: "4px 8px", minWidth: 24, textAlign: "center" }}>
                <span style={{ fontSize: 9, color: p === "1" ? theme.text.onAccent : theme.text.secondary }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CompareBarWire />
    </Stack>
  );
}

// ===== S-05 お気に入り =====
function S05Favorites() {
  const theme = useHostTheme();
  const favs = ["スープラ RZ", "GR86", "GR Yaris RZ"];
  return (
    <Stack gap={10}>
      <NavWire />
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: theme.text.primary }}>★ お気に入り</span>
        <span style={{ fontSize: 10, color: theme.text.tertiary }}>3台登録中</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {favs.map((name) => (
          <div key={name} style={{ background: theme.fill.secondary, border: `1px solid ${theme.accent.primary + "55"}`, borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ height: 60, background: theme.fill.tertiary, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 24 }}>🚗</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: theme.text.primary }}>{name}</div>
                <div style={{ fontSize: 9, color: theme.text.tertiary }}>Toyota · 2023</div>
              </div>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 14, color: theme.accent.primary }}>★</span>
            </div>
            <div style={{ fontSize: 9, color: theme.text.secondary }}>258 PS · 0-100: 5.2秒 · ¥499万</div>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ flex: 1, background: theme.accent.primary + "22", borderRadius: 4, padding: "5px 0", textAlign: "center" }}>
                <span style={{ fontSize: 9, color: theme.accent.primary }}>詳細を見る</span>
              </div>
              <div style={{ background: theme.fill.tertiary, borderRadius: 4, padding: "5px 8px" }}>
                <span style={{ fontSize: 9, color: theme.text.secondary }}>+ 比較</span>
              </div>
              <div style={{ background: "#ef4444" + "18", border: `1px solid ${"#ef4444" + "33"}`, borderRadius: 4, padding: "5px 8px" }}>
                <span style={{ fontSize: 9, color: "#ef4444" }}>解除</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: theme.fill.tertiary, borderRadius: 8, padding: "20px 0", textAlign: "center" }}>
        <div style={{ fontSize: 20, marginBottom: 4 }}>☆</div>
        <div style={{ fontSize: 10, color: theme.text.secondary }}>お気に入りが空の場合はここに表示されます</div>
        <div style={{ marginTop: 8, display: "inline-block", background: theme.accent.primary, borderRadius: 4, padding: "5px 14px" }}>
          <span style={{ fontSize: 9, color: theme.text.onAccent }}>車を探す →</span>
        </div>
      </div>
      <CompareBarWire />
    </Stack>
  );
}

// ===== S-06 車比較 =====
function S06Compare() {
  const theme = useHostTheme();
  const rows = [
    { label: "最高出力",    a: "258 PS",     b: "200 PS",     aWin: true },
    { label: "最大トルク",  a: "320 Nm",     b: "205 Nm",     aWin: true },
    { label: "0-100 km/h", a: "5.2 秒",     b: "6.3 秒",     aWin: true },
    { label: "最高速度",    a: "250 km/h",   b: "226 km/h",   aWin: true },
    { label: "ハンドリング",a: "9.2 pt",     b: "8.5 pt",     aWin: true },
    { label: "燃費",        a: "12.4 km/L",  b: "14.2 km/L",  aWin: false },
    { label: "車重",        a: "1,395 kg",   b: "1,270 kg",   aWin: false },
    { label: "価格",        a: "499 万円",   b: "298 万円",   aWin: false },
  ];
  return (
    <Stack gap={10}>
      <NavWire />
      <div style={{ fontSize: 13, fontWeight: 700, color: theme.text.primary }}>車両比較</div>
      <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
        <div style={{ width: 110, flexShrink: 0 }} />
        <div style={{ flex: 1, background: theme.accent.primary + "22", border: `1px solid ${theme.accent.primary + "55"}`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ height: 50, background: theme.fill.tertiary, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 20 }}>🚗</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.accent.primary }}>GR スープラ RZ</div>
          <div style={{ fontSize: 9, color: theme.text.tertiary }}>Toyota · 2023</div>
          <div style={{ marginTop: 4, fontSize: 9, color: theme.accent.primary }}>勝ち: 5項目</div>
        </div>
        <div style={{ flex: 1, background: theme.fill.secondary, border: `1px solid ${theme.stroke.secondary}`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ height: 50, background: theme.fill.tertiary, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 20 }}>🚗</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.text.primary }}>GR86</div>
          <div style={{ fontSize: 9, color: theme.text.tertiary }}>Toyota · 2023</div>
          <div style={{ marginTop: 4, fontSize: 9, color: "#22c55e" }}>勝ち: 3項目</div>
        </div>
      </div>
      <div style={{ background: theme.fill.secondary, border: `1px solid ${theme.stroke.tertiary}`, borderRadius: 8, overflow: "hidden" }}>
        {rows.map((r, i) => (
          <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderBottom: i < rows.length - 1 ? `1px solid ${theme.stroke.tertiary}` : "none", background: i % 2 === 0 ? "transparent" : theme.fill.tertiary + "22" }}>
            <span style={{ fontSize: 9, color: theme.text.tertiary, width: 104, flexShrink: 0 }}>{r.label}</span>
            <div style={{ flex: 1, textAlign: "center", background: r.aWin ? "#22c55e22" : "#ef444422", borderRadius: 4, padding: "4px 0" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: r.aWin ? "#22c55e" : "#ef4444" }}>{r.aWin ? "▲ " : "▼ "}{r.a}</span>
            </div>
            <div style={{ flex: 1, textAlign: "center", background: !r.aWin ? "#22c55e22" : "#ef444422", borderRadius: 4, padding: "4px 0" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: !r.aWin ? "#22c55e" : "#ef4444" }}>{!r.aWin ? "▲ " : "▼ "}{r.b}</span>
            </div>
          </div>
        ))}
      </div>
      <Card>
        <CardHeader>性能レーダーチャート比較</CardHeader>
        <CardBody>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <WireBox label="" height={160} muted flex={1}>
              <RadarSvgTwo />
            </WireBox>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <LegendDot color={useHostTheme().accent.primary} label="GR スープラ RZ" />
              <LegendDot color="#f97316" label="GR86" />
            </div>
          </div>
        </CardBody>
      </Card>
    </Stack>
  );
}

function RadarSvgTwo() {
  const theme = useHostTheme();
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <g transform="translate(70, 70)">
        {[22, 36, 50].map((r) => (
          <polygon key={r} points={Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i - Math.PI / 2; return `${r * Math.cos(a)},${r * Math.sin(a)}`; }).join(" ")} fill="none" stroke={theme.stroke.tertiary} strokeWidth="0.8" />
        ))}
        <polygon points={[55, 46, 50, 42, 48, 52].map((r, i) => { const a = (Math.PI / 3) * i - Math.PI / 2; return `${r * Math.cos(a)},${r * Math.sin(a)}`; }).join(" ")} fill={theme.accent.primary + "28"} stroke={theme.accent.primary} strokeWidth="2" />
        <polygon points={[42, 35, 40, 32, 38, 44].map((r, i) => { const a = (Math.PI / 3) * i - Math.PI / 2; return `${r * Math.cos(a)},${r * Math.sin(a)}`; }).join(" ")} fill={"#f9731628"} stroke={"#f97316"} strokeWidth="2" />
        {["出力", "トルク", "ハンド", "最高速", "加速", "燃費"].map((l, i) => { const a = (Math.PI / 3) * i - Math.PI / 2; const r = 62; return (<text key={l} x={r * Math.cos(a)} y={r * Math.sin(a)} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill={theme.text.tertiary}>{l}</text>); })}
      </g>
    </svg>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 16, height: 3, background: color, borderRadius: 2 }} />
      <Text size="small" tone="secondary">{label}</Text>
    </div>
  );
}

// ===== S-07 車詳細 =====
function S07CarDetail() {
  const theme = useHostTheme();
  const specs = [
    ["最高出力", "258 PS / 6,500 rpm"], ["最大トルク", "320 Nm / 1,600 rpm"],
    ["0-100 km/h", "5.2 秒"], ["最高速度", "250 km/h"],
    ["燃費", "12.4 km/L"], ["ハンドリング", "9.2 pt"],
    ["制動距離", "36 m (100-0)"], ["車重", "1,395 kg"],
    ["駆動方式", "FR"], ["変速機", "8速AT"],
    ["排気量", "2,998 cc"], ["車体タイプ", "クーペ"],
    ["乗車定員", "2名"], ["価格", "499 万円"],
  ];
  const parts = [
    { cat: "エンジンチューン", selected: "HKS スーパーパワーフロー", delta: "+15 PS" },
    { cat: "マフラー", selected: "", delta: "" },
    { cat: "サスペンション", selected: "", delta: "" },
    { cat: "ブレーキ", selected: "Brembo GT キット", delta: "-2 m" },
    { cat: "タイヤ", selected: "", delta: "" },
  ];
  return (
    <Stack gap={10}>
      <NavWire />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: theme.text.primary, letterSpacing: "-0.02em" }}>GR スープラ RZ</div>
          <div style={{ fontSize: 10, color: theme.text.tertiary }}>Toyota · 2023 · スポーツクーペ</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ background: theme.fill.tertiary, border: `1px solid ${theme.stroke.secondary}`, borderRadius: 5, padding: "5px 12px" }}>
          <span style={{ fontSize: 10, color: theme.text.secondary }}>+ 比較に追加</span>
        </div>
        <div style={{ background: theme.accent.primary + "22", border: `1px solid ${theme.accent.primary + "55"}`, borderRadius: 5, padding: "5px 12px" }}>
          <span style={{ fontSize: 10, color: theme.accent.primary }}>★ お気に入り</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: theme.text.primary, marginBottom: 6 }}>車両諸元</div>
          <div style={{ background: theme.fill.secondary, border: `1px solid ${theme.stroke.tertiary}`, borderRadius: 8, overflow: "hidden" }}>
            {specs.map(([k, v], i) => (
              <div key={k} style={{ display: "flex", alignItems: "center", padding: "6px 10px", background: i % 2 === 0 ? "transparent" : theme.fill.tertiary + "44", borderBottom: i < specs.length - 1 ? `1px solid ${theme.stroke.tertiary}` : "none" }}>
                <span style={{ fontSize: 9, color: theme.text.tertiary, width: 90, flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 10, color: theme.text.primary, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: theme.text.primary, marginBottom: 6 }}>性能チャート</div>
            <WireBox label="" height={170} muted>
              <RadarSvgDetail />
              <div style={{ display: "flex", gap: 12, marginTop: 2 }}>
                <LegendDot color={theme.accent.primary} label="純正" />
                <LegendDot color="#22c55e" label="シミュ後" />
              </div>
            </WireBox>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: theme.text.primary, marginBottom: 6 }}>パーツ交換シミュレーター</div>
            <div style={{ background: theme.fill.secondary, border: `1px solid ${theme.stroke.tertiary}`, borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              {parts.map((p) => (
                <div key={p.cat} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 9, color: theme.text.tertiary, width: 90, flexShrink: 0 }}>{p.cat}</span>
                  <div style={{ flex: 1, background: theme.bg.editor, border: `1px solid ${p.selected ? theme.accent.primary + "66" : theme.stroke.tertiary}`, borderRadius: 4, height: 24, display: "flex", alignItems: "center", padding: "0 8px" }}>
                    <span style={{ fontSize: 9, color: p.selected ? theme.text.primary : theme.text.quaternary }}>{p.selected || "▾ 選択..."}</span>
                  </div>
                  {p.delta && <span style={{ fontSize: 9, color: "#22c55e", fontWeight: 600, width: 42, textAlign: "right" }}>{p.delta}</span>}
                </div>
              ))}
              <Divider />
              <div style={{ display: "flex", gap: 6 }}>
                {[{ l: "出力", base: "258 PS", sim: "273 PS" }, { l: "制動", base: "36 m", sim: "34 m" }, { l: "燃費", base: "12.4", sim: "12.4" }].map((s) => (
                  <div key={s.l} style={{ flex: 1, textAlign: "center", background: theme.fill.tertiary, borderRadius: 5, padding: "5px 0" }}>
                    <div style={{ fontSize: 8, color: theme.text.tertiary }}>{s.l}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: theme.text.primary }}>{s.sim}</div>
                    {s.base !== s.sim && <div style={{ fontSize: 8, color: "#22c55e" }}>({s.base}から改善)</div>}
                  </div>
                ))}
              </div>
              <div style={{ background: theme.fill.tertiary, borderRadius: 5, padding: "5px 8px" }}>
                <span style={{ fontSize: 8, color: theme.text.quaternary }}>※ シミュレーション値は参考値です。実測値を保証するものではありません。</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CompareBarWire />
    </Stack>
  );
}

function RadarSvgDetail() {
  const theme = useHostTheme();
  return (
    <svg width="150" height="150" viewBox="0 0 150 150">
      <g transform="translate(75, 75)">
        {[24, 40, 56].map((r) => (
          <polygon key={r} points={Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i - Math.PI / 2; return `${r * Math.cos(a)},${r * Math.sin(a)}`; }).join(" ")} fill="none" stroke={theme.stroke.tertiary} strokeWidth="0.8" />
        ))}
        <polygon points={[58, 47, 52, 44, 50, 55].map((r, i) => { const a = (Math.PI / 3) * i - Math.PI / 2; return `${r * Math.cos(a)},${r * Math.sin(a)}`; }).join(" ")} fill={theme.accent.primary + "28"} stroke={theme.accent.primary} strokeWidth="2" />
        <polygon points={[65, 47, 52, 44, 50, 52].map((r, i) => { const a = (Math.PI / 3) * i - Math.PI / 2; return `${r * Math.cos(a)},${r * Math.sin(a)}`; }).join(" ")} fill={"#22c55e18"} stroke={"#22c55e"} strokeWidth="1.5" strokeDasharray="4 2" />
        {["出力", "トルク", "ハンド", "最高速", "加速", "燃費"].map((l, i) => { const a = (Math.PI / 3) * i - Math.PI / 2; const r = 68; return (<text key={l} x={r * Math.cos(a)} y={r * Math.sin(a)} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill={theme.text.tertiary}>{l}</text>); })}
      </g>
    </svg>
  );
}

// ===== 設計方針 =====
function DesignPrinciples() {
  const theme = useHostTheme();
  const principles = [
    { title: "共通ナビゲーション", items: ["ロゴ「MyBuild」（左端）—クリックでホームへ", "主要リンク: ホーム / ランキング / 車を探す", "右端: ★お気に入り / ログアウト", "ログイン前はナビなしのシンプルヘッダーのみ", "スマホでは「≡」ハンバーガーに折りたたむ"] },
    { title: "比較フローティングバー", items: ["比較カートに1台以上入ると画面下部に常時表示", "2台揃うと「比較する →」ボタンが有効化", "Pinia + localStorage でページ遷移後も保持", "✕ クリアでカートをリセット"] },
    { title: "お気に入り (★) UX", items: ["カード・詳細ページの両方に★ボタンを配置", "ログイン済みのみ有効（未ログインは自動リダイレクト）", "Ajax切替: 即時★反転→確認→失敗時ロールバック", "お気に入り一覧に「解除」ボタンを直接配置"] },
    { title: "比較カラーコーディング", items: ["▲緑: その項目で優れている値", "▼赤: その項目で劣っている値", "0-100加速・制動距離・車重は「小さい方が良い」として反転評価", "色+記号の二重表現でアクセシビリティを確保"] },
    { title: "レスポンシブ対応方針", items: ["デスクトップ (≥1024px): サイドバー+3列グリッド", "タブレット (768–1023px): サイドバー+2列グリッド", "スマホ (<768px): フィルター折りたたみ+1列", "比較バーはスマホでも底部固定"] },
    { title: "パーツシミュレーター", items: ["カテゴリごとに最大1パーツを選択", "選択と同時にレーダーチャートをリアルタイム更新", "差分は+緑/-赤で強調、免責文を常時表示", "シミュレーション後の性能で「比較カートに追加」も可能"] },
  ];
  return (
    <Stack gap={12}>
      <H2>UX・レイアウト設計方針</H2>
      <Grid columns={2} gap={10}>
        {principles.map((p) => (
          <div key={p.title}>
            <Card>
              <CardHeader>{p.title}</CardHeader>
              <CardBody>
                <Stack gap={4}>
                  {p.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 9, color: theme.accent.primary, marginTop: 2, flexShrink: 0 }}>—</span>
                      <Text size="small" tone="secondary">{item}</Text>
                    </div>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          </div>
        ))}
      </Grid>
    </Stack>
  );
}

const NOTES: Record<string, string[]> = {
  s01: ["ナビなし。ロゴのみのシンプルヘッダーでログインに集中させる。", "エラーはフィールド下に赤文字で具体的に表示。", "「ログイン状態を保持」チェックボックスを配置（remember_meトークン）。", "新規登録UIは公開しない。管理者がDBに直接インサートする方針。"],
  s02: ["ヒーロー検索バーを画面上部に大きく配置し、車を探す導線を明確化。", "ランキングTOP5をホームでプレビュー表示し、ランキング全体への誘導リンクを右端に設置。", "「車を探す」「ランキングを見る」の2CTAボタンで主要な2動線を分ける。"],
  s03: ["Pillタブで6指標（最高速/出力/トルク/ハンドリング/加速/燃費）を切り替え。GETパラメータで状態保持。", "各行に相対バーを表示し、数値の大小感を視覚的に伝える。", "TOP3はアクセントカラー強調。0-100加速タブには「↑小順」の注記を付与。"],
  s04: ["検索バー＋フィルターサイドバーの組み合わせで絞り込みを提供。", "カードに「詳細を見る」「＋比較」「★」の3アクションを集約。", "比較は最大2台。2台入ったらフローティングバーの「比較する」が有効化される。"],
  s05: ["お気に入りカードは検索画面と同じカードUIを流用。スタイルは一貫させる。", "「解除」ボタンを各カードに直接配置（一覧で完結できるUX）。", "お気に入りが0件のときは空状態UIと「車を探す」CTAを表示。"],
  s06: ["2台のヘッダーを横並びで表示。各車の「勝ち項目数」を直下に表示。", "▲緑/▼赤の色+記号で優劣を行ごとに表示。", "レーダーチャートに2系列を重ね描画。凡例で色分けを説明。"],
  s07: ["左: 全諸元テーブル（14項目）。右: レーダーチャート＋パーツシミュレーター。", "パーツ選択でレーダーチャートを即時更新（実線=純正、破線=シミュ後）。", "ヘッダー右端に「＋比較に追加」「★お気に入り」を常時配置。"],
};

const SCREENS = [
  { key: "s01", label: "S-01 ログイン" },
  { key: "s02", label: "S-02 ホーム" },
  { key: "s03", label: "S-03 ランキング" },
  { key: "s04", label: "S-04 車検索" },
  { key: "s05", label: "S-05 お気に入り" },
  { key: "s06", label: "S-06 車比較" },
  { key: "s07", label: "S-07 車詳細" },
  { key: "design", label: "設計方針" },
] as const;

type ScreenKey = typeof SCREENS[number]["key"];

export default function App() {
  const theme = useHostTheme();
  const [screen, setScreen] = useCanvasState<ScreenKey>("mybuild_screen_v2", "s01");
  return (
    <Stack gap={16} style={{ padding: 20, maxWidth: 820 }}>
      <div>
        <H1>MyBuild — 画面レイアウト設計</H1>
        <Text tone="secondary">車性能比較アプリ「MyBuild」の全7画面ワイヤーフレーム。タブを切り替えて確認してください。</Text>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {SCREENS.map((s) => (
          <span key={s.key}>
            <Pill active={screen === s.key} onClick={() => setScreen(s.key)}>{s.label}</Pill>
          </span>
        ))}
      </div>
      <Divider />
      <div style={{ background: theme.bg.chrome, border: `1px solid ${theme.stroke.secondary}`, borderRadius: 10, padding: 16 }}>
        {screen === "s01" && <S01Login />}
        {screen === "s02" && <S02Home />}
        {screen === "s03" && <S03Ranking />}
        {screen === "s04" && <S04CarSearch />}
        {screen === "s05" && <S05Favorites />}
        {screen === "s06" && <S06Compare />}
        {screen === "s07" && <S07CarDetail />}
        {screen === "design" && <DesignPrinciples />}
      </div>
      {screen !== "design" && NOTES[screen] && (
        <Card collapsible defaultOpen>
          <CardHeader trailing={<Pill size="sm">設計メモ</Pill>}>
            {SCREENS.find((s) => s.key === screen)?.label} — ポイント
          </CardHeader>
          <CardBody>
            <Stack gap={4}>
              {NOTES[screen].map((note, i) => (
                <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 10, color: theme.accent.primary, flexShrink: 0, marginTop: 1 }}>—</span>
                  <Text size="small" tone="secondary">{note}</Text>
                </div>
              ))}
            </Stack>
          </CardBody>
        </Card>
      )}
    </Stack>
  );
}
