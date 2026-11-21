import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Polyline, Line, Circle } from "react-native-svg";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";

type Screen = "Home" | "History" | "Alerts" | "Settings";
type Period = "24 Hours" | "7 Days" | "30 Days";

const tabs: Screen[] = ["Home", "History", "Alerts", "Settings"];

const periods: Period[] = ["24 Hours", "7 Days", "30 Days"];

const temperatureData: Record<Period, number[]> = {
  "24 Hours": [4.0, 4.2, 4.5, 4.1, 4.3, 4.2],
  "7 Days": [4.1, 4.4, 4.2, 4.0, 4.5, 4.3, 4.2],
  "30 Days": [4.0, 4.5, 4.2, 4.7, 4.1, 4.3],
};

const humidityData: Record<Period, number[]> = {
  "24 Hours": [62, 64, 63, 66, 65, 65],
  "7 Days": [63, 65, 67, 64, 66, 63, 65],
  "30 Days": [60, 63, 65, 68, 64, 65],
};

function SimpleChart({
  data,
  color,
  min,
  max,
}: {
  data: number[];
  color: string;
  min: number;
  max: number;
}) {
  const width = 300;
  const height = 150;
  const padding = 15;

  const points = data.map((value, index) => {
    const x =
      padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);

    const y =
      height - padding - ((value - min) / (max - min)) * (height - padding * 2);

    return { x, y };
  });

  const pointString = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <View style={{ marginTop: 20, alignItems: "center" }}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Horizontal grid lines */}
        {[0, 1, 2, 3].map((i) => (
          <Line
            key={i}
            x1={0}
            y1={padding + i * 40}
            x2={width}
            y2={padding + i * 40}
            stroke="#E2E8F0"
            strokeWidth={1}
          />
        ))}

        {/* Chart line */}
        <Polyline
          points={pointString}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={color}
            stroke="#FFFFFF"
            strokeWidth={2}
          />
        ))}
      </Svg>
    </View>
  );
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("Home");

  const [selectedPeriod, setSelectedPeriod] = useState<Period>("24 Hours");

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleReconnect = () => {
    Alert.alert(
      "Reconnect Device",
      "Device reconnection will be available after backend integration.",
      [{ text: "OK" }],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HOME SCREEN */}
        {activeScreen === "Home" && (
          <>
            <Text style={styles.title}>Smart Food Box</Text>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Temperature</Text>
              <Text style={styles.cardValue}>4.2°C</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Humidity</Text>
              <Text style={styles.cardValue}>65%</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Food Spoilage Risk</Text>
              <Text style={styles.riskValue}>Normal</Text>
              <Text style={styles.description}>
                Your food is stored under safe conditions.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Device Connection</Text>
              <Text style={styles.connected}>● Connected</Text>
              <Text style={styles.description}>Last updated 2 minutes ago</Text>
            </View>
          </>
        )}

        {/* HISTORY SCREEN */}
        {activeScreen === "History" && (
          <>
            <Text style={styles.title}>History</Text>

            <View style={styles.periodContainer}>
              {periods.map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setSelectedPeriod(period)}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.selectedPeriodButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.periodText,
                      selectedPeriod === period && styles.selectedPeriodText,
                    ]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.chartTitle}>Temperature History</Text>
              <Text style={styles.description}>Temperature (°C)</Text>

              <SimpleChart
                data={temperatureData[selectedPeriod]}
                color="#3B82F6"
                min={0}
                max={6}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.chartTitle}>Humidity History</Text>
              <Text style={styles.description}>Humidity (%)</Text>

              <SimpleChart
                data={humidityData[selectedPeriod]}
                color="#06B6D4"
                min={0}
                max={100}
              />
            </View>
          </>
        )}

        {/* ALERTS SCREEN */}
        {activeScreen === "Alerts" && (
          <>
            <Text style={styles.title}>Alerts</Text>

            <View style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertIcon}>⚠️</Text>
                <Text style={styles.alertTitle}>High Temperature</Text>
              </View>

              <Text style={styles.alertDescription}>
                The temperature has exceeded the safe storage range.
              </Text>

              <Text style={styles.alertTime}>Today, 10:30 AM</Text>
            </View>

            <View style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertIcon}>💧</Text>
                <Text style={styles.alertTitle}>High Humidity</Text>
              </View>

              <Text style={styles.alertDescription}>
                The humidity level is higher than the recommended range.
              </Text>

              <Text style={styles.alertTime}>Yesterday, 4:15 PM</Text>
            </View>
          </>
        )}

        {/* SETTINGS SCREEN */}
        {activeScreen === "Settings" && (
          <>
            <Text style={styles.title}>Settings</Text>

            {/* Device Information */}
            <View style={styles.settingsCard}>
              <Text style={styles.sectionTitle}>Device Information</Text>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Device Name</Text>
                <Text style={styles.settingValue}>Smart Food Box</Text>
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Device Status</Text>
                <Text style={styles.statusConnected}>● Connected</Text>
              </View>
            </View>

            {/* Notification Settings */}
            <View style={styles.settingsCard}>
              <Text style={styles.sectionTitle}>Notification Settings</Text>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Enable Notifications</Text>

                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{
                    false: "#CBD5E1",
                    true: "#93C5FD",
                  }}
                  thumbColor={notificationsEnabled ? "#2563EB" : "#F8FAFC"}
                />
              </View>
            </View>

            {/* Connection Settings */}
            <View style={styles.settingsCard}>
              <Text style={styles.sectionTitle}>Connection Settings</Text>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Connection Status</Text>
                <Text style={styles.statusConnected}>● Connected</Text>
              </View>

              <TouchableOpacity
                style={styles.reconnectButton}
                onPress={handleReconnect}
              >
                <Text style={styles.reconnectText}>Reconnect Device</Text>
              </TouchableOpacity>
            </View>

            {/* About Device */}
            <View style={styles.settingsCard}>
              <Text style={styles.sectionTitle}>About Device</Text>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Device Model</Text>
                <Text style={styles.settingValue}>Smart Food Storage Box</Text>
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Firmware Version</Text>
                <Text style={styles.settingValue}>1.0.0</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNav}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.navItem}
            onPress={() => setActiveScreen(tab)}
          >
            <Ionicons
              name={
                tab === "Home"
                  ? "home-outline"
                  : tab === "History"
                    ? "time-outline"
                    : tab === "Alerts"
                      ? "notifications-outline"
                      : "settings-outline"
              }
              size={24}
              color={activeScreen === tab ? "#2563EB" : "#94A3B8"}
            />

            <Text
              style={[
                styles.navText,
                activeScreen === tab && styles.activeNavText,
                { marginTop: 5 },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  scrollArea: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 28,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    minHeight: 130,
  },

  cardLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 12,
  },

  cardValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
  },

  riskValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#16A34A",
    marginBottom: 8,
  },

  connected: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#16A34A",
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },

  periodContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },

  periodButton: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  selectedPeriodButton: {
    backgroundColor: "#2563EB",
  },

  periodText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },

  selectedPeriodText: {
    color: "#FFFFFF",
  },

  chartTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },

  alertCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },

  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  alertIcon: {
    fontSize: 22,
    marginRight: 10,
  },

  alertTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1F2937",
  },

  alertDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 21,
    marginBottom: 12,
  },

  alertTime: {
    fontSize: 12,
    color: "#94A3B8",
  },

  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 18,
  },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },

  settingLabel: {
    fontSize: 13,
    color: "#64748B",
    flexShrink: 1,
  },

  settingValue: {
    fontSize: 13,
    color: "#1F2937",
    fontWeight: "500",
    textAlign: "right",
    flexShrink: 1,
  },

  statusConnected: {
    fontSize: 13,
    color: "#16A34A",
    fontWeight: "600",
  },

  reconnectButton: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 6,
  },

  reconnectText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 16,
    paddingBottom: 28,
    paddingHorizontal: 8,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
  },

  navText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },

  activeNavText: {
    color: "#2563EB",
    fontWeight: "bold",
  },
});
