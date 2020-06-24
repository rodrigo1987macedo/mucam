import React, { useState } from "react";
import { Modal } from "react-responsive-modal";
import Buton from "../common/Button";
import styled from "styled-components";

const BaseModal = styled.div`
  height: ${props => (props.small ? "260px" : "80vh")};
  padding: 5px;
  width: 700px;
  @media (max-width: 800px) {
    width: 400px;
  }
  @media (max-width: 400px) {
    width: 240px;
  }
`;

function PopUp({
  children,
  buttonText,
  secondary,
  onClose,
  onOpen,
  small,
  buttonIcon
}) {
  const [open, setOpen] = useState(false);

  function togglePopUp() {
    if (onOpen && !open) {
      onOpen();
    }
    if (onClose && open) {
      onClose();
    }
    setOpen(!open);
  }

  return (
    <>
      <Buton
        onClick={togglePopUp}
        text={buttonText}
        secondary={secondary}
        icon={buttonIcon}
      />
      <Modal open={open} onClose={togglePopUp} center>
        <BaseModal small={small}>{children}</BaseModal>
      </Modal>
    </>
  );
}

export default PopUp;
