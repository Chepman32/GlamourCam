import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../theme';
import { useInsightsStore, useSettingsStore } from '../store';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import type { Article } from '../types';

const InsightsScreen = () => {
  const theme = useTheme();
  const { articles, searchQuery, loadArticles, searchArticles, setSearchQuery } =
    useInsightsStore();
  const { settings } = useSettingsStore();

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadArticles(settings.isPremium);
  }, [settings.isPremium]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchArticles(query, settings.isPremium);
    } else {
      loadArticles(settings.isPremium);
    }
  };

  const handleArticlePress = (article: Article) => {
    if (article.premium && !settings.isPremium) {
      // Show premium upsell
      return;
    }
    setSelectedArticle(article);
    setIsModalVisible(true);
  };

  const renderArticleCard = ({ item }: { item: Article }) => (
    <Animated.View entering={FadeIn}>
      <Card onPress={() => handleArticlePress(item)} padding="md">
        <View style={styles.articleHeader}>
          <Text style={[styles.articleTitle, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          {item.premium && !settings.isPremium && (
            <View
              style={[
                styles.premiumBadge,
                { backgroundColor: theme.colors.warning },
              ]}
            >
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>

        <Text
          style={[styles.articlePreview, { color: theme.colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.body.substring(0, 100)}...
        </Text>

        <View style={styles.articleFooter}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text
              style={[styles.categoryText, { color: theme.colors.primary }]}
            >
              {item.category}
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Insights
        </Text>

        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search articles..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <FlatList
        data={articles}
        renderItem={renderArticleCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text
              style={[styles.emptyText, { color: theme.colors.textSecondary }]}
            >
              No articles found
            </Text>
          </View>
        )}
      />

      {/* Article Detail Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView
          style={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={[styles.closeButton, { color: theme.colors.primary }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {selectedArticle && (
              <>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                  {selectedArticle.title}
                </Text>

                <View style={styles.modalMeta}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: theme.colors.surface },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        { color: theme.colors.primary },
                      ]}
                    >
                      {selectedArticle.category}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.modalBody, { color: theme.colors.text }]}>
                  {selectedArticle.body}
                </Text>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
  },
  searchContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  searchInput: {
    fontSize: 16,
    paddingVertical: 12,
  },
  listContent: {
    padding: 24,
    paddingTop: 8,
  },
  separator: {
    height: 16,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  premiumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  articlePreview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 8,
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    padding: 24,
    paddingTop: 8,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  modalMeta: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  modalBody: {
    fontSize: 16,
    lineHeight: 28,
  },
});

export default InsightsScreen;
