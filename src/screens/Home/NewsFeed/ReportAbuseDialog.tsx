import {Button, Modal, Radio, Text} from 'native-base';
import React, {useEffect, useState} from 'react';

const OPTIONS = [
  {value: 'HateSpeech', label: 'Hate Speech'},
  {value: 'Harassment/Threat', label: 'Harassment/Threat'},
  {value: 'Nudity/SexualActivity', label: 'Nudity/Sexual Activity'},
  {value: 'Violence/Self-Harm', label: 'Violence/Self-Harm'},
  {value: 'Terrorism', label: 'Terrorism'},
  {value: 'Drugs', label: 'Drugs'},
  {value: 'MaybeAScam', label: 'Maybe a scam'},
  {value: 'Spam', label: 'Spam'},
  {value: 'notLike', label: "I don't like it"},
];

interface IReportAbuseDialog {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (reason: string) => void;
}

function ReportAbuseDialog(props: IReportAbuseDialog) {
  const {open, handleClose, handleSubmit} = props;

  const [value, setValue] = useState<string>('');

  useEffect(() => {
    // Reset value on modal visibility change
    setValue('');
  }, [open]);

  return (
    <Modal isOpen={open} onClose={handleClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Report Abuse</Modal.Header>
        <Modal.Body>
          <Text>Are you sure you want to Report Abuse?</Text>
          <Radio.Group
            accessibilityLabel="favorite number"
            ml={2}
            name="myRadioGroup"
            value={value}
            onChange={nextValue => {
              setValue(nextValue);
            }}>
            {OPTIONS.map(i => (
              <Radio key={i.value} my={1} value={i.value}>
                {i.label}
              </Radio>
            ))}
          </Radio.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button colorScheme="blueGray" variant="ghost" onPress={handleClose}>
              Cancel
            </Button>
            <Button isDisabled={!value} onPress={() => handleSubmit(value)}>
              Confirm
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

export default ReportAbuseDialog;
