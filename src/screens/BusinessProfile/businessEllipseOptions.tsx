import {Actionsheet, theme, View} from 'native-base';
import React, {forwardRef} from 'react';
import {BusinessPageRoles, BusinessPageStatus} from './types/BusinessInterfaces';
import {useBusinessOperations} from './Queries/useBusinessOperations';

interface IBusinessEllipseProps {
  businessId: string;
  memberId: string;
  isOpen: boolean;
  role: string;
  status: string;
  onClose: () => void;
  onManageRoles: () => void;
  handleEditPress: () => void;
}

type IPressHandler = {
  onPickerSelect: () => void;
};

const {OWNER, ADMIN} = BusinessPageRoles;
const {DEACTIVATED} = BusinessPageStatus;

const BusinessEllipseOptions = forwardRef<IPressHandler, IBusinessEllipseProps>(
  (props: IBusinessEllipseProps, ref) => {
    const {businessId, memberId, onClose, role, status, isOpen, onManageRoles, handleEditPress} =
      props;

    const {handleDeActivateBusiness, handleReActivateBusiness, handleLeaveBusiness} =
      useBusinessOperations();
      
    const onClickDeActivate = () => {
      onClose();
      handleDeActivateBusiness(businessId);
    };

    const unfollowBusinessPage = () => {
      onClose();
      handleLeaveBusiness(businessId, memberId);
    };

    const onClickReActivate = () => {
      onClose();
      handleReActivateBusiness(businessId);
    };

    const onEditPress = () => {
      onClose();
      handleEditPress();
    };

    const openManageRoles = () => {
      onClose();
      onManageRoles();
    };

    return (
      <View height={0} ref={ref} width={0}>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            {role === OWNER && (
              <>
                <Actionsheet.Item py="3" onPress={onEditPress}>
                  Edit Business Pages
                </Actionsheet.Item>
                <Actionsheet.Item py="3" onPress={openManageRoles}>
                  Manage Roles
                </Actionsheet.Item>
              </>
            )}
            {status === DEACTIVATED ? (
              <Actionsheet.Item
                _text={{
                  color: theme.colors.gray[500],
                }}
                onPress={onClose}>
                Mute Business Page Activity
              </Actionsheet.Item>
            ) : (
              <Actionsheet.Item py="3" onPress={onClose}>
                Mute Business Page Activity
              </Actionsheet.Item>
            )}

            {role === OWNER || status === DEACTIVATED ? (
              <Actionsheet.Item
                _text={{
                  color: theme.colors.gray[500],
                }}
                py="3"
                onPress={onClose}>
                Unfollow Business Page
              </Actionsheet.Item>
            ) : (
              <Actionsheet.Item py="3" onPress={unfollowBusinessPage}>
                Unfollow Business Page
              </Actionsheet.Item>
            )}
            {(role === OWNER || role === ADMIN) && (
              <Actionsheet.Item py="3" onPress={onClickDeActivate}>
                De-activate Business Page
              </Actionsheet.Item>
            )}
            {status === DEACTIVATED && (
              <Actionsheet.Item py="3" onPress={onClickReActivate}>
                Reactivate Bussiness Page
              </Actionsheet.Item>
            )}
            <Actionsheet.Item py="3" onPress={openManageRoles}>
              Invite
            </Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
      </View>
    );
  },
);

export type BusinessEllipseOptionsHandle = React.ElementRef<typeof BusinessEllipseOptions>;
export default BusinessEllipseOptions;
