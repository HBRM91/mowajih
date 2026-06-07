interface Props {
  role: "user" | "assistant";
  children: React.ReactNode;
}

export default function ChatBubble({ role, children }: Props) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
          role === "user"
            ? "bg-tawjih-600 text-white rounded-br-md"
            : "bg-slate-100 text-slate-800 rounded-bl-md"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
