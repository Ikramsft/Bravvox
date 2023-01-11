/**
 * @format
 */
import React from 'react';
import {Text, View, ChevronLeftIcon, useTheme} from 'native-base';
import SafeTouchable from '../../../components/SafeTouchable';

interface IStepHeaderProps {
  showStep?: boolean;
  onlyBack?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  step?: string;
  totalStep?: string;
}

function StepHeader(props: IStepHeaderProps) {
  const {showStep, step, totalStep, onlyBack, showBack, onBack} = props;

  const {colors} = useTheme();

  if (onlyBack) {
    return (
      <View mt={10}>
        <SafeTouchable disabled={!onBack} onPress={onBack}>
          <View height={25} width={25}>
            <ChevronLeftIcon ml={-3} size="20px" />
          </View>
        </SafeTouchable>
      </View>
    );
  }

  if (showStep) {
    return (
      <View mb={3} mt={10}>
        <SafeTouchable disabled={!onBack} onPress={onBack}>
          <View alignItems="center" flexDirection="row">
            {showBack && <ChevronLeftIcon ml={-3} size="20px" />}
            <Text color={colors.black[40]} fontWeight="normal">
              Step {step} of {totalStep}
            </Text>
          </View>
        </SafeTouchable>
      </View>
    );
  }

  return null;
}

StepHeader.defaultProps = {
  onlyBack: false,
  showStep: true,
  showBack: true,
  onBack: null,
  step: '1',
  totalStep: '5',
};

export default StepHeader;
