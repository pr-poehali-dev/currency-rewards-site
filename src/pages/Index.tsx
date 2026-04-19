import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "donate" | "quests" | "profile";

interface DonateItem {
  id: number;
  name: string;
  description: string;
  price: number;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
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

// ─── Data ─────────────────────────────────────────────────────────────────────
const DONATE_ITEMS: DonateItem[] = [
  { id: 1, name: "Набор Звёздного Следопыта", description: "Броня с эффектами свечения и меч со звёздными частицами", price: 150, icon: "⚔️", rarity: "legendary", tag: "ХИТ" },
  { id: 2, name: "Крылья Тьмы", description: "Декоративные крылья с тёмным шлейфом", price: 120, icon: "🦋", rarity: "epic" },
  { id: 3, name: "Набор Строителя", description: "x64 редких блоков для строительства", price: 60, icon: "🧱", rarity: "rare" },
  { id: 4, name: "Питомец Дракончик", description: "Маленький дракон следует за тобой повсюду", price: 200, icon: "🐉", rarity: "legendary", tag: "НОВИНКА" },
  { id: 5, name: "Префикс [ELITE]", description: "Золотой префикс в чате на 30 дней", price: 80, icon: "👑", rarity: "epic" },
  { id: 6, name: "Ресурс-пак «Туманность»", description: "Уникальный визуальный пакет ресурсов", price: 40, icon: "🎨", rarity: "common" },
];

const QUESTS: Quest[] = [
  { id: 1, title: "Первый Шаг", description: "Войди на сервер первый раз", reward: 10, icon: "🌟", progress: 1, total: 1, completed: true },
  { id: 2, title: "Шахтёр", description: "Добудь 100 блоков камня", reward: 25, icon: "⛏️", progress: 67, total: 100, completed: false },
  { id: 3, title: "Общительный", description: "Напиши 50 сообщений в чате", reward: 20, icon: "💬", progress: 23, total: 50, completed: false },
  { id: 4, title: "Строитель", description: "Построй дом из 200+ блоков", reward: 50, icon: "🏗️", progress: 0, total: 1, completed: false },
  { id: 5, title: "Охотник", description: "Убей 30 мобов", reward: 35, icon: "🗡️", progress: 12, total: 30, completed: false },
  { id: 6, title: "Исследователь", description: "Пройди 10 000 блоков", reward: 45, icon: "🗺️", progress: 3200, total: 10000, completed: false },
];

// ─── Rarity config ────────────────────────────────────────────────────────────
const RARITY_CONFIG = {
  common:    { label: "Обычный",     color: "text-gray-400",   border: "border-gray-600/40" },
  rare:      { label: "Редкий",      color: "text-blue-400",   border: "border-blue-500/40" },
  epic:      { label: "Эпический",   color: "text-purple-400", border: "border-purple-500/40" },
  legendary: { label: "Легендарный", color: "text-yellow-400", border: "border-yellow-500/50" },
};

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    duration: Math.random() * 4 + 2,
    delay: Math.random() * 4,
  }));

  return (
    <div className="stars-bg">
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            "--duration": `${s.duration}s`,
            "--delay": `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Buy Modal ─────────────────────────────────────────────────────────────────
function BuyModal({
  item,
  balance,
  onClose,
  onBuy,
}: {
  item: DonateItem;
  balance: number;
  onClose: () => void;
  onBuy: (nick: string, item: DonateItem) => void;
}) {
  const [nick, setNick] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canAfford = balance >= item.price;

  const handleBuy = async () => {
    if (!nick.trim()) { setError("Введи ник!"); return; }
    if (!canAfford) { setError("Недостаточно монет!"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    onBuy(nick.trim(), item);
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="animate-slide-up w-full max-w-md rounded-2xl p-6 relative border-gradient-gold"
        style={{ background: "hsl(230 25% 8%)" }}
      >
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, hsl(45 95% 55%), transparent)", filter: "blur(20px)" }}
        />

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-yellow-400 transition-colors">
          <Icon name="X" size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="text-5xl mb-3 animate-float inline-block">{item.icon}</div>
          <h3 className="text-xl text-yellow-400 text-glow-gold mb-1" style={{ fontFamily: "Cinzel, serif", fontWeight: 700 }}>
            {item.name}
          </h3>
          <p className="text-gray-400 text-sm">{item.description}</p>
          <div
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full"
            style={{ background: "hsl(45 95% 55% / 0.15)", border: "1px solid hsl(45 95% 55% / 0.4)" }}
          >
            <span className="text-yellow-400 font-bold text-lg">⚡ {item.price}</span>
            <span className="text-gray-400 text-sm">монет</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2 font-medium">Ник на сервере Minecraft</label>
          <input
            type="text"
            value={nick}
            onChange={e => { setNick(e.target.value); setError(""); }}
            placeholder="Введи свой ник..."
            className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none transition-all"
            style={{ background: "hsl(230 25% 12%)", border: "1px solid hsl(260 20% 25%)" }}
            onFocus={e => (e.target.style.borderColor = "hsl(45 95% 55% / 0.6)")}
            onBlur={e => (e.target.style.borderColor = "hsl(260 20% 25%)")}
          />
          {error && <p className="text-red-400 text-sm mt-1.5">{error}</p>}
        </div>

        <div
          className="flex items-center justify-between mb-5 p-3 rounded-xl"
          style={{ background: "hsl(230 25% 11%)" }}
        >
          <span className="text-gray-400 text-sm">Баланс после покупки:</span>
          <span className={`font-bold ${canAfford ? "text-yellow-400" : "text-red-400"}`}>
            {canAfford ? `⚡ ${balance - item.price} монет` : "Недостаточно монет"}
          </span>
        </div>

        <button
          onClick={handleBuy}
          disabled={loading || !canAfford}
          className="btn-buy w-full py-3.5 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Обработка...
            </>
          ) : (
            <>
              <Icon name="ShoppingBag" size={18} />
              Купить
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Success Toast ─────────────────────────────────────────────────────────────
function SuccessToast({ nick, item, onClose }: { nick: string; item: DonateItem; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-up max-w-sm w-full">
      <div
        className="rounded-2xl p-4 flex items-start gap-3 glow-gold"
        style={{ background: "hsl(230 25% 9%)", border: "1px solid hsl(45 95% 55% / 0.5)" }}
      >
        <div className="text-2xl">✅</div>
        <div>
          <p className="text-yellow-400 font-semibold">Покупка успешна!</p>
          <p className="text-gray-300 text-sm mt-0.5">
            <span className="text-white font-medium">{nick}</span> получит{" "}
            <span className="text-yellow-400">{item.name}</span>
          </p>
          <p className="text-gray-500 text-xs mt-1">Уведомление отправлено администратору</p>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-400 ml-auto">
          <Icon name="X" size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function Index() {
  const [tab, setTab] = useState<Tab>("donate");
  const [balance, setBalance] = useState(320);
  const [selectedItem, setSelectedItem] = useState<DonateItem | null>(null);
  const [toast, setToast] = useState<{ nick: string; item: DonateItem } | null>(null);
  const [quests, setQuests] = useState<Quest[]>(QUESTS);
  const [balanceBump, setBalanceBump] = useState(false);

  const profile = {
    nick: "StarPlayer_42",
    rank: "Звёздный Рыцарь",
    joined: "12 марта 2024",
    purchases: 3,
    totalSpent: 370,
  };

  const bump = () => {
    setBalanceBump(true);
    setTimeout(() => setBalanceBump(false), 400);
  };

  const handleBuy = (nick: string, item: DonateItem) => {
    setBalance(b => b - item.price);
    bump();
    setSelectedItem(null);
    setToast({ nick, item });
  };

  const handleClaimQuest = (questId: number) => {
    setQuests(qs =>
      qs.map(q => {
        if (q.id === questId && q.progress >= q.total && !q.completed) {
          setBalance(b => b + q.reward);
          bump();
          return { ...q, completed: true };
        }
        return q;
      })
    );
  };

  const tabs: { id: Tab; label: string; icon: "ShoppingBag" | "Sword" | "User" }[] = [
    { id: "donate",  label: "Донат",    icon: "ShoppingBag" },
    { id: "quests",  label: "Задания",  icon: "Sword" },
    { id: "profile", label: "Профиль",  icon: "User" },
  ];

  return (
    <div className="nebula-bg min-h-screen relative">
      <Stars />

      {/* Ambient orbs */}
      <div
        className="fixed top-1/4 -left-40 w-80 h-80 rounded-full opacity-10 animate-rotate-slow"
        style={{ background: "radial-gradient(circle, hsl(280 70% 55%), transparent)", filter: "blur(60px)" }}
      />
      <div
        className="fixed bottom-1/4 -right-40 w-80 h-80 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(210 90% 55%), transparent)", filter: "blur(60px)" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">

        {/* Header */}
        <header className="flex items-center justify-between mb-8 animate-slide-up">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl animate-pulse-gold"
              style={{ background: "hsl(45 95% 55% / 0.15)", border: "1px solid hsl(45 95% 55% / 0.4)" }}
            >
              🌌
            </div>
            <div>
              <h1 className="text-yellow-400 text-glow-gold text-lg leading-none" style={{ fontFamily: "Cinzel, serif", fontWeight: 700 }}>
                NebulaStore
              </h1>
              <p className="text-gray-500 text-xs">Minecraft донат</p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${balanceBump ? "coin-bump" : ""}`}
            style={{ background: "hsl(45 95% 55% / 0.1)", border: "1px solid hsl(45 95% 55% / 0.35)" }}
          >
            <span className="text-lg">⚡</span>
            <span className="text-yellow-400 font-bold text-lg" style={{ fontFamily: "Cinzel, serif" }}>{balance}</span>
            <span className="text-gray-500 text-sm">монет</span>
          </div>
        </header>

        {/* Nav */}
        <nav
          className="flex gap-2 mb-8 p-1.5 rounded-2xl animate-slide-up"
          style={{ background: "hsl(230 25% 8%)", border: "1px solid hsl(260 20% 18%)", animationDelay: "0.1s" }}
        >
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 border ${
                tab === t.id ? "nav-tab-active" : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
              style={{ fontFamily: tab === t.id ? "Cinzel, serif" : undefined }}
            >
              <Icon name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </nav>

        {/* ── Donate ── */}
        {tab === "donate" && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-yellow-400 text-glow-gold mb-1" style={{ fontFamily: "Cinzel, serif" }}>
                Магазин
              </h2>
              <p className="text-gray-500 text-sm">Улучши своё приключение уникальными предметами</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DONATE_ITEMS.map((item, i) => {
                const rarity = RARITY_CONFIG[item.rarity];
                return (
                  <div
                    key={item.id}
                    className={`card-hover rounded-2xl p-5 border relative cursor-pointer animate-slide-up hover:shadow-lg ${rarity.border}`}
                    style={{ background: "hsl(230 25% 9%)", animationDelay: `${i * 0.07}s` }}
                    onClick={() => setSelectedItem(item)}
                  >
                    {item.tag && (
                      <div
                        className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: "hsl(45 95% 55% / 0.2)", color: "hsl(45 95% 65%)", border: "1px solid hsl(45 95% 55% / 0.4)" }}
                      >
                        {item.tag}
                      </div>
                    )}

                    <div className="text-4xl mb-3 animate-float inline-block" style={{ animationDelay: `${i * 0.3}s` }}>
                      {item.icon}
                    </div>

                    <div className={`text-xs font-medium mb-1 ${rarity.color}`}>{rarity.label}</div>
                    <h3 className="text-white font-semibold mb-1.5 text-base leading-tight">{item.name}</h3>
                    <p className="text-gray-500 text-xs mb-4 leading-relaxed">{item.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-yellow-400 font-bold">⚡ {item.price}</span>
                        <span className="text-gray-600 text-xs">монет</span>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedItem(item); }}
                        className="btn-buy px-4 py-1.5 rounded-lg text-sm"
                      >
                        Купить
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Quests ── */}
        {tab === "quests" && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-yellow-400 text-glow-gold mb-1" style={{ fontFamily: "Cinzel, serif" }}>
                Задания
              </h2>
              <p className="text-gray-500 text-sm">Выполняй задания и получай монеты</p>
            </div>

            <div className="space-y-3">
              {quests.map((quest, i) => {
                const pct = Math.min((quest.progress / quest.total) * 100, 100);
                const isReady = quest.progress >= quest.total && !quest.completed;
                return (
                  <div
                    key={quest.id}
                    className={`rounded-2xl p-5 border animate-slide-up transition-all ${
                      quest.completed ? "border-green-500/30 opacity-60" : isReady ? "border-yellow-500/50 glow-gold" : "border-border"
                    }`}
                    style={{ background: "hsl(230 25% 9%)", animationDelay: `${i * 0.06}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl flex-shrink-0">{quest.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-white font-semibold">{quest.title}</h3>
                          <span className="text-yellow-400 font-bold text-sm ml-3 flex-shrink-0">⚡ +{quest.reward}</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-3">{quest.description}</p>

                        <div className="h-1.5 rounded-full mb-1.5" style={{ background: "hsl(230 25% 14%)" }}>
                          <div className="quest-progress h-full" style={{ width: `${quest.completed ? 100 : pct}%` }} />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-xs">
                            {quest.completed ? "Завершено" : `${quest.progress} / ${quest.total}`}
                          </span>
                          {isReady && (
                            <button onClick={() => handleClaimQuest(quest.id)} className="btn-buy px-4 py-1 rounded-lg text-xs">
                              Забрать награду
                            </button>
                          )}
                          {quest.completed && (
                            <span className="text-green-400 text-xs flex items-center gap-1">
                              <Icon name="Check" size={12} /> Выполнено
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Profile ── */}
        {tab === "profile" && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-yellow-400 text-glow-gold mb-1" style={{ fontFamily: "Cinzel, serif" }}>
                Профиль
              </h2>
              <p className="text-gray-500 text-sm">Твоя история и достижения</p>
            </div>

            <div
              className="rounded-2xl p-6 mb-6 border-gradient-gold relative overflow-hidden"
              style={{ background: "hsl(230 25% 9%)" }}
            >
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
                style={{ background: "radial-gradient(circle, hsl(45 95% 55%), transparent)", transform: "translate(30%, -30%)" }}
              />
              <div className="flex items-center gap-5">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                  style={{ background: "hsl(45 95% 55% / 0.1)", border: "2px solid hsl(45 95% 55% / 0.4)" }}
                >
                  🧑‍🚀
                </div>
                <div>
                  <h3 className="text-2xl text-white font-bold" style={{ fontFamily: "Cinzel, serif" }}>{profile.nick}</h3>
                  <p className="text-yellow-400 text-sm mt-1">✦ {profile.rank}</p>
                  <p className="text-gray-600 text-xs mt-1.5">На сервере с {profile.joined}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Баланс",    value: `⚡ ${balance}`, sub: "монет" },
                { label: "Покупок",   value: String(profile.purchases), sub: "всего" },
                { label: "Потрачено", value: String(profile.totalSpent), sub: "монет" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 text-center border border-border animate-slide-up"
                  style={{ background: "hsl(230 25% 9%)", animationDelay: `${i * 0.08}s` }}
                >
                  <div className="text-yellow-400 font-bold text-xl" style={{ fontFamily: "Cinzel, serif" }}>{stat.value}</div>
                  <div className="text-gray-400 text-sm mt-0.5">{stat.label}</div>
                  <div className="text-gray-600 text-xs">{stat.sub}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-5 border border-border" style={{ background: "hsl(230 25% 9%)" }}>
              <h4 className="text-gray-300 font-semibold mb-4 flex items-center gap-2">
                <Icon name="Trophy" size={16} className="text-yellow-400" />
                Прогресс заданий
              </h4>
              <div className="space-y-3">
                {quests.slice(0, 4).map(q => (
                  <div key={q.id} className="flex items-center gap-3">
                    <span className="text-lg w-8 flex-shrink-0">{q.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400 text-sm">{q.title}</span>
                        <span className="text-gray-600 text-xs">
                          {Math.min(Math.round((q.progress / q.total) * 100), 100)}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full" style={{ background: "hsl(230 25% 14%)" }}>
                        <div
                          className="quest-progress h-full"
                          style={{ width: `${q.completed ? 100 : Math.min((q.progress / q.total) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedItem && (
        <BuyModal
          item={selectedItem}
          balance={balance}
          onClose={() => setSelectedItem(null)}
          onBuy={handleBuy}
        />
      )}

      {toast && (
        <SuccessToast nick={toast.nick} item={toast.item} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
