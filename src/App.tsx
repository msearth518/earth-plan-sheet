import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Scan,
  Save,
  Send,
  Image as ImageIcon,
  X,
  Plus,
  Trash2,
  Lock, // 鍵マークのアイコンを追加
} from "lucide-react";

// ==========================================
// 1. 【重要】GASで新しく発行したURLを貼り付けてください
const GAS_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyPiHgh6z5E-ryEroQhAXv71yZK1U19f-aJNt-0UMIH9RL3D95iJvp4QtiIiQHlERrJ/exec";

// 2. 【お客様用】アプリを開くための「合言葉（パスワード）」
const APP_PASSWORD = "earth";

// 3. 【裏側の鍵】GAS側と一致させる秘密の文字列
const SECRET_TOKEN = "EarthSecret2026";
// ==========================================

const TABS = [
  "ネット防犯",
  "家電",
  "家具",
  "設備",
  "外構",
  "照明",
  "ｽｲｯﾁ・ｺﾝｾﾝﾄ",
];
const STAFF_LIST = ["不明", "露木", "佐々木", "佐藤"];

const defaultOptions = ["未選択", "新規/希望", "持込", "検討中", "不要"];
const exteriorOptions = ["未選択", "必要", "検討中", "不要"];

const INITIAL_DATA = {
  ネット防犯: [
    {
      id: "n1",
      name: "光回線",
      type: "request",
      status: "未選択",
      options: ["未選択", "導入予定", "検討中", "導入なし"],
      multiple: false,
      note: "",
    },
    {
      id: "n2",
      name: "ルーター・Wi-Fi機器",
      type: "request",
      status: "未選択",
      options: ["未選択", "導入予定", "検討中", "導入なし"],
      multiple: false,
      note: "",
    },
    {
      id: "n3",
      name: "インターホン（複数選択可）",
      type: "request",
      status: ["未選択"],
      options: [
        "未選択",
        "スマホ応対可",
        "宅配ボックス連携",
        "防犯カメラ連携",
        "屋外から解施錠可能",
        "検討中",
      ],
      multiple: true,
      note: "",
    },
    {
      id: "n6",
      name: "室内防犯カメラ",
      type: "request",
      status: "未選択",
      options: ["未選択", "新規・希望", "持ち込み", "検討中", "不要"],
      multiple: false,
      note: "",
    },
    {
      id: "n4",
      name: "屋外防犯カメラ",
      type: "request",
      status: "未選択",
      options: ["未選択", "新規・希望", "持ち込み", "検討中", "不要"],
      multiple: false,
      wireType: "",
      note: "",
    },
    {
      id: "n5",
      name: "スマートロック(電子錠)",
      type: "request",
      status: "未選択",
      options: ["未選択", "玄関ドア付属品", "別途機器用意", "検討中"],
      multiple: false,
      note: "",
    },
    {
      id: "n7",
      name: "IOT機器",
      type: "request",
      status: "未選択",
      options: ["未選択", "新規・希望", "持ち込み", "検討中", "不要"],
      multiple: false,
      note: "",
    },
  ],
  家電: [
    {
      id: "e1",
      name: "テレビ",
      type: "appliance",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      model: "",
      note: "",
      image: null,
      imageName: "",
      broadcasts: [],
      hdmiDevices: [
        {
          id: "hdmi_1",
          name: "レコーダー",
          model: "",
          image: null,
          imageName: "",
        },
        {
          id: "hdmi_2",
          name: "ゲーム機",
          model: "",
          image: null,
          imageName: "",
        },
      ],
    },
    {
      id: "e2",
      name: "冷蔵庫",
      type: "appliance",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      model: "",
      note: "",
      image: null,
      imageName: "",
    },
    {
      id: "e3",
      name: "冷凍庫",
      type: "appliance",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      model: "",
      note: "",
      image: null,
      imageName: "",
    },
    {
      id: "e4",
      name: "洗濯機",
      type: "appliance",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      model: "",
      note: "",
      image: null,
      imageName: "",
    },
    {
      id: "e5",
      name: "電子レンジ",
      type: "appliance",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      model: "",
      note: "",
      image: null,
      imageName: "",
    },
    {
      id: "e6",
      name: "炊飯器",
      type: "appliance",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      model: "",
      note: "",
      image: null,
      imageName: "",
    },
    {
      id: "e7",
      name: "掃除機",
      type: "appliance",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      model: "",
      note: "",
      image: null,
      imageName: "",
    },
    {
      id: "e8",
      name: "ロボット掃除機",
      type: "appliance",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      model: "",
      note: "",
      image: null,
      imageName: "",
    },
    {
      id: "e9",
      name: "空気清浄機",
      type: "appliance",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      model: "",
      note: "",
      image: null,
      imageName: "",
    },
  ],
  家具: [
    {
      id: "f1",
      name: "ソファ",
      type: "furniture",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      note: "",
      image: null,
      imageName: "",
    },
    {
      id: "f2",
      name: "ダイニングテーブル",
      type: "furniture",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      note: "",
      image: null,
      imageName: "",
    },
    {
      id: "f3",
      name: "ダイニングチェア",
      type: "furniture",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      note: "",
      image: null,
      imageName: "",
    },
    {
      id: "f4",
      name: "テレビボード",
      type: "furniture",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      note: "",
      image: null,
      imageName: "",
    },
    {
      id: "f5",
      name: "ベッド",
      type: "furniture",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      note: "",
      image: null,
      imageName: "",
    },
    {
      id: "f6",
      name: "デスク・学習机",
      type: "furniture",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      note: "",
      image: null,
      imageName: "",
    },
    {
      id: "f7",
      name: "収納棚・本棚",
      type: "furniture",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      note: "",
      image: null,
      imageName: "",
    },
  ],
  設備: [
    {
      id: "s1",
      name: "衣類乾燥機",
      type: "request",
      status: "未選択",
      options: defaultOptions,
      dryerType: "",
      note: "",
    },
    {
      id: "s2",
      name: "床暖房",
      type: "request",
      status: "未選択",
      options: defaultOptions,
      note: "",
    },
    {
      id: "s3",
      name: "脱衣室暖房",
      type: "request",
      status: "未選択",
      options: defaultOptions,
      note: "",
    },
  ],
  外構: [
    {
      id: "g1",
      name: "EV充電コンセント(200V)",
      type: "request",
      status: "未選択",
      options: exteriorOptions,
      note: "",
    },
    {
      id: "g2",
      name: "屋外防水コンセント",
      type: "request",
      status: "未選択",
      options: exteriorOptions,
      note: "",
    },
    {
      id: "g3",
      name: "外部水栓",
      type: "request",
      status: "未選択",
      options: exteriorOptions,
      note: "",
    },
    {
      id: "g4",
      name: "宅配ボックス",
      type: "request",
      status: "未選択",
      options: exteriorOptions,
      note: "",
    },
  ],
  照明: [
    {
      id: "l1",
      name: "玄関",
      type: "request",
      status: "未選択",
      options: [
        "未選択",
        "おまかせ",
        "人感センサー",
        "手動スイッチ",
        "間接照明",
      ],
      multiple: false,
      note: "",
    },
    {
      id: "l6",
      name: "階段・ホール",
      type: "request",
      status: "未選択",
      options: ["未選択", "おまかせ", "人感センサー", "手動ｽｲｯﾁ"],
      multiple: false,
      note: "",
    },
    {
      id: "l2",
      name: "リビング（複数選択可）",
      type: "request",
      status: ["未選択"],
      options: ["未選択", "おまかせ", "間接照明", "調光", "調色", "リモコン"],
      multiple: true,
      note: "",
    },
    {
      id: "l7",
      name: "寝室（複数選択可）",
      type: "request",
      status: ["未選択"],
      options: ["未選択", "おまかせ", "間接照明", "調光", "調色", "リモコン"],
      multiple: true,
      note: "",
    },
    {
      id: "l8",
      name: "居室・子供部屋（複数選択可）",
      type: "request",
      status: ["未選択"],
      options: ["未選択", "おまかせ", "間接照明", "調光", "調色", "リモコン"],
      multiple: true,
      note: "",
    },
  ],
  "ｽｲｯﾁ・ｺﾝｾﾝﾄ": [
    {
      id: "c7",
      name: "スイッチニッチ",
      type: "request",
      status: "未選択",
      options: ["未選択", "希望", "不要"],
      multiple: false,
      note: "",
    },
    {
      id: "c1",
      name: "ダイニング (ホットプレート等)",
      type: "request",
      status: "未選択",
      options: ["未選択", "必要", "検討中", "不要"],
      multiple: false,
      note: "",
    },
    {
      id: "c2",
      name: "ソファ脇 (スマホ充電等)",
      type: "request",
      status: "未選択",
      options: ["未選択", "必要", "検討中", "不要"],
      multiple: false,
      note: "",
    },
    {
      id: "c5",
      name: "ベッド枕元 (スマホ充電・照明等)",
      type: "request",
      status: "未選択",
      options: ["未選択", "必要", "検討中", "不要"],
      multiple: false,
      note: "",
    },
  ],
};

export default function PlanSheet() {
  // セキュリティ（ログイン）用の状態
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [staffName, setStaffName] = useState(STAFF_LIST[0]);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [data, setData] = useState(INITIAL_DATA);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRefs = useRef({});

  useEffect(() => {
    // ログイン済みかどうかもブラウザに保存する（毎回パスワードを打たせなくて済むように）
    const savedAuth = localStorage.getItem("earth_plan_auth");
    if (savedAuth === "true") setIsAuthenticated(true);

    const savedData = localStorage.getItem("earth_plan_data");
    const savedName = localStorage.getItem("earth_plan_name");
    const savedStaff = localStorage.getItem("earth_plan_staff");
    if (savedData) setData(JSON.parse(savedData));
    if (savedName) setCustomerName(savedName);
    if (savedStaff) setStaffName(savedStaff);
  }, []);

  // ログイン処理
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === APP_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("earth_plan_auth", "true");
    } else {
      setLoginError("合言葉が正しくありません");
      setTimeout(() => setLoginError(""), 3000);
    }
  };

  const updateStatus = (category, id, newStatus, isMultiple) => {
    setData((prev) => ({
      ...prev,
      [category]: prev[category].map((item) => {
        if (item.id !== id) return item;
        if (isMultiple) {
          let currentStatus = Array.isArray(item.status) ? item.status : [];
          if (newStatus === "未選択") return { ...item, status: ["未選択"] };
          currentStatus = currentStatus.filter((s) => s !== "未選択");
          if (currentStatus.includes(newStatus)) {
            currentStatus = currentStatus.filter((s) => s !== newStatus);
            if (currentStatus.length === 0) currentStatus = ["未選択"];
          } else {
            currentStatus = [...currentStatus, newStatus];
          }
          return { ...item, status: currentStatus };
        } else {
          return { ...item, status: newStatus };
        }
      }),
    }));
  };

  const updateField = (category, id, field, value) => {
    setData((prev) => ({
      ...prev,
      [category]: prev[category].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateHdmi = (itemId, hdmiId, field, value) => {
    setData((prev) => ({
      ...prev,
      家電: prev["家電"].map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          hdmiDevices: item.hdmiDevices.map((h) =>
            h.id === hdmiId ? { ...h, [field]: value } : h
          ),
        };
      }),
    }));
  };

  const addHdmi = (itemId) => {
    setData((prev) => ({
      ...prev,
      家電: prev["家電"].map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          hdmiDevices: [
            ...item.hdmiDevices,
            {
              id: `hdmi_${Date.now()}`,
              name: "",
              model: "",
              image: null,
              imageName: "",
            },
          ],
        };
      }),
    }));
  };

  const removeHdmi = (itemId, hdmiId) => {
    setData((prev) => ({
      ...prev,
      家電: prev["家電"].map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          hdmiDevices: item.hdmiDevices.filter((h) => h.id !== hdmiId),
        };
      }),
    }));
  };

  const handleHdmiImage = (itemId, hdmiId, event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setToastMessage(
        "画像サイズが大きすぎます。5MB以下の画像を選択してください。"
      );
      setTimeout(() => setToastMessage(""), 4000);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setData((prev) => ({
        ...prev,
        家電: prev["家電"].map((item) => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            hdmiDevices: item.hdmiDevices.map((h) =>
              h.id === hdmiId
                ? { ...h, image: reader.result, imageName: file.name }
                : h
            ),
          };
        }),
      }));
    };
    reader.readAsDataURL(file);
  };

  const addCustomItem = (category) => {
    const newItem = {
      id: `custom_${Date.now()}`,
      name: "",
      type: category === "家電" ? "appliance" : "furniture",
      status: "未選択",
      options: defaultOptions,
      w: "",
      d: "",
      h: "",
      model: "",
      note: "",
      image: null,
      imageName: "",
      isCustom: true,
    };
    setData((prev) => ({
      ...prev,
      [category]: [...prev[category], newItem],
    }));
  };

  const removeCustomItem = (category, id) => {
    setData((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item.id !== id),
    }));
  };

  const handleImageUpload = (category, id, event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setToastMessage(
        "画像サイズが大きすぎます。5MB以下の画像を選択してください。"
      );
      setTimeout(() => setToastMessage(""), 4000);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      updateField(category, id, "image", reader.result);
      updateField(category, id, "imageName", file.name);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (category, id) => {
    updateField(category, id, "image", null);
    updateField(category, id, "imageName", "");
  };

  const handleSave = () => {
    try {
      localStorage.setItem("earth_plan_data", JSON.stringify(data));
      localStorage.setItem("earth_plan_name", customerName);
      localStorage.setItem("earth_plan_staff", staffName);
      setToastMessage("データを一時保存しました！");
    } catch (e) {
      setToastMessage(
        "保存に失敗しました。画像のサイズが大きい可能性があります。"
      );
    }
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleSubmit = async () => {
    if (!window.confirm("この内容でデータを送信しますか？")) return;
    setIsSubmitting(true);
    setToastMessage(
      "データを送信・画像をアップロード中...（数分かかる場合があります）"
    );

    try {
      const formattedData = {};
      for (let key in data) {
        formattedData[key] = [];
        data[key].forEach((item) => {
          let finalNote = item.note || "";
          const finalName =
            item.isCustom && !item.name.trim()
              ? "（名称未入力の追加項目）"
              : item.name;

          if (item.id === "n4" && item.wireType)
            finalNote = `[接続方式: ${item.wireType}] ` + finalNote;
          if (item.id === "s1" && item.dryerType)
            finalNote = `[乾燥機タイプ: ${item.dryerType}] ` + finalNote;
          if (
            item.id === "e1" &&
            item.broadcasts &&
            item.broadcasts.length > 0
          ) {
            finalNote =
              `[視聴放送: ${item.broadcasts.join(" / ")}] ` + finalNote;
          }

          formattedData[key].push({
            ...item,
            name: finalName,
            status: Array.isArray(item.status)
              ? item.status.join(" / ")
              : item.status,
            note: finalNote,
          });

          if (
            item.id === "e1" &&
            item.hdmiDevices &&
            item.hdmiDevices.length > 0
          ) {
            item.hdmiDevices.forEach((hdmi) => {
              if (hdmi.name.trim() || hdmi.model.trim() || hdmi.image) {
                formattedData[key].push({
                  id: hdmi.id,
                  name: ` └ [TV接続] ${hdmi.name || "名称未定"}`,
                  type: "appliance",
                  status: "付帯機器",
                  w: "",
                  d: "",
                  h: "",
                  model: hdmi.model || "",
                  note: "",
                  image: hdmi.image,
                  imageName: hdmi.imageName,
                });
              }
            });
          }
        });
      }

      // 【セキュリティ】スパム防止用の鍵を一緒に送信する
      const payload = {
        customerName,
        staffName,
        data: formattedData,
        secretToken: SECRET_TOKEN,
      };

      await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
      });

      setToastMessage(
        "送信完了！担当者へ通知し、画像を共有フォルダに保存しました。"
      );
      localStorage.removeItem("earth_plan_data");
    } catch (e) {
      console.error(e);
      setToastMessage(
        "通信エラーが発生しました。電波の良いところで再度お試しください。"
      );
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToastMessage(""), 6000);
    }
  };

  // ーーーーーーーーーーーーーーーーーーーーーーーー
  // 認証前（未ログイン）のパスワード画面
  // ーーーーーーーーーーーーーーーーーーーーーーーー
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] text-[#4A4A4A] font-sans flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5E5] w-full max-w-sm text-center">
          <Lock className="mx-auto text-[#8C867B] mb-4" size={32} />
          <h1 className="text-lg tracking-widest text-[#8C867B] font-bold mb-6">
            EARTH INC.
            <br />
            PLAN SHEET
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            担当者からお伝えした
            <br />
            合言葉を入力してください
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="合言葉を入力"
              className="w-full border-b-2 border-[#DCD9D4] bg-transparent text-xl text-center focus:outline-none focus:border-[#8C867B] py-2 mb-4"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            {loginError && (
              <p className="text-red-500 text-sm mb-4">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#8C867B] text-white py-3 rounded-xl font-bold shadow-md hover:bg-[#7a746a] transition-colors mt-2"
            >
              ログイン
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ーーーーーーーーーーーーーーーーーーーーーーーー
  // 認証後（ログイン済み）のメインアプリ画面
  // ーーーーーーーーーーーーーーーーーーーーーーーー
  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#4A4A4A] font-sans pb-28 relative">
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-[#8C867B] text-white px-5 py-3 rounded-full shadow-xl z-[100] text-sm whitespace-nowrap transition-opacity">
          {toastMessage}
        </div>
      )}

      <header className="bg-white p-4 shadow-sm text-center sticky top-0 z-40">
        <h1 className="text-sm tracking-widest text-[#8C867B] mb-2 font-bold">
          EARTH INC. PLAN SHEET
        </h1>
        <div className="mb-3 text-xs text-gray-500 flex justify-center items-center gap-2">
          担当者：
          <select
            className="border rounded p-1 bg-gray-50 outline-none"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
          >
            {STAFF_LIST.map((staff) => (
              <option key={staff} value={staff}>
                {staff}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center items-end gap-2">
          <input
            type="text"
            className="border-b-2 border-[#DCD9D4] bg-transparent text-xl text-center focus:outline-none focus:border-[#8C867B] w-48"
            placeholder="お名前"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <span className="text-lg">様邸</span>
        </div>
      </header>

      <div className="overflow-x-auto bg-white border-b border-[#E5E5E5] sticky top-[95px] z-30 flex whitespace-nowrap px-2 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-[#8C867B] text-[#8C867B]"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {data[activeTab].map((item) => {
          const isUnselected = item.multiple
            ? item.status.includes("未選択")
            : item.status === "未選択";
          const isUnnecessary = item.multiple
            ? false
            : ["不要", "導入なし"].includes(item.status);
          const showDetails = !isUnselected && !isUnnecessary;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-4 shadow-sm transition-all border border-[#F0EFEF] ${
                isUnnecessary ? "opacity-50 bg-gray-50" : ""
              }`}
            >
              {item.isCustom ? (
                <div className="flex justify-between items-center mb-3 border-b pb-2">
                  <input
                    type="text"
                    placeholder="機器名を入力 (例: ワインセラー)"
                    className="font-bold text-lg border-b border-transparent focus:border-[#8C867B] outline-none w-2/3 bg-transparent p-1"
                    value={item.name}
                    onChange={(e) =>
                      updateField(activeTab, item.id, "name", e.target.value)
                    }
                  />
                  <button
                    onClick={() => removeCustomItem(activeTab, item.id)}
                    className="text-red-400 text-sm flex items-center gap-1"
                  >
                    <Trash2 size={16} /> 削除
                  </button>
                </div>
              ) : (
                <h3 className="font-bold text-lg mb-3">{item.name}</h3>
              )}

              <div className="flex flex-wrap gap-x-4 gap-y-3 mb-2">
                {item.options.map((opt) => {
                  if (item.type === "request" && opt === "持込") return null;
                  const isChecked = item.multiple
                    ? item.status.includes(opt)
                    : item.status === opt;
                  return (
                    <label
                      key={opt}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <input
                        type={item.multiple ? "checkbox" : "radio"}
                        name={
                          item.multiple
                            ? `status-${item.id}-${opt}`
                            : `status-${item.id}`
                        }
                        className="accent-[#8C867B] w-4 h-4"
                        checked={isChecked}
                        onChange={() =>
                          updateStatus(activeTab, item.id, opt, item.multiple)
                        }
                      />
                      <span
                        className={`text-sm ${
                          isChecked
                            ? "font-bold text-[#8C867B]"
                            : "text-gray-500"
                        }`}
                      >
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>

              {item.id === "n4" && !isUnselected && !isUnnecessary && (
                <div className="flex gap-4 mt-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-sm font-bold text-gray-700">
                    接続方式:
                  </span>
                  {["未定", "無線", "有線"].map((wire) => (
                    <label
                      key={wire}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`wire-${item.id}`}
                        className="accent-[#8C867B] w-4 h-4"
                        checked={item.wireType === wire}
                        onChange={() =>
                          updateField(activeTab, item.id, "wireType", wire)
                        }
                      />
                      <span
                        className={`text-sm ${
                          item.wireType === wire
                            ? "font-bold text-[#8C867B]"
                            : "text-gray-500"
                        }`}
                      >
                        {wire}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {item.id === "s1" && !isUnselected && !isUnnecessary && (
                <div className="flex flex-wrap gap-4 mt-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-sm font-bold text-gray-700">
                    タイプ:
                  </span>
                  {["未定", "ガス式", "電気式"].map((dType) => (
                    <label
                      key={dType}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`dryer-${item.id}`}
                        className="accent-[#8C867B] w-4 h-4"
                        checked={item.dryerType === dType}
                        onChange={() =>
                          updateField(activeTab, item.id, "dryerType", dType)
                        }
                      />
                      <span
                        className={`text-sm ${
                          item.dryerType === dType
                            ? "font-bold text-[#8C867B]"
                            : "text-gray-500"
                        }`}
                      >
                        {dType}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {item.id === "e1" && !isUnselected && !isUnnecessary && (
                <div className="flex flex-wrap gap-4 mt-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-sm font-bold text-gray-700">
                    視聴放送:
                  </span>
                  {["地上", "BS", "CS"].map((bType) => {
                    const isChecked = item.broadcasts?.includes(bType);
                    return (
                      <label
                        key={bType}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="accent-[#8C867B] w-4 h-4"
                          checked={isChecked}
                          onChange={(e) => {
                            const current = item.broadcasts || [];
                            const next = e.target.checked
                              ? [...current, bType]
                              : current.filter((b) => b !== bType);
                            updateField(activeTab, item.id, "broadcasts", next);
                          }}
                        />
                        <span
                          className={`text-sm ${
                            isChecked
                              ? "font-bold text-[#8C867B]"
                              : "text-gray-500"
                          }`}
                        >
                          {bType}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  showDetails
                    ? "max-h-fit opacity-100 mt-4"
                    : "max-h-0 opacity-0"
                }`}
              >
                {(item.type === "appliance" || item.type === "furniture") && (
                  <div className="space-y-3 mb-3 bg-[#FBFBFB] p-3 rounded-lg border border-gray-100">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="幅(W)mm"
                        className="w-1/3 border rounded p-2 text-sm bg-white focus:outline-none focus:border-[#8C867B]"
                        value={item.w}
                        onChange={(e) =>
                          updateField(activeTab, item.id, "w", e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="奥行(D)mm"
                        className="w-1/3 border rounded p-2 text-sm bg-white focus:outline-none focus:border-[#8C867B]"
                        value={item.d}
                        onChange={(e) =>
                          updateField(activeTab, item.id, "d", e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="高さ(H)mm"
                        className="w-1/3 border rounded p-2 text-sm bg-white focus:outline-none focus:border-[#8C867B]"
                        value={item.h}
                        onChange={(e) =>
                          updateField(activeTab, item.id, "h", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex gap-2 items-center">
                      {item.type === "appliance" && (
                        <input
                          type="text"
                          placeholder="品番 (任意)"
                          className="flex-1 border rounded p-2 text-sm bg-white focus:outline-none focus:border-[#8C867B]"
                          value={item.model}
                          onChange={(e) =>
                            updateField(
                              activeTab,
                              item.id,
                              "model",
                              e.target.value
                            )
                          }
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={(el) => (fileInputRefs.current[item.id] = el)}
                        onChange={(e) =>
                          handleImageUpload(activeTab, item.id, e)
                        }
                      />
                      <button
                        onClick={() => fileInputRefs.current[item.id].click()}
                        className={`flex-1 p-2 rounded border text-sm transition-colors flex items-center justify-center gap-1 ${
                          item.image
                            ? "bg-[#F2F0EB] text-[#8C867B] border-[#8C867B]"
                            : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <Camera size={16} />{" "}
                        {item.image ? "画像変更" : "写真・スクショを添付"}
                      </button>
                    </div>

                    {item.image && (
                      <div className="relative inline-block mt-2">
                        <img
                          src={item.image}
                          alt="添付プレビュー"
                          className="h-20 w-auto rounded border shadow-sm"
                        />
                        <button
                          onClick={() => removeImage(activeTab, item.id)}
                          className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full p-1 shadow hover:bg-gray-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <textarea
                  placeholder="特記事項・ご要望・品番等をご記入ください"
                  className="w-full border rounded-lg p-2 text-sm bg-white focus:outline-none focus:border-[#8C867B] h-20"
                  value={item.note}
                  onChange={(e) =>
                    updateField(activeTab, item.id, "note", e.target.value)
                  }
                />

                {item.id === "e1" && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-bold text-[#8C867B] mb-3">
                      HDMI接続機器 (レコーダー・ゲーム機など)
                    </h4>
                    {item.hdmiDevices?.map((hdmi) => (
                      <div
                        key={hdmi.id}
                        className="flex flex-col gap-2 mb-3 bg-[#FBFBFB] p-3 rounded border border-[#E5E5E5]"
                      >
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="機器名 (例: レコーダー)"
                            className="flex-1 border rounded p-2 text-sm focus:border-[#8C867B] outline-none"
                            value={hdmi.name}
                            onChange={(e) =>
                              updateHdmi(
                                item.id,
                                hdmi.id,
                                "name",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="text"
                            placeholder="品番(任意)"
                            className="flex-1 border rounded p-2 text-sm focus:border-[#8C867B] outline-none"
                            value={hdmi.model}
                            onChange={(e) =>
                              updateHdmi(
                                item.id,
                                hdmi.id,
                                "model",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex gap-2 items-center mt-1">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={(el) => (fileInputRefs.current[hdmi.id] = el)}
                            onChange={(e) =>
                              handleHdmiImage(item.id, hdmi.id, e)
                            }
                          />
                          <button
                            onClick={() =>
                              fileInputRefs.current[hdmi.id].click()
                            }
                            className={`flex-[4] p-2 rounded border text-sm transition-colors flex items-center justify-center gap-1 ${
                              hdmi.image
                                ? "bg-[#F2F0EB] text-[#8C867B] border-[#8C867B]"
                                : "bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            <Camera size={16} />{" "}
                            {hdmi.image ? "画像変更" : "写真・スクショ添付"}
                          </button>
                          <button
                            onClick={() => removeHdmi(item.id, hdmi.id)}
                            className="flex-[1] p-2 text-red-400 border rounded bg-white hover:bg-red-50 flex items-center justify-center"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {hdmi.image && (
                          <div className="relative inline-block mt-2">
                            <img
                              src={hdmi.image}
                              alt="プレビュー"
                              className="h-20 w-auto rounded border shadow-sm"
                            />
                            <button
                              onClick={() =>
                                updateHdmi(item.id, hdmi.id, "image", null)
                              }
                              className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full p-1 shadow hover:bg-gray-600"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addHdmi(item.id)}
                      className="w-full border border-dashed border-[#8C867B] text-[#8C867B] p-3 rounded-lg text-sm flex items-center justify-center gap-1 mt-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={16} /> 接続機器を追加する
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {(activeTab === "家電" || activeTab === "家具") && (
          <button
            onClick={() => addCustomItem(activeTab)}
            className="w-full border-2 border-dashed border-[#DCD9D4] text-[#8C867B] p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors mt-4"
          >
            <Plus size={20} /> 項目を追加する
          </button>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-3 flex gap-3 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-50">
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="flex-1 border border-[#8C867B] text-[#8C867B] py-3 rounded-lg flex items-center justify-center gap-2 font-bold bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Save size={18} /> 一時保存
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-[2] bg-[#8C867B] text-white py-3 rounded-lg flex items-center justify-center gap-2 font-bold shadow-md hover:bg-[#7a746a] transition-colors disabled:opacity-50"
        >
          <Send size={18} /> {isSubmitting ? "送信中..." : "データを送信"}
        </button>
      </div>
    </div>
  );
}
