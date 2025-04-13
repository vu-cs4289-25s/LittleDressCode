import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  Keyboard,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import theme from "../styles/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TextButton from "./common/TextButton";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AccordionView = ({ sections, selectedButtons, onSelectButton }) => {
  const [activeSections, setActiveSections] = useState([]);
  const [customInputs, setCustomInputs] = useState({});
  const [isAdding, setIsAdding] = useState({});
  const [addingTag, setAddingTag] = useState(false);

  const handleUpdateSections = (sections) => {
    LayoutAnimation.easeInEaseOut();
    setActiveSections(sections);
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
    onSelectButton(sectionId, customInputs[sectionId]);

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
    }, 500);
  };

  const getIconForSection = (title) => {
    switch (title) {
      case "Season":
        return <MaterialIcons name="sunny" color="#261BAC" size={20} />;
      case "Occasion":
        return (
          <MaterialCommunityIcons
            name="party-popper"
            size={20}
            color="#FF9F0A"
          />
        );
      case "Category":
        return <FontAwesome6 name="shirt" color="#734230" size={18} />;
      case "Color":
        return <MaterialIcons name="palette" color="#FF9F0A" size={20} />;
      case "Style":
        return <MaterialIcons name="style" color="#E1289B" size={20} />;
      case "Fit":
        return <MaterialIcons name="accessibility" color="#096B91" size={20} />;
      case "Other filters":
        return <MaterialIcons name="cloud" color="#CCCCCC" size={20} />;
      default:
        return null;
    }
  };

  const renderHeader = (section, index, isActive) => {
    const selected = selectedButtons[section.id] || [];
    const selectedText = selected.length > 0 ? selected.join(", ") : null;
  
    return (
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
        <View style={styles.headerRight}>
          {selectedText && !isActive && (
            <Text style={styles.selectedSummary} numberOfLines={1}>
              {selectedText}
            </Text>
          )}
          <MaterialIcons
            name={isActive ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={24}
            color="#666"
          />
        </View>
      </TouchableOpacity>
    );
  };
  

  const renderContent = (section, _, isActive) => {
    const allButtons = [...section.buttons];

    selectedButtons[section.id]?.forEach((tag) => {
      if (!section.buttons.some((btn) => btn.label === tag)) {
        allButtons.push({ label: tag });
      }
    });

    return (
      <View
        style={[styles.content, isActive ? styles.expanded : styles.collapsed]}
      >
        <View style={styles.buttonContainer}>
          {allButtons.map((button, index) => {
            const isSelected = selectedButtons[section.id]?.includes(
              button.label
            );

            return (
              <View key={index}>
                <TextButton
                  title={button.label}
                  size="small"
                  color={isSelected ? "dark" : "light"}
                  onPress={() => onSelectButton(section.id, button.label)}
                />
              </View>
            );
          })}

          {isAdding[section.id] ? (
            <View style={styles.customInputContainer}>
              <TextInput
                style={styles.customInput}
                value={customInputs[section.id] || ""}
                onChangeText={(text) =>
                  handleCustomInputChange(section.id, text)
                }
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
              <MaterialIcons
                name="add"
                size={12}
                color={theme.colors.text.dark}
              />
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
    gap: 10,
  },
  iconStyle: {
    width: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
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
    paddingTop: 0,
    backgroundColor: theme.colors.backgrounds.primary,
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
    minWidth: 20,
    maxWidth: "auto",
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
    width: 30,
    height: 30,
    paddingHorizontal: 0,
  },
  confirmButton: {
    backgroundColor: theme.colors.buttonBackground.dark,
    borderRadius: 100,
    alignContent: "cemter",
    marginLeft: 8,
    justifyContent: "cennter"
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    maxWidth: "50%",
  },
  
  selectedSummary: {
    color: "#007AFF",
    fontSize: 14,
    maxWidth: 120,
    overflow: "hidden",
  },
});

export default AccordionView;
