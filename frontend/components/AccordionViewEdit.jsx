import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  UIManager,
  LayoutAnimation,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import theme from "../styles/theme";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AccordionViewEdit = ({ sections, initialTags = {}, onTagChange }) => {
  const [activeSections, setActiveSections] = useState([]);
  const [selectedTags, setSelectedTags] = useState(initialTags);
  const [customInputs, setCustomInputs] = useState({});
  const [isAdding, setIsAdding] = useState({});
  const [addingTag, setAddingTag] = useState(false);

  useEffect(() => {
    onTagChange?.(selectedTags);
  }, [selectedTags]);

  const handleUpdateSections = (sections) => {
    LayoutAnimation.easeInEaseOut();
    setActiveSections(sections);
  };

  const handleSelectButton = (sectionId, tag) => {
    setSelectedTags((prev) => {
      const alreadySelected = prev[sectionId]?.includes(tag);
      const updated = {
        ...prev,
        [sectionId]: alreadySelected
          ? prev[sectionId].filter((t) => t !== tag)
          : [...(prev[sectionId] || []), tag],
      };
      return updated;
    });
  };

  const toggleAddInput = (sectionId) => {
    setIsAdding((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleCustomInputChange = (sectionId, text) => {
    setCustomInputs((prev) => ({
      ...prev,
      [sectionId]: text,
    }));
  };

  const handleAddCustomTag = (sectionId) => {
    if (!customInputs[sectionId]?.trim()) return;
    setAddingTag(true);
    handleSelectButton(sectionId, customInputs[sectionId]);

    setTimeout(() => {
      setCustomInputs((prev) => ({
        ...prev,
        [sectionId]: "",
      }));
      setIsAdding((prev) => ({
        ...prev,
        [sectionId]: false,
      }));
      setAddingTag(false);
    }, 300);
  };

  const getIconForSection = (title) => {
    switch (title) {
      case "Season":
        return <MaterialIcons name="sunny" size={20} color="#261BAC" />;
      case "Occasion":
        return <MaterialCommunityIcons name="party-popper" size={20} color="#FF9F0A" />;
      case "Category":
        return <FontAwesome6 name="shirt" size={18} color="#734230" />;
      case "Color":
        return <MaterialIcons name="palette" size={20} color="#FF9F0A" />;
      case "Style":
        return <MaterialIcons name="style" size={20} color="#E1289B" />;
      case "Fit":
        return <FontAwesome5 name="ruler-vertical" size={18} color="#096B91" />;
      default:
        return null;
    }
  };

  const renderHeader = (section, index, isActive) => (
    <TouchableOpacity
      style={[styles.header, !isActive && styles.headerBorder]}
      onPress={() => {
        Keyboard.dismiss();
        handleUpdateSections(isActive ? [] : [index]);
      }}
      activeOpacity={1}
    >
      <View style={styles.headerContent}>
        <View style={styles.iconStyle}>{getIconForSection(section.title)}</View>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
      <MaterialIcons
        name={isActive ? "keyboard-arrow-up" : "keyboard-arrow-down"}
        size={24}
        color="#666"
      />
    </TouchableOpacity>
  );

  const renderContent = (section, _, isActive) => {
    const existing = selectedTags[section.id] || [];
    const allButtons = [...section.buttons];

    existing.forEach((tag) => {
      if (!allButtons.some((btn) => btn.label === tag)) {
        allButtons.push({ label: tag });
      }
    });

    return (
      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          {allButtons.map((button, index) => {
            const isSelected = existing.includes(button.label);
            return (
              <TouchableOpacity
                key={`${section.id}-${button.label}-${index}`}
                style={[
                  styles.accordionButton,
                  isSelected ? styles.selectedButton : styles.unselectedButton,
                ]}
                onPress={() => handleSelectButton(section.id, button.label)}
                disabled={addingTag}
              >
                <Text style={isSelected ? styles.selectedText : styles.deselectedText}>
                  {button.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          {isAdding[section.id] ? (
            <View style={styles.customInputContainer}>
              <TextInput
                style={styles.customInput}
                value={customInputs[section.id] || ""}
                onChangeText={(text) => handleCustomInputChange(section.id, text)}
                placeholder="Enter custom tag"
                autoFocus
                editable={!addingTag}
              />
              <TouchableOpacity
                style={[styles.addButton, styles.confirmButton]}
                onPress={() => handleAddCustomTag(section.id)}
                disabled={addingTag}
              >
                {addingTag ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <MaterialIcons name="check" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.accordionButton, styles.addButton]}
              onPress={() => toggleAddInput(section.id)}
              disabled={addingTag}
            >
              <MaterialIcons name="add" size={20} color={theme.colors.text.dark} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Accordion
        sections={sections}
        activeSections={activeSections}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={handleUpdateSections}
        underlayColor="transparent"
        sectionContainerStyle={styles.sectionContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgrounds.primary,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  iconStyle: {
    width: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: theme.colors.backgrounds.primary,
  },
  headerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 16,
    color: theme.colors.text.dark,
  },
  content: {
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-start",
  },
  accordionButton: {
    height: 40,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginRight: 8,
  },
  selectedButton: {
    backgroundColor: theme.colors.buttonBackground.dark,
  },
  unselectedButton: {
    backgroundColor: theme.colors.buttonBackground.light,
  },
  selectedText: {
    color: theme.colors.text.lightest,
  },
  deselectedText: {
    color: theme.colors.text.dark,
  },
  addButton: {
    backgroundColor: theme.colors.buttonBackground.light,
    width: 40,
    paddingHorizontal: 0,
  },
  confirmButton: {
    backgroundColor: theme.colors.buttonBackground.dark,
    marginLeft: 8,
  },
  customInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  customInput: {
    height: 40,
    backgroundColor: theme.colors.buttonBackground.light,
    borderRadius: 20,
    paddingHorizontal: 16,
    minWidth: 120,
    color: theme.colors.text.dark,
  },
  sectionContainer: {
    marginBottom: 10,
  },
});

export default AccordionViewEdit;
