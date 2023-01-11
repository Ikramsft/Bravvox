import {Button, Input, Modal, Radio, Text} from 'native-base';
import React, {useEffect, useState} from 'react';

interface IReportAppealDialog {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (reason: string, otherValue: string) => void;
}

function ReportAppealDialog(props: IReportAppealDialog) {
  const [textValue, setTextValue] = React.useState('');

  const handleChange = (text: React.SetStateAction<string>) => setTextValue(text);

  // eslint-disable-next-line prefer-const
  let OPTIONS = [
    {value: 'NotHateSpeech', label: 'Not Hate Speech'},
    {value: 'NotHarassment/Threat', label: 'Not Harassment/Threat'},
    {value: 'NotNudity/SexualActivity', label: 'Not Nudity/Sexual Activity'},
    {value: 'NotViolence/Self-Harm', label: 'Not Violence/Self-Harm'},
    {value: 'NotTerrorism', label: 'Not Terrorism'},
    {value: 'NotDrugs', label: 'Not Depicting Drugs/Drug-use'},
    {value: 'NotMaybeAScam', label: 'Not a Scam'},
    {value: 'NotSpam', label: 'Not Spam'},
    {value: 'DoesNotViolateTermsConditions', label: 'Does Not Violate Terms & Conditions'},
    {value: 'custom', label: 'Other'},
  ];

  const {open, handleClose, handleSubmit} = props;

  const [value, setValue] = React.useState('');

  useEffect(() => {
    // Reset value on modal visibility change
    setValue('');
    setTextValue('');
  }, [open]);

  return (
    <Modal isOpen={open} onClose={handleClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Submit Appeal</Modal.Header>
        <Modal.Body>
          <Text>Feel this post has been unfairly suspended? {'\n'}Let us know why.</Text>

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
            {value === 'custom' && <Input
              maxWidth="300px"
              mx="3"
              placeholder="Enter Reason"
              value={textValue}
              w="75%"
              onChangeText={handleChange}
            />}
            
          </Radio.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button colorScheme="blueGray" variant="ghost" onPress={handleClose}>
              Cancel
            </Button>
            <Button isDisabled={!value} onPress={() => handleSubmit(value, textValue)}>
              Confirm
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

export default ReportAppealDialog;
