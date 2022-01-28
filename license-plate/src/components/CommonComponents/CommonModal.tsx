import React, { ReactElement } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { GREY } from "../../utils/constants";

type CommonModalProps = {
  showModal: boolean;
  setShowModal: (arg: boolean) => void;
  modalContent: ReactElement;
  heightOfModal?: number;
  onCloseFunction?: () => void;
};

const CommonModal = ({
  showModal,
  setShowModal,
  modalContent,
  heightOfModal = 300,
  onCloseFunction,
}: CommonModalProps) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          onCloseFunction ? onCloseFunction() : setShowModal(!showModal);
        }}
      >
        <View style={[styles.modalView, { height: heightOfModal }]}>
          {modalContent}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: GREY,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 200,
  },
});

export default CommonModal;
