import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { AMPEL_CONFIG, type AmpelStatus, type CategoryScore } from "@/lib/scoring";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 11, color: "#4b5563", marginBottom: 20 },
  scoreBox: { padding: 16, borderRadius: 6, marginBottom: 20, color: "#ffffff" },
  scoreLabel: { fontSize: 10, textTransform: "uppercase", marginBottom: 4 },
  scoreValue: { fontSize: 28, fontWeight: 700, marginBottom: 4 },
  scoreText: { fontSize: 12 },
  sectionTitle: { fontSize: 14, fontWeight: 700, marginBottom: 10, marginTop: 16 },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  todoItem: { flexDirection: "row", marginBottom: 6 },
  todoIndex: { width: 20, fontWeight: 700 },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, fontSize: 9, color: "#9ca3af" },
});

const AMPEL_HEX: Record<AmpelStatus, string> = {
  gruen: "#10b981",
  gelb: "#f59e0b",
  rot: "#ef4444",
};

export function NIS2ReportDocument({
  companyName,
  score,
  status,
  byCategory,
  todos,
  generatedAt,
}: {
  companyName: string;
  score: number;
  status: AmpelStatus;
  byCategory: CategoryScore[];
  todos: string[];
  generatedAt: string;
}) {
  const config = AMPEL_CONFIG[status];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>NIS2-Check Ergebnis</Text>
        <Text style={styles.subtitle}>
          {companyName} — erstellt am {generatedAt}
        </Text>

        <View style={[styles.scoreBox, { backgroundColor: AMPEL_HEX[status] }]}>
          <Text style={styles.scoreLabel}>Ampel: {config.label}</Text>
          <Text style={styles.scoreValue}>{score} / 100</Text>
          <Text style={styles.scoreText}>{config.text}</Text>
        </View>

        <Text style={styles.sectionTitle}>Kategorien im Überblick</Text>
        {byCategory.map((cat) => (
          <View key={cat.category} style={styles.categoryRow}>
            <Text>{cat.category}</Text>
            <Text>{cat.score}%</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Deine To-Dos</Text>
        {todos.map((todo, index) => (
          <View key={todo} style={styles.todoItem}>
            <Text style={styles.todoIndex}>{index + 1}.</Text>
            <Text>{todo}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          Dieser Report wurde automatisch mit dem NIS2-Checker erstellt und ersetzt keine
          rechtliche Beratung.
        </Text>
      </Page>
    </Document>
  );
}
