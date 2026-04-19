import { useState } from "react";
import Icon from "@/components/ui/icon";

type Tab = "donate" | "quests" | "profile";
type Rarity = "common" | "rare" | "epic" | "legendary";

interface DonateItem {
  id: number;
  name: string;
  description: string;
  price: number;
  icon: string;
  rarity: Rarity;
  tag?: string;
}

interface Quest {
  id: number;
  title: string;
  description: string;
  reward: number;
  icon: string;
  progress: number;
  total: number;
  completed: boolean;
}

const RARITY_CONFIG: Record<Rarity, { label: string; color: string; border: string }> = {
  common:    { label: "Обычный",     color: "text-gray-400",   border: "border-gray-600/40" },
  rare:      { label: "Редкий",      color: "text-blue-400",   border: "border-blue-500/40" },
  epic:      { label: "Эпический",   color: "text-purple-400", border: "border-purple-500/40" },
  legendary: { label: "Легендарный", color: "text-yellow-400", border: "border-yellow-500/50" },
};

// ─── Stars ────────────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: (i * 37.3 + 11) % 100,
  y: (i * 53.7 + 23) % 100,
  size: (i % 5) * 0.5 + 0.5,
  duration: (i % 4) + 2,
  delay: (i % 4),
}));

function Stars() {
  return (
    <div className="stars-bg">
      {STARS.map(s => (
        <div key={s.id} className="star" style={{
          left: `${s.x}%`, top: `${s.y}%`,
          width: `${s.size}px`, height: `${s.size}px`,
          "--duration": `${s.duration}s`, "--delay": `${s.delay}s`,
        } as React.CSSProperties} />
      ))}
    </div>
  );
}

// ─── Add Item Modal ───────────────────────────────────────────────────────────
function AddItemModal({ onClose, onAdd }: { onClose: () => void; onAdd: (item: Omit<DonateItem, "id">) => void }) {
  const [form, setForm] = useState({ name: "", description: "", price: "", icon: "", rarity: "common" as Rarity, tag: "" });
  const [error, setError] = useState("");

  const handle = () => {
    if (!form.name.trim()) { setError("Введи название"); return; }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) { setError("Введи корректную цену"); return; }
    if (!form.icon.trim()) { setError("Введи смайл/иконку"); return; }
    onAdd({ name: form.name.trim(), description: form.description.trim(), price: Number(form.price), icon: form.icon.trim(), rarity: form.rarity, tag: form.tag.trim() || undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="animate-slide-up w-full max-w-md rounded-2xl p-6 border-gradient-gold" style={{ background: "hsl(230 25% 8%)" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-yellow-400 text-lg font-bold text-glow-gold" style={{ fontFamily: "Cinzel, serif" }}>Новый товар</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-yellow-400 transition-colors"><Icon name="X" size={20} /></button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-gray-400 text-xs mb-1 block">Название *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Название товара" className="w-full px-3 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 outline-none"
                style={{ background: "hsl(230 25% 12%)", border: "1px solid hsl(260 20% 25%)" }} />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Смайл *</label>
              <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                placeholder="⚔️" className="w-full px-3 py-2.5 rounded-xl text-white text-2xl text-center placeholder-gray-600 outline-none"
                style={{ background: "hsl(230 25% 12%)", border: "1px solid hsl(260 20% 25%)" }} maxLength={4} />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Описание</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Описание товара..." rows={2}
              className="w-full px-3 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 outline-none resize-none"
              style={{ background: "hsl(230 25% 12%)", border: "1px solid hsl(260 20% 25%)" }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Цена (монеты) *</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="100" className="w-full px-3 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 outline-none"
                style={{ background: "hsl(230 25% 12%)", border: "1px solid hsl(260 20% 25%)" }} min={1} />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Пометка (необяз.)</label>
              <input value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                placeholder="ХИТ / НОВИНКА" className="w-full px-3 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 outline-none"
                style={{ background: "hsl(230 25% 12%)", border: "1px solid hsl(260 20% 25%)" }} />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Редкость</label>
            <div className="grid grid-cols-4 gap-2">
              {(["common", "rare", "epic", "legendary"] as Rarity[]).map(r => (
                <button key={r} onClick={() => setForm(f => ({ ...f, rarity: r }))}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-all border ${RARITY_CONFIG[r].color} ${
                    form.rarity === r ? RARITY_CONFIG[r].border : "border-transparent opacity-40"
                  }`}
                  style={{ background: form.rarity === r ? "hsl(230 25% 14%)" : "transparent" }}>
                  {RARITY_CONFIG[r].label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        <button onClick={handle} className="btn-buy w-full py-3 rounded-xl mt-5 flex items-center justify-center gap-2">
          <Icon name="Plus" size={16} />Добавить товар
        </button>
      </div>
    </div>
  );
}

// ─── Add Quest Modal ──────────────────────────────────────────────────────────
function AddQuestModal({ onClose, onAdd }: { onClose: () => void; onAdd: (q: Omit<Quest, "id" | "progress" | "completed">) => void }) {
  const [form, setForm] = useState({ title: "", description: "", reward: "", icon: "", total: "" });
  const [error, setError] = useState("");

  const handle = () => {
    if (!form.title.trim()) { setError("Введи название"); return; }
    if (!form.reward || isNaN(Number(form.reward)) || Number(form.reward) <= 0) { setError("Введи корректную награду"); return; }
    if (!form.total || isNaN(Number(form.total)) || Number(form.total) <= 0) { setError("Введи цель выполнения"); return; }
    if (!form.icon.trim()) { setError("Введи смайл"); return; }
    onAdd({ title: form.title.trim(), description: form.description.trim(), reward: Number(form.reward), icon: form.icon.trim(), total: Number(form.total) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="animate-slide-up w-full max-w-md rounded-2xl p-6 border-gradient-gold" style={{ background: "hsl(230 25% 8%)" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-yellow-400 text-lg font-bold text-glow-gold" style={{ fontFamily: "Cinzel, serif" }}>Новое задание</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-yellow-400 transition-colors"><Icon name="X" size={20} /></button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-gray-400 text-xs mb-1 block">Название *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Название задания" className="w-full px-3 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 outline-none"
                style={{ background: "hsl(230 25% 12%)", border: "1px solid hsl(260 20% 25%)" }} />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Смайл *</label>
              <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                placeholder="⚔️" className="w-full px-3 py-2.5 rounded-xl text-white text-2xl text-center placeholder-gray-600 outline-none"
                style={{ background: "hsl(230 25% 12%)", border: "1px solid hsl(260 20% 25%)" }} maxLength={4} />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Описание</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Что нужно сделать..." rows={2}
              className="w-full px-3 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 outline-none resize-none"
              style={{ background: "hsl(230 25% 12%)", border: "1px solid hsl(260 20% 25%)" }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Награда (монеты) *</label>
              <input type="number" value={form.reward} onChange={e => setForm(f => ({ ...f, reward: e.target.value }))}
                placeholder="50" className="w-full px-3 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 outline-none"
                style={{ background: "hsl(230 25% 12%)", border: "1px solid hsl(260 20% 25%)" }} min={1} />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Цель (кол-во) *</label>
              <input type="number" value={form.total} onChange={e => setForm(f => ({ ...f, total: e.target.value }))}
                placeholder="100" className="w-full px-3 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 outline-none"
                style={{ background: "hsl(230 25% 12%)", border: "1px solid hsl(260 20% 25%)" }} min={1} />
            </div>
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        <button onClick={handle} className="btn-buy w-full py-3 rounded-xl mt-5 flex items-center justify-center gap-2">
          <Icon name="Plus" size={16} />Добавить задание
        </button>
      </div>
    </div>
  );
}

// ─── Buy Modal ─────────────────────────────────────────────────────────────────
function BuyModal({ item, balance, onClose, onBuy }: {
  item: DonateItem; balance: number; onClose: () => void;
  onBuy: (nick: string, item: DonateItem) => Promise<void>;
}) {
  const [nick, setNick] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canAfford = balance >= item.price;

  const handleBuy = async () => {
    if (!nick.trim()) { setError("Введи ник!"); return; }
    if (!canAfford) { setError("Недостаточно монет!"); return; }
    setLoading(true);
    await onBuy(nick.trim(), item);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="animate-slide-up w-full max-w-md rounded-2xl p-6 relative border-gradient-gold" style={{ background: "hsl(230 25% 8%)" }}>
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, hsl(45 95% 55%), transparent)", filter: "blur(20px)" }} />
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-yellow-400 transition-colors">
          <Icon name="X" size={20} />
        </button>
        <div className="text-center mb-6">
          <div className="text-5xl mb-3 animate-float inline-block">{item.icon}</div>
          <h3 className="text-xl text-yellow-400 text-glow-gold mb-1" style={{ fontFamily: "Cinzel, serif", fontWeight: 700 }}>{item.name}</h3>
          {item.description && <p className="text-gray-400 text-sm">{item.description}</p>}
          <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full"
            style={{ background: "hsl(45 95% 55% / 0.15)", border: "1px solid hsl(45 95% 55% / 0.4)" }}>
            <span className="text-yellow-400 font-bold text-lg">⚡ {item.price}</span>
            <span className="text-gray-400 text-sm">монет</span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2 font-medium">Ник на сервере Minecraft</label>
          <input type="text" value={nick} onChange={e => { setNick(e.target.value); setError(""); }}
            placeholder="Введи свой ник..."
            className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none transition-all"
            style={{ background: "hsl(230 25% 12%)", border: "1px solid hsl(260 20% 25%)" }}
            onFocus={e => (e.target.style.borderColor = "hsl(45 95% 55% / 0.6)")}
            onBlur={e => (e.target.style.borderColor = "hsl(260 20% 25%)")} />
          {error && <p className="text-red-400 text-sm mt-1.5">{error}</p>}
        </div>
        <div className="flex items-center justify-between mb-5 p-3 rounded-xl" style={{ background: "hsl(230 25% 11%)" }}>
          <span className="text-gray-400 text-sm">Баланс после покупки:</span>
          <span className={`font-bold ${canAfford ? "text-yellow-400" : "text-red-400"}`}>
            {canAfford ? `⚡ ${balance - item.price} монет` : "Недостаточно монет"}
          </span>
        </div>
        <button onClick={handleBuy} disabled={loading || !canAfford}
          className="btn-buy w-full py-3.5 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading
            ? <><div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />Обработка...</>
            : <><Icon name="ShoppingBag" size={18} />Купить</>}
        </button>
      </div>
    </div>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function SuccessToast({ nick, item, onClose }: { nick: string; item: DonateItem; onClose: () => void }) {
  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-up max-w-sm w-full">
      <div className="rounded-2xl p-4 flex items-start gap-3 glow-gold"
        style={{ background: "hsl(230 25% 9%)", border: "1px solid hsl(45 95% 55% / 0.5)" }}>
        <div className="text-2xl">✅</div>
        <div>
          <p className="text-yellow-400 font-semibold">Покупка успешна!</p>
          <p className="text-gray-300 text-sm mt-0.5">
            <span className="text-white font-medium">{nick}</span> получит <span className="text-yellow-400">{item.name}</span>
          </p>
          <p className="text-gray-500 text-xs mt-1">Уведомление отправлено на почту</p>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-400 ml-auto"><Icon name="X" size={16} /></button>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function Index() {
  const [tab, setTab] = useState<Tab>("donate");
  const [balance, setBalance] = useState(0);
  const [items, setItems] = useState<DonateItem[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedItem, setSelectedItem] = useState<DonateItem | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [toast, setToast] = useState<{ nick: string; item: DonateItem } | null>(null);
  const [balanceBump, setBalanceBump] = useState(false);
  const [nextId, setNextId] = useState(1);

  const bump = () => { setBalanceBump(true); setTimeout(() => setBalanceBump(false), 400); };

  const addItem = (item: Omit<DonateItem, "id">) => {
    setItems(prev => [...prev, { ...item, id: nextId }]);
    setNextId(n => n + 1);
  };

  const addQuest = (q: Omit<Quest, "id" | "progress" | "completed">) => {
    setQuests(prev => [...prev, { ...q, id: nextId, progress: 0, completed: false }]);
    setNextId(n => n + 1);
  };

  const handleBuy = async (nick: string, item: DonateItem) => {
    try {
      await fetch("https://functions.poehali.dev/86d8522e-2351-46b5-9eef-46e604126a93", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nick, item_name: item.name, item_price: item.price, item_icon: item.icon }),
      });
    } catch (_) { /* не критично */ }

    setBalance(b => b - item.price);
    bump();
    setSelectedItem(null);
    setToast({ nick, item });
    setTimeout(() => setToast(null), 4500);
  };

  const claimQuest = (id: number) => {
    setQuests(qs => qs.map(q => {
      if (q.id === id && q.progress >= q.total && !q.completed) {
        setBalance(b => b + q.reward);
        bump();
        return { ...q, completed: true };
      }
      return q;
    }));
  };

  const tabs: { id: Tab; label: string; icon: "ShoppingBag" | "Sword" | "User" }[] = [
    { id: "donate",  label: "Донат",   icon: "ShoppingBag" },
    { id: "quests",  label: "Задания", icon: "Sword" },
    { id: "profile", label: "Профиль", icon: "User" },
  ];

  return (
    <div className="nebula-bg min-h-screen relative">
      <Stars />
      <div className="fixed top-1/4 -left-40 w-80 h-80 rounded-full opacity-10 animate-rotate-slow"
        style={{ background: "radial-gradient(circle, hsl(280 70% 55%), transparent)", filter: "blur(60px)" }} />
      <div className="fixed bottom-1/4 -right-40 w-80 h-80 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(210 90% 55%), transparent)", filter: "blur(60px)" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">

        {/* Header */}
        <header className="flex items-center justify-between mb-8 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl animate-pulse-gold"
              style={{ background: "hsl(45 95% 55% / 0.15)", border: "1px solid hsl(45 95% 55% / 0.4)" }}>
              🌌
            </div>
            <div>
              <h1 className="text-yellow-400 text-glow-gold text-lg leading-none" style={{ fontFamily: "Cinzel, serif", fontWeight: 700 }}>
                NebulaStore
              </h1>
              <p className="text-gray-500 text-xs">Minecraft донат</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${balanceBump ? "coin-bump" : ""}`}
            style={{ background: "hsl(45 95% 55% / 0.1)", border: "1px solid hsl(45 95% 55% / 0.35)" }}>
            <span className="text-lg">⚡</span>
            <span className="text-yellow-400 font-bold text-lg" style={{ fontFamily: "Cinzel, serif" }}>{balance}</span>
            <span className="text-gray-500 text-sm">монет</span>
          </div>
        </header>

        {/* Nav */}
        <nav className="flex gap-2 mb-8 p-1.5 rounded-2xl animate-slide-up"
          style={{ background: "hsl(230 25% 8%)", border: "1px solid hsl(260 20% 18%)" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 border ${
                tab === t.id ? "nav-tab-active" : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
              style={{ fontFamily: tab === t.id ? "Cinzel, serif" : undefined }}>
              <Icon name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </nav>

        {/* ── Donate ── */}
        {tab === "donate" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-yellow-400 text-glow-gold mb-1" style={{ fontFamily: "Cinzel, serif" }}>Магазин</h2>
                <p className="text-gray-500 text-sm">{items.length === 0 ? "Добавь первый товар кнопкой справа" : `${items.length} товар(ов)`}</p>
              </div>
              <button onClick={() => setShowAddItem(true)} className="btn-buy px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm">
                <Icon name="Plus" size={16} />Добавить
              </button>
            </div>

            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-700 p-16 text-center">
                <div className="text-5xl mb-4">🛒</div>
                <p className="text-gray-500 text-lg mb-2">Магазин пуст</p>
                <p className="text-gray-600 text-sm mb-6">Добавь первый товар — покупатели смогут его приобрести</p>
                <button onClick={() => setShowAddItem(true)} className="btn-buy px-6 py-3 rounded-xl inline-flex items-center gap-2">
                  <Icon name="Plus" size={16} />Добавить товар
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, i) => {
                  const rarity = RARITY_CONFIG[item.rarity];
                  return (
                    <div key={item.id}
                      className={`card-hover rounded-2xl p-5 border relative cursor-pointer animate-slide-up hover:shadow-lg ${rarity.border}`}
                      style={{ background: "hsl(230 25% 9%)", animationDelay: `${i * 0.07}s` }}
                      onClick={() => setSelectedItem(item)}>
                      {item.tag && (
                        <div className="absolute top-3 right-10 px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{ background: "hsl(45 95% 55% / 0.2)", color: "hsl(45 95% 65%)", border: "1px solid hsl(45 95% 55% / 0.4)" }}>
                          {item.tag}
                        </div>
                      )}
                      <button onClick={e => { e.stopPropagation(); setItems(p => p.filter(x => x.id !== item.id)); }}
                        className="absolute top-3 right-3 text-gray-600 hover:text-red-400 transition-colors z-10">
                        <Icon name="Trash2" size={14} />
                      </button>
                      <div className="text-4xl mb-3 animate-float inline-block" style={{ animationDelay: `${i * 0.3}s` }}>
                        {item.icon}
                      </div>
                      <div className={`text-xs font-medium mb-1 ${rarity.color}`}>{rarity.label}</div>
                      <h3 className="text-white font-semibold mb-1.5 text-base leading-tight">{item.name}</h3>
                      {item.description && <p className="text-gray-500 text-xs mb-4 leading-relaxed">{item.description}</p>}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-yellow-400 font-bold">⚡ {item.price}</span>
                          <span className="text-gray-600 text-xs">монет</span>
                        </div>
                        <button onClick={e => { e.stopPropagation(); setSelectedItem(item); }} className="btn-buy px-4 py-1.5 rounded-lg text-sm">
                          Купить
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Quests ── */}
        {tab === "quests" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-yellow-400 text-glow-gold mb-1" style={{ fontFamily: "Cinzel, serif" }}>Задания</h2>
                <p className="text-gray-500 text-sm">{quests.length === 0 ? "Добавь первое задание" : "Выполняй задания и получай монеты"}</p>
              </div>
              <button onClick={() => setShowAddQuest(true)} className="btn-buy px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm">
                <Icon name="Plus" size={16} />Добавить
              </button>
            </div>

            {quests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-700 p-16 text-center">
                <div className="text-5xl mb-4">⚔️</div>
                <p className="text-gray-500 text-lg mb-2">Заданий пока нет</p>
                <p className="text-gray-600 text-sm mb-6">Добавь задания — за выполнение игроки получат монеты</p>
                <button onClick={() => setShowAddQuest(true)} className="btn-buy px-6 py-3 rounded-xl inline-flex items-center gap-2">
                  <Icon name="Plus" size={16} />Добавить задание
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {quests.map((quest, i) => {
                  const pct = Math.min((quest.progress / quest.total) * 100, 100);
                  const isReady = quest.progress >= quest.total && !quest.completed;
                  return (
                    <div key={quest.id}
                      className={`rounded-2xl p-5 border animate-slide-up transition-all relative ${
                        quest.completed ? "border-green-500/30 opacity-60" : isReady ? "border-yellow-500/50 glow-gold" : "border-border"
                      }`}
                      style={{ background: "hsl(230 25% 9%)", animationDelay: `${i * 0.06}s` }}>
                      <button onClick={() => setQuests(p => p.filter(x => x.id !== quest.id))}
                        className="absolute top-4 right-4 text-gray-600 hover:text-red-400 transition-colors">
                        <Icon name="Trash2" size={14} />
                      </button>
                      <div className="flex items-start gap-4">
                        <div className="text-3xl flex-shrink-0">{quest.icon}</div>
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-white font-semibold">{quest.title}</h3>
                            <span className="text-yellow-400 font-bold text-sm ml-3 flex-shrink-0">⚡ +{quest.reward}</span>
                          </div>
                          {quest.description && <p className="text-gray-500 text-sm mb-3">{quest.description}</p>}
                          <div className="h-1.5 rounded-full mb-1.5" style={{ background: "hsl(230 25% 14%)" }}>
                            <div className="quest-progress h-full" style={{ width: `${quest.completed ? 100 : pct}%` }} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-xs">{quest.completed ? "Завершено" : `${quest.progress} / ${quest.total}`}</span>
                            {isReady && (
                              <button onClick={() => claimQuest(quest.id)} className="btn-buy px-4 py-1 rounded-lg text-xs">Забрать награду</button>
                            )}
                            {quest.completed && (
                              <span className="text-green-400 text-xs flex items-center gap-1">
                                <Icon name="Check" size={12} />Выполнено
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Profile ── */}
        {tab === "profile" && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-yellow-400 text-glow-gold mb-1" style={{ fontFamily: "Cinzel, serif" }}>Профиль</h2>
              <p className="text-gray-500 text-sm">Твоя история и достижения</p>
            </div>
            <div className="rounded-2xl p-6 mb-6 border-gradient-gold relative overflow-hidden" style={{ background: "hsl(230 25% 9%)" }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
                style={{ background: "radial-gradient(circle, hsl(45 95% 55%), transparent)", transform: "translate(30%, -30%)" }} />
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                  style={{ background: "hsl(45 95% 55% / 0.1)", border: "2px solid hsl(45 95% 55% / 0.4)" }}>🧑‍🚀</div>
                <div>
                  <h3 className="text-2xl text-white font-bold" style={{ fontFamily: "Cinzel, serif" }}>Игрок</h3>
                  <p className="text-yellow-400 text-sm mt-1">✦ Путник</p>
                  <p className="text-gray-600 text-xs mt-1.5">Добро пожаловать на сервер</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Баланс",  value: `⚡ ${balance}`, sub: "монет" },
                { label: "Товаров", value: String(items.length), sub: "в магазине" },
                { label: "Заданий", value: String(quests.filter(q => q.completed).length), sub: "выполнено" },
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl p-4 text-center border border-border animate-slide-up"
                  style={{ background: "hsl(230 25% 9%)", animationDelay: `${i * 0.08}s` }}>
                  <div className="text-yellow-400 font-bold text-xl" style={{ fontFamily: "Cinzel, serif" }}>{stat.value}</div>
                  <div className="text-gray-400 text-sm mt-0.5">{stat.label}</div>
                  <div className="text-gray-600 text-xs">{stat.sub}</div>
                </div>
              ))}
            </div>
            {quests.length > 0 && (
              <div className="rounded-2xl p-5 border border-border" style={{ background: "hsl(230 25% 9%)" }}>
                <h4 className="text-gray-300 font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Trophy" size={16} className="text-yellow-400" />Прогресс заданий
                </h4>
                <div className="space-y-3">
                  {quests.map(q => (
                    <div key={q.id} className="flex items-center gap-3">
                      <span className="text-lg w-8 flex-shrink-0">{q.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-sm">{q.title}</span>
                          <span className="text-gray-600 text-xs">{Math.min(Math.round((q.progress / q.total) * 100), 100)}%</span>
                        </div>
                        <div className="h-1 rounded-full" style={{ background: "hsl(230 25% 14%)" }}>
                          <div className="quest-progress h-full"
                            style={{ width: `${q.completed ? 100 : Math.min((q.progress / q.total) * 100, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showAddItem && <AddItemModal onClose={() => setShowAddItem(false)} onAdd={addItem} />}
      {showAddQuest && <AddQuestModal onClose={() => setShowAddQuest(false)} onAdd={addQuest} />}
      {selectedItem && (
        <BuyModal item={selectedItem} balance={balance} onClose={() => setSelectedItem(null)} onBuy={handleBuy} />
      )}
      {toast && <SuccessToast nick={toast.nick} item={toast.item} onClose={() => setToast(null)} />}
    </div>
  );
}