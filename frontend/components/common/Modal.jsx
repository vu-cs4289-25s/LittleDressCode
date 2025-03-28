import React from 'react';
import { Modal as RNModal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../../styles/theme';

const Modal = ({ isVisible, onClose, onApply, children }) => {
  return (
    <RNModal visible={isVisible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Apply Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>{children}</View>

          <TouchableOpacity style={styles.applyButton} onPress={onApply}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    backgroundColor: theme.colors.backgrounds.primary,
    width: '90%',
    borderRadius: 10,
    padding: theme.spacing.large,
    maxHeight: '85%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.medium
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.dark
  },
  close: {
    fontSize: 20,
    color: theme.colors.text.dark
  },
  body: {
    marginBottom: theme.spacing.large
  },
  applyButton: {
    backgroundColor: theme.colors.buttonBackground.dark,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: theme.borderRadius.default
  },
  applyText: {
    color: theme.colors.text.lightest,
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default Modal;
