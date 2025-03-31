import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, UIManager, Platform } from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../styles/theme";

// Enable LayoutAnimation for smooth transitions on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AccordionView = ({ title = "The Basics", sections, selectedButtons, onSelectButton }) => {
  const [activeSections, setActiveSections] = useState([]);

  const handleUpdateSections = (sections) => {
    LayoutAnimation.easeInEaseOut();
    setActiveSections(sections);
  };

  const renderHeader = (section, index, isActive) => (
    <TouchableOpacity
      style={[styles.header, !isActive && styles.headerBorder]}
      onPress={() => handleUpdateSections(isActive ? [] : [index])}
      activeOpacity={1} // Prevents opacity change
    >
      <View>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
      <MaterialIcons name={isActive ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="#666" />
    </TouchableOpacity>
  );
  
  
  const renderContent = (section, _, isActive) => (
    <View style={[styles.content, isActive ? styles.expanded : styles.collapsed]}>
      <View style={styles.buttonContainer}>
        {section.buttons?.map((button, index) => {
          const isSelected = selectedButtons[section.id]?.includes(button.label);
  
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.accordionButton,
                isSelected ? styles.selectedButton : styles.unselectedButton,
              ]}
              onPress={() => onSelectButton(section.id, button.label)}
            >
              <Text style={isSelected ? styles.selectedText : styles.deselectedText}>{button.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
  

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}


      <Accordion
        sections={sections}
        activeSections={activeSections}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={handleUpdateSections}
        underlayColor="transparent"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgrounds.primary,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
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
    backgroundColor: theme.colors.backgrounds.primary,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Allows buttons to wrap into rows
    gap: 8, // spacing between rows
    justifyContent: "flex-start",
    width: "100%",
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
    alignSelf: "flex-start", // resize dynamically
    marginRight: 8, // Space between buttons in the same row
    
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
});

export default AccordionView;
