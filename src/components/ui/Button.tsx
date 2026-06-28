import { Pressable, Text, type PressableProps } from "react-native";

type ButtonProps = PressableProps & {
  variant?: "primary" | "dark" | "ghost" | "icon";
  icon?: string;
  children?: string;
};

export function Button({ variant = "primary", children, className, ...props }: ButtonProps) {
  const bg =
    variant === "primary"
      ? "bg-[#E8175D]"
      : variant === "dark"
        ? "bg-[#1A1A1A]"
        : variant === "icon"
          ? "bg-white"
          : "bg-transparent border border-[#EBEBEB]";

  const textColor = variant === "primary" || variant === "dark" ? "text-white" : "text-[#222222]";

  const size = variant === "icon" ? "w-10 h-10 rounded-full" : "h-[52px] rounded-xl";

  return (
    <Pressable
      className={`items-center justify-center px-4 ${bg} ${size} ${className ?? ""}`}
      {...props}
    >
      {variant === "icon" ? (
        <Text className="text-2xl">{children}</Text>
      ) : (
        <Text className={`font-semibold ${textColor}`}>{children}</Text>
      )}
    </Pressable>
  );
}
