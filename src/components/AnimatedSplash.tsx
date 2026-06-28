import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const FOOD_EMOJIS = ["🍽️", "🥗", "🍎", "🥩"];

export default function AnimatedSplash({ onDone }: { onDone: () => void }) {
  const emojiIndex = useRef(0);
  const emojiScale = useRef(new Animated.Value(0.3)).current;
  const emojiRotate = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(30)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const emojiFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotate = emojiRotate.interpolate({
      inputRange: [0, 1],
      outputRange: ["-15deg", "15deg"],
    });

    Animated.sequence([
      // Phase 1: emoji pops in with bounce
      Animated.parallel([
        Animated.timing(emojiFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(emojiScale, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(emojiRotate, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(emojiRotate, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]),
      // Phase 2: title slides in
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslate, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Phase 3: tagline fades in
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Phase 4: hold for a moment
      Animated.delay(800),
      // Phase 5: crossfade to next emoji
      Animated.parallel([
        Animated.timing(emojiFade, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(taglineOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onDone();
    });
  }, []);

  return (
    <View style={s.root}>
      <View style={s.content}>
        <Animated.View
          style={[
            s.emojiWrap,
            {
              opacity: emojiFade,
              transform: [
                { scale: emojiScale },
                {
                  rotate: emojiRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["-15deg", "15deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={s.emoji}>{FOOD_EMOJIS[0]}</Text>
        </Animated.View>

        <Animated.Text
          style={[
            s.title,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslate }],
            },
          ]}
        >
          FuelGap
        </Animated.Text>

        <Animated.Text style={[s.tagline, { opacity: taglineOpacity }]}>
          Track your macros
        </Animated.Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#E8175D",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  content: {
    alignItems: "center",
  },
  emojiWrap: {
    marginBottom: 20,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  tagline: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255,255,255,0.75)",
  },
});
