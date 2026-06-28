import { Pressable, ScrollView, Text, StyleSheet } from "react-native";

type Suggestion = {
  emoji: string;
  name: string;
  reason: string;
};

export function SuggestionChips({ suggestions, onPress }: { suggestions: Suggestion[]; onPress: (name: string) => void }) {
  if (suggestions.length === 0) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.scroll}>
      {suggestions.map((item, i) => (
        <Pressable
          key={i}
          onPress={() => onPress(item.name)}
          style={st.chip}
        >
          <Text style={st.emoji}>{item.emoji}</Text>
          <Text style={st.label}>{item.name}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const st = StyleSheet.create({
  scroll: {
    paddingBottom: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  emoji: {
    fontSize: 15,
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    color: "#222222",
  },
});
