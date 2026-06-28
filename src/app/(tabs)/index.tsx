import { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";

import { useAppStore } from "@/store/useAppStore";

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState("");
  const foods = useAppStore((s) => s.foods);
  const isWeb = Platform.OS === "web";
  const maxWidth = isWeb ? Math.min(width, 640) : width;

  const titleSize = Math.min(width * 0.07, 28);
  const titleH = titleSize + 6;
  const topPad = 40;
  const headerAreaHeight = topPad + 16 + titleH + 20 + 52 + 8;

  const filtered = useMemo(
    () =>
      query.trim()
        ? foods.filter(
            (f) =>
              f.name.toLowerCase().includes(query.toLowerCase()) ||
              f.category.toLowerCase().includes(query.toLowerCase())
          )
        : foods,
    [query, foods]
  );

  return (
    <View style={s.screen}>
      <FlatList
        style={[s.listFrame, { maxWidth }]}
        contentContainerStyle={{
          paddingTop: headerAreaHeight,
          paddingBottom: 20,
          paddingHorizontal: 16,
        }}
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/food/${item.id}`)}
            style={({ pressed }) => [
              s.card,
              pressed && { opacity: 0.85 },
            ]}
          >
            <View style={s.cardRow}>
              <View style={s.emojiBox}>
                <Text style={s.emoji}>{item.emoji}</Text>
              </View>
              <View style={s.cardInfo}>
                <Text style={s.cardName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={s.cardCategory}>{item.category}</Text>
                <View style={s.microRow}>
                  <MicroBadge label="P" value={`${item.proteinPer100g}g`} />
                  <MicroBadge label="C" value={`${item.carbsPer100g}g`} />
                  <MicroBadge label="F" value={`${item.fatPer100g}g`} />
                </View>
              </View>
              <View style={s.calBox}>
                <Text style={s.calValue}>{item.caloriesPer100g}</Text>
                <Text style={s.calLabel}>CAL</Text>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <View style={s.emptyIconBox}>
              <Search size={28} color="#9CA3AF" />
            </View>
            <Text style={s.emptyTitle}>No foods found</Text>
            <Text style={s.emptySub}>Try a different search term</Text>
          </View>
        }
      />

<View style={[s.headerWrap, { paddingTop: topPad }]}>        
        <View style={[s.inner, { maxWidth }]}>
          <View style={s.header}>
            <Text style={[s.title, { fontSize: titleSize }]}>
              Search Food
            </Text>
            <View style={s.searchBar}>
              <Search size={20} color="#717171" />
              <TextInput
                placeholder="Search foods..."
                placeholderTextColor="#9CA3AF"
                style={s.searchInput}
                value={query}
                onChangeText={setQuery}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function MicroBadge({ label, value }: { label: string; value: string }) {
  return (
    <View style={mb.container}>
      <Text style={mb.label}>{label}</Text>
      <Text style={mb.value}>{value}</Text>
    </View>
  );
}

const mb = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8FA",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    marginRight: 3,
  },
  value: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },
});

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  listFrame: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  emojiBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F0F0F3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  emoji: {
    fontSize: 26,
  },
  cardInfo: {
    flex: 1,
    marginRight: 8,
  },
  cardName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222222",
  },
  cardCategory: {
    marginTop: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  microRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  calBox: {
    alignItems: "flex-end",
    marginRight: 0,
  },
  calValue: {
    marginBottom: 2,
    fontSize: 16,
    fontWeight: "700",
    color: "#222222",
  },
  calLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: "#717171",
  },
  headerWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    zIndex: 10,
    elevation: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  inner: {
    width: "100%",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    marginBottom: 20,
    fontWeight: "700",
    color: "#222222",
  },
  searchBar: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#222222",
  },
  empty: {
    alignItems: "center",
    paddingTop: 40,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F0F0F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222222",
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 15,
    color: "#717171",
  },
});
